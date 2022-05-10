;(async function () {
  let generatorActions, reloadButton, entitySelector, loaderShown, entityData, entityCategories, groupObserver, animationEditorPanel, animationControlPanel, context, boolMap, rangeMap, specialMap, styles, stopAnimations, updateSelection, docShown, documentation, editorKeybinds, tabChange
  const description = "Load template Java Edition entity models for use with OptiFine CEM."
  const links = {
    discord: "https://discord.com/invite/FcpnSjrP82",
    ewan: "https://www.ewanhowell.com/",
    tutorials: "https://youtube.com/playlist?list=PLYMG6bVBIumIdRUIcHZxuKeM8u-kOmlml"
  }
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
              ).on({
                click: evt => {
                  $(".cem_template_model.selected").removeClass("selected")
                  element.addClass("selected")
                },
                dblclick: evt => {
                  const selectedModel = $(".cem_template_model.selected")
                  loadModel(selectedModel.attr("data-modelid"), selectedModel.attr("data-category"), $("#cem_template_texture_check").is(":checked"), data)
                }
              })
              if(f.description){
                element.attr("title", f.description)
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
      for (let entity of category.entities) {
        if (typeof entity === "string") entity = {
          name: entity
        }
        const model = entityData.models[entity.model || entity.name]
        entityCategories[category.name].entities[entity.name] = {
          name: entity.display_name || entity.name.replace(/_/g, " ").replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1)),
          file_name: entity.file_name || entity.name,
          model: model.model,
          texture_name: Array.isArray(entity.texture_name) ? entity.texture_name.map(e => e + ".png") : (entity.texture_name || entity.name) + ".png",
          texture_data: model.texture_data && (typeof model.texture_data === "string" ? "data:image/png;base64," + model.texture_data : model.texture_data.map(e => "data:image/png;base64," + e)),
          vanilla_textures: entity.vanilla_textures,
          popup: entity.popup,
          popup_width: entity.popup_width
        }
      }
    }
    return entityCategories
  }
  async function loadModel(modelID, categoryName, defaultTexture, data) {
    if (!categoryName) {
      const category = Object.entries(entityCategories).find(e => {return e[1].entities[modelID]})
      if (!category) return Blockbench.showQuickMessage("Unknown CEM template model", 2000)
      categoryName = category[0]
    }
    const entity = entityCategories[categoryName].entities[modelID] 
    const model = JSON.parse(entity.model)
    const createNewProject = !$("#cem_template_project_check").is(":checked")
    if (!Project || createNewProject) {
      newProject(Formats.optifine_entity)
      Project.name = entity.file_name
      Blockbench.setStatusBarText(entity.name)
    }
    Formats.optifine_entity.codec.parse(model, "")
    if (defaultTexture) {
      try {
        for (const [idx, textureName] of (entity.vanilla_textures || [entity.texture_name]).entries()) {
          const r = await fetch(`https://www.wynem.com/bot_assets/images/minecraft/entities/${modelID}${idx || ""}.png` + (data?.appendToURL ?? ""), {method: "HEAD"})
          if (r.status < 400) new Texture({name: textureName}).fromDataURL(await getBase64FromUrl(`https://www.wynem.com/bot_assets/images/minecraft/entities/${modelID}${idx || ""}.png` + (data?.appendToURL ?? ""))).add()
          else throw new Exception
        }
      } catch {
        if ((typeof entity.texture_data).match(/string|undefined/)) {
          if (entity.texture_data) new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add()
          else TextureGenerator.addBitmap({
            name: entity.texture_name,
            color: new tinycolor("#00000000"),
            type: "template",
            rearrange_uv: false,
            resolution: "16"
          })  
        } else for (let i = 0; i < entity.texture_data.length; i++) new Texture({name: entity.texture_name[i]}).fromDataURL(entity.texture_data[i]).add()
        Blockbench.showQuickMessage("Unable to load vanilla texture", 2000)
      }
    } else {
      if ((typeof entity.texture_data).match(/string|undefined/)) {
        if (entity.texture_data) new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add()
        else TextureGenerator.addBitmap({
          name: entity.texture_name,
          color: new tinycolor("#00000000"),
          type: "template",
          rearrange_uv: false,
          resolution: "16"
        })  
      } else for (let i = 0; i < entity.texture_data.length; i++) new Texture({name: entity.texture_name[i]}).fromDataURL(entity.texture_data[i]).add()
    }
    Undo.history.length = 0
    Undo.index = 0
    entitySelector.hide()
    if (entity.popup) {
      const options = {
        id: "cem_template_loader_popup",
        title: "CEM Template Loader",
        buttons: ["Okay"],
        lines: [
          (entity.popup_width ? `<style>#cem_template_loader_popup{max-width:min(${entity.popup_width}px, 100%)!important}</style>` : "") + entity.popup
        ]
      }
      if (entity.popup_width) options.width = parseInt(entity.popup_width)
      new Dialog(options).show()
    }
  }
  function loadInterface(categoryID, data){
    entitySelector.show()
    if (!loaderShown) {
      loaderShown = true
      loadCEMTemplateModels(entityData, data)
      $("#cem_template_discord").on("click", evt => openLink("discord"))
      $("#cem_template_load_button").on("click", async evt => {
        const selectedModel = $(".cem_template_model.selected")
        if(selectedModel.length === 0) return Blockbench.showQuickMessage("Please select a template model", 2000)
        const modelID = selectedModel.attr("data-modelid")
        await loadModel(modelID, selectedModel.attr("data-category"), $("#cem_template_texture_check").is(":checked"), data)
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
  async function setupPlugin(url, data) {
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
          '<style>.dialog_content{margin:0!important}#cem_template_wrapper{display:flex;min-height:541px;min-width:100%;--color-subtle_text:#91949c;overflow-y:auto}#cem_template_selector{max-width:100%!important}#cem_template_selector>.dialog_handle{margin-bottom:0}#cem_template_sidebar{background-color:var(--color-back);flex:0 0 160px;padding:16px 0;position:relative}#cem_template_sidebar li{width:100%;padding:6px 20px;border-left:4px solid transparent;cursor:pointer}#cem_template_sidebar li:hover{color:var(--color-light)}#cem_template_sidebar li.selected{background-color:var(--color-ui);border-left:4px solid var(--color-accent)}#cem_template_sidebar li .icon_wrapper{margin:0 10px 0 -10px}@media (max-device-width:640px){#cem_template_sidebar{display:none}}ul.cem_template_list{max-height:384px;width:100%;overflow-y:auto}ul.cem_template_list>li{display:flex;flex-direction:column;position:relative;float:left;width:124px;height:92px;margin:2px;background-color:var(--color-back);cursor:pointer;box-sizing:border-box;padding:2px 2px 20px;border:2px solid transparent}ul.cem_template_list>li:hover{background-color:var(--color-selected);color:var(--color-light)}ul.cem_template_list>li.selected{border-color:var(--color-accent);background-color:var(--color-button)}ul.cem_template_list>li.selected:hover{background-color:var(--color-selected)}ul.cem_template_list>li .cem_template_image{height:86px;background-size:contain;background-position:50%;background-repeat:no-repeat;image-rendering:auto;cursor:pointer}ul.cem_template_list>li label{position:absolute;bottom:0;text-align:center;width:100%;pointer-events:none;text-transform:capitalize}#cem_template_page{display:flex;flex-direction:column;flex-grow:1;padding:5px 12px 45px 20px;position:relative;background-color:var(--color-ui)}#cem_template_page>content{flex-grow:1}#cem_template_buttons{flex:40px 0 0;padding:8px 8px 8px 20px;display:flex;position:absolute;bottom:0;right:0;left:0}#cem_template_buttons .bar_spacer{flex-grow:1}#cem_template_check_wrapper{display:flex;align-items:center;align-self:stretch}#cem_template_check_wrapper label{margin:0 16px 0 8px}#cem_template_project_check{margin-left:8px}#cem_template_load_button{background-color:var(--color-accent);color:var(--color-light);width:112px;margin-right:4px}#cem_template_discord{display:flex;position:absolute;bottom:12px;left:0;right:0;justify-content:center;gap:5px;text-decoration:none;cursor:pointer}#cem_template_discord:hover{color:var(--color-light)}#cem_template_discord span{text-decoration:underline}</style><div id="cem_template_wrapper"><ul id="cem_template_sidebar"><a id="cem_template_discord"><i class="material-icons">bug_report</i><span>Report issues</span></a></ul><div id="cem_template_page"><div id="cem_template_buttons"><div id="cem_template_check_wrapper"><input class="focusable_input" id="cem_template_texture_check" type="checkbox"><label for="cem_template_texture_check">Load vanilla texture</label><input class="focusable_input" id="cem_template_project_check" type="checkbox"><label for="cem_template_project_check">Load into current project</label></div><div class="bar_spacer"></div><button class="confirm_btn" id="cem_template_load_button">Load</button><button class="cancel_btn">Cancel</button></div></div></div>'
        ]
      })
      loaderShown = false
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
        icon: "info",
        click: () => showInfo()
      })
      MenuBar.addAction({
        name: "Load CEM Template",
        id: "cem_template_loader",
        description,
        children: generatorActions,
        icon: "keyboard_capslock",
      }, "filter")
      for(const item of $("#start-files>.start_screen_left>ul>li")){
        if($(item).find("i").hasClass("icon-format_optifine")){
          $(item).after(E("li").attr("id", "new_cem_template").append(
            E("span").addClass("icon_wrapper f_left").append(
              E("i").addClass("material-icons icon").text("keyboard_capslock")
            ),
            E("h3").text("CEM Template Model"),
            E("p").text(description)
          ).on("click", () => loadInterface(entityData.categories[0].name, data)))
          break
        }
      }
      return true
    } catch (err) {
      console.error(err)
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
        click: async () => {
          for (let action of generatorActions) if (typeof action.delete === "function") action.delete()
          MenuBar.removeAction("filter.cem_template_loader")
          if (await setupPlugin("https://www.wynem.com/bot_assets/json/cem_template_models.json?rnd=" + Math.random())) Blockbench.showQuickMessage("Reconnected sucessfully", 2000)
          else{
            new Dialog({
              id: "cem_template_loader_connection_failure_dialog",
              title: "CEM Template Loader",
              lines: ['<h2>Connection failed</h2><span>Please check your internet connection and make sure that you can access <a href=\"https://www.wynem.com/?cem\">wynem.com</a></span>'],
              "buttons": ["Okay"]
            }).show()
          }
        }
      }))
      MenuBar.addAction({
        name: "Load CEM Template",
        id: "cem_template_loader",
        description,
        children: generatorActions,
        icon: "keyboard_capslock",
      }, "filter")
      return false
    }
  }
  function showInfo() {
    const infoBox = new Dialog({
      id: "cem_template_install",
      title: "CEM Template Loader",
      width: 780,
      buttons: [],
      lines: [`
        <style>
          code{padding:0 2px}
          a.cem_template_info_link{
            cursor:pointer;
            display:flex;
            align-items:center;
            gap:10px;
            text-decoration:none!important;
            padding-right:40px
          }
          a.cem_template_info_link span{text-decoration:underline}
        </style>
        <h1 style="margin-top:-10px">CEM Template Loader</h1>
        <p>CEM Template Loader can be used to load the vanilla entity models for Minecraft: Java Edition, so you can use them in OptiFine CEM, or as texturing templates.</p>
        <br>
        <p>To use this plugin, head to the <code>Tools</code> tab and select <code>CEM Template Loader</code>. From here, select the model that you would like to edit and load it.</p>
        <br>
        <p>After editing your model, export it as an OptiFine JEM to the folder <code>assets/minecraft/optifine/cem</code>. If a texture is used in the model, make sure it saves with a valid file path.</p>
        <br>
        <h2>Important</h3>
        <p>When editing an entity model, you cannot rotate root groups (top level folders), or move the pivot points of root groups, as this can break your model. If you need to rotate a root group, use a subgroup. If you need to change a root group's pivot point, use CEM animations.</p>
        <br>
        <div class="dialog_bar" style="display:flex;align-items:center">
          <a id="cem_template_info_ewan" class="cem_template_info_link">
            <i class="material-icons icon">language</i>
            <span>By Ewan Howell</span>
          </a>
          <a id="cem_template_info_discord" class="cem_template_info_link">
            <i class="fa_big icon fab fa-discord"></i>
            <span>Discord Server</span>
          </a>
          <a id="cem_template_info_tutorials" class="cem_template_info_link">
            <i class="material-icons icon">menu_book</i>
            <span>CEM Modelling Tutorials</span>
          </a>
          <span style="flex-grow:1"></span>
          <button type="button" id="cem_template_dismiss">Dismiss</button>
        </div>
      `]
    }).show()
    $("#cem_template_info_ewan").on("click", evt => openLink("ewan"))
    $("#cem_template_info_discord").on("click", evt => openLink("discord"))
    $("#cem_template_info_tutorials").on("click", evt => openLink("tutorials"))
    $("#cem_template_dismiss").on("click", evt => infoBox.hide())
  }
  function openLink(type) {
    if (Blockbench.isWeb || Blockbench.isMobile) window.open(links[type], "_blank").focus()
    else shell.openExternal(links[type])
  }
  const constants = {
    pi: Math.PI,
    sin: Math.sin,
    cos: Math.cos,
    asin: Math.asin,
    acos: Math.acos,
    tan: Math.tan,
    atan: Math.atan,
    atan2: Math.atan2,
    torad: deg => deg / 180 * Math.PI,
    todeg: rad => rad / Math.PI * 180,
    min: Math.min,
    max: Math.max,
    clamp: (x, min, max) => Math.min(max, Math.max(min, x)),
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    exp: Math.exp,
    frac: x => x - Math.floor(x),
    log: Math.log,
    pow: Math.pow,
    random: Math.random,
    round: Math.round,
    signum: Math.sign,
    sqrt: Math.sqrt,
    fmod: (x, y) => ((x % y) + y) % y,
    if: (...args) => {
      for (let i = 0; i < args.length; i += 2) {
        if (i === args.length - 1) return args[i]
        else if (args[i]) return args[i+1]
      }
    },
    between: (x, min, max) => x >= min && x <= max,
    equals: (x, y, epsilon) => Math.abs(x - y) <= epsilon,
    in: (x, ...vals) => vals.includes(x),
    print: num => {
      console.log(num)
      return num
    },
    idle_time: 0,
    revenge_time: 0,
    move_forward: 0,
    move_strafing: 0
  }
  const rangesObj = {
    pos_x: 0,
    pos_y: [-64, 64, 320],
    pos_z: 0,
    health: [0, 20, 20],
    max_health: [1, 20, 500],
    limb_speed: [0, 0, 1, 0.01],
    head_yaw: [-90, 0, 90],
    head_pitch: [-90, 0, 90]
  }
  const specialsObj = {
    limb_swing: [0, false],
    hurt_time: [10, false],
    swing_progress: [0, false]
  }
  const enabledBooleans = new Set([
    "is_alive", "is_on_ground"
  ])
  let bools = new Map()
  let ranges = new Map()
  let specials = new Map()
  const parseCEMA = js => {
    try {
      return Function(`"use strict";return (function(ctx){
        try {
          return (${js})
        } catch (err) {
          return err
        }
      })`)()(context)
    } catch (err) {
      return err
    }
  }
  function preprocessCEMA(anim) {
    if (typeof anim === "number") return anim
    if (typeof anim !== "string") throw "Expression must be a string/number"
    anim = anim.trim()
    if (anim.length === 0) return ""
    const boolsMatch = anim.matchAll(/(?<=[\s\n(!&|=,]|^)is_[a-z_]+(?=[\s\n)!&|=,]|$)/g)
    for (const bool of boolsMatch) boolMap.set(bool[0], bools.get(bool[0]) ?? enabledBooleans.has(bool[0]) ? true : false)
    const check = anim.match(/[^a-z0-9_,\+\-\*\/%!&\|>=<\(\)\[\]:\.\s]/gi)
    if (check) throw `Unsupported character "<span style="font-weight:600">${check[0]}</span>" in animation "<span style="font-weight:600">${anim.replace(/</g, "&lt;")}</span>"`
    const check2 = anim.match(/[\)\]]\s*\(|=>|\.(?![trs][xyz]\b|\d+)[a-z]+|[^a-z0-9_]\[|(?!==)(?<=[^=!><]|^)=|<<=|>>>=|>>=|[!=]==|\+\+|--/gi)
    if (check2) throw `Invalid syntax "<span style="font-weight:600">${check2[0].replace(/</g, "&lt;")}</span>" in animation "<span style="font-weight:600">${anim.replace(/</g, "&lt;")}</span>"`
    return anim
      .replace(/:[a-z_]([a-z0-9_]+)?/gi, m => `.children["${m.slice(1)}"]`)
      .replace(/(?<=[\s\n(+*\/%!&|=<>,-]|^)[a-z_]([a-z0-9_]+)?/gi, m => {
        if (m in rangesObj && !rangeMap.has(m)) rangeMap.set(m, ranges.get(m) ?? [rangesObj[m], rangesObj[m]?.[1] ?? rangesObj[m]])
        if (m in specialsObj && !specialMap.has(m)) specialMap.set(m, specials.get(m) ?? specialsObj[m])
        return m === "true" || m === "false" ? m : `ctx["${m}"]`
      })
  }
  let timescale = 1
  function setupAnimationPanel() {
    let steps, playing, paused, currentGroups
    animationControlPanel = new Panel("cem_animation_controller", {
      name: "Animation Controller",
      growable: true,
      condition: {
        formats: ["optifine_entity"],
        modes: ["edit"]
      },
      default_position: {
        folded: true
      },
      component: {
        template: `
          <div id="cem_animation_controller_container">
            <div class="cem_animation_range bar slider_input_combo">
              <p>Timescale</p>
              <input id="cem_animation_timescale_slider" type="range" min=0 max=4 step=0.05 value=1></input>
              <input id="cem_animation_timescale_text" class="tool cem_animation_range_number" type="number" min=0 max=4 step=0.05 value=1>
            </div>
            <div id="cem_animation_controller_variables">
            </div>
          </div>
        `
      }
    })
    let timescaleTimeout
    const timescaleSlider = $("#cem_animation_timescale_slider")
    const timescaleText = $("#cem_animation_timescale_text")
    timescaleSlider.on("input", () => {
      timescaleText.val(timescaleSlider.val())
      timescale = parseFloat(timescaleSlider.val())
    })
    timescaleText.on("input", () => {
      timescaleSlider.val(timescaleText.val())
      const clamped = Math.min(4, Math.max(0, parseFloat(timescaleText.val())))
      clearTimeout(timescaleTimeout)
      timescaleTimeout = setTimeout(() => timescaleText.val(isNaN(clamped) ? 1 : clamped), 1000)
      timescale = clamped
    })
    animationEditorPanel = new Panel("cem_animation", {
      name: "Animation Editor",
      growable: true,
      condition: {
        formats: ["optifine_entity"],
        modes: ["edit"]
      },
      default_position: {
        folded: true,
        slot: "bottom"
      },
      component: {
        components: {
          VuePrismEditor
        },
        data: {
          text: ""
        },
        methods: {
          change() {
            stopAnimations()
            const text = this.text.trim()
            if (text === "") {
              animationErrorToggle()
              return group.cem_animations = []
            }
            const parsed = parseAnimations(text)
            if (parsed) group.cem_animations = parsed
          },
          format() {
            if (formatButton.hasClass("cem_animation_button_disabled")) return
            this.text = JSON.stringify(JSON.parse(this.text), null, 2)
          },
          play() {
            if (playButton.hasClass("cem_animation_button_disabled")) return
            currentGroups = [Group.selected]
            setupAnimations(currentGroups)
          },
          playAll() {
            if (playButton.hasClass("cem_animation_button_disabled")) return
            currentGroups = Group.all.filter(e => e.parent === "root")
            setupAnimations(currentGroups)
          },
          stop: () => stopAnimations(),
          pause() {
            if (paused) {
              paused = false
              prevTime = Date.now()
              Blockbench.on("render_frame", playAnimations)
              pauseButton.text("pause").attr("title", "Pause the animations")
            } else {
              paused = true
              Blockbench.removeListener("render_frame", playAnimations)
              pauseButton.text("play_arrow").attr("title", "Resume the animations")
            }
          },
          showDoc: () => showDocumentation()
        },
        template: `
          <div>
            <h6 id="cem_animation_placeholder">Select a group to start editing its animations</h6>
            <div id="cem_animation_content">
              <div class="cem_animation_bar" style="margin-bottom:8px">
                <p id="cem_animation_title" class="panel_toolbar_label">Editing animations for part: <span id="cem_animation_part_name" style="font-weight:600"></p>
                <span class="spacer"></span>
                <span id="cem_animation_doc_button" @click="showDoc()" title="Animation documentation">
                  <p>Documentation</p>
                  <div class="cem_animation_button cem_animation_button_small"><i class="material-icons">description</i></div>
                </span>
              </div>
              <div id="cem_animation_editor_container">
                <vue-prism-editor id="cem_animation_editor" v-model="text" language="json" line-numbers @change="change()" />
              </div>
              <div class="cem_animation_bar" style="margin-top:8px">
                <div id="cem_animation_status_success" class="cem_animation_status">
                  <i class="fa fa-check"></i>
                </div>
                <div id="cem_animation_status_error" class="cem_animation_status">
                  <i class="material-icons">clear</i>
                </div>
                <div id="cem_animation_status_warning" class="cem_animation_status">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.54"><path d="M2.35 84.42L45.28 10.2l.17-.27h0a23 23 0 0 1 7.05-7.24A17 17 0 0 1 61.57 0a16.7 16.7 0 0 1 9.11 2.69 22.79 22.79 0 0 1 7 7.26q.19.32.36.63l42.23 73.34.24.44h0a22.48 22.48 0 0 1 2.37 10.19 17.63 17.63 0 0 1-2.17 8.35 15.94 15.94 0 0 1-6.93 6.6c-.19.1-.39.18-.58.26a21.19 21.19 0 0 1-9.11 1.75h0-86.48-.65a18.07 18.07 0 0 1-6.2-1.15A16.42 16.42 0 0 1 3 104.24a17.53 17.53 0 0 1-3-9.57 23 23 0 0 1 1.57-8.74 7.66 7.66 0 0 1 .77-1.51z"/></svg>
                </div>
                <div id="cem_animation_error_message"></div>
                <span class="spacer"></span>
                <span id="cem_animation_play_button">
                  <div class="cem_animation_button"><i class="material-icons" @click="playAll()" title="Play all the groups animations">playlist_play</i></div>
                  <div class="cem_animation_button"><i class="material-icons" @click="play()" title="Play this groups animations">play_arrow</i></div>
                </span>
                <span id="cem_animation_stop_button" style="display:none">
                  <div class="cem_animation_button"><i class="material-icons" @click="stop()" title="Stop the animations">stop</i></div>
                  <div class="cem_animation_button"><i id="cem_animation_pause_button" class="material-icons" @click="pause()" title="Pause the animations">pause</i></div>
                </span>
                <div id="cem_animation_format_button" class="cem_animation_button"><i class="material-icons" @click="format()" title="Pretty print the animation code">code</i></div>
              </div>
            </div>
          </div>
        `
      }
    })
    const partName = $("#cem_animation_part_name")
    const placeholder = $("#cem_animation_placeholder")
    const content = $("#cem_animation_content")
    const statusSuccess = $("#cem_animation_status_success")
    const statusError = $("#cem_animation_status_error")
    const statusWarning = $("#cem_animation_status_warning")
    const errorMessage = $("#cem_animation_error_message")
    const playButton = $("#cem_animation_play_button")
    const stopButton = $("#cem_animation_stop_button")
    const pauseButton = $("#cem_animation_pause_button")
    const formatButton = $("#cem_animation_format_button")
    const editor = $("#cem_animation_editor code")
    const controller = $("#cem_animation_controller_variables")
    const editorWrapper = $("#cem_animation_editor")
    let time = 0
    let prevTime
    const invertions = new Set(["tx", "rx", "ry"])
    function setupAnimations(groups, keepTime) {
      if (!keepTime) time = 0
      playing = true
      playButton.css("display", "none")
      stopButton.css("display", "flex")
      steps = []
      boolMap = new Map()
      rangeMap = new Map()
      specialMap = new Map()
      for (const part of Group.all.filter(e => e.cemAnimationInvertPivotPoint && !e.cemAnimationPivotPointInverted)) {
        part.cemAnimationPivotPointInverted = true
        part.mesh.position.x = -part.mesh.position.x
        for (const child of part.mesh.children) child.position.x = -child.position.x 
      }
      for (const group of groups) for (const section of group.cem_animations) for (const [key, val] of Object.entries(section)) {
        const split = key.split(".")
        const part = ["this", "part"].includes(split[0]) ? group : Group.all.find(e => e.name === split[0])
        if (!part || part.cemAnimationDisableRotation && split[1][0] === "r") continue
        let anim
        try {
          anim = split[1] === "ty" ? `${part.parent === "root" ? "24-" : part.parent?.parent === "root" ? `- ${part.mesh.parent.position.y}-` : "-"}(${preprocessCEMA(val)})` : split[1] === "tz" && part.parent?.parent === "root" ? `(${preprocessCEMA(val)}) - ${part.mesh.parent.position.z}` : split[1] === "tx" && part.parent?.parent === "root" ? `(${preprocessCEMA(val)}) + ${part.mesh.parent.position.x}` : preprocessCEMA(val)
        } catch (err) {
          return animationErrorToggle(err)
        }
        steps.push({
          part,
          mode: split[1][0] === "t" ? "position" : split[1][0] === "r" ? "rotation" : "scale",
          axis: split[1][1],
          transform: split[1],
          key,
          raw: val,
          anim,
          invert: invertions.has(split[1]) ? -1 : 1
        })
      }
      controller.empty()
      bools = new Map(boolMap)
      if (bools.size) {
        const boolsSorted = [...bools.entries()]
        boolsSorted.sort(((a, b) => b[0] - a[0]))
        const boolContainer = E("div").attr("id", "cem_animation_bools").appendTo(controller)
        for (const bool of boolsSorted) {
          boolContainer.append(E("div").addClass("cem_animation_bool").append(
            E("input").attr({
              id: `cem_animation_${bool[0]}_bool`,
              type: "checkbox",
              name: bool[0],
              checked: bool[1]
            }).on("change", evt => bools.set(bool[0], evt.target.checked)),
            E("label").attr("for", bool[0]).text(bool[0]),
          ))
        }
      }
      specials = new Map(specialMap)
      if (specials.has("limb_swing")) {
        let container = $("#cem_animation_bools")
        if (!container.length) container = E("div").attr("id", "cem_animation_bools").appendTo(controller)
        specials.get("limb_swing")[0] = 0
        container.prepend(E("div").addClass("cem_animation_bool").append(
          E("input").attr({
            type: "checkbox",
            name: "limb_swing",
            checked: specials.get("limb_swing")[1]
          }).on("change", evt => specials.get("limb_swing")[1] = evt.target.checked),
          E("label").attr("for", "limb_swing").text("limb_swing")
        ))
      }
      ranges = new Map(rangeMap)
      let rangesSorted
      function updateHealth(num) {
        if (ranges.has("health")) {
          const health = ranges.get("health")
          health[0][2] = num
          const slider = $("#cem_animation_range_health_slider")
          const number = $("#cem_animation_range_health_text")
          const current = parseInt(slider.val())
          const val = current > num ? num : current
          const attr = {
            max: num,
            value: val
          }
          slider.attr(attr)
          number.attr(attr)
          slider.val(val)
          number.val(val)
        }
      }
      if (ranges.size) {
        rangesSorted = [...ranges.entries()]
        rangesSorted.sort(((a, b) => b[0] - a[0]))
        const rangeContainer = E("div").attr("id", "cem_animation_ranges").append(E("div").attr("id", "cem_animation_range_labels"), E("div").css("flex", "1")).css({
          display: "flex",
          gap: "8px"
        }).appendTo(controller)
        for (const range of rangesSorted) {
          rangeContainer.children().first().append(E("div").text(range[0]))
          let timeout
          rangeContainer.children().eq(1).append(E("div").addClass("cem_animation_range bar slider_input_combo").append(
            E("input").attr({
              id: `cem_animation_range_${range[0]}_slider`,
              type: "range",
              min: range[1][0][0] ?? -1000,
              max: range[1][0][2] ?? 1000,
              step: range[1][0][3] ?? 1,
              value: range[1][1],
            }).on("input", evt => {
              const num = parseFloat(evt.target.value)
              text.val(evt.target.value)
              ranges.set(range[0], [range[1][0], num])
              if (range[0] === "max_health") updateHealth(num)
            }),
            E("input").addClass("tool cem_animation_range_number").attr({
              id: `cem_animation_range_${range[0]}_text`,
              type: "number",
              min: range[1][0][0] ?? -1000,
              max: range[1][0][2] ?? 1000,
              step: range[1][0][3] ?? 1,
              value: range[1][1],
            }).on("input", evt => {
              slider.val(evt.target.value)
              const clamped = Math.min(range[1][0][2] ?? 1000, Math.max(range[1][0][0], parseFloat(evt.target.value)))
              clearTimeout(timeout)
              timeout = setTimeout(() => text.val(isNaN(clamped) ? range[1][1] : clamped), 1000)
              const num = Math.max(range[1][0][0] ?? -1000, clamped)
              ranges.set(range[0], [range[1][0], num])
              if (range[0] === "max_health") updateHealth(num)
            })
          ))
          const slider = $(`#cem_animation_range_${range[0]}_slider`)
          const text = $(`#cem_animation_range_${range[0]}_text`)
        }
      }
      if (specials.has("hurt_time")) {
        let container = $("#cem_animation_buttons")
        if (!container.length) container = E("div").attr("id", "cem_animation_buttons").appendTo(controller)
        const button = E("div").addClass("cem_animation_button").append(
          E("button").attr({
            id: "cem_animation_hurt_time_button",
            title: 'Simulate the entity taking damage. Runs "hurt_time"'
          }).text("Hurt entity").on("click", evt => {
            if ($(evt.target).hasClass("cem_animation_button_disabled")) return
            specials.set("hurt_time", [10, true])
            button.children().first().addClass("cem_animation_button_disabled")
            const hurtTimeBool = $("#cem_animation_is_hurt_bool")
            if (hurtTimeBool) {
              hurtTimeBool.prop("checked", true)
              bools.set("is_hurt", true)
            }
          })
        ).appendTo(container)
        if (specials.get("hurt_time")[1] === true) button.children().first().addClass("cem_animation_button_disabled")
      }
      if (specials.has("swing_progress")) {
        let container = $("#cem_animation_buttons")
        if (!container.length) container = E("div").attr("id", "cem_animation_buttons").appendTo(controller)
        const button = E("div").addClass("cem_animation_button").append(
          E("button").attr({
            id: "cem_animation_swing_progress_button",
            title: 'Simulate the entity attacking. Runs "swing_progress"'
          }).text("Perform attack").on("click", evt => {
            if ($(evt.target).hasClass("cem_animation_button_disabled")) return
            specials.set("swing_progress", [0, true])
            button.children().first().addClass("cem_animation_button_disabled")
          })
        ).appendTo(container)
        if (specials.get("swing_progress")[1] === true) button.children().first().addClass("cem_animation_button_disabled")
      }
      prevTime = Date.now()
      Blockbench.on("render_frame", playAnimations)
    }
    function parseAnimations(text) {
      animationErrorToggle()
      try {
        let animations = JSON.parse(text)
        if (!Array.isArray(animations)) throw ["The top level must be an array"]
        for (const [i, animation] of animations.entries()) if (animation === null || typeof animation !== "object" || Array.isArray(animation)) {
          throw [`Unexpected item of type "${animation === null ? "null" : Array.isArray(animation) ? "array" : typeof animation}" at position ${i}`]
        }
        animations = animations.filter(e => Object.keys(e).length > 0)
        for (const section of animations) for (const [key, val] of Object.entries(section)) {
          if (val.trim?.() === "") throw ["Animations cannot be empty", key, val]
          const split = key.split(".")
          if (split.length < 2 || split[1] === "") throw [`Missing transformation type in animation "<span style="font-weight:600">${key}</span>"`, key, val]
          if (split[1].length > 2) throw [`Invalid transformation type in animation "<span style="font-weight:600">${key}</span>"`, key, val]
          if (!["r", "t", "s"].includes(split[1][0])) throw [`Unknown transform type "<span style="font-weight:600">${split[1][0]}</span>"`, key, val]
          if (!split[1][1]) throw [`Missing axis in animation "<span style="font-weight:600">${key}<span>"`, key, val]
          if (!["x", "y", "z"].includes(split[1][1])) throw [`Unknown axis "<span style="font-weight:600">${split[1][1]}</span>"`, key, val]
          boolMap = new Map()
          rangeMap = new Map()
          specialMap = new Map()
          preprocessCEMA(val)
          const part = ["this", "part"].includes(split[0]) ? group : Group.all.find(e => e.name === split[0])
          if (!part) animationErrorToggle(`Unknown group "<span style="font-weight:600">${split[0]}</span>"`, null, true)
        }
        return animations
      } catch (err) {
        if (err instanceof SyntaxError) {
          const numbers = err.message.match(/\d+/g)
          if (numbers?.length > 0) {
            let lineNum, colNum
            if (numbers.length === 1) {
              const split = text.substring(0, numbers[0]).split("\n")
              lineNum = split.length
              colNum = split[split.length - 1].length + 1
            } else {
              lineNum = parseInt(numbers[0])
              colNum = parseInt(numbers[1])
            }
            return animationErrorToggle(`Unexpected character at line ${lineNum} column ${colNum}`, lineNum)
          }
          return animationErrorToggle(err)
        }
        const split = text.split("\n")
        animationErrorToggle(err[0], split.indexOf(split.find(e => e.includes(`"${err[1]}"`) && e.includes(`"${err[2]}"`))) + 1)
      }
    }
    function animationErrorToggle(err, lineNum, warning) {
      $(".cem_animation_error_line").removeClass("cem_animation_error_line")
      if (err) {
        errorMessage.html(err)
        statusSuccess.css("display", "none")
        if (!warning) {
          statusWarning.css("display", "none")
          statusError.css("display", "flex")
          formatButton.addClass("cem_animation_button_disabled")
          playButton.addClass("cem_animation_button_disabled")
        } else {
          statusError.css("display", "none")
          statusWarning.css("display", "flex")
        }
        if (typeof lineNum === "number") {
          const line = $(`.prism-editor__line-numbers>:nth-child(${lineNum + 1})`)
          line.addClass("cem_animation_error_line")
        }
      } else {
        statusSuccess.css("display", "flex")
        statusError.css("display", "none")
        statusWarning.css("display", "none")
        errorMessage.text("")
        formatButton.removeClass("cem_animation_button_disabled")
        playButton.removeClass("cem_animation_button_disabled")
      }
    }
    function playAnimations() {
      try{
        const now = Date.now()
        const dt = (now - prevTime) / 1000
        prevTime = now
        const difference = 20 * timescale * dt
        time += difference
        if (specials.get("hurt_time")?.[0] <= 0) {
          specials.set("hurt_time", [10, false])
          $("#cem_animation_hurt_time_button").removeClass("cem_animation_button_disabled")
          const hurtTimeBool = $("#cem_animation_is_hurt_bool")
          if (hurtTimeBool) {
            hurtTimeBool.prop("checked", false)
            bools.set("is_hurt", false)
          }
        }
        if (specials.get("swing_progress")?.[0] >= 1) {
          specials.set("swing_progress", [0, false])
          $("#cem_animation_swing_progress_button").removeClass("cem_animation_button_disabled")
        }
        context = Object.assign({
          time: time,
          age: time,
          limb_swing: specials.get("limb_swing")?.[1] ? specials.get("limb_swing")[0] += difference / 1.666 : specials.get("limb_swing")?.[0] ?? 0,
          hurt_time: specials.get("hurt_time")?.[1] ? specials.get("hurt_time")[0] -= difference : 0,
          swing_progress: specials.get("swing_progress")?.[1] ? specials.get("swing_progress")[0] += difference / 4 : 0
        }, constants, Object.fromEntries(bools), Object.fromEntries(Array.from(ranges.entries()).map(e => [e[0], e[1][1]])))
        const parts = new Map()
        for (const part of Group.all) {
          const partObj = {
            children: {},
            tx: (part.cemAnimationInvertPivotPoint ? 1 : -1) * ((part.parent?.parent === "root") * part.mesh.parent.position.x + part.mesh.position.x),
            ty: (part.parent === "root") * 24 + (part.parent?.parent === "root") * -part.mesh.parent.position.y - part.mesh.position.y,
            tz: (part.parent?.parent === "root") * part.mesh.parent.position.z + part.mesh.position.z,
            rx: -part.mesh.rotation.x,
            ry: -part.mesh.rotation.y,
            rz: part.mesh.rotation.z,
            sx: part.mesh.scale.x,
            sy: part.mesh.scale.y,
            sz: part.mesh.scale.z
          }
          parts.set(part, partObj)
          context[part.name] = partObj
        }
        for (const part of Group.all) {
          const partObj = parts.get(part)
          for (const child of part.children) partObj.children[child.name] = parts.get(child)
        }
        for (const step of steps) {
          const parsed = parseCEMA(step.anim)
          if (isNaN(parsed)) throw `Unable to parse animation "<span style="font-weight:600">${step.raw.replace(/</g, "&lt;")}</span>" for "<span style="font-weight:600">${step.key}</span>"`
          step.part.mesh[step.mode][step.axis] = parsed * step.invert
          context[step.part.name][step.transform] = step.transform === "ty" ? (step.part.parent === "root") * 24 + (step.part.parent?.parent === "root") * -step.part.mesh.parent.position.y - step.part.mesh.position.y : step.transform === "tx" ? (step.part.cemAnimationInvertPivotPoint ? 1 : -1) * ((step.part.parent?.parent === "root") * step.part.mesh.parent.position.x + step.part.mesh.position.x) : step.transform === "tz" ? (step.part.parent?.parent === "root") * step.part.mesh.parent.position.z + step.part.mesh.position.z : invertions.has(step.transform) ? - step.part.mesh[step.mode][step.axis] : step.part.mesh[step.mode][step.axis]
        }
      } catch (err) {
        stopAnimations()
        animationErrorToggle(err.toString().replace(/ctx\./g, ""))
      }
    }
    stopAnimations = resetGroups => {
      Blockbench.removeListener("render_frame", playAnimations)
      for (const group of Group.all.filter(e => e.cemAnimationPivotPointInverted)) {
        group.cemAnimationPivotPointInverted = false
        group.mesh.position.x = -group.mesh.position.x
        for (const child of group.mesh.children) child.position.x = -child.position.x
      }
      if (resetGroups) {
        for (const group of Group.all.filter(e => e.cemAnimationInvertPivotPoint)) group.cemAnimationInvertPivotPoint = false
        for (const group of Group.all.filter(e => e.cemAnimationDisableRotation)) group.cemAnimationDisableRotation = false
      }
      Canvas.updateView({groups: Group.all})
      playButton.css("display", "flex")
      stopButton.css("display", "none")
      pauseButton.text("pause").attr("title", "Pause the animations")
      $("#cem_animation_hurt_time_button").addClass("cem_animation_button_disabled")
      $("#cem_animation_swing_progress_button").addClass("cem_animation_button_disabled")
      playing = false
      paused = false
    }
    function hide() {
      placeholder.css("display", "block")
      content.css("display", "none")
    }
    let group
    updateSelection = () => {
      if (Project.format?.id === "optifine_entity") {
        stopAnimations()
        let selected = Group.selected ?? Cube.selected?.[0]
        if (selected) {
          while (selected.parent !== "root") selected = selected.parent
          if (group !== selected) {
            group = selected
            partName.text(group.name)
            content.css("display", "flex")
            placeholder.css("display", "none")
            const animation = JSON.stringify(group.cem_animations?.length === 0 ? [{}] : group.cem_animations, null, 2)
            parseAnimations(animation)
            animationEditorPanel.vue.text = animation
            editorWrapper[0].__vue__._data.undoStack = [{plain: animation}]
            editorWrapper[0].__vue__._data.undoOffset = 0
          }
        }
      }
    }
    Blockbench.on("update_selection", updateSelection)
    updateSelection()
    tabChange = () => {
      group = null
      content.css("display", "none")
      placeholder.css("display", "block")
    }
    Blockbench.on("select_project", tabChange)
    editorKeybinds = evt => {
      if (evt.key === "s" && evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
        BarItems.export_over.trigger()
        evt.stopImmediatePropagation()
      }
    }
    $("#cem_animation_editor_container>div")[0].addEventListener("keydown", editorKeybinds, true)
    resizeWindow()
    function addAnimationToggles() {
      if (Project.format?.id === "optifine_entity") {
        const toggle = $(".outliner_toggle")
        if (toggle.hasClass("enabled")) {
          const toggles = $("#cubes_list>.outliner_node>.group>[toggle='autouv']")
          if (toggles.length) {
            groupObserver.disconnect()
            toggles.each((i, e) => {
              const toggle = $(e)
              const partName = toggle.parent().find("input").val()
              const part = Project.groups.find(e => e.name === partName)
              if (!toggle.parent().find("[toggle='cem_animation_invert_pivots']").length) {
                const invertToggle = E("i").attr({
                  title: "Invert this groups pivot point while playing animations",
                  toggle: "cem_animation_invert_pivots"
                }).addClass("material-icons icon_off").text("swap_horiz").on("click", evt => {
                  evt.stopPropagation()
                  const invertToggle = $(evt.target)
                  if (invertToggle.hasClass("icon_off")) {
                    invertToggle.removeClass("icon_off")
                    part.cemAnimationInvertPivotPoint = true
                  } else {
                    invertToggle.addClass("icon_off")
                    part.cemAnimationInvertPivotPoint = false
                  }
                  if (playing) {
                    stopAnimations()
                    setupAnimations(currentGroups, true)
                  }
                }).insertBefore(toggle)
                if (part.cemAnimationInvertPivotPoint) invertToggle.removeClass("icon_off")
              }
              if (!toggle.parent().find("[toggle='cem_animation_disable_rotations']").length) {
                const rotateToggle = E("i").attr({
                  title: "Disable this group rotating while playing animations",
                  toggle: "cem_animation_disable_rotations"
                }).addClass("material-icons icon_off").text("sync_disabled").on("click", evt => {
                  evt.stopPropagation()
                  const partName = toggle.parent().find("input").val()
                  const part = Project.groups.find(e => e.name === partName)
                  const invertToggle = $(evt.target)
                  if (invertToggle.hasClass("icon_off")) {
                    invertToggle.removeClass("icon_off")
                    part.cemAnimationDisableRotation = true
                  } else {
                    invertToggle.addClass("icon_off")
                    part.cemAnimationDisableRotation = false
                  }
                  if (playing) {
                    stopAnimations()
                    setupAnimations(currentGroups, true)
                  }
                }).insertBefore(toggle)
                if (part.cemAnimationDisableRotation) rotateToggle.removeClass("icon_off")
              }
            })
            groupObserver.observe(document.body, {
              childList: true,
              subtree: true
            })
          }
        } else {
          $("[toggle='cem_animation_invert_pivots']").remove()
          $("[toggle='cem_animation_disable_rotations']").remove()
        }
      }
    }
    groupObserver = new MutationObserver(() => {
      addAnimationToggles()
    })
    groupObserver.observe(document.body, {
      childList: true,
      subtree: true
    })
    addAnimationToggles()
    async function showDocumentation(){
      if (!docShown) {
        let docData
        try {
          const r = await fetch("https://www.wynem.com/bot_assets/json/cem_animation_doc.json")
          if (r.status !== 200) throw Error
          docData = await r.json()
        } catch (err) {
          console.error(err)
          return new Dialog({
            id: "cem_template_loader_connection_failure_dialog",
            title: "CEM Animation Documentation",
            lines: ['<h2>Connection failed</h2><span>Please check your internet connection and make sure that you can access <a href=\"https://www.wynem.com/?cem\">wynem.com</a></span>'],
            "buttons": ["Okay"]
          }).show()
        }
        // const fs = require("fs")
        // docData = JSON.parse(fs.readFileSync("E:/Programming/GitHub/wynemGithub/bot_assets/json/cem_animation_doc.json", "UTF-8"))
        docShown = true
        documentation = new Dialog({
          id: "cem_animation_documentation",
          title: "CEM Animation Documentation",
          width: 780,
          lines: [`
            <style>
              #cem_animation_documentation .dialog_content {
                margin: 0;
                position: relative;
              }
              #cem_doc {
                margin: 16px;
              }
              #cem_doc>div {
                display: none;
              }
              #cem_doc>div.selected {
                display: block;
              }
              #cem_doc * {
                white-space: pre-wrap;
              }
              #cem_doc h2 {
                font-size: 25px;
              }
              #cem_doc>div>:first-child {
                margin-top: -8px;
              }
              #cem_doc h2:not(:first-child) {
                padding-top: 16px;
              }
              #cem_doc td:not(:last-child) {
                padding-right: 16px;
              }
              #cem_doc code, #cem_doc pre {
                background-color: var(--color-back);
                padding: 0 4px;
                border: 1px solid var(--color-border);
                user-select: text;
                cursor: text;
                font-family: var(--font-code)
              }
              #cem_doc pre {
                margin-bottom: 16px;
              }
              #cem_doc img {
                margin: 8px;
                box-shadow: 0 3px 10px rgb(0 0 0 / 31%);
              }
              #cem_doc_tabs {
                background-color: var(--color-frame);
                display: flex;
                gap: 2px;
                padding: 4px 4px 0;
                position: sticky;
                top: 0;
                border-bottom: 4px solid var(--color-ui);
              }
              #cem_doc_tabs>div {
                padding: 4px 12px;
                cursor: pointer;
                border-top: 2px solid transparent;
                background-color: var(--color-back);
              }
              #cem_doc_tabs>div.selected {
                background-color: var(--color-ui);
                border-top-color: var(--color-accent);
                cursor: default;
              }
              .cem_doc_table_list td:first-child {
                font-weight: 600;
                white-space: nowrap!important;
                display: list-item;
                list-style: inside;
                font-family: var(--font-code);
              }
              .cem_doc_tab_link {
                text-decoration: underline;
                cursor: pointer;
                color: var(--color-accent);
              }
            </style>
            <div id="cem_doc_tabs"></div>
            <div id="cem_doc_container"><div id="cem_doc"></div></div>
          `],
          buttons: []
        }).show()
        const doc = $("#cem_doc")
        const tabs = $("#cem_doc_tabs")
        for (const tab of docData.tabs){
          const name = tab.name.replace(/ /g, "_")
          tabs.append(E("div").attr("id", `cem_doc_tab_${tab.name.replace(/ /g, "-")}`).html(tab.name).on("click", evt => {
            $("#cem_doc_tabs>div").removeClass("selected")
            $("#cem_doc>div").removeClass("selected")
            $(evt.target).addClass("selected")
            $(`#cem_doc_page_${name}`).addClass("selected")
            $("#cem_animation_documentation .dialog_content")[0].scrollTo(0, 0)
          }))
          const page = E("div").attr("id", `cem_doc_page_${name}`).appendTo(doc)
          for (const element of tab.elements) {
            if (element.type === "heading") page.append(E("h2").html(element.text))
            else if (element.type === "text") page.append(E("p").html(element.text))
            else if (element.type === "code") page.append(E("pre").html(element.text))
            else if (element.type === "table") {
              const table = E("table").appendTo(page)
              if (element.tableType === "list") table.addClass("cem_doc_table_list")
              for (const row of element.rows) {
                const tr = E("tr").appendTo(table)
                for (const [i, cell] of row.entries()) {
                  tr.append(E("td").html(cell))
                }
              }
            }
            else if (element.type === "image") page.append(E("img").attr({
              src: element.url,
              width: element.width,
              height: element.height
            }))
          }
        }
        $("#cem_doc_tabs>:first-child").addClass("selected")
        $("#cem_doc>:first-child").addClass("selected")
        $(".cem_doc_tab_link").on("click", evt => {
          $("#cem_doc_tabs>div").removeClass("selected")
          $("#cem_doc>div").removeClass("selected")
          $(`#cem_doc_tab_${evt.target.textContent.replace(/ /g, "-")}`).addClass("selected")
          $(`#cem_doc_page_${evt.target.textContent}`).addClass("selected")
          $("#cem_animation_documentation .dialog_content")[0].scrollTo(0, 0)
        })
        if (Blockbench.isWeb) $(".cem_doc_display_desktop").css("display", "none")
        else $(".cem_doc_display_web").css("display", "none")
        doc.append(
          E("hr"),
          E("p").html(`Documentation version:   <span style="font-family:var(--font-code)">v${docData.version}</span>\nUpdated to:   <span style="font-family:var(--font-code)">OptiFine ${docData.optifineVersion}</span>`)
        )
      } else documentation.show()
    }
  }
  function addStyles() {
    styles = Blockbench.addCSS(`
      #panel_cem_animation .panel_vue_wrapper {
        flex: 1;
        padding: 8px;
        overflow: auto!important;
        display: flex;
        flex-direction: column;
        max-height: 100%;
      }
      #panel_cem_animation .prism-editor-wrapper {
        background-color: var(--color-back);
      }
      #panel_cem_animation .prism-editor__line-numbers {
        overflow: visible;
        min-height: 100%!important;
        position: sticky;
        left: 0;
      }
      #panel_cem_animation .prism-editor__code {
        overflow: visible!important;
      }
      #cem_animation_editor_container {
        overflow: auto;
        flex: 1;
        max-height: calc(100% - 40px);
        min-height: 3.5em;
      }
      #cem_animation_controller_container {
        flex: 1;
        padding: 8px;
        display: flex;
        flex-direction: column;
        max-height: 100%;
        overflow: auto!important;
      }
      #cem_animation_editor {
        cursor: text;
        flex: 1;
      }
      #cem_animation_title {
        margin-left: 0;
      }
      #cem_animation_content {
        display: none;
        flex-direction: column;
        flex: 1;
        max-height: 100%;
      }
      .cem_animation_bar {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cem_animation_bar span {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      #cem_animation_part_name {
        display: inline!important;
      }
      .cem_animation_bar i {
        display: block;
      }
      .cem_animation_status {
        min-width: 25px;
        height: 25px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #cem_animation_status_success {
        background-color: var(--color-confirm);
        color: var(--color-dark);
      }
      #cem_animation_status_error {
        background-color: var(--color-close);
        color: var(--color-light);
        display: none;
      }
      #cem_animation_status_warning {
        background-color: transparent;
        fill: #FFA500;
        display: none;
        position: relative;
      }
      #cem_animation_status_warning:after {
        content: "!";
        position: absolute;
        font-weight: 600;
        font-size: 20px;
        color: var(--color-dark);
      }
      #cem_animation_error_message {
        display: flex;
        margin-left: 8px;
        gap: 3px;
        overflow-x: auto;
        white-space: nowrap;
      }
      #cem_animation_error_message span {
        font-family: var(--font-code);
        color: #a6e22e;
      }
      .cem_animation_error_line {
        background-color: var(--color-close);
        color: var(--color-light)!important;
        position: relative;
        padding-right: 4px;
        margin-right: -4px;
      }
      .cem_animation_error_line::after {
        content: "";
        position: absolute;
        left: 100%;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-left: 12px solid var(--color-close);
      }
      .spacer {
        flex: 1
      }
      .cem_animation_bool {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1 1 50%;
        padding-right: 8px;
      }
      .cem_animation_range {
        display: flex;
        align-items: center;
        margin: 0!important;
        height: 30px;
        box-sizing: content-box;
      }
      .cem_animation_range input {
        flex: 1;
      }
      .cem_animation_range p {
        margin: 0 8px 0 0;
      }
      .cem_animation_range_number {
        width: 2em;
        margin-left: 2px;
      }
      .cem_animation_button {
        height: 25px;
        min-width: 30px;
        cursor: pointer;
        position: relative;
      }
      .cem_animation_button:hover {
        color: var(--color-light);
      }
      .cem_animation_button i {
        position: absolute;
        top: -3px;
        font-size: 30px;
        min-width: 30px;
      }
      .cem_animation_button_small {
        height: 15px;
        min-width: 20px;
      }
      .cem_animation_button_small i {
        font-size: 20px;
        min-width: 20px;
      }
      .cem_animation_button_disabled, .cem_animation_button_disabled div {
        color: var(--color-subtle_text)!important;
        cursor: default;
      }
      button.cem_animation_button_disabled {
        text-decoration: none;
        opacity: 0.5;
      }
      button.cem_animation_button_disabled:hover {
        background-color: var(--color-button);
        color: var(--color-subtle_text)!important;
      }
      #panel_cem_animation>h3>label, #panel_cem_animation_controller>h3>label {
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .cem_animation_range_number {
        min-width: 60px;
      }
      #cem_animation_controller_variables {
        position: relative;
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      #cem_animation_controller_variables:not(:empty):before {
        content: "";
        position: absolute;
        bottom: calc(100% + 10px);
        left: 8px;
        right: 8px;
        height: 1px;
        background-color: var(--color-border);
      }
      #cem_animation_range_labels div {
        height: 30px;
        display: flex;
        align-items: center;
      }
      #cem_animation_ranges>div{
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      #cem_animation_bools {
        display: flex;
        flex-wrap: wrap;
      }
      #cem_animation_buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      #cem_animation_doc_button {
        cursor: pointer;
      }
      #cem_animation_doc_button:hover {
        color: var(--color-light);
      }
    `)
  }
  Plugin.register("cem_template_loader", {
    title: "CEM Template Loader",
    icon: "keyboard_capslock",
    author: "Ewan Howell",
    description: description + " Also includes an animation editor, so that you can create custom entity animations.",
    about: "CEM Template Loader can be used to load the vanilla entity models for Minecraft: Java Edition, so you can use them in OptiFine CEM, or as texturing templates.\n\nTo use this plugin, head to the \"Tools\" tab and select \"CEM Template Loader\". From here, select the model that you would like to edit and load it.\n\nAfter editing your model, export it as an OptiFine JEM to the folder \"assets/minecraft/optifine/cem\". If a texture is used in the model, make sure it saves with a valid file path.\n\nImportant\n\nWhen editing an entity model, you cannot rotate root groups (top level folders), or move the pivot points of root groups, as this can break your model. If you need to rotate a root group, use a subgroup. If you need to change a root group's pivot point, use CEM animations.\n\nCEM Template Loader also includes an animation editor, so that you can create custom entity animations.",
    tags: ["Minecraft: Java Edition", "OptiFine", "Templates"],
    version: "6.0.4",
    min_version: "4.2.0",
    variant: "both",
    oninstall() {
      showInfo()
      MenuBar.menus.tools.highlight()
    },
    async onload() {
      addStyles()
      await setupPlugin("https://www.wynem.com/bot_assets/json/cem_template_models.json")
      reloadButton = new Action("cem_template_loader_reload", {
        name: `Reload CEM Templates`,
        description: "Reload the CEM Template Loader models",
        icon: "sync",
        click: async function(){
          for (let action of generatorActions) if (typeof action.delete === "function") action.delete()
          MenuBar.removeAction("filter.cem_template_loader")
          $("#new_cem_template").remove()
          const result = await setupPlugin("https://www.wynem.com/bot_assets/json/cem_template_models.json", {
            appendToURL: `?rnd=${Math.random()}`
          })
          if (result) Blockbench.showQuickMessage("Reloaded CEM Templates", 2000)
          else new Dialog({
            id: "cem_template_loader_connection_failure_dialog",
            title: "CEM Template Loader",
            lines: ['<h2>Connection failed</h2><p>Please connect to the internet to use CEM Template Loader</p>'],
            "buttons": ["Okay"]
          }).show()
        }
      })
      MenuBar.addAction(reloadButton, "help.developer.1")
      setupAnimationPanel()
      if (Blockbench.isWeb) {
        const params = (new URL(location.href)).searchParams
        if (params.has("plugins") && params.get("plugins").split(",").includes("cem_template_loader") && params.has("model") && params.get("model") !== "") loadModel(params.get("model").toLowerCase(), null, params.has("texture"))
      }
    },
    onunload() {
      stopAnimations(true)
      Blockbench.removeListener("update_selection", updateSelection)
      Blockbench.removeListener("select_project", tabChange)
      $("#cem_animation_editor_container>div")[0].removeEventListener("keydown", editorKeybinds)
      groupObserver.disconnect()
      $("#new_cem_template").remove()
      $("[toggle='cem_animation_invert_pivots']").remove()
      $("[toggle='cem_animation_disable_rotations']").remove()
      for (let action of generatorActions) if (typeof action.delete === "function") action.delete()
      reloadButton.delete()
      MenuBar.removeAction("filter.cem_template_loader")
      MenuBar.removeAction("help.developer.cem_template_loader_reload")
      animationEditorPanel.delete()
      animationControlPanel.delete()
      styles.delete()
      resizeWindow()
    }
  })
})()
