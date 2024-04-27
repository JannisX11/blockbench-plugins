(async function () {
  let format, codec, exportAction, exportAction2, importAction, manageAction, styles, properties, ignoreChange
  const id = "preview_scene_customiser"
  const name = "Preview Scene Customiser"
  const icon = "nature_people"
  const author = "Ewan Howell"
  const description = "Create your very own preview scenes. Download preview scenes from the Preview Scene Store. Edit and manage existing preview scenes."
  const links = {
    website: {
      text: "By Ewan Howell",
      link: "https://ewanhowell.com/",
      icon: "language",
      colour: "#33E38E"
    },
    discord: {
      text: "Discord Server",
      link: "https://discord.ewanhowell.com/",
      icon: "fab.fa-discord",
      colour: "#727FFF"
    },
    github: {
      text: "Submit Preview Scenes",
      link: "https://github.com/ewanhowell5195/previewSceneCustomiser/",
      icon: "fab.fa-github",
      colour: "#6E40C9"
    }
  }
  const E = s => $(document.createElement(s))
  function setCurrentPreviewScene(data) {
    console.log(data)
    localStorage.setItem("preview_scene", data.scene.id)
    activePreviewScene = data.scene.id
  }
  function removeCurrentPreviewScene() {
    if (ignoreChange) return
    localStorage.removeItem("preview_scene")
  }
  let activePreviewScene = PreviewScene.active?.id ?? "none"
  const scenes = []
  Plugin.register(id, {
    title: name,
    icon: "icon.png",
    author,
    description,
    tags: ["Preview Scenes", "Blockbench"],
    version: "1.1.1",
    min_version: "4.8.3",
    variant: "both",
    creation_date: "2022-10-14",
    await_loading: true,
    onload() {
      styles = Blockbench.addCSS(`
        .preview-scene-links {
          display: flex;
          justify-content: space-around;
          margin: 20px 40px 0;
        }
        .preview-scene-links > a {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 5px;
          text-decoration: none;
          flex-grow: 1;
          flex-basis: 0;
          color: var(--color-subtle_text);
          text-align: center;
        }
        .preview-scene-links > a:hover {
          background-color: var(--color-accent);
          color: var(--color-light);
        }
        .preview-scene-links > a > i {
          font-size: 32px;
          width: 100%;
          max-width: initial;
          height: 32px;
          text-align: center;
        }
        .preview-scene-links > a:hover > i {
          color: var(--color-light) !important;
        }
        .preview-scene-links > a > p {
          flex: 1;
          display: flex;
          align-items: center;
        }
        #format_page_preview_scene_model {
          padding-bottom: 0;
        }
        #format_page_preview_scene_model .format_target {
          margin-bottom: 6px;
        }
        #format_page_preview_scene_model div:nth-child(3), #format_page_preview_scene_model content {
          overflow-y: auto;
        }
      `)
      const stored = JSON.parse(localStorage.getItem("preview_scenes") ?? "[]")
      for (const scene of stored) {
        scenes.push(scene.id)
        new PreviewModel(scene.id, scene.model)
        if (scene.category) PreviewScene.menu_categories[scene.category] ??= { _label: titleCase(scene.category) }
        new PreviewScene(scene.id, {
          category: scene.category,
          name: scene.name,
          preview_models: [scene.id]
        })
      }
      codec = new Codec("preview_scene_codec", {
        name: "Preview Scene",
        extension: "bbscene",
        remember: true,
        load_filter: {
          type: "json",
          extensions: ["bbscene"]
        },
        async export() {
          var scope = this
          const compiled = scope.compile({raw: true})
          compiled.settings = {
            renderSide: Project.preview_scene_render_side,
            lightSide: Project.preview_scene_light_side,
            lightColour: Project.preview_scene_light_colour,
            tintColour: Project.preview_scene_tint_colour,
            shading: Project.preview_scene_shading
          }
          let [dialog, settings] = await configurePreviewSceneSettings(compiled, {
            export: true
          })
          settings = await settings
          Project.preview_scene_render_side = settings.renderSide
          Project.preview_scene_light_side = settings.lightSide
          Project.preview_scene_light_colour = settings.lightColour
          Project.preview_scene_tint_colour = settings.tintColour
          Project.preview_scene_shading = settings.shading
          dialog.close()
          Blockbench.export({
            resource_id: 'model',
            type: scope.name,
            extensions: [scope.extension],
            name: scope.fileName(),
            startpath: scope.startPath(),
            content: scope.compile({settings}),
            custom_writer: isApp ? (a, b) => scope.write(a, b) : null,
          }, path => scope.afterDownload(path))
        },
        compile(options) {
          options ??= {}
          const clear_elements = []
          const element_index_lut = []
          function computeCube(s) {
            if (s.export == false) return
            const element = {}
            element_index_lut[Cube.all.indexOf(s)] = clear_elements.length
            if (s.name !== "cube") element.name = s.name
            element.position = s.from.slice()
            let to = s.to.slice()
            if (s.inflate) for (let i = 0; i < 3; i++) {
              element.position[i] -= s.inflate
              to[i] += s.inflate
            }
            element.size = [to[0] - element.position[0], to[1] - element.position[1], to[2] - element.position[2]]
            if (!s.rotation.allEqual(0)) element.rotation = s.rotation
            if (!s.origin.allEqual(0)) element.origin = s.origin
            const e_faces = {}
            for (const face in s.faces) {
              if (s.faces.hasOwnProperty(face) && s.faces[face].texture !== null) {
                const tag = new oneLiner()
                if (s.faces[face].enabled !== false) {
                  tag.uv = s.faces[face].uv.slice();
                  tag.uv.forEach((n, i) => tag.uv[i] = n)
                }
                e_faces[face] = tag
              }
            }
            element.faces = e_faces
            if (Object.keys(element.faces).length) {
              clear_elements.push(element)
            }
          }
          function iterate(arr) {
            if (!arr || !arr.length) return
            for (let i = 0; i < arr.length; i ++) {
              if (arr[i].type === "cube") computeCube(arr[i])
              else if (arr[i].type === "group") iterate(arr[i].children)
            }
          }
          iterate(Outliner.root)
          function checkExport(key, condition) {
            key = options[key]
            if (key === undefined) {
              return condition;
            } else {
              return key
            }
          }
          const previewScene = {}
          if (checkExport("comment", Project.credit || settings.credit.value)) previewScene.credit = Project.credit || settings.credit.value
          if (options.settings) previewScene.settings = options.settings
          const texture = Texture.getDefault()
          if (texture) {
            const canvas = document.createElement("canvas")
            canvas.width = texture.width
            canvas.height = texture.height
            canvas.getContext("2d").drawImage(texture.img, 0, 0)
            previewScene.texture = canvas.toDataURL()
          }
          if (Project.texture_width !== 16 || Project.texture_height !== 16) previewScene.texture_size = [Project.texture_width, Project.texture_height]
          if (checkExport("elements", clear_elements.length >= 1)) previewScene.cubes = clear_elements
          if (checkExport("groups", (settings.export_groups.value && Group.all.length))) {
            groups = compileGroups(false, element_index_lut)
            let i = 0;
            while (i < groups.length) {
              if (typeof groups[i] === "object") i = Infinity
              i++
            }
            if (i === Infinity) previewScene.groups = groups
          }
          this.dispatchEvent("compile", {model: previewScene, options});
          if (options.raw) return previewScene
          else return autoStringify(previewScene)
        },
        async parse(model) {
          if (!model.cubes) return Blockbench.showMessageBox({
            translateKey: "invalid_model",
            icon: "error"
          })
          this.dispatchEvent("parse", {model})
          if (typeof model.credit === "string") Project.credit = model.credit
          if (Array.isArray(model.texture_size)) {
            Project.texture_width = model.texture_size[0]
            Project.texture_height = model.texture_size[1]
          }
          if (model.settings?.renderSide) Project.preview_scene_render_side = model.settings.renderSide
          if (model.settings?.lightSide) Project.preview_scene_light_side = model.settings.lightSide
          if (model.settings?.lightColour) Project.preview_scene_light_colour = model.settings.lightColour
          if (model.settings?.tintColour) Project.preview_scene_tint_colour = model.settings.tintColour
          if (model.settings?.shading) Project.preview_scene_shading = model.settings.shading
          if (model.texture) {
            const data = await getTexture(model.texture)
            if (data) new Texture({name: "texture.png"}).fromDataURL(data).add()
          }
          const cubes = []
          model.cubes.forEach(obj => {
            const cube = new Cube(obj)
            if (obj.name) cube.name = obj.name
            cube.from = obj.position
            cube.to = [obj.position[0] + obj.size[0], obj.position[1] + obj.size[1], obj.position[2] + obj.size[2]]
            for (var key in cube.faces) {
              if (obj.faces[key] === undefined) {
                cube.faces[key].texture = null
                cube.faces[key].uv = [0, 0, 0, 0]
              } else {
                cube.faces[key].uv.forEach((n, i) => {
                  cube.faces[key].uv[i] = obj.faces[key].uv[i]
                })
              }
            }
            Outliner.root.push(cube)
            cube.parent = "root"
            cube.init()
            cubes.push(cube);
          })
          if (model.groups && model.groups.length > 0) parseGroups(model.groups)
          updateSelection()
          this.dispatchEvent("parsed", {model})
        }
      })
      Language.data["format_category.blockbench"] ??= "Blockbench"
      format = new ModelFormat({
        id: "preview_scene_model",
        name: "Preview Scene",
        description: "Create a new Preview Scene model",
        extension: "bbscene",
        icon,
        category: "blockbench",
        single_texture: true,
        rotate_cubes: true,
        model_identifier: false,
        optional_box_uv: true,
        centered_grid: true,
        codec,
        format_page: {
          component: {
            template: `
              <div style="display:flex;flex-direction:column;height:100%">
                <p class="format_description">${description}</p>
                <p class="format_target"><b>Target</b> : <span>Blockbench</span></p>
                <content>
                  <h3 class="markdown">How to use:</h3>
                  <p class="markdown">
                    <ul>
                      <li><p>Press <strong>Create New Preview Scene</strong> and create a model.</p></li>
                      <li><p>To export to a file, go to <strong>File > Export > Export Preview Scene</strong>.</p></li>
                      <li><p>To install directly to Blockbench, go to <strong>File > Export > Install Preview Scene in Blockbench</strong>, and fill in the options.</p></li>
                    </ul>
                  </p>
                  <h3 class="markdown">Managing scenes:</h3>
                  <p>Management options can be found under <strong>View > Preview Scene Customiser</strong>.</p>
                  <p class="markdown">
                    <ul>
                      <li><p>To manage installed scenes, go to <strong>Manage Preview Scenes</strong>.</p></li>
                      <li><p>To import scene files, go to <strong>Import Preview Scene</strong>, select a scene file, and fill in the options.</p></li>
                      <li><p>To download pre-made scenes, go to <strong>Download Preview Scenes</strong>.</p></li>
                    </ul>
                  </p>
                </content>
                <div class="spacer"></div>
                <div class="preview-scene-links">${Object.values(links).map(e => `
                  <a href="${e.link}">
                    ${Blockbench.getIconNode(e.icon, e.colour).outerHTML}
                    <p>${e.text}</p>
                  </a>
                `).join("")}</div>
                <div class="button_bar">
                  <button id="create_new_model_button" style="margin-top:20px;margin-bottom:24px;" @click="Formats.preview_scene_model.new()">
                    <i class="material-icons">${icon}</i>
                    Create New Preview Scene
                  </button>
                </div>
              </div>
            `
          }
        },
        onActivation() {
          setTimeout(() => {
            ignoreChange = true
            PreviewScene.active?.unselect()
            ignoreChange = false
          }, 0)
        },
        onDeactivation: () => PreviewScene.scenes[activePreviewScene]?.select()
      })
      codec.format = format
      BarItems.preview_scene.condition = () => Project.format !== format
      exportAction = new Action({
        id: "export_preview_scene_model",
        name: "Export Preview Scene",
        icon,
        condition: {
          formats: [format.id]
        },
        click: () => codec.export()
      })
      MenuBar.addAction(exportAction, "file.export.0")
      exportAction2 = new Action({
        id: "install_preview_scene",
        name: "Install Preview Scene in Blockbench",
        icon: "add_to_photos",
        condition: {
          formats: [format.id]
        },
        click() {
          const model = JSON.parse(codec.compile())
          model.settings = {
            renderSide: Project.preview_scene_render_side,
            lightSide: Project.preview_scene_light_side,
            lightColour: Project.preview_scene_light_colour,
            tintColour: Project.preview_scene_tint_colour,
            shading: Project.preview_scene_shading
          }
          importPreviewScene(model, {dontEnable: true})
        }
      })
      MenuBar.addAction(exportAction2, "file.export.1")
      codec.export_action = exportAction
      manageAction = new Action({
        name,
        id,
        description: "Import and manage your Preview Scenes",
        icon,
        children: [
          new Action({
            id: "manage_preview_scene_models",
            name: "Manage Preview Scenes",
            icon: "photo_library",
            click: () => managePreviewScenes()
          }),
          new Action({
            id: "import_preview_scene_model",
            name: "Import Preview Scene",
            icon: "add_to_photos",
            async click() {
              try {
                Blockbench.import({
                  resource_id: "model",
                  extensions: ["bbscene"],
                  type: "Blockbench Preview Scene",
                }, files => {
                  if (files) importPreviewScene(JSON.parse(files[0].content))
                })
              } catch {
                Blockbench.showMessageBox({
                  translateKey: "invalid_model",
                  icon: "error"
                })
              }
            }
          }),
          new Action({
            id: "download_preview_scene_models",
            name: "Download Preview Scenes",
            icon: "file_download",
            async click() {
              const sceneData = await fetch("https://raw.githubusercontent.com/ewanhowell5195/previewSceneCustomiser/main/scenes.json").then(e => e.json()).catch(() => {})
              if (!sceneData) return new Dialog({
                id: "download_preview_scene_models_connection_failure_dialog",
                title: name,
                lines: ['<h2>Connection failed</h2><span>Please check your internet connection and make sure that you can access <a href="https://raw.githubusercontent.com/ewanhowell5195/previewSceneCustomiser/main/scenes.json">GitHub</a></span>'],
                buttons: ["Okay"]
              }).show()
              const dialog = new Dialog({
                id: "download_preview_scene_dialog",
                title: "Preview Scene Customiser Store",
                width: 780,
                buttons: [],
                sidebar: {
                  pages: Object.fromEntries(sceneData.map(e => [e.id, {
                    label: titleCase(e.id),
                    icon: e.icon
                  }])),
                  onPageSwitch(page) {
                    $("dialog#download_preview_scene_dialog #scene_categories > div").addClass("hidden")
                    $(`dialog#download_preview_scene_dialog #scene_category_${page}`).removeClass("hidden")
                  }
                },
                lines: [`
                  <style>
                    dialog#download_preview_scene_dialog .dialog_wrapper {
                      grid-template-rows: auto;
                    }
                    dialog#download_preview_scene_dialog .dialog_content {
                      margin: 10px 24px 24px;
                    }
                    dialog#download_preview_scene_dialog #button_row {
                      display: flex;
                      justify-content: end;
                      padding-top: 24px;
                      gap: 8px;
                    }
                    dialog#download_preview_scene_dialog .hidden {
                      display: none;
                    }
                    dialog#download_preview_scene_dialog h2 {
                      padding-bottom: 10px;
                    }
                    dialog#download_preview_scene_dialog #scene_categories {
                      height: 455px;
                    }
                    dialog#download_preview_scene_dialog .scenes_container {
                      display: flex;
                      flex-wrap: wrap;
                      gap: 8px;
                      max-height: 400px;
                      overflow-y: auto;
                    }
                    dialog#download_preview_scene_dialog .scene {
                      width: 256px;
                      height: 128px;
                      background-color: var(--color-back);
                      cursor: pointer;
                      position: relative;
                      display: flex;
                      justify-content: end;
                      align-items: center;
                      flex-direction: column;
                      border: 2px solid transparent;
                    }
                    dialog#download_preview_scene_dialog .scene:hover {
                      background-color: var(--color-button);
                    }
                    dialog#download_preview_scene_dialog .scene img {
                      position: absolute;
                      top: 8px;
                      left: 8px;
                    }
                    dialog#download_preview_scene_dialog .scene span {
                      z-index: 1;
                      font-size: 20px;
                      text-align: center;
                    }
                    dialog#download_preview_scene_dialog .scene_author {
                      position: absolute;
                      top: 8px;
                      left: 8px;
                      display: none;
                    }
                    dialog#download_preview_scene_dialog .scene:hover .scene_author {
                      display: inline;
                    }
                    dialog#download_preview_scene_dialog .scene_author:hover {
                      color: var(--color-light);
                    }
                    dialog#download_preview_scene_dialog .scene_author:hover::after {
                      content: attr(data-author);
                      font-family: var(--font-main);
                      position: absolute;
                      background-color: var(--color-dark);
                      padding: 4px;
                      margin-left: 4px;
                      font-size: 0.8em;
                    }
                    dialog#download_preview_scene_dialog .selected {
                      border-color: var(--color-accent);
                      background-color: var(--color-button);
                    }
                    dialog#download_preview_scene_dialog #download {
                      background-color: var(--color-selected);
                    }
                    dialog#download_preview_scene_dialog #download:hover {
                      background-color: var(--color-accent);
                    }
                    dialog#download_preview_scene_dialog .spacer {
                      flex: 1;
                      border-bottom: 2px solid var(--color-border);
                    }
                  </style>
                  <div id="scene_categories"></div>
                  <div id="button_row">
                    <button id="download">Download</button>
                    <button id="close">Close</button>
                  </div>
                `]
              }).show()
              const categories = $("dialog#download_preview_scene_dialog #scene_categories")
              let selected
              for (const category of sceneData) {
                categories.append(E("div").attr("id", `scene_category_${category.id}`).addClass("hidden").append(
                  E("h2").text(titleCase(category.id)),
                  E("div").addClass("scenes_container").append(...category.scenes.map(e => E("div").addClass("scene").attr("data-scene", e.id).append(
                    E("img").attr("src", `https://raw.githubusercontent.com/ewanhowell5195/previewSceneCustomiser/main/scenes/${e.id}/scene.webp`),
                    E("span").text(e.name ?? titleCase(e.id)),
                    E("i").addClass("scene_author material-icons").attr("data-author", `By ${e.author}`).text("person")
                  ).on("click", f => {
                    $("dialog#download_preview_scene_dialog #scene_categories .selected").removeClass("selected")
                    $(f.currentTarget).addClass("selected")
                    selected = e
                  })))
                ))
              }
              $(`dialog#download_preview_scene_dialog #scene_category_${sceneData[0].id}`).removeClass("hidden")
              $("dialog#download_preview_scene_dialog #close").on("click", e => dialog.close())
              $("dialog#download_preview_scene_dialog #download").on("click", async e => {
                if (!selected) return Blockbench.showQuickMessage("Please select a preview scene")
                const scene = await fetch(`https://raw.githubusercontent.com/ewanhowell5195/previewSceneCustomiser/main/scenes/${selected.id}/scene.bbscene`).then(e => e.json()).catch(() => {})
                if (!scene) return Blockbench.showQuickMessage("Unable to load preview scene")
                importPreviewScene(scene, {
                  name: selected.name ?? titleCase(selected.id),
                  category: titleCase($("dialog#download_preview_scene_dialog #scene_categories > :not(.hidden)")[0].id.slice(15)),
                  eula: selected.eula
                })
                dialog.close()
              })
              $("dialog#download_preview_scene_dialog .dialog_sidebar").append(
                E("div").addClass("spacer"),
                E("a").attr("href", links.github.link).css({
                  display: "flex",
                  gap: "10px",
                  "align-items": "center",
                  "justify-content": "center",
                  margin: "24px",
                  cursor: "pointer",
                  "text-decoration": "none"
                }).append(
                  E("i").addClass("icon fab fa-github").css("font-size", "22px"),
                  E("span").text("Submit your own").css("text-decoration", "underline")
                )
              )
            }
          })
        ]
      })
      MenuBar.addAction(manageAction, "view.11")
      const currentScene = localStorage.getItem("preview_scene")
      if (currentScene) setTimeout(() => {
        if (Project.format?.id !== format.id) PreviewScene.scenes[currentScene]?.select()
        else activePreviewScene = currentScene
      }, 0)
      properties = [
        new Property(ModelProject, "number", "preview_scene_render_side", {
          exposed: false,
          default: 2,
          condition: () => Format === format
        }),
        new Property(ModelProject, "number", "preview_scene_light_side", {
          exposed: false,
          default: 0,
          condition: () => Format === format
        }),
        new Property(ModelProject, "string", "preview_scene_light_colour", {
          exposed: false,
          default: "#ffffff",
          condition: () => Format === format
        }),
        new Property(ModelProject, "string", "preview_scene_tint_colour", {
          exposed: false,
          default: "#ffffff",
          condition: () => Format === format
        }),
        new Property(ModelProject, "boolean", "preview_scene_shading", {
          exposed: false,
          default: true,
          condition: () => Format === format
        })
      ]
      Blockbench.on("select_preview_scene", setCurrentPreviewScene)
      Blockbench.on("unselect_preview_scene", removeCurrentPreviewScene)
    },
    onuninstall() {
      localStorage.removeItem("preview_scene")
      localStorage.removeItem("preview_scenes")
    },
    onunload() {
      Blockbench.removeListener("select_preview_scene", setCurrentPreviewScene)
      Blockbench.removeListener("unselect_preview_scene", removeCurrentPreviewScene)
      format.delete()
      codec.delete()
      manageAction.children.forEach(e => e.delete())
      manageAction.delete()
      exportAction.delete()
      exportAction2.delete()
      PreviewScene.active?.unselect()
      for (const scene of scenes) PreviewScene.scenes[scene].delete()
      styles.delete()
      properties.forEach(e => e.delete())
    }
  })
  async function configurePreviewSceneSettings(model, args) {
    if (!model.texture) return Blockbench.showMessageBox({
      title: "Unable to configure preview scene settings",
      message: "This preview scene is missing a texture. Please add a texture to it before trying to configure its settings.",
      icon: "warning"
    })
    let texture = await new Promise(fulfill => new THREE.TextureLoader().load(model.texture, fulfill, null, fulfill))
    const form = {
      name: {
        label: "Preview Scene Name",
        type: "input",
        placeholder: "Example Name",
        value: args?.name
      },
      category: {
        label: "Preview Scene Category",
        type: "input",
        placeholder: "Minecraft",
        value: args?.category
      },
      renderSide: {
        label: "Render Side",
        type: "select",
        options: {
          0: "Front Side",
          1: "Back Side",
          2: "Double Side"
        },
        value: model.settings?.renderSide ?? 2
      },
      lightSide: {
        label: "Light side",
        type: "select",
        options: {
          0: "Up",
          1: "North",
          2: "East",
          3: "Down",
          4: "South",
          5: "West"
        },
        value: model.settings?.lightSide ?? 0
      },
      lightColour: {
        label: "Light colour",
        type: "color",
        value: model.settings?.lightColour ?? "#ffffff"
      },
      tintColour: {
        label: "Tint colour",
        type: "color",
        value: model.settings?.tintColour ?? "#ffffff"
      },
      shading: {
        label: "Shading",
        type: "checkbox",
        value: model.settings?.shading ?? true
      }
    }
    if (args?.export) {
      delete form.name
      delete form.category
    }
    const dialog = new Dialog({
      id: "preview_scene_settings_dialog",
      title: "Preview Scene Settings",
      buttons: [],
      part_order: ["form", "lines"],
      form,
      lines: [`
        <style>
          dialog#preview_scene_settings_dialog #button_row {
            display: flex;
            justify-content: end;
            padding-top: 13px;
            gap: 8px;
          }
          dialog#preview_scene_settings_dialog #import {
            background-color: var(--color-selected);
          }
          dialog#preview_scene_settings_dialog #import:hover {
            background-color: var(--color-accent);
          }
          dialog#preview_scene_settings_dialog img {
            height: 128px;
            cursor: pointer;
          }
          dialog#preview_scene_settings_dialog #img_container {
            display: flex;
            gap: 5px;
            flex-direction: column;
            margin: 5px;
          }
          dialog#preview_scene_settings_dialog #save {
            cursor: pointer;
          }
          dialog#preview_scene_settings_dialog #save:hover {
            color: var(--color-light)
          }
          dialog#preview_scene_settings_dialog #preview_scene_texture {
            transition: box-shadow .1s
          }
          dialog#preview_scene_settings_dialog #preview_scene_texture:hover {
            box-shadow: 0 0 10px #00000080;
          }
        </style>
        <div class="dialog_bar form_bar form_bar_name">
          <label class="name_space_left" for="name">Texture:</label>
          <img id="preview_scene_texture" src="${model.texture}" title="Replace texture" />
          <div id="img_container">
            <div>${texture.image.width} ⨉ ${texture.image.height}</div>
            <i id="save" class="material-icons" title="Save texture">save</i>
          </div>
        </div>
        <div id="button_row">
          <button id="import">${args?.export ? "Export" : "Import"}</button>
          <button id="cancel">Cancel</button>
        </div>
      `]
    }).show()
    $("dialog#preview_scene_settings_dialog #preview_scene_texture").on("click", async e => {
      let newTexture
      try {
        if (isApp) {
          const file = electron.dialog.showOpenDialogSync({
            filters: [
              {
                name: "PNG Texture",
                extensions: ["png"]
              }
            ]
          })
          if (!file) return
          newTexture = await new Promise(fulfill => new THREE.TextureLoader().load(file[0], fulfill, null, fulfill))
        } else {
          const input = document.createElement("input")
          let file
          input.type = "file"
          input.accept = ".png"
          await new Promise(fulfil => {
            input.onchange = () => {
              file = Array.from(input.files)
              fulfil()
            }
            input.click()
          })
          const data = await new Promise(fulfil => {
            const fr = new FileReader()
            fr.onload = () => fulfil(fr.result)
            fr.readAsDataURL(file[0])
          })
          newTexture = await new Promise(fulfill => new THREE.TextureLoader().load(data, fulfill, null, fulfill))
        }
      } catch {
        return Blockbench.showQuickMessage("Unable to load texture")
      }
      if (texture.image.width !== newTexture.image.width || texture.image.height !== newTexture.image.height) return Blockbench.showQuickMessage(`Selected texture does not match required dimentions of ${texture.image.width} ⨉ ${texture.image.height}`, 2000)
      texture = newTexture
      const canvas = document.createElement("canvas")
      canvas.width = texture.image.width
      canvas.height = texture.image.height
      canvas.getContext("2d").drawImage(texture.image, 0, 0)
      const data = canvas.toDataURL()
      $("dialog#preview_scene_settings_dialog #preview_scene_texture").attr("src", data)
      model.texture = data
    })
    $("dialog#preview_scene_settings_dialog #save").on("click", e => Blockbench.export({
      type: "PNG Texture",
      extensions: ["png"],
      name: args?.name,
      content: model.texture,
      savetype: "image"
    }))
    $("dialog#preview_scene_settings_dialog #cancel").on("click", e => dialog.close())
    return [dialog, new Promise(fulfil => {
      $("dialog#preview_scene_settings_dialog #import").on("click", e => {
        fulfil({
          renderSide: parseInt(dialog.form.renderSide.bar.find("bb-select").attr("value")),
          lightSide: parseInt(dialog.form.lightSide.bar.find("bb-select").attr("value")),
          lightColour: dialog.form.lightColour.colorpicker.value.toHexString(),
          tintColour: dialog.form.tintColour.colorpicker.value.toHexString(),
          shading: dialog.form.shading.bar.find("input").is(":checked")
        })
      })
    })]
  }
  async function importPreviewScene(model, args) {
    let [dialog, settings] = await configurePreviewSceneSettings(model, args)
    $("dialog#preview_scene_settings_dialog #import").on("click", async e => {
      settings = await settings
      const name = dialog.form.name.bar.find("input").val().trim()
      const category = dialog.form.category.bar.find("input").val().trim().replace(/\s/g, "_")
      if (!name) return Blockbench.showQuickMessage("Invalid name")
      const id = name.toLowerCase().replace(/\s/g, "_")
      if (PreviewScene.scenes[id]?.id) return Blockbench.showQuickMessage("Preview Scene already exists, please pick a different name", 2000) 
      model.color = settings.tintColour
      model.shading = settings.shading
      model.render_side = settings.renderSide
      scenes.push(id)
      new PreviewModel(id, model)
      const lightColour = tinycolor(settings.lightColour).toRgb()
      PreviewScene.menu_categories[category] ??= { _label: titleCase(category) }
      const scene = new PreviewScene(id, {
        category,
        name,
        preview_models: [id],
        light_color: {
          r: lightColour.r / 255,
          g: lightColour.g / 255,
          b: lightColour.b / 255
        },
        light_side: settings.lightSide,
        require_minecraft_eula: args.eula
      })
      if (!args?.dontEnable) PreviewScene.scenes[id].select()
      const stored = JSON.parse(localStorage.getItem("preview_scenes") ?? "[]")
      stored.push({
        id,
        category,
        name,
        model: model
      })
      localStorage.setItem("preview_scenes", JSON.stringify(stored))
      dialog.close()
    })
  }
  async function managePreviewScenes() {
    const dialog = new Dialog({
      title: "Manage Preview Scenes",
      id: "manage_preview_scenes_dialog",
      lines: [`
        <style>
          dialog#manage_preview_scenes_dialog .dialog_content {
            margin-top: 10px;
          }
          dialog#manage_preview_scenes_dialog #button_row {
            display: flex;
            justify-content: end;
            padding-top: 8px;
          }
          dialog#manage_preview_scenes_dialog .hidden {
            display: none;
          }
          dialog#manage_preview_scenes_dialog .row {
            display: flex;
            padding: 2px 4px 2px 1em;
            align-items: center;
          }
          dialog#manage_preview_scenes_dialog .row .spacer {
            height: 2px;
            background-color: var(--color-button);
            margin: 0 10px
          }
          dialog#manage_preview_scenes_dialog #preview_scenes > div {
            padding-bottom: 16px;
          }
          dialog#manage_preview_scenes_dialog .spacer {
            flex: 1;
          }
          dialog#manage_preview_scenes_dialog .dialog_content i {
            cursor: pointer;
            margin-left: 5px;
          }
          dialog#manage_preview_scenes_dialog i:hover {
            color: var(--color-light);
          }
          dialog#manage_preview_scenes_dialog .dialog_wrapper {
            position: relative;
          }
          dialog#manage_preview_scenes_dialog #delete_warning {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          dialog#manage_preview_scenes_dialog #delete_warning_darken {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: var(--color-dark);
            opacity: 0.8;
          }
          dialog#manage_preview_scenes_dialog #delete_warning_container {
            z-index: 1;
            display: flex;
            gap: 24px;
            flex-direction: column;
            align-items: center;
            filter: drop-shadow(0 0 10px var(--color-dark))
          }
          dialog#manage_preview_scenes_dialog #delete_warning_container h2 {
            text-align: center;
          }
          dialog#manage_preview_scenes_dialog #delete_warning_buttons {
            display: flex;
            gap: 24px;
          }
          dialog#manage_preview_scenes_dialog .danger-button:hover {
            background-color: var(--color-close);
            color: var(--color-text)!important;
          }
        </style>
        <div>
          <div id="preview_scenes">
            <h2 id="builtin_label" class="hidden">Built-in Preview Scenes</h2>
            <div id="builtin_preview_scenes" class="hidden"></div>
            <h2 id="custom_label" class="hidden">Custom Preview Scenes</h2>
            <div id="custom_preview_scenes" class="hidden"></div>
          </div>
          <div id="button_row">
            <button id="close">Close</button>
          </div>
        </div>
      `],
      buttons: []
    }).show()
    $("dialog#manage_preview_scenes_dialog #close").on("click", e => dialog.cancel())
    const builtinScenes = Object.entries(PreviewScene.scenes).filter(e => !scenes.includes(e[0]))
    if (builtinScenes.length) {
      $("dialog#manage_preview_scenes_dialog #builtin_label").removeClass("hidden")
      const builtin = $("dialog#manage_preview_scenes_dialog #builtin_preview_scenes").removeClass("hidden")
      for (const scene of builtinScenes) {
        builtin.append(E("div").addClass("row").append(
          E("div").text(scene[1].name),
          E("span").addClass("spacer"),
          E("i").addClass("material-icons icon").text("edit").attr("title", "Edit preview scene").on("click", e => {
            editPreviewScene(scene[1])
            dialog.close()
          }),
          E("i").addClass("material-icons icon").text("save").attr("title", "Save preview scene").on("click", e => savePreviewScene(scene[1]))
        ))
      }
    }
    const customScenes = Object.entries(PreviewScene.scenes).filter(e => scenes.includes(e[0]))
    if (customScenes.length) {
      $("dialog#manage_preview_scenes_dialog #custom_label").removeClass("hidden")
      const custom = $("dialog#manage_preview_scenes_dialog #custom_preview_scenes").removeClass("hidden")
      for (const scene of customScenes) {
        custom.append(E("div").addClass("row").append(
          E("span").text(scene[1].name),
          E("span").addClass("spacer"),
          E("i").addClass("material-icons icon").text("edit").attr("title", "Edit preview scene").on("click", e => {
            editPreviewScene(scene[1])
            dialog.close()
          }),
          E("i").addClass("material-icons icon").text("save").attr("title", "Save preview scene").on("click", e => savePreviewScene(scene[1])),
          E("i").addClass("material-icons icon").text("delete").attr("title", "Delete preview scene").on("click", e => {
            $("dialog#manage_preview_scenes_dialog .dialog_wrapper").append(
              E("div").attr("id", "delete_warning").append(
                E("div").attr("id", "delete_warning_darken"),
                E("div").attr("id", "delete_warning_container").append(
                  E("h2").html(`Are you sure you want to delete<br><strong>${scene[1].name}</strong>?`),
                  E("div").attr("id", "delete_warning_buttons").append(
                    E("button").text("Cancel").on("click", e => $("dialog#manage_preview_scenes_dialog #delete_warning").remove()),
                    E("button").addClass("danger-button").text("Delete").on("click", e => {
                      PreviewScene.active?.unselect()
                      PreviewScene.scenes[scene[1].id].delete()
                      scenes.splice(scenes.indexOf(scene[1].id), 1)
                      const stored = JSON.parse(localStorage.getItem("preview_scenes"))
                      stored.splice(stored.findIndex(e => e.id === scene[1].id), 1)
                      localStorage.setItem("preview_scenes", JSON.stringify(stored))
                      managePreviewScenes()
                      dialog.close()
                    })
                  )
                )
              )
            )
          })
        ))
      }
    }
  }
  function getModel(model) {
    const data = {}
    if (model.texture) data.texture = model.texture
    if (!model.texture_size.allEqual(16)) data.texture_size = model.texture_size
    data.cubes = model.cubes
    return data
  }
  function getTexture(texture) {
    if (texture.startsWith("data:image/png;base64,")) return texture
    return new Promise(async fulfil => {
      const reader = new FileReader()
      reader.onload = e => fulfil(e.target.result)
      reader.readAsDataURL(new Blob([await fetch(texture).then(e => e.arrayBuffer())], { type: "image/png" }))
    }).catch(() => {})
  }
  function editPreviewScene(scene) {
    const model = getModel(scene.preview_models[0])
    codec.parse(model)
    Project.name = scene.id
    Project.preview_scene_render_side = scene.preview_models[0].render_side
    Project.preview_scene_light_side = scene.light_side
    Project.preview_scene_light_colour = tinycolor.fromRatio(scene.light_color).toHexString()
    Project.preview_scene_tint_colour = scene.preview_models[0].color
    Project.preview_scene_shading = scene.preview_models[0].shading
    Blockbench.setStatusBarText(scene.name)
  }
  async function savePreviewScene(scene) {
    for (const model of scene.preview_models) {
      const out = getModel(model)
      out.settings = {
        renderSide: scene.preview_models[0].render_side,
        lightSide: scene.light_side,
        lightColour: tinycolor.fromRatio(scene.light_color).toHexString(),
        tintColour: scene.preview_models[0].color,
        shading: scene.preview_models[0].shading
      }
      out.texture = await getTexture(out.texture)
      Blockbench.export({
        type: "Blockbench Preview Scene",
        extensions: ["bbscene"],
        name: scene.id,
        content: autoStringify(out),
        savetype: "bbscene"
      })
    }
  }
  function titleCase(str) {
    return str.replace(/_|-/g, " ").replace(/\w\S*/g, str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
  }
})()