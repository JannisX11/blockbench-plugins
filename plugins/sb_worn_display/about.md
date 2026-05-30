# SB Worn Display Editor

Adds a **Custom Slot** row to Blockbench's Display panel so you can edit custom item display keys defined by Forge mods — visually, in the 3D viewport, with the same sliders you use for the vanilla `head` / `gui` / `ground` slots.

Built specifically for these keys, but trivially extensible to any custom key:

| Key | Used by |
|---|---|
| `sophisticatedbackpacks:worn` | Sophisticated Backpacks — backpack worn on Curios "back" slot |
| `the_four_primitives_and_weapons:back` | MAW saya worn on Curios "back" slot |
| `the_four_primitives_and_weapons:belt` | MAW saya worn on Curios "belt" slot |

## Why

Blockbench ships with the 8 vanilla Java display contexts (`thirdperson_*`, `firstperson_*`, `head`, `gui`, `ground`, `fixed`). Custom display contexts defined by Forge mods via `ItemDisplayContext.create(...)` are preserved in the model JSON, but the default UI gives you no way to edit them visually — and worse, **values for unknown keys are silently dropped on save** because the exporter iterates `DisplayMode.slots`.

This plugin:

1. **Registers the custom keys** in `DisplayMode.slots` so values round-trip safely through save / reload.
2. **Adds a "Custom Slot" row** under Reference Model using Blockbench's own native UI markup (`panel_toolbar_label` + `bar tabs_small icon_bar` + `label.tool`) — visually identical in style to the vanilla Slot row.
3. Provides a fallback **numeric Edit dialog** under the Tools menu for typing exact values.

## Usage

1. Open a Java Item Model JSON
2. Switch to **Display** mode
3. In the right panel, find the new **Custom Slot** row under Reference Model
4. Click any of the three icons (backpack / ruler / belt)
5. Adjust rotation, translation, and scale with the standard sliders
6. Ctrl+S to save

The plugin uses `head`'s camera angle and player reference model as a visual proxy. **Scale and rotation translate accurately** to in-game appearance. **Translation values** are pixel-relative offsets from the anchor point set by the mod's renderer (back / belt), which is not the head — so iterate by testing in-game for translation tuning.

## Adding more keys

Source the plugin from its [GitHub repo](https://github.com/hrmcngs/sb-worn-display-blockbench) and edit the `TARGETS` array at the top of `sb_worn_display.js`.

## How it works

The Display panel's Slot row in Blockbench's `DisplayModePanel.vue` is hardcoded (no `v-for` loop), so there is no official extension API. This plugin works around that by injecting a new section into the panel DOM and using a MutationObserver to keep it present after Vue re-renders. Click handlers reuse `DisplayMode.loadHead()` to set up the camera and reference model, then override `DisplayMode.slot` to the custom key.

This approach is inherently fragile — a future Blockbench update that restructures `DisplayModePanel.vue` will break the injected row. The Tools menu Edit dialogs remain as a stable fallback.

## Source

- Repository: <https://github.com/hrmcngs/sb-worn-display-blockbench>
- Issues: <https://github.com/hrmcngs/sb-worn-display-blockbench/issues>
- License: MIT
