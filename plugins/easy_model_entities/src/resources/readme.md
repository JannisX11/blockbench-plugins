# {{id}} - Easy Model Entities pack

A Blockbench model you can spawn as an entity in Minecraft. Made with the **Easy Model Entities**
Blockbench plugin for **{{mcVersion}}**.

> **Note:** This is an early release. If you update the plugin or the mod, you may need to export
> this pack again.

Profile ID: `{{serverProfileId}}`

## What you need

The **Easy Model Entities** mod, version **{{modVersion}} or newer**, for **{{mcVersion}}**
(Forge, NeoForge or Fabric). Without the mod these files do nothing. With an older mod version the
model can look wrong or show up as a pink box.

- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/easy-model-entities)
- [Modrinth](https://modrinth.com/mod/easy-model-entities)

Install it like any other mod. In multiplayer, the server needs it too.

## Installation

There are two files. Do not unpack them, just move them into the right folder:

- `{{datapackFile}}`: the entity itself (size, movement, behavior)
- `{{resourcepackFile}}`: how it looks (model, texture, animations)

### 1. Resource Pack

Move `{{resourcepackFile}}` into your resourcepacks folder:

- Windows: `%appdata%\.minecraft\resourcepacks\`
- Linux: `~/.minecraft/resourcepacks/`
- macOS: `~/Library/Application Support/minecraft/resourcepacks/`

Start Minecraft and turn it on under **Options > Resource Packs**.

### 2. Data Pack

Move `{{datapackFile}}` into the datapacks folder of your world:

- Single player: `.minecraft/saves/<world>/datapacks/`
- Server: `<server folder>/world/datapacks/`

Load the world. If it is already open, run `/reload`.

> **Install both.** With only the resource pack, you cannot spawn the model. With only the data
> pack, the entity shows up as a pink box.

## Using it in game

Open the creative inventory. Entities are in the **Easy Model Entities** tab, block entities in
**Easy Model Block Entities**. Use the spawn item like a spawn egg.

## Using it with Easy NPC

Easy NPC only needs the resource pack. You need the data pack only for the spawn items, for
`/summon` and for the entities and blocks of Easy Model Entities.

## What this model can do

Movement and behavior come from a preset built into the mod, for example wandering, swimming,
flying or standing still. The preset was chosen when the pack was exported.

Animations come from the clips in the Blockbench project. These names play on their own:

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
- Clips with other names only play by command, for example
  `/easy_model_entities animation play entity <targets> <clip>`.
- A model without any of these clips is shown without animation.

## Updating this pack

Changed only the model, texture or animations? Export only the resource pack again and replace that
file. Changed size or movement? Export only the data pack. The new pack still fits the one you
installed. If you changed both, export both packs again and replace both files.

## Troubleshooting

The model is a pink box or does not show up? Run this command in game:

```
/easy_model_entities debug_profile {{serverProfileId}}
```

It shows what is wrong with the profile and the model. Errors are also written to
`logs/latest.log` in your Minecraft folder. Search the file for `{{serverProfileId}}`.
