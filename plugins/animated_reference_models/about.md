# Animated Reference Models

Animate interactions between **separate Blockbench projects** without merging their models or animation files.

Animated Reference Models lets you add another open Blockbench project as a transformable reference in the current project. When you scrub or play an animation, the reference automatically previews its own matching animation at the same timestamp.

This is useful for paired or synchronized animations such as character interactions, mounts, creature interactions, combat, handshakes, hugs, props, vehicles, or any scene where each participant needs to remain in its own project.

## How to use

1. Open both model projects in Blockbench tabs. Keep the model you want to animate as the active project.
2. Go to **Edit > Add Animated Reference** and choose another open project.
3. Select or play an animation in the active project.
4. If the reference project contains a matching animation, it will play in sync with the same timeline position.
5. Select the **Animated Reference** entry in the Outliner to move, rotate, or scale the reference into position.
6. Use **Edit > Unload Animated Reference** when you no longer need it.

## Animation matching

The plugin first looks for the exact animation name. If no exact match exists, it also compares the final logical name segment.

For example, these names match:

- `animation.goblin.pet_boar`
- `animation.boar.pet_boar`

Both resolve to `pet_boar`.

If no matching animation exists in the reference project, the reference stays in its base/rest pose. If the active timeline moves beyond the reference animation's duration, the reference also returns to its base/rest pose instead of looping or holding the final frame.

## Workflow notes

- Reference projects must remain open in Blockbench while they are being used.
- Each project keeps its own model, bones, textures, and animations. The plugin only creates a visual reference in the host project.
- Bone names may be shared between projects; references are evaluated independently.
- Animation channels that target a bone which does not exist in the reference model are ignored.
- Multiple animated references can be added to the same project.

## Refresh and debugging

Use **Edit > Refresh Animated References** after making structural changes to a referenced model.

**Edit > Animated References Debug Info** shows the current host animation, timestamp, source project, matched animation, and evaluation state for each reference.

Verbose console logging is disabled by default. Enable it with **Edit > Toggle Animated Reference Debug Logging** when troubleshooting. Logs appear in Blockbench's Developer Tools console with the prefix `[Animated Reference Models]`.

## Credits

Created by **Muta & ChatGPT**.

Originally developed for synchronized multi-entity animation workflows and generalized for the Blockbench community.
