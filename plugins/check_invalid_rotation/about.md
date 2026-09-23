# Minecraft Java Edition Rotation Checker

Detects and fixes non-standard rotations for Minecraft Java Edition 1.8-1.18.x before they cause display issues in-game.

![Rotation Checker Dialog](https://raw.githubusercontent.com/JannisX11/blockbench-plugins/master/plugins/check_invalid_rotation/demo.png)

## Features

- **Automatic Detection**: Scans rotations during save and export operations
- **Quick Fix**: Automatically fix all rotations or fix individually (nearest/furthest values)
- **Multi-Language Support**: English and French translations

## Minecraft Java Edition Standards

Minecraft Java Edition 1.8-1.18.x supports rotations in 22.5° increments: **-45°, -22.5°, 0°, 22.5°, 45°**

## Supported Operations

The plugin automatically checks rotations before any save or export operation:

### Save Operations
- **Keyboard Shortcut**: Ctrl+Alt+S
- **Menu**: File > Save Model
- **Toolbar**: Save button

### Save As Operations
- **Keyboard Shortcut**: Ctrl+Shift+S
- **Menu**: File > Save As
- **Toolbar**: Save As button

### Increment Save Operations
- **Menu**: File > Increment Save
- **Toolbar**: Increment Save button

### Export Operations
- **Java Block Export**: File > Export > Java Block (.java)
- **Bedrock Export**: File > Export > Bedrock (.json)

**Note**: Minecraft 1.19+ may have relaxed these restrictions. This plugin targets older versions where rotation restrictions are still enforced.
