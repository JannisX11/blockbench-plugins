# Enhanced Translation Plane Gizmo v1.0

![Demo](demo.gif)

## Features:
- **2D Plane Movement**: Drag colored planes to move objects along two axes simultaneously
- **RGB Color Coding**: XY (Blue), XZ (Green), YZ (Red) planes for easy identification
- **Smart Integration**: Seamlessly works with Blockbench's transform system
- **Grid Snapping**: Automatic grid alignment when enabled
- **Undo Support**: Full integration with Blockbench's undo system
- **Cross-Version Compatible**: Works with both Blockbench v4 and v5
- **Blender-Style Handles**: Small, finite square handles like professional 3D software
- **Smart Camera Scaling**: Handles scale with zoom level like built-in arrow gizmos
- **French Language Support**: Full localization for French users

## How it works:
- **XY Plane (Green→Red gradient)**: Move objects in X and Y directions simultaneously
- **XZ Plane (Red→Blue gradient)**: Move objects in X and Z directions simultaneously
- **YZ Plane (Green→Blue gradient)**: Move objects in Y and Z directions simultaneously

## Usage:
1. Select objects in the 3D view
2. Switch to **Move tool**
3. You'll see three colored planes around the selection (Blue XY, Green XZ, Red YZ)
4. Click and drag any plane to move the object in that 2D plane
5. Hold Shift for grid snapping (if enabled)
6. Use the toolbar button to toggle the gizmo on/off

## Integration:
- Works with cubes, meshes, and groups
- Respects Blockbench's transform space settings
- Compatible with proportional editing
- Supports both local and global transform spaces

## Technical Details:
- Uses ThreeJS for 3D rendering with custom gradient shader materials
- Integrates with Blockbench's transformer system
- Supports undo/redo operations
- Optimized for performance with minimal updates
- Compatible with Blockbench 4.0.0+
- Smart event handling for element visibility changes
- Proper cleanup on plugin unload
