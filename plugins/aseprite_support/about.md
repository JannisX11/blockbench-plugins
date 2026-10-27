# Aseprite Import/Export

Import and export `.aseprite` / `.ase` in Blockbench.

## Import
- `.aseprite` / `.ase` -> Blockbench texture.
- Preserves layers, opacity, blend modes.
- Multiple frames -> flipbook animation.
- Supports RGBA, grayscale, indexed, zlib.

## Export
- Blockbench texture -> `.aseprite`.
- Preserves layers and animation.
- Merges identical adjacent slots into frames.

## Usage
- `File -> Import -> Import Aseprite…`
- `File -> Export -> Export as Aseprite…`
- Drag and drop file into window.
- Right-click texture in TEXTURES panel.

## File link
- Imported texture remembers source `.aseprite`.
- `Save` overwrites source file.
- Saving to another format unlinks.

## Limitations
- Tilemap layers and groups are skipped.
- Blend modes not in Aseprite become Normal.