**AnimCue Studio** lets you author multi-actor interactive Minecraft animations for the [AnimCue](https://github.com/kltyton/AnimCue) runtime directly on one Blockbench timeline, then export everything to a single `.animation.json`.

### Key Features

- **Multi-Actor Scene Format (`animcue_scene`)**: Animate a primary model alongside up to 64 actors in one scene. Single-texture projects automatically open a multi-texture copy so every actor keeps its own texture and UV layout.
- **Flexible Actor Import**:
  - Local `.bbmodel` or Bedrock `.geo.json` (with optional `.png` texture).
  - Built-in **PAL Bend Player** and **PAL DragonCore Player** rigs when paired with **PAL Bend Player Tools** (`0.4.2+`).
  - **Vanilla Entity** templates with vanilla skins loaded automatically.
- **PAL / MoreRotation Bend Support**: Detects standard PAL and DragonCore rigs, exports strict 3-axis `[x, y, z]` `bend` vectors, and supports importing PAL, Emotecraft (`.emote`), DragonCore, or Bedrock animations onto individual actors. Basic `*_bend` export also works standalone.
- **Scene Camera & Event Markers**: Add a non-exported scene camera (`kltyton:interactions.<anim>.camera`), preview through it at any frame (`Look Through Camera`), and insert `timeline` event markers.
- **Round-Trip Import & Export**: Export selected or all animations to `.animation.json`, and import existing AnimCue `.animation.json` files back into the scene.
- **Desktop & Web, Multi-Language**: Works on Blockbench Desktop and Web (`5.0.0+`), with automatic English / Simplified Chinese / Traditional Chinese UI.

### Documentation

- [English Wiki](https://github.com/kltyton/AnimCue-Studio/wiki) · [中文 Wiki](https://github.com/kltyton/AnimCue-Studio/wiki/Home-zh)
- [Source Repository](https://github.com/kltyton/AnimCue-Studio) · [中文说明](https://github.com/kltyton/AnimCue-Studio/blob/main/README_zh.md)
