(() => {
    let constants, ranges, booleans, enabledBooleans, functionHints, animDocs
    Plugin.register("emf_animation_addon", {
        title: "EMF Animation Addon",
        icon: "icon.png",
        author: "Traben & Ewan Howell",
        description: "Adds extra animation support to CEM Template Loader so that it is compatible with the Entity Model Features mod.",
        tags: ["Minecraft: Java Edition", "Entity Models", "Animation"],
        version: "1.0.0",
        min_version: "4.9.0",
        variant: "both",
        dependencies: ["cem_template_loader"],
        onload() {
            new Setting("emf_features", {
                value: true,
                category: "edit",
                name: "Enable EMF only animation features",
                description: "Enable animation features that are only compatible with the Entity Model Features mod. WARNING: These animations will cause the model to fail to load when using OptiFine.",
                onChange() {
                    unload()
                    load()
                }
            })


            constants = {
                e: 2.718281828459045,
                nan: NaN,
                //add: (...args) => args.reduce((a, e) => a + e, 0)
                catch: (x, c, id) => {
                    if (x === undefined || typeof x !== 'number') {
                        console.log(`catch print(${id}) = x was undefined or not a number type`)
                        return c
                    }
                    if (!Number.isNaN(x)) return x
                    console.log(`catch print(${id}) = x was NaN`)
                    return c
                },
                wrapdeg: wrapDegrees,
                wraprad: (r) => Math.degToRad(wrapDegrees(Math.radToDeg(r))),
                degdiff: angleBetween,
                raddiff: (a, b) => Math.degToRad(angleBetween(Math.radToDeg(a), Math.radToDeg(b))),
                randomb: (seed) => {
                    if (!seed) return Math.random() >= 0.5
                    seed = optifineAnimationVariables.constants.frac(seed * 123.34)
                    seed += seed * (seed + 45.32)
                    return optifineAnimationVariables.constants.frac(seed * seed) >= 0.5
                },
                // ifb: (...args) => {
                //     if (args.length < 3 || args.length % 2 !== 1 || typeof args[0] !== "boolean") throw Error
                //     for (let i = 0; i < args.length; i += 2) {
                //         if (i === args.length - 1) {
                //             if (typeof args[i] === "number") throw Error("Ifb statements cannot return a <strong>number</strong>")
                //             return args[i]
                //         } else if (args[i]) {
                //             if (typeof args[i + 1] === "number") throw Error("Ifb statements cannot return a <strong>number</strong>")
                //             return args[i + 1]
                //         }
                //     }
                // },
                easeinquad: easeInQuad,
                easeoutquad: easeOutQuad,
                easeinoutquad: easeInOutQuad,
                easeincubic: easeInCubic,
                easeoutcubic: easeOutCubic,
                easeinoutcubic: easeInOutCubic,
                easeinquart: easeInQuart,
                easeoutquart: easeOutQuart,
                easeinoutquart: easeInOutQuart,
                easeinquint: easeInQuint,
                easeoutquint: easeOutQuint,
                easeinoutquint: easeInOutQuint,
                easeinsine: easeInSine,
                easeoutsine: easeOutSine,
                easeinoutsine: easeInOutSine,
                easeinexpo: easeInExpo,
                easeoutexpo: easeOutExpo,
                easeinoutexpo: easeInOutExpo,
                easeincirc: easeInCirc,
                easeoutcirc: easeOutCirc,
                easeinoutcirc: easeInOutCirc,
                easeinelastic: easeInElastic,
                easeoutelastic: easeOutElastic,
                easeinoutelastic: easeInOutElastic,
                easeinbounce: easeInBounce,
                easeoutbounce: easeOutBounce,
                easeinoutbounce: easeInOutBounce,
                easeinback: easeInBack,
                easeoutback: easeOutBack,
                easeinoutback: easeInOutBack,
                quadbezier: quadraticBezier,
                cubicbezier: cubicBezier,
                hermite: hermiteInterpolation,
                catmullrom: (t, p0, p1, p2, p3) => {
                    let t2 = t * t;
                    let t3 = t * t2;
                    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
                },
                keyframe: keyframe,
                keyframeloop: (k, ...args) => {
                    if (args.length < 2) throw Error
                    if (typeof k !== "number") throw Error
                    //normal keyframe bounds
                    if (k < args.length - 1) return keyframe(k, ...args)
                    //loop keyframe
                    args.push(args[0])
                    let boundedK = k % (args.length - 1)
                    return keyframe(boundedK, ...args)
                }
            }
            ranges = {
                // zeroToHundred: [0, 50, 100],
                // start30Jump15: [0, 30, 90, 15]
                move_forward: [-1, 0, 1, 0.01],
                move_strafing: [-1, 0, 1, 0.01],
                height_above_ground: [0, 0, 128, 0.25],
                fluid_depth: [0, 0, 64],
                fluid_depth_up: [0, 0, 64],
                fluid_depth_down: [0, 0, 64],
                distance: [0, 0, 128, 0.25],
            }
            booleans = ["is_climbing", "is_crawling", "is_swimming", "is_gliding", "is_blocking","is_first_person_hand","is_swinging_right_arm", "is_swinging_left_arm"]
            enabledBooleans = ["is_right_handed"]


            functionHints = {
                "catch()": "catch(x, c, id)",
                "wrapdeg()": "wrapdeg(x)",
                "wraprad()": "wraprad(x)",
                "degdiff()": "degdiff(x, y)",
                "raddiff()": "raddiff(x, y)",
                "easeinquad()": "easeinquad(k, x, y)",
                "easeoutquad()": "easeoutquad(k, x, y)",
                "easeinoutquad()": "easeinoutquad(k, x, y)",
                "easeincubic()": "easeincubic(k, x, y)",
                "easeoutcubic()": "easeoutcubic(k, x, y)",
                "easeinoutcubic()": "easeinoutcubic(k, x, y)",
                "easeinquart()": "easeinquart(k, x, y)",
                "easeoutquart()": "easeoutquart(k, x, y)",
                "easeinoutquart()": "easeinoutquart(k, x, y)",
                "easeinquint()": "easeinquint(k, x, y)",
                "easeoutquint()": "easeoutquint(k, x, y)",
                "easeinoutquint()": "easeinoutquint(k, x, y)",
                "easeinsine()": "easeinsine(k, x, y)",
                "easeoutsine()": "easeoutsine(k, x, y)",
                "easeinoutsine()": "easeinoutsine(k, x, y)",
                "easeinexpo()": "easeinexpo(k, x, y)",
                "easeoutexpo()": "easeoutexpo(k, x, y)",
                "easeinoutexpo()": "easeinoutexpo(k, x, y)",
                "easeincirc()": "easeincirc(k, x, y)",
                "easeoutcirc()": "easeoutcirc(k, x, y)",
                "easeinoutcirc()": "easeinoutcirc(k, x, y)",
                "easeinelastic()": "easeinelastic(k, x, y)",
                "easeoutelastic()": "easeoutelastic(k, x, y)",
                "easeinoutelastic()": "easeinoutelastic(k, x, y)",
                "easeinbounce()": "easeinbounce(k, x, y)",
                "easeoutbounce()": "easeoutbounce(k, x, y)",
                "easeinoutbounce()": "easeinoutbounce(k, x, y)",
                "easeinback()": "easeinback(k, x, y)",
                "easeoutback()": "easeoutback(k, x, y)",
                "easeinoutback()": "easeinoutback(k, x, y)",
                "quadbezier()": "quadbezier(k, x, y, z)",
                "cubicbezier()": "cubicbezier(k, x, y, z, w)",
                "hermite()": "hermite(k, x, y, z, w)",
                "catmullrom()": "catmullrom(k, x, y, z, w)",
                "keyframe()": "keyframe(k, a, b, c,...)",
                "keyframeloop()": "keyframeloop(k, a, b, c,...)",
                "randomb()": "randomb(seed)"
            }

            animDocs = {
                name: "EMF addon",
                icon: "keyboard_capslock",
                elements: [
                    {
                        "type": "heading",
                        "text": "Entity Model Features (EMF) Addon Docs"
                    },
                    {
                        "type": "text",
                        "text": "The EMF Addon adds extra functions and variables to the CEM Template Loader that are only compatible with the Entity Model Features mod. These features will cause the model to fail to load when using OptiFine. You may choose to put such breaking models into the emf/cem/ folder rather than optifine/cem/ if you wish to use both in the same pack."
                    },
                    // todo not supported in template loader
                    // {
                    // "type": "heading",
                    // "text": "Global variables"
                    // },
                    // {
                    //     "type": "text",
                    //     "text": "Global variables are a way of storing data between entities. You can then use these variables inside any other animations."
                    // },
                    // {
                    //     "type": "table",
                    //     "tableType": "list",
                    //     "rows": [
                    //         [
                    //             "global_var.&lt;name&gt;",
                    //             "Store a value in a named variable"
                    //         ],
                    //         [
                    //             "global_varb.&lt;name&gt;",
                    //             "Store a boolean in a named variable"
                    //         ]
                    //     ]
                    // },
                    {
                        "type": "heading",
                        "text": "Constants"
                    },
                    {
                        "type": "table",
                        "tableType": "list",
                        "rows": [
                            [
                                "e",
                                "Euler's number 2.718281....."
                            ],
                            [
                                "nan",
                                "throws an error, used for debugging, bypasses the initial validation checks"
                            ]
                        ]
                    },
                    {
                        "type": "heading",
                        "text": "Entity parameters (float)"
                    },
                    {
                        "type": "table",
                        "tableType": "list",
                        "rows": [
                            [
                                "move_forward",
                                    "The entity's current movement in the direction they are facing. Ranges from -1 to 1 denoting the Y axis intercept of a unit circle of the players current movement vector."
                            ],
                            [
                                "move_strafing",
                                    "The entity's current movement in the direction 90 degrees to the right of their facing direction. Ranges from -1 to 1 denoting the X axis intercept of a unit circle of the players current movement vector."
                            ],
                            // [
                            //     "distance",
                            //     "silently deprecate"
                            // ],
                            [
                                "height_above_ground",
                                    "The distance the entity is above the ground, ground being the highest point below the entity with a collidable block"
                            ],
                            [   "fluid_depth",
                                    "The depth of the fluid above and below a submerged entity, 0 if not submerged"
                            ],
                            [   "fluid_depth_down",
                                    "The depth of the fluid below a submerged entity, 0 if not submerged"
                            ],
                            [   "fluid_depth_up",
                                    "The depth of the fluid above a submerged entity, 0 if not submerged"
                            ]

                        ]
                    },
                    {
                        "type": "heading",
                        "text": "Entity parameters (boolean)"
                    },
                    {
                        "type": "table",
                        "tableType": "list",
                        "rows": [
                            [
                                "is_climbing",
                                "If the entity is climbing a climbable block or is a spider on a wall."
                            ],
                            [
                                "is_blocking",
                                "If the entity is blocking with a shield."
                            ],
                            [
                                "is_crawling",
                                "If the entity is crawling."
                            ],
                            [
                                "is_jumping",
                                "If the entity is jumping."
                            ],
                            [
                                "is_swimming",
                                "If the entity is in its swimming pose."
                            ],
                            [
                                "is_right_handed",
                                "If the biped entity is right handed."
                            ],
                            [
                                "is_swinging_right_arm",
                                "If the biped entity is swinging it's right arm."
                            ],
                            [
                                "is_swinging_left_arm",
                                "If the biped entity is swinging it's left arm."
                            ],
                            [
                                "is_first_person_hand",
                                "If the model part being rendered is the first person player hand."
                            ]
                        ]
                    },
                    {
                        "type": "heading",
                        "text": "Functions"
                    },
                    {
                        "type": "table",
                        "tableType": "list",
                        "rows": [
                            [
                                "catch(x, c, id)",
                                "Returns x if x is not NaN or has an Error, otherwise returns c. id is optional, if it is added the catch function will print the reason c was used to the game log with this id."
                            ],
                            [
                                "wrapdeg(x)",
                                "Wraps the degree value x to the range -180 to 180 that it matches."
                            ],
                            [
                                "wraprad(x)",
                                "Wraps the radian value x to the range -pi to pi that it matches."
                            ],
                            [
                                "degdiff(x, y)",
                                "Returns the shortest angular degree difference between two degree values x and y."
                            ],
                            [
                                "raddiff(x, y)",
                                "Returns the shortest angular radian difference between two radian values x and y."
                            ]
                        ]
                    },
                    {
                        "type": "heading",
                        "text": "Boolean functions"
                    },
                    {
                        "type": "table",
                        "tableType": "list",
                        "rows": [
                            [
                                "randomb(seed)",
                                "Random boolean true|false. Providing a seed will always return the same result. The seed is optional."
                            ]
                        ]
                    },
                    {
                        "type": "heading",
                        "text": "Interpolation functions"
                    },
                    {
                        "type": "text",
                        "text": "EMF adds multiple variations of the <strong>lerp(k, x, y)</strong> interpolation function, most of these can be seen in more detail, and with interactive graphs, on <span style=\"color:dodgerblue\"><a href=\"https://easings.net/\">this website</a></span>"
                    },
                    {
                        "type": "table",
                        "tableType": "list",
                        "rows": getEaseFuncs()
                    },
                ]
            }

            setTimeout(load, 0)
        },
        onunload : unload
    })

    function getEaseFuncs() {
        let easeFuncs = []
        for (const val of Object.values(functionHints)) {
            if (val.startsWith("ease")) {
                easeFuncs.push([
                    val,
                    ""
                ])
            }
        }

        easeFuncs.push([
            "quadbezier(k, x, y, z)",
            ""
        ])
        easeFuncs.push([
            "cubicbezier(k, x, y, z, w)",
            ""
        ])
        easeFuncs.push([
            "hermite(k, x, y, z, w)",
            ""
        ])
        easeFuncs.push([
            "catmullrom(k, x, y, z, w)",
            ""
        ])

        return easeFuncs
    }

    function load() {
        if (settings.emf_features.value) {
            //add autocompletes - auto generated
            for (const key of Object.keys(ranges)) optifineAnimationVariables.autocomplete.push(key)
            for (const key of Object.keys(constants)) optifineAnimationVariables.autocomplete.push(typeof constants[key] === "function" ? `${key}()` : key)
            //add autocompletes - manual
            Object.assign(optifineAnimationVariables.autocompleteLabels, functionHints)

            //add variables and functions
            Object.assign(optifineAnimationVariables.constants, constants)
            Object.assign(optifineAnimationVariables.ranges, ranges)

            //add booleans
            for (const boolean of booleans) {
                optifineAnimationVariables.booleans.add(boolean)
                //add autocomplete
                optifineAnimationVariables.autocomplete.push(boolean)
            }
            for (const boolean of enabledBooleans) {
                optifineAnimationVariables.booleans.add(boolean)
                optifineAnimationVariables.enabledBooleans.add(boolean)
                //add autocomplete
                optifineAnimationVariables.autocomplete.push(boolean)
            }
            //add  animation documentation
            optifineAnimationDocumentation.custom.push(animDocs)
            optifineAnimationDocumentation.shown = false
        }
        setTimeout(() => {
            if (Format.id === "optifine_entity") {
                Panels.cem_animation.inside_vue.change()
            }
        }, 0)
    }

    function unload() {

        //remove auto completes
        for (const key of Object.keys(ranges))
            globalThis.optifineAnimationVariables?.autocomplete.splice(globalThis.optifineAnimationVariables?.autocomplete.indexOf(key), 1)
        for (const key of Object.keys(constants)) {
            globalThis.optifineAnimationVariables?.autocomplete.splice(globalThis.optifineAnimationVariables?.autocomplete.indexOf(typeof constants[key] === "function" ? `${key}()` : key), 1)
        }
        for (const key of Object.keys(functionHints)) delete globalThis.optifineAnimationVariables?.autocompleteLabels[key]

        //remove functions and variables
        for (const key of Object.keys(constants)) delete globalThis.optifineAnimationVariables?.constants[key]
        for (const key of Object.keys(ranges)) delete globalThis.optifineAnimationVariables?.ranges[key]

        //remove booleans
        for (const boolean of booleans) {
            globalThis.optifineAnimationVariables?.booleans.delete(boolean)
            //remove auto complete
            globalThis.optifineAnimationVariables?.autocomplete.splice(globalThis.optifineAnimationVariables?.autocomplete.indexOf(boolean), 1)
        }
        for (const boolean of enabledBooleans) {
            globalThis.optifineAnimationVariables?.booleans.delete(boolean)
            globalThis.optifineAnimationVariables?.enabledBooleans.delete(boolean)
            //remove auto complete
            globalThis.optifineAnimationVariables?.autocomplete.splice(globalThis.optifineAnimationVariables?.autocomplete.indexOf(boolean), 1)
        }

        //remove docs //todo needed?
        globalThis.optifineAnimationDocumentation?.custom.splice(globalThis.optifineAnimationDocumentation?.custom.indexOf(animDocs), 1)
        globalThis.optifineAnimationDocumentation.shown = false
    }

    function keyframe(k, ...args) {
        if (args.length < 2) throw Error
        if (typeof k !== "number") throw Error

        //get lower lerp value
        let minIndex = Math.floor(k)
        //return min if below 0
        if (minIndex < 0) return args[0]
        //return max if above max index
        if (minIndex >= args.length - 1) return args[args.length - 1]
        let min = args[minIndex]
        //get upper lerp value
        let maxIndex = minIndex + 1
        let max = args[maxIndex]
        if (typeof min !== "number" || typeof max !== "number") throw Error

        return Math.lerp(k - minIndex, min, max)

    }


    function wrapDegrees(degrees) {
        let d = degrees % 360.0;
        if (d >= 180.0) {
            d -= 360.0;
        }
        if (d < -180.0) {
            d += 360.0;
        }
        return d;
    }


    function angleBetween(first, second) {
        let v = wrapDegrees(second - first);
        return v < 0 ? -v : v
    }

    function easeInQuad(t, start, end) {
        let delta = end - start;
        return start + delta * t * t;
    }

    function easeOutQuad(t, start, end) {
        let delta = end - start;
        return start + delta * -t * (t - 2);
    }

    function easeInOutQuad(t, start, end) {
        let delta = end - start;
        if (t < 0.5) {
            return start + delta * (2 * t * t);
        } else {
            return start + delta * (-2 * t * (t - 2) - 1);
        }
    }

    function easeInCubic(t, start, end) {
        let delta = end - start;
        return start + delta * t * t * t;
    }

    function easeOutCubic(t, start, end) {
        let delta = end - start;
        return start + delta * ((t = t - 1) * t * t + 1);
    }

    function easeInOutCubic(t, start, end) {
        let delta = end - start;
        if (t < 0.5) {
            return start + delta * 4 * t * t * t;
        } else {
            return start + delta * ((t = t - 1) * (2 * t * t + 2) + 1);
        }
    }

    function easeInQuart(t, start, end) {
        let delta = end - start;
        return start + delta * t * t * t * t;
    }

    function easeOutQuart(t, start, end) {
        let delta = end - start;
        return start + delta * ((t = t - 1) * t * t * t + 1);
    }

    function easeInOutQuart(t, start, end) {
        let delta = end - start;
        if (t < 0.5) {
            return start + delta * 8 * t * t * t * t;
        } else {
            return start + delta * ((t = t - 1) * (8 * t * t * t + 1) + 1);
        }
    }

    function easeInQuint(t, start, end) {
        let delta = end - start;
        return start + delta * t * t * t * t * t;
    }

    function easeOutQuint(t, start, end) {
        let delta = end - start;
        return start + delta * ((t = t - 1) * t * t * t * t + 1);
    }

    function easeInOutQuint(t, start, end) {
        let delta = end - start;
        if (t < 0.5) {
            return start + delta * 16 * t * t * t * t * t;
        } else {
            return start + delta * ((t = t - 1) * (16 * t * t * t * t + 1) + 1);
        }
    }

    function easeInSine(t, start, end) {
        let delta = end - start;
        return start + delta * (1 - Math.cos(t * Math.PI / 2));
    }

    function easeOutSine(t, start, end) {
        let delta = end - start;
        return start + delta * Math.sin(t * Math.PI / 2);
    }

    function easeInOutSine(t, start, end) {
        let delta = end - start;
        return start + delta * (-0.5 * (Math.cos(Math.PI * t) - 1));
    }

    function easeInExpo(t, start, end) {
        let delta = end - start;
        return start + delta * Math.pow(2, 10 * (t - 1));
    }

    function easeOutExpo(t, start, end) {
        let delta = end - start;
        return start + delta * (-Math.pow(2, -10 * t) + 1);
    }

    function easeInOutExpo(t, start, end) {
        let delta = end - start;
        if (t < 1) {
            return start + delta * (0.5 * Math.pow(2, 10 * (t - 1)));
        } else {
            return start + delta * (0.5 * (-Math.pow(2, -10 * --t) + 2));
        }
    }

    function easeInCirc(t, start, end) {
        let delta = end - start;
        return start + delta * -(Math.sqrt(1 - t * t) - 1);
    }

    function easeOutCirc(t, start, end) {
        let delta = end - start;
        let tMinus1 = t - 1;
        return start + delta * Math.sqrt(1 - tMinus1 * tMinus1);
    }

    function easeInOutCirc(t, start, end) {
        let delta = end - start;
        let tTimes2 = t * 2;
        if (tTimes2 < 1) {
            return start + delta * (-0.5 * (Math.sqrt(1 - tTimes2 * tTimes2) - 1));
        } else {
            let tTimes2Minus2 = tTimes2 - 2;
            return start + delta * (0.5 * (Math.sqrt(1 - tTimes2Minus2 * tTimes2Minus2) + 1));
        }
    }

    function easeInElastic(t, start, end) {
        let delta = end - start;
        return start + delta * (-Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.3 / 4) * (2 * Math.PI) / 0.3));
    }

    function easeOutElastic(t, start, end) {
        let delta = end - start;
        return start + delta * (Math.pow(2, -10 * t) * Math.sin((t - 0.3 / 4) * (2 * Math.PI) / 0.3) + 1);
    }

    function easeInOutElastic(t, start, end) {
        let delta = end - start;
        if (t < 0.5) {
            return start + delta * (-0.5 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.225 / 4) * (2 * Math.PI) / 0.45));
        } else {
            return start + delta * (0.5 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - 0.225 / 4) * (2 * Math.PI) / 0.45) + 1);
        }
    }

    function easeInBounce(t, start, end) {
        let delta = end - start;
        return start + delta * (1 - easeOutBounce(1 - t, 0, 1));
    }

    function easeOutBounce(t, start, end) {
        let delta = end - start;
        if (t < (1 / 2.75)) {
            return start + delta * (7.5625 * t * t);
        } else if (t < (2 / 2.75)) {
            return start + delta * (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        } else if (t < (2.5 / 2.75)) {
            return start + delta * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        } else {
            return start + delta * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
        }
    }

    function easeInOutBounce(t, start, end) {
        let delta = end - start;
        if (t < 0.5) {
            return start + delta * (0.5 * easeInBounce(t * 2, 0, 1));
        } else {
            return start + delta * (0.5 * easeOutBounce(t * 2 - 1, 0, 1) + 0.5);
        }
    }

    function easeInBack(t, start, end) {
        let delta = end - start;
        return start + delta * (t * t * (2.70158 * t - 1.70158));
    }

    function easeOutBack(t, start, end) {
        let delta = end - start;
        return start + delta * ((--t) * t * (2.70158 * t + 1.70158) + 1);
    }

    function easeInOutBack(t, start, end) {
        let delta = end - start;
        if (t < 0.5) {
            return start + delta * (t * t * (7 * t - 2.5) * 2);
        } else {
            return start + delta * ((--t) * t * (7 * t + 2.5) + 2);
        }
    }

    function quadraticBezier(t, p0, p1, p2) {
        let oneMinusT = 1 - t;
        return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
    }

    function cubicBezier(t, p0, p1, p2, p3) {
        let oneMinusT = 1 - t;
        let oneMinusTSquared = oneMinusT * oneMinusT;
        let tSquared = t * t;
        return oneMinusTSquared * oneMinusT * p0 + 3 * oneMinusTSquared * t * p1 + 3 * oneMinusT * tSquared * p2 + tSquared * t * p3;
    }

    function hermiteInterpolation(t, p0, p1, m0, m1) {
        let tSquared = t * t;
        let tCubed = tSquared * t;

        let h00 = 2 * tCubed - 3 * tSquared + 1;
        let h10 = tCubed - 2 * tSquared + t;
        let h01 = -2 * tCubed + 3 * tSquared;
        let h11 = tCubed - tSquared;

        return h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1;
    }

})()


