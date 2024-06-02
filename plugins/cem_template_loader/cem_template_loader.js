(() => {
  let plugin
  const connection = {
    roots: [
      `https://wynem.com/assets`,
      `https://raw.githubusercontent.com/ewanhowell5195/wynem/main/src/assets`,
      `https://cdn.jsdelivr.net/gh/ewanhowell5195/wynem/src/assets`
    ],
    rootIndex: 0
  }
  let root = connection.roots[0]
  const id = "cem_template_loader"
  const name = "CEM Template Loader"
  const icon = "keyboard_capslock"
  const description = "Load template Java Edition entity models for use with OptiFine CEM."
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
    tutorial: {
      text: "CEM Modelling Tutorial",
      link: "https://youtu.be/arj2eim42KI",
      icon: "fab.fa-youtube",
      colour: "#FF4444"
    }
  }

  function loadPlugin() {
    plugin = Plugin.register(id, {
      title: name,
      icon: "icon.png",
      author: "Ewan Howell",
      description: description + " Also includes an animation editor, so that you can create custom entity animations.",
      tags: ["Minecraft: Java Edition", "OptiFine", "Templates"],
      version: "8.0.1",
      min_version: "4.10.0",
      variant: "both",
      creation_date: "2020-02-02",
      has_changelog: true,
      website: "https://ewanhowell.com/plugins/cem-template-loader/",
      repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/cem_template_loader",
      bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues/new?title=[CEM Template Loader]",
      onload() {
        loadCEMTemplateLoader()
        loadOptiFineEntityRestrictions()
        loadOptiFineAnimationEditor()
      },
      onunload() {
        unloadCEMTemplateLoader()
        unloadOptiFineEntityRestrictions()
        unloadOptiFineAnimationEditor()
      }
    })
  }

  async function fetchData(path, fallback) {
    try {
      const r = await fetch(`${root}/${path}`)
      if (r.status !== 200 || r.headers.get("Content-Type")?.startsWith("text/html")) throw new Error
      if (r.headers.get("Content-Type")?.startsWith("text/plain") || r.headers.get("Content-Type")?.startsWith("application/json")) return r.json()
      return r
    } catch {
      for (let x = connection.rootIndex + 1; x < connection.roots.length; x++) {
        connection.rootIndex = x
        try {
          const r = await fetch(`${connection.roots[x]}/${path}`)
          if (r.status !== 200) throw new Error
          root = connection.roots[x]
          if (r.headers.get("Content-Type")?.startsWith("text/plain") || r.headers.get("Content-Type")?.startsWith("application/json")) return r.json()
          return r
        } catch {}
      }
      connection.failed = true
      return fallback ? fallback() : {}
    }
  }

  // CEM TEMPLATE LOADER

  let styles, loader, loaderDialog, modelData, loadingPromise

  const loaderData = {
    connection: null,
    loading: true,
    categories: {},
    category: null,
    loadTexture: true,
    entity: null,
    search: "",
    entities: [],
    built: false
  }

  async function loadCEMTemplateLoader() {
    styles = Blockbench.addCSS(`
      .spacer {
        flex: 1;
      }
      .cem-template-loader-links {
        display: flex;
        justify-content: space-around;
        margin: 20px 40px 0;
      }
      .cem-template-loader-links > a {
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
      .cem-template-loader-links > a:hover {
        background-color: var(--color-accent);
        color: var(--color-light);
      }
      .cem-template-loader-links > a > i {
        font-size: 32px;
        width: 100%;
        max-width: initial;
        height: 32px;
        text-align: center;
      }
      .cem-template-loader-links > a:hover > i {
        color: var(--color-light) !important;
      }
      .cem-template-loader-links > a > p {
        flex: 1;
        display: flex;
        align-items: center;
      }
      #format_page_cem_template_loader {
        padding-bottom: 0;
      }
      #format_page_cem_template_loader .format_target {
        margin-bottom: 6px;
      }
      #format_page_cem_template_loader div:nth-child(3), #format_page_cem_template_loader content {
        overflow-y: auto;
      }
      #cem-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .cem-overlay {
        position: absolute;
        inset: 0;
        z-index: 2;
        background-color: var(--color-ui);
        display: flex;
        flex-direction: column;
        padding: 40px;
        text-align: center;
        gap: 16px;
        overflow-y: auto;

        > * {
          max-width: 512px;
          margin: 0 auto !important;
        }

        > :first-child {
          margin-top: auto !important;
        }

        > :last-child {
          margin-bottom: auto !important;
        }
      }
    `)
    loader = new ModelLoader(id, {
      name,
      description,
      icon,
      onStart: () => openLoader,
      format_page: {
        component: {
          methods: {
            openLoader
          },
          template: `
            <div class="ewan-format-page" style="display:flex;flex-direction:column;height:100%">
              <p class="format_description">${description}</p>
              <p class="format_target"><b>Target</b> : <span>Minecraft: Java Edition with OptiFine</span> <span>Texturing Templates</span></p>
              <content>
                <h3 class="markdown">How to use:</h3>
                <p class="markdown">
                  <ul>
                    <li><p>Press <strong>Load CEM Template</strong> and select a model.</p></li>
                    <li><p>Select your load settings, load the model, then edit the model.</p></li>
                    <li><p>Export your model as an <strong>OptiFine JEM</strong> to <code>assets/minecraft/optifine/cem</code>, using the provided name.</p></li>
                  </ul>
                </p>
                <h3 class="markdown">Do:</h3>
                <p class="markdown">
                  <ul>
                    <li><p>Edit any of the cubes that were loaded with the template, add your own cubes, and create your own subgroups.</p></li>
                  </ul>
                </p>
                <h3 class="markdown">Do not:</h3>
                <p class="markdown">
                  <ul>
                    <li><p>Edit any of the groups that were loaded with the template, add your own root groups, or remove any built in animations.</p></li>
                  </ul>
                </p>
              </content>
              <div class="spacer"></div>
              <div class="cem-template-loader-links">${Object.values(links).map(e => `
                <a href="${e.link}">
                  ${Blockbench.getIconNode(e.icon, e.colour).outerHTML}
                  <p>${e.text}</p>
                </a>
              `).join("")}</div>
              <div class="button_bar">
                <button id="create_new_model_button" style="margin-top:20px;margin-bottom:24px;" @click="openLoader()">
                  <i class="material-icons">${icon}</i>
                  Load CEM Template
                </button>
              </div>
            </div>
          `
        }
      }
    })
    loaderDialog = new Dialog({
      id,
      title: name,
      width: 980,
      buttons: [],
      sidebar: {
        pages: {},
        onPageSwitch(page) {
          loaderDialog.content_vue.category = page
          loaderDialog.content_vue.$refs.entry.focus()
        }
      },
      lines: [`<style>
        #cem_template_loader > .dialog_wrapper {
          grid-template-rows: auto 0px;
          grid-template-columns: 160px auto;
          overflow: hidden;
          height: 512px;
          display: grid;
          position: relative;
        }
        #cem_template_loader > .dialog_wrapper:not(.has_sidebar) {
          grid-template-columns: auto;
        }
        #cem_template_loader .dialog_sidebar_pages {
          margin-bottom: 66px;
          overflow-y: auto;
        }
        #cem_template_loader .dialog_sidebar_pages::-webkit-scrollbar-track, .cem-models::-webkit-scrollbar-track {
          background-color: var(--color-back);
        }
        #cem_template_loader .dialog_content {
          margin: 0;
          max-height: initial;
        }
        #cem_template_loader h1 {
          margin: 0;
        }
        #cem_template_loader .hidden {
          display: none !important;
        }
        #cem-report-issues {
          position: absolute;
          width: 160px;
          left: 0;
          bottom: 0;
          padding: 12px 0;
          border-top: 2px solid var(--color-border);
          z-index: 1;
          display: none;
        }
        #cem-report-issues * {
          cursor: pointer
        }
        .has_sidebar #cem-report-issues {
          display: initial;
        }
        #cem-report-issues > a {
          display: flex;
          text-decoration: none;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        #cem-report-issues > a > div {
          text-decoration: underline;
        }
        #cem-footer {
          display: flex;
          padding: 8px;
          gap: 10px;
          flex-wrap: wrap;
        }
        #load-texture {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        #load-texture * {
          cursor: pointer;
        }
        #cem-buttons {
          display: flex;
          flex: 1;
          justify-content: end;
          gap: 4px;
        }
        #cem-buttons > :disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        #cem-buttons > :first-child:not(:disabled) {
          background-color: var(--color-accent);
        }
        #cem-header {
          padding: 0 8px 8px 16px;
        }
        #cem-details {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        #cem-search {
          position: relative;
          min-width: min(100%, 256px);
          display: flex;
          justify-content: end;
          margin-left: auto;
        }
        #cem-search > input {
          width: min(100%, 256px);
        }
        #cem-search > i {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        #cem-description {
          min-width: min(100%, 256px);
          flex: 1 1 0px;
        }
        .cem-models {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          overflow-y: auto;
          padding: 0 8px 0 16px;
          margin-right: 8px;
        }
        .cem-models > div {
          min-width: 128px;
          border: 2px solid transparent;
          flex: 1;
          background-color: var(--color-back);
          cursor: pointer;
          padding: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cem-models > :hover {
          background-color: var(--color-button);
        }
        .cem-models > .selected {
          border: 2px solid var(--color-accent);
          background-color: var(--color-selected);
        }
        .cem-models > div > img {
          height: 66px;
          width: 100%;
          object-fit: contain;
          pointer-events: none;
        }
        .cem-models > div > :nth-child(2) {
          text-align: center;
          flex: 1;
          display: flex;
          align-items: center;
          max-height: 24px;
          min-height: 24px;
          line-height: 16px;
          margin: -2px 0 2px;
          text-transform: capitalize;
        }
        .cem-spacer {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        }
      </style>`],
      component: {
        data: loaderData,
        methods: {
          async load() {
            this.loading = true
            await loadModel(this.entity, this.loadTexture)
            loaderDialog.close()
          },
          reload() {
            window.cemTemplateLoaderReloaded = true
            plugin.reload()
          },
          close: () => loaderDialog.close()
        },
        template: `
          <div id="cem-container">
            <div v-if="loading" class="cem-overlay">
              <h1>Loading...</h1>
            </div>
            <div v-if="connection?.failed" class="cem-overlay">
              <h1>Connection Failed</h1>
              <p>Failed to load CEM Template data.</p>
              <p>Please make sure you are connected to the internet, and can access this <a href="${root}/json/cem_template_models.json">cem_template_models.json</a> file.</p>
              <p>If you are unable to access the cem_template_models.json file, it may be blocked by your computer or your internet service provider. If it is not your computer blocking it, you may be able to use a VPN to bypass the block. One good example is <a href="https://1.1.1.1/">Cloudflare WARP</a>, which is a free program that commonly resolves this issue.</p>
              <button @click="reload">Retry connection</button>
            </div>
            <div id="cem-header">
              <h1>{{ category }}</h1>
              <div id="cem-details">
                <div id="cem-description">{{ categories[category]?.description }}</div>
                <div id="cem-search">
                  <input type="text" placeholder="Search…" class="dark_bordered" v-model="search" ref="entry" @input="search = search.toLowerCase()">
                  <i class="material-icons">search</i>
                </div>
              </div>
            </div>
            <div v-if="connection" v-for="[name, c] of Object.entries(categories)" class="cem-models" :class="{ hidden: category !== name }">
              <div v-for="model of c.entities" :class="{ selected: entity === model.name, hidden: !model.name.includes(search) }" @click="entity = model.name">
                <img :src="connection.roots[connection.rootIndex] + '/images/minecraft/renders/' + model.name + '.webp'" loading="lazy">
                <div>{{ model.display_name ?? model.name.replace(/_/g, " ") }}</div>
              </div>
            </div>
            <div class="cem-spacer">
              <h3 v-if="!entities.filter(e => e[0] === category && e[1].includes(search)).length">No results</h3>
            </div>
            <div id="cem-footer">
              <label id="load-texture">
                <input type="checkbox" :checked="loadTexture" v-model="loadTexture">
                <div>Load vanilla texture</div>
              </label>
              <div id="cem-buttons">
                <button :disabled="!entity" @click="load">Load</button>
                <button @click="close">Cancel</button>
              </div>
            </div>
            <div id="cem-report-issues">
              <a href="https://github.com/ewanhowell5195/cemTemplateModels/issues">
                <i class="material-icons">bug_report</i>
                <div>Report issues</div>
              </a>
            </div>
          </div>
        `
      },
      async onBuild() {
        loaderData.connection = connection
        await loadCEMTemplateModels()
        this.sidebar.build()
        if (!modelData.categories) {
          return this.content_vue.$forceUpdate()
        }
        const categories = modelData.categories.map(e => [e.name, e])
        loaderData.categories = Object.fromEntries(categories)
        loaderData.entities = categories.flatMap(c => c[1].entities.map(e => [c[0], e.name]))
        loaderData.loading = false
        loaderData.built = true
      },
      onOpen() {
        this.content_vue.$refs.entry.focus()
        if (loaderData.built) {
          loaderData.loading = false
          this.content_vue.$forceUpdate()
        }
      }
    })
    MenuBar.addAction(new Action(id, {
      name,
      description,
      children: [
        new Action("cem_template_loader_placeholder", {
          name: `All Entities`,
          description: "All entities",
          icon: "icon-player",
          click: () => openLoader()
        })
      ],
      icon
    }), "tools")
    const script = document.createElement("script")
    script.innerHTML = `
      if (!window.cemTemplateModelsLoaded) {
        loadCEMTemplateModels()
      }
    `
    BarItems.cem_template_loader.menu_node.append(script)
    if (window.cemTemplateLoaderReloaded) {
      delete window.cemTemplateLoaderReloaded
      openLoader()
    } else if (Blockbench.isWeb) {
      const params = (new URL(location.href)).searchParams
      if (params.get("plugins")?.split(",").includes(id) && params.get("model") !== "") {
        if (!await MinecraftEULA.promptUser(id)) return
        await loadCEMTemplateModels()
        loadModel(params.get("model"), params.has("texture"))
      }
    }
  }

  function unloadCEMTemplateLoader() {
    styles.delete()
    loader.delete()
    loaderDialog.close()
    for (const child of BarItems.cem_template_loader.children) {
      child.delete?.()
    }
    BarItems.cem_template_loader.delete()
    delete window.loadCEMTemplateModels
    delete window.cemTemplateModelsLoaded
  }

  window.loadCEMTemplateModels = async () => {
    if (window.cemTemplateModelsLoaded) return loadingPromise
    loadingPromise = fetchData("json/cem_template_models.json")
    modelData = await loadingPromise
    window.cemTemplateModelsLoaded = true
    if (!modelData.categories) return
    loaderDialog.sidebar.page = modelData.categories[0].name
    loaderData.category = modelData.categories[0].name
    for (const category of modelData.categories) {
      for (let i = 0; i < category.entities.length; i++) {
        if (typeof category.entities[i] === "string") {
          category.entities[i] = { name: category.entities[i] }
        }
      }
    }
    modelData.entities = []
    for (const category of modelData.categories) {
      loaderDialog.sidebar.pages[category.name] = {
        label: category.name,
        icon: category.icon
      }
      modelData.entities.push(...category.entities)
    }
    BarItems.cem_template_loader_placeholder.delete()
    BarItems.cem_template_loader.children = modelData.categories.map(e => new Action(`cem_template_loader_${e.name.replace(/ /g, "_")}`, {
      plugin: id,
      name: `${e.name} Entities`,
      description: e.description,
      icon: e.icon,
      click: () => openLoader(e.name)
    }))
    BarItems.cem_template_loader.children.push("_", {
      name: `v${modelData.version}`,
      id: "cem_template_loader_version",
      icon: "info",
      click: () => openLoader()
    })
    if (MenuBar.menus.tools.label.classList.contains("opened")) {
      MenuBar.menus.tools.show()
    }
  }

  async function openLoader(category) {
    if (!await MinecraftEULA.promptUser(id)) return
    if (category) {
      loaderData.category = category
      loaderDialog.sidebar.page = category
      if (loaderDialog.content_vue) loaderDialog.sidebar.build()
    }
    loaderDialog.show()
  }

  const getBase64FromBlob = blob => new Promise(async fulfil => {
    const reader = new FileReader()
    reader.onloadend = () => fulfil(reader.result)
    reader.readAsDataURL(blob)
  })

  async function loadModel(entity, loadTexture) {
    const data = modelData.entities.find(e => e.name === entity)
    if (!data) return Blockbench.showQuickMessage("Unknown CEM template model", 2000)
    const model = modelData.models[data.model ?? data.name]
    newProject(Formats.optifine_entity)
    Formats.optifine_entity.codec.parse(JSON.parse(model.model), "")
    let textureLoaded
    if (loadTexture) {
      try {
        const textures = Array.isArray(data.texture_name) ? data.texture_name : [data.texture_name ?? data.name]
        for (const [i, name] of textures.entries()) {
          const texture = await fetchData(`images/minecraft/entities/${entity}${i || ""}.png`, () => null)
          if (!texture) throw Error
          const tex = new Texture({ name }).fromDataURL(await getBase64FromBlob(await texture.blob())).add()
          if (!i && textures.length === 1) {
            tex.use_as_default =  true
          }
        }
        textureLoaded = true
      } catch {
        Blockbench.showQuickMessage("Unable to load vanilla texture", 2000)
        loaderDialog.content_vue?.$forceUpdate()
      }
    }
    if (!textureLoaded) {
      const textureData = Array.isArray(model.texture_data) ? model.texture_data : [model.texture_data]
      const textures = Array.isArray(data.texture_name) && Array.isArray(model.texture_data) ? data.texture_name : [data.texture_name ?? data.name]
      for (const [i, name] of textures.entries()) {
        let tex
        if (textureData[i]) {
          tex = new Texture({ name }).fromDataURL("data:image/png;base64," + textureData[i]).add()
        } else {
          tex = TextureGenerator.addBitmap({
            name,
            color: new tinycolor("#00000000"),
            type: "template",
            rearrange_uv: false,
            resolution: "16"
          })
        }
        if (!i && textures.length === 1) {
          tex.use_as_default =  true
        }
      }
    }
  }

  // OPTIFINE ENTITY RESTRICTIONS

  let editCheck, jemRestrictionsDialog, originalJEMFormat, restrictionStyles

  function loadOptiFineEntityRestrictions() {
    restrictionStyles = Blockbench.addCSS(`
      #format_page_optifine_entity h3.markdown {
        margin-bottom: -10px;
      }
    `)
    new Setting("jem_restrictions", {
      value: false,
      category: "edit",
      name: "Remove OptiFine Entity Restrictions",
      description: "Remove the root group restrictions on the OptiFine Entity format. WARNING: You can easily break models with restrictions removed."
    })
    new Setting("dialog_jem_restrictions", {
      value: true,
      category: "dialogs",
      name: "OptiFine Entity Restrictions Dialog",
      description: 'Show the "OptiFine Entity Restrictions" dialog'
    })
    jemRestrictionsDialog = new Dialog({
      id: "jem_restrictions_dialog",
      title: "Unsupported Edit",
      buttons: [],
      lines: [`<style>
        #jem_restrictions_dialog label {
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 5px;
        }
        #jem_restrictions_dialog label * {
          cursor: pointer;
        }
        #cem-buttons {
          display: flex;
          justify-content: space-between;
        }
        #jem_restrictions_dialog button:not(:hover) {
          background-color: var(--color-selected);
        }
      </style>`],
      component: {
        data: {
          message: "",
          removeRestrictions: false,
          dontShowAgain: false
        },
        methods: {
          finish() {
            if (this.removeRestrictions) {
              settings.jem_restrictions.set(true)
            }
            if (this.dontShowAgain) {
              settings.dialog_jem_restrictions.set(false)
            }
            jemRestrictionsDialog.close()
          }
        },
        template: `
          <div>
            <h2 style="margin-bottom: 10px;">{{ message }}</h2>
            <p>The OptiFine Entity format has limitations for the top level groups.<br>You cannot:</p>
            <p class="markdown">
              <ul>
                <li>Add new root groups</li>
                <li>Remove root groups</li>
                <li>Rename root groups</li>
                <li>Move root groups</li>
                <li>Rotate root groups</li>
                <li>Move root group pivots</li>
                <li>Have cubes or attachment points at root level</li>
              </ul>
            </p>
            <p>Doing any of the above can, and will, create broken/invalid models.</p>
            <p>All elements added to OptiFine Entities must be placed within one of the existing groups. If you need to rotate something, create a subgroup and rotate that instead.</p>
            <br>
            <label>
              <input type="checkbox" :checked="removeRestrictions" v-model="removeRestrictions">
              <div>Remove OptiFine Entity Restrictions</div>
            </label>
            <p><strong>WARNING:</strong> It is highly recommended to leave restrictions enabled. This setting can be changed later in settings.</p>
            <br>
            <div id="jem-restrictions-footer">
            <div id="cem-buttons">
              <label>
                <input type="checkbox" :checked="dontShowAgain" v-model="dontShowAgain">
                <div>Don't Show Again</div>
              </label>
              <button @click="finish">OK</button>
            </div>
          </div>
        `
      }
    })
    editCheck = () => {
      if (Format.id === "optifine_entity") {
        if (!settings.jem_restrictions.value) {
          const entry = Undo.history[Undo.history.length-1]
          const check = editCheckProcess(entry)
          if (check) {
            if (settings.dialog_jem_restrictions.value) {
              jemRestrictionsDialog.show()
              jemRestrictionsDialog.content_vue.message = check
            } else {
              Blockbench.showQuickMessage(check, 1200)
            }
            Undo.loadSave(entry.before, entry.post)
            Undo.history.pop()
            Undo.index = Undo.history.length
          }
        }
      }
    }
    Blockbench.on("finished_edit", editCheck)
    originalJEMFormat = {
      new: Formats.optifine_entity.new,
      format_page: Formats.optifine_entity.format_page,
      convertTo: Formats.optifine_entity.convertTo
    }
    Formats.optifine_entity.new = () => {
      if (settings.jem_restrictions.value) originalJEMFormat.new.bind(Formats.optifine_entity)()
      else openLoader()
    }
    Formats.optifine_entity.format_page = JSON.parse(JSON.stringify(Formats.optifine_entity.format_page))
    Formats.optifine_entity.format_page.content.push({ type: "h3", text: "CEM Template Loader" }, { text: "Creating an OptiFine entity will open CEM Template Loader. It is extremely rare to need a blank OptiFine entity model. You can disable this behavour with **File > Preferences > Settings > Edit > Remove OptiFine Entity Restrictions**, however, this is not recommended." })
    Formats.optifine_entity.convertTo = () => {
      originalJEMFormat.convertTo.bind(Formats.optifine_entity)()
      if (!settings.jem_restrictions.value) {
        Blockbench.showMessageBox({
          title: "Conversion Warning",
          message: "Models converted into OptiFine entities are not valid entity models. If you are converting a model into an OptiFine entity to use it in game, expect it to be broken. Instead load a new template entity model, and copy your elements across into that.",
          buttons: ["Load Template", "Continue"],
          icon: "warning"
        }, button => {
          if (button === 0) openLoader()
        })
      }
    }
  }

  function unloadOptiFineEntityRestrictions() {
    restrictionStyles.delete()
    Blockbench.removeListener("finished_edit", editCheck)
    jemRestrictionsDialog.close()
    Formats.optifine_entity.new = originalJEMFormat.new
    Formats.optifine_entity.format_page = originalJEMFormat.format_page
    Formats.optifine_entity.convertTo = originalJEMFormat.convertTo
  }

  function editCheckProcess(entry) {
    if (entry.before.outliner) {
      for (const group of entry.before.outliner) {
        const postGroup = entry.post.outliner.find(e => e.uuid === group.uuid)
        if (!postGroup) return "You cannot remove root cubes/groups!"
        if (!group.origin.reduce((a, e, x) => a && e === postGroup.origin[x], true)) {
          return "You cannot move root groups!"
        } else if (group.name !== postGroup.name) {
          return "You cannot rename root groups!"
        }
      }
    }
    if (entry.post.outliner) {
      for (const group of entry.post.outliner) {
        const beforeGroup = entry.before.outliner.find(e => e.uuid === group.uuid)
        if (!beforeGroup) return "You cannot add new root cubes/groups!"
      }
    }
    if (entry.before.group && entry.post.group && Outliner.root.find(node => node instanceof Group && node.uuid == entry.before.group.uuid)) {
      if (!entry.before.group.rotation.reduce((a, e, x) => a && e === entry.post.group.rotation[x], true)) {
        return "You cannot rotate root groups!"
      } else if (!entry.before.group.origin.reduce((a, e, x) => a && e === entry.post.group.origin[x], true)) {
        return "You cannot move root group pivots!"
      }
    }
  }

  // OPTIFINE ANIMATION EDITOR

  let animationStyles, groupObserver, animationEditorPanel, animationControlPanel, context, boolMap, rangeMap, specialMap, stopAnimations, updateSelection, docShown, documentation, editorKeybinds, tabChange
  const E = s => $(document.createElement(s))
  let frameCount
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
    random: seed => {
      if (!seed) return Math.random()
      seed = constants.frac(seed * 123.34)
      seed += seed * (seed + 45.32)
      return constants.frac(seed * seed)
    },
    round: Math.round,
    signum: Math.sign,
    sqrt: x => {
      if (x >= 0) return Math.sqrt(x)
      return 0
    },
    fmod: (x, y) => ((x % y) + y) % y,
    if: (...args) => {
      if (args.length < 3 || args.length % 2 !== 1 || typeof args[0] !== "boolean") throw Error
      for (let i = 0; i < args.length; i += 2) {
        if (i === args.length - 1) {
          if (typeof args[i] === "boolean") throw Error("If statements cannot return a <strong>boolean</strong>")
          return args[i]
        }
        else if (args[i]) {
          if (typeof args[i+1] === "boolean") throw Error("If statements cannot return a <strong>boolean</strong>")
          return args[i+1]
        }
      }
    },
    between: (x, min, max) => x >= min && x <= max,
    equals: (x, y, epsilon) => Math.abs(x - y) <= epsilon,
    in: (x, ...vals) => vals.includes(x),
    print: (id, int, val) => {
      if (val === undefined) throw Error("Not enough arguments. <strong>print</strong> requires <strong>3</strong> arguments")
      if ((settings.ignore_unkown_optifine_animations.value && !(typeof val === "number" || typeof val === "function")) || (!settings.ignore_unkown_optifine_animations.value && typeof val !== "number")) throw Error("<strong>print</strong> can only print numbers, use <strong>printb</strong> instead")
      if (frameCount % int === 0) console.log(`CEM print(${id}) = ${Number(val)}`)
      return val
    },
    printb: (id, int, val) => {
      if (val === undefined) throw Error("Not enough arguments. <strong>printb</strong> requires <strong>3</strong> arguments")
      if (typeof val !== "boolean") throw Error("<strong>printb</strong> can only print booleans, use <strong>print</strong> instead")
      if (frameCount % int === 0) console.log(`CEM print(${id}) = ${val}`)
      return val
    },
    smooth: (id, val) => {
      return val ?? id
    },
    lerp: (a, b, c) => b * (1 - a) + c * a,
    frame_time: 0
  }
  const rangesObj = {
    pos_x: [-128, 0, 128, 0.1],
    pos_y: [-64, 64, 320, 0.1],
    pos_z: [-128, 0, 128, 0.1],
    rot_x: [0, 0, 2 * Math.PI, 0.01],
    rot_y: [0, 0, 2 * Math.PI, 0.01],
    player_pos_x: [-128, 0, 128, 0.1],
    player_pos_y: [-64, 64, 320, 0.1],
    player_pos_z: [-128, 0, 128, 0.1],
    player_rot_x: [0, 0, 2 * Math.PI, 0.01],
    player_rot_y: [0, 0, 2 * Math.PI, 0.01],
    health: [0, 20, 20],
    max_health: [1, 20, 500],
    limb_speed: [0, 0, 1, 0.01],
    head_yaw: [-90, 0, 90],
    head_pitch: [-90, 0, 90],
    dimension: [-1, 0, 1],
    rule_index: [0, 0, 256]
  }
  const specialsObj = {
    limb_swing: [0, false],
    hurt_time: [10, false],
    death_time: [0, false],
    swing_progress: [0, false]
  }
  const boolList = new Set([
    "is_aggressive",
    "is_alive",
    "is_burning",
    "is_child",
    "is_glowing",
    "is_hurt",
    "is_in_hand",
    "is_in_item_frame",
    "is_in_ground",
    "is_in_gui",
    "is_in_lava",
    "is_in_water",
    "is_invisible",
    "is_on_ground",
    "is_on_head",
    "is_on_shoulder",
    "is_ridden",
    "is_riding",
    "is_sitting",
    "is_sneaking",
    "is_sprinting",
    "is_tamed",
    "is_wet"
  ])
  const enabledBooleans = new Set([
    "is_alive", "is_on_ground"
  ])
  const boneVars = ["tx", "ty", "tz", "rx", "ry", "rz", "sx", "sy", "sz", "visible", "visible_boxes"]
  const renderVars = ["shadow_size", "shadow_opacity", "shadow_offset_x", "shadow_offset_z", "leash_offset_x", "leash_offset_y", "leash_offset_z"]
  const vars = [
    "pi",
    "true",
    "false",
    "time",
    "limb_swing",
    "limb_speed",
    "age",
    "head_pitch",
    "head_yaw",
    "player_pos_x",
    "player_pos_y",
    "player_pos_z",
    "player_rot_x",
    "player_rot_y",
    "frame_time",
    "dimension",
    "rule_index",
    "health",
    "hurt_time",
    "death_time",
    "anger_time",
    "max_health",
    "pos_x",
    "pos_y",
    "pos_z",
    "rot_x",
    "rot_y",
    "swing_progress",
    "id",
    "sin()",
    "cos()",
    "asin()",
    "acos()",
    "tan()",
    "atan()",
    "atan2()",
    "torad()",
    "todeg()",
    "min()",
    "max()",
    "clamp()",
    "abs()",
    "floor()",
    "ceil()",
    "exp()",
    "frac()",
    "log()",
    "pow()",
    "random()",
    "round()",
    "signum()",
    "sqrt()",
    "fmod()",
    "lerp()",
    "if()",
    "print()",
    "printb()",
    "between()",
    "equals()",
    "in()",
    ...boolList
  ]
  const varLabels = {
    "sin()": "sin(x)",
    "cos()": "cos(x)",
    "asin()": "asin(x)",
    "acos()": "acos(x)",
    "tan()": "tan(x)",
    "atan()": "atan(x)",
    "atan2()": "atan2(y, x)",
    "torad()": "torad(deg)",
    "todeg()": "todeg(rad)",
    "min()": "min(x, y, …)",
    "max()": "max(x, y, …)",
    "clamp()": "clamp(x, min, max)",
    "abs()": "abs(x)",
    "floor()": "floor(x)",
    "ceil()": "ceil(x)",
    "exp()": "exp(x)",
    "frac()": "frac(x)",
    "log()": "log(x)",
    "pow()": "pow(x, y)",
    "random()": "random(seed)",
    "round()": "round(x)",
    "signum()": "signum(x)",
    "sqrt()": "sqrt(x)",
    "fmod()": "fmod(x, y)",
    "lerp()": "lerp(t, x, y)",
    "if()": "if(c, v, [c2, v2, …,] v_else)",
    "print()": "print(id, n, x)",
    "printb()": "printb(id, n, x)",
    "between()": "between(x, min, max)",
    "equals()": "equals(x, y, epsilon)",
    "in()": "in(x, val1, val2, …)"
  }
  globalThis.optifineAnimationVariables = {
    constants,
    ranges: rangesObj,
    booleans: boolList,
    enabledBooleans: enabledBooleans,
    autocomplete: vars,
    autocompleteLabels: varLabels
  }
  let bools = new Map()
  let ranges = new Map()
  let specials = new Map()
  const parseCEMA = js => {
    try {
      return Function(`"use strict";return (function(ctx) {
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
  const reInnerGroups = /(?<!\w)\([^(),]*\)/g
  const reInnerFuncArgs = /(?<=\w\()[^()]*(?=\))/g
  function preprocessCEMA(anim) {
    if (typeof anim === "number") return anim
    if (typeof anim !== "string") throw ["Expression must be a string/number"]
    anim = anim.trim()
    if (anim.length === 0) return ""
    const boolsMatch = anim.matchAll(/(?<=[\s\n(!&|=,]|^)is_[a-z_]+(?=[\s\n)!&|=,]|$)/g)
    for (const bool of boolsMatch) {
      if (!boolList.has(bool[0])) {
        if (settings.ignore_unkown_optifine_animations.value) {
          boolMap.set(bool[0], false)
        } else {
          if (!boolList.has(bool[0])) throw [`Unknown boolean: "<span style="font-weight:600">${bool[0]}</span>" is not a supported boolean`]
        }
      } else {
        boolMap.set(bool[0], bools.get(bool[0]) ?? enabledBooleans.has(bool[0]) ? true : false)
      }
    }
    const check = anim.match(/[^a-z0-9_,\+\-\*\/%!&\|>=<\(\)\[\]:\.\s]/gi)
    if (check) throw [`Unsupported character "<span style="font-weight:600">${check[0]}</span>" in animation "<span style="font-weight:600">${anim.replace(/</g, "&lt;")}</span>"`]
    const check2 = anim.match(/[\)\]]\s*\(|=>|(?<!\b(?:varb|visible)?)\.(?![trs][xyz]\b|\d+)[a-z]+|[^a-z0-9_]\[|(?!==)(?<=[^=!><]|^)=|<<=|>>>=|>>=|[!=]==|\+\+|--|\.\.\.|(?<![$\u200c\u200d\p{ID_Continue}])\d+n|[$\u200c\u200d\p{ID_Continue}]+\.[$\u200c\u200d\p{ID_Continue}]+[\.\(]|(?<!&)&(?!&)|(?<!\|)\|(?!\|)|<<|>>>?|\*\*/ui)
    if (check2) throw [`Invalid syntax "<span style="font-weight:600">${check2[0].replace(/</g, "&lt;")}</span>" in animation "<span style="font-weight:600">${anim.replace(/</g, "&lt;")}</span>"`]
    if (anim.match(/\(/g)?.length !== anim.match(/\)/g)?.length) throw [`Invalid syntax in animation "<span style="font-weight:600">${anim.replace(/</g, "&lt;")}</span>": Number of opening and closing brackets do not match`]
    let s = anim, allArgs = ""
    while (reInnerGroups.test(s)) s = s.replace(reInnerGroups, "")
    while (reInnerFuncArgs.test(s)) {
      allArgs += s.match(reInnerFuncArgs).join("")
      s = s.replace(/\w\([^()]*\)/g, "")
      while (reInnerGroups.test(s)) s = s.replace(reInnerGroups, "")
    }
    if (allArgs.match(/,/g)?.length !== anim.match(/,/g)?.length) throw [`Invalid syntax in animation "<span style="font-weight:600">${anim.replace(/</g, "&lt;")}</span>": Commas are not allowed outside of functions`]
    return anim
      .replace(/:[a-z_]([a-z0-9_]+)?/gi, m => `.children["${m.slice(1)}"]`)
      .replace(/(?<=[\s\n(+*\/%!&|=<>,-]|^)[a-z_]([a-z0-9_]+)?/gi, (m, g, o, s) => {
        if (s[o + m.length] === ".") return `ctx[Symbol.for("${m}")]`
        if (m in rangesObj && !rangeMap.has(m)) rangeMap.set(m, ranges.get(m) ?? [rangesObj[m], rangesObj[m]?.[1] ?? rangesObj[m]])
        if (m in specialsObj && !specialMap.has(m)) specialMap.set(m, specials.get(m) ?? specialsObj[m])
        return m === "true" || m === "false" ? m : `ctx["${m}"]`
      })
  }
  let timescale = 1
  function loadOptiFineAnimationEditor() {
    let steps, playing, paused, currentGroups
    new Setting("ignore_unkown_optifine_animations", {
      value: false,
      category: "edit",
      name: "Ignore Unknown OptiFine Animations",
      description: "If an OptiFine animation contains unknown animations, they will be ignored, allowing the animation to play and the model to be exported. WARNING: Unknown animations will cause the model to fail to load when using OptiFine."
    })
    animationStyles = Blockbench.addCSS(`
      #panel_cem_animation .panel_vue_wrapper {
        flex: 1;
        padding: 8px;
        overflow: auto !important;
        display: flex;
        flex-direction: column;
        max-height: 100%;
      }
      #panel_cem_animation .prism-editor-wrapper {
        background-color: var(--color-back);
        padding-top: 0;
      }
      #panel_cem_animation .prism-editor-wrapper::-webkit-scrollbar-track, #panel_cem_animation .prism-editor-wrapper::-webkit-scrollbar-corner {
        background-color: var(--color-back);
      }
      #panel_cem_animation .prism-editor__line-numbers {
        overflow: visible;
        min-height: 100% !important;
        position: sticky;
        left: 0;
      }
      #panel_cem_animation .prism-editor__line-number {
        background-color: var(--color-back);
        translate: -4px 0;
        padding: 0 4px;
      }
      #panel_cem_animation .prism-editor__code {
        overflow: visible !important;
      }
      #cem_animation_editor_container {
        overflow: hidden;
        flex: 1;
        max-height: calc(100% - 40px);
        min-height: 37px;
        display: flex;
        position: relative;
      }
      #cem_animation_controller_container {
        flex: 1;
        padding: 8px;
        display: flex;
        flex-direction: column;
        max-height: 100%;
        overflow-y: auto;
      }
      #cem_animation_editor {
        cursor: text;
        flex: 1;
      }
      #cem_animation_title {
        margin-left: 0;
      }
      #cem_animation_content {
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
        display: inline !important;
      }
      .cem_animation_bar i, #cem_doc > div.selected {
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
        background-color: var(--color-close) !important;
        color: var(--color-light) !important;
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
      .spacer, .cem_animation_range input {
        flex: 1;
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
        margin: 0 !important;
        height: 30px;
        box-sizing: content-box;
      }
      .cem_animation_range > :nth-child(2) {
        flex: 1 1 0px;
        min-width: 40px;
      }
      .cem_animation_range p {
        margin: 0 8px 0 0;
      }
      .cem_animation_range_number {
        width: 2em;
        margin-left: 2px;
        cursor: text;
      }
      .cem_animation_button {
        height: 25px;
        min-width: 30px;
        cursor: pointer;
        position: relative;
      }
      .cem_animation_button:hover, #cem_animation_doc_button:hover {
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
        color: var(--color-subtle_text) !important;
        cursor: default;
      }
      button.cem_animation_button_disabled {
        text-decoration: none;
        opacity: 0.5;
      }
      button.cem_animation_button_disabled:hover {
        background-color: var(--color-button);
        color: var(--color-subtle_text) !important;
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
      #cem_animation_format_button {
        position: absolute;
        top: 12px;
        right: 12px;
      }
    `)
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
          showDoc: () => showDocumentation(),
          autocomplete(text, position) {
            const before = text.substring(0, position)
            if (before.match(/"/g)?.length % 2 !== 1) return []
            const beginning = text.substring(0, position).split(/[^a-zA-Z0-9_.]\.*/g).last()
            if (reInValue.test(before)) {
              if (beginning.includes(".")) {
                const [prefix, str] = beginning.split(".")
                if (!prefix.match(/^\d+$/)) {
                  if (["var", "varb"].includes(prefix)) return []
                  return filterAndSortList(boneVars, str)
                }
                return []
              }
              const groups = Group.all.map(e => e.name).concat("var", "varb")
              return filterAndSortList(groups.map(e => `${e}.`).concat(vars), beginning, null, Object.assign(Object.fromEntries(groups.map(e => [`${e}.`, e])), varLabels))
            }
            if (beginning.includes(".")) {
              const [prefix, str] = beginning.split(".")
              if (!prefix.match(/^\d+$/)) {
                if (["var", "varb"].includes(prefix)) return []
                if (prefix === "render") return filterAndSortList(renderVars, str)
                return filterAndSortList(boneVars, str)
              }
              return []
            }
            const groups = Group.all.map(e => e.name).concat("var", "varb", "render")
            return filterAndSortList(groups.map(e => `${e}.`), beginning, null, Object.fromEntries(groups.map(e => [`${e}.`, e])))
          }
        },
        template: `
          <div id="cem_animation_content">
            <div class="cem_animation_bar" style="margin-bottom:8px">
              <p id="cem_animation_title" class="panel_toolbar_label">Editing animations for part: <span id="cem_animation_part_name" style="font-weight:600"></span></p>
              <span class="spacer"></span>
              <span id="cem_animation_doc_button" @click="showDoc()" title="Animation documentation">
                <p>Documentation</p>
                <div class="cem_animation_button cem_animation_button_small"><i class="material-icons">description</i></div>
              </span>
            </div>
            <div id="cem_animation_editor_container">
              <vue-prism-editor id="cem_animation_editor" class="capture_tab_key" v-model="text" language="json" line-numbers @change="change()" :autocomplete="autocomplete"/>
              <div id="cem_animation_format_button" class="cem_animation_button"><i class="material-icons" @click="format()" title="Pretty print the animation code">code</i></div>
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
                <div class="cem_animation_button"><i class="material-icons" @click="play()" title="Play animations">play_arrow</i></div>
              </span>
              <span id="cem_animation_stop_button" style="display:none">
                <div class="cem_animation_button"><i class="material-icons" @click="stop()" title="Stop the animations">stop</i></div>
                <div class="cem_animation_button"><i id="cem_animation_pause_button" class="material-icons" @click="pause()" title="Pause the animations">pause</i></div>
              </span>
            </div>
          </div>
        `
      }
    })
    const reInValue = /:[\s\n]*"[^"]*$/
    function filterAndSortList(list, match, blacklist, labels) {
      const result = list.filter(f => f.startsWith(match) && f.length !== match.length)
      list.forEach(f => {
        if (!result.includes(f) && f.includes(match) && f.length !== match.length) result.push(f)
      })
      if (blacklist) blacklist.forEach(black => result.remove(black))
      return result.map(text => ({text, label: labels && labels[text], overlap: match.length}))
    }
    const partName = $("#cem_animation_part_name")
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
      playing = true
      playButton.css("display", "none")
      stopButton.css("display", "flex")
      if (!keepTime) time = 0
      constants.id = Math.random()
      constants[Symbol.for("var")] = new Proxy({}, {
        get(target, name, receiver) {
          if (Reflect.has(target, name)) {
            return Reflect.get(target, name, receiver)
          } else {
            return 0
          }
        },
        set(target, name, value, receiver) {
          if (typeof value !== "number") throw Error("A <strong>var</strong> must be set to a number")
          return Reflect.set(target, name, value, receiver)
        }
      })
      constants[Symbol.for("varb")] = new Proxy({}, {
        get(target, name, receiver) {
          if (Reflect.has(target, name)) {
            return Reflect.get(target, name, receiver)
          } else {
            return false
          }
        },
        set(target, name, value, receiver) {
          if (typeof value !== "boolean") throw Error("A <strong>varb</strong> must be set to a boolean")
          return Reflect.set(target, name, value, receiver)
        }
      })
      frameCount = 0
      steps = []
      boolMap = new Map()
      rangeMap = new Map()
      specialMap = new Map()
      for (const group of groups) for (const section of group.cem_animations) for (const [key, val] of Object.entries(section)) {
        const split = key.split(".")
        if (split[0] === "render" || split[1] === "visible_boxes") continue
        else if (split[0] === "var") {
          steps.push({
            type: "variable",
            key,
            raw: val,
            anim: `ctx[Symbol.for("var")].${split[1]} = ${preprocessCEMA(val)}`
          })
        } else if (split[0] === "varb") {
          steps.push({
            type: "variableBoolean",
            key,
            raw: val,
            anim: `ctx[Symbol.for("varb")].${split[1]} = ${preprocessCEMA(val)}`
          })
        } else if (split[1] === "visible") {
          const part = ["this", "part"].includes(split[0]) ? group : Group.all.find(e => e.name === split[0])
          steps.push({
            type: "visible",
            part,
            key,
            raw: val,
            anim: preprocessCEMA(val)
          })
        } else {
          const part = ["this", "part"].includes(split[0]) ? group : Group.all.find(e => e.name === split[0])
          if (!part || part.cemAnimationDisableRotation && split[1][0] === "r") continue
          let anim
          try {
            anim = split[1] === "ty" ? `${part.parent === "root" ? "24-" : part.parent?.parent === "root" ? `- ${part.mesh.parent.position.y}-` : "-"}(${preprocessCEMA(val)})` : split[1] === "tz" && part.parent?.parent === "root" ? `(${preprocessCEMA(val)}) - ${part.mesh.parent.position.z}` : split[1] === "tx" && part.parent?.parent === "root" ? `(${preprocessCEMA(val)}) + ${part.mesh.parent.position.x}` : preprocessCEMA(val)
          } catch (err) {
            return animationErrorToggle(err)
          }
          steps.push({
            type: "animation",
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
              min: range[1][0][0],
              max: range[1][0][2],
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
              min: range[1][0][0],
              max: range[1][0][2],
              step: range[1][0][3] ?? 1,
              value: range[1][1],
            }).on("input", evt => {
              slider.val(evt.target.value)
              const clamped = Math.min(range[1][0][2], Math.max(range[1][0][0], parseFloat(evt.target.value)))
              clearTimeout(timeout)
              timeout = setTimeout(() => text.val(isNaN(clamped) ? range[1][1] : clamped), 1000)
              const num = Math.max(range[1][0][0], clamped)
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
      if (specials.has("death_time")) {
        let container = $("#cem_animation_buttons")
        if (!container.length) container = E("div").attr("id", "cem_animation_buttons").appendTo(controller)
        const button = E("div").addClass("cem_animation_button").append(
          E("button").attr({
            id: "cem_animation_death_time_button",
            title: 'Simulate the entity getting killed. Runs "death_time"'
          }).text("Kill entity").on("click", evt => {
            if ($(evt.target).hasClass("cem_animation_button_disabled")) return
            specials.set("death_time", [0, true])
            button.children().first().addClass("cem_animation_button_disabled")
          })
        ).appendTo(container)
        if (specials.get("death_time")[1] === true) button.children().first().addClass("cem_animation_button_disabled")
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
          if (split[0] === "render" || split[1] === "visible_boxes") continue
          if (split.length < 2 || split[1] === "") throw [`Missing transformation type in animation "<span style="font-weight:600">${key}</span>"`, key, val]
          if (!(["var", "varb"].includes(split[0]) || split[1] === "visible")) {
            if (split[1].length > 2) throw [`Invalid transformation type in animation "<span style="font-weight:600">${key}</span>"`, key, val]
            if (!["r", "t", "s"].includes(split[1][0])) throw [`Unknown transform type "<span style="font-weight:600">${split[1][0]}</span>"`, key, val]
            if (!split[1][1]) throw [`Missing axis in animation "<span style="font-weight:600">${key}<span>"`, key, val]
            if (!["x", "y", "z"].includes(split[1][1])) throw [`Unknown axis "<span style="font-weight:600">${split[1][1]}</span>"`, key, val]
          }
          boolMap = new Map()
          rangeMap = new Map()
          specialMap = new Map()
          preprocessCEMA(val)
          if (!["var", "varb"].includes(split[0])) {
            const part = ["this", "part"].includes(split[0]) ? group : Group.all.find(e => e.name === split[0])
            if (!part) animationErrorToggle(`Unknown group "<span style="font-weight:600">${split[0]}</span>"`, null, true)
          }
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
    let parents
    function playAnimations() {
      try {
        frameCount++
        const now = Date.now()
        const dt = (now - prevTime) / 1000
        constants.frame_time = dt * timescale
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
        if (specials.get("death_time")?.[0] >= 20) {
          specials.set("death_time", [0, false])
          $("#cem_animation_death_time_button").removeClass("cem_animation_button_disabled")
        }
        if (specials.get("swing_progress")?.[0] >= 1) {
          specials.set("swing_progress", [0, false])
          $("#cem_animation_swing_progress_button").removeClass("cem_animation_button_disabled")
        }
        if (frameCount === 1) {
          parents = {}
          for (const part of Group.all.filter(e => e.parent === "root")) {
            parents[part.name] = {
              tx: -((part.parent?.parent === "root") * part.mesh.parent.position.x + part.mesh.position.x),
              ty: (part.parent === "root") * 24 + (part.parent?.parent === "root") * -part.mesh.parent.position.y - part.mesh.position.y,
              tz: (part.parent?.parent === "root") * part.mesh.parent.position.z + part.mesh.position.z,
              rx: -part.mesh.rotation.x,
              ry: -part.mesh.rotation.y,
              rz: part.mesh.rotation.z,
              sx: part.mesh.scale.x,
              sy: part.mesh.scale.y,
              sz: part.mesh.scale.z,
              visible: true
            }
          }
        }
        context = Object.assign({
          time: time,
          age: time,
          limb_swing: specials.get("limb_swing")?.[1] ? specials.get("limb_swing")[0] += difference / 1.666 : specials.get("limb_swing")?.[0] ?? 0,
          hurt_time: specials.get("hurt_time")?.[1] ? specials.get("hurt_time")[0] -= difference : 0,
          death_time: specials.get("death_time")?.[1] ? specials.get("death_time")[0] += difference : 0,
          swing_progress: specials.get("swing_progress")?.[1] ? specials.get("swing_progress")[0] += difference / 4 : 0
        }, constants, Object.fromEntries(bools), Object.fromEntries(Array.from(ranges.entries()).map(e => [e[0], e[1][1]])))
        if (settings.ignore_unkown_optifine_animations.value) {
          context = new Proxy(context, {
            get(target, prop) {
              if (prop in target) return target[prop]
              const num = e => e ?? 0
              num.valueOf = () => 0
              return num
            }
          })
        } else {
          context = new Proxy(context, {
            get(target, prop) {
              if (prop in target) return target[prop]
              throw new Error(`Unknown variable / function<div style="padding-right:10px">:</div> " <span style="font-weight:600">${prop}</span> "`)
            }
          })
        }
        const parts = new Map()
        for (const part of Group.all) {
          const partObj = {
            children: {},
            tx: -((part.parent?.parent === "root") * part.mesh.parent.position.x + part.mesh.position.x),
            ty: (part.parent === "root") * 24 + (part.parent?.parent === "root") * -part.mesh.parent.position.y - part.mesh.position.y,
            tz: (part.parent?.parent === "root") * part.mesh.parent.position.z + part.mesh.position.z,
            rx: -part.mesh.rotation.x,
            ry: -part.mesh.rotation.y,
            rz: part.mesh.rotation.z,
            sx: part.mesh.scale.x,
            sy: part.mesh.scale.y,
            sz: part.mesh.scale.z,
            visible: true
          }
          parts.set(part, partObj)
          context[Symbol.for(part.name)] = partObj
        }
        for (const part of Group.all.filter(e => e.parent !== "root")) {
          const partObj = parts.get(part)
          for (const child of part.children) partObj.children[child.name] = parts.get(child)
        }
        for (const step of steps) {
          if (step.type === "animation" && typeof anim === "string" && step.part.name in parents) {
            step.anim = step.anim.replace(`ctx["Symbol.for(${step.part.name})"].${step.transform}`, parents[step.part.name][step.transform])
          }
          let parsed = parseCEMA(step.anim)
          if (isNaN(parsed)) {
            if (typeof parsed === "number") parsed = 0
            else {
              if (parsed?.message) throw `Invalid animation for "<span style="font-weight:600">${step.key}</span>"<div style="padding-right:10px">:</div> ${parsed.message}`
              throw `Unable to parse animation "<span style="font-weight:600">${step.raw.replace(/</g, "&lt;")}</span>" for "<span style="font-weight:600">${step.key}</span>"`
            }
          }
          else if (step.type === "animation") {
            if (parsed === true || parsed === false) throw `Unable to play animation "<span style="font-weight:600">${step.raw.replace(/</g, "&lt;")}</span>" as it retuned a <strong>boolean</strong> instead of a <strong>number</strong>`
            step.part.mesh[step.mode][step.axis] = parsed * step.invert
            context[Symbol.for(step.part.name)][step.transform] = step.transform === "ty" ? (step.part.parent === "root") * 24 + (step.part.parent?.parent === "root") * -step.part.mesh.parent.position.y - step.part.mesh.position.y : step.transform === "tx" ? -((step.part.parent?.parent === "root") * step.part.mesh.parent.position.x + step.part.mesh.position.x) : step.transform === "tz" ? (step.part.parent?.parent === "root") * step.part.mesh.parent.position.z + step.part.mesh.position.z : invertions.has(step.transform) ? - step.part.mesh[step.mode][step.axis] : step.part.mesh[step.mode][step.axis]
          } else if (step.type === "visible") {
            if (typeof parsed !== "boolean") throw `Invalid animation for "<span style="font-weight:600">${step.key}</span>"<div style="padding-right:10px">:</div> <strong>visible</strong> must be set to a boolean`
            step.part.mesh.visible = parsed
            context[Symbol.for(step.part.name)].visible = parsed
          }
        }
      } catch (err) {
        stopAnimations()
        animationErrorToggle(err.toString().replace(/ctx\./g, ""))
      }
    }
    stopAnimations = resetGroups => {
      Blockbench.removeListener("render_frame", playAnimations)
      if (resetGroups) for (const group of Group.all.filter(e => e.cemAnimationDisableRotation)) group.cemAnimationDisableRotation = false
      for (const group of Group.all) group.mesh.visible = true
      Canvas.updateView({groups: Group.all})
      playButton.css("display", "flex")
      stopButton.css("display", "none")
      pauseButton.text("pause").attr("title", "Pause the animations")
      $("#cem_animation_hurt_time_button").addClass("cem_animation_button_disabled")
      $("#cem_animation_death_time_button").addClass("cem_animation_button_disabled")
      $("#cem_animation_swing_progress_button").addClass("cem_animation_button_disabled")
      playing = false
      paused = false
    }
    let group
    function selectGroup() {
      partName.text(group.name)
      const animation = JSON.stringify(group.cem_animations?.length === 0 ? [{}] : group.cem_animations, null, 2)
      if (animation) {
        parseAnimations(animation)
        animationEditorPanel.vue.text = animation
        editorWrapper[0].__vue__._data.undoStack = [{ plain: animation }]
        editorWrapper[0].__vue__._data.undoOffset = 0
      }
    }
    updateSelection = () => {
      if (Project.format?.id === "optifine_entity") {
        resizeWindow()
        stopAnimations()
        let selected = Group.selected ?? Cube.selected?.[0]
        if (selected) {
          while (selected.parent !== "root") selected = selected.parent
          if (group !== selected) {
            group = selected
            selectGroup()
          }
        }
      }
    }
    Blockbench.on("update_selection", updateSelection)
    tabChange = () => {
      setTimeout(() => {
        group = Group.all[0]
        if (Format.id === "optifine_entity" && group && !Group.selected) {
          selectGroup()
        }
      }, 0)
    }
    Blockbench.on("select_project", tabChange)
    tabChange()
    updateSelection()
    editorKeybinds = evt => {
      if (evt.key === "s" && evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
        BarItems.export_over.trigger()
        evt.stopImmediatePropagation()
      }
    }
    $("#cem_animation_editor_container > div")[0].addEventListener("keydown", editorKeybinds, true)
    resizeWindow()
    function addAnimationToggles() {
      if (Project.format?.id === "optifine_entity") {
        const toggle = $("[toolbar_id='outliner'] > div > [toolbar_item='outliner_toggle']")
        if (toggle.hasClass("enabled")) {
          const toggles = $("#cubes_list .group [toggle='autouv']")
          if (toggles.length) {
            groupObserver.disconnect()
            toggles.each((i, e) => {
              const toggle = $(e)
              const partName = toggle.parent().find("input").val()
              const part = Project.groups.find(e => e.name === partName)
              if (!part) return
              if (!toggle.parent().find("[toggle='cem_animation_disable_rotations']").length) {
                const rotateToggle = E("i").attr({
                  title: "Disable this group rotating while playing animations",
                  toggle: "cem_animation_disable_rotations"
                }).addClass("outliner_toggle material-icons icon_off").text("sync_disabled").on("click", evt => {
                  evt.stopPropagation()
                  const partName = toggle.parent().find("input").val()
                  const part = Project.groups.find(e => e.name === partName)
                  const rotateToggle = $(evt.target)
                  if (rotateToggle.hasClass("icon_off")) {
                    rotateToggle.removeClass("icon_off")
                    part.cemAnimationDisableRotation = true
                  } else {
                    rotateToggle.addClass("icon_off")
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
        } else $("[toggle='cem_animation_disable_rotations']").remove()
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
    globalThis.optifineAnimationDocumentation = {
      custom: []
    }
    async function showDocumentation() {
      if (optifineAnimationDocumentation.shown) {
        optifineAnimationDocumentation.dialog.show()
      } else {
        if (!optifineAnimationDocumentation.data) {
          optifineAnimationDocumentation.data = await fetchData("json/cem_animation_doc.json")
          optifineAnimationDocumentation.data.tabs ??= []
        }
        optifineAnimationDocumentation.shown = true
        const tabs = [...optifineAnimationDocumentation.data.tabs, ...optifineAnimationDocumentation.custom]
        optifineAnimationDocumentation.dialog = new Dialog({
          id: "cem_animation_documentation",
          title: "CEM Animation Documentation",
          width: 980,
          buttons: [],
          sidebar: {
            pages: Object.fromEntries(tabs.map(e => [e.name, {
              label: e.name,
              icon: e.icon
            }])),
            onPageSwitch(page) {
              optifineAnimationDocumentation.dialog.content_vue.page = page
            }
          },
          lines: [`<style>
            #cem_animation_documentation {
              .dialog_wrapper {
                grid-template-rows: auto 0px;
                min-height: min(100vh - 120px, 512px);
                max-height: calc(100vh - 120px);
                display: grid;
                position: relative;
              }

              .dialog_content {
                margin: 0;
                max-height: initial;
                overflow-x: hidden;
                max-height: calc(100vh - 120px);
              }

              .page {
                padding: 16px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
                user-select: text;
              }

              h1 {
                margin: 0;
                line-height: 100%;
                font-size: 30px;
                padding-bottom: 8px;

                &:not(:first-child) {
                  padding-top: 24px;
                }
              }

              :is(code, pre) {
                background-color: var(--color-back);
                padding: 0 4px;
                border: 1px solid var(--color-border);
                cursor: text;
                font-family: var(--font-code);
              }

              pre {
                width: 100%;
              }

              .cem-doc-table-list td:first-child {
                font-weight: 600;
                white-space: nowrap !important;
                display: list-item;
                list-style: inside;
                font-family: var(--font-code);
              }

              .cem-doc-tab-link {
                text-decoration: underline;
                cursor: pointer;
                color: var(--color-accent);
              }

              td:not(:last-child) {
                padding-right: 16px;
              }

               img {
                margin: 8px;
                box-shadow: 0 3px 10px #0006;
              }

              p {
                white-space: pre-wrap;
              }

              hr {
                width: 100%;
                margin-bottom: 0;
              }
            }
          </style>`],
          component: {
            data: {
              version: optifineAnimationDocumentation.data.version,
              optifineVersion: optifineAnimationDocumentation.data.optifineVersion,
              tabs,
              connection,
              page: tabs[0]?.name
            },
            methods: {
              reload() {
                window.cemTemplateAnimationDocReloaded = true
                plugin.reload()
              }
            },
            template: `
              <div id="cem-container">
                <div v-if="connection?.failed" class="cem-overlay">
                  <h1>Connection Failed</h1>
                  <p>Failed to load CEM Animation documentation.</p>
                  <p>Please make sure you are connected to the internet, and can access this <a href="${root}/json/cem_animation_doc.json">cem_animation_doc.json</a> file.</p>
                  <p>If you are unable to access the cem_animation_doc.json file, it may be blocked by your computer or your internet service provider. If it is not your computer blocking it, you may be able to use a VPN to bypass the block. One good example is <a href="https://1.1.1.1/">Cloudflare WARP</a>, which is a free program that commonly resolves this issue.</p>
                  <button @click="reload">Retry connection</button>
                </div>
                <div v-for="tab of tabs" v-if="page === tab.name" class="page">
                  <template v-for="element of tab.elements">
                    <h1 v-if="element.type === 'heading'">{{ element.text }}</h1>
                    <p v-else-if="element.type === 'text'" v-html="element.text"></p>
                    <pre v-else-if="element.type === 'code'">{{ element.text }}</pre>
                    <img v-else-if="element.type === 'image'" :src="element.url" :width="element.width" :height="element.height">
                    <table v-else-if="element.type === 'table'" :class="{ 'cem-doc-table-list': element.tableType === 'list' }">
                      <tr v-for="row of element.rows">
                        <td v-for="cell of row" v-html="cell"></td>
                      </tr>
                    </table>
                  </template>
                  <hr>
                  <p>Documentation version: <span style="font-family:var(--font-code)">{{ version }}<span><br>Updated to: <span style="font-family:var(--font-code)">OptiFine {{ optifineVersion }}<span></p>
                </div>
              </div>
            `
          },
          onBuild() {
            this.object.querySelector("#cem-container").addEventListener("click", e => {
              if (e.target.classList.contains("cem-doc-tab-link")) {
                this.content_vue.page = e.target.textContent
                this.sidebar.page = e.target.textContent
                this.sidebar.build()
              }
            })
          }
        }).show()
      }
    }
    if (window.cemTemplateAnimationDocReloaded) {
      delete window.cemTemplateAnimationDocReloaded
      showDocumentation()
    }
  }

  function unloadOptiFineAnimationEditor() {
    stopAnimations?.(true)
    Blockbench.removeListener("update_selection", updateSelection)
    Blockbench.removeListener("select_project", tabChange)
    $("#cem_animation_editor_container > div")[0].removeEventListener("keydown", editorKeybinds)
    groupObserver.disconnect()
    $("[toggle='cem_animation_disable_rotations']").remove()
    animationEditorPanel.delete()
    animationControlPanel.delete()
    animationStyles.delete()
    optifineAnimationDocumentation.dialog?.close()
    resizeWindow()
    delete globalThis.optifineAnimationVariables
    delete globalThis.optifineAnimationDocumentation
  }

  // PLUGIN

  loadPlugin()
})()