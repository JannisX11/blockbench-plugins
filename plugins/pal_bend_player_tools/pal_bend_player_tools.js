(() => {
    const PLUGIN_ID = "pal_bend_player_tools";
    const SKIP = "pal.skip";
    const EPS_TICK = 0.001;
    const DEFAULT_EASING = "linear";
    const HELPER_SUFFIX = "_bend";
    const BEND_HELPER_BONES = {
        torso: "torso_bend",
        right_arm: "right_arm_bend",
        left_arm: "left_arm_bend",
        right_leg: "right_leg_bend",
        left_leg: "left_leg_bend"
    };
    const PAL_TO_DRAGONCORE_BONES = {
        body: "root",
        torso_bend: "Body_Lower",
        torso: "Body",
        head: "Head",
        right_arm: "Right_Arm",
        right_arm_bend: "Right_Arm_Lower",
        right_item: "Right_Hand",
        left_arm: "Left_Arm",
        left_arm_bend: "Left_Arm_Lower",
        left_item: "Left_Hand",
        right_leg: "Right_Leg",
        right_leg_bend: "Right_Leg_Lower",
        left_leg: "Left_Leg",
        left_leg_bend: "Left_Leg_Lower"
    };
    const EXACT_BONE_ALIASES = {
        root: "body",
        Root: "body",
        Body_Lower: "torso_bend",
        Body: "torso",
        Head: "head",
        Right_Arm: "right_arm",
        Right_Arm_Lower: "right_arm_bend",
        Right_Hand: "right_item",
        Left_Arm: "left_arm",
        Left_Arm_Lower: "left_arm_bend",
        Left_Hand: "left_item",
        Right_Leg: "right_leg",
        Right_Leg_Lower: "right_leg_bend",
        Left_Leg: "left_leg",
        Left_Leg_Lower: "left_leg_bend",
        bone: "right_item"
    };
    const NORMALIZED_BONE_ALIASES = {
        root: "body",
        body_lower: "torso_bend",
        right_hand: "right_item",
        left_hand: "left_item",
        bone: "right_item"
    };
    const DEFAULT_VALUES = {
        right_arm: [-5, 2, 0],
        left_arm: [5, 2, 0],
        left_leg: [1.9, 12, 0.1],
        right_leg: [-1.9, 12, 0.1]
    };
    const TRANSFORM_AXES = {
        position: ["x", "y", "z"],
        rotation: ["pitch", "yaw", "roll"],
        scale: ["scaleX", "scaleY", "scaleZ"],
        bend: ["bend"]
    };
    const VECTOR_AXES = ["x", "y", "z"];
    const PAL_RENDER_BONES = ["torso", "head", "right_arm", "left_arm", "right_leg", "left_leg", "right_item", "left_item", "cape", "elytra"];
    const PAL_DEFAULT_PIVOTS = {
        right_item: [6, 12, -2],
        left_item: [-6, 12, -2],
        right_arm: [5, 22, 0],
        left_arm: [-5, 22, 0],
        right_leg: [2, 12, 0],
        left_leg: [-2, 12, 0],
        torso: [0, 24, 0],
        head: [0, 24, 0],
        body: [0, 12, 0],
        cape: [0, 24, 2],
        elytra: [0, 24, 2]
    };
    const ANIM_TRANSFORMS = ["position", "rotation", "scale", "bend"];
    const EASING_NAMES = {
        linear: "LINEAR",
        constant: "CONSTANT",
        step: "STEP",
        easeinsine: "EASEINSINE",
        easeoutsine: "EASEOUTSINE",
        easeinoutsine: "EASEINOUTSINE",
        easeinquad: "EASEINQUAD",
        easeoutquad: "EASEOUTQUAD",
        easeinoutquad: "EASEINOUTQUAD",
        easeincubic: "EASEINCUBIC",
        easeoutcubic: "EASEOUTCUBIC",
        easeinoutcubic: "EASEINOUTCUBIC",
        easeinquart: "EASEINQUART",
        easeoutquart: "EASEOUTQUART",
        easeinoutquart: "EASEINOUTQUART",
        easeinquint: "EASEINQUINT",
        easeoutquint: "EASEOUTQUINT",
        easeinoutquint: "EASEINOUTQUINT",
        easeinexpo: "EASEINEXPO",
        easeoutexpo: "EASEOUTEXPO",
        easeinoutexpo: "EASEINOUTEXPO",
        easeincirc: "EASEINCIRC",
        easeoutcirc: "EASEOUTCIRC",
        easeinoutcirc: "EASEINOUTCIRC",
        easeinback: "EASEINBACK",
        easeoutback: "EASEOUTBACK",
        easeinoutback: "EASEINOUTBACK",
        easeinelastic: "EASEINELASTIC",
        easeoutelastic: "EASEOUTELASTIC",
        easeinoutelastic: "EASEINOUTELASTIC",
        easeinbounce: "EASEINBOUNCE",
        easeoutbounce: "EASEOUTBOUNCE",
        easeinoutbounce: "EASEINOUTBOUNCE",
        catmullrom: "CATMULLROM",
        bezier: "BEZIER"
    };
    const ANIM_EASING_PRETTY = {
        linear: "linear",
        constant: "constant",
        step: "step",
        catmullrom: "catmullrom",
        bezier: "bezier",
        easeinsine: "easeInSine",
        easeoutsine: "easeOutSine",
        easeinoutsine: "easeInOutSine",
        easeinquad: "easeInQuad",
        easeoutquad: "easeOutQuad",
        easeinoutquad: "easeInOutQuad",
        easeincubic: "easeInCubic",
        easeoutcubic: "easeOutCubic",
        easeinoutcubic: "easeInOutCubic",
        easeinquart: "easeInQuart",
        easeoutquart: "easeOutQuart",
        easeinoutquart: "easeInOutQuart",
        easeinquint: "easeInQuint",
        easeoutquint: "easeOutQuint",
        easeinoutquint: "easeInOutQuint",
        easeinexpo: "easeInExpo",
        easeoutexpo: "easeOutExpo",
        easeinoutexpo: "easeInOutExpo",
        easeincirc: "easeInCirc",
        easeoutcirc: "easeOutCirc",
        easeinoutcirc: "easeInOutCirc",
        easeinback: "easeInBack",
        easeoutback: "easeOutBack",
        easeinoutback: "easeInOutBack",
        easeinelastic: "easeInElastic",
        easeoutelastic: "easeOutElastic",
        easeinoutelastic: "easeInOutElastic",
        easeinbounce: "easeInBounce",
        easeoutbounce: "easeOutBounce",
        easeinoutbounce: "easeInOutBounce"
    };
    const PLAYER_MODEL_GEO = {
        "format_version": "1.12.0",
        "minecraft:geometry": [
            {
                "description": {
                    "identifier": "geometry.unknown",
                    "texture_width": 64,
                    "texture_height": 64,
                    "visible_bounds_width": 3,
                    "visible_bounds_height": 3.5,
                    "visible_bounds_offset": [0, 1.25, 0]
                },
                "bones": [
                    {"name": "body", "pivot": [0, 12, 0]},
                    {"name": "torso", "parent": "body", "pivot": [0, 24, 0], "cubes": [{"origin": [-4, 18, -2], "size": [8, 6, 4], "uv": {"north": {"uv": [20, 20], "uv_size": [8, 6]}, "east": {"uv": [16, 20], "uv_size": [4, 6]}, "south": {"uv": [32, 20], "uv_size": [8, 6]}, "west": {"uv": [28, 20], "uv_size": [4, 6]}, "up": {"uv": [20, 16], "uv_size": [8, 4]}, "down": {"uv": [28, 20], "uv_size": [8, -4]}}}]},
                    {"name": "torso_bend", "parent": "torso", "pivot": [0, 18, 0], "cubes": [{"origin": [-4, 12, -2], "size": [8, 6, 4], "uv": {"north": {"uv": [20, 26], "uv_size": [8, 6]}, "east": {"uv": [16, 26], "uv_size": [4, 6]}, "south": {"uv": [32, 26], "uv_size": [8, 6]}, "west": {"uv": [28, 26], "uv_size": [4, 6]}, "up": {"uv": [20, 16], "uv_size": [8, 4]}, "down": {"uv": [28, 20], "uv_size": [8, -4]}}}]},
                    {"name": "head", "parent": "body", "pivot": [0, 24, 0], "cubes": [{"origin": [-4, 24, -4], "size": [8, 8, 8], "uv": {"north": {"uv": [8, 8], "uv_size": [8, 8]}, "east": {"uv": [0, 8], "uv_size": [8, 8]}, "south": {"uv": [24, 8], "uv_size": [8, 8]}, "west": {"uv": [16, 8], "uv_size": [8, 8]}, "up": {"uv": [8, 0], "uv_size": [8, 8]}, "down": {"uv": [16, 8], "uv_size": [8, -8]}}}]},
                    {"name": "right_arm", "parent": "body", "pivot": [-5, 22, 0], "cubes": [{"origin": [-8, 18, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [44, 20], "uv_size": [4, 6]}, "east": {"uv": [40, 20], "uv_size": [4, 6]}, "south": {"uv": [52, 20], "uv_size": [4, 6]}, "west": {"uv": [48, 20], "uv_size": [4, 6]}, "up": {"uv": [44, 16], "uv_size": [4, 4]}, "down": {"uv": [48, 20], "uv_size": [4, -4]}}}]},
                    {"name": "right_arm_bend", "parent": "right_arm", "pivot": [-5, 18, 0], "cubes": [{"origin": [-8, 12, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [44, 26], "uv_size": [4, 6]}, "east": {"uv": [40, 26], "uv_size": [4, 6]}, "south": {"uv": [52, 26], "uv_size": [4, 6]}, "west": {"uv": [48, 26], "uv_size": [4, 6]}, "up": {"uv": [44, 16], "uv_size": [4, 4]}, "down": {"uv": [48, 20], "uv_size": [4, -4]}}}]},
                    {"name": "right_item", "parent": "right_arm_bend", "pivot": [-6, 12, -2], "cubes": [{"origin": [-6, 12.25, -11], "size": [0, 4, 11], "uv": {"north": {"uv": [32, 4], "uv_size": [0, 0]}, "east": {"uv": [32, 4], "uv_size": [0, 0]}, "south": {"uv": [32, 4], "uv_size": [0, 0]}, "west": {"uv": [32, 4], "uv_size": [0, 0]}, "up": {"uv": [32, 4], "uv_size": [0, 0]}, "down": {"uv": [32, 4], "uv_size": [0, 0]}}}]},
                    {"name": "left_arm", "parent": "body", "pivot": [5, 22, 0], "cubes": [{"origin": [4, 18, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [36, 52], "uv_size": [4, 6]}, "east": {"uv": [32, 52], "uv_size": [4, 6]}, "south": {"uv": [44, 52], "uv_size": [4, 6]}, "west": {"uv": [40, 52], "uv_size": [4, 6]}, "up": {"uv": [36, 48], "uv_size": [4, 4]}, "down": {"uv": [40, 52], "uv_size": [4, -4]}}}]},
                    {"name": "left_arm_bend", "parent": "left_arm", "pivot": [5, 18, 0], "cubes": [{"origin": [4, 12, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [36, 58], "uv_size": [4, 6]}, "east": {"uv": [32, 58], "uv_size": [4, 6]}, "south": {"uv": [44, 58], "uv_size": [4, 6]}, "west": {"uv": [40, 58], "uv_size": [4, 6]}, "up": {"uv": [36, 48], "uv_size": [4, 4]}, "down": {"uv": [40, 52], "uv_size": [4, -4]}}}]},
                    {"name": "left_item", "parent": "left_arm_bend", "pivot": [6, 12, -2], "cubes": [{"origin": [6, 12.25, -11], "size": [0, 4, 11], "uv": {"north": {"uv": [33, 4], "uv_size": [0, 0]}, "east": {"uv": [33, 4], "uv_size": [0, 0]}, "south": {"uv": [33, 4], "uv_size": [0, 0]}, "west": {"uv": [33, 4], "uv_size": [0, 0]}, "up": {"uv": [33, 4], "uv_size": [0, 0]}, "down": {"uv": [33, 4], "uv_size": [0, 0]}}}]},
                    {"name": "right_leg", "parent": "body", "pivot": [-2, 12, 0], "cubes": [{"origin": [-4, 6, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [4, 20], "uv_size": [4, 6]}, "east": {"uv": [0, 20], "uv_size": [4, 6]}, "south": {"uv": [12, 20], "uv_size": [4, 6]}, "west": {"uv": [8, 20], "uv_size": [4, 6]}, "up": {"uv": [4, 16], "uv_size": [4, 4]}, "down": {"uv": [8, 20], "uv_size": [4, -4]}}}]},
                    {"name": "right_leg_bend", "parent": "right_leg", "pivot": [-2, 6, 0], "cubes": [{"origin": [-4, 0, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [4, 26], "uv_size": [4, 6]}, "east": {"uv": [0, 26], "uv_size": [4, 6]}, "south": {"uv": [12, 26], "uv_size": [4, 6]}, "west": {"uv": [8, 26], "uv_size": [4, 6]}, "up": {"uv": [4, 16], "uv_size": [4, 4]}, "down": {"uv": [8, 20], "uv_size": [4, -4]}}}]},
                    {"name": "left_leg", "parent": "body", "pivot": [2, 12, 0], "cubes": [{"origin": [0, 6, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [20, 52], "uv_size": [4, 6]}, "east": {"uv": [16, 52], "uv_size": [4, 6]}, "south": {"uv": [28, 52], "uv_size": [4, 6]}, "west": {"uv": [24, 52], "uv_size": [4, 6]}, "up": {"uv": [20, 48], "uv_size": [4, 4]}, "down": {"uv": [24, 52], "uv_size": [4, -4]}}}]},
                    {"name": "left_leg_bend", "parent": "left_leg", "pivot": [2, 6, 0], "cubes": [{"origin": [0, 0, -2], "size": [4, 6, 4], "uv": {"north": {"uv": [20, 58], "uv_size": [4, 6]}, "east": {"uv": [16, 58], "uv_size": [4, 6]}, "south": {"uv": [28, 58], "uv_size": [4, 6]}, "west": {"uv": [24, 58], "uv_size": [4, 6]}, "up": {"uv": [20, 48], "uv_size": [4, 4]}, "down": {"uv": [24, 52], "uv_size": [4, -4]}}}]}
                ]
            }
        ]
    };
    // Bone names stay in PAL/player_model.geo form; only parent/pivot mirrors the DragonCore-friendly reference rig.
    const DRAGONCORE_COMPATIBLE_BONE_SETUP = {
        body: {parent: null, pivot: [0, 0, 0]},
        torso_bend: {parent: "body", pivot: [0, 12, 0]},
        torso: {parent: "torso_bend", pivot: [0, 18, 0]},
        head: {parent: "torso", pivot: [0, 24, 0]},
        right_arm: {parent: "torso", pivot: [-6, 23, 0]},
        right_arm_bend: {parent: "right_arm", pivot: [-6, 18, 0]},
        right_item: {parent: "right_arm_bend", pivot: [-5.5, 13.25, -1]},
        left_arm: {parent: "torso", pivot: [6, 23, 0]},
        left_arm_bend: {parent: "left_arm", pivot: [6, 18, 0]},
        left_item: {parent: "left_arm_bend", pivot: [5.5, 13.25, -1]},
        right_leg: {parent: "body", pivot: [-2, 12, 0]},
        right_leg_bend: {parent: "right_leg", pivot: [-2, 6, 0]},
        left_leg: {parent: "body", pivot: [2, 12, 0]},
        left_leg_bend: {parent: "left_leg", pivot: [2, 6, 0]}
    };
    const DRAGONCORE_COMPATIBLE_PLAYER_MODEL_GEO = makePlayerModelVariant(PLAYER_MODEL_GEO, DRAGONCORE_COMPATIBLE_BONE_SETUP);
    const DRAGONCORE_PLAYER_MODEL_GEO = makePlayerModelVariant(PLAYER_MODEL_GEO, DRAGONCORE_COMPATIBLE_BONE_SETUP, PAL_TO_DRAGONCORE_BONES);
    const PLAYER_MODEL_TEXTURE_NAME = "player_model.geo.png";
    const PLAYER_MODEL_TEXTURE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAI3klEQVR4Aeyaf2ydVRnHn3tvuV1/7RYmmwtLFpIB+4/VVaMlpk6kROMWEslEGusIRHRB/9AmxhCyMAiKAiphpn8pLEGnMULWaCJRTM2YWdamOOJgc4iDyWg3oHf9tXa9fTmfc/u8Pfe9P9576duul/Tmfu/znOd5zrnn+z3nfe9tz41LyOOa5pgHmpNirfq06xPifX9ba0mEDH/Z06ECMMPxCU9STQmpSeSWJxNks5iYnhFwOj3u22xmeb/mMioyV8iTGpvMYPIA6cGz7wo4MzJmbV5RIOAFHoH0kjVDBWD1mc1MZlYyM3giDfUxuyOw2Uj1voYK4JJM1IhcnPbyLoXqpS8SKgDkWH2I4zfWORc+AYOLl+a2hvGr7VmWAJCH+KpkTLgPnBvJ5PBcdUWNbGhuzEFOQYFGLPAoULIkoXg576LEEYL6uloRdgU+2JhqkEIgt9wRX1Mvngs+5zevr/c2rklYJBPZLc8OgIzeCPHBH44NCvjTa8flwOCAPH2k3+I3/f0CGA/wvQEL8AHfIxjjciJvB/BZPzo5aedUl6yV6Ux2u7Piq+tqZOP6lGy4OuXfCKkhdy494cdsZ+eFTxI+ShnbCYv7PcKNL6UfZ2Unp7JvyVbPemKvdRXil7u+Kj333SVPde+Wh7/+FXnkW9+QJ752mzTV1Qk1EKQfQmABYybnGEKeGPcP7HJCfHo6I6l6EYRghWjPZjy/DfnE6kaZHZuQ2fExmR5JWzt7aUoe2vF5u+pKkHsE4wA+MiHsiqOXDx+t9MFebjH8SwDiwOxk6f7cTfL47V+2c4P8Lff/WJ4ZaBFESDan5Nd9N8iOJ5+WZF2j8KB2762ftV+UIA2IA5ckoiASQpNbDvAFYDKQv2p1XC6MT8npt8/L7tatcvrfp+T5794td7WfkH+9+j8ZPHrc+r0mduSV12X3p1plaPg9+f+Fi9LYEC94XXNpQJz3YHdglwviq5I1di7Y399/j/x853ZZ21BrRZicmZVJczGfP5+WQ4dfkfFLGQv81998x/YbnspY8k1mnEdu3SY9d99h47woWcjjc49hdwS/R1B7uRDvunGLfPOTrfLgLe1y9NDLMmRW/qIzm7GpS3LO/IHz8cZaAfU1cbl6VY0kYnGZ8bKFV3ieXMONxDQnRy7Iz3bcLPt2fkl23dgi93xiq+z6dKtAHCFMifA94va5HO2lRPC94g++2B8DXQf+Zm3fzC/kiMGrtT1yPNkjf59psHg+nRCw54Ujse4//9PiJy8ejT3u9GeMO+7bK8Pn35MzZ85KUzxjsd7YH7a1yLv/6Jc16zotet+4QX5rcP21nZ6L4ATz2gcOeNLfn4XxH/tCi/fAZ67z1ObVhwRy7gEhtWWn0+bTohDKHqBU4aZN81nXn49W5C2KABXNoNLiU6dyeiB0qqFR1OYky2gsigBMqBDKmE9lJQExKuucrY5v2fw9D3AdYkfSJ8RFemirnH1zg2BBW8ujXkfbsz5kzx7PR2enJwMD0n3nd2Ttx66STZuvtRafmBw7Jie7NuXigZvl5mkL8l/KEiC/mxMZHZ1vsC21xQQL+W696w8PZ6shpX42kvv6/vvzbXc3zEcr8qwAbO+Sq+wMOTZ5xnypmYc0NYlABFDH5AG+rhY+MYBPLcAHkMYGYUTcf+KQ7B/5j8VjLx2U3v8ekt6B3iyMT0zz1Pq5uZrgkMG2FYAgImCBksQPhUsEMdwOLjHuDeTcGvXTaTK5cPvmZiQzMuJHuMHyxcsPVOhYAYKrz40OFBqLuAu7A4KFa9dmIxBT4tnI/KuSJ6I1kDarTkjoa5xS5FwhTKn/JA78QAnHClAi76eCIvkJbjyQAfh+oohDDbVuWkm7sQI+q0040dyMyYOKRR7kFRQI+AIUJVigU8mQrn6wqBBJxNA6+mkNPtCcsUrOuHlPFSYvUUYgnlo3ICCslhpwXcthceH3UzLc6BRsbUixtf3CgKO1WFJYgG/6lSIXXGWt1e2vlqGKwd8BkAMuOXxioNgAW343Ktf/ZVSs3X9KOp5pnMeTGen46YS0PXo6pzv1gD7Ut/WMCBBDWAvb9p6UDtNf20Gr5HRnqA3WhbV9AcIKy8kXu4y4aUKIMdoOmn9AGsetJQ9UKEShbcr8Z3B1SagI+A3mixc2iLB2vK+vL9bnYN++fTEXbg7fzeG//NoTsZNvPBvDghcOd8YK4fDgD2Jy770xbLF6ctS4/fkfg4vbnvpjbPvDv4phQfdfB2Pkv33wJWs1pzZUgLCCj3o+0kugGsVaEaAaVy3KOa/sgCjVrMaxVnZANa5alHNe2QFRqlmNY63sgGpctSjnvLIDolSzGsf6yO2AShchcgF2frHfc9He3u61OwidIOeBzvm/e/bPbwBC+1dYELkAFb5/fjnnixp1fY1FbJefAC5Bc9TGMbue/WPddBT+8hPAkI6CWLljLFgAflMAyv19gfvbAn5r4P+2gLN/wIEnIvAbAMPCPfvntwCVnv+bIUo+FywAo7vnirTLhf3PL8flCjq6B6qIQczN044QkQjAfNx/c9MuG3qgoh04G+AwhbYrBu1FQGQCRDY3XXUGdH8LQHsRsCQCsDv0MtGjd7Wc6ev5Pmf9UZ//h2m2KAIoOX1zJa/tQpajLT39Ie+e+tBeLCyKANzcgDtpdgFt4i6IuShFHJGopQbgLxSRCKDkPsxklFSwr578urtCa8gBbS/ERiJA2ATKEagQUR23mEiaX4hdsAAcnYOwSVADOHJ3ESReamWp1a2vNux9w/ILFkDfAHLAJYdPDGhdIasrrDYqcoXeKxiLTIDgwJW0WVmtd8mr7+a1Tu1C7QcAAAD//3n4vU4AAAAGSURBVAMAplm8EgbGqHQAAAAASUVORK5CYII=";

    let actions = [];
    let palFormat = null;
    let dragoncoreCompatibleFormat = null;
    let dragoncoreFormat = null;

    Plugin.register(PLUGIN_ID, {
        title: "PAL Bend Player Tools",
        author: "kltyton",
        icon: "icon.png",
        description: "Create, import, and export PlayerAnimationLibrary and Emotecraft player bend animations.",
        tags: ["Minecraft: Java Edition", "Animation", "Tools"],
        version: "0.3.0",
        variant: "both",
        min_version: "4.8.0",
        repository: "https://github.com/kltyton/Pal-bend-player-tools",
        bug_tracker: "https://github.com/kltyton/Pal-bend-player-tools/issues",
        onload() {
            registerPalFormat();
            actions = [
                new Action("pal_bend_create_player_project", {
                    name: "PAL：新建玩家动画项目",
                    description: "使用原始 player_model.geo helper-bend 模型创建项目",
                    icon: "accessibility_new",
                    click: () => createPlayerProject()
                }),
                new Action("pal_bend_create_animation_friendly_project", {
                    name: "PAL：新建玩家动画项目（龙核玩家模型兼容版）",
                    description: "使用保持 PAL 骨骼名、但带龙核玩家模型父子继承和枢轴点的模型创建项目",
                    icon: "account_tree",
                    click: createDragoncoreCompatiblePlayerProject
                }),
                new Action("pal_bend_create_dragoncore_project", {
                    name: "PAL：新建玩家动画项目（龙核玩家模型版）",
                    description: "使用龙核玩家模型组名、父子继承和枢轴点创建项目，导入导出仍会转换为 PAL",
                    icon: "accessibility_new",
                    click: createDragoncorePlayerProject
                }),
                new Action("pal_bend_import_animation", {
                    name: "PAL：导入 animations/emote 到玩家模型",
                    description: "导入 PAL bend animations 或 Emotecraft emote，并转换为 *_bend.rotation.x/y/z",
                    icon: "file_upload",
                    click: importAnimationFile
                }),
                new Action("pal_bend_export_animation", {
                    name: "PAL：导出 animations/emote",
                    description: "从当前 helper-bend 动画导出 PAL bend animations 或 Emotecraft emote",
                    icon: "file_download",
                    condition: () => typeof Animation !== "undefined" && Animation.all && Animation.all.length > 0,
                    click: showExportDialog
                }),
                new Action("pal_bend_export_geo", {
                    name: "PAL：导出内置 player_model.geo.json",
                    description: "导出插件内置的玩家辅助弯曲模型",
                    icon: "archive",
                    click: exportBuiltInGeo
                })
            ];
            MenuBar.addAction(getAction("pal_bend_create_player_project"), "file.new");
            MenuBar.addAction(getAction("pal_bend_create_animation_friendly_project"), "file.new");
            MenuBar.addAction(getAction("pal_bend_create_dragoncore_project"), "file.new");
            MenuBar.addAction(getAction("pal_bend_create_player_project"), "tools");
            MenuBar.addAction(getAction("pal_bend_create_animation_friendly_project"), "tools");
            MenuBar.addAction(getAction("pal_bend_create_dragoncore_project"), "tools");
            MenuBar.addAction(getAction("pal_bend_import_animation"), "file.import");
            MenuBar.addAction(getAction("pal_bend_export_animation"), "file.export");
            MenuBar.addAction(getAction("pal_bend_export_geo"), "file.export");
            attachAnimationPanelImportAction();
            setTimeout(attachAnimationPanelImportAction, 250);
        },
        onunload() {
            actions.forEach(action => action.delete());
            actions = [];
            if (palFormat && typeof palFormat.delete === "function") palFormat.delete();
            palFormat = null;
            if (dragoncoreCompatibleFormat && typeof dragoncoreCompatibleFormat.delete === "function") dragoncoreCompatibleFormat.delete();
            dragoncoreCompatibleFormat = null;
            if (dragoncoreFormat && typeof dragoncoreFormat.delete === "function") dragoncoreFormat.delete();
            dragoncoreFormat = null;
        }
    });

    function registerPalFormat() {
        if (typeof ModelFormat !== "function") return;
        if (globalThis.Formats && Formats.pal_bend_player) {
            palFormat = Formats.pal_bend_player;
        } else {
            palFormat = createPalModelFormat("pal_bend_player", {
                icon: "accessibility_new",
                name: "PAL Bend Player Animation",
                description: "PlayerAnimationLibrary / Emotecraft player animation project with helper bend bones.",
                create: createPlayerProject
            });
        }

        if (globalThis.Formats && Formats.pal_bend_player_dragoncore_compatible) {
            dragoncoreCompatibleFormat = Formats.pal_bend_player_dragoncore_compatible;
        } else {
            dragoncoreCompatibleFormat = createPalModelFormat("pal_bend_player_dragoncore_compatible", {
                icon: "account_tree",
                name: "PAL Bend Player Animation - 龙核玩家模型兼容版",
                description: "PAL bone names with DragonCore player-model hierarchy and pivots.",
                create: createDragoncoreCompatiblePlayerProject
            });
        }

        if (globalThis.Formats && Formats.pal_bend_player_dragoncore) {
            dragoncoreFormat = Formats.pal_bend_player_dragoncore;
        } else {
            dragoncoreFormat = createPalModelFormat("pal_bend_player_dragoncore", {
                icon: "accessibility_new",
                name: "PAL Bend Player Animation - 龙核玩家模型版",
                description: "DragonCore player-model group names with PAL import/export conversion.",
                create: createDragoncorePlayerProject
            });
        }
    }

    function createPalModelFormat(id, options) {
        const format = new ModelFormat(id, {
            id,
            icon: options.icon || "accessibility_new",
            name: options.name,
            description: options.description,
            category: "minecraft",
            box_uv: false,
            single_texture: true,
            bone_rig: true,
            centered_grid: true,
            rotate_cubes: true,
            animation_mode: true,
            animation_files: true,
            select_texture_for_particles: true,
            codec: globalThis.Codecs ? Codecs.project : undefined,
            animation_codec: globalThis.Codecs && Codecs.bedrock && Codecs.bedrock.format ? Codecs.bedrock.format.animation_codec : undefined
        });
        format.new = function() {
            options.create();
            return true;
        };
        return format;
    }

    function makePlayerModelVariant(baseModel, boneSetup, renameMap = {}) {
        const out = clone(baseModel);
        const geometry = out["minecraft:geometry"] && out["minecraft:geometry"][0];
        const bones = geometry && Array.isArray(geometry.bones) ? geometry.bones : [];
        bones.forEach(bone => {
            const setup = boneSetup[bone.name];
            if (!setup) return;
            if (setup.parent === null) delete bone.parent;
            else if (setup.parent !== undefined) bone.parent = setup.parent;
            if (setup.pivot) bone.pivot = clone(setup.pivot);
        });
        bones.forEach(bone => {
            if (bone.parent && renameMap[bone.parent]) bone.parent = renameMap[bone.parent];
            if (renameMap[bone.name]) bone.name = renameMap[bone.name];
        });
        return out;
    }

    function getAction(id) {
        return actions.find(action => action && action.id === id);
    }

    function attachAnimationPanelImportAction() {
        const importAction = getAction("pal_bend_import_animation");
        if (!importAction || !globalThis.Toolbars || !Toolbars.animations || typeof Toolbars.animations.add !== "function") return false;
        const toolbar = Toolbars.animations;
        if (Array.isArray(toolbar.children) && toolbar.children.some(item => item === importAction || item === importAction.id || item && item.id === importAction.id)) return true;
        let index = 3;
        if (Array.isArray(toolbar.children)) {
            const nativeIndex = toolbar.children.findIndex(item => item === "load_animation_file" || item && item.id === "load_animation_file");
            if (nativeIndex >= 0) index = nativeIndex + 1;
        }
        toolbar.add(importAction, index);
        return true;
    }

    function createDragoncoreCompatiblePlayerProject() {
        createPlayerProject({
            geometry: DRAGONCORE_COMPATIBLE_PLAYER_MODEL_GEO,
            projectName: "player_model.geo 龙核兼容版",
            fileName: "player_model.dragoncore_compatible.geo.json",
            message: "已创建 player_model.geo 龙核玩家模型兼容版"
        });
    }

    function createDragoncorePlayerProject() {
        createPlayerProject({
            geometry: DRAGONCORE_PLAYER_MODEL_GEO,
            projectName: "player_model.geo 龙核玩家模型版",
            fileName: "player_model.dragoncore.geo.json",
            message: "已创建 player_model.geo 龙核玩家模型版"
        });
    }

    function createPlayerProject(options = {}) {
        const geometry = options.geometry || PLAYER_MODEL_GEO;
        const projectName = options.projectName || "player_model.geo";
        const fileName = options.fileName || "player_model.geo.json";
        const message = options.message || "已创建 player_model.geo 玩家动画项目";
        const content = prettyJson(geometry);
        try {
            if (canUseBedrockGeometryParser()) {
                setupProject(Formats.bedrock);
                Codecs.bedrock.parseGeometry({object: clone(geometry["minecraft:geometry"][0])}, {
                    switch_to_existing_tab: false
                });
                if (isProjectObject()) {
                    Project.name = projectName;
                    Project.export_path = "";
                    Project.export_codec = "bedrock";
                }
            } else if (globalThis.Codecs && Codecs.bedrock && typeof Codecs.bedrock.load === "function") {
                Codecs.bedrock.load(clone(geometry), {
                    content,
                    name: fileName,
                    path: getVirtualPlayerModelPath(fileName),
                    no_file: true
                }, {
                    switch_to_existing_tab: false
                });
            } else if (typeof loadModelFile === "function") {
                loadModelFile({
                    content,
                    name: fileName,
                    path: getVirtualPlayerModelPath(fileName),
                    no_file: true
                });
            } else if (globalThis.Codecs && Codecs.bedrock && typeof Codecs.bedrock.parse === "function") {
                ensureBedrockProject();
                Codecs.bedrock.parse(JSON.parse(content), fileName, {});
            } else {
                createPlayerProjectFallback(geometry, projectName);
            }
            queuePlayerTextureLoad();
            Blockbench.showQuickMessage(message, 1800);
        } catch (error) {
            console.error(error);
            Blockbench.showMessageBox({
                title: "PAL Bend Player Tools",
                message: "创建玩家动画项目失败：" + error.message
            });
        }
    }

    function canUseBedrockGeometryParser() {
        return typeof setupProject === "function"
            && globalThis.Formats
            && Formats.bedrock
            && globalThis.Codecs
            && Codecs.bedrock
            && typeof Codecs.bedrock.parseGeometry === "function";
    }

    function ensureBedrockProject() {
        if (isProjectObject()) return true;
        if (typeof setupProject === "function" && globalThis.Formats && Formats.bedrock) {
            setupProject(Formats.bedrock);
            return isProjectObject();
        }
        if (typeof newProject === "function" && globalThis.Formats && Formats.bedrock) {
            newProject(Formats.bedrock);
            return isProjectObject();
        }
        return false;
    }

    function isProjectObject() {
        return globalThis.Project && typeof Project === "object";
    }

    function getVirtualPlayerModelPath(fileName = "player_model.geo.json") {
        const separator = typeof osfs === "string" ? osfs : "/";
        return `${Date.now()}${separator}${fileName}`;
    }

    function queuePlayerTextureLoad() {
        addPlayerTexture();
        setTimeout(addPlayerTexture, 80);
        setTimeout(addPlayerTexture, 300);
    }

    function addPlayerTexture() {
        if (typeof Texture !== "function") return;
        try {
            let texture = Texture.all && Texture.all.find(item => item.name === PLAYER_MODEL_TEXTURE_NAME);
            if (!texture) {
                texture = new Texture({
                    name: PLAYER_MODEL_TEXTURE_NAME,
                    keep_size: true,
                    uv_width: 64,
                    uv_height: 64
                });
            }
            if (typeof texture.add === "function" && (!Texture.all || !Texture.all.includes(texture))) {
                texture.add(true, true);
            }
            texture.load_callback = function(loadedTexture) {
                const activeTexture = loadedTexture || texture;
                setPlayerTextureMetadata(activeTexture);
                assignTextureToCubes(activeTexture);
            };
            const texturePath = getPlayerTexturePath();
            if (texturePath && typeof texture.fromPath === "function") {
                texture = texture.fromPath(texturePath) || texture;
            } else if (typeof texture.fromDataURL === "function") {
                texture = texture.fromDataURL(PLAYER_MODEL_TEXTURE_DATA_URL) || texture;
            }
            setPlayerTextureMetadata(texture);
            assignTextureToCubes(texture);
        } catch (error) {
            console.warn("[PAL Bend Player Tools] Failed to add player texture:", error);
        }
    }

    function getPlayerTexturePath() {
        if (!globalThis.Plugins || !Plugins.path) return "";
        const separator = typeof osfs === "string" ? osfs : "/";
        const base = String(Plugins.path).replace(/[\\/]+$/, "");
        const path = base + separator + PLAYER_MODEL_TEXTURE_NAME;
        if (globalThis.fs && typeof fs.existsSync === "function" && !fs.existsSync(path)) return "";
        return path;
    }

    function setPlayerTextureMetadata(texture) {
        if (!texture) return;
        texture.name = PLAYER_MODEL_TEXTURE_NAME;
        texture.uv_width = 64;
        texture.uv_height = 64;
        texture.saved = true;
        texture.use_as_default = true;
        if (typeof texture.setAsDefaultTexture === "function") texture.setAsDefaultTexture();
        if (typeof texture.enableParticle === "function") texture.enableParticle();
    }

    function assignTextureToCubes(texture) {
        if (!texture || !globalThis.Cube || !Cube.all) return;
        const textureId = texture.uuid;
        if (!textureId) return;
        Cube.all.forEach(cube => {
            if (typeof cube.applyTexture === "function") {
                cube.applyTexture(texture, true);
                return;
            }
            if (!cube.faces) return;
            Object.values(cube.faces).forEach(face => {
                if (face) face.texture = textureId;
            });
        });
        if (isProjectObject()) {
            Project.texture_width = 64;
            Project.texture_height = 64;
        }
        if (globalThis.Canvas && typeof Canvas.updateAllFaces === "function") Canvas.updateAllFaces();
        if (globalThis.Canvas && typeof Canvas.updateAll === "function") Canvas.updateAll();
    }

    function createPlayerProjectFallback(geometry = PLAYER_MODEL_GEO, projectName = "player_model.geo") {
        if (isProjectObject() && Formats && Formats.bedrock && typeof Formats.bedrock.select === "function") {
            Formats.bedrock.select();
        } else {
            ensureBedrockProject();
        }
        if (isProjectObject()) {
            Project.name = projectName;
            Project.geometry_name = "geometry.unknown";
            Project.texture_width = 64;
            Project.texture_height = 64;
        }
        geometry = geometry["minecraft:geometry"][0];
        const groupMap = {};
        geometry.bones.forEach(bone => {
            const parent = bone.parent ? groupMap[bone.parent] : undefined;
            const group = new Group({
                name: bone.name,
                origin: clone(bone.pivot || [0, 0, 0])
            }).addTo(parent);
            group.init();
            groupMap[bone.name] = group;
            (bone.cubes || []).forEach((cubeData, index) => {
                const from = clone(cubeData.origin || [0, 0, 0]);
                const size = clone(cubeData.size || [0, 0, 0]);
                const cube = new Cube({
                    name: bone.name + (index ? "_" + index : ""),
                    from,
                    to: [from[0] + size[0], from[1] + size[1], from[2] + size[2]]
                }).addTo(group);
                cube.init();
            });
        });
        Canvas.updateAll();
    }

    function exportBuiltInGeo() {
        Blockbench.export({
            type: "Minecraft Bedrock Geometry",
            extensions: ["json"],
            name: "player_model.geo.json",
            savetype: "text",
            content: prettyJson(PLAYER_MODEL_GEO)
        });
    }

    function importAnimationFile() {
        Blockbench.import({
            type: "PAL / Emotecraft Animation",
            extensions: ["json", "emote"],
            readtype: "text",
            multiple: false
        }, files => {
            if (!files || !files[0]) return;
            let data;
            try {
                data = parseJson(files[0].content);
            } catch (error) {
                showError("无法解析 JSON：" + error.message);
                return;
            }
            try {
                const fileBase = baseName(files[0].name || files[0].path || "animation").replace(/\.[^.]+$/, "");
                let animationsJson;
                if (data && data.emote) {
                    const ir = parseEmoteToIR(data, fileBase);
                    animationsJson = irToAnimationsJson(ir, safeAnimationName(data.name || fileBase || "animation"));
                } else if (data && data.animations) {
                    animationsJson = clone(data);
                } else {
                    showError("文件不是 emote JSON，也不是带 animations 字段的动画 JSON。");
                    return;
                }
                const importProfile = getImportProfile(animationsJson, !!(data && data.emote));
                animationsJson = normalizeAnimationBoneNames(animationsJson);
                let modelAnimations = convertToBendableModelFormat(animationsJson, {
                    keepPalBend: false,
                    helperSign: 1
                });
                const sourceMatchesCurrentRig = importProfile.sourceRig && rigsAreEquivalent(importProfile.sourceRig, getCurrentProjectPalRig());
                if (importProfile.sourceRig && !sourceMatchesCurrentRig) modelAnimations = bakeAnimationHierarchyToFlat(modelAnimations, importProfile.sourceRig);
                if (importProfile.unbakeFlatToCurrent && !sourceMatchesCurrentRig) modelAnimations = unbakeCurrentProjectHierarchyForPal(modelAnimations);
                if (!sourceMatchesCurrentRig) modelAnimations = mirrorFacingForBlockbench(modelAnimations);
                const result = loadAnimationsIntoProject(modelAnimations);
                Blockbench.showQuickMessage(`已导入 ${result.created} 个动画${result.missing ? `，${result.missing} 个骨骼未匹配` : ""}`, 2600);
            } catch (error) {
                console.error(error);
                showError("导入动画失败：" + error.message);
            }
        });
    }

    function showExportDialog() {
        const selectedName = Animation.selected ? Animation.selected.name : "";
        const dialog = new Dialog({
            id: "pal_bend_export_dialog",
            title: "PAL 导出动画",
            form: {
                format: {
                    label: "导出类型",
                    type: "select",
                    default: "animations",
                    options: {
                        animations: "传统 PAL bend animations",
                        emote: "Emotecraft / PAL emote"
                    }
                },
                scope: {
                    label: "动画范围",
                    type: "select",
                    default: selectedName ? "selected" : "all",
                    options: {
                        selected: "当前选中动画",
                        all: "全部动画"
                    }
                },
                emote_name: {
                    label: "Emote 名称",
                    type: "text",
                    value: selectedName || "animation"
                },
                author: {
                    label: "作者",
                    type: "text",
                    value: ""
                },
                description: {
                    label: "描述",
                    type: "text",
                    value: ""
                }
            },
            onConfirm(form) {
                try {
                    exportAnimations(form);
                } catch (error) {
                    console.error(error);
                    showError("导出动画失败：" + error.message);
                }
            }
        });
        dialog.show();
    }

    function exportAnimations(form) {
        const animations = collectAnimations(form.scope);
        if (!animations.length) {
            showError("没有可导出的动画。");
            return;
        }
        if (form.format === "emote" && animations.length !== 1) {
            showError("emote 一次只能导出一个动画，请选择“当前选中动画”。");
            return;
        }

        let modelAnimations = mirrorFacingForPal(normalizeAnimationBoneNames(compileAnimationsFromProject(animations)));
        modelAnimations = bakeCurrentProjectHierarchyForPal(modelAnimations);
        const palBendAnimations = modelAnimationsToPalBend(modelAnimations, {
            helperSign: 1,
            keepHelpers: false
        });

        if (form.format === "animations") {
            Blockbench.export({
                type: "PAL Bend Animations",
                extensions: ["json"],
                name: "pal_bend.animation.json",
                savetype: "text",
                content: prettyJson(palBendAnimations)
            });
            return;
        }

        const animationName = Object.keys(palBendAnimations.animations || {})[0];
        const ir = parseAnimationsToIR(palBendAnimations, animationName)[animationName];
        const emote = irToEmoteJson(ir, {
            name: form.emote_name || animationName || "animation",
            author: form.author || "",
            description: form.description || "",
            degrees: false,
            version: 3,
            easeBeforeKeyframe: true
        });
        Blockbench.export({
            type: "Emotecraft / PAL Emote",
            extensions: ["json", "emote"],
            name: safeFileName((form.emote_name || animationName || "animation") + ".emote.json"),
            savetype: "text",
            content: prettyJson(emote)
        });
    }

    function loadAnimationsIntoProject(data) {
        if (!hasPlayerHelperBones()) {
            Blockbench.showMessageBox({
                title: "PAL Bend Player Tools",
                message: "当前项目没有完整的 player_model.geo helper-bend 骨骼。建议先执行“PAL：新建玩家动画项目”。插件仍会导入动画，但缺少骨骼的轨道不会显示。"
            });
        }
        const animations = data.animations || {};
        let created = 0;
        let missing = 0;
        Object.keys(animations).forEach(name => {
            const animObj = animations[name] || {};
            const bbAnimation = new Animation({
                name: uniqueAnimationName(name),
                length: numberOr(animObj.animation_length, 0),
                snapping: 20,
                loop: blockbenchLoopForAnimation(animObj.loop)
            }).add();
            if (typeof bbAnimation.init === "function") bbAnimation.init();
            const bones = animObj.bones || {};
            Object.keys(bones).forEach(boneName => {
                const group = findGroupByName(boneName);
                const animator = group
                    ? getAnimatorForGroup(group, bbAnimation, boneName)
                    : getDetachedAnimatorForBone(boneName, bbAnimation);
                if (!group) {
                    missing += 1;
                }
                const bone = bones[boneName] || {};
                ["position", "rotation", "scale"].forEach(channel => {
                    if (bone[channel]) addJsonTrackToAnimator(animator, channel, bone[channel]);
                });
            });
            if (typeof bbAnimation.calculateSnappingFromKeyframes === "function") {
                bbAnimation.calculateSnappingFromKeyframes();
            }
            if (created === 0 && typeof bbAnimation.select === "function") {
                bbAnimation.select();
            }
            created += 1;
        });
        if (globalThis.Modes && Modes.animate && typeof Modes.animate.select === "function") {
            Modes.animate.select();
        }
        if (globalThis.Animator && typeof Animator.preview === "function") {
            Animator.preview();
        }
        return {created, missing};
    }

    function addJsonTrackToAnimator(animator, channel, track) {
        getAnimationEntries(track).forEach(([time, element, timeKey]) => {
            const key = jsonElementToBlockbenchKey(element, channel);
            if (!key) return;
            const keyframeData = {
                channel,
                time,
                data_points: key.dataPoints
            };
            if (timeKey !== undefined) keyframeData.pal_time_key = String(timeKey);
            if (key.style) keyframeData.pal_key_style = key.style;
            if (key.easing && key.easing !== DEFAULT_EASING) keyframeData.easing = easingForAnimation(key.easing);
            if (key.interpolation) keyframeData.interpolation = key.interpolation;
            if (key.easingArgs) keyframeData.easingArgs = key.easingArgs;
            animator.addKeyframe(keyframeData);
        });
    }

    function jsonElementToBlockbenchKey(element, channel) {
        let interpolation;
        let easing = DEFAULT_EASING;
        let easingArgs;
        const style = Array.isArray(element) ? "array" : undefined;
        if (element && typeof element === "object" && !Array.isArray(element)) {
            easing = normalizeEasing(element.easing || DEFAULT_EASING);
            easingArgs = element.easingArgs;
            if (element.lerp_mode === "catmullrom") interpolation = "catmullrom";
            if (element.lerp_mode === "bezier" || (element.pre !== undefined && element.post !== undefined)) interpolation = "bezier";
        }
        const dataPoints = [];
        if (element && typeof element === "object" && !Array.isArray(element) && (element.pre !== undefined || element.post !== undefined)) {
            if (element.pre !== undefined) dataPoints.push(vectorDataPoint(valueToVector(element.pre, channel)));
            dataPoints.push(vectorDataPoint(valueToVector(element.post !== undefined ? element.post : element.pre, channel)));
        } else {
            dataPoints.push(vectorDataPoint(valueToVector(element, channel)));
        }
        if (!dataPoints.length) return null;
        return {dataPoints, easing, interpolation, easingArgs, style};
    }

    function compileAnimationsFromProject(animations) {
        const out = {
            format_version: "1.8.0",
            animations: {}
        };
        animations.forEach(animation => {
            const animObj = {
                animation_length: cleanNumber(numberOr(animation.length, 0)),
                bones: {}
            };
            const loopValue = animationLoopForJson(animation.loop);
            if (loopValue !== undefined) animObj.loop = loopValue;
            Object.keys(animation.animators || {}).forEach(id => {
                const animator = animation.animators[id];
                if (!animator) return;
                const boneName = animator.name || findGroupNameByUuid(id);
                if (!boneName) return;
                const boneOut = {};
                ["position", "rotation", "scale"].forEach(channel => {
                    const keyframes = Array.isArray(animator[channel]) ? animator[channel] : [];
                    if (keyframes.length) boneOut[channel] = blockbenchKeyframesToTrack(keyframes, channel);
                });
                if (Object.keys(boneOut).length) animObj.bones[boneName] = boneOut;
            });
            out.animations[uniqueAnimationKey(out.animations, animation.name || "animation")] = animObj;
        });
        return out;
    }

    function blockbenchKeyframesToTrack(keyframes, channel) {
        const track = {};
        keyframes.slice().sort((a, b) => a.time - b.time).forEach(keyframe => {
            const keyframeTime = numberOr(keyframe.time, 0);
            const time = keyframe.pal_time_key !== undefined && Math.abs(Number(keyframe.pal_time_key) - keyframeTime) < 1e-6
                ? String(keyframe.pal_time_key)
                : formatSeconds(keyframeTime);
            const points = Array.isArray(keyframe.data_points) && keyframe.data_points.length
                ? keyframe.data_points
                : [{x: keyframe.get ? keyframe.get("x") : 0, y: keyframe.get ? keyframe.get("y") : 0, z: keyframe.get ? keyframe.get("z") : 0}];
            const post = dataPointVector(points[points.length - 1], channel);
            const hasInterpolation = !!(keyframe.interpolation && keyframe.interpolation !== "linear");
            const hasEasing = !!(keyframe.easing && normalizeEasing(keyframe.easing) !== DEFAULT_EASING);
            if (keyframe.pal_key_style === "array" && points.length <= 1 && !hasInterpolation && !hasEasing) {
                track[time] = post;
                return;
            }
            const obj = {vector: post};
            if (points.length > 1) {
                obj.pre = dataPointVector(points[0], channel);
                obj.post = post;
                delete obj.vector;
            }
            if (hasInterpolation) {
                if (points.length <= 1) {
                    obj.post = post;
                    delete obj.vector;
                }
                obj.lerp_mode = keyframe.interpolation;
            }
            if (hasEasing) {
                obj.easing = easingForAnimation(keyframe.easing);
            }
            track[time] = obj;
        });
        return track;
    }

    function mirrorFacingForBlockbench(data) {
        return mirrorNorthSouthAnimationData(data);
    }

    function mirrorFacingForPal(data) {
        return mirrorNorthSouthAnimationData(data);
    }

    function mirrorNorthSouthAnimationData(data) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            if (!animObj || typeof animObj !== "object") return;
            Object.values(animObj.bones || {}).forEach(bone => {
                if (!bone || typeof bone !== "object") return;
                if (bone.rotation !== undefined) bone.rotation = mirrorTrackPayload(bone.rotation, "rotation");
                if (bone.bend !== undefined) bone.bend = mirrorTrackPayload(bone.bend, "bend");
            });
        });
        return out;
    }

    function mirrorTrackPayload(track, channel) {
        if (track === undefined || track === null) return track;
        if (Array.isArray(track) || isNum(track) || typeof track === "string" || looksLikeSingleKeyframe(track)) {
            return mirrorKeyPayload(track, channel);
        }
        if (typeof track === "object") {
            const out = {};
            Object.keys(track).forEach(time => {
                out[time] = mirrorKeyPayload(track[time], channel);
            });
            return out;
        }
        return track;
    }

    function mirrorKeyPayload(payload, channel) {
        if (Array.isArray(payload)) return mirrorVector(payload, channel);
        if (isNum(payload) || typeof payload === "string") {
            if (channel === "bend") return invertAnimationValue(payload);
            if (channel === "rotation") return mirrorVector([payload, payload, payload], channel);
            if (channel === "position") return mirrorVector([payload, payload, payload], channel);
            return payload;
        }
        if (!payload || typeof payload !== "object") return payload;
        const out = clone(payload);
        if (out.value !== undefined) {
            out.value = channel === "bend" ? invertAnimationValue(out.value) : mirrorVector([out.value, 0, 0], channel)[0];
        }
        if (out.vector !== undefined) out.vector = mirrorVector(valueToVector(out.vector, channel), channel);
        if (out.pre !== undefined) out.pre = mirrorKeyPayload(out.pre, channel);
        if (out.post !== undefined) out.post = mirrorKeyPayload(out.post, channel);
        return out;
    }

    function mirrorVector(vector, channel) {
        const out = Array.isArray(vector) ? vector.slice(0, 3) : [vector, vector, vector];
        while (out.length < 3) out.push(channel === "scale" ? 1 : 0);
        if (channel === "rotation") {
            out[0] = invertAnimationValue(out[0]);
            out[1] = invertAnimationValue(out[1]);
        } else if (channel === "bend") {
            out[0] = invertAnimationValue(out[0]);
        }
        return cleanNumber(out);
    }

    function invertAnimationValue(value) {
        if (isSkip(value)) return value;
        return applySign(value, -1);
    }

    function getAnimatorForGroup(group, animation, fallbackName) {
        if (typeof animation.getBoneAnimator === "function") {
            try {
                const animator = animation.getBoneAnimator(group);
                if (animator) return animator;
            } catch (error) {
                console.warn(error);
            }
        }
        if (!animation.animators) animation.animators = {};
        let animator = animation.animators[group.uuid];
        if (!animator) {
            animator = new BoneAnimator(group.uuid, animation, fallbackName || group.name);
            animation.animators[group.uuid] = animator;
            if (typeof animator.init === "function") animator.init();
        }
        return animator;
    }

    function getDetachedAnimatorForBone(boneName, animation) {
        if (!animation.animators) animation.animators = {};
        const id = `pal_missing_${normalizeBoneKey(boneName)}`;
        let animator = animation.animators[id];
        if (!animator) {
            animator = new BoneAnimator(id, animation, boneName);
            animation.animators[id] = animator;
            if (typeof animator.init === "function") animator.init();
        }
        return animator;
    }

    function normalizeAnimationBoneNames(data) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            const normalizedBones = {};
            Object.keys(bones).forEach(rawName => {
                const boneName = getCorrectPlayerBoneName(rawName);
                normalizedBones[boneName] = mergeBoneAnimation(normalizedBones[boneName], bones[rawName]);
            });
            animObj.bones = normalizedBones;
        });
        return out;
    }

    function mergeBoneAnimation(base, incoming) {
        const out = base && typeof base === "object" ? clone(base) : {};
        const source = incoming && typeof incoming === "object" ? incoming : {};
        Object.keys(source).forEach(channel => {
            if (out[channel] === undefined) out[channel] = clone(source[channel]);
            else out[channel] = mergeTrackPayload(out[channel], source[channel]);
        });
        return out;
    }

    function mergeTrackPayload(base, incoming) {
        if (!base || typeof base !== "object" || Array.isArray(base) || looksLikeSingleKeyframe(base)) {
            return clone(incoming);
        }
        if (!incoming || typeof incoming !== "object" || Array.isArray(incoming) || looksLikeSingleKeyframe(incoming)) {
            return clone(incoming);
        }
        return Object.assign({}, clone(base), clone(incoming));
    }

    function getImportProfile(data, isEmote) {
        const profile = {
            sourceRig: null,
            unbakeFlatToCurrent: false
        };
        if (isEmote) {
            profile.unbakeFlatToCurrent = true;
            return profile;
        }
        if (!data || !data.animations) return profile;
        const metadataRig = getHierarchyMetadataRig(data);
        if (metadataRig) {
            profile.sourceRig = metadataRig;
            profile.unbakeFlatToCurrent = true;
            return profile;
        }
        let sawPalBone = false;
        let sawHelperBone = false;
        let sawDragoncoreBone = false;
        Object.values(data.animations || {}).forEach(animObj => {
            Object.keys((animObj && animObj.bones) || {}).forEach(rawName => {
                const normalized = getCorrectPlayerBoneName(rawName);
                if (normalized.endsWith(HELPER_SUFFIX)) sawHelperBone = true;
                if (isDragoncoreRawBoneName(rawName)) sawDragoncoreBone = true;
                if (PAL_DEFAULT_PIVOTS[normalized] || BEND_HELPER_BONES[normalized]) sawPalBone = true;
            });
        });
        if (sawDragoncoreBone) {
            profile.sourceRig = getDragoncoreCompatiblePalRig();
            profile.unbakeFlatToCurrent = true;
            return profile;
        }
        if (sawPalBone && !sawHelperBone) {
            profile.unbakeFlatToCurrent = true;
        }
        return profile;
    }

    function getHierarchyMetadataRig(data) {
        const parentsObj = data.parents || firstAnimationObjectWith(data, "parents");
        const modelObj = data.model || firstAnimationObjectWith(data, "model");
        if (!parentsObj && !modelObj) return null;
        const parents = {};
        const pivots = Object.assign({}, clone(PAL_DEFAULT_PIVOTS));
        Object.keys(parentsObj || {}).forEach(rawName => {
            const child = getCorrectPlayerBoneName(rawName);
            const parent = getCorrectPlayerBoneName(parentsObj[rawName]);
            if (child && parent && child !== parent) parents[child] = parent;
        });
        Object.keys(modelObj || {}).forEach(rawName => {
            const boneName = getCorrectPlayerBoneName(rawName);
            const pivot = modelObj[rawName] && modelObj[rawName].pivot;
            if (boneName && Array.isArray(pivot)) pivots[boneName] = cleanNumber(pivot.slice(0, 3));
        });
        return {parents, pivots};
    }

    function firstAnimationObjectWith(data, key) {
        const anim = Object.values((data && data.animations) || {}).find(animObj => animObj && animObj[key]);
        return anim ? anim[key] : null;
    }

    function isDragoncoreRawBoneName(name) {
        const raw = String(name || "").trim();
        return raw === "root" || Object.values(PAL_TO_DRAGONCORE_BONES).includes(raw);
    }

    function hasCurrentProjectHierarchy() {
        if (!globalThis.Group || !Array.isArray(Group.all)) return false;
        return Group.all.some(group => group && group.name && group.parent && group.parent.name);
    }

    function convertToBendableModelFormat(animationsJson, options = {}) {
        const keepPalBend = !!options.keepPalBend;
        const helperSign = options.helperSign === undefined ? 1 : Number(options.helperSign);
        const out = clone(animationsJson);
        Object.values(out.animations || {}).forEach(animObj => {
            if (!animObj || typeof animObj !== "object") return;
            const bones = animObj.bones || {};
            Object.keys(BEND_HELPER_BONES).forEach(parent => {
                const helper = BEND_HELPER_BONES[parent];
                const parentBone = bones[parent];
                if (!parentBone || typeof parentBone !== "object" || parentBone.bend === undefined) return;
                const bendTrack = normalizeTrack(parentBone.bend);
                const helperBone = bones[helper] = bones[helper] && typeof bones[helper] === "object" ? bones[helper] : {};
                const helperRotation = helperBone.rotation = helperBone.rotation && typeof helperBone.rotation === "object" ? helperBone.rotation : {};
                Object.keys(bendTrack).forEach(timestamp => {
                    helperRotation[String(timestamp)] = bendKeyToHelperRotationKey(bendTrack[timestamp], helperSign);
                });
                if (!keepPalBend) delete parentBone.bend;
            });
            removeEmptyBones(bones);
        });
        return out;
    }

    function modelAnimationsToPalBend(data, options = {}) {
        const helperSign = options.helperSign === undefined ? 1 : Number(options.helperSign);
        const keepHelpers = !!options.keepHelpers;
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            Object.keys(bones).forEach(helperName => {
                if (!helperName.endsWith(HELPER_SUFFIX)) return;
                const helper = bones[helperName];
                if (!helper || typeof helper !== "object" || helper.rotation === undefined) return;
                const baseName = helperName.slice(0, -HELPER_SUFFIX.length);
                const bendTrack = {};
                const rotationTrack = normalizeTrack(helper.rotation);
                Object.keys(rotationTrack).forEach(timestamp => {
                    bendTrack[String(timestamp)] = helperFrameToBendFrame(rotationTrack[timestamp], helperSign);
                });
                const base = bones[baseName] = bones[baseName] && typeof bones[baseName] === "object" ? bones[baseName] : {};
                base.bend = Object.assign({}, base.bend && typeof base.bend === "object" ? clone(base.bend) : {}, bendTrack);
                if (!keepHelpers) {
                    const remaining = clone(helper);
                    delete remaining.rotation;
                    if (Object.keys(remaining).length) bones[helperName] = remaining;
                    else delete bones[helperName];
                }
            });
            removeEmptyBones(bones);
        });
        return out;
    }

    // PAL updates humanoid parts independently, so parented Blockbench rigs need a flat baked export.
    function bakeCurrentProjectHierarchyForPal(data) {
        const rig = getCurrentProjectPalRig();
        if (!rig || !rig.parents || !Object.keys(rig.parents).length) return data;
        return bakeAnimationHierarchyToFlat(data, rig);
    }

    function unbakeCurrentProjectHierarchyForPal(data) {
        const rig = getCurrentProjectPalRig();
        if (!rig || !rig.parents || !Object.keys(rig.parents).length) return data;
        return unbakeFlatAnimationHierarchyForEdit(data, rig);
    }

    function getCurrentProjectPalRig() {
        const parents = {};
        const pivots = Object.assign({}, clone(PAL_DEFAULT_PIVOTS));
        if (!globalThis.Group || !Array.isArray(Group.all)) return {parents, pivots};
        Group.all.forEach(group => {
            if (!group || !group.name) return;
            const boneName = getCorrectPlayerBoneName(group.name);
            if (!boneName) return;
            pivots[boneName] = blockbenchPivotToPal(group.origin || group.pivot || [0, 0, 0]);
            const parent = group.parent;
            if (parent && parent.name) {
                const parentName = getCorrectPlayerBoneName(parent.name);
                if (parentName && parentName !== boneName) parents[boneName] = parentName;
            }
        });
        return {parents, pivots};
    }

    function getDragoncoreCompatiblePalRig() {
        const parents = {};
        const pivots = Object.assign({}, clone(PAL_DEFAULT_PIVOTS));
        Object.keys(DRAGONCORE_COMPATIBLE_BONE_SETUP).forEach(boneName => {
            const setup = DRAGONCORE_COMPATIBLE_BONE_SETUP[boneName];
            if (setup.parent !== null && setup.parent !== undefined) parents[boneName] = setup.parent;
            if (setup.pivot) pivots[boneName] = blockbenchPivotToPal(setup.pivot);
        });
        return {parents, pivots};
    }

    function rigsAreEquivalent(a, b) {
        if (!a || !b) return false;
        const parentBones = new Set([
            ...Object.keys(a.parents || {}),
            ...Object.keys(b.parents || {})
        ]);
        for (const boneName of parentBones) {
            const parentA = (a.parents && a.parents[boneName]) || null;
            const parentB = (b.parents && b.parents[boneName]) || null;
            if (parentA !== parentB) return false;
        }
        const pivotBones = new Set([
            ...Object.keys(a.pivots || {}),
            ...Object.keys(b.pivots || {}),
            ...parentBones
        ]);
        for (const boneName of pivotBones) {
            const pivotA = getRigPivot(a, boneName);
            const pivotB = getRigPivot(b, boneName);
            if (!vectorNearlyEquals(pivotA, pivotB)) return false;
        }
        return true;
    }

    function blockbenchPivotToPal(pivot) {
        const vector = Array.isArray(pivot) ? pivot : [0, 0, 0];
        return cleanNumber([
            -numberOr(vector[0], 0),
            numberOr(vector[1], 0),
            numberOr(vector[2], 0)
        ]);
    }

    function bakeAnimationHierarchyToFlat(data, rig) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            const sourceBones = clone(bones);
            const targets = getHierarchyBakeTargets(bones, rig);
            targets.forEach(boneName => bakeBoneHierarchyTrack(bones, sourceBones, boneName, rig));
            removeEmptyBones(bones);
        });
        return out;
    }

    function unbakeFlatAnimationHierarchyForEdit(data, rig) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            const targets = getHierarchyBakeTargets(bones, rig)
                .sort((a, b) => getBakeParentChain(a, rig.parents).length - getBakeParentChain(b, rig.parents).length);
            targets.forEach(boneName => unbakeBoneHierarchyTrack(bones, boneName, rig));
            removeEmptyBones(bones);
        });
        return out;
    }

    function getHierarchyBakeTargets(bones, rig) {
        const targets = new Set();
        Object.keys(bones).forEach(name => {
            if (!name.endsWith(HELPER_SUFFIX)) targets.add(name);
        });
        Object.keys(rig.parents || {}).forEach(name => {
            if (name.endsWith(HELPER_SUFFIX)) return;
            if (PAL_RENDER_BONES.includes(name) || bones[name] || chainHasAnimatedTransform(name, bones, rig)) targets.add(name);
        });
        return Array.from(targets).filter(name => !name.endsWith(HELPER_SUFFIX) && getBakeParentChain(name, rig.parents).length);
    }

    function chainHasAnimatedTransform(boneName, bones, rig) {
        if (boneHasTransformTracks(bones[boneName])) return true;
        return getBakeParentChain(boneName, rig.parents).some(parent => boneHasTransformTracks(bones[parent]));
    }

    function boneHasTransformTracks(bone) {
        return !!(bone && typeof bone === "object" && (bone.position !== undefined || bone.rotation !== undefined || bone.scale !== undefined));
    }

    function bakeBoneHierarchyTrack(outBones, sourceBones, boneName, rig) {
        const parentChain = getBakeParentChain(boneName, rig.parents);
        if (!parentChain.length) return;
        if (!chainHasAnimatedTransform(boneName, sourceBones, rig)) return;
        const times = getBakeTimes(sourceBones, boneName, parentChain);
        if (!times.length) return;
        const sourceBone = sourceBones[boneName] && typeof sourceBones[boneName] === "object" ? sourceBones[boneName] : {};
        const bakedBone = clone(sourceBone);
        const positionTrack = {};
        const rotationTrack = {};
        const scaleTrack = {};
        let hasPosition = false;
        let hasRotation = false;
        let hasScale = false;
        times.forEach(time => {
            const baked = sampleBakedBoneTransform(sourceBones, boneName, parentChain, rig, time);
            const easing = findBakeEasing(sourceBones, boneName, parentChain, time);
            const timeKey = formatSeconds(time);
            positionTrack[timeKey] = makeBakedTrackKey(baked.position, easing);
            rotationTrack[timeKey] = makeBakedTrackKey(baked.rotation.map(radToDeg), easing);
            scaleTrack[timeKey] = makeBakedTrackKey(baked.scale, easing);
            if (!vectorNearlyEquals(baked.position, [0, 0, 0])) hasPosition = true;
            if (!vectorNearlyEquals(baked.rotation, [0, 0, 0])) hasRotation = true;
            if (!vectorNearlyEquals(baked.scale, [1, 1, 1])) hasScale = true;
        });
        if (hasPosition || sourceBone.position !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].position !== undefined)) bakedBone.position = positionTrack;
        if (hasRotation || sourceBone.rotation !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].rotation !== undefined)) bakedBone.rotation = rotationTrack;
        if (hasScale || sourceBone.scale !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].scale !== undefined)) bakedBone.scale = scaleTrack;
        outBones[boneName] = bakedBone;
    }

    function unbakeBoneHierarchyTrack(bones, boneName, rig) {
        const parentChain = getBakeParentChain(boneName, rig.parents);
        if (!parentChain.length) return;
        const sourceBone = bones[boneName] && typeof bones[boneName] === "object" ? bones[boneName] : {};
        if (!boneHasTransformTracks(sourceBone)) return;
        const times = getBakeTimes(bones, boneName, parentChain);
        if (!times.length) return;
        const unbakedBone = clone(sourceBone);
        const positionTrack = {};
        const rotationTrack = {};
        const scaleTrack = {};
        let hasPosition = false;
        let hasRotation = false;
        let hasScale = false;
        times.forEach(time => {
            const unbaked = sampleUnbakedBoneTransform(bones, boneName, parentChain, rig, time);
            const easing = findBakeEasing(bones, boneName, parentChain, time);
            const timeKey = formatSeconds(time);
            positionTrack[timeKey] = makeBakedTrackKey(unbaked.position, easing);
            rotationTrack[timeKey] = makeBakedTrackKey(unbaked.rotation.map(radToDeg), easing);
            scaleTrack[timeKey] = makeBakedTrackKey(unbaked.scale, easing);
            if (!vectorNearlyEquals(unbaked.position, [0, 0, 0])) hasPosition = true;
            if (!vectorNearlyEquals(unbaked.rotation, [0, 0, 0])) hasRotation = true;
            if (!vectorNearlyEquals(unbaked.scale, [1, 1, 1])) hasScale = true;
        });
        if (hasPosition || sourceBone.position !== undefined) unbakedBone.position = positionTrack;
        else delete unbakedBone.position;
        if (hasRotation || sourceBone.rotation !== undefined) unbakedBone.rotation = rotationTrack;
        else delete unbakedBone.rotation;
        if (hasScale || sourceBone.scale !== undefined) unbakedBone.scale = scaleTrack;
        else delete unbakedBone.scale;
        bones[boneName] = unbakedBone;
    }

    function getBakeParentChain(boneName, parents) {
        const chain = [];
        const seen = new Set([boneName]);
        let parent = parents && parents[boneName];
        while (parent && !seen.has(parent)) {
            seen.add(parent);
            if (!isOwnBendHelperParent(boneName, parent)) chain.unshift(parent);
            parent = parents[parent];
        }
        return chain;
    }

    function isOwnBendHelperParent(boneName, parentName) {
        return parentName && parentName.endsWith(HELPER_SUFFIX) && parentName.slice(0, -HELPER_SUFFIX.length) === boneName;
    }

    function getBakeTimes(bones, boneName, parentChain) {
        const times = new Set([0]);
        [boneName, ...parentChain].forEach(name => {
            const bone = bones[name];
            if (!bone || typeof bone !== "object") return;
            ["position", "rotation", "scale"].forEach(channel => collectTrackTimes(bone[channel], times));
        });
        return Array.from(times).sort((a, b) => a - b);
    }

    function collectTrackTimes(track, times) {
        if (track === undefined || track === null) return;
        if (Array.isArray(track) || isNum(track) || typeof track === "string" || looksLikeSingleKeyframe(track)) {
            times.add(0);
            return;
        }
        if (typeof track === "object") {
            Object.keys(track).forEach(time => {
                const n = Number(time);
                if (!Number.isNaN(n)) times.add(n);
            });
        }
    }

    function sampleBakedBoneTransform(bones, boneName, parentChain, rig, time) {
        let matrix = matrixIdentity();
        parentChain.forEach(parentName => {
            const parentTransform = sampleBoneTransform(bones[parentName], time);
            matrix = prepPalBoneMatrix(matrix, parentTransform, getRigPivot(rig, parentName));
        });
        return applyPalParentMatrixToTransform(sampleBoneTransform(bones[boneName], time), matrix, getRigPivot(rig, boneName));
    }

    function sampleUnbakedBoneTransform(bones, boneName, parentChain, rig, time) {
        let matrix = matrixIdentity();
        parentChain.forEach(parentName => {
            const parentTransform = sampleBoneTransform(bones[parentName], time);
            matrix = prepPalBoneMatrix(matrix, parentTransform, getRigPivot(rig, parentName));
        });
        return removePalParentMatrixFromTransform(sampleBoneTransform(bones[boneName], time), matrix, getRigPivot(rig, boneName));
    }

    function sampleBoneTransform(bone, time) {
        return {
            position: sampleTrackVector(bone && bone.position, "position", time, [0, 0, 0]),
            rotation: sampleTrackVector(bone && bone.rotation, "rotation", time, [0, 0, 0]).map(degToRad),
            scale: sampleTrackVector(bone && bone.scale, "scale", time, [1, 1, 1])
        };
    }

    function sampleTrackVector(track, channel, time, fallback) {
        if (track === undefined || track === null) return fallback.slice();
        if (Array.isArray(track) || isNum(track) || typeof track === "string" || looksLikeSingleKeyframe(track)) {
            return cleanNumber(valueToVector(track, channel));
        }
        if (typeof track !== "object") return fallback.slice();
        const samples = Object.keys(track).map(key => ({time: Number(key), value: track[key]}))
            .filter(entry => !Number.isNaN(entry.time))
            .sort((a, b) => a.time - b.time);
        if (!samples.length) return fallback.slice();
        const exact = samples.find(entry => Math.abs(entry.time - time) < 1e-6);
        if (exact) return cleanNumber(valueToVector(exact.value, channel));
        let prev = null;
        let next = null;
        samples.forEach(entry => {
            if (entry.time <= time && (!prev || entry.time > prev.time)) prev = entry;
            if (entry.time >= time && (!next || entry.time < next.time)) next = entry;
        });
        if (prev && next && prev !== next) {
            const a = valueToVector(prev.value, channel);
            const b = valueToVector(next.value, channel);
            const alpha = (time - prev.time) / Math.max(next.time - prev.time, 1e-9);
            if (a.every(isFiniteNumberLike) && b.every(isFiniteNumberLike)) {
                return cleanNumber(a.map((value, index) => Number(value) + (Number(b[index]) - Number(value)) * alpha));
            }
        }
        return cleanNumber(valueToVector((prev || next).value, channel));
    }

    function findBakeEasing(bones, boneName, parentChain, time) {
        for (const name of [boneName, ...parentChain.slice().reverse()]) {
            const bone = bones[name];
            if (!bone || typeof bone !== "object") continue;
            for (const channel of ["position", "rotation", "scale"]) {
                const key = findExactTrackKey(bone[channel], time);
                if (!key || typeof key !== "object" || Array.isArray(key)) continue;
                const out = {};
                ["lerp_mode", "easing", "easingArgs"].forEach(prop => {
                    if (key[prop] !== undefined) out[prop] = clone(key[prop]);
                });
                if (Object.keys(out).length) return out;
            }
        }
        return {};
    }

    function findExactTrackKey(track, time) {
        if (track === undefined || track === null) return null;
        if (Array.isArray(track) || isNum(track) || typeof track === "string" || looksLikeSingleKeyframe(track)) return Math.abs(time) < 1e-6 ? track : null;
        if (typeof track !== "object") return null;
        const key = Object.keys(track).find(t => Math.abs(Number(t) - time) < 1e-6);
        return key === undefined ? null : track[key];
    }

    function makeBakedTrackKey(vector, easing) {
        const key = {vector: cleanNumber(vector)};
        if (easing && typeof easing === "object") {
            ["lerp_mode", "easing", "easingArgs"].forEach(prop => {
                if (easing[prop] !== undefined) key[prop] = clone(easing[prop]);
            });
        }
        return key;
    }

    function getRigPivot(rig, boneName) {
        return (rig.pivots && rig.pivots[boneName]) || PAL_DEFAULT_PIVOTS[boneName] || [0, 0, 0];
    }

    function prepPalBoneMatrix(matrix, transform, pivot) {
        matrix = matrixTranslate(matrix, pivot[0], pivot[1], pivot[2]);
        matrix = matrixTranslate(matrix, -transform.position[0], transform.position[1], -transform.position[2]);
        matrix = matrixRotateZYX(matrix, transform.rotation);
        matrix = matrixScale(matrix, transform.scale[0], transform.scale[1], transform.scale[2]);
        matrix = matrixTranslate(matrix, -pivot[0], -pivot[1], -pivot[2]);
        return matrix;
    }

    function applyPalParentMatrixToTransform(transform, matrix, pivot) {
        let outMatrix = matrixTranslate(matrix, pivot[0], pivot[1], pivot[2]);
        outMatrix = matrixRotateZYX(outMatrix, transform.rotation);
        const matrixScaleValue = matrixGetScale(outMatrix);
        return {
            position: cleanNumber([
                transform.position[0] - outMatrix[12] + pivot[0],
                transform.position[1] + outMatrix[13] - pivot[1],
                transform.position[2] - outMatrix[14] - pivot[2]
            ]),
            rotation: cleanNumber(matrixGetEulerZYX(outMatrix)),
            scale: cleanNumber(transform.scale.map((value, index) => value * matrixScaleValue[index]))
        };
    }

    function removePalParentMatrixFromTransform(transform, matrix, pivot) {
        const basis = matrixTranslate(matrix, pivot[0], pivot[1], pivot[2]);
        const basisScale = matrixGetScale(basis).map(value => value || 1);
        const flatRotation = matrixRotateZYX(matrixIdentity(), transform.rotation);
        const localRotationMatrix = matrixMultiply(matrixInvert(basis), flatRotation);
        const localRotation = matrixGetEulerZYX(localRotationMatrix);
        const positionedMatrix = matrixRotateZYX(basis, localRotation);
        return {
            position: cleanNumber([
                transform.position[0] - (-positionedMatrix[12] + pivot[0]),
                transform.position[1] - (positionedMatrix[13] - pivot[1]),
                transform.position[2] - (-positionedMatrix[14] - pivot[2])
            ]),
            rotation: cleanNumber(localRotation),
            scale: cleanNumber(transform.scale.map((value, index) => value / basisScale[index]))
        };
    }

    function matrixIdentity() {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    function matrixMultiply(a, b) {
        const out = new Array(16).fill(0);
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                out[col * 4 + row] =
                    a[0 * 4 + row] * b[col * 4 + 0] +
                    a[1 * 4 + row] * b[col * 4 + 1] +
                    a[2 * 4 + row] * b[col * 4 + 2] +
                    a[3 * 4 + row] * b[col * 4 + 3];
            }
        }
        return out;
    }

    function matrixInvert(m) {
        const out = new Array(16);
        out[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
        out[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
        out[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
        out[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
        out[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
        out[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
        out[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
        out[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
        out[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
        out[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
        out[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
        out[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
        out[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
        out[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
        out[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
        out[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
        const det = m[0] * out[0] + m[1] * out[4] + m[2] * out[8] + m[3] * out[12];
        if (Math.abs(det) < 1e-12) return matrixIdentity();
        return out.map(value => value / det);
    }

    function matrixTranslate(matrix, x, y, z) {
        return matrixMultiply(matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
    }

    function matrixScale(matrix, x, y, z) {
        return matrixMultiply(matrix, [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
    }

    function matrixRotateZYX(matrix, rotation) {
        const [x, y, z] = rotation;
        const cx = Math.cos(x), sx = Math.sin(x);
        const cy = Math.cos(y), sy = Math.sin(y);
        const cz = Math.cos(z), sz = Math.sin(z);
        const rz = [cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        const ry = [cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1];
        const rx = [1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1];
        return matrixMultiply(matrixMultiply(matrixMultiply(matrix, rz), ry), rx);
    }

    function matrixGetScale(matrix) {
        return [
            Math.hypot(matrix[0], matrix[1], matrix[2]),
            Math.hypot(matrix[4], matrix[5], matrix[6]),
            Math.hypot(matrix[8], matrix[9], matrix[10])
        ];
    }

    function matrixGetEulerZYX(matrix) {
        const scale = matrixGetScale(matrix).map(value => value || 1);
        const m00 = matrix[0] / scale[0];
        const m10 = matrix[1] / scale[0];
        const m20 = matrix[2] / scale[0];
        const m21 = matrix[6] / scale[1];
        const m22 = matrix[10] / scale[2];
        const y = Math.asin(clamp(-m20, -1, 1));
        const cy = Math.cos(y);
        let x;
        let z;
        if (Math.abs(cy) > 1e-6) {
            x = Math.atan2(m21, m22);
            z = Math.atan2(m10, m00);
        } else {
            x = 0;
            z = Math.atan2(-matrix[4] / scale[1], matrix[5] / scale[1]);
        }
        return [x, y, z];
    }

    function bendKeyToHelperRotationKey(value, helperSign) {
        const out = {post: applySignToVector(valueToVector(value, "bend"), helperSign)};
        if (value && typeof value === "object" && !Array.isArray(value) && value.pre !== undefined) {
            out.pre = applySignToVector(valueToVector(value.pre, "bend"), helperSign);
        }
        const lerp = copyLerpFromKey(value);
        if (lerp !== undefined) out.lerp_mode = lerp;
        return out;
    }

    function helperFrameToBendFrame(frame, helperSign) {
        if (frame && typeof frame === "object" && !Array.isArray(frame)) {
            const out = {};
            if (frame.pre !== undefined) out.pre = bendFramePayload(applySignToVector(valueToVector(frame.pre, "bend"), helperSign));
            if (frame.post !== undefined) out.post = bendFramePayload(applySignToVector(valueToVector(frame.post, "bend"), helperSign));
            else if (frame.vector !== undefined || frame.value !== undefined) out.post = bendFramePayload(applySignToVector(valueToVector(frame, "bend"), helperSign));
            ["lerp_mode", "easing", "easingArgs", "easingX", "easingArgsX", "easingY", "easingArgsY", "easingZ", "easingArgsZ"].forEach(key => {
                if (frame[key] !== undefined) out[key] = clone(frame[key]);
            });
            if (!Object.keys(out).length) out.post = bendFramePayload(applySignToVector(valueToVector(frame, "bend"), helperSign));
            return out;
        }
        return {post: bendFramePayload(applySignToVector(valueToVector(frame, "bend"), helperSign))};
    }

    function parseEmoteToIR(data, nameHint) {
        if (!data || !data.emote) throw new Error("not an emote JSON: missing top-level emote");
        const node = data.emote;
        const version = parseInt(data.version === undefined ? 1 : data.version, 10);
        const beginTick = numberOr(node.beginTick, 0);
        let endTick = Math.max(numberOr(node.endTick, beginTick + 1), beginTick + 1);
        const isLoop = typeof node.isLoop === "string" ? node.isLoop.toLowerCase() === "true" : !!node.isLoop;
        const returnTickRaw = node.returnTick !== undefined ? parseInt(node.returnTick, 10) : 0;
        const loopTick = isLoop ? Math.max(returnTickRaw - 1, 0) : null;
        const stopTick = numberOr(node.stopTick, 0);
        if (!isLoop) endTick = stopTick <= endTick ? endTick + 3 : stopTick;
        const ir = createIR(data.name || nameHint || "animation");
        ir.lengthTicks = endTick;
        ir.loop = isLoop;
        ir.loopTick = loopTick;
        ir.metadata = {
            name: data.name || nameHint || "animation",
            author: data.author || "",
            description: data.description || "",
            version,
            beginTick,
            sourceEndTick: numberOr(node.endTick, endTick),
            stopTick,
            degrees: node.degrees !== undefined ? !!node.degrees : true,
            easeBeforeKeyframe: !!node.easeBeforeKeyframe
        };
        const degrees = ir.metadata.degrees;
        const moves = Array.isArray(node.moves) ? node.moves.slice() : [];
        moves.sort((a, b) => parseInt(numberOr(a.tick, 0), 10) - parseInt(numberOr(b.tick, 0), 10));
        moves.forEach(move => {
            const tick = numberOr(move.tick, 0);
            if (tick > endTick) return;
            const easing = normalizeEasing(move.easing || DEFAULT_EASING);
            const turn = parseInt(move.turn || 0, 10);
            Object.keys(move).forEach(rawBoneName => {
                if (["tick", "comment", "easing", "turn"].includes(rawBoneName)) return;
                const partNode = move[rawBoneName];
                if (!partNode || typeof partNode !== "object") return;
                let boneName = getCorrectPlayerBoneName(rawBoneName);
                if (version < 3 && boneName === "torso") boneName = "body";
                boneName = getCorrectPlayerBoneName(boneName);
                const bone = ensureBone(ir, boneName);
                ["x", "y", "z"].forEach((field, index) => {
                    if (partNode[field] !== undefined) {
                        appendAxisKey(bone, "position", field, tick, convertEmoteToInternalValue(boneName, "position", index, partNode[field], degrees, turn), easing);
                    }
                });
                ["pitch", "yaw", "roll"].forEach((field, index) => {
                    if (partNode[field] !== undefined) {
                        appendAxisKey(bone, "rotation", ["x", "y", "z"][index], tick, convertEmoteToInternalValue(boneName, "rotation", index, partNode[field], degrees, turn), easing);
                    }
                });
                ["scaleX", "scaleY", "scaleZ"].forEach((field, index) => {
                    if (partNode[field] !== undefined) {
                        appendAxisKey(bone, "scale", ["x", "y", "z"][index], tick, convertEmoteToInternalValue(boneName, "scale", index, partNode[field], degrees, turn), easing);
                    }
                });
                if (partNode.bend !== undefined) {
                    appendAxisKey(bone, "bend", "x", tick, convertEmoteToInternalValue(boneName, "bend", 0, partNode.bend, degrees, turn), easing);
                }
            });
        });
        const body = ir.bones.body;
        if (body && VECTOR_AXES.some(axis => body.bend[axis].length)) {
            const torso = ensureBone(ir, "torso");
            VECTOR_AXES.forEach(axis => {
                torso.bend[axis].push(...body.bend[axis]);
                body.bend[axis] = [];
            });
            if (!boneHasAnyKeyframes(body)) delete ir.bones.body;
        }
        if (!ir.metadata.easeBeforeKeyframe) {
            Object.values(ir.bones).forEach(correctEasingsForBone);
        }
        Object.keys(ir.bones).forEach(boneName => {
            if (boneName === "right_item" || boneName === "left_item") swapYZKeyframesForItems(ir.bones[boneName]);
        });
        return ir;
    }

    function parseAnimationsToIR(data, animationName) {
        if (!data || !data.animations) throw new Error("not an animations JSON: missing top-level animations");
        const out = {};
        const names = animationName ? [animationName] : Object.keys(data.animations);
        names.forEach(name => {
            const animObj = data.animations[name];
            if (!animObj) throw new Error(`animation ${name} not found`);
            const ir = createIR(name);
            if (animObj.animation_length !== undefined) ir.lengthTicks = numberOr(animObj.animation_length, 0) * 20;
            if (animObj.loopTick !== undefined) {
                ir.loop = true;
                ir.loopTick = numberOr(animObj.loopTick, 0) * 20;
            } else if (animObj.loop === true || String(animObj.loop).toLowerCase() === "true") {
                ir.loop = true;
                ir.loopTick = 0;
            }
            let maxTick = 0;
            const bones = animObj.bones || {};
            Object.keys(bones).forEach(rawBoneName => {
                const boneName = getCorrectPlayerBoneName(rawBoneName);
                const bone = ensureBone(ir, boneName);
                ANIM_TRANSFORMS.forEach(transform => {
                    getAnimationEntries((bones[rawBoneName] || {})[transform], transform).forEach(([seconds, element]) => {
                        const [vector, easings, args] = elementVectorAndEasing(element, transform);
                        const fullVector = vector.slice();
                        while (fullVector.length < 3) fullVector.push(SKIP);
                        VECTOR_AXES.forEach((axis, index) => {
                            const raw = fullVector[index];
                            if (isSkip(raw)) return;
                            const internal = parseAnimValueToInternal(raw, transform);
                            const tick = seconds * 20;
                            bone[transform][axis].push({
                                tick,
                                value: internal,
                                easing: normalizeEasing(easings[axis] || DEFAULT_EASING),
                                easingArgs: args[axis]
                            });
                            maxTick = Math.max(maxTick, tick);
                        });
                    });
                });
            });
            if (!ir.lengthTicks) ir.lengthTicks = maxTick || 0;
            out[name] = ir;
        });
        return out;
    }

    function irToAnimationsJson(ir, animationName) {
        const animName = animationName || ir.name || "animation";
        const bonesOut = {};
        Object.keys(ir.bones).sort().forEach(boneName => {
            const bone = ir.bones[boneName];
            const boneOut = {};
            ANIM_TRANSFORMS.forEach(transform => {
                const stacks = bone[transform];
                const activeAxes = Object.keys(stacks).filter(axis => stacks[axis].length);
                if (!activeAxes.length) return;
                const timeMap = {};
                activeAxes.forEach(axis => {
                    addInitialDefaultKeysForAnimation(stacks[axis], transform).forEach(key => {
                        const entry = timeMap[key.tick] = timeMap[key.tick] || {vector: [SKIP, SKIP, SKIP], axisEasing: {}};
                        const index = {x: 0, y: 1, z: 2}[axis];
                        entry.vector[index] = valueForAnimationJson(key.value, transform);
                        entry.axisEasing[axis] = key.easing;
                    });
                });
                const transformOut = {};
                Object.keys(timeMap).map(Number).sort((a, b) => a - b).forEach(tick => {
                    const entry = timeMap[tick];
                    const used = VECTOR_AXES.filter((axis, index) => !isSkip(entry.vector[index]));
                    const keyObj = {vector: cleanNumber(entry.vector)};
                    if (used.length) {
                        const vals = used.map(axis => normalizeEasing(entry.axisEasing[axis] || DEFAULT_EASING));
                        if (new Set(vals).size === 1) {
                            if (vals[0] !== DEFAULT_EASING) keyObj.easing = easingForAnimation(vals[0]);
                        } else {
                            used.forEach(axis => {
                                const easing = normalizeEasing(entry.axisEasing[axis] || DEFAULT_EASING);
                                if (easing !== DEFAULT_EASING) keyObj["easing" + axis.toUpperCase()] = easingForAnimation(easing);
                            });
                        }
                    }
                    transformOut[formatSeconds(tick / 20)] = transform === "bend" ? bendKeyForAnimationJson(keyObj) : keyObj;
                });
                boneOut[transform] = transformOut;
            });
            if (Object.keys(boneOut).length) bonesOut[boneName] = boneOut;
        });
        const animObj = {
            animation_length: cleanNumber(ir.lengthTicks / 20),
            bones: bonesOut
        };
        if (ir.loop) {
            animObj.loop = true;
            if (ir.loopTick && ir.loopTick > 0) animObj.loopTick = cleanNumber(ir.loopTick / 20);
        }
        return {format_version: "1.8.0", animations: {[animName]: animObj}};
    }

    function irToEmoteJson(ir, options = {}) {
        const moves = [];
        Object.keys(ir.bones).sort().forEach(boneName => {
            const bone = ir.bones[boneName];
            const emoteBoneName = restorePlayerBoneName(boneName);
            ANIM_TRANSFORMS.forEach(transform => {
                const stacks = splitAnimAxisForEmoteItems(boneName, transform, bone[transform]);
                const axes = transform === "bend" ? ["x"] : ["x", "y", "z"];
                const fields = TRANSFORM_AXES[transform];
                axes.forEach((axis, axisIndex) => {
                    (stacks[axis] || []).slice().sort((a, b) => a.tick - b.tick).forEach(key => {
                        const defaultInternal = transform === "scale" ? 1 : 0;
                        if (Math.abs(key.tick) < 1e-9 && isNum(key.value) && Math.abs(Number(key.value) - defaultInternal) < 1e-9) return;
                        const value = convertInternalToEmoteValue(boneName, transform, axisIndex, key.value, !!options.degrees);
                        moves.push({
                            tick: formatTick(key.tick),
                            easing: easingForEmote(key.easing),
                            turn: 0,
                            [emoteBoneName]: {
                                [fields[axisIndex]]: cleanNumber(value)
                            }
                        });
                    });
                });
            });
        });
        moves.sort((a, b) => {
            const tickDelta = numberOr(a.tick, 0) - numberOr(b.tick, 0);
            if (tickDelta) return tickDelta;
            const boneA = Object.keys(a).find(k => !["tick", "easing", "turn"].includes(k)) || "";
            const boneB = Object.keys(b).find(k => !["tick", "easing", "turn"].includes(k)) || "";
            return boneA.localeCompare(boneB);
        });
        const endTick = Number.isFinite(ir.lengthTicks) ? ir.lengthTicks : 0;
        const emote = {
            isLoop: ir.loop ? "true" : "false",
            returnTick: ir.loop ? parseInt((ir.loopTick || 0) + 1, 10) : 2,
            beginTick: 0,
            endTick: cleanNumber(ir.loop ? endTick : Math.max(0, endTick - 3)),
            stopTick: cleanNumber(endTick),
            degrees: !!options.degrees,
            moves
        };
        if (options.easeBeforeKeyframe !== false) emote.easeBeforeKeyframe = true;
        return {
            version: options.version || 3,
            name: options.name || ir.metadata.name || ir.name || "animation",
            author: options.author !== undefined ? options.author : (ir.metadata.author || ""),
            description: options.description !== undefined ? options.description : (ir.metadata.description || ""),
            emote
        };
    }

    function createIR(name) {
        return {
            name: name || "animation",
            lengthTicks: 0,
            loop: false,
            loopTick: null,
            bones: {},
            metadata: {}
        };
    }

    function createBoneIR() {
        return {
            position: {x: [], y: [], z: []},
            rotation: {x: [], y: [], z: []},
            scale: {x: [], y: [], z: []},
            bend: {x: [], y: [], z: []}
        };
    }

    function ensureBone(ir, boneName) {
        if (!ir.bones[boneName]) ir.bones[boneName] = createBoneIR();
        return ir.bones[boneName];
    }

    function appendAxisKey(bone, transform, axis, tick, value, easing) {
        bone[transform][axis].push({tick: Number(tick), value, easing: normalizeEasing(easing)});
    }

    function correctEasingsForBone(bone) {
        ANIM_TRANSFORMS.forEach(transform => {
            Object.values(bone[transform]).forEach(correctEasingsForAxis);
        });
    }

    function correctEasingsForAxis(keys) {
        if (!keys.length) return;
        let previous = "easeinoutsine";
        keys.forEach(key => {
            const current = key.easing;
            key.easing = previous;
            previous = current;
        });
        const last = keys[keys.length - 1];
        keys.push({tick: last.tick + EPS_TICK, value: last.value, easing: previous});
    }

    function swapYZKeyframesForItems(bone) {
        [bone.position.y, bone.position.z] = [bone.position.z, bone.position.y];
        [bone.rotation.y, bone.rotation.z] = [bone.rotation.z, bone.rotation.y];
    }

    function boneHasAnyKeyframes(bone) {
        return ANIM_TRANSFORMS.some(transform => Object.values(bone[transform]).some(keys => keys.length));
    }

    function getAnimationEntries(element, channel) {
        if (element === undefined || element === null) return [];
        if (isNum(element)) return [[0, channel === "bend" ? [element, 0, 0] : [element, element, element], "0"]];
        if (Array.isArray(element)) return [[0, element, "0"]];
        if (looksLikeSingleKeyframe(element)) return [[0, element, "0"]];
        if (typeof element === "object") {
            if (element.vector !== undefined) return [[0, element, "0"]];
            if (element.value !== undefined) {
                const obj = clone(element);
                obj.vector = [obj.value, 0, 0];
                return [[0, obj, "0"]];
            }
            const out = [];
            Object.keys(element).forEach(key => {
                const timestamp = parseTimestamp(key);
                let value = element[key];
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    value = clone(value);
                    if (value.value !== undefined) {
                        value.vector = [value.value, 0, 0];
                        out.push([timestamp, value, key]);
                        return;
                    }
                }
                out.push([timestamp, value, key]);
            });
            out.sort((a, b) => a[0] - b[0]);
            return out;
        }
        return [[0, channel === "bend" ? [element, 0, 0] : [element, element, element], "0"]];
    }

    function extractBedrockKeyframe(keyframe) {
        if (Array.isArray(keyframe)) return keyframe;
        if (isNum(keyframe)) return [keyframe, 0, 0];
        if (!keyframe || typeof keyframe !== "object") return [keyframe, keyframe, keyframe];
        if (keyframe.vector !== undefined) return keyframe.vector;
        if (keyframe.pre !== undefined) return Array.isArray(keyframe.pre) ? keyframe.pre : extractBedrockKeyframe(keyframe.pre);
        return Array.isArray(keyframe.post) ? keyframe.post : extractBedrockKeyframe(keyframe.post);
    }

    function elementVectorAndEasing(element, channel) {
        if (Array.isArray(element)) return [element, {}, {}];
        if (element && typeof element === "object") {
            const vector = element.vector !== undefined ? element.vector : extractBedrockKeyframe(element);
            const baseEasing = normalizeEasing(element.easing || DEFAULT_EASING);
            const easings = {};
            const args = {};
            ["X", "Y", "Z"].forEach(letter => {
                const axis = letter.toLowerCase();
                easings[axis] = normalizeEasing(element["easing" + letter] || baseEasing);
                if (element["easingArgs" + letter] !== undefined) args[axis] = element["easingArgs" + letter];
            });
            if (element.easingArgs !== undefined) {
                ["x", "y", "z"].forEach(axis => {
                    if (args[axis] === undefined) args[axis] = element.easingArgs;
                });
            }
            return [vector, easings, args];
        }
        if (isNum(element)) return [channel === "bend" ? [element, 0, 0] : [element, element, element], {}, {}];
        return [channel === "bend" ? [element, 0, 0] : [element, element, element], {}, {}];
    }

    function parseAnimValueToInternal(value, transform) {
        if (isSkip(value)) return value;
        const isForRotation = transform === "rotation" || transform === "bend";
        if (isNum(value)) return isForRotation ? degToRad(Number(value)) : Number(value);
        if (typeof value === "string") {
            const n = Number(value.trim());
            if (!Number.isNaN(n)) return isForRotation ? degToRad(n) : n;
        }
        return value;
    }

    function valueForAnimationJson(value, transform) {
        if (!isNum(value)) return value;
        if (transform === "rotation" || transform === "bend") return cleanNumber(radToDeg(Number(value)));
        return cleanNumber(Number(value));
    }

    function addInitialDefaultKeysForAnimation(axisKeys, transform) {
        if (!axisKeys.length) return [];
        const keys = axisKeys.slice().sort((a, b) => a.tick - b.tick);
        if (keys[0].tick <= 0) return keys;
        return [{tick: 0, value: transform === "scale" ? 1 : 0, easing: DEFAULT_EASING}, ...keys];
    }

    function convertEmoteToInternalValue(bone, transform, axisIndex, rawValue, degrees, turn) {
        let transformType = null;
        if (transform === "position") transformType = bone === "body" ? "position" : null;
        else if (transform === "rotation") transformType = "rotation";
        else if (transform === "scale") transformType = "scale";
        else if (transform === "bend") transformType = "bend";
        let value = Number(rawValue);
        if (!Number.isFinite(value)) return rawValue;
        if (transformType === null) value -= defaultValues(bone)[axisIndex];
        if (shouldNegateForEmote(bone, transform, axisIndex, transformType)) value *= -1;
        if (transformType === "rotation") {
            if (degrees) value = degToRad(value);
            value += Math.PI * 2 * Number(turn || 0);
        }
        if (transformType === "position") value *= 16;
        return value;
    }

    function convertInternalToEmoteValue(bone, transform, axisIndex, internalValue, degrees) {
        if (!isNum(internalValue)) return internalValue;
        let transformType = null;
        if (transform === "position") transformType = bone === "body" ? "position" : null;
        else if (transform === "rotation") transformType = "rotation";
        else if (transform === "scale") transformType = "scale";
        else if (transform === "bend") transformType = "bend";
        let value = Number(internalValue);
        if (transformType === "position") value /= 16;
        if (transformType === "rotation" && degrees) value = radToDeg(value);
        if (shouldNegateForEmote(bone, transform, axisIndex, transformType)) value *= -1;
        if (transformType === null) value += defaultValues(bone)[axisIndex];
        return value;
    }

    function shouldNegateForEmote(bone, transform, axisIndex, transformType) {
        const isItem = bone === "right_item" || bone === "left_item";
        const isCape = bone === "cape";
        const isBody = bone === "body";
        if (transform === "position" && isBody) return false;
        if (transform === "position" || transform === "rotation") {
            if (axisIndex === 0) return isItem || isCape || isBody;
            if (axisIndex === 1) return isItem || transformType === null || (isBody && transformType === "rotation");
            if (axisIndex === 2) return (isItem && transformType === "rotation") || isCape;
        }
        return false;
    }

    function splitAnimAxisForEmoteItems(boneName, transform, stacks) {
        if ((boneName !== "right_item" && boneName !== "left_item") || (transform !== "position" && transform !== "rotation")) return stacks;
        return {x: stacks.x || [], y: stacks.z || [], z: stacks.y || []};
    }

    function normalizeTrack(track) {
        if (track === undefined || track === null) return {};
        if (typeof track === "object" && !Array.isArray(track)) {
            if (looksLikeSingleKeyframe(track)) return {"0": track};
            return clone(track);
        }
        return {"0": track};
    }

    function looksLikeSingleKeyframe(obj) {
        return obj && typeof obj === "object" && ["vector", "value", "pre", "post", "lerp_mode", "easing"].some(key => obj[key] !== undefined);
    }

    function valueToVector(value, channel) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            if (value.value !== undefined) return [value.value, 0, 0];
            if (value.vector !== undefined) return valueToVector(value.vector, channel);
            if (value.post !== undefined) return valueToVector(value.post, channel);
            if (value.pre !== undefined) return valueToVector(value.pre, channel);
        }
        if (Array.isArray(value)) {
            const out = value.slice(0, 3);
            while (out.length < 3) out.push(channel === "scale" ? 1 : 0);
            return out;
        }
        if (isNum(value) || typeof value === "string") {
            if (channel === "scale") return [value, value, value];
            return [value, 0, 0];
        }
        return channel === "scale" ? [1, 1, 1] : [0, 0, 0];
    }

    function vectorDataPoint(vector) {
        const point = {};
        ["x", "y", "z"].forEach((axis, index) => {
            if (!isSkip(vector[index])) point[axis] = valueForBlockbench(vector[index]);
        });
        return point;
    }

    function dataPointVector(point, channel) {
        const fallback = channel === "scale" ? 1 : 0;
        return cleanNumber([
            valueFromBlockbench(point && point.x !== undefined ? point.x : fallback),
            valueFromBlockbench(point && point.y !== undefined ? point.y : fallback),
            valueFromBlockbench(point && point.z !== undefined ? point.z : fallback)
        ]);
    }

    function valueForBlockbench(value) {
        if (typeof value === "string") {
            const n = Number(value);
            return Number.isNaN(n) ? value : n;
        }
        return value;
    }

    function valueFromBlockbench(value) {
        if (typeof value === "string") {
            const n = Number(value);
            return Number.isNaN(n) ? value : n;
        }
        return value;
    }

    function bendFramePayload(vector) {
        const out = valueToVector(vector, "bend");
        return hasNonZeroYZ(out) ? cleanNumber(out) : cleanZero(firstNonSkip(out, 0));
    }

    function bendKeyForAnimationJson(keyObj) {
        const vector = valueToVector(keyObj.vector, "bend");
        const scalar = bendFramePayload(vector);
        if (!hasNonZeroYZ(vector)) {
            const out = {};
            if (keyObj.easing !== undefined) out.easing = keyObj.easing;
            if (keyObj.easingArgs !== undefined) out.easingArgs = keyObj.easingArgs;
            if (keyObj.easingX !== undefined) out.easingX = keyObj.easingX;
            if (keyObj.easingArgsX !== undefined) out.easingArgsX = keyObj.easingArgsX;
            out.post = scalar;
            return out;
        }
        const out = {post: cleanNumber(vector)};
        ["easing", "easingArgs", "easingX", "easingArgsX", "easingY", "easingArgsY", "easingZ", "easingArgsZ"].forEach(key => {
            if (keyObj[key] !== undefined) out[key] = keyObj[key];
        });
        return out;
    }

    function hasNonZeroYZ(vector) {
        return axisHasValue(vector[1]) || axisHasValue(vector[2]);
    }

    function axisHasValue(value) {
        if (isSkip(value) || value === undefined || value === null) return false;
        if (isNum(value)) return Math.abs(Number(value)) > 1e-12;
        if (typeof value === "string") {
            const n = Number(value.trim());
            return Number.isNaN(n) || Math.abs(n) > 1e-12;
        }
        return true;
    }

    function vectorX(value, defaultValue) {
        if (value === undefined || value === null) return defaultValue;
        if (isNum(value) || typeof value === "string") return cleanZero(value);
        if (Array.isArray(value)) return value.length ? cleanZero(firstNonSkip(value, defaultValue)) : defaultValue;
        if (typeof value === "object") {
            if (value.value !== undefined) return vectorX(value.value, defaultValue);
            if (value.vector !== undefined) return vectorX(value.vector, defaultValue);
            if (value.post !== undefined) return vectorX(value.post, defaultValue);
            if (value.pre !== undefined) return vectorX(value.pre, defaultValue);
        }
        return defaultValue;
    }

    function applySignToVector(vector, sign) {
        const out = valueToVector(vector, "bend");
        return cleanNumber(out.map(value => applySign(value, sign)));
    }

    function firstNonSkip(values, defaultValue) {
        for (const value of values) {
            if (!isSkip(value)) return value;
        }
        return defaultValue;
    }

    function copyLerpFromKey(value) {
        if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
        const easing = value.lerp_mode !== undefined ? value.lerp_mode : (value.easingX !== undefined ? value.easingX : value.easing);
        if (easing === undefined) return undefined;
        return normalizeEasing(easing) === DEFAULT_EASING ? undefined : easing;
    }

    function applySign(value, sign) {
        if (sign === 1) return value;
        if (isNum(value)) return cleanZero(Number(value) * sign);
        if (typeof value === "string") {
            if (value.trim() === "0" || value.trim() === "0.0") return value;
            return `(${sign})*(${value})`;
        }
        return value;
    }

    function blockbenchLoopForAnimation(value) {
        const raw = String(value === undefined || value === null ? "" : value).toLowerCase();
        if (value === true || raw === "true" || raw === "loop") return "loop";
        if (raw === "hold" || raw === "hold_on_last_frame") return "hold";
        return "once";
    }

    function animationLoopForJson(value) {
        const raw = String(value === undefined || value === null ? "" : value).toLowerCase();
        if (value === true || raw === "true" || raw === "loop") return true;
        if (raw === "hold" || raw === "hold_on_last_frame") return "hold_on_last_frame";
        return undefined;
    }

    function removeEmptyBones(bones) {
        Object.keys(bones).forEach(name => {
            const bone = bones[name];
            if (bone && typeof bone === "object" && !Object.keys(bone).length) delete bones[name];
        });
    }

    function collectAnimations(scope) {
        if (scope === "selected") return Animation.selected ? [Animation.selected] : [];
        return Animation.all ? Animation.all.slice() : [];
    }

    function hasPlayerHelperBones() {
        return Object.values(BEND_HELPER_BONES).every(name => !!findGroupByName(name));
    }

    function findGroupByName(name) {
        if (!globalThis.Group || !Group.all) return null;
        const target = getCorrectPlayerBoneName(name);
        return Group.all.find(group => getCorrectPlayerBoneName(group.name) === target) || null;
    }

    function findGroupNameByUuid(uuid) {
        if (!globalThis.Group || !Group.all) return "";
        const group = Group.all.find(item => item.uuid === uuid);
        return group ? group.name : "";
    }

    function uniqueAnimationName(name) {
        const base = name || "animation";
        const existing = new Set((Animation.all || []).map(animation => animation.name));
        if (!existing.has(base)) return base;
        let index = 2;
        while (existing.has(`${base}_${index}`)) index += 1;
        return `${base}_${index}`;
    }

    function uniqueAnimationKey(map, name) {
        const base = safeAnimationName(name);
        if (!map[base]) return base;
        let index = 2;
        while (map[`${base}_${index}`]) index += 1;
        return `${base}_${index}`;
    }

    function safeAnimationName(name) {
        return String(name || "animation").trim() || "animation";
    }

    function safeFileName(name) {
        return String(name || "animation.json").replace(/[<>:"/\\|?*]+/g, "_");
    }

    function baseName(path) {
        return String(path || "").split(/[\\/]/).pop() || "animation";
    }

    function parseJson(text) {
        if (typeof autoParseJSON === "function") return autoParseJSON(text, false);
        return JSON.parse(text);
    }

    function prettyJson(data) {
        return JSON.stringify(cleanNumber(data), null, 4) + "\n";
    }

    function clone(value) {
        return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    }

    function normalizeEasing(value) {
        let key = value === undefined || value === null ? DEFAULT_EASING : String(value);
        key = key.replace(/[_-]/g, "").toLowerCase();
        if (EASING_NAMES[key]) return key;
        const key2 = "ease" + key;
        if (EASING_NAMES[key2]) return key2;
        return DEFAULT_EASING;
    }

    function easingForEmote(easing) {
        return EASING_NAMES[normalizeEasing(easing)] || "LINEAR";
    }

    function easingForAnimation(easing) {
        return ANIM_EASING_PRETTY[normalizeEasing(easing)] || normalizeEasing(easing);
    }

    function getCorrectPlayerBoneName(name) {
        const raw = String(name || "").trim();
        if (EXACT_BONE_ALIASES[raw]) return EXACT_BONE_ALIASES[raw];
        const normalized = normalizeBoneKey(raw);
        return NORMALIZED_BONE_ALIASES[normalized] || normalized;
    }

    function normalizeBoneKey(name) {
        return String(name || "")
            .trim()
            .replace(/[\s.-]+/g, "_")
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
            .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
            .replace(/_+/g, "_")
            .replace(/^_+|_+$/g, "")
            .toLowerCase();
    }

    function restorePlayerBoneName(name) {
        return String(name).toLowerCase().replace(/_(.)/g, (_match, char) => char.toUpperCase());
    }

    function defaultValues(bone) {
        return DEFAULT_VALUES[bone] || [0, 0, 0];
    }

    function cleanNumber(value) {
        if (typeof value === "number") {
            if (Math.abs(value) < 1e-12) return 0;
            const rounded = Math.round(value * 1e12) / 1e12;
            return Math.abs(rounded - Math.round(rounded)) < 1e-12 ? Math.round(rounded) : rounded;
        }
        if (Array.isArray(value)) return value.map(cleanNumber);
        if (value && typeof value === "object") {
            const out = {};
            Object.keys(value).forEach(key => {
                out[key] = cleanNumber(value[key]);
            });
            return out;
        }
        return value;
    }

    function cleanZero(value) {
        return typeof value === "number" && Math.abs(value) < 1e-12 ? 0 : value;
    }

    function numberOr(value, fallback) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function isFiniteNumberLike(value) {
        return isNum(value) || (typeof value === "string" && Number.isFinite(Number(value)));
    }

    function vectorNearlyEquals(a, b) {
        return VECTOR_AXES.every((_axis, index) => Math.abs(numberOr(a[index], 0) - numberOr(b[index], 0)) < 1e-9);
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function parseTimestamp(value) {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }

    function formatSeconds(seconds) {
        const cleaned = cleanNumber(seconds);
        if (Number.isInteger(cleaned)) return String(cleaned);
        return Number(cleaned).toFixed(12).replace(/0+$/, "").replace(/\.$/, "");
    }

    function formatTick(tick) {
        return cleanNumber(tick);
    }

    function isNum(value) {
        return typeof value === "number" && Number.isFinite(value);
    }

    function isSkip(value) {
        return typeof value === "string" && (value === "pal.skip" || value === "pal.disabled");
    }

    function degToRad(value) {
        return value * Math.PI / 180;
    }

    function radToDeg(value) {
        return value * 180 / Math.PI;
    }

    function showError(message) {
        Blockbench.showMessageBox({
            title: "PAL Bend Player Tools",
            message
        });
    }
})();
