(function() {

var brush_template, clone_brush_tool;

Plugin.register('clone_brush', {
	title: 'Clone Brush',
	author: 'JannisX11',
	icon: 'account_balance_wallet',
	description: 'Clone Cubes',
	version: '1.1.0',
	variant: 'both',
	onload() {
		clone_brush_tool = new Tool({
			id: 'clone_brush',
			name: 'Clone Brush',
			description: 'Tool to clone and place cubes against other cubes',
			icon: 'fa-edit',
			transformerMode: 'hidden',
	    	category: 'tools',
			selectFace: true,
			alt_tool: 'move_tool',
			modes: ['edit'],
			onSelect: function() {
				brush_template = 'select'
			},
			onCanvasClick: function(data) {
				if (data.event.shiftKey === false) {
		            if (brush_template == 'select') {
		                brush_template = data.cube
		                $('#preview').css('cursor', 'url(assets/brush.png), auto')
		            } else if (brush_template instanceof Cube) {

		            	var new_cubes = []
		            	Undo.initEdit({elements: new_cubes})

		                var from = [
					        Cube.selected[0].from[0]+0,
					        Cube.selected[0].from[1]+0,
					        Cube.selected[0].from[2]+0
					    ]
					    var canvas_grid = canvasGridSize()
					    var sizes = [canvas_grid, canvas_grid, canvas_grid]
					    if (brush_template && brush_template.type === 'cube') {
					        sizes = brush_template.size()
					    }
					    switch (main_uv.face) {
					        case 'north':   from[2] -= sizes[2] + Cube.selected[0].inflate + brush_template.inflate; break;
					        case 'south': 	from[2] += sizes[2] + Cube.selected[0].inflate + brush_template.inflate; break;
					        case 'west': 	from[0] -= sizes[0] + Cube.selected[0].inflate + brush_template.inflate; break;
					        case 'east': 	from[0] += sizes[0] + Cube.selected[0].inflate + brush_template.inflate; break;

					        case 'up': 		from[1] += sizes[1] + Cube.selected[0].inflate + brush_template.inflate; break;
					        case 'down': 	from[1] -= sizes[1] + Cube.selected[0].inflate + brush_template.inflate; break;
					    }

					    var base_cube = new Cube(brush_template)

					    base_cube.to = [
					        from[0]+base_cube.size(0),
					        from[1]+base_cube.size(1),
					        from[2]+base_cube.size(2)
					    ]
					    if (Format.canvas_limit) {
					        var i = 0
					        while (i < 3) {
					            if (base_cube.to[i] > 32 || from[i] < -16) return;
					            i++;
					        }
					    }
					    var number = base_cube.name.match(/[0-9]+$/)
					    if (number) {
					        number = parseInt(number[0])
					        base_cube.name = base_cube.name.split(number).join(number+1)
					    }
					    base_cube.from = from
					    base_cube.addTo(brush_template.parent).init()
					    new_cubes.push(base_cube);
					    base_cube.select()
					    Undo.finishEdit('clone_brush')
		            }
		        }
			}
		});
		Toolbox.add(clone_brush_tool);
	},
	onunload() {
		clone_brush_tool.delete();
	}
})

})()
