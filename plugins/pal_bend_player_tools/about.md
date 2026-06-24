# PAL Bend Player Tools

Create a player animation project and convert PlayerAnimationLibrary / Emotecraft player animations in Blockbench.

## English

- Create a `player_model.geo.json` helper-bend project with a default `player_model.geo.png` texture.
- Create DragonCore-compatible player projects: one keeps PAL bone names, and one uses DragonCore group names such as `Body_Lower`, `Body`, `Left_Arm_Lower`, and `Right_Hand`.
- Import traditional PAL bend `animations` JSON or Emotecraft `emote` JSON.
- Import legacy animations authored against the DragonCore-friendly reference model and convert them to PAL.
- Export traditional PAL bend `animations` JSON or Emotecraft `emote` JSON.
- Converts only `*_bend.rotation.x` and PAL `bend`. Y/Z helper rotations, `model`, and `parents` custom pivot data are intentionally unsupported.

## 中文

- 创建带默认 `player_model.geo.png` 纹理的 `player_model.geo.json` 玩家动画项目。
- 创建龙核玩家模型兼容项目：一个保留 PAL 骨骼名，另一个使用 `Body_Lower`、`Body`、`Left_Arm_Lower`、`Right_Hand` 等龙核组名。
- 导入传统 PAL bend `animations` JSON 或 Emotecraft `emote` JSON。
- 导入基于龙核友好参考模型制作的旧动画，并转换为 PAL。
- 导出传统 PAL bend `animations` JSON 或 Emotecraft `emote` JSON。
- 仅转换 `*_bend.rotation.x` 与 PAL 原生 `bend`。不支持 `*_bend.rotation.y/z`、`model`、`parents` 自定义枢轴数据。

## Notes

The preview model is a helper rig for editing bends in Blockbench. Exported PAL animations use the native `bend` field for X-axis bending.
