(() => {
  const path = require("node:path")
  const zlib = require("node:zlib")
  const os = require("node:os")

  let dialog, action, action2, styles, storage

  const id = "resource_pack_utilities"
  const name = "Resource Pack Utilities"
  const icon = "construction"
  const description = "A collection of utilities to assist with resource pack creation."

  const manifest = {
    latest: {},
    versions: []
  }

  let outputLog = []
  const output = {
    log: log => outputLog.push(["message", log]),
    info: log => outputLog.push(["info", log]),
    warn: log => outputLog.push(["warn", log]),
    error: log => outputLog.push(["error", log])
  }

  const setupPlugin = () => Plugin.register(id, {
    title: name,
    icon: "icon.png",
    author: "Ewan Howell",
    description,
    tags: ["Minecraft: Java Edition", "Resource Packs", "Utilities"],
    version: "1.5.0",
    min_version: "4.10.0",
    variant: "desktop",
    website: `https://ewanhowell.com/plugins/${id.replace(/_/g, "-")}/`,
    repository: `https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/${id}`,
    bug_tracker: `https://github.com/ewanhowell5195/blockbenchPlugins/issues?title=[${name}]`,
    creation_date: "2024-07-01",
    has_changelog: true,
    async onload() {
      storage = JSON.parse(localStorage.getItem(id) ?? "{}")
      storage.favourites ??= []
      let directory
      if (os.platform() === "win32") {
        directory = path.join(os.homedir(), "AppData", "Roaming", ".minecraft")
      } else if (os.platform() === "darwin") {
        directory = path.join(os.homedir(), "Library", "Application Support", "minecraft")
      } else {
        directory = path.join(os.homedir(), ".minecraft")
      }
      new Setting("minecraft_directory", {
        value: directory,
        category: "defaults",
        type: "click",
        name: `${name} - Minecraft Directory`,
        description: "The location of your .minecraft folder",
        icon: "folder_open",
        click() {
          const dir = Blockbench.pickDirectory({
            title: "Select your .minecraft folder",
            startpath: settings.minecraft_directory.value
          })
          if (dir) {
            settings.minecraft_directory.value = dir
            Settings.saveLocalStorages()
          }
        }
      })
      new Setting("cache_directory", {
        value: "",
        category: "defaults",
        type: "click",
        name: `${name} - Cache Directory`,
        description: "The location to cache downloaded content",
        icon: "database",
        click() {
          const dir = Blockbench.pickDirectory({
            title: "Select a folder to cache downloaded content",
            startpath: settings.cache_directory.value
          })
          if (dir) {
            settings.cache_directory.value = dir
            Settings.saveLocalStorages()
          }
        }
      })
      const methods = {
        selectFolder(title = "folder", key = "folder") {
          const dir = Blockbench.pickDirectory({
            title: `Select ${title}`,
            startpath: path.join(settings.minecraft_directory.value, "resourcepacks")
          })
          if (dir) {
            this[key] = dir
          }
        }
      }
      styles = Blockbench.addCSS(`
        .rpu-code {
          background-color: var(--color-back);
          border: 1px solid var(--color-border);
          padding: 0 2px;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
            outline: 0 solid transparent;
          }
          12.5%, 62.5% {
            transform: translateX(8px);
            outline: 4px solid var(--color-danger);
          }
          37.5%, 87.5% {
            transform: translateX(-8px);
            outline: 4px solid var(--color-danger);
          }
        }
      `)
      dialog = new Dialog({
        id,
        title: name,
        width: 780,
        buttons: [],
        cancel_on_click_outside: false,
        lines: [`<style>#${id} {
          .dialog_content {
            margin: 0;
            max-height: calc(100vh - 128px);
          }

          button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            min-height: 32px;

            &:disabled {
              opacity: .5;
              cursor: not-allowed;

              &:hover {
                background-color: var(--color-button);
                color: var(--color-text) !important;
              }
            }

            &.material-icons {
              min-width: 32px;
              padding: 0;

              &:focus {
                text-decoration: none;
                color: var(--color-light);
              }

              &.icon {
                background-color: initial;

                &:focus {
                  color: var(--color-text) !important;
                }

                &:hover {
                  color: var(--color-light) !important;
                }
              }
            }
          }

          code {
            background-color: var(--color-back);
            border: 1px solid var(--color-border);
            padding: 0 2px;
          }

          input[type="text"] {
            background-color: var(--color-back);
            padding: 0 8px;
            border: 1px solid var(--color-border);
            height: 32px;
          }

          h1, h3, p {
            margin: 0;
            padding: 0;
          }

          h3 {
            margin-bottom: -8px;
          }

          #home {
            > div {
              margin: 16px;
              gap: 8px;
              flex-wrap: wrap;
              display: flex;

              > div {
                background-color: var(--color-back);
                padding: 12px 16px 16px 16px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: calc(50% - 4px);
                position: relative;

                * {
                  cursor: pointer;
                }

                &:hover {
                  background-color: var(--color-button);
                }
              }

              + div {
                border-top: 1px solid var(--color-border);
                padding-top: 16px;
              }

              .fa-star {
                position: absolute;
                top: 16px;
                right: 16px;

                &.fa {
                  color: #f9c300;

                  &:hover {
                    filter: brightness(1.2);
                  }
                }

                &.far:hover {
                  color: var(--color-light);
                }
              }
            }

            h3 {
              font-weight: 700;
              font-size: 28px;
              color: var(--color-light);
              line-height: 100%;
              margin: 0;
              display: flex;
              align-items: center;
              gap: 6px;
              padding-right: 28px;
            }
          }

          #header {
            background-color: var(--color-back);
            position: relative;
            padding: 8px 40px 16px 16px;

            h1 {
              font-weight: 600;
              color: var(--color-light);
              display: flex;
              gap: 8px;
              align-items: center;

              > i {
                font-size: 30px;
                min-width: 30px;
              }
            }
          }

          #back-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: initial;
            display: flex;
            align-items: center;
            min-width: initial;
            padding: 0 8px;

            &:hover {
             color: var(--color-light) !important;
            }

            &:disabled {
              pointer-events: initial;
              cursor: not-allowed;

              &:hover {
                color: var(--color-text) !important;
              }
            }
          }

          #info-button {
            position: absolute;
            bottom: 8px;
            right: 8px;
          }

          .utility {
            margin: 16px 8px 16px 16px;
            padding-right: 8px;
            display: flex;
            gap: 16px;
            flex-direction: column;
            max-height: calc(100vh - 286px);
            overflow-y: auto;

            > div, .col {
              display: flex;
              gap: 16px;
              flex-direction: column;

              > .component-checkboxRow + .component-checkboxRow {
                margin-top: -16px;
              }
            }

            .row {
              display: flex;
              gap: 32px;
              flex-direction: row;
              align-items: flex-start;
            }
          }

          .search_bar {
            float: initial;
            width: calc(100% - 32px);
          }

          .no-results {
            padding: 0 !important;
            background-color: initial !important;
            text-align: center;
            width: 100% !important;
            height: 128px;
            justify-content: center;
          }

          .button-row {
            display: flex;
            gap: 8px;

            button {
              flex: 1 1 0px;
            }
          }

          ${Object.entries(components).filter((([k, v]) => v.styles)).map(([k, v]) => `.component-${k} { ${v.styles} }`).join("")}
          ${Object.entries(utilities).filter((([k, v]) => v.component.styles)).map(([k, v]) => `.utility-${k} { ${v.component.styles} }`).join("")}
        }</style>`],
        component: {
          data: {
            utility: null,
            utilities,
            status: {
              processing: false,
              finished: false
            },
            favourites: storage.favourites,
            search: ""
          },
          components: Object.fromEntries(Object.entries(utilities).map(([k, v]) => {
            v.component.props = ["value"]
            const data = v.component.data
            v.component.data = function() {
              return {
                ...data,
                status: this.value
              }
            }
            v.component.watch = {
              value(val) {
                this.status = val
              },
              status(val) {
                this.$emit("input", val)
              }
            }
            v.component.components = Object.fromEntries(Object.entries(components).map(([k, v]) => {
              v.template = `<div ref="container" class="component-${k}">${v.template}</div>`
              return [k, Vue.extend(v)]
            }))
            v.component.methods ??= {}
            v.component.methods = { ...v.component.methods, ...methods }
            v.component.template = `<div ref="container" class="utility utility-${k}">${v.component.template}</div>`
            return [k, Vue.extend(v.component)]
          })),
          watch: {
            status(val) {
              if (val.processing) {
                const styles = document.createElement("style")
                styles.id = `${id}-processing-styles`
                styles.innerHTML = `
                  #${id} {
                    .dialog_close_button {
                      pointer-events: none;
                      opacity: .5;
                    }

                    .dialog_handle::before, #header::before {
                      content: "";
                      position: absolute;
                      top: 0;
                      right: 0;
                      bottom: 0;
                      width: 30px;
                      cursor: not-allowed;
                    }
                  }
                `
                document.body.append(styles)
              } else {
                document.getElementById(`${id}-processing-styles`)?.remove()
              }
            }
          },
          methods: {
            showInfo() {
              new Dialog({
                id: `${id}-info`,
                title: `${utilities[this.utility].name} Info`,
                buttons: ["dialog.close"],
                lines: [
                  `<style>#${id}-info {
                    ul {
                      margin-bottom: 8px;
                    }

                    li {
                      list-style: initial;
                      margin-left: 20px;

                      li {
                        list-style: circle;

                        li {
                          list-style: square;
                        }
                      }
                    }

                    code {
                      background-color: var(--color-back);
                      border: 1px solid var(--color-border);
                      padding: 0 2px;
                    }

                    h3 {
                      margin: 0 0 8px 0;
                      padding: 0;
                      font-weight: 700;
                    }
                  }</style>`,
                  utilities[this.utility].info
                ],
                width: 780
              }).show()
            },
            favourite(id) {
              this.favourites.unshift(id)
              save()
              sortUtilities()
            },
            unfavourite(id) {
              this.favourites.splice(this.favourites.indexOf(id), 1)
              save()
              sortUtilities()
            }
          },
          computed: {
            utilityList() {
              const sorted = Object.entries(this.utilities).sort((a, b) => a[0].localeCompare(b[0]))
              if (this.search.length) {
                return sorted.filter(e => e[0].toLowerCase().includes(this.search.replace(/\s/g, '')))
              }
              return sorted.filter(e => !this.favourites.includes(e[0]))
            }
          },
          template: `
            <div>
              <div v-if="utility" id="header">
                <h1><i class="material-icons icon">{{ utilities[utility].icon }}</i> {{ utilities[utility].name }}</h1>
                <span>{{ utilities[utility].description }}</span>
                <button id="back-button" @click="utility = null; status.finished = false" :disabled="status.processing"><i class="material-icons">arrow_back</i> Back</button>
                <button v-if="utilities[utility].info" id="info-button" class="material-icons icon" @click="showInfo">info</button>
              </div>
              <div v-if="utility === null" id="home">
                <div class="search_bar">
                  <input type="text" class="dark_bordered" placeholder="Search…" v-model="search" ref="search">
                  <i :class="{ active: search }" class="material-icons" @click="search = ''; $refs.search.focus()">{{ search ? "clear" : "search" }}</i>
                </div>
                <div v-if="!search.length && Object.keys(utilities).filter(e => favourites.includes(e)).length">
                  <div v-for="id in favourites" v-if="id in utilities" @click="utility = id">
                    <h3><i class="material-icons icon">{{ utilities[id].icon }}</i> {{ utilities[id].name }}</h3>
                    <div>{{ utilities[id].tagline }}</div>
                    <i class="fa_big fa fa-star" @click.stop="unfavourite(id)"></i>
                  </div>
                </div>
                <div v-if="Object.keys(utilities).filter(e => !favourites.includes(e)).length">
                  <div v-if="!utilityList.length" class="no-results">No results…</div>
                  <div v-for="([id, data]) in utilityList" v-if="search.length ? id.toLowerCase().includes(search.replace(/\\s/g, '')) : !favourites.includes(id)" @click="utility = id">
                    <h3><i class="material-icons icon">{{ data.icon }}</i> {{ data.name }}</h3>
                    <div>{{ data.tagline }}</div>
                    <i v-if="favourites.includes(id)" class="fa_big fa fa-star" @click.stop="unfavourite(id)"></i>
                    <i v-else class="fa_big far fa-star" @click.stop="favourite(id)"></i>
                  </div>
                </div>
              </div>
              <component v-for="(data, id) in utilities" v-if="utility === id" :is="id" v-model="status"></component>
            </div>
          `
        },
        onConfirm(r, e) {
          if (Keybinds.extra.confirm.keybind.isTriggered(e)) return false
        },
        async onBuild() {
          const data = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json").then(e => e.json())
          data.versions.splice(data.versions.findIndex(e => e.id === "1.6"), 1)
          manifest.latest = data.latest
          manifest.versions = data.versions.slice(0, data.versions.findIndex(e => e.id === "13w24a") + 1)
        },
        async onOpen() {
          if (!await exists(settings.minecraft_directory.value)) {
            new Dialog({
              title: "The .minecraft directory was not found",
              lines: ['When prompted, please select your <code class="rpu-code">.minecraft</code> folder'],
              width: 450,
              buttons: ["dialog.ok"],
              onClose() {
                const dir = Blockbench.pickDirectory({
                  title: "Select your .minecraft folder",
                  startpath: settings.minecraft_directory.value
                })
                if (dir) {
                  settings.minecraft_directory.value = dir
                  Settings.saveLocalStorages()
                } else {
                  dialog.close()
                }
              }
            }).show()
          }
        }
      })
      action = new Action({
        id,
        name,
        description,
        icon,
        click: () => dialog.show(),
        condition: () => !Object.keys(utilities).filter(e => storage.favourites.includes(e)).length,
      })
      action2 = new Action({
        id: id + 2,
        name,
        description,
        icon,
        click: () => dialog.show(),
        condition: () => Object.keys(utilities).filter(e => storage.favourites.includes(e)).length,
        children: [
          {
            name: "Open",
            icon: "menu",
            click: () => dialog.show()
          },
          ...Object.entries(utilities).map(([id, data]) => new Action({
            id,
            name: data.name,
            description: data.tagline,
            icon: data.icon,
            click() {
              dialog.show()
              dialog.content_vue.utility = id
            },
            condition: () => storage.favourites.includes(id)
          }))
        ]
      })
      sortUtilities()
      MenuBar.addAction(action, "tools")
      MenuBar.addAction(action2, "tools")
      document.addEventListener("keydown", copyText)
      // dialog.show()
      // dialog.content_vue.utility = "soundsStripper"
    },
    onunload() {
      document.removeEventListener("keydown", copyText)
      dialog.close()
      action.delete()
      action2.delete()
      Object.keys(utilities).forEach(e => BarItems[e].delete())
      styles.delete()
      document.getElementById(`${id}-processing-styles`)?.remove()
    }
  })

  // Functions

  function save() {
    localStorage.setItem(id, JSON.stringify(storage))
  }

  const getFiles = async function*(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name)
      if (dirent.isDirectory()) {
        yield* getFiles(res)
      } else if (!res.match(/([\/\\]|^)\.git([\/\\]|$)/)) {
        yield res
      }
    }
  }

  async function listFiles(dir, type) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true })
    return files.filter(e => e.isFile() && (!type || e.name.endsWith("." + type))).map(e => e.name).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }

  const sizes = ["B", "KB", "MB", "GB", "TB"]
  function formatBytes(bytes) {
    if (bytes === 0) return "0 B"
    const sign = bytes < 0 ? "-" : ""
    bytes = Math.abs(bytes)
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return sign + parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + " " + sizes[i]
  }

  async function loadImage(imagePath) {
    const img = new Image()
    if (imagePath.startsWith?.("data:image/png;base64,")) {
      img.src = imagePath
    } else {
      let imageData
      if (typeof imagePath === "object") {
        imageData = imagePath
      } else {
        imageData = await fs.promises.readFile(imagePath)
      }
      const base64Data = imageData.toString("base64")
      img.src = `data:image/png;base64,${base64Data}`
    }
    await img.decode()
    return img
  }

  function confirm(title, message) {
    return new Promise(fulfil => Blockbench.showMessageBox({
      title,
      message: message + "\n\nThis action cannot be undone!",
      buttons: ["dialog.confirm", "dialog.cancel"],
      width: 512
    }, b => fulfil(!b)))
  }

  function showMessage(title, message) {
    return new Promise(fulfil => {
      new Dialog({
        id: `${id}-message`,
        title,
        lines: [
          `<style>#${id}-message {
            .dialog_content {
              white-space: pre-wrap;
            }

            code {
              background-color: var(--color-back);
              border: 1px solid var(--color-border);
              padding: 0 2px;
            }
          }</style>`,
          message
        ],
        buttons: ["dialog.ok"],
        onClose: () => fulfil()
      }).show()
    })
  }

  function formatPath(path) {
    return path.replace(/\\/g, "/")
  }

  function exists(path) {
    return new Promise(async fulfil => {
      try {
        await fs.promises.access(path)
        fulfil(true)
      } catch {
        fulfil(false)
      }
    })
  }

  function copyText(evt) {
    if (event.ctrlKey && event.key === "c") {
      const selection = window.getSelection()
      const text = selection.toString()
      if (text) {
        let parent = selection.anchorNode.parentElement
        while (parent) {
          if (parent.id === "resource_pack_utilities") {
            navigator.clipboard.writeText(text)
            break
          }
          parent = parent.parentElement
        }
      }
    }
  }

  const td = new TextDecoder
  function parseZip(zip) {
    const ua = new Uint8Array(zip)
    const dv = new DataView(zip)

    const offEOCD = ua.findLastIndex((e, i, a) => e === 0x50 && a[i+1] === 0x4b && a[i+2] === 0x05 && a[i+3] === 0x06)
    const offCenDir = dv.getUint32(offEOCD + 16, true)
    const recordCount = dv.getUint16(offEOCD + 10, true)

    const parsedZip = {
      buffer: zip,
      array: ua,
      view: dv,
      eocdOffset: offEOCD,
      centralDirOffset: offCenDir,
      fileCount: recordCount,
      files: {}
    }

    for (let i = 0, o = offCenDir; i < recordCount; i++) {
      const n = dv.getUint16(o + 28, true)
      const m = dv.getUint16(o + 30, true)
      const k = dv.getUint16(o + 32, true)
      const encodedPath = ua.subarray(o + 46, o + 46 + n)
      const filePath = td.decode(encodedPath)

      if (!filePath.endsWith("/") && (filePath.startsWith("assets/") || ["pack.mcmeta", "version.json", "pack.png"].includes(filePath)) && !/\.(class|nbt|mcassetsroot)$/.test(filePath)) {
        const h = dv.getUint32(o + 42, true)
        const q = dv.getUint16(h + 8,  true)
        const t = dv.getUint16(h + 10, true)
        const d = dv.getUint16(h + 12, true)
        const s = dv.getUint32(o + 20, true)
        const a = dv.getUint32(o + 24, true)
        const e = dv.getUint16(h + 28, true)

        parsedZip.files[filePath] = {
          path: filePath,
          compressedSize: s,
          size: a,
          crc32: dv.getUint32(o + 16, true),
          timeValue: t,
          dateValue: d,
          encodedPath,
          compressionMethod: q,
          compressedContent: ua.subarray(h + 30 + n + e, h + 30 + n + e + s)
        }
        if (q === 0) {
          parsedZip.files[filePath].content = parsedZip.files[filePath].compressedContent
        } else {
          Object.defineProperty(parsedZip.files[filePath], "content", {
            configurable: true,
            enumerable: true,
            get() {
              const c = zlib.inflateRawSync(this.compressedContent)
              Object.defineProperty(this, "content", {
                value: c,
                configurable: true,
                enumerable: true
              })
              return c
            }
          })
        }
      }

      o += 46 + n + m + k
    }

    return parsedZip
  }

  async function cacheDirectory() {
    if (!await exists(settings.cache_directory.value)) {
      output.info("Cache directory not found. Please set a new one")
      return new Promise(fulfil => {
        new Dialog({
          title: "The cache directory was not found",
          lines: ["When prompted, please select a folder to cache downloaded content"],
          width: 512,
          buttons: ["dialog.ok"],
          onClose() {
            let dir
            while (!dir) {
              dir = Blockbench.pickDirectory({
                title: "Select a folder to cache downloaded content",
                startpath: settings.cache_directory.value
              })
            }
            settings.cache_directory.value = dir
            Settings.saveLocalStorages()
            output.log(`Cache directory set to \`${formatPath(settings.cache_directory.value)}\``)
            fulfil()
          }
        }).show()
      })
    }
  }

  function getVersion(id) {
    return manifest.versions.find(e => e.id === id)
  }

  async function getVersionData(id) {
    const version = getVersion(id)
    if (version.data) {
      return version.data
    }
    const vanillaDataPath = path.join(settings.minecraft_directory.value, "versions", id, id + ".json")
    if (await exists(vanillaDataPath)) {
      version.data = JSON.parse(await fs.promises.readFile(vanillaDataPath))
      return version.data
    }
    await cacheDirectory()
    const cacheDataPath = path.join(settings.cache_directory.value, `data_${id}.json`)
    if (await exists(cacheDataPath)) {
      version.data = JSON.parse(await fs.promises.readFile(cacheDataPath))
      return version.data
    }
    version.data = await fetch(version.url).then(e => e.json())
    await fs.promises.writeFile(cacheDataPath, JSON.stringify(version.data), "utf-8")
    return version.data
  }

  async function getVersionAssetsIndex(id) {
    const version = await getVersionData(id)
    if (version.assetsIndex) {
      return version.assetsIndex
    }
    const vanillaAssetsIndexPath = path.join(settings.minecraft_directory.value, "assets", "indexes", version.assets + ".json")
    if (await exists(vanillaAssetsIndexPath)) {
      version.assetsIndex = JSON.parse(await fs.promises.readFile(vanillaAssetsIndexPath))
      return version.assetsIndex
    }
    await cacheDirectory()
    const cacheAssetsIndexPath = path.join(settings.cache_directory.value, `assets_index_${version.assets}.json`)
    if (await exists(cacheAssetsIndexPath)) {
      version.assetsIndex = JSON.parse(await fs.promises.readFile(cacheAssetsIndexPath))
      return version.assetsIndex
    }
    version.assetsIndex = await fetch(version.assetIndex.url).then(e => e.json())
    await fs.promises.writeFile(cacheAssetsIndexPath, JSON.stringify(version.assetsIndex), "utf-8")
    return version.assetsIndex
  }

  async function getVersionJar(id) {
    let jar
    const jarPath = path.join(settings.minecraft_directory.value, "versions", id, id + ".jar")
    if (await exists(jarPath)) {
      jar = parseZip((await fs.promises.readFile(jarPath)).buffer)
      output.log(`Using downloaded version of \`${id}\``)
    } else {
      await cacheDirectory()
      const jarPath = path.join(settings.cache_directory.value, id + ".jar")
      if (await exists(jarPath)) {
        jar = parseZip((await fs.promises.readFile(jarPath)).buffer)
        output.log(`Using cached version of \`${id}\``)
      } else {
        output.log(`\`${id}\` was not found on your computer, downloading…`)
        const version = await getVersionData(id)
        const client = await fetch(version.downloads.client.url).then(e => e.arrayBuffer())
        fs.promises.writeFile(jarPath, new Uint8Array(client))
        output.log(`\`${id}\` downloaded`)
        jar = parseZip(client)
      }
    }
    return jar
  }

  function objectsEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true
    }
    if (obj1 == null || typeof obj1 !== "object" || obj2 == null || typeof obj2 !== "object") {
      return false
    }
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      return false
    }
    for (const key of keys1) {
      if (!(key in obj2) || !objectsEqual(obj1[key], obj2[key])) {
        return false
      }
    }
    return true
  }

  function getRoot(id) {
    const version = getVersion(id)
    if (Date.parse(version.releaseTime) >= 1403106748000 || version.data.assets === "1.7.10") {
      return "assets"
    }
    return "assets/minecraft"
  }

  function langToJSON(lang) {
    return Object.fromEntries(lang.split("\n").map(e => e.split(/=(.*)/).filter(e => e)).filter(e => e.length === 2))
  }

  function jsonToLang(json) {
    return Object.entries(json).map(e => e.join("=")).join("\n")
  }

  function sortUtilities() {
    action2.children.sort((a, b) => {
      if (a.name === "Show all") return -Infinity
      if (b.name === "Show all") return Infinity
      return storage.favourites.findIndex(e => e === a.id) - storage.favourites.findIndex(e => e === b.id)
    })
  }

  function getDate() {
    return new Date().toISOString().replace(/T/, "_").replace(/:/g, "-").split(".")[0]
  }

  function formatFilePaths(paths) {
    const tree = {}
    paths.map(filePath => filePath.split(/\/|\\/)).forEach(filePath => {
      let branch = tree
      filePath.slice(0, -1).forEach(directory => {
        if (!branch[directory]) {
          branch[directory] = {}
        }
        branch = branch[directory]
      })
      branch[filePath[filePath.length - 1]] = true
    })

    const lines = []
    function branchToString(branch, indentLevel = 0) {
      for (const [key, value] of Object.entries(branch)) {
        lines.push("  ".repeat(indentLevel) + key)
        if (typeof value === "object") {
          branchToString(value, indentLevel + 1)
        }
      }
    }
    branchToString(tree)

    return lines.join("\n")
  }

  function rowBlank(imageData, width, y) {
    for (let x = 0; x < width; ++x) if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false
    return true
  }

  function columnBlank(imageData, width, x, top, bottom) {
    for (let y = top; y < bottom; ++y) if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false
    return true
  }

  class Canvas extends CanvasFrame {
    constructor(width, height) {
      super(width, height)
      this.canvas.ctx = this.ctx
      this.canvas.trim = this.trim
      return this.canvas
    }

    trim() {
      const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
      let top = 0, bottom = imageData.height, left = 0, right = imageData.width
      while (top < bottom && rowBlank(imageData, this.width, top)) ++top
      while (bottom - 1 > top && rowBlank(imageData, this.width, bottom - 1)) --bottom
      while (left < right && columnBlank(imageData, this.width, left, top, bottom)) ++left
      while (right - 1 > left && columnBlank(imageData, this.width, right - 1, top, bottom)) --right
      if (top === bottom && bottom === left && left === right) {
        this.width = 1
        this.height = 1
        return this
      }
      const trimmed = this.ctx.getImageData(left, top, right - left, bottom - top);
      const copy = new Canvas(this.width, this.height)
      copy.width = trimmed.width
      copy.height = trimmed.height
      copy.ctx.putImageData(trimmed, 0, 0)
      this.width = copy.width
      this.height = copy.height
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.drawImage(copy, 0, 0)
      return this
    }
  }

  function imageToCanvas(img) {
    const canvas = new Canvas(img.width, img.height)
    canvas.ctx.drawImage(img, 0, 0)
    return canvas
  }

  function arrayBufferToBase64(buffer) {
    let binary = ""
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192))
    }
    return btoa(binary)
  }

  async function getObject(filePath, version, assetsIndex) {
    if (!assetsIndex) {
      assetsIndex = await getVersionAssetsIndex(version)
    }
    const root = getRoot(version)
    const data = assetsIndex.objects[filePath.slice(root.length + 1)]
    const objectPath = `${data.hash.slice(0, 2)}/${data.hash}`
    const vanillaObjectPath = path.join(settings.minecraft_directory.value, "assets", "objects", objectPath)
    if (await exists(vanillaObjectPath)) {
      return fs.promises.readFile(vanillaObjectPath)
    }
    const cacheObjectPath = path.join(settings.cache_directory.value, "objects", objectPath)
    if (await exists(cacheObjectPath)) {
      return fs.promises.readFile(cacheObjectPath)
    }
    const object = Buffer.from(await fetch(`https://resources.download.minecraft.net/${objectPath}`).then(e => e.arrayBuffer()))
    await fs.promises.mkdir(path.dirname(cacheObjectPath), { recursive: true })
    await fs.promises.writeFile(cacheObjectPath, object)
    output.log(`Downloaded \`${filePath}\` to the cache`)
    return object
  }

  // Constants

  const header = `Generated by the Resource Pack Utilities plugin for Blockbench: https://ewanhowell.com/plugins/${id.replace(/_/g, "-")}/\n\n`

  const releasePattern = new RegExp("^[\\d\\.]+$")
  const invalidDirPattern = new RegExp('[\\\\/:*?"<>|`]')
  const simpleFilePattern = new RegExp("\\.(fsh|vsh|glsl|txt|ogg|zip|icns)$")

  const batchExporterFormats = Object.fromEntries(Object.entries(Formats).filter(([id, format]) => format.codec?.compile && format.codec.extension && format.codec.extension !== "bbmodel").map(e => [e[0], {
    name: e[1].name,
    type: e[1].codec?.extension
  }]))

  const batchExporterSpecialFormats = ["gltf", "obj", "fbx", "collada"]

  Object.assign(batchExporterFormats, {
    gltf: {
      name: "glTF",
      type: "gltf"
    },
    obj: {
      name: "OBJ",
      type: "obj"
    },
    fbx: {
      name: "FBX",
      type: "fbx"
    },
    collada: {
      name: "Collada (dae)",
      type: "dae"
    }
  })

  const components = {
    folderSelector: {
      props: {
        value: {},
        placeholder: {
          default: "Folder"
        }
      },
      data() {
        return {
          folder: this.value ?? ""
        }
      },
      watch: {
        value(newVal) {
          this.folder = newVal
        }
      },
      methods: {
        selectFolder(title = "folder") {
          const dir = Blockbench.pickDirectory({
            title: `Select the ${title}`,
            startpath: this.folder || path.join(settings.minecraft_directory.value, "resourcepacks")
          })
          if (dir) {
            this.folder = dir
            this.$emit("input", this.folder)
          }
        },
        input() {
          this.$emit("input", this.folder)
        },
        formatPath
      },
      computed: {
        buttonText() {
          return this.$slots.default[0].text
        }
      },
      styles: `
        .folder-selector {
          display: flex;
          cursor: pointer;
        }

        input {
          flex: 1;
          pointer-events: none;
          direction: rtl;
          text-overflow: ellipsis;
          text-align: left;
        }
      `,
      template: `
        <div class="folder-selector" @click="selectFolder(buttonText)">
          <input disabled type="text" :value="formatPath(folder)" :placeholder="'Select ' + placeholder">
          <button class="material-icons">folder_open</button>
        </div>
      `
    },
    checkboxRow: {
      props: ["value", "disabled"],
      styles: `
        label {
          display: flex;
          gap: 4px;
          align-items: center;
          cursor: pointer;

          * {
            cursor: pointer;
          }

          &.disabled {
            cursor: not-allowed;

            * {
              color: var(--color-subtle_text);
              cursor: not-allowed;
            }
          }
        }
      `,
      template: `
        <label :class="{ disabled }">
          <input type="checkbox" :checked="value" :disabled="disabled" @input="$emit('input', $event.target.checked)">
          <div><slot></slot></div>
        </label>
      `
    },
    radioRow: {
      props: ["value", "options"],
      data() {
        return {
          name: "radio-" + Math.random()
        }
      },
      watch: {
        value(val) {
          this.$emit("input", val)
        }
      },
      styles: `
        input {
          min-width: 30px;
          text-align: center;
        }

        label {
          display: flex;
          gap: 4px;
          cursor: pointer;
          align-items: center;

          * {
            cursor: pointer;
          }
        }
      `,
      template: `
        <label v-for="[id, text] in options">
          <input type="radio" :name="name" :value="value" :checked="id === value" @input="value = id">
          <div>{{ text }}</div>
        </label>
      `
    },
    inputRow: {
      props: ["value", "placeholder", "width", "required"],
      styles: `
        display: flex;
        gap: 8px;
        align-items: center;

        input {
          flex: 1;
        }

        .required {
          border: 1px solid var(--color-error);
          animation: shake .5s ease-in-out;
        }
      `,
      template: `
        <div :style="{ width: width ? width + 'px' : 'initial' }"><slot></slot>:</div>
        <input type="text" :class="{ required }" :placeholder="placeholder" :value="value" @input="$emit('input', $event.target.value)">
      `
    },
    ignoreList: {
      props: ["value"],
      data() {
        return {
          newWord: "",
          ignoreList: this.value
        }
      },
      watch: {
        value(val) {
          this.ignoreList = val
        },
        ignoreList(val) {
          this.$emit("input", val)
        }
      },
      methods: {
        addWord() {
          if (this.newWord && !this.ignoreList.includes(this.newWord.toLowerCase())) {
            this.ignoreList.push(this.newWord.toLowerCase())
          }
          this.newWord = ""
          setTimeout(() => this.$refs.input.focus(), 0)
        },
        load() {
          Blockbench.import({
            title: "Load Ignore List",
            extensions: ["json"],
            type: "JSON"
          }, files => {
            try {
              const data = JSON.parse(files[0].content)
              if (!Array.isArray(data) || data.some(e => typeof e !== "string")) {
                throw new Error
              }
              this.ignoreList = Array.from(new Set(data.map(e => e.toLowerCase().trim())))
            } catch {
              Blockbench.showQuickMessage("Invalid ignore list")
            }
          })
        },
        save() {
          if (!this.ignoreList.length) {
            Blockbench.showQuickMessage("The ignore list is empty")
            return
          }
          Blockbench.export({
            extensions: ["json"],
            type: "JSON",
            name: "ignore_list",
            content: JSON.stringify(this.ignoreList, null, 2)
          }, () => Blockbench.showQuickMessage("Exported Ignore List"))
        }
      },
      styles: `
        display: flex;
        flex-direction: column;
        gap: 8px;

        > div {
          display: flex;
        }

        input {
          flex: 1;
        }

        ul {
          background-color: var(--color-back);
          border: 1px solid var(--color-border);
          height: 128px;
          overflow-y: auto;
        }

        li {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: space-between;
          padding-left: 8px;
          background-color: var(--color-ui);

          &:not(:first-child) {
            margin-top: 1px;
          }

          button {
            opacity: 0;
          }

          &:hover button {
            opacity: 1;
          }
        }

        .ignore-list-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: -8px;

          h3 {
            flex: 1;
            margin: 0;
          }

          .tool {
            margin: 0;
            width: initial;
            height: initial;
            cursor: pointer;
          }

          i {
            margin: 0;
          }
        }
      `,
      template: `
        <div class="ignore-list-header">
          <h3>Ignore List</h3>
          <div class="tool" @click="load">
            <div class="tooltip">Load Ignore List</div>
            <i class="material-icons">upload</i>
          </div>
          <div class="tool" @click="save">
            <div class="tooltip">Export Ignore List</div>
            <i class="material-icons">save</i>
          </div>
        </div>
        <p>Files and folders that include these terms will<br>be ignored</p>
        <div>
          <input type="text" placeholder="Enter term" v-model="newWord" ref="input" @keydown.enter="addWord">
          <button class="material-icons" @click="addWord">add</button>
        </div>
        <ul>
          <li v-for="(term, index) in ignoreList" :key="index">
            <span>{{ term }}</span>
            <button class="material-icons icon" @click="ignoreList.splice(index, 1)">close</button>
          </li>
        </ul>
      `
    },
    outputLog: {
      props: {
        value: {},
        small: {
          type: Boolean
        }
      },
      data() {
        return {
          logs: this.value,
          waiting: false
        }
      },
      watch: {
        value(val) {
          if (this.waiting) return
          this.waiting = true
          setTimeout(() => {
            this.logs = val.slice()
            this.waiting = false
          }, 100)
        },
        logs() {
          if (this.$refs.log.scrollTop >= this.$refs.log.scrollHeight - this.$refs.log.clientHeight) {
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          }
        }
      },
      methods: {
        scrollToBottom() {
          const container = this.$refs.log
          container.scrollTop = container.scrollHeight
        },
        copy() {
          navigator.clipboard.writeText(this.value.map(e => e[1]).join("\n\n").replaceAll("`", ""))
          Blockbench.showQuickMessage("Log copied")
        },
        save() {
          Blockbench.export({
            extensions: ["log"],
            type: "Log file",
            name: "log",
            content: this.value.map(e => e[1]).join("\n\n").replaceAll("`", "")
          }, () => Blockbench.showQuickMessage("Saved log"))
        }
      },
      styles: `
        .log {
          height: 256px;
          overflow-y: auto;
          overflow-x: hidden;
          font-family: var(--font-code);
          background-color: var(--color-back);
          border: 1px solid var(--color-border);

          > * {
            user-select: text;
            cursor: text;
            white-space: pre-wrap;
            max-width: 100%;
            overflow-wrap: anywhere;
            padding: 4px 4px 4px 24px;
            position: relative;
            font-size: 13px;

            &:not(:last-child) {
              border-bottom: 1px solid var(--color-border);
            }

            &::before {
              content: ">";
              position: absolute;
              left: 8px;
            }

            code {
              background-color: var(--color-dark);
              border-color: var(--color-dark);
            }
          }

          .info {
            background-color: color-mix(in srgb, var(--color-accent) 25%, transparent);
          }

          .warn {
            background-color: color-mix(in srgb, var(--color-warning) 25%, transparent);
          }

          .error {
            background-color: color-mix(in srgb, var(--color-error) 25%, transparent);
          }

          span {
            color: var(--color-accent);
            text-decoration: underline;
            cursor: pointer; 
          }
        }

        .small {
          height: 128px;
        }

        .buttons {
          display: flex;
          gap: 8px;
          margin-top: 8px;

          button {
            flex: 1;
          }
        }
      `,
      template: `
        <div class="log" ref="log" :class="{ small }">
          <div v-if="logs.length > 1000" class="warning">{{ (logs.length - 1000).toLocaleString() }} log entries are not displayed. <span @click="save">Save Log</span> to see the full log</div>
          <div v-for="(log, index) in logs.slice(-1000)" :key="index" :class="log[0]" v-html="log[1].replace(/\`([^\`]*)\`/g, '<code>$1</code>').replaceAll('\uE000', '\`')"></div>
        </div>
        <div class="buttons">
          <button @click="copy">
            <i class="material-icons">content_copy</i>
            <span>Copy Log</span>
          </button>
          <button @click="save">
            <i class="material-icons">save</i>
            <span>Save Log</span>
          </button>
        </div>
      `
    },
    progressBar: {
      props: ["done", "total"],
      data() {
        return {
          displayedDone: 0,
          waiting: false
        }
      },
      watch: {
        done(val) {
          if (this.waiting) return
          this.waiting = true
          setTimeout(() => {
            this.displayedDone = this.done
            this.waiting = false
          }, 500)
        }
      },
      computed: {
        progressPercentage() {
          if (!this.displayedDone) return 0
          return Math.round(this.displayedDone / this.total * 100)
        }
      },
      styles: `
        display: flex;
        flex-direction: column;
        gap: 8px;

        .progress-bar-container {
          width: 100%;
          height: 24px;
          background-color: var(--color-back);
          position: relative;
        }

        .progress-bar {
          height: 100%;
          background-color: var(--color-accent);
          position: absolute;
          top: 4px;
          left: 4px;
          height: 16px;
          transition: width .5s ease;
        }

        div {
          text-align: center;
        }
      `,
      template: `
        <div class="progress-text">{{ total === null ? "Loading…" : displayedDone === total ? "Finished" : "Processing…" }}</div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: 'calc(' + progressPercentage + '% - 8px)' }"></div>
        </div>
        <div v-if="typeof total === 'number' && total">{{ displayedDone }} / {{ total }} - {{ progressPercentage }}%</div>
        <div v-else>{{ progressPercentage }}%</div>
      `
    },
    versionSelector: {
      props: {
        value: {},
        width: {
          default: 120
        }
      },
      data() {
        return {
          version: this.value || manifest.versions.find(e => releasePattern.test(e.id))?.id,
          snapshots: this.value ? !releasePattern.test(this.value) : false,
          manifest,
          releasePattern
        }
      },
      watch: {
        manifest: {
          handler(val) {
            if (this.value) return
            if (this.snapshots) {
              this.version = val.versions.find(e => !releasePattern.test(e.id)).id
            } else {
              this.version = val.versions.find(e => releasePattern.test(e.id)).id
            }
          },
          deep: true
        },
        version: {
          handler(val) {
            this.$emit("input", val)
          },
          immediate: true
        }
      },
      methods: {
        change() {
          this.version = this.manifest.versions.find(e => this.snapshots ? !releasePattern.test(e.id) : releasePattern.test(e.id)).id
        }
      },
      styles: `
        display: flex;
        align-items: center;
        gap: 8px;

        bb-select {
          flex: 1;
          min-width: 100px;
          cursor: pointer;
        }

        label {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;

          * {
            cursor: pointer;
          }
        }
      `,
      template: `
        <div :style="{ width: width + 'px' }">Minecraft Version:</div>
        <select-input v-model="version" :options="Object.fromEntries(manifest.versions.filter(e => snapshots ? !releasePattern.test(e.id) : releasePattern.test(e.id)).map(e => [e.id, e.id]))" @input="$emit('update:version', version)" />
        <label>
          <input type="checkbox" v-model="snapshots" @change="change">
          <div>Snapshots</div>
        </label>
      `
    },
    selectRow: {
      props: ["value", "options", "width"],
      watch: {
        value(val) {
          this.$emit("input", val)
        }
      },
      styles: `
        display: flex;
        gap: 8px;
        align-items: center;

        bb-select {
          flex: 1;
          cursor: pointer;
        }
      `,
      template: `
        <div :style="{ width: width ? width + 'px' : 'initial' }"><slot></slot>:</div>
        <select-input v-model="value" :options="options" />
      `
    },
    fileInput: {
      props: {
        value: {},
        type: {
          default: "PNG",
        },
        extensions: {
          default: ["png"]
        },
        multiple: {
          type: Boolean
        },
        max: {},
        title: {}
      },
      data() {
        const maxFiles = parseInt(this.max)
        const multipleFiles = this.multiple || parseInt(this.max) > 1
        this.title ??= `Select ${ maxFiles ? "up to " + maxFiles : "" } ${ multipleFiles ? "files" : "a file" }`
        return {
          files: Array.isArray(this.value) ? this.value : this.value ? [this.value] : [],
          message: `select ${ maxFiles ? "up to " + maxFiles : "" } ${ multipleFiles ? "files" : "a file" }`,
          maxFiles,
          multipleFiles
        }
      },
      methods: {
        async changeFiles() {
          Blockbench.import({
            title: this.title,
            extensions: this.extensions,
            type: this.type,
            multiple: this.multipleFiles,
            readtype: "buffer"
          }, async files => {
            if (files.length === 1 && this.type === "PNG") this.message = "change file"
            else if (files.length === 1) this.message = files[0].name
            else this.message = `${files.length} files selected`
            this.files = []
            for (const [i, file] of files.entries()) {
              if (this.maxFiles && i >= this.maxFiles) {
                continue
              }
              const buf = Buffer.from(file.content)
              const data = {}
              if (this.type === "PNG") {
                const b64Image = buf.toString("base64")
                const img = await loadImage(buf)
                data.image = img
                data.src = `data:image/png;base64,${b64Image}`
                data.info = `${file.name}\n${img.width.toLocaleString()}x${img.height.toLocaleString()} - ${formatBytes(file.content.byteLength)}`
              }
              data.content = buf
              data.path = file.path
              this.files.push(data)
            }
            this.$emit("input", Array.isArray(this.value) ? this.files : this.files[0])
          })
        },
        remove(index) {
          event.stopPropagation()
          this.files.splice(index, 1)
          this.$emit("input", Array.isArray(this.value) ? this.files : this.files[0])
          if (!this.files.length) this.message = `select ${ this.maxFiles ? "up to " + this.maxFiles : "" } ${ this.multipleFiles ? "files" : "a file" }`
          else if (this.files.length === 1) this.message = "change file"
          else this.message = `${this.files.length} files selected`
        },
        prev(index) {
          const file = this.files[index - 1]
          this.$set(this.files, index - 1, this.files[index])
          this.$set(this.files, index, file)
          this.$emit("input", this.files)
        },
        next(index) {
          const file = this.files[index + 1]
          this.$set(this.files, index + 1, this.files[index])
          this.$set(this.files, index, file)
          this.$emit("input", this.files)
        }
      },
      styles: `
        background-color: var(--color-back);
        border: 1px solid var(--color-border);

        > div {
          padding: 16px;
          user-select: none;
          position: relative;
          text-shadow: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: flex-start;

          &:not(:has(.file-input-images:hover)):hover button {
            background-color: var(--color-accent);
            color: var(--color-accent_text);
          }

          &:not(:has(.file-input-images:focus)):focus button {
            text-decoration: underline;
          }
        }

        * {
          cursor: pointer;
        }

        .file-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 100%;
        }

        .file-input-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-input-images {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          position: relative;
          z-index: 1;
          margin: 0 -16px -16px;
          padding: 0 16px 6px;
          width: calc(100% + 32px);
          cursor: default;
          justify-content: safe center;

          * {
            cursor: default;
          }

          > div {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: var(--color-subtle_text);
            align-items: center;
            gap: 4px;
            white-space: pre;
            text-align: center;
            font-weight: 600;

            &:first-child .prev {
              display: none;
            }

            &:last-child .next {
              display: none;
            }
          }
        }

        .file-image {
          position: relative;
          display: flex;

          & img {
            height: 128px;
            display: block;
          }

          .icon {
            position: absolute;
            color: var(--color-light);
            top: 64px;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 32px;
            min-width: 32px;
            filter: drop-shadow(0 2px 3px #000);
            opacity: 0;

            &:hover {
              transform: translateY(-50%) scale(1.4);
            }
          }

          &:hover .icon {
            opacity: 1;
          }
        }

        .prev {
          left: 0;
        }

        .next {
          right: 0;
        }

        .remove {
          top: 0 !important;
          right: 0;
          font-size: 24px !important;
          padding: 4px;
          transform: initial !important;

          &:hover {
            transform: scale(1.2) !important;
          }
        }
      `,
      template: `
        <div @click="changeFiles" tabindex="0">
          <div class="file-input-row">
            <button>
              <i class="material-icons icon">upload</i>
              <span>Choose file{{ multipleFiles ? 's' : '' }}</span>
            </button>
            <span class="file-input-text">{{ this.message }}</span>
          </div>
          <div v-if="type === 'PNG' && files.length" class="file-input-images" tabindex="0" @click.stop>
            <div v-for="(file, index) in files">
              <div class="file-image">
                <img class="checkerboard" :src="file.src">
                <i class="remove material-icons icon" @click="remove(index)">close</i>
                <i class="prev material-icons icon" @click="prev(index)">navigate_before</i>
                <i class="next material-icons icon" @click="next(index)">navigate_next</i>
              </div>
              <div>{{ file.info }}</div>
            </div>
          </div>
        </div>
      `
    },
    canvasOutput: {
      props: {
        value: {},
        name: {
          default: "image",
        },
        type: {
          default: "PNG"
        },
        error: {},
        height: {}
      },
      mounted() {
        this.appendCanvas()
      },
      watch: {
        value() {
          this.appendCanvas()
        },
        error() {
          this.appendCanvas()
        }
      },
      methods: {
        async appendCanvas() {
          if (this.value) {
            this.$refs.canvasContainer.textContent = ""
            if (this.type === "GIF") {
              const img = document.createElement("img")
              img.src = `data:image/gif;base64,${arrayBufferToBase64(this.value)}`
              this.$refs.canvasContainer.append(img)
              this.$refs.canvasInfo.textContent = `${this.name}.gif\n${this.value[6] + (this.value[7] << 8)}x${this.value[8] + (this.value[9] << 8)} - ${formatBytes(this.value.length)}`
            } else {
              this.value.classList.add("checkerboard")
              if (this.height) {
                this.value.style.height = this.height + "px"
              }
              this.$refs.canvasContainer.append(this.value)
              this.$refs.canvasInfo.textContent = `${this.name}.png\n${this.value.width}x${this.value.height} - ${formatBytes((await (await new Promise(fulfil => this.value.toBlob(fulfil))).arrayBuffer()).byteLength)}`
            }
          } else {
            if (this.error) {
              this.$refs.canvasContainer.innerHTML = `<span class="canvas-output-error">${this.error}</span>`
            } else {
              this.$refs.canvasContainer.textContent = "No output yet…"
            }
            this.$refs.canvasInfo.textContent = ""
          }
        },
        async copy() {
          const r = await fetch(this.value.toDataURL())
          navigator.clipboard.write([new ClipboardItem({ "image/png": await r.blob() })])
          Blockbench.showQuickMessage("Copied to clipboard…")
        },
        save() {
          if (this.type === "GIF") {
            Blockbench.export({
              extensions: ["gif"],
              type: "GIF",
              name: this.name,
              savetype: "binary",
              content: this.value
            }, () => Blockbench.showQuickMessage("Saved…"))
          } else {
            Blockbench.export({
              extensions: [this.type.toLowerCase()],
              type: this.type,
              name: this.name,
              savetype: "image",
              content: this.value.toDataURL()
            }, () => Blockbench.showQuickMessage("Saved…"))
          }
        }
      },
      styles: `
        display: flex;
        flex-direction: column;
        gap: 8px !important;
        flex: 1;

        .canvas-container {
          background-color: var(--color-back);
          border: 1px solid var(--color-border);
          padding: 16px;
          font-size: 14px;
          color: var(--color-subtle_text);
          display: flex;
          flex-direction: column;
          align-items: center;
          white-space: pre;
          text-align: center;
          gap: 4px;
          font-weight: 600;

          > :first-child {
            overflow-x: auto;
            max-width: 100%;
          }

          > :empty {
            display: none;
          }
        }

        canvas, img {
          height: 256px;
          display: block;
        }

        .canvas-output-error {
          color: var(--color-error);
        }
      `,
      template: `
        <div class="canvas-container" :style="{ paddingBottom: value ? '6px' : '16px' }">
          <div ref="canvasContainer"></div>
          <div ref="canvasInfo"></div>
        </div>
        <div class="button-row" @click="save">
          <button :disabled="!value">
            <i class="material-icons icon">save</i>
            <span>Save</span>
          </button>
          <button v-if="type !== 'GIF'" :disabled="!value" @click="copy">
            <i class="material-icons icon">content_copy</i>
            <span>Copy</span>
          </button>
        </div>
      `
    },
    tabSelect: {
      props: ["value", "options"],
      watch: {
        value(val) {
          this.$emit("input", val)
        }
      },
      styles: `
        li {
          flex: 1 1 0px;
        }
      `,
      template: `
        <ul class="form_inline_select">
          <li v-for="(name, id) in options" :class="{ selected: id === value }" @click="value = id">{{ name }}</li>
        </ul>
      `
    },
    numSlider: {
      props: {
        value: {},
        min: {
          default: 0
        },
        max: {
          default: 100
        },
        step: {
          default: 1
        }
      },
      watch: {
        value(val) {
          this.$emit("input", val)
        }
      },
      template: `
        <div class="bar slider_input_combo">
          <input type="range" class="tool disp_range" v-model.number="value" :min="min" :max="max" :step="step" />
          <numeric-input class="tool disp_text" v-model.number="value" :min="min" :max="max" :step="step" />
        </div>
      `
    },
    numInputRow: {
      props: {
        value: {},
        min: {
          default: 0
        },
        max: {
          default: 100
        },
        step: {
          default: 1
        },
        width: {}
      },
      watch: {
        value(val) {
          this.$emit("input", val)
        }
      },
      styles: `
        display: flex;
        gap: 8px;
        align-items: center;
      `,
      template: `
        <div :style="{ width: width ? width + 'px' : 'initial' }"><slot></slot>:</div>
        <numeric-input class="tool disp_text" v-model.number="value" :min="min" :max="max" :step="step" />
      `
    }
  }

  const utilities = {
    jsonOptimiser: {
      name: "JSON Optimiser",
      icon: "code",
      tagline: "Optimise every JSON file in a folder.",
      description: "JSON Optimiser is a tool that will go through all JSON files in a folder and optimise them to be as small as possible, minifying them and removing any unnecessary data.",
      info: `
        <h3>Changes that JSON Optimiser makes:</h3>
        <ul>
          <li>Minifies <code>.json</code>, <code>.mcmeta</code>, <code>.jem</code>, and <code>.jpm</code> files</li>
          <li>Removes default credits. Custom credits are kept</li>
          <li>Removes unnecessary keys</li>
          <li>For block/item model <code>.json</code> files
            <ul>
              <li>Removes the <code>groups</code> object</li>
              <li>For the <code>rotation</code> object:
                <ul>
                  <li>Removes the <code>rotation</code> object when <code>angle</code> is set to <code>0</code></li>
                  <li>Removes the <code>rescale</code> property when it is set to <code>false</code></li>
                </ul>
              </li>
              <li>For the <code>faces</code> object:
                <ul>
                  <li>Removes the <code>rotation</code> property when it is set to <code>0</code></li>
                  <li>Removes the <code>tintindex</code> property when it is set to <code>-1</code></li>
                  <li>Removes empty <code>face</code> objects</li>
                </ul>
              </li>
              <li>Removes the <code>shade</code> property when it is set to <code>true</code></li>
              <li>Removes the <code>light_emission</code> property when it is set to <code>0</code></li>
              <li>Removes empty <code>elements</code> arrays</li>
            </ul>
          </li>
          <li>For animation <code>.mcmeta</code> files
            <ul>
              <li>Removes the file when the texture it is for does not exist</li>
              <li>Removes the <code>interpolate</code> property when it is set to<code>false</code></li>
              <li>Removes the <code>frametime</code> property when it is set to<code>1</code></li>
              <li>Removes the <code>width</code> property when the frames are square</li>
              <li>Removes the <code>height</code> property when the frames are square</li>
              <li>For the <code>frames</code> array
                <ul>
                  <li>Removes the <code>time</code> property when it matches the main <code>frametime</code> property</li>
                  <li>Removes the <code>frames</code> array when all the frames are present, in order, and match the main <code>frametime</code> property</li>
                  <li>Changes most common <code>time</code> property to be the main <code>frametime</code> property, and makes old the main <code>frametime</code> property into the <code>time</code> properties</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>For OptiFine CEM <code>.jem</code>/<code>.jpm</code> files
            <ul>
              <li>Removes the <code>animations</code> array when it is empty</li>
              <li>Removes the <code>translation</code> array when all axes are set to <code>0</code></li>
              <li>Removes the <code>rotation</code> array when all axes are set to <code>0</code></li>
              <li>Removes the <code>scale</code> property when it is set to <code>1</code></li>
              <li>Removes empty <code>boxes</code> arrays</li>
              <li>Removes empty <code>sprites</code> arrays</li>
              <li>Removes empty <code>submodel</code> objects</li>
              <li>Removes empty <code>submodels</code> arrays</li>
            </ul>
          </li>
        </ul>
      `,
      component: {
        data: {
          folder: "",
          types: {
            json: true,
            mcmeta: true,
            jem: true,
            jpm: true
          },
          minify: true,
          ignoreList: [],
          outputLog,
          done: 0,
          total: null,
          cancelled: false
        },
        methods: {
          async execute() {
            if (!await confirm("Run JSON Optimiser?", `Are you sure you want to run JSON Optimiser over the following folder:\n<code>${formatPath(this.folder)}</code>\n\nMake a backup first if you would like to keep an un-optimised version of the folder.`)) return

            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false

            if (!await exists(this.folder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The folder \`${formatPath(this.folder)}\` was not found`)
              return
            }

            const mcmetaKeys = [ "credit", "animation", "villager", "texture", "pack", "language", "filter", "overlays", "gui" ]
            const animationKeys = [ "interpolate", "width", "height", "frametime", "frames" ]
            const jemKeys = [ "credit", "texture", "textureSize", "shadowSize", "models" ]
            const modelKeys = [ "model", "id", "part", "attach", "scale", "animations" ]
            const partKeys = [ "id", "texture", "textureSize", "invertAxis", "translate", "rotate", "mirrorTexture", "boxes", "sprites", "submodel", "submodels" ]
            const boxKeys = [ "textureOffset", "uvDown", "uvUp", "uvNorth", "uvSouth", "uvWest", "uvEast", "coordinates", "sizeAdd" ]
            const spriteKeys = [ "textureOffset", "coordinates", "sizeAdd" ]
            const elementKeys = [ "from", "to", "rotation", "faces", "shade", "light_emission" ]
            const faceKeys = [ "uv", "texture", "cullface", "rotation", "tintindex" ]
            modelKeys.push(...partKeys)

            function processPart(part, rootMode) {
              for (const key in part) {
                if (!(rootMode ? partKeys.concat(modelKeys) : partKeys).includes(key)) delete part[key]
              }
              if (part.translate && part.translate.every(e => !e)) delete part.translate
              if (part.rotate && part.rotate.every(e => !e)) delete part.rotate
              if (part.scale === 1) delete part.scale
              if (part.boxes) {
                for (const box of part.boxes) {
                  for (const key in box) {
                    if (!boxKeys.includes(key)) delete box[key]
                  }
                }
                part.boxes = part.boxes.filter(e => Object.keys(e).length)
                if (!part.boxes.length) delete part.boxes
              }
              if (part.sprites) {
                for (const sprite of part.sprites) {
                  for (const key in sprite) {
                    if (!spriteKeys.includes(key)) delete sprite[key]
                  }
                }
                part.sprites = part.sprites.filter(e => Object.keys(e).length)
                if (!part.sprites.length) delete part.sprites
              }
              if (part.submodel) {
                processPart(part.submodel)
                if (!Object.keys(part.submodel).length) delete part.submodel
              }
              if (part.submodels) {
                for (const submodel of part.submodels) {
                  processPart(submodel)
                }
                part.submodels = part.submodels.filter(e => Object.keys(e).length)
                if (!part.submodels.length) delete part.submodels
              }
            }

            const files = []
            for await (const file of getFiles(this.folder)) {
              const shortened = formatPath(file.slice(this.folder.length)).replace(/^\//, "")
              if (
                (file.endsWith(".json") && !this.types.json) ||
                (file.endsWith(".mcmeta") && !this.types.mcmeta) ||
                (file.endsWith(".jem") && !this.types.jem) ||
                (file.endsWith(".jpm") && !this.types.jpm) ||
                !(file.endsWith(".json") || file.endsWith(".mcmeta") || file.endsWith(".jem") || file.endsWith(".jpm")) ||
                this.ignoreList.some(item => shortened.toLowerCase().includes(item))
              ) continue
              files.push([file, shortened])
            }

            this.total = files.length

            let beforeTotal = 0
            let afterTotal = 0

            for (const [file, shortened] of files) {
              if (this.cancelled) break
              const before = (await fs.promises.stat(file)).size
              beforeTotal += before
              let data
              try {
                data = JSON.parse((await fs.promises.readFile(file, "utf-8")).trim())
              } catch (err) {
                output.error(`Skipping \`${shortened}\` as it could not be read`)
                this.done++
                continue
              }
              if (data.credit === "Made with Blockbench") delete data.credit
              if (this.types.json && file.endsWith(".json")) {
                delete data.groups
                if (data.elements) {
                  for (const element of data.elements) {
                    for (const key in element) {
                      if (!elementKeys.includes(key)) delete element[key]
                    }
                    if (element.rotation) {
                      if (element.rotation.angle === 0) delete element.rotation
                      else {
                        if (element.rotation.rescale === false) delete element.rotation.rescale
                      }
                    }
                    if (element.faces) {
                      for (const [key, face] of Object.entries(element.faces)) {
                        for (const key in face) {
                          if (!faceKeys.includes(key)) delete face[key]
                        }
                        if (face.rotation === 0) delete face.rotation
                        if (face.tintindex === -1) delete face.tintindex
                        if (!Object.keys(face).length) delete element.faces[key]
                      }
                    }
                    if (element.shade) delete element.shade
                    if (element.light_emission === 0) delete element.light_emission
                  }
                  data.elements = data.elements.filter(e => e.faces && Object.keys(e.faces).length)
                }
              }
              if (this.types.mcmeta && file.endsWith(".mcmeta")) {
                if (file.endsWith(".png.mcmeta")) {
                  if (!fs.existsSync(file.slice(0, -7))) {
                    fs.rmSync(file)
                    output.log(`\`${shortened}\`\nBefore: ${formatBytes(before)}\nAfter: 0 B`)
                    this.done++
                    continue
                  }
                }
                for (const key in data) {
                  if (!mcmetaKeys.includes(key)) delete data[key]
                }
                if (data.pack) {
                  for (const key in data.pack) {
                    if (!(key === "pack_format" || key === "supported_formats" || key === "description")) delete data.pack[key]
                  }
                } else if (data.animation) {
                  for (const key in data.animation) {
                    if (!animationKeys.includes(key)) delete data.animation[key]
                  }
                  if (data.animation.interpolate === false) delete data.animation.interpolate
                  if (data.animation.frametime === 1) delete data.animation.frametime
                  if (data.animation.width && !data.animation.height) {
                    const img = await loadImage(file.slice(0, -7))
                    if (data.animation.width === img.height) delete data.animation.width
                  }
                  if (data.animation.height && !data.animation.width) {
                    const img = await loadImage(file.slice(0, -7))
                    if (data.animation.height === img.width) delete data.animation.height
                  }
                  if (data.animation.frames) {
                    const frametime = data.animation.frametime ?? 1
                    data.animation.frames = data.animation.frames.map(e => {
                      if (e.time === frametime) return e.index
                      return e
                    })
                    if (data.animation.frames.every((e, i) => e === i)) {
                      const img = await loadImage(file.slice(0, -7))
                      if (data.animation.frames.length === img.height / img.width) delete data.animation.frames
                    } else {
                      const times = new Map
                      data.animation.frames.forEach(e => {
                        if (typeof e === "number") {
                          times.set(frametime, (times.get(frametime) ?? 0) + 1)
                        } else {
                          times.set(e.time, (times.get(e.time) ?? 0) + 1)
                        }
                      })
                      const largest = Array.from(times).reduce((a, e) => {
                        if (a[1] > e[1]) return a
                        return e
                      }, [1, 0])
                      if (frametime !== largest[0]) {
                        data.animation.frametime = largest[0]
                        data.animation.frames = data.animation.frames.map(e => {
                          if (typeof e === "number") return {
                            index: e,
                            time: frametime
                          }
                          if (e.time === largest[0]) return e.index
                          return e
                        })
                      }
                    }
                  }
                }
              }
              if (this.types.jem && file.endsWith(".jem")) {
                for (const key in data) {
                  if (!jemKeys.includes(key)) delete data[key]
                }
                if (data.models) {
                  for (const model of data.models) {
                    for (const key in model) {
                      if (!modelKeys.includes(key)) delete model[key]
                    }
                    if (!model.animations?.length) delete model.animations
                    processPart(model, true)
                  }
                  data.models = data.models.map(e => {
                    if (e.boxes || e.submodel || e.submodels || e.model || e.sprites) return e
                    return { part: e.part }
                  })
                  if (!data.models.length) {
                    for (const key in data) delete data[key]
                  }
                }
              }
              if (this.types.jpm && file.endsWith(".jpm")) {
                processPart(data)
              }
              if (this.minify) {
                await fs.promises.writeFile(file, JSON.stringify(data), "utf-8")
              } else {
                await fs.promises.writeFile(file, compileJSON(data, { indentation: "  " }), "utf-8")
              }
              const after = (await fs.promises.stat(file)).size
              afterTotal += after
              output.log(`\`${shortened}\`\nBefore: ${formatBytes(before)}\nAfter: ${formatBytes(after)}`)
              this.done++
            }
            this.total = this.done
            output.info(`Compressed ${this.total} files\nBefore: ${formatBytes(beforeTotal)}\nAfter: ${formatBytes(afterTotal)}\nSaved: ${formatBytes(beforeTotal - afterTotal)}`)
            this.status.processing = false
            this.status.finished = true
          }
        },
        template: `
          <div v-if="!status.processing && !status.finished">
            <div class="row">
              <div class="col spacer">
                <h3>Folder to Optimise:</h3>
                <folder-selector v-model="folder">folder to optimise the JSON of</folder-selector>
                <checkbox-row v-model="types.json">Optimise <code>.json</code> files</checkbox-row>
                <checkbox-row v-model="types.mcmeta">Optimise <code>.mcmeta</code> files</checkbox-row>
                <checkbox-row v-model="types.jem">Optimise <code>.jem</code> files</checkbox-row>
                <checkbox-row v-model="types.jpm">Optimise <code>.jpm</code> files</checkbox-row>
                <checkbox-row v-model="minify" style="margin-top: 0;">Minify output</checkbox-row>
              </div>
              <ignore-list v-model="ignoreList" />
            </div>
            <button :disabled="!folder" @click="execute">Optimise</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    citOptimiser: {
      name: "CIT Optimiser",
      icon: "coffee",
      tagline: "Optimise the OptiFine CIT properties files in a folder.",
      description: "CIT Optimiser is a tool that will go through all properties files in an OptiFine CIT folder and optimise them to be as small as possible, removing any unnecessary data.",
      info: `
        <h3>Changes that CIT Optimiser makes:</h3>
        <ul>
          <li>Removes the <code>type=item</code> property</li>
          <li>Replaces <code>matchItems</code> with <code>items</code></li>
          <li>Removes the <code>minecraft:</code> prefix</li>
          <li>Removes blank lines</li>
        </ul>
      `,
      component: {
        data: {
          folder: "",
          ignoreList: [],
          outputLog,
          done: 0,
          total: null,
          cancelled: false
        },
        methods: {
          async execute() {
            if (!await confirm("Run CIT Optimiser?", `Are you sure you want to run CIT Optimiser over the following folder:\n<code>${formatPath(this.folder)}</code>\n\nMake a backup first if you would like to keep an un-optimised version of the folder.`)) return

            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false

            if (!await exists(this.folder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The folder \`${formatPath(this.folder)}\` was not found`)
              return
            }

            const files = []
            for await (const file of getFiles(this.folder)) {
              const shortened = formatPath(file.slice(this.folder.length)).replace(/^\//, "")
              if (
                !file.endsWith(".properties") ||
                this.ignoreList.some(item => shortened.toLowerCase().includes(item))
              ) continue
              files.push([file, shortened])
            }

            this.total = files.length

            let beforeTotal = 0
            let afterTotal = 0

            for (const [file, shortened] of files) {
              if (this.cancelled) break
              const before = (await fs.promises.stat(file)).size
              beforeTotal += before
              let data
              try {
                data = (await fs.promises.readFile(file, "utf-8")).trim()
              } catch (err) {
                output.error(`Skipping \`${shortened}\` as it could not be read`)
                this.done++
                continue
              }
              data = data.replace(/(type=item\n?|minecraft:)/g, "")
              data = data.replace(/matchItems/g, "items")
              data = data.replace(/\n{2,}/g, "\n")
              await fs.promises.writeFile(file, data, "utf-8")
              const after = (await fs.promises.stat(file)).size
              afterTotal += after
              output.log(`\`${shortened}\`\nBefore: ${formatBytes(before)}\nAfter: ${formatBytes(after)}`)
              this.done++
            }
            this.total = this.done
            output.info(`Compressed ${this.total} files\nBefore: ${formatBytes(beforeTotal)}\nAfter: ${formatBytes(afterTotal)}\nSaved: ${formatBytes(beforeTotal - afterTotal)}`)
            this.status.processing = false
            this.status.finished = true
          }
        },
        template: `
          <div v-if="!status.processing && !status.finished">
            <div class="row">
              <div class="col spacer">
                <h3>Folder to Optimise:</h3>
                <folder-selector v-model="folder">folder to optimise the CIT properties files of</folder-selector>
              </div>
              <ignore-list v-model="ignoreList" style="align-self: flex-start;" />
            </div>
            <button :disabled="!folder" @click="execute">Optimise</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    packCreator: {
      name: "Pack Creator",
      icon: "create_new_folder",
      tagline: "Create template resource packs and get the vanilla assets.",
      description: "Pack Creator is a tool that allows you to create template resource packs, as well as get the vanilla textures, models, sounds, etc…",
      component: {
        data: {
          folder: "",
          name: "",
          description: "",
          attemptedStart: false,
          assets: false,
          objects: false,
          create: {
            blockstates: false,
            models: false,
            optifine: false,
            textures: false,
            sounds: false,
            emissive: false
          },
          cancelled: false,
          outputLog,
          version: "",
          done: 0,
          total: null
        },
        created() {
          this.folder = formatPath(path.join(settings.minecraft_directory.value, "resourcepacks"))
        },
        methods: {
          async execute() {
            this.name = this.name.trim()
            this.description = this.description.trim()
            if (!this.name) {
              return this.attemptedStart = true
            }
            if (this.assets) {
              await showMessage("Vanilla assets notice", "The vanilla assets are only to be used as a template!\n\nBefore releasing your resource pack, make sure to remove any unmodified vanilla assets from your resource pack.\n\nYou can use the <code>Pack Cleaner</code> utility to quickly and easily remove all unmodified assets from your pack.")
            }
            outputLog.length = 0
            this.done = 0
            this.total = null
            if (invalidDirPattern.test(this.name)) {
              output.error(`The name cannot include the following characters: \`\\\/:*?"<>|\uE000\``)
              this.status.finished = true
              this.total = 0
              return
            }
            if (!await exists(this.folder)) {
              output.error(`The folder \`${formatPath(this.folder)}\` was not found`)
              this.status.finished = true
              this.total = 0
              return
            }
            const folder = path.join(this.folder, this.name)
            if (await exists(folder)) {
              output.error(`The resource pack \`${formatPath(this.folder)}/${this.name}\` already exists`)
              this.status.finished = true
              this.total = 0
              return
            }
            this.cancelled = false
            this.status.finished = false
            this.status.processing = true
            const jar = await getVersionJar(this.version)
            if (this.assets) {
              output.log("Extracting vanilla assets…")
              const entries = Object.entries(jar.files)
              let totalAssets = entries.length
              let objectsEntries
              if (this.objects) {
                const assetsIndex = await getVersionAssetsIndex(this.version)
                objectsEntries = Object.entries(assetsIndex.objects)
                totalAssets += objectsEntries.length
              }
              this.total = totalAssets + Object.values(this.create).filter(e => e).length + 3
              const paths = new Set
              for (const [file, data] of entries) {
                paths.add(path.join(folder, path.dirname(file)))
              }
              for (const path of paths) {
                await fs.promises.mkdir(path, { recursive: true })
              }
              for (let i = 0; i < entries.length; i += 256) {
                if (this.cancelled) {
                  this.status.finished = true
                  this.status.processing = false
                  output.info("Cancelled")
                  this.total = this.done
                  return
                }
                const files = []
                for (const [file, data] of entries.slice(i, i + 256)) {
                  if (file === "version.json" || file === "pack.mcmeta") {
                    this.done++
                    continue
                  }
                  files.push(new Promise(async fulfil => {
                    await fs.promises.writeFile(path.join(folder, file), data.content)
                    output.log(`Extracted \`${file}\``)
                    this.done++
                    fulfil()
                  }))
                }
                await Promise.all(files)
              }
              output.log("Extracted vanilla assets")
              if (this.objects) {
                output.log("Extracting objects…")
                const root = getRoot(this.version)
                const paths = new Set
                for (const [file, data] of objectsEntries) {
                  if (file.startsWith("icons/")) continue
                  paths.add(path.join(folder, root, path.dirname(file)))
                }
                for (const path of paths) {
                  await fs.promises.mkdir(path, { recursive: true })
                }
                await cacheDirectory()
                for (let i = 0; i < objectsEntries.length; i += 256) {
                  if (this.cancelled) {
                    this.status.finished = true
                    this.status.processing = false
                    output.info("Cancelled")
                    this.total = this.done
                    return
                  }
                  const files = []
                  for (const [file, data] of objectsEntries.slice(i, i + 256)) {
                    if (file === "pack.mcmeta" || file.startsWith("icons/")) {
                      this.done++
                      continue
                    }
                    files.push(new Promise(async fulfil => {
                      const objectPath = `${data.hash.slice(0, 2)}/${data.hash}`
                      const packPath = path.join(this.folder, this.name, root, file)
                      const vanillaObjectPath = path.join(settings.minecraft_directory.value, "assets", "objects", objectPath)
                      if (await exists(vanillaObjectPath)) {
                        await fs.promises.copyFile(vanillaObjectPath, packPath)
                        output.log(`Extracted \`${root}/${file}\``)
                      } else {
                        const cacheObjectPath = path.join(settings.cache_directory.value, "objects", objectPath)
                        if (await exists(cacheObjectPath)) {
                          await fs.promises.copyFile(cacheObjectPath, packPath)
                          output.log(`Extracted \`${root}/${file}\``)
                        } else {
                          const object = new Uint8Array(await fetch(`https://resources.download.minecraft.net/${objectPath}`).then(e => e.arrayBuffer()))
                          await fs.promises.mkdir(path.dirname(cacheObjectPath), { recursive: true })
                          await fs.promises.writeFile(cacheObjectPath, object)
                          await fs.promises.writeFile(packPath, object)
                          output.log(`Downloaded \`${root}/${file}\``)
                        }
                      }
                      this.done++
                      fulfil()
                    }))
                  }
                  await Promise.all(files)
                }
                output.log("Extracted objects")
              }
            }
            if (this.total === null) {
              this.total = Object.values(this.create).filter(e => e).length + 3
            }
            if (!await exists(path.join(folder, "assets/minecraft"))) {
              await fs.promises.mkdir(path.join(folder, "assets/minecraft"), { recursive: true })
              output.log(`Created pack directory \`${formatPath(folder)}\``)
            }
            this.done++
            if (this.create.blockstates) {
              if (!await exists(path.join(folder, "assets/minecraft/blockstates"))) {
                await fs.promises.mkdir(path.join(folder, "assets/minecraft/blockstates"), { recursive: true })
                output.log("Created folder `assets/minecraft/blockstates`")
              }
              this.done++
            }
            if (this.create.models) {
              if (!await exists(path.join(folder, "assets/minecraft/models"))) {
                await fs.promises.mkdir(path.join(folder, "assets/minecraft/models"), { recursive: true })
                output.log("Created folder `assets/minecraft/models`")
              }
              this.done++
            }
            if (this.create.optifine) {
              await fs.promises.mkdir(path.join(folder, "assets/minecraft/optifine"), { recursive: true })
              output.log("Created folder `assets/minecraft/optifine`")
              this.done++
            }
            if (this.create.textures) {
              if (!await exists(path.join(folder, "assets/minecraft/textures"))) {
                await fs.promises.mkdir(path.join(folder, "assets/minecraft/textures"), { recursive: true })
                output.log("Created folder `assets/minecraft/textures`")
              }
              this.done++
            }
            if (this.create.sounds) {
              if (!await exists(path.join(folder, "assets/minecraft/sounds"))) {
                await fs.promises.mkdir(path.join(folder, "assets/minecraft/sounds"), { recursive: true })
                output.log("Created folder `assets/minecraft/sounds`")
              }
              this.done++
            }
            if (this.create.emissive) {
              await fs.promises.writeFile(path.join(folder, "assets/minecraft/optifine/emissive.properties"), "suffix.emissive=_e", "utf-8")
              output.log("Created file `assets/minecraft/optifine/emissive.properties`")
              this.done++
            }
            let packFormat
            if (jar.files["version.json"]) {
              const data = JSON.parse(jar.files["version.json"].content)
              if (typeof data.pack_version === "number") {
                packFormat = data.pack_version
              } else {
                packFormat = data.pack_version.resource
              }
            } else if (jar.files["pack.mcmeta"]) {
              packFormat = JSON.parse(jar.files["pack.mcmeta"].content).pack.pack_format
            } else if (this.version.startsWith("1.9") || this.version.startsWith("1.10") || this.version.startsWith("15w")) {
              packFormat = 2
            } else if (this.version.startsWith("1.11") || this.version.startsWith("1.12") || this.version.startsWith("16w") || this.version.startsWith("17w")) {
              packFormat = 3
            } else {
              packFormat = 1
            }
            await fs.promises.writeFile(path.join(folder, "pack.mcmeta"), JSON.stringify({
              "pack": {
                "pack_format": packFormat,
                "description": this.description || "Template Resource Pack"
              }
            }, null, 2), "utf-8")
            output.log("Created file `pack.mcmeta`")
            this.done++
            if (!await exists(path.join(folder, "pack.png"))) {
              await fs.promises.writeFile(path.join(folder, "pack.png"), "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", { encoding: "base64" })
              output.log("Created `pack.png`")
            }
            this.done++
            output.info(`Created template resource pack \`${this.name}\``)
            this.status.processing = false
            this.status.finished = true
          },
          assetsToggle() {
            if (!this.vanillaAssets) {
              this.objects = false
            }
          },
          optifineToggle() {
            if (!this.create.optifine) {
              this.create.emissive = false
            }
          },
          emissiveToggle() {
            if (this.create.emissive) {
              this.create.optifine = true
            }
          }
        },
        template: `
          <div v-if="!status.processing && !status.finished">
            <div class="row">
              <div class="col spacer">
                <h3>Output Location:</h3>
                <folder-selector v-model="folder">folder to output the resource pack to</folder-selector>
                <input-row v-model="name" placeholder="Enter name…" width="120" :required="attemptedStart && !name.length">Pack Name</input-row>
                <input-row v-model="description" placeholder="Enter description…" width="120">Pack Description</input-row>
                <version-selector v-model="version" />
                <checkbox-row v-model="assets" @input="assetsToggle">Import vanilla assets</checkbox-row>
                <checkbox-row v-model="objects" :disabled="!assets">Also include objects (sounds, languages, panorama, etc…)</checkbox-row>
              </div>
              <div class="col">
                <h3>Create Folders:</h3>
                <checkbox-row v-model="create.blockstates">blockstates</checkbox-row>
                <checkbox-row v-model="create.models">models</checkbox-row>
                <checkbox-row v-model="create.optifine" @input="optifineToggle">optifine</checkbox-row>
                <checkbox-row v-model="create.textures">textures</checkbox-row>
                <checkbox-row v-model="create.sounds">sounds</checkbox-row>
                <h3>Create Files:</h3>
                <checkbox-row v-model="create.emissive" @input="emissiveToggle">emissive.properties</checkbox-row>
              </div>
            </div>
            <button :disabled="!folder" @click="execute">Create</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    packCleaner: {
      name: "Pack Cleaner",
      icon: "mop",
      tagline: "Remove unmodified vanilla assets from a resource pack.",
      description: "Pack Cleaner is a tool that will go through all the files in a resource pack and compare them against the vanilla assets, removing them if they are unmodified.",
      component: {
        data: {
          folder: "",
          ignoreList: [],
          outputLog,
          done: 0,
          total: null,
          cancelled: false,
          version: "",
          objects: false
        },
        methods: {
          async execute() {
            if (!await confirm("Run Pack Cleaner?", `Are you sure you want to run Pack Cleaner over the following resource pack:\n<code>${formatPath(this.folder)}</code>\n\nMake a backup first if you would like to keep an un-altered version of the resource pack.`)) return
            
            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false

            if (!await exists(this.folder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The resource pack \`${formatPath(this.folder)}\` was not found`)
              return
            }

            const jar = await getVersionJar(this.version)

            const files = []
            for await (const file of getFiles(this.folder)) {
              const shortened = formatPath(file.slice(this.folder.length)).replace(/^\//, "")
              if (
                shortened === "pack.mcmeta" ||
                shortened === "pack.png" ||
                this.ignoreList.some(item => shortened.toLowerCase().includes(item))
              ) continue
              files.push([file, shortened])
            }

            this.total = files.length

            let removed = 0

            async function checkFile(file, shortened, fileBuffer, assetBuffer) {
              try {
                let remove
                if (file.endsWith(".json")) {
                  if (fileBuffer.equals(assetBuffer)) {
                    remove = true
                  } else {
                    const fileData = JSON.parse(fileBuffer)
                    const assetData = JSON.parse(assetBuffer)
                    if (objectsEqual(fileData, assetData)) {
                      remove = true
                    }
                  }
                } else if (file.endsWith(".png.mcmeta")) {
                  if (!await exists(file.slice(0, -7))) {
                    try {
                      await fs.promises.unlink(file)
                      output.log(`Removed \`${shortened}\``)
                      removed++
                    } catch {}
                  }
                } else if (file.endsWith(".png")) {
                  if (fileBuffer.equals(assetBuffer)) {
                    remove = true
                  } else if (fileBuffer.readUint32BE(16) === assetBuffer.readUint32BE(16) && fileBuffer.readUint32BE(20) === assetBuffer.readUint32BE(20)) {
                    const fileImg = await loadImage(fileBuffer)
                    const assetImg = await loadImage(assetBuffer)
                    const fileCanvas = new Canvas(fileImg.width, fileImg.height)
                    const assetCanvas = new Canvas(assetImg.width, assetImg.height)
                    fileCanvas.ctx.drawImage(fileImg, 0, 0)
                    assetCanvas.ctx.drawImage(assetImg, 0, 0)
                    fileImgData = fileCanvas.ctx.getImageData(0, 0, fileImg.width, fileImg.height).data
                    assetImgData = assetCanvas.ctx.getImageData(0, 0, assetImg.width, assetImg.height).data
                    let same = true
                    for (let i = fileImgData.length - 1; i >= 0; i--) {
                      same &&= fileImgData[i] === assetImgData[i]
                    }
                    if (same) {
                      const mcmeta = file + ".mcmeta"
                      const mcmetaShortened = shortened + ".mcmeta"
                      if (await exists(mcmeta)) {
                        if (mcmetaShortened in jar.files) {
                          const mcmetaBuffer = await fs.promises.readFile(mcmeta)
                          let removeMcmeta
                          if (mcmetaBuffer.equals(jar.files[mcmetaShortened].content)) {
                            removeMcmeta = true
                          } else {
                            const mcmetaFile = JSON.parse(mcmetaBuffer)
                            const mcmetaAsset = JSON.parse(jar.files[mcmetaShortened].content)
                            if (objectsEqual(mcmetaFile, mcmetaAsset)) {
                              remove = true
                              removeMcmeta = true
                            }
                          }
                          if (removeMcmeta) {
                            await fs.promises.unlink(mcmeta)
                            output.log(`Removed \`${mcmetaShortened}\``)
                            removed++
                          }
                        }
                      } else if (!(mcmetaShortened in jar.files)) {
                        remove = true
                      }
                    }
                  }
                } else if (simpleFilePattern.test(file) && fileBuffer.equals(assetBuffer)) {
                  remove = true
                }
                if (remove) {
                  try {
                    await fs.promises.unlink(file)
                    output.log(`Removed \`${shortened}\``)
                    removed++
                  } catch {}
                }
              } catch {
                output.error(`Failed to process \`${shortened}\`, skipping…`)
              }
            }

            const objectsFiles = {}
            if (this.objects) {
              await cacheDirectory()
              const assetsIndex = await getVersionAssetsIndex(this.version)
              const entries = Object.entries(assetsIndex.objects)
              const version = getVersion(this.version)
              let root
              if (Date.parse(version.releaseTime) >= 1403106748000 || version.data.assets === "1.7.10") {
                root = "assets"
              } else {
                root = "assets/minecraft"
              }
              for (let i = 0; i < entries.length; i += 256) {
                if (this.cancelled) {
                  this.status.finished = true
                  this.status.processing = false
                  output.info("Cancelled")
                  this.total = this.done
                  return
                }
                const downloads = []
                for (const [file, data] of entries.slice(i, i + 256)) {
                  if (file === "pack.mcmeta") continue
                  downloads.push(new Promise(async fulfil => {
                    const objectPath = `${data.hash.slice(0, 2)}/${data.hash}`
                    const assetPath = `${root}/${file}`
                    const vanillaObjectPath = path.join(settings.minecraft_directory.value, "assets", "objects", objectPath)
                    if (await exists(vanillaObjectPath)) {
                      objectsFiles[assetPath] = vanillaObjectPath
                    } else {
                      const cacheObjectPath = path.join(settings.cache_directory.value, "objects", objectPath)
                      if (!await exists(cacheObjectPath)) {
                        const object = new Uint8Array(await fetch(`https://resources.download.minecraft.net/${objectPath}`).then(e => e.arrayBuffer()))
                        await fs.promises.mkdir(path.dirname(cacheObjectPath), { recursive: true })
                        await fs.promises.writeFile(cacheObjectPath, object)
                        output.log(`Downloaded \`${root}/${file}\` to the cache`)
                      }
                      objectsFiles[assetPath] = cacheObjectPath
                    }
                    fulfil()
                  }))
                }
                await Promise.all(downloads)
              }
            }

            for (const [file, shortened] of files) {
              if (this.cancelled) break
              if (!await exists(file)) continue
              if (shortened in objectsFiles) {
                await checkFile(file, shortened, await fs.promises.readFile(file), await fs.promises.readFile(objectsFiles[shortened]))
              } else if (shortened in jar.files) {
                await checkFile(file, shortened, await fs.promises.readFile(file), jar.files[shortened].content)
              }
              this.done++
            }

            const deleteEmptyFolders = async folderPath => {
              try {
                const entries = await fs.promises.readdir(folderPath, { withFileTypes: true })
                for (const entry of entries) {
                  const fullPath = path.join(folderPath, entry.name)
                  if (entry.isDirectory()) {
                    await deleteEmptyFolders(fullPath)
                    if ((await fs.promises.readdir(fullPath)).length === 0) {
                      await fs.promises.rmdir(fullPath)
                      output.log(`Deleted empty folder \`${formatPath(fullPath.slice(this.folder.length)).replace(/^\//, "")}\``)
                    }
                  }
                }
              } catch {}
            }

            await deleteEmptyFolders(this.folder)

            this.total = this.done
            output.info(`Removed ${removed} files`)
            this.status.processing = false
            this.status.finished = true
          }
        },
        template: `
          <div v-if="!status.processing && !status.finished">
            <div class="row">
              <div class="col spacer">
                <h3>Resource Pack to Clean:</h3>
                <folder-selector v-model="folder" placeholder="Resource Pack">resource pack to clean the contents of</folder-selector>
                <version-selector v-model="version" />
                <checkbox-row v-model="objects">Also clean objects (sounds, languages, panorama, etc…)</checkbox-row>
              </div>
              <ignore-list v-model="ignoreList" />
            </div>
            <button :disabled="!folder" @click="execute">Clean</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    langStripper: {
      name: "Lang Stripper",
      icon: "translate",
      tagline: "Remove all unedited entries from the Minecraft language files.",
      description: "Lang Stripper is a tool that will go through all the language files in an resource pack and remove any entries that have not been modified.",
      component: {
        data: {
          folder: "",
          outputLog,
          done: 0,
          total: null,
          cancelled: false,
          mode: "default",
          version: ""
        },
        methods: {
          async execute() {
            if (!await confirm("Run Lang Stripper?", `Are you sure you want to run Lang Stripper over the following resource pack:\n<code>${formatPath(this.folder)}</code>\n\nMake a backup first if you would like to keep an un-stripped version of the language files.`)) return

            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false

            if (!await exists(this.folder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The resource pack \`${formatPath(this.folder)}\` was not found`)
              return
            }

            const langPath = path.join(this.folder, "assets", "minecraft", "lang")
            if (!await exists(langPath)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error("The `assets/minecraft/lang` folder was not found")
              return
            }

            const removed = []

            const processFile = async (type, filePath, assetPath, assetBuffer) => {
              try {
                const file = await fs.promises.readFile(filePath, "utf-8")
                const asset = assetBuffer.toString()
                let fileData, assetData
                if (type === ".json") {
                  fileData = JSON.parse(file)
                  assetData = JSON.parse(asset)
                } else {
                  fileData = langToJSON(file)
                  assetData = langToJSON(asset)
                }
                let changes = 0
                for (const key in fileData) {
                  if (fileData[key] === assetData[key]) {
                    delete fileData[key]
                    removed.push(`Removed \`${key}\` from \`${assetPath}\``)
                    changes++
                  }
                }
                output.log(`Processed \`${assetPath}\`: Stripped \`${removed.length}\` entries`)
                if (changes) {
                  if (type === ".json") {
                    await fs.promises.writeFile(filePath, JSON.stringify(fileData, null, 2))
                  } else {
                    await fs.promises.writeFile(filePath, jsonToLang(fileData))
                  }
                }
              } catch {
                output.error(`Skipping \`${assetPath}\` as it could not be read`)
              }
              this.done++
            }

            const jar = await getVersionJar(this.version)
            let langs, assetsIndex, root
            if (this.mode === "default") {
              this.total = 1
            } else {
              await cacheDirectory()
              assetsIndex = await getVersionAssetsIndex(this.version)
              const files = await listFiles(langPath)
              root = getRoot(this.version)
              const extension = path.extname(Object.keys(assetsIndex.objects).find(e => e.startsWith("assets/minecraft/lang/".slice(root.length + 1))))
              langs = files.filter(e => assetsIndex.objects[`assets/minecraft/lang/${e}`.slice(root.length + 1)] || (e.toLowerCase().startsWith("en_us.") && e.endsWith(extension)))
              if (langs.length === 0) {
                this.status.finished = true
                this.status.processing = false
                this.total = 0
                output.error(`No valid \`${this.version}\` language files were found in \`assets/minecraft/lang\``)
                return
              }
              this.total = langs.length
            }

            const enUS = "assets/minecraft/lang/en_us.json" in jar.files ? "assets/minecraft/lang/en_us.json" : "assets/minecraft/lang/en_us.lang" in jar.files ? "assets/minecraft/lang/en_us.lang" : "assets/minecraft/lang/en_US.lang"

            const enUSFile = path.join(this.folder, enUS)

            if (await exists(enUSFile)) {
              await processFile(path.extname(enUS), enUSFile, enUS, jar.files[enUS].content)
            } else if (this.mode === "default") {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The language file \`${enUS}\` was not found`)
              return
            }

            if (this.mode === "all") {
              async function getLang(lang, langPath) {
                const data = assetsIndex.objects[langPath.slice(root.length + 1)]
                const objectPath = `${data.hash.slice(0, 2)}/${data.hash}`
                const vanillaObjectPath = path.join(settings.minecraft_directory.value, "assets", "objects", objectPath)
                if (await exists(vanillaObjectPath)) {
                  return fs.promises.readFile(vanillaObjectPath)
                }
                const cacheObjectPath = path.join(settings.cache_directory.value, "objects", objectPath)
                if (await exists(cacheObjectPath)) {
                  return fs.promises.readFile(cacheObjectPath)
                }
                const object = Buffer.from(await fetch(`https://resources.download.minecraft.net/${objectPath}`).then(e => e.arrayBuffer()))
                await fs.promises.mkdir(path.dirname(cacheObjectPath), { recursive: true })
                await fs.promises.writeFile(cacheObjectPath, object)
                output.log(`Downloaded \`${langPath}\` to the cache`)
                return object
              }

              for (const lang of langs) {
                if (this.cancelled) {
                  this.status.finished = true
                  this.status.processing = false
                  output.info("Cancelled")
                  this.total = this.done
                  return
                }
                if (lang.toLowerCase().startsWith("en_us.")) continue
                const langPath = `assets/minecraft/lang/${lang}`
                await processFile(path.extname(lang), path.join(this.folder, langPath), langPath, await getLang(lang, langPath))
              }
            }

            for (const remove of removed) {
              output.log(remove)
            }

            output.info("Finished")
            this.status.finished = true
            this.status.processing = false
          }
        },
        styles: `
          .component-versionSelector {
            align-self: flex-start;
          }
        `,
        template: `
          <div v-if="!status.processing && !status.finished">
            <h3>Resource Pack to Strip:</h3>
            <folder-selector v-model="folder" placeholder="Resource Pack">resource pack to strip the language files of</folder-selector>
            <version-selector v-model="version" />
            <radio-row v-model="mode" :options="[['default', 'Strip default language file (en_us)'], ['all', 'Strip all language files']]"></radio-row>
            <button :disabled="!folder" @click="execute">Strip</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    batchExporter: {
      name: "Batch Exporter",
      icon: "move_group",
      tagline: "Export every bbmodel file in a folder at the same time.",
      description: "Batch Exporter is a tool that will export every bbmodel file within a folder to an output folder using the selected format.",
      component: {
        data: {
          inputFolder: "",
          outputFolder: "",
          outputLog,
          done: 0,
          total: null,
          cancelled: false,
          textures: true,
          subfolders: false,
          textureFolders: true,
          format: "java_block",
          formats: Object.fromEntries(Object.entries(batchExporterFormats).map(e => [e[0], e[1].name])),
          specialFormats: batchExporterSpecialFormats
        },
        methods: {
          async execute() {
            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false

            if (!await exists(this.inputFolder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The folder \`${formatPath(this.inputFolder)}\` was not found`)
              return
            }

            if (!await exists(this.outputFolder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The folder \`${formatPath(this.outputFolder)}\` was not found`)
              return
            }

            const files = await listFiles(this.inputFolder, "bbmodel")

            this.total = files.length

            if (!files.length) {
              this.status.finished = true
              this.status.processing = false
              output.error("No `.bbmodel` files present in the selected folder")
              return
            }

            let exportOptions = {}
            if (Object.keys(Codecs[this.format].export_options).length) {
              output.log("Getting export options…")
              newProject("")
              await Codecs[this.format].promptExportOptions()
              exportOptions = Codecs[this.format].getExportOptions()
              await Project.close()
              output.log("Export options loaded")
            }

            for (const file of files) {
              const name = file.slice(0, -8)
              let outputPath = ""
              let fullOutputPath = this.outputFolder
              if (this.subfolders) {
                outputPath = name + "/"
                fullOutputPath = path.join(fullOutputPath, name)
              }
              const saveName = path.join(fullOutputPath, `${name}.${batchExporterFormats[this.format].type}`)
              if (await exists(saveName)) {
                output.warn(`Skipping \`${file}\` as \`${outputPath}${name}.${batchExporterFormats[this.format].type}\` already exists`)
                this.done++
                continue
              }
              let data
              try {
                data = JSON.parse(await fs.promises.readFile(path.join(this.inputFolder, file)))
              } catch {
                output.error(`Skipping \`${file}\` as it could not be read`)
                this.done++
                continue
              }
              if (data.meta.model_format !== this.format && !batchExporterSpecialFormats.includes(this.format)) {
                output.warn(`Skipping \`${file}\` as it is in ${data.meta.model_format in Formats ? `the \`${Formats[data.meta.model_format].name}\`` : "an unknown"} format`)
                this.done++
                continue
              }
              newProject(Formats[data.meta.model_format])
              Codecs.project.parse(data)
              let compiled, mtl
              if (this.format === "obj") {
                const obj = Codecs.obj.compile(Object.assign({
                  all_files: true,
                  mtl_name: this.textures ? `${name}.mtl` : undefined
                }, exportOptions))
                compiled = obj.obj
                mtl = obj.mtl
              } else {
                compiled = await Codecs[this.format].compile(exportOptions)
              }
              if (fullOutputPath !== this.outputFolder) {
                await fs.promises.mkdir(fullOutputPath, { recursive: true })
              }
              await fs.promises.writeFile(saveName, Buffer.from(compiled), "utf-8")
              output.log(`Exported \`${file}\` to \`${outputPath}${name}.${batchExporterFormats[this.format].type}\``)
              if (this.format === "obj" && this.textures) {
                if (await exists(saveName.slice(0, -3) + "mtl")) {
                  output.warn(`Skipping \`${file}\`'s material as \`${outputPath}${name}.mtl\` already exists`)
                } else {
                  await fs.promises.writeFile(saveName.slice(0, -3) + "mtl", mtl, "utf-8")
                  output.log(`Exported \`${file}\`'s material to \`${outputPath}${name}.mtl\``)
                }
              }
              if (this.textures) {
                for (const texture of data.textures) {
                  const name = texture.name.endsWith(".png") ? texture.name : texture.name + ".png"
                  let saveName
                  if (this.textureFolders && !batchExporterSpecialFormats.includes(this.format)) {
                    await fs.promises.mkdir(path.join(this.outputFolder, outputPath, "textures", texture.folder), { recursive: true })
                    saveName = formatPath(path.join(outputPath, "textures", texture.folder, name))
                  } else {
                    saveName = `${outputPath}${name}`
                  }
                  const savePath = path.join(this.outputFolder, saveName)
                  if (await exists(savePath)) {
                    output.warn(`Skipping texture \`${name}\` from \`${file}\` as \`${saveName}\` already exists`)
                    continue
                  }
                  await fs.promises.writeFile(savePath, Buffer.from(texture.source.split(",")[1], "base64"), "utf-8")
                  output.log(`Exported \`${name}\` from \`${file}\` to \`${saveName}\``)
                }
              }
              await Project.close()
              this.done++
            }

            output.info("Finished")
            this.status.finished = true
            this.status.processing = false
          }
        },
        template: `
          <div v-if="!status.processing && !status.finished">
            <h3>Input Folder:</h3>
            <folder-selector v-model="inputFolder" placeholder="Input Folder">folder containing bbmodels</folder-selector>
            <h3>Output Folder:</h3>
            <folder-selector v-model="outputFolder" placeholder="Output Folder">folder to export the bbmodels to</folder-selector>
            <select-row v-model="format" :options="formats">Output format</select-row>
            <checkbox-row v-model="subfolders">Export each model to its own subfolder</checkbox-row>
            <checkbox-row v-model="textures">Export textures</checkbox-row>
            <checkbox-row v-if="!specialFormats.includes(format)" :disabled="!textures" v-model="textureFolders">Export textures into their defined folders</checkbox-row>
            <button :disabled="!inputFolder || !outputFolder" @click="execute">Export</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    missingTextures: {
      name: "Missing Textures",
      icon: "find_in_page",
      tagline: "List the textures that are missing from a resource pack.",
      description: "Missing Textures is a tool that will check what textures you have in a resource pack and tell you which ones the resource pack is missing.",
      component: {
        data: {
          folder: "",
          outputLog,
          done: 0,
          total: null,
          cancelled: false,
          version: "",
          ignoreList: ["clouds", "color_palettes", "colormap", "debug", "font", "gui/title", "presets", "realms", "textures/effect"],
          exportLog: false
        },
        methods: {
          async execute() {
            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false

            if (!await exists(this.folder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The folder \`${formatPath(this.folder)}\` was not found`)
              return
            }

            const jar = await getVersionJar(this.version)

            const toCheck = Object.keys(jar.files).filter(e => e.endsWith(".png") && !this.ignoreList.some(item => e.toLowerCase().includes(item)))

            this.total = toCheck.length

            const files = (await Array.fromAsync(getFiles(this.folder))).map(e => formatPath(e.slice(this.folder.length + 1)))

            const missing = []
            for (const file of toCheck) {
              if (!files.includes(file)) {
                output.log(`Missing \`${file}\``)
                missing.push(file)
              }
              this.done++
            }

            const str = `Missing ${missing.length} of ${this.total} textures (${!this.total ? 0 : ((missing.length / this.total) * 100).toFixed(2).replace(/\.?0+$/, "")}%)`

            if (this.exportLog) {
              const name = path.join(this.folder, `missing_textures_${getDate()}.txt`)
              await fs.promises.writeFile(name, `${header}${str}\n\nMissing Textures\n――――――――――――――――\n${formatFilePaths(missing)}`, "utf-8")
              output.log(`Saved missing textures list to \`${name}\``)
            }

            output.info(`Finished\n${str}`)
            this.status.finished = true
            this.status.processing = false
          }
        },
        template: `
          <div v-if="!status.processing && !status.finished">
            <div class="row">
              <div class="col spacer">
                <h3>Resource Pack:</h3>
                <folder-selector v-model="folder" placeholder="Resource Pack">resource pack to list missing textures of</folder-selector>
                <version-selector v-model="version" />
                <checkbox-row v-model="exportLog">Export missing texture list</checkbox-row>
              </div>
              <ignore-list v-model="ignoreList" />
            </div>
            <button :disabled="!folder" @click="execute">Find Missing Textures</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    mojangConverter: {
      name: "Mojang Converter",
      icon: "swap_horiz",
      tagline: "Convert images to and between the 1.15 and 1.16 Mojang logo formats.",
      description: "Mojang Converter is a tool that will convert images to be in the the Mojang Studios logo format. This can also convert existing textures between the 1.15 and 1.16 texture formats.",
      component: {
        data: {
          file: null,
          outputNew: null,
          outputOld: null,
          inputMode: "image",
          inputModes: {
            image: "Arbitrary image or 1.15 format",
            old: "1.16 and above format"
          },
          outputMode: "new",
          outputModes: {
            new: "Convert for 1.16 and above",
            old: "Convert for 1.15 and below"
          }
        },
        methods: {
          async execute() {
            if (!this.file) {
              this.outputNew = null
              this.outputOld = null
              return
            }
            const img = imageToCanvas(this.file.image)
            if (this.inputMode === "old") {
              const oldCanvas = new Canvas(img.width * 2, Math.floor(img.width / 2))
              oldCanvas.ctx.drawImage(img, 0, 0, img.width, Math.floor(img.width / 2), 0, 0, img.width, Math.floor(img.width / 2))
              oldCanvas.ctx.drawImage(img, 0, Math.floor(img.width / 2), img.width, Math.floor(img.width / 2), img.width, 0, img.width, Math.floor(img.width / 2))
              oldCanvas.trim()
              this.outputOld = new Canvas(oldCanvas.width, oldCanvas.width)
              this.outputOld.ctx.drawImage(oldCanvas, 0, Math.floor((oldCanvas.width - oldCanvas.height) / 2))
            } else {
              img.trim()
              const size = Math.max(img.width, img.height)
              this.outputOld = new Canvas(size, size)
              this.outputOld.ctx.drawImage(img, (this.outputOld.width - img.width) / 2, (this.outputOld.height - img.height) / 2)
            }
            img.trim()
            let newCanvas
            if (img.width < img.height * 4) {
              newCanvas = new Canvas(img.height * 4 + 8, img.height + 2)
              newCanvas.ctx.drawImage(img, Math.floor((img.height * 4 - img.width) / 2) + 4, 1)
            } else if (img.width > img.height * 4) {
              newCanvas = new Canvas(img.width + 8, Math.floor(img.width / 4) + 2)
              newCanvas.ctx.drawImage(img, 4, Math.floor((newCanvas.height - img.height) / 2))
            } else {
              newCanvas = new Canvas(img.width + 8, img.height + 4)
              newCanvas.ctx.drawImage(img, 4, 1)
            }
            this.outputNew = new Canvas(Math.floor(newCanvas.width / 2), Math.floor(newCanvas.width / 2))
            this.outputNew.ctx.drawImage(newCanvas, 0, 0)
            this.outputNew.ctx.drawImage(newCanvas, Math.floor(-newCanvas.width / 2), Math.floor(newCanvas.width / 4))
          }
        },
        template: `
          <h3>Input texture:</h3>
          <tab-select v-model="inputMode" :options="inputModes" @input="execute" />
          <file-input v-model="file" title="Select your Mojang Studios texture" @input="execute" />
          <h3>Mojang Studios texture:</h3>
          <tab-select v-if="inputMode === 'image'" v-model="outputMode" :options="outputModes" />
          <canvas-output v-if="inputMode !== 'old' && outputMode === 'new'" v-model="outputNew" name="mojangstudios" />
          <canvas-output v-if="inputMode === 'old' || outputMode === 'old'" v-model="outputOld" name="mojang" />
        `
      }
    },
    minecraftTitleConverter: {
      name: "Minecraft Title Converter",
      icon: "text_fields",
      tagline: "Convert images to and between the 1.19 and 1.20 Minecraft title formats.",
      description: "Minecraft Title Converter is a tool that will convert images to be in the the Minecraft title format. This can also convert existing textures between the 1.19 and 1.20 texture formats.",
      component: {
        data: {
          file: null,
          outputNew: null,
          outputOld: null,
          outputBetween: null,
          inputMode: "image",
          inputModes: {
            image: "Arbitrary image or 1.20 format",
            old: "1.19 and below format"
          },
          outputMode: "new",
          outputModes: {
            new: "Convert for 1.20 and above",
            old: "Convert for 1.19 and below"
          },
          error: null
        },
        methods: {
          async execute() {
            if (!this.file) {
              this.outputNew = null
              this.outputOld = null
              this.outputBetween = null
              this.error = null
              return
            }
            const img = imageToCanvas(this.file.image)
            const aspect = img.width / img.height
            let w, h
            if (img.width > 1024 || img.height > 1024) {
              if (aspect > 1) {
                w = 1024
                h = Math.floor(1024 / aspect)
              } else {
                h = 1024
                w = Math.floor(1024 * aspect)
              }
            } else {
              w = img.width
              h = img.height
            }
            const canvas = new Canvas(w, h)
            if (img.width < 64 || img.height < 64) {
              canvas.ctx.imageSmoothingEnabled = false
            }
            canvas.ctx.drawImage(img, 0, 0, w, h)
            const base = await loadImage("data:image/png;base64,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")
            let oldPreCanvas
            if (canvas.width / canvas.height < 137 / 22) {
              oldPreCanvas = new Canvas(Math.floor((canvas.height / 22) * 137), canvas.height)
              oldPreCanvas.ctx.drawImage(canvas, Math.floor((oldPreCanvas.width - canvas.width) / 2), 0)
            } else if (canvas.width / canvas.height > 137 / 22) {
              oldPreCanvas = new Canvas(canvas.width, Math.floor((canvas.width / 137) * 22))
              oldPreCanvas.ctx.drawImage(canvas, 0, Math.floor((oldPreCanvas.height - canvas.height) / 2))
            } else oldPreCanvas = canvas
            this.outputOld = new Canvas(Math.floor((oldPreCanvas.width / 137) * 128), Math.floor((oldPreCanvas.width / 137) * 128))
            this.outputOld.ctx.imageSmoothingEnabled = false
            this.outputOld.ctx.drawImage(base, 0, 0, this.outputOld.width, this.outputOld.height)
            const width = Math.floor((oldPreCanvas.width / 274) * 155)
            this.outputOld.ctx.drawImage(oldPreCanvas, 0, 0, width, oldPreCanvas.height, 0, 0, width, oldPreCanvas.height)
            this.outputOld.ctx.drawImage(oldPreCanvas, width, 0, oldPreCanvas.width - width, oldPreCanvas.height, 0, Math.floor(oldPreCanvas.height / 44 * 45), oldPreCanvas.width - width, oldPreCanvas.height)
            function newConvert(img) {
              const input = new Canvas(img.width, img.height)
              input.ctx.drawImage(img, 0, 0)
              input.trim()
              const canvas = new Canvas(1024, 256)
              const ctx = canvas.getContext("2d")
              const scaleFactor = Math.min(1024 / input.width, 176 / input.height)
              const newWidth = input.width * scaleFactor
              const newHeight = input.height * scaleFactor
              const x = (1024 - newWidth) / 2
              const y = (176 - newHeight) / 2
              if (newWidth > input.width) ctx.imageSmoothingEnabled = false
              ctx.drawImage(input, x, y, newWidth, newHeight)
              return canvas
            }
            this.outputNew = newConvert(canvas)
            if (img.width === img.height) {
              const m = img.width / 256
              const w = Math.floor(m * 155)
              const w2 = Math.floor(m * 119)
              const h = Math.floor(m * 44)
              const h2 = Math.floor(m * 45)
              const convertCanvas = new Canvas(w + w2, h)
              convertCanvas.ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h)
              convertCanvas.ctx.drawImage(img, 0, h2, w2, h, w, 0, w2, h)
              this.outputBetween = newConvert(convertCanvas)
              this.error = null
            } else {
              this.outputBetween = null
              this.error = "The input image must be square for this type of conversion"
            }
          }
        },
        template: `
          <h3>Input texture:</h3>
          <tab-select v-model="inputMode" :options="inputModes" />
          <file-input v-model="file" title="Select your Minecraft Title texture" @input="execute" />
          <template v-if="inputMode === 'image'">
            <h3>Minecraft Title texture:</h3>
            <tab-select v-model="outputMode" :options="outputModes" />
            <canvas-output v-if="outputMode === 'new'" v-model="outputNew" name="minecraft" height="178" />
            <canvas-output v-if="outputMode === 'old'" v-model="outputOld" name="minecraft" />
          </template>
          <template v-else>
            <h3>Minecraft Title texture for 1.20 and above:</h3>
            <canvas-output v-model="outputBetween" name="minecraft" :error="error" height="178" />
          </div>
        `
      }
    },
    skinConverter: {
      name: "Skin Converter",
      icon: "group",
      tagline: "Convert Minecraft skins between the classic and modern skin formats.",
      description: "Skin Converter is a tool that will convert Minecraft skins between the classic 64x32 format and the modern 64x64 format.",
      component: {
        data: {
          file: null,
          canvas: null,
          error: null,
          mode: "wide",
          modes: {
            wide: "Wide",
            slim: "Slim"
          },
          direction: "down"
        },
        methods: {
          async execute() {
            if (!this.file) {
              this.canvas = null
              this.error = null
              return
            }
            if (!(this.file.image.width === this.file.image.height || this.file.image.width === this.file.image.height * 2)) {
              this.canvas = null
              this.error = "Invalid skin: Skins must be square, or in the aspect ratio 2:1"
              return
            }
            if (!(Math.clz32(this.file.image.width) < Math.clz32(this.file.image.width - 1))) {
              this.canvas = null
              this.error = "Invalid skin: Skins must have dimensions that are powers of 2, such as 64, 128, 256, etc…"
              return
            }
            if (this.file.image.width < 64) {
              this.canvas = null
              this.error = "Invalid skin: The minimum size for a skin is 64x32"
              return
            }
            this.error = null
            const img = imageToCanvas(this.file.image)
            if (img.width === img.height) {
              this.direction = "down"
              this.canvas = new Canvas(img.width, Math.floor(img.width / 2))
              this.canvas.ctx.drawImage(img, 0, 0)
            } else {
              this.direction = "up"
              this.canvas = new Canvas(img.width, img.width)
              const m = img.width / 64
              this.canvas.ctx.drawImage(img, 0, 0)
              this.canvas.ctx.save()
              this.canvas.ctx.translate(img.width, 0)
              this.canvas.ctx.scale(-1, 1)
              this.canvas.ctx.drawImage(img, 0, 20 * m, 12 * m, 12 * m, 36 * m, 52 * m, 12 * m, 12 * m)
              this.canvas.ctx.drawImage(img, 12 * m, 20 * m, 4 * m, 12 * m, 32 * m, 52 * m, 4 * m, 12 * m)
              this.canvas.ctx.drawImage(img, 4 * m, 16 * m, 4 * m, 4 * m, 40 * m, 48 * m, 4 * m, 4 * m)
              this.canvas.ctx.drawImage(img, 8 * m, 16 * m, 4 * m, 4 * m, 36 * m, 48 * m, 4 * m, 4 * m)
              if (this.mode === "slim") {
                this.canvas.ctx.drawImage(img, 40 * m, 20 * m, 11 * m, 12 * m, 21 * m, 52 * m, 11 * m, 12 * m)
                this.canvas.ctx.drawImage(img, 51 * m, 20 * m, 3 * m, 12 * m, 18 * m, 52 * m, 3 * m, 12 * m)
                this.canvas.ctx.drawImage(img, 44 * m, 16 * m, 3 * m, 4 * m, 25 * m, 48 * m, 3 * m, 4 * m)
                this.canvas.ctx.drawImage(img, 47 * m, 16 * m, 3 * m, 4 * m, 22 * m, 48 * m, 3 * m, 4 * m)
              } else {
                this.canvas.ctx.drawImage(img, 40 * m, 20 * m, 12 * m, 12 * m, 20 * m, 52 * m, 12 * m, 12 * m)
                this.canvas.ctx.drawImage(img, 52 * m, 20 * m, 4 * m, 12 * m, 16 * m, 52 * m, 4 * m, 12 * m)
                this.canvas.ctx.drawImage(img, 44 * m, 16 * m, 4 * m, 4 * m, 24 * m, 48 * m, 4 * m, 4 * m)
                this.canvas.ctx.drawImage(img, 48 * m, 16 * m, 4 * m, 4 * m, 20 * m, 48 * m, 4 * m, 4 * m)
              }
            }
          }
        },
        template: `
          <h3>Input skin:</h3>
          <file-input v-model="file" title="Select your skin file" @input="execute" />
          <h3>Output skin:</h3>
          <tab-select v-if="direction === 'up'" v-model="mode" :options="modes" @input="execute" />
          <canvas-output v-model="canvas" name="skin" :error="error" />
        `
      }
    },
    wideSlimConverter: {
      name: "Wide ⇄ Slim Converter",
      icon: "supervisor_account",
      tagline: "Convert Minecraft skins between the wide and slim skin formats.",
      description: "Wide ⇄ Slim Converter is a tool that will convert Minecraft skins between the wide 4px arm format and the slim 3px arm format.",
      component: {
        data: {
          file: null,
          slim: null,
          wide: null,
          error: null,
          mode: "wide",
          modes: {
            wide: "Wide",
            slim: "Slim"
          },
          slimCol: 1,
          wideCol: 1
        },
        methods: {
          async execute() {
            if (!this.file) {
              this.slim = null
              this.wide = null
              this.error = null
              return
            }
            if (this.file.image.width != 64 || ![32, 64].includes(this.file.image.height)) {
              this.slim = null
              this.wide = null
              this.error = "Invalid skin: Skins must be 64x64 or 64x32"
              return
            }
            this.error = null

            const slimCol = this.slimCol - 1
            const wideCol = this.wideCol - 1

            this.slim = imageToCanvas(this.file.image)
            this.wide = imageToCanvas(this.file.image)

            this.slim.ctx.clearRect(44 + slimCol, 16, 12 - slimCol, 16)
            this.slim.ctx.drawImage(this.file.image, 45 + slimCol, 16, 10 - slimCol * 2, 16, 44 + slimCol, 16, 10 - slimCol * 2, 16)
            this.slim.ctx.drawImage(this.file.image, 56 - slimCol, 20, slimCol, 12, 54 - slimCol, 20, slimCol, 12)
            this.slim.ctx.clearRect(47 + slimCol, 16, 4 - slimCol, 4)
            this.slim.ctx.drawImage(this.file.image, 49 + slimCol, 16, 3 - slimCol, 4, 47 + slimCol, 16, 3 - slimCol, 4)

            this.slim.ctx.clearRect(44 + slimCol, 32, 12 - slimCol, 16)
            this.slim.ctx.drawImage(this.file.image, 45 + slimCol, 32, 10 - slimCol * 2, 16, 44 + slimCol, 32, 10 - slimCol * 2, 16)
            this.slim.ctx.drawImage(this.file.image, 56 - slimCol, 36, slimCol, 12, 54 - slimCol, 36, slimCol, 12)
            this.slim.ctx.clearRect(47 + slimCol, 32, 4 - slimCol, 4)
            this.slim.ctx.drawImage(this.file.image, 49 + slimCol, 32, 3 - slimCol, 4, 47 + slimCol, 32, 3 - slimCol, 4)

            this.slim.ctx.clearRect(39 - slimCol, 48, 9 + slimCol, 16)
            this.slim.ctx.drawImage(this.file.image, 40 - slimCol, 48, 4 + slimCol * 2, 16, 39 - slimCol, 48, 4 + slimCol * 2, 16)
            this.slim.ctx.drawImage(this.file.image, 45 + slimCol, 52, 3 - slimCol, 12, 43 + slimCol, 52, 3 - slimCol, 12)
            this.slim.ctx.clearRect(42 - slimCol, 48, 1 + slimCol, 4)
            this.slim.ctx.drawImage(this.file.image, 44 - slimCol, 48, slimCol, 4, 42 - slimCol, 48, slimCol, 4)

            this.slim.ctx.clearRect(55 - slimCol, 48, 9 + slimCol, 16)
            this.slim.ctx.drawImage(this.file.image, 56 - slimCol, 48, 4 + slimCol * 2, 16, 55 - slimCol, 48, 4 + slimCol * 2, 16)
            this.slim.ctx.drawImage(this.file.image, 61 + slimCol, 52, 3 - slimCol, 12, 59 + slimCol, 52, 3 - slimCol, 12)
            this.slim.ctx.clearRect(58 - slimCol, 48, 1 + slimCol, 4)
            this.slim.ctx.drawImage(this.file.image, 60 - slimCol, 48, slimCol, 4, 58 - slimCol, 48, slimCol, 4)

            this.wide.ctx.clearRect(45 + wideCol, 16, 12 - wideCol, 16)
            this.wide.ctx.drawImage(this.file.image, 44 + wideCol, 16, 10 - wideCol * 2, 16, 45 + wideCol, 16, 10 - wideCol * 2, 16)
            this.wide.ctx.drawImage(this.file.image, 53 - wideCol, 20, 1 + wideCol, 12, 55 - wideCol, 20, 1 + wideCol, 12)
            this.wide.ctx.clearRect(49 + wideCol, 16, 4 - wideCol, 4)
            this.wide.ctx.drawImage(this.file.image, 47 + wideCol, 16, 3 - wideCol, 4, 49 + wideCol, 16, 3 - wideCol, 4)
            
            this.wide.ctx.clearRect(45 + wideCol, 32, 12 - wideCol, 16)
            this.wide.ctx.drawImage(this.file.image, 44 + wideCol, 32, 10 - wideCol * 2, 16, 45 + wideCol, 32, 10 - wideCol * 2, 16)
            this.wide.ctx.drawImage(this.file.image, 53 - wideCol, 36, 1 + wideCol, 12, 55 - wideCol, 36, 1 + wideCol, 12)
            this.wide.ctx.clearRect(49 + wideCol, 32, 4 - wideCol, 4)
            this.wide.ctx.drawImage(this.file.image, 47 + wideCol, 32, 3 - wideCol, 4, 49 + wideCol, 32, 3 - wideCol, 4)

            this.wide.ctx.clearRect(39 - wideCol, 48, 7 + wideCol, 16)
            this.wide.ctx.drawImage(this.file.image, 38 - wideCol, 48, 6 + wideCol * 2, 16, 39 - wideCol, 48, 6 + wideCol * 2, 16)
            this.wide.ctx.drawImage(this.file.image, 43 + wideCol, 52, 3 - wideCol, 12, 45 + wideCol, 52, 3 - wideCol, 12)
            this.wide.ctx.clearRect(43 - wideCol, 48, wideCol, 4)
            this.wide.ctx.drawImage(this.file.image, 41 - wideCol, 48, 1 + wideCol, 4, 43 - wideCol, 48, 1 + wideCol, 4)

            this.wide.ctx.clearRect(55 - wideCol, 48, 7 + wideCol, 16)
            this.wide.ctx.drawImage(this.file.image, 54 - wideCol, 48, 6 + wideCol * 2, 16, 55 - wideCol, 48, 6 + wideCol * 2, 16)
            this.wide.ctx.drawImage(this.file.image, 59 + wideCol, 52, 3 - wideCol, 12, 61 + wideCol, 52, 3 - wideCol, 12)
            this.wide.ctx.clearRect(59 - wideCol, 48, wideCol, 4)
            this.wide.ctx.drawImage(this.file.image, 57 - wideCol, 48, 1 + wideCol, 4, 59 - wideCol, 48, 1 + wideCol, 4)
          }
        },
        template: `
          <h3>Input skin:</h3>
          <tab-select v-model="mode" :options="modes" />
          <file-input v-model="file" title="Select your skin file" @input="execute" />
          <h3 v-if="mode === 'wide'">The column of pixels in the arms that gets removed:</h3>
          <num-slider v-if="mode === 'wide'" v-model="slimCol" :min="1" :max="4" @input="execute" />
          <h3 v-if="mode === 'slim'">The column of pixels in the arms that gets duplicated:</h3>
          <num-slider v-if="mode === 'slim'" v-model="wideCol" :min="1" :max="3" @input="execute" />
          <h3>Output {{ mode === 'wide' ? 'slim' : 'wide' }} skin:</h3>
          <canvas-output v-if="mode === 'wide'" v-model="slim" name="slim" :error="error" />
          <canvas-output v-if="mode === 'slim'" v-model="wide" name="wide" :error="error" />
        `
      }
    },
    ctmConverter: {
      name: "CTM Converter",
      icon: "grid_view",
      tagline: "Convert compact CTM into full or overlay CTM.",
      description: "CTM Converter is a tool that will convert compact CTM into full CTM or overlay CTM.",
      component: {
        data: {
          files: [],
          error: null,
          full: null,
          overlay: null,
          mode: "full",
          modes: {
            full: "Full CTM",
            overlay: "Overlay CTM"
          }
        },
        methods: {
          async execute() {
            if (!this.files.length) {
              this.full = null
              this.overlay = null
              this.error = null
              return
            }
            if (![1, 5].includes(this.files.length)) {
              this.full = null
              this.overlay = null
              this.error = "Please provide either a combined compact CTM spritesheet, or the 5 indivdual textures"
              return
            }
            let img
            if (this.files.length === 1) {
              if (this.files[0].image.width !== this.files[0].image.height * 5) {
                this.full = null
                this.overlay = null
                this.error = "Invalid compact CTM: A compact CTM spritesheet must be in the aspect ratio 5:1"
                return
              }
              img = this.files[0].image
            } else {
              let size
              for (const [i, file] of this.files.entries()) {
                if (file.image.width !== file.image.height) {
                  this.full = null
                  this.overlay = null
                  this.error = "Invalid input: CTM sprites must be square"
                  return
                }
                if (!size) {
                  size = file.image.width
                  img = new Canvas(size * 5, size)
                } else if (file.image.width !== size) {
                  this.full = null
                  this.overlay = null
                  this.error = "Invalid input: All CTM sprites must be the same size"
                  return
                }
                img.ctx.drawImage(file.image, size * i, 0)
              }
            }
            if (img.height < 2) {
              this.full = null
              this.overlay = null
              this.error = "Invalid input: The minimum tile size is 2x2"
              return
            }
            this.error = null
            const coords = {
              full: [0, 0, 16, 16],
              empty: [16, 0, 16, 16],
              emptyTop: [16, 0, 16, 8],
              emptyBottom: [16, 8, 16, 8],
              emptyLeft: [16, 0, 8, 16],
              emptyRight: [24, 0, 8, 16],
              emptyTopLeft: [16, 0, 8, 8],
              emptyTopRight: [24, 0, 8, 8],
              emptyBottomLeft: [16, 8, 8, 8],
              emptyBottomRight: [24, 8, 8, 8],
              leftRight: [32, 0, 16, 16],
              topBottom: [48, 0, 16, 16],
              corners: [64, 0, 16, 16],
              fullLeft: [0, 0, 8, 16],
              fullRight: [8, 0, 8, 16],
              fullTop: [0, 0, 16, 8],
              fullBottom: [0, 8, 16, 8],
              topBottomLeft: [48, 0, 8, 16],
              topBottomRight: [56, 0, 8, 16],
              leftRightTop: [32, 0, 16, 8],
              leftRightBottom: [32, 8, 16, 8],
              leftRightLeft: [32, 0, 8, 16],
              leftRightRight: [40, 0, 8, 16],
              topBottomTop: [48, 0, 16, 8],
              topBottomBottom: [48, 8, 16, 8],
              fullTopLeft: [0, 0, 8, 8],
              fullTopRight: [8, 0, 8, 8],
              fullBottomLeft: [0, 8, 8, 8],
              fullBottomRight: [8, 8, 8, 8],
              topBottomTopLeft: [48, 0, 8, 8],
              topBottomTopRight: [56, 0, 8, 8],
              topBottomBottomLeft: [48, 8, 8, 8],
              topBottomBottomRight: [56, 8, 8, 8],
              leftRightTopLeft: [32, 0, 8, 8],
              leftRightTopRight: [40, 0, 8, 8],
              leftRightBottomLeft: [32, 8, 8, 8],
              leftRightBottomRight: [40, 8, 8, 8],
              cornersTop: [64, 0, 16, 8],
              cornersBottom: [64, 8, 16, 8],
              cornersLeft: [64, 0, 8, 16],
              cornersRight: [72, 0, 8, 16],
              cornersTopLeft: [64, 0, 8, 8],
              cornersTopRight: [72, 0, 8, 8],
              cornersBottomLeft: [64, 8, 8, 8],
              cornersBottomRight: [72, 8, 8, 8],
              emptyTopLeft: [16, 0, 8, 8],
              emptyTopRight: [24, 0, 8, 8],
              emptyBottomLeft: [16, 8, 8, 8],
              emptyBottomRight: [24, 8, 8, 8],
              emptyLeft: [16, 0, 8, 16],
              emptyRight: [24, 0, 8, 16],
              emptyTop: [16, 0, 16, 8],
              emptyBottom: [16, 8, 16, 8]
            }
            const fullMap = [
              ["full", 0, 0],
              ["fullLeft", 16, 0],
              ["topBottomRight", 24, 0],
              ["topBottom", 32, 0],
              ["topBottomLeft", 48, 0],
              ["fullRight", 56, 0],
              ["fullTop", 0, 16],
              ["leftRightBottom", 0, 24],
              ["leftRight", 0, 32],
              ["leftRightTop", 0, 48],
              ["fullBottom", 0, 56],
              ["fullTopLeft", 16, 16],
              ["topBottomTopRight", 24, 16],
              ["topBottomTop", 32, 16],
              ["topBottomTopLeft", 48, 16],
              ["fullTopRight", 56, 16],
              ["leftRightBottomRight", 56, 24],
              ["leftRightRight", 56, 32],
              ["leftRightTopRight", 56, 48],
              ["fullBottomRight", 56, 56],
              ["topBottomBottomLeft", 48, 56],
              ["topBottomBottom", 32, 56],
              ["topBottomBottomRight", 24, 56],
              ["fullBottomLeft", 16, 56],
              ["leftRightTopLeft", 16, 48],
              ["leftRightLeft", 16, 32],
              ["leftRightBottomLeft", 16, 24],
              ["emptyBottomRight", 24, 24],
              ["emptyBottom", 32, 24],
              ["emptyBottomLeft", 48, 24],
              ["emptyLeft", 48, 32],
              ["emptyTopLeft", 48, 48],
              ["emptyTop", 32, 48],
              ["emptyTopRight", 24, 48],
              ["emptyRight", 24, 32],
              ["empty", 32, 32],
              ["fullTopLeft", 64, 0],
              ["topBottomTopRight", 72, 0],
              ["topBottomTopLeft", 80, 0],
              ["fullTopRight", 88, 0],
              ["leftRightBottomRight", 88, 8],
              ["leftRightTopRight", 88, 16],
              ["fullBottomRight", 88, 24],
              ["topBottomBottomLeft", 80, 24],
              ["topBottomBottomRight", 72, 24],
              ["fullBottomLeft", 64, 24],
              ["leftRightTopLeft", 64, 16],
              ["leftRightBottomLeft", 64, 8],
              ["cornersBottomRight", 72, 8],
              ["cornersBottomLeft", 80, 8],
              ["cornersTopLeft", 80, 16],
              ["cornersTopRight", 72, 16],
              ["leftRightLeft", 96, 0],
              ["cornersTopRight", 104, 0],
              ["topBottomTop", 112, 0],
              ["cornersBottomRight", 120, 8],
              ["leftRightRight", 120, 16],
              ["cornersBottomLeft", 112, 24],
              ["topBottomBottom", 96, 24],
              ["cornersTopLeft", 96, 16],
              ["cornersBottomRight", 104, 8],
              ["cornersBottomLeft", 112, 8],
              ["cornersTopLeft", 112, 16],
              ["cornersTopRight", 104, 16],
              ["cornersLeft", 128, 0],
              ["emptyTopRight", 136, 0],
              ["cornersTop", 144, 0],
              ["emptyBottomRight", 152, 8],
              ["cornersRight", 152, 16],
              ["emptyBottomLeft", 144, 24],
              ["cornersBottom", 128, 24],
              ["emptyTopLeft", 128, 16],
              ["cornersBottomRight", 136, 8],
              ["cornersBottomLeft", 144, 8],
              ["cornersTopLeft", 144, 16],
              ["cornersTopRight", 136, 16],
              ["emptyLeft", 160, 0],
              ["cornersRight", 168, 0],
              ["emptyTop", 176, 0],
              ["cornersBottom", 176, 8],
              ["emptyRight", 184, 16],
              ["cornersLeft", 176, 16],
              ["emptyBottom", 160, 24],
              ["cornersTop", 160, 16],
              ["leftRightLeft", 64, 32],
              ["cornersTopRight", 72, 32],
              ["topBottomTop", 80, 32],
              ["cornersBottomRight", 88, 40],
              ["leftRightRight", 88, 48],
              ["cornersBottomLeft", 80, 56],
              ["topBottomBottom", 64, 56],
              ["cornersTopLeft", 64, 48],
              ["emptyBottomRight", 72, 40],
              ["emptyBottomLeft", 80, 40],
              ["emptyTopLeft", 80, 48],
              ["emptyTopRight", 72, 48],
              ["leftRightLeft", 96, 32],
              ["emptyTopRight", 104, 32],
              ["topBottomTop", 112, 32],
              ["emptyBottomRight", 120, 40],
              ["leftRightRight", 120, 48],
              ["emptyBottomLeft", 112, 56],
              ["topBottomBottom", 96, 56],
              ["emptyTopLeft", 96, 48],
              ["cornersBottomRight", 104, 40],
              ["cornersBottomLeft", 112, 40],
              ["cornersTopLeft", 112, 48],
              ["cornersTopRight", 104, 48],
              ["emptyTop", 128, 32],
              ["emptyTop", 144, 32],
              ["emptyBottomRight", 152, 40],
              ["emptyTopRight", 152, 48],
              ["emptyBottom", 144, 56],
              ["emptyBottom", 128, 56],
              ["emptyTopLeft", 128, 48],
              ["emptyBottomLeft", 128, 40],
              ["cornersBottomRight", 136, 40],
              ["cornersBottomLeft", 144, 40],
              ["cornersTopLeft", 144, 48],
              ["cornersTopRight", 136, 48],
              ["cornersTopLeft", 160, 32],
              ["emptyTopRight", 168, 32],
              ["cornersBottomRight", 168, 40],
              ["emptyBottomLeft", 160, 40],
              ["emptyTopLeft", 176, 32],
              ["cornersTopRight", 184, 32],
              ["emptyBottomRight", 184, 40],
              ["cornersBottomLeft", 176, 40],
              ["corners", 160, 48]
            ]
            const overlayMap = [
              ["emptyLeft", 0, 0],
              ["emptyTopRight", 8, 0],
              ["emptyTop", 16, 0],
              ["emptyTopLeft", 32, 0],
              ["emptyRight", 40, 0],
              ["emptyRight", 40, 16],
              ["emptyRight", 40, 32],
              ["emptyBottomLeft", 32, 40],
              ["emptyBottom", 16, 40],
              ["emptyBottomRight", 8, 40],
              ["emptyLeft", 0, 32],
              ["emptyLeft", 0, 16],
              ["cornersBottomRight", 8, 8],
              ["topBottomBottom", 16, 8],
              ["cornersBottomLeft", 32, 8],
              ["leftRightLeft", 32, 16],
              ["cornersTopLeft", 32, 32],
              ["topBottomTop", 16, 32],
              ["cornersTopRight", 8, 32],
              ["leftRightRight", 8, 16],
              ["full", 16, 16],
              ["topBottomBottomLeft", 48, 8],
              ["fullBottomRight", 56, 8],
              ["leftRightTopRight", 56, 0],
              ["leftRightTopLeft", 64, 0],
              ["fullBottomLeft", 64, 8],
              ["topBottomBottomRight", 72, 8],
              ["topBottomTopRight", 72, 16],
              ["fullTopLeft", 64, 16],
              ["leftRightBottomLeft", 64, 24],
              ["leftRightBottomRight", 56, 24],
              ["fullTopRight", 56, 16],
              ["topBottomTopLeft", 48, 16],
              ["emptyTopLeft", 48, 0],
              ["emptyTopRight", 72, 0],
              ["emptyBottomRight", 72, 24],
              ["emptyBottomLeft", 48, 24],
              ["fullBottom", 80, 8],
              ["leftRightTop", 80, 0],
              ["fullLeft", 96, 0],
              ["topBottomRight", 104, 0],
              ["fullTop", 96, 16],
              ["leftRightBottom", 96, 24],
              ["fullRight", 88, 16],
              ["topBottomLeft", 80, 16]
            ]
            const multiplier = img.width / 80
            this.full = new Canvas(Math.floor(192 * multiplier), Math.floor(64 * multiplier))
            this.overlay = new Canvas(Math.floor(112 * multiplier), Math.floor(48 * multiplier))
            function paste(canvas, img, multiplier, area, x, y) {
              const [x2, y2, w, h] = coords[area].map(e => Math.floor(e * multiplier))
              canvas.ctx.drawImage(img, x2, y2, w, h, Math.floor(x * multiplier), Math.floor(y * multiplier), w, h)
            }
            for (const [area, x, y] of fullMap) paste(this.full, img, multiplier, area, x, y)
            for (const [area, x, y] of overlayMap) paste(this.overlay, img, multiplier, area, x, y)
          },
          async save() {
            const dir = Blockbench.pickDirectory()
            if (!dir) return
            let img, tileSize, tileCount
            if (this.mode === "full") {
              img = this.full
              tileSize = img.width / 12
              tileCount = 47
            } else {
              img = this.overlay
              tileSize = img.width / 7
              tileCount = 17
            }
            const canvas = new Canvas(tileSize, tileSize)
            let tile = 0
            loop:
            for (let h = 0; h < img.height; h += tileSize) {
              for (let w = 0; w < img.width; w += tileSize) {
                canvas.ctx.drawImage(img, w, h, tileSize, tileSize, 0, 0, tileSize, tileSize)
                await fs.promises.writeFile(path.join(dir, tile + ".png"), Buffer.from(await (await new Promise(fulfil => canvas.toBlob(fulfil))).arrayBuffer()))
                canvas.ctx.clearRect(0, 0, tileSize, tileSize)
                tile++
                if (tile >= tileCount) {
                  break loop
                }
              }
            }
            Blockbench.showQuickMessage("Exported CTM")
          }
        },
        template: `
          <h3>Compact CTM:</h3>
          <file-input v-model="files" title="Select your compact CTM" @input="execute" max="5" />
          <h3>Output CTM:</h3>
          <tab-select v-model="mode" :options="modes" @input="execute" />
          <canvas-output v-if="mode === 'full'" v-model="full" name="full_ctm" :error="error" height="192" />
          <canvas-output v-if="mode === 'overlay'" v-model="overlay" name="overlay_ctm" :error="error" height="192" />
          <button :disabled="!full" @click="save">Export CTM</button>
        `
      }
    },
    chestConverter: {
      name: "Chest Converter",
      icon: "package_2",
      tagline: "Convert chest textures between the 1.14 and 1.15 formats.",
      description: "Chest Converter is a tool that will convert the chest textures between the 1.14 format 1.15 format.",
      component: {
        data: {
          file: null,
          files: [],
          name: "normal",
          output: null,
          output2: null,
          error: null,
          mode: "normalOld",
          modes: {
            normalOld: "1.14 format normal",
            largeOld: "1.14 format double",
            normalNew: "1.15 format normal",
            largeNew: "1.15 format double"
          }
        },
        methods: {
          async execute() {
            if ((this.mode === "normalOld" || this.mode === "largeOld" || this.mode === "normalNew") && !this.file) {
              this.output = null
              this.output2 = null
              this.error = null
              return
            }
            if (this.mode === "largeNew" && !this.files.length) {
              this.output = null
              this.output2 = null
              this.error = null
              return
            }
            if ((this.mode === "normalOld" || this.mode === "normalNew") && this.file.image.width !== this.file.image.height) {
              this.output = null
              this.output2 = null
              this.error = "Invalid chest texture: Normal chest textures must be square"
              return
            }
            if (this.mode === "largeOld" && this.file.image.width !== this.file.image.height * 2) {
              this.output = null
              this.output2 = null
              this.error = "Invalid chest texture: 1.14 format double chest textures must be in the aspect ratio 2:1"
              return
            }
            if (this.mode === "largeNew") {
              if (this.files.length < 2) {
                this.output = null
                this.output2 = null
                this.error = "Please provide both parts of the 1.15 format double chest texture"
                return
              }
              if (this.files.some(e => e.image.width !== e.image.height)) {
                this.output = null
                this.output2 = null
                this.error = "Invalid chest texture: 1.15 format double chest textures must be square"
                return
              }
              if (this.files[0].image.width !== this.files[1].image.width) {
                this.output = null
                this.output2 = null
                this.error = "Invalid chest texture: Both 1.15 format double chest textures must be the same size"
                return
              }
            }
            this.error = null
            const drawFlipped = (canvas, m, img, x, y, w, h, x2, y2) => canvas.ctx.drawImage(img, Math.floor(x * m), Math.floor(y * m), Math.floor(w * m), Math.floor(h * m), Math.floor(x2 * m), Math.floor(canvas.height - (y2 + h) * m), Math.floor(w * m), Math.floor(h * m))
            const drawRotated = (canvas, m, img, x, y, w, h, x2, y2) => canvas.ctx.drawImage(img, Math.floor(x * m), Math.floor(y * m), Math.floor(w * m), Math.floor(h * m), Math.floor(canvas.width - (x2 + w) * m), Math.floor(canvas.height - (y2 + h) * m), Math.floor(w * m), Math.floor(h * m))
            if (this.mode === "normalOld" || this.mode === "normalNew") {
              this.name = "normal"
              this.output2 = null
              const m = this.file.image.width / 64
              this.output = imageToCanvas(this.file.image)
              this.output.ctx.save()
              this.output.ctx.scale(1, -1)
              this.output.ctx.translate(0, -this.output.height)
              drawFlipped(this.output, m, this.file.image, 14, 0, 14, 14, 28, 0)
              drawFlipped(this.output, m, this.file.image, 28, 0, 14, 14, 14, 0)
              drawFlipped(this.output, m, this.file.image, 14, 19, 14, 14, 28, 19)
              drawFlipped(this.output, m, this.file.image, 28, 19, 14, 14, 14, 19)
              drawFlipped(this.output, m, this.file.image, 1, 0, 2, 1, 3, 0)
              drawFlipped(this.output, m, this.file.image, 3, 0, 2, 1, 1, 0)
              this.output.ctx.restore()
              this.output.ctx.rotate(Math.degToRad(180))
              this.output.ctx.translate(-this.output.width, -this.output.height)
              drawRotated(this.output, m, this.file.image, 14, 14, 42, 5, 14, 14)
              drawRotated(this.output, m, this.file.image, 0, 14, 14, 5, 0, 14)
              drawRotated(this.output, m, this.file.image, 14, 33, 42, 10, 14, 33)
              drawRotated(this.output, m, this.file.image, 0, 33, 14, 10, 0, 33)
              drawRotated(this.output, m, this.file.image, 1, 1, 5, 4, 1, 1)
              drawRotated(this.output, m, this.file.image, 0, 1, 1, 4, 0, 1)
            } else if (this.mode === "largeOld") {
              this.name = "normal_left"
              const m = this.file.image.width / 128
              this.output = new Canvas(this.file.image.height, this.file.image.height)
              this.output.ctx.save()
              this.output.ctx.scale(1, -1)
              this.output.ctx.translate(0, -this.output.height)
              drawFlipped(this.output, m, this.file.image, 59, 0, 15, 14, 14, 0)
              drawFlipped(this.output, m, this.file.image, 29, 0, 15, 14, 29, 0)
              drawFlipped(this.output, m, this.file.image, 59, 19, 15, 14, 14, 19)
              drawFlipped(this.output, m, this.file.image, 29, 19, 15, 14, 29, 19)
              drawFlipped(this.output, m, this.file.image, 4, 0, 1, 1, 1, 0)
              drawFlipped(this.output, m, this.file.image, 2, 0, 1, 1, 2, 0)
              this.output.ctx.restore()
              this.output.ctx.rotate(Math.degToRad(180))
              this.output.ctx.translate(-this.output.width, -this.output.height)
              drawRotated(this.output, m, this.file.image, 29, 14, 44, 5, 14, 14)
              drawRotated(this.output, m, this.file.image, 29, 33, 44, 10, 14, 33)
              drawRotated(this.output, m, this.file.image, 2, 1, 3, 4, 1, 1)
              this.output2 = new Canvas(this.file.image.height, this.file.image.height)
              this.output2.ctx.save()
              this.output2.ctx.scale(1, -1)
              this.output2.ctx.translate(0, -this.output2.height)
              drawFlipped(this.output2, m, this.file.image, 44, 0, 15, 14, 14, 0)
              drawFlipped(this.output2, m, this.file.image, 14, 0, 15, 14, 29, 0)
              drawFlipped(this.output2, m, this.file.image, 44, 19, 15, 14, 14, 19)
              drawFlipped(this.output2, m, this.file.image, 14, 19, 15, 14, 29, 19)
              drawFlipped(this.output2, m, this.file.image, 3, 0, 1, 1, 1, 0)
              drawFlipped(this.output2, m, this.file.image, 1, 0, 1, 1, 2, 0)
              this.output2.ctx.restore()
              this.output2.ctx.rotate(Math.degToRad(180))
              this.output2.ctx.translate(-this.output2.width, -this.output2.height)
              drawRotated(this.output2, m, this.file.image, 0, 14, 14, 5, 0, 14)
              drawRotated(this.output2, m, this.file.image, 73, 14, 15, 5, 14, 14)
              drawRotated(this.output2, m, this.file.image, 14, 14, 15, 5, 43, 14)
              drawRotated(this.output2, m, this.file.image, 0, 33, 14, 10, 0, 33)
              drawRotated(this.output2, m, this.file.image, 73, 33, 15, 10, 14, 33)
              drawRotated(this.output2, m, this.file.image, 14, 33, 15, 10, 43, 33)
              drawRotated(this.output2, m, this.file.image, 0, 1, 1, 4, 0, 1)
              drawRotated(this.output2, m, this.file.image, 5, 1, 1, 4, 1, 1)
              drawRotated(this.output2, m, this.file.image, 1, 1, 1, 4, 3, 1)
            } else {
              this.name = "normal_double"
              this.output2 = null
              const m = this.files[0].image.width / 64
              this.output = new Canvas(this.files[0].image.width * 2, this.files[0].image.height)
              this.output.ctx.save()
              this.output.ctx.scale(1, -1)
              this.output.ctx.translate(0, -this.output.height)
              drawFlipped(this.output, m, this.files[0].image, 14, 0, 15, 14, 59, 0)
              drawFlipped(this.output, m, this.files[1].image, 14, 0, 15, 14, 44, 0)
              drawFlipped(this.output, m, this.files[0].image, 29, 0, 15, 14, 29, 0)
              drawFlipped(this.output, m, this.files[1].image, 29, 0, 15, 14, 14, 0)
              drawFlipped(this.output, m, this.files[0].image, 14, 19, 15, 14, 59, 19)
              drawFlipped(this.output, m, this.files[1].image, 14, 19, 15, 14, 44, 19)
              drawFlipped(this.output, m, this.files[0].image, 29, 19, 15, 14, 29, 19)
              drawFlipped(this.output, m, this.files[1].image, 29, 19, 15, 14, 14, 19)
              drawFlipped(this.output, m, this.files[0].image, 1, 0, 1, 1, 4, 0)
              drawFlipped(this.output, m, this.files[1].image, 1, 0, 1, 1, 3, 0)
              drawFlipped(this.output, m, this.files[0].image, 2, 0, 1, 1, 2, 0)
              drawFlipped(this.output, m, this.files[1].image, 2, 0, 1, 1, 1, 0)
              this.output.ctx.restore()
              this.output.ctx.rotate(Math.degToRad(180))
              this.output.ctx.translate(-this.output.width, -this.output.height)
              drawRotated(this.output, m, this.files[0].image, 14, 14, 44, 5, 29, 14)
              drawRotated(this.output, m, this.files[1].image, 0, 14, 14, 5, 0, 14)
              drawRotated(this.output, m, this.files[1].image, 14, 14, 15, 5, 73, 14)
              drawRotated(this.output, m, this.files[1].image, 43, 14, 15, 5, 14, 14)
              drawRotated(this.output, m, this.files[0].image, 14, 33, 44, 10, 29, 33)
              drawRotated(this.output, m, this.files[1].image, 0, 33, 14, 10, 0, 33)
              drawRotated(this.output, m, this.files[1].image, 14, 33, 15, 10, 73, 33)
              drawRotated(this.output, m, this.files[1].image, 43, 33, 15, 10, 14, 33)
              drawRotated(this.output, m, this.files[0].image, 1, 1, 3, 4, 2, 1)
              drawRotated(this.output, m, this.files[1].image, 0, 1, 1, 4, 0, 1)
              drawRotated(this.output, m, this.files[1].image, 1, 1, 1, 4, 5, 1)
              drawRotated(this.output, m, this.files[1].image, 3, 1, 1, 4, 1, 1)
            }
          }
        },
        template: `
          <h3>Input chest texture{{ mode === 'largeNew' ? "s" : "" }}:</h3>
          <tab-select v-model="mode" :options="modes" @input="execute" />
          <file-input v-if="mode !== 'largeNew'" :key="mode" v-model="file" title="Select your chest texture" @input="execute" />
          <file-input v-if="mode === 'largeNew'" :key="mode" v-model="files" title="Select your chest textures" @input="execute" max="2" />
          <h3>Output chest textures:</h3>
          <div class="row" style="gap: 16px;">
            <canvas-output v-model="output" :name="name" :error="error" />
            <canvas-output v-if="output2" v-model="output2" name="normal_right" />
          </div>
        `
      }
    },
    imageResizer: {
      name: "Image Resizer",
      icon: "resize",
      tagline: "Batch resize images in a folder, relative to their original sizes.",
      description: "Image Resizer is a tool that will go through all images in a folder and resize them, relative to their original size.",
      component: {
        data: {
          folder: "",
          multiplier: 2,
          method: "nearest",
          methods: {
            nearest: "Nearest",
            bilinear: "Bilinear"
          },
          ignoreList: [],
          outputLog,
          done: 0,
          total: null,
          cancelled: false
        },
        methods: {
          async execute() {
            if (!await confirm("Run Image Resizer?", `Are you sure you want to run Image Resizer over the following folder:\n<code>${formatPath(this.folder)}</code>\n\nMake a backup first if you would like to keep the original versions of the images.`)) return

            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false

            if (!await exists(this.folder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The folder \`${formatPath(this.folder)}\` was not found`)
              return
            }

            const files = []
            for await (const file of getFiles(this.folder)) {
              const shortened = formatPath(file.slice(this.folder.length)).replace(/^\//, "")
              if (
                !file.endsWith(".png") ||
                this.ignoreList.some(item => shortened.toLowerCase().includes(item))
              ) continue
              files.push([file, shortened])
            }

            this.total = files.length

            for (const [file, shortened] of files) {
              if (this.cancelled) break
              
              const img = await loadImage(file)

              const width = Math.max(1, Math.round(img.width * this.multiplier))
              const height = Math.max(1, Math.round(img.height * this.multiplier))

              if (width > 4096 || height > 4096) {
                output.warn(`Skipping \`${shortened}\` as \`${width}x${height}\` is over the maxinum size limit (\`4096x4096\`)`)
                this.done++
                continue
              }

              const canvas = new Canvas(width, height)
              
              if (this.method === "nearest") {
                canvas.ctx.imageSmoothingEnabled = false
              }

              canvas.ctx.drawImage(img, 0, 0, width, height)

              await fs.promises.writeFile(file, Buffer.from(await (await new Promise(fulfil => canvas.toBlob(fulfil))).arrayBuffer()))

              output.log(`Resized \`${shortened}\` from \`${img.width}x${img.height}\` to \`${width}x${height}\``)
              this.done++
            }

            this.total = this.done
            output.info("Finished")
            this.status.processing = false
            this.status.finished = true
          }
        },
        template: `
          <div v-if="!status.processing && !status.finished">
            <div class="row">
              <div class="col spacer">
                <h3>Folder to Resize:</h3>
                <folder-selector v-model="folder">folder to resize the images of</folder-selector>
                <select-row v-model="method" :options="methods" width="148">Interpolation method</select-row>
                <num-input-row v-model="multiplier" :min="0.1" :max="256" :step="0.1" width="148">Size Multiplier</num-input-row>
                <div>If the input size is <code>16</code>, the output size will be <code>{{ Math.round(16 * multiplier).toLocaleString() }}</code></div>
              </div>
              <ignore-list v-model="ignoreList" style="align-self: flex-start;" />
            </div>
            <button :disabled="!folder" @click="execute">Resize</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <button v-else @click="status.finished = false">Done</button>
          </div>
        `
      }
    },
    clockGenerator: {
      name: "Clock Generator",
      icon: "schedule",
      tagline: "Easily generate a full set of clock textures from a simple input texture.",
      description: "Clock Generator is a tool that allows you to quickly and easily generate a full set of clock textures from a simple input texture.",
      component: {
        data: {
          file: null,
          frameCount: 32,
          method: "nearest",
          methods: {
            nearest: "Nearest",
            bilinear: "Bilinear"
          },
          gif: null,
          frames: [],
          error: null,
          template: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQBAMAAACigOGCAAAAMFBMVEUAAAD/APv///8AAAAeHBxJaNhsbIl1KAKyZBHclhPpsRX61kr797f99V///wD///9MIKtdAAAABHRSTlMAAAAzDEMHjAAAAMxJREFUeF5tzKEOgkAcgPH/KFoPXwApGtwYuyazMd/AanJmR0GbzUNnVoLJ4mAkguq9go0mI1oJvADe/8YcG3z1t32gATAGoMyq9CoBLOOsDbrRdfza1sEoJOwTSq0bwvwrwSjLAuFICendEfJcQikSMPyYhJDQaUJiqnrfcv4rA6EQEJujREXAJBSGhAedxPTg2FW6LgBXg/SdRmmIMF0gyBAunAfBE2Fp10HbZDzgJ6UJaz9LzzulsdI6ns/YCgGrAbgec6ENwHWhCT8ruX6BrD+klgAAAABJRU5ErkJggg=="
        },
        methods: {
          saveTemplate() {
            Blockbench.export({
              extensions: ["png"],
              type: "PNG",
              name: "template",
              savetype: "image",
              content: this.template
            }, () => Blockbench.showQuickMessage("Saved template…"))
          },
          async execute() {
            if (!this.file) {
              this.gif = null
              this.error = null
              return
            }
            const size = this.file.image.height
            if (this.file.image.width !== size * 3) {
              this.gif = null
              this.error = "Invalid texture: The clock texture must be in the aspect ratio 3:1"
              return
            }
            this.error = null
            this.frames = []
            const gif = GIFEnc.GIFEncoder()
            for (let x = 0; x < this.frameCount; x++) {
              const canvas = new Canvas(size, size)
              if (this.method === "nearest") {
                canvas.ctx.imageSmoothingEnabled = false
              }
              canvas.ctx.save()
              canvas.ctx.translate(size / 2, size / 2)
              canvas.ctx.rotate((360 / this.frameCount * x) * Math.PI / 180)
              canvas.ctx.drawImage(this.file.image, size, 0, size, size, -size / 2, -size / 2, size, size)
              canvas.ctx.restore()
              canvas.ctx.globalCompositeOperation = "destination-in"
              canvas.ctx.drawImage(this.file.image, 2 * size, 0, size, size, 0, 0, size, size)
              canvas.ctx.globalCompositeOperation = "source-over"
              canvas.ctx.drawImage(this.file.image, 0, 0, size, size, 0, 0, size, size)
              this.frames.push(canvas)
              const { data } = canvas.ctx.getImageData(0, 0, size, size)
              const palette = GIFEnc.quantize(data, 256)
              const index = GIFEnc.applyPalette(data, palette)
              let transparent
              for (let i = data.length - 1; i >= 0; i -= 4) {
                if (data[i] < 128) {
                  transparent = true
                  break
                }
              }
              gif.writeFrame(index, size, size, {
                transparent,
                palette,
                delay: 50,
                dispose: 2
              })
            }
            gif.finish()
            this.gif = gif.bytes()
          },
          async save() {
            const dir = Blockbench.pickDirectory()
            if (!dir) return
            await Promise.all(this.frames.map(async (frame, i) => fs.promises.writeFile(path.join(dir, `clock_${i.toString().padStart(2, 0)}.png`), Buffer.from(await (await new Promise(fulfil => frame.toBlob(fulfil))).arrayBuffer()))))
            Blockbench.showQuickMessage("Exported clock")
          }
        },
        styles: `
          #template {
            display: flex;
            gap: 8px;
            flex-direction: row;
          }
        `,
        template: `
          <h3>Template:</h3>
          <div class="row">
            <div class="spacer">The input texture consists of three parts: the clock frame (gets overlayed on top), the rotating dial (should cover the entire area), and a mask to control the dial's visibility (solid pixels show the dial, transparent pixels hide it).</div>
            <div class="col" style="margin-top: -32px;">
              <img class="checkerboard" width="192" height="64" :src="template">
              <button style="margin-top: -8px;" @click="saveTemplate">Save template</button>
            </div>
          </div>
          <h3>Input texture:</h3>
          <file-input v-model="file" title="Select your clock texture" @input="execute" />
          <div>
            <num-input-row v-model="frameCount" :min="2" :max="360" width="148" @input="execute">Frame count</num-input-row>
            <select-row v-model="method" :options="methods" width="148" @input="execute">Interpolation method</select-row>
          </div>
          <h3>Output clock:</h3>
          <canvas-output v-model="gif" name="clock" :error="error" type="GIF" />
          <button :disabled="!gif" @click="save">Export Clock</button>
        `
      }
    },
    animationCombiner: {
      name: "Animation Combiner",
      icon: "theaters",
      tagline: "Combine a folder of textures into an animated spritesheet texture.",
      description: "Animation Combiner is a tool that combines the textures from a selected folder into an animated spritesheet texture.",
      component: {
        data: {
          folder: "",
          ignoreList: [],
          outputLog,
          done: 0,
          total: null,
          cancelled: false,
          gif: null,
          output: null,
          type: "vertical",
          types: {
            vertical: "Vertical",
            horizonal: "Horizontal"
          },
          delay: 1,
          interpolation: false,
          width: null,
          height: null
        },
        methods: {
          async execute() {
            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = null
            this.cancelled = false
            this.gif = null
            this.width = null
            this.height = null

            if (!await exists(this.folder)) {
              this.status.finished = true
              this.status.processing = false
              this.total = 0
              output.error(`The folder \`${formatPath(this.folder)}\` was not found`)
              return
            }

            const files = await listFiles(this.folder, "png")
            
            this.total = files.length

            const frames = []

            for (const file of files) {
              if (this.cancelled) break
              let img
              try {
                img = await loadImage(path.join(this.folder, file))
              } catch {
                output.error(`Skipping \`${shortened}\` as it could not be read`)
                this.done++
                continue
              }
              if (!this.width) {
                this.width = img.width
                this.height = img.height
                output.log(`Animation frame size set to \`${this.width}x${this.height}\`. Loaded from \`${file}\``)
              } else if (img.width !== this.width || img.height !== this.height) {
                output.warn(`Skipping \`${file}\` as its size \`${img.width}x${img.height}\` does not match the animation frame size \`${this.width}x${this.height}\``)
                this.done++
                continue
              }
              frames.push(img)
              this.done++
            }

            if (!this.cancelled) {
              const gif = GIFEnc.GIFEncoder()
              if (this.type === "vertical") {
                this.output = new Canvas(this.width, this.height * frames.length)
              } else {
                this.output = new Canvas(this.width * frames.length, this.height)
              }
              let delay, interpolationFrames, opacityMultiplier
              if (this.interpolation) {
                if (this.delay === 1) {
                  delay = 25
                  interpolationFrames = 1
                  opacityMultiplier = 0.5
                } else if (this.delay === 2) {
                  delay = 17
                  interpolationFrames = 2
                  opacityMultiplier = 0.33
                } else if (this.delay === 3) {
                  delay = 13
                  interpolationFrames = 3
                  opacityMultiplier = 0.25
                } else {
                  delay = this.delay * 10
                  interpolationFrames = 4
                  opacityMultiplier = 0.2
                }
              }
              for (const [i, frame] of frames.entries()) {
                if (this.type === "vertical") {
                  this.output.ctx.drawImage(frame, 0, i * this.height)
                } else {
                  this.output.ctx.drawImage(frame, i * this.width, 0)
                }
                const canvas = imageToCanvas(frame)
                const { data } = canvas.ctx.getImageData(0, 0, this.width, this.height)
                const palette = GIFEnc.quantize(data, 256)
                const index = GIFEnc.applyPalette(data, palette)
                let transparent
                for (let i = data.length - 1; i >= 0; i -= 4) {
                  if (data[i] < 128) {
                    transparent = true
                    break
                  }
                }
                if (this.interpolation) {
                  gif.writeFrame(index, this.width, this.height, {
                    transparent,
                    palette,
                    delay: this.delay * 10
                  })
                  const nextFrame = frames[i + 1] ?? frames[0]
                  for (let j = 1; j <= interpolationFrames; j++) {
                    const interpolatedCanvas = imageToCanvas(frame)
                    const ctx = interpolatedCanvas.ctx
                    ctx.drawImage(frame, 0, 0)
                    ctx.globalAlpha = j * opacityMultiplier
                    ctx.drawImage(nextFrame, 0, 0)
                    ctx.globalAlpha = 1

                    const { data } = ctx.getImageData(0, 0, this.width, this.height)
                    const palette = GIFEnc.quantize(data, 256)
                    const index = GIFEnc.applyPalette(data, palette)
                    gif.writeFrame(index, this.width, this.height, {
                      transparent,
                      palette,
                      delay
                    })
                  }
                } else {
                  gif.writeFrame(index, this.width, this.height, {
                    transparent,
                    palette,
                    delay: this.delay * 50,
                    dispose: 2
                  })
                }
              }
              gif.finish()
              this.gif = gif.bytes()
            }

            this.total = this.done
            output.info("Finished")
            this.status.processing = false
            this.status.finished = true
          },
          async save() {
            const save = await electron.dialog.showSaveDialog({
              title: "Save animation",
              defaultPath: "animation",
              filters: [
                { name: "PNG", extensions: ["png"] }
              ]
            })
            if (save.cancelled) return
            await fs.promises.writeFile(save.filePath, Buffer.from(await (await new Promise(fulfil => this.output.toBlob(fulfil))).arrayBuffer()))
            const mcmeta = {
              animation: {}
            }
            if (this.delay > 1) {
              mcmeta.animation.frametime = this.delay
            }
            if (this.interpolation) {
              mcmeta.animation.interpolate = true
            }
            if (this.type === "vertical" && this.width !== this.height) {
              mcmeta.animation.height = this.height
            } else if (this.type === "horizonal") {
              mcmeta.animation.width = this.width
            }
            await fs.promises.writeFile(save.filePath + ".mcmeta", JSON.stringify(mcmeta, null, 2))
            Blockbench.showQuickMessage("Exported animation")
          }
        },
        styles: `
          #template {
            display: flex;
            gap: 8px;
            flex-direction: row;
          }
        `,
        template: `
          <div v-if="!status.processing && !status.finished">
            <h3>Input folder:</h3>
            <folder-selector v-model="folder">folder containing the animation frames</folder-selector>
            <select-row v-model="type" :options="types" width="53">Format</select-row>
            <num-input-row v-model="delay" :min="1" :max="400" width="53">Delay</num-input-row>
            <checkbox-row v-model="interpolation">Interpolation</checkbox-row>
            <button :disabled="!folder" @click="execute">Combine</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" small />
            <canvas-output v-model="gif" name="animation" type="GIF" />
            <button v-if="status.processing" @click="cancelled = true">Cancel</button>
            <div v-else class="button-row">
              <button @click="save">Export Animation</button>
              <button @click="status.finished = false">Done</button>
            </div>
          </div>
        `
      }
    },
    soundsStripper: {
      name: "Sounds Stripper",
      icon: "volume_up",
      tagline: "Remove all unedited entries from the Minecraft sounds.json file.",
      description: "Sounds Stripper is a tool that will go through the sounds.json file in an resource pack and remove any entries that have not been modified.",
      component: {
        data: {
          file: null,
          outputLog,
          done: 0,
          total: null,
          cancelled: false,
          mode: "default",
          version: ""
        },
        methods: {
          async execute() {
            if (!await confirm("Run Sounds Stripper?", `Are you sure you want to run Sounds Stripper over the following file:\n<code>${formatPath(this.file.path)}</code>\n\nMake a backup first if you would like to keep an un-stripped version of the sounds.json.`)) return

            outputLog.length = 0
            this.status.finished = false
            this.status.processing = true
            this.done = 0
            this.total = 1

            await cacheDirectory()

            const vanilla = JSON.parse(await getObject("assets/minecraft/sounds.json", this.version))
            const sounds = JSON.parse(this.file.content)
            
            const logs = []

            function stringify(arr) {
              const out = []
              for (let item of arr) {
                if (typeof item === "string") {
                  item = {
                    name: item
                  }
                }
                item.volume ??= 1
                item.pitch ??= 1
                item.weight ??= 1
                item.stream ??= false
                item.attenuation_distance ??= 16
                item.preload ??= false
                item.type ??= "file"
                out.push(JSON.stringify(Object.entries(item).sort((a, b) => a[0].localeCompare(b[0]))))
              }
              return JSON.stringify(out.sort())
            }

            let modified
            for (const [key, data] of Object.entries(sounds)) {
              if (key in vanilla) {
                const before = JSON.stringify(data)
                if (data.sounds) {
                  if (stringify(data.sounds) === stringify(vanilla[key].sounds)) {
                    delete data.sounds
                    delete data.replace
                  } else {
                    for (const [i, sound] of data.sounds.entries()) {
                      if (typeof sound === "string") continue
                      if (sound.volume === 1) delete sound.volume
                      if (sound.pitch === 1) delete sound.pitch
                      if (sound.weight === 1) delete sound.weight
                      if (sound.stream === false) delete sound.stream
                      if (sound.attenuation_distance === 16) delete sound.attenuation_distance
                      if (sound.preload === false) delete sound.preload
                      if (sound.type === "file") delete sound.type
                      if ("name" in sound && Object.keys(sound).length === 1) {
                        data.sounds[i] = sound.name
                      }
                    }
                  }
                }
                if (data.subtitle === vanilla[key].subtitle) {
                  delete data.subtitle
                }
                if (!Object.keys(data).length) {
                  modified = true
                  delete sounds[key]
                  logs.push(`Removed \`${key}\``)
                } else if (JSON.stringify(data) !== before) {
                  modified = true
                  logs.push(`Optimised \`${key}\``)
                }
              }
            }

            if (modified) {
              await fs.promises.writeFile(this.file.path, JSON.stringify(sounds, null, 2))
            } else {
              output.log("No changes were made")
            }

            for (const log of logs) {
              output.log(log)
            }

            this.done = 1
            output.info("Finished")
            this.status.processing = false
            this.status.finished = true
          }
        },
        styles: `
          .component-versionSelector {
            align-self: flex-start;
          }
        `,
        template: `
          <div v-if="!status.processing && !status.finished">
            <h3>Select your sounds.json:</h3>
            <file-input v-model="file" title="Select your sounds.json file" type="sounds.json" :extensions="['json']" />
            <version-selector v-model="version" />
            <button :disabled="!file" @click="execute">Strip</button>
          </div>
          <div v-else>
            <progress-bar :done="done" :total="total" />
            <output-log v-model="outputLog" />
            <button v-if="!status.processing" @click="status.finished = false">Done</button>
          </div>
        `
      }
    }
  }

  globalThis.resourcePackUtilities = utilities

  setupPlugin()
})()