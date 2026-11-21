# nowMobManager Particle Exporter
Convert Blockbench cube models and animations into baked particle animation data for **nowMobManager**, a Minecraft: Java Edition plugin.

## How it works
The exporter converts cube geometry into particles and bakes each animation frame into particle coordinates. A 1×1×1 cube produces one particle, while larger cubes are represented by more particles. The resulting JSON can be loaded by the nowMobManager particle animation system without calculating model transforms in Minecraft.

## Features
- Convert Blockbench cube geometry into particles.
- Bake animations frame by frame at **20 FPS**.
- Store final particle coordinates directly in every frame.
- Preserve a consistent particle order throughout each animation.
- Support bone movement, rotation, and other Blockbench animation transforms.
- Export ready-to-use particle animation data for Minecraft.

## How to export
1. Open a compatible cube model in **Blockbench**.
2. Open **Tools** in the menu bar.
3. Select **Export nowMobManager Particle Animation**.
4. Choose where to save the generated **JSON** file.
5. Place the JSON file in the `particle_animations` directory used by nowMobManager.

## Requirements
- **Blockbench 5.0.0** or newer (desktop version).
- **nowMobManager** for Minecraft: Java Edition to use the exported data in game.

## Author
Created by **now04** as part of the nowMobManager project.
