var plugin_data = {
    id: 'triangle_generator',
    title: 'Triangle Generator',
    icon: 'pages',
    author: 'Sleepyhead08',
    description: 'Generates triangles.',
    version: '1.0.0',
    min_version: '3.0.2',
    variant: 'both'
};

(function() {

var triangle_shape_list = `
        <select style="color:var(--color-text), class=" id="triangle_shape">
        <option selected=true value="i_triangle"> Isoceles Triangle </option>
        <option value="r_triangle"> Right Triangle </option>
        <option value="pyramid"> Pyramid </option>
    </select>`;

Blockbench.addMenuEntry('Generate triangle','pages', function(){

    // Check if the user is in the right mode.
    if (!Format.rotate_cubes) {
        Blockbench.showMessageBox({
            title: 'Incompatible Format',
            message: 'This plugin only works in formats that support cube rotations.'
        })
        return;
    }
    else {
        triangleWindow();
    }
});

// Triangle selection window.
function triangleWindow() {
    var triangle_window = new Dialog({
        title: 'Triangle Generator', id: 'triangle_selector', lines: [
            'Select triangle:' + triangle_shape_list +
            '<br\>Origin: <br\><input value=8 type="number" style="background-color:var(--color-back)" id="origin_x"> <br\><input value=0 type="number" style="background-color:var(--color-back)" id="origin_y"> <br\><input value=8 type="number" style="background-color:var(--color-back)" id="origin_z"> ' + 
            '<br\>Height: <input value=1 type="number" style="background-color:var(--color-back)" id="height">' + 
            '<br\>Width: <input value=0.1 type="number" style="background-color:var(--color-back)" id="width">' +
            '<br\>Angle: <input value=45 type="number" style="background-color:var(--color-back)" id="angle">'  +
            '<br\>Granularity: <input value=0.1 type="number" style="background-color:var(--color-back)" id="granularity"><br\>' 
        ], draggable: true, onConfirm() {
            triangle_window.hide();
            generate_triangle();
        }
    });
    triangle_window.show();
    if (localStorage.getItem("triangle_shape") != undefined) {
        document.getElementById("triangle_shape").selectedIndex = localStorage.getItem("triangle_shape");
        $('.dialog#triangle_selector input#origin_x').val(localStorage.getItem("origin_x"));
        $('.dialog#triangle_selector input#origin_y').val(localStorage.getItem("origin_y"));
        $('.dialog#triangle_selector input#origin_z').val(localStorage.getItem("origin_z"));
        $('.dialog#triangle_selector input#height').val(localStorage.getItem("height"));
        $('.dialog#triangle_selector input#width').val(localStorage.getItem("width"));
        $('.dialog#triangle_selector input#angle').val(localStorage.getItem("angle"));
        $('.dialog#triangle_selector input#granularity').val(localStorage.getItem("granularity"));
    }
}

function generate_triangle() {

    // Get all of the input.
    var triangle_shape = $('.dialog#triangle_selector #triangle_shape')[0].value;
    var triangle_shape_selected = document.getElementById("triangle_shape").selectedIndex;
    localStorage.setItem("triangle_shape", triangle_shape_selected);

    var origin_x = $('.dialog#triangle_selector input#origin_x').val().valueOf();
    localStorage.setItem("origin_x", origin_x);

    var origin_y = $('.dialog#triangle_selector input#origin_y').val().valueOf();
    localStorage.setItem("origin_y", origin_y);

    var origin_z = $('.dialog#triangle_selector input#origin_z').val().valueOf();
    localStorage.setItem("origin_z", origin_z);

    var height = $('.dialog#triangle_selector input#height').val().valueOf();
    localStorage.setItem("height", height);

    var width = $('.dialog#triangle_selector input#width').val().valueOf();
    localStorage.setItem("width", width);

    var angle = $('.dialog#triangle_selector input#angle').val().valueOf();
    localStorage.setItem("angle", angle);

    var granularity = $('.dialog#triangle_selector input#granularity').val().valueOf();
    localStorage.setItem("granularity", granularity);

    // Determine which triangle to generate and generate it.
    determine_shape(triangle_shape, origin_x, origin_y, origin_z, height, width, angle, granularity);
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
        var error_window6 = new Dialog({title: 'Error', id: 'error_window_6', lines: [
            'Error occurred:<br\>' +
            'Your origin is outside of the restricted area.'
        ], draggable: true, onConfirm() {
            error_window6.hide();
            triangleWindow();
        }
        });
        error_window6.show();
        return;
    }

    // Isoceles triangle.
    if (triangle_shape === 'i_triangle')
    {
        var horizontal = height / Math.tan((90 - angle) * Math.PI / 180);

        // Make sure the height/width are valid.
        if ((origin_y > 32 - height || horizontal > 32 - origin_x || horizontal > 16 + origin_x) && Format.canvas_limit) {
            var error_window5 = new Dialog({title: 'Error', id: 'error_window_5', lines: [
                'Error occurred:<br\>' +
                'Your triangle would go outside of the restricted area.<br/>'+
                ' <br\>' +
                'Please make sure to keep the triangle small enough so that it still fits in the canvas.'
            ], draggable: true, onConfirm() {
                error_window5.hide();
                triangleWindow();
            }
            });
            error_window5.show();
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
            var error_window8 = new Dialog({title: 'Error', id: 'error_window_8', lines: [
                'Error occurred:<br\>' +
                'Your triangle would go outside of the restricted area.<br/>'+
                ' <br\>' +
                'Please make sure to keep the triangle small enough so that it still fits in the canvas.'
            ], draggable: true, onConfirm() {
                error_window8.hide();
                triangleWindow();
            }
            });
            error_window8.show();
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
            var error_window3 = new Dialog({title: 'Error', id: 'error_window_3', lines: [
                'Error occurred:<br\>' +
                'Angle must be a multiple of 22.5 degrees.<br/>'
            ], draggable: true, onConfirm() {
                error_window3.hide();
                triangleWindow();
            }
            });
            error_window3.show();
            return;
        }
        // Make sure the angle is between 0 and 90 degrees.
        if (angle_steps < 1 || angle_steps > 3) {
            var error_window4 = new Dialog({title: 'Error', id: 'error_window_4', lines: [
                'Error occurred:<br\>' +
                'Angle must be greater than 0 degrees and less than 90 degress.<br/>'
            ], draggable: true, onConfirm() {
                error_window4.hide();
                triangleWindow();
            }
            });
            error_window4.show();
            return;
        }
        // Make sure the height/width are valid.
        if ((origin_y > 32 - height - yOffset || horizontal > 32 - origin_x - xOffset || horizontal > 16 + origin_x - xOffset || horizontal > 32 - origin_z - xOffset || horizontal > 16 + origin_z - xOffset) && Format.canvas_limit) {
            var error_window9 = new Dialog({title: 'Error', id: 'error_window_9', lines: [
                'Error occurred:<br\>' +
                'Your triangle would go outside of the restricted area.<br/>'+
                ' <br\>' +
                'Please make sure to keep the triangle small enough so that it still fits in the canvas.'
            ], draggable: true, onConfirm() {
                error_window9.hide();
                triangleWindow();
            }
            });
            error_window9.show();
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

onUninstall = function() {
    //Removing entries
    Blockbench.removeMenuEntry('Generate triangle')
};