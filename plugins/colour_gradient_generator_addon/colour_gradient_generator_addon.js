// Adds controls to the installed Colour Gradient Generator without replacing its source file.
const gradientAddonId = 'colour_gradient_generator_addon'
const gradientAddonDefaults = {
  darkerShades: 0, lighterShades: 0, darkReach: 35, lightReach: 35,
  darkSaturation: 0, lightSaturation: 0, darkHueShift: 0, lightHueShift: 0
}
const gradientAddonDialogs = new Map()
let gradientAddonShow, gradientAddonShowWrapper, gradientAddonPick
let gradientAddonCompatibilityNotice = false

function gradientAddonStopPick(colour) {
  if (!gradientAddonPick) return
  const { dialog, field, previousTool, originalPicker, wrappedPicker, onKeyDown } = gradientAddonPick
  document.removeEventListener('keydown', onKeyDown, true)
  if (Painter.colorPicker === wrappedPicker) Painter.colorPicker = originalPicker
  gradientAddonPick = null
  if (Toolbox.selected === BarItems.color_picker) previousTool?.select?.()
  if (colour) dialog.content_vue[field] = colour
  dialog._gradientAddonReopening = true
  dialog.show()
}

function gradientAddonStartPick(dialog, field) {
  if (!BarItems.color_picker?.select || !Painter?.colorPicker) {
    Blockbench.showQuickMessage('Model colour picker is unavailable')
    return
  }
  if (gradientAddonPick) gradientAddonStopPick()
  const previousTool = Toolbox.selected
  const originalPicker = Painter.colorPicker
  const onKeyDown = event => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopImmediatePropagation()
    gradientAddonStopPick()
  }
  const wrappedPicker = (texture, x, y, event) => {
    if (event?.button === 2) return
    let colour
    if (settings.pick_combined_color.value === false && texture.getActiveLayer()) {
      const layer = texture.getActiveLayer()
      colour = Painter.getPixelColor(texture.getActiveCanvas().ctx, x - layer.offset[0], y - layer.offset[1])
    }
    if (!colour || colour.toHex8() === '00000000') colour = Painter.getPixelColor(texture.ctx, x, y)
    if (!colour || colour.getAlpha() === 0) return
    setTimeout(() => gradientAddonStopPick(colour.toHexString()), 0)
  }
  gradientAddonPick = { dialog, field, previousTool, originalPicker, wrappedPicker, onKeyDown }
  dialog.hide()
  Painter.colorPicker = wrappedPicker
  document.addEventListener('keydown', onKeyDown, true)
  BarItems.color_picker.select()
  Blockbench.showQuickMessage('Click the model to pick a texture colour · Esc to cancel', 2500)
}

function gradientAddonExtend(dialog) {
  if (dialog.id !== 'colour_gradient_generator' || gradientAddonDialogs.has(dialog)) return
  const component = dialog.component
  const firstPicker = '<div><input ref="colour" /></div>'
  const secondPicker = '<div v-show="data.colourMode === \'double\'"><input ref="colour2" /></div>'
  const resetClick = '@click="data[s.key] = defaults[s.key]"'
  const swatch = '<div v-for="col in result.colours" :class="{ primary: col === result.primaryHex, \'light-marker\': col === result.primaryHex && markerLight }" :style="{ backgroundColor: col }"></div>'
  if (!component?.methods?.doubleResult || !component.template?.includes(firstPicker) ||
      !component.template.includes(secondPicker) || !component.template.includes(resetClick) || !component.template.includes(swatch) ||
      component.template.split('            <div class="tab_bar">').length < 3) {
    if (!gradientAddonCompatibilityNotice) {
      Blockbench.showQuickMessage('Gradient add-on needs the original Colour Gradient Generator 3.0.0')
      gradientAddonCompatibilityNotice = true
    }
    return
  }
  const old = {
    template: component.template,
    data: { ...component.data },
    methods: { ...component.methods },
    computed: { ...component.computed },
    watch: { ...component.watch },
    beforeDestroy: component.beforeDestroy,
    onOpen: dialog.onOpen,
    linesLength: dialog.lines.length
  }
  gradientAddonDialogs.set(dialog, old)
  const saved = JSON.parse(localStorage.getItem(gradientAddonId) || '{}')
  for (const key of Object.keys(gradientAddonDefaults)) {
    Vue.set(component.data.data, key, saved[key] ?? gradientAddonDefaults[key])
  }
  Vue.set(component.data, 'copiedIndex', -1)
  Vue.set(component.data, 'copyTimeout', null)
  const originalSave = old.methods.save
  component.methods.save = function() {
    originalSave.call(this)
    const values = Object.fromEntries(Object.keys(gradientAddonDefaults).map(key => [key, this.data[key]]))
    localStorage.setItem(gradientAddonId, JSON.stringify(values))
  }
  component.methods.reset = function() {
    old.methods.reset.call(this)
    for (const key of Object.keys(gradientAddonDefaults)) this.data[key] = gradientAddonDefaults[key]
  }
  component.methods.resetSlider = function(key) {
    this.data[key] = Object.prototype.hasOwnProperty.call(gradientAddonDefaults, key)
      ? gradientAddonDefaults[key]
      : this.defaults[key]
  }
  component.methods.doubleResult = function() {
    const result = old.methods.doubleResult.call(this)
    const points = result.points
    if (points.length < 2) return result
    const first = tinycolor(this.colour).toHsl()
    const last = tinycolor(this.colour2).toHsl()
    points[0].hex = tinycolor(this.colour).toHexString()
    points[points.length - 1].hex = tinycolor(this.colour2).toHexString()
    const darkerIsFirst = first.l <= last.l
    const dark = darkerIsFirst ? first : last
    const light = darkerIsFirst ? last : first
    const shades = (base, count, target, saturation, hueShift) => Array.from({ length: count }, (_, index) => {
      const t = (index + 1) / count
      const l = Math.lerp(base.l, target, t)
      const h = ((base.h + hueShift * t) % 360 + 360) % 360
      const s = saturation >= 0
        ? base.s + (1 - base.s) * saturation / 100 * t
        : base.s * (1 + saturation / 100 * t)
      return { hex: tinycolor({ h, s, l }).toHexString(), h, s, l }
    })
    const darker = shades(dark, this.data.darkerShades, dark.l * (1 - this.data.darkReach / 100), this.data.darkSaturation, this.data.darkHueShift)
    const lighter = shades(light, this.data.lighterShades, light.l + (1 - light.l) * this.data.lightReach / 100, this.data.lightSaturation, this.data.lightHueShift)
    return { points: darkerIsFirst
      ? [...darker.reverse(), ...points, ...lighter]
      : [...lighter.reverse(), ...points, ...darker] }
  }
  component.computed.sliders = function() {
    const sliders = old.computed.sliders.call(this)
    if (this.data.colourMode !== 'double') return sliders
    return [...sliders,
      { key: 'darkerShades', title: 'Darker Shades', desc: 'Extra shades beyond the darker chosen colour', min: 0, max: 16 },
      { key: 'lighterShades', title: 'Lighter Shades', desc: 'Extra shades beyond the lighter chosen colour', min: 0, max: 16 },
      { key: 'darkReach', title: 'Dark Reach', desc: 'How far the extra shades go toward black', min: 1, max: 100, disabled: !this.data.darkerShades },
      { key: 'lightReach', title: 'Light Reach', desc: 'How far the extra shades go toward white', min: 1, max: 100, disabled: !this.data.lighterShades }
    ]
  }
  component.computed.extensionSliders = function() {
    return [
      { key: 'darkSaturation', title: 'Dark Saturation', min: -100, max: 100, disabled: !this.data.darkerShades },
      { key: 'lightSaturation', title: 'Light Saturation', min: -100, max: 100, disabled: !this.data.lighterShades },
      { key: 'darkHueShift', title: 'Dark Hue Shift', min: -120, max: 120, disabled: !this.data.darkerShades },
      { key: 'lightHueShift', title: 'Light Hue Shift', min: -120, max: 120, disabled: !this.data.lighterShades }
    ]
  }
  component.methods.copyShade = function(colour, index) {
    try {
      Clipbench.setText(colour.toUpperCase())
    } catch (error) {
      Blockbench.showQuickMessage('Could not copy HEX code')
      return
    }
    clearTimeout(this.copyTimeout)
    this.copiedIndex = index
    this.copyTimeout = setTimeout(() => { this.copiedIndex = -1 }, 900)
  }
  component.methods.pickFromModel = field => gradientAddonStartPick(dialog, field)
  component.watch.result = function() {
    this.copiedIndex = -1
    this.queueDraw()
  }
  component.beforeDestroy = function() {
    clearTimeout(this.copyTimeout)
    old.beforeDestroy?.call(this)
  }
  dialog.onOpen = function() {
    if (this._gradientAddonReopening) this._gradientAddonReopening = false
    else old.onOpen?.call(this)
  }
  let template = component.template.replace(resetClick, '@click="resetSlider(s.key)"')
  template = template.replace(firstPicker, '<div class="gradient-addon-colour-row"><input ref="colour" /><button type="button" class="gradient-addon-picker" title="Pick from model texture" aria-label="Pick first colour from model texture" @click="pickFromModel(\'colour\')"><i class="material-icons">colorize</i></button></div>')
  template = template.replace(secondPicker, '<div v-show="data.colourMode === \'double\'" class="gradient-addon-colour-row"><input ref="colour2" /><button type="button" class="gradient-addon-picker" title="Pick from model texture" aria-label="Pick second colour from model texture" @click="pickFromModel(\'colour2\')"><i class="material-icons">colorize</i></button></div>')
  const tab = '            <div class="tab_bar">'
  const tabIndex = template.lastIndexOf(tab)
  if (tabIndex >= 0) template = template.slice(0, tabIndex) + `
            <div v-if="data.colourMode === 'double'" class="gradient-addon-tuning">
              <div v-for="s in extensionSliders" :key="s.key" :class="{ disabled: s.disabled }">
                <div class="header-bar"><h2>{{ s.title }}</h2><i title="Reset" class="material-icons" @click="resetSlider(s.key)">replay</i></div>
                <div class="bar slider_input_combo">
                  <input type="range" class="tool disp_range" v-model.number="data[s.key]" :min="s.min" :max="s.max" step="1" />
                  <numeric-input class="tool disp_text" v-model.number="data[s.key]" :min="s.min" :max="s.max" :step="1" />
                </div>
              </div>
            </div>
` + template.slice(tabIndex)
  template = template.replace(swatch,
    '<div v-for="(col, index) in result.colours" :key="index" role="button" tabindex="0" :aria-label="\'Copy HEX \' + col.toUpperCase()" :title="\'Copy \' + col.toUpperCase()" :class="{ primary: col === result.primaryHex, \'light-marker\': col === result.primaryHex && markerLight, copied: copiedIndex === index }" :style="{ backgroundColor: col }" @click="copyShade(col, index)" @keydown.enter.prevent="copyShade(col, index)" @keydown.space.prevent="copyShade(col, index)"><span v-if="copiedIndex === index" class="gradient-addon-feedback">HEX copied</span></div>')
  component.template = template
  dialog.lines.push(`<style>
    #colour_gradient_generator .gradient-addon-colour-row { display:flex; align-items:center; gap:6px; min-width:0; }
    #colour_gradient_generator .gradient-addon-colour-row .sp-replacer { flex:1; min-width:0; }
    #colour_gradient_generator .gradient-addon-picker { box-sizing:border-box; width:52px !important; min-width:0 !important; max-width:52px !important; height:32px; flex:0 0 52px; padding:0; display:grid; place-items:center; border:1px solid var(--color-border); border-radius:4px; background:var(--color-button); color:var(--color-text); }
    #colour_gradient_generator .gradient-addon-picker .material-icons { font-size:17px; line-height:1; transform:translate(1px, 1px); }
    #colour_gradient_generator .gradient-addon-tuning { display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; margin:-8px 0 20px; }
    #colour_gradient_generator .gradient-addon-tuning .header-bar h2 { font-size:.95em; }
    #colour_gradient_generator #colour-gradient-preview, #colour_gradient_generator #colour-gradient-preview .strip { overflow:visible; }
    #colour_gradient_generator #colour-gradient-preview .strip > div { min-width:0; cursor:pointer; transition:transform 160ms ease,filter 160ms ease,box-shadow 160ms ease; }
    #colour_gradient_generator #colour-gradient-preview .strip > div:hover, #colour_gradient_generator #colour-gradient-preview .strip > div:focus-visible { z-index:2; transform:translateY(-2px); filter:brightness(1.08); box-shadow:inset 0 0 0 2px #fff,0 2px 8px #0006; outline:none; }
    #colour_gradient_generator .gradient-addon-feedback { position:absolute; left:50%; bottom:calc(100% + 7px); transform:translateX(-50%); padding:4px 7px; border-radius:4px; background:#192025; color:#fff; font-size:12px; font-weight:600; white-space:nowrap; pointer-events:none; }
  </style>`)
  if (dialog.object) dialog.delete()
}

Plugin.register(gradientAddonId, {
  title: 'Colour Gradient Generator Add-on',
  icon: 'icon.png',
  author: 'Hlamingo',
  description: 'Adds extra shade controls, model texture eyedropper, and copyable swatches to Colour Gradient Generator.',
  tags: ['Paint', 'Palette', 'Color'],
  version: '0.1.0',
  min_version: '5.0.0',
  variant: 'both',
  dependencies: ['colour_gradient_generator'],
  onload() {
    gradientAddonShow = Dialog.prototype.show
    gradientAddonShowWrapper = function(...args) {
      gradientAddonExtend(this)
      return gradientAddonShow.apply(this, args)
    }
    Dialog.prototype.show = gradientAddonShowWrapper
  },
  onunload() {
    if (gradientAddonPick) {
      document.removeEventListener('keydown', gradientAddonPick.onKeyDown, true)
      if (Painter.colorPicker === gradientAddonPick.wrappedPicker) Painter.colorPicker = gradientAddonPick.originalPicker
      gradientAddonPick = null
    }
    if (Dialog.prototype.show === gradientAddonShowWrapper) Dialog.prototype.show = gradientAddonShow
    for (const [dialog, old] of gradientAddonDialogs) {
      if (dialog.object) dialog.delete()
      dialog.component.template = old.template
      dialog.component.data = old.data
      dialog.component.methods = old.methods
      dialog.component.computed = old.computed
      dialog.component.watch = old.watch
      dialog.component.beforeDestroy = old.beforeDestroy
      dialog.onOpen = old.onOpen
      dialog.lines.length = old.linesLength
    }
    gradientAddonDialogs.clear()
  }
})
