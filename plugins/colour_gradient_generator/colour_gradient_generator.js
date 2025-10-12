(() => {
  let action, dialog, data
  const id = "colour_gradient_generator"
  const defaults = {
    steps: 9,
    angle: 45,
    replace: false,
    smallRanges: true,
    brightnessRange: 1,
    brightnessOffset: 0
  }
  Plugin.register(id, {
    title: "Colour Gradient Generator",
    icon: "icon.png",
    author: "Ewan Howell",
    description: "Generate hue shifted gradient palettes from a single colour.",
    tags: ["Paint", "Palette", "Color"],
    version: "2.1.0",
    min_version: "5.0.0",
    variant: "both",
    website: "https://ewanhowell.com/plugins/colour-gradient-generator/",
    repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/colour_gradient_generator",
    bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues?title=[Colour Gradient Generator]",
    creation_date: "2022-06-02",
    has_changelog: true,
    onload() {
      const storage = JSON.parse(localStorage.getItem(id) ?? "{}")
      data = {
        steps: storage.steps ?? defaults.steps,
        angle: storage.angle ?? defaults.angle,
        replace: storage.replace ?? defaults.replace,
        smallRanges: storage.smallRanges ?? defaults.smallRanges,
        brightnessRange: storage.brightnessRange ?? defaults.brightnessRange,
        brightnessOffset: storage.brightnessOffset ?? defaults.brightnessOffset
      }
      dialog = new Dialog({
        id,
        title: "Generate Gradient Palette",
        width: 780,
        buttons: ["Generate", "Cancel"],
        lines: [`<style>
          #colour-gradient-preview {
            display: flex;
            overflow-x: hidden;
            filter: drop-shadow(0 3px 10px #0006);
            padding: 0 20px 8px;

            > div {
              background-color: red;
              flex: 1;
              height: 80px;
              position: relative;

              &.primary::before {
                content: "";
                position: absolute;
                bottom: -8px;
                height: 4px;
                left: 0;
                right: 0;
                background-color: var(--color-accent);
              }
            }
          }

          #colour_gradient_generator {
            .header-bar {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;

              > i {
                cursor: pointer;

                &:hover {
                  color: var(--color-light);
                }
              }
            }

            .sp-replacer {
              width: 100%;
              display: flex;

              .sp-preview {
                flex: 1;
              }
            }

            .checkbox-row {
              display: flex;
              cursor: pointer;

              div {
                margin: 3px 0 0 5px;
              }

              * {
                cursor: pointer;
              }
            }

            .disabled {
              opacity: .5;
              position: relative;
              cursor: not-allowed;

              > * {
                pointer-events: none;
              }
            }
          }
        </style>`],
        component: {
          data: {
            data,
            defaults,
            colour: ColorPanel.get(),
            minBrightnessOffset: Math.min(0, data.brightnessOffset),
            maxBrightnessOffset: Math.max(0, data.brightnessOffset)
          },
          methods: {
            save() {
              localStorage.setItem(id, JSON.stringify(this.data))
            },
            clamp() {
              this.data.steps = Math.min(32, this.data.steps)
              this.data.angle = Math.max(-120, Math.min(120, this.data.angle))
            },
            reset() {
              this.data.steps = defaults.steps
              this.data.angle = defaults.angle
              this.data.replace = defaults.replace
              this.data.smallRanges = defaults.smallRanges
              this.data.brightnessRange = defaults.brightnessRange
              this.data.brightnessOffset = defaults.brightnessOffset
            }
          },
          computed: {
            palette() {
              const colour = tinycolor(this.colour)
              const hsl = colour.toHsl()
              let angle = this.data.angle

              if (hsl.h >= 100 && hsl.h < 260) angle *= -1

              let minLightness = Math.max(0, hsl.l - this.data.brightnessRange * hsl.l)
              let maxLightness = Math.min(1, hsl.l + this.data.brightnessRange * (1 - hsl.l))

              let darker = Math.min(this.data.steps - 1, Math.floor((this.data.steps * (hsl.l - minLightness) / (maxLightness - minLightness)).toFixed(10)))
              let lighter = this.data.steps - darker - 1

              this.minBrightnessOffset = darker > 0 && lighter > 0 ? -lighter : 0
              this.maxBrightnessOffset = darker > 0 && lighter > 0 ? darker : 0
              this.data.brightnessOffset = Math.max(this.minBrightnessOffset, Math.min(this.maxBrightnessOffset, this.data.brightnessOffset))

              if (isNaN(darker)) {
                darker = Math.floor(this.data.steps / 2)
                lighter = this.data.steps - darker - 1
              }

              const position = (darker + 1) / (this.data.steps + 1)

              let darkFraction = 1
              let lightFraction = 1

              if (darker > 0 && lighter > 0) {
                if (this.data.brightnessOffset < 0) {
                  const inside = lighter - Math.abs(this.data.brightnessOffset)
                  const ratio = (darker - this.data.brightnessOffset) / darker
                  lightFraction = inside / (ratio * lighter)
                  maxLightness = Math.min(1, hsl.l + this.data.brightnessRange * lightFraction * (1 - hsl.l))
                } else {
                  const inside = darker - Math.abs(this.data.brightnessOffset)
                  const ratio = (lighter + this.data.brightnessOffset) / lighter
                  darkFraction = inside / (ratio * darker)
                  minLightness = Math.max(0, hsl.l - this.data.brightnessRange * darkFraction * hsl.l)
                }
              }

              darker = darker - this.data.brightnessOffset
              lighter = lighter + this.data.brightnessOffset

              const colours = []

              for (let x = darker - 1; x >= 0; x--) {
                const col = colour.toHsl()
                col.l = Math.lerp(hsl.l, minLightness, (x + 1) / (darker + 1))
                col.h = toPositiveAngle(col.h + Math.lerp(0, -angle * position * darkFraction, (x + 1) / (darker + 1)))
                colours.push(tinycolor(col).toHexString())
              }

              colours.push(tinycolor(colour).toHexString())

              for (let x = lighter - 1; x >= 0; x--) {
                const col = colour.toHsl()
                col.l = Math.lerp(maxLightness, hsl.l, (x + 1) / (lighter + 1))
                col.h = toPositiveAngle(col.h + Math.lerp(angle * (1 - position) * lightFraction, 0, (x + 1) / (lighter + 1)))
                colours.push(tinycolor(col).toHexString())
              }

              this.save()

              return new Set(colours)
            }
          },
          mounted() {
            $(this.$refs.colour).spectrum({
              preferredFormat: "hex",
              color: dialog.component.data.colour,
              showAlpha: false,
              showInput: true,
              move: c => dialog.content_vue.colour = c.toHexString(),
              change: c => dialog.content_vue.colour = c.toHexString(),
              hide: c => dialog.content_vue.colour = c.toHexString()
            })
          },
          template: `
            <div>
              <div title="Reset values back to their defaults" class="dialog_close_button" style="right: 33px; z-index: 3; border-radius: 6px;" @click="reset"><i class="material-icons">replay</i></div>
              <h2>Colour</h2>
              <input ref="colour" />
              <br>
              <div class="header-bar">
                <h2>Colour Count</h2>
                <i title="Reset" class="material-icons" @click="data.steps = defaults.steps">replay</i>
              </div>
              <p>The number of colours to include in the gradient</p>
              <div class="bar slider_input_combo">
                <input type="range" class="tool disp_range" v-model.number="data.steps" min="3" :max="data.smallRanges ? 32 : 256" step="1" />
                <numeric-input class="tool disp_text" v-model.number="data.steps" :min="3" :max="data.smallRanges ? 32 : 256" :step="1" />
              </div>
              <br>
              <div class="header-bar">
                <h2>Hue Shifting Angle</h2>
                <i title="Reset" class="material-icons" @click="data.angle = defaults.angle">replay</i>
              </div>
              <p>The amount of degrees over which the hue shifting occurs</p>
              <div class="bar slider_input_combo">
                <input type="range" class="tool disp_range" v-model.number="data.angle" :min="data.smallRanges ? -120 : -360" :max="data.smallRanges ? 120 : 360" step="1" />
                <numeric-input class="tool disp_text" v-model.number="data.angle" :min="data.smallRanges ? -120 : -360" :max="data.smallRanges ? 120 : 360" :step="1" />
              </div>
              <br>
              <div class="header-bar">
                <h2>Brightness Range</h2>
                <i title="Reset" class="material-icons" @click="data.brightnessRange = defaults.brightnessRange">replay</i>
              </div>
              <p>The range of the brightness included in the gradient</p>
              <div class="bar slider_input_combo">
                <input type="range" class="tool disp_range" v-model.number="data.brightnessRange" min="0" :max="1" step="0.001" />
                <numeric-input class="tool disp_text" v-model.number="data.brightnessRange" :min="0" :max="1" :step="0.001" />
              </div>
              <br>
              <div :class="{ disabled: !minBrightnessOffset && !maxBrightnessOffset }">
                <div class="header-bar">
                  <h2>Colour Offset</h2>
                  <i title="Reset" class="material-icons" @click="data.brightnessOffset = defaults.brightnessOffset">replay</i>
                </div>
                <p>Adjust the position of the selected colour within the gradient spectrum</p>
                <div class="bar slider_input_combo">
                  <input type="range" class="tool disp_range" v-model.number="data.brightnessOffset" :min="minBrightnessOffset" :max="maxBrightnessOffset" step="1" />
                  <numeric-input class="tool disp_text" v-model.number="data.brightnessOffset" :min="minBrightnessOffset" :max="maxBrightnessOffset" :step="1" />
                </div>
              </div>
              <br>
              <div id="colour-gradient-preview">
                <div v-for="col in palette" :class="{ primary: col === colour }" :style="{ backgroundColor: col }"></div>
              </div>
              <br>
              <label class="checkbox-row">
                <input type="checkbox" :checked="data.smallRanges" v-model="data.smallRanges" @input="clamp(); save()">
                <div>Use smaller ranges</div>
              </label>
              <label class="checkbox-row">
                <input type="checkbox" :checked="data.replace" v-model="data.replace" @input="save">
                <div>Replace existing palette</div>
              </label>
            </div>
          `
        },
        onOpen() {
          this.content_vue.colour = ColorPanel.get()
          $(this.content_vue.$refs.colour).spectrum("set", this.content_vue.colour)
        },
        onConfirm() {
          if (data.replace) ColorPanel.palette.length = 0
          for (const colour of this.content_vue.palette) {
            if (ColorPanel.palette.includes(colour)) ColorPanel.palette.splice(ColorPanel.palette.indexOf(colour), 1)
            ColorPanel.palette.push(colour)
          }
        }
      })
      action = new Action(id, {
        name: "Generate Gradient Palette",
        icon: "gradient",
        click: () => dialog.show()
      })
      Toolbars.palette.add(action)
    },
    onuninstall() {
      localStorage.removeItem("colour_gradient_steps")
      localStorage.removeItem("colour_gradient_angle")
    },
    onunload() {
      dialog.close()
      action.delete()
    }
  })

  function toPositiveAngle(angle) {
    angle = ((angle % 360) + 360) % 360
    if (angle < 0) angle += 360
    return angle
  }
})()