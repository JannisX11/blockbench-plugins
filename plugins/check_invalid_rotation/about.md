# Minecraft Java Edition Rotation Checker

Comprehensive rotation validation for Minecraft Java Edition 1.8-1.18.x - Detect and fix non-standard rotations before they cause display issues in-game.

## Features:
- **Universal Protection**: Works with ALL save and export operations (Ctrl+Alt+S, File > Save, File > Save As, Java Block export, Bedrock export)
- **Smart Detection**: Identifies rotations that don't follow Minecraft Java Edition's 22.5° increment standard
- **Quick Fix Options**: Automatically fix rotations to nearest standard values or fix individually
- **Context-Aware Dialogs**: Different button text for export vs save operations
- **Multi-Language Support**: English and French translations

## Minecraft Java Edition Standards (1.8-1.18.x):
Minecraft Java Edition 1.8-1.18.x supports rotations in 22.5° increments:
**-45°, -22.5°, 0°, 22.5°, 45°**

**Note**: Minecraft 1.19+ may have relaxed these restrictions. This plugin targets older versions where rotation restrictions are still enforced.

Non-standard rotations may cause visual glitches or incorrect model orientation in-game.

## How It Works:
1. **Automatic Scanning**: When you save or export a model, the plugin automatically scans all rotation values
2. **Smart Detection**: Identifies any rotations that don't follow the 22.5° standard
3. **Warning Dialog**: Shows a dialog with operation-specific button text
4. **Fix Options**: Choose to fix all rotations automatically or fix them individually (nearest or furthest standard values)
5. **User Control**: Continue the operation or cancel to fix rotations first

## Fixing Options:
- **Fix All**: Automatically correct all problematic rotations at once
- **Individual Fix**: Fix each rotation with two options:
  - **Nearest**: Fix to the closest standard value (e.g., 23° → 22.5°)
  - **Furthest**: Fix to the second closest standard value (e.g., 23° → 45°)
- **Continue**: Proceed with the operation without fixing (at your own risk)
- **Cancel**: Cancel the operation to fix rotations manually

![Rotation Checker Dialog](https://raw.githubusercontent.com/JannisX11/blockbench-plugins/master/plugins/check_invalid_rotation/demo.png)

## Supported Operations:
- Save Operations: Ctrl+Alt+S, File > Save Model
- Save As Operations: Ctrl+Shift+S, File > Save As
- Increment Operations: File > Increment Save
- Export Operations: Java Block export, Bedrock export

## Compatibility:
- Compatible with Blockbench v4.8.0+
