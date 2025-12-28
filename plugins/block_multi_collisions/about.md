# Block Multi-Collision

Block Multi-Collision is a Blockbench plugin that allow you to create and preview multiple collision boxes for Minecraft Bedrock blocks using the `minecraft:collision_box` component for the block format `1.21.130+`.

## Overview

- **Purpose**: Provide an in editor workflow to author one or more collision boxes for custom Bedrock blocks without manually editing JSON.  
- **Target**: Minecraft Bedrock Edition blocks using the `minecraft:collision_box` component, including the multi-box format introduced in recent versions.

## Features

- Visual wireframe preview of up to 16 collision boxes directly in the Blockbench scene, each with its own size and offset.  
- Form controls to edit size and offset numerically, switch the active box by index, and keep boxes clamped to valid Bedrock collision bounds.  
- Auto-generation of collision boxes from visible cubes in the current model, speeding up setup for complex shapes.

## Workflow

- Open the plugin via the “Setup Block Collisions” action, available when working in the Bedrock block format.  
- Adjust collision boxes using the numeric fields and navigation controls, previewing them in real time in the 3D viewport.  
- Copy the generated collision JSON and paste it into the block’s behavior JSON file in a Bedrock pack.