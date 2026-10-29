# Colour Gradient Generator Add-on

This add-on extends Ewan Howell's **Colour Gradient Generator**. The original plugin is required and is installed as a dependency. The add-on changes its existing gradient dialog; it does not add a second generator command or replace the original plugin file.

## Added controls

- In **Three Colours**, choose exact dark, middle, and light colours. The generator blends across both intervals, keeps all three selected colours, and lets you move the middle colour's position in the gradient. Each colour field has a model-texture eyedropper.
- In **Two Colours**, generate extra shades beyond the darker and lighter chosen colours.
- Adjust the reach, saturation, and hue shift of those extra shades independently.
- Click a preview swatch to copy its HEX colour.
- Use the eyedropper beside either colour field to pick the underlying model texture colour. Viewport shading does not affect the sample. Press **Esc** to cancel.
- In the **Palette** panel, click **Select Palette Colours** to select several swatches. Click individual swatches or Shift-click a range, then press **Delete selected**. Press **Cancel** to leave selection mode. This removes colours from the palette, not from the model texture.
- The selection controls also offer **Group selected**. Its colours are placed together in Blockbench's regular palette, with each group starting on a new row and a small gap between groups. Hover over the first swatch to see the group name.
- In the gradient dialog, enable **Separate group** to keep newly generated colours together. Group names are stored locally in Blockbench; exporting a palette still exports its colours as a flat list.
- Click **Edit Palette Colour** in the Palette toolbar, then choose a swatch. Enter a HEX colour, use the colour picker, or sample a colour from the model texture with the eyedropper. Press **Replace** to update only that palette swatch. Press **Cancel** to leave editing mode.

Open **Paint mode → Generate Gradient Palette** to use it. If a future version of the original plugin changes its dialog structure, this add-on may need an update.

Original plugin by Ewan Howell; add-on by Hlamingo.

