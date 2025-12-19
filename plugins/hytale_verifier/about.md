# Hytale Model Verifier

Verifies whether a model has the correct resolution and shapes for the Hytale art-style.

**Note:** This plugin is likely temporary until the official Hytale plugin is released with more features. If it doesn't contain some of these features, I have given this an MIT license so these features could be added to it without issue.

## Tools

All tools are available in the **Tools** menu after installation.

**Note:** Blockbench includes a "Scale" tool that allows you to scale up the entire model at once when you select all cubes. This is useful if you accidentally made your model too small or big.

### Verify Hytale Model

Checks your model for compliance with Hytale standards:
- Verifies that only cubes are used
- Checks the resolution for all used textures
- Reports which elements are problematic
- Ensures 1:1 pixel density (1 pixel = 1 world unit)

**Usage:** Tools > Verify Hytale Model

### Convert Meshes to Cubes

Converts cuboid and plane meshes into cube elements while preserving:
- UV coordinates
- Parent-child relationships
- Texture assignments

*Blockbench meshes are not supported by the Hytale engine, so all geometry must be cubes.*

**Usage:** Tools > Convert Meshes to Cubes

### Scale UV for Hytale Model

Scales your UV coordinates to match the size of their textures. This is useful when:
- Your model is correct but UV values are decimals instead of integers
- You need to match the project UV size to your actual texture dimensions

**Usage:** Tools > Scale UV for Hytale Model

### Fix UV for Hytale Model

Scales each face's UV individually to match the 1:1 pixel density ratio. This tool:
- Resizes UV areas to match their face dimensions
- Maintains UV center positions
- May require manual repositioning or texture updates afterward

**Usage:** Tools > Fix UV for Hytale Model

**Note:** After using this tool, textures may appear misaligned. You'll need to reposition the UVs or update your texture to match the new layout.

## Requirements

- Blockbench 4.8.0 or higher
- Models must use cubes
- Maximum 256 nodes (groups and cubes)
- Expected density: 1 pixel = 1 world unit (16x)

## Issues & Feedback

If you encounter any issues or have suggestions for improvement, please report them on the plugin's GitHub page.
