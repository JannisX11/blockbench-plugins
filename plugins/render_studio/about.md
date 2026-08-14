# Render Studio

Render Studio adds a dedicated **Render** workspace to Blockbench with real-time Three.js lighting and high-resolution PNG output.

## Features

- Point, spot, directional, and rectangular area lights
- Real-time shadows, a ground plane, and a shadow catcher
- Minecraft, flat, smooth, and PBR material modes
- Perspective and orthographic render cameras
- ACES Filmic, Linear, Reinhard, Cineon, and untonemapped output
- Transparent, solid-color, and gradient backgrounds
- Tiled rendering for images larger than the GPU canvas limit
- Project-safe light settings that remain available when switching modes

## Getting started

1. Open a model in Blockbench.
2. Select the **Render** mode at the right side of the mode tabs.
3. Add or choose a light in **Render Scene**.
4. Adjust materials, camera, environment, and output settings in **Render Properties**.
5. Choose **Render Image** and save the PNG from the result window.

Render Studio uses an isolated render scene, so its materials, lights, camera, and helpers do not alter the normal Blockbench editing viewport.

Made by **shady**.
