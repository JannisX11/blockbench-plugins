# PAL Bend Player Tools

Create a player animation project and convert PlayerAnimationLibrary / Emotecraft player animations in Blockbench.

## English

- Create a `player_model.geo.json` helper-bend project with a default `player_model.geo.png` texture.
- Create DragonCore-compatible player projects: one keeps PAL bone names, and one uses DragonCore group names such as `Body_Lower`, `Body`, `Left_Arm_Lower`, and `Right_Hand`.
- Import traditional PAL bend `animations` JSON or Emotecraft `emote` JSON.
- Import legacy animations authored against the DragonCore-friendly reference model and convert them to PAL.
- Export traditional PAL bend `animations` JSON or Emotecraft `emote` JSON.
- Converts `*_bend.rotation.x/y/z` and PAL `bend`. X-only bend stays in the original scalar PAL format; Y/Z bend is exported as vector bend for PlayerAnimationLibraryMoreRotation.
- Exports DragonCore-friendly parented projects as flat PAL bone animations by baking the current Blockbench hierarchy and pivots.
- Imports flat PAL/emote back into parented projects by unbaking it into local Blockbench bone tracks.
- Converts legacy DragonCore-authored animations into the current project rig before loading them.

## 中文

- 创建带默认 `player_model.geo.png` 纹理的 `player_model.geo.json` 玩家动画项目。
- 创建龙核玩家模型兼容项目：一个保留 PAL 骨骼名，另一个使用 `Body_Lower`、`Body`、`Left_Arm_Lower`、`Right_Hand` 等龙核组名。
- 导入传统 PAL bend `animations` JSON 或 Emotecraft `emote` JSON。
- 导入基于龙核友好参考模型制作的旧动画，并转换为 PAL。
- 导出传统 PAL bend `animations` JSON 或 Emotecraft `emote` JSON。
- 转换 `*_bend.rotation.x/y/z` 与 PAL 原生 `bend`。只有 X 轴时保留原版 scalar PAL 格式；存在 Y/Z 时导出给 PlayerAnimationLibraryMoreRotation 使用的向量 bend。
- 导出时会把当前 Blockbench 项目的父子关系和 pivot 烘焙成平铺 PAL 骨骼动画。
- 导入平铺 PAL/emote 到带父子关系的项目时，会反向解烘焙成本地 Blockbench 骨骼轨道。
- 导入龙核旧动画时会先转换到当前项目的 rig，再加载到时间轴。

## Notes

The preview model is a helper rig for editing bends in Blockbench. Exported PAL animations use native `bend`; Emotecraft export still writes the single X-axis bend value supported by emote JSON.
