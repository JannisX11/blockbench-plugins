;(async function () {
	let generatorActions
	let reloadButton
	let newCEMTemplate
	let entitySelector
	let shown
	let entityData
	let entityCategories
	const E = s => $(document.createElement(s))
	const imageNotFound = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGumlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuMjE3YmNhNiwgMjAyMS8wNi8xNC0xODoyODoxMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wOC0wNVQyMToxMTo1MCswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDgtMDVUMjE6NDQ6NDQrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDgtMDVUMjE6NDQ6NDQrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIxIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRG90IEdhaW4gMjAlIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI4YzEwOTJhLWE5MmQtOWM0Yi1iM2VhLTFkOGRiZTI4NDkxMCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmI1NWI1NTY0LTc5OGYtNDk0MS05ZWExLWRlNDk0OWI4MmU2OCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjMyYTJmNzZmLTE4NjMtNTM0Mi1hNzY2LWFmOTNkMmMwYmFiYyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzJhMmY3NmYtMTg2My01MzQyLWE3NjYtYWY5M2QyYzBiYWJjIiBzdEV2dDp3aGVuPSIyMDIxLTA4LTA1VDIxOjExOjUwKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQxNjJjMGQ0LTNhZGItMTU0Zi1hZTA5LTRkNjFmYmE2MGM2OSIgc3RFdnQ6d2hlbj0iMjAyMS0wOC0wNVQyMTo0NDo0NCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiOGMxMDkyYS1hOTJkLTljNGItYjNlYS0xZDhkYmUyODQ5MTAiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDVUMjE6NDQ6NDQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7QCzIXAAAS+UlEQVR4nM2d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"
	const getBase64FromUrl = url => { 
		return new Promise(async (resolve) => {
			const reader = new FileReader()
			reader.readAsDataURL(await (await fetch(url)).blob())
			reader.onloadend = () => {
				const base64data = reader.result
				resolve(base64data)
			}
		})
	}
	const imageObserver = new IntersectionObserver(function(entries, observer){
		entries.forEach(function(entry) {
			if("src" in entry.target.dataset){
				if(entry.isIntersecting){
					imageObserver.unobserve(entry.target)
					fetch(entry.target.dataset.src, {method: "HEAD"}).then(r => {
						entry.target.style.backgroundImage = `url("${r.status < 400 ? entry.target.dataset.src : imageNotFound}")`
						delete entry.target.dataset.src
					}).catch(() => {
						entry.target.style.backgroundImage = `url("${imageNotFound}")`
						delete entry.target.dataset.src
					})
				}
			}else{
				imageObserver.unobserve(entry.target)
			}
		})
	})
	const loadCEMTemplateModels = (entityData, data) => {
		$("#cem_template_sidebar").append(entityData.categories.map(e => E("li").attr("id", `cem_template_tab_${e.name.toLowerCase()}`).append(
			E("span").addClass("icon_wrapper f_left").append(
				e.icon.match(/^icon-/) ? E("i").addClass(`${e.icon} icon`) : E("i").addClass("material-icons icon").text(e.icon)
			),
			e.name
		).on("click", evt => {
			$("#cem_template_sidebar>.selected").removeClass("selected")
			$(evt.currentTarget).addClass("selected")
			$("#cem_template_page>:not(:last-child)").css("display", "none")
			const page = $(`#cem_template_page_${e.name.toLowerCase()}`).css("display", "block")
			page.find(".search_bar>input").select()
		})))
		$("#cem_template_sidebar>:first-child").addClass("selected")
		$("#cem_template_buttons").before(entityData.categories.map((e, i) => E("div").css("display", i === 0 ? "block" : "none").attr("id", `cem_template_page_${e.name.toLowerCase()}`).append(
			E("h2").text(e.name),
			E("content").append(
				E("section").append(
					E("p").text(e.description)
				),
				E("section").append(
					E("label").text("Models"),
					E("div").addClass("search_bar").attr("placeholder", "Search...").css("width", "220px").append(
						E("input").addClass("dark_bordered").attr("type", "text").on("input", evt => {
							const query = evt.currentTarget.value.toLowerCase()
							$(evt.currentTarget).parent().next().find(".cem_template_model").each((i, e) => {
								const label = $(e).children().eq(1)
								if(~label.text().toLowerCase().indexOf(query)){
									$(e).css("display", "")
								}else{
									$(e).css("display", "none")
								}
							})
						}),
						E("i").addClass("material-icons").text("search")
					),
					E("ul").addClass("cem_template_list").append(
						e.entities.map(f => {
							const model = entityData.models[typeof f === "string" ? f : f.model || f.name]
							const image = `https://www.wynem.com/bot_assets/images/minecraft/renders/${f.name || f}.png` + (data?.appendToURL ?? "")
							const imageElement = E("div").addClass("cem_template_image").attr("data-src", image)
							const element = E("li").addClass("cem_template_model").attr("data-modelid", f.name || f).attr("data-category", e.name).append(
								imageElement,
								E("label").text(typeof f === "string" ? f.replace(/_/g, " ") : f.display_name || f.name.replace(/_/g, " "))
							).on("click", evt => {
								$(".cem_template_model.selected").removeClass("selected")
								element.addClass("selected")
							})
							if(f.description){
								element.attr("title", f.description)
							}
							if(f.popup){
								element.attr("data-popup", f.popup)
							}
							if(f.popup_width){
								element.attr("data-popup-width", f.popup_width)
							}
							imageObserver.observe(imageElement[0])
							return element
						})
					)
				)
			)
		)))
	}
	const loadEntities = entityData => {
		const entityCategories = {}
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
				entityCategories[category.name].entities[entity.name] = {
					name: entity.display_name || entity.name.replace(/_/g, " ").replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1)),
					file_name: entity.file_name || entity.name,
					model: model.model,
					texture_name: Array.isArray(entity.texture_name) ? entity.texture_name.map(e => e + ".png") : (entity.texture_name || entity.name) + ".png",
					texture_data: model.texture_data && (typeof model.texture_data === "string" ? "data:image/png;base64," + model.texture_data : model.texture_data.map(e => "data:image/png;base64," + e)),
					vanilla_textures: entity.vanilla_textures
				}
			}
		}
		return entityCategories
	}
	function loadInterface(categoryID, data){
		entitySelector.show()
		if(!shown){
			shown = true
			loadCEMTemplateModels(entityData, data)
			$("#cem_template_discord").on("click", (evt) => {
				if(Blockbench.isWeb || Blockbench.isMobile){
					window.open("https://discord.com/invite/pkRxtGw", "_blank").focus()
				}else{
					shell.openExternal("https://discord.com/invite/pkRxtGw")
				}
			})
			$("#cem_template_load_button").on("click", async evt => {
				const selectedModel = $(".cem_template_model.selected")
				if(selectedModel.length === 0){
					Blockbench.showQuickMessage("Please select a template model", 2000)
					return
				}
				const modelID = selectedModel.attr("data-modelid")
				const categoryName = selectedModel.attr("data-category")
				newProject(Formats.optifine_entity)
				const entity = entityCategories[categoryName].entities[modelID]
				const model = JSON.parse(entity.model)
				Project.name = entity.file_name
				Formats.optifine_entity.codec.parse(model, "")
				if($("#cem_template_texture_check").is(":checked")){
					try{
						for(const [idx, textureName] of (entity.vanilla_textures || [entity.texture_name]).entries()){
							const r = await fetch(`https://www.wynem.com/bot_assets/images/minecraft/entities/${modelID}${idx || ""}.png` + (data?.appendToURL ?? ""), {method: "HEAD"})
							if(r.status < 400){
								new Texture({name: textureName}).fromDataURL(await getBase64FromUrl(`https://www.wynem.com/bot_assets/images/minecraft/entities/${modelID}${idx || ""}.png` + (data?.appendToURL ?? ""))).add()
							}else{
								throw new Exception
							}
						}
					}catch{
						if ((typeof entity.texture_data).match(/string|undefined/)){
							if(entity.texture_data){
								new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add()
							}else{
								TextureGenerator.addBitmap({
									name: entity.texture_name,
									color: new tinycolor("#00000000"),
									type: "template",
									rearrange_uv: false,
									resolution: "16"
								})	
							}
						} else {
							for (let i = 0; i < entity.texture_data.length; i++){
								new Texture({name: entity.texture_name[i]}).fromDataURL(entity.texture_data[i]).add()
							}
						}
						Blockbench.showQuickMessage("Unable to load vanilla texture", 2000)
					}
				}else{
					if ((typeof entity.texture_data).match(/string|undefined/)){
						if(entity.texture_data){
							new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add()
						}else{
							TextureGenerator.addBitmap({
								name: entity.texture_name,
								color: new tinycolor("#00000000"),
								type: "template",
								rearrange_uv: false,
								resolution: "16"
							})	
						}
					} else {
						for (let i = 0; i < entity.texture_data.length; i++){
							new Texture({name: entity.texture_name[i]}).fromDataURL(entity.texture_data[i]).add()
						}
					}
				}
				Undo.history.length = 0
				Undo.index = 0
				entitySelector.hide()
				Blockbench.setStatusBarText(entity.name)
				if(selectedModel.attr("data-popup")){
					const options = {
						id: "cem_template_loader_popup",
						title: "CEM Template Loader",
						buttons: ["Okay"],
						lines: [
							(selectedModel.attr("data-popup-width") ? `<style>#cem_template_loader_popup{max-width:min(${selectedModel.attr("data-popup-width")}px, 100%)!important}</style>` : "") + selectedModel.attr("data-popup")
						]
					}
					if(selectedModel.attr("data-popup-width")){
						options.width = parseInt(selectedModel.attr("data-popup-width"))
					}
					new Dialog(options).show()
				}
			})
			$("#cem_template_load_button+button").on("click", evt => {
				entitySelector.hide()
			})
		}
		$("#cem_template_sidebar>.selected").removeClass("selected")
		$(`#cem_template_tab_${categoryID.toLowerCase()}`).addClass("selected")
		$("#cem_template_page>:not(:last-child)").css("display", "none")
		$("#cem_template_wrapper .search_bar>input").val("")
		$(".cem_template_model").removeClass("selected").css("display", "")
		const page = $(`#cem_template_page_${categoryID.toLowerCase()}`).css("display", "block")
		page.find(".search_bar>input").focus()
	}
	const setupPlugin = async (url, data) => {
		try{
			entityData = await fetch(url + (data?.appendToURL ?? "")).then(e => e.json())
			//const fs = require("fs")
			//entityData = JSON.parse(fs.readFileSync("E:/Programming/GitHub/wynemGithub/bot_assets/json/cem_template_models.json", "UTF-8"))
			entitySelector = new Dialog({
				id: "cem_template_selector",
				title: "CEM Template Loader",
				width: 980,
				buttons: [],
				lines: [
					'<style>#cem_template_background{min-height:493px}#cem_template_wrapper{position:absolute;left:0;top:30px;display:flex;min-height:541px;min-width:100%;background-color:var(--color-ui)}#cem_template_selector{max-width:100%!important}#cem_template_selector>.dialog_handle{margin-bottom:0}#cem_template_sidebar{background-color:var(--color-back);flex:0 0 160px;padding:16px 0;position:relative}#cem_template_sidebar li{width:100%;padding:6px 20px;border-left:4px solid transparent;cursor:pointer}#cem_template_sidebar li:hover{color:var(--color-light)}#cem_template_sidebar li.selected{background-color:var(--color-ui);border-left:4px solid var(--color-accent)}#cem_template_sidebar li .icon_wrapper{margin:0 10px 0 -10px}@media (max-device-width:640px){#cem_template_sidebar{display:none}}ul.cem_template_list{max-height:384px;width:100%;overflow-y:auto}ul.cem_template_list>li{display:flex;flex-direction:column;position:relative;float:left;width:124px;height:92px;margin:2px;background-color:var(--color-back);cursor:pointer;box-sizing:border-box;padding:2px 2px 20px;border:2px solid transparent}ul.cem_template_list>li:hover{background-color:var(--color-selected);color:var(--color-light)}ul.cem_template_list>li.selected{border-color:var(--color-accent);background-color:var(--color-button)}ul.cem_template_list>li.selected:hover{background-color:var(--color-selected)}ul.cem_template_list>li .cem_template_image{height:86px;background-size:contain;background-position:50%;background-repeat:no-repeat;image-rendering:auto}ul.cem_template_list>li label{position:absolute;bottom:0;text-align:center;width:100%;pointer-events:none;text-transform:capitalize}#cem_template_page{display:flex;flex-direction:column;flex-grow:1;padding:5px 20px 45px;position:relative}#cem_template_page>content{flex-grow:1}#cem_template_buttons{flex:40px 0 0;padding:8px;display:flex;position:absolute;bottom:0;right:0;left:0}#cem_template_buttons .bar_spacer{flex-grow:1}#cem_template_texture_check_wrapper{display:flex;align-items:center;margin-left:8px;align-self:stretch}#cem_template_texture_check_wrapper label{padding:4px 8px}#cem_template_load_button{background-color:var(--color-accent);color:var(--color-light);width:112px;margin-right:4px}#cem_template_discord{display:flex;position:absolute;bottom:12px;left:0;right:0;justify-content:center;gap:5px;text-decoration:none;cursor:pointer}#cem_template_discord:hover{color:var(--color-light)}#cem_template_discord span{text-decoration:underline}</style><div id="cem_template_background"></div><div id="cem_template_wrapper"><ul id="cem_template_sidebar"><a id="cem_template_discord"><i class="material-icons">bug_report</i><span>Report issues</span></a></ul><div id="cem_template_page"><div id="cem_template_buttons"><div id="cem_template_texture_check_wrapper"><input class="focusable_input" id="cem_template_texture_check" type="checkbox"><label for="cem_template_texture_check">Load vanilla texture</label></div><div class="bar_spacer"></div><button class="confirm_btn" id="cem_template_load_button">Load</button><button class="cancel_btn">Cancel</button></div></div></div>'
				]
			})
			shown = false
			entityCategories = loadEntities(entityData)
			generatorActions = []
			for (const category of Object.values(entityData.categories)){
				generatorActions.push(
					new Action(category.name.toLowerCase().replace(/\s+/g, "_"), {
						name: `${category.name} Entities`,
						description: category.description,
						icon: category.icon,
						click: () => loadInterface(category.name, data)
					})
				)
			}
			generatorActions.push("_", {
				name: `v${entityData.version}`,
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
			for(const item of $("#start-files>.start_screen_left>ul>li")){
				if($(item).find("h3").text() === "OptiFine Entity"){
					$(item).after(E("li").attr("id", "new_cem_template").append(
						E("span").addClass("icon_wrapper f_left").append(
							E("i").addClass("material-icons icon").text("keyboard_capslock")
						),
						E("h3").text("CEM Template Model"),
						E("p").text("Load template entity models for use with OptiFine CEM.")
					).on("click", evt => {
						loadInterface(entityData.categories[0].name, data)
					}))
					break
				}
			}
			return true
		}catch(err){
			console.log(err)
			generatorActions = []
			generatorActions.push({
				name: "Connection failed",
				description: "Could not connect to wynem.com",
				id: "cem_template_loader_connection_failure",
				icon: "wifi_off"
			},
			"_",
			new Action("cem_template_loader_retry_connection", {
				name: `Retry connection`,
				description: "Attempt to reconnect to wynem.com",
				icon: "sync",
				click: async function(){
					for (let action of generatorActions){
						if (typeof action.delete === "function") {
							action.delete()
						}
					}
					MenuBar.removeAction("filter.cem_template_loader")
					if(await setupPlugin("https://www.wynem.com/bot_assets/json/cem_template_models.json?rnd=" + Math.random())){
						Blockbench.showQuickMessage("Reconnected sucessfully", 2000)
					}else{
						new Dialog({
							id: "cem_template_loader_connection_failure_dialog",
							title: "CEM Template Loader",
							lines: [
								'<h2>Connection failed</h2><span>Please check your internet connection and make sure that you can access <a href=\"https://www.wynem.com/?cem\">wynem.com</a></span>'
							],
							"buttons": ["Okay"]
						}).show()
					}
				}
			}))
			MenuBar.addAction({
				name: "Load CEM Template",
				id: "cem_template_loader",
				description: "Load template entity models for use with OptiFine CEM.",
				children: generatorActions,
				icon: "keyboard_capslock",
			}, "filter")
			return false
		}
	}
	Plugin.register("cem_template_loader", {
		title: "CEM Template Loader",
		icon: "keyboard_capslock",
		author: "Ewan Howell",
		description: "Load template entity models for use with OptiFine CEM.",
		about: "CEM Template Loader helps you create custom entitiy models for use in OptiFine. To use, head to the \"Filter\" tab and select \"CEM Template Loader\". From here, select the model that you would like to edit, and load it. When editing entity models, make sure not move any pivot points of main folders, or create any new main folders. After editing your model, export it as an OptiFine JEM to the folder \"assets/minecraft/optifine/cem\". If a texture is used in the model, it must be saved in this same location.",
		tags: ["Minecraft: Java Edition", "OptiFine", "Templates"],
		version: "5.4.1",
		min_version: "4.0.0",
		variant: "both",
		onload() {
			setupPlugin("https://www.wynem.com/bot_assets/json/cem_template_models.json")
			reloadButton = new Action("cem_template_loader_reload", {
				name: `Reload CEM Templates`,
				description: "Reload the CEM Template Loader models",
				icon: "sync",
				click: async function(){
					for (let action of generatorActions){
						if (typeof action.delete === "function") {
							action.delete()
						}
					}
					MenuBar.removeAction("filter.cem_template_loader")
					$("#new_cem_template").remove()
					const result = await setupPlugin("https://www.wynem.com/bot_assets/json/cem_template_models.json", {
						appendToURL: `?rnd=${Math.random()}`
					})
					if(result){
						Blockbench.showQuickMessage("Reloaded CEM Templates", 2000)
					}else{
						new Dialog({
							id: "cem_template_loader_connection_failure_dialog",
							title: "CEM Template Loader",
							lines: [
								'<h2>Connection failed</h2><p>Please connect to the internet to use CEM Template Loader</p>'
							],
							"buttons": ["Okay"]
						}).show()
					}
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
			$("#new_cem_template").remove()
		}
	})
})()
