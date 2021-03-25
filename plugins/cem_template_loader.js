(async function () {
	let entityCategories = {}
	let generatorActions = []
	const entityData = await fetch("https://www.wynem.com/bot_assets/json/cem_templates.json").then(e => e.json())
	for (let category of entityData.categories){
		entityCategories[category.name] = {
			description: category.description,
			icon: category.icon,
			entities: {}
		}
		for (let entity of category.entities){
			entityCategories[category.name].entities[entity.name] = {
				name: entity.display_name,
				model: JSON.stringify(entity.model)
			}
			if (entity.hasOwnProperty("texture_name")){
				entityCategories[category.name].entities[entity.name].texture_name = entity.texture_name
			}
			if (entity.hasOwnProperty("texture_data")){
				entityCategories[category.name].entities[entity.name].texture_data = entity.texture_data
			}
		}
	}
	Plugin.register("cem_template_loader", {
		title: "CEM Template Loader",
		icon: "keyboard_capslock",
		author: "Ewan Howell",
		description: "Load template entity models for use with OptiFine CEM.",
		version: "0.3.0",
		min_version: "3.6.0",
		variant: "both",
		onload() {
			for (let categoryName of Object.keys(entityCategories)){
				generatorActions.push(
					new Action(categoryName.toLowerCase().replace(/\s+/g, "_"), {
						name: `${categoryName} Entities`,
						description: entityCategories[categoryName].description,
						icon: entityCategories[categoryName].icon,
						click: function() {
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
									if (Format.id !== "optifine_entity") {
										if (!newProject(Formats.optifine_entity)) return
									}
									let entity = entityCategories[categoryName].entities[result.entity]
									var model = JSON.parse(entity.model)
									Formats.optifine_entity.codec.parse(model, "")
									if (entity.texture_data) {
										new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add()
									}
									Undo.history.length = 0
									Undo.index = 0
									this.hide()
								}
							});
							dialog.show();
						}
					})
				)
			}
			MenuBar.addAction({
				name: "Load CEM Template",
				id: "cem_template_loader",
				description: "Load template entity models for use with OptiFine CEM.",
				children: generatorActions,
				icon: "keyboard_capslock",
			}, "filter")
		},
		onunload() {
			for (let action of generatorActions){
				action.delete()
			}
			MenuBar.removeAction("filter.cem_template_loader")
		}
	})
})()
