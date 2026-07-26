# Translation Plane Gizmo

Enhanced 2D plane gizmo for simultaneous multi-axis translation. Drag colored planes to move objects along two axes at once, just like in Blender.

![Demo](https://raw.githubusercontent.com/JannisX11/blockbench-plugins/master/plugins/translation_plane_gizmo/demo.gif)

## Features
- **2D Plane Movement**: Drag colored planes (XY=Blue, XZ=Green, YZ=Red) to move objects along two axes at once
- **Grid Snapping**: Hold Shift to toggle snapping for precise positioning
- **Multi-Selection**: Works with multiple selected objects
- **Parent Space Rotation**: Planes automatically align with parent object orientation (Entity formats)
- **Toggle Button**: "Toggle Translation Plane Gizmo" `view_in_ar` - Enable/disable from toolbar

## How it works
- **XY Plane (Blue)**: Moves objects in X and Y directions simultaneously
- **XZ Plane (Green)**: Moves objects in X and Z directions simultaneously
- **YZ Plane (Red)**: Moves objects in Y and Z directions simultaneously

When dragging a plane, only that plane remains visible for a cleaner interaction experience.

## Compatibility
Works with cubes, meshes, and groups • Compatible with Java Block and Entity formats • Supports local and global transform spaces • Works with proportional editing • Compatible with Blockbench v4.8.0+
