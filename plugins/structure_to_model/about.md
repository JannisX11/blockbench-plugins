# Structure to Model

Import a Minecraft Java structure file (`.nbt`) and convert it into an editable Blockbench model.

## Features

- Correctly handles large structure palettes and default block states
- Resolves variant, multipart, and inherited block models
- Culls hidden faces to reduce model complexity
- Supports biome-tinted textures with presets and custom colors
- Groups and names generated cubes by block type
- Shows progress while large structures are imported

## Setup

Structure to Model requires Blockbench Desktop and a local Minecraft assets folder.

1. Open **Tools > STM: Settings**.
2. Set **Asset Root** to the folder containing namespace folders such as `minecraft`. Each namespace should contain `blockstates`, `models`, and `textures` folders.
3. Choose the model scale and an optional tint preset.

## Importing a structure

1. Open **Tools > STM: Import Structure**.
2. Select a Java Edition `.nbt` structure file.
3. Wait for the import to finish. The generated model is placed in a group named after the structure file.
4. If tinted textures were generated, choose a location in your resource pack when prompted.

Missing blockstate, model, or texture files are skipped. The plugin imports geometry only; entity, block-entity, and biome data are not included.

For development instructions and issue reporting, visit the [source repository](https://github.com/MesterMan03/structure-to-model).
