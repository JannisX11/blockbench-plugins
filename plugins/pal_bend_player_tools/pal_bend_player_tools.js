(() => {
    const PLUGIN_ID = "pal_bend_player_tools";
    const SKIP = "pal.skip";
    const EPS_TICK = 0.001;
    const DEFAULT_EASING = "linear";
    const CLEAN_EPSILON = 1e-6;
    const EXPORT_DECIMAL_SCALE = 1e9;
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
        torso: "Body_Lower",
        torso_bend: "Body",
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
        Body_Lower: "torso",
        Body: "torso_bend",
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
        body_lower: "torso",
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
    const RUNTIME_LOCAL_ITEM_BONES = ["right_item", "left_item"];
    const PAL_RENDER_BONES = ["torso", "head", "right_arm", "left_arm", "right_leg", "left_leg", "right_item", "left_item", "cape", "elytra"];
    const PAL_VIRTUAL_ROOT_CHILD_BONES = ["torso", "head", "right_arm", "left_arm", "right_leg", "left_leg"];
    const PAL_BODY_EXPORT_CHILD_BONES = ["torso", "head", "right_arm", "left_arm", "right_leg", "left_leg"];
    const FLAT_RUNTIME_COMPENSATION_POSITION_BONES = ["torso", "head", "right_arm", "left_arm", "right_leg", "left_leg"];
    const PAL_TOOLS_METADATA_KEY = "pal_bend_player_tools";
    const PAL_TOOLS_RUNTIME_LOCAL_FORMAT = "runtime_local_v1";
    const PAL_EXPORT_KEY_ORDER = [
        "format_version", PAL_TOOLS_METADATA_KEY, "format", "source_rig", "parents", "pivots", "model", "animations", "animation_length", "loop", "loopTick", "bones",
        "body", "torso", "torso_bend", "head",
        "right_arm", "right_arm_bend", "right_item",
        "left_arm", "left_arm_bend", "left_item",
        "right_leg", "right_leg_bend", "left_leg", "left_leg_bend",
        "cape", "elytra",
        "position", "rotation", "scale", "bend",
        "pivot", "pre", "post", "vector", "lerp_mode", "easing", "easingArgs"
    ];
    const PAL_DEFAULT_PIVOTS = {
        right_item: [6, 12, -2],
        left_item: [-6, 12, -2],
        right_arm: [5, 22, 0],
        right_arm_bend: [5, 18, 0],
        left_arm: [-5, 22, 0],
        left_arm_bend: [-5, 18, 0],
        right_leg: [2, 12, 0],
        right_leg_bend: [2, 6, 0],
        left_leg: [-2, 12, 0],
        left_leg_bend: [-2, 6, 0],
        torso: [0, 24, 0],
        torso_bend: [0, 18, 0],
        head: [0, 24, 0],
        body: [0, 12, 0],
        cape: [0, 24, 2],
        elytra: [0, 24, 2]
    };
    const TEXT = {
        en: {
            actionCreateName: "PAL Bend Player Animation",
            actionCreateDescription: "Create a PAL Bend Player Animation project with the bundled player_model.geo.",
            actionCreateDragoncoreName: "PAL Bend Player Animation - DragonCore Player Model",
            actionCreateDragoncoreDescription: "Create an animation project with DragonCore player-model bone names, hierarchy, and pivots.",
            actionImportName: "PAL: Import Player Animation",
            actionImportDescription: "Import PAL original, PAL emote, DragonCore player-model, or PlayerAnimationLibraryMoreRotation animations.",
            actionExportName: "PAL: Export Player Animation",
            actionExportDescription: "Export as PAL original or PlayerAnimationLibraryMoreRotation automatically, with optional PAL emote export.",
            actionExportGeoName: "PAL: Export Bundled player_model.geo.json",
            actionExportGeoDescription: "Export the bundled PAL Bend Player Animation model.",
            projectDragoncoreName: "player_model.geo DragonCore Player Model",
            projectDragoncoreCreated: "Created player_model.geo DragonCore Player Model project",
            projectCreated: "Created player_model.geo player animation project",
            projectCreateFailed: "Failed to create player animation project: {message}",
            importFailed: "Import failed: {message}",
            jsonParseFailed: "Could not parse JSON: {message}",
            unsupportedFile: "This file is neither an emote JSON nor an animation JSON with an animations field.",
            importSummary: "PAL imported {created} animation(s) ({profile}){missing}",
            importMissing: ", {count} unmatched bone(s): {bones}",
            profilePalOriginal: "PAL Original",
            profilePalEmote: "PAL Emote",
            profileDragoncore: "DragonCore Player Model",
            profileMoreRotation: "MoreRotation",
            profileRuntimeLocal: "PAL Tools Runtime-Local",
            profileHierarchy: "PAL Hierarchy",
            profileHelperProject: "Project Helper",
            profileAuto: "Auto Detected",
            exportDialogTitle: "Export PAL Animation",
            exportFormatLabel: "Export Type",
            exportFormatAnimations: "Animations JSON (Auto: PAL Original / MoreRotation)",
            exportFormatEmote: "PAL Emote (PAL original bend only)",
            exportScopeLabel: "Animation Scope",
            exportScopeSelected: "Selected Animation",
            exportScopeAll: "All Animations",
            emoteNameLabel: "Emote Name",
            authorLabel: "Author",
            descriptionLabel: "Description",
            exportFailed: "Export failed: {message}",
            noAnimationsToExport: "There are no animations to export.",
            emoteSingleOnly: "Emote export supports one animation at a time. Choose Selected Animation.",
            emoteCannotExpressMoreRotation: "This animation uses bend Y/Z rotation or helper position/scale data that emote cannot represent. Export animations JSON instead.",
            helperBonesMissing: "This project does not have the complete player_model.geo helper-bend bones. Create a PAL Bend Player Animation project first. The plugin will still import the animation, but tracks for missing bones will not be visible."
        },
        zh: {
            actionCreateName: "PAL Bend Player Animation",
            actionCreateDescription: "新建使用内置 player_model.geo 的 PAL Bend Player Animation 项目",
            actionCreateDragoncoreName: "PAL Bend Player Animation - 龙核玩家模型版",
            actionCreateDragoncoreDescription: "新建使用龙核玩家模型组名、父子继承和枢轴点的动画项目",
            actionImportName: "PAL：导入玩家动画",
            actionImportDescription: "导入 PAL 原版、PAL emote、龙核玩家模型版或 PlayerAnimationLibraryMoreRotation 动画",
            actionExportName: "PAL：导出玩家动画",
            actionExportDescription: "自动导出 PAL 原版或 PlayerAnimationLibraryMoreRotation，必要时可选择 PAL emote",
            actionExportGeoName: "PAL：导出内置 player_model.geo.json",
            actionExportGeoDescription: "导出插件内置的 PAL Bend Player Animation 模型",
            projectDragoncoreName: "player_model.geo 龙核玩家模型版",
            projectDragoncoreCreated: "已创建 player_model.geo 龙核玩家模型版",
            projectCreated: "已创建 player_model.geo 玩家动画项目",
            projectCreateFailed: "创建玩家动画项目失败：{message}",
            importFailed: "导入动画失败：{message}",
            jsonParseFailed: "无法解析 JSON：{message}",
            unsupportedFile: "文件不是 emote JSON，也不是带 animations 字段的动画 JSON。",
            importSummary: "PAL 插件已导入 {created} 个动画（{profile}）{missing}",
            importMissing: "，{count} 个骨骼未匹配：{bones}",
            profilePalOriginal: "PAL 原版",
            profilePalEmote: "PAL emote",
            profileDragoncore: "龙核玩家模型版",
            profileMoreRotation: "MoreRotation",
            profileRuntimeLocal: "插件运行时局部格式",
            profileHierarchy: "PAL 层级格式",
            profileHelperProject: "项目 helper 格式",
            profileAuto: "自动识别",
            exportDialogTitle: "PAL 导出动画",
            exportFormatLabel: "导出类型",
            exportFormatAnimations: "animations JSON（自动：PAL 原版 / MoreRotation）",
            exportFormatEmote: "PAL emote（仅 PAL 原版 bend）",
            exportScopeLabel: "动画范围",
            exportScopeSelected: "当前选中动画",
            exportScopeAll: "全部动画",
            emoteNameLabel: "Emote 名称",
            authorLabel: "作者",
            descriptionLabel: "描述",
            exportFailed: "导出动画失败：{message}",
            noAnimationsToExport: "没有可导出的动画。",
            emoteSingleOnly: "emote 一次只能导出一个动画，请选择“当前选中动画”。",
            emoteCannotExpressMoreRotation: "当前动画使用了 bend 的 Y/Z 轴或 helper 位移/缩放，emote 无法表达这些 MoreRotation 数据。请导出 animations JSON。",
            helperBonesMissing: "当前项目没有完整的 player_model.geo helper-bend 骨骼。建议先新建 PAL Bend Player Animation 项目。插件仍会导入动画，但缺少骨骼的轨道不会显示。"
        }
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
                                    "visible_bounds_offset": [
                                            0,
                                            1.25,
                                            0
                                    ]
                            },
                            "bones": [
                                    {
                                            "name": "torso",
                                            "pivot": [
                                                    0,
                                                    24,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -4,
                                                                    12,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    8,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    20,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    16,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    32,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    28,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    20,
                                                                                    16
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    28,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "torso_bend",
                                            "parent": "torso",
                                            "pivot": [
                                                    0,
                                                    18,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -4,
                                                                    18,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    8,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    20,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    16,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    32,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    28,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    20,
                                                                                    16
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    28,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "head",
                                            "pivot": [
                                                    0,
                                                    24,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -4,
                                                                    24,
                                                                    -4
                                                            ],
                                                            "size": [
                                                                    8,
                                                                    8,
                                                                    8
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    8,
                                                                                    8
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    8
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    0,
                                                                                    8
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    8
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    24,
                                                                                    8
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    8
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    16,
                                                                                    8
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    8
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    8,
                                                                                    0
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    8
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    16,
                                                                                    8
                                                                            ],
                                                                            "uv_size": [
                                                                                    8,
                                                                                    -8
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "right_arm",
                                            "pivot": [
                                                    -5,
                                                    22,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -8,
                                                                    18,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    44,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    40,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    52,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    48,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    44,
                                                                                    16
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    48,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "right_arm_bend",
                                            "parent": "right_arm",
                                            "pivot": [
                                                    -5,
                                                    18,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -8,
                                                                    12,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    44,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    40,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    52,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    48,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    44,
                                                                                    16
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    48,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "right_item",
                                            "parent": "right_arm_bend",
                                            "pivot": [
                                                    -6,
                                                    12,
                                                    -2
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -6,
                                                                    12.25,
                                                                    -11
                                                            ],
                                                            "size": [
                                                                    0,
                                                                    4,
                                                                    11
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    32,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    32,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    32,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    32,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    32,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    32,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "left_arm",
                                            "pivot": [
                                                    5,
                                                    22,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    4,
                                                                    18,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    36,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    32,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    44,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    40,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    36,
                                                                                    48
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    40,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "left_arm_bend",
                                            "parent": "left_arm",
                                            "pivot": [
                                                    5,
                                                    18,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    4,
                                                                    12,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    36,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    32,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    44,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    40,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    36,
                                                                                    48
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    40,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "left_item",
                                            "parent": "left_arm_bend",
                                            "pivot": [
                                                    6,
                                                    12,
                                                    -2
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    6,
                                                                    12.25,
                                                                    -11
                                                            ],
                                                            "size": [
                                                                    0,
                                                                    4,
                                                                    11
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    33,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    33,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    33,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    33,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    33,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    33,
                                                                                    4
                                                                            ],
                                                                            "uv_size": [
                                                                                    0,
                                                                                    0
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "right_leg",
                                            "pivot": [
                                                    -2,
                                                    12,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -4,
                                                                    6,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    4,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    0,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    12,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    8,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    4,
                                                                                    16
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    8,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "right_leg_bend",
                                            "parent": "right_leg",
                                            "pivot": [
                                                    -2,
                                                    6,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    -4,
                                                                    0,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    4,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    0,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    12,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    8,
                                                                                    26
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    4,
                                                                                    16
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    8,
                                                                                    20
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "left_leg",
                                            "pivot": [
                                                    2,
                                                    12,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    0,
                                                                    6,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    20,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    16,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    28,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    24,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    20,
                                                                                    48
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    24,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    },
                                    {
                                            "name": "left_leg_bend",
                                            "parent": "left_leg",
                                            "pivot": [
                                                    2,
                                                    6,
                                                    0
                                            ],
                                            "cubes": [
                                                    {
                                                            "origin": [
                                                                    0,
                                                                    0,
                                                                    -2
                                                            ],
                                                            "size": [
                                                                    4,
                                                                    6,
                                                                    4
                                                            ],
                                                            "uv": {
                                                                    "north": {
                                                                            "uv": [
                                                                                    20,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "east": {
                                                                            "uv": [
                                                                                    16,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "south": {
                                                                            "uv": [
                                                                                    28,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "west": {
                                                                            "uv": [
                                                                                    24,
                                                                                    58
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    6
                                                                            ]
                                                                    },
                                                                    "up": {
                                                                            "uv": [
                                                                                    20,
                                                                                    48
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    4
                                                                            ]
                                                                    },
                                                                    "down": {
                                                                            "uv": [
                                                                                    24,
                                                                                    52
                                                                            ],
                                                                            "uv_size": [
                                                                                    4,
                                                                                    -4
                                                                            ]
                                                                    }
                                                            }
                                                    }
                                            ]
                                    }
                            ]
                    }
            ]
    };
    // Bone names stay in PAL/player_model.geo form; only parent/pivot mirrors the DragonCore-friendly reference rig.
    const DRAGONCORE_COMPATIBLE_BONE_SETUP = {
        body: {parent: null, pivot: [0, 0, 0]},
        torso: {parent: "body", pivot: [0, 12, 0]},
        torso_bend: {parent: "torso", pivot: [0, 18, 0]},
        head: {parent: "torso_bend", pivot: [0, 24, 0]},
        right_arm: {parent: "torso_bend", pivot: [-6, 23, 0]},
        right_arm_bend: {parent: "right_arm", pivot: [-6, 18, 0]},
        right_item: {parent: "right_arm_bend", pivot: [-5.5, 13.25, -1]},
        left_arm: {parent: "torso_bend", pivot: [6, 23, 0]},
        left_arm_bend: {parent: "left_arm", pivot: [6, 18, 0]},
        left_item: {parent: "left_arm_bend", pivot: [5.5, 13.25, -1]},
        right_leg: {parent: "body", pivot: [-2, 12, 0]},
        right_leg_bend: {parent: "right_leg", pivot: [-2, 6, 0]},
        left_leg: {parent: "body", pivot: [2, 12, 0]},
        left_leg_bend: {parent: "left_leg", pivot: [2, 6, 0]}
    };
    const DRAGONCORE_PLAYER_MODEL_GEO = makePlayerModelVariant(PLAYER_MODEL_GEO, DRAGONCORE_COMPATIBLE_BONE_SETUP, PAL_TO_DRAGONCORE_BONES);
    const PLAYER_MODEL_TEXTURE_NAME = "player_model.geo.png";
    const DEBUG_LOG_NAME = "pal_bend_player_tools.debug.log";
    const PLAYER_MODEL_TEXTURE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAI3klEQVR4Aeyaf2ydVRnHn3tvuV1/7RYmmwtLFpIB+4/VVaMlpk6kROMWEslEGusIRHRB/9AmxhCyMAiKAiphpn8pLEGnMULWaCJRTM2YWdamOOJgc4iDyWg3oHf9tXa9fTmfc/u8Pfe9P9576duul/Tmfu/znOd5zrnn+z3nfe9tz41LyOOa5pgHmpNirfq06xPifX9ba0mEDH/Z06ECMMPxCU9STQmpSeSWJxNks5iYnhFwOj3u22xmeb/mMioyV8iTGpvMYPIA6cGz7wo4MzJmbV5RIOAFHoH0kjVDBWD1mc1MZlYyM3giDfUxuyOw2Uj1voYK4JJM1IhcnPbyLoXqpS8SKgDkWH2I4zfWORc+AYOLl+a2hvGr7VmWAJCH+KpkTLgPnBvJ5PBcdUWNbGhuzEFOQYFGLPAoULIkoXg576LEEYL6uloRdgU+2JhqkEIgt9wRX1Mvngs+5zevr/c2rklYJBPZLc8OgIzeCPHBH44NCvjTa8flwOCAPH2k3+I3/f0CGA/wvQEL8AHfIxjjciJvB/BZPzo5aedUl6yV6Ux2u7Piq+tqZOP6lGy4OuXfCKkhdy494cdsZ+eFTxI+ShnbCYv7PcKNL6UfZ2Unp7JvyVbPemKvdRXil7u+Kj333SVPde+Wh7/+FXnkW9+QJ752mzTV1Qk1EKQfQmABYybnGEKeGPcP7HJCfHo6I6l6EYRghWjPZjy/DfnE6kaZHZuQ2fExmR5JWzt7aUoe2vF5u+pKkHsE4wA+MiHsiqOXDx+t9MFebjH8SwDiwOxk6f7cTfL47V+2c4P8Lff/WJ4ZaBFESDan5Nd9N8iOJ5+WZF2j8KB2762ftV+UIA2IA5ckoiASQpNbDvAFYDKQv2p1XC6MT8npt8/L7tatcvrfp+T5794td7WfkH+9+j8ZPHrc+r0mduSV12X3p1plaPg9+f+Fi9LYEC94XXNpQJz3YHdglwviq5I1di7Y399/j/x853ZZ21BrRZicmZVJczGfP5+WQ4dfkfFLGQv81998x/YbnspY8k1mnEdu3SY9d99h47woWcjjc49hdwS/R1B7uRDvunGLfPOTrfLgLe1y9NDLMmRW/qIzm7GpS3LO/IHz8cZaAfU1cbl6VY0kYnGZ8bKFV3ieXMONxDQnRy7Iz3bcLPt2fkl23dgi93xiq+z6dKtAHCFMifA94va5HO2lRPC94g++2B8DXQf+Zm3fzC/kiMGrtT1yPNkjf59psHg+nRCw54Ujse4//9PiJy8ejT3u9GeMO+7bK8Pn35MzZ85KUzxjsd7YH7a1yLv/6Jc16zotet+4QX5rcP21nZ6L4ATz2gcOeNLfn4XxH/tCi/fAZ67z1ObVhwRy7gEhtWWn0+bTohDKHqBU4aZN81nXn49W5C2KABXNoNLiU6dyeiB0qqFR1OYky2gsigBMqBDKmE9lJQExKuucrY5v2fw9D3AdYkfSJ8RFemirnH1zg2BBW8ujXkfbsz5kzx7PR2enJwMD0n3nd2Ttx66STZuvtRafmBw7Jie7NuXigZvl5mkL8l/KEiC/mxMZHZ1vsC21xQQL+W696w8PZ6shpX42kvv6/vvzbXc3zEcr8qwAbO+Sq+wMOTZ5xnypmYc0NYlABFDH5AG+rhY+MYBPLcAHkMYGYUTcf+KQ7B/5j8VjLx2U3v8ekt6B3iyMT0zz1Pq5uZrgkMG2FYAgImCBksQPhUsEMdwOLjHuDeTcGvXTaTK5cPvmZiQzMuJHuMHyxcsPVOhYAYKrz40OFBqLuAu7A4KFa9dmIxBT4tnI/KuSJ6I1kDarTkjoa5xS5FwhTKn/JA78QAnHClAi76eCIvkJbjyQAfh+oohDDbVuWkm7sQI+q0040dyMyYOKRR7kFRQI+AIUJVigU8mQrn6wqBBJxNA6+mkNPtCcsUrOuHlPFSYvUUYgnlo3ICCslhpwXcthceH3UzLc6BRsbUixtf3CgKO1WFJYgG/6lSIXXGWt1e2vlqGKwd8BkAMuOXxioNgAW343Ktf/ZVSs3X9KOp5pnMeTGen46YS0PXo6pzv1gD7Ut/WMCBBDWAvb9p6UDtNf20Gr5HRnqA3WhbV9AcIKy8kXu4y4aUKIMdoOmn9AGsetJQ9UKEShbcr8Z3B1SagI+A3mixc2iLB2vK+vL9bnYN++fTEXbg7fzeG//NoTsZNvPBvDghcOd8YK4fDgD2Jy770xbLF6ctS4/fkfg4vbnvpjbPvDv4phQfdfB2Pkv33wJWs1pzZUgLCCj3o+0kugGsVaEaAaVy3KOa/sgCjVrMaxVnZANa5alHNe2QFRqlmNY63sgGpctSjnvLIDolSzGsf6yO2AShchcgF2frHfc9He3u61OwidIOeBzvm/e/bPbwBC+1dYELkAFb5/fjnnixp1fY1FbJefAC5Bc9TGMbue/WPddBT+8hPAkI6CWLljLFgAflMAyv19gfvbAn5r4P+2gLN/wIEnIvAbAMPCPfvntwCVnv+bIUo+FywAo7vnirTLhf3PL8flCjq6B6qIQczN044QkQjAfNx/c9MuG3qgoh04G+AwhbYrBu1FQGQCRDY3XXUGdH8LQHsRsCQCsDv0MtGjd7Wc6ev5Pmf9UZ//h2m2KAIoOX1zJa/tQpajLT39Ie+e+tBeLCyKANzcgDtpdgFt4i6IuShFHJGopQbgLxSRCKDkPsxklFSwr578urtCa8gBbS/ERiJA2ATKEagQUR23mEiaX4hdsAAcnYOwSVADOHJ3ESReamWp1a2vNux9w/ILFkDfAHLAJYdPDGhdIasrrDYqcoXeKxiLTIDgwJW0WVmtd8mr7+a1Tu1C7QcAAAD//3n4vU4AAAAGSURBVAMAplm8EgbGqHQAAAAASUVORK5CYII=";

    let actions = [];
    let palFormat = null;
    let dragoncoreFormat = null;
    let nativeAnimationCodec = null;
    let nativeAnimationCodecLoad = null;

    function textKey(key) {
        return `${PLUGIN_ID}.${key}`;
    }

    function registerTranslations() {
        const languageObject = globalThis.Language;
        if (!languageObject || typeof languageObject.addTranslations !== "function") return;
        addTranslationSet("en", TEXT.en);
        addTranslationSet("zh", TEXT.zh);
        addTranslationSet("zh_tw", TEXT.zh);
    }

    function addTranslationSet(language, table) {
        const strings = {};
        Object.keys(table || {}).forEach(key => {
            strings[textKey(key)] = table[key];
        });
        globalThis.Language.addTranslations(language, strings);
    }

    function t(key, params = {}) {
        const fallback = fallbackText(key);
        const template = typeof globalThis.tl === "function"
            ? globalThis.tl(textKey(key), undefined, fallback)
            : fallback;
        return interpolateText(template, params);
    }

    function fallbackText(key) {
        const locale = getBlockbenchLanguageCode().startsWith("zh") ? "zh" : "en";
        return (TEXT[locale] && TEXT[locale][key]) || TEXT.en[key] || key;
    }

    function getBlockbenchLanguageCode() {
        const languageObject = globalThis.Language;
        if (languageObject && languageObject.code) return String(languageObject.code).toLowerCase();
        const navigatorObject = globalThis.navigator;
        if (navigatorObject) {
            const language = (navigatorObject.languages && navigatorObject.languages[0]) || navigatorObject.language;
            if (language) return String(language).toLowerCase().replace(/-\w+$/, "");
        }
        return "en";
    }

    function interpolateText(template, params) {
        return String(template).replace(/\{(\w+)\}/g, (_match, name) => {
            return params[name] === undefined ? "" : String(params[name]);
        });
    }

    Plugin.register(PLUGIN_ID, {
        title: "PAL Bend Player Tools",
        author: "kltyton",
        icon: "icon.png",
        description: "Create, import, and export PAL, Emotecraft, DragonCore player-model, and PlayerAnimationLibraryMoreRotation animations.",
        tags: ["Minecraft: Java Edition", "Animation", "Tools"],
        version: "0.4.0",
        variant: "both",
        min_version: "4.8.0",
        repository: "https://github.com/kltyton/Pal-bend-player-tools",
        bug_tracker: "https://github.com/kltyton/Pal-bend-player-tools/issues",
        onload() {
            registerTranslations();
            registerPalFormat();
            actions = [
                new Action("pal_bend_create_player_project", {
                    name: t("actionCreateName"),
                    description: t("actionCreateDescription"),
                    icon: "accessibility_new",
                    click: () => createPlayerProject()
                }),
                new Action("pal_bend_create_dragoncore_project", {
                    name: t("actionCreateDragoncoreName"),
                    description: t("actionCreateDragoncoreDescription"),
                    icon: "accessibility_new",
                    click: createDragoncorePlayerProject
                }),
                new Action("pal_bend_import_animation", {
                    name: t("actionImportName"),
                    description: t("actionImportDescription"),
                    icon: "file_upload",
                    click: importAnimationFile
                }),
                new Action("pal_bend_export_animation", {
                    name: t("actionExportName"),
                    description: t("actionExportDescription"),
                    icon: "file_download",
                    condition: () => typeof Animation !== "undefined" && Animation.all && Animation.all.length > 0,
                    click: showExportDialog
                }),
                new Action("pal_bend_export_geo", {
                    name: t("actionExportGeoName"),
                    description: t("actionExportGeoDescription"),
                    icon: "archive",
                    click: exportBuiltInGeo
                })
            ];
            MenuBar.addAction(getAction("pal_bend_create_player_project"), "file.new");
            MenuBar.addAction(getAction("pal_bend_create_dragoncore_project"), "file.new");
            MenuBar.addAction(getAction("pal_bend_create_player_project"), "tools");
            MenuBar.addAction(getAction("pal_bend_create_dragoncore_project"), "tools");
            MenuBar.addAction(getAction("pal_bend_import_animation"), "file.import");
            MenuBar.addAction(getAction("pal_bend_export_animation"), "file.export");
            MenuBar.addAction(getAction("pal_bend_export_geo"), "file.export");
            attachAnimationPanelImportAction();
            setTimeout(attachAnimationPanelImportAction, 250);
            hookNativeAnimationImport();
            setTimeout(hookNativeAnimationImport, 250);
        },
        onunload() {
            unhookNativeAnimationImport();
            actions.forEach(action => action.delete());
            actions = [];
            if (palFormat && typeof palFormat.delete === "function") palFormat.delete();
            palFormat = null;
            if (dragoncoreFormat && typeof dragoncoreFormat.delete === "function") dragoncoreFormat.delete();
            dragoncoreFormat = null;
        }
    });

    function registerPalFormat() {
        if (typeof ModelFormat !== "function") return;
        if (globalThis.Formats && Formats.pal_bend_player_dragoncore_compatible && typeof Formats.pal_bend_player_dragoncore_compatible.delete === "function") {
            Formats.pal_bend_player_dragoncore_compatible.delete();
        }
        if (globalThis.Formats && Formats.pal_bend_player) {
            palFormat = Formats.pal_bend_player;
        } else {
            palFormat = createPalModelFormat("pal_bend_player", {
                icon: "accessibility_new",
                name: t("actionCreateName"),
                description: t("actionCreateDescription"),
                create: createPlayerProject
            });
        }

        if (globalThis.Formats && Formats.pal_bend_player_dragoncore) {
            dragoncoreFormat = Formats.pal_bend_player_dragoncore;
        } else {
            dragoncoreFormat = createPalModelFormat("pal_bend_player_dragoncore", {
                icon: "accessibility_new",
                name: t("actionCreateDragoncoreName"),
                description: t("actionCreateDragoncoreDescription"),
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
        const existingBones = new Set(bones.map(bone => bone && bone.name).filter(Boolean));
        Object.keys(boneSetup).slice().reverse().forEach(boneName => {
            if (existingBones.has(boneName)) return;
            bones.unshift({name: boneName});
            existingBones.add(boneName);
        });
        const setupOrder = Object.keys(boneSetup);
        const setupOrderIndex = new Map(setupOrder.map((boneName, index) => [boneName, index]));
        const originalOrderIndex = new Map(bones.map((bone, index) => [bone && bone.name, index]));
        bones.sort((a, b) => {
            const aIndex = setupOrderIndex.has(a.name) ? setupOrderIndex.get(a.name) : setupOrder.length + originalOrderIndex.get(a.name);
            const bIndex = setupOrderIndex.has(b.name) ? setupOrderIndex.get(b.name) : setupOrder.length + originalOrderIndex.get(b.name);
            return aIndex - bIndex;
        });
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
        bones.forEach((bone, index) => {
            bones[index] = orderModelBoneKeys(bone);
        });
        return out;
    }

    function orderModelBoneKeys(bone) {
        const out = {};
        ["name", "parent", "pivot", "cubes"].forEach(key => {
            if (bone[key] !== undefined) out[key] = bone[key];
        });
        Object.keys(bone).forEach(key => {
            if (out[key] === undefined) out[key] = bone[key];
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

    function hookNativeAnimationImport() {
        const codec = getNativeAnimationCodec();
        if (!codec || typeof codec.load !== "function" || codec.pal_bend_player_tools_load) return false;
        nativeAnimationCodec = codec;
        nativeAnimationCodecLoad = codec.load;
        codec.pal_bend_player_tools_load = function(...args) {
            const handled = tryHandleNativeAnimationImport(args);
            if (handled) return handled;
            return nativeAnimationCodecLoad.apply(this, args);
        };
        codec.load = codec.pal_bend_player_tools_load;
        return true;
    }

    function unhookNativeAnimationImport() {
        if (nativeAnimationCodec && nativeAnimationCodecLoad && nativeAnimationCodec.load === nativeAnimationCodec.pal_bend_player_tools_load) {
            nativeAnimationCodec.load = nativeAnimationCodecLoad;
        }
        if (nativeAnimationCodec) delete nativeAnimationCodec.pal_bend_player_tools_load;
        nativeAnimationCodec = null;
        nativeAnimationCodecLoad = null;
    }

    function getNativeAnimationCodec() {
        if (globalThis.Format && Format.animation_codec && typeof Format.animation_codec.load === "function") return Format.animation_codec;
        if (globalThis.Codecs && Codecs.bedrock && Codecs.bedrock.format && Codecs.bedrock.format.animation_codec) return Codecs.bedrock.format.animation_codec;
        if (globalThis.Formats && Formats.bedrock && Formats.bedrock.animation_codec) return Formats.bedrock.animation_codec;
        return null;
    }

    function tryHandleNativeAnimationImport(args) {
        const files = normalizeNativeAnimationImportFiles(args);
        if (!files.length || !isCurrentProjectPlayerBendRig()) return false;
        const parsed = [];
        for (const file of files) {
            const data = parseNativeImportFileContent(file);
            if (!shouldImportWithPalBendPipeline(data)) return false;
            parsed.push({file, data});
        }
        try {
            parsed.forEach(entry => {
                importAnimationData(entry.data, entry.file && (entry.file.name || entry.file.path) || "animation", {
                    fromNativeCodec: true
                });
            });
        } catch (error) {
            console.error(error);
            showError(t("importFailed", {message: error.message}));
        }
        return true;
    }

    function normalizeNativeAnimationImportFiles(args) {
        const first = args && args[0];
        if (Array.isArray(first)) return first;
        if (first && typeof first === "object" && (first.content !== undefined || first.name || first.path)) return [first];
        if (first && typeof first === "object" && first.animations) {
            return [{name: "animation.json", content: first}];
        }
        if (typeof first === "string") {
            return [{name: args && args[1] || "animation.json", content: first}];
        }
        return [];
    }

    function parseNativeImportFileContent(file) {
        if (!file) return null;
        const content = file.content !== undefined ? file.content : file;
        if (content && typeof content === "object") return clone(content);
        if (typeof content !== "string") return null;
        try {
            return parseJson(content);
        } catch (_error) {
            return null;
        }
    }

    function isCurrentProjectPlayerBendRig() {
        if (!isProjectObject()) return false;
        const marker = Project.pal_bend_player_tools_rig;
        if (marker === "player" || marker === "dragoncore" || marker === "dragoncore_compatible") return true;
        return hasPlayerHelperBones()
            || currentProjectMatchesBoneSetup(DRAGONCORE_COMPATIBLE_BONE_SETUP)
            || currentProjectMatchesParentMap(getDefaultPlayerModelPalRig().parents);
    }

    function shouldImportWithPalBendPipeline(data) {
        if (data && data.emote) return true;
        if (!data || !data.animations) return false;
        const profile = getImportProfile(data, false);
        if (profile.sourceRig || profile.unbakeFlatToCurrent) return true;
        return animationUsesKnownPlayerBones(data);
    }

    function animationUsesKnownPlayerBones(data) {
        let known = 0;
        Object.values((data && data.animations) || {}).forEach(animObj => {
            Object.keys((animObj && animObj.bones) || {}).forEach(rawName => {
                const normalized = getCorrectPlayerBoneName(rawName);
                if (PAL_DEFAULT_PIVOTS[normalized] || BEND_HELPER_BONES[normalized] || normalized.endsWith(HELPER_SUFFIX)) known += 1;
            });
        });
        return known >= 2;
    }

    function createDragoncorePlayerProject() {
        createPlayerProject({
            geometry: DRAGONCORE_PLAYER_MODEL_GEO,
            rigPreset: "dragoncore",
            projectName: t("projectDragoncoreName"),
            fileName: "player_model.dragoncore.geo.json",
            message: t("projectDragoncoreCreated")
        });
    }

    function createPlayerProject(options = {}) {
        const geometry = options.geometry || PLAYER_MODEL_GEO;
        const rigPreset = options.rigPreset || "player";
        const projectName = options.projectName || "player_model.geo";
        const fileName = options.fileName || "player_model.geo.json";
        const message = options.message || t("projectCreated");
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
            setProjectRigPreset(rigPreset);
            queuePlayerTextureLoad();
            Blockbench.showQuickMessage(message, 1800);
        } catch (error) {
            console.error(error);
            Blockbench.showMessageBox({
                title: "PAL Bend Player Tools",
                message: t("projectCreateFailed", {message: error.message})
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

    function setProjectRigPreset(rigPreset) {
        if (!isProjectObject()) return;
        Project.pal_bend_player_tools_rig = rigPreset;
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
                showError(t("jsonParseFailed", {message: error.message}));
                return;
            }
            try {
                importAnimationData(data, files[0].name || files[0].path || "animation");
            } catch (error) {
                console.error(error);
                showError(t("importFailed", {message: error.message}));
            }
        });
    }

    function importAnimationData(data, fileName, options = {}) {
        const fileBase = baseName(fileName || "animation").replace(/\.[^.]+$/, "");
        let animationsJson;
        if (data && data.emote) {
            const ir = parseEmoteToIR(data, fileBase);
            animationsJson = irToAnimationsJson(ir, safeAnimationName(data.name || fileBase || "animation"));
        } else if (data && data.animations) {
            animationsJson = clone(data);
        } else {
            showError(t("unsupportedFile"));
            return {created: 0, missing: 0, missingBones: []};
        }
        const importProfile = getImportProfile(animationsJson, !!(data && data.emote));
        const currentRig = getCurrentProjectPalRig();
        debugLog("import:start", {
            file: fileName || fileBase,
            fromNativeCodec: !!options.fromNativeCodec,
            rawBones: summarizeAnimationBones(animationsJson),
            importProfile: {
                hasSourceRig: !!importProfile.sourceRig,
                unbakeFlatToCurrent: !!importProfile.unbakeFlatToCurrent,
                runtimeLocalItems: !!importProfile.runtimeLocalItems,
                runtimeLocalSource: !!importProfile.runtimeLocalSource,
                sourceFormat: importProfile.sourceFormat,
                sourceCoordinate: importProfile.sourceCoordinate,
                skipRuntimeRootParents: importProfile.skipRuntimeRootParents,
                sourceRig: importProfile.sourceRig ? summarizeRigForLog(importProfile.sourceRig) : null
            },
            currentRig: summarizeRigForLog(currentRig)
        });
        animationsJson = normalizeAnimationBoneNames(animationsJson);
        let modelAnimations = convertToBendableModelFormat(animationsJson, {
            keepPalBend: false,
            helperSign: 1
        });
        const sourceMatchesCurrentRig = importProfile.sourceRig && rigsAreEquivalent(importProfile.sourceRig, currentRig);
        modelAnimations = importProfile.sourceRig && importProfile.sourceCoordinate === "bedrock"
            ? bedrockJsonToBlockbenchAnimationData(modelAnimations)
            : mirrorFacingForBlockbench(modelAnimations);
        if (importProfile.sourceRig && !sourceMatchesCurrentRig) {
            modelAnimations = retargetAnimationHierarchy(modelAnimations, importProfile.sourceRig, currentRig);
        } else if (!importProfile.sourceRig && importProfile.unbakeFlatToCurrent) {
            const defaultRig = getDefaultPlayerModelPalRig();
            modelAnimations = unbakeFlatAnimationHierarchyForEdit(modelAnimations, defaultRig, getCanonicalFlatPalRig(), {
                preserveRuntimeLocalItems: !!importProfile.runtimeLocalItems,
                skipRootParents: importProfile.skipRuntimeRootParents
            });
            if (!rigsAreEquivalent(currentRig, defaultRig)) {
                modelAnimations = retargetAnimationHierarchy(modelAnimations, defaultRig, currentRig);
            }
        }
        let virtualRootTracks = null;
        if (shouldBakeVirtualRootForStandardProject(modelAnimations, currentRig)) {
            const virtualRootResult = bakeVirtualRootForStandardProject(modelAnimations);
            modelAnimations = virtualRootResult.data;
            virtualRootTracks = virtualRootResult.virtualRootTracks;
            debugLog("import:baked_virtual_root_for_standard_project", {
                animations: Object.keys(virtualRootTracks || {})
            });
        } else if (shouldStripFlatRuntimeCompensationPositions(importProfile, currentRig)) {
            modelAnimations = stripFlatRuntimeCompensationPositions(modelAnimations);
            debugLog("import:stripped_flat_runtime_compensation_positions", {
                bones: FLAT_RUNTIME_COMPENSATION_POSITION_BONES
            });
        }
        debugLog("import:converted", {
            sourceMatchesCurrentRig: !!sourceMatchesCurrentRig,
            modelBones: summarizeAnimationBones(modelAnimations)
        });
        const result = loadAnimationsIntoProject(modelAnimations, {
            sourceMatchesCurrentRig,
            runtimeLocalSourceRig: importProfile.runtimeLocalSource ? importProfile.sourceRig : null,
            virtualRootTracks
        });
        const missingText = result.missing
            ? t("importMissing", {count: result.missing, bones: result.missingBones.join(", ")})
            : "";
        Blockbench.showQuickMessage(t("importSummary", {
            created: result.created,
            profile: formatImportProfileLabel(importProfile),
            missing: missingText
        }), 4200);
        return result;
    }

    function formatImportProfileLabel(profile) {
        const labels = {
            pal_original: t("profilePalOriginal"),
            pal_emote: t("profilePalEmote"),
            dragoncore_player: t("profileDragoncore"),
            more_rotation: t("profileMoreRotation"),
            pal_tools_runtime_local: t("profileRuntimeLocal"),
            pal_hierarchy: t("profileHierarchy"),
            helper_project: t("profileHelperProject")
        };
        return labels[profile && profile.sourceFormat] || t("profileAuto");
    }

    function shouldStripFlatRuntimeCompensationPositions(profile, currentRig) {
        if (!profile || profile.sourceRig || !profile.unbakeFlatToCurrent) return false;
        if (!["pal_original", "pal_emote", "more_rotation"].includes(profile.sourceFormat)) return false;
        return rigsAreEquivalent(currentRig, getDragoncoreCompatiblePalRig());
    }

    function stripFlatRuntimeCompensationPositions(data) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            FLAT_RUNTIME_COMPENSATION_POSITION_BONES.forEach(boneName => {
                const bone = bones[boneName];
                if (!bone || typeof bone !== "object") return;
                delete bone.position;
                if (!Object.keys(bone).length) delete bones[boneName];
            });
        });
        return out;
    }

    function shouldBakeVirtualRootForStandardProject(data, currentRig) {
        if (!rigsAreEquivalent(currentRig, getDefaultPlayerModelPalRig())) return false;
        return animationHasVirtualRootTrack(data);
    }

    function animationHasVirtualRootTrack(data) {
        return Object.values((data && data.animations) || {}).some(animObj => {
            const body = animObj && animObj.bones && animObj.bones.body;
            return boneHasTransformTracks(body);
        });
    }

    function bakeVirtualRootForStandardProject(data) {
        const virtualRootTracks = collectVirtualRootTracks(data);
        if (!Object.keys(virtualRootTracks).length) {
            return {data, virtualRootTracks: null};
        }
        const out = bakeAnimationHierarchyToFlat(data, getStandardProjectVirtualRootRig(), getDefaultPlayerModelPalRig(), {
            preserveRuntimeLocalItems: true,
            includeOwnBendHelperParent: true
        });
        Object.values(out.animations || {}).forEach(animObj => {
            if (animObj && animObj.bones) delete animObj.bones.body;
        });
        return {data: out, virtualRootTracks};
    }

    function collectVirtualRootTracks(data) {
        const tracks = {};
        Object.keys((data && data.animations) || {}).forEach(animName => {
            const body = data.animations[animName] && data.animations[animName].bones && data.animations[animName].bones.body;
            if (boneHasTransformTracks(body)) tracks[animName] = clone(body);
        });
        return tracks;
    }

    function showExportDialog() {
        const selectedName = Animation.selected ? Animation.selected.name : "";
        const dialog = new Dialog({
            id: "pal_bend_export_dialog",
            title: t("exportDialogTitle"),
            form: {
                format: {
                    label: t("exportFormatLabel"),
                    type: "select",
                    default: "animations",
                    options: {
                        animations: t("exportFormatAnimations"),
                        emote: t("exportFormatEmote")
                    }
                },
                scope: {
                    label: t("exportScopeLabel"),
                    type: "select",
                    default: selectedName ? "selected" : "all",
                    options: {
                        selected: t("exportScopeSelected"),
                        all: t("exportScopeAll")
                    }
                },
                emote_name: {
                    label: t("emoteNameLabel"),
                    type: "text",
                    value: selectedName || "animation"
                },
                author: {
                    label: t("authorLabel"),
                    type: "text",
                    value: ""
                },
                description: {
                    label: t("descriptionLabel"),
                    type: "text",
                    value: ""
                }
            },
            onConfirm(form) {
                try {
                    exportAnimations(form);
                } catch (error) {
                    console.error(error);
                    showError(t("exportFailed", {message: error.message}));
                }
            }
        });
        dialog.show();
    }

    function exportAnimations(form) {
        const animations = collectAnimations(form.scope);
        if (!animations.length) {
            showError(t("noAnimationsToExport"));
            return;
        }
        if (form.format === "emote" && animations.length !== 1) {
            showError(t("emoteSingleOnly"));
            return;
        }

        const modelAnimations = compileModelAnimationsForPalExport(animations);
        const hasRuntimeHierarchy = !!(modelAnimations.parents && modelAnimations.model);
        const exportFormat = classifyPalRuntimeExport(modelAnimations);
        const needsMoreRotationBend = exportFormat === "more_rotation";
        debugLog("export:classified", {
            scope: form.scope,
            requestedFormat: form.format,
            exportFormat,
            hasRuntimeHierarchy
        });
        if (form.format === "emote" && needsMoreRotationBend) {
            showError(t("emoteCannotExpressMoreRotation"));
            return;
        }
        const palBendAnimations = cleanPalRuntimeExport(modelAnimationsToPalBend(modelAnimations, {
            helperSign: 1,
            keepHelpers: false,
            keepHelperRotations: false,
            stripHelperPositionScale: true,
            compoundBend: form.format === "animations" && needsMoreRotationBend
        }));

        if (form.format === "animations") {
            Blockbench.export({
                type: needsMoreRotationBend ? "PlayerAnimationLibraryMoreRotation Animations" : "PAL Original Animations",
                extensions: ["json"],
                name: needsMoreRotationBend ? "pal_morerotation.animation.json" : "pal.animation.json",
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

    function classifyPalRuntimeExport(data) {
        return animationNeedsMoreRotationBend(data) ? "more_rotation" : "pal_original";
    }

    function loadAnimationsIntoProject(data, options = {}) {
        if (!hasPlayerHelperBones()) {
            Blockbench.showMessageBox({
                title: "PAL Bend Player Tools",
                message: t("helperBonesMissing")
            });
        }
        const animations = data.animations || {};
        let created = 0;
        let missing = 0;
        const missingBones = [];
        Object.keys(animations).forEach(name => {
            const animObj = animations[name] || {};
            const animationName = uniqueAnimationName(name);
            const bbAnimation = new Animation({
                name: animationName,
                length: numberOr(animObj.animation_length, 0),
                snapping: 20,
                loop: blockbenchLoopForAnimation(animObj.loop)
            }).add();
            if (options.sourceMatchesCurrentRig) bbAnimation.pal_bend_same_rig_import = true;
            if (options.runtimeLocalSourceRig) {
                bbAnimation.pal_bend_runtime_local_source_rig = clone(options.runtimeLocalSourceRig);
            }
            if (options.virtualRootTracks && options.virtualRootTracks[name]) {
                bbAnimation.pal_bend_virtual_root = clone(options.virtualRootTracks[name]);
            }
            if (typeof bbAnimation.init === "function") bbAnimation.init();
            const bones = animObj.bones || {};
            Object.keys(bones).forEach(boneName => {
                const group = findGroupByName(boneName);
                const animator = group
                    ? getAnimatorForGroup(group, bbAnimation, boneName)
                    : getDetachedAnimatorForBone(boneName, bbAnimation);
                if (!group) {
                    missing += 1;
                    missingBones.safePush ? missingBones.safePush(boneName) : (missingBones.includes(boneName) || missingBones.push(boneName));
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
        if (missingBones.length) {
            debugLog("import:missing_bones", {
                missingBones,
                availableGroups: globalThis.Group && Array.isArray(Group.all)
                    ? Group.all.map(group => group && group.name).filter(Boolean).sort()
                    : []
            });
        }
        if (globalThis.Modes && Modes.animate && typeof Modes.animate.select === "function") {
            Modes.animate.select();
        }
        if (globalThis.Animator && typeof Animator.preview === "function") {
            Animator.preview();
        }
        return {created, missing, missingBones};
    }

    function compileModelAnimationsForPalExport(animations) {
        const out = {
            format_version: "1.8.0",
            animations: {}
        };
        const exportRig = getCurrentProjectPalRig();
        const exportWithRuntimeHierarchy = shouldExportPalRuntimeHierarchy(exportRig);
        const runtimeExportRig = exportWithRuntimeHierarchy ? exportRig : getDefaultPlayerModelPalRig();
        const exportIsDragoncoreRig = isDragoncoreProjectRig(exportRig);
        const exportRequiresBodylessPositionSync = !rigsAreEquivalent(exportRig, runtimeExportRig);
        animations.forEach(animation => {
            let modelAnimations = normalizeAnimationBoneNames(compileAnimationsFromProject([animation]));
            if (animation && animation.pal_bend_virtual_root) {
                modelAnimations = restoreVirtualRootForStandardProjectExport(modelAnimations, animation.pal_bend_virtual_root);
            }
            if (animation && animation.pal_bend_same_rig_import) {
                modelAnimations = normalizeAnimationTimeKeys(modelAnimations);
            }
            if (exportIsDragoncoreRig && !exportWithRuntimeHierarchy) {
                modelAnimations = bakeDragoncoreHierarchyToBodylessFlatPal(modelAnimations, exportRig);
                modelAnimations = mirrorFacingForPal(modelAnimations);
                modelAnimations = stripBodyBones(modelAnimations);
            } else {
                if (!rigsAreEquivalent(exportRig, runtimeExportRig)) {
                    modelAnimations = retargetAnimationHierarchy(modelAnimations, exportRig, runtimeExportRig);
                }
                if (!exportWithRuntimeHierarchy) {
                    modelAnimations = bakeAnimationHierarchyToFlat(modelAnimations, runtimeExportRig, getCanonicalFlatPalRig(), {
                        preserveRuntimeLocalItems: true,
                        skipRootParents: ["body"],
                        includeOwnBendHelperParent: true
                    });
                }
                modelAnimations = mirrorFacingForPal(modelAnimations);
                if (exportRequiresBodylessPositionSync) {
                    modelAnimations = stripFlatRuntimeCompensationPositions(modelAnimations);
                }
                modelAnimations = bakeBodyToBodylessPalExport(modelAnimations);
            }
            Object.keys(modelAnimations.animations || {}).forEach(name => {
                out.animations[uniqueAnimationKey(out.animations, name)] = modelAnimations.animations[name];
            });
        });
        if (exportWithRuntimeHierarchy) attachPalRuntimeHierarchyMetadata(out, exportRig);
        return stabilizePalExportNumbers(out);
    }

    function bakeDragoncoreHierarchyToBodylessFlatPal(data, dragoncoreRig) {
        const helperRotations = getRetargetedBendHelperRotations(data, dragoncoreRig, getDefaultPlayerModelPalRig(), {
            skipRootParents: [],
            includeOwnBendHelperParent: true,
            includePivotRetarget: true,
            includeAllAnimationTimes: true
        });
        const out = bakeAnimationHierarchyToFlat(data, dragoncoreRig, getCanonicalFlatPalRig(), {
            preserveRuntimeLocalItems: true,
            includeOwnBendHelperParent: true,
            includePivotRetarget: true,
            includeAllAnimationTimes: true
        });
        return applyBendHelperRotations(out, helperRotations);
    }

    function bakeBodyToBodylessPalExport(data) {
        const source = clone(data);
        Object.values(source.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            const body = bones.body;
            if (!body || typeof body !== "object") return;
            if (body.bend !== undefined) {
                bones.torso = mergeBoneAnimation(bones.torso, {bend: body.bend});
                delete body.bend;
            }
            if (boneHasTransformTracks(body)) {
                syncBodyTransformToBodylessBones(bones, body);
            } else {
                delete bones.body;
                removeEmptyBones(bones);
            }
        });
        stripBodyBones(source);
        return source;
    }

    function syncBodyTransformToBodylessBones(bones, body) {
        const sourceBones = clone(bones);
        PAL_BODY_EXPORT_CHILD_BONES.forEach(boneName => {
            const bone = bones[boneName] = bones[boneName] && typeof bones[boneName] === "object" ? bones[boneName] : {};
            const sourceBone = sourceBones[boneName] && typeof sourceBones[boneName] === "object" ? sourceBones[boneName] : {};
            bone.position = mergeBodyChannelIntoBone(body, sourceBone, "position", (bodyVector, boneVector) => {
                return cleanNumber(boneVector.map((value, index) => numberOr(value, 0) + numberOr(bodyVector[index], 0)));
            });
            bone.rotation = mergeBodyChannelIntoBone(body, sourceBone, "rotation", (bodyVector, boneVector) => {
                return cleanNumber(boneVector.map((value, index) => numberOr(value, 0) + numberOr(bodyVector[index], 0)));
            });
            bone.scale = mergeBodyChannelIntoBone(body, sourceBone, "scale", (bodyVector, boneVector) => {
                return cleanNumber(boneVector.map((value, index) => numberOr(value, 1) * numberOr(bodyVector[index], 1)));
            });
            if (sourceBone.bend !== undefined) bone.bend = clone(sourceBone.bend);
            ["position", "rotation", "scale"].forEach(channel => {
                if (bone[channel] === undefined) delete bone[channel];
            });
        });
    }

    function mergeBodyChannelIntoBone(body, bone, channel, combiner) {
        const hasBodyChannel = body && body[channel] !== undefined;
        const hasBoneChannel = bone && bone[channel] !== undefined;
        if (!hasBodyChannel && !hasBoneChannel) return undefined;
        const times = new Set([0]);
        collectTrackTimes(body && body[channel], times);
        collectTrackTimes(bone && bone[channel], times);
        const track = {};
        Array.from(times).sort((a, b) => a - b).forEach(time => {
            const bodyVector = sampleTrackVector(body && body[channel], channel, time, channel === "scale" ? [1, 1, 1] : [0, 0, 0]);
            const boneVector = sampleTrackVector(bone && bone[channel], channel, time, channel === "scale" ? [1, 1, 1] : [0, 0, 0]);
            const easing = findChannelEasing(bone && bone[channel], time) || findChannelEasing(body && body[channel], time) || {};
            track[formatSeconds(time)] = makeBakedTrackKey(combiner(bodyVector, boneVector), easing);
        });
        return track;
    }

    function findChannelEasing(track, time) {
        const key = findExactTrackKey(track, time);
        if (!key || typeof key !== "object" || Array.isArray(key)) return null;
        const out = {};
        ["lerp_mode", "easing", "easingArgs"].forEach(prop => {
            if (key[prop] !== undefined) out[prop] = clone(key[prop]);
        });
        return Object.keys(out).length ? out : null;
    }

    function stripBodyBones(data) {
        Object.values((data && data.animations) || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            delete bones.body;
            removeEmptyBones(bones);
        });
        return data;
    }

    function restoreVirtualRootForStandardProjectExport(data, virtualRoot) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            if (!animObj || !animObj.bones) return;
            animObj.bones.body = mergeBoneAnimation(animObj.bones.body, virtualRoot);
        });
        return unbakeFlatAnimationHierarchyForEdit(out, getStandardProjectVirtualRootRig(), getDefaultPlayerModelPalRig(), {
            preserveRuntimeLocalItems: true,
            includeOwnBendHelperParent: true
        });
    }

    function normalizeAnimationTimeKeys(data) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            if (!animObj || typeof animObj !== "object") return;
            Object.values(animObj.bones || {}).forEach(bone => {
                if (!bone || typeof bone !== "object") return;
                ["position", "rotation", "scale", "bend"].forEach(channel => {
                    if (bone[channel] !== undefined) bone[channel] = normalizeTrackTimeKeys(bone[channel]);
                });
            });
        });
        return out;
    }

    function normalizeTrackTimeKeys(track) {
        if (!track || typeof track !== "object" || Array.isArray(track) || looksLikeSingleKeyframe(track)) return track;
        const out = {};
        Object.keys(track).forEach(key => {
            const numeric = Number(key);
            const timeKey = Number.isFinite(numeric) ? formatSeconds(numeric) : key;
            out[timeKey] = track[key];
        });
        return out;
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

    function bedrockJsonToBlockbenchAnimationData(data) {
        return mirrorFacingForBlockbench(data);
    }

    function mirrorPositionXForPal(data) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            if (!animObj || typeof animObj !== "object") return;
            Object.values(animObj.bones || {}).forEach(bone => {
                if (!bone || typeof bone !== "object" || bone.position === undefined) return;
                bone.position = mirrorPositionXTrack(bone.position);
            });
        });
        return out;
    }

    function mirrorPositionXTrack(track) {
        if (track === undefined || track === null) return track;
        if (Array.isArray(track) || isNum(track) || typeof track === "string" || looksLikeSingleKeyframe(track)) {
            return mirrorPositionXPayload(track);
        }
        if (typeof track === "object") {
            const out = {};
            Object.keys(track).forEach(time => {
                out[time] = mirrorPositionXPayload(track[time]);
            });
            return out;
        }
        return track;
    }

    function mirrorPositionXPayload(payload) {
        if (Array.isArray(payload)) {
            const out = payload.slice();
            out[0] = invertAnimationValue(out[0]);
            return cleanNumber(out);
        }
        if (isNum(payload) || typeof payload === "string") return invertAnimationValue(payload);
        if (!payload || typeof payload !== "object") return payload;
        const out = clone(payload);
        if (out.value !== undefined) out.value = invertAnimationValue(out.value);
        if (out.vector !== undefined) out.vector = mirrorPositionXPayload(valueToVector(out.vector, "position"));
        if (out.pre !== undefined) out.pre = mirrorPositionXPayload(out.pre);
        if (out.post !== undefined) out.post = mirrorPositionXPayload(out.post);
        return out;
    }

    function mirrorNorthSouthAnimationData(data) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            if (!animObj || typeof animObj !== "object") return;
            Object.values(animObj.bones || {}).forEach(bone => {
                if (!bone || typeof bone !== "object") return;
                if (bone.position !== undefined) bone.position = mirrorTrackPayload(bone.position, "position");
                if (bone.rotation !== undefined) bone.rotation = mirrorTrackPayload(bone.rotation, "rotation");
                if (bone.bend !== undefined) bone.bend = mirrorBendPayload(bone.bend);
            });
        });
        return out;
    }

    function mirrorBendPayload(bend) {
        if (!isCompoundBendPayload(bend)) return mirrorTrackPayload(bend, "bend");
        const out = clone(bend);
        if (out.rotation !== undefined) out.rotation = mirrorTrackPayload(out.rotation, "bend");
        if (out.position !== undefined) out.position = mirrorTrackPayload(out.position, "position");
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
            out[1] = invertAnimationValue(out[1]);
        } else if (channel === "position") {
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
        if (isCompoundBendPayload(base) || isCompoundBendPayload(incoming)) {
            return mergeCompoundBendTrackPayload(base, incoming);
        }
        if (!base || typeof base !== "object" || Array.isArray(base) || looksLikeSingleKeyframe(base)) {
            return clone(incoming);
        }
        if (!incoming || typeof incoming !== "object" || Array.isArray(incoming) || looksLikeSingleKeyframe(incoming)) {
            return clone(incoming);
        }
        return Object.assign({}, clone(base), clone(incoming));
    }

    function mergeCompoundBendTrackPayload(base, incoming) {
        const out = compoundBendTrackPayloadFrom(base);
        if (incoming === undefined) return compactCompoundBendTrackPayload(out);
        if (isCompoundBendPayload(incoming)) {
            ["rotation", "position", "scale"].forEach(channel => {
                if (incoming[channel] !== undefined) out[channel] = mergeTrackPayload(out[channel], incoming[channel]);
            });
        } else {
            out.rotation = mergeTrackPayload(out.rotation, incoming);
        }
        return compactCompoundBendTrackPayload(out);
    }

    function compoundBendTrackPayloadFrom(value) {
        if (isCompoundBendPayload(value)) return clone(value);
        const out = {};
        if (value !== undefined) out.rotation = clone(value);
        return out;
    }

    function compactCompoundBendTrackPayload(value) {
        const out = {};
        ["rotation", "position", "scale"].forEach(channel => {
            if (hasTrackPayload(value[channel])) out[channel] = clone(value[channel]);
        });
        return out;
    }

    function hasTrackPayload(track) {
        if (track === undefined || track === null) return false;
        if (!track || typeof track !== "object" || Array.isArray(track)) return true;
        return looksLikeSingleKeyframe(track) || Object.keys(track).length > 0;
    }

    function getImportProfile(data, isEmote) {
        const profile = {
            sourceRig: null,
            unbakeFlatToCurrent: false,
            runtimeLocalItems: false,
            runtimeLocalSource: false,
            sourceCoordinate: "pal",
            skipRuntimeRootParents: [],
            sourceFormat: "unknown"
        };
        if (isEmote) {
            profile.unbakeFlatToCurrent = true;
            profile.runtimeLocalItems = true;
            profile.sourceFormat = "pal_emote";
            return profile;
        }
        if (!data || !data.animations) return profile;
        const runtimeLocalRig = getPalToolsRuntimeLocalMetadataRig(data);
        if (runtimeLocalRig) {
            profile.sourceRig = runtimeLocalRig;
            profile.runtimeLocalItems = true;
            profile.runtimeLocalSource = true;
            profile.sourceCoordinate = "pal";
            profile.sourceFormat = "pal_tools_runtime_local";
            return profile;
        }
        const metadataRig = getHierarchyMetadataRig(data);
        if (metadataRig) {
            profile.sourceRig = metadataRig;
            profile.unbakeFlatToCurrent = true;
            profile.sourceCoordinate = "pal";
            profile.sourceFormat = "pal_hierarchy";
            return profile;
        }
        let sawPalBone = false;
        let sawHelperBone = false;
        let sawPalBend = false;
        let sawCompoundBend = false;
        let sawBendYZ = false;
        let sawHelperPositionOrScale = false;
        let sawDragoncoreBone = false;
        Object.values(data.animations || {}).forEach(animObj => {
            const bones = (animObj && animObj.bones) || {};
            Object.keys(bones).forEach(rawName => {
                const normalized = getCorrectPlayerBoneName(rawName);
                if (normalized.endsWith(HELPER_SUFFIX)) sawHelperBone = true;
                if (isDragoncoreRawBoneName(rawName)) sawDragoncoreBone = true;
                if (PAL_DEFAULT_PIVOTS[normalized] || BEND_HELPER_BONES[normalized]) sawPalBone = true;
                const bone = bones[rawName];
                if (bone && typeof bone === "object") {
                    if (bone.bend !== undefined) {
                        sawPalBend = true;
                        if (isCompoundBendPayload(bone.bend)) sawCompoundBend = true;
                        if (bendPayloadNeedsMoreRotation(bone.bend)) sawBendYZ = true;
                    }
                    if (normalized.endsWith(HELPER_SUFFIX) && (bone.position !== undefined || bone.scale !== undefined)) {
                        sawHelperPositionOrScale = true;
                    }
                }
            });
        });
        if (sawDragoncoreBone) {
            profile.sourceRig = getDragoncoreCompatiblePalRig();
            profile.unbakeFlatToCurrent = true;
            profile.sourceCoordinate = "bedrock";
            profile.sourceFormat = "dragoncore_player";
            return profile;
        }
        if (sawCompoundBend || sawBendYZ || sawHelperPositionOrScale) {
            profile.sourceRig = null;
            profile.unbakeFlatToCurrent = true;
            profile.runtimeLocalItems = true;
            profile.skipRuntimeRootParents = ["body"];
            profile.sourceFormat = "more_rotation";
            return profile;
        }
        if (sawPalBone && (!sawHelperBone || sawPalBend || sawHelperPositionOrScale)) {
            profile.unbakeFlatToCurrent = true;
            profile.sourceFormat = "pal_original";
        } else if (sawHelperBone) {
            profile.sourceFormat = "helper_project";
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

    function getPalToolsRuntimeLocalMetadataRig(data) {
        const meta = data && data[PAL_TOOLS_METADATA_KEY];
        if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
        if (meta.format !== PAL_TOOLS_RUNTIME_LOCAL_FORMAT) return null;
        const sourceRig = meta.source_rig;
        if (!sourceRig || typeof sourceRig !== "object" || Array.isArray(sourceRig)) return null;
        return normalizeRigForMetadata(sourceRig);
    }

    function firstAnimationObjectWith(data, key) {
        const anim = Object.values((data && data.animations) || {}).find(animObj => animObj && animObj[key]);
        return anim ? anim[key] : null;
    }

    function retargetPalBendHelpersForFlatImport(data, currentRig) {
        const defaultRig = getDefaultPlayerModelPalRig();
        if (!currentRig || rigsAreEquivalent(currentRig, defaultRig)) return data;
        const defaultLocal = unbakeFlatAnimationHierarchyForEdit(data, defaultRig, getCanonicalFlatPalRig());
        const helperRotations = getRetargetedBendHelperRotations(defaultLocal, defaultRig, currentRig);
        const out = clone(data);
        applyBendHelperRotations(out, helperRotations);
        return out;
    }

    function retargetAnimationHierarchy(data, sourceRig, targetRig, options = {}) {
        if (!sourceRig || !targetRig || rigsAreEquivalent(sourceRig, targetRig)) return data;
        const flatRig = getCanonicalFlatPalRig();
        const retargetOptions = Object.assign({
            skipRootParents: ["body"],
            includeOwnBendHelperParent: true,
            includePivotRetarget: true
        }, options);
        const flatWithHelpers = bakeAnimationHierarchyToFlat(data, sourceRig, flatRig, {
            ...retargetOptions,
            includeHelpers: true
        });
        const out = unbakeFlatAnimationHierarchyForEdit(flatWithHelpers, targetRig, flatRig, {
            ...retargetOptions,
            includeHelpers: true
        });
        return preserveLocalOnlyBonesAfterRetarget(out, data);
    }

    function preserveLocalOnlyBonesAfterRetarget(targetData, sourceData) {
        const out = targetData;
        Object.keys(out.animations || {}).forEach(animName => {
            const targetBones = out.animations[animName] && out.animations[animName].bones;
            const sourceBones = sourceData.animations && sourceData.animations[animName] && sourceData.animations[animName].bones;
            if (!targetBones || !sourceBones) return;
            Object.values(BEND_HELPER_BONES).forEach(boneName => {
                const targetBone = targetBones[boneName];
                if (!targetBone || typeof targetBone !== "object") return;
                const sourceBone = sourceBones[boneName] && typeof sourceBones[boneName] === "object" ? sourceBones[boneName] : {};
                if (sourceBone.position === undefined) delete targetBone.position;
                if (sourceBone.scale === undefined) delete targetBone.scale;
                if (!Object.keys(targetBone).length) delete targetBones[boneName];
            });
            ["right_item", "left_item"].forEach(boneName => {
                const targetBone = targetBones[boneName];
                if (!targetBone || typeof targetBone !== "object") return;
                const sourceBone = sourceBones[boneName] && typeof sourceBones[boneName] === "object" ? sourceBones[boneName] : {};
                ["position", "rotation", "scale"].forEach(channel => {
                    if (sourceBone[channel] !== undefined) targetBone[channel] = clone(sourceBone[channel]);
                    else delete targetBone[channel];
                });
                if (!Object.keys(targetBone).length) delete targetBones[boneName];
            });
        });
        return out;
    }

    function getRetargetedBendHelperRotations(data, sourceRig, targetRig, options = {}) {
        if (!sourceRig || !targetRig || rigsAreEquivalent(sourceRig, targetRig)) return null;
        const retargetOptions = Object.assign({
            skipRootParents: ["body"],
            includeOwnBendHelperParent: true,
            includePivotRetarget: true
        }, options);
        const flatWithHelpers = bakeAnimationHierarchyToFlat(data, sourceRig, getCanonicalFlatPalRig(), {
            ...retargetOptions,
            includeHelpers: true
        });
        const targetWithHelpers = unbakeFlatAnimationHierarchyForEdit(flatWithHelpers, targetRig, getCanonicalFlatPalRig(), {
            ...retargetOptions,
            includeHelpers: true
        });
        const rotations = {};
        Object.keys(targetWithHelpers.animations || {}).forEach(animName => {
            const bones = targetWithHelpers.animations[animName] && targetWithHelpers.animations[animName].bones;
            if (!bones) return;
            Object.values(BEND_HELPER_BONES).forEach(helperName => {
                const helper = bones[helperName];
                if (helper && helper.rotation !== undefined) {
                    if (!rotations[animName]) rotations[animName] = {};
                    rotations[animName][helperName] = clone(helper.rotation);
                }
            });
        });
        return Object.keys(rotations).length ? rotations : null;
    }

    function applyBendHelperRotations(data, helperRotations) {
        if (!helperRotations) return data;
        Object.keys(helperRotations).forEach(animName => {
            const animObj = data.animations && data.animations[animName];
            if (!animObj) return;
            const bones = animObj.bones = animObj.bones && typeof animObj.bones === "object" ? animObj.bones : {};
            Object.keys(helperRotations[animName] || {}).forEach(helperName => {
                const helper = bones[helperName] = bones[helperName] && typeof bones[helperName] === "object" ? bones[helperName] : {};
                helper.rotation = clone(helperRotations[animName][helperName]);
                delete helper.position;
                delete helper.scale;
                delete helper.bend;
            });
        });
        return data;
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
                const bendChannels = getBendChannelTracks(parentBone.bend);
                const helperBone = bones[helper] = bones[helper] && typeof bones[helper] === "object" ? bones[helper] : {};
                if (bendChannels.rotation !== undefined) {
                    const bendTrack = normalizeTrack(bendChannels.rotation);
                    const helperRotation = helperBone.rotation = helperBone.rotation && typeof helperBone.rotation === "object" ? helperBone.rotation : {};
                    Object.keys(bendTrack).forEach(timestamp => {
                        helperRotation[String(timestamp)] = bendKeyToHelperRotationKey(bendTrack[timestamp], helperSign, parent);
                    });
                }
                if (bendChannels.position !== undefined) {
                    helperBone.position = mergeTrackPayload(helperBone.position, normalizeTrack(bendChannels.position));
                }
                if (bendChannels.scale !== undefined) {
                    helperBone.scale = mergeTrackPayload(helperBone.scale, normalizeTrack(bendChannels.scale));
                }
                if (!keepPalBend) delete parentBone.bend;
            });
            removeEmptyBones(bones);
        });
        return out;
    }

    function modelAnimationsToPalBend(data, options = {}) {
        const helperSign = options.helperSign === undefined ? 1 : Number(options.helperSign);
        const keepHelpers = !!options.keepHelpers;
        const keepHelperRotations = !!options.keepHelperRotations;
        const stripHelperPositionScale = options.stripHelperPositionScale !== false;
        const compoundBend = !!options.compoundBend;
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            Object.keys(bones).forEach(helperName => {
                if (!helperName.endsWith(HELPER_SUFFIX)) return;
                const helper = bones[helperName];
                if (!helper || typeof helper !== "object") return;
                const baseName = helperName.slice(0, -HELPER_SUFFIX.length);
                if (helper.rotation !== undefined) {
                    const bendTrack = {};
                    const rotationTrack = normalizeTrack(helper.rotation);
                    Object.keys(rotationTrack).forEach(timestamp => {
                        bendTrack[String(timestamp)] = helperFrameToBendFrame(rotationTrack[timestamp], helperSign, compoundBend, baseName);
                    });
                    const base = bones[baseName] = bones[baseName] && typeof bones[baseName] === "object" ? bones[baseName] : {};
                    setBendChannelTrack(base, "rotation", bendTrack, compoundBend);
                    if (keepHelperRotations) {
                        const normalizedHelperRotation = {};
                        Object.keys(bendTrack).forEach(timestamp => {
                            normalizedHelperRotation[String(timestamp)] = bendKeyToHelperRotationKey(bendTrack[timestamp], helperSign, baseName);
                        });
                        helper.rotation = normalizedHelperRotation;
                    }
                }
                if (compoundBend && helper.position !== undefined) {
                    const base = bones[baseName] = bones[baseName] && typeof bones[baseName] === "object" ? bones[baseName] : {};
                    setBendChannelTrack(base, "position", normalizeTrack(helper.position), true);
                }
                if (compoundBend && helper.scale !== undefined) {
                    const base = bones[baseName] = bones[baseName] && typeof bones[baseName] === "object" ? bones[baseName] : {};
                    setBendChannelTrack(base, "scale", normalizeTrack(helper.scale), true);
                }
                if (!keepHelpers) {
                    delete bones[helperName];
                    return;
                }
                if (stripHelperPositionScale) {
                    delete helper.position;
                    delete helper.scale;
                    delete helper.bend;
                }
                if (!keepHelperRotations) delete helper.rotation;
                if (!Object.keys(helper).length) delete bones[helperName];
            });
            removeEmptyBones(bones);
        });
        return out;
    }

    function animationNeedsMoreRotationBend(data) {
        let needsMoreRotation = false;
        Object.values((data && data.animations) || {}).forEach(animObj => {
            if (needsMoreRotation) return;
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            Object.keys(bones).forEach(rawName => {
                if (needsMoreRotation) return;
                const boneName = getCorrectPlayerBoneName(rawName);
                const bone = bones[rawName];
                if (!bone || typeof bone !== "object") return;
                if (boneName.endsWith(HELPER_SUFFIX)) {
                    if (bone.position !== undefined || bone.scale !== undefined) {
                        needsMoreRotation = true;
                        return;
                    }
                    if (trackHasBendYZ(bone.rotation)) needsMoreRotation = true;
                    return;
                }
                if (bone.bend !== undefined && bendPayloadNeedsMoreRotation(bone.bend)) needsMoreRotation = true;
            });
        });
        return needsMoreRotation;
    }

    function bendPayloadNeedsMoreRotation(bend) {
        if (!isCompoundBendPayload(bend)) return trackHasBendYZ(bend);
        return bend.position !== undefined || bend.scale !== undefined || trackHasBendYZ(bend.rotation);
    }

    function trackHasBendYZ(track) {
        if (track === undefined || track === null) return false;
        return getAnimationEntries(track, "bend").some(([_time, element]) => bendKeyHasYZ(element));
    }

    function bendKeyHasYZ(value) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            if (value.pre !== undefined && hasNonZeroYZ(valueToVector(value.pre, "bend"))) return true;
            if (value.post !== undefined && hasNonZeroYZ(valueToVector(value.post, "bend"))) return true;
            if (value.vector !== undefined && hasNonZeroYZ(valueToVector(value.vector, "bend"))) return true;
            if (value.value !== undefined && hasNonZeroYZ(valueToVector(value.value, "bend"))) return true;
        }
        return hasNonZeroYZ(valueToVector(value, "bend"));
    }

    function cleanPalRuntimeExport(data, options = {}) {
        const out = clone(data);
        delete out[PAL_TOOLS_METADATA_KEY];
        if (options.stripRuntimeRenderBonePositions) stripRuntimeRenderBonePositions(out);
        if (!options.stripHierarchyCompensation) return out;
        const stripBones = new Set(["torso", "head", "right_arm", "left_arm", "right_leg", "left_leg"]);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            Object.keys(bones).forEach(boneName => {
                const bone = bones[boneName];
                if (!bone || typeof bone !== "object") return;
                if (boneName.endsWith(HELPER_SUFFIX)) {
                    delete bones[boneName];
                    return;
                }
                if (stripBones.has(boneName)) {
                    delete bone.position;
                    delete bone.scale;
                }
                if (!Object.keys(bone).length) delete bones[boneName];
            });
            removeEmptyBones(bones);
        });
        return out;
    }

    function stripRuntimeRenderBonePositions(data) {
        const stripBones = new Set(["torso", "head", "right_arm", "left_arm", "right_leg", "left_leg"]);
        Object.values(data.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            stripBones.forEach(boneName => {
                const bone = bones[boneName];
                if (!bone || typeof bone !== "object") return;
                delete bone.position;
                if (!Object.keys(bone).length) delete bones[boneName];
            });
            removeEmptyBones(bones);
        });
    }

    function getBendChannelTracks(bend) {
        if (isCompoundBendPayload(bend)) {
            return {
                rotation: bend.rotation,
                position: bend.position,
                scale: bend.scale
            };
        }
        return {rotation: bend};
    }

    function setBendChannelTrack(base, channel, track, compoundBend) {
        if (!compoundBend) {
            if (channel === "rotation") base.bend = mergeTrackPayload(base.bend, track);
            return;
        }
        const bend = ensureCompoundBendPayload(base);
        bend[channel] = mergeTrackPayload(bend[channel], track);
    }

    function ensureCompoundBendPayload(base) {
        if (isCompoundBendPayload(base.bend)) return base.bend;
        const existing = base.bend !== undefined ? clone(base.bend) : undefined;
        base.bend = {};
        if (existing !== undefined) base.bend.rotation = existing;
        return base.bend;
    }

    function isCompoundBendPayload(bend) {
        return !!(bend && typeof bend === "object" && !Array.isArray(bend)
            && (bend.rotation !== undefined || bend.position !== undefined || bend.scale !== undefined));
    }

    function shouldExportPalRuntimeHierarchy(rig) {
        return false;
    }

    function attachPalRuntimeHierarchyMetadata(data, rig) {
        const runtimeRig = getPalRuntimeMetadataRig(rig);
        if (!runtimeRig || !Object.keys(runtimeRig.parents).length) return data;
        data.parents = runtimeRig.parents;
        data.model = {};
        sortPalExportKeys(Object.keys(runtimeRig.pivots)).forEach(boneName => {
            data.model[boneName] = {
                pivot: cleanNumber(runtimeRig.pivots[boneName])
            };
        });
        return data;
    }

    function getPalRuntimeMetadataRig(rig) {
        return normalizeRigForMetadata(rig);
    }

    function currentProjectUsesDragoncoreRig() {
        const marker = isProjectObject() ? Project.pal_bend_player_tools_rig : null;
        return marker === "dragoncore" || marker === "dragoncore_compatible" || isDragoncoreProjectRig(getCurrentProjectPalRig());
    }

    function isDragoncoreProjectRig(rig) {
        return !!rig && rigsAreEquivalent(rig, getDragoncoreCompatiblePalRig());
    }

    function normalizeRigForMetadata(rig) {
        const parents = {};
        const pivots = Object.assign({}, clone(PAL_DEFAULT_PIVOTS));
        Object.keys((rig && rig.parents) || {}).forEach(rawChild => {
            const child = getCorrectPlayerBoneName(rawChild);
            const parent = getCorrectPlayerBoneName(rig.parents[rawChild]);
            if (child && parent && child !== parent) parents[child] = parent;
        });
        const pivotBones = new Set([
            ...Object.keys(PAL_DEFAULT_PIVOTS),
            ...Object.keys((rig && rig.pivots) || {}),
            ...Object.keys(parents),
            ...Object.values(parents).filter(Boolean)
        ]);
        const rigPivots = (rig && rig.pivots) || {};
        pivotBones.forEach(rawName => {
            const boneName = getCorrectPlayerBoneName(rawName);
            if (!boneName) return;
            const pivot = rigPivots[rawName] || rigPivots[boneName] || PAL_DEFAULT_PIVOTS[boneName] || [0, 0, 0];
            pivots[boneName] = cleanNumber(pivot.slice(0, 3));
        });
        return {parents, pivots};
    }

    // PAL updates humanoid parts independently, so parented Blockbench rigs need a flat baked export.
    function bakeCurrentProjectHierarchyForPal(data) {
        const rig = getCurrentProjectPalRig();
        if (!rig || !rig.parents || !Object.keys(rig.parents).length) return data;
        return bakeAnimationHierarchyToFlat(data, rig, getCanonicalFlatPalRig());
    }

    function unbakeCurrentProjectHierarchyForPal(data) {
        const rig = getCurrentProjectPalRig();
        if (!rig || !rig.parents || !Object.keys(rig.parents).length) return data;
        return unbakeFlatAnimationHierarchyForEdit(data, rig, getCanonicalFlatPalRig());
    }

    function getCurrentProjectPalRig() {
        const presetRig = getCurrentProjectRigPreset();
        if (presetRig) return presetRig;
        const parents = {};
        const pivots = Object.assign({}, clone(PAL_DEFAULT_PIVOTS));
        if (!globalThis.Group || !Array.isArray(Group.all)) return {parents, pivots};
        Group.all.forEach(group => {
            if (!group || !group.name) return;
            const boneName = getCorrectPlayerBoneName(group.name);
            if (!boneName) return;
            pivots[boneName] = cleanNumber((group.origin || group.pivot || [0, 0, 0]).slice(0, 3));
            const parent = group.parent;
            if (parent && parent.name) {
                const parentName = getCorrectPlayerBoneName(parent.name);
                if (parentName && parentName !== boneName) parents[boneName] = parentName;
            }
        });
        return {parents, pivots};
    }

    function getCanonicalFlatPalRig() {
        return {
            parents: {},
            pivots: Object.assign({}, clone(PAL_DEFAULT_PIVOTS))
        };
    }

    function getCurrentProjectRigPreset() {
        const marker = isProjectObject() ? Project.pal_bend_player_tools_rig : null;
        if (marker === "player") return getDefaultPlayerModelPalRig();
        if (marker === "dragoncore" || marker === "dragoncore_compatible") return getDragoncoreCompatiblePalRig();
        if (currentProjectMatchesBoneSetup(DRAGONCORE_COMPATIBLE_BONE_SETUP)) return getDragoncoreCompatiblePalRig();
        if (currentProjectMatchesParentMap(getDefaultPlayerModelPalRig().parents)) return getDefaultPlayerModelPalRig();
        return null;
    }

    function currentProjectMatchesParentMap(parents) {
        if (!globalThis.Group || !Array.isArray(Group.all)) return false;
        const groupsByBone = {};
        Group.all.forEach(group => {
            if (!group || !group.name) return;
            groupsByBone[getCorrectPlayerBoneName(group.name)] = group;
        });
        return parentMapsAreEquivalent(getCurrentGroupParentMap(groupsByBone), parents);
    }

    function getCurrentGroupParentMap(groupsByBone) {
        const parents = {};
        Object.keys(groupsByBone || {}).forEach(boneName => {
            const group = groupsByBone[boneName];
            const parent = group && group.parent && group.parent.name ? getCorrectPlayerBoneName(group.parent.name) : null;
            if (parent) parents[boneName] = parent;
        });
        return parents;
    }

    function parentMapsAreEquivalent(a, b) {
        const keys = new Set([
            ...Object.keys(a || {}),
            ...Object.keys(b || {})
        ]);
        for (const key of keys) {
            if (((a && a[key]) || null) !== ((b && b[key]) || null)) return false;
        }
        return true;
    }

    function getDefaultPlayerModelPalRig() {
        const parents = {};
        const pivots = Object.assign({}, clone(PAL_DEFAULT_PIVOTS));
        const geometry = PLAYER_MODEL_GEO["minecraft:geometry"] && PLAYER_MODEL_GEO["minecraft:geometry"][0];
        const bones = geometry && Array.isArray(geometry.bones) ? geometry.bones : [];
        bones.forEach(bone => {
            const boneName = getCorrectPlayerBoneName(bone.name);
            if (!boneName) return;
            if (bone.parent) {
                const parentName = getCorrectPlayerBoneName(bone.parent);
                if (parentName && parentName !== boneName) parents[boneName] = parentName;
            }
            if (Array.isArray(bone.pivot)) {
                pivots[boneName] = bedrockPivotToBlockbench(bone.pivot);
            }
        });
        return {parents, pivots};
    }

    function getStandardProjectVirtualRootRig() {
        const rig = getDefaultPlayerModelPalRig();
        const parents = Object.assign({}, rig.parents);
        PAL_VIRTUAL_ROOT_CHILD_BONES.forEach(boneName => {
            if (rig.pivots[boneName] !== undefined && parents[boneName] === undefined) {
                parents[boneName] = "body";
            }
        });
        return {
            parents,
            pivots: Object.assign({}, clone(rig.pivots))
        };
    }

    function currentProjectMatchesBoneSetup(setup) {
        if (!globalThis.Group || !Array.isArray(Group.all)) return false;
        const groupsByBone = {};
        Group.all.forEach(group => {
            if (!group || !group.name) return;
            groupsByBone[getCorrectPlayerBoneName(group.name)] = group;
        });
        return Object.keys(setup).every(boneName => {
            const setupBone = setup[boneName];
            const group = groupsByBone[boneName];
            if (!group) return false;
            const expectedParent = setupBone.parent === undefined ? null : setupBone.parent;
            const actualParent = group.parent && group.parent.name ? getCorrectPlayerBoneName(group.parent.name) : null;
            return (expectedParent || null) === (actualParent || null);
        });
    }

    function getDragoncoreCompatiblePalRig() {
        const parents = {};
        const pivots = Object.assign({}, clone(PAL_DEFAULT_PIVOTS));
        Object.keys(DRAGONCORE_COMPATIBLE_BONE_SETUP).forEach(boneName => {
            const setup = DRAGONCORE_COMPATIBLE_BONE_SETUP[boneName];
            if (setup.parent !== null && setup.parent !== undefined) parents[boneName] = setup.parent;
            if (setup.pivot) pivots[boneName] = bedrockPivotToBlockbench(setup.pivot);
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

    function bedrockPivotToBlockbench(pivot) {
        const vector = Array.isArray(pivot) ? pivot : [0, 0, 0];
        return cleanNumber([
            -numberOr(vector[0], 0),
            numberOr(vector[1], 0),
            numberOr(vector[2], 0)
        ]);
    }

    function bakeAnimationHierarchyToFlat(data, rig, flatRig = getCanonicalFlatPalRig(), options = {}) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            const sourceBones = clone(bones);
            const bakeOptions = withGlobalBakeTimes(options, sourceBones);
            const targets = getHierarchyBakeTargets(bones, rig, bakeOptions, flatRig);
            targets.forEach(boneName => bakeBoneHierarchyTrack(bones, sourceBones, boneName, rig, flatRig, bakeOptions));
            removeEmptyBones(bones);
        });
        return out;
    }

    function bakeAnimationHierarchyToPalRuntimeFlat(data, rig, options = {}) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            const sourceBones = clone(bones);
            const bakeOptions = withGlobalBakeTimes(options, sourceBones);
            const targets = getHierarchyBakeTargets(bones, rig, bakeOptions);
            targets.forEach(boneName => bakeBoneHierarchyTrackForPalRuntime(bones, sourceBones, boneName, rig, bakeOptions));
            removeEmptyBones(bones);
        });
        return out;
    }

    function bakeBoneHierarchyTrackForPalRuntime(outBones, sourceBones, boneName, rig, options = {}) {
        const parentChain = getBakeParentChain(boneName, rig.parents, options);
        if (!parentChain.length) return;
        if (!chainHasAnimatedTransform(boneName, sourceBones, rig, options)) return;
        const times = getBakeTimes(sourceBones, boneName, parentChain, options);
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
            const baked = samplePalRuntimeHierarchyTransform(sourceBones, rig, boneName, time, options);
            const easing = findBakeEasing(sourceBones, boneName, parentChain, time);
            const timeKey = formatSeconds(time);
            positionTrack[timeKey] = makeBakedTrackKey(baked.position, easing);
            rotationTrack[timeKey] = makeBakedTrackKey(baked.rotation.map(radToDeg), easing);
            scaleTrack[timeKey] = makeBakedTrackKey(baked.scale, easing);
            if (!vectorNearlyEquals(baked.position, [0, 0, 0])) hasPosition = true;
            if (!vectorNearlyEquals(baked.rotation, [0, 0, 0])) hasRotation = true;
            if (!vectorNearlyEquals(baked.scale, [1, 1, 1])) hasScale = true;
        });
        alignRotationTrackContinuity(rotationTrack, sourceBone.rotation);
        if (hasPosition || sourceBone.position !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].position !== undefined)) bakedBone.position = positionTrack;
        if (hasRotation || sourceBone.rotation !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].rotation !== undefined)) bakedBone.rotation = rotationTrack;
        if (hasScale || sourceBone.scale !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].scale !== undefined)) bakedBone.scale = scaleTrack;
        outBones[boneName] = bakedBone;
    }

    function unbakeFlatAnimationHierarchyForEdit(data, rig, flatRig = getCanonicalFlatPalRig(), options = {}) {
        const out = clone(data);
        Object.values(out.animations || {}).forEach(animObj => {
            const bones = animObj && animObj.bones;
            if (!bones || typeof bones !== "object") return;
            const bakeOptions = withGlobalBakeTimes(options, bones);
            const targets = getHierarchyBakeTargets(bones, rig, bakeOptions, flatRig)
                .sort((a, b) => getBakeParentChain(a, rig.parents, bakeOptions).length - getBakeParentChain(b, rig.parents, bakeOptions).length);
            targets.forEach(boneName => unbakeBoneHierarchyTrack(bones, boneName, rig, flatRig, bakeOptions));
            removeEmptyBones(bones);
        });
        return out;
    }

    function getHierarchyBakeTargets(bones, rig, options = {}, flatRig = null) {
        const includeHelpers = !!options.includeHelpers;
        const preserveRuntimeLocalItems = !!options.preserveRuntimeLocalItems;
        const includePivotRetarget = !!options.includePivotRetarget;
        const targets = new Set();
        Object.keys(bones).forEach(name => {
            if (preserveRuntimeLocalItems && RUNTIME_LOCAL_ITEM_BONES.includes(name)) return;
            if (includeHelpers || !name.endsWith(HELPER_SUFFIX)) targets.add(name);
        });
        Object.keys(rig.parents || {}).forEach(name => {
            if (preserveRuntimeLocalItems && RUNTIME_LOCAL_ITEM_BONES.includes(name)) return;
            if (!includeHelpers && name.endsWith(HELPER_SUFFIX)) return;
            if (PAL_RENDER_BONES.includes(name) || bones[name] || chainHasAnimatedTransform(name, bones, rig, options)) targets.add(name);
        });
        return Array.from(targets).filter(name => {
            if (preserveRuntimeLocalItems && RUNTIME_LOCAL_ITEM_BONES.includes(name)) return false;
            if (!includeHelpers && name.endsWith(HELPER_SUFFIX)) return false;
            const hasParentChain = getBakeParentChain(name, rig.parents, options).length > 0;
            const hasPivotRetarget = includePivotRetarget && flatRig && rigPivotsDiffer(rig, flatRig, name);
            return hasParentChain || hasPivotRetarget;
        });
    }

    function rigPivotsDiffer(sourceRig, targetRig, boneName) {
        return !vectorNearlyEquals(getRigPivot(sourceRig, boneName), getRigPivot(targetRig, boneName));
    }

    function chainHasAnimatedTransform(boneName, bones, rig, options = {}) {
        if (boneHasTransformTracks(bones[boneName])) return true;
        return getBakeParentChain(boneName, rig.parents, options).some(parent => boneHasTransformTracks(bones[parent]));
    }

    function boneHasTransformTracks(bone) {
        return !!(bone && typeof bone === "object" && (bone.position !== undefined || bone.rotation !== undefined || bone.scale !== undefined));
    }

    function bakeBoneHierarchyTrack(outBones, sourceBones, boneName, rig, flatRig, options = {}) {
        const parentChain = getBakeParentChain(boneName, rig.parents, options);
        const hasPivotRetarget = !!options.includePivotRetarget && rigPivotsDiffer(rig, flatRig, boneName);
        if (!parentChain.length && !hasPivotRetarget) return;
        if (!chainHasAnimatedTransform(boneName, sourceBones, rig, options)) return;
        const times = getBakeTimes(sourceBones, boneName, parentChain, options);
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
            const baked = sampleBakedBoneTransform(sourceBones, boneName, rig, flatRig, time, options);
            const easing = findBakeEasing(sourceBones, boneName, parentChain, time);
            const timeKey = formatSeconds(time);
            positionTrack[timeKey] = makeBakedTrackKey(baked.position, easing);
            rotationTrack[timeKey] = makeBakedTrackKey(baked.rotation.map(radToDeg), easing);
            scaleTrack[timeKey] = makeBakedTrackKey(baked.scale, easing);
            if (!vectorNearlyEquals(baked.position, [0, 0, 0])) hasPosition = true;
            if (!vectorNearlyEquals(baked.rotation, [0, 0, 0])) hasRotation = true;
            if (!vectorNearlyEquals(baked.scale, [1, 1, 1])) hasScale = true;
        });
        alignRotationTrackContinuity(rotationTrack, sourceBone.rotation);
        if (hasPosition || sourceBone.position !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].position !== undefined)) bakedBone.position = positionTrack;
        if (hasRotation || sourceBone.rotation !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].rotation !== undefined)) bakedBone.rotation = rotationTrack;
        if (hasScale || sourceBone.scale !== undefined || parentChain.some(parent => sourceBones[parent] && sourceBones[parent].scale !== undefined)) bakedBone.scale = scaleTrack;
        outBones[boneName] = bakedBone;
    }

    function unbakeBoneHierarchyTrack(bones, boneName, rig, flatRig, options = {}) {
        const parentChain = getBakeParentChain(boneName, rig.parents, options);
        const hasPivotRetarget = !!options.includePivotRetarget && rigPivotsDiffer(rig, flatRig, boneName);
        if (!parentChain.length && !hasPivotRetarget) return;
        const sourceBone = bones[boneName] && typeof bones[boneName] === "object" ? bones[boneName] : {};
        if (!boneHasTransformTracks(sourceBone)) return;
        const times = getBakeTimes(bones, boneName, parentChain, options);
        if (!times.length) return;
        const unbakedBone = clone(sourceBone);
        const positionTrack = {};
        const rotationTrack = {};
        const scaleTrack = {};
        let hasPosition = false;
        let hasRotation = false;
        let hasScale = false;
        times.forEach(time => {
            const unbaked = sampleUnbakedBoneTransform(bones, boneName, parentChain, rig, flatRig, time);
            const easing = findBakeEasing(bones, boneName, parentChain, time);
            const timeKey = formatSeconds(time);
            positionTrack[timeKey] = makeBakedTrackKey(unbaked.position, easing);
            rotationTrack[timeKey] = makeBakedTrackKey(unbaked.rotation.map(radToDeg), easing);
            scaleTrack[timeKey] = makeBakedTrackKey(unbaked.scale, easing);
            if (!vectorNearlyEquals(unbaked.position, [0, 0, 0])) hasPosition = true;
            if (!vectorNearlyEquals(unbaked.rotation, [0, 0, 0])) hasRotation = true;
            if (!vectorNearlyEquals(unbaked.scale, [1, 1, 1])) hasScale = true;
        });
        alignRotationTrackContinuity(rotationTrack, sourceBone.rotation);
        if (hasPosition) unbakedBone.position = positionTrack;
        else delete unbakedBone.position;
        if (hasRotation) unbakedBone.rotation = rotationTrack;
        else delete unbakedBone.rotation;
        if (hasScale) unbakedBone.scale = scaleTrack;
        else delete unbakedBone.scale;
        bones[boneName] = unbakedBone;
    }

    function getBakeParentChain(boneName, parents, options = {}) {
        const chain = [];
        const seen = new Set([boneName]);
        const skippedParents = getSkippedRootParents(options);
        const includeOwnBendHelperParent = !!options.includeOwnBendHelperParent;
        let parent = parents && parents[boneName];
        while (parent && !seen.has(parent)) {
            seen.add(parent);
            if (!skippedParents.has(parent) && (includeOwnBendHelperParent || !isOwnBendHelperParent(boneName, parent))) chain.unshift(parent);
            parent = parents[parent];
        }
        return chain;
    }

    function isOwnBendHelperParent(boneName, parentName) {
        return parentName && parentName.endsWith(HELPER_SUFFIX) && parentName.slice(0, -HELPER_SUFFIX.length) === boneName;
    }

    function getSkippedRootParents(options = {}) {
        const roots = options.skipRootParents || options.skipRuntimeRootParents || [];
        return new Set(Array.isArray(roots) ? roots.filter(Boolean) : []);
    }

    function withGlobalBakeTimes(options = {}, bones) {
        if (!options.includeAllAnimationTimes) return options;
        return Object.assign({}, options, {
            globalBakeTimes: getAllTransformTimes(bones)
        });
    }

    function getAllTransformTimes(bones) {
        const times = new Set([0]);
        Object.values(bones || {}).forEach(bone => {
            if (!bone || typeof bone !== "object") return;
            ["position", "rotation", "scale"].forEach(channel => collectTrackTimes(bone[channel], times));
        });
        return Array.from(times).sort((a, b) => a - b);
    }

    function getBakeTimes(bones, boneName, parentChain, options = {}) {
        const times = new Set(Array.isArray(options.globalBakeTimes) ? options.globalBakeTimes : [0]);
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

    function sampleBakedBoneTransform(bones, boneName, rig, flatRig, time, options = {}) {
        const absoluteMatrix = sampleRigAbsoluteMatrix(bones, rig, boneName, time, options);
        const flatPivot = getRigPivot(flatRig, boneName);
        const flatWorldMatrix = matrixTranslate(absoluteMatrix, flatPivot[0], flatPivot[1], flatPivot[2]);
        return transformFromFlatWorldMatrix(flatWorldMatrix, flatRig, boneName);
    }

    function samplePalRuntimeHierarchyTransform(bones, rig, boneName, time, options = {}, cache = {}) {
        const cacheKey = boneName + "@" + time;
        if (cache[cacheKey]) return clone(cache[cacheKey]);
        const raw = sampleBoneTransform(bones[boneName], time);
        const parentName = rig.parents && rig.parents[boneName];
        if (!parentName || getSkippedRootParents(options).has(parentName)) {
            cache[cacheKey] = raw;
            return clone(raw);
        }
        const parent = samplePalRuntimeHierarchyTransform(bones, rig, parentName, time, options, cache);
        let matrix = matrixIdentity();
        matrix = prepPalRuntimeMatrixForBone(matrix, parent, getRigPivot(rig, parentName));
        const processed = applyPalRuntimeParentMatrixToChild(raw, matrix, getRigPivot(rig, boneName));
        cache[cacheKey] = processed;
        return clone(processed);
    }

    function prepPalRuntimeMatrixForBone(matrix, transform, pivot) {
        matrix = matrixTranslate(matrix, pivot[0], pivot[1], pivot[2]);
        matrix = matrixTranslate(matrix, -transform.position[0], transform.position[1], -transform.position[2]);
        matrix = matrixRotateZYX(matrix, transform.rotation);
        matrix = matrixScale(matrix, transform.scale[0], transform.scale[1], transform.scale[2]);
        matrix = matrixTranslate(matrix, -pivot[0], -pivot[1], -pivot[2]);
        return matrix;
    }

    function applyPalRuntimeParentMatrixToChild(child, parentMatrix, pivot) {
        let matrix = matrixTranslate(parentMatrix, pivot[0], pivot[1], pivot[2]);
        matrix = matrixRotateZYX(matrix, child.rotation);
        const parentScale = matrixGetScale(matrix);
        return {
            position: cleanNumber([
                child.position[0] - matrix[12] + pivot[0],
                child.position[1] + matrix[13] - pivot[1],
                child.position[2] - matrix[14] - pivot[2]
            ]),
            rotation: cleanNumber(matrixGetEulerZYX(matrix)),
            scale: cleanNumber(child.scale.map((value, index) => value * parentScale[index]))
        };
    }

    function sampleUnbakedBoneTransform(bones, boneName, parentChain, rig, flatRig, time) {
        const flatWorldMatrix = composeFlatWorldMatrix(sampleBoneTransform(bones[boneName], time), flatRig, boneName);
        const flatPivot = getRigPivot(flatRig, boneName);
        const absoluteMatrix = matrixTranslate(flatWorldMatrix, -flatPivot[0], -flatPivot[1], -flatPivot[2]);
        const targetPivot = getRigPivot(rig, boneName);
        const targetWorldMatrix = matrixTranslate(absoluteMatrix, targetPivot[0], targetPivot[1], targetPivot[2]);
        const parentWorldMatrix = sampleRigParentWorldMatrix(bones, rig, boneName, parentChain, time);
        const localMatrix = matrixMultiply(matrixInvert(parentWorldMatrix), targetWorldMatrix);
        return transformFromRigLocalMatrix(localMatrix, rig, boneName);
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
            const alpha = (time - prev.time) / Math.max(next.time - prev.time, 1e-9);
            const sampled = sampleBetweenTrackEntries(samples, samples.indexOf(prev), samples.indexOf(next), alpha, channel);
            if (sampled) return cleanNumber(sampled);
        }
        return cleanNumber(valueToVector((prev || next).value, channel));
    }

    function sampleBetweenTrackEntries(samples, prevIndex, nextIndex, alpha, channel) {
        const prev = samples[prevIndex];
        const next = samples[nextIndex];
        if (!prev || !next) return null;
        const mode = normalizeInterpolationMode(prev.value);
        const a = valueToVectorForSegmentStart(prev.value, channel);
        const b = valueToVectorForSegmentEnd(next.value, channel);
        if (!a.every(isFiniteNumberLike) || !b.every(isFiniteNumberLike)) return null;
        if (mode === "constant" || mode === "step") return a;
        if (mode === "catmullrom") {
            const p0 = valueToVectorForSegmentStart((samples[Math.max(prevIndex - 1, 0)] || prev).value, channel);
            const p3 = valueToVectorForSegmentEnd((samples[Math.min(nextIndex + 1, samples.length - 1)] || next).value, channel);
            if (p0.every(isFiniteNumberLike) && p3.every(isFiniteNumberLike)) {
                return catmullRomVector(p0, a, b, p3, alpha, channel);
            }
        }
        return interpolateVector(a, b, alpha, channel);
    }

    function normalizeInterpolationMode(value) {
        if (!value || typeof value !== "object" || Array.isArray(value)) return "linear";
        return normalizeEasing(value.lerp_mode || value.easing || DEFAULT_EASING);
    }

    function valueToVectorForSegmentStart(value, channel) {
        if (value && typeof value === "object" && !Array.isArray(value) && value.post !== undefined) {
            return valueToVector(value.post, channel);
        }
        return valueToVector(value, channel);
    }

    function valueToVectorForSegmentEnd(value, channel) {
        if (value && typeof value === "object" && !Array.isArray(value) && value.pre !== undefined) {
            return valueToVector(value.pre, channel);
        }
        return valueToVector(value, channel);
    }

    function interpolateVector(a, b, alpha, channel) {
        const alignedB = shouldInterpolateAngles(channel) ? alignAngleVectorToReference(b, a) : b;
        return a.map((value, index) => Number(value) + (Number(alignedB[index]) - Number(value)) * alpha);
    }

    function catmullRomVector(p0, p1, p2, p3, alpha, channel) {
        let c0 = p0.map(Number);
        const c1 = p1.map(Number);
        let c2 = p2.map(Number);
        let c3 = p3.map(Number);
        if (shouldInterpolateAngles(channel)) {
            c0 = alignAngleVectorToReference(c0, c1);
            c2 = alignAngleVectorToReference(c2, c1);
            c3 = alignAngleVectorToReference(c3, c2);
        }
        const t = alpha;
        const t2 = t * t;
        const t3 = t2 * t;
        return c1.map((_value, index) => 0.5 * (
            (2 * c1[index]) +
            (-c0[index] + c2[index]) * t +
            (2 * c0[index] - 5 * c1[index] + 4 * c2[index] - c3[index]) * t2 +
            (-c0[index] + 3 * c1[index] - 3 * c2[index] + c3[index]) * t3
        ));
    }

    function alignRotationTrackContinuity(track, referenceTrack) {
        const times = Object.keys(track || {}).filter(isNumericKey).sort((a, b) => Number(a) - Number(b));
        let previous = null;
        times.forEach(timeKey => {
            const frame = track[timeKey];
            const vector = valueToVector(frame, "rotation");
            const reference = findExactTrackKey(referenceTrack, Number(timeKey));
            const target = reference !== null && reference !== undefined
                ? valueToVector(reference, "rotation")
                : previous;
            const aligned = target ? alignAngleVectorToReference(vector, target) : vector;
            track[timeKey] = setTrackFrameVector(frame, aligned);
            previous = aligned;
        });
    }

    function setTrackFrameVector(frame, vector) {
        const cleaned = cleanNumber(vector);
        if (frame && typeof frame === "object" && !Array.isArray(frame)) {
            if (frame.vector !== undefined) frame.vector = cleaned;
            else frame.post = cleaned;
            return frame;
        }
        return cleaned;
    }

    function alignAngleVectorToReference(vector, reference) {
        return valueToVector(vector, "rotation").map((value, index) => nearestEquivalentAngle(Number(value), Number(reference[index])));
    }

    function nearestEquivalentAngle(value, reference) {
        if (!Number.isFinite(value) || !Number.isFinite(reference)) return value;
        return value + Math.round((reference - value) / 360) * 360;
    }

    function shouldInterpolateAngles(channel) {
        return channel === "rotation" || channel === "bend";
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

    function getRigLocalBasePosition(rig, boneName) {
        const pivot = getRigPivot(rig, boneName);
        const parentName = rig.parents && rig.parents[boneName];
        if (!parentName) return pivot.slice();
        const parentPivot = getRigPivot(rig, parentName);
        return cleanNumber([
            pivot[0] - parentPivot[0],
            pivot[1] - parentPivot[1],
            pivot[2] - parentPivot[2]
        ]);
    }

    function composeRigLocalMatrix(transform, rig, boneName) {
        const base = getRigLocalBasePosition(rig, boneName);
        return composeBlockbenchMatrix([
            base[0] + transform.position[0],
            base[1] + transform.position[1],
            base[2] + transform.position[2]
        ], transform.rotation, transform.scale);
    }

    function composeFlatWorldMatrix(transform, flatRig, boneName) {
        const pivot = getRigPivot(flatRig, boneName);
        return composeBlockbenchMatrix([
            pivot[0] + transform.position[0],
            pivot[1] + transform.position[1],
            pivot[2] + transform.position[2]
        ], transform.rotation, transform.scale);
    }

    function composeBlockbenchMatrix(position, rotation, scale) {
        let matrix = matrixIdentity();
        matrix = matrixTranslate(matrix, position[0], position[1], position[2]);
        matrix = matrixRotateZYX(matrix, rotation);
        matrix = matrixScale(matrix, scale[0], scale[1], scale[2]);
        return matrix;
    }

    function sampleRigParentWorldMatrix(bones, rig, boneName, parentChain, time) {
        let matrix = matrixIdentity();
        parentChain.forEach(parentName => {
            matrix = matrixMultiply(matrix, composeRigLocalMatrix(sampleBoneTransform(bones[parentName], time), rig, parentName));
        });
        return matrix;
    }

    function sampleRigWorldMatrix(bones, rig, boneName, time, options = {}) {
        const parentChain = getBakeParentChain(boneName, rig.parents, options);
        let matrix = sampleRigParentWorldMatrix(bones, rig, boneName, parentChain, time);
        matrix = matrixMultiply(matrix, composeRigLocalMatrix(sampleBoneTransform(bones[boneName], time), rig, boneName));
        return matrix;
    }

    function sampleRigAbsoluteMatrix(bones, rig, boneName, time, options = {}) {
        const worldMatrix = sampleRigWorldMatrix(bones, rig, boneName, time, options);
        const pivot = getRigPivot(rig, boneName);
        return matrixTranslate(worldMatrix, -pivot[0], -pivot[1], -pivot[2]);
    }

    function transformFromFlatWorldMatrix(matrix, flatRig, boneName) {
        const transform = decomposeBlockbenchMatrix(matrix);
        const pivot = getRigPivot(flatRig, boneName);
        transform.position = cleanNumber([
            transform.position[0] - pivot[0],
            transform.position[1] - pivot[1],
            transform.position[2] - pivot[2]
        ]);
        return transform;
    }

    function transformFromRigLocalMatrix(matrix, rig, boneName) {
        const transform = decomposeBlockbenchMatrix(matrix);
        const base = getRigLocalBasePosition(rig, boneName);
        transform.position = cleanNumber([
            transform.position[0] - base[0],
            transform.position[1] - base[1],
            transform.position[2] - base[2]
        ]);
        return transform;
    }

    function decomposeBlockbenchMatrix(matrix) {
        return {
            position: cleanNumber([matrix[12], matrix[13], matrix[14]]),
            rotation: cleanNumber(matrixGetEulerZYX(matrix)),
            scale: cleanNumber(matrixGetScale(matrix))
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

    function bendKeyToHelperRotationKey(value, helperSign, boneName) {
        const out = {post: bendVectorToHelperRotation(valueToVector(value, "bend"), helperSign, boneName)};
        if (value && typeof value === "object" && !Array.isArray(value) && value.pre !== undefined) {
            out.pre = bendVectorToHelperRotation(valueToVector(value.pre, "bend"), helperSign, boneName);
        }
        const lerp = copyLerpFromKey(value);
        if (lerp !== undefined) out.lerp_mode = lerp;
        return out;
    }

    function helperFrameToBendFrame(frame, helperSign, forceVector = false, boneName) {
        if (frame && typeof frame === "object" && !Array.isArray(frame)) {
            const out = {};
            if (frame.pre !== undefined) out.pre = bendFramePayload(helperRotationToBendVector(valueToVector(frame.pre, "bend"), helperSign, boneName), forceVector);
            if (frame.post !== undefined) out.post = bendFramePayload(helperRotationToBendVector(valueToVector(frame.post, "bend"), helperSign, boneName), forceVector);
            else if (frame.vector !== undefined || frame.value !== undefined) out.post = bendFramePayload(helperRotationToBendVector(valueToVector(frame, "bend"), helperSign, boneName), forceVector);
            ["lerp_mode", "easing", "easingArgs", "easingX", "easingArgsX", "easingY", "easingArgsY", "easingZ", "easingArgsZ"].forEach(key => {
                if (frame[key] !== undefined) out[key] = clone(frame[key]);
            });
            if (!Object.keys(out).length) out.post = bendFramePayload(helperRotationToBendVector(valueToVector(frame, "bend"), helperSign, boneName), forceVector);
            return out;
        }
        return {post: bendFramePayload(helperRotationToBendVector(valueToVector(frame, "bend"), helperSign, boneName), forceVector)};
    }

    function helperRotationToBendVector(vector, helperSign, boneName) {
        const out = applySignToVector(valueToVector(vector, "bend"), helperSign);
        return applyRuntimeBendAxisSign(out, boneName);
    }

    function bendVectorToHelperRotation(vector, helperSign, boneName) {
        const out = applyRuntimeBendAxisSign(valueToVector(vector, "bend"), boneName);
        return applySignToVector(out, helperSign);
    }

    function applyRuntimeBendAxisSign(vector, boneName) {
        return cleanNumber(valueToVector(vector, "bend"));
    }

    function parseEmoteToIR(data, nameHint) {
        if (!data || !data.emote) throw new Error("not an emote JSON: missing top-level emote");
        const node = data.emote;
        const version = parseInt(data.version === undefined ? 1 : data.version, 10);
        const useLegacyBodyTorso = version < 3;
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
                if (useLegacyBodyTorso && boneName === "torso") boneName = "body";
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

    function bendFramePayload(vector, forceVector = false) {
        const out = valueToVector(vector, "bend");
        if (forceVector) return cleanNumber(out);
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
            if (Math.abs(value) < CLEAN_EPSILON) return 0;
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

    function stabilizePalExportNumbers(value) {
        if (typeof value === "number") {
            if (Math.abs(value) < CLEAN_EPSILON) return 0;
            const rounded = Math.round(value * EXPORT_DECIMAL_SCALE) / EXPORT_DECIMAL_SCALE;
            return Math.abs(rounded - Math.round(rounded)) < CLEAN_EPSILON ? Math.round(rounded) : rounded;
        }
        if (Array.isArray(value)) return value.map(stabilizePalExportNumbers);
        if (value && typeof value === "object") {
            const out = {};
            sortPalExportKeys(Object.keys(value)).forEach(key => {
                out[key] = stabilizePalExportNumbers(value[key]);
            });
            return out;
        }
        return value;
    }

    function sortPalExportKeys(keys) {
        if (keys.length && keys.every(isNumericKey)) {
            return keys.slice().sort((a, b) => Number(a) - Number(b) || compareStrings(a, b));
        }
        return keys.slice().sort((a, b) => palExportKeyRank(a) - palExportKeyRank(b) || compareStrings(a, b));
    }

    function isNumericKey(key) {
        return key !== "" && Number.isFinite(Number(key));
    }

    function palExportKeyRank(key) {
        const index = PAL_EXPORT_KEY_ORDER.indexOf(key);
        return index === -1 ? PAL_EXPORT_KEY_ORDER.length : index;
    }

    function compareStrings(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    function cleanZero(value) {
        return typeof value === "number" && Math.abs(value) < CLEAN_EPSILON ? 0 : value;
    }

    function numberOr(value, fallback) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function isFiniteNumberLike(value) {
        return isNum(value) || (typeof value === "string" && Number.isFinite(Number(value)));
    }

    function vectorNearlyEquals(a, b) {
        return VECTOR_AXES.every((_axis, index) => Math.abs(numberOr(a[index], 0) - numberOr(b[index], 0)) < CLEAN_EPSILON);
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

    function debugLog(message, payload) {
        const line = `[${new Date().toISOString()}] ${message}${payload === undefined ? "" : " " + safeJson(payload)}`;
        try {
            if (globalThis.PAL_BEND_PLAYER_TOOLS_DEBUG_CONSOLE && console && typeof console.debug === "function") {
                console.debug("[PAL Bend Player Tools]", message, payload === undefined ? "" : payload);
            }
        } catch (_error) {}
        try {
            if (!globalThis.fs || !globalThis.Plugins || !Plugins.path) return;
            const separator = typeof osfs === "string" ? osfs : "/";
            const logPath = String(Plugins.path).replace(/[\\/]+$/, "") + separator + DEBUG_LOG_NAME;
            fs.appendFileSync(logPath, line + "\n", "utf8");
        } catch (_error) {}
    }

    function safeJson(payload) {
        try {
            return JSON.stringify(cleanNumber(payload));
        } catch (_error) {
            return String(payload);
        }
    }

    function summarizeAnimationBones(data) {
        const names = new Set();
        Object.values((data && data.animations) || {}).forEach(animObj => {
            Object.keys((animObj && animObj.bones) || {}).forEach(name => names.add(name));
        });
        return Array.from(names).sort();
    }

    function summarizeRigForLog(rig) {
        return {
            parents: Object.assign({}, (rig && rig.parents) || {}),
            pivots: Object.assign({}, (rig && rig.pivots) || {})
        };
    }
})();
