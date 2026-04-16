(function () {
    "use strict";

    const PLUGIN_ID = "no_java_limits";
    const OFFSET = 8;
    const LIMIT_DIST = 24;

    let suppressDialog = false;
    let scaleUpAction, scaleDownAction;

    let originalCoordinateLimits = null;
    let originalLimiterTest = null;
    let originalLimiterMove = null;
    let originalLimiterClamp = null;

    function applyLargeLimits() {
        const codec = Codecs["java_block"];
        if (codec && codec.format && codec.format.cube_size_limiter) {
            const limiter = codec.format.cube_size_limiter;

            originalCoordinateLimits = limiter.coordinate_limits;
            originalLimiterTest = limiter.test;
            originalLimiterMove = limiter.move;
            originalLimiterClamp = limiter.clamp;

            limiter.coordinate_limits = [-Infinity, Infinity];
            limiter.test = () => false;
            limiter.move = () => { };
            limiter.clamp = () => { };
        }
    }

    function restoreOriginalLimits() {
        const codec = Codecs["java_block"];
        if (codec && codec.format && codec.format.cube_size_limiter) {
            const limiter = codec.format.cube_size_limiter;

            if (originalCoordinateLimits)
                limiter.coordinate_limits = originalCoordinateLimits;
            if (originalLimiterTest) limiter.test = originalLimiterTest;
            if (originalLimiterMove) limiter.move = originalLimiterMove;
            if (originalLimiterClamp) limiter.clamp = originalLimiterClamp;
        }
    }

    function showExportDialog(scale) {
        if (suppressDialog) return;

        const command = `/data modify entity @e[limit=1,sort=nearest,type=minecraft:item_display] transformation.scale set value [${scale}f,${scale}f,${scale}f]`;

        let dialogForm = {
            info: {
                type: "info",
                text: `<h3>Your model was scaled down by a factor of <strong>${scale}x</strong>.</h3>\nTo restore its size in-game, stand close to the item_display and run the following command:`,
            },
            command: {
                type: "textarea",
                value: `${command}`,
                readonly: true,
                height: 82,
            },
            dontShow: {
                type: "checkbox",
                label: "Do not show again for this session",
                value: false,
            },
        };

        if (settings.dialog_larger_cubes && settings.dialog_larger_cubes.value) {
            dialogForm.limitDialog = {
                type: "info",
                text: `<hr>Also, it looks like you have the "Model Too Large" dialog enabled. You may want to disable it in Settings > Dialogs.`,
            };
        }

        new Dialog("no_java_limits_popup", {
            id: "no_java_limits_popup",
            title: "NoJavaLimits: Scale Applied",
            form: dialogForm,
            onConfirm: function (formData) {
                if (formData.dontShow) {
                    suppressDialog = true;
                }
                this.hide();
            },
        }).show();
    }

    function scaleModel(factor) {
        if (!Project || !Format || Format.id !== "java_block") {
            Blockbench.showStatusMessage(
                "This tool only works on Java Block/Item models.",
                2000,
            );
            return;
        }

        Undo.initEdit({
            elements: Cube.all,
            outliner: Group.all,
            project: Project,
        });

        const scaleWithOffset = (value, f) =>
            Math.round(((value - OFFSET) * f + OFFSET) * 1e8) / 1e8;

        Cube.all.forEach((cube) => {
            cube.from = cube.from.map((v) => scaleWithOffset(v, factor));
            cube.to = cube.to.map((v) => scaleWithOffset(v, factor));
            cube.origin = cube.origin.map((v) => scaleWithOffset(v, factor));
            if (cube.inflate !== undefined) {
                cube.inflate = Math.round(cube.inflate * factor * 1e8) / 1e8;
            }
        });

        Group.all.forEach((group) => {
            group.origin = group.origin.map((v) => scaleWithOffset(v, factor));
        });

        Canvas.updateAll();
        Undo.finishEdit(`Scale model by ${factor}x`);
        Blockbench.showStatusMessage(`Scaled model by ${factor}x`, 2000);
    }

    function createActions() {
        scaleUpAction = new Action("no_java_limits_scale_up", {
            name: "Scale Model ×2",
            icon: "zoom_in",
            category: "transform",
            condition: () => Format && Format.id === "java_block",
            click: () => scaleModel(2),
        });

        scaleDownAction = new Action("no_java_limits_scale_down", {
            name: "Scale Model ×0.5",
            icon: "zoom_out",
            category: "transform",
            condition: () => Format && Format.id === "java_block",
            click: () => scaleModel(0.5),
        });

        if (MenuBar.menus.transform) {
            MenuBar.menus.transform.addAction(scaleUpAction);
            MenuBar.menus.transform.addAction(scaleDownAction);
        } else {
            MenuBar.addAction(scaleUpAction, "tools");
            MenuBar.addAction(scaleDownAction, "tools");
        }
    }

    function removeActions() {
        if (scaleUpAction) scaleUpAction.delete();
        if (scaleDownAction) scaleDownAction.delete();
    }

    let originalCompile = null;
    let originalParse = null;

    function hookExport() {
        const codec = Codecs["java_block"];
        if (!codec || originalCompile) return;

        // Import
        originalParse = codec.parse.bind(codec);
        codec.parse = function (data, path) {
            let json;
            let isString = typeof data === "string";

            if (isString) {
                try {
                    json = JSON.parse(data);
                } catch (e) {
                    return originalParse(data, path);
                }
            } else {
                json = data;
            }

            if (json && json.no_java_limits_scale) {
                const scale = json.no_java_limits_scale;

                if (Array.isArray(json.elements)) {
                    for (const el of json.elements) {
                        const sc = (v) =>
                            Math.round((v - OFFSET) * scale * 1e8) / 1e8 + OFFSET;

                        if (Array.isArray(el.from)) el.from = el.from.map(sc);
                        if (Array.isArray(el.to)) el.to = el.to.map(sc);
                        if (el.rotation && Array.isArray(el.rotation.origin)) {
                            el.rotation.origin = el.rotation.origin.map(sc);
                        }
                        if (el.inflate) {
                            el.inflate = Math.round(el.inflate * scale * 1e8) / 1e8;
                        }
                    }
                }

                delete json.no_java_limits_scale;

                if (isString) {
                    data = JSON.stringify(json);
                }
            }

            return originalParse(data, path);
        };

        // Export
        originalCompile = codec.compile.bind(codec);
        codec.compile = function (options) {
            const result = originalCompile(options);

            let json, wasString;
            if (typeof result === "string") {
                try {
                    json = JSON.parse(result);
                    wasString = true;
                } catch (e) {
                    return result;
                }
            } else {
                json = result;
                wasString = false;
            }

            if (json && Array.isArray(json.elements)) {
                let maxDist = 0;

                for (const el of json.elements) {
                    const inflate = el.inflate || 0;

                    if (Array.isArray(el.from)) {
                        el.from.forEach(
                            (v) =>
                                (maxDist = Math.max(maxDist, Math.abs(v - inflate - OFFSET))),
                        );
                    }
                    if (Array.isArray(el.to)) {
                        el.to.forEach(
                            (v) =>
                                (maxDist = Math.max(maxDist, Math.abs(v + inflate - OFFSET))),
                        );
                    }
                    if (el.rotation && Array.isArray(el.rotation.origin)) {
                        el.rotation.origin.forEach(
                            (v) => (maxDist = Math.max(maxDist, Math.abs(v - OFFSET))),
                        );
                    }
                }

                let power = 0;
                while (maxDist / Math.pow(2, power) > LIMIT_DIST + 0.0001) {
                    power++;
                }

                if (power > 0) {
                    const scaleFactor = Math.pow(2, -power);
                    const inverseScale = Math.pow(2, power);

                    for (const el of json.elements) {
                        const sc = (v) =>
                            Math.round((v - OFFSET) * scaleFactor * 1e8) / 1e8 + OFFSET;

                        if (Array.isArray(el.from)) el.from = el.from.map(sc);
                        if (Array.isArray(el.to)) el.to = el.to.map(sc);
                        if (el.rotation && Array.isArray(el.rotation.origin)) {
                            el.rotation.origin = el.rotation.origin.map(sc);
                        }
                        if (el.inflate) {
                            el.inflate = Math.round(el.inflate * scaleFactor * 1e8) / 1e8;
                        }
                    }

                    let reorderedJson = {};
                    let scaleInjected = false;

                    for (let key in json) {
                        reorderedJson[key] = json[key];
                        if (key === "credit") {
                            reorderedJson.no_java_limits_scale = inverseScale;
                            scaleInjected = true;
                        }
                    }
                    if (!scaleInjected) {
                        reorderedJson.no_java_limits_scale = inverseScale;
                    }

                    json = reorderedJson;

                    showExportDialog(inverseScale);
                }
            }

            return wasString ? JSON.stringify(json, null, "\t") : json;
        };
    }

    function unhookExport() {
        const codec = Codecs["java_block"];
        if (codec && originalCompile) {
            codec.compile = originalCompile;
            originalCompile = null;
        }
        if (codec && originalParse) {
            codec.parse = originalParse;
            originalParse = null;
        }
    }

    BBPlugin.register(PLUGIN_ID, {
        title: "No Java Limits",
        author: "Rajdacz",
        description:
            "Allows creating infinite-sized models for use in display entities.",
        icon: "zoom_out_map",
        tags: ["Minecraft: Java Edition", "Display Entities"],
        variant: "both",
        version: "1.0.0",
        onload() {
            hookExport();
            applyLargeLimits();
            createActions();
            suppressDialog = false;
        },
        onunload() {
            unhookExport();
            removeActions();
            restoreOriginalLimits();
        },
    });
})();
