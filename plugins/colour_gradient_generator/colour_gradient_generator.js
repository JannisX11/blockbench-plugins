let action, dialog, data
const id = "colour_gradient_generator"
const defaults = {
  steps: 9,
  angle: 45,
  replace: false,
  smallRanges: true,
  brightnessRange: 90,
  brightnessOffset: 0,
  curve: -12,
  saturation: 33,
  huePath: 0,
  bias: 0,
  lightnessCurve: 0,
  previewMode: "simple",
  colourMode: "single"
}
Plugin.register(id, {
  title: "Colour Gradient Generator",
  icon: "icon.png",
  author: "Ewan Howell",
  description: "Generate hue shifted gradient palettes from a single colour.",
  tags: ["Paint", "Palette", "Color"],
  version: "3.0.0",
  min_version: "5.0.0",
  variant: "both",
  website: "https://ewanhowell.com/plugins/colour-gradient-generator/",
  repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/colour_gradient_generator",
  bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues?title=[Colour Gradient Generator]",
  creation_date: "2022-06-02",
  has_changelog: true,
  onload() {
    const storage = JSON.parse(localStorage.getItem(id) ?? "{}")
    data = Object.fromEntries(Object.keys(defaults).map(k => [k, storage[k] ?? defaults[k]]))
    dialog = new Dialog({
      id,
      title: "Generate Gradient Palette",
      width: 780,
      buttons: ["Generate", "Cancel"],
      lines: [`<style>
        #colour-gradient-preview {
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 12px;

          canvas {
            width: 100%;
            height: 160px;
            display: block;
          }

          .strip {
            display: flex;
            overflow-x: hidden;

            > div {
              background-color: red;
              flex: 1;
              height: 64px;
              position: relative;

              &.primary::before {
                content: "";
                position: absolute;
                bottom: 0;
                height: 4px;
                left: 0;
                right: 0;
                background-color: var(--color-accent);
              }

              &.primary.light-marker::before {
                background-color: #fff;
              }
            }
          }
        }

        #colour_gradient_generator {
          h2 {
            font-size: 1.1em;
            margin: 0;
            color: var(--color-light);
          }

          p {
            color: var(--color-subtle_text);
            font-size: 0.92em;
            margin: 0;
          }

          .settings-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 24px;
            margin: 24px 0;
          }

          .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;

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
            padding: 0;
            border-radius: 5px;
            height: initial;
            margin-top: 4px;
            align-items: center;
            background: var(--color-selected);

            .sp-preview {
              flex: 1;
              height: 32px;
              margin-right: 0;
            }

            .sp-dd {
              width: 32px;
              padding: 0;
              align-items: center;
              justify-content: center;
              display: flex;
              translate: 0 2px;
            }
          }

          .colour-pickers {
            display: flex;
            gap: 12px;

            > div {
              flex: 1;
            }
          }

          .checkbox-bar {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-right: auto;
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

          .tab_bar {
            margin-bottom: 8px;

            > div {
              cursor: pointer;
              text-transform: capitalize;
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
          colour2: "#ffffff",
          minBrightnessOffset: Math.min(0, data.brightnessOffset),
          maxBrightnessOffset: Math.max(0, data.brightnessOffset),
          accent: "#3e90ff"
        },
        methods: {
          save() {
            localStorage.setItem(id, JSON.stringify(this.data))
          },
          clamp() {
            const maxAngle = this.data.smallRanges ? 120 : 360
            this.data.steps = Math.min(this.data.smallRanges ? 32 : 256, this.data.steps)
            this.data.angle = Math.clamp(this.data.angle, -maxAngle, maxAngle)
          },
          reset() {
            for (const k in defaults) {
              if (k !== "previewMode" && k !== "colourMode") this.data[k] = defaults[k]
            }
          },
          queueDraw() {
            this.$nextTick(() => this.drawGraph())
          },
          syncPicker(ref, value) {
            const picker = $(this.$refs[ref])
            if (picker.length && picker.spectrum("get")?.toHexString?.() !== value) picker.spectrum("set", value)
          },
          doubleResult() {
            const N = this.data.steps
            const a = tinycolor(this.colour).toHsl(), b = tinycolor(this.colour2).toHsl()
            const ca = chromaOf(a), cb = chromaOf(b)
            if (ca < 0.001) a.h = b.h
            if (cb < 0.001) b.h = a.h
            const d = ((b.h - a.h + 540) % 360) - 180
            const v = this.data.huePath / 100
            const points = []
            for (let i = 0; i < N; i++) {
              let t = N > 1 ? i / (N - 1) : 0
              t += this.data.bias / 167 * t * (1 - t)
              const l = Math.clamp(Math.lerp(a.l, b.l, t) + this.data.lightnessCurve / 100 * 1.6 * t * (1 - t), 0, 1)
              const hs = (a.h + d * t) * Math.PI / 180, hl = (a.h + (d - 360 * Math.sign(d || 1)) * t) * Math.PI / 180
              const ux = Math.lerp(Math.cos(hs), Math.cos(hl), v)
              const uy = Math.lerp(Math.sin(hs), Math.sin(hl), v)
              const s = lightSpan(l) > 0.001 ? Math.min(1, Math.hypot(ux, uy) * Math.lerp(ca, cb, t) / lightSpan(l)) : 0
              const h = toPositiveAngle(Math.atan2(uy, ux) * 180 / Math.PI)
              points.push({ hex: hex(h, s, l), h, l, s })
            }
            return { points }
          },
          singleResult() {
            const hsl = tinycolor(this.colour).toHsl()
            let angle = this.data.angle
            if (hsl.h >= 100 && hsl.h < 260) angle *= -1

            const N = this.data.steps
            const br = this.data.brightnessRange / 100
            const minL0 = Math.max(0, hsl.l - br * hsl.l)
            const range = Math.min(1, hsl.l + br * (1 - hsl.l)) - minL0

            const pos = range > 0 ? (hsl.l - minL0) / range : 0.5
            let uNat = pos
            if (range > 0 && this.data.curve !== 0) {
              const k = Math.pow(4, Math.abs(this.data.curve) / 100)
              uNat = this.data.curve > 0 ? Math.pow(pos, k) : 1 - Math.pow(1 - pos, k)
            }
            let gamma = 1, mirror = false
            if (range > 0 && pos > 1e-4 && pos < 1 - 1e-4 && uNat > 1e-4 && uNat < 1 - 1e-4) {
              mirror = pos > uNat
              gamma = mirror ? Math.log(1 - pos) / Math.log(1 - uNat) : Math.log(pos) / Math.log(uNat)
            }
            const shape = u => mirror ? 1 - Math.pow(1 - u, gamma) : Math.pow(u, gamma)

            const darker0 = range > 0 ? Math.clamp(Math.round(uNat * (N - 1)), 0, N - 1) : Math.floor(N / 2)
            this.minBrightnessOffset = darker0 - (N - 1)
            this.maxBrightnessOffset = darker0
            this.data.brightnessOffset = Math.clamp(this.data.brightnessOffset, this.minBrightnessOffset, this.maxBrightnessOffset)
            const iBase = Math.clamp(darker0 - this.data.brightnessOffset, 0, N - 1)

            const du = Math.min(
              iBase > 0 ? uNat / iBase : Infinity,
              iBase < N - 1 ? (1 - uNat) / (N - 1 - iBase) : Infinity
            )
            const uAt = k => Math.clamp(uNat + (k - iBase) * du, 0, 1)
            const lightnessAt = k => (range <= 0 || k === iBase) ? hsl.l : minL0 + range * shape(uAt(k))

            const position = (iBase + 1) / (N + 1)
            const hueAt = i => {
              if (i === iBase) return hsl.h
              const shift = i < iBase
                ? -angle * position * ((iBase - i) / iBase)
                : angle * (1 - position) * ((i - iBase) / (N - 1 - iBase))
              return toPositiveAngle(hsl.h + shift)
            }

            const satSpan = Math.max(iBase, N - 1 - iBase)
            const satRef = range > 0 ? Math.max(hsl.l - lightnessAt(0), lightnessAt(N - 1) - hsl.l) : 0
            const satAt = (steps, l) => {
              const d = satRef > 0
                ? Math.min(1, Math.abs(l - hsl.l) / satRef)
                : (satSpan > 0 ? steps / satSpan : 0)
              return hsl.s * (1 - this.data.saturation / 100 * Math.pow(d, 1.6))
            }

            const points = []
            for (let i = 0; i < N; i++) {
              const l = lightnessAt(i), h = hueAt(i), s = satAt(Math.abs(i - iBase), l)
              points.push({ hex: hex(h, s, l), h, l, s })
            }

            return { points, primaryHex: hex(hsl.h, hsl.s, hsl.l) }
          },
          drawGraph() {
            const cv = this.$refs.graph
            if (!cv || this.data.previewMode !== "advanced") return
            const { points: pts, primaryHex } = this.result
            const W = cv.clientWidth || 700, H = cv.clientHeight || 160, dpr = window.devicePixelRatio || 1
            cv.width = W * dpr
            cv.height = H * dpr
            const ctx = cv.getContext("2d")
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, W, H)
            const pad = 7
            const plotW = this.data.colourMode === "double" ? W - H : W
            const N = pts.length
            const lo = Math.min(...pts.map(p => p.l)), hi = Math.max(...pts.map(p => p.l))
            const lerpHue = (a, b, t) => a + (((b - a + 540) % 360) - 180) * t
            const byL = [...pts].sort((a, b) => a.l - b.l)
            const alongL = (L, get, mix) => {
              if (L <= byL[0].l) return get(byL[0])
              if (L >= byL[N - 1].l) return get(byL[N - 1])
              for (let i = 1; i < N; i++) {
                if (L <= byL[i].l) return mix(get(byL[i - 1]), get(byL[i]), (L - byL[i - 1].l) / ((byL[i].l - byL[i - 1].l) || 1))
              }
              return get(byL[N - 1])
            }

            const slopes = new Set(pts.slice(1).map((p, i) => Math.sign(p.l - pts[i].l)).filter(Boolean))

            let xs, hueAtFrac, lightAtFrac
            if (slopes.size > 1 || hi - lo < 1e-6) {
              xs = pts.map((_, i) => pad + (N > 1 ? i / (N - 1) : 0.5) * (plotW - 2 * pad))
              const along = (f, get, mix) => {
                const idx = f * (N - 1), i0 = Math.clamp(Math.floor(idx), 0, N - 1)
                return mix(get(pts[i0]), get(pts[Math.min(N - 1, i0 + 1)]), idx - i0)
              }
              hueAtFrac = f => along(f, p => p.h, lerpHue)
              lightAtFrac = f => along(f, p => p.l, Math.lerp)
            } else {
              const axisSpan = Math.min(1, 2 * (hi - lo))
              const aMin = Math.clamp((lo + hi) / 2 - axisSpan / 2, 0, 1 - axisSpan)
              xs = pts.map(p => pad + ((p.l - aMin) / axisSpan) * (plotW - 2 * pad))
              hueAtFrac = f => alongL(aMin + f * axisSpan, p => p.h, lerpHue)
              lightAtFrac = f => aMin + f * axisSpan
            }

            const cell = 4
            const fillCell = (px, py, h, s, l) => {
              ctx.fillStyle = `hsl(${h} ${s * 100}% ${l * 100}%)`
              ctx.fillRect(px, py, cell + 1, cell + 1)
            }
            for (let px = 0; px < plotW; px += cell) {
              const f = px / plotW, hue = hueAtFrac(f), L = lightAtFrac(f)
              for (let py = 0; py < H; py += cell) fillCell(px, py, hue, 1 - py / H, L)
            }

            const Y = s => pad + (1 - s) * (H - 2 * pad)
            const plotS = i => {
              if (lightSpan(pts[i].l) >= 0.005) return pts[i].s
              for (let o = 1; o < N; o++) {
                if (i - o >= 0 && lightSpan(pts[i - o].l) >= 0.005) return pts[i - o].s
                if (i + o < N && lightSpan(pts[i + o].l) >= 0.005) return pts[i + o].s
              }
              return pts[i].s
            }
            const drawPath = at => {
              ctx.beginPath()
              pts.forEach((p, i) => {
                const [x, y] = at(p, i)
                i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
              })
              ctx.lineWidth = 2
              ctx.strokeStyle = "#111"
              ctx.stroke()
              pts.forEach((p, i) => {
                const [x, y, r] = at(p, i)
                for (const [radius, fill] of [[r + 1.5, "#fff"], [r, p.hex]]) {
                  ctx.beginPath()
                  ctx.arc(x, y, radius, 0, 7)
                  ctx.fillStyle = fill
                  ctx.fill()
                }
                ctx.lineWidth = 1
                ctx.strokeStyle = "rgba(0,0,0,.4)"
                ctx.stroke()
              })
            }
            drawPath((p, i) => [xs[i], Y(plotS(i)), p.hex === primaryHex ? 5 : 3.5])

            if (plotW < W) {
              const cx = plotW + (W - plotW) / 2, cy = H / 2, R = Math.min((W - plotW) / 2, H / 2) - pad
              const radial = hi - lo >= 0.05
              const centreL = pts.reduce((min, p) => chromaOf(p) < chromaOf(min) ? p : min).l
              ctx.save()
              ctx.beginPath()
              ctx.arc(cx, cy, R, 0, 7)
              ctx.clip()
              for (let px = plotW; px < W; px += cell) {
                for (let py = 0; py < H; py += cell) {
                  const dx = px + cell / 2 - cx, dy = py + cell / 2 - cy, r = Math.hypot(dx, dy)
                  if (r > R + cell) continue
                  const f = Math.min(1, r / R)
                  const hue = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360
                  if (radial) {
                    const L = Math.lerp(lo, hi, f)
                    fillCell(px, py, hue, alongL(L, p => p.s, Math.lerp), L)
                  } else fillCell(px, py, hue, f, Math.lerp(centreL, 0.5, f))
                }
              }
              ctx.restore()
              drawPath(p => {
                const angle = (p.h - 90) * Math.PI / 180
                const r = radial ? (p.l - lo) / (hi - lo) * (R - 6) : R * chromaOf(p)
                return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 3.5]
              })
            }
          }
        },
        computed: {
          sliders() {
            const maxAngle = this.data.smallRanges ? 120 : 360
            const steps = { key: "steps", title: "Colour Count", desc: "The number of colours to include in the gradient", min: 3, max: this.data.smallRanges ? 32 : 256 }
            if (this.data.colourMode === "double") return [
              steps,
              { key: "huePath", title: "Hue Path", desc: "The route the blend takes around or across the wheel", min: 0, max: 100 },
              { key: "bias", title: "Bias", desc: "Bias the spacing to prefer one colour or the other", min: -150, max: 150 },
              { key: "lightnessCurve", title: "Lightness Curve", desc: "Bow the middle of the blend darker or lighter", min: -100, max: 100 }
            ]
            return [
              steps,
              { key: "angle", title: "Hue Shifting Angle", desc: "The amount of degrees over which the hue shifting occurs", min: -maxAngle, max: maxAngle },
              { key: "brightnessRange", title: "Brightness Range", desc: "The range of the brightness included in the gradient", min: 0, max: 100 },
              { key: "curve", title: "Curve", desc: "Bias the gradient towards lighter or darker tones", min: -100, max: 100, disabled: this.data.brightnessRange <= 0 },
              { key: "saturation", title: "Saturation Falloff", desc: "Reduce saturation toward the lightest and darkest colours", min: 0, max: 100 },
              { key: "brightnessOffset", title: "Colour Offset", desc: "Adjust the position of the colour in the gradient", min: this.minBrightnessOffset, max: this.maxBrightnessOffset, disabled: !this.minBrightnessOffset && !this.maxBrightnessOffset }
            ]
          },
          result() {
            const { points, primaryHex = null } = this.data.colourMode === "double" ? this.doubleResult() : this.singleResult()
            this.save()
            return { colours: [...new Set(points.map(p => p.hex))], primaryHex, points }
          },
          markerLight() {
            if (!this.result.primaryHex) return false
            const a = tinycolor(this.result.primaryHex).toRgb(), b = tinycolor(this.accent).toRgb()
            return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b) < 150
          }
        },
        watch: {
          result: "queueDraw",
          "data.previewMode": "queueDraw",
          colour(value) {
            this.syncPicker("colour", value)
          },
          colour2(value) {
            this.syncPicker("colour2", value)
          }
        },
        mounted() {
          this.accent = tinycolor(getComputedStyle(document.body).getPropertyValue("--color-accent").trim() || this.accent).toHexString()
          for (const key of ["colour", "colour2"]) {
            const setColour = c => this[key] = c.toHexString()
            $(this.$refs[key]).spectrum({
              preferredFormat: "hex",
              color: this[key],
              showAlpha: false,
              showInput: true,
              move: setColour,
              change: setColour,
              hide: setColour
            })
          }
          this.queueDraw()
        },
        template: `
          <div>
            <div title="Reset values back to their defaults" class="dialog_close_button" style="right: 33px; z-index: 3; border-radius: 6px;" @click="reset"><i class="material-icons">replay</i></div>
            <div class="tab_bar">
              <div v-for="(label, mode) in { single: 'Single Colour', double: 'Two Colours' }" :class="{ open: data.colourMode === mode }" @click="data.colourMode = mode; save()">{{ label }}</div>
            </div>
            <h2>{{ data.colourMode === 'double' ? 'Colours' : 'Colour' }}</h2>
            <div class="colour-pickers">
              <div><input ref="colour" /></div>
              <div v-show="data.colourMode === 'double'"><input ref="colour2" /></div>
            </div>
            <div class="settings-grid">
              <div v-for="s in sliders" :key="s.key" :class="{ disabled: s.disabled }">
                <div class="header-bar">
                  <h2>{{ s.title }}</h2>
                  <i title="Reset" class="material-icons" @click="data[s.key] = defaults[s.key]">replay</i>
                </div>
                <p>{{ s.desc }}</p>
                <div class="bar slider_input_combo">
                  <input type="range" class="tool disp_range" v-model.number="data[s.key]" :min="s.min" :max="s.max" step="1" />
                  <numeric-input class="tool disp_text" v-model.number="data[s.key]" :min="s.min" :max="s.max" :step="1" />
                </div>
              </div>
            </div>
            <div class="tab_bar">
              <div v-for="mode in ['simple', 'advanced']" :class="{ open: data.previewMode === mode }" @click="data.previewMode = mode; save()">{{ mode }}</div>
            </div>
            <div id="colour-gradient-preview">
              <canvas ref="graph" v-show="data.previewMode === 'advanced'"></canvas>
              <div class="strip">
                <div v-for="col in result.colours" :class="{ primary: col === result.primaryHex, 'light-marker': col === result.primaryHex && markerLight }" :style="{ backgroundColor: col }"></div>
              </div>
            </div>
            <div class="checkbox-bar" ref="checkboxBar">
              <label class="checkbox-row">
                <input type="checkbox" :checked="data.smallRanges" v-model="data.smallRanges" @input="clamp(); save()">
                <div>Use smaller ranges</div>
              </label>
              <label class="checkbox-row">
                <input type="checkbox" :checked="data.replace" v-model="data.replace" @input="save">
                <div>Replace existing palette</div>
              </label>
            </div>
          </div>
        `
      },
      onBuild() {
        this.object.querySelector(".dialog_bar.button_bar").prepend(this.content_vue.$refs.checkboxBar)
      },
      onOpen() {
        this.content_vue.colour = ColorPanel.get()
      },
      onConfirm() {
        if (data.replace) ColorPanel.palette.empty()
        for (const colour of this.content_vue.result.colours) {
          ColorPanel.palette.remove(colour)
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
  return ((angle % 360) + 360) % 360
}

function hex(h, s, l) {
  return tinycolor({ h, s, l }).toHexString()
}

function lightSpan(l) {
  return 1 - Math.abs(2 * l - 1)
}

function chromaOf(colour) {
  return colour.s * lightSpan(colour.l)
}
