(async function() {
  let aboutAction, defaultColourFunction
  const errorTitle = "Invalid Marker!"
  const errorMessage = 'You have made an invalid marker because you have empty fields. Make sure that you leave no fields blank.'
  const id = "custom_marker_colors"
  const name = "Custom Marker Colors"
  const icon = "colorize"
  const author = "SirJain and Geode"
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
      description: "Allows users to add custom marker colors.",
      about: "With this plugin, you can add more marker colors to allow for futher customization.\n## How to use\nSimply go to the menu where you add custom marker colors. Click on the new button named `Add Custom Marker`, fill out the fields leaving nothing blank, and click `Add`. Your color will be added to the default list!",
      tags: ["Marker Color", "Customize", "UX"],
      version: "1.0.0",
      min_version: "4.2.0",
      variant: "both",
      oninstall: () => showAbout(true),
      onload() {
          addAboutButton()
          defaultColourFunction = Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children
          Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children = () => {
              return [{
                  icon: "fa-plus",
                  name: "Add Custom Marker",
                  color: "#000000",
                  click() {
                      new Blockbench.Dialog({
                          id: "add_custom_marker",
                          title: "Add Custom Marker",
                          buttons: ['Add', 'Cancel'],
                          lines: [`
                <font color="D8CB43", size=2.3px>
                <b>Keep in mind:</b>
                </font>
                <br>
                <font size=2.3px>
                - The ID field should generally be restricted to lower-case letters without spaces only.<br>
                - No fields should be left blank.
                </font>

                <style>
                  input#id {
                    text-transform: lowercase;
                  }
                </style>
              `],
                          form: {
                              // line for organization
                              _: "_",
                              name: {
                                  label: "Marker Name",
                                  type: 'text',
                                  value: $(`dialog#add_custom_marker #name`).val()
                              },
                              id: {
                                  label: "Marker ID",
                                  type: 'text',
                                  value: $(`dialog#add_custom_marker #id`).val()
                              },
                              color: {
                                  label: "Choose Color",
                                  type: 'color',
                                  value: "#6E6E6E"
                              },
                              _: "_"
                          },
                          // openContextMenu(preset, event) {
                          //   new Menu([
                          //     {
                          //       name: 'generic.delete',
                          //       icon: 'delete',
                          //       click: () => {
                          //         this.removePreset(preset);
                          //       }
                          //     }
                          //   ]).open(event);
                          // },
                          onConfirm(formData) {

                              const hexStr = formData.color.toHexString();
                              const id = formData.id.toLowerCase().replace(/\s/g, '_');

                              if (formData.id !== "" && formData.name !== "") {
                                  Blockbench.showQuickMessage("Added marker color", 3000)

                                  // update marker colors
                                  markerColors.push({
                                      id: id,
                                      name: formData.name,
                                      standard: hexStr,
                                      pastel: hexStr
                                  })

                                  Canvas.updateMarkerColorMaterials()
                                  console.log(id)
                              }

                              if (formData.id === "" || formData.name === "") {
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
              }].concat("_", defaultColourFunction())
          }
      },
      onunload() {
          aboutAction.delete()
          MenuBar.removeAction(`help.about_plugins.about_${id}`)
          Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children = defaultColourFunction
      }
  })

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
            <p>Allows users to add custom marker colors.</p>
            <h4>Worth noting:</h4>
            <p>- The program will automatically replace any spaces with an underscore and capital letters with lowercase <strong>for the marker ID.</strong> (Example: Light Green as a marker ID will become light_green). Marker names are unaffected.</p>
            <p>- No fields should be left blank when making a custom marker color. An error will pop up if you do.</p>
            <p>- Currently, the only way to get rid of your custom markers altogether is to uninstall the plugin and restart Blockbench.</p>
            <p>- You cannot add new marker colors on a mesh with this plugin, however existing ones do appear on the same list and work for meshes!<p>
            <p>- These marker colors work for keyframe colors as well!<p>
            <h4>How to use:</h4>
            <p>To use this plugin, go to the menu where the marker colors are listed. There will be a brand new <b>Add Custom Marker</b> at the top. Upon clicking, fill out the required information, making sure to leave no fields blank, and you're good to go! The marker is added to the default list, ready to be used.
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
