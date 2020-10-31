(function () {
	const EntityOptions = {};
	let GeneratorAction;
	Plugin.register('cem_template_loader', {
		title: 'CEM Template Loader',
		icon: 'keyboard_capslock',
		author: 'Ewan Howell',
		description: 'Load template entity models for use with OptiFine CEM.',
		version: '0.2.7',
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
		texture_name: 'armor_stand.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTA0VDE1OjM3OjEzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQxNTo0MzowMiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQxNTo0MzowMiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphNjIxOTgwYS03MTY1LWRkNDgtYjIyNS1mZTkyNzU1NWU1YmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YTYyMTk4MGEtNzE2NS1kZDQ4LWIyMjUtZmU5Mjc1NTVlNWJlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTYyMTk4MGEtNzE2NS1kZDQ4LWIyMjUtZmU5Mjc1NTVlNWJlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNjIxOTgwYS03MTY1LWRkNDgtYjIyNS1mZTkyNzU1NWU1YmUiIHN0RXZ0OndoZW49IjIwMjAtMTAtMDRUMTU6Mzc6MTMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5XrX36AAACkElEQVR4nO2bv2/TQBTHP4cstVI2kHCkIAQUxMIf0D0jfwB/AnsygfgTmgwwdYoYIqZu7dbuFXMYkKigFZGSijUDkxnSc37ZvnOcy3PwfaQoTuyz3/v63bt350RFUQTA2bebCKDX+QTASe9IMcfp4DrXfkCd9I6s97tC+5fGPecWlBzVHHUigPrgLQDHXz8CELz5A8DrWgOX+wG1f9DdtF8xPgIMeAGkDZDGCyBtgDSVFyA4D1vTgia8+6b5bvGIcTd7HNlxNhEBClCjV8dKby+9So3vAkVPcB62Zh9CkrpQ0Us4xSiAMUfsOEYBlJp1Y1NdnXaKdRptC6MAazq9MygpB+cjC9ytN/jZoAHxCHC9HrH3rJOZgyofAV4AaQOkKVwJZrGc6cuIjwCXJ88aYcoSHT4C5u+ErqZsmau6rFiu7jbB2WSodC2wDitd4PD5I6uGlz9+A9AI61bHD8ejHGZtjxUBtGO2lMGxi3obaAPQ11++n75FUSezbaBLUYAvgwe5Lvz5xf3ZiWaPulLpf2jF19o/6Np2B+Nx88k2b3INAA7Dh1yObwF4Uq9ZNfw1mgBQe/qYyc8bAPYaL63a/h1+j7cv6u07i5PvYHOUfQeh2IgSALHzMHPMFu08LDq2KabhDWkCFSWW7nRwDSzMxxMb7NpIYZrtrlUI/U8jRaD7mE6AOrH1r6arvS6f3ZeByleCXgBpA6TxAkgbIE3lBQhcV1plx0fAOo12ccqcxsJ02IYiU2Yb+letXPbkmFYnUo6VSYf4h6MGKi9AnARN83zTvN7Fiu82qHwErPxfII2E3/knUjQrbxqfBA2I/UKkLFQ+ArwA0gZI4wWQNkAaL4C0AdJ4AaQNkMYLIG2ANP8AUOsMvSm4v80AAAAASUVORK5CYII=',
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
		texture_name: 'cow.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFpmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTA0VDE1OjIyOjM4KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQxNToyNDoxOSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQxNToyNDoxOSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplOGQwMmRiOC1lNWM4LTM5NGMtOGNlYy0yMzBkNTNiMTU0MGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZThkMDJkYjgtZTVjOC0zOTRjLThjZWMtMjMwZDUzYjE1NDBkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZThkMDJkYjgtZTVjOC0zOTRjLThjZWMtMjMwZDUzYjE1NDBkIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDpkNTE4NGExYi0wZDcyLWI4NDMtODZlNy1jY2ZkNGVhZTE0NTg8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOGQwMmRiOC1lNWM4LTM5NGMtOGNlYy0yMzBkNTNiMTU0MGQiIHN0RXZ0OndoZW49IjIwMjAtMTAtMDRUMTU6MjI6MzgrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz79SwaVAAACM0lEQVRoge2ZP0vDQBjGn1cCFbpVMIGK+K/4FbrXb+Dg7OQotC6KH6FxsJNT6FCcuummuzjXQfBvsZCKg4uD0zloNHlz10va6qHmt+XNcffwJvfkvTckhACHiHDUuY/fCOG5jUG30fbqdNS5F57bQNurUxCXrZcGItKO4dq51rZXp0CHNWii8tKMNH529QAAKNqO9H6v76Piu+KwM4VmqYDWdVVMLu7plY+BYN0wzVIB1trT53VrtyoAEABM/IQoE8w5ecw5+UgsV1xGrrgcif3ZBCTFSrKnhuHErhJsAJVtAIAQLogIxxfdVCbA9+/q+tbA8c+pVGo8INjrKnp9P9ViQggcX3SV3qJaX+U1o+oBAKviu9Inwo2E0ywV5BN+mM3rTU3xpDdTyBueO/8lFnvtXcZiFgCU7elI8Kz/CAAxE+GT5+dnI/GX2y4AxIxmkIBxc+rUCKhFYi0A2ImOE8IFkJlgloAsAaYFmObfJ8ACvlyfI/uUhAlcn6Nze119wRnm+54UGvV0FrDS30s0kdPZSDXvwfl+onHhw04ScgsuAZpKMC28nuDo6guOqt7g6OoPTvgNjZ0Fkpylw9fjeoNMITXB8tJMpF4v2k7ievy3kX0FZEHu0t/pwqaJnQZl7aQwresq3/Q/0ur6LiaAd/cOOzhvJ+XnZyNOLGst/Vb+vQdkCTAtwDRZAkwLME2WANMCTJMlwLQA00g7QrwTxDs/qo6PqrPE0XWaOKrOE2eY/w5vSZzMh+Y5wgsAAAAASUVORK5CYII=',
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
		texture_name: 'head_creeper.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABA0lEQVRoQ2NkIAC2XHn4H5+S+b2T8Zqwdn4PIyE78MnT2n6CjgM5wEJFBqsbT9x5wgAKAGlxCazyT1++YKBGANDS/tEAIJQ8R1PAaBYYLQNGC8FhXQ06v+jFW89LXEnHW07OPDUJrzxL+Bu88t7c0njlaW0/IygALMTFsNfzL18xgBygIMGNVf7Bi68MoADgVpTDKv/1/iMGUACwS6tjlf/59CYDKAAG0v7RABhNAaNZYLQMGC0E8dVDtK6GBrwaJNQZGu7yBLvDowEwzENgNAUM8wgm6L3RFEAwiIa5gtEUMMwjmKD3RlMAwSAa5gpGU8Awj2CC3htNAQSDaJgrGPEpAAC17qpg/PE3YwAAAABJRU5ErkJggg==',
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
		texture_name: 'dolphin.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACiElEQVR4Xu1ZvU4DMQy+k5BA6k6LihAIJF6hOw/BI/AoLJQBJqY+AVsfomLugoTEj6jUIgaWDkwgn3B1ShMnl1xdX/GNl8R2vnz+iZNnjm84fv1xjcH/Qf+WGs7uB1c5OcEyuAqdIBNsddnjNBIW9k72rXsYPb0XAHTbHev4ZDaNBqBunQqAMkBdID4GrCMIpsSAr8u9JZM744vs7uFm6f/W+We2c3yd52fTvjXaw0LqswmF+SCY+kAplXlSAei1dxfiR7OPDAFoHR0s/s+f3wo7FwCUF8EsXHjYaVltfZnOC1TLQmEiCt7unlrXfU8eC6UKAFF7pDLAFB3kApvCgJjiq4gBCkApcDQ5BkQzwOaS68oC3Kl3KSLjhQQvOzGowiZc6ZXaYCzolExfWl4pAGZsoQyNTb2UzJC0rACYCNbpAo1ggOmr6IdmqYu+RFVyZTBt6VWkC/x7AMibizFotqzMtlg5YzQ2C1CAlNtkZluMaoP5en2o09dnxHmhqdnXDgN5lRqXKQC4Ljm4KV+fEedV6TcqAJ5+oDJAXYAxBoRkm8YHQVtTEjbuu+QgOLF9RlxvFmligmDI6cfOoeoNVzsMdUF1y5IGYzcXss5Vcrs6wigTb4qVASgbRVWCIcbXMScZgColq+nLLp+1bcxsTIReqnwgJbtA6K3NbFi43gZsBpuNCd/7gG/TdY5bu8I2BQrA3zMTvhZtFANCKSUxBoTa7ppXKQukKpO4XgGQeCqcNikDONGWqEsZIPFUOG1SBnCiLVGXMkDiqXDapAzgRFuiLmWAxFPhtEkZwIm2RF3KAImnwmmTMoATbYm6lAEST4XTJmUAJ9oSdSkDJJ4Kp03KAE60Jer6BQiNoXCK3JJrAAAAAElFTkSuQmCC',
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
				},
				{
					"part": "tail_fin",
					"id": "tail_fin",
					"invertAxis": "xy",
					"translate": [0, -2.5, -20],
					"boxes": [
						{"coordinates": [-5, 2, 19, 10, 1, 6], "textureOffset": [19, 20]}
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
		texture_name: 'head_dragon.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAKH0lEQVR4Xu3dsYqUBxfG8RGECNvrgkEiBnIL21vmArwE+3S5gjTRwlRWXkGakIsQa5tAwEQirGJrkcqwA4ZolGXmeXfP+7i/VMlnzrzH35n9f2oYvbT5xF+/Pv3z7ck3Pbr30/bf+PnRj5c+9e/639cj4G7ruUXDJp/8ovZGajjf/3d0t867TW0tAFPyZ/RcATgj2M/0ZQXgMzusAHxmBz3j744AnDHwWb/87eN721+reffX4dO72799+OTBe4++fOf19p+v3Lrv13LO+ihFry8ARcf62KoCUH7A4fUvffgGerfP0evvtn/7/S8/fHRF/48yfDmPJ7CAwDYAR9euvvdSj1++2vw3AAc3b7z37W+ePd8IwAL6XoLAsIAADB/A4wlMCvgpwKS+ZxMYFvArwsMH8HgCkwICMKnv2QSGBQRg+AAeT2BSQAAm9T2bwLCAAAwfwOMJTAoIwKS+ZxMYFhCA4QN4PIFJAQGY1PdsAsMCAjB8AI8nMCkgAJP6nk1gWEAAhg/g8QQmBQRgUt+zCQwLCMDwATyewKSAAEzqezaBYQEBGD6AxxOYFBCASX3PJjAsIADDB/B4ApMCAjCp79kEhgUEYPgAHk9gUkAAJvU9m8CwgAAMH2D68e/+KLF993j3p0fvO+9Pnd5Xbpk5AVjGsfZVTgJw9PWXe+3/+Pe/tn98/PVrh3vNv3h57I+d30tuuSEBWM6y8pUEoPJsiy0tAItRdr6QAHTebamtBWApydLXEYDSwy20tgAsBNn6MgLQerll9haAZRxrX0UAak+3yOICsAhj74sIQO/tlthcAJZQLH4NASg+3gKrC8ACiM0vIQDN18t3F4DcsPoVBKD6fPHyAhATdr+AAHTfL91eAFLB8nkBKD9guL4AhIDt4wLQfsFsfwHI/OqnL3oAdv005K6fflz7px0FoP5LOPsO7PoF8OHTdv2C+HB++gtklwDu+unHhk87CkD29TM+ffv43ttkicOnd5PxzcMnD6L5y3deR/NXbt2P3sMCEPEbnhY4CcDRtat7rfH45avNSQC+OjzYa/6P4zfbABzcvLHX/JtnzzcnAfji+jd7zf/94reNAOxF9+9QVM/s0aaXEBAAPwJI3kcCkOitYFYABCB5GwpAoreCWQEQgORtKACJ3gpmBUAAkrehACR6K5gVAAFI3oYCkOitYFYABCB5GwpAoreCWQEQgORtKACJ3gpmBUAAkrehACR6K5gVAAFI3oYCkOitYFYABCB5GwpAoreCWQEQgORtKACJ3gpmBSAPwC5n3PXTj9Ofdjzt+yYApwmt/NsvegC+PbgeXWjXT0Oe96cf0w87nYYjAKcJrfzbL/rHgU8CcF6fhjzvTz8u8WnH096+AnCakG9ftcB5/ghIAFb9VrDcRRQQgOzqfgSQ+ZkeFjjvnwL5NYDhg3s8gSUFdv09Ef1XgCX1vRaBYQG/J+DwATyewKSAAEzqezaBYQEBGD6AxxOYFBCASX3PJjAsIADDB/B4ApMCAjCp79kEhgUEYPgAHk9gUkAAJvU9m8CwgAAMH8DjCUwKCMCkvmcTGBYQgOEDeDyBSQEBmNT3bALDAgIwfACPJzApIACT+p5NYFjAx4GHD+DxBBIBvyFIorfZ+B2BMj/TwwJ+S7DsAAKQ+ZkeFhCA7AACkPmZHhbwU4DsAAKQ+ZkmUC0gANXnszyBTEAAMj/TBKoFBKD6fJYnkAkIQOZnmkC1gABUn8/yBDIBAcj8TBOoFhCA6vNZnkAmIACZn2kC1QICUH0+yxPIBAQg8zNNoFpAAKrPZ3kCmYAAZH6mCVQLCED1+SxPIBMQgMzPNIFqAQGoPp/lCWQCApD5mSZQLSAA1eezPIFMQAAyP9MEqgUEoPp8lieQCQhA5meaQLWAAFSfz/IEMgEByPxME6gWEIDq81meQCYgAJmfaQLVAgJQfT7LE8gEBCDzM02gWkAAqs9neQKZgABkfqYJVAsIQPX5LE8gExCAzM80gWoBAag+n+UJZAICkPmZJlAtIADV57M8gUxAADI/0wSqBQSg+nyWJ5AJCEDmZ5pAtYAAVJ/P8gQyAQHI/EwTqBYQgOrzWZ5AJiAAmZ9pAtUCAlB9PssTyAQEIPMzTaBaQACqz2d5ApmAAGR+pglUCwhA9fksTyATEIDMzzSBagEBqD6f5QlkAgKQ+ZkmUC0gANXnszyBTEAAMj/TBKoFBKD6fJYnkAkIQOZnmkC1gABUn8/yBDIBAcj8TBOoFhCA6vNZnkAmIACZn2kC1QICUH0+yxPIBAQg8zNNoFpAAKrPZ3kCmYAAZH6mCVQLCED1+SxPIBMQgMzPNIFqAQGoPp/lCWQCApD5mSZQLSAA1eezPIFMQAAyP9MEqgUEoPp8lieQCQhA5meaQLWAAFSfz/IEMgEByPxME6gWEIDq81meQCYgAJmfaQLVAgJQfT7LE8gEBCDzM02gWkAAqs9neQKZgABkfqYJVAsIQPX5LE8gExCAzM80gWoBAag+n+UJZAICkPmZJlAtIADV57M8gUxAADI/0wSqBQSg+nyWJ5AJCEDmZ5pAtYAAVJ/P8gQyAQHI/EwTqBYQgOrzWZ5AJiAAmZ9pAtUCAlB9PssTyAQEIPMzTaBaQACqz2d5ApmAAGR+pglUCwhA9fksTyATEIDMzzSBagEBqD6f5QlkAgKQ+ZkmUC0gANXnszyBTEAAMj/TBKoFBKD6fJYnkAkIQOZnmkC1gABUn8/yBDIBAcj8TBOoFhCA6vNZnkAmIACZn2kC1QICUH0+yxPIBAQg8zNNoFpAAKrPZ3kCmYAAZH6mCVQLCED1+SxPIBMQgMzPNIFqAQGoPp/lCWQCApD5mSZQLSAA1eezPIFMQAAyP9MEqgUEoPp8lieQCQhA5meaQLWAAFSfz/IEMgEByPxME6gWEIDq81meQCYgAJmfaQLVAgJQfT7LE8gEBCDzM02gWkAAqs9neQKZgABkfqYJVAsIQPX5LE8gExCAzM80gWoBAag+n+UJZAICkPmZJlAtIADV57M8gUxAADI/0wSqBQSg+nyWJ5AJCEDmZ5pAtYAAVJ/P8gQyAQHI/EwTqBYQgOrzWZ5AJiAAmZ9pAtUCAlB9PssTyAQEIPMzTaBaQACqz2d5ApmAAGR+pglUCwhA9fksTyATEIDMzzSBagEBqD6f5QlkAgKQ+ZkmUC0gANXnszyBTEAAMj/TBKoFBKD6fJYnkAkIQOZnmkC1gABUn8/yBDIBAcj8TBOoFhCA6vNZnkAmIACZn2kC1QICUH0+yxPIBAQg8zNNoFpAAKrPZ3kCmYAAZH6mCVQLCED1+SxPIBMQgMzPNIFqAQGoPp/lCWQCApD5mSZQLSAA1eezPIFMQAAyP9MEqgUEoPp8lieQCQhA5meaQLWAAFSfz/IEMgEByPxME6gWEIDq81meQCYgAJmfaQLVAgJQfT7LE8gEBCDzM02gWuAfrzF1PRIt/MsAAAAASUVORK5CYII=',
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
		texture_name: 'ghast.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTA0VDE1OjE0OjU3KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQxNToxNzoyNCswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQxNToxNzoyNCswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4OTc2ZGI4Ny1iMzA5LWI5NDItODcxNS02ZDE4MTFlZmQzMDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YThmMzQzNTQtZmNiNC1jOTQ2LTlhZDAtZWI3MmQ5YzQwOTljIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YThmMzQzNTQtZmNiNC1jOTQ2LTlhZDAtZWI3MmQ5YzQwOTljIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphOGYzNDM1NC1mY2I0LWM5NDYtOWFkMC1lYjcyZDljNDA5OWMiIHN0RXZ0OndoZW49IjIwMjAtMTAtMDRUMTU6MTQ6NTcrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODk3NmRiODctYjMwOS1iOTQyLTg3MTUtNmQxODExZWZkMzAzIiBzdEV2dDp3aGVuPSIyMDIwLTEwLTA0VDE1OjE3OjI0KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iMx5BgAAAR1JREFUaIHtlzFKA1EURc+XAYt0CmYgIgqKW0ifRbiE9K7DNFpZBYtglS6LCNbTBBI0koGJ2KZI9W3y0cbm/cAVfKe//MMZGHiBHZNqGQGGgwcAxsO7ABBjJITAb6SdlfSeleRppch6fUf38tS0m85XAHTapWlfrxvT7idFrxlEgOfqGICnqyMARovb9GWzCv91DtQCajyAWkCNB1ALqPEAagE1HkAtoMYDqAXU/PsAe7kG01VnZR9XnZWQrkErZdXPEnh8uc/aFzefeXuAbvvENJ6uPwA4L1um/VuzAaB1cWbab17fATjsXJv223rm/wAPoBZQ4wHUAmo8gFpAjQdQC6jxAGoBNR5ALaCmgO+rzkq66qykq87Ktp6Zt1/LwkKjkvGKDAAAAABJRU5ErkJggg==',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -20, 0],
					"boxes": [
						{"coordinates": [-8, 12, -8, 16, 16, 16], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle1",
					"id": "tentacle1",
					"invertAxis": "xy",
					"translate": [-3.7, -13, 5],
					"boxes": [
						{"coordinates": [2.7, 4, -6, 2, 9, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle2",
					"id": "tentacle2",
					"invertAxis": "xy",
					"translate": [1.3, -13, 5],
					"boxes": [
						{"coordinates": [-7.3, 2, -6, 2, 11, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle3",
					"id": "tentacle3",
					"invertAxis": "xy",
					"translate": [6.3, -13, 5],
					"boxes": [
						{"coordinates": [-2.3, 0, -6, 2, 13, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle4",
					"id": "tentacle4",
					"invertAxis": "xy",
					"translate": [-6.3, -13, 0],
					"boxes": [
						{"coordinates": [5.3, 2, -1, 2, 11, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle5",
					"id": "tentacle5",
					"invertAxis": "xy",
					"translate": [-1.3, -13, 0],
					"boxes": [
						{"coordinates": [0.3, 2, -1, 2, 11, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle6",
					"id": "tentacle6",
					"invertAxis": "xy",
					"translate": [3.7, -13, 0],
					"boxes": [
						{"coordinates": [-4.7, 3, -1, 2, 10, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle7",
					"id": "tentacle7",
					"invertAxis": "xy",
					"translate": [-3.7, -13, -5],
					"boxes": [
						{"coordinates": [2.7, 1, 4, 2, 12, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle8",
					"id": "tentacle8",
					"invertAxis": "xy",
					"translate": [1.3, -13, -5],
					"boxes": [
						{"coordinates": [-7.3, 1, 4, 2, 12, 2], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle9",
					"id": "tentacle9",
					"invertAxis": "xy",
					"translate": [6.3, -13, -5],
					"boxes": [
						{"coordinates": [-2.3, 4, 4, 2, 9, 2], "textureOffset": [0, 0]}
					]
				}
			]
		}`
	}
	EntityOptions.giant = {
		name: 'Giant',
		texture_name: 'giant.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHQGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA4LTExVDE5OjUzOjUzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQxMzoxMDoxNCswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQxMzoxMDoxNCswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzJiMWEwOS1lMzk5LWRlNDUtOWYwZi01NjAyNWFlMDllZWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDg4MDBiOTItMTMzOS0xMjQyLTg4ZmItZTA0OTE2YzVhYWIxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDg4MDBiOTItMTMzOS0xMjQyLTg4ZmItZTA0OTE2YzVhYWIxIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDo0ODgwMGI5Mi0xMzM5LTEyNDItODhmYi1lMDQ5MTZjNWFhYjE8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ODgwMGI5Mi0xMzM5LTEyNDItODhmYi1lMDQ5MTZjNWFhYjEiIHN0RXZ0OndoZW49IjIwMjAtMDgtMTFUMTk6NTM6NTMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWJiNjhhZDMtNDgwMy02YjRmLTk1MWUtMzZmNDM3NGNhMTJhIiBzdEV2dDp3aGVuPSIyMDIwLTEwLTA0VDEzOjA5OjEyKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3MmIxYTA5LWUzOTktZGU0NS05ZjBmLTU2MDI1YWUwOWVlZSIgc3RFdnQ6d2hlbj0iMjAyMC0xMC0wNFQxMzoxMDoxNCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlRoxBEAAAHdSURBVHic7ZixSsNQFIb/K4EO2W0gIiqCr9Dd0QfwEXwYzaKTi30B3fQdinMdBEEtFlJx7eAUl4Y2pzc3uU3DD+Z8W3NI7scPPTknBgCyLIMNYwwex5/24oJhcuMq42F4ZarOYJ4fOO9eMDjes14fvX0BAOJ+ZK1PZ2mdx1PP39lc63+gAbAF2GgAbAE2td4CebctY1vdnnG+OU0T53s2Gl84H3D7fO2sB+c/zvpZGDvrbZ8fAMCgv2stjmbfAICDKLTWP9I5ACA83LfW5+8TAEAvPrHWf6evYJ/f+R6gAbAF2GgAbAE2AbDstmXk3baMvNuWkXf7MpjnG7knP71MChcs+7a5v7tc/jCmUNzW/p7T1K8K6ySY799y3647cbX9/aCp3yraA2wX5eztm2zbu0NTv1XWdgE5e8tZW87Wcpb3nd19dwVfv95RUmxSgsIuIGdvOWvL2VrO8r6zu++usKmfi873AA2ALcBGA2ALsNEA2AJsNAC2ABvr9wC5f8t9W05YVfdLqp4naernYu17QNfo/F9AA2ALsNEA2AJsNAC2ABsNgC3ARgNgC7DRANgCbDQAtgAbDYAtwEYDYAuw0QDYAmw0ALYAGw2ALcBGA2ALsNEA2AJsNAC2AJs/YQkA5NIP7iYAAAAASUVORK5CYII=',
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
		texture_name: 'lead_knot.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAu0lEQVRYR2NkwAG2XHn4H5vU/N7JWHWsnd/DiMssfOI4NYEcYKEig6L3xJ0nDCAHSItLoIg/ffmCYdQBwzME6JIInV/0Yk3tElfSsSbemacmYRVnCX+DVZxDuQ9v7mAEOcBCXAw1tb98xQBygIIEN4r4gxdfGUAO4FaUQxH/ev8RA8gB7NLqKOI/n95kGHXAaAgMjRDAln/olg3JqcGoqYesKnTUAaMhMBoCoyEwGgKjITAaAqMhQM0QAACmasohh4jaoQAAAABJRU5ErkJggg==',
		model: `{
			"textureSize": [32, 32],
			"models": [
				{
					"part": "knot",
					"id": "knot",
					"invertAxis": "xy",
					"translate": [0, -8, 0],
					"boxes": [
						{"coordinates": [-3, 6, -3, 6, 8, 6], "textureOffset": [0, 0]}
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
		texture_name: 'mooshroom.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFpmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTA0VDE1OjIyOjM4KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQxNToyNDoxOSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQxNToyNDoxOSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplOGQwMmRiOC1lNWM4LTM5NGMtOGNlYy0yMzBkNTNiMTU0MGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZThkMDJkYjgtZTVjOC0zOTRjLThjZWMtMjMwZDUzYjE1NDBkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZThkMDJkYjgtZTVjOC0zOTRjLThjZWMtMjMwZDUzYjE1NDBkIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDpkNTE4NGExYi0wZDcyLWI4NDMtODZlNy1jY2ZkNGVhZTE0NTg8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOGQwMmRiOC1lNWM4LTM5NGMtOGNlYy0yMzBkNTNiMTU0MGQiIHN0RXZ0OndoZW49IjIwMjAtMTAtMDRUMTU6MjI6MzgrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz79SwaVAAACM0lEQVRoge2ZP0vDQBjGn1cCFbpVMIGK+K/4FbrXb+Dg7OQotC6KH6FxsJNT6FCcuummuzjXQfBvsZCKg4uD0zloNHlz10va6qHmt+XNcffwJvfkvTckhACHiHDUuY/fCOG5jUG30fbqdNS5F57bQNurUxCXrZcGItKO4dq51rZXp0CHNWii8tKMNH529QAAKNqO9H6v76Piu+KwM4VmqYDWdVVMLu7plY+BYN0wzVIB1trT53VrtyoAEABM/IQoE8w5ecw5+UgsV1xGrrgcif3ZBCTFSrKnhuHErhJsAJVtAIAQLogIxxfdVCbA9+/q+tbA8c+pVGo8INjrKnp9P9ViQggcX3SV3qJaX+U1o+oBAKviu9Inwo2E0ywV5BN+mM3rTU3xpDdTyBueO/8lFnvtXcZiFgCU7elI8Kz/CAAxE+GT5+dnI/GX2y4AxIxmkIBxc+rUCKhFYi0A2ImOE8IFkJlgloAsAaYFmObfJ8ACvlyfI/uUhAlcn6Nze119wRnm+54UGvV0FrDS30s0kdPZSDXvwfl+onHhw04ScgsuAZpKMC28nuDo6guOqt7g6OoPTvgNjZ0Fkpylw9fjeoNMITXB8tJMpF4v2k7ievy3kX0FZEHu0t/pwqaJnQZl7aQwresq3/Q/0ur6LiaAd/cOOzhvJ+XnZyNOLGst/Vb+vQdkCTAtwDRZAkwLME2WANMCTJMlwLQA00g7QrwTxDs/qo6PqrPE0XWaOKrOE2eY/w5vSZzMh+Y5wgsAAAAASUVORK5CYII=',
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
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhklEQVRYR+2UPU7DQBCFJxJSkNwTIyMEIhJXSE/JATgCB+AQNIQCKqqcgC5t+ih1GqRI/IhIDqKgSUEV9FYaa7Jek52N7TR2tXFmZj+/mXktCnyG0/cVUgf9R1PheXDXCikVlISLfAA4RoLasDkAn8I+ABdpfxVPrzNRniYPtHf1nf3eP7s3d1cOcBJH9JYuiQHayTn9zl8oBwBiEDE1EvAw9WWUrLXYjuM/ZTxiSgNgYt9BU7dgkwJaAF9Q9RZgSLF6cu1c77YCKFqfn9tDMyM8UFCFpZbveEtsUBeUUwEA9LpHNJ59GqNJOjHNFynVCsC07HRat/NtS6YAD6FcRZx5HeVK4uwaSruGnevKWQPodQ5ovPgyfZb7G50e0/L1w3iCbSSyrwCQNQAgcxuAWhTglvC6SoveCCCT+awZQl/zkXFqJwy55L+crQB8d70SgCIL1ioUrMDOAbRfWhTvtGIEj+KbYHU0cDkrRjLsuAHYiQKyd7UDaAanzNhaJr0SJyxLhUaBP/v0nTAyBrQeAAAAAElFTkSuQmCC',
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
						{"coordinates": [-0.5, 7.75, -3.45, 1, 2, 1], "textureOffset": [16, 7], "sizeAdd": -0.01}
					],
					"submodels": [
						{
							"id": "feather",
							"invertAxis": "xy",
							"translate": [0, 9.5, -2.5],
							"rotate": [15, 0, 0],
							"boxes": [
								{"coordinates": [0, 0, 0, 0, 5, 4], "textureOffset": [2, 18]}
							]
						}
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
				},
				{
					"part": "right_wing",
					"id": "right_wing",
					"invertAxis": "xy",
					"translate": [1.5, -7.1, 0.8],
					"submodels": [
						{
							"invertAxis": "xy",
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-2, 2.1, -2.3, 1, 5, 3], "textureOffset": [19, 8]}
							]
						}
					]
				}
			]
		}`
	}
	EntityOptions.phantom = {
		name: 'Phantom',
		texture_name: 'phantom.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTA0VDAwOjI5OjEyKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQwMDozMjoyMyswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQwMDozMjoyMyswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplODk1YTNiMC04YzAxLWM5NGYtODE1MS1mMGNkZjFhNTA5OTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZTg5NWEzYjAtOGMwMS1jOTRmLTgxNTEtZjBjZGYxYTUwOTk3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTg5NWEzYjAtOGMwMS1jOTRmLTgxNTEtZjBjZGYxYTUwOTk3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplODk1YTNiMC04YzAxLWM5NGYtODE1MS1mMGNkZjFhNTA5OTciIHN0RXZ0OndoZW49IjIwMjAtMTAtMDRUMDA6Mjk6MTIrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7SigvoAAAC7UlEQVR4nO2Zv2/UMBTHn1GkQ+pGJRKpCNEfiIF/oPuxsVZiRGLp3lOH/gNdIDeUiYWKiQW269bbK+Z0QEKFnqiUQ6wdbjIDyuHY7yXOr3s+zh+pQ+1c8vyN8/y+tgCEUXItsXYAgNP4LdUFn0/fCLLTEaTMDy2gLtzdeWC0XXz7CQAAG2Fk9N1M06axsXCHOwBuVl4A8hPIpjvGsk53DNFPYyPhRck++YN3X06MtuDFb/L6u9tDpxIjmgR3w/vzhovpLwAAeBStGT/+kd4CAMDa5sN52+33CQAA9DaeGNfPbr42jbdzAoB/g1bJBouRDVql6mD1N9E1QuAT0Wp6YnUBVg9kdUA/jcl7nYcHNo9snUwA6zpAR60LsHpgWROjtQBVGEcDulPyzAAKXwd0eXObRHd2OUEvojxH236jUwFs0X0H5Tm6yDMr/wmsvADWnwDmDZZ16VMJMC+g8zFZN9o+PL5nth0f5+41uzKXw95W7JQ3MLyADuYNME+gg3kEF70B6QV0MG+AeQIdFwetEoyjQemUHCV786mdrc8voXxNlkd2hofae1hEjqnkBdT12Sa4Z9NhqQJRiu89YDkGIJ9nqH2IKnsQfhns8ubjaCBKy+GQaO8f1Xom5fspFlIKU/V+EUXnDxSf3r9GRz9Krsnf1CqE6iQn7Jyh7FnY+QNFWUxqDlPJCUAVRWohpCYnKiG5thFahE+C6j/n4QH+5tREZZWchg1CWizGDBBCoH9nlxO59+pQUv2uQxVbTmyItAm2I63msOdP832tCrAMM0GnkQB6kVNU9BSdNVLUWW7Rcweq2IIWZkCTer8Iyguo6F5gdjUojUXfj2gsALlyqBS8AZKapXBVcsFLKck3GiX76MkwwN830duKBXX85DLlZuU/Z+UrQS8AdwDceAG4A+DGC8AdADdeAO4AuPECcAfAjReAOwBuvADcAXDjBeAOgBsvAHcA3HgBuAPgxgvAHQA3XgDuALjxAnAHwM0f7OUFzJKbZVYAAAAASUVORK5CYII=',
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
					],
					"submodels": [
						{
							"id": "head2",
							"invertAxis": "xy",
							"translate": [0.5, 24.8, -7.5],
							"rotate": [-10, 0, 0],
							"boxes": [
								{"coordinates": [-3.5, -3, -5, 7, 3, 5], "textureOffset": [0, 0]}
							]
						}
					]
				},
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -23, 7]
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
					"submodels": [
						{
							"invertAxis": "xy",
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [3, 24, -8, 6, 2, 9], "textureOffset": [23, 12]}
							]
						}
					]
				},
				{
					"part": "right_wing_tip",
					"id": "right_wing_tip",
					"invertAxis": "xy",
					"translate": [-9, -26, 8],
					"mirrorTexture": "u",
					"submodels": [
						{
							"invertAxis": "xy",
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [9, 25, -8, 13, 1, 9], "textureOffset": [16, 24]}
							]
						}
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
		texture_name: 'piglin.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACwklEQVR4Xu1bvUoDQRC+gKIQaxOI+IOCr5De0srKR/AhbPIAxkIrqxS22tnaB+s0gmAUA4nYphCEyJ7OMTe529nLZXMJ+a4Km9253W/n99u9UsCeh87bqNW8Du5bFyVqNm28T9pvM87l4bJd+vvuEy30fHQ76j6eBDdPV8HK6Vewvn8Z/mcAqB9sWefRfvkIDAC1StXarzfox8Al+XyQBNI3YIUCQKBzAGgDeBtthg9tiABIE+5TAwiA3Wo5fH23P4w0cK12GLZ9954jbfQOQJoP8GUCcwXAUb85qnbOZuoD5soEigAgq0onaahNhkt/Jx/gMtFZhEGXBWlhXa6lZHbetkBjFi6P8d62x4RWl8fm8b0BUK9sJs6tPfgMDADkpdMWQN67vLed2GX4+h7mFuTZ0+RoHp8AuNvZWCUZpUbjxxbBjGba+ocaMK8ASO0kJ80XzJO2rP2NnLkHgDaHtNGYGmkaaRaZDd9Ml/4AABqwACbA7d2bD1iUMOgSRrP2GUuEZP2ftTzV+AMtYdLK37zzG0uEZAOv/mSdn1TP28bL/zTeIKv8SeYHAAQCMIGk7ImDJHN8mdMfl2sxTLXaQZMnVVSTr8nT2KRYJihzf5njy5ze5O5mgjJbS6sdNHly8Zp8TZ5WW4xlggBAVH8uCEMDYALwAXCCiAL/lJpGoWlOFWFQIIA8QEm0NI1yToQk6bBUqXBSOcvbwAewc/+s9Tr4AIHAwhAiS2UC4APY0RjKYZTD8dNgl0QDfAD4APAB4APAB4AP+LtjBEJEuVSlhdXCGCHwAQyBvOfvizY+8XSYLkdPcv4+zfsFs3g/APBNieWl1HyPH7srLM/3tfP3vOf3RY/3ej9AC3vT4P1t1ajL+wFA0v1a+Q2PvJvLv+fJuwNFj4cGQAM8kqIuTggmYKHUZgEgfAB8AHxA/LO5ZUuFfwENYvUfWtaoeAAAAABJRU5ErkJggg==',
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
		texture_name: 'piglin_brute.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACwklEQVR4Xu1bvUoDQRC+gKIQaxOI+IOCr5De0srKR/AhbPIAxkIrqxS22tnaB+s0gmAUA4nYphCEyJ7OMTe529nLZXMJ+a4Km9253W/n99u9UsCeh87bqNW8Du5bFyVqNm28T9pvM87l4bJd+vvuEy30fHQ76j6eBDdPV8HK6Vewvn8Z/mcAqB9sWefRfvkIDAC1StXarzfox8Al+XyQBNI3YIUCQKBzAGgDeBtthg9tiABIE+5TAwiA3Wo5fH23P4w0cK12GLZ9954jbfQOQJoP8GUCcwXAUb85qnbOZuoD5soEigAgq0onaahNhkt/Jx/gMtFZhEGXBWlhXa6lZHbetkBjFi6P8d62x4RWl8fm8b0BUK9sJs6tPfgMDADkpdMWQN67vLed2GX4+h7mFuTZ0+RoHp8AuNvZWCUZpUbjxxbBjGba+ocaMK8ASO0kJ80XzJO2rP2NnLkHgDaHtNGYGmkaaRaZDd9Ml/4AABqwACbA7d2bD1iUMOgSRrP2GUuEZP2ftTzV+AMtYdLK37zzG0uEZAOv/mSdn1TP28bL/zTeIKv8SeYHAAQCMIGk7ImDJHN8mdMfl2sxTLXaQZMnVVSTr8nT2KRYJihzf5njy5ze5O5mgjJbS6sdNHly8Zp8TZ5WW4xlggBAVH8uCEMDYALwAXCCiAL/lJpGoWlOFWFQIIA8QEm0NI1yToQk6bBUqXBSOcvbwAewc/+s9Tr4AIHAwhAiS2UC4APY0RjKYZTD8dNgl0QDfAD4APAB4APAB4AP+LtjBEJEuVSlhdXCGCHwAQyBvOfvizY+8XSYLkdPcv4+zfsFs3g/APBNieWl1HyPH7srLM/3tfP3vOf3RY/3ej9AC3vT4P1t1ajL+wFA0v1a+Q2PvJvLv+fJuwNFj4cGQAM8kqIuTggmYKHUZgEgfAB8AHxA/LO5ZUuFfwENYvUfWtaoeAAAAABJRU5ErkJggg==',
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
		texture_name: 'pillager.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGc2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTA0VDA5OjQ4OjEyKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQwOTo1Nzo1NyswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQwOTo1Nzo1NyswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDllYWYwYy0wZjMxLTEzNDktOGUyOS02MmM3ZDk3OWRhOTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N2QxNjkxNmEtMzNhNC00NzQ0LTg4YjctZjc2MWZjMGU2MjRkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6N2QxNjkxNmEtMzNhNC00NzQ0LTg4YjctZjc2MWZjMGU2MjRkIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDo3ZDE2OTE2YS0zM2E0LTQ3NDQtODhiNy1mNzYxZmMwZTYyNGQ8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ZDE2OTE2YS0zM2E0LTQ3NDQtODhiNy1mNzYxZmMwZTYyNGQiIHN0RXZ0OndoZW49IjIwMjAtMTAtMDRUMDk6NDg6MTIrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTQ5ZWFmMGMtMGYzMS0xMzQ5LThlMjktNjJjN2Q5NzlkYTkxIiBzdEV2dDp3aGVuPSIyMDIwLTEwLTA0VDA5OjU3OjU3KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Op6aVgAAApVJREFUeJztmrFO40AQhn+fLKVwdycRS0YITiBeIT0lD3CPcD109wyE4qioIgpERUdLj6jTIIHgTiCF07UUV5kCRscOOxsn9ma8eL8q8To7oxnvzOb3JpjC2fhX6RofDQ+cvz8d7SVv56H76foC7Rv3n472AABpFScG68vW6xfX9wCAop9bxx8eJ1WmV7WfluVLgJOkUkJmZmsyLAHgZPwFAHC08RkAcHyzUwJA7+sw8Wwfgn0AwCcvVgMiBkDbAW1SX2uPOM93Xw3sAgCOaeAHfdj3bR8u+5W6AFVbiaaqvYb9lKq0BFVPCaqqElTtJbazwvl73/ZTABj0l6yDF49/AACreWYdv5s8AQCytRXr+NPtbwBAr9i0jv97uIK2/c4XwRgAbQe0iQHQdkCbGABtB7RJgf/9VoL6rQT1Wwnq9xKa9hPSA7pKXAJ1J5D+TTal5XGafmJrB8CFtpZYhXd6AM8cz1RVNTcUrE8AZY5napGZqcPbpE5bMrEI2i5yBWbezGsrSVVIuCKUj78bNxxe/jS+p9/+Gt8lRYfPw+HzSvNz6D2Ci1mWgKEIcQWGKy5cYZEUnXmVnKoKUpPEGqDtgA9m2Sx1/gmIAdB2QJsYAG0HtIkB0HZAG6smyDU4rrnxHZmk6c2r5fnY8UmI++qmFJ22a47OnWAIik5dvG2F2555ovNFsPMBcC6BEBSdurxThAhNRWeRWM8IhaTo1KX1gkjd9xYfUhYfrC8be5Sin4t7kmkEGYAmaf0SsNHUewsggADwLsVPjvKTopaToc6uE8QSGPSXjE61mmdGh8rWVoyO1Cs2xU7ECSIAPokB0HZAmxgAbQe0iQHQdkCbGABtB7RxnhVui65f972Fi3hWWNsBbZ4BUz9Tv2iGDoEAAAAASUVORK5CYII=',
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
					"id": "nose",
					"invertAxis": "xy",
					"translate": [0, 0, 0]
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
					"translate": [2, -12, 0],
					"mirrorTexture": "u",
					"submodels": [
						{
							"invertAxis": "xy",
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
							]
						}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [-2, -12, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 22]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [7, -22, 0],
					"mirrorTexture": "u",
					"submodels": [
						{
							"invertAxis": "xy",
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
							]
						}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [-7, -22, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 46]}
					]
				}
			]
		}`
	}
	EntityOptions.head_player = {
		name: 'Player Head',
		texture_name: 'head_player.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABYklEQVR4Xu2XPUoDURSF34BgMb0ZGBEFwS2kT+kCXIKbSRpTpcoK7FyEWKcJBPKDgYmkTWGlvP5xT+MQOH7T3sPcd8/55l2mSuJ5W2x/Isl8Mg3f8DofV6pHVO+7vzxcPsDw/rp4xvfVZ8oGtIOmWN8fuvQXBvTZHwMUnhDAJ8AdwCVovQZH3STc883iObwnZx8vYf3i6RjWH+s2rPfdv8oGDAdX5T1/+Er5ALdNXaxvulPKBtR3N8X6ab1L2YDL9qFY/94vUzbgnP0xAAL4BLgDuASjPdT3Gjr7GlQ/Q+51+TuMAeYOQIB5wHI8CJAWmQsgwDxgOR4ESIvMBRBgHrAcDwKkReYCCDAPWI4HAdIicwEEmAcsx4MAaZG5AALMA5bjQYC0yFwAAeYBy/EgQFpkLoAA84DleBAgLTIXQIB5wHI8CJAWmQsgwDxgOR4ESIvMBRBgHrAcDwKkReaCf0/AL1TpqoCbobwXAAAAAElFTkSuQmCC',
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
		texture_name: 'skeleton.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABa0lEQVRoQ2NkIAC2XHn4H5+S+b2T8Zqwdn4PIyE78MnT2n6CjgM5wEJFBqsbT9x5wgAKAGlxCazyT1++YKBGANDS/tEAIJQ8R1PAaBYYLQNGC8FhXQ06v+jFW89LXEnHW07OPDUJrzxL+Bu88t7c0njlaW0/IygALMTFsNfzL18xgBygIMGNVf7Bi68MoADgVpTDKv/1/iMGUACwS6tjlf/59CYDKAAG0v7RABhNAaNZYLQMGC0E8dVDtK6GBrwahHke1u+G9e/J7cbSqv9OLfehRza8O0wtC2jVe6SW+zACANYShCV1WMsO1oLjUO4jOGaAbCi1A4Da7qNLAFCz7zDoAwC9L0FqoUlsX4FaKZTqKQC5JXmCxL4DsX0FkKNHAwDaK6W0jBpNAWghAO4NUpLERrMAUmdqtAwYLQRJG0EarQWIHDKjpIwiNPEzWggSCiFC8rSuBUjtixByL87eIKkaYepp3RSmdQAAAKyZaH4Rrg7GAAAAAElFTkSuQmCC',
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
		texture_name: 'head_skeleton.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABA0lEQVRoQ2NkIAC2XHn4H5+S+b2T8Zqwdn4PIyE78MnT2n6CjgM5wEJFBqsbT9x5wgAKAGlxCazyT1++YKBGANDS/tEAIJQ8R1PAaBYYLQNGC8FhXQ06v+jFW89LXEnHW07OPDUJrzxL+Bu88t7c0njlaW0/IygALMTFsNfzL18xgBygIMGNVf7Bi68MoADgVpTDKv/1/iMGUACwS6tjlf/59CYDKAAG0v7RABhNAaNZYLQMGC0E8dVDtK6GBrwaJNQZGu7yBLvDowEwzENgNAUM8wgm6L3RFEAwiIa5gtEUMMwjmKD3RlMAwSAa5gpGU8Awj2CC3htNAQSDaJgrGPEpAAC17qpg/PE3YwAAAABJRU5ErkJggg==',
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
		texture_name: 'squid.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABJ0lEQVRoQ2NkIBFsufLwPyla5vdOJkU5w9r5PYwkaYAqhrkLZh+x5pBsGcgiCxUZotx44s4TBpCDpMUliFL/9OWL0QAgNuZgIer8ohecIiWupIOFZp6aBKZZwt+AaQ7lPryRPORTwGgAjKaA0SwwWgaMFoKjtcBoNUjfdgBRzTqoIlo3hSluB8AMINZTsBYXsephLTNi1cNacMSq9+aWBisluyUICgALcTGi7Dvx8hXYIgUJbqLUP3jxFdw05VaUI0r91/uPwE1Ydml1otT/fHqTYTQARlPAaBYYLQNGC8HRWmAEV4OERnwI1aeMQ70dMBoABMb8RlMAgRAYzQKjZcAQ7wxRpRAkVFAgyw+27jDFAUCK54ejWpJnhoZbIIwGwHCLUVL9AwDOVj4/czl/xgAAAABJRU5ErkJggg==',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -25, 0],
					"boxes": [
						{"coordinates": [-6, 17, -6, 12, 16, 12], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle1",
					"id": "tentacle1",
					"invertAxis": "xy",
					"translate": [-5, -18, 0],
					"boxes": [
						{"coordinates": [4, 0, -1, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle2",
					"id": "tentacle2",
					"invertAxis": "xy",
					"translate": [-3.5, -18, 3.5],
					"submodels": [
						{
							"id": "tentacle2_rotation",
							"invertAxis": "xy",
							"translate": [3.5, 9, -3.5],
							"rotate": [0, 135, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle3",
					"id": "tentacle3",
					"invertAxis": "xy",
					"translate": [0, -18, 5],
					"boxes": [
						{"coordinates": [-1, 0, -6, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle4",
					"id": "tentacle4",
					"invertAxis": "xy",
					"translate": [3.5, -18, 3.5],
					"submodels": [
						{
							"id": "tentacle4_rotation",
							"invertAxis": "xy",
							"translate": [-3.5, 9, -3.5],
							"rotate": [0, -135, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle5",
					"id": "tentacle5",
					"invertAxis": "xy",
					"translate": [-10, -18, 5],
					"rotate": [0, -90, 0],
					"boxes": [
						{"coordinates": [-6, 0, -11, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle6",
					"id": "tentacle6",
					"invertAxis": "xy",
					"translate": [3.5, -18, -3.5],
					"submodels": [
						{
							"id": "tentacle6_rotation",
							"invertAxis": "xy",
							"translate": [-3.5, 9, 3.5],
							"rotate": [0, -45, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle7",
					"id": "tentacle7",
					"invertAxis": "xy",
					"translate": [0, -18, -1.65],
					"rotate": [0, -180, 0],
					"submodels": [
						{
							"id": "tentacle7_rotation",
							"invertAxis": "xy",
							"translate": [0, 9, -1.7],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle8",
					"id": "tentacle8",
					"invertAxis": "xy",
					"translate": [-3.5, -18, -3.5],
					"submodels": [
						{
							"id": "tentacle8_rotation",
							"invertAxis": "xy",
							"translate": [3.5, 9, 3.5],
							"rotate": [0, 45, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				}
			]
		}`
	}
	EntityOptions.stray = {
		name: 'Stray',
		texture_name: 'stray.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABa0lEQVRoQ2NkIAC2XHn4H5+S+b2T8Zqwdn4PIyE78MnT2n6CjgM5wEJFBqsbT9x5wgAKAGlxCazyT1++YKBGANDS/tEAIJQ8R1PAaBYYLQNGC8FhXQ06v+jFW89LXEnHW07OPDUJrzxL+Bu88t7c0njlaW0/IygALMTFsNfzL18xgBygIMGNVf7Bi68MoADgVpTDKv/1/iMGUACwS6tjlf/59CYDKAAG0v7RABhNAaNZYLQMGC0E8dVDtK6GBrwahHke1u+G9e/J7cbSqv9OLfehRza8O0wtC2jVe6SW+zACANYShCV1WMsO1oLjUO4jOGaAbCi1A4Da7qNLAFCz7zDoAwC9L0FqoUlsX4FaKZTqKQC5JXmCxL4DsX0FkKNHAwDaK6W0jBpNAWghAO4NUpLERrMAUmdqtAwYLQRJG0EarQWIHDKjpIwiNPEzWggSCiFC8rSuBUjtixByL87eIKkaYepp3RSmdQAAAKyZaH4Rrg7GAAAAAElFTkSuQmCC',
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
		texture_name: 'villager.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC5UlEQVR4Xu1bO0sDQRBOQFBIKyYS8YGCTWpJb6mdhXWqVNrof7AxFlqlSm1hp/8hWKcRBB8YSMTCJoUgKLs4kJvsztxjb+9MJs2RzN7u3Lfz2u8mxQLzue29/FBDOq0rcoabznlRDYB5YDz87mt92zpaOeqjFK9vrRiHdB/fCuqBquWKUd4fDgouAHCxfmYAfJ4t67Urvaa+tu8v9XXu8ENfFzYvyE1wtQECgAWB1F1ALGDWXSBstLf5aC5igIs0yGUbCoA01y/uDlpknofobVMCorpNDtHeJt8rVUls0l5fA1AvL5nz/PBdp6/1Sskofx6MdForbawa5aOnV53u5qvbRvlX/6GgAMhyfQFALEBcQGKABMEso7BkgTykQaoSSbsQybwQiluiTst97HF4Wh40NiESFwBXXGLc9cPel5oFpH2MDfuA3LgJAPDOYdY37PneFwBJ9TUCACwsZn3HWV4OWZ8AJNFXAMA7mdSkYD5fQTCpvhOMEC58MOODGR5bIRO3gOIYpO/rxcCeNXeOA98HtXbg+92oH/iO30MECJEuYoAw44MZHhujg+fBVmZjksIwSAoAYKDUeAUAMFZqXgUAnG2UHgoAYKSUvgIAehMlFjBOiYkLSAwI0uASBBHvn5csMJ5VZi4Ncv0EXImO5f8uCwgATEdJLAsYvynvpbBzC7Ah5uswE3XHXOtlZYR8nefjAOCya0wAoFzAJdJRd9qXa+beAnAHS1SegeMXSACoXQvbIpt056nDGsczhOEXrD1CUZEGZTjEo6YxLwDgt8NpMjpxAKDqFGwFHIVHlsIgzBMASV2Iu9/YJOULgIPGKdmixynfODnihpDy/dpaMTMAlG9zcYZ7OmXuXMzh5sgcAFsPIqc4kDVUHyI3h2KJBQBTn6CPGAAuIBZgacPlzFdc4I+vlBhANGNzViRBULKApEGpA6QQkkLI8qcp7qBi+7MUdzgBPiA3lSCXK9OSCwA5OQ7/AtEibt6oeaKxAAAAAElFTkSuQmCC',
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
					"animations": [
						{
							"rotation.rx": 0
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
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFAmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTI5VDIzOjIwOjU5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMTAtMjlUMjM6MjQ6MTJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEwLTI5VDIzOjI0OjEyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkODQ4NzM0My04MGY1LTNiNDctOTRkMS1hMzdlZGQwODc3MTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZDg0ODczNDMtODBmNS0zYjQ3LTk0ZDEtYTM3ZWRkMDg3NzE3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZDg0ODczNDMtODBmNS0zYjQ3LTk0ZDEtYTM3ZWRkMDg3NzE3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkODQ4NzM0My04MGY1LTNiNDctOTRkMS1hMzdlZGQwODc3MTciIHN0RXZ0OndoZW49IjIwMjAtMTAtMjlUMjM6MjA6NTlaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+j++3pAAAArFJREFUeJztmL2O1DAUhU9WkbaYDiRmpEGwi0A0PAD90C0lEo9Av1RIiCcgFFBRrShGVHRbQo+op0EC8SNGyqxop6DKFqyzTuIb24mzZ2D8VaPYk3t0HN9r3wQWjhc/irbxo+xV6//fHT1Pzt5jHL9/57pXXCmeilOnKFrlI20dPePuzavG5x+//AIATMcT4/hylbu83jmuFK9PHCcD+jDLMwDA28XloUN1YoctgM3gX8CHyWMAwPHigXF8PrQAC4Mb0Ae15+v0zS069BwwyzNjmpbmv7l1yfh8/vVQSvfG6qBwMkBaCUXvbD++Uo23OgEA7E1Gleff8zUAYLR/rfJ8/e0nAGB3ervy/M/yszV2Kq2Awpa9pRUpA6yXf9+//8w4foBp6/+HJgWaK6CQVkIhrYhCWhmFywoNTSyDbAHA+ZdWR31hddSXVafLF0U34P340Jylx8IfZk+Cxt/6LbD1BqSAvAcV0l5USHtSsQnZXqKy/2x3f19svQJf9Du/7Z7vSiMJSnd/X2y9Al9Cnv91GgbYjr2+DCU8FIl+FJ4sHgV9+etPL8vf6cPfQd+9eyNrveS4Uh6FbcdeX/Rjsu1I7EvIpNqoAraM74teITaxGohVQM/gUsfVZX5RFEiSxKvC+FQPFatrVWgchPQq4JLBfedvGq1VwCWD2+bfW70oZnnm1RVWPQaXxDl/WnaCOiXFSkNEF6k3OvR208HovIHhNL+LqgvEWAWkDK6SmM/88rYn3e5MBL7xtbH1l6FoAFsAm04GSAenTT/0mPBuiVVaWHpiu8DEFZK4BdgC2OwA/9ee9iUJ1Vr6V4lbgC2ATTSALYBNNIAtgE00gC2ATTSALYBNNIAtgE00gC2ATTSALYBNNIAtgE00gC2ATTSALYBNNIAtgE00gC2ATTSALYDNKVPKHrznax7QAAAAAElFTkSuQmCC',
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
						{"coordinates": [-1, 1.1, -0.5, 3, 6, 3], "textureOffset": [12, 34]}
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
						{"coordinates": [6, 18, -4, 6, 6, 6], "textureOffset": [32, 0]}
					]
				},
				{
					"part": "head3",
					"id": "head3",
					"invertAxis": "xy",
					"translate": [9, -20, 1],
					"boxes": [
						{"coordinates": [-12, 18, -4, 6, 6, 6], "textureOffset": [32, 0]}
					]
				}
			]
		}`
	}
	EntityOptions.wither_skeleton = {
		name: 'Wither Skeleton',
		texture_name: 'wither_skeleton.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABa0lEQVRoQ2NkIAC2XHn4H5+S+b2T8Zqwdn4PIyE78MnT2n6CjgM5wEJFBqsbT9x5wgAKAGlxCazyT1++YKBGANDS/tEAIJQ8R1PAaBYYLQNGC8FhXQ06v+jFW89LXEnHW07OPDUJrzxL+Bu88t7c0njlaW0/IygALMTFsNfzL18xgBygIMGNVf7Bi68MoADgVpTDKv/1/iMGUACwS6tjlf/59CYDKAAG0v7RABhNAaNZYLQMGC0E8dVDtK6GBrwahHke1u+G9e/J7cbSqv9OLfehRza8O0wtC2jVe6SW+zACANYShCV1WMsO1oLjUO4jOGaAbCi1A4Da7qNLAFCz7zDoAwC9L0FqoUlsX4FaKZTqKQC5JXmCxL4DsX0FkKNHAwDaK6W0jBpNAWghAO4NUpLERrMAUmdqtAwYLQRJG0EarQWIHDKjpIwiNPEzWggSCiFC8rSuBUjtixByL87eIKkaYepp3RSmdQAAAKyZaH4Rrg7GAAAAAElFTkSuQmCC',
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
		texture_name: 'head_wither_skeleton.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABA0lEQVRoQ2NkIAC2XHn4H5+S+b2T8Zqwdn4PIyE78MnT2n6CjgM5wEJFBqsbT9x5wgAKAGlxCazyT1++YKBGANDS/tEAIJQ8R1PAaBYYLQNGC8FhXQ06v+jFW89LXEnHW07OPDUJrzxL+Bu88t7c0njlaW0/IygALMTFsNfzL18xgBygIMGNVf7Bi68MoADgVpTDKv/1/iMGUACwS6tjlf/59CYDKAAG0v7RABhNAaNZYLQMGC0E8dVDtK6GBrwaJNQZGu7yBLvDowEwzENgNAUM8wgm6L3RFEAwiIa5gtEUMMwjmKD3RlMAwSAa5gpGU8Awj2CC3htNAQSDaJgrGPEpAAC17qpg/PE3YwAAAABJRU5ErkJggg==',
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
		texture_name: 'zombie.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHQGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA4LTExVDE5OjUzOjUzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMC0wNFQxMzoxMDoxNCswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMC0wNFQxMzoxMDoxNCswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzJiMWEwOS1lMzk5LWRlNDUtOWYwZi01NjAyNWFlMDllZWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDg4MDBiOTItMTMzOS0xMjQyLTg4ZmItZTA0OTE2YzVhYWIxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDg4MDBiOTItMTMzOS0xMjQyLTg4ZmItZTA0OTE2YzVhYWIxIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDo0ODgwMGI5Mi0xMzM5LTEyNDItODhmYi1lMDQ5MTZjNWFhYjE8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ODgwMGI5Mi0xMzM5LTEyNDItODhmYi1lMDQ5MTZjNWFhYjEiIHN0RXZ0OndoZW49IjIwMjAtMDgtMTFUMTk6NTM6NTMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWJiNjhhZDMtNDgwMy02YjRmLTk1MWUtMzZmNDM3NGNhMTJhIiBzdEV2dDp3aGVuPSIyMDIwLTEwLTA0VDEzOjA5OjEyKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3MmIxYTA5LWUzOTktZGU0NS05ZjBmLTU2MDI1YWUwOWVlZSIgc3RFdnQ6d2hlbj0iMjAyMC0xMC0wNFQxMzoxMDoxNCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlRoxBEAAAHdSURBVHic7ZixSsNQFIb/K4EO2W0gIiqCr9Dd0QfwEXwYzaKTi30B3fQdinMdBEEtFlJx7eAUl4Y2pzc3uU3DD+Z8W3NI7scPPTknBgCyLIMNYwwex5/24oJhcuMq42F4ZarOYJ4fOO9eMDjes14fvX0BAOJ+ZK1PZ2mdx1PP39lc63+gAbAF2GgAbAE2td4CebctY1vdnnG+OU0T53s2Gl84H3D7fO2sB+c/zvpZGDvrbZ8fAMCgv2stjmbfAICDKLTWP9I5ACA83LfW5+8TAEAvPrHWf6evYJ/f+R6gAbAF2GgAbAE2AbDstmXk3baMvNuWkXf7MpjnG7knP71MChcs+7a5v7tc/jCmUNzW/p7T1K8K6ySY799y3647cbX9/aCp3yraA2wX5eztm2zbu0NTv1XWdgE5e8tZW87Wcpb3nd19dwVfv95RUmxSgsIuIGdvOWvL2VrO8r6zu++usKmfi873AA2ALcBGA2ALsNEA2AJsNAC2ABvr9wC5f8t9W05YVfdLqp4naernYu17QNfo/F9AA2ALsNEA2AJsNAC2ABsNgC3ARgNgC7DRANgCbDQAtgAbDYAtwEYDYAuw0QDYAmw0ALYAGw2ALcBGA2ALsNEA2AJsNAC2AJs/YQkA5NIP7iYAAAAASUVORK5CYII=',
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
		texture_name: 'head_zombie.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABYklEQVR4Xu2XPUoDURSF34BgMb0ZGBEFwS2kT+kCXIKbSRpTpcoK7FyEWKcJBPKDgYmkTWGlvP5xT+MQOH7T3sPcd8/55l2mSuJ5W2x/Isl8Mg3f8DofV6pHVO+7vzxcPsDw/rp4xvfVZ8oGtIOmWN8fuvQXBvTZHwMUnhDAJ8AdwCVovQZH3STc883iObwnZx8vYf3i6RjWH+s2rPfdv8oGDAdX5T1/+Er5ALdNXaxvulPKBtR3N8X6ab1L2YDL9qFY/94vUzbgnP0xAAL4BLgDuASjPdT3Gjr7GlQ/Q+51+TuMAeYOQIB5wHI8CJAWmQsgwDxgOR4ESIvMBRBgHrAcDwKkReYCCDAPWI4HAdIicwEEmAcsx4MAaZG5AALMA5bjQYC0yFwAAeYBy/EgQFpkLoAA84DleBAgLTIXQIB5wHI8CJAWmQsgwDxgOR4ESIvMBRBgHrAcDwKkReaCf0/AL1TpqoCbobwXAAAAAElFTkSuQmCC',
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
		texture_name: 'zombie_villager.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACr0lEQVR4Xu1bO0sDQRC+A0EhrZhIxAcKNqklvaV2FtapUmmj/8HGWGiVKrWFnf6HYJ1GEHxgIBELmxSCoOziQm6ys3Pe7eNIJs1x2c3u7Lez8/h2EkfE57b38mPq0mldGUe46ZzHooMaR/VX3/uaH5tHCmf6CMHrWyvaLt3Ht0gsqFquaNv7w0FkAwAb8wcD4PNsWc5d6TXls31/KZ9zhx/yubB5YdwEWxvAACAIOD8CrAGzfgTSWnvsjBbCBthwg5S3MQHgcv54d9Ay+nllvTEhlFXH2pW1x9r3SlUjNq7nlwDUy0t6Pz98l+5rvVLStj8PRtKtlTZWte2jp1fp7uar29r2r/5DJAAIOT8DwBrAR4BtABvBkFaYvUAR3KApEnEdiAQPhLKGqNPyOzIdnpaFZiZEsgJgi0vMOn/a3znTANdpbNoFUv0mAIA7B1nftPm9LwDyyqsFQLGwkPUdZ3kpZH0CkEdeBgDuZF6VUuP5MoJ55Z1ghGDgAxkfyPBggUzWAIpikL6vFxN71tw5TrwPau3E+92on3iH9xAJQqQLGCDI+ECGB2N04DhQyzAmKQ2DJABQDJToLwBQjJUYVwCgchshhwBAMVJCXgYA3ESxBoxTYnwE2AYkaXA2goD3Zy8ALjrYDSI3OxwHZLxSCxYIjUdqMxcKh7qWptJpX+0oI+Qrn/e10H9zggyApfrA0DtMzc9HYOaNIFYj5IrRoSpDKZW13a4tkXEZyTEARG2w7R2mxguqAQeNU2OJHiV84+SI6mJs36+txcEAELaHsjPU6gRjTbHI1BjBAcBqECnBFVljqkOkxhDpPAOgqxP04QXUEWANQMpwKfXlI/DHV7INMBRjU1rERpC9ALtBjgM4EOJACPnTFJWoYH+WopITxQcUJhKkfKWrdgagIOnwL8ZJXcYJqcmMAAAAAElFTkSuQmCC',
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
		name: 'Zombified Piglin',
		texture_name: 'zombified_piglin.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACwklEQVR4Xu1bvUoDQRC+gKIQaxOI+IOCr5De0srKR/AhbPIAxkIrqxS22tnaB+s0gmAUA4nYphCEyJ7OMTe529nLZXMJ+a4Km9253W/n99u9UsCeh87bqNW8Du5bFyVqNm28T9pvM87l4bJd+vvuEy30fHQ76j6eBDdPV8HK6Vewvn8Z/mcAqB9sWefRfvkIDAC1StXarzfox8Al+XyQBNI3YIUCQKBzAGgDeBtthg9tiABIE+5TAwiA3Wo5fH23P4w0cK12GLZ9954jbfQOQJoP8GUCcwXAUb85qnbOZuoD5soEigAgq0onaahNhkt/Jx/gMtFZhEGXBWlhXa6lZHbetkBjFi6P8d62x4RWl8fm8b0BUK9sJs6tPfgMDADkpdMWQN67vLed2GX4+h7mFuTZ0+RoHp8AuNvZWCUZpUbjxxbBjGba+ocaMK8ASO0kJ80XzJO2rP2NnLkHgDaHtNGYGmkaaRaZDd9Ml/4AABqwACbA7d2bD1iUMOgSRrP2GUuEZP2ftTzV+AMtYdLK37zzG0uEZAOv/mSdn1TP28bL/zTeIKv8SeYHAAQCMIGk7ImDJHN8mdMfl2sxTLXaQZMnVVSTr8nT2KRYJihzf5njy5ze5O5mgjJbS6sdNHly8Zp8TZ5WW4xlggBAVH8uCEMDYALwAXCCiAL/lJpGoWlOFWFQIIA8QEm0NI1yToQk6bBUqXBSOcvbwAewc/+s9Tr4AIHAwhAiS2UC4APY0RjKYZTD8dNgl0QDfAD4APAB4APAB4AP+LtjBEJEuVSlhdXCGCHwAQyBvOfvizY+8XSYLkdPcv4+zfsFs3g/APBNieWl1HyPH7srLM/3tfP3vOf3RY/3ej9AC3vT4P1t1ajL+wFA0v1a+Q2PvJvLv+fJuwNFj4cGQAM8kqIuTggmYKHUZgEgfAB8AHxA/LO5ZUuFfwENYvUfWtaoeAAAAABJRU5ErkJggg==',
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
	EntityOptions.mooshroom_mushrooms = {
		name: 'Mooshroom [Mushrooms]',
		texture_name: 'mooshroom_mushrooms.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACY0lEQVR4Xu1avUoDQRDeA0EhvYlExKDgK6T3ISx8AEvfwNbGWGiVQvIEdpZ5gGCdRhD8wUAiFhYGsYrMkQ2byf7cksu6d35Xhezs7dy3M998s3eJMFx3/ZeJaYz+77SubcPitnOR0D3Ijn5bjXMe5L5zX1V/jI7RTZr721rXeo9vKQD1ak07PhgNxef5lqj1T0T7/kqsHX2Ijb3LICAcDlsTWle9pA/qf9Kf0gKwW6ukz/s8HM82Yb1+kP73M3iYbQgAsHHAMilgynsXt3B/XFzD7WXq5RIBy5Kgbr6NW7i9i2u4vco9mQEg0tA5yomE2xCx6C4iPNvV/T4VpsjKE4DMJEgANKubc2v3Ru8pg0sUuWOSWCqNnbmh8dNryviSbPg8Ip9VA+BbchMAgAhACoAD/j0Jhi6DPr2PrxDyrgI+zthsTXqCz3Hpi6x6g9u59Ae3dzZDvsDoyumCsHHoi6x6g9u59IdOjxgB8Oml1RuXCgApVbkWJ61tyjEAoBFUSAGGgKvH+BMO4OytO05SHeNsK8mksCmgOs53iHd9nG3VoyUAUFQOQAQoO4cUYEoNHDA9U5dHXyBBduaHKqC8YUEZRBlcPFssRC+QpxTOcoYQ3YHIcffL+h2A66FuGmcuE+t4qNfmJicSAsD0Bsj1ZKQTCADTmyDXfLWKuGxXNQ4AEAFIAXAASBBVYPpFlW+pQRmEDoAQghKEFEYvUIJmyLf8qfaFb4eXefgyzA3yDX/MQAGAmHcnhG+IgBAox7wGIiDm3QnhGyIgBMoxr4EIiHl3QviGCAiBcsxrIAJi3p0Qvv0CsoGAffw9T/oAAAAASUVORK5CYII=',
		model: `{
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
		name: '---- Unsupported ----'
	}
	EntityOptions.armor_layer_one = {
		name: 'Armor [Layer 1]',
		texture_name: 'armor_layer_1.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFAmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTI5VDEzOjQwOjIxWiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMTAtMzFUMjA6NTk6NDRaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEwLTMxVDIwOjU5OjQ0WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmOTY1MjMyYy0yMWJhLWZhNGYtODM0OC05Nzk0MzYxZDIwZTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Zjk2NTIzMmMtMjFiYS1mYTRmLTgzNDgtOTc5NDM2MWQyMGU4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Zjk2NTIzMmMtMjFiYS1mYTRmLTgzNDgtOTc5NDM2MWQyMGU4Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmOTY1MjMyYy0yMWJhLWZhNGYtODM0OC05Nzk0MzYxZDIwZTgiIHN0RXZ0OndoZW49IjIwMjAtMTAtMjlUMTM6NDA6MjFaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+48s9QAAAAc9JREFUaIHtmLFKw1AUhv9IoEI3CzYQEQVLX6FDt7oJTkKHPoCz4AM4umSpgziJoJsP4RicXYSCRVpISwYHC3aQOsXmHu89bZqWA/Z+U3JP7j0/h/bkP3FAiL++lfuw05vQZ9LcBldcGAAcv+wZg+3Lc9H87qzdAFA72NGuh50eAMCUoD+I5jleNP/G4rL+B7YA0gKksQWQFiDNXG+BpNuaWFa3l8jvNKKAfc96L6fsATfPbTbuNmM2flT02fiq87sAUCtva4PhYAgA2POK2ng3GgEAivu72vjo7R0AUPCr2vi4/wrp/GvfA2wBpAVIYwsgLUAaF5h2WxNJtzWRdFsTSbc3IZnfaUSBsnAWnyi+QDNvO5utC2Uh/S5+Om7lnt8fryu/N4cfn7n03dcf2GRaJ5jM33Tentdxrfr7QV59adw/JoQ3TgA0Va2XptedzBpYlqKPQfsLoN47a2VXPTvk1ZfGDQdD5T/VjUrKA3eVLXVDM56kmwr18h7ZT9GcRx9Rzg/J+Vn1Ffyqw+lRZgHqvanXpt6aevms3j3rrLCoPo619wG2ANICpLEFkBYgjS2AtABpbAGkBUij/R5A5286b1OHNWs/ZdZ5lLz6OH4As9QDGvlmQdoAAAAASUVORK5CYII=',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"boxes": [
						{"coordinates": [-4, 23, -4, 8, 8, 8], "textureOffset": [0, 0], "sizeAdd": 0.75},
						{"coordinates": [-4, 23, -4, 8, 8, 8], "textureOffset": [32, 0], "sizeAdd": 1}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -17, 0],
					"boxes": [
						{"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16], "sizeAdd": 0.75}
					]
				},
				{
					"part": "left_shoe",
					"id": "left_shoe",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16], "sizeAdd": 0.75}
					]
				},
				{
					"part": "right_shoe",
					"id": "right_shoe",
					"invertAxis": "xy",
					"translate": [4, 0, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16], "sizeAdd": 0.75}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [-12, 0, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-8, 12, -2, 4, 12, 4], "textureOffset": [40, 16], "sizeAdd": 0.75}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [12, 0, 0],
					"boxes": [
						{"coordinates": [4, 12, -2, 4, 12, 4], "textureOffset": [40, 16], "sizeAdd": 0.75}
					]
				}
			]
		}`
	}
	EntityOptions.armor_layer_two = {
		name: 'Armor [Layer 2]',
		texture_name: 'armor_layer_2.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFAmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEwLTI5VDEzOjQwOjIyWiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMTAtMzFUMjA6NTk6NDJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEwLTMxVDIwOjU5OjQyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmNDBkMjcxZC03YTU1LTY1NDgtYjljMi1mZGU5YjllNTI3YWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZjQwZDI3MWQtN2E1NS02NTQ4LWI5YzItZmRlOWI5ZTUyN2FlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZjQwZDI3MWQtN2E1NS02NTQ4LWI5YzItZmRlOWI5ZTUyN2FlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmNDBkMjcxZC03YTU1LTY1NDgtYjljMi1mZGU5YjllNTI3YWUiIHN0RXZ0OndoZW49IjIwMjAtMTAtMjlUMTM6NDA6MjJaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ho9UGwAAAWpJREFUaIHtmLFKA0EURU9kIUI6AyYQERWDv5AipZ1gJVikt/cP/AEttBArEbTzIyyDfyAEDGIgG9KmsFoLmazz3GQj0dwic6rZt/Mulzs77DCFJElYZlbUBtSEANQG1IQA1AbUhADUBtSEANQG1IQA1AbUhADUBtSEANQG1ET78YVXOB0eeRcEt+dXtqew2jrzCjfPl+Px02Fr6gVDht4P/cfrevpUPMmbPxdRVrGxuwFAu/MOQK1SBaAX92cSdf0Wq2eZVf8viRqVdb8yzG+6bz74hWY5HXfmN7VIMr8At1KO366M7bcoVnoSUTseeHu22y97E+7qa37D8TD56L2Mnw9KNe991fRbMvTsFE+/uENhquCcRABuG7TjAQBb1RIA3f4IgNL2JgCj17cvU7U9AJzRSf2WPD3L9yD+i6X/DYYA1AbUhADUBtSEANQG1IQA1AbURJCe4BzuxOZwJzaHPaHl9Vvy9BbJJw7zbR9TjZwDAAAAAElFTkSuQmCC',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "waist",
					"id": "waist",
					"invertAxis": "xy",
					"translate": [0, -17, 0],
					"boxes": [
						{"coordinates": [-4, 12, -2, 8, 12, 4], "textureOffset": [16, 16], "sizeAdd": 0.5}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"mirrorTexture": "u",
					"boxes": [
						{"coordinates": [-4, 0, -2, 4, 12, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [4, 0, 0],
					"boxes": [
						{"coordinates": [0, 0, -2, 4, 12, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
					]
				}
			]
		}`
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
	EntityOptions.unreleased = {
		name: '---- Unreleased Models ----'
	}
	EntityOptions.axolotl = {
		name: 'Axolotl',
		texture_name: 'axolotl.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABsklEQVRoQ2NkIAJsufLwPz5l83sn4zWFI7qBCFswlcxVrCNLH4dyHyOxGolSCAoACxUZrGaeuPOEARQA0uISWOWfvnzBAAoABQluYt0EVvfgxVcGUACwS6uTpO/n05sMowEwmgJGswBRWRuUt4hSOFoGjBaClNcCJBXlUMWDqhqkpB2wdn4PUVmNnECiVA+j84tevI0ckAUSV9Lx2jPz1CSC7mAJf4O/sURC1UXQMhIUgAPAQlwMp5YTL1+BAwBXQwbUYAEFALeiHE4zvt5/xAAKAFyNGlIbLyT4j6DS0QAY8VkAWxqhtPPzoV2SYNJDVrBx3k+S1PNUVVGtUMVqEKUNH1AA4CtXkH0LKmNAAYCvDEFWDypPRgNgNAXQIQtQ0vAZUmUAtlqAnIYPoYaON7c0wYKOmMKQmvkf3BtEbwiR0/AZzA0dQqE+GgCjKQBLZ4gWZQApA5WEki015bH2BrEVRv5J7Bj20kMdtQs9dE9gLQPQW2agQg4UAMitO2wtOFqoo0sAoIcKPWKW2BRF8wCgZn4aimZRrVc1FD0PbggNVYdTy92jAUCtkByq5oz4FAAAYGm3MEO1QgQAAAAASUVORK5CYII=',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"boxes": [
						{"coordinates": [-4, 0, -7, 8, 5, 5], "textureOffset": [0, 13]},
						{"coordinates": [-7, 0, -3, 14, 8, 0], "textureOffset": [25, 0]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, 0, 0],
					"boxes": [
						{"coordinates": [-4, 0, -2, 8, 4, 9], "textureOffset": [0, 0]},
						{"coordinates": [0, 4, -2, 0, 1, 9], "textureOffset": [26, 9]}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [-4, -0.5, 1],
					"rotate": [0, -30, 0],
					"boxes": [
						{"coordinates": [-4, -1, -1, 0, 3, 5], "textureOffset": [0, 18]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [4, -0.5, 1],
					"rotate": [0, 30, 0],
					"boxes": [
						{"coordinates": [4, -1, -1, 0, 3, 5], "textureOffset": [10, 18]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [-4, -0.5, -7],
					"rotate": [0, -15, 0],
					"boxes": [
						{"coordinates": [-4, -1, 7, 0, 3, 5], "textureOffset": [20, 18]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [4, -0.5, -7],
					"rotate": [0, 15, 0],
					"boxes": [
						{"coordinates": [4, -1, 7, 0, 3, 5], "textureOffset": [30, 18]}
					]
				},
				{
					"part": "tail",
					"id": "tail",
					"invertAxis": "xy",
					"translate": [0, -2.5, -4],
					"boxes": [
						{"coordinates": [0, 0, 7, 0, 5, 12], "textureOffset": [21, 1]}
					]
				}
			]
		}`
	}
	EntityOptions.glow_squid = {
		name: 'Glow Squid',
		texture_name: 'glow_squid.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABJ0lEQVRoQ2NkIBFsufLwPyla5vdOJkU5w9r5PYwkaYAqhrkLZh+x5pBsGcgiCxUZotx44s4TBpCDpMUliFL/9OWL0QAgNuZgIer8ohecIiWupIOFZp6aBKZZwt+AaQ7lPryRPORTwGgAjKaA0SwwWgaMFoKjtcBoNUjfdgBRzTqoIlo3hSluB8AMINZTsBYXsephLTNi1cNacMSq9+aWBisluyUICgALcTGi7Dvx8hXYIgUJbqLUP3jxFdw05VaUI0r91/uPwE1Ydml1otT/fHqTYTQARlPAaBYYLQNGC8HRWmAEV4OERnwI1aeMQ70dMBoABMb8RlMAgRAYzQKjZcAQ7wxRpRAkVFAgyw+27jDFAUCK54ejWpJnhoZbIIwGwHCLUVL9AwDOVj4/czl/xgAAAABJRU5ErkJggg==',
		model: `{
			"textureSize": [64, 32],
			"models": [
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -25, 0],
					"boxes": [
						{"coordinates": [-6, 17, -6, 12, 16, 12], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "tentacle1",
					"id": "tentacle1",
					"invertAxis": "xy",
					"translate": [-5, -18, 0],
					"boxes": [
						{"coordinates": [4, 0, -1, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle2",
					"id": "tentacle2",
					"invertAxis": "xy",
					"translate": [-3.5, -18, 3.5],
					"submodels": [
						{
							"id": "tentacle2_rotation",
							"invertAxis": "xy",
							"translate": [3.5, 9, -3.5],
							"rotate": [0, 135, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle3",
					"id": "tentacle3",
					"invertAxis": "xy",
					"translate": [0, -18, 5],
					"boxes": [
						{"coordinates": [-1, 0, -6, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle4",
					"id": "tentacle4",
					"invertAxis": "xy",
					"translate": [3.5, -18, 3.5],
					"submodels": [
						{
							"id": "tentacle4_rotation",
							"invertAxis": "xy",
							"translate": [-3.5, 9, -3.5],
							"rotate": [0, -135, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle5",
					"id": "tentacle5",
					"invertAxis": "xy",
					"translate": [-10, -18, 5],
					"rotate": [0, -90, 0],
					"boxes": [
						{"coordinates": [-6, 0, -11, 2, 18, 2], "textureOffset": [48, 0]}
					]
				},
				{
					"part": "tentacle6",
					"id": "tentacle6",
					"invertAxis": "xy",
					"translate": [3.5, -18, -3.5],
					"submodels": [
						{
							"id": "tentacle6_rotation",
							"invertAxis": "xy",
							"translate": [-3.5, 9, 3.5],
							"rotate": [0, -45, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle7",
					"id": "tentacle7",
					"invertAxis": "xy",
					"translate": [0, -18, -1.65],
					"rotate": [0, -180, 0],
					"submodels": [
						{
							"id": "tentacle7_rotation",
							"invertAxis": "xy",
							"translate": [0, 9, -1.7],
							"rotate": [0, -180, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				},
				{
					"part": "tentacle8",
					"id": "tentacle8",
					"invertAxis": "xy",
					"translate": [-3.5, -18, -3.5],
					"submodels": [
						{
							"id": "tentacle8_rotation",
							"invertAxis": "xy",
							"translate": [3.5, 9, 3.5],
							"rotate": [0, 45, 0],
							"boxes": [
								{"coordinates": [-1, -9, -1, 2, 18, 2], "textureOffset": [48, 0]}
							]
						}
					]
				}
			]
		}`
	}
	EntityOptions.goat = {
		name: 'Goat',
		texture_name: 'goat.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACmklEQVR4Xu1bvUoDQRC+gKCQ3pxERFGw8QHS+xA+gqWFD2FjLLRKlSew0077YJ1GEPzBwEUsbIJYKauZZT13b2c2d7inn9WBM7s3383vN6SR/PO/Rhn2nw3v333n9LsnPpHktH9Yyvt4LzIESrlQAdDZWHbeO7h5TBQA7VbqlBmNs28AmKCa4PlAkuoBAIm7uGThASWFwMvBksY4He7q597VsX6e23nWzwvrR58evJ11dQ6S6CndqEIAAMADEALIAYSAJJkhCaIKoAyiDwjJHdE1Qr5Bp4y2PX9GaZ2g7+WiHofNMuIzxPZ/s2S59M1+PuQOcwZw6dNsIDlfDxOd1qJET8sOxk+JAmA1bTr177JJogBorq0E3TG5fUgUAPPtTaf+2+g6AQDT6VCCMjyA5mmEAHIAkqAkd6AKEAIog3+lDwjy/6lS7TtBrvGcFRidxen9SfY3hiC6WzQM+RYgOi8wVmEkm1+JmR9DuuZSulIdAMB1f0K3aAkKD5giwNkGu0IghOEN0Yk2B4QYE6IDAKYIRJcEQ75miA48AB7whYA4BLhlszadoIQR5vT8BJCEBeYwvnRuCPFZ9NEaCgAOHcYZe+kiCQvMYXzp3FDmFwAUIAAPQAggByAJ1qoKXLzu/Uhptp6DyzLVLgkqAExOwjZ6F7FMefQAQN2qADwAIVBBDuBOeDEMQ6WHANf4WOTyu4mZq0AshnHfIxoAaANDTQi38eAa6pKzredmaoRCX6hsALjEjC0PcckXG/EiosQUWPSi9CJ0OR1uMjY2oy7TfeudnH7ERspwyRcb8aIIlsoBMNkmZQAAgAdEHAKc3bo0B9QmBJRhZobNtnrJ+WSki0T+R4rcJCgBgFORKqsCVQGQN8qVBDnGVyHzATQnonZ03SAOAAAAAElFTkSuQmCC',
		model: `{
			"textureSize": [64, 64],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [-1, -10, 0],
					"boxes": [
						{"coordinates": [-0.01, 19, -10, 2, 7, 2], "textureOffset": [12, 55]},
						{"coordinates": [-2.99, 19, -10, 2, 7, 2], "textureOffset": [12, 55]},
						{"coordinates": [2, 19, -10, 3, 2, 1], "textureOffset": [2, 61]},
						{"coordinates": [-0.5, 6, -14, 0, 7, 5], "textureOffset": [23, 52]}
					],
					"submodels": [
						{
							"id": "left_ear",
							"invertAxis": "xy",
							"translate": [-1, 10, 0],
							"mirrorTexture": "u",
							"boxes": [
								{"coordinates": [-5, 9, -10, 3, 2, 1], "textureOffset": [2, 61]}
							]
						},
						{
							"id": "head_rotation",
							"invertAxis": "xy",
							"translate": [-1, 18, -8],
							"rotate": [-55, 0, 0],
							"boxes": [
								{"coordinates": [-2, -3, -8, 5, 7, 10], "textureOffset": [34, 46]}
							]
						}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -19, -2],
					"boxes": [
						{"coordinates": [-5, 6, -7, 9, 11, 16], "textureOffset": [1, 1]},
						{"coordinates": [-6, 4, -8, 11, 14, 11], "textureOffset": [0, 28]}
					]
				},
				{
					"part": "front_left_leg",
					"id": "front_left_leg",
					"invertAxis": "xy",
					"translate": [-1, -10, 6],
					"boxes": [
						{"coordinates": [-4, 0, -6, 3, 10, 3], "textureOffset": [35, 2]}
					]
				},
				{
					"part": "front_right_leg",
					"id": "front_right_leg",
					"invertAxis": "xy",
					"translate": [3, -10, 6],
					"boxes": [
						{"coordinates": [0, 0, -6, 3, 10, 3], "textureOffset": [49, 2]}
					]
				},
				{
					"part": "back_right_leg",
					"id": "back_right_leg",
					"invertAxis": "xy",
					"translate": [3, -10, -4],
					"boxes": [
						{"coordinates": [0, 0, 4, 3, 6, 3], "textureOffset": [49, 29]}
					]
				},
				{
					"part": "back_left_leg",
					"id": "back_left_leg",
					"invertAxis": "xy",
					"translate": [-1, -10, -4],
					"boxes": [
						{"coordinates": [-4, 0, 4, 3, 6, 3], "textureOffset": [36, 29]}
					]
				}
			]
		}`
	}
	EntityOptions.warden = {
		name: 'Warden',
		texture_name: 'warden.png',
		texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAADxUlEQVR4Xu1dvW4UMRB2JCSQricnHUJEIOUV0lPyABSUFLwFBTWhgCpFlCegS8kDRNRpkJCSICJdECUpqEDOYbJ38vgbe73rXe93rX93/M3n8XjGt2WUv+PTiz/Kqt5qR/sf2jQ3H4/ebrXq4F9j9B1onm3nUXr8TRmqhWonvvfkQdIanHz9bqxgF9vzpPaXV8usAJC+A80zxzxCcuxjfAIgAOQ+FoAASOCAHJrnhi29AKXHJwOQAdYwQBugIQ5uAQF6phFoTI6tiFvAAGyA0BR4DBSkMxYGeLrcD/or5qevghA8+Pw+WH7n+c9g+bPZIlje9fj3Hr9Tb+t2ourKyIGBFBtpFmqvdcBYAOxt3/d2d3L1w9gFeDSfecvPl9fGAmC289Bbfn32zVgA3F3sest/X34xFgAlx48GANIY96UIuWgBkWa59kjD0DilF6D0+EkAkBDrhI00By0K0izXHmkYGmcIGkgAeFaJAFgJBSkSkhNSEKsAZIDCezAZgAwwPiOQNsAKtTkomAxABiADbGIAaRZPAfkYiEYgjUC1c+/GExjynNEPsM5lmmMYbQDaALQBaAOUu4ugDUAbgDZAyds42gC0AcZnA6BbNlvO62BjqjwFaBbf1WkbFOL6aRsc4vrxBYkwIKSjiCAr9DZhYf99Ci2zhFw/UoAmAUAAMCQsgtajjgxkgApjAiPAwi2gxqBQAuBWAujWkqeAFiniNAIHGhNIBiADqDFAI5BGYPIrIX1uASFEI48mSmBBiSvVpoY5R5CaLgIVu/QExs5P8m5Kc9SmqCHvaWz/Lz79Ur3RdLjzWiUCd218ExGkapHhPsCNg7SsOR+kcdq5S/fkvm1NeicgJT08V/8WAFJOo5OBPcVYAEi5i65eM4FEFRJmG6KsFu1CoKNWsx907NKOGcqYybVA0lxy9U8AaFfbU48AWBcKGaAhj1waSgZQaugQtwDf1GONtBAAcvTPLUAJMF81lzbuK5OOhZKhKhml0vEvV/8vz96ID1vQCATgkN4NkAxbiaUko7SP/gmADAywGSxKACgzg2o4BvqidccGAI0OJDmCUHo4AbASfektgADQSEDwA9TAAPQEEgBBCdAVLIinDyu9a4bhKSBR+20zAoCuYO8LnmM7BdAGSGQBMgAZgAzQwMAkbwO79tV33T+NwET6d0Zg7MsZLYbrpGmnIWFT8ASOHQCdoMq9EqbtHEXUavsZUkygds611otKDq1VCFP+LgJgyqsf85cxE5dTtZ9PBqh2aXUfRgDo5FRtLQKg2qXVfdhfyHTJ1xsOlbcAAAAASUVORK5CYII=',
		model: `{
			"textureSize": [128, 64],
			"models": [
				{
					"part": "head",
					"id": "head",
					"invertAxis": "xy",
					"translate": [0, -34, 0],
					"boxes": [
						{"coordinates": [-8, 34, -5, 16, 16, 10], "textureOffset": [0, 0]}
					]
				},
				{
					"part": "left_ear",
					"id": "left_ear",
					"invertAxis": "xy",
					"translate": [-8, -46.5, 0],
					"boxes": [
						{"coordinates": [-18, 43, 0, 10, 10, 0], "textureOffset": [106, 46]}
					]
				},
				{
					"part": "right_ear",
					"id": "right_ear",
					"invertAxis": "xy",
					"translate": [8, -46.5, 0],
					"boxes": [
						{"coordinates": [8, 43, 0, 10, 10, 0], "textureOffset": [106, 36]}
					]
				},
				{
					"part": "body",
					"id": "body",
					"invertAxis": "xy",
					"translate": [0, -34, 0],
					"boxes": [
						{"coordinates": [-9, 13, -5, 18, 21, 11], "textureOffset": [0, 26]}
					]
				},
				{
					"part": "right_arm",
					"id": "right_arm",
					"invertAxis": "xy",
					"translate": [11, -30, 0],
					"boxes": [
						{"coordinates": [9, 6, -4, 8, 28, 8], "textureOffset": [52, 0]}
					]
				},
				{
					"part": "left_arm",
					"id": "left_arm",
					"invertAxis": "xy",
					"translate": [-11, -30, 0],
					"boxes": [
						{"coordinates": [-17, 6, -4, 8, 28, 8], "textureOffset": [84, 0]}
					]
				},
				{
					"part": "left_leg",
					"id": "left_leg",
					"invertAxis": "xy",
					"translate": [-6, -13, 0],
					"boxes": [
						{"coordinates": [-9, 0, -3, 6, 13, 6], "textureOffset": [82, 36]}
					]
				},
				{
					"part": "right_leg",
					"id": "right_leg",
					"invertAxis": "xy",
					"translate": [6, -13, 0],
					"boxes": [
						{"coordinates": [3, 0, -3, 6, 13, 6], "textureOffset": [58, 36]}
					]
				}
			]
		}`
	}
})()
