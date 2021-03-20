Plugin.register("simplify", {
    title: "Simplify Models",
    author: "Ryan Garrett",
    icon: "build",
    description: "Simplifies the cubes in a model. For example if a block was 0.99 pixels wide, then it would change it to 1.",
    version: "0.1.0",
    variant: "both",
    onload() {
        MenuBar.addAction(new Action({
            id: "simplify",
            name: "Simplify",
            icon: "build",
            category: "filter",
            click: function(ev) {
                var dialog = new Dialog({title:"Simplify cubes", id:"simplify_options", lines:[
                    "<p>Selected cubes only <input type='checkbox' id='restrict'></p>",
                    "<br/>This will simplify the cubes in the current model. It will do this to the rotation, pivot point, scale, UV, and position of each cube. Ctrl + Z does <b>not</b> work at the moment.<br/>"
                ],
                "onConfirm": function(data) {
                    try {
                        var restrictToSelected = $("#restrict")[0].checked

                        dialog.hide();

                        var elements = Outliner.elements;
                        if (restrictToSelected == true) {
                            if (selected.length > 0) {
                                elements = selected;
                            }
                            else {
                                elements = null;
                            }
                        }

                        console.log(elements);

                        // Goes through all of the cubes.
                        for (let i = 0; i < elements.length; i++) {

                            // to
                            elements[i].to = Simplify(elements[i].to);

                            // from
                            elements[i].from = Simplify(elements[i].from);

                            // uv
                            elements[i].faces.north.uv = Simplify(elements[i].faces.north.uv);

                            elements[i].faces.east.uv = Simplify(elements[i].faces.east.uv);

                            elements[i].faces.south.uv = Simplify(elements[i].faces.south.uv);

                            elements[i].faces.west.uv = Simplify(elements[i].faces.west.uv);

                            // rotation
                            elements[i].rotation = Simplify(elements[i].rotation);

                            // origin
                            elements[i].origin = Simplify(elements[i].origin);

                            Canvas.adaptObjectPosition(elements[i]);
                            Canvas.updateUV(elements[i]);
                        }
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
