
(function() {

var generate_triangle_action;

Plugin.register('triangle_generator', 
	{
		title: 'Triangle Generator',
	    icon: 'change_history',
	    author: 'Sleepyhead08',
	    description: 'Generates triangles in a step-like pattern',
	    version: '1.0.0',
	    variant: 'both',

		onload() {
			generate_triangle_action = new Action({
				id: 'triangle_generator_action',
				name: 'Generate Triangle',
				icon: 'change_history',
				category: 'filter',
				click: function(ev) {
					getTriangleWindow().show();
				}
			});

			MenuBar.addAction(generate_triangle_action, 'filter');
		},
		onunload() {
			this.onuninstall();
		},
		onuninstall() {
			generate_triangle_action.delete();
		}
	})


function getTriangleWindow(){

    var triangle_window = new Dialog({
        id: 'triangle_selector', 
        title: 'Triangle Generator', 
        form: {
        	triangle_shape: {label: 'Select triangle', type: 'select', options: {i_triangle: 'Isoceles Triangle', r_triangle: 'Right Triangle', pyramid: 'Pyramid'}, default: 'i_triangle'},
        	origin_x: {label: 'Origin X', type: 'number', value: 8},
        	origin_y: {label: 'Origin Y', type: 'number', value: 0},
        	origin_z: {label: 'Origin Z', type: 'number', value: 8},
        	height: {label: 'Height', type: 'number', value: 1},
        	width: {label: 'Width', type: 'number', value: 0.1},
        	angle: {label: 'Angle', type: 'number', value: 45, min: 0, max: 90},
        	granularity: {label: 'Granularity', type: 'number', value: 0.1}
        },
		onConfirm: function(formData) {
			//generate_triangle(formData);
			determine_shape(formData.triangle_shape, formData.origin_x, formData.origin_y, formData.origin_z, formData.height, formData.width, formData.angle, formData.granularity);
			this.hide();
		},
		onCancel: function(formData) {
			this.hide();
		}
	});
	
	return triangle_window;
}



// Determines which triangle to generate and generates it.
function determine_shape(triangle_shape, origin_x, origin_y, origin_z, height, width, angle, granularity) {
    Undo.initEdit({outliner: true, elements: [], selection: true});

    // Parse all of the input strings into floats.
    origin_x = parseFloat(origin_x);
    origin_y = parseFloat(origin_y);
    origin_z = parseFloat(origin_z);
    origin = [origin_x, origin_y, origin_z];
    height = parseFloat(height);
    width = parseFloat(width);
    angle = parseFloat(angle);
    granularity = parseFloat(granularity);

    // Make sure the origin is valid.
    if ((origin_x > 32 || origin_x < -16 || origin_y > 32 || origin_y < -16 || origin_z > 32 || origin_z < -16) && Format.canvas_limit) {
        var error_window = new Dialog(
        	{
            	id: 'error_window', 
            	title: 'Error', 
            	lines: [
	                'Error occurred:\n',
	                'Your triangle would go outside of the restricted area.\n',
		            'Please make sure to keep the triangle within the canvas.'
	            ],
	            onConfirm() {
	                error_window.hide();
	            }
        	});
        error_window.cancelEnabled = false;
        error_window.show();
        return;
    }

    //Make sure the granularity is valid.
    if (granularity <= 0) {
        var error_window = new Dialog(
        	{
            	id: 'error_window', 
            	title: 'Error', 
            	lines: [
	                'Error occurred:\n',
	                'Granularity must be greater than zero.\n'
	            ],
	            onConfirm() {
	                error_window.hide();
	            }
        	});
        error_window.cancelEnabled = false;
        error_window.show();
        return;
    }

    //Make sure the angle is between 0 and 90 degrees.
    if (angle <= 0 || angle >= 90) {
        var error_window = new Dialog(
        	{
            	id: 'error_window', 
            	title: 'Error', 
            	lines: [
	                'Error occurred:\n',
	                'Angle must be between 0 and 90 degrees (exclusive).\n'
	            ],
	            onConfirm() {
	                error_window.hide();
	            }
        	});
        error_window.cancelEnabled = false;
        error_window.show();
        return;
    }

    // Isoceles triangle.
    if (triangle_shape === 'i_triangle')
    {
        var horizontal = height / Math.tan((90 - angle) * Math.PI / 180);

        // Make sure the height/width are valid.
        if ((origin_y > 32 - height || horizontal > 32 - origin_x || horizontal > 16 + origin_x) && Format.canvas_limit) {
	        var error_window = new Dialog(
	        	{
	            	id: 'error_window', 
	            	title: 'Error', 
	            	lines: [
		                'Error occurred:\n',
		                'Your triangle would go outside of the restricted area.\n',
		                'Please make sure to keep the triangle within the canvas.'
		            ],
		            onConfirm() {
		                error_window.hide();
		            }
	        	});
	        error_window.cancelEnabled = false;
	        error_window.show();
	        return;
        }

        // Generate the triangle.
        angled_point = generatePoint(height, width, 90 - angle, 'x', 0, granularity, 0);
        angled_point.openUp().select();
    }

    // Right triangle.
    if (triangle_shape === 'r_triangle')
    {
        var horizontal = height / Math.tan((90 - angle) * Math.PI / 180);

        // Make sure the height/width are valid.
        if ((origin_y > 32 - height || horizontal > 16 + origin_x) && Format.canvas_limit) {
	        var error_window = new Dialog(
	        	{
	            	id: 'error_window', 
	            	title: 'Error', 
	            	lines: [
		                'Error occurred:\n',
		                'Your triangle would go outside of the restricted area.\n',
		                'Please make sure to keep the triangle within the canvas.'
		            ],
		            onConfirm() {
		                error_window.hide();
		            }
	        	});
	        error_window.cancelEnabled = false;
	        error_window.show();
            return;
        }

        // Generate the triangle.
        angled_point = generatePoint(height, width, 90 - angle, 'x', 0, granularity, 1);
        angled_point.openUp().select();
    }

    // Pyramid.
    if (triangle_shape === 'pyramid')
    {
        var angle_steps = angle / 22.5;
        var new_angle = Math.atan(1 / Math.sin(angle * Math.PI / 180)) / Math.PI * 180;

        var real_height = height;
        height = height / Math.cos(angle * Math.PI / 180);
        var horizontal = height * Math.sin(angle * Math.PI / 180);

        var xOffset = granularity / 2 * Math.cos(angle * Math.PI / 180);
        var yOffset = granularity / 2 * Math.sin(angle * Math.PI / 180);

        // Make sure the angle is a full step of 22.5 degrees.
        if (Math.round(angle_steps) != angle_steps) {
	        var error_window = new Dialog(
	        	{
	            	id: 'error_window', 
	            	title: 'Error', 
	            	lines: [
		                'Error occurred:\n',
		                'Pyramids require angles to be a multiple of 22.5 between 0 and 90 (exclusive).',
		            ],
		            onConfirm() {
		                error_window.hide();
		            }
	        	});
	        error_window.cancelEnabled = false;
	        error_window.show();
            return;
        }
        // Make sure the height/width are valid.
        if ((origin_y > 32 - height - yOffset || horizontal > 32 - origin_x - xOffset || horizontal > 16 + origin_x - xOffset || horizontal > 32 - origin_z - xOffset || horizontal > 16 + origin_z - xOffset) && Format.canvas_limit) {
	        var error_window = new Dialog(
	        	{
	            	id: 'error_window', 
	            	title: 'Error', 
	            	lines: [
		                'Error occurred:\n',
		                'Your triangle would go outside of the restricted area.\n',
		                'Please make sure to keep the triangle within the canvas.'
		            ],
		            onConfirm() {
		                error_window.hide();
		            }
	        	});
	        error_window.cancelEnabled = false;
	        error_window.show();
            return;
        }

        // Generate the pyramid walls.
        angled_point1 = generatePoint(height, granularity, new_angle, 'x', angle, granularity, 0);
        angled_point2 = generatePoint(height, granularity, new_angle, 'x', - angle, granularity, 0);

        angled_point3 = generatePoint(height, granularity, new_angle, 'x', angle, granularity, 0);
        angled_point4 = generatePoint(height, granularity, new_angle, 'x', - angle, granularity, 0);
        angled_point3.forEachChild(function(child){ 
            child.roll(1, 1);
        });
        angled_point4.forEachChild(function(child){ 
            child.roll(1, 1);
        });

        // Add the pyramid walls to a group.
        pyramid = new Group('pyramid').init();
        angled_point1.addTo(pyramid);
        angled_point2.addTo(pyramid);
        angled_point3.addTo(pyramid);
        angled_point4.addTo(pyramid);

        // Generate the base of the pyramid.
        buildCube(origin[0] - horizontal + xOffset,origin[1] + real_height,origin[2] - horizontal + xOffset,origin[0] + horizontal - xOffset,origin[1] + real_height + yOffset,origin[2] + horizontal - xOffset,origin,'x',0,pyramid)


        Canvas.updateAll();
        pyramid.openUp().select();
    }


    //edit
    Undo.finishEdit('Generated triangle', {outliner: true, elements: selected, selection: true});
    Blockbench.showMessage('Generated '+triangle_shape+' with height '+height);

}

// Builds a triangle.
function generatePoint(height, width, angle, axis, tilt, granularity, triType) {

    angled_point = new Group('triangle').init();
    triType = parseInt(triType);

    cubeCount = height / granularity;
    currentCubeIndex = 0;

    var f = granularity / Math.tan(angle * Math.PI / 180);

    // Generate each individual cube.
    while (currentCubeIndex < cubeCount - 1)
    {

        fromX = origin[0] - f / 2 - currentCubeIndex * f;
        fromY = currentCubeIndex * granularity + origin[1];
        fromZ = origin[2] - width / 2;
        toX = origin[0] + f / 2 + currentCubeIndex * f;
        toY = (currentCubeIndex + 1) * granularity + origin[1];
        toZ = origin[2] + width / 2;

        if (triType == 1) {
            toX = origin[0];
        }

        buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,tilt,angled_point);

        currentCubeIndex++;
    }

    // Last cube makes up the difference if height / granularity is not an integer.
    fromX = origin[0] - f / 2 - currentCubeIndex * f;
    fromY = currentCubeIndex * granularity + origin[1];
    fromZ = origin[2] - width / 2;
    toX = origin[0] + f / 2 + currentCubeIndex * f;
    toY = height + origin[1];
    toZ = origin[2] + width / 2;

    if (triType == 1) {
        toX = origin[0];
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,tilt,angled_point);

    Canvas.updateAll();

    return angled_point;
}

// Builds a single cube.
function buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,rotation,group) {
    var iteration = 0;
    while (rotation < -90) {
        rotation += 90;
        iteration--;
    }
    while (rotation > 90) {
        rotation -= 90;
        iteration++;
    }
    var cube = new Cube({
        name: group.name,
        from: [fromX, fromY, fromZ],
        to: [toX, toY, toZ],
        rotation: {origin: origin.slice(), axis: axis, angle: rotation}
    }).addTo(group).init()
}


})()

