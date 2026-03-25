# Expand Bone Timeline

A Blockbench plugin that improves animation workflow by expanding child bone animators in the timeline via a right-click menu.

## What it does

In Animate mode, right-click any bone group in the Outliner to reveal a new context menu option: **Toggle Child Animators**.

- **Toggle on** — Adds the selected bone and all of its descendant bones (children, grandchildren, etc.) that have keyframe data to the Timeline.
- **Toggle off** — Removes them all from the Timeline.

This makes it much easier to work with complex rigs where related bones are grouped under a parent, such as an arm chain, finger hierarchy, or a multi-part tail.

## Installation

1. Open Blockbench
2. Go to **File → Plugins**
3. Switch to the **Available** tab
4. Search for **Expand Bone Timeline**
5. Click **Install**

## Usage

1. Open a model with animations
2. Switch to **Animate** mode
3. Select an animation
4. Right-click a bone group in the **Outliner**
5. Click **Toggle Child Animators** to expand or collapse

## Notes

- Only descendant bones that have actual keyframe data in the currently selected animation will be shown. Empty bones are skipped.
- The menu option only appears when in Animate mode with an animation selected.
- Works with both Blockbench Desktop and Web versions.

## License

MIT