# Easy Model Entities

> **Note:** This is an early release. Settings, file formats and the export output can still
> change. Please report problems and ideas on the
> [issue tracker](https://github.com/MarkusBordihn/BOs-Easy-Model-Entities/issues).

Turn your Blockbench model into a Minecraft entity you can spawn in game. You do not need to write
a mod for it. The plugin exports a Data Pack and a Resource Pack for the **Easy Model Entities** mod
on **Minecraft: Java Edition**.

The plugin only creates the pack files. To use them, the **Easy Model Entities mod must be
installed**, version 2.5.0 or newer. In multiplayer, the server needs the mod too.

- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/easy-model-entities)
- [Modrinth](https://modrinth.com/mod/easy-model-entities)

## What you get

Your model becomes an entity or a block entity. You find its spawn item in the creative inventory.

Size, movement and behavior come from **presets** built into the mod, for example wandering,
swimming, flying or standing still. You pick one preset. You cannot write your own AI.

Animations come from your Blockbench clips. These names play on their own:

| Clip     | When it plays        |
|----------|----------------------|
| `idle`   | standing still       |
| `walk`   | moving on the ground |
| `swim`   | moving in water      |
| `fly`    | flying               |
| `attack` | attacking            |
| `sit`    | sitting or riding    |
| `hurt`   | taking damage        |
| `death`  | dying                |

- `shoulder` plays while the model sits on a player's shoulder. Without it, `sit` or `idle` is used.
- Numbered clips like `idle_2` or `walk 3` are variants. The mod picks one of them each time.
- Clips with other names only play by command (`/easy_model_entities animation`) or from another
  mod.
- A model without any of these clips is shown without animation.

## How to use

1. Open or create your model in Blockbench with the **Easy Model Entity** format (File > New > Easy
   Model Entity). The **Modded Entity** format works too. Block and item formats
   do not.
2. Click **File > Export > Export Easy Model Entity**.
3. Choose the **Export Type**:
  - **Complete: Data Pack + Resource Pack (ZIP)**: both packs and a README in one file. Use this
    the first time and when you share your model.
  - **Update: Resource Pack only (ZIP)**: after you changed the model, texture or animations.
  - **Update: Data Pack only (ZIP)**: after you changed entity data like size or movement.
  - **Standalone: write into mod project**: writes all files into a `src/main/resources` folder.
  - **Model only: mod integration (no data pack)**: writes only the model, texture and render
    profile. For mods that bring their own entities.
4. Choose the **Type** (not shown for *Model only*):
  - **Entity**: a mob that moves on its own.
  - **Block Entity**: a block that can play animations.
5. Pick a **Preset**. The plugin suggests one based on your group names, so most models need
   nothing else.
6. Set the **Namespace (mod id)**, the **Profile ID** and the Minecraft version.
7. **Include external textures**: if your model uses textures from another mod, they are copied into
   the pack. Turn it off to only point to them. Then the other mod has to be installed. Vanilla
   `minecraft:` textures are never copied.

Changed only a small thing? Use one of the update exports. The new pack still fits the one you
already installed. If you changed the model **and** the entity data, export both packs again.

Your export settings are saved in the `.bbmodel` file and come back on the next export.

## Blockbench settings

Two optional settings under **File > Preferences > Settings > Export**:

- **Show advanced customization**: adds *Customize settings* to the export dialog. There you can
  change size, movement, behavior, attributes, rendering, animation and the shoulder pose.
- **Show experimental presets**: adds the *Custom* preset and presets that are not finished yet.
  Off by default.
