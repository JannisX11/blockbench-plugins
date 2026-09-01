# IK Tools

IK Tools adds inverse-kinematics helpers to Blockbench animation workflows.

## Features

- Two-Bone IK
- Chain IK using FABRIK
- Spline IK
- Aim IK
- Live IK preview
- Optional guide visualization
- Per-constraint or batch pose baking
- IK settings saved with the Blockbench project
- English and Korean UI translations

## Basic Usage

1. Open a model that supports animation.
2. Switch to **Animate** mode.
3. Open **IK Tools**.
4. Select or configure the bones and target objects for the IK type you want to use.
5. Enable **Live Preview** to preview the solved pose.
6. Use **Bake** to write the current IK pose into the selected animation.

Targets, poles, and spline controls should remain outside the bone chain that they control to avoid dependency cycles.

## IK Types

### Two-Bone IK
Controls an upper bone and lower bone toward an end-effector target. A pole object or bend direction can be used to control the bend plane.

### Chain IK (FABRIK)
Solves a multi-bone chain from a selected root bone to an end effector.

### Spline IK
Guides a multi-bone chain along a curve using control objects and a tip target.

### Aim IK
Rotates a selected bone so that its reference point aims toward the target.

## Notes

- Bone lengths are preserved while solving.
- Some targets may be unreachable when the chain is too short or the requested spline shape differs strongly from the available bone lengths.
- Disable **Rotate in Global Space** on IK-controlled bones before baking if Blockbench reports a bake error.
