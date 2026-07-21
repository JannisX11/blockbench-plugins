# Easy Model Entities

> **Note:** This is an early release to gather feedback. Some settings, file formats and the export
> output may still change before the final version. Please report problems and ideas on the
> [issue tracker](https://github.com/MarkusBordihn/BOs-Easy-Model-Entities/issues).

Turn your Blockbench model into a Minecraft entity you can spawn in game — without writing a mod.
The plugin exports a Data Pack and a Resource Pack for the **Easy Model Entities** mod on
**Minecraft: Java Edition**.

This plugin only generates the pack files. The **Easy Model Entities mod must be installed** in
Minecraft for them to work, and on the server as well in multiplayer. Without the mod the generated
files do nothing.

- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/easy-model-entities)
- [Modrinth](https://modrinth.com/mod/easy-model-entities)

## What you get, and what you do not

Your model becomes a spawnable entity or a block entity, with a spawn item in the creative
inventory. Size, movement and behavior come from a **fixed set of presets** built into the mod
(wandering, swimming, flying, standing still and so on) — you pick one, you do not script your own.

Animations are played from your Blockbench clips, but only these names are recognised:

| Clip | When it plays |
| --- | --- |
| `idle` | standing still |
| `walk` | moving on the ground |
| `swim` | moving in water |
| `fly` | flying |
| `attack` | attacking |

`hurt` and `death` clips are loaded too, but the mod does not trigger them on its own — they need
the `set_animation` command or another mod driving them. Clips with any other name are ignored, and
a model without a matching clip simply renders without animation.

## How to use

1. Open or create your model in Blockbench using the **Easy Model Entity** format
   (File > New > Easy Model Entity). The built-in **Modded Entity** format also works. Block and
   item formats are not supported.
2. Run **File > Export > Export Easy Model Entity**.
3. Choose the **Export Type**:
   - **Complete: Data Pack + Resource Pack (ZIP)** — one archive with both packs and a README that
     explains how to install them. Use this the first time and for sharing.
   - **Update: Resource Pack only (ZIP)** — after changing the model, texture or animations.
   - **Update: Data Pack only (ZIP)** — after changing entity data such as size or movement.
   - **Standalone: write into mod project** — writes all files into a selected `src/main/resources`
     directory.
   - **Model only: mod integration (no data pack)** — writes only the render profile, model and
     texture. Use this when your mod ships its own entity classes and needs the visual side only.
4. Choose the **Type** (not shown for *Model only*, which is always an entity):
   - **Entity** — a living entity controlled by the mod's built-in AI presets.
   - **Block Entity** — a static block that can play animations.
5. Pick a **Preset** that matches your model. The plugin auto-detects a fitting one from your bone
   names, so most models need nothing else. Tick **Customize settings** (requires the *Show advanced
   customization* Blockbench setting) only to fine-tune dimensions, movement, attributes, rendering
   or animation.
6. Set the **Namespace (mod id)** and **Profile ID**, and choose the Minecraft target version.

The two update exports save you from re-installing both packs for a small change. They keep the
pairing of your last full export, so the updated pack still matches the one already installed. If
you changed the model **and** the entity data, export the complete bundle instead.

Exported settings are saved inside the `.bbmodel` project and restored on the next export.

## Blockbench settings

Two optional settings under **File > Preferences > Settings > Export**:

- **Show advanced customization** — unlocks the *Customize settings* checkbox in the export dialog.
- **Show experimental presets** — reveals presets that the mod loads but whose specialized movement
  or behavior is still in development. Off by default.
