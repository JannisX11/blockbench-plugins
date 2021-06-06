(async function () {
	let generatorActions = []
	let reloadButton
	let entityCategories
	let version
	const loadEntities = entityData => {
		entityCategories = {}
		for (let category of entityData.categories){
			entityCategories[category.name] = {
				description: category.description,
				icon: category.icon,
				entities: {}
			}
			for (let entity of category.entities){
				if (typeof entity === "string"){
					entity = {
						name: entity
					}
				}
				const model = entityData.models[entity.model || entity.name]
				const pngPrefix = "data:image/png;base64,"
				entityCategories[category.name].entities[entity.name] = {
					name: entity.display_name || entity.name.replace(/_/g, " ").replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1)),
					file_name: entity.file_name || entity.name,
					model: model.model,
					texture_name: Array.isArray(entity.texture_name) ? entity.texture_name.map(e => e + ".png") : (entity.texture_name || entity.name) + ".png",
					texture_data: typeof model.texture_data === "string" ? pngPrefix + model.texture_data : model.texture_data.map(e => pngPrefix + e)
				}
			}
		}
		version = entityData.version
	}
	const setupPlugin = () => {
		generatorActions = []
		for (let categoryName of Object.keys(entityCategories)){
			generatorActions.push(
				new Action(categoryName.toLowerCase().replace(/\s+/g, "_"), {
					name: `${categoryName} Entities`,
					description: entityCategories[categoryName].description,
					icon: entityCategories[categoryName].icon,
					click: function(){
						let options = {}
						for (var id in entityCategories[categoryName].entities) {
							options[id] = entityCategories[categoryName].entities[id].name
						}
						let dialog = new Dialog({
							title: `Select ${categoryName} Entity`,
							id: "generate_optifine_template",
							form: {
								entity: {label: `${categoryName} Entity`, type: "select", options}
							},
							onConfirm(result) {
								newProject(Formats.optifine_entity)
								let entity = entityCategories[categoryName].entities[result.entity]
								var model = JSON.parse(entity.model)
								Project.name = entity.file_name
								Formats.optifine_entity.codec.parse(model, "")
								if (typeof entity.texture_data === "string"){
									new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add()
								} else {
									for (let i = 0; i < entity.texture_data.length; i++){
										new Texture({name: entity.texture_name[i]}).fromDataURL(entity.texture_data[i]).add()
									}
								}
								Undo.history.length = 0
								Undo.index = 0
								this.hide()
								Blockbench.setStatusBarText(entity.name)
							}
						});
						dialog.show();
					}
				})
			)
		}
		generatorActions.push("_", {
			name: `v${version}`,
			id: "cem_template_loader_version",
			icon: "info"
		})
		MenuBar.addAction({
			name: "Load CEM Template",
			id: "cem_template_loader",
			description: "Load template entity models for use with OptiFine CEM.",
			children: generatorActions,
			icon: "keyboard_capslock",
		}, "filter")
	}
	loadEntities(await fetch("https://www.wynem.com/bot_assets/json/cem_template_models.json").then(e => e.json()))
	Plugin.register("cem_template_loader", {
		title: "CEM Template Loader",
		icon: "keyboard_capslock",
		author: "Ewan Howell",
		description: "Load template entity models for use with OptiFine CEM.",
		version: "4.0.0",
		min_version: "3.6.0",
		variant: "both",
		onload() {
			setupPlugin()
			reloadButton = new Action("cem_template_loader_reload", {
				name: `Reload CEM Templates`,
				description: "Reload the CEM Template Loader models",
				icon: "sync",
				click: async function(){
					loadEntities(await fetch("https://www.wynem.com/bot_assets/json/cem_template_models.json?rnd=" + Math.random()).then(e => e.json()))
					for (let action of generatorActions){
						if (typeof action.delete === "function") {
							action.delete()
						}
					}
					MenuBar.removeAction("filter.cem_template_loader")
					setupPlugin()
					Blockbench.showQuickMessage("Reloaded CEM Templates", 1000)
				}
			})
			MenuBar.addAction(reloadButton, "help.developer.1")
		},
		onunload() {
			for (let action of generatorActions){
				if (typeof action.delete === "function") {
					action.delete()
				}
			}
			reloadButton.delete()
			MenuBar.removeAction("filter.cem_template_loader")
			MenuBar.removeAction("help.developer.cem_template_loader_reload")
		}
	})
})()
