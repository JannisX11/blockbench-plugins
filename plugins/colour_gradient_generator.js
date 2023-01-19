(async function () {
  let aboutAction, generate
  const id = "colour_gradient_generator"
  const name = "Colour Gradient Generator"
  const icon = "gradient"
  const author = "Ewan Howell"
  const links = {
    website: "https://ewanhowell.com/",
    discord: "https://discord.com/invite/FcpnSjrP82"
  }
  Plugin.register(id, {
    title: name,
    icon,
    author,
    description: "Generate hue shifted gradient palettes from a single colour.",
    about: "This plugin generates hue shifted colour gradient palettes from a single colour.\n## Example\nInput colour\n<img width=\"64\" height=\"64\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXBTTPNEJHzAAAACklEQVR4XmNgAAAAAgAB3p6PvwAAAABJRU5ErkJggg==\">\nOutput gradient\n<img width=\"576\" height=\"64\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAABBAMAAAD+7JlOAAAAG1BMVEUnChZNFCR0HymaLSnBTTPTgFferoHp0qv07dW2MQ6TAAAADklEQVR4XmNgVHZNbwAAArQBUTtjBIoAAAAASUVORK5CYII=\">\n## How to use\nTo use this plugin, go into paint mode and change the colour palette mode to <strong>Palette</strong> or **Both**.\nYou can then select a colour and click on the gradient icon to generate a colour gradient.",
    tags: ["Paint", "Palette", "Color"],
    version: "1.2.0",
    min_version: "4.2.0",
    variant: "both",
    oninstall: () => showAbout(true),
    onload() {
      addAbout()
      const steps = localStorage.getItem("colour_gradient_steps") ?? 9
      const angle = localStorage.getItem("colour_gradient_angle") ?? 90
      const timeout = {
        step: null,
        angle: null
      }
      const dialog = new Dialog({
        title: "Generate Colour Gradient",
        id: "generate_gradient_dialog",
        width: 780,
        lines: [`
          <style>
            dialog#generate_gradient_dialog .disabled {
              text-decoration: none!important;
              opacity: 0.5;
            }
            dialog#generate_gradient_dialog .disabled:hover {
              background-color: var(--color-button);
              color: var(--color-text)!important;
              cursor: default;
            }
            dialog#generate_gradient_dialog .bar {
              display: flex;
              align-items: center;
              margin: 0!important;
              height: 30px;
              box-sizing: content-box;
              overflow: hidden;
            }
            dialog#generate_gradient_dialog input[type=range] {
              flex-grow: 1;
              margin-left: 20px;
            }
            dialog#generate_gradient_dialog input[type=number] {
              margin: 0 8px 0 2px;
            }
            dialog#generate_gradient_dialog i {
              cursor: pointer;
              transition: .2s;
            }
            dialog#generate_gradient_dialog i:hover {
              color: var(--color-light);
            }
          </style>
        `],
        component: {
          template: `
            <div>
              <p>The number of colours to include in the gradient.</p>
              <div class="bar slider_input_combo">
                <p>Colour count:</p>
                <input id="step_slider" type="range" min="3" max="256" value="${steps}" @input="changeSlider('step')"></input>
                <input id="step_number" type="number" class="tool" min="3" max="256" value="${steps}" @input="changeNumber('step', 3, 256, 9)"></input>
                <i class="material-icons icon" title="Reset" @click="reset('step', 9)">refresh</i>
              </div>
              <br>
              <p>The number of degrees for the hue shifting to occur over.</p>
              <div class="bar slider_input_combo">
                <p>Hue shifting angle:</p>
                <input id="angle_slider" type="range" min="-360" max="360" value="${angle}" @input="changeSlider('angle')"></input>
                <input id="angle_number" type="number" class="tool" min="-360" max="360" value="${angle}" @input="changeNumber('angle', -360, 360, 90)"></input>
                <i class="material-icons icon" title="Reset" @click="reset('angle', 90)">refresh</i>
              </div>
              <br>
              <div style="display:flex;gap:8px">
                <label class="name_space_left" for="replace">Replace existing palette:</label>
                <input type="checkbox" class="focusable_input" id="replace">
                <span style="flex-grow:1"></span>
                <button id="create_gradient" @click="create()">Create</button>
                <button @click="close()">Cancel</button>
              </div>
            </div>
          `,
          methods: {
            reset(type, num) {
              $(`dialog#generate_gradient_dialog #${type}_slider`).val(num)
              $(`dialog#generate_gradient_dialog #${type}_number`).val(num)
              clearTimeout(timeout[type])
            },
            changeSlider(type) {
              const slider = $(`dialog#generate_gradient_dialog #${type}_slider`)
              const number = $(`dialog#generate_gradient_dialog #${type}_number`)
              const num = parseInt(slider.val())
              number.val(slider.val())
            },
            changeNumber(type, min, max, num) {
              const slider = $(`dialog#generate_gradient_dialog #${type}_slider`)
              const number = $(`dialog#generate_gradient_dialog #${type}_number`)
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
              const steps = parseInt($("dialog#generate_gradient_dialog #step_slider").val())
              const angle = parseFloat($("dialog#generate_gradient_dialog #angle_slider").val())
              localStorage.setItem("colour_gradient_steps", steps)
              localStorage.setItem("colour_gradient_angle", angle)
              if ($("dialog#generate_gradient_dialog #replace").is(":checked")) ColorPanel.palette.length = 0
              const colour = tinycolor(ColorPanel.get())
              const lightness = colour.toHsl().l
              const darker = Math.floor(steps * (lightness))
              const lighter = steps - darker - 1
              for (let x = darker - 1; x >= 0; x--) {
                const col = colour.toHsl()
                col.l = lerp(lightness, 0, (x + 1) / (darker + 1))
                col.h = toPositiveAngle(col.h + lerp(0, -angle / 2, (x + 1) / (darker + 1)))
                addToPalette(tinycolor(col).toHexString())
              }
              addToPalette(tinycolor(colour).toHexString())
              for (let x = lighter - 1; x >= 0; x--) {
                const col = colour.toHsl()
                col.l = lerp(1, lightness, (x + 1) / (lighter + 1))
                col.h = toPositiveAngle(col.h + lerp(angle / 2, 0, (x + 1) / (lighter + 1)))
                addToPalette(tinycolor(col).toHexString())
              }
              this.close()
            },
            close: () => dialog.cancel()
          }
        },
        buttons: []
      })
      generate = new Action("generate_gradient", {
        name: "Generate Colour Gradient",
        icon,
        click: () => dialog.show()
      })
      Toolbars.palette.add(generate)
    },
    onuninstall() {
      localStorage.removeItem("colour_gradient_steps")
      localStorage.removeItem("colour_gradient_angle")
    },
    onunload() {
      aboutAction.delete()
      generate.delete()
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
    new Dialog({
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
          dialog#about img {
            margin: 8px;
            box-shadow: 0 3px 10px rgb(0 0 0 / 31%);
          }
        </style>
        ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
        <div id="content">
          <h1 style="margin-top:-10px">${name}</h1>
          <p>This plugin generates hue shifted colour gradient palettes from a single colour.</p>
          <div class="socials">
            <a href="${links["website"]}" class="open-in-browser">
              <i class="icon material-icons" style="color:#33E38E">language</i>
              <label>By ${author}</label>
            </a>
            <a href="${links["discord"]}" class="open-in-browser">
              <i class="icon fab fa-discord" style="color:#727FFF"></i>
              <label>Discord Server</label>
            </a>
          </div>
          <h2>Example</h2>
          <div style="display:flex">
            <div style="text-align:center">
              <p>Input colour</p>
              <img width="64" height="64" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXBTTPNEJHzAAAACklEQVR4XmNgAAAAAgAB3p6PvwAAAABJRU5ErkJggg==">
            </div>
            <div style="text-align:center">
              <p>Output gradient</p>
              <img width="576" height="64" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAABBAMAAAD+7JlOAAAAG1BMVEUnChZNFCR0HymaLSnBTTPTgFferoHp0qv07dW2MQ6TAAAADklEQVR4XmNgVHZNbwAAArQBUTtjBIoAAAAASUVORK5CYII=">
            </div>
          </div>
          <h2>How to use</h2>
          <p>To use this plugin, go into paint mode and change the colour palette mode to <strong>Palette</strong> or <strong>Both</strong>.<br>You can then select a colour and click on the gradient icon <i class="icon material-icons" style="transform:translateY(4px)">${icon}</i> to generate a colour gradient.</p>
          <img src="data:image/png;base64,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">
        </div>
      `]
    }).show()
    $("dialog#about .dialog_title").html(`
      <i class="icon material-icons">${icon}</i>
      ${name}
    `)
  }
  function toPositiveAngle(angle){
    angle = ((angle % 360) + 360) % 360
    if (angle < 0) angle += 360
    return angle
  }
  const lerp = (a, b, c) => a * (1 - c) + b * c
  function addToPalette(colour) {
    if (ColorPanel.palette.includes(colour)) ColorPanel.palette.splice(ColorPanel.palette.indexOf(colour), 1)
    ColorPanel.palette.push(colour)
  }
})()