(function() {

const EntityOptions = {};
let GeneratorAction;

Plugin.register('cem_template_loader', {
	title: 'CEM Template Loader',
	icon: 'keyboard_capslock',
	author: 'Ewan Howell',
	description: 'Load template entity models for use with OptiFine CEM.',
	version: '0.0.4',
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
						if (entity.texture_data) {
							new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add();
						}
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
			"part": "stand",
			"id": "stand",
			"invertAxis": "xy",
			"translate": [0, 0, 0],
			"boxes": [
				{"coordinates": [-1, 0, -1, 2, 42, 2], "textureOffset": [44, 0]}
			]
		},
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
EntityOptions.chest_large = {
	name: 'Chest Large',
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
				{"coordinates": [-1, 0, 0, 2, 4, 7], "textureOffset": [0, 0]},
				{"coordinates": [0, -1, 2, 0, 1, 2], "textureOffset": [24, -2]}
			],
			"submodels": [
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
	name: 'Dragon',
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
EntityOptions.ender_chest = {
	name: 'Ender Chest',
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
EntityOptions.enderman = {
	name: 'Enderman',
	model: `{
	"textureSize": [64, 32],
	"models": [
		{
			"part": "body",
			"id": "body",
			"invertAxis": "xy",
			"translate": [0, -42, 0],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-4, 30, -2, 8, 12, 4], "textureOffset": [32, 16]}
			]
		},
		{
			"part": "head",
			"id": "head",
			"invertAxis": "xy",
			"translate": [0, -42, 0],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-4, 42, -4, 8, 8, 8], "textureOffset": [0, 0]}
			]
		},
		{
			"part": "headwear",
			"id": "headwear",
			"invertAxis": "xy",
			"translate": [0, -42, 0],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-4, 42, -4, 8, 8, 8], "textureOffset": [0, 16], "sizeAdd": -0.5}
			]
		},
		{
			"part": "right_arm",
			"id": "right_arm",
			"invertAxis": "xy",
			"translate": [-5, -40, 0],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [4, 12, -1, 2, 30, 2], "textureOffset": [56, 0]}
			]
		},
		{
			"part": "left_arm",
			"id": "left_arm",
			"invertAxis": "xy",
			"translate": [5, -40, 0],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-6, 12, -1, 2, 30, 2], "textureOffset": [56, 0]}
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
			"submodels": [
				{
					"invertAxis": "xy",
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-1.5, 2, -1.5, 1, 1, 1], "textureOffset": [28, 6]}
					]
				}
			]
		},
		{
			"part": "eye_left",
			"id": "eye_left",
			"invertAxis": "xy",
			"translate": [0, -3, 0],
			"submodels": [
				{
					"invertAxis": "xy",
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [0.5, 2, -1.5, 1, 1, 1], "textureOffset": [24, 6]}
					]
				}
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
			"translate": [0, -28, -14],
			"boxes": [
				{"coordinates": [-8, 21, 8, 16, 16, 0], "textureOffset": [32, 48]}
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
				{"coordinates": [-4, 7.5, -9, 6, 6, 4], "textureOffset": [0, 0]},
				{"coordinates": [-4, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
				{"coordinates": [0, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
				{"coordinates": [-2.5, 7.52, -12, 3, 3, 4], "textureOffset": [0, 10]}
			]
		},
		{
			"part": "body",
			"id": "body",
			"invertAxis": "xy",
			"translate": [0, -10, -2],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-4, 3, -1, 6, 9, 6], "textureOffset": [18, 14]}
			]
		},
		{
			"part": "mane",
			"id": "mane",
			"invertAxis": "xy",
			"translate": [-1, -10, -2],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-5, 7, -1, 8, 6, 7], "textureOffset": [21, 0]}
			]
		},
		{
			"part": "leg1",
			"id": "leg1",
			"invertAxis": "xy",
			"translate": [-2.5, -8, -7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-3.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "leg2",
			"id": "leg2",
			"invertAxis": "xy",
			"translate": [0.5, -8, -7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-0.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "leg3",
			"id": "leg3",
			"invertAxis": "xy",
			"translate": [-2.5, -8, 4],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-3.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "leg4",
			"id": "leg4",
			"invertAxis": "xy",
			"translate": [0.5, -8, 4],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-0.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "tail",
			"id": "tail",
			"invertAxis": "xy",
			"translate": [-1, -12, -8],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-2, 4, 7, 2, 8, 2], "textureOffset": [9, 18]}
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
EntityOptions.unsupported = {
		name: '---- Broken / Unsupported ----'
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
EntityOptions.end_crystal_no_base = {
	name: 'End Crystal No Base',
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
			"translate": [-6, -22, 0],
			"boxes": [
				{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
			]
		},
		{
			"part": "right_arm",
			"id": "right_arm",
			"invertAxis": "xy",
			"translate": [6, -22, 0],
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
EntityOptions.head_wither_skeleton = {
		name: 'Wither Skeleton Skull',
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
EntityOptions.minecraft_earth_mobs = {
		name: '---- Minecraft Earth Mobs ----'
}
EntityOptions.bone_spider = {
	name: 'Bone Spider',
	texture_name: 'bone_spider.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAxLTEwVDE5OjMwOjQ5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDEtMTBUMTk6NDY6NDVaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAxLTEwVDE5OjQ2OjQ1WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4M2I3ZWJhZi0wYzRkLTY1NGEtYTc5Yy1mMDMw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',
	model: `{
	"texture": "bone_spider.png",
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
EntityOptions.cluckshroom = {
	name: 'Cluckshroom',
	texture_name: 'cluckshroom.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAScGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTA4VDEzOjQ1OjMxLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMS0wN1QxNToyODoyMloiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMTEtMDdUMTU6Mjg6MjJaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmVhYjhlMTRhLTBhMTYtNzM0OS1hNThhLWI1YThiMzMwYTNhOSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmEzYzQzMDYwLTU3NWYtZTg0ZS1iY2FiLWU4NTMxZThiNGI3NiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJlNDcxMzkwLTk4ZjgtMzE0Ni1hOGZlLWUwZTE0MzAxOGE0MCIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpYUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSI5NjAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjY0IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMzIiPiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NDg5OWE2ZDYtYjNkYi1iNTQ3LTkzZWEtYTA4OTIxMmMzNmNkPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjZmOTg4Mzk3LTg3MGMtZjQ0MS1hZDI2LThmNGNhYmY4ZjYzZTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4OGMxM2IzNy00ZmFkLTY3NDYtYmQ5NS1mOTJmYjcyMmFjMDg8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6OGI5NjgzMTctZTczMC01MzQ2LTgwM2MtMmNmZjdmMDFhMmNjPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjkwMjAzZTI4LTYyNmQtN2U0ZS1hNWQ2LWU2NGQxMDBhMzI1ZjwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjNzBiODc1ZC1hM2MzLWQ3NDktYTlhZi00ODdjNDZkMmRlN2M8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTQ3MTM5MC05OGY4LTMxNDYtYThmZS1lMGUxNDMwMThhNDAiIHN0RXZ0OndoZW49IjIwMTktMDItMDhUMTM6NDU6MzEtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzIyZDc0YTYtNThiNi00NTQ0LWEyNGItMWZhY2MxOWYwYjAyIiBzdEV2dDp3aGVuPSIyMDE5LTAyLTA4VDE1OjI1OjI3LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYwYzRhYzljLWUwNjItNzA0MS1hOWMwLTk4OGI3MDAzODNjZSIgc3RFdnQ6d2hlbj0iMjAxOS0wMy0yNVQxODoxMzoxNi0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NWZjOWE4YS0xYWQ0LTQ0NGUtODM3Yi1mNWE0NmYzNjRmZTciIHN0RXZ0OndoZW49IjIwMTktMDMtMjVUMTg6MTM6MTYtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjQ5OGNjN2MtNzYzZi03ZjQ1LTk5YjEtN2E1ZjQwNGVjMDA5IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTA4VDExOjMxOjU1LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZiZjRjMmE1LWMxMDgtZmU0MS04MTRkLTI4NDgyODA3Zjk4NyIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0wOFQxMTozMTo1NS0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNDg2MDVlNi01NTdjLTlkNDAtYTIxNS1jMThiYzY3OTY2NmMiIHN0RXZ0OndoZW49IjIwMTktMDQtMDlUMjA6NDI6NTMtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTZlYzdhN2MtMjBjMy0yODRkLTk5NWQtOWNhNWFjODhiNGM1IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTA5VDIwOjQyOjUzLTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhYjhlMTRhLTBhMTYtNzM0OS1hNThhLWI1YThiMzMwYTNhOSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wN1QxNToyODoyMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjQ4NjA1ZTYtNTU3Yy05ZDQwLWEyMTUtYzE4YmM2Nzk2NjZjIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmVjYjdjOWUtNDQ1Ni04MzRjLWFmODMtNzVhMjdmMDNhMTJhIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MmU0NzEzOTAtOThmOC0zMTQ2LWE4ZmUtZTBlMTQzMDE4YTQwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jJEvIQAABRlJREFUaIHtmN9vk1Ucxj+nfbsO2q1dWwJkMY2Oi8UZ4zaIiZDgYGMzEsMF3BiSXXGlidFr/gYTE70geiHJ9Ga9aJREfgY08UJFQGA4I0vTsEXG2q7t3grd2/Z48b7vaTvbsnVjReFJmvY939Pznuc55/vjHCGlxMaV0HYZLyzTAGI8vVjVMHNynwxsy5NacAOQjc1V2fu/iolGAwIsfrJHAqLrg18e13XD4VjZENbaCDpd6jklzA/ASvIAp2I+Rf5UzLfmCVjkAWTDjk8IonIH3A73SIBETgfgh+QCHX4fS+kMHX4fgPhw0RRh5uS+hhNe7U649u6L8sXXQ8R+SjDw9eN3y0ZDfOnzy6DThVeY706USgCEHObmqOcSr77tX9OLVuMKYAqymUJoleSPiRKTFvFjosSkdBDW2ogXlpVbdF88x9zwqCJ05syZqp1w+PDhdU2+ezCwnr+vGVUxYFI6av624RWCzMiYEuz/AC1ZNKAi6K1EsmgAcC2VYCAQUu13796VAL29vbjdbvL5fFX7rl27mlJpq9vZzN+ahgYmyaDTRbJosPeqmYp+3L1HdYpnMoR9Pq6lEjzcupVeV1kwt9utvm0R/kvQZjVL8YLBtGGw1zLEM5mqDJACBgIh/iwZTC8bjK9xhU/7u1zj6UUD4Pr16/K148cBEFNTVeN0vP/zpvpXVRqshJ0SK5HI6YQ8XpUmQx5vpU3s3x6SADcmJujv769JRPb1ySn9EQBGNMLVt97hxP17LQsq/450DRDyeJleyuK7cBYo1wsA+7eH5I2JCab0R7iOHOXzHS/UVPaLZBYjGgHAdeRo0xPfKGiNjJUrXrnaMwcP0W5lAl80wuLImFpNG7u/+6bmmCfu3xO3wz18JIoSEB+72zaARvOouwMSOR1dSoxoBF1KEjmd79NJZe++eA6AueFR/paSueFRceL+PTHZ7mSy3SlcR47W3davxGcIdHZuJI+mUTcGfObzy7Bmro5XCHwXznJz6IDKCHZhlCyawXNki0ccSMyv+sWf+vzSUki8l0mvi8R6UNcFktksSSDY2Ukym4WBQbCedSnRrRJ5tlAAoBb50/4uO18atQ5STwO02+Eemcjp6gyQKxXIScnLXUF1HiC4DTDPCX84JH7DJN3nctPnclOinDVuZZLs1NyEPF4GfQF+zaRqukLHU1JNqhhgB7V4JoPEFMIWBUzy81ZVmMxmCWtt6Jb72IPcypRjxIOKDFELHoeGx9EwBm8KHHYqq1XfzxcNEqVSFXl79bsvniNeWFYi2OPs1MzKcL6Q50FOZ9AXqHmPEHQ4CDrWlIWfCBy6lGaUr1jttEtDlxKvEMwXDUXetgFMDw0R1tqUcH8V8qQkqkZYLVodGzSvEOhS0nPpPDMHDwHmKqddGt5CEdsOZfIAKQkdKwZ748pl5oZH1fMdI8/v6bwk3IMRjVQVPgLzCmhlxRnTl+gQgjcT85sSJNQevDl0QDVWEg06XcwWClVtNiovS1LSrAnstt7Ll9lh3TUY0QjpkTHAJAgoURdyOkY0wkKFK+p1UvOTgBIg6HTRc+m8MugPHzGrOflNlPBuaVdtdgwICDMLAEwZ5ilwqVgWZHpoSF3ypUfG0KUkpi+RKhpKhESphN+qLwBVIm8mxLeBbdL24zsWEUk5v6+Ed0s7L1k2O+DZ/l/Vz1rJZi9PxtOLm+ICdSvBZwWtz0MtxnMBWj2BVuO5AK2eQKvxXIBWT6DVeOYF+AfdF0iuMNIpzgAAAABJRU5ErkJggg==',
	model: `{
	"texture": "cluckshroom.png",
	"textureSize": [64, 32],
	"models": [
		{
			"part": "head",
			"id": "head",
			"invertAxis": "xy",
			"translate": [0, -9, 4],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]},
				{"coordinates": [-3.5, 15, -4.5, 5, 4, 0], "textureOffset": [18, 9]},
				{"coordinates": [-1, 15, -7, 0, 4, 5], "textureOffset": [18, 4]}
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
			],
			"submodels": [
				{
					"id": "body_sub_2",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"mirrorTexture": "u",
					"rotate": [90, 0, 0],
					"boxes": [
						{"coordinates": [1, 3, -9, 0, 5, 5], "textureOffset": [28, 3]},
						{"coordinates": [-1.5, 3, -6.5, 5, 5, 0], "textureOffset": [28, 8]}
					]
				}
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
EntityOptions.ender_cat = {
	name: 'Ender Cat',
	texture_name: 'ender_cat.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAAAh5JREFUaEPtlTFOw0AQRXMMjsEl0lBxANKBRIVEwQ1oKWgQFJSI81EjZDTW/9bP92ziOFkSnHzpKdnd+bMz4xhmmZ5uPxtnPr/srRE+SOqlX0FYUe7Ddh1poXqxrxE+SOqlX0FYUe7Ddh1poSU2LSLzKwjryX0Ownar7KIMhA+SexeLmyUQ1pP7HITtVtlFGQgfJPU9P3wczgCypOuIBoLsDGl74jm9Bz2Apvlp5mcX7ff4jLXH8N31/b8GbYxXNFF6mhkR//KYD2AfA0Eb48VGhg4hYuMnS5+f6XpXxMCz/QBtjBcbGTsAJ/Nsy9XVdTuE+OR37qON7cXLsOxU2i+J8UEUytdF/+BxgDxXj8OmS+Da7cULsexU2i+J8fGL4q8iCvUBxB7PV/36GFMC147XkKegMbAVFTFaYDQXXh9A7OmQAr2TIO3+xcJZLLZ7YuHaWKDNax6iTStIu3954djuiYXzyWdPP4hXgOerXgGkrStvStdZ8UprEHkD2fsfxH7g8Q7S1hObLZEVryBNJz7VoX7G0ffvB+DeaMo9hGfqcZC2nrJLlbfX97ZIfvI710jTSb2MX4d6HKStp+xShc2WQJpO7s8aVjzeQdp6yi7dBKTp5OdZ04rHO0hbT9mlCsIGS71ZwxnqcZC2nrJLFYRNV1nTCsKmL///S3A8fWXNBzierrTZu/P7peYVhE9P319NU+IoBnDSSScdsWazX7HGIggFAfNpAAAAAElFTkSuQmCC',
	model: `{
	"texture": "ender_cat.png",
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
EntityOptions.glow_squid = {
	name: 'Glow Squid',
	texture_name: 'glow_squid.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAAOiSURBVGhD5ZetbhVRFIVrSVA8AgoFCRKHq8M0fQIECHgBBDUYAppUViAqME1wCIIAU0FwCEKCxjRBkgz5JlmTNevuOXOn3FtzxZeZ2Wed/bPm3Gm613XdIq4dHnbOjSdPB3LtMmS9dXnbnXdOrk9RBluoUR+8wofy+INPpyNuPj8a7cl663KlBvhADOD4mhuwf3bcHfw47n7//bNyZU36rDeHaiR33hz3pD4pgy1ITrM+tIrBvfdngxFqhmcGfXHxYYDhBc+bNoB8WzeAAndPTnoYHIjJgOsHB30zHHUNyvX+t5fd7S/P+qsMQYM2682hgRPqQ+qTMthCyRlSwyesgRugIw8ML3hm7X8MoB+uQs9bNYC3XQ0POgVuQL59N2AbJ0CkPimDLRgepk4Aw1cG6AT48JihE4B+nYYTHzbZygloGTD1DeBZb/rRxbvhzSsG6NFmvTm0b4rUJ2WwBUlbJhCTAWqCe06B3jYD+3UTfwaznu5Tn5TBFirgaGgfHrwhYFDWMUOkPuvNob3azynU/Tr5ymALJfbCjtYvS9abo+oBMGKdfOVHJJOto0nm9vhpqbTgejGn00dYzzlwMnqjNKQE/jGDLMiaPnpJa09qp0xQjjl96uhJPwOec+BkMIDEoI+ZEt569bqPVwX945f7pKuadP1R93HQOcSojR7NVG7FgMH5R8hfTA6cDB81hmSDN6eiacCUVugNqMnWHq0pv/QgPffSqx9iaB//+joamGfgnngOnIwM4B635TiQxBv0xqbIJrWn2pda6Ym5nj4qvQYW+neY+40YkAW57u3v92hd2taeHAj05jjq0kpf9QKZ2wdOAyAHTlYM0LMX9Aa5/9z97PHGHBmkPcqfBsCmDJgiB06a3wA1oQaBt0asZYAMYl8rvyCnBpLe71175QZojSvQ7MPv5z2uBe1neExCW+XHGN/nA6lO1Q/P4PocaCkrBtB0FlVBkY0lMmjKAKEjLg1X12cvsHUD5gpyJZZv0dG671F+rzFngGuJoyWmfiAHWsqKASqqAXlWMTXojTn67XMvAwT5vYbyKmfeZz+K8ywDiOVASxkZkA1mMW/C19MAjq7v4+o1eJOep6ohrdcCcisf2hxoKb0BWdTxYtIBb1hNyQD99n2v71Fcuar8lZ5aUOlzoKUMBnjhikrnzTlVo75HKOY6x9cTaXKgpYwMAE+exRytTek9Xq1XzxVz+hxoKWVwlyiDu0QZ3CXK4O7Q7f0DB0AbQ++abPMAAAAASUVORK5CYII=',
	model: `{
	"texture": "glow_squid.png",
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
EntityOptions.horned_sheep = {
		name: 'Horned Sheep',
		texture_name: 'horned_sheep.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTAxVDIyOjIyOjA1WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjI6MzQ6MzVaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIyOjM0OjM1WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphN2Q5NzUxZS00YmQ3LTczNDItOWVmNS1iZGZl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',
		model: `{
	"texture": "horned_sheep.png",
	"textureSize": [64, 32],
	"models": [
		{
			"part": "body",
			"id": "body",
			"invertAxis": "xy",
			"translate": [0, -19, -2],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-4, 13, -5, 8, 16, 6], "textureOffset": [22, 10]}
			]
		},
		{
			"part": "head",
			"id": "head",
			"invertAxis": "xy",
			"translate": [0, -18, 8],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-3, 16, -14, 6, 6, 8], "textureOffset": [0, 0]},
				{"coordinates": [-7, 16, -15.5, 4, 3, 3], "textureOffset": [20, 0]},
				{"coordinates": [3, 16, -15.5, 4, 3, 3], "textureOffset": [20, 0]}
			],
			"submodels": [
				{
					"id": "bone",
					"invertAxis": "xy",
					"translate": [0, 18, -8],
					"rotate": [0, 0, -90],
					"boxes": [
						{"coordinates": [-5, -7, -4.5, 7, 4, 6], "textureOffset": [28, 0]},
						{"coordinates": [-5, 3, -4.5, 7, 4, 6], "textureOffset": [28, 0]}
					]
				}
			]
		},
		{
			"part": "leg2",
			"id": "leg2",
			"invertAxis": "xy",
			"translate": [-3, -12, -7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [1, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
			]
		},
		{
			"part": "leg1",
			"id": "leg1",
			"invertAxis": "xy",
			"translate": [3, -12, -7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-5, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
			]
		},
		{
			"part": "leg4",
			"id": "leg4",
			"invertAxis": "xy",
			"translate": [-3, -12, 5],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [1, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
			]
		},
		{
			"part": "leg3",
			"id": "leg3",
			"invertAxis": "xy",
			"translate": [3, -12, 5],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-5, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
			]
		}
	]
}`
}
EntityOptions.jolly_llama = {
		name: 'Jolly Llama',
		texture_name: 'jolly_llama.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAHPGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA3VDE4OjEzOjM0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjI6Mzk6MzFaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIyOjM5OjMxWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMTJjZTAwMi03OTMyLWFkNDYtYmFiZS1hMDYyODMwZjdhNzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MmRiN2FkNzQtZmUzOS04ODRhLWFlYzAtZjJkMWRiZmVkYTdhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MmRiN2FkNzQtZmUzOS04ODRhLWFlYzAtZjJkMWRiZmVkYTdhIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjJkOGE4ZmM5LTY5ODktNTY0MC1iZTcyLWZjNTdjNTA1N2M0ODwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJkYjdhZDc0LWZlMzktODg0YS1hZWMwLWYyZDFkYmZlZGE3YSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wN1QxODoxMzozNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODgwYjk2YmItYTk4OS1iYzQ5LTljZGEtZTUwZGYxODAzMzY1IiBzdEV2dDp3aGVuPSIyMDE5LTExLTA3VDE4OjE5OjE2WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMTJjZTAwMi03OTMyLWFkNDYtYmFiZS1hMDYyODMwZjdhNzkiIHN0RXZ0OndoZW49IjIwMjAtMDItMDFUMjI6Mzk6MzFaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93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',
			model: `{
	"texture": "jolly_llama.png",
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
				{"coordinates": [-2.5, 26.1, -15, 5, 5, 2], "textureOffset": [35, 57]},
				{"coordinates": [-4.5, 21.1, -12.999, 9, 5, 7], "textureOffset": [57, 52]},
				{"coordinates": [-4.5, 25.1, -12.5, 9, 7, 7], "textureOffset": [0, 50]},
				{"coordinates": [-4, 33, -10, 3, 3, 2], "textureOffset": [27, 0]},
				{"coordinates": [1, 33, -10, 3, 3, 2], "textureOffset": [17, 0]},
				{"coordinates": [-11, 31, -8, 7, 16, 0], "textureOffset": [73, 16]},
				{"coordinates": [4, 31, -8, 7, 16, 0], "textureOffset": [73, 0]}
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
EntityOptions.jumbo_rabbit = {
		name: 'Jumbo Rabbit',
		texture_name: 'jumbo_rabbit.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHiGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA4VDE4OjExOjM0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjM6MjI6NDZaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIzOjIyOjQ2WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0MDE1MTNiMi1mYjQyLWU0NDAtYWZiZC1jMTkwNGZmYzhlYWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkYzA4MzZkMS0yODllLWMxNDctYjk2Yi1hZTJmMDcyN2Q0NWYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MWUxYjI1Ni01YmJhLTA1NDEtYTVmOC1hMDEwOTdlZjc5MzMiPiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGMwODM2ZDEtMjg5ZS1jMTQ3LWI5NmItYWUyZjA3MjdkNDVmPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDpkYTkyNTYzNS03MTc0LWJlNDEtYTQwNC1kNTQ5NzhhMDVlZDI8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1MWUxYjI1Ni01YmJhLTA1NDEtYTVmOC1hMDEwOTdlZjc5MzMiIHN0RXZ0OndoZW49IjIwMTktMTEtMDhUMTg6MTE6MzRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjI1MDcyZjM2LWE0YzItZTA0Zi04YTQxLTdhYTljOWM0YTk4MyIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wOFQxODoyMToyMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDAxNTEzYjItZmI0Mi1lNDQwLWFmYmQtYzE5MDRmZmM4ZWFjIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTAxVDIzOjIyOjQ2WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlVxAJUAAAgXSURBVGiBvVldaBzHHf+tOGlnL9F9+MLdScGSbFk1MQ4RUQqiqrFD8UMrsDF281AaSGI9BNqHkMoP7VspuNCKEAh9S4Pb9C0tpgE5T42JQSbQBEQf6iRSFcshzknktDfnamdWe7B92PvPzezu3Un56A+W253P/+//MfOfOSsMQyzNz4UwYTkOi5dBCBkvwpUbt63g5s3Qr9fx8KVLVhia3VLGPhAWl1es965eUWP8c+W2IeeVG7cRnzOOXv0zS/NzYaVaxg9/9FNce+MVVKplNHkzBIBcPqdaNnkzdXAib5dKCG7eDAFY+yHGHBtS+Oq3W70uPAB8d+57+mcYLq/0nK9f/wHAJEfvOnn923GYegBg5fay9cHH71uZM2eszJkzqcIwx1bvlWo5Uc4c22iT1u/02Wdw+uwzAABfJj2xF/S+BBpjYHF5xRJC4tobrwCI3Pxnf/2HIpIvllQnIq0rg++4fQXI5/MJQvE6ArXRy0nY1u4u+I4L6Qk1r2VZePHJyZCep0o59VDf1u5uqlx8x8XA0vxc+NwLLyvLOA7Dm5cvhDp5XQlEXveQXkrQSeuK0AnGlVCplsE5V9/SEwCAjbU1SCmMefvFv/QENtbWAETKoIfGzFDDeBgcnjiC/KFiz8HjYdILuuvbtt0uq0IKAc45KtUqDh8/gbXVDwFESpFtYQEoK/rCAwAw5qjxhN8CADh2BsNDg3iwFyTmb+3uQnoCLOso8lIKZByH4Z0bf0Eun1OEyOKvrnp4aTqLV1c9PD8WlXO3Hk3qeaSsEAD+cOkHxoQURkSEMQbmOJBCIA7btnH4+AmMTo5hdHIM7/3tOjjnUV8v2d4XnqEAzw+QtQeNNsNDg4qkDn08X3gY0MkQuFsHd+v44P13wHfc6LddpiMIWgnh4lslczqCNlwXzHHAGFPfAMAYw+jkGFrBHlrBHqamZ4ywiJNIK/P8AMJv4ZGHzHWGPEbvI6VQXAaEkAiCFpq8mVDE1bNPoPb5Z7h69omEAHHyQkhFPqGENmEAygOktpJPTc+gFeyp79HJMVUvpYAvPDTqpvK7KQHoWF9Ho16HL7xEnwFd4CBoJZTgZLOJwfQ2OvE0KCtrlqcQKxTT15hWsIfHZ+eiNUB4qW184am6L3fNPOKRh+yEJ6T1A7RFsEOCAZ4HJ5s13FcKoYgHQasnaR2FYtGIexpTLyf3zwwOGZ4Qx6FDh7rWkRLSiPfqp/b7MAzx5uULYb5YwslTswCAo+cXLMuyVH0cS/NzWFxe6To4ALz185+EDddVi6DNsvBlpEhSwNy5eQAwFJAZHMLqu7dw8tSsdfT8QmLcp0rGDqSEO1J8uDP3+n3rxScnu8om/FbHAwBzld8P+pEnVEYeBQBFHABsloXNsiiPTyjiOnl6/92vfxuKX/1GxTcQWbvbdvep+1+1Bvz42KhSTNYehGMbdOHYmWgNIByE/H5hs2zqO6E8VgUQkdaRGRzCyVOzEH5Lkf9y1zfifXhoMPUh6O09P0C9KVTOQLBeu/h0CERJSVxAX3rKTbdq2yqro0TG9331ra/0euYIAJ/cuZOmG3znsccSZdytgzkOtmq11LnSDk5dYJGHpoX224sLOLf0eicEpBAJBcSTFpqcTnG6gHqy40tPjdXLq7hbV8rSw0MKoZTKOe9Juq6lzABQaucPenj2Cm0jBHQh9Pc0kFCMMRSKReUBUghIIfr2T5s3niNIKZWC00DkXU/AbWd4cYUAvY1gvXbx6VDPumibilt/q7attbGVhcjyJLSe8pLmpZTgDfM+IV/IdZTWHiM+v3EginlBnXNFOo5i1sGJ41PRPLFwBIB7dzfUeyZRm0I+We9DCh8cTTDHhu/7ZuoqRKSQtuYZY0AhqquMPIqtLz5PEtas3vGm3vFezDoJJRSzjvGth2MaBuIF/cjT5YV+iaEOPI4Ta9v5fnx2DowxlMcnwBhTlqH5KIzIm6SUyBdy6km7S4gjTp7G96WnwsyXHirVqqrPxM/i/XIB3Sp0xCWi+uFGz/SI7OmLF9r7+wy2N++qcZjjgJIl/YxQKBbRcN1E+PQjnS63SH3P6IT1CxC9TFcIxb8aTBOY4l+fZGp6Ru31lNyMTo6hPFbF9r0a1lY/hBRC9aX1Q0qplELh4/v+QbbBBGGdeD6fB+cc1ubyn8LVd2+hPD6hhLv/n3sAoITc3ryLc0uvq7T57cWF9nWTlxoy//54rbMqN5P1b63f39fF6dcB3Wr1AuccmVawpxIEILISWQyA8a5jv9tcKeekKuH/gbRwNrw7nzd3gW6nsW5KAND1lqeYdbBe2/lKgn8TmJqeMb6JdHl8wlCKcsXVa79PdZnp565YAPD3X1xO1JMXxE94es5QqZbVuqC3o61JD62vgm4n0ns3/hxSKBO2N++qUKfv1DygH2hv1dNdWgzpkqPOOUr5vFrhAYAxYSQmB8kWu6HbiTQeynTYiod3hiw/XCgAAB40GqrBcKEA99b1cHNjHf+6tWJYUicQv/fToVbydjvdA3olKN80SCHxMDc8QCffaDQwfvQYgI5y9O1E37uBiNzmp5sAkmkqRxPjR8aNXL9Q7J90fR0cPb+wr9BSCnjQaODORx8BAEbamdLmxjqGCwVDMWqfbu/degoLAOtf1FRbOqQcG6kansEY+1bJHwSJf3O7gf7l1f/goLydFj2dfBzHRiKlVqplI99/9o/Xv/WcoBcOvAgSWVLEVm3bIB6/cQGiqye9Tb6QM8Y6COiOkrBfA+r45fdPqhD9H0FPxIvaKLPlAAAAAElFTkSuQmCC',
			model: `{
	"texture": "jumbo_rabbit.png",
	"textureSize": [64, 32],
	"models": [
		{
			"part": "left_foot",
			"id": "left_foot",
			"invertAxis": "xy",
			"translate": [3, -8.5, -5.7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [2.5, 2.5, 2, 3, 2, 9], "textureOffset": [40, 3]}
			]
		},
		{
			"part": "right_foot",
			"id": "right_foot",
			"invertAxis": "xy",
			"translate": [-3, -8.5, -5.7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-5.5, 2.5, 2, 3, 2, 9], "textureOffset": [40, 3]}
			]
		},
		{
			"part": "left_thigh",
			"id": "left_thigh",
			"invertAxis": "xy",
			"translate": [3, -6.5, -4.7],
			"mirrorTexture": "u",
			"submodels": [
				{
					"id": "bone2",
					"invertAxis": "xy",
					"translate": [-4, 3, 4],
					"rotate": [0, 90, 0],
					"boxes": [
						{"coordinates": [-7, 1.5, 6.5, 8, 7, 3], "textureOffset": [10, 22]}
					]
				}
			]
		},
		{
			"part": "right_thigh",
			"id": "right_thigh",
			"invertAxis": "xy",
			"translate": [-3, -6.5, -4.7],
			"mirrorTexture": "u",
			"submodels": [
				{
					"id": "bone",
					"invertAxis": "xy",
					"translate": [-4, 3, 4],
					"rotate": [0, 90, 0],
					"boxes": [
						{"coordinates": [-7, 1.5, -1.5, 8, 7, 3], "textureOffset": [10, 22]}
					]
				}
			]
		},
		{
			"part": "body",
			"id": "body",
			"invertAxis": "xy",
			"translate": [0, -9, -9],
			"boxes": [
				{"coordinates": [-4, 8.5, -3.75, 8, 8, 14], "textureOffset": [10, 0]}
			]
		},
		{
			"part": "left_arm",
			"id": "left_arm",
			"invertAxis": "xy",
			"translate": [3, -7, 1],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [3, 0, -4.75, 2, 11, 3], "textureOffset": [0, 11]}
			]
		},
		{
			"part": "right_arm",
			"id": "right_arm",
			"invertAxis": "xy",
			"translate": [-3, -7, 1],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-5, 0, -4.75, 2, 11, 3], "textureOffset": [54, 14]}
			]
		},
		{
			"part": "head",
			"id": "head",
			"invertAxis": "xy",
			"translate": [0, -8, 1],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-2.5, 13, -7.25, 5, 5, 6], "textureOffset": [0, 0]}
			]
		},
		{
			"part": "right_ear",
			"id": "right_ear",
			"invertAxis": "xy",
			"translate": [0, -8, 1],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [0.7, 18, -2.25, 2, 2, 1], "textureOffset": [0, 3]},
				{"coordinates": [0.7, 20, -2.25, 3, 10, 1], "textureOffset": [56, 0]}
			]
		},
		{
			"part": "left_ear",
			"id": "left_ear",
			"invertAxis": "xy",
			"translate": [0, -8, 1],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-3.7, 20, -2.25, 3, 10, 1], "textureOffset": [40, 0]},
				{"coordinates": [-2.7, 18, -2.25, 2, 2, 1], "textureOffset": [0, 0]}
			]
		},
		{
			"part": "tail",
			"id": "tail",
			"invertAxis": "xy",
			"translate": [0, -7.75, -8.75],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-1.5, 10.75, 10.25, 3, 3, 2], "textureOffset": [0, 25]}
			]
		},
		{
			"part": "nose",
			"id": "nose",
			"invertAxis": "xy",
			"translate": [0, -8, 1],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-0.5, 15.5, -7.75, 1, 1, 1], "textureOffset": [16, 0]}
			]
		}
	]
}`
}
EntityOptions.moobloom = {
		name: 'Moobloom',
		texture_name: 'moobloom.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAIwWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTI2VDE1OjQ4LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0wMVQyMTozNzo0NloiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDItMDFUMjE6Mzc6NDZaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI1M2E3ZWQyLWFmMzQtNWY0Ni1hYTAxLWUwNTZjYTQ2ZDEyNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjRmMWIwYjczLTk0MzMtMmQ0NS1hN2E1LTMyYmE5MzUxYTVlZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjZjNmUwMDk2LTFjZjctMzk0My05MmNkLTk2N2U5MjBmOGM5MyI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZjFiMGI3My05NDMzLTJkNDUtYTdhNS0zMmJhOTM1MWE1ZWY8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NjBiOWVkZWItNjc1YS1jYjRkLTg5ZTYtNjg1YmRjYTk5YTNkPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdhODlkMmE0LTEyY2MtMmU0MS05ODgwLWJlYWVjZmRhNDQ2YTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4MDk5ZTE0Yy0zYjFhLThkNDEtYWZmZS1kMGVkNTVjNmZlY2I8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YTZmMWIwZjgtYzljMy00ODQ2LWJiYzYtNzJiY2E1ZGJjYTc4PC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDpjMzA1YTIzOC1iYWM3LTM2NGYtODE4ZS1mYzFiYTE0NDI3ZWI8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTMiIHN0RXZ0OndoZW49IjIwMTktMDItMjZUMTU6NDgtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIv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',
			model: `{
	"texture": "moobloom.png",
	"textureSize": [64, 32],
	"models": [
		{
			"part": "body",
			"id": "body",
			"invertAxis": "xy",
			"translate": [0, -19, -2],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]}
			],
			"submodels": [
				{
					"id": "body_sub_2",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"mirrorTexture": "u",
					"rotate": [90, 0, 0],
					"boxes": [
						{"coordinates": [-4.5, 5, -22.5, 4, 6, 0], "textureOffset": [52, 8]},
						{"coordinates": [-5.5, 5, -13.5, 4, 6, 0], "textureOffset": [52, 8]},
						{"coordinates": [0.5, 5, -23.5, 4, 5, 0], "textureOffset": [52, 8]},
						{"coordinates": [1.5, 5, -14.5, 4, 5, 0], "textureOffset": [52, 8]},
						{"coordinates": [-2.5, 5, -24.5, 0, 6, 4], "textureOffset": [52, 4]},
						{"coordinates": [-3.5, 5, -15.5, 0, 6, 4], "textureOffset": [52, 4]},
						{"coordinates": [2.5, 5, -25.5, 0, 5, 4], "textureOffset": [52, 4]},
						{"coordinates": [3.5, 5, -16.5, 0, 5, 4], "textureOffset": [52, 4]}
					]
				}
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
				{"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
				{"coordinates": [-1.5, 24, -13.5, 0, 6, 4], "textureOffset": [52, 4]},
				{"coordinates": [-3.5, 24, -11.5, 4, 6, 0], "textureOffset": [52, 8]}
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
EntityOptions.muddy_pig = {
		name: 'Muddy Pig',
		texture_name: 'muddy_pig.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA0VDIwOjI5OjM5WiIgeG1wOk1vZGlmeURhdGU9IjIwMTktMTEtMDdUMTU6MzY6NTdaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTExLTA3VDE1OjM2OjU3WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMmFlNzVmNy1kMzgwLWFjNDYtYTM1MC02MjgxNWQzN2ZlM2UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NmNjZTIwMjItYzMyMS01MjRkLWFlMDktMjU1Mzk3MzdkYWQ3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NmNjZTIwMjItYzMyMS01MjRkLWFlMDktMjU1Mzk3MzdkYWQ3Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDo2Y2NlMjAyMi1jMzIxLTUyNGQtYWUwOS0yNTUzOTczN2RhZDc8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2NlMjAyMi1jMzIxLTUyNGQtYWUwOS0yNTUzOTczN2RhZDciIHN0RXZ0OndoZW49IjIwMTktMTEtMDRUMjA6Mjk6MzlaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUxY2E1MGMzLTYwMjgtNGU0Yi1iYjA4LWFkNzg2MWI2ZjUzOSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wNFQyMDo0MDoxOVoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDJhZTc1ZjctZDM4MC1hYzQ2LWEzNTAtNjI4MTVkMzdmZTNlIiBzdEV2dDp3aGVuPSIyMDE5LTExLTA3VDE1OjM2OjU3WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFu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',
			model: `{
	"texture": "muddy_pig.png",
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
			"boxes": [
				{"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
				{"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]},
				{"coordinates": [-3, 16, -13, 4, 1, 4], "textureOffset": [0, 26]},
				{"coordinates": [-4, 17, -11, 4, 6, 0], "textureOffset": [16, 20]}
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
EntityOptions.skeleton_dog = {
		name: 'Skeleton Dog',
		texture_name: 'skeleton_dog.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAALDWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTE5VDE3OjQ0OjIyLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMS0xMVQxMDoxNDozNS0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0xMS0xMVQxMDoxNDozNS0wODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzZiYTVmYy05NTEyLTkyNDAtYTAyYi1lNjM2MWUyNzY0OWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiMzA1YTNkNi04N2I3LWJmNDYtOWQ1OS1mZWM4NGIwNzA5MDEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0YjFkNzZmOC1jYmJiLWFkNDMtOGE3Yi00M2JmZDc5Y2QzYWQiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249Ijk2MDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0YjFkNzZmOC1jYmJiLWFkNDMtOGE3Yi00M2JmZDc5Y2QzYWQiIHN0RXZ0OndoZW49IjIwMTktMDItMTlUMTc6NDQ6MjItMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOTY2N2VhNS05YTkzLTUyNDEtYTYwMC1mNDg1YjYyOWExMWEiIHN0RXZ0OndoZW49IjIwMTktMDItMTlUMTc6NTg6NDQtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmJlOWQ2N2YtNzBkMS00NTRkLTg5ODAtMzA3MGIwNjc3ZWIwIiBzdEV2dDp3aGVuPSIyMDE5LTExLTExVDEwOjE0OjM1LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3NmJhNWZjLTk1MTItOTI0MC1hMDJiLWU2MzYxZTI3NjQ5YiIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0xMVQxMDoxNDozNS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYmU5ZDY3Zi03MGQxLTQ1NGQtODk4MC0zMDcwYjA2NzdlYjAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2NTZkMzY2NS1lNjNkLWVhNGQtYTY1OC1lYzYxZWRhOTNmMmUiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0YjFkNzZmOC1jYmJiLWFkNDMtOGE3Yi00M2JmZDc5Y2QzYWQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz44gB6PAAADWElEQVRo3u1Zy23jMBRkJS7CXbiTbAMB0kCwHbgCnxbpwA0EOfrkswthNAKHGD5TFEWJ2kNymFgiqSe+4fsqznvvFH9eXvwEnF1bwuPx8MDX56fnNXG73Uacz2d/uVxG4D7MRxmcG4DrRe+vxdMANpXDUgLu97sHSADvg/IOGOQ6KgcIOck4wbmuBGDDAF7G64BFgvnc9XpN5JQIwByeLRDgdiGAJkq0EEDzBQEA70uyMEcCcvNdCIB/c2PqpznfxRjWtsQEYxmTcz2ULBLw9/09IeB0Ovnj8RjvcY0xJQDPDGh64ce/Dz9g8Vx3AmCmJOBwOETfxTUJoCmvJQAybJDF2H8hAH+gEBUu+S7usTY8M5sCNeVRFhQEENTeXl89wGAYxse1fC4nS2NMiA1xvJUAV3uiXFtDgCqvJ60EW6K5rkSCzvEac60ukGAQOAm7dkooN8Z7Pq9FjVpAmCO8LXpE4TFABnkkb7xvDZxPp6qngpMIJuotATVVICEnHBXNWEBCAmNSDmoVer1JHQCBCHr4RVACAUuDEy0AZS2I4y9dQE9OoC6QPKcWgLFgCXQBx/HNCIDSawjQ02HwDMrx9CehFsCibFcLCELH36D4JukpWEBCgJ0nAbQAFEz0efq/WMDTdRMBGnGFVWejLk2z0gIiIAuKUDm1NMrWqM4+QAlQeV0IwAmrIPsyzJcIAFGDq2RP1J60sbSkYSL5u1eCegq5HM4CaIqAXCEyp4iktdgg9Wh3aywg+py1AM27XFfq0izmukV9R3AT32rKaywgFkDYCIsTS8BU/gcprQQEqyMB8X73XiDXx/f6BGXdQF1uT8WTIKh1OjZiurWaHj8JfmodBQuI7lNj9r1cI6ZBLTyY9mosIQQxJwFTvy0WCcAaEqDVHut/9hM93cJZ5Vmn1xCgNT4juqbMEgGMHZKGvTY1pt3tS0AIQDEN2c6tVN2RNA2aqBpriyasw3pb0GhqXVPo1BAQv9MBbEC0dq+xgK03tqsLkABtKCpdIFrA1hvTBqc7Adp/639t5gIZc/dUuduaGvVbgA2O3dKgtpv8EMLvdbbO1/QXNunW5HOtB0io9vtbk5wthfUjBP9rQ5QIkE9SSVHDCD5XDeb6j4mxfSrBn4ZfAn46Ad8VBD7UJ5Ex7AAAAABJRU5ErkJggg==',
		model: `{
	"texture": "skeleton_dog.png",
	"textureSize": [64, 32],
	"models": [
		{
			"part": "head",
			"id": "head",
			"invertAxis": "xy",
			"translate": [-1, -10.5, 7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-4, 7.5, -9, 6, 6, 4], "textureOffset": [0, 0]},
				{"coordinates": [-4, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
				{"coordinates": [0, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
				{"coordinates": [-2.5, 7.52, -12, 3, 3, 4], "textureOffset": [0, 10]}
			]
		},
		{
			"part": "body",
			"id": "body",
			"invertAxis": "xy",
			"translate": [0, -10, -2],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-4, 3, -1, 6, 9, 6], "textureOffset": [18, 14]}
			]
		},
		{
			"part": "mane",
			"id": "mane",
			"invertAxis": "xy",
			"translate": [-1, -10, -2],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-5, 7, -1, 8, 6, 7], "textureOffset": [21, 0]}
			]
		},
		{
			"part": "leg1",
			"id": "leg1",
			"invertAxis": "xy",
			"translate": [-2.5, -8, -7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-3.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "leg2",
			"id": "leg2",
			"invertAxis": "xy",
			"translate": [0.5, -8, -7],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-0.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "leg3",
			"id": "leg3",
			"invertAxis": "xy",
			"translate": [-2.5, -8, 4],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-3.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "leg4",
			"id": "leg4",
			"invertAxis": "xy",
			"translate": [0.5, -8, 4],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-0.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
			]
		},
		{
			"part": "tail",
			"id": "tail",
			"invertAxis": "xy",
			"translate": [-1, -12, -8],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-2, 4, 7, 2, 8, 2], "textureOffset": [9, 18]}
			]
		}
	]
}`
}
EntityOptions.wooly_cow = {
		name: 'Wooly Cow',
		texture_name: 'wooly_cow.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA3VDE0OjQwOjMxWiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjI6MDI6NDdaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIyOjAyOjQ3WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NjU2MDI2Ni1mMWU1LTE5NGYtYTlhZi0yZTgxOTVlOTUwYjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YmViOTZkMTMtYzVkZC1kYzQ2LWE3YWQtMWE5YzZjY2M2MTJiIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YmViOTZkMTMtYzVkZC1kYzQ2LWE3YWQtMWE5YzZjY2M2MTJiIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDpiZWI5NmQxMy1jNWRkLWRjNDYtYTdhZC0xYTljNmNjYzYxMmI8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiZWI5NmQxMy1jNWRkLWRjNDYtYTdhZC0xYTljNmNjYzYxMmIiIHN0RXZ0OndoZW49IjIwMTktMTEtMDdUMTQ6NDA6MzFaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjMyYjk2YTM3LTUwYzgtZTQ0ZC1hMzliLTgzM2MwYzkzNTgzOSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wN1QxNDo1NzozMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjY1NjAyNjYtZjFlNS0xOTRmLWE5YWYtMmU4MTk1ZTk1MGI0IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTAxVDIyOjAyOjQ3WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFu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',
			model: `{
	"texture": "wooly_cow.png",
	"textureSize": [64, 32],
	"models": [
		{
			"part": "body",
			"id": "body",
			"invertAxis": "xy",
			"translate": [0, -19, -2],
			"mirrorTexture": "u",
			"boxes": [
				{"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]}
			],
			"submodels": [
				{
					"id": "body_sub_0",
					"invertAxis": "xy",
					"translate": [-2.5, -1, 34],
					"mirrorTexture": "u",
					"rotate": [-90, 90, 0],
					"boxes": [
						{"coordinates": [39, -6.5, 30, 3, 8, 0], "textureOffset": [52, 6]}
					],
					"submodels": [
						{
							"id": "bone3",
							"invertAxis": "xy",
							"translate": [40.5, -2.5, 12],
							"rotate": [-180, 0, 0],
							"submodels": [
								{
									"invertAxis": "xy",
									"mirrorTexture": "u",
									"boxes": [
										{"coordinates": [-1.5, -4, 0, 3, 8, 0], "textureOffset": [52, 6]}
									]
								}
							]
						}
					]
				},
				{
					"id": "bone",
					"invertAxis": "xy",
					"translate": [-6, 29, -6],
					"rotate": [0, 0, 90],
					"boxes": [
						{"coordinates": [-17, 0.01, -2, 16, 0, 3], "textureOffset": [26, 0]}
					],
					"submodels": [
						{
							"id": "bone2",
							"invertAxis": "xy",
							"translate": [-9, -12.01, -0.5],
							"rotate": [0, 0, -180],
							"boxes": [
								{"coordinates": [-8, 0, -1.5, 16, 0, 3], "textureOffset": [26, 0]}
							]
						}
					]
				}
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
})()
