// Adds controls to the installed Colour Gradient Generator without replacing its source file.
const gradientAddonId = 'colour_gradient_generator_addon'
const gradientAddonDefaults = {
  darkerShades: 0, lighterShades: 0, darkReach: 35, lightReach: 35,
  darkSaturation: 0, lightSaturation: 0, darkHueShift: 0, lightHueShift: 0,
  middlePosition: 50
}
const gradientAddonDialogs = new Map()
let gradientAddonShow, gradientAddonShowWrapper, gradientAddonPick
let gradientAddonCompatibilityNotice = false
let gradientAddonPaletteAction, gradientAddonPaletteEditAction, gradientAddonPaletteStyle
const gradientAddonPaletteSelection = { active: false, indexes: new Set(), anchor: -1, signature: '' }
const gradientAddonPaletteEdit = { active: false, index: -1, signature: '', picker: null }
const gradientAddonGroups = { items: [], visible: false, observer: null }

function gradientAddonLoadGroups() {
  try {
    const saved = JSON.parse(localStorage.getItem(gradientAddonId + '.groups') || '[]')
    gradientAddonGroups.items = Array.isArray(saved) ? saved.filter(group => group &&
      typeof group.name === 'string' && Array.isArray(group.colours)).map(group => ({
        name: group.name, colours: group.colours.filter(colour => typeof colour === 'string')
      })) : []
  } catch (error) { gradientAddonGroups.items = [] }
  gradientAddonGroups.visible = gradientAddonGroups.items.length > 0
}

function gradientAddonSaveGroups() {
  localStorage.setItem(gradientAddonId + '.groups', JSON.stringify(gradientAddonGroups.items))
}

function gradientAddonReconcileGroups() {
  const palette = new Set(ColorPanel.palette)
  const assigned = new Set()
  for (const group of gradientAddonGroups.items) {
    group.colours = group.colours.filter(colour => {
      if (!palette.has(colour) || assigned.has(colour)) return false
      assigned.add(colour)
      return true
    })
  }
  return ColorPanel.palette.filter(colour => !assigned.has(colour))
}

function gradientAddonCreateGroup(name, colours) {
  const unique = [...new Set(colours)].filter(colour => ColorPanel.palette.includes(colour))
  if (!unique.length) return
  for (const group of gradientAddonGroups.items) {
    group.colours = group.colours.filter(colour => !unique.includes(colour))
  }
  gradientAddonGroups.items.push({ name, colours: unique })
  gradientAddonReconcileGroups()
  gradientAddonGroups.items = gradientAddonGroups.items.filter(group => group.colours.length)
  gradientAddonSaveGroups()
  gradientAddonShowGroups()
}

function gradientAddonGroupButton(label, title, callback) {
  const button = document.createElement('span')
  button.className = 'gradient-addon-group-control'
  button.textContent = label
  button.title = title
  button.tabIndex = 0
  button.setAttribute('role', 'button')
  button.setAttribute('aria-label', title)
  button.addEventListener('click', callback)
  button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback() }
  })
  return button
}

function gradientAddonRenderGroups() {
  if (!gradientAddonGroups.visible) return
  if (!gradientAddonGroups.items.length) { gradientAddonHideGroups(); return }
  const list = document.getElementById('palette_list')
  if (!list) return
  gradientAddonReconcileGroups()
  let view = document.getElementById('gradient-addon-grouped-palette')
  if (!view) {
    view = document.createElement('div')
    view.id = 'gradient-addon-grouped-palette'
    list.parentElement.insertBefore(view, list)
  }
  view.replaceChildren()
  const rows = [...gradientAddonGroups.items.map((group, index) => ({ group, index })),
    { group: { name: 'Ungrouped', colours: gradientAddonReconcileGroups() }, index: -1 }]
  rows.forEach(({ group, index }) => {
    if (index < 0 && !group.colours.length) return
    const section = document.createElement('section')
    section.className = 'gradient-addon-group'
    const heading = document.createElement('div')
    heading.className = 'gradient-addon-group-heading'
    const name = document.createElement('span')
    name.textContent = group.name
    heading.appendChild(name)
    if (index >= 0) {
      heading.appendChild(gradientAddonGroupButton('↑', 'Move group up', () => {
        if (index < 1) return
        const item = gradientAddonGroups.items.splice(index, 1)[0]
        gradientAddonGroups.items.splice(index - 1, 0, item)
        gradientAddonSaveGroups(); gradientAddonRenderGroups()
      }))
      heading.appendChild(gradientAddonGroupButton('↓', 'Move group down', () => {
        if (index >= gradientAddonGroups.items.length - 1) return
        const item = gradientAddonGroups.items.splice(index, 1)[0]
        gradientAddonGroups.items.splice(index + 1, 0, item)
        gradientAddonSaveGroups(); gradientAddonRenderGroups()
      }))
      heading.appendChild(gradientAddonGroupButton('✎', 'Rename group', () => {
        new Dialog({ id: 'gradient_addon_rename_group', title: 'Rename Palette Group',
          form: { name: { label: 'Name', type: 'text', value: group.name } },
          onConfirm(result) {
            const value = String(result.name || '').trim()
            if (!value) return
            group.name = value; gradientAddonSaveGroups(); gradientAddonRenderGroups()
          }
        }).show()
      }))
      heading.appendChild(gradientAddonGroupButton('×', 'Remove group; keep its colours', () => {
        gradientAddonGroups.items.splice(index, 1)
        gradientAddonSaveGroups(); gradientAddonRenderGroups()
      }))
    }
    section.appendChild(heading)
    const colours = document.createElement('div')
    colours.className = 'gradient-addon-group-colours'
    group.colours.forEach(colour => {
      const swatch = document.createElement('div')
      swatch.className = 'gradient-addon-group-swatch'
      swatch.style.backgroundColor = colour
      swatch.title = colour
      swatch.tabIndex = 0
      swatch.setAttribute('role', 'button')
      swatch.setAttribute('aria-label', colour)
      const choose = event => {
        const paletteIndex = ColorPanel.palette.indexOf(colour)
        if (gradientAddonPaletteSelection.active && paletteIndex >= 0) gradientAddonChoosePaletteIndex(paletteIndex, event)
        else if (gradientAddonPaletteEdit.active && paletteIndex >= 0) gradientAddonPaletteEditSelect(paletteIndex)
        else ColorPanel.set(colour)
      }
      swatch.addEventListener('click', choose)
      swatch.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(event) }
      })
      swatch.addEventListener('contextmenu', event => {
        event.preventDefault(); ColorPanel.set(colour, true)
      })
      swatch.dataset.gradientAddonColour = colour
      colours.appendChild(swatch)
    })
    section.appendChild(colours)
    view.appendChild(section)
  })
  list.style.display = 'none'
  gradientAddonRefreshGroupedState()
}

function gradientAddonRefreshGroupedState() {
  const view = document.getElementById('gradient-addon-grouped-palette')
  if (!view) return
  view.querySelectorAll('.gradient-addon-group-swatch').forEach(swatch => {
    const index = ColorPanel.palette.indexOf(swatch.dataset.gradientAddonColour)
    swatch.dataset.gradientAddonSelected = gradientAddonPaletteSelection.active &&
      gradientAddonPaletteSelection.indexes.has(index) ? 'true' : 'false'
    swatch.dataset.gradientAddonEditing = gradientAddonPaletteEdit.active &&
      gradientAddonPaletteEdit.index === index ? 'true' : 'false'
  })
}

function gradientAddonShowGroups() {
  gradientAddonGroups.visible = true
  gradientAddonRenderGroups()
  const list = document.getElementById('palette_list')
  if (list && !gradientAddonGroups.observer && typeof MutationObserver !== 'undefined') {
    gradientAddonGroups.observer = new MutationObserver(() => gradientAddonRenderGroups())
    gradientAddonGroups.observer.observe(list, { childList: true })
  }
}

function gradientAddonHideGroups() {
  gradientAddonGroups.visible = false
  const list = document.getElementById('palette_list')
  if (list) list.style.display = ''
  document.getElementById('gradient-addon-grouped-palette')?.remove()
}

function gradientAddonToggleGroups() {
  gradientAddonTogglePaletteSelection()
}

function gradientAddonPaletteSignature() {
  return ColorPanel.palette.join('\u001f')
}

function gradientAddonAddOuterShades(points, firstColour, lastColour, data) {
  if (points.length < 2) return { points }
  const first = tinycolor(firstColour).toHsl()
  const last = tinycolor(lastColour).toHsl()
  points[0] = { ...first, hex: tinycolor(firstColour).toHexString() }
  points[points.length - 1] = { ...last, hex: tinycolor(lastColour).toHexString() }
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
  const darker = shades(dark, data.darkerShades, dark.l * (1 - data.darkReach / 100), data.darkSaturation, data.darkHueShift)
  const lighter = shades(light, data.lighterShades, light.l + (1 - light.l) * data.lightReach / 100, data.lightSaturation, data.lightHueShift)
  return { points: darkerIsFirst
    ? [...darker.reverse(), ...points, ...lighter]
    : [...lighter.reverse(), ...points, ...darker] }
}

function gradientAddonPaletteBar() {
  const list = document.getElementById('palette_list')
  if (!list) return null
  let bar = document.getElementById('gradient-addon-palette-controls')
  if (!bar) {
    bar = document.createElement('div')
    bar.id = 'gradient-addon-palette-controls'
    bar.innerHTML = '<span class="gradient-addon-palette-count">0 selected</span><button type="button" class="gradient-addon-palette-group" disabled>Group selected</button><button type="button" class="gradient-addon-palette-delete" disabled>Delete selected</button><button type="button" class="gradient-addon-palette-cancel">Cancel</button>'
    list.parentElement.insertBefore(bar, document.getElementById('gradient-addon-grouped-palette') || list)
    bar.querySelector('.gradient-addon-palette-delete').addEventListener('click', gradientAddonDeleteSelectedColours)
    bar.querySelector('.gradient-addon-palette-group').addEventListener('click', gradientAddonGroupSelected)
    bar.querySelector('.gradient-addon-palette-cancel').addEventListener('click', gradientAddonStopPaletteSelection)
  }
  return bar
}

function gradientAddonRefreshPaletteSelection() {
  if (!gradientAddonPaletteSelection.active) return
  const list = document.getElementById('palette_list')
  const bar = gradientAddonPaletteBar()
  if (!list || !bar) return
  list.classList.add('gradient-addon-selecting')
  Array.from(list.children).forEach((swatch, index) => {
    swatch.dataset.gradientAddonSelected = gradientAddonPaletteSelection.indexes.has(index) ? 'true' : 'false'
    swatch.tabIndex = 0
    swatch.setAttribute('aria-selected', swatch.dataset.gradientAddonSelected)
  })
  const count = gradientAddonPaletteSelection.indexes.size
  bar.querySelector('.gradient-addon-palette-count').textContent = `${count} selected`
  bar.querySelector('.gradient-addon-palette-delete').disabled = count === 0
  bar.querySelector('.gradient-addon-palette-group').disabled = count === 0
  gradientAddonRefreshGroupedState()
}

function gradientAddonGroupSelected() {
  if (!gradientAddonPaletteSelection.indexes.size) return
  if (gradientAddonPaletteSignature() !== gradientAddonPaletteSelection.signature) {
    Blockbench.showQuickMessage('Palette changed; select colours again')
    gradientAddonPaletteSelection.indexes.clear()
    gradientAddonRefreshPaletteSelection()
    return
  }
  const colours = [...gradientAddonPaletteSelection.indexes].sort((a, b) => a - b)
    .map(index => ColorPanel.palette[index]).filter(Boolean)
  new Dialog({ id: 'gradient_addon_create_group', title: 'Group Palette Colours',
    form: { name: { label: 'Group name', type: 'text', value: `Group ${gradientAddonGroups.items.length + 1}` } },
    onConfirm(result) {
      const name = String(result.name || '').trim()
      if (!name) return
      if (gradientAddonPaletteSignature() !== gradientAddonPaletteSelection.signature) {
        Blockbench.showQuickMessage('Palette changed; select colours again')
        return
      }
      gradientAddonStopPaletteSelection()
      gradientAddonCreateGroup(name, colours)
    }
  }).show()
}

function gradientAddonStopPaletteSelection() {
  gradientAddonPaletteSelection.active = false
  gradientAddonPaletteSelection.indexes.clear()
  gradientAddonPaletteSelection.anchor = -1
  gradientAddonPaletteSelection.signature = ''
  if (typeof document.getElementById !== 'function') return
  const list = document.getElementById('palette_list')
  if (list) {
    list.classList.remove('gradient-addon-selecting')
    Array.from(list.children).forEach(swatch => {
      delete swatch.dataset.gradientAddonSelected
      swatch.removeAttribute('aria-selected')
      swatch.removeAttribute('tabindex')
    })
  }
  document.getElementById('gradient-addon-palette-controls')?.remove()
  gradientAddonRefreshGroupedState()
}

function gradientAddonDeleteIndexes(palette, indexes) {
  Array.from(indexes).sort((a, b) => b - a).forEach(index => {
    if (index >= 0 && index < palette.length) palette.splice(index, 1)
  })
}

function gradientAddonDeleteSelectedColours() {
  if (StateMemory.color_palette_locked) {
    Blockbench.showQuickMessage('Palette is locked')
    return
  }
  if (gradientAddonPaletteSignature() !== gradientAddonPaletteSelection.signature) {
    gradientAddonPaletteSelection.indexes.clear()
    gradientAddonPaletteSelection.signature = gradientAddonPaletteSignature()
    gradientAddonRefreshPaletteSelection()
    Blockbench.showQuickMessage('Palette changed; select colours again')
    return
  }
  if (!gradientAddonPaletteSelection.indexes.size) return
  gradientAddonDeleteIndexes(ColorPanel.palette, gradientAddonPaletteSelection.indexes)
  ColorPanel.saveLocalStorages()
  gradientAddonReconcileGroups()
  gradientAddonGroups.items = gradientAddonGroups.items.filter(group => group.colours.length)
  gradientAddonSaveGroups()
  gradientAddonStopPaletteSelection()
}

function gradientAddonTogglePaletteSelection() {
  if (gradientAddonPaletteSelection.active) {
    gradientAddonStopPaletteSelection()
  } else {
    gradientAddonStopPaletteEdit()
    if (StateMemory.color_palette_locked) {
      Blockbench.showQuickMessage('Palette is locked')
      return
    }
    if (!document.getElementById('palette_list')) {
      Blockbench.showQuickMessage('Open the palette panel to select colours')
      return
    }
    gradientAddonPaletteSelection.active = true
    gradientAddonPaletteSelection.signature = gradientAddonPaletteSignature()
    gradientAddonRefreshPaletteSelection()
  }
}

function gradientAddonPaletteEditBar() {
  const list = document.getElementById('palette_list')
  if (!list) return null
  let bar = document.getElementById('gradient-addon-palette-edit-controls')
  if (!bar) {
    bar = document.createElement('div')
    bar.id = 'gradient-addon-palette-edit-controls'
    bar.innerHTML = '<span class="gradient-addon-edit-hint">Click a palette colour</span><input class="gradient-addon-edit-colour" type="color" aria-label="Choose replacement colour"><input class="gradient-addon-edit-hex" type="text" aria-label="Replacement HEX colour" spellcheck="false" maxlength="9"><button type="button" class="gradient-addon-edit-pick" title="Pick from model texture" aria-label="Pick replacement colour from model texture"><i class="material-icons">colorize</i></button><button type="button" class="gradient-addon-edit-save">Replace</button><button type="button" class="gradient-addon-edit-cancel">Cancel</button>'
    list.parentElement.insertBefore(bar, document.getElementById('gradient-addon-grouped-palette') || list)
    const colourInput = bar.querySelector('.gradient-addon-edit-colour')
    const hexInput = bar.querySelector('.gradient-addon-edit-hex')
    colourInput.addEventListener('input', () => { hexInput.value = colourInput.value })
    hexInput.addEventListener('input', () => {
      const hex = gradientAddonPaletteHex(hexInput.value)
      if (hex) colourInput.value = hex.slice(0, 7)
    })
    bar.querySelector('.gradient-addon-edit-pick').addEventListener('click', gradientAddonPaletteEditStartPick)
    bar.querySelector('.gradient-addon-edit-save').addEventListener('click', gradientAddonPaletteReplaceColour)
    bar.querySelector('.gradient-addon-edit-cancel').addEventListener('click', gradientAddonStopPaletteEdit)
  }
  return bar
}

function gradientAddonPaletteHex(value) {
  const hex = String(value || '').trim().replace(/^#/, '')
  return /^(?:[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex) ? '#' + hex.toLowerCase() : null
}

function gradientAddonPaletteEditRefresh() {
  const list = document.getElementById('palette_list')
  if (!list) return
  list.classList.toggle('gradient-addon-editing', gradientAddonPaletteEdit.active)
  Array.from(list.children).forEach((swatch, index) => {
    swatch.dataset.gradientAddonEditing = index === gradientAddonPaletteEdit.index ? 'true' : 'false'
  })
  const bar = gradientAddonPaletteEditBar()
  if (!bar) return
  const selected = gradientAddonPaletteEdit.index >= 0
  bar.querySelector('.gradient-addon-edit-hint').textContent = selected
    ? `Colour ${gradientAddonPaletteEdit.index + 1}` : 'Click a palette colour'
  bar.querySelectorAll('input, button.gradient-addon-edit-pick, button.gradient-addon-edit-save').forEach(control => {
    control.disabled = !selected
  })
  gradientAddonRefreshGroupedState()
}

function gradientAddonPaletteEditSelect(index) {
  if (index < 0 || index >= ColorPanel.palette.length) return
  gradientAddonPaletteEdit.index = index
  gradientAddonPaletteEdit.signature = gradientAddonPaletteSignature()
  const bar = gradientAddonPaletteEditBar()
  const hex = gradientAddonPaletteHex(ColorPanel.palette[index]) || '#000000'
  bar.querySelector('.gradient-addon-edit-hex').value = hex
  bar.querySelector('.gradient-addon-edit-colour').value = hex.slice(0, 7)
  gradientAddonPaletteEditRefresh()
}

function gradientAddonStopPaletteEditPick() {
  const picker = gradientAddonPaletteEdit.picker
  if (!picker) return
  document.removeEventListener('keydown', picker.onKeyDown, true)
  if (Painter.colorPicker === picker.wrappedPicker) Painter.colorPicker = picker.originalPicker
  gradientAddonPaletteEdit.picker = null
  if (Toolbox.selected === BarItems.color_picker) picker.previousTool?.select?.()
}

function gradientAddonStopPaletteEdit() {
  gradientAddonStopPaletteEditPick()
  gradientAddonPaletteEdit.active = false
  gradientAddonPaletteEdit.index = -1
  gradientAddonPaletteEdit.signature = ''
  const list = document.getElementById('palette_list')
  if (list) {
    list.classList.remove('gradient-addon-editing')
    Array.from(list.children).forEach(swatch => { delete swatch.dataset.gradientAddonEditing })
  }
  document.getElementById('gradient-addon-palette-edit-controls')?.remove()
  gradientAddonRefreshGroupedState()
}

function gradientAddonTogglePaletteEdit() {
  if (gradientAddonPaletteEdit.active) { gradientAddonStopPaletteEdit(); return }
  if (StateMemory.color_palette_locked) {
    Blockbench.showQuickMessage('Palette is locked')
    return
  }
  if (!document.getElementById('palette_list')) {
    Blockbench.showQuickMessage('Open the palette panel to edit colours')
    return
  }
  gradientAddonStopPaletteSelection()
  gradientAddonPaletteEdit.active = true
  gradientAddonPaletteEditRefresh()
  Blockbench.showQuickMessage('Click a palette colour to edit it')
}

function gradientAddonPaletteReplaceColour() {
  if (!gradientAddonPaletteEdit.active || gradientAddonPaletteEdit.index < 0) return
  if (StateMemory.color_palette_locked) { Blockbench.showQuickMessage('Palette is locked'); return }
  if (gradientAddonPaletteSignature() !== gradientAddonPaletteEdit.signature) {
    gradientAddonStopPaletteEdit()
    Blockbench.showQuickMessage('Palette changed; select the colour again')
    return
  }
  const bar = gradientAddonPaletteEditBar()
  const hex = gradientAddonPaletteHex(bar.querySelector('.gradient-addon-edit-hex').value)
  if (!hex) { Blockbench.showQuickMessage('Enter a 6- or 8-digit HEX colour'); return }
  const previous = ColorPanel.palette[gradientAddonPaletteEdit.index]
  ColorPanel.palette.splice(gradientAddonPaletteEdit.index, 1, hex)
  for (const group of gradientAddonGroups.items) {
    const position = group.colours.indexOf(previous)
    if (position >= 0) group.colours[position] = hex
  }
  gradientAddonReconcileGroups()
  gradientAddonSaveGroups()
  ColorPanel.saveLocalStorages()
  gradientAddonStopPaletteEdit()
  Blockbench.showQuickMessage('Palette colour replaced')
}

function gradientAddonPaletteSwatch(event) {
  if (!gradientAddonPaletteSelection.active && !gradientAddonPaletteEdit.active) return null
  return event.target.closest?.('#palette_list li.color') || null
}

function gradientAddonPalettePointerDown(event) {
  if (gradientAddonPaletteSwatch(event)) event.stopImmediatePropagation()
}

function gradientAddonPaletteClick(event) {
  const swatch = gradientAddonPaletteSwatch(event)
  if (!swatch) return
  event.preventDefault()
  event.stopImmediatePropagation()
  const index = Array.prototype.indexOf.call(swatch.parentElement.children, swatch)
  gradientAddonChoosePaletteIndex(index, event)
}

function gradientAddonChoosePaletteIndex(index, event) {
  if (gradientAddonPaletteEdit.active) {
    gradientAddonPaletteEditSelect(index)
    return
  }
  if (gradientAddonPaletteSignature() !== gradientAddonPaletteSelection.signature) {
    gradientAddonPaletteSelection.indexes.clear()
    gradientAddonPaletteSelection.anchor = -1
    gradientAddonPaletteSelection.signature = gradientAddonPaletteSignature()
  }
  if (event.shiftKey && gradientAddonPaletteSelection.anchor >= 0) {
    const low = Math.min(index, gradientAddonPaletteSelection.anchor)
    const high = Math.max(index, gradientAddonPaletteSelection.anchor)
    for (let i = low; i <= high; i++) gradientAddonPaletteSelection.indexes.add(i)
  } else if (gradientAddonPaletteSelection.indexes.has(index)) {
    gradientAddonPaletteSelection.indexes.delete(index)
  } else {
    gradientAddonPaletteSelection.indexes.add(index)
  }
  gradientAddonPaletteSelection.anchor = index
  gradientAddonRefreshPaletteSelection()
}

function gradientAddonPaletteKeyDown(event) {
  if (!gradientAddonPaletteSelection.active && !gradientAddonPaletteEdit.active) return
  const swatch = gradientAddonPaletteSwatch(event)
  if (!swatch) return
  if (event.key === 'Enter' || event.key === ' ') gradientAddonPaletteClick(event)
  else if (gradientAddonPaletteSelection.active && (event.key === 'Delete' || event.key === 'Backspace')) {
    event.preventDefault()
    event.stopImmediatePropagation()
    gradientAddonDeleteSelectedColours()
  }
}

function gradientAddonTextureColour(texture, x, y) {
  let colour
  if (settings.pick_combined_color.value === false && texture.getActiveLayer()) {
    const layer = texture.getActiveLayer()
    colour = Painter.getPixelColor(texture.getActiveCanvas().ctx, x - layer.offset[0], y - layer.offset[1])
  }
  if (!colour || colour.toHex8() === '00000000') colour = Painter.getPixelColor(texture.ctx, x, y)
  return colour && colour.getAlpha() > 0 ? colour.toHexString() : null
}

function gradientAddonPaletteEditStartPick() {
  if (!gradientAddonPaletteEdit.active || gradientAddonPaletteEdit.index < 0) return
  if (!BarItems.color_picker?.select || !Painter?.colorPicker) {
    Blockbench.showQuickMessage('Model colour picker is unavailable')
    return
  }
  gradientAddonStopPaletteEditPick()
  const previousTool = Toolbox.selected
  const originalPicker = Painter.colorPicker
  const onKeyDown = event => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopImmediatePropagation()
    gradientAddonStopPaletteEditPick()
  }
  const wrappedPicker = (texture, x, y, event) => {
    if (event?.button === 2) return
    const hex = gradientAddonTextureColour(texture, x, y)
    if (!hex) return
    gradientAddonStopPaletteEditPick()
    const bar = document.getElementById('gradient-addon-palette-edit-controls')
    if (!bar || !gradientAddonPaletteEdit.active) return
    bar.querySelector('.gradient-addon-edit-hex').value = hex
    bar.querySelector('.gradient-addon-edit-colour').value = hex.slice(0, 7)
    Blockbench.showQuickMessage('Colour picked; press Replace to apply')
  }
  gradientAddonPaletteEdit.picker = { previousTool, originalPicker, wrappedPicker, onKeyDown }
  Painter.colorPicker = wrappedPicker
  document.addEventListener('keydown', onKeyDown, true)
  BarItems.color_picker.select()
  Blockbench.showQuickMessage('Click the model to pick a texture colour · Esc to cancel', 2500)
}

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
    const hex = gradientAddonTextureColour(texture, x, y)
    if (hex) setTimeout(() => gradientAddonStopPick(hex), 0)
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
    mounted: component.mounted,
    beforeDestroy: component.beforeDestroy,
    onOpen: dialog.onOpen,
    onConfirm: dialog.onConfirm,
    linesLength: dialog.lines.length
  }
  gradientAddonDialogs.set(dialog, old)
  const saved = JSON.parse(localStorage.getItem(gradientAddonId) || '{}')
  for (const key of Object.keys(gradientAddonDefaults)) {
    Vue.set(component.data.data, key, saved[key] ?? gradientAddonDefaults[key])
  }
  Vue.set(component.data.data, 'groupGenerated', saved.groupGenerated ?? false)
  Vue.set(component.data, 'copiedIndex', -1)
  Vue.set(component.data, 'copyTimeout', null)
  Vue.set(component.data, 'colour3', '#ffffff')
  const originalSave = old.methods.save
  component.methods.save = function() {
    originalSave.call(this)
    const values = Object.fromEntries(Object.keys(gradientAddonDefaults).map(key => [key, this.data[key]]))
    values.groupGenerated = this.data.groupGenerated
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
    return gradientAddonAddOuterShades(result.points, this.colour, this.colour2, this.data)
  }
  component.methods.tripleResult = function() {
    const N = Math.max(3, Math.floor(this.data.steps))
    const middleIndex = Math.clamp(Math.round((N - 1) * this.data.middlePosition / 100), 1, N - 2)
    const first = old.methods.doubleResult.call({
      data: { ...this.data, steps: middleIndex + 1 }, colour: this.colour, colour2: this.colour2
    }).points
    const second = old.methods.doubleResult.call({
      data: { ...this.data, steps: N - middleIndex }, colour: this.colour2, colour2: this.colour3
    }).points
    const middle = tinycolor(this.colour2).toHsl()
    first[first.length - 1] = { ...middle, hex: tinycolor(this.colour2).toHexString() }
    const joined = [...first, ...second.slice(1)]
    const result = gradientAddonAddOuterShades(joined, this.colour, this.colour3, this.data)
    result.middleHex = tinycolor(this.colour2).toHexString()
    return result
  }
  component.computed.sliders = function() {
    if (this.data.colourMode === 'single') return old.computed.sliders.call(this)
    // Do not spread the Vue instance: reading its computed properties here would recurse into sliders.
    const sliders = old.computed.sliders.call({ data: { ...this.data, colourMode: 'double' } })
    return [...sliders,
      ...(this.data.colourMode === 'triple' ? [{
        key: 'middlePosition', title: 'Middle Position',
        desc: 'Where the middle chosen colour sits in the gradient', min: 10, max: 90,
        disabled: this.data.steps <= 3
      }] : [])]
  }
  component.computed.result = function() {
    if (this.data.colourMode !== 'triple') return old.computed.result.call(this)
    const { points, middleHex } = this.tripleResult()
    this.save()
    return {
      colours: [...new Set(points.map(point => point.hex))],
      primaryHex: middleHex, points,
      anchors: [this.colour, this.colour2, this.colour3].map(colour => tinycolor(colour).toHexString())
    }
  }
  component.computed.extensionSliders = function() {
    return [
      { key: 'darkerShades', title: 'Darker Shades', desc: 'Colours beyond the dark end', min: 0, max: 16 },
      { key: 'lighterShades', title: 'Lighter Shades', desc: 'Colours beyond the light end', min: 0, max: 16 },
      { key: 'darkReach', title: 'Dark Reach', desc: 'How far toward black', min: 1, max: 100, disabled: !this.data.darkerShades },
      { key: 'lightReach', title: 'Light Reach', desc: 'How far toward white', min: 1, max: 100, disabled: !this.data.lighterShades },
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
  component.mounted = function() {
    old.mounted.call(this)
    const setColour = colour => { this.colour3 = colour.toHexString() }
    $(this.$refs.colour3).spectrum({
      preferredFormat: 'hex', color: this.colour3, showAlpha: false, showInput: true,
      move: setColour, change: setColour, hide: setColour
    })
  }
  component.watch.result = function() {
    this.copiedIndex = -1
    this.queueDraw()
  }
  component.watch.colour3 = function(value) { this.syncPicker('colour3', value) }
  component.beforeDestroy = function() {
    clearTimeout(this.copyTimeout)
    old.beforeDestroy?.call(this)
  }
  dialog.onOpen = function() {
    if (this._gradientAddonReopening) this._gradientAddonReopening = false
    else old.onOpen?.call(this)
  }
  dialog.onConfirm = function(...args) {
    const createGroup = this.content_vue.data.groupGenerated
    const colours = createGroup ? this.content_vue.result.colours.slice() : []
    old.onConfirm.apply(this, args)
    if (createGroup && colours.length) {
      gradientAddonCreateGroup(`Gradient ${gradientAddonGroups.items.length + 1}`, colours)
    }
  }
  let template = component.template.replace(resetClick, '@click="resetSlider(s.key)"')
  template = template.replace("{ single: 'Single Colour', double: 'Two Colours' }", "{ single: 'Single Colour', double: 'Two Colours', triple: 'Three Colours' }")
  template = template.replace("{{ data.colourMode === 'double' ? 'Colours' : 'Colour' }}", "{{ data.colourMode === 'single' ? 'Colour' : 'Colours' }}")
  template = template.replace(firstPicker, '<div class="gradient-addon-picker-column"><label v-if="data.colourMode === \'triple\'" class="gradient-addon-anchor-label">Dark</label><div class="gradient-addon-colour-row"><input ref="colour" /><button type="button" class="gradient-addon-picker" title="Pick from model texture" aria-label="Pick first colour from model texture" @click="pickFromModel(\'colour\')"><i class="material-icons">colorize</i></button></div></div>')
  template = template.replace(secondPicker, '<div v-show="data.colourMode === \'double\' || data.colourMode === \'triple\'" class="gradient-addon-picker-column"><label v-if="data.colourMode === \'triple\'" class="gradient-addon-anchor-label">Middle</label><div class="gradient-addon-colour-row"><input ref="colour2" /><button type="button" class="gradient-addon-picker" title="Pick from model texture" aria-label="Pick second colour from model texture" @click="pickFromModel(\'colour2\')"><i class="material-icons">colorize</i></button></div></div><div v-show="data.colourMode === \'triple\'" class="gradient-addon-picker-column"><label class="gradient-addon-anchor-label">Light</label><div class="gradient-addon-colour-row"><input ref="colour3" /><button type="button" class="gradient-addon-picker" title="Pick from model texture" aria-label="Pick third colour from model texture" @click="pickFromModel(\'colour3\')"><i class="material-icons">colorize</i></button></div></div>')
  template = template.replace('<div class="checkbox-bar" ref="checkboxBar">', '<div class="checkbox-bar" ref="checkboxBar"><label class="checkbox-row" title="Put generated colours in their own palette group"><input type="checkbox" v-model="data.groupGenerated" @input="save"><div>Separate group</div></label>')
  template = template.replace('<div v-for="s in sliders" :key="s.key" :class="{ disabled: s.disabled }">', '<div v-for="s in sliders" :key="s.key" :class="{ disabled: s.disabled, \'gradient-addon-middle-position\': s.key === \'middlePosition\' }">')
  const tab = '            <div class="tab_bar">'
  const tabIndex = template.lastIndexOf(tab)
  if (tabIndex >= 0) template = template.slice(0, tabIndex) + `
            <h2 v-if="data.colourMode === 'double' || data.colourMode === 'triple'" class="gradient-addon-section-title">Extra shades</h2>
            <div v-if="data.colourMode === 'double' || data.colourMode === 'triple'" class="gradient-addon-tuning">
              <div v-for="s in extensionSliders" :key="s.key" :class="{ disabled: s.disabled }">
                <div class="header-bar"><h2>{{ s.title }}</h2><i title="Reset" class="material-icons" @click="resetSlider(s.key)">replay</i></div>
                <p v-if="s.desc">{{ s.desc }}</p>
                <div class="bar slider_input_combo">
                  <input type="range" class="tool disp_range" v-model.number="data[s.key]" :min="s.min" :max="s.max" step="1" />
                  <numeric-input class="tool disp_text" v-model.number="data[s.key]" :min="s.min" :max="s.max" :step="1" />
                </div>
              </div>
            </div>
` + template.slice(tabIndex)
  template = template.replace(swatch,
    '<div v-for="(col, index) in result.colours" :key="index" role="button" tabindex="0" :aria-label="\'Copy HEX \' + col.toUpperCase()" :title="\'Copy \' + col.toUpperCase()" :class="{ primary: col === result.primaryHex, \'light-marker\': col === result.primaryHex && markerLight, \'gradient-addon-anchor\': result.anchors && result.anchors.includes(col), copied: copiedIndex === index }" :style="{ backgroundColor: col }" @click="copyShade(col, index)" @keydown.enter.prevent="copyShade(col, index)" @keydown.space.prevent="copyShade(col, index)"><span v-if="copiedIndex === index" class="gradient-addon-feedback">HEX copied</span></div>')
  component.template = template
  dialog.lines.push(`<style>
    #colour_gradient_generator .gradient-addon-picker-column { min-width:0; flex:1; }
    #colour_gradient_generator .checkbox-bar { flex-wrap:wrap; gap:7px 14px; }
    #colour_gradient_generator .gradient-addon-anchor-label { display:block; font-size:12px; color:var(--color-subtle_text); margin-bottom:3px; }
    #colour_gradient_generator .gradient-addon-colour-row { display:flex; align-items:center; gap:6px; min-width:0; }
    #colour_gradient_generator .gradient-addon-colour-row .sp-replacer { flex:1; min-width:0; }
    #colour_gradient_generator .gradient-addon-picker { box-sizing:border-box; width:52px !important; min-width:0 !important; max-width:52px !important; height:32px; flex:0 0 52px; padding:0; display:grid; place-items:center; border:1px solid var(--color-border); border-radius:4px; background:var(--color-button); color:var(--color-text); }
    #colour_gradient_generator .gradient-addon-picker .material-icons { font-size:17px; line-height:1; transform:translate(1px, 1px); }
    #colour_gradient_generator .gradient-addon-middle-position { grid-column:1 / -1; }
    #colour_gradient_generator .gradient-addon-section-title { margin:4px 0 10px; padding-top:12px; border-top:1px solid var(--color-border); }
    #colour_gradient_generator .gradient-addon-tuning { display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; margin:0 0 20px; }
    #colour_gradient_generator .gradient-addon-tuning .header-bar h2 { font-size:.95em; }
    #colour_gradient_generator #colour-gradient-preview, #colour_gradient_generator #colour-gradient-preview .strip { overflow:visible; }
    #colour_gradient_generator #colour-gradient-preview .strip > div { min-width:0; cursor:pointer; transition:transform 160ms ease,filter 160ms ease,box-shadow 160ms ease; }
    #colour_gradient_generator #colour-gradient-preview .strip > div:hover, #colour_gradient_generator #colour-gradient-preview .strip > div:focus-visible { z-index:2; transform:translateY(-2px); filter:brightness(1.08); box-shadow:inset 0 0 0 2px #fff,0 2px 8px #0006; outline:none; }
    #colour_gradient_generator #colour-gradient-preview .strip > div.gradient-addon-anchor:not(.primary)::before { content:''; position:absolute; left:0; right:0; bottom:0; height:3px; background:#fff; }
    #colour_gradient_generator .gradient-addon-feedback { position:absolute; left:50%; bottom:calc(100% + 7px); transform:translateX(-50%); padding:4px 7px; border-radius:4px; background:#192025; color:#fff; font-size:12px; font-weight:600; white-space:nowrap; pointer-events:none; }
  </style>`)
  if (dialog.object) dialog.delete()
}

Plugin.register(gradientAddonId, {
  title: 'Colour Gradient Generator Add-on',
  icon: 'icon.png',
  author: 'Hlamingo',
  description: 'Adds three-colour gradients, shade controls, texture eyedropper, copyable swatches, and palette groups.',
  tags: ['Paint', 'Palette', 'Color'],
  version: '0.4.1',
  min_version: '5.0.0',
  variant: 'both',
  dependencies: ['colour_gradient_generator'],
  onload() {
    gradientAddonLoadGroups()
    gradientAddonShow = Dialog.prototype.show
    gradientAddonShowWrapper = function(...args) {
      gradientAddonExtend(this)
      return gradientAddonShow.apply(this, args)
    }
    Dialog.prototype.show = gradientAddonShowWrapper
    gradientAddonPaletteAction = new Action('gradient_addon_select_palette_colours', {
      name: 'Select Palette Colours',
      description: 'Select several palette colours, then delete them together',
      icon: 'select_all',
      category: 'color',
      condition: { modes: ['paint'] },
      click: gradientAddonTogglePaletteSelection
    })
    Toolbars.palette?.add(gradientAddonPaletteAction)
    gradientAddonPaletteEditAction = new Action('gradient_addon_edit_palette_colour', {
      name: 'Edit Palette Colour',
      description: 'Replace one palette colour with a HEX value or a colour picked from the model texture',
      icon: 'edit',
      category: 'color',
      condition: { modes: ['paint'] },
      click: gradientAddonTogglePaletteEdit
    })
    Toolbars.palette?.add(gradientAddonPaletteEditAction)
    if (gradientAddonGroups.visible) gradientAddonShowGroups()
    document.addEventListener('pointerdown', gradientAddonPalettePointerDown, true)
    document.addEventListener('click', gradientAddonPaletteClick, true)
    document.addEventListener('keydown', gradientAddonPaletteKeyDown, true)
    if (document.head) {
      gradientAddonPaletteStyle = document.createElement('style')
      gradientAddonPaletteStyle.textContent = `
        #gradient-addon-palette-controls { display:flex; align-items:center; gap:5px; padding:4px 2px; font-size:12px; }
        #gradient-addon-palette-controls .gradient-addon-palette-count { flex:1; color:var(--color-text); }
        #gradient-addon-palette-controls button { min-width:0; padding:3px 6px; border:1px solid var(--color-border); border-radius:4px; background:var(--color-button); color:var(--color-text); cursor:pointer; }
        #gradient-addon-palette-controls button:disabled { opacity:.45; cursor:default; }
        #gradient-addon-palette-controls .gradient-addon-palette-delete:not(:disabled) { color:var(--color-accent); }
        #gradient-addon-palette-controls .gradient-addon-palette-group:not(:disabled) { color:var(--color-accent); }
        #gradient-addon-grouped-palette { box-sizing:border-box; width:100%; min-height:160px; padding:4px 2px 12px; overflow:visible; background:var(--color-back); }
        #gradient-addon-grouped-palette .gradient-addon-group { display:block; margin:0 0 12px; padding:0; }
        #gradient-addon-grouped-palette .gradient-addon-group-heading { display:flex; align-items:center; gap:3px; height:19px; margin:0 0 2px; color:var(--color-subtle_text); font-size:11px; line-height:19px; text-transform:uppercase; }
        #gradient-addon-grouped-palette .gradient-addon-group-heading span { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        #gradient-addon-grouped-palette .gradient-addon-group-heading span.gradient-addon-group-control { flex:0 0 16px; width:16px; height:16px; line-height:16px; text-align:center; cursor:pointer; opacity:.65; }
        #gradient-addon-grouped-palette .gradient-addon-group-heading .gradient-addon-group-control:hover,
        #gradient-addon-grouped-palette .gradient-addon-group-heading .gradient-addon-group-control:focus-visible { color:var(--color-text); opacity:1; }
        #gradient-addon-grouped-palette .gradient-addon-group-colours { display:flex; flex-wrap:wrap; align-content:flex-start; gap:0; width:100%; }
        #gradient-addon-grouped-palette .gradient-addon-group-swatch { box-sizing:border-box; display:block; width:25px; min-width:25px; max-width:25px; height:25px; min-height:25px; max-height:25px; flex:0 0 25px; margin:0; padding:0; border:0; border-radius:0; cursor:pointer; }
        #gradient-addon-grouped-palette .gradient-addon-group-swatch:hover, #gradient-addon-grouped-palette .gradient-addon-group-swatch:focus-visible { outline:2px solid var(--color-accent); outline-offset:-2px; }
        #gradient-addon-grouped-palette .gradient-addon-group-swatch[data-gradient-addon-selected="true"],
        #gradient-addon-grouped-palette .gradient-addon-group-swatch[data-gradient-addon-editing="true"] { box-shadow:inset 0 0 0 2px #fff, 0 0 0 3px var(--color-accent); z-index:1; }
        #palette_list.gradient-addon-selecting li.color { cursor:pointer; }
        #palette_list li.color[data-gradient-addon-selected="true"] .color_inner { box-shadow:inset 0 0 0 2px #fff, 0 0 0 3px var(--color-accent); }
        #palette_list.gradient-addon-editing li.color { cursor:pointer; }
        #palette_list.gradient-addon-editing li.color:hover .color_inner { box-shadow:inset 0 0 0 2px #fff; }
        #palette_list li.color[data-gradient-addon-editing="true"] .color_inner { box-shadow:inset 0 0 0 2px #fff, 0 0 0 3px var(--color-accent); }
        #gradient-addon-palette-edit-controls { display:flex; flex-wrap:wrap; align-items:center; gap:5px; padding:5px 2px; }
        #gradient-addon-palette-edit-controls .gradient-addon-edit-hint { flex:1 1 100%; font-size:12px; }
        #gradient-addon-palette-edit-controls .gradient-addon-edit-colour { width:34px; height:27px; min-width:34px; padding:0; border:0; background:transparent; cursor:pointer; }
        #gradient-addon-palette-edit-controls .gradient-addon-edit-hex { width:94px; min-width:65px; flex:1; padding:3px 5px; }
        #gradient-addon-palette-edit-controls button { min-width:0; padding:3px 6px; border:1px solid var(--color-border); border-radius:4px; background:var(--color-button); color:var(--color-text); cursor:pointer; }
        #gradient-addon-palette-edit-controls button:disabled { opacity:.45; cursor:default; }
        #gradient-addon-palette-edit-controls .gradient-addon-edit-pick { width:29px; height:27px; padding:0; display:grid; place-items:center; }
        #gradient-addon-palette-edit-controls .gradient-addon-edit-pick .material-icons { font-size:16px; line-height:1; }
        #gradient-addon-palette-edit-controls .gradient-addon-edit-save:not(:disabled) { color:var(--color-accent); }
      `
      document.head.appendChild(gradientAddonPaletteStyle)
    }
  },
  onunload() {
    gradientAddonHideGroups()
    gradientAddonGroups.observer?.disconnect()
    gradientAddonGroups.observer = null
    try {
      const originalSettings = JSON.parse(localStorage.getItem('colour_gradient_generator') || '{}')
      if (originalSettings.colourMode === 'triple') {
        originalSettings.colourMode = 'double'
        localStorage.setItem('colour_gradient_generator', JSON.stringify(originalSettings))
      }
    } catch (error) { /* Keep the original plugin's settings if they are invalid. */ }
    gradientAddonStopPaletteEdit()
    gradientAddonStopPaletteSelection()
    document.removeEventListener('pointerdown', gradientAddonPalettePointerDown, true)
    document.removeEventListener('click', gradientAddonPaletteClick, true)
    document.removeEventListener('keydown', gradientAddonPaletteKeyDown, true)
    gradientAddonPaletteAction?.delete()
    gradientAddonPaletteAction = null
    gradientAddonPaletteEditAction?.delete()
    gradientAddonPaletteEditAction = null
    gradientAddonPaletteStyle?.remove()
    gradientAddonPaletteStyle = null
    if (gradientAddonPick) {
      document.removeEventListener('keydown', gradientAddonPick.onKeyDown, true)
      if (Painter.colorPicker === gradientAddonPick.wrappedPicker) Painter.colorPicker = gradientAddonPick.originalPicker
      gradientAddonPick = null
    }
    if (Dialog.prototype.show === gradientAddonShowWrapper) Dialog.prototype.show = gradientAddonShow
    for (const [dialog, old] of gradientAddonDialogs) {
      if (dialog.object) dialog.delete()
      if (dialog.component.data.data.colourMode === 'triple') dialog.component.data.data.colourMode = 'double'
      dialog.component.template = old.template
      dialog.component.data = old.data
      dialog.component.methods = old.methods
      dialog.component.computed = old.computed
      dialog.component.watch = old.watch
      dialog.component.mounted = old.mounted
      dialog.component.beforeDestroy = old.beforeDestroy
      dialog.onOpen = old.onOpen
      dialog.onConfirm = old.onConfirm
      dialog.lines.length = old.linesLength
    }
    gradientAddonDialogs.clear()
  }
})

