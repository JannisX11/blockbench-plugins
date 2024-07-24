# GeckoLib Animation Utils Changelog

## Legend
💥 = Breaking Change<br/>
🚀 = New Feature<br/>
🐞 = Bug Fix<br/>
🦎 = Non-user-facing Change

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