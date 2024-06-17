(() => {
  const path = require("node:path")
  let actions, watching, message, styles, unwatchAction, rewatchAction
  const id = "live_dev_reloader"
  const name = "Live Dev Reloader"
  const icon = "refresh"
  Plugin.register(id, {
    title: name,
    icon: "icon.png",
    author: "Ewan Howell",
    description: "Edit plugins and themes live in any text editor and have them automatically update in Blockbench.",
    tags: ["Plugins", "Themes", "Blockbench"],
    version: "1.0.1",
    min_version: "4.10.0",
    variant: "desktop",
    website: "https://ewanhowell.com/plugins/live-dev-reloader/",
    repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/live_dev_reloader",
    bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues?title=[Live Dev Reloader]",
    creation_date: "2024-01-20",
    has_changelog: true,
    onload() {
      let toggle
      actions = [
        new Action("live_dev_reloader_watch", {
          plugin: id,
          name: "Watch plugin or theme file",
          icon: "visibility",
          description: "Watch a plugin or theme file and reload it in Blockbench when changes are made",
          condition: () => !watching,
          click() {
            Blockbench.import({
              extensions: ["js", "bbtheme", "css"],
              type: "Plugin or Theme",
            }, files => watch(files[0].path))
          }
        }),
        toggle = new Toggle("live_dev_reloader_persist", {
          name: "Persist after restart",
          description: "The file should continue being watched after a Blockbench restart",
          icon,
          onChange(state) {
            localStorage.setItem("live_dev_reloader_persist", state)
          }
        })
      ]
      const file = localStorage.getItem("live_dev_reloader_file")
      if (localStorage.getItem("live_dev_reloader_file") && localStorage.getItem("live_dev_reloader_persist") === "true") {
        toggle.set(true)
        if (localStorage.getItem("live_dev_reloader_stopped") === "true") rewatch()
        else watch(file, true)
      } else if (localStorage.getItem("live_dev_reloader_stopped") === "true") rewatch()
      MenuBar.addAction({
        name,
        id,
        children: actions,
        icon,
      }, "help.developer.1")
    },
    onunload() {
      actions.forEach(e => e.delete())
      unwatch("reload")
      MenuBar.removeAction(`help.developer.${id}`)
    }
  })

  function watch(file, first) {
    if (!fs.existsSync(file)) {
      localStorage.removeItem("live_dev_reloader_file")
      unwatch("force")
      return Blockbench.showQuickMessage(`Stopped watching. File not found: ${path.basename(file)}`, 3000)
    }
    fs.watchFile(file, { interval: 100 }, (...args) => update(...args, true))
    fs.watchFile(path.join(path.dirname(file), "about.md"), { interval: 100 }, update)
    watching = file
    update({ mtime: 1 }, { mtime: 0 }, true, true)
    localStorage.setItem("live_dev_reloader_file", file)
    Blockbench.showQuickMessage(`Watching file: ${path.basename(file)}`, 3000)
    if (unwatchAction) {
      unwatchAction.delete()
      actions.splice(actions.indexOf(unwatchAction), 1)
    }
    unwatchAction = new Action("live_dev_reloader_unwatch", {
      plugin: id,
      name: "Stop watching plugin or theme file",
      icon: "visibility_off",
      description: `Currently watching: ${file}`,
      condition: () => watching,
      click: () => unwatch("manual")
    })
    actions.unshift(unwatchAction)
    localStorage.setItem("live_dev_reloader_stopped", false)
  }

  function unwatch(type) {
    if (watching) {
      fs.unwatchFile(watching)
      fs.unwatchFile(path.join(path.dirname(watching), "about.md"))
    }
    styles?.delete()
    message?.close()
    if (type === "force") localStorage.removeItem("live_dev_reloader_file")
    else if (type === "manual") {
      localStorage.setItem("live_dev_reloader_stopped", true)
      rewatch()
      Blockbench.showQuickMessage(`Stopped watching ${path.basename(watching)}`, 3000)
    } else if (type === "reload") {
      if (watching && localStorage.getItem("live_dev_reloader_persist") === "true") localStorage.setItem("live_dev_reloader_stopped", false)
      else localStorage.setItem("live_dev_reloader_stopped", true)
    }
    watching = false
  }

  function rewatch() {
    if (rewatchAction) {
      rewatchAction.delete()
      actions.splice(actions.indexOf(rewatchAction), 1)
    }
    const file = localStorage.getItem("live_dev_reloader_file")
    if (fs.existsSync(file)) {
      rewatchAction = new Action("live_dev_reloader_rewatch", {
        plugin: id,
        name: `Rewatch ${path.basename(file)}`,
        description: `Rewatch the file: ${file}`,
        icon,
        condition: () => !watching && localStorage.getItem("live_dev_reloader_stopped") === "true" && localStorage.getItem("live_dev_reloader_file"),
        click: () => watch(file)
      })
      actions.push(rewatchAction)
    }
  }

  async function update(curr, prev, main, first) {
    if (main && curr.mtimeMs === 0) {
      Blockbench.showQuickMessage(`Stopped watching. File not found: ${path.basename(watching)}`, 3000)
      return unwatch("force")
    } else if (curr.mtime > prev.mtime) {
      message?.close()
      styles?.delete()
      if (watching.endsWith(".js")) {
        const id = path.basename(watching, ".js")
        const plugin = Plugins.all.find(e => e.id === id && e.source === "file")
        if (!plugin) return message = Blockbench.showMessageBox({
          title: "Plugin not installed",
          message: `Please install the <code>${id}</code> plugin so that it can be watched for live changes.\n\nPlugin location: <code>${watching}</code>`,
          buttons: ["Install Plugin", "Stop Watching", "dialog.close"]
        }, button => {
          if (button === 0) Blockbench.read(watching, {}, f => new Plugin().loadFromFile(f[0], true))
          else if (button === 1) unwatch("force")
        })
        if (first) return
        plugin.reload()
        console.log(`Plugin reloaded: ${id}`)
      } else {
        let css = fs.readFileSync(watching)
        let name
        if (watching.endsWith(".bbtheme")) {
          try {
            const data = JSON.parse(css)
            name = data.name
            css = `body{`
            if (data.main_font) css += `--font-custom-main: ${data.main_font};`
            if (data.headline_font) css += `--font-custom-headline: ${data.headline_font};`
            if (data.code_font) css += `--font-custom-code: ${data.code_font};`
            if (data.colors) for (const [id, col] of Object.entries(data.colors)) {
              css += `--color-${id}: ${col} !important;`
            }
            css += "}"
            if (data.borders) {
              const borders = (await fetch("css/general.css").then(e => e.text()).catch(() => "")).match(/(?<=\/\* Theme Borders \*\/)(?:.|\r\n|\r)*?(?=\/\*|$)/)
              if (borders) css += borders[0].replace(/([\n\r\t]|\.theme_borders)/g, "")
              css += "body #plugin_list > li {border: 1px solid var(--color-border);margin: 0;"
            }
            css += data.css ?? ""
          } catch (err) {
            return message = Blockbench.showMessageBox({
              title: "Invalid JSON",
              message: `Invalid JSON in theme <code>${path.basename(watching)}</code>:\n<code>${err.message}</code>\n\nTheme location: <code>${watching}</code>`,
              buttons: ["Stop Watching", "dialog.close"]
            }, button => {
              if (button === 0) unwatch("force")
            })
          }
        }
        styles = Blockbench.addCSS(css)
        resizeWindow()
        console.log(`Theme reloaded: ${name ?? path.basename(watching).split(".").slice(0, -1).join(".")}`)
      }
    }
  }
})()