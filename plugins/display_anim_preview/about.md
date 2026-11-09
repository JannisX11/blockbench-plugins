# Java Display Animator

Preview and export frame-baked Minecraft Java item animations directly from Blockbench.

## Features

- Uses Blockbench's official timeline for animation preview.
- Enables or disables animation independently for first person, third person, GUI, ground, head,
  and item-frame display contexts.
- Bakes skeletal animation at 20 FPS and deduplicates identical model frames.
- Checks model bounds, untextured faces, missing texture references, and particle textures.
- Generates a complete resource pack with `display_context` and `custom_model_data` routing.
- Generates a datapack that drives the exported animation.

## Usage

1. Create a **Java Display Animation** project and animate its groups.
2. Configure transforms in Blockbench's Display mode.
3. Open the Command Palette and run **Open Display Animation Preview**.
4. Choose which display contexts should animate.
5. Run **Export Resource Pack and Datapack** from the Command Palette.
6. Install the generated packs in Minecraft Java 26.2 and use the commands shown after export.

The interface uses English by default and includes Simplified Chinese translations through
Blockbench's translation API.
