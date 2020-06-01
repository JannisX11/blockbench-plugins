(function () {
const EntityOptions = {};
let GeneratorAction;
Plugin.register('cem_template_loader', {
	title: 'CEM Template Loader',
	icon: 'keyboard_capslock',
	author: 'Ewan Howell',
	description: 'Load template entity models for use with OptiFine CEM.',
	version: '0.1.0',
	min_version: '3.2.0',
	variant: 'both',
	onload() {
		GeneratorAction = new Action('generate_optifine_template', {
			name: 'CEM Template Loader',
			description: '',
			icon: 'keyboard_capslock',
			click: function() {
				let options = {};
				for (var id in EntityOptions) {
					options[id] = EntityOptions[id].name
				}
				let dialog = new Dialog({
					title: 'Select Entity',
					id: 'generate_optifine_template',
					form: {
						entity: {label: 'Template', type: 'select', options}
					},
					onConfirm(result) {
						if (Format.id !== 'optifine_entity') {
							if (!newProject(Formats.optifine_entity)) return;
						}
						let entity = EntityOptions[result.entity];
						var model = JSON.parse(entity.model);
						Formats.optifine_entity.codec.parse(model, '');
						Undo.history.length = 0;
						Undo.index = 0;
						this.hide();
					}
				});
				dialog.show();
			}
		})
		MenuBar.addAction(GeneratorAction, 'filter');
	},
	onunload() {
		GeneratorAction.delete();
	}
});
EntityOptions.armor_stand = {
	name: 'Armor Stand',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 24, -1, 2, 7, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 21, -1.5, 12, 3, 3], "textureOffset": [0, 26]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-7, 12, -1, 2, 12, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [5, 12, -1, 2, 12, 2], "textureOffset": [32, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.85, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.9, 1, -1, 2, 11, 2], "textureOffset": [8, 0]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.85, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.05, 1, -1, 2, 11, 2], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right",
                "id": "right",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 14, -1, 2, 7, 2], "textureOffset": [16, 0]}
                ]
            },
            {
                "part": "left",
                "id": "left",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 14, -1, 2, 7, 2], "textureOffset": [48, 16]}
                ]
            },
            {
                "part": "waist",
                "id": "waist",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -1, 8, 2, 2], "textureOffset": [0, 48]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [0, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -6, 12, 1, 12], "textureOffset": [0, 32]}
                ]
            }
        ]
    }`
}
EntityOptions.banner = {
	name: 'Banner',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "top",
                "id": "top",
                "invertAxis": "xy",
                "translate": [0, -12, 0],
                "boxes": [
                    {"coordinates": [-10, 42, -1, 20, 2, 2], "textureOffset": [0, 42]}
                ]
            }
        ]
    }`
}
EntityOptions.bat = {
	name: 'Bat',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 21, -3, 6, 6, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 26, -2, 3, 4, 1], "textureOffset": [24, 0]},
                    {"coordinates": [1, 26, -2, 3, 4, 1], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 8, -3, 6, 12, 6], "textureOffset": [0, 16]},
                    {"coordinates": [-5, -8, 0, 10, 16, 1], "textureOffset": [0, 34]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [1, -24, 0],
                "rotate": [0, -180, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-11, 7, -1.5, 10, 16, 1], "textureOffset": [42, 0]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-12, 7, 1.5, 10, 16, 1], "textureOffset": [42, 0]}
                ]
            },
            {
                "part": "outer_right_wing",
                "id": "outer_right_wing",
                "invertAxis": "xy",
                "translate": [13, -23, -0.5],
                "rotate": [0, -180, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [5, 10, -0.5, 8, 12, 1], "textureOffset": [24, 16]}
                ]
            },
            {
                "part": "outer_left_wing",
                "id": "outer_left_wing",
                "invertAxis": "xy",
                "translate": [12, -23, -1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-20, 10, 1.5, 8, 12, 1], "textureOffset": [24, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.bed = {
	name: 'Bed',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [-8, -32, 0],
                "boxes": [
                    {"coordinates": [-8, 16, 0, 16, 16, 6], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone4",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [-90, 0, -180],
                        "boxes": [
                            {"coordinates": [5, -9, -32, 3, 3, 3], "textureOffset": [50, 18]}
                        ]
                    },
                    {
                        "id": "bone3",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [-90, 0, 90],
                        "boxes": [
                            {"coordinates": [29, -9, -8, 3, 3, 3], "textureOffset": [50, 6]}
                        ]
                    }
                ]
            },
            {
                "part": "foot",
                "id": "foot",
                "invertAxis": "xy",
                "translate": [-8, -16, 0],
                "boxes": [
                    {"coordinates": [-8, 0, 0, 16, 16, 6], "textureOffset": [0, 22]}
                ],
                "submodels": [
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [-90, 0, 0],
                        "boxes": [
                            {"coordinates": [5, -9, 0, 3, 3, 3], "textureOffset": [50, 0]}
                        ]
                    },
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [-90, 0, -90],
                        "boxes": [
                            {"coordinates": [-3, -9, -8, 3, 3, 3], "textureOffset": [50, 12]}
                        ]
                    }
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-8, -9, -8]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [-8, -9, -21]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [21, -9, -8]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [21, -9, -21]
            }
        ]
    }`
}
EntityOptions.blaze = {
	name: 'Blaze',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 20, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "stick1",
                "id": "stick1",
                "invertAxis": "xy",
                "translate": [-2, -19, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 11, -3, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick2",
                "id": "stick2",
                "invertAxis": "xy",
                "translate": [2, -19, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 11, -3, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick3",
                "id": "stick3",
                "invertAxis": "xy",
                "translate": [2, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 11, 1, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick4",
                "id": "stick4",
                "invertAxis": "xy",
                "translate": [-2, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 11, 1, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick5",
                "id": "stick5",
                "invertAxis": "xy",
                "translate": [-2, -10, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 2, -3, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick6",
                "id": "stick6",
                "invertAxis": "xy",
                "translate": [2, -10, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 2, -3, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick7",
                "id": "stick7",
                "invertAxis": "xy",
                "translate": [2, -10, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 2, 1, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick8",
                "id": "stick8",
                "invertAxis": "xy",
                "translate": [-2, -10, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 2, 1, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick9",
                "id": "stick9",
                "invertAxis": "xy",
                "translate": [-2, -1, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, -7, -3, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick10",
                "id": "stick10",
                "invertAxis": "xy",
                "translate": [2, -1, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, -7, -3, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick11",
                "id": "stick11",
                "invertAxis": "xy",
                "translate": [2, -1, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, -7, 1, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "stick12",
                "id": "stick12",
                "invertAxis": "xy",
                "translate": [-2, -1, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, -7, 1, 2, 8, 2], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.boat = {
	name: 'Boat',
	model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "bottom",
                "id": "bottom",
                "invertAxis": "xy",
                "translate": [0, -18, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "back",
                "id": "back",
                "invertAxis": "xy",
                "translate": [-11, -24, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "front",
                "id": "front",
                "invertAxis": "xy",
                "translate": [0, -2, -5.5],
                "rotate": [0, -180, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 3, -6, 16, 6, 2], "textureOffset": [0, 27]},
                    {"coordinates": [-9, 3, 24, 18, 6, 2], "textureOffset": [0, 19]}
                ],
                "submodels": [
                    {
                        "id": "sides",
                        "invertAxis": "xy",
                        "translate": [15, -22, -5],
                        "rotate": [0, 90, 0],
                        "submodels": [
                            {
                                "id": "front_sub_1",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-29, 25, -25, 28, 6, 2], "textureOffset": [0, 43]},
                                    {"coordinates": [-29, 25, -7, 28, 6, 2], "textureOffset": [0, 35]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "base",
                        "invertAxis": "xy",
                        "translate": [0, 2, -5],
                        "rotate": [-90, 90, 0],
                        "submodels": [
                            {
                                "id": "front_sub_3",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-29, -8, -2, 28, 16, 3], "textureOffset": [0, 0]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "right",
                "id": "right",
                "invertAxis": "xy",
                "translate": [0, -24, 3],
                "rotate": [0, 180, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "left",
                "id": "left",
                "invertAxis": "xy",
                "translate": [0, -24, -9],
                "mirrorTexture": "u"
            },
            {
                "part": "paddle_left",
                "id": "paddle_left",
                "invertAxis": "xy",
                "translate": [-13.5, -6, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [12.5, 4, -9.5, 2, 2, 18], "textureOffset": [62, 0]},
                    {"coordinates": [13.51, 3, 4.5, 1, 6, 7], "textureOffset": [62, 20]}
                ]
            },
            {
                "part": "paddle_right",
                "id": "paddle_right",
                "invertAxis": "xy",
                "translate": [13.5, -6, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-14.5, 4, -9.5, 2, 2, 18], "textureOffset": [62, 20]},
                    {"coordinates": [-14.51, 3, 4.5, 1, 6, 7], "textureOffset": [62, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.book = {
	name: 'Book',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "cover_right",
                "id": "cover_right",
                "invertAxis": "xy",
                "translate": [-1, -5, 0],
                "boxes": [
                    {"coordinates": [1, 0, 0, 6, 10, 0], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "cover_left",
                "id": "cover_left",
                "invertAxis": "xy",
                "translate": [1, -5, 0],
                "boxes": [
                    {"coordinates": [-7, 0, 0, 6, 10, 0], "textureOffset": [16, 0]}
                ]
            },
            {
                "part": "pages_right",
                "id": "pages_right",
                "invertAxis": "xy",
                "translate": [-5, -5, 0.2],
                "boxes": [
                    {"coordinates": [0, 1, -1.1, 5, 8, 1], "textureOffset": [0, 10]}
                ]
            },
            {
                "part": "pages_left",
                "id": "pages_left",
                "invertAxis": "xy",
                "translate": [0, -5, 1],
                "boxes": [
                    {"coordinates": [-5, 1, -1.1, 5, 8, 1], "textureOffset": [12, 10]}
                ]
            },
            {
                "part": "flipping_page_right",
                "id": "flipping_page_right",
                "invertAxis": "xy",
                "translate": [-5, -5, 2.2],
                "boxes": [
                    {"coordinates": [0, 1, -2.1, 5, 8, 0], "textureOffset": [24, 10]}
                ]
            },
            {
                "part": "flipping_page_left",
                "id": "flipping_page_left",
                "invertAxis": "xy",
                "translate": [0, -5, 2],
                "boxes": [
                    {"coordinates": [-5, 1, -2.1, 5, 8, 0], "textureOffset": [24, 10]}
                ]
            },
            {
                "part": "book_spine",
                "id": "book_spine",
                "invertAxis": "xy",
                "translate": [0, -5, 0],
                "boxes": [
                    {"coordinates": [-1, 0, 0, 2, 10, 0], "textureOffset": [14, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.cat = {
	name: 'Cat',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [1.1, -6, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-1.1, -6, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [1.2, -10.2, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.2, 0.2, -5, 2, 10, 2], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-1.2, -10.2, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.2, 0.2, -5, 2, 10, 2], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -9, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 1, 8, 1, 8, 1], "textureOffset": [0, 15]}
                ]
            },
            {
                "part": "tail2",
                "id": "tail2",
                "invertAxis": "xy",
                "translate": [0, -1, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, -7, 8, 1, 8, 1], "textureOffset": [4, 15]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 7, -12, 5, 4, 5], "textureOffset": [0, 0]},
                    {"coordinates": [-1.5, 7.02, -13, 3, 2, 2], "textureOffset": [0, 24]},
                    {"coordinates": [-2, 11, -9, 1, 1, 2], "textureOffset": [0, 10]},
                    {"coordinates": [1, 11, -9, 1, 1, 2], "textureOffset": [6, 10]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -12, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, -7, -2, 4, 16, 6], "textureOffset": [20, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.cave_spider = {
	name: 'Cave Spider',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 5, -11, 8, 8, 8], "textureOffset": [32, 4]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -9, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 6, -3, 6, 6, 6], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -9, -9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 5, 3, 10, 8, 12], "textureOffset": [0, 12]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -9, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -9, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -9, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -9, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg5",
                "id": "leg5",
                "invertAxis": "xy",
                "translate": [-4, -9, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg6",
                "id": "leg6",
                "invertAxis": "xy",
                "translate": [4, -9, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg7",
                "id": "leg7",
                "invertAxis": "xy",
                "translate": [-4, -9, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg8",
                "id": "leg8",
                "invertAxis": "xy",
                "translate": [4, -9, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.chest = {
	name: 'Chest',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-8, -14, 7],
                "boxes": [
                    {"coordinates": [-7, 9, -7, 14, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-8, -10, 8],
                "boxes": [
                    {"coordinates": [-7, 0, -7, 14, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [-8, -10, 23],
                "boxes": [
                    {"coordinates": [-1, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.chest_large = {
	name: 'Chest Large',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid_left",
                "id": "lid_left",
                "invertAxis": "xy",
                "translate": [-8, -14, 7],
                "boxes": [
                    {"coordinates": [-8, 9, -7, 15, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base_left",
                "id": "base_left",
                "invertAxis": "xy",
                "translate": [-8, -10, 8],
                "boxes": [
                    {"coordinates": [-8, 0, -7, 15, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob_left",
                "id": "knob_left",
                "invertAxis": "xy",
                "translate": [-8, -10, 23],
                "boxes": [
                    {"coordinates": [-8, 7, -8, 1, 4, 1], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "lid_right",
                "id": "lid_right",
                "invertAxis": "xy",
                "translate": [8, -14, 7],
                "boxes": [
                    {"coordinates": [-23, 9, -7, 15, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base_right",
                "id": "base_right",
                "invertAxis": "xy",
                "translate": [8, -10, 8],
                "boxes": [
                    {"coordinates": [-23, 0, -7, 15, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob_right",
                "id": "knob_right",
                "invertAxis": "xy",
                "translate": [8, -10, 23],
                "boxes": [
                    {"coordinates": [-9, 7, -8, 1, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.chicken = {
	name: 'Chicken',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.cod = {
	name: 'Cod',
	model: `{
	   "textureSize": [32, 32],
	   "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -2, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 0, 0, 2, 4, 7], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "fin_top",
                        "invertAxis": "xy",
                        "translate": [0, 4, 5],
                        "rotate": [0, 90, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [0, 0, 0, 6, 1, 0], "textureOffset": [20, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "fin_right3",
                        "invertAxis": "xy",
                        "translate": [-1, 1, 0],
                        "mirrorTexture": "u",
                        "rotate": [0, 0, 45],
                        "boxes": [
                            {"coordinates": [-2, -1, -1, 2, 1, 2], "textureOffset": [24, 1]}
                        ]
                    },
                    {
                        "id": "fin_left1",
                        "invertAxis": "xy",
                        "translate": [1, 1, 0],
                        "mirrorTexture": "u",
                        "rotate": [0, 0, -45],
                        "boxes": [
                            {"coordinates": [0, -1, -1, 2, 1, 2], "textureOffset": [24, 4]}
                        ]
                    }
                ]
            },
            {
                "part": "fin_back",
                "id": "fin_back",
                "invertAxis": "xy",
                "translate": [0, -4, 0],
                "submodels": [
                    {
                        "id": "fin_back_sub_0",
                        "invertAxis": "xy",
                        "translate": [0, -4, 0],
                        "mirrorTexture": "u",
                        "boxes": [
                            {"coordinates": [0, 4, -1, 0, 1, 6], "textureOffset": [20, -6]}
                        ]
                    }
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -2, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 0, -3, 2, 4, 3], "textureOffset": [11, 0]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -2, 3],
                "boxes": [
                    {"coordinates": [-1, 1, -4, 2, 3, 1], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "fin_left",
                "id": "fin_left",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            },
            {
                "part": "fin_right",
                "id": "fin_right",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -2, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, 7, 0, 4, 6], "textureOffset": [20, 1]}
                ]
            }
        ]
    }`
}
EntityOptions.cow = {
	name: 'Cow',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.creeper = {
	name: 'Creeper',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -18, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 18, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -18, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 6, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-2, -6, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, 2, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [2, -6, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, 2, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-2, -6, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -6, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [2, -6, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -6, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.head_creeper = {
    name: 'Creeper Head',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.dolphin = {
	name: 'Dolphin',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -4, 6],
                "boxes": [
                    {"coordinates": [-4, 0, -9, 8, 7, 6], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, 0, 3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 0, -13, 2, 2, 4], "textureOffset": [0, 13]},
                    {"coordinates": [-4, 0, -3, 8, 7, 13], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -2.5, -11],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 0, 10, 4, 5, 11], "textureOffset": [0, 19]},
                    {"coordinates": [-5, 2, 19, 10, 1, 6], "textureOffset": [19, 20]}
                ]
            },
            {
                "part": "right_fin",
                "id": "right_fin",
                "invertAxis": "xy",
                "translate": [-4.5, 0, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 0, -2, 1, 4, 7], "textureOffset": [48, 20]}
                ]
            },
            {
                "part": "left_fin",
                "id": "left_fin",
                "invertAxis": "xy",
                "translate": [4.5, 0, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -2, 1, 4, 7], "textureOffset": [48, 20]}
                ]
            },
            {
                "part": "back_fin",
                "id": "back_fin",
                "invertAxis": "xy",
                "translate": [0, -11, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 7, 3, 1, 4, 5], "textureOffset": [51, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.donkey = {
	name: 'Donkey',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 11, -11, 10, 10, 22], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 16, -11, 4, 12, 7], "textureOffset": [0, 35]}
                ]
            },
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -21, -11],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 7, 11, 3, 14, 4], "textureOffset": [42, 36]}
                ]
            },
            {
                "part": "saddle",
                "id": "saddle",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 12, -3.5, 10, 9, 9], "textureOffset": [26, 0], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 13]}
                ]
            },
            {
                "part": "mouth",
                "id": "mouth",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 28, -16, 4, 5, 5], "textureOffset": [0, 25]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [-2, -32.5, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 33, -5, 2, 7, 1], "textureOffset": [0, 12]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [2, -32.5, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 33, -5, 2, 7, 1], "textureOffset": [0, 12]}
                ]
            },
            {
                "part": "left_bit",
                "id": "left_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "right_bit",
                "id": "right_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "left_rein",
                "id": "left_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "right_rein",
                "id": "right_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "headpiece",
                "id": "headpiece",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "noseband",
                "id": "noseband",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "boxes": [
                    {"coordinates": [-2, 28, -13, 4, 5, 2], "textureOffset": [19, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.dragon = {
	name: 'Dragon [COMING SOON]'
}
EntityOptions.head_dragon = {
	name: 'Dragon Head',
	model: `{
        "textureSize": [256, 256],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 4, -24, 12, 5, 16], "textureOffset": [176, 44]},
                    {"coordinates": [-8, 0, -8, 16, 16, 16], "textureOffset": [112, 30]},
                    {"coordinates": [-5, 16, -4, 2, 4, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 9, -22, 2, 2, 4], "textureOffset": [112, 0]},
                    {"coordinates": [3, 16, -4, 2, 4, 6], "textureOffset": [0, 0]},
                    {"coordinates": [3, 9, -22, 2, 2, 4], "textureOffset": [112, 0]}
                ]
            },
            {
                "part": "jaw",
                "id": "jaw",
                "invertAxis": "xy",
                "translate": [0, -4, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -24, 12, 4, 16], "textureOffset": [176, 65]}
                ]
            }
        ]
    }`
}
EntityOptions.drowned = {
	name: 'Drowned',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.end_crystal = {
	name: 'End Crystal',
	model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "boxes": [
                    {"coordinates": [-12, 0, -12, 24, 8, 24], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "cube",
                "id": "cube",
                "invertAxis": "xy",
                "translate": [0, -19, 0],
                "boxes": [
                    {"coordinates": [-8, 11, -8, 16, 16, 16], "textureOffset": [64, 0]}
                ]
            },
            {
                "part": "glass",
                "id": "glass",
                "invertAxis": "xy",
                "translate": [0, -19, 0],
                "boxes": [
                    {"coordinates": [-8, 11, -8, 16, 16, 16], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.ender_chest = {
	name: 'Ender Chest',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-8, -14, 7],
                "boxes": [
                    {"coordinates": [-7, 9, -7, 14, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-8, -10, 8],
                "boxes": [
                    {"coordinates": [-7, 0, -7, 14, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [-8, -10, 23],
                "boxes": [
                    {"coordinates": [-1, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.enderman = {
	name: 'Enderman',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -39, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 27, -2, 8, 12, 4], "textureOffset": [32, 16]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -39, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 39, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -39, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 39, -4, 8, 8, 8], "textureOffset": [0, 16], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -37, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 9, -1, 2, 30, 2], "textureOffset": [56, 0]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -37, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 9, -1, 2, 30, 2], "textureOffset": [56, 0]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -30, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -1, 2, 30, 2], "textureOffset": [56, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -30, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -1, 2, 30, 2], "textureOffset": [56, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.endermite = {
	name: 'Endermite',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body1",
                "id": "body1",
                "invertAxis": "xy",
                "translate": [0, -3, 3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 0, -4.5, 4, 3, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body2",
                "id": "body2",
                "invertAxis": "xy",
                "translate": [0, -4, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2.5, 6, 4, 5], "textureOffset": [0, 5]}
                ]
            },
            {
                "part": "body3",
                "id": "body3",
                "invertAxis": "xy",
                "translate": [0, -3, -3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 0, 2.5, 3, 3, 1], "textureOffset": [0, 14]}
                ]
            },
            {
                "part": "body4",
                "id": "body4",
                "invertAxis": "xy",
                "translate": [0, -2, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 0, 3.5, 1, 2, 1], "textureOffset": [0, 18]}
                ]
            }
        ]
    }`
}
EntityOptions.evoker = {
	name: 'Evoker',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -26, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]},
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "arms",
                "id": "arms",
                "invertAxis": "xy",
                "translate": [0, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
                    {"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]},
                    {"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            }
        ]
    }`
}
EntityOptions.evoker_fangs = {
	name: 'Evoker Fangs',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-5, -11, 5],
                "boxes": [
                    {"coordinates": [-5, 0, -5, 10, 11, 10], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "upper_jaw",
                "id": "upper_jaw",
                "invertAxis": "xy",
                "translate": [-2.5, -25, 4],
                "boxes": [
                    {"coordinates": [-1.5, 11, -4, 4, 14, 8], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "lower_jaw",
                "id": "lower_jaw",
                "invertAxis": "xy",
                "translate": [-1.5, -25, 4],
                "boxes": [
                    {"coordinates": [-2.5, 11, -4, 4, 14, 8], "textureOffset": [40, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.fox = {
	name: 'Fox',
	model: `{
        "textureSize": [48, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [-1, -7.5, 3],
                "boxes": [
                    {"coordinates": [-4, 3.5, -8, 8, 6, 6], "textureOffset": [1, 5]},
                    {"coordinates": [-4, 9.5, -7, 2, 2, 1], "textureOffset": [15, 1]},
                    {"coordinates": [2, 9.5, -7, 2, 2, 1], "textureOffset": [8, 1]},
                    {"coordinates": [-2, 3.5, -11, 4, 2, 3], "textureOffset": [6, 18]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -16, -3.5],
                "boxes": [
                    {"coordinates": [-3, 1, 0, 6, 11, 6], "textureOffset": [24, 15]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-5, -6.5, -7],
                "boxes": [
                    {"coordinates": [1.001, 0, 6, 2, 6, 2], "textureOffset": [13, 24]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [-1, -6.5, -7],
                "boxes": [
                    {"coordinates": [-3.001, 0, 6, 2, 6, 2], "textureOffset": [4, 24]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-5, -6.5, 0],
                "boxes": [
                    {"coordinates": [1.001, 0, -1, 2, 6, 2], "textureOffset": [13, 24]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [-1, -6.5, 0],
                "boxes": [
                    {"coordinates": [-3.001, 0, -1, 2, 6, 2], "textureOffset": [4, 24]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [-4, -11, -10],
                "boxes": [
                    {"coordinates": [-2, 2, 9, 4, 9, 5], "textureOffset": [30, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.ghast = {
	name: 'Ghast',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "tentacle1",
                "id": "tentacle1",
                "invertAxis": "xy",
                "translate": [-3.7, -1, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.7, -8, -6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle2",
                "id": "tentacle2",
                "invertAxis": "xy",
                "translate": [1.3, -1, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-7.3, -10, -6, 2, 11, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle3",
                "id": "tentacle3",
                "invertAxis": "xy",
                "translate": [6.3, -1, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.3, -12, -6, 2, 13, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle4",
                "id": "tentacle4",
                "invertAxis": "xy",
                "translate": [-6.3, -1, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [5.3, -10, -1, 2, 11, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle5",
                "id": "tentacle5",
                "invertAxis": "xy",
                "translate": [-1.3, -1, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.3, -10, -1, 2, 11, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle6",
                "id": "tentacle6",
                "invertAxis": "xy",
                "translate": [3.7, -1, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4.7, -9, -1, 2, 10, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle7",
                "id": "tentacle7",
                "invertAxis": "xy",
                "translate": [-3.7, -1, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.7, -11, 4, 2, 12, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle8",
                "id": "tentacle8",
                "invertAxis": "xy",
                "translate": [1.3, -1, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-7.3, -11, 4, 2, 12, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle9",
                "id": "tentacle9",
                "invertAxis": "xy",
                "translate": [6.3, -1, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.3, -8, 4, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 0, -8, 16, 16, 16], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.giant = {
	name: 'Giant',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.guardian = {
	name: 'Guardian',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 2, -8, 12, 12, 16], "textureOffset": [0, 0]},
                    {"coordinates": [-8, 2, -6, 2, 12, 12], "textureOffset": [0, 28]},
                    {"coordinates": [-6, 14, -6, 12, 2, 12], "textureOffset": [16, 40]},
                    {"coordinates": [-6, 0, -6, 12, 2, 12], "textureOffset": [16, 40]}
                ],
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -180, 0],
                        "submodels": [
                            {
                                "id": "body_sub_1",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, -6, 2, 12, 12], "textureOffset": [0, 28]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "eye",
                "id": "eye",
                "invertAxis": "xy",
                "translate": [0, -23.5, 8.25],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 6.5, -8.25, 2, 2, 1], "textureOffset": [8, 0]}
                ]
            },
            {
                "part": "tail1",
                "id": "tail1",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 6, 7, 4, 4, 8], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "tail2",
                "id": "tail2",
                "invertAxis": "xy",
                "translate": [-1, -24, -15],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 6.5, 15, 3, 3, 7], "textureOffset": [0, 54]}
                ]
            },
            {
                "part": "tail3",
                "id": "tail3",
                "invertAxis": "xy",
                "translate": [0, -24, -22],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 7, 22, 2, 2, 6], "textureOffset": [41, 32]},
                    {"coordinates": [0, 3.5, 28, 1, 9, 9], "textureOffset": [25, 19]}
                ]
            },
            {
                "part": "spine1",
                "id": "spine1",
                "invertAxis": "xy",
                "translate": [0, -18.5, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 14, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine2",
                "id": "spine2",
                "invertAxis": "xy",
                "translate": [0, -18.5, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 14, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine3",
                "id": "spine3",
                "invertAxis": "xy",
                "translate": [7, -18.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 14, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine4",
                "id": "spine4",
                "invertAxis": "xy",
                "translate": [-7, -18.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, 14, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine5",
                "id": "spine5",
                "invertAxis": "xy",
                "translate": [-7, -8, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, 3.5, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine6",
                "id": "spine6",
                "invertAxis": "xy",
                "translate": [7, -8, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 3.5, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine7",
                "id": "spine7",
                "invertAxis": "xy",
                "translate": [7, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 3.5, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine8",
                "id": "spine8",
                "invertAxis": "xy",
                "translate": [-7, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, 3.5, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine9",
                "id": "spine9",
                "invertAxis": "xy",
                "translate": [0, 2.5, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -7, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine10",
                "id": "spine10",
                "invertAxis": "xy",
                "translate": [0, 2.5, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -7, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine11",
                "id": "spine11",
                "invertAxis": "xy",
                "translate": [7, 2.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine12",
                "id": "spine12",
                "invertAxis": "xy",
                "translate": [-7, 2.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.head_humanoid = {
	name: 'Humanoid Head',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.horse = {
    name: 'Horse',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 11, -11, 10, 10, 22], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -22, 8.9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 16, -11, 4, 12, 7], "textureOffset": [0, 35]}
                ]
            },
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, 9.1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, 9.1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -21, -11],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 7, 11, 3, 14, 4], "textureOffset": [42, 36]}
                ]
            },
            {
                "part": "saddle",
                "id": "saddle",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 12, -3.5, 10, 9, 9], "textureOffset": [26, 0], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 13]}
                ]
            },
            {
                "part": "mouth",
                "id": "mouth",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 28, -16, 4, 5, 5], "textureOffset": [0, 25]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [0, -23, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 33, -5.01, 2, 3, 1], "textureOffset": [19, 16]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [0, -23, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 33, -5.01, 2, 3, 1], "textureOffset": [19, 16]}
                ]
            },
            {
                "part": "left_bit",
                "id": "left_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "right_bit",
                "id": "right_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "left_rein",
                "id": "left_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "right_rein",
                "id": "right_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "headpiece",
                "id": "headpiece",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "noseband",
                "id": "noseband",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "boxes": [
                    {"coordinates": [-2, 28, -13, 4, 5, 2], "textureOffset": [19, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "mane",
                "id": "mane",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 17, -4, 2, 16, 2], "textureOffset": [56, 36]}
                ]
            }
        ]
    }`
}
EntityOptions.husk = {
    name: 'Husk',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.illusioner = {
    name: 'Illusioner',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -26, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]},
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "arms",
                "id": "arms",
                "invertAxis": "xy",
                "translate": [0, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
                    {"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]},
                    {"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            }
        ]
    }`
}
EntityOptions.iron_golem = {
    name: 'Iron Golem',
    model: `{
        "textureSize": [128, 128],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -31, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-9, 21, -6, 18, 12, 11], "textureOffset": [0, 40]},
                    {"coordinates": [-4.5, 16, -3, 9, 5, 6], "textureOffset": [0, 70], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -31, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 33, -7.5, 8, 10, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-1, 32, -9.5, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [0, -31, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-13, 3.5, -3, 4, 30, 6], "textureOffset": [60, 21]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [0, -31, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [9, 3.5, -3, 4, 30, 6], "textureOffset": [60, 58]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [5, -13, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-7.5, 0, -3, 6, 16, 5], "textureOffset": [37, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [-5, -13, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, -3, 6, 16, 5], "textureOffset": [60, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.lead_knot = {
    name: 'Lead Knot',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "knot",
                "id": "knot",
                "invertAxis": "xy",
                "translate": [0, -2, 0],
                "boxes": [
                    {"coordinates": [-3, 0, -3, 6, 8, 6], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.llama = {
    name: 'Llama',
    model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -17, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 27, -16, 4, 4, 9], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 15, -12, 8, 18, 6], "textureOffset": [0, 14]},
                    {"coordinates": [-4, 33, -10, 3, 3, 2], "textureOffset": [17, 0]},
                    {"coordinates": [1, 33, -10, 3, 3, 2], "textureOffset": [17, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [29, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3.5, -14, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3.5, -14, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3.5, -14, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3.5, -14, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            }
        ]
    }`
}
EntityOptions.magma_cube = {
    name: 'Magma Cube',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "segment1",
                "id": "segment1",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -4, 8, 1, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "segment2",
                "id": "segment2",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 6, -4, 8, 1, 8], "textureOffset": [0, 1]}
                ]
            },
            {
                "part": "segment3",
                "id": "segment3",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 5, -4, 8, 1, 8], "textureOffset": [24, 10]}
                ]
            },
            {
                "part": "segment4",
                "id": "segment4",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 4, -4, 8, 1, 8], "textureOffset": [24, 19]}
                ]
            },
            {
                "part": "segment5",
                "id": "segment5",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 3, -4, 8, 1, 8], "textureOffset": [0, 4]}
                ]
            },
            {
                "part": "segment6",
                "id": "segment6",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 2, -4, 8, 1, 8], "textureOffset": [0, 5]}
                ]
            },
            {
                "part": "segment7",
                "id": "segment7",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 1, -4, 8, 1, 8], "textureOffset": [0, 6]}
                ]
            },
            {
                "part": "segment8",
                "id": "segment8",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 1, 8], "textureOffset": [0, 7]}
                ]
            },
            {
                "part": "core",
                "id": "core",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 2, -2, 4, 4, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.minecart = {
    name: 'Minecart',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "front",
                "id": "front",
                "invertAxis": "xy",
                "translate": [0, -1, -9],
                "boxes": [
                    {"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone4",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -180, 0],
                        "boxes": [
                            {"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
                        ]
                    },
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, 90, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -90, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone3",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, 90, 90],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "back",
                "id": "back",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            },
            {
                "part": "bottom",
                "id": "bottom",
                "invertAxis": "xy",
                "translate": [0, -20, 0],
                "rotate": [-180, -180, -180],
                "mirrorTexture": "u"
            },
            {
                "part": "right",
                "id": "right",
                "invertAxis": "xy",
                "translate": [0, -25, 7],
                "mirrorTexture": "u"
            },
            {
                "part": "left",
                "id": "left",
                "invertAxis": "xy",
                "translate": [0, -25, -7],
                "mirrorTexture": "u"
            },
            {
                "part": "dirt",
                "id": "dirt",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            }
        ]
    }`
}
EntityOptions.mooshroom = {
    name: 'Mooshroom',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.mule = {
    name: 'Mule',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 11, -11, 10, 10, 22], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 16, -11, 4, 12, 7], "textureOffset": [0, 35]}
                ]
            },
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -21, -11],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 7, 11, 3, 14, 4], "textureOffset": [42, 36]}
                ]
            },
            {
                "part": "saddle",
                "id": "saddle",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 12, -3.5, 10, 9, 9], "textureOffset": [26, 0], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 13]}
                ]
            },
            {
                "part": "mouth",
                "id": "mouth",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 28, -16, 4, 5, 5], "textureOffset": [0, 25]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [-2, -32.5, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 33, -5, 2, 7, 1], "textureOffset": [0, 12]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [2, -32.5, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 33, -5, 2, 7, 1], "textureOffset": [0, 12]}
                ]
            },
            {
                "part": "left_bit",
                "id": "left_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "right_bit",
                "id": "right_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "left_rein",
                "id": "left_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "right_rein",
                "id": "right_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "headpiece",
                "id": "headpiece",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "noseband",
                "id": "noseband",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "boxes": [
                    {"coordinates": [-2, 28, -13, 4, 5, 2], "textureOffset": [19, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.ocelot = {
    name: 'Ocelot',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [1.1, -6, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-1.1, -6, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [1.2, -10.2, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.2, 0.2, -5, 2, 10, 2], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-1.2, -10.2, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.2, 0.2, -5, 2, 10, 2], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -9, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 1, 8, 1, 8, 1], "textureOffset": [0, 15]}
                ]
            },
            {
                "part": "tail2",
                "id": "tail2",
                "invertAxis": "xy",
                "translate": [0, -1, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, -7, 8, 1, 8, 1], "textureOffset": [4, 15]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 7, -12, 5, 4, 5], "textureOffset": [0, 0]},
                    {"coordinates": [-1.5, 7.02, -13, 3, 2, 2], "textureOffset": [0, 24]},
                    {"coordinates": [-2, 11, -9, 1, 1, 2], "textureOffset": [0, 10]},
                    {"coordinates": [1, 11, -9, 1, 1, 2], "textureOffset": [6, 10]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -12, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, -7, -2, 4, 16, 6], "textureOffset": [20, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.panda = {
    name: 'Panda',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12.5, 17],
                "boxes": [
                    {"coordinates": [-6.5, 7.5, -21, 13, 10, 9], "textureOffset": [0, 6]},
                    {"coordinates": [-3.5, 7.5, -23, 7, 5, 2], "textureOffset": [45, 16]},
                    {"coordinates": [3.5, 16.5, -18, 5, 4, 1], "textureOffset": [52, 25]},
                    {"coordinates": [-8.5, 16.5, -18, 5, 4, 1], "textureOffset": [52, 25]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -14, 0],
                "boxes": [
                    {"coordinates": [-9.5, 1, -6.5, 19, 26, 13], "textureOffset": [0, 25]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [5.5, -9, 9],
                "boxes": [
                    {"coordinates": [-8.5, 0, -12, 6, 9, 6], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-5.5, -9, 9],
                "boxes": [
                    {"coordinates": [2.5, 0, -12, 6, 9, 6], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [5.5, -9, -9],
                "boxes": [
                    {"coordinates": [-8.5, 0, 6, 6, 9, 6], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-5.5, -9, -9],
                "boxes": [
                    {"coordinates": [2.5, 0, 6, 6, 9, 6], "textureOffset": [40, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.parrot = {
    name: 'Parrot',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -8.3, 0.8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 6.5, -1.5, 2, 3, 2], "textureOffset": [2, 2]},
                    {"coordinates": [-1, 9.5, -3.5, 2, 1, 4], "textureOffset": [10, 0]},
                    {"coordinates": [-0.5, 7.5, -2.5, 1, 2, 1], "textureOffset": [11, 7]},
                    {"coordinates": [-0.5, 7.8, -3.5, 1, 1.7, 1], "textureOffset": [16, 7]},
                    {"coordinates": [0, 9.5, -2.5, 0, 5, 4], "textureOffset": [2, 18]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -7.5, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 1.5, -2.5, 3, 6, 3], "textureOffset": [2, 8]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -2.9, -1.2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, -0.1, 0.2, 3, 4, 1], "textureOffset": [22, 1]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [-1.5, -7.1, 0.8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 2.1, -2.3, 1, 5, 3], "textureOffset": [19, 8]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [1.5, -7.1, 0.8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 2.1, -2.3, 1, 5, 3], "textureOffset": [19, 8]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -2, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 0, -1.5, 1, 2, 1], "textureOffset": [14, 18]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1, -2, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 0, -1.5, 1, 2, 1], "textureOffset": [14, 18]}
                ]
            }
        ]
    }`
}
EntityOptions.phantom = {
    name: 'Phantom',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-2, 23, -8, 5, 3, 9], "textureOffset": [0, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -23, 7],
                "rotate": [1.5, 0, 0],
                "boxes": [
                    {"coordinates": [-3, 21.8, -13, 7, 3, 5], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [2, -26, 8],
                "boxes": [
                    {"coordinates": [-8, 24, -8, 6, 2, 9], "textureOffset": [23, 12]}
                ]
            },
            {
                "part": "left_wing_tip",
                "id": "left_wing_tip",
                "invertAxis": "xy",
                "translate": [8, -26, 8],
                "boxes": [
                    {"coordinates": [-21, 25, -8, 13, 1, 9], "textureOffset": [16, 24]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-3, -26, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 24, -8, 6, 2, 9], "textureOffset": [23, 12]}
                ]
            },
            {
                "part": "right_wing_tip",
                "id": "right_wing_tip",
                "invertAxis": "xy",
                "translate": [-9, -26, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [9, 25, -8, 13, 1, 9], "textureOffset": [16, 24]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -26, -1],
                "boxes": [
                    {"coordinates": [-1, 24, 1, 3, 2, 6], "textureOffset": [3, 20]}
                ]
            },
            {
                "part": "tail2",
                "id": "tail2",
                "invertAxis": "xy",
                "translate": [0, -25.5, -7],
                "boxes": [
                    {"coordinates": [0, 24.5, 7, 1, 1, 6], "textureOffset": [4, 29]}
                ]
            }
        ]
    }`
}
EntityOptions.pig = {
    name: 'Pig',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.pillager = {
    name: 'Pillager',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -26, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]},
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            }
        ]
    }`
}
EntityOptions.polar_bear = {
    name: 'Polar Bear',
    model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -14, 16],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.5, 10, -19, 7, 7, 7], "textureOffset": [0, 0]},
                    {"coordinates": [-2.5, 10, -22, 5, 3, 3], "textureOffset": [0, 44]},
                    {"coordinates": [-4.5, 16, -17, 2, 2, 1], "textureOffset": [26, 0]},
                    {"coordinates": [2.5, 16, -17, 2, 2, 1], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [-2, -15, -12],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-7, 14, 5, 14, 14, 11], "textureOffset": [0, 19]},
                    {"coordinates": [-6, 28, 5, 12, 12, 10], "textureOffset": [39, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4.5, -10, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6.5, 0, 4, 4, 10, 8], "textureOffset": [50, 22]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4.5, -10, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.5, 0, 4, 4, 10, 8], "textureOffset": [50, 22]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3.5, -10, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 0, -10, 4, 10, 6], "textureOffset": [50, 40]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3.5, -10, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, -10, 4, 10, 6], "textureOffset": [50, 40]}
                ]
            }
        ]
    }`
}
EntityOptions.puffer_fish_big = {
    name: 'Pufferfish [Big]',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "fin_left",
                "id": "fin_left",
                "invertAxis": "xy",
                "translate": [4, -7, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 6, -2.99, 2, 1, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "fin_right",
                "id": "fin_right",
                "invertAxis": "xy",
                "translate": [-4, -7, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 6, -2.99, 2, 1, 2], "textureOffset": [24, 3]}
                ]
            },
            {
                "part": "spikes_front_top",
                "id": "spikes_front_top",
                "invertAxis": "xy",
                "translate": [0, -8, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -4, 8, 1, 1], "textureOffset": [14, 16]}
                ]
            },
            {
                "part": "spikes_middle_top",
                "id": "spikes_middle_top",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, 0, 8, 1, 1], "textureOffset": [14, 16]}
                ]
            },
            {
                "part": "spikes_back_top",
                "id": "spikes_back_top",
                "invertAxis": "xy",
                "translate": [0, -8, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, 4, 8, 1, 1], "textureOffset": [14, 16]}
                ]
            },
            {
                "part": "spikes_front_right",
                "id": "spikes_front_right",
                "invertAxis": "xy",
                "translate": [-7.25, 0, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 4, 1, 8, 1], "textureOffset": [4, 16]}
                ]
            },
            {
                "part": "spikes_front_left",
                "id": "spikes_front_left",
                "invertAxis": "xy",
                "translate": [7.25, 0, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 0, 4, 1, 8, 1], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "spikes_front_bottom",
                "id": "spikes_front_bottom",
                "invertAxis": "xy",
                "translate": [0, 0, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, -1, -4, 8, 1, 1], "textureOffset": [14, 19]}
                ]
            },
            {
                "part": "spikes_middle_bottom",
                "id": "spikes_middle_bottom",
                "invertAxis": "xy",
                "translate": [0, 0, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, -1, 4, 8, 1, 1], "textureOffset": [14, 19]}
                ]
            },
            {
                "part": "spikes_back_bottom",
                "id": "spikes_back_bottom",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, -0.5, 0.5],
                        "rotate": [-90, 0, 0],
                        "submodels": [
                            {
                                "id": "spikes_back_bottom_sub_1",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-4, -0.5, -0.5, 8, 1, 1], "textureOffset": [14, 20]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "spikes_back_right",
                "id": "spikes_back_right",
                "invertAxis": "xy",
                "translate": [-7.25, 0, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -4, 1, 8, 1], "textureOffset": [8, 16]}
                ]
            },
            {
                "part": "spikes_back_left",
                "id": "spikes_back_left",
                "invertAxis": "xy",
                "translate": [7.25, 0, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 0, -4, 1, 8, 1], "textureOffset": [8, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.puffer_fish_medium = {
    name: 'Pufferfish [Medium]',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 1, -2.5, 5, 5, 5], "textureOffset": [12, 22]}
                ],
                "submodels": [
                    {
                        "id": "bone8",
                        "invertAxis": "xy",
                        "translate": [2.5, 1, -2.5],
                        "rotate": [0, 45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [0, 0, 0, 1, 5, 1], "textureOffset": [4, 16]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone7",
                        "invertAxis": "xy",
                        "translate": [2.5, 1, 2.5],
                        "rotate": [0, -45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [0, 0, 0, 1, 5, 1], "textureOffset": [4, 16]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone6",
                        "invertAxis": "xy",
                        "translate": [0, 6, 2.5],
                        "rotate": [45, 0, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-1.5, 0, -1, 4, 1, 1], "textureOffset": [10, 16]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone5",
                        "invertAxis": "xy",
                        "translate": [-2.5, 1, 2.5],
                        "rotate": [0, 45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-1, 0, 0, 1, 5, 1], "textureOffset": [8, 16]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone4",
                        "invertAxis": "xy",
                        "translate": [-2.5, 1, -2.5],
                        "rotate": [0, -45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-1, 0, 0, 1, 5, 1], "textureOffset": [4, 16]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone3",
                        "invertAxis": "xy",
                        "translate": [0, 1, 2.5],
                        "rotate": [45, 0, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-2.5, -1, 0, 5, 1, 1], "textureOffset": [17, 20]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [0, 1, -2.5],
                        "rotate": [45, 0, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-2.5, -1, 0, 5, 1, 1], "textureOffset": [17, 19]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [-0.5, 6, -2.5],
                        "rotate": [-45, 0, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-2, 0, 0, 4, 1, 1], "textureOffset": [18, 16]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "fin_right",
                "id": "fin_right",
                "invertAxis": "xy",
                "translate": [-2.5, -6, 1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.5, 5, -1.49, 2, 1, 2], "textureOffset": [24, 3]}
                ]
            },
            {
                "part": "fin_left",
                "id": "fin_left",
                "invertAxis": "xy",
                "translate": [2.5, -6, 1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4.5, 5, -1.5, 2, 1, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "spikes_front_top",
                "id": "spikes_front_top",
                "invertAxis": "xy",
                "translate": [-0.5, -6, 2.5],
                "mirrorTexture": "u"
            },
            {
                "part": "spikes_back_top",
                "id": "spikes_back_top",
                "invertAxis": "xy",
                "translate": [-0.5, -6, -2.5],
                "mirrorTexture": "u"
            },
            {
                "part": "spikes_front_right",
                "id": "spikes_front_right",
                "invertAxis": "xy",
                "translate": [-2.5, 0, 2.5],
                "mirrorTexture": "u"
            },
            {
                "part": "spikes_back_right",
                "id": "spikes_back_right",
                "invertAxis": "xy",
                "translate": [-2.5, 0, -2.5],
                "mirrorTexture": "u"
            },
            {
                "part": "spikes_back_left",
                "id": "spikes_back_left",
                "invertAxis": "xy",
                "translate": [2.5, 0, -2.5],
                "mirrorTexture": "u"
            },
            {
                "part": "spikes_front_left",
                "id": "spikes_front_left",
                "invertAxis": "xy",
                "translate": [2.5, 0, 2.5],
                "mirrorTexture": "u"
            },
            {
                "part": "spikes_back_bottom",
                "id": "spikes_back_bottom",
                "invertAxis": "xy",
                "translate": [2, -1, -2.5],
                "mirrorTexture": "u"
            },
            {
                "part": "spikes_front_bottom",
                "id": "spikes_front_bottom",
                "invertAxis": "xy",
                "translate": [0.5, 0, 2.5],
                "mirrorTexture": "u"
            }
        ]
    }`
}
EntityOptions.puffer_fish_small = {
    name: 'Pufferfish [Small]',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 0, -1.5, 3, 2, 3], "textureOffset": [0, 27]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -1, -1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 1, 1.5, 3, 0, 3], "textureOffset": [-3, 0]}
                ]
            },
            {
                "part": "fin_right",
                "id": "fin_right",
                "invertAxis": "xy",
                "translate": [-1.5, -1, 1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, -1.49, 1, 1, 2], "textureOffset": [25, 0]}
                ]
            },
            {
                "part": "fin_left",
                "id": "fin_left",
                "invertAxis": "xy",
                "translate": [1.5, -1, 1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 0, -1.49, 1, 1, 2], "textureOffset": [25, 0]}
                ]
            },
            {
                "part": "eye_right",
                "id": "eye_right",
                "invertAxis": "xy",
                "translate": [0, -3, 0],
                "boxes": [
                    {"coordinates": [-1.5, 2, -1.5, 1, 1, 1], "textureOffset": [28, 6]}
                ]
            },
            {
                "part": "eye_left",
                "id": "eye_left",
                "invertAxis": "xy",
                "translate": [0, -3, 0],
                "boxes": [
                    {"coordinates": [0.5, 2, -1.5, 1, 1, 1], "textureOffset": [24, 6]}
                ]
            }
        ]
    }`
}
EntityOptions.rabbit = {
    name: 'Rabbit',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "left_foot",
                "id": "left_foot",
                "invertAxis": "xy",
                "translate": [3, -8, -6.2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 2, 2.5, 2, 1, 7], "textureOffset": [26, 24]}
                ]
            },
            {
                "part": "right_foot",
                "id": "right_foot",
                "invertAxis": "xy",
                "translate": [-3, -8, -6.2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 2, 2.5, 2, 1, 7], "textureOffset": [8, 24]}
                ]
            },
            {
                "part": "left_thigh",
                "id": "left_thigh",
                "invertAxis": "xy",
                "translate": [3, -6.5, -4.7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 3, 4.5, 2, 4, 5], "textureOffset": [16, 15]}
                ]
            },
            {
                "part": "right_thigh",
                "id": "right_thigh",
                "invertAxis": "xy",
                "translate": [-3, -6.5, -4.7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 3, 4.5, 2, 4, 5], "textureOffset": [30, 15]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -9, -9],
                "boxes": [
                    {"coordinates": [-3, 6, -1, 6, 5, 10], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [3, -7, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -2, 2, 7, 2], "textureOffset": [8, 15]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-3, -7, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 2, 7, 2], "textureOffset": [0, 15]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 8, -6, 5, 4, 5], "textureOffset": [32, 0]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 12, -2, 2, 5, 1], "textureOffset": [58, 0]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 12, -2, 2, 5, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -7.75, -9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 6.25, 9, 3, 3, 2], "textureOffset": [52, 6]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 9.5, -6.5, 1, 1, 1], "textureOffset": [32, 9]}
                ]
            }
        ]
    }`
}
EntityOptions.ravager = {
    name: 'Ravager',
    model: `{
        "textureSize": [128, 128],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -14, 10],
                "boxes": [
                    {"coordinates": [-8, 14, -24, 16, 20, 16], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 12, -28, 4, 8, 4], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "horns",
                        "invertAxis": "xy",
                        "translate": [5, 27, -19],
                        "rotate": [-60, 0, 0],
                        "boxes": [
                            {"coordinates": [3, 0, -1, 2, 14, 4], "textureOffset": [74, 55]},
                            {"coordinates": [-15, 0, -1, 2, 14, 4], "textureOffset": [74, 55]}
                        ]
                    }
                ]
            },
            {
                "part": "jaw",
                "id": "jaw",
                "invertAxis": "xy",
                "translate": [0, -16, 8],
                "boxes": [
                    {"coordinates": [-8, 13, -24, 16, 3, 16], "textureOffset": [0, 36]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -17.5, -5],
                "boxes": [
                    {"coordinates": [-7, 11.5, -2, 14, 16, 20], "textureOffset": [0, 55]},
                    {"coordinates": [-6, -1.5, -2, 12, 13, 18], "textureOffset": [0, 91]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-8, -37, -21],
                "boxes": [
                    {"coordinates": [4, 0, 17, 8, 37, 8], "textureOffset": [96, 0]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [8, -37, -21],
                "boxes": [
                    {"coordinates": [-12, 0, 17, 8, 37, 8], "textureOffset": [96, 0]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-8, -37, 3.5],
                "boxes": [
                    {"coordinates": [4, 0, -7.5, 8, 37, 8], "textureOffset": [64, 0]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [8, -37, 3.5],
                "boxes": [
                    {"coordinates": [-12, 0, -7.5, 8, 37, 8], "textureOffset": [64, 0]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -30, -8],
                "boxes": [
                    {"coordinates": [-5, 21, -10, 10, 10, 18], "textureOffset": [68, 73]}
                ]
            }
        ]
    }`
}
EntityOptions.salmon = {
    name: 'Salmon',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "body_front",
                "id": "body_front",
                "invertAxis": "xy",
                "translate": [0, -6, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 3.5, -4, 3, 5, 8], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [1.5, 4.5, -3],
                        "rotate": [0, 0, -45],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [0, 0, -1, 2, 0, 2], "textureOffset": [2, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [-1.5, 4.5, -3],
                        "rotate": [0, 0, 45],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-2, 0, -1, 2, 0, 2], "textureOffset": [-2, 0]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "body_back",
                "id": "body_back",
                "invertAxis": "xy",
                "translate": [0, -6, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 3.5, 4, 3, 5, 8], "textureOffset": [0, 13]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -6, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 4, -7, 2, 4, 3], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "fin_back_1",
                "id": "fin_back_1",
                "invertAxis": "xy",
                "translate": [0, -10.5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 8.5, 2, 0, 2, 2], "textureOffset": [4, 2]}
                ]
            },
            {
                "part": "fin_back_2",
                "id": "fin_back_2",
                "invertAxis": "xy",
                "translate": [0, -10.5, -3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 8.5, 4, 0, 2, 3], "textureOffset": [2, 3]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -6, -12],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 3.5, 12, 0, 5, 6], "textureOffset": [20, 10]}
                ]
            },
            {
                "part": "fin_left",
                "id": "fin_left",
                "invertAxis": "xy",
                "translate": [1.5, -1, 4],
                "mirrorTexture": "u"
            },
            {
                "part": "fin_right",
                "id": "fin_right",
                "invertAxis": "xy",
                "translate": [-1.5, -1, 4],
                "mirrorTexture": "u"
            }
        ]
    }`
}
EntityOptions.sheep = {
    name: 'Sheep',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 13, -5, 8, 16, 6], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -18, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 16, -14, 6, 6, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.sheep_wool = {
    name: 'Sheep [Wool]',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 13, -5, 8, 16, 6], "textureOffset": [28, 8], "sizeAdd": 1.75}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -18, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 16, -12, 6, 6, 6], "textureOffset": [0, 0], "sizeAdd": 0.6}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 6, 5, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 6, 5, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 6, -7, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 6, -7, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
                ]
            }
        ]
    }`
}
EntityOptions.shulker = {
    name: 'Shulker',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 4, -8, 16, 12, 16], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 0, -8, 16, 8, 16], "textureOffset": [0, 28]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 6, -3, 6, 6, 6], "textureOffset": [0, 52]}
                ]
            }
        ]
    }`
}
EntityOptions.shulker_box = {
    name: 'Shulker Box',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 4, -8, 16, 12, 16], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 0, -8, 16, 8, 16], "textureOffset": [0, 28]}
                ]
            }
        ]
    }`
}
EntityOptions.shulker_bullet = {
    name: 'Shulker Bullet',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "bullet",
                "id": "bullet",
                "invertAxis": "xy",
                "translate": [0, -4, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -1, 8, 8, 2], "textureOffset": [0, 0]},
                    {"coordinates": [-1, 0, -4, 2, 8, 8], "textureOffset": [0, 10]},
                    {"coordinates": [-4, 3, -4, 8, 2, 8], "textureOffset": [20, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.sign = {
    name: 'Sign',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "board",
                "id": "board",
                "invertAxis": "xy",
                "translate": [0, -12, 0],
                "boxes": [
                    {"coordinates": [-12, 14, -1, 24, 12, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "stick",
                "id": "stick",
                "invertAxis": "xy",
                "translate": [0, -12, 0],
                "boxes": [
                    {"coordinates": [-1, 0, -1, 2, 14, 2], "textureOffset": [0, 14]}
                ]
            }
        ]
    }`
}
EntityOptions.silverfish = {
    name: 'Silverfish',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body1",
                "id": "body1",
                "invertAxis": "xy",
                "translate": [0, -2, 3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 0, -4.5, 3, 2, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body2",
                "id": "body2",
                "invertAxis": "xy",
                "translate": [0, -3, 1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 0, -2.5, 4, 3, 2], "textureOffset": [0, 4]}
                ]
            },
            {
                "part": "body3",
                "id": "body3",
                "invertAxis": "xy",
                "translate": [0, -4, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -0.5, 6, 4, 3], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "body4",
                "id": "body4",
                "invertAxis": "xy",
                "translate": [0, -3, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 0, 2.5, 3, 3, 3], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "body5",
                "id": "body5",
                "invertAxis": "xy",
                "translate": [0, -2, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 0, 5.5, 2, 2, 3], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "body6",
                "id": "body6",
                "invertAxis": "xy",
                "translate": [0, -1, -9.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 0, 8.5, 2, 1, 2], "textureOffset": [11, 0]}
                ]
            },
            {
                "part": "body7",
                "id": "body7",
                "invertAxis": "xy",
                "translate": [0, -1, -11.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 0, 10.5, 1, 1, 2], "textureOffset": [13, 4]}
                ]
            },
            {
                "part": "wing1",
                "id": "wing1",
                "invertAxis": "xy",
                "translate": [0, -8, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -0.5, 10, 8, 3], "textureOffset": [20, 0]}
                ]
            },
            {
                "part": "wing2",
                "id": "wing2",
                "invertAxis": "xy",
                "translate": [0, -4, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, 5.5, 6, 4, 3], "textureOffset": [20, 11]}
                ]
            },
            {
                "part": "wing3",
                "id": "wing3",
                "invertAxis": "xy",
                "translate": [0, -5, 1.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -3, 6, 5, 2], "textureOffset": [20, 18]}
                ]
            }
        ]
    }`
}
EntityOptions.skeleton = {
    name: 'Skeleton',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.head_skeleton = {
    name: 'Skeleton Skull',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.skeleton_horse = {
    name: 'Skeleton Horse',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 11, -11, 10, 10, 22], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -22, 8.9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 16, -11, 4, 12, 7], "textureOffset": [0, 35]}
                ]
            },
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, 9.1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, 9.1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "saddle",
                "id": "saddle",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 12, -3.5, 10, 9, 9], "textureOffset": [26, 0], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 13]}
                ]
            },
            {
                "part": "mouth",
                "id": "mouth",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 28, -16, 4, 5, 5], "textureOffset": [0, 25]}
                ]
            },
            {
                "part": "left_bit",
                "id": "left_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "right_bit",
                "id": "right_bit",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 29, -14, 1, 2, 2], "textureOffset": [29, 5]}
                ]
            },
            {
                "part": "left_rein",
                "id": "left_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "right_rein",
                "id": "right_rein",
                "invertAxis": "xy",
                "translate": [0, -20.75, 14],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.1, 24, -20, 0, 3, 16], "textureOffset": [32, 2]}
                ]
            },
            {
                "part": "headpiece",
                "id": "headpiece",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "noseband",
                "id": "noseband",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "boxes": [
                    {"coordinates": [-2, 28, -13, 4, 5, 2], "textureOffset": [19, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "mane",
                "id": "mane",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 17, -4, 2, 16, 2], "textureOffset": [56, 36]}
                ]
            }
        ]
    }`
}
EntityOptions.slime = {
    name: 'Slime',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 1, -3, 6, 6, 6], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_eye",
                "id": "right_eye",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.3, 4, -3.5, 2, 2, 2], "textureOffset": [32, 0]}
                ]
            },
            {
                "part": "left_eye",
                "id": "left_eye",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.3, 4, -3.5, 2, 2, 2], "textureOffset": [32, 4]}
                ]
            },
            {
                "part": "mouth",
                "id": "mouth",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 2, -3.5, 1, 1, 1], "textureOffset": [32, 8]}
                ]
            }
        ]
    }`
}
EntityOptions.snow_golem = {
    name: 'Snow Golem',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 20, -4, 8, 8, 8], "textureOffset": [0, 0], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "left_hand",
                "id": "left_hand",
                "invertAxis": "xy",
                "translate": [-15, -18, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 16, -1, 12, 2, 2], "textureOffset": [32, 0], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "right_hand",
                "id": "right_hand",
                "invertAxis": "xy",
                "translate": [5, -18, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-16, 16, -1, 12, 2, 2], "textureOffset": [32, 0], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 11, -5, 10, 10, 10], "textureOffset": [0, 16], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "body_bottom",
                "id": "body_bottom",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -6, 12, 12, 12], "textureOffset": [0, 36], "sizeAdd": -0.5}
                ]
            }
        ]
    }`
}
EntityOptions.spawner_minecart = {
    name: 'Spawner Minecart',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "front",
                "id": "front",
                "invertAxis": "xy",
                "translate": [0, -1, -9],
                "boxes": [
                    {"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone4",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -180, 0],
                        "boxes": [
                            {"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
                        ]
                    },
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, 90, 0],
                        "submodels": [
                            {
                                "id": "front_sub_2",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -90, 0],
                        "submodels": [
                            {
                                "id": "front_sub_4",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone3",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, 90, 90],
                        "submodels": [
                            {
                                "id": "front_sub_6",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "back",
                "id": "back",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            },
            {
                "part": "bottom",
                "id": "bottom",
                "invertAxis": "xy",
                "translate": [0, -20, 0],
                "rotate": [-180, -180, -180],
                "mirrorTexture": "u"
            },
            {
                "part": "right",
                "id": "right",
                "invertAxis": "xy",
                "translate": [0, -25, 7],
                "mirrorTexture": "u"
            },
            {
                "part": "left",
                "id": "left",
                "invertAxis": "xy",
                "translate": [0, -25, -7],
                "mirrorTexture": "u"
            },
            {
                "part": "dirt",
                "id": "dirt",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            }
        ]
    }`
}
EntityOptions.spider = {
    name: 'Spider',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 5, -11, 8, 8, 8], "textureOffset": [32, 4]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -9, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 6, -3, 6, 6, 6], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -9, -9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 5, 3, 10, 8, 12], "textureOffset": [0, 12]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -9, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -9, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -9, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -9, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg5",
                "id": "leg5",
                "invertAxis": "xy",
                "translate": [-4, -9, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg6",
                "id": "leg6",
                "invertAxis": "xy",
                "translate": [4, -9, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg7",
                "id": "leg7",
                "invertAxis": "xy",
                "translate": [-4, -9, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg8",
                "id": "leg8",
                "invertAxis": "xy",
                "translate": [4, -9, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.squid = {
    name: 'Squid',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, -8, -6, 12, 16, 12], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle1",
                "id": "tentacle1",
                "invertAxis": "xy",
                "translate": [-5, 7, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, -25, -1, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle2",
                "id": "tentacle2",
                "invertAxis": "xy",
                "translate": [-3.5, 7, 3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.5, -25, -4.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle3",
                "id": "tentacle3",
                "invertAxis": "xy",
                "translate": [0, 7, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -25, -6, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle4",
                "id": "tentacle4",
                "invertAxis": "xy",
                "translate": [3.5, 7, 3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4.5, -25, -4.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle5",
                "id": "tentacle5",
                "invertAxis": "xy",
                "translate": [-10, 7, 5],
                "rotate": [0, -90, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, -25, -11, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle6",
                "id": "tentacle6",
                "invertAxis": "xy",
                "translate": [3.5, 7, -3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4.5, -25, 2.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle7",
                "id": "tentacle7",
                "invertAxis": "xy",
                "translate": [0, 7, -1.65],
                "rotate": [0, -180, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -25, -2.7, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle8",
                "id": "tentacle8",
                "invertAxis": "xy",
                "translate": [-3.5, 7, -3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.5, -25, 2.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.stray = {
    name: 'Stray',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.tnt_minecart = {
    name: 'TNT Minecart',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "front",
                "id": "front",
                "invertAxis": "xy",
                "translate": [0, -1, -9],
                "boxes": [
                    {"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone4",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -180, 0],
                        "boxes": [
                            {"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
                        ]
                    },
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, 90, 0],
                        "submodels": [
                            {
                                "id": "front_sub_2",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -90, 0],
                        "submodels": [
                            {
                                "id": "front_sub_4",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone3",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, 90, 90],
                        "submodels": [
                            {
                                "id": "front_sub_6",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "back",
                "id": "back",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            },
            {
                "part": "bottom",
                "id": "bottom",
                "invertAxis": "xy",
                "translate": [0, -20, 0],
                "rotate": [-180, -180, -180],
                "mirrorTexture": "u"
            },
            {
                "part": "right",
                "id": "right",
                "invertAxis": "xy",
                "translate": [0, -25, 7],
                "mirrorTexture": "u"
            },
            {
                "part": "left",
                "id": "left",
                "invertAxis": "xy",
                "translate": [0, -25, -7],
                "mirrorTexture": "u"
            },
            {
                "part": "dirt",
                "id": "dirt",
                "invertAxis": "xy",
                "translate": [0, 0, 0]
            }
        ]
    }`
}
EntityOptions.trapped_chest = {
	name: 'Trapped Chest',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-8, -14, 7],
                "boxes": [
                    {"coordinates": [-7, 9, -7, 14, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-8, -10, 8],
                "boxes": [
                    {"coordinates": [-7, 0, -7, 14, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [-8, -10, 23],
                "boxes": [
                    {"coordinates": [-1, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.trapped_chest_large = {
	name: 'Trapped Chest Large',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid_left",
                "id": "lid_left",
                "invertAxis": "xy",
                "translate": [-8, -14, 7],
                "boxes": [
                    {"coordinates": [-8, 9, -7, 15, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base_left",
                "id": "base_left",
                "invertAxis": "xy",
                "translate": [-8, -10, 8],
                "boxes": [
                    {"coordinates": [-8, 0, -7, 15, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob_left",
                "id": "knob_left",
                "invertAxis": "xy",
                "translate": [-8, -10, 23],
                "boxes": [
                    {"coordinates": [-8, 7, -8, 1, 4, 1], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "lid_right",
                "id": "lid_right",
                "invertAxis": "xy",
                "translate": [8, -14, 7],
                "boxes": [
                    {"coordinates": [-23, 9, -7, 15, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base_right",
                "id": "base_right",
                "invertAxis": "xy",
                "translate": [8, -10, 8],
                "boxes": [
                    {"coordinates": [-23, 0, -7, 15, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob_right",
                "id": "knob_right",
                "invertAxis": "xy",
                "translate": [8, -10, 23],
                "boxes": [
                    {"coordinates": [-9, 7, -8, 1, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.tropical_fish_b = {
    name: 'Tropical Fish [Big]',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -3, -3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 0, 0, 2, 6, 6], "textureOffset": [0, 20]}
                ],
                "submodels": [
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [1, 0, 3],
                        "rotate": [0, -45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [0, 0, 0, 2, 2, 0], "textureOffset": [2, 12]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [-1, 0, 3],
                        "rotate": [0, 45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-2, 0, 0, 2, 2, 0], "textureOffset": [2, 16]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -3, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, 6, 0, 6, 5], "textureOffset": [21, 16]}
                ]
            },
            {
                "part": "fin_right",
                "id": "fin_right",
                "invertAxis": "xy",
                "translate": [0.5, 0, -1],
                "rotate": [0, -35, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "fin_left",
                "id": "fin_left",
                "invertAxis": "xy",
                "translate": [-0.5, 0, -1],
                "rotate": [0, 35, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "fin_top",
                "id": "fin_top",
                "invertAxis": "xy",
                "translate": [0, -6, 0],
                "boxes": [
                    {"coordinates": [0, 6, 0, 0, 5, 6], "textureOffset": [20, 10]}
                ]
            },
            {
                "part": "fin_bottom",
                "id": "fin_bottom",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [0, -5, 0, 0, 5, 6], "textureOffset": [20, 21]}
                ]
            }
        ]
    }`
}
EntityOptions.tropical_fish_a = {
    name: 'Tropical Fish [Small]',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -1.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 0, -3, 2, 3, 6], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [1, 0, 0],
                        "rotate": [0, -45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [0, 0, 0, 2, 2, 0], "textureOffset": [2, 12]}
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [-1, 0, 0],
                        "rotate": [0, 45, 0],
                        "submodels": [
                            {
                                "invertAxis": "xy",
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-2, 0, 0, 2, 2, 0], "textureOffset": [2, 16]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -1.5, -3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, 3, 0, 3, 4], "textureOffset": [24, -4]}
                ]
            },
            {
                "part": "fin_left",
                "id": "fin_left",
                "invertAxis": "xy",
                "translate": [1, -1, -1],
                "rotate": [0, -35, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "fin_right",
                "id": "fin_right",
                "invertAxis": "xy",
                "translate": [-1, -1, -1],
                "rotate": [0, 35, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "fin_top",
                "id": "fin_top",
                "invertAxis": "xy",
                "translate": [0, -3, 3],
                "boxes": [
                    {"coordinates": [0, 3, -3, 0, 4, 6], "textureOffset": [10, -6]}
                ]
            }
        ]
    }`
}
EntityOptions.turtle = {
    name: 'Turtle',
    model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -3, -6],
                "boxes": [
                    {"coordinates": [-9.5, -20, -4, 19, 20, 6], "textureOffset": [7, 37]},
                    {"coordinates": [-5.5, -18, -7, 11, 18, 3], "textureOffset": [31, 1]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -5, 10],
                "boxes": [
                    {"coordinates": [-3, 1, -13, 6, 5, 6], "textureOffset": [3, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3.5, -2, -11],
                "boxes": [
                    {"coordinates": [1.5, 1, 11, 4, 1, 10], "textureOffset": [1, 23]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3.5, -2, -11],
                "boxes": [
                    {"coordinates": [-5.5, 1, 11, 4, 1, 10], "textureOffset": [1, 12]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-5, -3, 4],
                "boxes": [
                    {"coordinates": [5, 2, -6, 13, 1, 5], "textureOffset": [27, 30]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [5, -3, 4],
                "boxes": [
                    {"coordinates": [-18, 2, -6, 13, 1, 5], "textureOffset": [27, 24]}
                ]
            },
            {
                "part": "body2",
                "id": "body2",
                "invertAxis": "xy",
                "translate": [0, -3, -6],
                "boxes": [
                    {"coordinates": [-4.5, -18, -8, 9, 18, 1], "textureOffset": [70, 33]}
                ]
            }
        ]
    }`
}
EntityOptions.vex = {
    name: 'Vex',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u"
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "boxes": [
                    {"coordinates": [-2.9, 3, -2, 6, 10, 4], "textureOffset": [32, 0]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [0, -24, -3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-20, 12, 3, 20, 12, 1], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [0, -24, -1],
                "rotate": [0, -180, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-20, 12, -1, 20, 12, 1], "textureOffset": [0, 32]}
                ]
            }
        ]
    }`
}
EntityOptions.villager = {
    name: 'Villager',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -26, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]}
                ]
            },
            {
                "part": "arms",
                "id": "arms",
                "invertAxis": "xy",
                "translate": [0, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
                    {"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]},
                    {"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "bodywear",
                "id": "bodywear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "headwear2",
                "id": "headwear2",
                "invertAxis": "xy",
                "translate": [0, -28, -13],
                "boxes": [
                    {"coordinates": [-8, 20, 7, 16, 16, 1], "textureOffset": [30, 47]}
                ]
            }
        ]
    }`
}
EntityOptions.vindicator = {
    name: 'Vindicator',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -26, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]},
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "arms",
                "id": "arms",
                "invertAxis": "xy",
                "translate": [0, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
                    {"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]},
                    {"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
                ]
            }
        ]
    }`
}
EntityOptions.witch = {
    name: 'Witch',
    model: `{
        "textureSize": [64, 128],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -26, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]}
                ]
            },
            {
                "part": "arms",
                "id": "arms",
                "invertAxis": "xy",
                "translate": [0, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
                    {"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]},
                    {"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "bodywear",
                "id": "bodywear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [-5, -34, 5],
                "boxes": [
                    {"coordinates": [-5, 32.1, -5, 10, 2, 10], "textureOffset": [0, 64]}
                ],
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [3.5, 34.1, -3.5],
                        "rotate": [3, 0, 2],
                        "boxes": [
                            {"coordinates": [-7, 0, 0, 7, 4, 7], "textureOffset": [0, 76]}
                        ],
                        "submodels": [
                            {
                                "id": "bone2",
                                "invertAxis": "xy",
                                "translate": [-1.5, 4, 1.5],
                                "rotate": [7, 0, 4],
                                "boxes": [
                                    {"coordinates": [-4, 0, 0, 4, 4, 4], "textureOffset": [0, 87]}
                                ],
                                "submodels": [
                                    {
                                        "id": "bone3",
                                        "invertAxis": "xy",
                                        "translate": [-1.5, 4, 1.5],
                                        "rotate": [15, 0, 6],
                                        "boxes": [
                                            {"coordinates": [-1, 0, 0, 1, 2, 1], "textureOffset": [0, 95]}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "headwear2",
                "id": "headwear2",
                "invertAxis": "xy",
                "translate": [0, -28, -14]
            },
            {
                "part": "mole",
                "id": "mole",
                "invertAxis": "xy",
                "translate": [0, -28, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 24, -6.75, 1, 1, 1], "textureOffset": [0, 0], "sizeAdd": -0.25}
                ]
            }
        ]
    }`
}
EntityOptions.wither = {
    name: 'Wither',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body1",
                "id": "body1",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-10, 17.1, -0.5, 20, 3, 3], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "body2",
                "id": "body2",
                "invertAxis": "xy",
                "translate": [-2, -17.1, 0.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 7.1, -0.5, 3, 10, 3], "textureOffset": [0, 22]},
                    {"coordinates": [-5, 13.6, 0, 11, 2, 2], "textureOffset": [24, 22]},
                    {"coordinates": [-5, 11.1, 0, 11, 2, 2], "textureOffset": [24, 22]},
                    {"coordinates": [-5, 8.6, 0, 11, 2, 2], "textureOffset": [24, 22]}
                ]
            },
            {
                "part": "body3",
                "id": "body3",
                "invertAxis": "xy",
                "translate": [-2, -7.1, 0.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 1.1, -0.5, 3, 6, 3], "textureOffset": [12, 22]}
                ]
            },
            {
                "part": "head1",
                "id": "head1",
                "invertAxis": "xy",
                "translate": [-1, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 20, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "head2",
                "id": "head2",
                "invertAxis": "xy",
                "translate": [-9, -20, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-12, 18, -4, 6, 6, 6], "textureOffset": [32, 0]}
                ]
            },
            {
                "part": "head3",
                "id": "head3",
                "invertAxis": "xy",
                "translate": [9, -20, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, 18, -4, 6, 6, 6], "textureOffset": [32, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.wither_skeleton = {
    name: 'Wither Skeleton',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.head_wither_skeleton = {
	name: 'Wither Skeleton Head',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.wither_skull = {
    name: 'Wither Skull',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.wolf = {
    name: 'Wolf',
    model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [-1, -10.5, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 7.5, -9, 6, 6, 4], "textureOffset": [0, 0]},
                    {"coordinates": [-3, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
                    {"coordinates": [1, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
                    {"coordinates": [-1.5, 7.52, -12, 3, 3, 4], "textureOffset": [0, 10]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -10, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 3, -1, 6, 9, 6], "textureOffset": [18, 14]}
                ]
            },
            {
                "part": "mane",
                "id": "mane",
                "invertAxis": "xy",
                "translate": [-1, -10, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -1, 8, 6, 7], "textureOffset": [21, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-2.5, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [0.5, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-2.5, -8, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [0.5, -8, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [-1, -12, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 4, 7, 2, 8, 2], "textureOffset": [9, 18]}
                ]
            }
        ]
    }`
}
EntityOptions.zombie = {
    name: 'Zombie',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.head_zombie = {
	name: 'Zombie Head',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.zombie_horse = {
    name: 'Zombie Horse',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 11, -11, 10, 10, 22], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -22, 8.9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 16, -11, 4, 12, 7], "textureOffset": [0, 35]}
                ]
            },
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 7, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [4, -10, 9.1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-4, -10, 9.1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -11, 4, 11, 4], "textureOffset": [48, 21]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -21, -11],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 7, 11, 3, 14, 4], "textureOffset": [42, 36]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 28, -11, 6, 5, 7], "textureOffset": [0, 13]}
                ]
            },
            {
                "part": "mouth",
                "id": "mouth",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 28, -16, 4, 5, 5], "textureOffset": [0, 25]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [0, -23, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.5, 33, -5.01, 2, 3, 1], "textureOffset": [19, 16]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [0, -23, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 33, -5.01, 2, 3, 1], "textureOffset": [19, 16]}
                ]
            },
            {
                "part": "mane",
                "id": "mane",
                "invertAxis": "xy",
                "translate": [0, -22, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 17, -4, 2, 16, 2], "textureOffset": [56, 36]}
                ]
            }
        ]
    }`
}
EntityOptions.zombie_pigman = {
    name: 'Zombie Pigman',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-1.9, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.zombie_villager = {
    name: 'Zombie Villager',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]},
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [44, 22]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [5, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [44, 22]}
                ]
            }
        ]
    }`
}
EntityOptions.legacy = {
    name: '---- Legacy Models ----'
}
EntityOptions.chest_14 = {
	name: 'Chest [1.14]',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-7, -9, -7],
                "boxes": [
                    {"coordinates": [-7, 9, -7, 14, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-7, -10, 7],
                "boxes": [
                    {"coordinates": [-7, 0, -7, 14, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [0, -9, -7],
                "boxes": [
                    {"coordinates": [-1, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.chest_large_14 = {
	name: 'Chest Large [1.14]',
	model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-7, -9, -7],
                "boxes": [
                    {"coordinates": [-23, 9, -7, 30, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-7, -10, 7],
                "boxes": [
                    {"coordinates": [-23, 0, -7, 30, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [8, -9, -7],
                "boxes": [
                    {"coordinates": [-9, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.dragon_14 = {
	name: 'Dragon [1.14]',
	model: `{
        "textureSize": [256, 256],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -6, 24],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 2, -48, 12, 5, 16], "textureOffset": [176, 44]},
                    {"coordinates": [-8, -2, -34, 16, 16, 16], "textureOffset": [112, 30]},
                    {"coordinates": [-5, 14, -28, 2, 4, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 7, -46, 2, 2, 4], "textureOffset": [112, 0]},
                    {"coordinates": [3, 14, -28, 2, 4, 6], "textureOffset": [0, 0]},
                    {"coordinates": [3, 7, -46, 2, 2, 4], "textureOffset": [112, 0]}
                ]
            },
            {
                "part": "jaw",
                "id": "jaw",
                "invertAxis": "xy",
                "translate": [0, -2, 32],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, -2, -48, 12, 4, 16], "textureOffset": [176, 65]}
                ]
            },
            {
                "part": "spine",
                "id": "spine",
                "invertAxis": "xy",
                "translate": [0, -5, 13],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -18, 10, 10, 10], "textureOffset": [192, 104]},
                    {"coordinates": [-1, 10, -16, 2, 4, 6], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -20, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-12, -4, -8, 24, 24, 64], "textureOffset": [0, 0]},
                    {"coordinates": [-1, 20, -2, 2, 6, 12], "textureOffset": [220, 53]},
                    {"coordinates": [-1, 20, 18, 2, 6, 12], "textureOffset": [220, 53]},
                    {"coordinates": [-1, 20, 38, 2, 6, 12], "textureOffset": [220, 53]}
                ]
            },
            {
                "part": "wing",
                "id": "wing",
                "invertAxis": "xy",
                "translate": [12, -6.3, -2],
                "rotate": [0, 0, -180],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-44, -10.4, -2, 56, 8, 8], "textureOffset": [112, 88]},
                    {"coordinates": [-44, -6.4, 4, 56, 0, 56], "textureOffset": [-56, 88]}
                ]
            },
            {
                "part": "wing_tip",
                "id": "wing_tip",
                "invertAxis": "xy",
                "translate": [68, -6.3, -2],
                "rotate": [0, 0, -180],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [12, -8.4, 0, 56, 4, 4], "textureOffset": [112, 136]},
                    {"coordinates": [12, -6.4, 4, 56, 0, 56], "textureOffset": [-56, 144]}
                ]
            },
            {
                "part": "rear_leg",
                "id": "rear_leg",
                "invertAxis": "xy",
                "translate": [-16, -8, -42],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-24, -20, 34, 16, 32, 16], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "front_leg",
                "id": "front_leg",
                "invertAxis": "xy",
                "translate": [-12, -4, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-16, -16, -2, 8, 24, 8], "textureOffset": [112, 104]}
                ]
            },
            {
                "part": "rear_leg_tip",
                "id": "rear_leg_tip",
                "invertAxis": "xy",
                "translate": [-16, 22, -36],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-22, -52, 36, 12, 32, 12], "textureOffset": [196, 0]}
                ]
            },
            {
                "part": "front_leg_tip",
                "id": "front_leg_tip",
                "invertAxis": "xy",
                "translate": [-12, 17, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-15, -40, -1, 6, 24, 6], "textureOffset": [226, 138]}
                ]
            },
            {
                "part": "rear_foot",
                "id": "rear_foot",
                "invertAxis": "xy",
                "translate": [-16, 52, -44],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-25, -58, 24, 18, 6, 24], "textureOffset": [112, 0]}
                ]
            },
            {
                "part": "front_foot",
                "id": "front_foot",
                "invertAxis": "xy",
                "translate": [-12, 40, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-16, -44, -10, 8, 4, 16], "textureOffset": [144, 104]}
                ]
            }
        ]
    }`
}
EntityOptions.ender_chest_14 = {
	name: 'Ender Chest [1.14]',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-7, -9, -7],
                "boxes": [
                    {"coordinates": [-7, 9, -7, 14, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-7, -10, 7],
                "boxes": [
                    {"coordinates": [-7, 0, -7, 14, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [0, -9, -7],
                "boxes": [
                    {"coordinates": [-1, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.end_crystal_no_base_14 = {
	name: 'End Crystal No Base [1.14]',
	model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "cube",
                "id": "cube",
                "invertAxis": "xy",
                "translate": [0, -19, 0],
                "boxes": [
                    {"coordinates": [-8, 11, -8, 16, 16, 16], "textureOffset": [64, 0]}
                ]
            },
            {
                "part": "glass",
                "id": "glass",
                "invertAxis": "xy",
                "translate": [0, -19, 0],
                "boxes": [
                    {"coordinates": [-8, 11, -8, 16, 16, 16], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.trapped_chest_14 = {
	name: 'Trapped Chest [1.14]',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-7, -9, -7],
                "boxes": [
                    {"coordinates": [-7, 9, -7, 14, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-7, -10, 7],
                "boxes": [
                    {"coordinates": [-7, 0, -7, 14, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [0, -9, -7],
                "boxes": [
                    {"coordinates": [-1, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.trapped_chest_large_14 = {
	name: 'Trapped Chest Large [1.14]',
	model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "lid",
                "id": "lid",
                "invertAxis": "xy",
                "translate": [-7, -9, -7],
                "boxes": [
                    {"coordinates": [-23, 9, -7, 30, 5, 14], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "base",
                "id": "base",
                "invertAxis": "xy",
                "translate": [-7, -10, 7],
                "boxes": [
                    {"coordinates": [-23, 0, -7, 30, 10, 14], "textureOffset": [0, 19]}
                ]
            },
            {
                "part": "knob",
                "id": "knob",
                "invertAxis": "xy",
                "translate": [8, -9, -7],
                "boxes": [
                    {"coordinates": [-9, 7, -8, 2, 4, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.unsupported = {
    name: '---- Broken / Unsupported ----'
}
EntityOptions.arrow = {
	name: 'Arrow',
	model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "arrow",
                "id": "arrow",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-8, 0, 0, 16, 5, 0], "textureOffset": [0, 0]},
                    {"coordinates": [7, 0, -2.5, 0, 5, 5], "textureOffset": [0, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 2.5, 0],
                        "rotate": [-90, 0, 0],
                        "boxes": [
                            {"coordinates": [-8, -2.5, 0, 16, 5, 0], "textureOffset": [0, 0]}
                        ]
                    }
                ]
            }
        ]
    }`
}
EntityOptions.banner_full = {
    name: 'Banner Full',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "top",
                "id": "top",
                "invertAxis": "xy",
                "translate": [0, -12, 0],
                "boxes": [
                    {"coordinates": [-10, 42, -1, 20, 2, 2], "textureOffset": [0, 42]}
                ]
            },
            {
                "part": "slate",
                "id": "slate",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-10, 4, -2, 20, 40, 1], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "stand",
                "id": "stand",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-1, 0, -1, 2, 42, 2], "textureOffset": [44, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.bee = {
	name: 'Bee',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-3, 19, -8, 7, 7, 10], "textureOffset": [0, 0]},
                    {"coordinates": [-1, 24, -11, 0, 2, 3], "textureOffset": [3, 3]},
                    {"coordinates": [2, 24, -11, 0, 2, 3], "textureOffset": [2, 0]},
                    {"coordinates": [0.5, 22, 2, 0, 1, 2], "textureOffset": [3, 1]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [2, -26, 8],
                "boxes": [
                    {"coordinates": [-8, 26, -6, 7, 0, 6], "textureOffset": [9, 24]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-3, -26, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 26, -6, 7, 0, 6], "textureOffset": [9, 24]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-1, 17, -5, 3, 2, 0], "textureOffset": [28, 1]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-2, 17, -3, 5, 2, 0], "textureOffset": [27, 3]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-2, 17, -1, 5, 2, 0], "textureOffset": [27, 5]}
                ]
            }
        ]
    }`
}
EntityOptions.elder_guardian = {
	name: 'Elder Guardian',
	model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 2, -8, 12, 12, 16], "textureOffset": [0, 0]},
                    {"coordinates": [-8, 2, -6, 2, 12, 12], "textureOffset": [0, 28]},
                    {"coordinates": [-6, 14, -6, 12, 2, 12], "textureOffset": [16, 40]},
                    {"coordinates": [-6, 0, -6, 12, 2, 12], "textureOffset": [16, 40]}
                ],
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "rotate": [0, -180, 0],
                        "submodels": [
                            {
                                "id": "body_sub_1",
                                "invertAxis": "xy",
                                "translate": [0, 0, 0],
                                "mirrorTexture": "u",
                                "boxes": [
                                    {"coordinates": [-8, 2, -6, 2, 12, 12], "textureOffset": [0, 28]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "eye",
                "id": "eye",
                "invertAxis": "xy",
                "translate": [0, -23.5, 8.25],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 6.5, -8.25, 2, 2, 1], "textureOffset": [8, 0]}
                ]
            },
            {
                "part": "tail1",
                "id": "tail1",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 6, 7, 4, 4, 8], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "tail2",
                "id": "tail2",
                "invertAxis": "xy",
                "translate": [-1, -24, -15],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 6.5, 15, 3, 3, 7], "textureOffset": [0, 54]}
                ]
            },
            {
                "part": "tail3",
                "id": "tail3",
                "invertAxis": "xy",
                "translate": [0, -24, -22],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 7, 22, 2, 2, 6], "textureOffset": [41, 32]},
                    {"coordinates": [0, 3.5, 28, 1, 9, 9], "textureOffset": [25, 19]}
                ]
            },
            {
                "part": "spine1",
                "id": "spine1",
                "invertAxis": "xy",
                "translate": [0, -18.5, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 14, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine2",
                "id": "spine2",
                "invertAxis": "xy",
                "translate": [0, -18.5, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 14, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine3",
                "id": "spine3",
                "invertAxis": "xy",
                "translate": [7, -18.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 14, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine4",
                "id": "spine4",
                "invertAxis": "xy",
                "translate": [-7, -18.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, 14, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine5",
                "id": "spine5",
                "invertAxis": "xy",
                "translate": [-7, -8, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, 3.5, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine6",
                "id": "spine6",
                "invertAxis": "xy",
                "translate": [7, -8, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 3.5, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine7",
                "id": "spine7",
                "invertAxis": "xy",
                "translate": [7, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 3.5, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine8",
                "id": "spine8",
                "invertAxis": "xy",
                "translate": [-7, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, 3.5, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine9",
                "id": "spine9",
                "invertAxis": "xy",
                "translate": [0, 2.5, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -7, 6, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine10",
                "id": "spine10",
                "invertAxis": "xy",
                "translate": [0, 2.5, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -7, -8, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine11",
                "id": "spine11",
                "invertAxis": "xy",
                "translate": [7, 2.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "spine12",
                "id": "spine12",
                "invertAxis": "xy",
                "translate": [-7, 2.5, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [6, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.elytra = {
	name: 'Elytra',
	model: `{
        "textureSize": [64, 32],
        "models": [
            {
                "part": "elytra",
                "id": "elytra",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "submodels": [
                    {
                        "invertAxis": "xy",
                        "mirrorTexture": "u",
                        "boxes": [
                            {"coordinates": [1, 0, 0, 10, 20, 2], "textureOffset": [22, 0]}
                        ]
                    }
                ],
                "boxes": [
                    {"coordinates": [-11, 0, 0, 10, 20, 2], "textureOffset": [22, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.hoglin = {
    name: 'Hoglin',
    model: `{
        "textureSize": [128, 128],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [-1, -24, 8.5],
                "rotate": [-45, 0, 0],
                "boxes": [
                    {"coordinates": [-7, 19, -28.5, 14, 6, 19], "textureOffset": [1, 42]},
                    {"coordinates": [-8, 20.25, -22.5, 2, 11, 2], "textureOffset": [6, 45]},
                    {"coordinates": [6, 20.25, -22.5, 2, 11, 2], "textureOffset": [6, 45]}
                ],
                "submodels": [
                    {
                        "id": "bone3",
                        "invertAxis": "xy",
                        "translate": [7, 25.25, -13.5],
                        "rotate": [0, 0, -30],
                        "boxes": [
                            {"coordinates": [0.125, -1.71651, -1, 6, 1, 4], "textureOffset": [4, 16]}
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [-7, 25.25, -13.5],
                        "rotate": [0, 0, 30],
                        "boxes": [
                            {"coordinates": [-6.125, -1.71651, -1, 6, 1, 4], "textureOffset": [4, 21]}
                        ]
                    }
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -18, -17],
                "boxes": [
                    {"coordinates": [-8, 10, -8.5, 16, 14, 26], "textureOffset": [1, 1]}
                ]
            },
            {
                "part": "hair",
                "id": "hair",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [0, 22, -11.5, 0, 10, 19], "textureOffset": [5, 66]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -11, 5.5],
                "boxes": [
                    {"coordinates": [-7, 0, -7.5, 6, 14, 6], "textureOffset": [71, 75]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [4, -11, 5.5],
                "boxes": [
                    {"coordinates": [1, 0, -7.5, 6, 14, 6], "textureOffset": [46, 75]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [-4.5, -5.5, -12],
                "boxes": [
                    {"coordinates": [-7, 0, 11.5, 5, 11, 5], "textureOffset": [72, 43]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4.5, -11, -13],
                "boxes": [
                    {"coordinates": [2, 0, 11.5, 5, 11, 5], "textureOffset": [51, 43]}
                ]
            }
        ]
    }`
}
EntityOptions.piglin = {
    name: 'Piglin',
    model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-5, 24, -4, 10, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 24, -5, 4, 4, 1], "textureOffset": [31, 1]},
                    {"coordinates": [-3, 24, -5, 1, 2, 1], "textureOffset": [2, 4]},
                    {"coordinates": [2, 24, -5, 1, 2, 1], "textureOffset": [2, 0]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [-4.5, -30, 0],
                "rotate": [0, 0, -25],
                "boxes": [
                    {"coordinates": [-5.5, 25, -2, 1, 5, 4], "textureOffset": [57, 38]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [4.5, -30, 0],
                "rotate": [0, 0, 25],
                "boxes": [
                    {"coordinates": [4.5, 25, -2, 1, 5, 4], "textureOffset": [57, 22]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [-4, -22, 0],
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [4, -22, 0],
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.player = {
    name: 'Player',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]},
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 32], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-4, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [32, 48]},
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [48, 48], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [4, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]},
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 32], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg2",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [16, 48]},
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 48], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg2",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]},
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 32], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.player_thin = {
    name: 'Player [Thin]',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]},
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 32], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [-4, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-7, 12, -2, 3, 12, 4], "textureOffset": [32, 48]},
                    {"coordinates": [-7, 12, -2, 3, 12, 4], "textureOffset": [48, 48], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [4, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 12, -2, 3, 12, 4], "textureOffset": [40, 16]},
                    {"coordinates": [4, 12, -2, 3, 12, 4], "textureOffset": [40, 32], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [16, 48]},
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 48], "sizeAdd": 0.25}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]},
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 32], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.shield = {
    name: 'Shield',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "shield",
                "id": "shield",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-1, 8, 1, 2, 6, 6], "textureOffset": [26, 0]},
                    {"coordinates": [-6, 0, 0, 12, 22, 1], "textureOffset": [0, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.strider = {
    name: 'Strider',
    model: `{
        "textureSize": [64, 128],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -22, 0],
                "boxes": [
                    {"coordinates": [-8, 15, -8, 16, 14, 16], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [4, -15, 0],
                "boxes": [
                    {"coordinates": [2, 0, -2, 4, 17, 4], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-4, -15, 0],
                "boxes": [
                    {"coordinates": [-6, 0, -2, 4, 17, 4], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "hair_left_top",
                "id": "hair_left_top",
                "invertAxis": "xy",
                "translate": [8, -28, 0],
                "rotate": [0, 0, 120],
                "boxes": [
                    {"coordinates": [-4, 28, -8, 12, 0, 16], "textureOffset": [16, 33]}
                ]
            },
            {
                "part": "hair_left_middle",
                "id": "hair_left_middle",
                "invertAxis": "xy",
                "translate": [8, -24, 0],
                "rotate": [0, 0, 120],
                "boxes": [
                    {"coordinates": [-4, 24, -8, 12, 0, 16], "textureOffset": [16, 49]}
                ]
            },
            {
                "part": "hair_left_bottom",
                "id": "hair_left_bottom",
                "invertAxis": "xy",
                "translate": [8, -19, 0],
                "rotate": [0, 0, 120],
                "boxes": [
                    {"coordinates": [-4, 19, -8, 12, 0, 16], "textureOffset": [16, 65]}
                ]
            },
            {
                "part": "hair_right_top",
                "id": "hair_right_top",
                "invertAxis": "xy",
                "translate": [-8, -29, 0],
                "rotate": [0, 0, 60],
                "boxes": [
                    {"coordinates": [-20, 29, -8, 12, 0, 16], "textureOffset": [16, 33]}
                ]
            },
            {
                "part": "hair_right_middle",
                "id": "hair_right_middle",
                "invertAxis": "xy",
                "translate": [-8, -25, 0],
                "rotate": [0, 0, 60],
                "boxes": [
                    {"coordinates": [-20, 25, -8, 12, 0, 16], "textureOffset": [16, 49]}
                ]
            },
            {
                "part": "hair_right_bottom",
                "id": "hair_right_bottom",
                "invertAxis": "xy",
                "translate": [-8, -20, 0],
                "rotate": [0, 0, 60],
                "boxes": [
                    {"coordinates": [-20, 20, -8, 12, 0, 16], "textureOffset": [16, 65]}
                ]
            }
        ]
    }`
}
EntityOptions.trader_llama = {
    name: 'Trader Llama',
    model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -17, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 27, -16, 4, 4, 9], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 15, -12, 8, 18, 6], "textureOffset": [0, 14]},
                    {"coordinates": [-4, 33, -10, 3, 3, 2], "textureOffset": [17, 0]},
                    {"coordinates": [1, 33, -10, 3, 3, 2], "textureOffset": [17, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [29, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3.5, -14, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3.5, -14, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3.5, -14, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3.5, -14, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            }
        ]
    }`
}
EntityOptions.trident = {
    name: 'Trident',
    model: `{
        "textureSize": [32, 32],
        "models": [
            {
                "part": "trident",
                "id": "trident",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [-1.5, 25, -0.5, 3, 2, 1], "textureOffset": [4, 0]},
                    {"coordinates": [-0.5, 0, -0.5, 1, 31, 1], "textureOffset": [0, 0]},
                    {"coordinates": [1.5, 26, -0.5, 1, 4, 1], "textureOffset": [4, 3]},
                    {"coordinates": [-2.5, 26, -0.5, 1, 4, 1], "textureOffset": [4, 3]}
                ]
            }
        ]
    }`
}
EntityOptions.wandering_trader = {
    name: 'Wandering Trader',
    model: `{
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -26, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]}
                ]
            },
            {
                "part": "arms",
                "id": "arms",
                "invertAxis": "xy",
                "translate": [0, -22, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
                    {"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]},
                    {"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
                ]
            },
            {
                "part": "bodywear",
                "id": "bodywear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 6, -3, 8, 18, 6], "textureOffset": [0, 38], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "headwear",
                "id": "headwear",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
                ]
            }
        ]
    }`
}
EntityOptions.zoglin = {
    name: 'Zoglin',
    model: `{
        "textureSize": [128, 128],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [-1, -24, 8.5],
                "rotate": [-45, 0, 0],
                "boxes": [
                    {"coordinates": [-7, 19, -28.5, 14, 6, 19], "textureOffset": [1, 42]},
                    {"coordinates": [-8, 20.25, -22.5, 2, 11, 2], "textureOffset": [6, 45]},
                    {"coordinates": [6, 20.25, -22.5, 2, 11, 2], "textureOffset": [6, 45]}
                ],
                "submodels": [
                    {
                        "id": "bone3",
                        "invertAxis": "xy",
                        "translate": [7, 25.25, -13.5],
                        "rotate": [0, 0, -30],
                        "boxes": [
                            {"coordinates": [0.125, -1.71651, -1, 6, 1, 4], "textureOffset": [4, 16]}
                        ]
                    },
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [-7, 25.25, -13.5],
                        "rotate": [0, 0, 30],
                        "boxes": [
                            {"coordinates": [-6.125, -1.71651, -1, 6, 1, 4], "textureOffset": [4, 21]}
                        ]
                    }
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -18, -17],
                "boxes": [
                    {"coordinates": [-8, 10, -8.5, 16, 14, 26], "textureOffset": [1, 1]}
                ]
            },
            {
                "part": "hair",
                "id": "hair",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "boxes": [
                    {"coordinates": [0, 22, -11.5, 0, 10, 19], "textureOffset": [5, 66]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -11, 5.5],
                "boxes": [
                    {"coordinates": [-7, 0, -7.5, 6, 14, 6], "textureOffset": [71, 75]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [4, -11, 5.5],
                "boxes": [
                    {"coordinates": [1, 0, -7.5, 6, 14, 6], "textureOffset": [46, 75]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [-4.5, -5.5, -12],
                "boxes": [
                    {"coordinates": [-7, 0, 11.5, 5, 11, 5], "textureOffset": [72, 43]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4.5, -11, -13],
                "boxes": [
                    {"coordinates": [2, 0, 11.5, 5, 11, 5], "textureOffset": [51, 43]}
                ]
            }
        ]
    }`
}
EntityOptions.zombified_piglin = {
    name: 'Zombified Piglin',
    model: `{
        "textureSize": [128, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-5, 24, -4, 10, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 24, -5, 4, 4, 1], "textureOffset": [31, 1]},
                    {"coordinates": [-3, 24, -5, 1, 2, 1], "textureOffset": [2, 4]},
                    {"coordinates": [2, 24, -5, 1, 2, 1], "textureOffset": [2, 0]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [-4.5, -30, 0],
                "rotate": [0, 0, -25],
                "boxes": [
                    {"coordinates": [-5.5, 25, -2, 1, 5, 4], "textureOffset": [57, 38]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [4.5, -30, 0],
                "rotate": [0, 0, 25],
                "boxes": [
                    {"coordinates": [4.5, 25, -2, 1, 5, 4], "textureOffset": [57, 22]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "boxes": [
                    {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [-4, -22, 0],
                "boxes": [
                    {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [4, -22, 0],
                "boxes": [
                    {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [-2, -12, 0],
                "boxes": [
                    {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [2, -12, 0],
                "boxes": [
                    {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
})()
