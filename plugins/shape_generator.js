(function() {


    Plugin.register('shape_generator', {
        title: 'Shape Generator',
        icon: 'pages',
        author: 'dragonmaster95',
        description: 'Generates shapes.',
        version: '0.0.3',
        min_version: '3.0.2',
        variant: 'both',
        onload() {
            ShapeGeneratorAction = new Action("generate_shape", {
                name: "Generate shape",
                description: "Generates circular shapes.",
                icon: "pages",
                click: function(){
    
                    //Check if the user is in the right mode
                    if (!Format.rotate_cubes) {
                        Blockbench.showMessageBox({
                            title: 'Incompatible Format',
                            message: 'This plugin only works in formats that support cube rotations.'
                        })
                        return;
                    }
                    else {
                        shapeWindow();
                    }
                }
            })
            MenuBar.addAction(ShapeGeneratorAction, "filter");
        },
        onunload() {
            ShapeGeneratorAction.delete();
        }
    });


//shape selection window
function shapeWindow() {
    var shape_list = {
        hexadecagon: "Hexadecagon",
        octagon: "Octagon"
    };
    var variable_list = {
        diameter: "Diameter/Length",
        radius: "Radius",
        side: "Side"
    };
    var axis_list = {
        x: "X",
        y: "Y",
        z: "Z"
    };

    var shape_window = new Dialog({
        title: 'Shape selector', 
        id: 'shape_selector', 

        form: {
            shape: {label: "Select shape", type: "select", options: shape_list},
            border: {label: "Hollow", type: "checkbox"},
            variable: {label: "Variable", type: "select", options: variable_list},
            value: {label: "Value", type: "number", value: 0},
            thickness: {label: "Height/Depth", type: "number", value: 16},
            center: {label: "Center Point", type: "vector", value: [8,8,8]},
            axis: {label: "Axis", type: "select", options: axis_list}
        },
        lines: [
            '<p><span style="float:left;">Reset values: <button title="Reset values" =button id="reset_shape"><i class="material-icons" style="color:white">refresh</i></button></span></p><br/><br/>'
        ],
        /*lines: [
            '<p style="text-align:left;">Select shape:' + shape_list +
            '<span style="float:right;"><button title="Reset values" =button id="reset_shape"><i class="material-icons" style="color:white">refresh</i></button></span></p>' +
            'Hollow <input type="checkbox" id="border"><br/><p></p>' +
            'Variable ' + variable_list + '<br/>' +
            'Value: <input value=16 type="number" id="value" style="background-color:var(--color-back)" > <br/>' +
            'Height/Depth: <input value=1 type="number" style="background-color:var(--color-back)" id="thickness"> <br/><p></p>' +
            'Center point: <input value=8 type="number" style="background-color:var(--color-back)" id="x">' + ' ' + '<input value=8 type="number" style="background-color:var(--color-back)" id="y"> <input value=8 type="number" style="background-color:var(--color-back)" id="z"> <br\>' +
            'Axis:' + axis_list

        ],*/ 
        draggable: true, 
        onConfirm(result) {
            generateShape(result);
            shape_window.hide();
        }
    });
    shape_window.show();
    if (localStorage.getItem("shape") != undefined) {
        document.getElementById("shape").selectedIndex = localStorage.getItem("shape");
        $('.dialog#shape_selector input#border').prop("checked", (localStorage.getItem("border") == 'true'));
        document.getElementById("variable").selectedIndex = localStorage.getItem("variable");
        $('.dialog#shape_selector input#value').val(localStorage.getItem("value"));
        $('.dialog#shape_selector input#thickness').val(localStorage.getItem("thickness"));
        document.getElementById("axis").selectedIndex = localStorage.getItem("axis");
        $('.dialog#shape_selector input#center_0').val(localStorage.getItem("center_x"));
        $('.dialog#shape_selector input#center_1').val(localStorage.getItem("center_y"));
        $('.dialog#shape_selector input#center_2').val(localStorage.getItem("center_z"));
    }

    //Reset Button Click Event
    document.getElementById("reset_shape").onclick = function(){
        document.getElementById("shape").selectedIndex=0;
        $('.dialog#shape_selector input#border').prop("checked", false);
        document.getElementById("variable").selectedIndex=0;
        $('.dialog#shape_selector input#value').val(16);
        $('.dialog#shape_selector input#thickness').val(1);
        document.getElementById("axis").selectedIndex=1;
        $('.dialog#shape_selector input#center_0').val(8);
        $('.dialog#shape_selector input#center_1').val(8);
        $('.dialog#shape_selector input#center_2').val(8);

        localStorage.removeItem("shape");
        localStorage.removeItem("border");
        localStorage.removeItem("variable");
        localStorage.removeItem("value");
        localStorage.removeItem("thickness");
        localStorage.removeItem("axis");
        localStorage.removeItem("center");
    }
}

/*
    <div class="dialog draggable paddinged ui-draggable" id="selection_creator" style="display: block; left: 337.5px; top: 64px;">
    <h2 class="dialog_handle ui-draggable-handle">shape Generator</h2>

    <div class="dialog_bar">
    <input type=shape_list id="shape">
    <label class="name_space_left" for="selgen_new">Select a shape: </label>
    </div>

    <div class="dialog_bar">
        <input type="checkbox" id="border">
        <label class="name_space_left" for="selgen_group">Border only</label>
    </div>

    <div class="dialog_bar">
        <label class="name_space_left" for="selgen_new">Name Contains</label>
    <input type="text" class="dark_bordered half" id="selgen_name">
        </div>

        <div class="dialog_bar">
        <label class="name_space_left" for="selgen_new">Random</label>
        <input type="range" min="0" max="100" step="1" value="100" class="tool half" id="selgen_random">
        </div>

        <div class="dialog_bar">
        <button type="button" class="large confirm_btn" onclick="createSelection()">Select</button>
        <button type="button" class="large cancel_btn" onclick="hideDialog()">Cancel</button>
        </div>
        <div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
    </div>
    )
}
    shape_window.show();*/


function generateShape(result) {
    var shape = result.shape;
    var shape_selected = document.getElementById("shape").selectedIndex;
    localStorage.setItem("shape", shape_selected);
    
    var variable = result.variable;
    var variable_selected = document.getElementById("variable").selectedIndex;
    localStorage.setItem("variable", variable_selected);

    var border = result.border;
    localStorage.setItem("border", border);

    var axis = result.axis;
    var axis_selected = document.getElementById("axis").selectedIndex;
    localStorage.setItem("axis", axis_selected);

    //no value or value too small
    var value = $('.dialog#shape_selector input#value').val().valueOf();
    localStorage.setItem("value", value);
    if (value == "" || value <= 0) {
        var error_window1 = new Dialog({
            title: 'Error', id: 'error_window_1', lines: [
                'Error occured:<br\>' +
                'The '+document.getElementById("variable").item(document.getElementById("variable").selectedIndex).textContent+' has has to be a positive number<br\>' +
                ' <br\>' +
                'Your value: ' +value
            ], draggable: true, onConfirm() {
                shapeWindow();
                error_window1.hide();
            }
        });
        error_window1.show();
        return;
    }

    //negative value for thickness
    var thickness = result.thickness;
    localStorage.setItem("thickness", thickness);
    if (thickness == "" || parseFloat(thickness) <= 0) {
        var error_window2 = new Dialog({
            title: 'Error', id: 'error_window_2', lines: [
                'Error occured:<br\>' +
                'The height/depth has to be set to a positive number<br\>' +
                ' <br\>' +
                'Your value: ' + thickness
            ], draggable: true, onConfirm() {
                shapeWindow();
                error_window2.hide();
            }
        });
        error_window2.show();
        return;
    }

    //invalid Origin
    var origin = result.center;
    localStorage.setItem("center_x", origin[0]);
    localStorage.setItem("center_y", origin[1]);
    localStorage.setItem("center_z", origin[2]);
    if (isNaN(origin[0]) || isNaN(origin[1]) || isNaN(origin[2])) {
        var error_window3 = new Dialog({
            title: 'Error', id: 'error_window_3', lines: [
                'Error occured:<br\>' +
                'One of the origin values seem to not exist. Please fill out all 3 "origin" values.<br\>' +
                ' <br\>' +
                'Your values:\tX:'+origin[0]+' Y:'+origin[1]+' Z:'+origin[2]
            ], draggable: true, onConfirm() {
                shapeWindow();
                error_window3.hide();
            }
        });
        error_window3.show();
        return;
    }

    if (border || shape !=='hexadecagon') borderValues(shape, variable, value, thickness, border, axis, origin);
    else determineShape(shape, variable, value, thickness, border, axis, origin, 0, 0);
}

function borderValues(shape, variable, value, thickness, border, axis, origin) {
    //Border true
    var border_window = new Dialog({
        title: 'Define more stuff',
        id: 'border_width',
        form: {
            border: {label: "Border width", type: "number", value: 1}
        },
        lines: [
            '<p>Shape rotation: <input id="angle" type="range" min="0" max="7" value="0" oninput="$(\'label#test\').text(\' \'+parseInt($(\'input#angle\').val())*22.5+\'°\')" onchange="$(\'label#test\').text(parseInt($(\'input#angle\').val())*22.5+\'°\')">' +
            '<label id="test"> 0°</label>' +
            '<br/><p/>'
        ],
        draggable: true,
        onConfirm(result) {
            var border_size = result.border;
            angle = $('.dialog#border_width input#angle').val().valueOf();

            var tmp = value;
            if (variable=='diameter') tmp = value/2;
            if (variable=='side') console.log(tmp);
            if (variable=='side') tmp = value / 0.414213562373095 /2;
            if (variable=='side') console.log(tmp);

            
            if (border_size < 0 || border_size === "" || border_size >= tmp) {
                var error_window1 = new Dialog({
                    title: 'Error', id: 'error_window_1', lines: [
                        'Error occured:<br\>' +
                        'The border_width has to be set to a positive number and can\'t be bigger than the object\'s radius.<br\>' +
                        ' <br\>' +
                        'Your value: ' + border_size + '\t(Maximum size: ' + tmp.toFixed(2) + ')'
                    ], draggable: true, onConfirm() {
                        borderValues(shape, variable, value, thickness, border, axis, origin);
                        error_window1.hide();
                    }
                });
                error_window1.show();
                return;
            }
            localStorage.setItem("border_size", border_size);
            localStorage.setItem("angle", angle);
            determineShape(shape, variable, value, thickness, border, axis, origin, border_size, angle*22.5);
            border_window.hide();
        }
    });
    border_window.show();
    if (localStorage.getItem("border_size") != undefined) {
        $('.dialog#border_width input#angle').val(localStorage.getItem("angle"));
        $('.dialog#border_width input#border').val(localStorage.getItem("border_size"));
        $('label#test').text((' '+localStorage.getItem("angle")*22.5+'°'));
    }
}

function determineShape(shape, variable, value, thickness, border, axis, origin, border_size, angle) {
	Undo.initEdit({outliner: true, elements: [], selection: true});
    if (shape === 'hexadecagon')
    {
        var diameter = 0;
        //user chose radius or diameter
        if (variable === 'radius' || variable === 'diameter') {
            if (variable === 'radius') diameter = parseFloat(value) * 2;
            else diameter = parseFloat(value);
            var side = diameter * 0.198912367379658;
        }

        //user chose side
        else if (variable === 'side') {
            var side = parseFloat(value);
            diameter = side / 0.198912367379658;
        }

        //value is too high
        if ((diameter/2+origin[2] > 32 || diameter/2+origin[0] > 32 || thickness/2+origin[1] > 32 ||
             origin[2]-diameter/2 < -16 || origin[0]-diameter/2 < -16 || origin[1]-thickness/2 < -16) && Format.canvas_limit) {
            var error_window2 = new Dialog({title: 'Error', id: 'error_window_2', lines: [
                'Error occured:<br\>' +
                'Your shape would go outside of the restricted area.<br/>'+
                ' <br\>' +
                'Please make sure to keep the shape small enough so that it still fits in the canvas and <br\>'+
                'that the center point isn\'t causing issues.<br\>'
            ], draggable: true, onConfirm() {
                shapeWindow();
                error_window2.hide();
            }
            });
            error_window2.show();
            return;
        }

        if (border) generateHexadecagonBordered(diameter, side, origin, axis, thickness, border_size);
        else generateHexadecagonFilled(diameter, side, origin, axis, thickness);
    }

    if (shape === 'octagon')
    {
        //user chose radius or diameter
        if (variable === 'radius' || variable === 'diameter') {
            if (variable === 'radius') var diameter = parseFloat(value) * 2;
            else var diameter = parseFloat(value);
            var side = diameter * 0.414213562373095;
        }

        //user chose side
        else if (variable === 'side') {
            var side = parseFloat(value);
            var diameter = side / 0.414213562373095;
        }

        //value is too high
        if ((diameter/2+origin[2] > 32 || diameter/2+origin[0] > 32 || thickness/2+origin[1] > 32 ||
                origin[2]-diameter/2 < -16 || origin[0]-diameter/2 < -16 || origin[1]-thickness/2 < -16) && Format.canvas_limit) {
            var error_window2 = new Dialog({title: 'Error', id: 'error_window_2', lines: [
                'Error occured:<br\>' +
                'Your shape would go outside of the restricted area.<br/>'+
                ' <br\>' +
                'Please make sure to keep the shape small enough so that it still fits in the canvas and <br\>'+
                'that the center point isn\'t causing issues.<br\>'
            ], draggable: true, onConfirm() {
                shapeWindow();
                error_window2.hide();
            }
            });
            error_window2.show();
            return;
        }

        if (border) generateOctagonBordered(diameter, side, origin, axis, thickness, border_size, angle);
        else generateOctagonFilled(diameter, side, origin, axis, thickness, angle);
    }

    if (shape === 'hexagon_flat')
    {
        //user chose radius or diameter
        if (variable === 'radius' || variable === 'diameter') {
            if (variable === 'radius') var diameter = parseFloat(value) * 2;
            else var diameter = parseFloat(value);
            var side = diameter * 0.5858;
        }

        //user chose side
        else if (variable === 'side') {
            var side = parseFloat(value);
            var diameter = side / 0.5858;
        }

        //value is too high
        if ((diameter/2+origin[2] > 32 || diameter/2+origin[0] > 32 || thickness/2+origin[1] > 32 ||
                origin[2]-diameter/2 < -16 || origin[0]-diameter/2 < -16 || origin[1]-thickness/2 < -16) && Format.canvas_limit) {
            var error_window2 = new Dialog({title: 'Error', id: 'error_window_2', lines: [
                'Error occured:<br\>' +
                'Your shape would go outside of the restricted area.<br/>'+
                ' <br\>' +
                'Please make sure to keep the shape small enough so that it still fits in the canvas and <br\>'+
                'that the center point isn\'t causing issues.<br\>'
            ], draggable: true, onConfirm() {
                shapeWindow();
                error_window2.hide();
            }
            });
            error_window2.show();
            return;
        }

        var side2 = diameter*0.5412;

        if (border) generateHexagonFlatBordered(diameter, side, side2, origin, axis, thickness, border_size, angle);
        else generateHexagonFlatFilled(diameter, side, side2, origin, axis, thickness, angle);
    }

    //edit
    Undo.finishEdit('Generated Shape', {outliner: true, elements: selected, selection: true});
    Blockbench.showMessage('Generated a '+shape+' with a '+variable+' of '+value+' (Border:'+border+')', 'sidebar');

}

//------------Hexadecagon------------//

function generateHexadecagonFilled(diameter, side, origin, axis, thickness) {

    hexadecagon = new Group('hexadecagon').init();
    diameter = parseFloat(diameter);
    side = parseFloat(side);
    thickness = parseFloat(thickness);
    origin[0] = parseFloat(origin[0]);
    origin[1] = parseFloat(origin[1]);
    origin[2] = parseFloat(origin[2]);

    //loading message
    //Blockbench.showMessage('Generating shape... Please wait', 'center')

    var fromX = origin[0]-(side/2);
    var fromY = origin[1]-(thickness/2);
    var fromZ = origin[2]-(diameter/2);
    var toX = fromX+side;
    var toY = fromY+thickness;
    var toZ = fromZ+diameter;

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,-45,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,-22.5,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,0,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,22.5,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,45,hexadecagon);

    var fromX2 = parseFloat(origin[0]-(diameter/2));
    var fromY2 = parseFloat(origin[1]-(thickness/2));
    var fromZ2 = parseFloat(origin[2]-(side/2));
    var toX2 = parseFloat(fromX2+diameter);
    var toY2 = parseFloat(fromY2+thickness);
    var toZ2 = parseFloat(fromZ2+side);

    if (axis === 'x') {
        var cacheY2=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 = parseFloat(fromX2+origin[1]-origin[0]);
        fromX2 = parseFloat(cacheY2+(origin[0]-thickness/2));
        cacheY2=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 = parseFloat(toX2+origin[1]-origin[0]);
        toX2 = parseFloat(cacheY2+(origin[0]-thickness/2));
    }

    else if (axis === 'z') {
        var cacheY2=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 =parseFloat(fromZ2+origin[1]-origin[2]);
        fromZ2 = parseFloat(cacheY2+(origin[2]-thickness/2));
        cacheY2=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 =parseFloat(toZ2+origin[1]-origin[2]);
        toZ2 = parseFloat(cacheY2+(origin[2]-thickness/2));
    }

    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,-22.5,hexadecagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,0,hexadecagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,22.5,hexadecagon);

    Canvas.updateAll();
    hexadecagon.openUp().select();

}

function generateHexadecagonBordered(diameter, side, origin, axis, thickness, border_size) {

    hexadecagon = new Group('hexadecagon').init();
    diameter = parseFloat(diameter);
    side = parseFloat(side);
    thickness = parseFloat(thickness);
    origin[0] = parseFloat(origin[0]);
    origin[1] = parseFloat(origin[1]);
    origin[2] = parseFloat(origin[2]);
    border_size = parseFloat(border_size);

    //loading message
    //Blockbench.showMessage('Generating shape... Please wait', 'center')


    var fromX = parseFloat(origin[0]-(side/2));
    var fromY = parseFloat(origin[1]-(thickness/2));
    var fromZ = parseFloat(origin[2]-(diameter/2));
    var toX = parseFloat(fromX+side);
    var toY = parseFloat(fromY+thickness);
    var toZ = parseFloat(fromZ+border_size);

    var fromX2 = parseFloat(fromX);
    var fromY2 = parseFloat(fromY);
    var fromZ2 = parseFloat(fromZ+(diameter-border_size));
    var toX2 = parseFloat(toX);
    var toY2 = parseFloat(toY);
    var toZ2 = parseFloat(toZ+(diameter-border_size));

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));

        var cacheY=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 = parseFloat(fromX2+origin[1]-origin[0]);
        fromX2 = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 = parseFloat(toX2+origin[1]-origin[0]);
        toX2 = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));

        var cacheY=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 =parseFloat(fromZ2+origin[1]-origin[2]);
        fromZ2 = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 =parseFloat(toZ2+origin[1]-origin[2]);
        toZ2 = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,-45,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,-22.5,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,0,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,22.5,hexadecagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,45,hexadecagon);

    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,-45,hexadecagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,-22.5,hexadecagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,0,hexadecagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,22.5,hexadecagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,45,hexadecagon);

    var fromX3 = parseFloat(origin[0]-(diameter/2));
    var fromY3 = parseFloat(origin[1]-(thickness/2));
    var fromZ3 = parseFloat(origin[2]-(side/2));
    var toX3 = parseFloat(fromX3+border_size);
    var toY3 = parseFloat(fromY3+thickness);
    var toZ3 = parseFloat(fromZ3+side);

    var fromX4 = parseFloat(fromX3+(diameter-border_size));
    var fromY4 = parseFloat(fromY3);
    var fromZ4 = parseFloat(fromZ3);
    var toX4 = parseFloat(toX3+(diameter-border_size));
    var toY4 = parseFloat(toY3);
    var toZ4 = parseFloat(toZ3);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY3+(thickness/2-origin[1]));
        fromY3 = parseFloat(fromX3+origin[1]-origin[0]);
        fromX3 = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY3+(thickness/2-origin[1]));
        toY3 = parseFloat(toX3+origin[1]-origin[0]);
        toX3 = parseFloat(cacheY+(origin[0]-thickness/2));

        var cacheY=parseFloat(fromY4+(thickness/2-origin[1]));
        fromY4 = parseFloat(fromX4+origin[1]-origin[0]);
        fromX4 = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY4+(thickness/2-origin[1]));
        toY4 = parseFloat(toX4+origin[1]-origin[0]);
        toX4 = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY3+(thickness/2-origin[1]));
        fromY3 =parseFloat(fromZ3+origin[1]-origin[2]);
        fromZ3 = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY3+(thickness/2-origin[1]));
        toY3 =parseFloat(toZ3+origin[1]-origin[2]);
        toZ3 = parseFloat(cacheY+(origin[2]-thickness/2));

        var cacheY=parseFloat(fromY4+(thickness/2-origin[1]));
        fromY4 =parseFloat(fromZ4+origin[1]-origin[2]);
        fromZ4 = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY4+(thickness/2-origin[1]));
        toY4 =parseFloat(toZ4+origin[1]-origin[2]);
        toZ4 = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX3,fromY3,fromZ3,toX3,toY3,toZ3,origin,axis,-22.5,hexadecagon);
    buildCube(fromX3,fromY3,fromZ3,toX3,toY3,toZ3,origin,axis,0,hexadecagon);
    buildCube(fromX3,fromY3,fromZ3,toX3,toY3,toZ3,origin,axis,22.5,hexadecagon);

    buildCube(fromX4,fromY4,fromZ4,toX4,toY4,toZ4,origin,axis,-22.5,hexadecagon);
    buildCube(fromX4,fromY4,fromZ4,toX4,toY4,toZ4,origin,axis,0,hexadecagon);
    buildCube(fromX4,fromY4,fromZ4,toX4,toY4,toZ4,origin,axis,22.5,hexadecagon);

    Canvas.updateAll();
    hexadecagon.openUp().select();
}


//--------------Octagon--------------//

function generateOctagonFilled(diameter, side, origin, axis, thickness, angle) {

    octagon = new Group('octagon').init();
    diameter = parseFloat(diameter);
    side = parseFloat(side);
    thickness = parseFloat(thickness);
    origin[0] = parseFloat(origin[0]);
    origin[1] = parseFloat(origin[1]);
    origin[2] = parseFloat(origin[2]);
    angle = parseFloat(angle%45);

    //loading message
    //Blockbench.showMessage('Generating shape... Please wait', 'center')

    var fromX = origin[0]-(side/2);
    var fromY = origin[1]-(thickness/2);
    var fromZ = origin[2]-(diameter/2);
    var toX = fromX+side;
    var toY = fromY+thickness;
    var toZ = fromZ+diameter;

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,45-angle,octagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,0-angle,octagon);

    var fromX2 = parseFloat(origin[0]-(diameter/2));
    var fromY2 = parseFloat(origin[1]-(thickness/2));
    var fromZ2 = parseFloat(origin[2]-(side/2));
    var toX2 = parseFloat(fromX2+diameter);
    var toY2 = parseFloat(fromY2+thickness);
    var toZ2 = parseFloat(fromZ2+side);

    if (axis === 'x') {
        var cacheY2=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 = parseFloat(fromX2+origin[1]-origin[0]);
        fromX2 = parseFloat(cacheY2+(origin[0]-thickness/2));
        cacheY2=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 = parseFloat(toX2+origin[1]-origin[0]);
        toX2 = parseFloat(cacheY2+(origin[0]-thickness/2));
    }

    else if (axis === 'z') {
        var cacheY2=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 =parseFloat(fromZ2+origin[1]-origin[2]);
        fromZ2 = parseFloat(cacheY2+(origin[2]-thickness/2));
        cacheY2=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 =parseFloat(toZ2+origin[1]-origin[2]);
        toZ2 = parseFloat(cacheY2+(origin[2]-thickness/2));
    }

    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,45-angle,octagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,0-angle,octagon);

    Canvas.updateAll();
    octagon.openUp().select();
}

function generateOctagonBordered(diameter, side, origin, axis, thickness, border_size, angle) {

    octagon = new Group('octagon').init();
    diameter = parseFloat(diameter);
    side = parseFloat(side);
    thickness = parseFloat(thickness);
    origin[0] = parseFloat(origin[0]);
    origin[1] = parseFloat(origin[1]);
    origin[2] = parseFloat(origin[2]);
    border_size = parseFloat(border_size);
    angle = parseFloat(angle%45);

    //loading message
    //Blockbench.showMessage('Generating shape... Please wait', 'center')

    var fromX = parseFloat(origin[0]-(side/2));
    var fromY = parseFloat(origin[1]-(thickness/2));
    var fromZ = parseFloat(origin[2]-(diameter/2));
    var toX = parseFloat(fromX+side);
    var toY = parseFloat(fromY+thickness);
    var toZ = parseFloat(fromZ+border_size);

    var fromX2 = parseFloat(fromX);
    var fromY2 = parseFloat(fromY);
    var fromZ2 = parseFloat(fromZ+(diameter-border_size));
    var toX2 = parseFloat(toX);
    var toY2 = parseFloat(toY);
    var toZ2 = parseFloat(toZ+(diameter-border_size));

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));

        var cacheY=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 = parseFloat(fromX2+origin[1]-origin[0]);
        fromX2 = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 = parseFloat(toX2+origin[1]-origin[0]);
        toX2 = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));

        var cacheY=parseFloat(fromY2+(thickness/2-origin[1]));
        fromY2 =parseFloat(fromZ2+origin[1]-origin[2]);
        fromZ2 = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY2+(thickness/2-origin[1]));
        toY2 =parseFloat(toZ2+origin[1]-origin[2]);
        toZ2 = parseFloat(cacheY+(origin[2]-thickness/2));
    }


    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,45-angle,octagon);
    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,0-angle,octagon);

    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,45-angle,octagon);
    buildCube(fromX2,fromY2,fromZ2,toX2,toY2,toZ2,origin,axis,0-angle,octagon);

    var fromX3 = parseFloat(origin[0]-(diameter/2));
    var fromY3 = parseFloat(origin[1]-(thickness/2));
    var fromZ3 = parseFloat(origin[2]-(side/2));
    var toX3 = parseFloat(fromX3+border_size);
    var toY3 = parseFloat(fromY3+thickness);
    var toZ3 = parseFloat(fromZ3+side);

    var fromX4 = parseFloat(fromX3+(diameter-border_size));
    var fromY4 = parseFloat(fromY3);
    var fromZ4 = parseFloat(fromZ3);
    var toX4 = parseFloat(toX3+(diameter-border_size));
    var toY4 = parseFloat(toY3);
    var toZ4 = parseFloat(toZ3);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY3+(thickness/2-origin[1]));
        fromY3 = parseFloat(fromX3+origin[1]-origin[0]);
        fromX3 = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY3+(thickness/2-origin[1]));
        toY3 = parseFloat(toX3+origin[1]-origin[0]);
        toX3 = parseFloat(cacheY+(origin[0]-thickness/2));

        var cacheY=parseFloat(fromY4+(thickness/2-origin[1]));
        fromY4 = parseFloat(fromX4+origin[1]-origin[0]);
        fromX4 = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY4+(thickness/2-origin[1]));
        toY4 = parseFloat(toX4+origin[1]-origin[0]);
        toX4 = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY3+(thickness/2-origin[1]));
        fromY3 =parseFloat(fromZ3+origin[1]-origin[2]);
        fromZ3 = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY3+(thickness/2-origin[1]));
        toY3 =parseFloat(toZ3+origin[1]-origin[2]);
        toZ3 = parseFloat(cacheY+(origin[2]-thickness/2));

        var cacheY=parseFloat(fromY4+(thickness/2-origin[1]));
        fromY4 =parseFloat(fromZ4+origin[1]-origin[2]);
        fromZ4 = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY4+(thickness/2-origin[1]));
        toY4 =parseFloat(toZ4+origin[1]-origin[2]);
        toZ4 = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX3,fromY3,fromZ3,toX3,toY3,toZ3,origin,axis,45-angle,octagon);
    buildCube(fromX3,fromY3,fromZ3,toX3,toY3,toZ3,origin,axis,0-angle,octagon);

    buildCube(fromX4,fromY4,fromZ4,toX4,toY4,toZ4,origin,axis,45-angle,octagon);
    buildCube(fromX4,fromY4,fromZ4,toX4,toY4,toZ4,origin,axis,0-angle,octagon);

    Canvas.updateAll();
    octagon.openUp().select();
}

//--------------Hexagon--------------//

function generateHexagonFlatFilled(diameter, side, side2, origin, axis, thickness, angle) {

    hexagon = new Group('hexagon').init();
    diameter = parseFloat(diameter);
    side = parseFloat(side);
    side2 = parseFloat(side2);
    thickness = parseFloat(thickness);
    origin[0] = parseFloat(origin[0]);
    origin[1] = parseFloat(origin[1]);
    origin[2] = parseFloat(origin[2]);
    angle = parseFloat(angle);

    //loading message
    //Blockbench.showMessage('Generating shape... Please wait', 'center')

    //Center piece
    var fromX = parseFloat(origin[0]-(side/2));
    var fromY = parseFloat(origin[1]-(thickness/2));
    var fromZ = parseFloat(origin[2]-(diameter/2));
    var toX = fromX+side;
    var toY = fromY+thickness;
    var toZ = fromZ+diameter;

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle,hexagon);

    //rotated part1
    fromX = parseFloat(origin[0]-(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]-(diameter*0.1912));
    toX = parseFloat(fromX+(side*0.6));
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle-45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle-45);
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle+22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle+45);

    //rotated part2
    toX = parseFloat(origin[0]+(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]-(diameter*0.1912));
    fromX = parseFloat(toX-(side*0.6));
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle+45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle+45);
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle-22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle-45);

    //rotated part3
    fromX = parseFloat(origin[0]-(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]+(diameter*0.1912)-side2);
    toX = parseFloat(fromX+(side*0.6));
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle+45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle+45);
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle-22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle-45);

    //rotated part4
    toX = parseFloat(origin[0]+(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]+(diameter*0.1912)-side2);
    fromX = parseFloat(toX-(side*0.6));
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle-45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle-45);
    }


    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle+22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle+45);

    Canvas.updateAll();
    hexagon.openUp().select();
}

function generateHexagonFlatBordered(diameter, side, side2, origin, axis, thickness, border_size, angle) {

    hexagon = new Group('hexagon').init();
    diameter = parseFloat(diameter);
    side = parseFloat(side);
    side2 = parseFloat(side2);
    thickness = parseFloat(thickness);
    origin[0] = parseFloat(origin[0]);
    origin[1] = parseFloat(origin[1]);
    origin[2] = parseFloat(origin[2]);
    border_size = parseFloat(border_size);
    angle = parseFloat(angle);

    //loading message
    //Blockbench.showMessage('Generating shape... Please wait', 'center')

    //Center piece1
    var fromX = parseFloat(origin[0]-(side/2));
    var fromY = parseFloat(origin[1]-(thickness/2));
    var fromZ = parseFloat(origin[2]-(diameter/2));
    var toX = fromX+side;
    var toY = fromY+thickness;
    var toZ = fromZ+border_size;

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle,hexagon);

    //Center piece2
    var fromX = parseFloat(origin[0]-(side/2));
    var fromY = parseFloat(origin[1]-(thickness/2));
    var fromZ = parseFloat(origin[2]+(diameter/2)-border_size);
    var toX = fromX+side;
    var toY = fromY+thickness;
    var toZ = fromZ+border_size;

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
    }

    if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle,hexagon);

    //rotated part1
    fromX = parseFloat(origin[0]-(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]-(diameter*0.1912));
    toX = parseFloat(fromX+border_size);
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle-45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle-45);
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle+22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle+45);

    //rotated part2
    toX = parseFloat(origin[0]+(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]-(diameter*0.1912));
    fromX = parseFloat(toX-border_size);
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle+45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle+45);
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle-22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle-45);

    //rotated part3
    fromX = parseFloat(origin[0]-(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]+(diameter*0.1912)-side2);
    toX = parseFloat(fromX+border_size);
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle+45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle+45);
    }

    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle-22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle-45);

    //rotated part4
    toX = parseFloat(origin[0]+(diameter*0.4619));
    fromY = origin[1]-(thickness/2);
    fromZ = parseFloat(origin[2]+(diameter*0.1912)-side2);
    fromX = parseFloat(toX-border_size);
    toY = fromY+thickness;
    toZ = parseFloat(fromZ+side2);

    if (axis === 'x') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY = parseFloat(fromX+origin[1]-origin[0]);
        fromX = parseFloat(cacheY+(origin[0]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY = parseFloat(toX+origin[1]-origin[0]);
        toX = parseFloat(cacheY+(origin[0]-thickness/2));
        angle = parseFloat(angle-45);
    }

    else if (axis === 'z') {
        var cacheY=parseFloat(fromY+(thickness/2-origin[1]));
        fromY =parseFloat(fromZ+origin[1]-origin[2]);
        fromZ = parseFloat(cacheY+(origin[2]-thickness/2));
        cacheY=parseFloat(toY+(thickness/2-origin[1]));
        toY =parseFloat(toZ+origin[1]-origin[2]);
        toZ = parseFloat(cacheY+(origin[2]-thickness/2));
        angle = parseFloat(angle-45);
    }


    buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,angle+22.5,hexagon);

    if (axis === 'z' || axis === 'x') angle=parseFloat(angle+45);

    Canvas.updateAll();
    hexagon.openUp().select();
}



function buildCube(fromX,fromY,fromZ,toX,toY,toZ,origin,axis,rotation,group) {
    var iteration = 0;
    while (rotation < -45) {
        rotation += 90;
        iteration--;
    }
    while (rotation > 45) {
        rotation -= 90;
        iteration++;
    }
    var cube = new Cube({
    	name: group.name,
    	from: [fromX, fromY, fromZ],
        to: [toX, toY, toZ],
        rotation: {origin: origin.slice(), axis: axis, angle: rotation}
    }).addTo(group).init()
/*    selected.length = 0;
    selected.push(cube.index());
    if (axis === "y") {
        console.log(selected);
        rotateSelectedY(iteration, true);
        console.log(iteration);
    }*/
}

})()

onUninstall = function() {
	//Removing entries
	Blockbench.removeMenuEntry('Generate shape')
};
