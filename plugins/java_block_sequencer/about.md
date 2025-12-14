# Java Block Sequencer v1.0.0

Adds the option to turn animation keyframes into a sequence of Minecraft block/item models.
This will not export any item definition files for the exported models, so these must be referenced manually in a resource pack.
Requires Minecraft 1.21.11 or later.

## How it works
The Java Block Sequencer (JBS) introduces a format which adds the `Java Block Sequence` button to the Animate tab. The JBS exports Java Block models similar to how the OBJ Animation Exporter tool by JannisX11 exports OBJ models. 
Whenever an animation is exported with JBS, each frame goes through 6 stages: 
- create undo state for model
- resolve model tree into cubes
- bake transforms into outliner
- save model to zip archive under the selected animation name
- undo changes

## How to use
Start by creating a new model or converting an existing cube-based project into a **Java Block Sequence**. Create an animation. Right-click your animation. Click **Export Java Block Sequence** from the drop-down menu. Each model will be displayed in-game based on settings in the Display tab.

## Troubleshooting
- If the exported models aren't getting rotated or positioned properly, make sure the groups/bones used in your animation have been checked (`Export: On`) in the `Edit` tab.
