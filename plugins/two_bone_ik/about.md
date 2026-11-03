# IK Tools

Two-bone IK, pure FABRIK chain IK, Spline IK, and aim IK with IK/FK blending, project-saved constraints, live preview, and individual or batch pose and frame-range baking.

## Features

- Two-Bone IK
- Chain IK using FABRIK
- Spline IK with curve controls
- Aim IK
- IK / FK blending per constraint
- Live preview and visual guides
- Current-frame baking
- Frame-range baking with configurable frame step
- Project-saved IK constraints
- English and Korean interface translations

## Basic Usage

1. Open an animation-capable model project.
2. Switch to **Animate** mode and select an animation.
3. Open **Animation → IK Tools**. If the Animation menu is unavailable, use **Tools → IK Tools**.
4. Click **Add IK** and choose an IK type.
5. Configure the controlled bones and target.
6. Enable **Live Preview** to preview the solved pose.
7. Adjust **IK / FK Blend** if needed.
8. Use **Bake** for the current frame or **Bake Range** for multiple frames.

## Notes

Targets, Two-Bone poles, and Spline controls must stay outside the bone chain they control. Bone lengths are preserved. Partial IK/FK blends turn Live Preview off after baking to keep the baked pose stable.
