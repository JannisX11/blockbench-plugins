(function () {
    var repeatAction;
    var canRotate;
    Plugin.register("repeat_it", {
        title: "Repeat It",
        author: "Ocraftyone",
        icon: "content_copy",
        description:
            "Allows you to repeat cubes with a translation applied to each new object",
        about: "Allows you to repeat cubes with a translation applied to each new object.\n\nAt this time, the only shape that can be copied are cubes, but this may be updated in the future.",
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
                                value: 2,
                                description: "Number of times to copy the cube",
                                min: 2,
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
                            var zero = [0, 0, 0];
                            
                            if (rotationDiff.equals(zero) && possitionDiff.equals(zero)) {
                                Blockbench.showMessageBox({
                                    buttons: ["OK", "Cancel"],
                                    title: "Error",
                                    message: "There are no transforms applied to the repeated shapes!",
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

                            if (rotationLimit) {
                                if (!rotationDiff.every((e) => e % 22.5 === 0)) {
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
                            var shouldCreateGroup = formResult.shouldCreateGroup;
                            Cube.selected.forEach(function (cube, i) {
                                var group = cube.parent;
                                if (shouldCreateGroup) {
                                    group = new Group(
                                        cube.name + " group"
                                    ).init();
                                    group.addTo(cube.parent);
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
                                    var newCube = new Cube(cube).extend({
                                        from: newCubeFrom,
                                        to: newCubeTo,
                                        rotation: newCubeRotation,
                                        name: cube.name + "_" + j,
                                    }).init();
                                    newCube.addTo(group);
                                    elementsToAdd.push(newCube);
                                }
                            });
                            Canvas.updateView({ elements: elementsToAdd, element_aspects: {transform: true} })
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
