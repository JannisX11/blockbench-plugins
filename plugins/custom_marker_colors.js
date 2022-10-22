(async function() {
  let aboutAction, defaultColourFunction
  const E = s => $(document.createElement(s))
  const errorTitle = "Invalid Marker!"
  const duplicateIDErrorTitle = "This ID already exists!"
  const errorMessage = "You have made an invalid marker color because you have empty fields. Make sure that you leave no fields blank."
  const duplicateIDErrorMessage = "The ID of your marker color is already taken by a default marker color. Please enter a name which does not have the same ID as the default colors\n\nNote: Marker color IDs are derived from your marker color name but lowercase and with `_` instead of spaces."
  const id = "custom_marker_colors"
  const name = "Custom Marker Colors"
  const icon = "colorize"
  const author = "SirJain and Geode" 

  // Local Storage
  const customMarkers = JSON.parse(localStorage.getItem("customMarkers") ?? "{}")

  const defaultMarkerArray = markerColors.map(e => e.id)
  const links = {
    // Twitter & Discord
    twitter: "https://www.twitter.com/SirJain2",
    twittergeode: "https://twitter.com/GeodeModels",
    discord: "https://discord.gg/wM4CKTbFVN"
  }
  Plugin.register(id, {
    title: name,
    icon,
    author,
    description: "Allows users to add their own marker colors.",
    about: "With this plugin, you can add more marker colors to allow for futher customization.\n## How to use\nSimply go to the menu where you add custom marker colors. Click on the new button named `Add Custom Marker`, fill out the fields leaving nothing blank, and click `Add`. Your color will be added to the default list!",
    tags: ["Marker Color", "Customize", "UX"],
    version: "1.0.0",
    min_version: "4.2.0",
    variant: "both",
    oninstall() { 
      showAbout(true)
      Blockbench.showQuickMessage("Installed Custom Marker Colors!", 3000)
    },
    onload() {
      addAboutButton()

      actions = [
        new Action("add_marker_color", {
          name: "Add Marker Color",
          description: "Add a custom marker color",
          icon: "fa-plus",
          click: () => createMarkers()
        }),

        new Action("edit_marker_colors", {
          name: "Edit Marker Colors",
          description: "Manage your custom marker colors",
          icon: "settings",
          click: () => editMarkers()
        })
      ]

      // Update list
      for (const [name, hex] of Object.entries(customMarkers)) {
        markerColors.push({
          id: name.toLowerCase().replace(/ /g, "_"),
          name: name,
          standard: hex,
          pastel: hex
        })
      }

      Canvas.updateMarkerColorMaterials()

      defaultColourFunction = Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children
      MenuBar.addAction({
        id: "marker_colors",
        name: "Marker Colors",
        children: actions,
        icon: "fa-cube"
      }, "tools")
    },
    onunload() {
      aboutAction.delete()
      
      Blockbench.showQuickMessage("Uninstalled Custom Marker Colors", 3000)

      MenuBar.removeAction(`help.about_plugins.about_${id}`)
      MenuBar.removeAction("tools.marker_colors")
      Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children = defaultColourFunction

      for (const name of Object.keys(customMarkers)) {
        const index = markerColors.indexOf(markerColors.find(e => e.name === name))
        markerColors.splice(index, 1)
        Canvas.emptyMaterials.splice(index, 1)
      }

      Canvas.updateMarkerColorMaterials()
    }
  })

  function createMarkers() {
    const createMarkersDialog = new Blockbench.Dialog({
      id: "add_custom_marker",
      title: "Add Marker Color",
      buttons: ["Add Marker", "Cancel"],
      lines: [`
        <style>
          input#id {
            text-transform: lowercase;
          }
        </style>
      `],
      form: {
        name: {
          label: "Enter Name",
          type: "text",
          value: ""
        },
        color: {
          label: "Choose Color",
          type: "color",
          value: "#6E6E6E"
        }
      },
      onConfirm(formData) {
        const hexStr = formData.color.toHexString();
        const rawID = formData.name;
        const FormID = rawID.toLowerCase().replace(/ /g, "_");

        // case 1 - ID and name are not blank
        if ((FormID && formData.name) && !(defaultMarkerArray.includes(FormID))) {
          Blockbench.showQuickMessage(`Added marker color "${formData.name}"`, 3000)

          // update marker colors
          markerColors.push({
              id: FormID,
              name: formData.name,
              standard: hexStr,
              pastel: hexStr
          })

          // update local storage
          customMarkers[formData.name] = hexStr
          localStorage.setItem("customMarkers", JSON.stringify(customMarkers))

          Canvas.updateMarkerColorMaterials()
        }

        // case 2 - Duplicate ID
        if (defaultMarkerArray.includes(FormID)) {
          Blockbench.showMessageBox({
            title: duplicateIDErrorTitle,
            message: duplicateIDErrorMessage
          })
        }
        
        // case 3 - ID and name are blank
        if (FormID === "" || formData.name === "") {
          Blockbench.showMessageBox({
            title: errorTitle,
            message: errorMessage
          })
        }
      },
      onCancel() {
        // close
        this.close()
      }
    }).show()
  }


  function editMarkers() {
    const editMarkersDialog = new Dialog({
      id: "edit_marker_colors_dialog",
      title: "Manage Marker Colors",
      buttons: [],
      lines: [`
        <style>
          dialog#edit_marker_colors_dialog #marker-colors {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-bottom: 20px;
          }

          dialog#edit_marker_colors_dialog .marker-color {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          
          dialog#edit_marker_colors_dialog .marker-color-display {
            width: 24px;
            height: 24px;
            border-radius: 5px;
          }

          dialog#edit_marker_colors_dialog .marker-color-hex {
            color: grey;
            font-size: 14px;
            padding: 3px 0;
          }

          dialog#edit_marker_colors_dialog .marker-color-name {
            font-weight: bold;
          }

          dialog#edit_marker_colors_dialog .marker-color-remove {
            padding: 2px 0;
            display: flex;
            align-items: center;
            cursor: pointer;
          }

          dialog#edit_marker_colors_dialog .spacer {
            flex: 1;
            height: 2px;
            background-color: var(--color-button);
          }
        </style>
        <div id="marker-colors"></div>
      `],
      component: {
        template: `
          <div>
            <div style="display:flex;gap:8px">
              <button @click="create()">+  Add New Marker</button>
              <span style="flex-grow:1"></span>
              <button @click="close()">Close</button>
            </div>
          </div>
        `,
        methods: {
          create: () => createMarkers(),
          close: () => editMarkersDialog.close()
        }
      },
    }).show()
    const container = $("dialog#edit_marker_colors_dialog #marker-colors")
    for (const color of markerColors) {
      if (defaultMarkerArray.includes(color.id)) continue;
      const name = tl(`cube.color.${color.id}`)
      const markerDisplay = E("div").addClass("marker-color").append(
        E("div").addClass("marker-color-display").css("background-color", color.standard),
        E("div").addClass("marker-color-name").text(color.name),
        E("div").addClass("marker-color-hex").text(color.standard),
        E("div").addClass("spacer"),
        E("i").addClass("marker-color-remove material-icons icon tool").attr("title", "Delete marker").text("delete").on("click", e => {
          Blockbench.showQuickMessage(`Removed "${color.name}" marker`, 3000)
          const index = markerColors.indexOf(color)
          markerColors.splice(index, 1)
          Canvas.emptyMaterials.splice(index, 1)
          markerDisplay.remove()

          // Edit local storage
          delete customMarkers[color.name]
          localStorage.setItem("customMarkers", JSON.stringify(customMarkers))
        })
      ).appendTo(container)
    }
    console.log(container.length)
    if (!container.children().length) container.append(
      E("p").text("No custom marker colors. Please add a new custom marker color before trying to edit them.")
    )
  }

  function addAboutButton() {
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
            align-items: center;
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
        ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
        <div id="content">
          <h1 style="margin-top:-10px">${name}</h1>
            <p>Allows users to add their own marker colors.</p>
            <h4>Worth noting:</h4>
            <p>- Currently, the only way to get rid of your custom markers altogether is to uninstall the plugin and restart Blockbench.</p>
            <p>- You can use these marker colors for meshes and keyframes too!
            <h4>How to use:</h4>
            <p>To use this plugin, go to the menu where the marker colors are listed. There will be a brand new <b>Add Custom Marker</b> at the top. Upon clicking, fill out the required information, making sure to leave no fields blank, and you're good to go! The color is added to the default list, ready to be used.
            <p>Please report any bugs or suggestions you may have to make this plugin more enjoyable for everyone.</p>
            <br>
          <div class="socials">
            <a href="${links["twitter"]}" class="open-in-browser">
              <i class="fa-brands fa-twitter" style="color:#00acee"></i>
              <label>SirJain</label>
            </a>
            <a href="${links["twittergeode"]}" class="open-in-browser">
              <i class="fa-brands fa-twitter" style="color:#00acee"></i>
              <label>Geode</label>
            </a>
            <a href="${links["discord"]}" class="open-in-browser">
              <i class="fa-brands fa-discord" style="color:#5865F2"></i>
              <label>Discord Server</label>
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
