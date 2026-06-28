# Hytale UV-Preserving Scale

Adds **Tools → Scale Model — Preserve UV**.

Resizing a cube in the Hytale format also changes its UV size, which usually means redoing texture work. This plugin scales the model a different way: it keeps every cube's base size and just multiplies its `stretch` (and moves the pivots and origins). The model gets bigger or smaller, but the UVs stay exactly where they were.

Works with **Hytale Character** and **Hytale Prop**.

What you can set:

* Scale factor, with presets (×0.25, ×0.5, ×2, ×4).
* Scale the whole model or just the selected hierarchy.
* Pivot: model origin, the selected root, or a custom point.
* Optionally scale the position keyframes of loaded animations. Rotation, stretch, visibility and UV channels are left alone.

Everything happens in one undo step. If something goes wrong it restores the model instead of leaving it half-scaled.

**Bake pose, keep animations.** It also wraps the native *Bake Animation Pose into Model*. Baking a pose changes the model's rest pose, which normally breaks your other animations (they're stored relative to the old rest). With the re-base option (ticked by default in the popup), every loaded animation is shifted onto the new rest pose in the same undo step, so they keep playing. Rotation and position are re-based; scale is left to the native action, which doesn't bake it.

Standalone add-on. It doesn't modify the official Hytale plugin.
