# Easy Model Entities Exporter

> **Beta:** This is an early release to gather feedback. Some settings, file formats and the export
> output may still change before the final version. Please report problems and ideas on the
> [issue tracker](https://github.com/MarkusBordihn/BOs-Easy-Model-Entities/issues).

Export the current Blockbench project for the
[Easy Model Entities](https://github.com/MarkusBordihn/BOs-Easy-Model-Entities) mod on
**Minecraft: Java Edition**.

This plugin only generates the pack files. The **Easy Model Entities mod (Forge or Fabric) must be
installed** in Minecraft for them to work. Without the mod the generated files do nothing.

## How to use

1. Open or create your model in Blockbench using the **Easy Model Entity** format
   (File > New > Easy Model Entity), this is the recommended format for this plugin.
   Alternatively, the built-in **Modded Entity** format (File > New > Java/Modded Entity) is also supported. Block and item formats are not supported.
2. Run **File > Export > Export Easy Model Entities**.
3. Choose the **Export Type**:
    - **Standalone: Data Pack + Resource Pack (ZIP)** — a single archive with a `datapack.zip` and a
      `resourcepack.zip` plus a `README.md` describing how to install both into Minecraft.
    - **Standalone: write into mod project** — writes all files directly into a selected
      `src/main/resources` directory.
    - **Model only: mod integration (no data pack)** — writes only the render profile, model and
      texture into a mod project. Use this when the mod ships its own entity classes and only needs
      the visual side.
4. Choose the **Type** (only for Standalone exports):
    - **Entity** — a living entity controlled by the mod's built-in AI presets.
    - **Block Entity** — a static block that can play animations.
5. Pick a **Preset** that best matches your model. The plugin auto-detects a fitting preset from
   your bone names. Most models need nothing else; tick **Customize settings** (requires the
   *Show advanced customization* Blockbench setting) only to fine-tune dimensions, movement,
   attributes, rendering or animation.
6. Set the **Namespace (mod id)** and **Profile ID**, and choose the Minecraft target version.

Exported settings are saved inside the `.bbmodel` project and restored on the next export.

## Blockbench settings

Two optional settings are available under **File > Preferences > Settings > Export**:

- **Show advanced customization** — unlocks the *Customize settings* checkbox in the export dialog.
- **Show experimental presets** — reveals presets that are loaded by the mod but whose specialized
  movement or behavior is still in development. Off by default.
