Procedural noise generator and texture compositor for Blockbench.

Create simplex/FBM noise, blend it onto existing textures with a wide range of composite modes, respect transparency, save presets, or export a new texture variant — with live preview and full Undo/Redo support.

## Features

- **Procedural noise** — seed, period, harmonics, spread, gain, exponent, amplitude, offset
- **Coordinate controls** — scale and translate on X / Y / Z
- **Monochrome or RGB** noise
- **Noise Only** mode — pure noise (optional custom size up to 4096²)
- **Respect Alpha** — keep transparent areas empty
- **Composite blend** — Over, Multiply, Screen, Overlay, Dodge/Burn, Light modes, Difference, and many custom ops
- **Blend opacity** and **swap layer order**
- **Presets** — save / load / delete setups
- **Live preview** — zoom buttons, Ctrl + mouse wheel, pan when zoomed
- **Undo / Redo** for both “apply to texture” and “save as new”

## How to use

1. Select a texture (or enable **Noise Only**).
2. Open **Tools → Noise & Composite**.
3. On **Noise Setup**, tweak seed and noise parameters. Use **Random Values** for a quick start.
4. On **Composite Blend**, choose a blend operation and opacity (or leave **None** for noise only).
5. Press **Confirm** to apply to the selected texture, or **Save as New Texture** to create a separate variant.
6. In the preview: **+ / −** to zoom, **Ctrl + scroll** to zoom, drag to pan when zoomed in.

## Tips

- **Noise Only + custom size** is useful for generating standalone noise maps.
- **Respect Alpha** is handy when you only want noise on painted areas of a skin or texture.
- Order-dependent modes change when you enable **Swap Operation Order**.
- Large textures show a confirmation before full-resolution apply; the live preview stays light for smooth sliders.