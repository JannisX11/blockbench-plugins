(() => {
  const path = require("node:path")

  let fs, codec, format, action, properties, styles, oldGUILightCondition

  const id = "free_rotation"
  const name = "Free Rotation"
  const icon = "3d_rotation"
  const description = "Create Java Item models without any rotation limitations."

  const links = {
    websiteGodlander: {
      text: "By Godlander",
      link: "https://github.com/Godlander",
      icon: "fab.fa-github",
      colour: "#6E40C9"
    },
    discordGodlander: {
      text: "Godlander's Discord",
      link: "https://discord.gg/2s6th9SvZd",
      icon: "fab.fa-discord",
      colour: "#727FFF"
    },
    websiteEwan: {
      text: "By Ewan Howell",
      link: "https://ewanhowell.com/",
      icon: "language",
      colour: "#33E38E"
    },
    discordEwan: {
      text: "Ewan's Discord",
      link: "https://discord.ewanhowell.com/",
      icon: "fab.fa-discord",
      colour: "#727FFF"
    }
  }

  let directory
  if (SystemInfo.platform === "win32") {
    directory = PathModule.join(SystemInfo.appdata_directory, ".minecraft")
  } else if (SystemInfo.platform === "darwin") {
    directory = PathModule.join(SystemInfo.home_directory, "Library", "Application Support", "minecraft")
  } else {
    directory = PathModule.join(SystemInfo.home_directory, ".minecraft")
  }

  Plugin.register(id, {
    title: name,
    icon: "icon.png",
    author: "Godlander & Ewan Howell",
    description,
    tags: ["Minecraft: Java Edition", "Items", "Rotation"],
    version: "1.2.1",
    min_version: "5.0.0",
    variant: "desktop",
    await_loading: true,
    website: "https://ewanhowell.com/plugins/free-rotation/",
    repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/free_rotation",
    bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues/new?title=[Free Rotation]",
    creation_date: "2024-12-20",
    has_changelog: true,
    onload() {
      fs = require("fs", {
        message: "This permission is required for exporting your free rotation models.",
        optional: false
      })

      if (!fs) {
        throw new Error("fs access denied")
      }

      styles = Blockbench.addCSS(`
        #format_page_free_rotation {
          padding-bottom: 0;
        }
        #format_page_free_rotation .format_target {
          margin-bottom: 6px;
        }
        #format_page_free_rotation div:nth-child(3),
        #format_page_free_rotation content {
          overflow-y: auto;
        }
        .format_entry[format="free_rotation"] i {
          overflow: visible;
        }
        .free-rotation-links {
          display: flex;
          justify-content: space-around;
          margin: 20px 35px 0;
        }
        .free-rotation-links * {
          cursor: pointer;
        }
        .free-rotation-links > a {
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
        .free-rotation-links > a:hover {
          background-color: var(--color-accent);
          color: var(--color-light);
        }
        .free-rotation-links > a > i {
          font-size: 32px;
          width: 100%;
          max-width: initial;
          height: 32px;
          text-align: center;
        }
        .free-rotation-links > a:hover > i {
          color: var(--color-light) !important;
        }
        .free-rotation-links > a > p {
          flex: 1;
          display: flex;
          align-items: center;
        }
      `)

      codec = new Codec("free_rotation_codec", {
        name: "Free Rotation Codec",
        remember: true,
        export() {
          const project = Project
          for (const texture of Texture.all) {
            if (!texture.saved) texture.save()
          }
          const dialog = new Dialog({
            id: "free_rotation_export_prompt",
            title: "Free Rotation Export",
            buttons: [],
            lines: [`<style>
              #free_rotation_export_prompt h2 {
                margin-bottom: 8px;
              }
              #free_rotation_export_prompt .button-row {
                display: flex;
                justify-content: flex-end;
                width: 100%;
                margin-top: 16px;
              }
              #free_rotation_export_prompt button:disabled {
                cursor: not-allowed;
                opacity: 0.5;
                background-color: var(--color-button);
                color: var(--color-text) !important;
              }
              #free_rotation_export_prompt .dialog_content {
                margin: 0;
                padding: 16px;
              }
              .free-rotation-export-error {
                color: var(--color-error);
                font-weight: 600;
              }
              .free-rotation-export-error code {
                background-color: var(--color-back);
                border: 1px solid var(--color-border);
                padding: 0 2px;
              }
              #free_rotation_display_exports {
                display: flex;
                gap: 8px;
              }
              #free_rotation_display_exports > * {
                cursor: pointer;
              }
            </style>`],
            component: {
              data: {
                ModelProject,
                project,
                exportAllowed: false,
                idError: "",
                nameError: "",
                displayIcons: {
                  thirdperson_lefthand: { icon: "accessibility" },
                  thirdperson_righthand: { icon: "accessibility" },
                  firstperson_lefthand: { icon: "person" },
                  firstperson_righthand: { icon: "person" },
                  head: { icon: "sentiment_satisfied" },
                  ground: { icon: "icon-ground", iconType: "custom" },
                  fixed: { icon: "filter_frames" },
                  gui: { name: "GUI", icon: "border_style" }
                }
              },
              methods: {
                check() {
                  if (project.free_rotation_namespace.match(/[^a-z0-9\._-]/)) {
                    this.namespaceError = "The Namespace can only include the following characters:<br><code>a-z</code>, <code>0-9</code>, <code>_</code>, <code>-</code>, <code>.</code>"
                  } else {
                    this.namespaceError = ""
                  }
                  if (!project.free_rotation_item) {
                    this.idError = "The Item ID is required"
                  } else if (project.free_rotation_item.match(/[^a-z0-9\._-]/)) {
                    this.idError = "The Item ID can only include the following characters:<br><code>a-z</code>, <code>0-9</code>, <code>_</code>, <code>-</code>, <code>.</code>"
                  } else {
                    this.idError = ""
                  }
                  if (!project.free_rotation_name) {
                    this.nameError = "The Model Name is required"
                  } else if (project.free_rotation_name.match(/[^a-z0-9\._-]/)) {
                    this.nameError = "The Model Name can only include the following characters:<br><code>a-z</code>, <code>0-9</code>, <code>_</code>, <code>-</code>, <code>.</code>"
                  } else {
                    this.nameError = ""
                  }
                  if (this.namespaceError || this.idError || this.nameError) {
                    this.exportAllowed = false
                    return
                  }
                  this.exportAllowed = true
                },
                async exportModel() {
                  dialog.close()

                  const dir = Blockbench.pickDirectory({
                    title: "Select resource pack to export to",
                    startpath: project.free_rotation_path
                  })
                  if (!dir) return

                  const namespace = Project.free_rotation_namespace || "minecraft"

                  const definitionDir = path.join(dir, "assets", namespace, "items")
                  const definitionFile = path.join(definitionDir, project.free_rotation_item + ".json")
                  const modelDir = path.join(dir, "assets", namespace, "models", project.free_rotation_name)

                  if (fs.existsSync(definitionFile)) {
                    const check = await new Promise(fulfil => {
                      Blockbench.showMessageBox({
                        title: "Item definition already exists",
                        message: `The item definition <code>assets/${namespace}/items/${project.free_rotation_item}.json</code> already exists. Are you sure you want to continue and overwrite it?`,
                        buttons: ["dialog.confirm", "dialog.cancel"]
                      }, button => {
                        if (button === 0) fulfil(true)
                        else fulfil()
                      })
                    })
                    if (!check) return
                  }

                  if (fs.existsSync(modelDir)) {
                    const check = await new Promise(fulfil => {
                      Blockbench.showMessageBox({
                        title: "Model already exists",
                        message: `The the model folder <code>assets/${namespace}/models/${project.free_rotation_name}</code> already exists. Are you sure you want to continue and possibly overwrite files inside it?`,
                        buttons: ["dialog.confirm", "dialog.cancel"]
                      }, button => {
                        if (button === 0) fulfil(true)
                        else fulfil()
                      })
                    })
                    if (!check) return
                  }

                  const processing = new Dialog("exporting", {
                    title: "Exporting...",
                    lines: [
                      `<style>
                        #exporting .dialog_close_button {
                          display: none;
                        }
                        #exporting h1 {
                          margin: 0;
                        }
                      </style>`,
                      "<h1>Exporting...</h1>"
                    ],
                    buttons: [],
                    cancel_on_click_outside: false,
                    onConfirm: () => false
                  }).show()
                  const close = processing.close
                  processing.close = () => {}

                  fs.mkdirSync(definitionDir, { recursive: true })
                  fs.mkdirSync(modelDir, { recursive: true })

                  const models = await codec.compile(project)

                  const definition = {
                    model: {
                      type: "composite",
                      models: new Array(models.length).fill().map((e, i) => ({
                        type: "model",
                        model: `${namespace}:${project.free_rotation_name}/${i}`
                      }))
                    }
                  }

                  fs.writeFileSync(definitionFile, autoStringify(definition))
                  for (const [i, model] of models.entries()) {
                    fs.writeFileSync(path.join(modelDir, `${i}.json`), model)
                  }

                  Blockbench.showQuickMessage("Exported free rotation model")
                  close.bind(processing)()
                }
              },
              template: `
                <div>
                  <h2>Model Details</h2>
                  <div class="dialog_bar bar form_bar form_bar_item" :title="ModelProject.properties.free_rotation_namespace.description">
                    <label class="name_space_left" for="item">Namespace:</label>
                    <input type="text" class="dark_bordered half focusable_input" id="item" placeholder="minecraft" v-model="project.free_rotation_namespace" @input="check">
                    <i class="fa fa-question dialog_form_description" @click="Blockbench.showQuickMessage(ModelProject.properties.free_rotation_namespace.description)"></i>
                  </div>
                  <div class="dialog_bar bar form_bar form_bar_item" :title="ModelProject.properties.free_rotation_item.description">
                    <label class="name_space_left" for="item">Item ID:</label>
                    <input type="text" class="dark_bordered half focusable_input" id="item" placeholder="diamond_sword" v-model="project.free_rotation_item" @input="check">
                    <i class="fa fa-question dialog_form_description" @click="Blockbench.showQuickMessage(ModelProject.properties.free_rotation_item.description)"></i>
                  </div>
                  <div v-if="idError" class="free-rotation-export-error" v-html="idError"></div>
                  <div class="dialog_bar bar form_bar form_bar_name" :title="ModelProject.properties.free_rotation_name.description">
                    <label class="name_space_left" for="name">Model Name:</label>
                    <input type="text" class="dark_bordered half focusable_input" id="name" placeholder="diamond_katana" v-model="project.free_rotation_name" @input="check">
                    <i class="fa fa-question dialog_form_description" @click="Blockbench.showQuickMessage(ModelProject.properties.free_rotation_name.description)"></i>
                  </div>
                  <div v-if="nameError" class="free-rotation-export-error" v-html="nameError"></div>
                  <h2 style="margin-top: 32px;">Display Settings to Export</h2>
                  <p style="margin: -8px 0 16px;">Free Rotation models can be quite large in file size. Select only the display settings you need in order to reduce this file size.</p>
                  <div id="free_rotation_display_exports">
                    <div v-for="(value, key) in project.free_rotation_display" class="tool" :class="{ enabled: value }" @click="project.free_rotation_display[key] = !value">
                      <div class="tooltip">{{ displayIcons[key]?.name || key.replace(/_/g, " ").split(" ").map(e => e.slice(0, 1).toUpperCase() + e.slice(1)).join(" ") }}</div>
                      <i v-if="displayIcons[key]?.iconType === 'custom'" :class="displayIcons[key].icon"></i>
                      <i v-else class="material-icons icon">{{ displayIcons[key]?.icon || 'desktop_windows' }}</i>
                    </div>
                  </div>
                  <div class="button-row">
                    <button @click="exportModel" :disabled="!exportAllowed">Export</button>
                  </div>
                </div>
              `
            },
            onOpen() {
              if (project.free_rotation_item || project.free_rotation_name) {
                this.content_vue.check()
              }
            }
          }).show()
        },
        async compile(project) {
          project ??= Project

          project.select()

          const mode = Modes.selected
          Modes.options.edit.select()

          let maxcoord = 24

          const cubes = Cube.all.filter(e => e.export)

          for (const cube of cubes) {
            for (const position of cube.getGlobalVertexPositions()) {
              for (const coord of position) {
                maxcoord = Math.max(maxcoord, Math.abs(coord - 8))
              }
            }
          }
          const downscale = Math.min(4, maxcoord / 24)

          const models = []
          for (const cube of cubes) {
            const element = {}
            const model = {
              textures: {},
              elements: [element],
              display: {}
            }
            if (project.front_gui_light) model.gui_light = "front"
            let size = [
              (cube.to[0] - cube.from[0]) / downscale,
              (cube.to[1] - cube.from[1]) / downscale,
              (cube.to[2] - cube.from[2]) / downscale
            ]
            element.from = [
              8 - (size[0] / 2),
              8 - (size[1] / 2),
              8 - (size[2] / 2)
            ]
            element.to = [
              8 + (size[0] / 2),
              8 + (size[1] / 2),
              8 + (size[2] / 2)
            ]
            element.light_emission = cube.light_emission
            element.faces = {}
            for (const [face, data] of Object.entries(cube.faces)) {
              if (!data || !data.texture) continue
              const renderedFace = {}
              if (data.enabled) {
                renderedFace.uv = data.uv
                  .slice()
                  .map((v, i) => (v * 16) / UVEditor.getResolution(i % 2))
              }
              if (data.rotation) renderedFace.rotation = data.rotation
              if (data.texture) {
                const texture = project.textures.find(e => e.uuid == data.texture)
                if (!texture) {
                  console.error("Texture not found... skipping")
                } else {
                  renderedFace.texture = "#" + texture.id
                  const path = texture.source.replaceAll(/\\/g, "/")
                  const parts = path.split("/")
                  const assetsIndex = parts.indexOf("assets")
                  if (assetsIndex === -1) model.textures[texture.id] = "unknown"
                  else {
                    const namespace = parts[assetsIndex + 1]
                    const resourcePath = parts.slice(assetsIndex + 3, -1).join("/")
                    model.textures[texture.id] = namespace + ":" + resourcePath + "/" + texture.name.slice(0, -4)
                  }
                }
              }
              if (data.tint >= 0) renderedFace.tintindex = data.tint
              element.faces[face] = renderedFace
            }

            const quat = new THREE.Quaternion()
            cube.mesh.getWorldQuaternion(quat)
            const rotation = new THREE.Quaternion()

            for (const slot of DisplayMode.slots) {
              if (project.free_rotation_display[slot]) {
                const scale = new THREE.Vector3(downscale, downscale, downscale)
                const translation = cube.getWorldCenter()
                translation.y -= 8

                const display = project.display_settings[slot]
                if (display) {
                  const dscale = new THREE.Vector3().fromArray(display.scale)
                  const dtranslation = new THREE.Vector3().fromArray(display.translation)
                  const drotation = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler().fromArray([
                      Math.degToRad(display.rotation[0]),
                      Math.degToRad(display.rotation[1]),
                      Math.degToRad(display.rotation[2])
                    ], "XYZ")
                  )
                  scale.multiply(dscale)
                  rotation.multiplyQuaternions(drotation, quat)
                  translation.multiply(dscale)
                  translation.applyQuaternion(drotation)
                  translation.add(dtranslation)
                } else {
                  rotation.copy(quat)
                }

                model.display[slot] = {
                  rotation: (new THREE.Euler()).setFromQuaternion(rotation, "XYZ").toArray().slice(0,3).map(e => Math.radToDeg(e)),
                  translation: translation.toArray(),
                  scale: scale.toArray()
                }
              }
            }

            models.push(autoStringify(model))
          }

          mode.select()
          return models
        }
      })

      format = new ModelFormat({
        id: "free_rotation",
        name: "Free Rotation Item",
        extension: "json",
        icon: "3d_rotation",
        category: "minecraft",
        format_page: {
          component: {
            methods: {
              create: () => format.new()
            },
            template: `
              <div class="ewan-format-page" style="display:flex;flex-direction:column;height:100%">
                <p class="format_description">${description}</p>
                <p class="format_target"><b>Target</b> : <span>Minecraft: Java Edition</span></p>
                <content>
                  <h3 class="markdown">About:</h3>
                  <p class="markdown">
                    <ul>
                      <li>This format is designed to create <strong>Minecraft: Java Edition</strong> item models without the rotation limitations imposed by the game.</li>
                      <li>These models cannot be re-imported, so make sure to save your project as a <strong>bbmodel</strong>.</li>
                      <li>This format requires <strong>Minecraft 1.21.4</strong> or later.</li>
                    </ul>
                  </p>
                  <h3 class="markdown">Usage:</h3>
                  <p class="markdown">
                    <ul>
                      <li>Create a new model, or convert an existing cube based project into this format.</li>
                      <li>Configure the display settings. These will be respected as long as the size limits are not reached.</li>
                      <li>Use <strong>File > Export > Free Rotation Item</strong> to export your model into your resource pack.</li>
                      <li>When exporting, select which display slots you would like to export. The more you export, the larger the file size, so only export what you need.</li>
                    </ul>
                  </p>
                </content>
                <div class="spacer"></div>
                <div class="free-rotation-links">${Object.values(links).map(e => `
                  <a href="${e.link}">
                    ${Blockbench.getIconNode(e.icon, e.colour).outerHTML}
                    <p>${e.text}</p>
                  </a>
                `).join("")}</div>
                <div class="button_bar">
                  <button id="create_new_model_button" style="margin-top:20px;margin-bottom:24px;" @click="create">
                    <i class="material-icons icon">${icon}</i>
                    Create New Free Rotation Item
                  </button>
                </div>
              </div>
            `
          }
        },
        render_sides: "front",
        model_identifier: false,
        parent_model_id: true,
        vertex_color_ambient_occlusion: true,
        bone_rig: true,
        rotate_cubes: true,
        optional_box_uv: true,
        uv_rotation: true,
        java_cube_shading_properties: true,
        java_face_properties: true,
        cullfaces: true,
        animated_textures: true,
        select_texture_for_particles: true,
        texture_mcmeta: true,
        display_mode: true,
        texture_folder: true,
        codec
      })
      codec.format = format

      action = new Action("free_rotation_export", {
        name: "Export Free Rotation Item",
        icon: "3d_rotation",
        condition: { formats: [format.id] },
        click: () => codec.export()
      })
      MenuBar.addAction(action, "file.export.0")

      properties = [
        new Property(ModelProject, "string", "free_rotation_namespace", {
          label: "Namespace",
          description: "The namespace the model will be exported to",
          default: "minecraft",
          condition: { formats: [format.id] }
        }),
        new Property(ModelProject, "string", "free_rotation_item", {
          label: "Item ID",
          description: "The item ID of the item that the model should apply to",
          condition: { formats: [format.id] }
        }),
        new Property(ModelProject, "string", "free_rotation_name", {
          label: "Model Name",
          description: "The name of the model file that is output",
          condition: { formats: [format.id] }
        }),
        new Property(ModelProject, "string", "free_rotation_path", {
          label: "Export Path",
          default: directory,
          condition: { formats: [format.id] },
          exposed: false
        }),
        new Property(ModelProject, "object", "free_rotation_display", {
          default: {
            thirdperson_lefthand: true,
            thirdperson_righthand: true,
            firstperson_lefthand: true,
            firstperson_righthand: true,
            head: true,
            ground: true,
            fixed: true,
            gui: true
          },
          label: "Display Settings",
          condition: { formats: [format.id] },
          exposed: false
        })
      ]
      oldGUILightCondition = BarItems.gui_light.condition
      BarItems.gui_light.condition = () => Format.id === id || oldGUILightCondition()
    },
    onunload() {
      if (oldGUILightCondition) {
        BarItems.gui_light.condition = oldGUILightCondition
        codec.delete()
        format.delete()
        action.delete()
        styles.delete()
        properties.forEach(e => e.delete())
      }
    }
  })
})()