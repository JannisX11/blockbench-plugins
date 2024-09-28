# GeckoLib Animation Utils Changelog

## Legend
💥 = Breaking Change<br/>
🚀 = New Feature<br/>
🐞 = Bug Fix<br/>
🦎 = Non-user-facing Change

## 3.2
- 🚀 Auto-export the particle texture entry in the textures list for block/item display jsons if not defined
- 🚀 Auto-convert bedrock animation jsons to GeckoLib-supported animation jsons when exporting
- 🐞 Fix the particle texture entry not exporting if the name doesn't end in .png
- 🐞 Fixed item_display_transforms being shipped with .geo jsons for non-bedrock models
- 🐞 Forced known forward-compatible versions to export as 1.12.0 to maintain compatibility while we work out a better system

## 3.1.1
- 🐞 Fix the item display settings being cleared if saving as an entity type model
- 🐞 Fix the armour template having swapped pivot points on the legs
- 🐞 Fix incorrect importing of loop type. Closes [#591](https://github.com/bernie-g/geckolib/issues/591)

## 3.1.0
- 💥 Update to new plugin format, bump minimum Blockbench version to 4.8.0
- 🚀 Added support for "Reverse Keyframes" action
- 🦎 Ported plugin to TypeScript, added developer [README](./README.md) and a few unit tests

## 3.0.7
- 🐞 Don't save `geckolib_format_version` in animation json for bedrock models
- 🐞 Remove hold menu hiding code that was causing issues for other plugins (regression of an old bug occurred in version 3.0.6)
- 🦎 Disable minification of JS bundle, fix some build errors on case sensitive filesystems, and upgrade to NodeJS v16.16