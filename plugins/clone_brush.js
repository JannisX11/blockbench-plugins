var plugin_data = {
	id: 'clone_brush',
	title: 'Clone Brush',
	icon: 'account_balance_wallet',
	author: 'JannisX11',
	description: 'Clone Cubes',
	version: '1.0.0',
	variant: 'both'
}

var brush_template;

Toolbox.add(
	new Tool({
		id: 'clone_brush',
		name: 'Clone Brush',
		icon: 'fa-edit',
		transformerMode: 'hidden',
    	category: 'tools',


				selectFace: true,
				toolbar: 'transform',
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
	            } else {

	            	var new_cubes = []
	            	Undo.initEdit({cubes: new_cubes})

	                var from = [
				        selected[0].from[0]+0,
				        selected[0].from[1]+0,
				        selected[0].from[2]+0
				    ]
				    var canvas_grid = canvasGridSize()
				    var sizes = [canvas_grid, canvas_grid, canvas_grid]
				    if (brush_template && brush_template.type === 'cube') {
				        sizes = brush_template.size()
				    }
				    switch (main_uv.face) {
				        case 'north':
				        from[2] -= sizes[2];
				        break;
				        case 'south':
				        from[2] += sizes[2];
				        break;
				        case 'west':
				        from[0] -= sizes[0];
				        break;
				        case 'east':
				        from[0] += sizes[0];
				        break;

				        case 'up':
				        from[1] += sizes[1];
				        break;
				        case 'down':
				        from[1] -= sizes[1];
				        break;
				    }

				    var base_cube = new Cube()
				    if (typeof brush_template === 'object') {
				        base_cube.extend(brush_template).addTo(brush_template.parent)
				    }
				    base_cube.uuid = guid()

				    base_cube.to = [
				        from[0]+base_cube.size(0),
				        from[1]+base_cube.size(1),
				        from[2]+base_cube.size(2)
				    ]
				    if (isCanvasRestricted()) {
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
				    selected.length = 0
				    elements.push(base_cube)
				    new_cubes.push(base_cube)
				    selected.push(base_cube)
				    Canvas.updateSelected()
				    Undo.finishEdit('clone_brush')
	            }
	        }
		}
	})
)

onUninstall = function() {
	Toolbox.remove('clone_brush')
}