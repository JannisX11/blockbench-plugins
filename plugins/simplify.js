Plugin.register("simplify", {
    title: "Simplify Models",
    author: "Ryan Garrett",
    icon: "build",
    description: "Simplifies the cubes in a model. For example if a block was 0.99 pixels wide, then it would change it to 1.",
    version: "0.1.1",
    variant: "both",
    onload() {
        MenuBar.addAction(new Action({
            id: "simplify",
            name: "Simplify",
            icon: "build",
            category: "filter",
            click: function(ev) {
                var dialog = new Dialog({title:"Simplify cubes", id:"simplify_options", lines:[
                    "<p>Selected cubes only <input type='checkbox' id='restrict'>",
                    "<br/>This will simplify the cubes in the current model. It will do this to the rotation, pivot point, size, UV, and position of each cube.<br/></p>"
                ],
                "onConfirm": function(data) {
                    try {
                        var restrictToSelected = $("#restrict")[0].checked

                        dialog.hide();

                        var cubes = Cube.all;
                        if (restrictToSelected == true) {
                            if (selected.length > 0) {
                                cubes = selected;
                            }
                            else {
                                cubes = null;
                            }
                        }

                        // Undo
                        Undo.initEdit({elements: cubes});

                        // Goes through all of the cubes and simplifies them.
                        for (let i = 0; i < cubes.length; i++) {

                            // to
                            cubes[i].to = Simplify(cubes[i].to);

                            // from
                            cubes[i].from = Simplify(cubes[i].from);

                            // uv
                            cubes[i].faces.north.uv = Simplify(cubes[i].faces.north.uv);

                            cubes[i].faces.east.uv = Simplify(cubes[i].faces.east.uv);

                            cubes[i].faces.south.uv = Simplify(cubes[i].faces.south.uv);

                            cubes[i].faces.west.uv = Simplify(cubes[i].faces.west.uv);

                            // rotation
                            cubes[i].rotation = Simplify(cubes[i].rotation);

                            // origin
                            cubes[i].origin = Simplify(cubes[i].origin);

                            Canvas.adaptObjectPosition(cubes[i]);
                            Canvas.updateUV(cubes[i]);
                        }

                        Undo.finishEdit("simplify cubes", {elements: cubes});

						updateSelection()
                    }
                    catch {
                        Blockbench.showMessage("Failed");
						updateSelection()
                    }
                }
                });

                dialog.show()
            }
        }), "filter");
    },

    onunload() {
        MenuBar.removeAction("filter.simplify");
    }
});

// Rounds the value or values to the nearest fourth.
function Simplify(value) {
    if (value.length == null) {
        return Math.round(value * 4) / 4;
    }
    else {
        var values = [];

        for (let i = 0; i < value.length; i++) {
            values.push(Math.round(value[i] * 4) / 4);
        }
        return values;
    }
}
