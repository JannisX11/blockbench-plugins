# Translation Plane Gizmo v1.0.0

![Demo](https://raw.githubusercontent.com/JannisX11/blockbench-plugins/master/plugins/translation_plane_gizmo/demo.gif)

## Features:
- **2D Plane Movement**: Drag colored planes (XY=Blue, XZ=Green, YZ=Red) to move objects along two axes at once
- **Grid Snapping**: Hold Shift to toggle snapping for precise positioning
- **Multi-Selection**: Works with multiple selected objects
- **Parent Space Rotation**: Planes align with parent orientation (Entity formats)
- **Toggle Control**: Toolbar button to enable/disable

## How it works:
- **XY Plane (Blue)**: Moves objects in X and Y directions simultaneously
- **XZ Plane (Green)**: Moves objects in X and Z directions simultaneously
- **YZ Plane (Red)**: Moves objects in Y and Z directions simultaneously

When dragging a plane, only that plane remains visible for a cleaner interaction experience.

**Toggle Button**: "Toggle Translation Plane Gizmo" `view_in_ar`

## Compatibility:
- Works with cubes, meshes, and groups
- Compatible with Java Block and Entity formats
- Supports local and global transform spaces
- Works with proportional editing
- Compatible with Blockbench v4.8.0+
