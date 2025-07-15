# Export to 3MF

**Export to 3MF** is a Blockbench plugin that allows you to directly export your models to .3mf files (3D Manufacturing Format). This allows you to easily slice your Blockbench models for 3D printing.

## How to use
Access the export via `File > Export > Export 3MF Model`.

You are able to choose what unit a pixel represents, which decides the scale of the model in the real world:
- Micrometres
- Millimetres (Default)
- Centimetres
- Metres
- Inches
- Feet

The model by default will export as one object, but you can choose to divide it into separate objects by "group/bone" or "marker colour". This gives more control over reorganizing and material in your slicer.

## Valid models

**Note:** Many Blockbench models are not suitable for printing without modification.

Your model will have invalid aspects if you have zero thickness planes, or it is not manifold (watertight/solid).

This conversion process is barebones and does not validate the printability of the exported 3MF file.

