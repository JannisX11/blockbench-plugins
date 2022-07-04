(async function () {
  let aboutAction, button, button2, cubeAction
  const id = "mesh_flagger"
  const name = "Mesh Flagger"
  const icon = "lightbulb"
  const author = "SirJain and DerfX"
  const links = {
    TwitterSirJain: "https://twitter.com/SirJain2",
    TwitterDerfX: "https://twitter.com/Derf31922027",
  }
  Plugin.register(id, {
    title: name,
    icon,
    author,
    description: "This plugin flags meshes in a project on demand.",
    about: "The **Generic model format** is the only format that supports meshes. If you convert to another format with meshes in your project, the meshes will disappear. You can choose to flag all meshes in the project through one click with this plugin. This lets you know what you are losing by converting your project, in case you looked over any.\n\n## How to use\nTo use this plugin, go to `File > Plugins > Available` and search for `Mesh Flagger`. Click install, then use `Tools > Flag Meshes` and click one of the options. Clicking the first option causes the plugin to flag all meshes in a project. The second option allows Blockbench to flag all meshes with six faces. This includes cuboid-meshes, but keep in mind it can flag non-cuboid meshes with six faces too!\n\n\nIt would be appreciated to report any bugs and suggestions!",
    tags: ["Generic Model", "Per-FaceUV", "Meshes"],
    version: "1.0.0",
    min_version: "4.2.0",
    variant: "both",
    oninstall: () => showAbout(true),
    onload() {
      addAbout()
      const highlighter = {
        i: 0,
        running: false,
        start: (cubes, material) => {
          if (highlighter.running) {
            return
          }
          highlighter.running = true
          for (const cube of cubes) {
            cube.mesh.material_non_flash = cube.mesh.material
          };
          clearInterval(highlighter.interval)
          highlighter.i = 0
          highlighter.interval = setInterval(() => highlighter.flash(cubes, material), 1500)
          highlighter.flash(cubes, material)
        },
        flash: (cubes, material) => {
          var fc = highlighter.i
          if (fc > 5) {
            highlighter.running = false
            clearInterval(highlighter.interval)
          };
          for (const cube of cubes) {
            if (cube.mesh) {
              cube.mesh.material = (fc % 2) ? material : cube.mesh.material_non_flash
            }
          };
          highlighter.i++
        }
      }
      actions = [
        new Action("flag_all_meshes", {
          name: "Flag All Meshes",
          description: "Highlight cubes less than 1 unit",
          icon: "fa-gem",
          click: function() {
            const cubes = Mesh.all
            const material = new THREE.MeshBasicMaterial({color:0xFFFFFF})
            highlighter.start(cubes, material)
          }
        }),
        new Action("flag_six_faced_meshes", {
          name: "Flag 6-Faced Meshes",
          description: "Highlight cubes with decimal sizes",
          icon: "crop_7_5",
          click: function() {
            const cubes2 = Mesh.all.filter(e => Object.entries(e.faces).length === 6)
            const material2 = new THREE.MeshBasicMaterial({color: 0x89CFF0})
            highlighter.start(cubes2, material2)
          }
        })
      ]
      MenuBar.addAction({
        id: "flag_meshes",
        name: "Flag Meshes",
        children: actions,
        icon: "report_gmailerrorred"
      }, "tools")
    },
    onunload() {
      aboutAction.delete()
      MenuBar.removeAction(`help.about_plugins.about_${id}`)
      for (const action of actions) action.delete?.()
      MenuBar.removeAction("tools.flag_meshes")
    }
  })
  function addAbout() {
    let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
    if (!about) {
      about = new Action("about_plugins", {
        name: "About Plugins...",
        icon: "info",
        children: []
      })
      MenuBar.addAction(about, "help")
    }
    aboutAction = new Action(`about_${id}`, {
      name: `About ${name}...`,
      icon,
      click: () => showAbout()
    })
    about.children.push(aboutAction)
  }
  function showAbout(banner) {
    const infoBox = new Dialog({
      id: "about",
      title: name,
      width: 780,
      buttons: [],
      lines: [`
        <style>
          dialog#about .dialog_title {
            padding-left: 0;
            display: flex;
            align-items: left;
            gap: 10px;
          }
          dialog#about .dialog_content {
            text-align: left!important;
            margin: 0!important;
          }
          dialog#about .socials {
            padding: 0!important;
          }
          dialog#about #banner {
            background-color: var(--color-accent);
            color: var(--color-accent_text);
            width: 100%;
            padding: 0 8px
          }
          dialog#about #content {
            margin: 24px;
          }
        </style>
        ${banner ? `<div id="banner">Note: You can re-open this window using <strong>Help > About Plugins > ${name}</strong></div>` : ""}
        <div id="content">
          <h1 style="margin-top:-10px">${name}</h1>
          <p>The <b>Generic model format</b> is the only format that supports meshes. If you convert to another format with meshes in your project, the meshes will disappear. You can choose to flag all meshes in the project through one click with this plugin. This lets you know what you are losing by converting your project, in case you looked over any.</p>
          <br>
          <p><strong>Flagging capabilities:</strong></p>
          <p>- Flag all meshes in a project</p>
          <p>- Flag all meshes with six faces in a project</p>
          <br>
          <p>Go to Tools > Flag Meshes and choose the option you want to use this plugin. You can read more about this plugin on the Blockbench website, or in the plugin list in File > Plugins.</p>
          <br>
          <div class="socials">
            <a href="${links["TwitterSirJain"]}" class="open-in-browser">
              <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
              <label>SirJain</label>
            </a>
            <a href="${links["TwitterDerfX"]}" class="open-in-browser">
              <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
              <label>DerfX</label>
            </a>
          </div>
        </div>
      `]
    }).show()
    $("dialog#about .dialog_title").html(`
      <i class="icon material-icons">${icon}</i>
      ${name}
    `)
  }
})()