(async function () {
    let aboutAction, action
    const id = "ground_plane_editor"
    const name = "Ground Plane Editor"
    const icon = "icon-format_free"
    const author = "SirJain"
    const links = {
      twitter: "https://www.twitter.com/SirJain2",
    }
    Plugin.register(id, {
      title: name,
      icon,
      author,
      description: "Edits the opacity and color of the ground plane feature in Blockbench.",
      about: "This simple plugin allows you to customize the ground plane feature in Blockbench; more specifically, the opacity and color.\n## How to use\nTo use this plugin, simply go to `Tools > Ground Plane Editor`, fill out the appropriate categories, and hit `Done`. You can choose to edit either the color, the opacity, or both!\n\nPlease report any bugs or suggestions you may have.",
      tags: ["Ground Plane", "Animation"],
      version: "1.0.0",
      min_version: "4.2.0",
      variant: "both",
      oninstall: () => showAbout(true),
      onload() {
        addAbout()
        action = new Action({
          id,
          name,
          icon,
          click() {
            const timeout = {
              example: null
            }
            const dialog = new Dialog({
              title: "Edit Ground Plane",
              id: "edit_ground_plane_dialog",
              width: 780,
              lines: [`
                <style>
                  dialog#edit_ground_plane_dialog .bar {
                    display: flex;
                    align-items: center;
                    margin: 0!important;
                    height: 30px;
                    box-sizing: content-box;
                    overflow: hidden;
                  }
                  dialog#edit_ground_plane_dialog input[type=range] {
                    flex-grow: 1;
                    margin-left: 50px;
                  }
                  dialog#edit_ground_plane_dialog input[type=number] {
                    margin: 0 8px 0 2px;
                  }
                </style>
              `],
              component: {
                mounted() {
                  this.$nextTick().then(() => {
                    let opacityScaled = Math.floor(Canvas.ground_plane.material.opacity*255);
                    console.log(opacityScaled);
                    $("dialog#edit_ground_plane_dialog .slider_input_combo #opacity_number").val(opacityScaled);
                    $("dialog#edit_ground_plane_dialog .slider_input_combo #opacity_slider").val(opacityScaled);

                    let planeColor = '#' + Canvas.ground_plane.material.color.getHexString()
                    console.log(planeColor);
                    $("dialog#edit_ground_plane_dialog .color_picker input").val(planeColor);
                  });
                },
                template: `
                  <div>
                    <div class="bar slider_input_combo">
                      <p>Edit Opacity:</p>
                      <input id="opacity_slider" type="range" min="60" max="255" value="255" @input="changeSlider('opacity')"></input>
                      <input id="opacity_number" type="number" class="tool" min="60" max="255" value="255" @input="changeNumber('opacity', 1, 255, 255)"></input>
                    </div>
                    <br>
                    <div class="color_picker">
                      <p>Edit Color:</p>
                      <input type="color" value="#4a4a4a">
                    </div>
                    <br>
                    <div style="display:flex;gap:8px">
                      <span style="flex-grow:3"></span>
                      <button @click="create()">Done</button>
                      <button @click="close()">Cancel</button>
                    </div>
                  </div>
                `,
                methods: {
                  changeSlider(type) {
                    const slider = $(`dialog#edit_ground_plane_dialog #${type}_slider`)
                    const number = $(`dialog#edit_ground_plane_dialog #${type}_number`)
                    const num = parseInt(slider.val())
                    number.val(slider.val())
                  },
                  changeNumber(type, min, max, num) {
                    const slider = $(`dialog#ground_plane_editor_dialog #${type}_slider`)
                    const number = $(`dialog#edit_ground_plane_dialog #${type}_number`)
                    const clamped = Math.min(max, Math.max(min, parseInt(number.val())))
                    slider.val(number.val())
                    clearTimeout(timeout[type])
                    timeout[type] = setTimeout(() => {
                      if (isNaN(clamped)) {
                        number.val(num)
                        slider.val(num)
                      } else {
                        number.val(clamped)
                        slider.val(clamped)
                      }
                    }, 1000)
                  },
                  create() {
                    const num = parseInt($("dialog#edit_ground_plane_dialog #ground_plane_editor").val());

                    var hexString = $("dialog#edit_ground_plane_dialog .color_picker input").val();
                    Canvas.ground_plane.material.color.setHex(parseInt(hexString.substring(1), 16));

                    var opacity = $("dialog#edit_ground_plane_dialog .slider_input_combo #opacity_number").val();
                    Canvas.ground_plane.material.transparent = true;
                    Canvas.ground_plane.material.opacity = parseInt(opacity) / 255;

                    this.close()
                    Blockbench.showQuickMessage("Updated successfully", 3000)
                  },
                  close: () => dialog.cancel()
                }
              },
              buttons: []
            }).show()
          }
        })
        MenuBar.addAction(action, "tools")
      },
      onunload() {
        aboutAction.delete()
        action.delete()
        MenuBar.removeAction(`help.about_plugins.about_${id}`)
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
            <p>This plugin is used for changing the opacity and color of the ground plane feature in Blockbench.</p>
            <h4>Worth noting:</h4>
            <p>- There is currently no way to revert back to the default ground plane. However, adding this feature is planned. For now you'll have to uninstall the plugin and restart Blockbench to revert back to the default.</p>
            <p>- Just like the default ground plane, changing it's properties in one tab will update in other tabs as well.</p>
            <h4>How to use:</h4>
            <p>To use this plugin, simply go to <b>Tools > Ground Plane Editor</b>, fill out the appropriate categories, and hit <b>Done</b>. You can choose to edit either the color, the opacity, or both!</p>
            <p>Please report any bugs or suggestions you may have to make this plugin more enjoyable for everyone.</p>
            <br>
            <div class="socials">
              <a href="${links["twitter"]}" class="open-in-browser">
                <i class="fa-brands fa-twitter" style="color:#00acee"></i>
                <label>By ${author}</label>
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
