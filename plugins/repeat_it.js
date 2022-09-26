(function () {
    var repeatAction;
    var canRotate;
    Plugin.register("repeat_it", {
        title: "Repeat It",
        author: "Ocraftyone",
        icon: "content_copy",
        description:
            "Allows you to repeat shapes with a translation applied to each new object",
        version: "0.0.1",
        variant: "both",
        onload () {
            repeatAction = new Action("repeat_shape", {
                name: "Repeat shape",
                description: "Repeat shape",
                icon: "content_copy",
                click (event) {
                    canRotate = Format.rotate_cubes;
                    var rotationLimit = Format.rotation_limit;
                    var option_dialog = new Dialog({
                        id: "repeat_shape_dialog",
                        title: "Repeat Shape",
                        form: {
                            repeat: {
                                label: "Repeat",
                                type: "number",
                                value: 1,
                                description: "Number of times to copy the cube",
                                min: 1,
                            },
                            possitionDiff: {
                                label: "Position difference",
                                type: "vector",
                                value: [0, 0, 0],
                                description: "Possition offset between each cloned cube",
                            },
                            rotationDiff: {
                                label: "Rotation difference",
                                type: "vector",
                                value: [0, 0, 0],
                                description:
                                    "Rotation offset between each cloned cube.\nRotation will only apply if the model supports it. If this option is not greyed out, your model supports rotation!",
                                step: Format.rotation_limit ? 22.5 : 1,
                                readonly: !canRotate,
                            },
                            shouldCreateGroup: {
                                label: "Create group",
                                type: "checkbox",
                                value: true,
                                description: "Wraps the original and all new cubes into a group",
                            },
                        },
                        onConfirm (formResult) {
                            var possitionDiff = formResult.possitionDiff;
                            var rotationDiff = formResult.rotationDiff;
                            
                            if (rotationLimit) {
                                if (rotationDiff.every((e) => e % rotationLimit == 0 || e == 0)) {
                                    Blockbench.showMessageBox({
                                        buttons: ["OK", "Cancel"],
                                        title: "Error",
                                        message: "Rotation difference is not a multiple of the rotation limit! (22.5)",
                                        confirm: 0,
                                        cancel: 1,
                                    },
                                    (button) => {
                                        if (button == 0) {
                                            option_dialog.show()
                                        }
                                    });
                                    return;
                                }
                                var nonZero = 0
                                rotationDiff.forEach(value => value !== 0 && nonZero++)
                                if (nonZero > 1) {
                                    Blockbench.showMessageBox({
                                        buttons: ["OK", "Cancel"],
                                        title: "Error",
                                        message: "The rotation limits of this model prevent you from rotating on more that one axis at a time!",
                                        confirm: 0,
                                        cancel: 1,
                                    },
                                    (button) => {
                                        if (button == 0) {
                                            option_dialog.show()
                                        }
                                    });
                                    return;                                
                                }
                            }
                            
                            this.hide();
                            var elementsToAdd = [];
                            Undo.initEdit({
                                elements: [],
                                outliner: true,
                                selection: true,
                            });
                            Cube.selected.forEach(function (cube, i) {
                                var group;
                                if (rotationLimit) {
                                    group = new Group(
                                        cube.name + " group"
                                    ).init();
                                    cube.addTo(group);
                                }

                                for (var j = 1; j < formResult.repeat; j++) {
                                    var newCubeFrom = [
                                        cube.from[0] +
                                            possitionDiff[0] * j,
                                        cube.from[1] +
                                            possitionDiff[1] * j,
                                        cube.from[2] +
                                            possitionDiff[2] * j,
                                    ];
                                    var newCubeTo = [
                                        cube.to[0] +
                                            possitionDiff[0] * j,
                                        cube.to[1] +
                                            possitionDiff[1] * j,
                                        cube.to[2] +
                                            possitionDiff[2] * j,
                                    ];
                                    if (canRotate) {
                                        var newCubeRotation = [
                                            cube.rotation[0] +
                                                rotationDiff[0] * j,
                                            cube.rotation[1] +
                                                rotationDiff[1] * j,
                                            cube.rotation[2] +
                                                rotationDiff[2] * j,
                                        ];
                                    }
                                    var newCube = new Cube({
                                        from: newCubeFrom,
                                        to: newCubeTo,
                                        rotation: newCubeRotation,
                                        shade: cube.shade,
                                        name: cube.name + "_" + j,
                                    }).init();
                                    if (rotationLimit) {
                                        newCube.addTo(group);
                                    }
                                    elementsToAdd.push(newCube);
                                }
                            });
                            Undo.finishEdit("Repeat shape", {
                                outliner: true,
                                elements: elementsToAdd,
                                selection: true,
                            });
                        },
                    });

                    option_dialog.show();
                },
            });

            MenuBar.addAction(repeatAction, "tools");
        },
        onunload () {
            repeatAction.delete();
        },
    });
})();
