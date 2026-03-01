# Easings

Apply easing to Minecraft: Bedrock Edition animations by utilizing `anim_time_update`.

> Easing can only be applied to animations with a default or empty anim time update and a defined animation length.

> You must reapply or re-run the easing if you change the animation duration or loop mode.

> Blockbench might not be able to preview bounce easings properly.

## Supported Easings

- Sine
- Quad
- Cubic
- Quart
- Quint
- Expo
- Circ
- Bounce

## Unsupported Easings

- Back
- Elastic

These are unsupported because Bedrock animations clamp values within the animation length while these easings can extend beyond that range.
