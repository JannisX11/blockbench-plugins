# PAL Bend Player Tools

Create a player animation project and convert PlayerAnimationLibrary / Emotecraft player animations in Blockbench.

## English

- Create a `player_model.geo.json` helper-bend project with a default `player_model.geo.png` texture.
- Import traditional PAL bend `animations` JSON or Emotecraft `emote` JSON.
- Export traditional PAL bend `animations` JSON or Emotecraft `emote` JSON.
- Converts only `*_bend.rotation.x` and PAL `bend`. Y/Z helper rotations, `model`, and `parents` custom pivot data are intentionally unsupported.

## 中文

- 创建带默认 `player_model.geo.png` 纹理的 `player_model.geo.json` 玩家动画项目。
- 导入传统 PAL bend `animations` JSON 或 Emotecraft `emote` JSON。
- 导出传统 PAL bend `animations` JSON 或 Emotecraft `emote` JSON。
- 仅转换 `*_bend.rotation.x` 与 PAL 原生 `bend`。不支持 `*_bend.rotation.y/z`、`model`、`parents` 自定义枢轴数据。

## Notes

The preview model is a helper rig for editing bends in Blockbench. Exported PAL animations use the native `bend` field for X-axis bending.
