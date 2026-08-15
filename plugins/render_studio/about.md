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
- Phone / Low PC and PC performance profiles
- Reliable area-light fallback plus independent ambient and hemisphere controls
- Touch-friendly mobile panels and a lighter 15 FPS phone preview with shadows disabled
- 360-degree turntable PNG sequences packaged as ZIP files
- User-created render presets and automatic camera framing
- Outline, bloom, vignette, contrast, saturation, and depth-of-field output effects
- Beauty, transparent, shadow, normal, and depth render layers
- Local background images with blur and brightness controls
- Direct touch/mouse light dragging and two-finger mobile zoom
- GLB scene export with the Render Studio camera and lights
- A recent-render gallery (five on phones, ten on PC)
- Automatic device profiling and Turkish/English UI selection
- Camera/light Undo and Redo plus searchable Render Tools
- Side-by-side or slider render comparison
- Shareable JSON presets and sequential render queues
- Text/image watermarks and copyable WebGL device reports

## Getting started

1. Open a model in Blockbench.
2. Select the **Render** mode at the right side of the mode tabs.
3. Add or choose a light in **Render Scene**.
4. Choose **Phone / Low PC** or **PC** under Performance.
5. Adjust materials, camera, environment, and output settings in **Render Properties**.
6. Open **Render Tools** for turntables, custom presets, effects, layers, backgrounds, GLB export, and history.
7. Choose **Render Image** and save the PNG from the result window.

Render Studio uses an isolated render scene, so its materials, lights, camera, and helpers do not alter the normal Blockbench editing viewport.

Made by **shady**.
