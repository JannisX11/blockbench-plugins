nowMobmanager Particle Exporter



nowMobmanager Particle Exporter is a Blockbench plugin for exporting custom particle-based model animations in a baked format designed for the nowMobmanager Minecraft plugin.







Features:

Export Blockbench cube models as particle-based geometry.

Export multiple Blockbench animations.

Bake animations frame-by-frame at 20 FPS.

Store final particle coordinates directly in the exported animation.

Preserve a fixed particle order across all animation frames.

Support animations using bone rotation, position, and other Blockbench animation transforms.

Generate runtime-ready animation data without requiring transform calculations in Minecraft.







Export Format:



The plugin exports JSON using the following format:

format: nowmobmanager\_particle

version: 3

Version 3 stores:

Particle metadata in the particles section.

Baked animation frames in the animations section.

Three coordinates (X, Y, Z) for every particle in every frame.

The resulting data is intended to be loaded by the nowMobmanager Minecraft plugin.



Usage:

Open a compatible model in Blockbench.

Open the Tools menu.

Select "Export nowMobmanager Particle Animation".

Choose where to save the generated JSON file.



The exported JSON can then be placed in the particle\_animations directory used by nowMobmanager.



Requirements:

Blockbench 5.0.0 or newer.

Desktop version of Blockbench.

Compatibility



This plugin is designed for Minecraft: Java Edition workflows using the nowMobmanager particle animation system.



Author:

Created by \_NotWhale (now).



Project:

This exporter is developed as part of the nowMobmanager ecosystem.

