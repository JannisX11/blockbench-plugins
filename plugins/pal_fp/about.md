Puts the Blockbench viewport camera exactly where Minecraft's first-person camera is, so a first-person arm rig can be animated while looking at the same image as in game.

Built for first-person rigs made for the **Player Animation Library** mod (`fp_player_arms`, `fp_camera`, `fp_r_item` / `fp_l_item`): the anchor, the `fp_camera` bone preview and the renderer's rotation order are applied on every frame, without asking, because they are what the mod does.

## Usage

* **View → First Person Camera** toggles the mode. The previous camera (position, rotation, FOV, near plane and orbit target) is restored when you toggle it off.
* **View → First Person Camera Settings...** opens every option below.

While the mode is on the camera is locked: the orbit controls are disabled and the camera is re-applied every frame, so what you see is what the game renders. Toggle it off to look around the rig again.

The plugin also applies the transforms the game applies to the model, every frame, and restores the bones afterwards (so a paused timeline is not corrupted):

* the animated `fp_camera` **roll** and **position** (the camera and the rig move together, which is what `FpCameraUtil` does to the real camera while the arms stay in view space);
* the **rotation order** the renderer composes bones with (Z, Y, X) instead of Blockbench's (X, Y, Z).

## What the plugin does *not* do

The held items are deliberately left alone. The plugin does not apply vanilla's hand anchor or the `firstperson_righthand` display transform to `fp_r_item` / `fp_l_item`: the rig previews exactly the pose the animation gives those bones, which is what the mod draws once the extra vanilla transforms are taken out of the way. The mod rewinds the pose to the frame the vanilla hand pass started from, so none of vanilla's first-person item transforms (hand sway, equip progress, swing, hand anchor, use-item poses) reach the animated pose.

If the item still looks different in game than in Blockbench, check the *item model* and where its box sits relative to the bone: in game the item's 1×1×1 model box is centred on the `fp_*_item` bone origin, so a placeholder that is not centred there will be off by the difference. In a PAL rig the item bone is also a child of the arm bone (`fp_player_arms > rightArm > fp_r_item`), so the preview drags the item with the hand, exactly like the game does.

## Defaults

The defaults are the values the mod and vanilla Minecraft use, so a rig authored for PAL previews 1:1 with no setup:

| Option | Default | Where it comes from |
| --- | --- | --- |
| Field of view | `70` | Minecraft's *FOV* option (vertical FOV, the same convention Blockbench uses) |
| `fpDisplayTranslation` X/Y/Z | `0` | per-animation extra data, in model pixels |
| `fpDisplayScale` | `1` | per-animation extra data |
| `fpDisplayAnchor: "hand"` | off | on when the clip anchors the rig on the hand instead of the view axis |

Everything else the plugin does is not a setting: the anchor (`0.52` blocks above the rig origin and `0.72` behind it), the `fp_camera` roll and position preview and the game's rotation order are applied on every frame, because they are what the mod does and there is nothing to tune.

That puts the Blockbench camera at `(0, 8.32, 11.52)` model units, looking along `-Z`, which is the frame the first-person rig is authored in: arms at `x = ±6`, rig origin between the hands.

If an animation ships with `player_animation_library` extras, copy them into the settings dialog:

```json
"player_animation_library": {
  "fpDisplayAnchor": "camera",
  "fpDisplayTranslation": [0, -2, 3],
  "fpDisplayScale": 1.5
}
```

`fpDisplayTranslation` is in model pixels; `fpDisplayScale` is reproduced as a field of view change (scaling the rig around the eye is a pure zoom on screen, and a plugin cannot scale the model).

## Accuracy

For a perspective camera the projected position of every vertex is identical to the game: the game computes `view = (0, -0.52, -0.72) + model / 16` and the plugin places the camera so that `view = (model - camera) / 16`, which is the same ray.

What is reproduced exactly:

* **Camera frame.** Anchor, FOV, near plane and the aspect ratio behaviour of a perspective camera.
* **`fp_camera`.** Its roll rotates the camera and its position moves the camera *and* the rig by the same vector, in the camera's own axes. `FpCameraUtil` adds the bone to Minecraft's real camera along `right`, `up` and `forward`, and the arms are drawn in view space afterwards, so the world slides behind them and they stay glued to the screen: moving both reproduces that exactly.
* **Held items.** The plugin does not touch `fp_r_item` / `fp_l_item`, so the preview shows exactly the pose the animation gives them. That is what the mod draws once vanilla's display transform is skipped (see *What the plugin does not do* above).

Things that legitimately differ:

* **Item model.** The preview shows whatever geometry the item bone contains, while the game draws the real item model, whose 1×1×1 box is centred on the `fp_*_item` bone origin. Vanilla's display transform for the item and the rest of its first-person item transforms (hand sway, equip progress, swing, hand anchor, use-item poses) are skipped by the mod, so only the animation poses the item.
* **Aspect ratio.** The FOV is vertical in both, so the vertical framing always matches; the horizontal one matches when the viewport has the same aspect ratio as the game window.
* **Rotation order.** Blockbench composes a bone's rotation in the X, Y, Z order of the keyframe panel, while `FpArmRenderUtil.rotateMatrixAroundBone` multiplies the axes in the Z, Y, X order, so a bone rotated around more than one axis is drawn differently in each. The plugin re-orders the bones on every frame, so the preview shows the composition the game uses. The *values* need no conversion: the AzureLib exporter mirrors the authored animation when it writes the `.animation.json` (X for positions, X and Y for rotations) and the renderer mirrors them back, so the values the bbmodel holds are exactly the ones the game applies.
* **Rest pose.** A bone whose *rest* rotation is not zero is not reproduced the way the renderer does it: Blockbench adds the animation to the rest rotation, while the renderer applies the animation values alone. A PAL first-person rig has zero rest rotations, so this does not show up there.
