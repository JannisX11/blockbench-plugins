(function () {
	const EntityOptions = {};
	let GeneratorAction;
	Plugin.register('cem_template_loader', {
		title: 'CEM Template Loader',
		icon: 'keyboard_capslock',
		author: 'Ewan Howell',
		description: 'Load template entity models for use with OptiFine CEM.',
		version: '0.2.3',
		min_version: '3.6.0',
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
					"translate": [0, -23, 0],
					"boxes": [
						{"coordinates": [-1, 23, -1, 2, 7, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
						{"coordinates": [-7, 12, -1, 2, 12, 2], "textureOffset": [32, 16]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
					"boxes": [
						{"coordinates": [5, 12, -1, 2, 12, 2], "textureOffset": [24, 0]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [1.85, -12, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-2.9, 1, -1, 2, 11, 2], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-1.85, -12, 0],
					"boxes": [
						{"coordinates": [1.05, 1, -1, 2, 11, 2], "textureOffset": [8, 0]}
					]
				},
				{
					"part": "right",
					"id": "right",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-3, 14, -1, 2, 7, 2], "textureOffset": [48, 16]}
					]
				},
				{
					"part": "left",
					"id": "left",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [1, 14, -1, 2, 7, 2], "textureOffset": [16, 0]}
					]
				},
				{
					"part": "waist",
					"id": "waist",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 12, -1, 8, 2, 2], "textureOffset": [0, 48]}
					]
				},
				{
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [0, -12, 0],
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
				},
				{
					"part": "slate",
					"id": "slate",
					"invertAxis": "xy",
					"translate": [0, -44, 0],
					"boxes": [
						{"coordinates": [-10, 4, -2, 20, 40, 1], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "stand",
					"id": "stand",
					"invertAxis": "xy",
					"translate": [0, -12, 0],
					"boxes": [
						{"coordinates": [-1, 0, -1, 2, 42, 2], "textureOffset": [44, 0]}
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
					"translate": [0, -23, 0],
					"boxes": [
						{"coordinates": [-3, 20, -3, 6, 6, 6], "textureOffset": [0, 0]},
						{"coordinates": [1, 25, -2, 3, 4, 1], "textureOffset": [24, 0]}
					],
					"submodels": [
						{
							"id": "right_ear",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-4, 25, -2, 3, 4, 1], "textureOffset": [24, 0]}
							]
						}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-3, 8, -3, 6, 12, 6], "textureOffset": [0, 16]},
						{"coordinates": [-5, -8, 0, 10, 16, 1], "textureOffset": [0, 34]}
					]
				},
				{
					"part": "right_wing",
					"id": "right_wing",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [2, 7, 1.5, 10, 16, 1], "textureOffset": [42, 0]}
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
					"translate": [-12, -23, -1.5],
					"boxes": [
						{"coordinates": [12, 10, 1.5, 8, 12, 1], "textureOffset": [24, 16]}
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
					"part": "foot",
					"id": "foot",
					"invertAxis": "xy",
					"translate": [-8, -9, 0],
					"submodels": [
						{
							"id": "foot_rotation",
							"invertAxis": "xy",
							"translate": [0, 9, 0],
							"rotate": [90, 0, 0],
							"boxes": [
								{"coordinates": [-8, -16, 0, 16, 16, 6], "textureOffset": [0, 22]}
							],
							"submodels": [
								{
									"id": "foot_left_leg",
									"invertAxis": "xy",
									"translate": [0, -16, 0],
									"rotate": [-90, 0, -90],
									"boxes": [
										{"coordinates": [-3, -9, -8, 3, 3, 3], "textureOffset": [50, 12]}
									]
								},
								{
									"id": "foot_right_leg",
									"invertAxis": "xy",
									"translate": [0, -16, 0],
									"rotate": [-90, 0, 0],
									"boxes": [
										{"coordinates": [5, -9, 0, 3, 3, 3], "textureOffset": [50, 0]}
									]
								}
							]
						}
					],
					"animations": [
						{
							"foot_rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [-8, -25, 0],
					"submodels": [
						{
							"id": "head_rotation",
							"invertAxis": "xy",
							"translate": [0, 9, 0],
							"rotate": [90, 0, 0],
							"boxes": [
								{"coordinates": [-8, 0, 0, 16, 16, 6], "textureOffset": [0, 0]}
							],
							"submodels": [
								{
									"id": "head_left_leg",
									"invertAxis": "xy",
									"translate": [0, -16, 0],
									"rotate": [-90, 0, -180],
									"boxes": [
										{"coordinates": [5, -9, -32, 3, 3, 3], "textureOffset": [50, 18]}
									]
								},
								{
									"id": "head_right_leg",
									"invertAxis": "xy",
									"translate": [0, -16, 0],
									"rotate": [-90, 0, 90],
									"boxes": [
										{"coordinates": [29, -9, -8, 3, 3, 3], "textureOffset": [50, 6]}
									]
								}
							]
						}
					],
					"animations": [
						{
							"head_rotation.rx": "0"
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [0, 0, 0]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [0, 0, 0]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [0, 0, 0]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [0, 0, 0]
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
					"boxes": [
						{"coordinates": [-4, 20, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "stick1",
					"id": "stick1",
					"invertAxis": "xy",
					"translate": [-7, -26, 7],
					"boxes": [
						{"coordinates": [6, 18, -8, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick2",
					"id": "stick2",
					"invertAxis": "xy",
					"translate": [7, -26, 7],
					"boxes": [
						{"coordinates": [-8, 18, -8, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick3",
					"id": "stick3",
					"invertAxis": "xy",
					"translate": [7, -26, -7],
					"boxes": [
						{"coordinates": [-8, 18, 6, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick4",
					"id": "stick4",
					"invertAxis": "xy",
					"translate": [-7, -26, -7],
					"boxes": [
						{"coordinates": [6, 18, 6, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick5",
					"id": "stick5",
					"invertAxis": "xy",
					"translate": [-5, -22, 5],
					"boxes": [
						{"coordinates": [4, 14, -6, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick6",
					"id": "stick6",
					"invertAxis": "xy",
					"translate": [5, -22, 5],
					"boxes": [
						{"coordinates": [-6, 14, -6, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick7",
					"id": "stick7",
					"invertAxis": "xy",
					"translate": [5, -22, -5],
					"boxes": [
						{"coordinates": [-6, 14, 4, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick8",
					"id": "stick8",
					"invertAxis": "xy",
					"translate": [-5, -22, -5],
					"boxes": [
						{"coordinates": [4, 14, 4, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick9",
					"id": "stick9",
					"invertAxis": "xy",
					"translate": [-3, -14, 3],
					"boxes": [
						{"coordinates": [2, 6, -4, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick10",
					"id": "stick10",
					"invertAxis": "xy",
					"translate": [3, -14, 3],
					"boxes": [
						{"coordinates": [-4, 6, -4, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick11",
					"id": "stick11",
					"invertAxis": "xy",
					"translate": [3, -14, -3],
					"boxes": [
						{"coordinates": [-4, 6, 2, 2, 8, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "stick12",
					"id": "stick12",
					"invertAxis": "xy",
					"translate": [-3, -14, -3],
					"boxes": [
						{"coordinates": [2, 6, 2, 2, 8, 2], "textureOffset": [0, 16]}
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
					"part": "bottom"
				},
				{
					"part": "back"
				},
				{
					"part": "front",
					"id": "front",
					"invertAxis": "xy",
					"translate": [0, -2, -5.5],
					"rotate": [0, -180, 0],
					"boxes": [
						{"coordinates": [-9, 3, 23.5, 18, 6, 2], "textureOffset": [0, 19]}
					],
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 6, -5],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, -3, -0.5, 16, 6, 2], "textureOffset": [0, 27]}
							]
						},
						{
							"id": "sides",
							"invertAxis": "xy",
							"translate": [15, -22, -5],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-28.5, 25, -7, 28, 6, 2], "textureOffset": [0, 35]}
							],
							"submodels": [
								{
									"id": "sides2",
									"invertAxis": "xy",
									"translate": [-15, 28, -24],
									"rotate": [0, -180, 0],
									"boxes": [
										{"coordinates": [-14.5, -3, -1, 28, 6, 2], "textureOffset": [0, 43]}
									]
								}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 2, 10],
							"rotate": [-90, -90, 0],
							"boxes": [
								{"coordinates": [-14.5, -8, -2, 28, 16, 3], "textureOffset": [0, 0]}
							]
						}
					]
				},
				{
					"part": "right"
				},
				{
					"part": "left"
				},
				{
					"part": "paddle_left",
					"id": "paddle_left",
					"invertAxis": "xy",
					"translate": [-13.5, -6, 4],
					"boxes": [
						{"coordinates": [12.5, 4, -9, 2, 2, 18], "textureOffset": [62, 0]},
						{"coordinates": [13.51, 3, 4, 1, 6, 7], "textureOffset": [62, 0]}
					]
				},
				{
					"part": "paddle_right",
					"id": "paddle_right",
					"invertAxis": "xy",
					"translate": [13.5, -6, 4],
					"boxes": [
						{"coordinates": [-14.5, 4, -9, 2, 2, 18], "textureOffset": [62, 20]},
						{"coordinates": [-14.51, 3, 4, 1, 6, 7], "textureOffset": [62, 20]}
					]
				},
				{
					"part": "bottom_no_water",
					"id": "bottom_no_water",
					"invertAxis": "xy",
					"translate": [0, 11, -3.5],
					"boxes": [
						{"coordinates": [-14, -19, -2.5, 28, 17, 6], "textureOffset": [0, 0]}
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
					"boxes": [
						{"coordinates": [0.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-1.1, -6, -5],
					"boxes": [
						{"coordinates": [-2.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [1.2, -10, 5],
					"boxes": [
						{"coordinates": [0.2, 0, -5, 2, 10, 2], "textureOffset": [40, 0]}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-1.2, -10, 5],
					"boxes": [
						{"coordinates": [-2.2, 0, -5, 2, 10, 2], "textureOffset": [40, 0]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -9.5, -9],
					"boxes": [
						{"coordinates": [-0.5, 1.5, 9, 1, 8, 1], "textureOffset": [0, 15]}
					]
				},
				{
					"part": "tail2",
					"id": "tail2",
					"invertAxis": "xy",
					"translate": [0, -1.5, -9],
					"boxes": [
						{"coordinates": [-0.5, -6.5, 9, 1, 8, 1], "textureOffset": [4, 15]}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -9, 9],
					"boxes": [
						{"coordinates": [-2.5, 7, -12, 5, 4, 5], "textureOffset": [0, 0]},
						{"coordinates": [-1.5, 7.02, -13, 3, 2, 2], "textureOffset": [0, 24]},
						{"coordinates": [1, 11, -9, 1, 1, 2], "textureOffset": [0, 10]},
						{"coordinates": [-2, 11, -9, 1, 1, 2], "textureOffset": [6, 10]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -18, -6.1],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 1],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-2, -8, -2.9, 4, 16, 6], "textureOffset": [20, 0]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
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
					"boxes": [
						{"coordinates": [-4, 5, -11, 8, 8, 8], "textureOffset": [32, 4]}
					]
				},
				{
					"part": "neck",
					"id": "neck",
					"invertAxis": "xy",
					"translate": [0, -9, 0],
					"boxes": [
						{"coordinates": [-3, 6, -3, 6, 6, 6], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -9, -9],
					"boxes": [
						{"coordinates": [-5, 5, 3, 10, 8, 12], "textureOffset": [0, 12]}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-4, -9, -4],
					"boxes": [
						{"coordinates": [3, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [4, -9, -4],
					"boxes": [
						{"coordinates": [-19, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-4, -9, -1],
					"boxes": [
						{"coordinates": [3, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4, -9, -1],
					"boxes": [
						{"coordinates": [-19, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg5",
					"id": "leg5",
					"invertAxis": "xy",
					"translate": [-4, -9, 2],
					"boxes": [
						{"coordinates": [3, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg6",
					"id": "leg6",
					"invertAxis": "xy",
					"translate": [4, -9, 2],
					"boxes": [
						{"coordinates": [-19, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg7",
					"id": "leg7",
					"invertAxis": "xy",
					"translate": [-4, -9, 5],
					"boxes": [
						{"coordinates": [3, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg8",
					"id": "leg8",
					"invertAxis": "xy",
					"translate": [4, -9, 5],
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
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [-8, -14, 8],
					"submodels": [
						{
							"id": "base_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-7, -3, -7, 14, 10, 14], "textureOffset": [0, 19]}
							]
						}
					],
					"animations": [
						{
							"base_rotation.rx": "0"
						}
					]
				},
				{
					"part": "knob",
					"id": "knob",
					"invertAxis": "xy",
					"translate": [-8, -6, 8],
					"submodels": [
						{
							"id": "knob_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-1, -4, 7, 2, 4, 1], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"knob_rotation.rx": "0"
						}
					]
				},
				{
					"part": "lid",
					"id": "lid",
					"invertAxis": "xy",
					"translate": [-8, -5, 7],
					"submodels": [
						{
							"id": "lid_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-7, -7, -7, 14, 5, 14], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"lid_rotation.rx": "0"
						}
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
					"part": "base_left",
					"id": "base_left",
					"invertAxis": "xy",
					"translate": [-8, -14, 8],
					"submodels": [
						{
							"id": "base_left_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-8, -3, -7, 15, 10, 14], "textureOffset": [0, 19]}
							]
						}
					],
					"animations": [
						{
							"base_left_rotation.rx": "0"
						}
					]
				},
				{
					"part": "base_right",
					"id": "base_right",
					"invertAxis": "xy",
					"translate": [8, -14, 8],
					"submodels": [
						{
							"id": "base_right_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-23, -3, -7, 15, 10, 14], "textureOffset": [0, 19]}
							]
						}
					],
					"animations": [
						{
							"base_right_rotation.rx": "0"
						}
					]
				},
				{
					"part": "knob_left",
					"id": "knob_left",
					"invertAxis": "xy",
					"translate": [-8, -6, 8],
					"submodels": [
						{
							"id": "knob_left_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-8, -4, 7, 1, 4, 1], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"knob_left_rotation.rx": "0"
						}
					]
				},
				{
					"part": "knob_right",
					"id": "knob_right",
					"invertAxis": "xy",
					"translate": [8, -6, 8],
					"submodels": [
						{
							"id": "knob_right_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-9, -4, 7, 1, 4, 1], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"knob_right_rotation.rx": "0"
						}
					]
				},
				{
					"part": "lid_left",
					"id": "lid_left",
					"invertAxis": "xy",
					"translate": [-8, -5, 7],
					"submodels": [
						{
							"id": "lid_left_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-8, -7, -7, 15, 5, 14], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"lid_left_rotation.rx": "0"
						}
					]
				},
				{
					"part": "lid_right",
					"id": "lid_right",
					"invertAxis": "xy",
					"translate": [8, -5, 7],
					"submodels": [
						{
							"id": "lif_right_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-23, -7, -7, 15, 5, 14], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"lid_right_rotation.rx": "0"
						}
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
					"boxes": [
						{"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -8, 0],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 8, 0],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-3, -4, -3, 6, 8, 6], "textureOffset": [0, 9]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -5, -1],
					"boxes": [
						{"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [1, -5, -1],
					"boxes": [
						{"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
					]
				},
				{
					"part": "right_wing",
					"id": "right_wing",
					"invertAxis": "xy",
					"translate": [-4, -11, 0],
					"boxes": [
						{"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
					]
				},
				{
					"part": "left_wing",
					"id": "left_wing",
					"invertAxis": "xy",
					"translate": [4, -11, 0],
					"boxes": [
						{"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
					]
				},
				{
					"part": "bill",
					"id": "bill",
					"invertAxis": "xy",
					"translate": [0, -9, 4],
					"boxes": [
						{"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
					]
				},
				{
					"part": "chin",
					"id": "chin",
					"invertAxis": "xy",
					"translate": [0, -9, 4],
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
									"id": "body_sub_1",
									"invertAxis": "xy",
									"translate": [0, 0, 0],
									"boxes": [
										{"coordinates": [0, 0, 0, 6, 1, 0], "textureOffset": [20, 0]}
									]
								}
							]
						},
						{
							"id": "fin_right2",
							"invertAxis": "xy",
							"translate": [-1, 1, 0],
							"rotate": [0, 0, 45],
							"boxes": [
								{"coordinates": [-2, -1, -1, 2, 1, 2], "textureOffset": [24, 4]}
							]
						},
						{
							"id": "fin_left2",
							"invertAxis": "xy",
							"translate": [1, 1, 0],
							"rotate": [0, 0, -45],
							"boxes": [
								{"coordinates": [0, -1, -1, 2, 1, 2], "textureOffset": [24, 1]}
							]
						}
					]
				},
				{
					"part": "fin_back",
					"id": "fin_back",
					"invertAxis": "xy",
					"translate": [0, -4, 0]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -2, 0],
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
					"id": "fin_left"
				},
				{
					"part": "fin_right",
					"id": "fin_right"
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -2, -7],
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
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-6, -8, -7, 12, 18, 10], "textureOffset": [18, 4]},
								{"coordinates": [-2, -8, -8, 4, 6, 1], "textureOffset": [52, 0]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -20, 8],
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
					"boxes": [
						{"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [4, -12, -7],
					"boxes": [
						{"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-4, -12, 6],
					"boxes": [
						{"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4, -12, 6],
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
					"boxes": [
						{"coordinates": [-4, 18, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "armor",
					"id": "armor"
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -18, 0],
					"boxes": [
						{"coordinates": [-4, 6, -2, 8, 12, 4], "textureOffset": [16, 16]}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-2, -6, -4],
					"boxes": [
						{"coordinates": [-4, 0, 2, 4, 6, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [2, -6, -4],
					"boxes": [
						{"coordinates": [0, 0, 2, 4, 6, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-2, -6, 4],
					"boxes": [
						{"coordinates": [-4, 0, -6, 4, 6, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [2, -6, 4],
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
					"boxes": [
						{"coordinates": [-2, 0, 10, 4, 5, 11], "textureOffset": [0, 19]}
					],
					"submodels": [
						{
							"id": "tail_fin",
							"invertAxis": "xy",
							"translate": [0, 2.5, 20],
							"boxes": [
								{"coordinates": [-5, -0.5, -1, 10, 1, 6], "textureOffset": [19, 20]}
							]
						}
					],
					"animations": [
						{
							"tail_fin.rx": "tail.rx"
						}
					]
				},
				{
					"part": "right_fin",
					"id": "right_fin",
					"invertAxis": "xy",
					"translate": [-4.5, 0, 2],
					"boxes": [
						{"coordinates": [4, 0, -2, 1, 4, 7], "textureOffset": [48, 20]}
					]
				},
				{
					"part": "left_fin",
					"id": "left_fin",
					"invertAxis": "xy",
					"translate": [4.5, 0, 2],
					"boxes": [
						{"coordinates": [-5, 0, -2, 1, 4, 7], "textureOffset": [48, 20]}
					]
				},
				{
					"part": "back_fin",
					"id": "back_fin",
					"invertAxis": "xy",
					"translate": [0, -11, 5],
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
					"boxes": [
						{
							"coordinates": [-5, 11, -11, 10, 10, 22],
							"uvNorth": [22, 54, 32, 64],
							"uvEast": [0, 54, 22, 64],
							"uvSouth": [54, 54, 64, 64],
							"uvWest": [32, 54, 54, 64],
							"uvUp": [32, 54, 22, 32],
							"uvDown": [42, 32, 32, 54],
							"sizeAdd": 0.05
						}
					]
				},
				{
					"part": "neck",
					"id": "neck",
					"invertAxis": "xy",
					"translate": [0, -22, 8.9],
					"boxes": [
						{
							"coordinates": [-2, 16, -11, 4, 12, 7],
							"uvNorth": [7, 42, 11, 54],
							"uvEast": [0, 42, 7, 54],
							"uvSouth": [18, 42, 22, 54],
							"uvWest": [11, 42, 18, 54],
							"uvUp": [11, 42, 7, 35],
							"uvDown": [15, 35, 11, 42]
						}
					]
				},
				{
					"part": "back_left_leg",
					"id": "back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, 0, 7, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, 0, 7, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [1, 0, -11, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [-5, 0, -11, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -21, -11],
					"boxes": [
						{
							"coordinates": [-1.5, 7, 11, 3, 14, 4],
							"uvNorth": [46, 40, 49, 54],
							"uvEast": [42, 40, 46, 54],
							"uvSouth": [53, 40, 56, 54],
							"uvWest": [49, 40, 53, 54],
							"uvUp": [49, 40, 46, 36],
							"uvDown": [52, 36, 49, 40]
						}
					]
				},
				{
					"part": "saddle",
					"id": "saddle",
					"invertAxis": "xy",
					"translate": [0, -13, -6],
					"boxes": [
						{
							"coordinates": [-5, 12, -3.5, 10, 9, 9],
							"uvNorth": [35, 9, 45, 18],
							"uvEast": [26, 9, 35, 18],
							"uvSouth": [54, 9, 64, 18],
							"uvWest": [45, 9, 54, 18],
							"uvUp": [45, 9, 35, 0],
							"uvDown": [55, 0, 45, 9],
							"sizeAdd": 0.5
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 20, 13, 25],
							"uvEast": [0, 20, 7, 25],
							"uvSouth": [20, 20, 26, 25],
							"uvWest": [13, 20, 20, 25],
							"uvUp": [13, 20, 7, 13],
							"uvDown": [19, 13, 13, 20]
						}
					]
				},
				{
					"part": "mouth",
					"id": "mouth",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -16, 4, 5, 5],
							"uvNorth": [5, 30, 9, 35],
							"uvEast": [0, 30, 5, 35],
							"uvSouth": [14, 30, 18, 35],
							"uvWest": [9, 30, 14, 35],
							"uvUp": [9, 30, 5, 25],
							"uvDown": [13, 25, 9, 30]
						}
					]
				},
				{
					"part": "left_ear",
					"id": "left_ear",
					"invertAxis": "xy",
					"translate": [-1.5, -31.9, 4.5],
					"boxes": [
						{
							"coordinates": [0.5, 32, -5, 2, 7, 1],
							"uvNorth": [1, 13, 3, 20],
							"uvEast": [0, 13, 1, 20],
							"uvSouth": [4, 13, 6, 20],
							"uvWest": [3, 13, 4, 20],
							"uvUp": [3, 13, 1, 12],
							"uvDown": [5, 12, 3, 13]
						}
					]
				},
				{
					"part": "right_ear",
					"id": "right_ear",
					"invertAxis": "xy",
					"translate": [1.5, -31.9, 4.5],
					"boxes": [
						{
							"coordinates": [-2.5, 32, -5, 2, 7, 1],
							"uvNorth": [1, 13, 3, 20],
							"uvEast": [0, 13, 1, 20],
							"uvSouth": [4, 13, 6, 20],
							"uvWest": [3, 13, 4, 20],
							"uvUp": [3, 13, 1, 12],
							"uvDown": [5, 12, 3, 13]
						}
					]
				},
				{
					"part": "left_bit",
					"id": "left_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [2, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "right_bit",
					"id": "right_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "left_rein",
					"id": "left_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "right_rein",
					"id": "right_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [-3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "headpiece",
					"id": "headpiece",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 7, 13, 12],
							"uvEast": [0, 7, 7, 12],
							"uvSouth": [20, 7, 26, 12],
							"uvWest": [13, 7, 20, 12],
							"uvUp": [13, 7, 7, 0],
							"uvDown": [19, 0, 13, 7],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "noseband",
					"id": "noseband",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -13, 4, 5, 2],
							"uvNorth": [21, 2, 25, 7],
							"uvEast": [19, 2, 21, 7],
							"uvSouth": [27, 2, 31, 7],
							"uvWest": [25, 2, 27, 7],
							"uvUp": [25, 2, 21, 0],
							"uvDown": [29, 0, 25, 2],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "mane",
					"id": "mane",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-1, 17, -4, 2, 16, 2],
							"uvNorth": [58, 38, 60, 54],
							"uvEast": [56, 38, 58, 54],
							"uvSouth": [62, 38, 64, 54],
							"uvWest": [60, 38, 62, 54],
							"uvUp": [60, 38, 58, 36],
							"uvDown": [62, 36, 60, 38]
						}
					]
				},
				{
					"part": "child_back_left_leg",
					"id": "child_back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, -5.5, 7, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_back_right_leg",
					"id": "child_back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, -5.5, 7, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "child_front_left_leg",
					"id": "child_front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9],
					"boxes": [
						{
							"coordinates": [-5, -5.5, -11, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_front_right_leg",
					"id": "child_front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9],
					"boxes": [
						{
							"coordinates": [1, -5.5, -11, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "left_chest",
					"id": "left_chest",
					"invertAxis": "xy",
					"translate": [9, -21, -4],
					"submodels": [
						{
							"id": "left_chest_rotation",
							"invertAxis": "xy",
							"translate": [-6.5, 17, 3.5],
							"rotate": [0, 90, 0],
							"boxes": [
								{
									"coordinates": [-6.5, -4, -1.5, 8, 8, 3],
									"uvNorth": [29, 24, 37, 32],
									"uvEast": [26, 24, 29, 32],
									"uvSouth": [40, 24, 48, 32],
									"uvWest": [37, 24, 40, 32],
									"uvUp": [29, 21, 37, 24],
									"uvDown": [37, 21, 45, 24]
								}
							]
						}
					],
					"animations": [
						{
							"left_chest_rotation.ry": "0"
						}
					]
				},
				{
					"part": "right_chest",
					"id": "right_chest",
					"invertAxis": "xy",
					"translate": [-9, -21, -4],
					"submodels": [
						{
							"id": "right_chest_rotation",
							"invertAxis": "xy",
							"translate": [6.5, 17, 3.5],
							"rotate": [0, -90, 0],
							"boxes": [
								{
									"coordinates": [-1.5, -4, -1.5, 8, 8, 3],
									"uvNorth": [29, 24, 37, 32],
									"uvEast": [26, 24, 29, 32],
									"uvSouth": [40, 24, 48, 32],
									"uvWest": [37, 24, 40, 32],
									"uvUp": [29, 21, 37, 24],
									"uvDown": [37, 21, 45, 24]
								}
							]
						}
					],
					"animations": [
						{
							"right_chest_rotation.ry": "0"
						}
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
					"boxes": [
						{"coordinates": [-6, 2, -48, 12, 5, 16], "textureOffset": [176, 44]},
						{"coordinates": [-8, -2, -34, 16, 16, 16], "textureOffset": [112, 30]},
						{"coordinates": [-8, -2, -34, 16, 16, 16], "textureOffset": [112, 30]},
						{"coordinates": [-5, 14, -28, 2, 4, 6], "textureOffset": [0, 0]},
						{"coordinates": [-5, 7, -46, 2, 2, 4], "textureOffset": [112, 0]}
					],
					"submodels": [
						{
							"id": "mirrored",
							"invertAxis": "xy",
							"mirrorTexture": "u",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [3, 14, -28, 2, 4, 6], "textureOffset": [0, 0]},
								{"coordinates": [3, 7, -46, 2, 2, 4], "textureOffset": [112, 0]}
							]
						}
					]
				},
				{
					"part": "spine",
					"id": "spine",
					"invertAxis": "xy",
					"translate": [0, -5, 13],
					"boxes": [
						{"coordinates": [-5, 0, -18, 10, 10, 10], "textureOffset": [192, 104]},
						{"coordinates": [-1, 10, -16, 2, 4, 6], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "jaw",
					"id": "jaw",
					"invertAxis": "xy",
					"translate": [0, -2, 32],
					"boxes": [
						{"coordinates": [-6, -2, -48, 12, 4, 16], "textureOffset": [176, 65]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -20, -8],
					"boxes": [
						{"coordinates": [-12, -4, -8, 24, 24, 64], "textureOffset": [0, 0]},
						{"coordinates": [-1, 20, -2, 2, 6, 12], "textureOffset": [220, 53]},
						{"coordinates": [-1, 20, 18, 2, 6, 12], "textureOffset": [220, 53]},
						{"coordinates": [-1, 20, 38, 2, 6, 12], "textureOffset": [220, 53]}
					]
				},
				{
					"part": "left_wing",
					"id": "left_wing",
					"invertAxis": "xy",
					"translate": [12, -19, -2],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-68, 15, -2, 56, 8, 8], "textureOffset": [112, 88]},
						{"coordinates": [-68, 19, 4, 56, 0, 56], "textureOffset": [-56, 88]}
					]
				},
				{
					"part": "left_wing_tip",
					"id": "left_wing_tip",
					"invertAxis": "xy",
					"translate": [68, -19, -2],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-124, 17, 0, 56, 4, 4], "textureOffset": [112, 136]},
						{"coordinates": [-124, 19, 4, 56, 0, 56], "textureOffset": [-56, 144]}
					]
				},
				{
					"part": "right_wing",
					"id": "right_wing",
					"invertAxis": "xy",
					"translate": [-12, -19, -2],
					"boxes": [
						{"coordinates": [12, 19, 4, 56, 0, 56], "textureOffset": [-56, 88]},
						{"coordinates": [12, 15, -2, 56, 8, 8], "textureOffset": [112, 88]}
					]
				},
				{
					"part": "right_wing_tip",
					"id": "right_wing_tip",
					"invertAxis": "xy",
					"translate": [-68, -19, -2],
					"boxes": [
						{"coordinates": [68, 19, 4, 56, 0, 56], "textureOffset": [-56, 144]},
						{"coordinates": [68, 17, 0, 56, 4, 4], "textureOffset": [112, 136]}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [12, -4, -2],
					"boxes": [
						{"coordinates": [-16, -16, -2, 8, 24, 8], "textureOffset": [112, 104]}
					]
				},
				{
					"part": "front_left_shin",
					"id": "front_left_shin",
					"invertAxis": "xy",
					"translate": [12, 17, -2],
					"boxes": [
						{"coordinates": [-15, -40, -1, 6, 24, 6], "textureOffset": [226, 138]}
					]
				},
				{
					"part": "front_left_foot",
					"id": "front_left_foot",
					"invertAxis": "xy",
					"translate": [11, 40, -2],
					"boxes": [
						{"coordinates": [-16, -44, -10, 8, 4, 16], "textureOffset": [144, 104]}
					]
				},
				{
					"part": "back_left_leg",
					"id": "back_left_leg",
					"invertAxis": "xy",
					"translate": [16, -8, -42],
					"boxes": [
						{"coordinates": [-24, -20, 34, 16, 32, 16], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "back_left_shin",
					"id": "back_left_shin",
					"invertAxis": "xy",
					"translate": [16, 22, -36],
					"boxes": [
						{"coordinates": [-22, -52, 36, 12, 32, 12], "textureOffset": [196, 0]}
					]
				},
				{
					"part": "back_left_foot",
					"id": "back_left_foot",
					"invertAxis": "xy",
					"translate": [16, 52, -44],
					"boxes": [
						{"coordinates": [-25, -58, 24, 18, 6, 24], "textureOffset": [112, 0]}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-12, -4, -2],
					"boxes": [
						{"coordinates": [8, -16, -2, 8, 24, 8], "textureOffset": [112, 104]}
					]
				},
				{
					"part": "front_right_shin",
					"id": "front_right_shin",
					"invertAxis": "xy",
					"translate": [-12, 17, -2],
					"boxes": [
						{"coordinates": [9, -40, -1, 6, 24, 6], "textureOffset": [226, 138]}
					]
				},
				{
					"part": "front_right_foot",
					"id": "front_right_foot",
					"invertAxis": "xy",
					"translate": [-12, 40, -2],
					"boxes": [
						{"coordinates": [8, -44, -10, 8, 4, 16], "textureOffset": [144, 104]}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-16, -8, -42],
					"boxes": [
						{"coordinates": [8, -20, 34, 16, 32, 16], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "back_right_shin",
					"id": "back_right_shin",
					"invertAxis": "xy",
					"translate": [-16, 22, -36],
					"boxes": [
						{"coordinates": [10, -52, 36, 12, 32, 12], "textureOffset": [196, 0]}
					]
				},
				{
					"part": "back_right_foot",
					"id": "back_right_foot",
					"invertAxis": "xy",
					"translate": [-16, 52, -44],
					"boxes": [
						{"coordinates": [7, -58, 24, 18, 6, 24], "textureOffset": [112, 0]}
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
					"translate": [0, -8, -2],
					"boxes": [
						{"coordinates": [-6, 4, -22, 12, 5, 16], "textureOffset": [176, 44]},
						{"coordinates": [-8, 0, -8, 16, 16, 16], "textureOffset": [112, 30]},
						{"coordinates": [-5, 16, -2, 2, 4, 6], "textureOffset": [0, 0]},
						{"coordinates": [-5, 9, -20, 2, 2, 4], "textureOffset": [112, 0]}
					],
					"submodels": [
						{
							"id": "mirrored",
							"invertAxis": "xy",
							"translate": [0, 2, 26],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [3, 7, -46, 2, 2, 4], "textureOffset": [112, 0]},
								{"coordinates": [3, 14, -28, 2, 4, 6], "textureOffset": [0, 0]}
							]
						}
					]
				},
				{
					"part": "jaw",
					"id": "jaw",
					"invertAxis": "xy",
					"translate": [0, -4, 6],
					"boxes": [
						{"coordinates": [-6, 0, -22, 12, 4, 16], "textureOffset": [176, 65]}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
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
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [32, 48]}
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
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [16, 48]}
					]
				}
			]
		}`
	}
	EntityOptions.end_crystal = {
		name: 'End Crystal',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [0, -4, 0],
					"boxes": [
						{"coordinates": [-6, 0, -6, 12, 4, 12], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "cube",
					"id": "cube",
					"invertAxis": "xy",
					"translate": [0, -10, 0],
					"boxes": [
						{"coordinates": [-4, 6, -4, 8, 8, 8], "textureOffset": [32, 0]}
					]
				},
				{
					"part": "glass",
					"id": "glass",
					"invertAxis": "xy",
					"translate": [0, -10, 0],
					"boxes": [
						{"coordinates": [-4, 6, -4, 8, 8, 8], "textureOffset": [0, 0]}
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
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [-8, -14, 8],
					"submodels": [
						{
							"id": "base_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-7, -3, -7, 14, 10, 14], "textureOffset": [0, 19]}
							]
						}
					],
					"animations": [
						{
							"base_rotation.rx": "0"
						}
					]
				},
				{
					"part": "knob",
					"id": "knob",
					"invertAxis": "xy",
					"translate": [-8, -6, 8],
					"submodels": [
						{
							"id": "knob_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-1, -4, 7, 2, 4, 1], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"knob_rotation.rx": "0"
						}
					]
				},
				{
					"part": "lid",
					"id": "lid",
					"invertAxis": "xy",
					"translate": [-8, -5, 7],
					"submodels": [
						{
							"id": "lid_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-7, -7, -7, 14, 5, 14], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"lid_rotation.rx": "0"
						}
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
					"boxes": [
						{"coordinates": [-4, 27, -2, 8, 12, 4], "textureOffset": [32, 16]}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -39, 0],
					"boxes": [
						{"coordinates": [-4, 39, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -39, 0],
					"boxes": [
						{"coordinates": [-4, 39, -4, 8, 8, 8], "textureOffset": [0, 16], "sizeAdd": -0.5}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -37, 0],
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
					"boxes": [
						{"coordinates": [-2, 0, -4.5, 4, 3, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "body2",
					"id": "body2",
					"invertAxis": "xy",
					"translate": [0, -4, 0],
					"boxes": [
						{"coordinates": [-3, 0, -2.5, 6, 4, 5], "textureOffset": [0, 5]}
					]
				},
				{
					"part": "body3",
					"id": "body3",
					"invertAxis": "xy",
					"translate": [0, -3, -3],
					"boxes": [
						{"coordinates": [-1.5, 0, 2.5, 3, 3, 1], "textureOffset": [0, 14]}
					]
				},
				{
					"part": "body4",
					"id": "body4",
					"invertAxis": "xy",
					"translate": [0, -2, -4],
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]},
						{"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
					]
				},
				{
					"part": "hat",
					"id": "hat",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.5}
					]
				},
				{
					"part": "nose",
					"id": "nose",
					"invertAxis": "xy",
					"translate": [0, -26, 0]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
					"boxes": [
						{"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
						{"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
					],
					"submodels": [
						{
							"id": "arms_flipped",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
							]
						}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [5, -22, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
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
					"translate": [-5, -12, 5],
					"boxes": [
						{"coordinates": [-5, 0, -5, 10, 12, 10], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "upper_jaw",
					"id": "upper_jaw",
					"invertAxis": "xy",
					"translate": [-2.5, -26, 4],
					"submodels": [
						{
							"id": "upper_jaw_rotation",
							"invertAxis": "xy",
							"translate": [0.5, 19, 0],
							"rotate": [-180, -180, 0],
							"boxes": [
								{"coordinates": [-2, -7, -4, 4, 14, 8], "textureOffset": [40, 0]}
							]
						}
					],
					"animations": [
						{
							"upper_jaw_rotation.rx": "0",
							"upper_jaw_rotation.ry": "0"
						}
					]
				},
				{
					"part": "lower_jaw",
					"id": "lower_jaw",
					"invertAxis": "xy",
					"translate": [-1.5, -26, 4],
					"submodels": [
						{
							"id": "lower_jaw_rotation",
							"invertAxis": "xy",
							"translate": [-0.5, 19, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-2, -7, -4, 4, 14, 8], "textureOffset": [40, 0]}
							]
						}
					],
					"animations": [
						{
							"lower_jaw_rotation.rx": "0"
						}
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
					"translate": [0, -16.5, -3.5],
					"submodels": [
						{
							"id": "body_rotation",
							"invertAxis": "xy",
							"translate": [0, 7.5, 3],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-3, -6, -3, 6, 11, 6], "textureOffset": [24, 15]}
							]
						}
					],
					"animations": [
						{
							"body_rotation.rx": "0"
						}
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
					"submodels": [
						{
							"id": "tail_rotation",
							"invertAxis": "xy",
							"translate": [0, 8.5, 11.5],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-2, -6.5, -2.5, 4, 9, 5], "textureOffset": [30, 0]}
							]
						}
					],
					"animations": [
						{
							"tail_rotation.rx": "0"
						}
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
					"boxes": [
						{"coordinates": [2.7, -8, -6, 2, 9, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle2",
					"id": "tentacle2",
					"invertAxis": "xy",
					"translate": [1.3, -1, 5],
					"boxes": [
						{"coordinates": [-7.3, -10, -6, 2, 11, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle3",
					"id": "tentacle3",
					"invertAxis": "xy",
					"translate": [6.3, -1, 5],
					"boxes": [
						{"coordinates": [-2.3, -12, -6, 2, 13, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle4",
					"id": "tentacle4",
					"invertAxis": "xy",
					"translate": [-6.3, -1, 0],
					"boxes": [
						{"coordinates": [5.3, -10, -1, 2, 11, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle5",
					"id": "tentacle5",
					"invertAxis": "xy",
					"translate": [-1.3, -1, 0],
					"boxes": [
						{"coordinates": [0.3, -10, -1, 2, 11, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle6",
					"id": "tentacle6",
					"invertAxis": "xy",
					"translate": [3.7, -1, 0],
					"boxes": [
						{"coordinates": [-4.7, -9, -1, 2, 10, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle7",
					"id": "tentacle7",
					"invertAxis": "xy",
					"translate": [-3.7, -1, -5],
					"boxes": [
						{"coordinates": [2.7, -11, 4, 2, 12, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle8",
					"id": "tentacle8",
					"invertAxis": "xy",
					"translate": [1.3, -1, -5],
					"boxes": [
						{"coordinates": [-7.3, -11, 4, 2, 12, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle9",
					"id": "tentacle9",
					"invertAxis": "xy",
					"translate": [6.3, -1, -5],
					"boxes": [
						{"coordinates": [-2.3, -8, 4, 2, 9, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -8, 0],
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
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
					"boxes": [
						{"coordinates": [-6, 2, -8, 12, 12, 16], "textureOffset": [0, 0]},
						{"coordinates": [-6, 14, -6, 12, 2, 12], "textureOffset": [16, 40]},
						{"coordinates": [-6, 0, -6, 12, 2, 12], "textureOffset": [16, 40]},
						{"coordinates": [6, 2, -6, 2, 12, 12], "textureOffset": [0, 28]}
					],
					"submodels": [
						{
							"id": "body_flipped",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 2, -6, 2, 12, 12], "textureOffset": [0, 28]}
							]
						}
					]
				},
				{
					"part": "eye",
					"id": "eye",
					"invertAxis": "xy",
					"translate": [0, -23.5, 8.25],
					"boxes": [
						{"coordinates": [-1, 6.5, -8.25, 2, 2, 1], "textureOffset": [8, 0]}
					]
				},
				{
					"part": "tail1",
					"id": "tail1",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-2, 6, 7, 4, 4, 8], "textureOffset": [40, 0]}
					]
				},
				{
					"part": "tail2",
					"id": "tail2",
					"invertAxis": "xy",
					"translate": [-1.5, -23.5, -14],
					"boxes": [
						{"coordinates": [-1.5, 6.5, 14, 3, 3, 7], "textureOffset": [0, 54]}
					]
				},
				{
					"part": "tail3",
					"id": "tail3",
					"invertAxis": "xy",
					"translate": [-1, -23, -20],
					"boxes": [
						{"coordinates": [-1, 7, 20, 2, 2, 6], "textureOffset": [41, 32]},
						{"coordinates": [-1, 3.5, 23, 1, 9, 9], "textureOffset": [25, 19]}
					]
				},
				{
					"part": "spine1",
					"id": "spine1",
					"invertAxis": "xy",
					"translate": [0, -17.5, -7],
					"submodels": [
						{
							"id": "spine1_rotation",
							"invertAxis": "xy",
							"translate": [0, 15, 7],
							"rotate": [45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine1_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine2",
					"id": "spine2",
					"invertAxis": "xy",
					"translate": [0, -17.5, 7],
					"submodels": [
						{
							"id": "spine2_rotation",
							"invertAxis": "xy",
							"translate": [0, 15, -7],
							"rotate": [-45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine2_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine3",
					"id": "spine3",
					"invertAxis": "xy",
					"translate": [7, -17.5, 0],
					"submodels": [
						{
							"id": "spine3_rotation",
							"invertAxis": "xy",
							"translate": [-7, 15, 0],
							"rotate": [0, 0, 45],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine3_rotation.rz": "0"
						}
					]
				},
				{
					"part": "spine4",
					"id": "spine4",
					"invertAxis": "xy",
					"translate": [-7, -17.5, 0],
					"submodels": [
						{
							"id": "spine4_rotation",
							"invertAxis": "xy",
							"translate": [7, 15, 0],
							"rotate": [0, 0, -45],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine4_rotation.rz": "0"
						}
					]
				},
				{
					"part": "spine5",
					"id": "spine5",
					"invertAxis": "xy",
					"translate": [-7, -5.5, 7],
					"submodels": [
						{
							"id": "spine5_rotation",
							"invertAxis": "xy",
							"translate": [7, 8, -7],
							"rotate": [90, -45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine5_rotation.rx": "0",
							"spine5_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine6",
					"id": "spine6",
					"invertAxis": "xy",
					"translate": [7, -5.5, 7],
					"submodels": [
						{
							"id": "spine6_rotation",
							"invertAxis": "xy",
							"translate": [-7, 8, -7],
							"rotate": [90, 45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine6_rotation.rx": "0",
							"spine6_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine7",
					"id": "spine7",
					"invertAxis": "xy",
					"translate": [7, -5.5, -7],
					"submodels": [
						{
							"id": "spine7_rotation",
							"invertAxis": "xy",
							"translate": [-7, 8, 7],
							"rotate": [-90, -45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine7_rotation.rx": "0",
							"spine7_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine8",
					"id": "spine8",
					"invertAxis": "xy",
					"translate": [-7, -5.5, -7],
					"submodels": [
						{
							"id": "spine8_rotation",
							"invertAxis": "xy",
							"translate": [7, 8, 7],
							"rotate": [-90, 45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine8_rotation.rx": "0",
							"spine8_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine9",
					"id": "spine9",
					"invertAxis": "xy",
					"translate": [0, 1.5, -7],
					"submodels": [
						{
							"id": "spine9_rotation",
							"invertAxis": "xy",
							"translate": [0, 1, 7],
							"rotate": [-45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine9_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine10",
					"id": "spine10",
					"invertAxis": "xy",
					"translate": [0, 1.5, 7],
					"submodels": [
						{
							"id": "spine10_rotation",
							"invertAxis": "xy",
							"translate": [0, 1, -7],
							"rotate": [45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine10_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine11",
					"id": "spine11",
					"invertAxis": "xy",
					"translate": [7, 1.5, 0],
					"submodels": [
						{
							"id": "spine11_rotation",
							"invertAxis": "xy",
							"translate": [-7, 1, 0],
							"rotate": [0, 0, -45],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine11_rotation.rz": "0"
						}
					]
				},
				{
					"part": "spine12",
					"id": "spine12",
					"invertAxis": "xy",
					"translate": [-7, 1.5, 0],
					"submodels": [
						{
							"id": "spine12_rotation",
							"invertAxis": "xy",
							"translate": [7, 1, 0],
							"rotate": [0, 0, 45],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine12_rotation.rz": "0"
						}
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
					"boxes": [
						{
							"coordinates": [-5, 11, -11, 10, 10, 22],
							"uvNorth": [22, 54, 32, 64],
							"uvEast": [0, 54, 22, 64],
							"uvSouth": [54, 54, 64, 64],
							"uvWest": [32, 54, 54, 64],
							"uvUp": [32, 54, 22, 32],
							"uvDown": [42, 32, 32, 54],
							"sizeAdd": 0.05
						}
					]
				},
				{
					"part": "neck",
					"id": "neck",
					"invertAxis": "xy",
					"translate": [0, -22, 8.9],
					"boxes": [
						{
							"coordinates": [-2, 16, -11, 4, 12, 7],
							"uvNorth": [7, 42, 11, 54],
							"uvEast": [0, 42, 7, 54],
							"uvSouth": [18, 42, 22, 54],
							"uvWest": [11, 42, 18, 54],
							"uvUp": [11, 42, 7, 35],
							"uvDown": [15, 35, 11, 42]
						}
					]
				},
				{
					"part": "back_left_leg",
					"id": "back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, 0, 7, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, 0, 7, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [1, 0, -11, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [-5, 0, -11, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -21, -11],
					"boxes": [
						{
							"coordinates": [-1.5, 7, 11, 3, 14, 4],
							"uvNorth": [46, 40, 49, 54],
							"uvEast": [42, 40, 46, 54],
							"uvSouth": [53, 40, 56, 54],
							"uvWest": [49, 40, 53, 54],
							"uvUp": [49, 40, 46, 36],
							"uvDown": [52, 36, 49, 40]
						}
					]
				},
				{
					"part": "saddle",
					"id": "saddle",
					"invertAxis": "xy",
					"translate": [0, -13, -6],
					"boxes": [
						{
							"coordinates": [-5, 12, -3.5, 10, 9, 9],
							"uvNorth": [35, 9, 45, 18],
							"uvEast": [26, 9, 35, 18],
							"uvSouth": [54, 9, 64, 18],
							"uvWest": [45, 9, 54, 18],
							"uvUp": [45, 9, 35, 0],
							"uvDown": [55, 0, 45, 9],
							"sizeAdd": 0.5
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 20, 13, 25],
							"uvEast": [0, 20, 7, 25],
							"uvSouth": [20, 20, 26, 25],
							"uvWest": [13, 20, 20, 25],
							"uvUp": [13, 20, 7, 13],
							"uvDown": [19, 13, 13, 20]
						}
					]
				},
				{
					"part": "mouth",
					"id": "mouth",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -16, 4, 5, 5],
							"uvNorth": [5, 30, 9, 35],
							"uvEast": [0, 30, 5, 35],
							"uvSouth": [14, 30, 18, 35],
							"uvWest": [9, 30, 14, 35],
							"uvUp": [9, 30, 5, 25],
							"uvDown": [13, 25, 9, 30]
						}
					]
				},
				{
					"part": "left_ear",
					"id": "left_ear",
					"invertAxis": "xy",
					"translate": [0, -23, 9],
					"boxes": [
						{
							"coordinates": [0.5, 33, -5.01, 2, 3, 1],
							"uvNorth": [20, 17, 22, 20],
							"uvEast": [19, 17, 20, 20],
							"uvSouth": [23, 17, 25, 20],
							"uvWest": [22, 17, 23, 20],
							"uvUp": [22, 17, 20, 16],
							"uvDown": [24, 16, 22, 17]
						}
					]
				},
				{
					"part": "right_ear",
					"id": "right_ear",
					"invertAxis": "xy",
					"translate": [0, -23, 9],
					"boxes": [
						{
							"coordinates": [-2.5, 33, -5.01, 2, 3, 1],
							"uvNorth": [20, 17, 22, 20],
							"uvEast": [19, 17, 20, 20],
							"uvSouth": [23, 17, 25, 20],
							"uvWest": [22, 17, 23, 20],
							"uvUp": [22, 17, 20, 16],
							"uvDown": [24, 16, 22, 17]
						}
					]
				},
				{
					"part": "left_bit",
					"id": "left_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [2, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "right_bit",
					"id": "right_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "left_rein",
					"id": "left_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "right_rein",
					"id": "right_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [-3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "headpiece",
					"id": "headpiece",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 7, 13, 12],
							"uvEast": [0, 7, 7, 12],
							"uvSouth": [20, 7, 26, 12],
							"uvWest": [13, 7, 20, 12],
							"uvUp": [13, 7, 7, 0],
							"uvDown": [19, 0, 13, 7],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "noseband",
					"id": "noseband",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -13, 4, 5, 2],
							"uvNorth": [21, 2, 25, 7],
							"uvEast": [19, 2, 21, 7],
							"uvSouth": [27, 2, 31, 7],
							"uvWest": [25, 2, 27, 7],
							"uvUp": [25, 2, 21, 0],
							"uvDown": [29, 0, 25, 2],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "mane",
					"id": "mane",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-1, 17, -4, 2, 16, 2],
							"uvNorth": [58, 38, 60, 54],
							"uvEast": [56, 38, 58, 54],
							"uvSouth": [62, 38, 64, 54],
							"uvWest": [60, 38, 62, 54],
							"uvUp": [60, 38, 58, 36],
							"uvDown": [62, 36, 60, 38]
						}
					]
				},
				{
					"part": "child_back_left_leg",
					"id": "child_back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, -5.5, 7, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_back_right_leg",
					"id": "child_back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, -5.5, 7, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "child_front_left_leg",
					"id": "child_front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9],
					"boxes": [
						{
							"coordinates": [-5, -5.5, -11, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_front_right_leg",
					"id": "child_front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9],
					"boxes": [
						{
							"coordinates": [1, -5.5, -11, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
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
					"mirrorTexture": "u",
					"translate": [5, -22, 0],
					"boxes": [
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"mirrorTexture": "u",
					"translate": [1.9, -12, 0],
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-1.9, -12, 0],
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]},
						{"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]},
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.5}
					]
				},
				{
					"part": "hat",
					"id": "hat"
				},
				{
					"part": "nose",
					"id": "nose"
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
					"boxes": [
						{"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
						{"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
					],
					"submodels": [
						{
							"id": "arms_flipped",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
							]
						}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [5, -22, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
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
					"boxes": [
						{"coordinates": [9, 3.5, -3, 4, 30, 6], "textureOffset": [60, 21]}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [0, -31, 0],
					"boxes": [
						{"coordinates": [-13, 3.5, -3, 4, 30, 6], "textureOffset": [60, 58]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [5, -13, 0],
					"boxes": [
						{"coordinates": [1.5, 0, -3, 6, 16, 5], "textureOffset": [37, 0]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [-4, -13, 0],
					"boxes": [
						{"coordinates": [-7.5, 0, -3, 6, 16, 5], "textureOffset": [60, 0]}
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
					"submodels": [
						{
							"id": "body_rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-6, -8, -7, 12, 18, 10], "textureOffset": [29, 0]}
							]
						}
					],
					"animations": [
						{
							"body_rotation.rx": "0"
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-3.5, -14, -6],
					"boxes": [
						{"coordinates": [-5.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [3.5, -14, -6],
					"boxes": [
						{"coordinates": [1.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-3.5, -14, 5],
					"boxes": [
						{"coordinates": [-5.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [3.5, -14, 5],
					"boxes": [
						{"coordinates": [1.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "chest_left",
					"id": "chest_left",
					"invertAxis": "xy",
					"translate": [8.5, -21, -3],
					"submodels": [
						{
							"id": "chest_left_rotation",
							"invertAxis": "xy",
							"translate": [-7, 17, 4.5],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-6.5, -4, -1.5, 8, 8, 3], "textureOffset": [45, 41]}
							]
						}
					],
					"animations": [
						{
							"chest_left_rotation.ry": "0"
						}
					]
				},
				{
					"part": "chest_right",
					"id": "chest_right",
					"invertAxis": "xy",
					"translate": [-10.5, -21, 2],
					"submodels": [
						{
							"id": "chest_right_rotation",
							"invertAxis": "xy",
							"translate": [7, 17, -0.5],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-1.5, -4, -1.5, 8, 8, 3], "textureOffset": [45, 28]}
							]
						}
					],
					"animations": [
						{
							"chest_right_rotation.ry": "0"
						}
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
					"boxes": [
						{"coordinates": [-4, 7, -4, 8, 1, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "segment2",
					"id": "segment2",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 6, -4, 8, 1, 8], "textureOffset": [0, 1]}
					]
				},
				{
					"part": "segment3",
					"id": "segment3",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 5, -4, 8, 1, 8], "textureOffset": [24, 10]}
					]
				},
				{
					"part": "segment4",
					"id": "segment4",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 4, -4, 8, 1, 8], "textureOffset": [24, 19]}
					]
				},
				{
					"part": "segment5",
					"id": "segment5",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 3, -4, 8, 1, 8], "textureOffset": [0, 4]}
					]
				},
				{
					"part": "segment6",
					"id": "segment6",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 2, -4, 8, 1, 8], "textureOffset": [0, 5]}
					]
				},
				{
					"part": "segment7",
					"id": "segment7",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 1, -4, 8, 1, 8], "textureOffset": [0, 6]}
					]
				},
				{
					"part": "segment8",
					"id": "segment8",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 0, -4, 8, 1, 8], "textureOffset": [0, 7]}
					]
				},
				{
					"part": "core",
					"id": "core",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "back2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "right2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "left2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 90],
							"boxes": [
								{"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
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
					"rotate": [-180, -180, -180]
				},
				{
					"part": "right",
					"id": "right",
					"invertAxis": "xy",
					"translate": [0, -25, 7]
				},
				{
					"part": "left",
					"id": "left",
					"invertAxis": "xy",
					"translate": [0, -25, -7]
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
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-6, -8, -7, 12, 18, 10], "textureOffset": [18, 4]},
								{"coordinates": [-2, -8, -8, 4, 6, 1], "textureOffset": [52, 0]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -20, 8],
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
					"boxes": [
						{"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [4, -12, -7],
					"boxes": [
						{"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-4, -12, 6],
					"boxes": [
						{"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4, -12, 6],
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
					"boxes": [
						{
							"coordinates": [-5, 11, -11, 10, 10, 22],
							"uvNorth": [22, 54, 32, 64],
							"uvEast": [0, 54, 22, 64],
							"uvSouth": [54, 54, 64, 64],
							"uvWest": [32, 54, 54, 64],
							"uvUp": [32, 54, 22, 32],
							"uvDown": [42, 32, 32, 54],
							"sizeAdd": 0.05
						}
					]
				},
				{
					"part": "neck",
					"id": "neck",
					"invertAxis": "xy",
					"translate": [0, -22, 8.9],
					"boxes": [
						{
							"coordinates": [-2, 16, -11, 4, 12, 7],
							"uvNorth": [7, 42, 11, 54],
							"uvEast": [0, 42, 7, 54],
							"uvSouth": [18, 42, 22, 54],
							"uvWest": [11, 42, 18, 54],
							"uvUp": [11, 42, 7, 35],
							"uvDown": [15, 35, 11, 42]
						}
					]
				},
				{
					"part": "back_left_leg",
					"id": "back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, 0, 7, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, 0, 7, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [1, 0, -11, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [-5, 0, -11, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -21, -11],
					"boxes": [
						{
							"coordinates": [-1.5, 7, 11, 3, 14, 4],
							"uvNorth": [46, 40, 49, 54],
							"uvEast": [42, 40, 46, 54],
							"uvSouth": [53, 40, 56, 54],
							"uvWest": [49, 40, 53, 54],
							"uvUp": [49, 40, 46, 36],
							"uvDown": [52, 36, 49, 40]
						}
					]
				},
				{
					"part": "saddle",
					"id": "saddle",
					"invertAxis": "xy",
					"translate": [0, -13, -6],
					"boxes": [
						{
							"coordinates": [-5, 12, -3.5, 10, 9, 9],
							"uvNorth": [35, 9, 45, 18],
							"uvEast": [26, 9, 35, 18],
							"uvSouth": [54, 9, 64, 18],
							"uvWest": [45, 9, 54, 18],
							"uvUp": [45, 9, 35, 0],
							"uvDown": [55, 0, 45, 9],
							"sizeAdd": 0.5
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 20, 13, 25],
							"uvEast": [0, 20, 7, 25],
							"uvSouth": [20, 20, 26, 25],
							"uvWest": [13, 20, 20, 25],
							"uvUp": [13, 20, 7, 13],
							"uvDown": [19, 13, 13, 20]
						}
					]
				},
				{
					"part": "mouth",
					"id": "mouth",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -16, 4, 5, 5],
							"uvNorth": [5, 30, 9, 35],
							"uvEast": [0, 30, 5, 35],
							"uvSouth": [14, 30, 18, 35],
							"uvWest": [9, 30, 14, 35],
							"uvUp": [9, 30, 5, 25],
							"uvDown": [13, 25, 9, 30]
						}
					]
				},
				{
					"part": "left_ear",
					"id": "left_ear",
					"invertAxis": "xy",
					"translate": [-1.5, -31.9, 4.5],
					"boxes": [
						{
							"coordinates": [0.5, 32, -5, 2, 7, 1],
							"uvNorth": [1, 13, 3, 20],
							"uvEast": [0, 13, 1, 20],
							"uvSouth": [4, 13, 6, 20],
							"uvWest": [3, 13, 4, 20],
							"uvUp": [3, 13, 1, 12],
							"uvDown": [5, 12, 3, 13]
						}
					]
				},
				{
					"part": "right_ear",
					"id": "right_ear",
					"invertAxis": "xy",
					"translate": [1.5, -31.9, 4.5],
					"boxes": [
						{
							"coordinates": [-2.5, 32, -5, 2, 7, 1],
							"uvNorth": [1, 13, 3, 20],
							"uvEast": [0, 13, 1, 20],
							"uvSouth": [4, 13, 6, 20],
							"uvWest": [3, 13, 4, 20],
							"uvUp": [3, 13, 1, 12],
							"uvDown": [5, 12, 3, 13]
						}
					]
				},
				{
					"part": "left_bit",
					"id": "left_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [2, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "right_bit",
					"id": "right_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "left_rein",
					"id": "left_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "right_rein",
					"id": "right_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [-3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "headpiece",
					"id": "headpiece",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 7, 13, 12],
							"uvEast": [0, 7, 7, 12],
							"uvSouth": [20, 7, 26, 12],
							"uvWest": [13, 7, 20, 12],
							"uvUp": [13, 7, 7, 0],
							"uvDown": [19, 0, 13, 7],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "noseband",
					"id": "noseband",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -13, 4, 5, 2],
							"uvNorth": [21, 2, 25, 7],
							"uvEast": [19, 2, 21, 7],
							"uvSouth": [27, 2, 31, 7],
							"uvWest": [25, 2, 27, 7],
							"uvUp": [25, 2, 21, 0],
							"uvDown": [29, 0, 25, 2],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "mane",
					"id": "mane",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-1, 17, -4, 2, 16, 2],
							"uvNorth": [58, 38, 60, 54],
							"uvEast": [56, 38, 58, 54],
							"uvSouth": [62, 38, 64, 54],
							"uvWest": [60, 38, 62, 54],
							"uvUp": [60, 38, 58, 36],
							"uvDown": [62, 36, 60, 38]
						}
					]
				},
				{
					"part": "child_back_left_leg",
					"id": "child_back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, -5.5, 7, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_back_right_leg",
					"id": "child_back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, -5.5, 7, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "child_front_left_leg",
					"id": "child_front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9],
					"boxes": [
						{
							"coordinates": [-5, -5.5, -11, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_front_right_leg",
					"id": "child_front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9],
					"boxes": [
						{
							"coordinates": [1, -5.5, -11, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "left_chest",
					"id": "left_chest",
					"invertAxis": "xy",
					"translate": [9, -21, -4],
					"submodels": [
						{
							"id": "left_chest_rotation",
							"invertAxis": "xy",
							"translate": [-6.5, 17, 3.5],
							"rotate": [0, 90, 0],
							"boxes": [
								{
									"coordinates": [-6.5, -4, -1.5, 8, 8, 3],
									"uvNorth": [29, 24, 37, 32],
									"uvEast": [26, 24, 29, 32],
									"uvSouth": [40, 24, 48, 32],
									"uvWest": [37, 24, 40, 32],
									"uvUp": [29, 21, 37, 24],
									"uvDown": [37, 21, 45, 24]
								}
							]
						}
					],
					"animations": [
						{
							"left_chest_rotation.y": "0"
						}
					]
				},
				{
					"part": "right_chest",
					"id": "right_chest",
					"invertAxis": "xy",
					"translate": [-9, -21, -4],
					"submodels": [
						{
							"id": "right_chest_rotation",
							"invertAxis": "xy",
							"translate": [6.5, 17, 3.5],
							"rotate": [0, -90, 0],
							"boxes": [
								{
									"coordinates": [-1.5, -4, -1.5, 8, 8, 3],
									"uvNorth": [29, 24, 37, 32],
									"uvEast": [26, 24, 29, 32],
									"uvSouth": [40, 24, 48, 32],
									"uvWest": [37, 24, 40, 32],
									"uvUp": [29, 21, 37, 24],
									"uvDown": [37, 21, 45, 24]
								}
							]
						}
					],
					"animations": [
						{
							"right_chest_rotation.y": "0"
						}
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
					"boxes": [
						{"coordinates": [0.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-1.1, -6, -5],
					"boxes": [
						{"coordinates": [-2.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [1.2, -10, 5],
					"boxes": [
						{"coordinates": [0.2, 0, -5, 2, 10, 2], "textureOffset": [40, 0]}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-1.2, -10, 5],
					"boxes": [
						{"coordinates": [-2.2, 0, -5, 2, 10, 2], "textureOffset": [40, 0]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -9.5, -9],
					"boxes": [
						{"coordinates": [-0.5, 1.5, 9, 1, 8, 1], "textureOffset": [0, 15]}
					]
				},
				{
					"part": "tail2",
					"id": "tail2",
					"invertAxis": "xy",
					"translate": [0, -1.5, -9],
					"boxes": [
						{"coordinates": [-0.5, -6.5, 9, 1, 8, 1], "textureOffset": [4, 15]}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -9, 9],
					"boxes": [
						{"coordinates": [-2.5, 7, -12, 5, 4, 5], "textureOffset": [0, 0]},
						{"coordinates": [-1.5, 7.02, -13, 3, 2, 2], "textureOffset": [0, 24]},
						{"coordinates": [1, 11, -9, 1, 1, 2], "textureOffset": [0, 10]},
						{"coordinates": [-2, 11, -9, 1, 1, 2], "textureOffset": [6, 10]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -18, -6.1],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 1],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-2, -8, -2.9, 4, 16, 6], "textureOffset": [20, 0]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
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
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 14, 0],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-9.5, -13, -6.5, 19, 26, 13], "textureOffset": [0, 25]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
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
					"translate": [0, -8, 0.5],
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
					"boxes": [
						{"coordinates": [-1.5, 1.5, -2.5, 3, 6, 3], "textureOffset": [2, 8]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -2.9, -1.2],
					"boxes": [
						{"coordinates": [-1.5, -0.1, 0.2, 3, 4, 1], "textureOffset": [22, 1]}
					]
				},
				{
					"part": "left_wing",
					"id": "left_wing",
					"invertAxis": "xy",
					"translate": [-1.5, -7.1, 0.8],
					"boxes": [
						{"coordinates": [1, 2.1, -2.3, 1, 5, 3], "textureOffset": [19, 8]}
					]
				},
				{
					"part": "right_wing",
					"id": "right_wing",
					"invertAxis": "xy",
					"translate": [1.5, -7.1, 0.8],
					"boxes": [
						{"coordinates": [-2, 2.1, -2.3, 1, 5, 3], "textureOffset": [19, 8]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [1, -2, 1],
					"boxes": [
						{"coordinates": [0.5, 0, -1.5, 1, 2, 1], "textureOffset": [14, 18]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-1, -2, 1],
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
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 13, 2],
							"rotate": [-90, 0, 0],
							"submodels": [
								{
									"invertAxis": "xy",
									"boxes": [
										{"coordinates": [-5, -6, -7, 10, 16, 8], "textureOffset": [28, 8]}
									]
								}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -12, 6],
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
					"boxes": [
						{"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [3, -6, -7],
					"boxes": [
						{"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-3, -6, 5],
					"boxes": [
						{"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [3, -6, 5],
					"boxes": [
						{"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
					]
				}
			]
		}`
	}
    EntityOptions.piglin = {
		name: 'Piglin',
		model: `{
            "textureSize": [64, 64],
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
                    "part": "headwear",
                    "id": "headwear",
                    "invertAxis": "xy",
                    "translate": [0, 0, 0]
                },
                {
                    "part": "body",
                    "id": "body",
                    "invertAxis": "xy",
                    "translate": [0, -24, 0],
                    "boxes": [
                        {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]},
                        {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_arm",
                    "id": "left_arm",
                    "invertAxis": "xy",
                    "translate": [5, -22, 0],
                    "boxes": [
                        {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [32, 48]},
                        {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [48, 48], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "right_arm",
                    "id": "right_arm",
                    "invertAxis": "xy",
                    "translate": [-5, -22, 0],
                    "boxes": [
                        {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]},
                        {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_leg",
                    "id": "left_leg",
                    "invertAxis": "xy",
                    "translate": [2, -12, 0],
                    "boxes": [
                        {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [16, 48]},
                        {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 48], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "right_leg",
                    "id": "right_leg",
                    "invertAxis": "xy",
                    "translate": [-2, -12, 0],
                    "boxes": [
                        {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]},
                        {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_ear",
                    "id": "left_ear",
                    "invertAxis": "xy",
                    "translate": [5.25, -30, 0],
                    "boxes": [
                        {"coordinates": [-6, 25, -2, 1, 5, 4], "textureOffset": [51, 6]}
                    ]
                },
                {
                    "part": "right_ear",
                    "id": "right_ear",
                    "invertAxis": "xy",
                    "translate": [-5.5, -30, 0],
                    "boxes": [
                        {"coordinates": [5, 25, -2, 1, 5, 4], "textureOffset": [39, 6]}
                    ]
                }
            ]
        }`
	}
    EntityOptions.piglin_brute = {
		name: 'Piglin Brute',
		model: `{
            "textureSize": [64, 64],
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
                    "part": "headwear",
                    "id": "headwear",
                    "invertAxis": "xy",
                    "translate": [0, 0, 0]
                },
                {
                    "part": "body",
                    "id": "body",
                    "invertAxis": "xy",
                    "translate": [0, -24, 0],
                    "boxes": [
                        {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]},
                        {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_arm",
                    "id": "left_arm",
                    "invertAxis": "xy",
                    "translate": [5, -22, 0],
                    "boxes": [
                        {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [32, 48]},
                        {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [48, 48], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "right_arm",
                    "id": "right_arm",
                    "invertAxis": "xy",
                    "translate": [-5, -22, 0],
                    "boxes": [
                        {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]},
                        {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_leg",
                    "id": "left_leg",
                    "invertAxis": "xy",
                    "translate": [2, -12, 0],
                    "boxes": [
                        {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [16, 48]},
                        {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 48], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "right_leg",
                    "id": "right_leg",
                    "invertAxis": "xy",
                    "translate": [-2, -12, 0],
                    "boxes": [
                        {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]},
                        {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_ear",
                    "id": "left_ear",
                    "invertAxis": "xy",
                    "translate": [5.25, -30, 0],
                    "boxes": [
                        {"coordinates": [-6, 25, -2, 1, 5, 4], "textureOffset": [51, 6]}
                    ]
                },
                {
                    "part": "right_ear",
                    "id": "right_ear",
                    "invertAxis": "xy",
                    "translate": [-5.5, -30, 0],
                    "boxes": [
                        {"coordinates": [5, 25, -2, 1, 5, 4], "textureOffset": [39, 6]}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]},
						{"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]},
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
					]
				},
				{
					"part": "nose",
					"id": "nose"
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
					]
				}
			]
		}`
	}
	EntityOptions.head_player = {
		name: 'Player Head',
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
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 15, 12],
							"rotate": [-90, 0, 0],
							"submodels": [
								{
									"invertAxis": "xy",
									"boxes": [
										{"coordinates": [-7, -1, -7, 14, 14, 11], "textureOffset": [0, 19]},
										{"coordinates": [-6, 13, -7, 12, 12, 10], "textureOffset": [39, 0]}
									]
								}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-4.5, -10, -6],
					"boxes": [
						{"coordinates": [-6.5, 0, 4, 4, 10, 8], "textureOffset": [50, 22]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [4.5, -10, -6],
					"boxes": [
						{"coordinates": [2.5, 0, 4, 4, 10, 8], "textureOffset": [50, 22]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-3.5, -10, 8],
					"boxes": [
						{"coordinates": [-5.5, 0, -10, 4, 10, 6], "textureOffset": [50, 40]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [3.5, -10, 8],
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
					"boxes": [
						{"coordinates": [-4, 0, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "fin_left",
					"id": "fin_left",
					"invertAxis": "xy",
					"translate": [4, -7, 2],
					"boxes": [
						{"coordinates": [-6, 6, -2.99, 2, 1, 2], "textureOffset": [24, 0]}
					]
				},
				{
					"part": "fin_right",
					"id": "fin_right",
					"invertAxis": "xy",
					"translate": [-4, -7, 2],
					"boxes": [
						{"coordinates": [4, 6, -2.99, 2, 1, 2], "textureOffset": [24, 3]}
					]
				},
				{
					"part": "spikes_front_top",
					"id": "spikes_front_top",
					"invertAxis": "xy",
					"translate": [0, -8, 4],
					"boxes": [
						{"coordinates": [-4, 8, -4, 8, 1, 1], "textureOffset": [14, 16]}
					]
				},
				{
					"part": "spikes_middle_top",
					"id": "spikes_middle_top",
					"invertAxis": "xy",
					"translate": [0, -8, 0],
					"boxes": [
						{"coordinates": [-4, 8, 0, 8, 1, 1], "textureOffset": [14, 16]}
					]
				},
				{
					"part": "spikes_back_top",
					"id": "spikes_back_top",
					"invertAxis": "xy",
					"translate": [0, -8, -4],
					"boxes": [
						{"coordinates": [-4, 8, 4, 8, 1, 1], "textureOffset": [14, 16]}
					]
				},
				{
					"part": "spikes_front_right",
					"id": "spikes_front_right",
					"invertAxis": "xy",
					"translate": [-7.25, 0, -4],
					"boxes": [
						{"coordinates": [-5, 0, 4, 1, 8, 1], "textureOffset": [4, 16]}
					]
				},
				{
					"part": "spikes_front_left",
					"id": "spikes_front_left",
					"invertAxis": "xy",
					"translate": [7.25, 0, -4],
					"boxes": [
						{"coordinates": [4, 0, 4, 1, 8, 1], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "spikes_front_bottom",
					"id": "spikes_front_bottom",
					"invertAxis": "xy",
					"translate": [0, 0, 4],
					"boxes": [
						{"coordinates": [-4, -1, -4, 8, 1, 1], "textureOffset": [14, 19]}
					]
				},
				{
					"part": "spikes_middle_bottom",
					"id": "spikes_middle_bottom",
					"invertAxis": "xy",
					"translate": [0, 0, -4],
					"boxes": [
						{"coordinates": [-4, -1, 4, 8, 1, 1], "textureOffset": [14, 19]}
					]
				},
				{
					"part": "spikes_back_bottom",
					"id": "spikes_back_bottom",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"submodels": [
						{
							"id": "bone",
							"invertAxis": "xy",
							"translate": [0, -0.5, 0.5],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-4, -0.5, -0.5, 8, 1, 1], "textureOffset": [14, 20]}
							]
						}
					]
				},
				{
					"part": "spikes_back_right",
					"id": "spikes_back_right",
					"invertAxis": "xy",
					"translate": [-7.25, 0, 4],
					"boxes": [
						{"coordinates": [-5, 0, -4, 1, 8, 1], "textureOffset": [8, 16]}
					]
				},
				{
					"part": "spikes_back_left",
					"id": "spikes_back_left",
					"invertAxis": "xy",
					"translate": [7.25, 0, 4],
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
					"boxes": [
						{"coordinates": [2.5, 5, -1.49, 2, 1, 2], "textureOffset": [24, 3]}
					]
				},
				{
					"part": "fin_left",
					"id": "fin_left",
					"invertAxis": "xy",
					"translate": [2.5, -6, 1.5],
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
					"boxes": [
						{"coordinates": [-1.5, 0, -1.5, 3, 2, 3], "textureOffset": [0, 27]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -1, -1.5],
					"boxes": [
						{"coordinates": [-1.5, 1, 1.5, 3, 0, 3], "textureOffset": [-3, 0]}
					]
				},
				{
					"part": "fin_right",
					"id": "fin_right",
					"invertAxis": "xy",
					"translate": [-1.5, -1, 1.5],
					"boxes": [
						{"coordinates": [1.5, 0, -1.49, 1, 1, 2], "textureOffset": [25, 0]}
					]
				},
				{
					"part": "fin_left",
					"id": "fin_left",
					"invertAxis": "xy",
					"translate": [1.5, -1, 1.5],
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
					"translate": [3, -8.5, -6.2],
					"boxes": [
						{"coordinates": [2, 2, 2.5, 2, 1, 7], "textureOffset": [26, 24]}
					]
				},
				{
					"part": "right_foot",
					"id": "right_foot",
					"invertAxis": "xy",
					"translate": [-3, -8.5, -6.2],
					"boxes": [
						{"coordinates": [-4, 2, 2.5, 2, 1, 7], "textureOffset": [8, 24]}
					]
				},
				{
					"part": "left_thigh",
					"id": "left_thigh",
					"invertAxis": "xy",
					"translate": [3, -7, -4.5],
					"boxes": [
						{"coordinates": [2, 3, 4.5, 2, 4, 5], "textureOffset": [16, 15]}
					]
				},
				{
					"part": "right_thigh",
					"id": "right_thigh",
					"invertAxis": "xy",
					"translate": [-3, -7, -4.5],
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
					"boxes": [
						{"coordinates": [2, 0, -2, 2, 7, 2], "textureOffset": [8, 15]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-3, -7, 1],
					"boxes": [
						{"coordinates": [-4, 0, -2, 2, 7, 2], "textureOffset": [0, 15]}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -8, 1],
					"boxes": [
						{"coordinates": [-2.5, 8, -6, 5, 4, 5], "textureOffset": [32, 0]}
					]
				},
				{
					"part": "right_ear",
					"id": "right_ear",
					"invertAxis": "xy",
					"translate": [0, -8, 1],
					"boxes": [
						{"coordinates": [0.5, 12, -2, 2, 5, 1], "textureOffset": [52, 0]}
					]
				},
				{
					"part": "left_ear",
					"id": "left_ear",
					"invertAxis": "xy",
					"translate": [0, -8, 1],
					"boxes": [
						{"coordinates": [-2.5, 12, -2, 2, 5, 1], "textureOffset": [58, 0]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -7.75, -9],
					"boxes": [
						{"coordinates": [-1.5, 6.25, 9, 3, 3, 2], "textureOffset": [52, 6]}
					]
				},
				{
					"part": "nose",
					"id": "nose",
					"invertAxis": "xy",
					"translate": [0, -8, 1],
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
								{"coordinates": [3, 0, -1, 2, 14, 4], "textureOffset": [74, 55]}
							],
							"submodels": [
								{
									"id": "left_horn",
									"invertAxis": "xy",
									"translate": [-5, -27, 19],
									"mirrorTexture": "u",
									"boxes": [
										{"coordinates": [-10, 27, -20, 2, 14, 4], "textureOffset": [74, 55]}
									]
								}
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
					"translate": [0, -23, -3.5],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 23, 3.5],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-7, -6, -7, 14, 16, 20], "textureOffset": [0, 55]},
								{"coordinates": [-6, -19, -7, 12, 13, 18], "textureOffset": [0, 91]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
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
					"mirrorTexture": "u",
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
					"mirrorTexture": "u",
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
					"boxes": [
						{"coordinates": [-1.5, 3.5, -4, 3, 5, 8], "textureOffset": [0, 0]}
					],
					"submodels": [
						{
							"id": "bone",
							"invertAxis": "xy",
							"translate": [1.5, 4.5, -4],
							"rotate": [90, 0, -45],
							"boxes": [
								{"coordinates": [0, 0, 0, 2, 2, 0], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "bone2",
							"invertAxis": "xy",
							"translate": [-1.5, 4.5, -4],
							"rotate": [90, 0, 45],
							"boxes": [
								{"coordinates": [-2, 0, 0, 2, 2, 0], "textureOffset": [4, 0]}
							]
						}
					]
				},
				{
					"part": "body_back",
					"id": "body_back",
					"invertAxis": "xy",
					"translate": [0, -6, -4],
					"boxes": [
						{"coordinates": [-1.5, 3.5, 4, 3, 5, 8], "textureOffset": [0, 13]}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -6, 4],
					"boxes": [
						{"coordinates": [-1, 4, -7, 2, 4, 3], "textureOffset": [22, 0]}
					]
				},
				{
					"part": "fin_back_1",
					"id": "fin_back_1",
					"invertAxis": "xy",
					"translate": [0, -10.5, -1],
					"boxes": [
						{"coordinates": [0, 8.5, 2, 0, 2, 2], "textureOffset": [4, 2]}
					]
				},
				{
					"part": "fin_back_2",
					"id": "fin_back_2",
					"invertAxis": "xy",
					"translate": [0, -10.5, -3],
					"boxes": [
						{"coordinates": [0, 8.5, 4, 0, 2, 3], "textureOffset": [2, 3]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -6, -12],
					"boxes": [
						{"coordinates": [0, 3.5, 12, 0, 5, 6], "textureOffset": [20, 10]}
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
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-4, -6, -7, 8, 16, 6], "textureOffset": [28, 8]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -18, 8],
					"boxes": [
						{"coordinates": [-3, 16, -14, 6, 6, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-3, -12, -7],
					"boxes": [
						{"coordinates": [1, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [3, -12, -7],
					"boxes": [
						{"coordinates": [-5, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-3, -12, 5],
					"boxes": [
						{"coordinates": [1, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [3, -12, 5],
					"boxes": [
						{"coordinates": [-5, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
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
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-4, -6, -7, 8, 16, 6], "textureOffset": [28, 8], "sizeAdd": 1.75}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -18, 8],
					"boxes": [
						{"coordinates": [-3, 16, -12, 6, 6, 6], "textureOffset": [0, 0], "sizeAdd": 0.6}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-3, -12, -7],
					"boxes": [
						{"coordinates": [1, 6, 5, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [3, -12, -7],
					"boxes": [
						{"coordinates": [-5, 6, 5, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-3, -12, 5],
					"boxes": [
						{"coordinates": [1, 6, -7, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [3, -12, 5],
					"boxes": [
						{"coordinates": [-5, 6, -7, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
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
					"boxes": [
						{"coordinates": [-8, 4, -8, 16, 12, 16], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"boxes": [
						{"coordinates": [-8, 0, -8, 16, 8, 16], "textureOffset": [0, 28]}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -12, 0],
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
					"boxes": [
						{"coordinates": [-8, 4, -8, 16, 12, 16], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
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
					"boxes": [
						{"coordinates": [-1.5, 0, -4.5, 3, 2, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "body2",
					"id": "body2",
					"invertAxis": "xy",
					"translate": [0, -3, 1.5],
					"boxes": [
						{"coordinates": [-2, 0, -2.5, 4, 3, 2], "textureOffset": [0, 4]}
					]
				},
				{
					"part": "body3",
					"id": "body3",
					"invertAxis": "xy",
					"translate": [0, -4, -1],
					"boxes": [
						{"coordinates": [-3, 0, -0.5, 6, 4, 3], "textureOffset": [0, 9]}
					]
				},
				{
					"part": "body4",
					"id": "body4",
					"invertAxis": "xy",
					"translate": [0, -3, -4],
					"boxes": [
						{"coordinates": [-1.5, 0, 2.5, 3, 3, 3], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "body5",
					"id": "body5",
					"invertAxis": "xy",
					"translate": [0, -2, -7],
					"boxes": [
						{"coordinates": [-1, 0, 5.5, 2, 2, 3], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "body6",
					"id": "body6",
					"invertAxis": "xy",
					"translate": [0, -1, -9.5],
					"boxes": [
						{"coordinates": [-1, 0, 8.5, 2, 1, 2], "textureOffset": [11, 0]}
					]
				},
				{
					"part": "body7",
					"id": "body7",
					"invertAxis": "xy",
					"translate": [0, -1, -11.5],
					"boxes": [
						{"coordinates": [-0.5, 0, 10.5, 1, 1, 2], "textureOffset": [13, 4]}
					]
				},
				{
					"part": "wing1",
					"id": "wing1",
					"invertAxis": "xy",
					"translate": [0, -8, -1],
					"boxes": [
						{"coordinates": [-5, 0, -0.5, 10, 8, 3], "textureOffset": [20, 0]}
					]
				},
				{
					"part": "wing2",
					"id": "wing2",
					"invertAxis": "xy",
					"translate": [0, -4, -7],
					"boxes": [
						{"coordinates": [-3, 0, 5.5, 6, 4, 3], "textureOffset": [20, 11]}
					]
				},
				{
					"part": "wing3",
					"id": "wing3",
					"invertAxis": "xy",
					"translate": [0, -5, 1.5],
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
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
					"boxes": [
						{"coordinates": [4, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, -0.1],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-3, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, -0.1],
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
					"boxes": [
						{
							"coordinates": [-5, 11, -11, 10, 10, 22],
							"uvNorth": [22, 54, 32, 64],
							"uvEast": [0, 54, 22, 64],
							"uvSouth": [54, 54, 64, 64],
							"uvWest": [32, 54, 54, 64],
							"uvUp": [32, 54, 22, 32],
							"uvDown": [42, 32, 32, 54],
							"sizeAdd": 0.05
						}
					]
				},
				{
					"part": "neck",
					"id": "neck",
					"invertAxis": "xy",
					"translate": [0, -22, 8.9],
					"boxes": [
						{
							"coordinates": [-2, 16, -11, 4, 12, 7],
							"uvNorth": [7, 42, 11, 54],
							"uvEast": [0, 42, 7, 54],
							"uvSouth": [18, 42, 22, 54],
							"uvWest": [11, 42, 18, 54],
							"uvUp": [11, 42, 7, 35],
							"uvDown": [15, 35, 11, 42]
						}
					]
				},
				{
					"part": "back_left_leg",
					"id": "back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, 0, 7, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, 0, 7, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [1, 0, -11, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [-5, 0, -11, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -21, -11],
					"boxes": [
						{
							"coordinates": [-1.5, 7, 11, 3, 14, 4],
							"uvNorth": [46, 40, 49, 54],
							"uvEast": [42, 40, 46, 54],
							"uvSouth": [53, 40, 56, 54],
							"uvWest": [49, 40, 53, 54],
							"uvUp": [49, 40, 46, 36],
							"uvDown": [52, 36, 49, 40]
						}
					]
				},
				{
					"part": "saddle",
					"id": "saddle",
					"invertAxis": "xy",
					"translate": [0, -13, -6],
					"boxes": [
						{
							"coordinates": [-5, 12, -3.5, 10, 9, 9],
							"uvNorth": [35, 9, 45, 18],
							"uvEast": [26, 9, 35, 18],
							"uvSouth": [54, 9, 64, 18],
							"uvWest": [45, 9, 54, 18],
							"uvUp": [45, 9, 35, 0],
							"uvDown": [55, 0, 45, 9],
							"sizeAdd": 0.5
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 20, 13, 25],
							"uvEast": [0, 20, 7, 25],
							"uvSouth": [20, 20, 26, 25],
							"uvWest": [13, 20, 20, 25],
							"uvUp": [13, 20, 7, 13],
							"uvDown": [19, 13, 13, 20]
						}
					]
				},
				{
					"part": "mouth",
					"id": "mouth",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -16, 4, 5, 5],
							"uvNorth": [5, 30, 9, 35],
							"uvEast": [0, 30, 5, 35],
							"uvSouth": [14, 30, 18, 35],
							"uvWest": [9, 30, 14, 35],
							"uvUp": [9, 30, 5, 25],
							"uvDown": [13, 25, 9, 30]
						}
					]
				},
				{
					"part": "left_ear",
					"id": "left_ear",
					"invertAxis": "xy",
					"translate": [0, -23, 9],
					"boxes": [
						{
							"coordinates": [0.5, 33, -5.01, 2, 3, 1],
							"uvNorth": [20, 17, 22, 20],
							"uvEast": [19, 17, 20, 20],
							"uvSouth": [23, 17, 25, 20],
							"uvWest": [22, 17, 23, 20],
							"uvUp": [22, 17, 20, 16],
							"uvDown": [24, 16, 22, 17]
						}
					]
				},
				{
					"part": "right_ear",
					"id": "right_ear",
					"invertAxis": "xy",
					"translate": [0, -23, 9],
					"boxes": [
						{
							"coordinates": [-2.5, 33, -5.01, 2, 3, 1],
							"uvNorth": [20, 17, 22, 20],
							"uvEast": [19, 17, 20, 20],
							"uvSouth": [23, 17, 25, 20],
							"uvWest": [22, 17, 23, 20],
							"uvUp": [22, 17, 20, 16],
							"uvDown": [24, 16, 22, 17]
						}
					]
				},
				{
					"part": "left_bit",
					"id": "left_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [2, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "right_bit",
					"id": "right_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "left_rein",
					"id": "left_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "right_rein",
					"id": "right_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [-3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "headpiece",
					"id": "headpiece",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 7, 13, 12],
							"uvEast": [0, 7, 7, 12],
							"uvSouth": [20, 7, 26, 12],
							"uvWest": [13, 7, 20, 12],
							"uvUp": [13, 7, 7, 0],
							"uvDown": [19, 0, 13, 7],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "noseband",
					"id": "noseband",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -13, 4, 5, 2],
							"uvNorth": [21, 2, 25, 7],
							"uvEast": [19, 2, 21, 7],
							"uvSouth": [27, 2, 31, 7],
							"uvWest": [25, 2, 27, 7],
							"uvUp": [25, 2, 21, 0],
							"uvDown": [29, 0, 25, 2],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "mane",
					"id": "mane",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-1, 17, -4, 2, 16, 2],
							"uvNorth": [58, 38, 60, 54],
							"uvEast": [56, 38, 58, 54],
							"uvSouth": [62, 38, 64, 54],
							"uvWest": [60, 38, 62, 54],
							"uvUp": [60, 38, 58, 36],
							"uvDown": [62, 36, 60, 38]
						}
					]
				},
				{
					"part": "child_back_left_leg",
					"id": "child_back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, -5.5, 7, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_back_right_leg",
					"id": "child_back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, -5.5, 7, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "child_front_left_leg",
					"id": "child_front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9],
					"boxes": [
						{
							"coordinates": [-5, -5.5, -11, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_front_right_leg",
					"id": "child_front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9],
					"boxes": [
						{
							"coordinates": [1, -5.5, -11, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
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
					"boxes": [
						{"coordinates": [-3, 1, -3, 6, 6, 6], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "right_eye",
					"id": "right_eye",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-3.3, 4, -3.5, 2, 2, 2], "textureOffset": [32, 0]}
					]
				},
				{
					"part": "left_eye",
					"id": "left_eye",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [1.3, 4, -3.5, 2, 2, 2], "textureOffset": [32, 4]}
					]
				},
				{
					"part": "mouth",
					"id": "mouth",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "back2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "right2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "left2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 90],
							"boxes": [
								{"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
							]
						}
					]
				},
				{
					"part": "back",
					"id": "back"
				},
				{
					"part": "bottom",
					"id": "bottom"
				},
				{
					"part": "right",
					"id": "right"
				},
				{
					"part": "left",
					"id": "left"
				},
				{
					"part": "dirt",
					"id": "dirt"
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
					"boxes": [
						{"coordinates": [-4, 5, -11, 8, 8, 8], "textureOffset": [32, 4]}
					]
				},
				{
					"part": "neck",
					"id": "neck",
					"invertAxis": "xy",
					"translate": [0, -9, 0],
					"boxes": [
						{"coordinates": [-3, 6, -3, 6, 6, 6], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -9, -9],
					"boxes": [
						{"coordinates": [-5, 5, 3, 10, 8, 12], "textureOffset": [0, 12]}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-4, -9, -4],
					"boxes": [
						{"coordinates": [3, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [4, -9, -4],
					"boxes": [
						{"coordinates": [-19, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-4, -9, -1],
					"boxes": [
						{"coordinates": [3, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4, -9, -1],
					"boxes": [
						{"coordinates": [-19, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg5",
					"id": "leg5",
					"invertAxis": "xy",
					"translate": [-4, -9, 2],
					"boxes": [
						{"coordinates": [3, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg6",
					"id": "leg6",
					"invertAxis": "xy",
					"translate": [4, -9, 2],
					"boxes": [
						{"coordinates": [-19, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg7",
					"id": "leg7",
					"invertAxis": "xy",
					"translate": [-4, -9, 5],
					"boxes": [
						{"coordinates": [3, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
					]
				},
				{
					"part": "leg8",
					"id": "leg8",
					"invertAxis": "xy",
					"translate": [4, -9, 5],
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
					"boxes": [
						{"coordinates": [-6, -8, -6, 12, 16, 12], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle1",
					"id": "tentacle1",
					"invertAxis": "xy",
					"translate": [-5, 7, 0],
					"boxes": [
						{"coordinates": [4, -25, -1, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle2",
					"id": "tentacle2",
					"invertAxis": "xy",
					"translate": [-3.5, 7, 3.5],
					"boxes": [
						{"coordinates": [2.5, -25, -4.5, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle3",
					"id": "tentacle3",
					"invertAxis": "xy",
					"translate": [0, 7, 5],
					"boxes": [
						{"coordinates": [-1, -25, -6, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle4",
					"id": "tentacle4",
					"invertAxis": "xy",
					"translate": [3.5, 7, 3.5],
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
					"boxes": [
						{"coordinates": [-6, -25, -11, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle6",
					"id": "tentacle6",
					"invertAxis": "xy",
					"translate": [3.5, 7, -3.5],
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
					"boxes": [
						{"coordinates": [-1, -25, -2.7, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle8",
					"id": "tentacle8",
					"invertAxis": "xy",
					"translate": [-3.5, 7, -3.5],
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
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
					"boxes": [
						{"coordinates": [4, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, -0.1],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-3, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, -0.1],
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
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "back2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "right2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "left2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 90],
							"boxes": [
								{"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
							]
						}
					]
				},
				{
					"part": "back",
					"id": "back"
				},
				{
					"part": "bottom",
					"id": "bottom"
				},
				{
					"part": "right",
					"id": "right"
				},
				{
					"part": "left",
					"id": "left"
				},
				{
					"part": "dirt",
					"id": "dirt"
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
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [-8, -14, 8],
					"submodels": [
						{
							"id": "base_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-7, -3, -7, 14, 10, 14], "textureOffset": [0, 19]}
							]
						}
					],
					"animations": [
						{
							"base_rotation.rx": "0"
						}
					]
				},
				{
					"part": "knob",
					"id": "knob",
					"invertAxis": "xy",
					"translate": [-8, -6, 8],
					"submodels": [
						{
							"id": "knob_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-1, -4, 7, 2, 4, 1], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"knob_rotation.rx": "0"
						}
					]
				},
				{
					"part": "lid",
					"id": "lid",
					"invertAxis": "xy",
					"translate": [-8, -5, 7],
					"submodels": [
						{
							"id": "lid_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-7, -7, -7, 14, 5, 14], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"lid_rotation.rx": "0"
						}
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
					"part": "base_left",
					"id": "base_left",
					"invertAxis": "xy",
					"translate": [-8, -14, 8],
					"submodels": [
						{
							"id": "base_left_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-8, -3, -7, 15, 10, 14], "textureOffset": [0, 19]}
							]
						}
					],
					"animations": [
						{
							"base_left_rotation.rx": "0"
						}
					]
				},
				{
					"part": "base_right",
					"id": "base_right",
					"invertAxis": "xy",
					"translate": [8, -14, 8],
					"submodels": [
						{
							"id": "base_right_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-23, -3, -7, 15, 10, 14], "textureOffset": [0, 19]}
							]
						}
					],
					"animations": [
						{
							"base_right_rotation.rx": "0"
						}
					]
				},
				{
					"part": "knob_left",
					"id": "knob_left",
					"invertAxis": "xy",
					"translate": [-8, -6, 8],
					"submodels": [
						{
							"id": "knob_left_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-8, -4, 7, 1, 4, 1], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"knob_left_rotation.rx": "0"
						}
					]
				},
				{
					"part": "knob_right",
					"id": "knob_right",
					"invertAxis": "xy",
					"translate": [8, -6, 8],
					"submodels": [
						{
							"id": "knob_right_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-9, -4, 7, 1, 4, 1], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"knob_right_rotation.rx": "0"
						}
					]
				},
				{
					"part": "lid_left",
					"id": "lid_left",
					"invertAxis": "xy",
					"translate": [-8, -5, 7],
					"submodels": [
						{
							"id": "lid_left_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-8, -7, -7, 15, 5, 14], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"lid_left_rotation.rx": "0"
						}
					]
				},
				{
					"part": "lid_right",
					"id": "lid_right",
					"invertAxis": "xy",
					"translate": [8, -5, 7],
					"submodels": [
						{
							"id": "lif_right_rotation",
							"invertAxis": "xy",
							"translate": [0, 7, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-23, -7, -7, 15, 5, 14], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"lid_right_rotation.rx": "0"
						}
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
									"id": "body_sub_1",
									"invertAxis": "xy",
									"translate": [0, 0, 0],
									"boxes": [
										{"coordinates": [0, 0, 0, 2, 2, 0], "textureOffset": [2, 16]}
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
									"id": "body_sub_3",
									"invertAxis": "xy",
									"translate": [0, 0, 0],
									"boxes": [
										{"coordinates": [-2, 0, 0, 2, 2, 0], "textureOffset": [2, 12]}
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
									"id": "body_sub_1",
									"invertAxis": "xy",
									"translate": [0, 0, 0],
									"boxes": [
										{"coordinates": [0, 0, 0, 2, 2, 0], "textureOffset": [2, 16]}
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
									"id": "body_sub_3",
									"invertAxis": "xy",
									"translate": [0, 0, 0],
									"boxes": [
										{"coordinates": [-2, 0, 0, 2, 2, 0], "textureOffset": [2, 12]}
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
					"translate": [0, -13, 10],
					"submodels": [
						{
							"id": "body_rotation",
							"invertAxis": "xy",
							"translate": [0, 13, -10],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-9.5, -23, -10, 19, 20, 6], "textureOffset": [7, 37]},
								{"coordinates": [-5.5, -21, -13, 11, 18, 3], "textureOffset": [31, 1]}
							]
						}
					],
					"animations": [
						{
							"body_rotation.rx": "0"
						}
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
					"translate": [0, -13, 10],
					"submodels": [
						{
							"id": "body2_rotation",
							"invertAxis": "xy",
							"translate": [0, 13, -10],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-4.5, -21, -14, 9, 18, 1], "textureOffset": [70, 33]}
							]
						}
					],
					"animations": [
						{
							"body2_rotation.rx": "0"
						}
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
					"boxes": [
						{"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
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
					"translate": [0, -24, -2],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-20, 12, 2, 20, 12, 1], "textureOffset": [0, 32]}
					]
				},
				{
					"part": "right_wing",
					"id": "right_wing",
					"invertAxis": "xy",
					"translate": [0, -24, -2],
					"boxes": [
						{"coordinates": [0, 12, 2, 20, 12, 1], "textureOffset": [0, 32]}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "nose",
					"id": "nose",
					"invertAxis": "xy",
					"translate": [0, -26, 0],
					"boxes": [
						{"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]}
					]
				},
				{
					"part": "arms",
					"id": "arms",
					"invertAxis": "xy",
					"translate": [0, -22, 0],
					"boxes": [
						{"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
						{"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
					],
					"submodels": [
						{
							"id": "mirrored",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
							]
						}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, 0],
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, 0],
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
					"translate": [0, -24, 0],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 24, 0],
							"rotate": [90, 0, 0],
							"boxes": [
								{"coordinates": [-8, -8, -6, 16, 16, 1], "textureOffset": [30, 47]}
							]
						}
					],
					"animation": [
						{
							"rotation.rx": "0"
                        }
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]},
						{"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
					]
				},
				{
					"part": "nose",
					"id": "nose",
					"invertAxis": "xy",
					"translate": [0, -26, 0]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
					"boxes": [
						{"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
						{"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
					],
					"submodels": [
						{
							"id": "mirrored",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
							]
						}
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
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
					"boxes": [
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [5, -22, 0],
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "nose",
					"id": "nose",
					"invertAxis": "xy",
					"translate": [0, -26, 0],
					"boxes": [
						{"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]}
					]
				},
				{
					"part": "arms",
					"id": "arms",
					"invertAxis": "xy",
					"translate": [0, -22, 0],
					"boxes": [
						{"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
						{"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
					],
					"submodels": [
						{
							"id": "mirrored",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
							]
						}
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
					"boxes": [
						{"coordinates": [-10, 17.1, -0.5, 20, 3, 3], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "body2",
					"id": "body2",
					"invertAxis": "xy",
					"translate": [-3, -17.1, 0.5],
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
					"translate": [-3, -7.1, 0.5],
					"boxes": [
						{"coordinates": [-1, 1.1, -0.5, 3, 6, 3], "textureOffset": [12, 22]}
					]
				},
				{
					"part": "head1",
					"id": "head1",
					"invertAxis": "xy",
					"translate": [-1, -24, 0],
					"boxes": [
						{"coordinates": [-4, 20, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "head2",
					"id": "head2",
					"invertAxis": "xy",
					"translate": [-9, -20, 1],
					"boxes": [
						{"coordinates": [-12, 18, -4, 6, 6, 6], "textureOffset": [32, 0]}
					]
				},
				{
					"part": "head3",
					"id": "head3",
					"invertAxis": "xy",
					"translate": [9, -20, 1],
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
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
					"boxes": [
						{"coordinates": [4, 12, -1, 2, 12, 2], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, -0.1],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-3, 0, -1, 2, 12, 2], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, -0.1],
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
					"submodels": [
						{
							"id": "body_rotation",
							"invertAxis": "xy",
							"translate": [0, 10, 2],
							"rotate": [-90, 0, 0],
							"submodels": [
								{
									"id": "body_sub_1",
									"invertAxis": "xy",
									"translate": [0, 0, 0],
									"boxes": [
										{"coordinates": [-3, -7, -3, 6, 9, 6], "textureOffset": [18, 14]}
									]
								}
							]
						}
					],
					"animations": [
						{
							"body_rotation.rx": "0"
						}
					]
				},
				{
					"part": "mane",
					"id": "mane",
					"invertAxis": "xy",
					"translate": [-1, -10, -2],
					"submodels": [
						{
							"id": "mane_rotation",
							"invertAxis": "xy",
							"translate": [0, 7.5, -0.5],
							"rotate": [-90, 0, 0],
							"submodels": [
								{
									"id": "mane_sub_1",
									"invertAxis": "xy",
									"translate": [0, 0, 0],
									"boxes": [
										{"coordinates": [-4, -0.5, -0.5, 8, 6, 7], "textureOffset": [21, 0]}
									]
								}
							]
						}
					],
					"animations": [
						{
							"mane_rotation.rx": "0"
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-2.5, -8, -7],
					"boxes": [
						{"coordinates": [-2.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [0.5, -8, -7],
					"boxes": [
						{"coordinates": [0.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-2.5, -8, 4],
					"boxes": [
						{"coordinates": [-2.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [0.5, -8, 4],
					"boxes": [
						{"coordinates": [0.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [-1, -12, -10],
					"boxes": [
						{"coordinates": [-1, 4, 9, 2, 8, 2], "textureOffset": [9, 18]}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
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
					"boxes": [
						{
							"coordinates": [-5, 11, -11, 10, 10, 22],
							"uvNorth": [22, 54, 32, 64],
							"uvEast": [0, 54, 22, 64],
							"uvSouth": [54, 54, 64, 64],
							"uvWest": [32, 54, 54, 64],
							"uvUp": [32, 54, 22, 32],
							"uvDown": [42, 32, 32, 54],
							"sizeAdd": 0.05
						}
					]
				},
				{
					"part": "neck",
					"id": "neck",
					"invertAxis": "xy",
					"translate": [0, -22, 8.9],
					"boxes": [
						{
							"coordinates": [-2, 16, -11, 4, 12, 7],
							"uvNorth": [7, 42, 11, 54],
							"uvEast": [0, 42, 7, 54],
							"uvSouth": [18, 42, 22, 54],
							"uvWest": [11, 42, 18, 54],
							"uvUp": [11, 42, 7, 35],
							"uvDown": [15, 35, 11, 42]
						}
					]
				},
				{
					"part": "back_left_leg",
					"id": "back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, 0, 7, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, 0, 7, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [1, 0, -11, 4, 11, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9.1],
					"boxes": [
						{
							"coordinates": [-5, 0, -11, 4, 11, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -21, -11],
					"boxes": [
						{
							"coordinates": [-1.5, 7, 11, 3, 14, 4],
							"uvNorth": [46, 40, 49, 54],
							"uvEast": [42, 40, 46, 54],
							"uvSouth": [53, 40, 56, 54],
							"uvWest": [49, 40, 53, 54],
							"uvUp": [49, 40, 46, 36],
							"uvDown": [52, 36, 49, 40]
						}
					]
				},
				{
					"part": "saddle",
					"id": "saddle",
					"invertAxis": "xy",
					"translate": [0, -13, -6],
					"boxes": [
						{
							"coordinates": [-5, 12, -3.5, 10, 9, 9],
							"uvNorth": [35, 9, 45, 18],
							"uvEast": [26, 9, 35, 18],
							"uvSouth": [54, 9, 64, 18],
							"uvWest": [45, 9, 54, 18],
							"uvUp": [45, 9, 35, 0],
							"uvDown": [55, 0, 45, 9],
							"sizeAdd": 0.5
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 20, 13, 25],
							"uvEast": [0, 20, 7, 25],
							"uvSouth": [20, 20, 26, 25],
							"uvWest": [13, 20, 20, 25],
							"uvUp": [13, 20, 7, 13],
							"uvDown": [19, 13, 13, 20]
						}
					]
				},
				{
					"part": "mouth",
					"id": "mouth",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -16, 4, 5, 5],
							"uvNorth": [5, 30, 9, 35],
							"uvEast": [0, 30, 5, 35],
							"uvSouth": [14, 30, 18, 35],
							"uvWest": [9, 30, 14, 35],
							"uvUp": [9, 30, 5, 25],
							"uvDown": [13, 25, 9, 30]
						}
					]
				},
				{
					"part": "left_ear",
					"id": "left_ear",
					"invertAxis": "xy",
					"translate": [0, -23, 9],
					"boxes": [
						{
							"coordinates": [0.5, 33, -5.01, 2, 3, 1],
							"uvNorth": [20, 17, 22, 20],
							"uvEast": [19, 17, 20, 20],
							"uvSouth": [23, 17, 25, 20],
							"uvWest": [22, 17, 23, 20],
							"uvUp": [22, 17, 20, 16],
							"uvDown": [24, 16, 22, 17]
						}
					]
				},
				{
					"part": "right_ear",
					"id": "right_ear",
					"invertAxis": "xy",
					"translate": [0, -23, 9],
					"boxes": [
						{
							"coordinates": [-2.5, 33, -5.01, 2, 3, 1],
							"uvNorth": [20, 17, 22, 20],
							"uvEast": [19, 17, 20, 20],
							"uvSouth": [23, 17, 25, 20],
							"uvWest": [22, 17, 23, 20],
							"uvUp": [22, 17, 20, 16],
							"uvDown": [24, 16, 22, 17]
						}
					]
				},
				{
					"part": "left_bit",
					"id": "left_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [2, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "right_bit",
					"id": "right_bit",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 29, -14, 1, 2, 2],
							"uvNorth": [31, 7, 32, 9],
							"uvEast": [29, 7, 31, 9],
							"uvSouth": [34, 7, 35, 9],
							"uvWest": [32, 7, 34, 9],
							"uvUp": [32, 7, 31, 5],
							"uvDown": [33, 5, 32, 7]
						}
					]
				},
				{
					"part": "left_rein",
					"id": "left_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "right_rein",
					"id": "right_rein",
					"invertAxis": "xy",
					"translate": [0, -20.75, 14],
					"boxes": [
						{
							"coordinates": [-3.1, 24, -20, 0, 3, 16],
							"uvNorth": [48, 18, 48, 21],
							"uvEast": [32, 18, 48, 21],
							"uvSouth": [64, 18, 64, 21],
							"uvWest": [48, 18, 64, 21],
							"uvUp": [48, 18, 48, 2],
							"uvDown": [48, 2, 48, 18]
						}
					]
				},
				{
					"part": "headpiece",
					"id": "headpiece",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-3, 28, -11, 6, 5, 7],
							"uvNorth": [7, 7, 13, 12],
							"uvEast": [0, 7, 7, 12],
							"uvSouth": [20, 7, 26, 12],
							"uvWest": [13, 7, 20, 12],
							"uvUp": [13, 7, 7, 0],
							"uvDown": [19, 0, 13, 7],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "noseband",
					"id": "noseband",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-2, 28, -13, 4, 5, 2],
							"uvNorth": [21, 2, 25, 7],
							"uvEast": [19, 2, 21, 7],
							"uvSouth": [27, 2, 31, 7],
							"uvWest": [25, 2, 27, 7],
							"uvUp": [25, 2, 21, 0],
							"uvDown": [29, 0, 25, 2],
							"sizeAdd": 0.25
						}
					]
				},
				{
					"part": "mane",
					"id": "mane",
					"invertAxis": "xy",
					"translate": [0, -22, 9],
					"boxes": [
						{
							"coordinates": [-1, 17, -4, 2, 16, 2],
							"uvNorth": [58, 38, 60, 54],
							"uvEast": [56, 38, 58, 54],
							"uvSouth": [62, 38, 64, 54],
							"uvWest": [60, 38, 62, 54],
							"uvUp": [60, 38, 58, 36],
							"uvDown": [62, 36, 60, 38]
						}
					]
				},
				{
					"part": "child_back_left_leg",
					"id": "child_back_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, -8],
					"boxes": [
						{
							"coordinates": [-5, -5.5, 7, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_back_right_leg",
					"id": "child_back_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, -8],
					"boxes": [
						{
							"coordinates": [1, -5.5, 7, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
					]
				},
				{
					"part": "child_front_left_leg",
					"id": "child_front_left_leg",
					"invertAxis": "xy",
					"translate": [4, -10, 9],
					"boxes": [
						{
							"coordinates": [-5, -5.5, -11, 4, 22, 4],
							"uvNorth": [56, 25, 52, 36],
							"uvEast": [60, 25, 56, 36],
							"uvSouth": [64, 25, 60, 36],
							"uvWest": [52, 25, 48, 36],
							"uvUp": [52, 25, 56, 21],
							"uvDown": [56, 21, 60, 25]
						}
					]
				},
				{
					"part": "child_front_right_leg",
					"id": "child_front_right_leg",
					"invertAxis": "xy",
					"translate": [-4, -10, 9],
					"boxes": [
						{
							"coordinates": [1, -5.5, -11, 4, 22, 4],
							"uvNorth": [52, 25, 56, 36],
							"uvEast": [48, 25, 52, 36],
							"uvSouth": [60, 25, 64, 36],
							"uvWest": [56, 25, 60, 36],
							"uvUp": [56, 25, 52, 21],
							"uvDown": [60, 21, 56, 25]
						}
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
					],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 24, 0],
							"rotate": [90, 0, 0],
							"boxes": [
								{"coordinates": [-8, -8, -6, 16, 16, 1], "textureOffset": [30, 47]}
							]
						}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
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
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
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
    EntityOptions.zombified_piglin = {
		name: 'Piglin',
		model: `{
            "textureSize": [64, 64],
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
                    "part": "headwear",
                    "id": "headwear",
                    "invertAxis": "xy",
                    "translate": [0, 0, 0]
                },
                {
                    "part": "body",
                    "id": "body",
                    "invertAxis": "xy",
                    "translate": [0, -24, 0],
                    "boxes": [
                        {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]},
                        {"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_arm",
                    "id": "left_arm",
                    "invertAxis": "xy",
                    "translate": [5, -22, 0],
                    "boxes": [
                        {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [32, 48]},
                        {"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [48, 48], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "right_arm",
                    "id": "right_arm",
                    "invertAxis": "xy",
                    "translate": [-5, -22, 0],
                    "boxes": [
                        {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]},
                        {"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_leg",
                    "id": "left_leg",
                    "invertAxis": "xy",
                    "translate": [2, -12, 0],
                    "boxes": [
                        {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [16, 48]},
                        {"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 48], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "right_leg",
                    "id": "right_leg",
                    "invertAxis": "xy",
                    "translate": [-2, -12, 0],
                    "boxes": [
                        {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]},
                        {"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 32], "sizeAdd": 0.25}
                    ]
                },
                {
                    "part": "left_ear",
                    "id": "left_ear",
                    "invertAxis": "xy",
                    "translate": [5.25, -30, 0],
                    "boxes": [
                        {"coordinates": [-6, 25, -2, 1, 5, 4], "textureOffset": [51, 6]}
                    ]
                },
                {
                    "part": "right_ear",
                    "id": "right_ear",
                    "invertAxis": "xy",
                    "translate": [-5.5, -30, 0],
                    "boxes": [
                        {"coordinates": [5, 25, -2, 1, 5, 4], "textureOffset": [39, 6]}
                    ]
                }
            ]
        }`
	}
	EntityOptions.custom = {
		name: '---- Custom Models ----'
	}
	EntityOptions.mooshroom_mushroom_brown = {
		name: 'Mooshrom [Brown Mushrooms]',
		texture_name: 'brown_mooshroom.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTA3VDE3OjQ5OjQzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0wOVQxODoyNDo0NiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0wOVQxODoyNDo0NiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkZWY0N2FmZS0xN2RjLTI4NGUtOTViYi0yYTNhZjc5NzJiOGMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZDUxODRhMWItMGQ3Mi1iODQzLTg2ZTctY2NmZDRlYWUxNDU4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZDUxODRhMWItMGQ3Mi1iODQzLTg2ZTctY2NmZDRlYWUxNDU4Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNTE4NGExYi0wZDcyLWI4NDMtODZlNy1jY2ZkNGVhZTE0NTgiIHN0RXZ0OndoZW49IjIwMjAtMDctMDdUMTc6NDk6NDMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGVmNDdhZmUtMTdkYy0yODRlLTk1YmItMmEzYWY3OTcyYjhjIiBzdEV2dDp3aGVuPSIyMDIwLTA3LTA5VDE4OjI0OjQ2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZJiuXAAACH9JREFUeJztWl1oHNcV/kaM2VGzlUdZwSi4bFWtK4GMXSdCwSG1TXH8EBsaS5A+mDwohcgk0DQxfXDBfSq0ISn5aR5c5aWuKXmIjRzjOtCavFgxbe2oBisWyHiFvUXNTqwpo2UdzTiC7cP43D33zp3RKg8dYu8HQjP395zvnnvuuWfWaDQaAIDpi1fAMXPiaMPK58R7v+OgYNu4PD+PoB6K8nqwCgDIW6bU/9X3PjI+nTzSeP/jy3jzg4+NC5/8CwCw64ePiTZvTeyT5tiQ68RX4Qp0oDmp/dLSHfzqxN8MqqfxAWDk9q2GdhANzFPvHGr0bLRw94u78PwaBvqK8HwfXDAAKNi2eLbyOQT1UCgPQHrOWyY+nTzSAICDe0ZwcM9I40vAgAIah+biyi8t3UHeMmNtiIyenoe0Cj08+88GenvFe7laBQBs6e6OzQ8AHV1hh1AeAK7frMQaEfue72snVVEPVnHxs7L0pwMpFtRDbMh1irKgHgqLIqJJBpUMFaXeXvzx/HnxfmF2NlVW0/NrKNhdKNhdggT6TxgqFUU5CcBXXIdb7n+l90c1bUh5APh8cUmsOIFviXqwKurWIuH5vXvF866tW1Hq7QXCENPfGRDlO5+MJDLJ5AHgkYEe3P3irtjrQHPvU5udw9vg+T6WlhYSBchbJv5t9WlN7v1fHmwAuEe6DSCyLHqenrkqFAbu4OknH5PqeXvaZp7vY+bEUQDAyNMviHZk/mkwhyd+awBNJ9j5feBLAMGM7ARJgOs3KyjYXTGnl+QMdeDKA8BcuQKgAiufk1aWxtQpz0kp2DasvIugHqJcreLC7Cx2bd0KINoCJeYTYgS8fWh/QzUn7uUXXFeaiMqAyIQ35jpRsLtEGZnno7jd6HcceH4Nrufj2tSvEdRDDJWK0spHyiPm5ICITLI8VQZOBoHGEGaPyCeUq1Vs6e7WEtBB+3DiRz/FdmcHtjs7YgJxLLiuEHC7swPfs3+Ap4b2Y2RwECODg1Lbgm1joK8YKyOl5soV7TzcEjhZKjy/Bs/3pbot3d3GlekZ49TJc4YVhsapk+eMK9Mz2u0IACYQmdpvTr6LAzsOwDCiti++eRoAcOzwqGB6euYqXn3vIwDAWxP78O2uLgDA788eE76BY3rmKnYOb9NOTHudFAZk58bJLNi2dDoVbFv8Xb9ZwbISOzz346e0z4kEED78x4cYfWJU2/Dy/Lx2tc5fOQsrnxNOk4PKeT+d4hy0TQhEPp1Sy+EKFlwXI4ODMcKDuuzpW4Fx7PBoA4gCDwCxo2g94L4jSTldYMPrucV4vi98Cx+fWwy9U7ywe+K1RHPnEMcgCdPT85AkGD3vfekNqePZ119OVKIerCaeAmogo+vvFGTv7vk1ERHyOdSokxO/Xpg0mHoEAcDel97A5s2bMT4+DgA4fvw4bty4gbOvvxxTjsYhEtTVoTqC7uShfU8kDPQVUV5cEmPqgq+0upYISBOsWq1ifHwc7j0zJCJUwZOE4vVJ9wY+X/OMr0mnBfX5xeiLWiV+d/oYgNZiEBVG0m2Q8OcTf4iVTU5OxsrePrS/ASB2zqthdXlxSXpXzVsF1ZMlOQU7Fnc4BVuMm7dMOIVofjXa9PyaaHf0T381AKBDq7UGi4uLrTYVIO+tQ94yYyumK+Ow8jm4XjN44mXUvzm3PC8PmDhis33r2gcN8r5BPcSZqUt4ZmwMmzZtwpmpKVRv3071sguuKwVL5NU5+0C6wyRldBbBfYoOuvCdMNBXhOv50rgxCfjR83WPQ95XvtxEWMtpETGPb+kXARg/NdSwmZcLcvw4AbpoMrYFuHmt93hJu1PozD0NtI893xfPrcypOlUOz6/ByuekubVSqIqfmZpKFTZpDDVgAVrz1E3lIwc60FfEQF9RpON0lklbjSJS1QFS2bIrh83iNqhGcfR+ZOxxqQO/PQb1EK9MnjN4H52ZcuWHSkWhGDkvnfIE7szSEiF0hPY7jnSDjcaQj1Q+hrQF1GBoqFQUzFJdmhNK2gJJQjsFO6awjhS68e0c3ibG7HcccQOlpA1hY64zZv5Ur8puqg6Ev1OnpNVtxUlSP4oPKKGiWsFapwLJQhcldYWB5lm/HK4IU1frVJlNLmSaQl/nRLDyudjqRMLElU8C5SwJ/HLETbuZ0a4pfW1pThUmCZpkrtyUdJeltaCugGriaoict0y4ni9Fc3PlCoZK8qpHyZSIjJHBQVHHcwPL4YqwOCAiXJW5gxTn+50UJKH5vtFdcng5h1qWprxa5no+XM/HpWtR8pWyPwQd+bpznvIHSRBbYK4escxXNikmUO/tvDzJgubKldg+H31iVEpYUhb39N9Px/yB6/mxzA9BPR51ciyHK9pjuQNosk4Kq199CHQXp/QXT1PxvD3ByucwV65IRPJx1vsRQxVeV6ZTPs1SO/g9XoWujmdqdUfWWtGjOo/2Iwb012eeVOHz8fo05Qk85WaSUrQqaYkH+k+XHbWd7hue7juiDrqPGEl9dPtfl4NQZaN23Jma1ImTQO+qEHxfJgnB69ZSfj0fMZIUTFoE/fEbOfXrNysYJgJem7qknTANz4yNAYjuCK8ouRE1Z7cWdB8xkrDWuPVgFaVNPbEvT4A+OQOwjNCDipYzQvcr2gRkLUDWaBOQtQBZo01A1gJkjVgKhn4fQL+/AYCLn5Xx83dPGgBwv8UNWgvgyhMO/2TP/aX5PcQs4J2fPSutPOG7zsNEQkvf378piBEwf+s/AKLf+QVBAACwLAsAxPv9hNhdgHwAALzw7L7G51UXf2E/MnogfADhwO5hPNLr/L9kyQSpBDgbvsKB3cNpTb7xeODjgHY+IGsBskabgKwFyBptArIWIGu0CchagKzRJiBrAbJGm4CsBcgabQKyFiBrtAnIWoCs8T8yE3mPrI7xgQAAAABJRU5ErkJggg==',
		model: `{
			"texture": "mooshroom_mushroom_brown.png",
			"textureSize": [64, 64],
			"models": [
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -19, -2],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"submodels": [
								{
									"id": "mushrooms",
									"invertAxis": "xy",
									"translate": [0, 5, 3],
									"rotate": [90, 0, 0],
									"submodels": [
										{
											"id": "mushroom2",
											"invertAxis": "xy",
											"translate": [2, 0, 1.75],
											"rotate": [0, -40, 0],
											"boxes": [
												{
													"coordinates": [-8, 0, 0, 16, 13, 0],
													"uvNorth": [0, 32, 16, 48],
													"uvEast": [0, 32, 0, 48],
													"uvSouth": [16, 32, 32, 48],
													"uvWest": [16, 32, 16, 48],
													"uvUp": [16, 32, 0, 32],
													"uvDown": [32, 32, 16, 32]
												},
												{
													"coordinates": [0, 0, -8, 0, 13, 16],
													"uvNorth": [16, 32, 16, 48],
													"uvEast": [0, 32, 16, 48],
													"uvSouth": [32, 32, 32, 48],
													"uvWest": [16, 32, 32, 48],
													"uvUp": [16, 32, 16, 16],
													"uvDown": [16, 16, 16, 32]
												}
											]
										},
										{
											"id": "mushroom3",
											"invertAxis": "xy",
											"translate": [-3.25, 0, 11],
											"rotate": [0, 5, 0],
											"boxes": [
												{
													"coordinates": [-8, 0, 0, 16, 13, 0],
													"uvNorth": [0, 32, 16, 48],
													"uvEast": [0, 32, 0, 48],
													"uvSouth": [16, 32, 32, 48],
													"uvWest": [16, 32, 16, 48],
													"uvUp": [16, 32, 0, 32],
													"uvDown": [32, 32, 16, 32]
												},
												{
													"coordinates": [0, 0, -8, 0, 13, 16],
													"uvNorth": [16, 32, 16, 48],
													"uvEast": [0, 32, 16, 48],
													"uvSouth": [32, 32, 32, 48],
													"uvWest": [16, 32, 32, 48],
													"uvUp": [16, 32, 16, 16],
													"uvDown": [16, 16, 16, 32]
												}
											]
										}
									]
								}
							],
							"boxes": [
								{
									"coordinates": [-6, -8, -7, 12, 18, 10],
									"uvNorth": [28, 14, 40, 32],
									"uvEast": [18, 14, 28, 32],
									"uvSouth": [50, 14, 62, 32],
									"uvWest": [40, 14, 50, 32],
									"uvUp": [40, 14, 28, 4],
									"uvDown": [52, 4, 40, 14]
								},
								{
									"coordinates": [-2, -8, -8, 4, 6, 1],
									"uvNorth": [53, 1, 57, 7],
									"uvEast": [52, 1, 53, 7],
									"uvSouth": [58, 1, 62, 7],
									"uvWest": [57, 1, 58, 7],
									"uvUp": [57, 1, 53, 0],
									"uvDown": [61, 0, 57, 1]
								}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -20, 8],
					"boxes": [
						{
							"coordinates": [4, 22, -12, 1, 3, 1],
							"uvNorth": [23, 1, 24, 4],
							"uvEast": [22, 1, 23, 4],
							"uvSouth": [25, 1, 26, 4],
							"uvWest": [24, 1, 25, 4],
							"uvUp": [24, 1, 23, 0],
							"uvDown": [25, 0, 24, 1]
						},
						{
							"coordinates": [-4, 16, -14, 8, 8, 6],
							"uvNorth": [6, 6, 14, 14],
							"uvEast": [0, 6, 6, 14],
							"uvSouth": [20, 6, 28, 14],
							"uvWest": [14, 6, 20, 14],
							"uvUp": [14, 6, 6, 0],
							"uvDown": [22, 0, 14, 6]
						},
						{
							"coordinates": [-5, 22, -12, 1, 3, 1],
							"uvNorth": [23, 1, 24, 4],
							"uvEast": [22, 1, 23, 4],
							"uvSouth": [25, 1, 26, 4],
							"uvWest": [24, 1, 25, 4],
							"uvUp": [24, 1, 23, 0],
							"uvDown": [25, 0, 24, 1]
						}
					],
					"submodels": [
						{
							"id": "mushroom1",
							"invertAxis": "xy",
							"translate": [0, 24, -11],
							"rotate": [0, 35, 0],
							"boxes": [
								{
									"coordinates": [-8, 0, 0, 16, 13, 0],
									"uvNorth": [0, 32, 16, 48],
									"uvEast": [0, 32, 0, 48],
									"uvSouth": [16, 32, 32, 48],
									"uvWest": [16, 32, 16, 48],
									"uvUp": [16, 32, 0, 32],
									"uvDown": [32, 32, 16, 32]
								},
								{
									"coordinates": [0, 0, -8, 0, 13, 16],
									"uvNorth": [16, 32, 16, 48],
									"uvEast": [0, 32, 16, 48],
									"uvSouth": [32, 32, 32, 48],
									"uvWest": [16, 32, 32, 48],
									"uvUp": [16, 32, 16, 16],
									"uvDown": [16, 16, 16, 32]
								}
							]
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-4, -12, -7],
					"boxes": [
						{
							"coordinates": [-6, 0, 5, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [4, -12, -7],
					"boxes": [
						{
							"coordinates": [2, 0, 5, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-4, -12, 6],
					"boxes": [
						{
							"coordinates": [-6, 0, -7, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4, -12, 6],
					"boxes": [
						{
							"coordinates": [2, 0, -7, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
					]
				}
			]
		}`
	}
	EntityOptions.mooshroom_mushroom_red = {
		name: 'Mooshrom [Red Mushrooms]',
		texture_name: 'red_mooshroom.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTA3VDE3OjQ5OjQzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0wOVQxODoyNToyMiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0wOVQxODoyNToyMiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNWI0ZmQ2Ni1lZWM3LTA0NDEtOGM1Yy1mMTUyYWNmMTA4YjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjMwOWNhZGEtMTZlNS0wYTQ3LTlhN2UtMmJmNzllOTgzOWJkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NjMwOWNhZGEtMTZlNS0wYTQ3LTlhN2UtMmJmNzllOTgzOWJkIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MzA5Y2FkYS0xNmU1LTBhNDctOWE3ZS0yYmY3OWU5ODM5YmQiIHN0RXZ0OndoZW49IjIwMjAtMDctMDdUMTc6NDk6NDMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjViNGZkNjYtZWVjNy0wNDQxLThjNWMtZjE1MmFjZjEwOGIzIiBzdEV2dDp3aGVuPSIyMDIwLTA3LTA5VDE4OjI1OjIyKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+x06NtQAACBdJREFUeJztWV9oW1UY/53YNoVG3G6HlVXSwMbKGE6WThD8g8h8WlEYcwq2NOKj2Jj6sPmgoz45wYbUBx1D1poKglIcOF/2ILopbqwZso1RGe42WO2YuW0xgQZdjg8338k5556bpMN5oeYHpff8/77f+b7vfOeEcc4BAGe/vwQZv+x/mneykCiXM2lYloXS8AjWeEXUF6vjI4wp4xOrK+zgwYP8xo0bmJubY9+dywEAnnw8jrsBmh8AHrm1wJsd1+bXICsPAJZlKW1rvCKUB6B8RxjDoUOH+NatWxEKhbBt2zYOQGXoLiEyd5YjGhXla/k8AGBPT49x/ZCpUgftuOM4TQlR5ByO4+DKlStwHKfpcf8GdkajOHnmjCj/OD9ft7+vBchgkxkAgG3b6OMVdLKQsuMmLC8vNzP1XcHLzzwjvh/t78fOaBQol3H2wR2i/onH9gBoggDyfdrF7pms+/3aqO+YCGMYGBgwmtz4+DgHgFgsJtzKcRzxXRgaBlBzqb5PZ5R2vT+Vf9n/NADgkamTop7Mvx58CVir7jSBFszlcojFYp6g5xcMTZCVBwA+mkQBbmyprVmLMSblZRIsy0KpGpeu5fP4cX4ej/b3A3BdYKcUE3Swqfs2cT3gkc9TfVd2WhEgnEwJguZTScRiMYSTKTGWxpUzaddtJtIicLLJjLLzfDSprCWvD9TcTyaBxsr1peERAMCO8aMAoCh9LZ/Hnp4eZnKBEAn2fHYaO8aPign8QMrTYt2//477FxfRlZ1WiCLh4vG4p46E56NJz2lDZFC9TJYO27Y9QXZPTw+7ev4y++Lz06yzXGZffH6aXT1/2dcsQ4Brvh++NIT29nZ0dHQAABKrK3hxxVEWLwwN48UVB4nVFQBAR0cHnnr4Ydw89p5RSPJnE+Q2Ulbe+a7sNLpnsoIEXVki17ZtYX2EoWf3YejZfZ5vE5QY8O2RN/HUsXeNHUvDI8bdunjkTXSyEErDIwgDWJPaqF4eZ1JcBrlJV7VMvh6LxWDbNvrTGZTgEqQTvsYrSqRvBuyzTRYHgD8qtwG4QcwkWDOQd9BPOXI5v3badaAWb/T5dYuRE7PdX3/TVMIljkESZkvoHkUw+t578YIy8NzAXl8lipz7ngIkbD0SFsZSYFJ0t20b3ZXbypxFzlHkt0U5wphC/HrR5h41Fe0IcrH34gVs374diUQCADA1NYXr16/j3MBej3J0ZBEJ+u5Qmwuv8mu8IgImmX08HseCNKcp+arX1hQBNcFU8wKApaUlJBIJ3Lx5EwAEEbrgfkLJ7d57g3c9Uty2beW0oDGvTE8Zlfh4xJWrmRxEB/O7DRJmPvnIU3f8+HFP3fSmzRyA55y3bVvp1/3+hFLWzVsHtZMlLYylPHnHwlhKzBthDAtjbpuebdq2Lfq9urrCgCbvAgCwuLiI3t7eZrsDgOLLfoqZ6vzMuZOF0DeRhst0SKkranPGYjGPLCY5PASsLi9yOds71d6G5w4cQG9vL07NzmLp1q26dhZOplBCzfQpqsvsk5L1TNbPr+WYYoIpfSfE43EUtHk9BMhHz50eh/JYOve7tfeCekGLiLn3g0lYloXC0LByauhps1uunS796QzmU0nf9FmGR0PKzWny9cDvTiEr5VfWQX7sOI74bmZNPajKsG0bnSykrG2MAbrip2Zn6wrrN4cpxW0mUpPC5LPxeByYyYrnOJNlkqvRpUgPgFSno21602au+5VcPvbX38oA6k+KjawsM3mMyUxl5dlkRijWN5H2VZ4gC+2nPClpWRbKmTTCyZRi/vqRKs+hzKYnQ2wyI5iltnpBqNG1WsfCWMqjsIkUugR1z2TFnOVMWtxA6dGGMJ9Kesyf2nXZ2+Qd03ewqzrIb3ebCZI0jvIDelDRraDRqUAKsMkMyoBnh4koujABgCMRI9o0mUMyK/UUupMTgRTvyk4rApuU94N+doeTKYSTKbHDZB25XM4T9eWxphwAqAZB2ax1RR3HQbj6bbosNYK+A7qJ6ylyhDH0TaSVbI6PJuFIGSbgnlYlFkIYUAim3afvXPXFCqgSrsncppsoRdE1XkGZhDYorscCEyFrvCLu9UIAH+VNJADAn9Uy7SBthol8ebNkEgAAqaSnP1B9ExSFyYx4pmqUA1BwHBwcZEDtLqAnKfSmx0eTHj/f/c645+0OAH54620lLZbvA35Yj3XKp5d4EiMhqYPf7hQ5F0/juVxOaTMlJXw0qSRX8jzr/RGDZKtX52eJfuND8j1eh6ktwpgIQKYjq5Hl6OsYf8SA6fqsPqrI68nt9ZQnkFUC1SBIuXmjhwf6v6V6UdL76QLIrz+NHixMP2LUuxWa+upvELps1K9PCqZtNEgmgcq6ELL/0gXEK7CaL9RTfj0/Yvgp6LcJenIEuEGyYNso5HIYHBx0CTjc3vSTgMBzBw4AcO8IIwZB5Te7RpDNfmc0WvfnrEZWVOQchTfGPL88AebHGUB6Efq/4s4v/BsELQKCFiBotAgIWoCg0SIgaAGCRosAvYIxBsYYTsz9xPmuXeKP6jcaPJkgYwx5y+IPPvCAqPt1aQkAEHWcDZc5eiwgb1mKhqT8Vyc+9rRtBHh29MPZL/nu1w8jWvoDAJDv2gIAWCwVAQCHCosbyg+MLkC4dO4o//n6b3ghcUJUbjQXqHsXjm7fD+D0fyRKMGh4DIYjD/0XcgSGDRfV14tWIhS0AEGjRUDQAgSNFgFBCxA0WgQELUDQaBEQtABBo0VA0AIEjRYBQQsQNP73BPwDdFEDBz3/83IAAAAASUVORK5CYII=',
		model: `{
			"texture": "mooshroom_mushroom_red.png",
			"textureSize": [64, 64],
			"models": [
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -19, -2],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"submodels": [
								{
									"id": "mushrooms",
									"invertAxis": "xy",
									"translate": [0, 5, 3],
									"rotate": [90, 0, 0],
									"submodels": [
										{
											"id": "mushroom2",
											"invertAxis": "xy",
											"translate": [2, 0, 1.75],
											"rotate": [0, -40, 0],
											"boxes": [
												{
													"coordinates": [-8, 0, 0, 16, 13, 0],
													"uvNorth": [0, 32, 16, 48],
													"uvEast": [0, 32, 0, 48],
													"uvSouth": [16, 32, 32, 48],
													"uvWest": [16, 32, 16, 48],
													"uvUp": [16, 32, 0, 32],
													"uvDown": [32, 32, 16, 32]
												},
												{
													"coordinates": [0, 0, -8, 0, 13, 16],
													"uvNorth": [16, 32, 16, 48],
													"uvEast": [0, 32, 16, 48],
													"uvSouth": [32, 32, 32, 48],
													"uvWest": [16, 32, 32, 48],
													"uvUp": [16, 32, 16, 16],
													"uvDown": [16, 16, 16, 32]
												}
											]
										},
										{
											"id": "mushroom3",
											"invertAxis": "xy",
											"translate": [-3.25, 0, 11],
											"rotate": [0, 5, 0],
											"boxes": [
												{
													"coordinates": [-8, 0, 0, 16, 13, 0],
													"uvNorth": [0, 32, 16, 48],
													"uvEast": [0, 32, 0, 48],
													"uvSouth": [16, 32, 32, 48],
													"uvWest": [16, 32, 16, 48],
													"uvUp": [16, 32, 0, 32],
													"uvDown": [32, 32, 16, 32]
												},
												{
													"coordinates": [0, 0, -8, 0, 13, 16],
													"uvNorth": [16, 32, 16, 48],
													"uvEast": [0, 32, 16, 48],
													"uvSouth": [32, 32, 32, 48],
													"uvWest": [16, 32, 32, 48],
													"uvUp": [16, 32, 16, 16],
													"uvDown": [16, 16, 16, 32]
												}
											]
										}
									]
								}
							],
							"boxes": [
								{
									"coordinates": [-6, -8, -7, 12, 18, 10],
									"uvNorth": [28, 14, 40, 32],
									"uvEast": [18, 14, 28, 32],
									"uvSouth": [50, 14, 62, 32],
									"uvWest": [40, 14, 50, 32],
									"uvUp": [40, 14, 28, 4],
									"uvDown": [52, 4, 40, 14]
								},
								{
									"coordinates": [-2, -8, -8, 4, 6, 1],
									"uvNorth": [53, 1, 57, 7],
									"uvEast": [52, 1, 53, 7],
									"uvSouth": [58, 1, 62, 7],
									"uvWest": [57, 1, 58, 7],
									"uvUp": [57, 1, 53, 0],
									"uvDown": [61, 0, 57, 1]
								}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -20, 8],
					"boxes": [
						{
							"coordinates": [4, 22, -12, 1, 3, 1],
							"uvNorth": [23, 1, 24, 4],
							"uvEast": [22, 1, 23, 4],
							"uvSouth": [25, 1, 26, 4],
							"uvWest": [24, 1, 25, 4],
							"uvUp": [24, 1, 23, 0],
							"uvDown": [25, 0, 24, 1]
						},
						{
							"coordinates": [-4, 16, -14, 8, 8, 6],
							"uvNorth": [6, 6, 14, 14],
							"uvEast": [0, 6, 6, 14],
							"uvSouth": [20, 6, 28, 14],
							"uvWest": [14, 6, 20, 14],
							"uvUp": [14, 6, 6, 0],
							"uvDown": [22, 0, 14, 6]
						},
						{
							"coordinates": [-5, 22, -12, 1, 3, 1],
							"uvNorth": [23, 1, 24, 4],
							"uvEast": [22, 1, 23, 4],
							"uvSouth": [25, 1, 26, 4],
							"uvWest": [24, 1, 25, 4],
							"uvUp": [24, 1, 23, 0],
							"uvDown": [25, 0, 24, 1]
						}
					],
					"submodels": [
						{
							"id": "mushroom1",
							"invertAxis": "xy",
							"translate": [0, 24, -11],
							"rotate": [0, 35, 0],
							"boxes": [
								{
									"coordinates": [-8, 0, 0, 16, 13, 0],
									"uvNorth": [0, 32, 16, 48],
									"uvEast": [0, 32, 0, 48],
									"uvSouth": [16, 32, 32, 48],
									"uvWest": [16, 32, 16, 48],
									"uvUp": [16, 32, 0, 32],
									"uvDown": [32, 32, 16, 32]
								},
								{
									"coordinates": [0, 0, -8, 0, 13, 16],
									"uvNorth": [16, 32, 16, 48],
									"uvEast": [0, 32, 16, 48],
									"uvSouth": [32, 32, 32, 48],
									"uvWest": [16, 32, 32, 48],
									"uvUp": [16, 32, 16, 16],
									"uvDown": [16, 16, 16, 32]
								}
							]
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-4, -12, -7],
					"boxes": [
						{
							"coordinates": [-6, 0, 5, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [4, -12, -7],
					"boxes": [
						{
							"coordinates": [2, 0, 5, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-4, -12, 6],
					"boxes": [
						{
							"coordinates": [-6, 0, -7, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4, -12, 6],
					"boxes": [
						{
							"coordinates": [2, 0, -7, 4, 12, 4],
							"uvNorth": [4, 20, 8, 32],
							"uvEast": [0, 20, 4, 32],
							"uvSouth": [12, 20, 16, 32],
							"uvWest": [8, 20, 12, 32],
							"uvUp": [8, 20, 4, 16],
							"uvDown": [12, 16, 8, 20]
						}
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
					"boxes": [
						{"coordinates": [-6, -2, -48, 12, 4, 16], "textureOffset": [176, 65]}
					]
				},
				{
					"part": "spine",
					"id": "spine",
					"invertAxis": "xy",
					"translate": [0, -5, 13],
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
					"boxes": [
						{"coordinates": [-24, -20, 34, 16, 32, 16], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "front_leg",
					"id": "front_leg",
					"invertAxis": "xy",
					"translate": [-12, -4, -2],
					"boxes": [
						{"coordinates": [-16, -16, -2, 8, 24, 8], "textureOffset": [112, 104]}
					]
				},
				{
					"part": "rear_leg_tip",
					"id": "rear_leg_tip",
					"invertAxis": "xy",
					"translate": [-16, 22, -36],
					"boxes": [
						{"coordinates": [-22, -52, 36, 12, 32, 12], "textureOffset": [196, 0]}
					]
				},
				{
					"part": "front_leg_tip",
					"id": "front_leg_tip",
					"invertAxis": "xy",
					"translate": [-12, 17, -2],
					"boxes": [
						{"coordinates": [-15, -40, -1, 6, 24, 6], "textureOffset": [226, 138]}
					]
				},
				{
					"part": "rear_foot",
					"id": "rear_foot",
					"invertAxis": "xy",
					"translate": [-16, 52, -44],
					"boxes": [
						{"coordinates": [-25, -58, 24, 18, 6, 24], "textureOffset": [112, 0]}
					]
				},
				{
					"part": "front_foot",
					"id": "front_foot",
					"invertAxis": "xy",
					"translate": [-12, 40, -2],
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
					"translate": [-8, -5, 7],
					"boxes": [
						{"coordinates": [-7, 0, -7, 14, 5, 14], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "base",
					"id": "base",
					"invertAxis": "xy",
					"translate": [-8, -14, 8],
					"boxes": [
						{"coordinates": [-7, 4, -7, 14, 10, 14], "textureOffset": [0, 19]}
					]
				},
				{
					"part": "knob",
					"id": "knob",
					"invertAxis": "xy",
					"translate": [-8, -6, 8],
					"boxes": [
						{"coordinates": [-1, 3, 7, 2, 4, 1], "textureOffset": [0, 0]}
					]
				}
			]
		}`
	}
	EntityOptions.end_crystal_no_base_14 = {
		name: 'End Crystal No Base [1.14]',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "cube",
					"id": "cube",
					"invertAxis": "xy",
					"translate": [0, -10, 0],
					"boxes": [
						{"coordinates": [-4, 6, -4, 8, 8, 8], "textureOffset": [32, 0]}
					]
				},
				{
					"part": "glass",
					"id": "glass",
					"invertAxis": "xy",
					"translate": [0, -10, 0],
					"boxes": [
						{"coordinates": [-4, 6, -4, 8, 8, 8], "textureOffset": [0, 0]}
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
	EntityOptions.zombie_pigman_15 = {
		name: 'Zombie Pigman [1.15]',
		model: `{
			"textureSize": [64, 64],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
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
					"translate": [5, -22, 0],
					"boxes": [
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-5, -22, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [1.9, -12, 0],
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-1.9, -12, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]}
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
	EntityOptions.bee = {
		name: 'Bee',
		model: `{
			"textureSize": [64, 64],
			"models": [
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -7, -3],
					"boxes": [
						{"coordinates": [-3, 2, -5, 7, 7, 10], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "left_wing",
					"id": "left_wing",
					"invertAxis": "xy",
					"translate": [-1, -9, 3],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-10, 9, -3, 9, 0, 6], "textureOffset": [0, 18]}
					]
				},
				{
					"part": "right_wing",
					"id": "right_wing",
					"invertAxis": "xy",
					"translate": [2, -9, 3],
					"boxes": [
						{"coordinates": [2, 9, -3, 9, 0, 6], "textureOffset": [0, 18]}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [0.5, -2, 2],
					"boxes": [
						{"coordinates": [-1, 0, -2, 3, 2, 0], "textureOffset": [28, 1]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [0.5, -2, 0],
					"boxes": [
						{"coordinates": [-2, 0, 0, 5, 2, 0], "textureOffset": [27, 3]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [0.5, -2, -2],
					"boxes": [
						{"coordinates": [-2, 0, 2, 5, 2, 0], "textureOffset": [27, 5]}
					]
				},
				{
					"part": "antenna",
					"id": "antenna",
					"invertAxis": "xy",
					"translate": [1.5, -7, 5],
					"boxes": [
						{"coordinates": [2, 7, -8, 1, 2, 3], "textureOffset": [2, 3]},
						{"coordinates": [-2, 7, -8, 1, 2, 3], "textureOffset": [2, 0]}
					]
				},
				{
					"part": "stinger",
					"id": "stinger",
					"invertAxis": "xy",
					"translate": [0.5, -5.5, -5],
					"boxes": [
						{"coordinates": [0.5, 5, 5, 0, 1, 2], "textureOffset": [3, 1]}
					]
				}
			]
		}`
	}
	EntityOptions.bell = {
		name: 'Bell',
		model: `{
			"textureSize": [32, 32],
			"models": [
				{
					"part": "bell",
					"id": "bell",
					"invertAxis": "xy",
					"translate": [0, -1, 0],
					"submodels": [
						{
							"id": "rotation",
							"invertAxis": "xy",
							"translate": [0, 1, 0],
							"rotate": [-180, 0, 0],
							"boxes": [
								{"coordinates": [-4, -1, -4, 8, 2, 8], "textureOffset": [0, 13]},
								{"coordinates": [-3, -8, -3, 6, 7, 6], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"rotation.rx": "0"
						}
					]
				}
			]
		}`
	}
	EntityOptions.chest_minecart = {
		name: 'Chest Minecart',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "front",
					"id": "front",
					"invertAxis": "xy",
					"translate": [0, -1, -9],
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "back2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "right2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "left2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 90],
							"boxes": [
								{"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
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
					"rotate": [-180, -180, -180]
				},
				{
					"part": "right",
					"id": "right",
					"invertAxis": "xy",
					"translate": [0, -25, 7]
				},
				{
					"part": "left",
					"id": "left",
					"invertAxis": "xy",
					"translate": [0, -25, -7]
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
	EntityOptions.command_block_minecart = {
		name: 'Command Block Minecart',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "front",
					"id": "front",
					"invertAxis": "xy",
					"translate": [0, -1, -9],
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "back2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "right2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "left2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 90],
							"boxes": [
								{"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
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
					"rotate": [-180, -180, -180]
				},
				{
					"part": "right",
					"id": "right",
					"invertAxis": "xy",
					"translate": [0, -25, 7]
				},
				{
					"part": "left",
					"id": "left",
					"invertAxis": "xy",
					"translate": [0, -25, -7]
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
					"boxes": [
						{"coordinates": [-6, 2, -8, 12, 12, 16], "textureOffset": [0, 0]},
						{"coordinates": [-6, 14, -6, 12, 2, 12], "textureOffset": [16, 40]},
						{"coordinates": [-6, 0, -6, 12, 2, 12], "textureOffset": [16, 40]},
						{"coordinates": [6, 2, -6, 2, 12, 12], "textureOffset": [0, 28]}
					],
					"submodels": [
						{
							"id": "body_flipped",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 2, -6, 2, 12, 12], "textureOffset": [0, 28]}
							]
						}
					]
				},
				{
					"part": "eye",
					"id": "eye",
					"invertAxis": "xy",
					"translate": [0, -23.5, 8.25],
					"boxes": [
						{"coordinates": [-1, 6.5, -8.25, 2, 2, 1], "textureOffset": [8, 0]}
					]
				},
				{
					"part": "tail1",
					"id": "tail1",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-2, 6, 7, 4, 4, 8], "textureOffset": [40, 0]}
					]
				},
				{
					"part": "tail2",
					"id": "tail2",
					"invertAxis": "xy",
					"translate": [-1.5, -23.5, -14],
					"boxes": [
						{"coordinates": [-1.5, 6.5, 14, 3, 3, 7], "textureOffset": [0, 54]}
					]
				},
				{
					"part": "tail3",
					"id": "tail3",
					"invertAxis": "xy",
					"translate": [-1, -23, -20],
					"boxes": [
						{"coordinates": [-1, 7, 20, 2, 2, 6], "textureOffset": [41, 32]},
						{"coordinates": [-1, 3.5, 23, 1, 9, 9], "textureOffset": [25, 19]}
					]
				},
				{
					"part": "spine1",
					"id": "spine1",
					"invertAxis": "xy",
					"translate": [0, -17.5, -7],
					"submodels": [
						{
							"id": "spine1_rotation",
							"invertAxis": "xy",
							"translate": [0, 15, 7],
							"rotate": [45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine1_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine2",
					"id": "spine2",
					"invertAxis": "xy",
					"translate": [0, -17.5, 7],
					"submodels": [
						{
							"id": "spine2_rotation",
							"invertAxis": "xy",
							"translate": [0, 15, -7],
							"rotate": [-45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine2_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine3",
					"id": "spine3",
					"invertAxis": "xy",
					"translate": [7, -17.5, 0],
					"submodels": [
						{
							"id": "spine3_rotation",
							"invertAxis": "xy",
							"translate": [-7, 15, 0],
							"rotate": [0, 0, 45],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine3_rotation.rz": "0"
						}
					]
				},
				{
					"part": "spine4",
					"id": "spine4",
					"invertAxis": "xy",
					"translate": [-7, -17.5, 0],
					"submodels": [
						{
							"id": "spine4_rotation",
							"invertAxis": "xy",
							"translate": [7, 15, 0],
							"rotate": [0, 0, -45],
							"boxes": [
								{"coordinates": [-1, -2, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine4_rotation.rz": "0"
						}
					]
				},
				{
					"part": "spine5",
					"id": "spine5",
					"invertAxis": "xy",
					"translate": [-7, -5.5, 7],
					"submodels": [
						{
							"id": "spine5_rotation",
							"invertAxis": "xy",
							"translate": [7, 8, -7],
							"rotate": [90, -45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine5_rotation.rx": "0",
							"spine5_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine6",
					"id": "spine6",
					"invertAxis": "xy",
					"translate": [7, -5.5, 7],
					"submodels": [
						{
							"id": "spine6_rotation",
							"invertAxis": "xy",
							"translate": [-7, 8, -7],
							"rotate": [90, 45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine6_rotation.rx": "0",
							"spine6_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine7",
					"id": "spine7",
					"invertAxis": "xy",
					"translate": [7, -5.5, -7],
					"submodels": [
						{
							"id": "spine7_rotation",
							"invertAxis": "xy",
							"translate": [-7, 8, 7],
							"rotate": [-90, -45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine7_rotation.rx": "0",
							"spine7_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine8",
					"id": "spine8",
					"invertAxis": "xy",
					"translate": [-7, -5.5, -7],
					"submodels": [
						{
							"id": "spine8_rotation",
							"invertAxis": "xy",
							"translate": [7, 8, 7],
							"rotate": [-90, 45, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine8_rotation.rx": "0",
							"spine8_rotation.ry": "0"
						}
					]
				},
				{
					"part": "spine9",
					"id": "spine9",
					"invertAxis": "xy",
					"translate": [0, 1.5, -7],
					"submodels": [
						{
							"id": "spine9_rotation",
							"invertAxis": "xy",
							"translate": [0, 1, 7],
							"rotate": [-45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine9_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine10",
					"id": "spine10",
					"invertAxis": "xy",
					"translate": [0, 1.5, 7],
					"submodels": [
						{
							"id": "spine10_rotation",
							"invertAxis": "xy",
							"translate": [0, 1, -7],
							"rotate": [45, 0, 0],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine10_rotation.rx": "0"
						}
					]
				},
				{
					"part": "spine11",
					"id": "spine11",
					"invertAxis": "xy",
					"translate": [7, 1.5, 0],
					"submodels": [
						{
							"id": "spine11_rotation",
							"invertAxis": "xy",
							"translate": [-7, 1, 0],
							"rotate": [0, 0, -45],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine11_rotation.rz": "0"
						}
					]
				},
				{
					"part": "spine12",
					"id": "spine12",
					"invertAxis": "xy",
					"translate": [-7, 1.5, 0],
					"submodels": [
						{
							"id": "spine12_rotation",
							"invertAxis": "xy",
							"translate": [7, 1, 0],
							"rotate": [0, 0, 45],
							"boxes": [
								{"coordinates": [-1, -7, -1, 2, 9, 2], "textureOffset": [0, 0]}
							]
						}
					],
					"animations": [
						{
							"spine12_rotation.rz": "0"
						}
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
	EntityOptions.furnace_minecart = {
		name: 'Furnace Minecart',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "front",
					"id": "front",
					"invertAxis": "xy",
					"translate": [0, -1, -9],
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "back2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "right2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "left2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 90],
							"boxes": [
								{"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
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
					"rotate": [-180, -180, -180]
				},
				{
					"part": "right",
					"id": "right",
					"invertAxis": "xy",
					"translate": [0, -25, 7]
				},
				{
					"part": "left",
					"id": "left",
					"invertAxis": "xy",
					"translate": [0, -25, -7]
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
	EntityOptions.hoglin = {
		name: 'Hoglin',
		model: `{
			"textureSize": [128, 64],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [-1, -24, 8.5],
					"rotate": [-45, 0, 0],
					"boxes": [
						{"coordinates": [-7, 19, -28.5, 14, 6, 19], "textureOffset": [61, 1]},
						{"coordinates": [-8, 20.25, -22.5, 2, 11, 2], "textureOffset": [1, 13]},
						{"coordinates": [6, 20.25, -22.5, 2, 11, 2], "textureOffset": [10, 13]}
					],
					"submodels": [
						{
							"id": "bone3",
							"invertAxis": "xy",
							"translate": [7, 25.25, -13.5],
							"rotate": [0, 0, -30],
							"boxes": [
								{"coordinates": [0.125, -1.71651, -1, 6, 1, 4], "textureOffset": [1, 1]}
							]
						},
						{
							"id": "bone2",
							"invertAxis": "xy",
							"translate": [-7, 25.25, -13.5],
							"rotate": [0, 0, 30],
							"boxes": [
								{"coordinates": [-6.125, -1.71651, -1, 6, 1, 4], "textureOffset": [1, 6]}
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
						{"coordinates": [0, 22, -11.5, 0, 10, 19], "textureOffset": [90, 33]}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-4, -11, 5.5],
					"boxes": [
						{"coordinates": [-7, 0, -7.5, 6, 14, 6], "textureOffset": [41, 42]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [4, -11, 5.5],
					"boxes": [
						{"coordinates": [1, 0, -7.5, 6, 14, 6], "textureOffset": [66, 42]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [-4.5, -5.5, -12],
					"boxes": [
						{"coordinates": [-7, 0, 11.5, 5, 11, 5], "textureOffset": [0, 45]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4.5, -11, -13],
					"boxes": [
						{"coordinates": [2, 0, 11.5, 5, 11, 5], "textureOffset": [21, 45]}
					]
				}
			]
		}`
	}
	EntityOptions.hopper_minecart = {
		name: 'Hopper Minecart',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "front",
					"id": "front",
					"invertAxis": "xy",
					"translate": [0, -1, -9],
					"submodels": [
						{
							"id": "front2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "back2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"boxes": [
								{"coordinates": [-8, 2, 8, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "right2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "left2",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-8, 2, 6, 16, 8, 2], "textureOffset": [0, 0]}
							]
						},
						{
							"id": "base",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"rotate": [0, 90, 90],
							"boxes": [
								{"coordinates": [-10, -8, 0, 20, 16, 2], "textureOffset": [0, 10]}
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
					"rotate": [-180, -180, -180]
				},
				{
					"part": "right",
					"id": "right",
					"invertAxis": "xy",
					"translate": [0, -25, 7]
				},
				{
					"part": "left",
					"id": "left",
					"invertAxis": "xy",
					"translate": [0, -25, -7]
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
	EntityOptions.llama_carpet = {
		name: 'Llama Carpet',
		model: `{
			"textureSize": [128, 64],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -17, 6],
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
					"submodels": [
						{
							"id": "body_rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-6, -8, -7, 12, 18, 10], "textureOffset": [29, 0]}
							]
						}
					],
					"animations": [
						{
							"body_rotation.rx": "0"
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-3.5, -14, -6],
					"boxes": [
						{"coordinates": [-5.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [3.5, -14, -6],
					"boxes": [
						{"coordinates": [1.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-3.5, -14, 5],
					"boxes": [
						{"coordinates": [-5.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [3.5, -14, 5],
					"boxes": [
						{"coordinates": [1.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
					]
				}
			]
		}`
	}
	EntityOptions.llama_spit = {
		name: 'Llama Spit',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "spit",
					"id": "spit",
					"invertAxis": "xy",
					"translate": [0, -4, 0],
					"boxes": [
						{"coordinates": [0, 6, -2, 2, 2, 2], "textureOffset": [0, 0]},
						{"coordinates": [0, 4, -2, 2, 2, 2], "textureOffset": [0, 0]},
						{"coordinates": [0, 4, 2, 2, 2, 2], "textureOffset": [0, 0]},
						{"coordinates": [-4, 4, -2, 2, 2, 2], "textureOffset": [0, 0]},
						{"coordinates": [0, 0, -2, 2, 2, 2], "textureOffset": [0, 0]},
						{"coordinates": [0, 4, -4, 2, 2, 2], "textureOffset": [0, 0]},
						{"coordinates": [2, 4, -2, 2, 2, 2], "textureOffset": [0, 0]}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]},
						{"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 32], "sizeAdd": 0.25}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [8, -22, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16]},
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 32], "sizeAdd": 0.25}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [-8, -22, 0],
					"boxes": [
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [32, 48]},
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [48, 48], "sizeAdd": 0.25}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [2, -12, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]},
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 32], "sizeAdd": 0.25}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, 0],
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [16, 48]},
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 48], "sizeAdd": 0.25}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "headwear",
					"id": "headwear",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 0.25}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16]},
						{"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 32], "sizeAdd": 0.25}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [7, -22, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 3, 12, 4], "textureOffset": [40, 16]},
						{"coordinates": [4, 12, -2, 3, 12, 4], "textureOffset": [40, 32], "sizeAdd": 0.25}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [-7, -22, 0],
					"boxes": [
						{"coordinates": [-7, 12, -2, 3, 12, 4], "textureOffset": [32, 48]},
						{"coordinates": [-7, 12, -2, 3, 12, 4], "textureOffset": [48, 48], "sizeAdd": 0.25}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16]},
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 32], "sizeAdd": 0.25}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, 0],
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [16, 48]},
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 48], "sizeAdd": 0.25}
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
	EntityOptions.spectral_arrow = {
		name: 'Spectral Arrow',
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
					"submodels": [
						{
							"id": "body_rotation",
							"invertAxis": "xy",
							"translate": [0, 19, 2],
							"rotate": [-90, 0, 0],
							"boxes": [
								{"coordinates": [-6, -8, -7, 12, 18, 10], "textureOffset": [29, 0]}
							]
						}
					],
					"animations": [
						{
							"body_rotation.rx": "0"
						}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-3.5, -14, -6],
					"boxes": [
						{"coordinates": [-5.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [3.5, -14, -6],
					"boxes": [
						{"coordinates": [1.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [-3.5, -14, 5],
					"boxes": [
						{"coordinates": [-5.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [3.5, -14, 5],
					"boxes": [
						{"coordinates": [1.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
					]
				},
				{
					"part": "chest_left",
					"id": "chest_left",
					"invertAxis": "xy",
					"translate": [8.5, -21, -3],
					"submodels": [
						{
							"id": "chest_left_rotation",
							"invertAxis": "xy",
							"translate": [-7, 17, 4.5],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-6.5, -4, -1.5, 8, 8, 3], "textureOffset": [45, 41]}
							]
						}
					],
					"animations": [
						{
							"chest_left_rotation.ry": "0"
						}
					]
				},
				{
					"part": "chest_right",
					"id": "chest_right",
					"invertAxis": "xy",
					"translate": [-10.5, -21, 2],
					"submodels": [
						{
							"id": "chest_right_rotation",
							"invertAxis": "xy",
							"translate": [7, 17, -0.5],
							"rotate": [0, -90, 0],
							"boxes": [
								{"coordinates": [-1.5, -4, -1.5, 8, 8, 3], "textureOffset": [45, 28]}
							]
						}
					],
					"animations": [
						{
							"chest_right_rotation.ry": "0"
						}
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
					"boxes": [
						{"coordinates": [-4, 24, -4, 8, 10, 8], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "nose",
					"id": "nose",
					"invertAxis": "xy",
					"translate": [0, -26, 0],
					"boxes": [
						{"coordinates": [-1, 23, -6, 2, 4, 2], "textureOffset": [24, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -24, 0],
					"boxes": [
						{"coordinates": [-4, 12, -3, 8, 12, 6], "textureOffset": [16, 20]}
					]
				},
				{
					"part": "arms",
					"id": "arms",
					"invertAxis": "xy",
					"translate": [0, -22, 0],
					"boxes": [
						{"coordinates": [-4, 16, -2, 8, 4, 4], "textureOffset": [40, 38]},
						{"coordinates": [4, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
					],
					"submodels": [
						{
							"id": "mirrored",
							"invertAxis": "xy",
							"translate": [0, 0, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 16, -2, 4, 8, 4], "textureOffset": [44, 22]}
							]
						}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, 0],
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [2, -12, 0],
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
			"textureSize": [128, 64],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [-1, -24, 8.5],
					"rotate": [-45, 0, 0],
					"boxes": [
						{"coordinates": [-7, 19, -28.5, 14, 6, 19], "textureOffset": [61, 1]},
						{"coordinates": [-8, 20.25, -22.5, 2, 11, 2], "textureOffset": [1, 13]},
						{"coordinates": [6, 20.25, -22.5, 2, 11, 2], "textureOffset": [10, 13]}
					],
					"submodels": [
						{
							"id": "bone3",
							"invertAxis": "xy",
							"translate": [7, 25.25, -13.5],
							"rotate": [0, 0, -30],
							"boxes": [
								{"coordinates": [0.125, -1.71651, -1, 6, 1, 4], "textureOffset": [1, 1]}
							]
						},
						{
							"id": "bone2",
							"invertAxis": "xy",
							"translate": [-7, 25.25, -13.5],
							"rotate": [0, 0, 30],
							"boxes": [
								{"coordinates": [-6.125, -1.71651, -1, 6, 1, 4], "textureOffset": [1, 6]}
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
						{"coordinates": [0, 22, -11.5, 0, 10, 19], "textureOffset": [90, 33]}
					]
				},
				{
					"part": "leg1",
					"id": "leg1",
					"invertAxis": "xy",
					"translate": [-4, -11, 5.5],
					"boxes": [
						{"coordinates": [-7, 0, -7.5, 6, 14, 6], "textureOffset": [41, 42]}
					]
				},
				{
					"part": "leg3",
					"id": "leg3",
					"invertAxis": "xy",
					"translate": [4, -11, 5.5],
					"boxes": [
						{"coordinates": [1, 0, -7.5, 6, 14, 6], "textureOffset": [66, 42]}
					]
				},
				{
					"part": "leg2",
					"id": "leg2",
					"invertAxis": "xy",
					"translate": [-4.5, -5.5, -12],
					"boxes": [
						{"coordinates": [-7, 0, 11.5, 5, 11, 5], "textureOffset": [0, 45]}
					]
				},
				{
					"part": "leg4",
					"id": "leg4",
					"invertAxis": "xy",
					"translate": [4.5, -11, -13],
					"boxes": [
						{"coordinates": [2, 0, 11.5, 5, 11, 5], "textureOffset": [21, 45]}
					]
				}
			]
		}`
	}
})()
