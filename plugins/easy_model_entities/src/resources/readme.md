# {{id}} - Easy Model Entities pack

A custom Blockbench model that appears in Minecraft as an entity you can spawn — no coding and no
extra mod needed for this model. Made with the **Easy Model Entities Exporter** Blockbench plugin
for **{{mcVersion}}**.

> **Note:** This is an early release. The pack format may still change, so you might need to
> re-export this pack after updating the plugin or the mod.

Profile ID: `{{serverProfileId}}`

## What you need

The **Easy Model Entities** mod for **{{mcVersion}}** (Forge, NeoForge or Fabric, depending on the
Minecraft version). Without the mod these files do nothing at all.

- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/easy-model-entities)
- [Modrinth](https://modrinth.com/mod/easy-model-entities)

Install it like any other mod first. In multiplayer it has to be installed on the server too.

## Installation

Two files belong together — do not unpack them, just move them into the right folder:

- `{{datapackFile}}` — the entity itself (size, movement, behavior)
- `{{resourcepackFile}}` — how it looks (model, texture, animations)

### 1. Resource Pack

Move `{{resourcepackFile}}` into your resourcepacks folder:

- Windows: `%appdata%\.minecraft\resourcepacks\`
- Linux: `~/.minecraft/resourcepacks/`
- macOS: `~/Library/Application Support/minecraft/resourcepacks/`

Start Minecraft and enable it under **Options > Resource Packs**.

### 2. Data Pack

Move `{{datapackFile}}` into your world's datapacks folder:

- Single player: `.minecraft/saves/<world>/datapacks/`
- Dedicated server: `<server folder>/world/datapacks/`

Load the world, or run `/reload` if it is already open.

> **Install both.** With only the resource pack the model shows up but cannot be spawned. With only
> the data pack the entity exists but renders as a pink placeholder box.

## Using it in game

Look for the spawn item in the creative inventory: entities are in the **Easy Model Entities** tab,
block entities in **Easy Model Block Entities**. Place it like a spawn egg.

## What this model can do

Movement and behavior come from a fixed set of presets built into the mod — wandering, swimming,
flying, standing still and so on. The preset was chosen at export time.

Animations are played from the clips in the Blockbench project. The mod recognises these names:

| Clip     | When it plays        |
|----------|----------------------|
| `idle`   | standing still       |
| `walk`   | moving on the ground |
| `swim`   | moving in water      |
| `fly`    | flying               |
| `attack` | attacking            |

Clips named `hurt` and `death` are loaded as well, but the mod does not trigger them on its own —
they need the `/easy_model_entities set_animation` command or another mod driving them.

Everything else is ignored: clips with other names are not played, and there is no scripting or
custom AI. A model without any matching clip simply renders without animation.

## Updating this pack

Changed only the model, texture or animations? Re-export just the resource pack and replace that
file. Changed entity data such as size or movement? Re-export just the data pack. Either way the
updated pack still matches the one you already installed. If both changed, export the complete
bundle again and replace both files.
