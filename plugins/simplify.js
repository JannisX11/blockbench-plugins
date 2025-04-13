Plugin.register("simplify", {
    title: "Simplify Models",
    author: "ThePinkHacker",
    icon: "build",
    description: "Simplifies the cubes in a model. For example if a block was 0.99 pixels wide, then it would change it to 1.",
    version: "1.0.0",
    variant: "both",
    onload() {
        MenuBar.addAction(
            new Action({
                id: "simplify",
                name: "Simplify",
                icon: "build",
                category: "filter",
                click: dialog_open,
            }),
            "filter",
        );
    },
    onunload() {
        MenuBar.removeAction("filter.simplify");
    }
});

function dialog_confirm(data, pointer_event) {
    if (data.roundAmount == 0) {
        Blockbench.showMessage("Failed, Invalid Number.", "center");
        return;
    }
    
    try {
        let cubes;

        if (data.selectOnly == true) {
            cubes = selected;
        } else {
            cubes = Cube.all;
        }
    
        // Undo
        Undo.initEdit({elements: cubes});
    
        // Simplify cube loop
        for (let i = 0; i < cubes.length; i++) {
            // Size
            if (data.size) {
                cubes[i].to = simplify_array(cubes[i].to, data.roundAmount);
                cubes[i].from = simplify_array(cubes[i].from, data.roundAmount);
            }
    
            // UV
            if (data.uv) {
                cubes[i].faces.north.uv = simplify_value(cubes[i].faces.north.uv, data.roundAmount);
                cubes[i].faces.east.uv = simplify_value(cubes[i].faces.east.uv, data.roundAmount);
                cubes[i].faces.south.uv = simplify_value(cubes[i].faces.south.uv, data.roundAmount);
                cubes[i].faces.west.uv = simplify_value(cubes[i].faces.west.uv, data.roundAmount);
                cubes[i].faces.up.uv = simplify_value(cubes[i].faces.up.uv, data.roundAmount);
                cubes[i].faces.down.uv = simplify_value(cubes[i].faces.down.uv, data.roundAmount);
            }
    
            // Rotation
            if (data.rotation) {
                cubes[i].rotation = simplify_array(cubes[i].rotation, data.roundAmount);
            }
    
            // Origin
            if (data.origin) {
                cubes[i].origin = simplify_array(cubes[i].origin, data.roundAmount);
            }
    
            Canvas.adaptObjectPosition(cubes[i]);
            Canvas.updateUV(cubes[i]);
        }
    
        Undo.finishEdit("simplify cubes", {elements: cubes});
        updateSelection()
    }
    catch (error) {
        console.error(error);
        Blockbench.showMessage("Failed", "center");
        updateSelection()
    }
}

function dialog_create() {
    let form = {
        selectOnly: {label: "Selected Cubes Only", type: "checkbox"},
        roundAmount: {label: "Rounding Amount", type: "number", value: 0.25, min: 0.0, step: 0.25},
        size: {label: "Size", type: "checkbox", value: true},
        uv: {label: "UV", type: "checkbox", value: true},
        origin: {label: "Origin", type: "checkbox", value: true}
    };

    if (Format != Formats.java_block) {
        form.rotation = {label: "Rotation", type: "checkbox", value: true};
    }

    return new Dialog({
        title: "Simplify Models",
        id: "simplify_options",
        lines: [
            "<p>This will simplify the cubes in the current model. It will do this to the rotation, pivot point, size, UV, and position of each cube.</p>",
        ],
        form: form,
        onConfirm: dialog_confirm,
    });
}


function dialog_open() {
    dialog_create().show();
}

function simplify_value(value, round) {
    return Math.round(value / round) * round;
}

function simplify_array(values, round) {
    return values.map((value) => simplify_value(value, round));
}
