"use strict";
(() => {
  // src/i18n.ts
  var EN = {
    "dap.format.name": "Java Display Animation",
    "dap.format.description": "Create frame-baked keyframe animation projects for Minecraft Java Edition",
    "dap.property.name": "Display Context Animation",
    "dap.property.description": "Choose whether each item display context plays the frame animation",
    "dap.panel.name": "Display Animation Preview",
    "dap.panel.slot": "Display Context",
    "dap.panel.animate": "Animate Current Display Context",
    "dap.panel.animate_hint": "Enabled contexts follow custom_model_data frames; disabled contexts stay on frame 0.",
    "dap.panel.play": "Play / Pause",
    "dap.panel.play_disabled": "Animation is disabled for this display context.",
    "dap.panel.loop": "Loop Playback",
    "dap.panel.low_fps": "Low FPS",
    "dap.panel.low_fps_hint": "Preview at the animation snapping rate to simulate non-interpolated in-game playback",
    "dap.action.open": "Open Display Animation Preview",
    "dap.action.open_desc": "Preview animation by display context with independent playback controls",
    "dap.action.bounds": "Check Animation Model Bounds",
    "dap.action.bounds_desc": "List baked frames outside Minecraft's -16 to 32 model limits",
    "dap.action.export": "Export Resource Pack and Datapack",
    "dap.action.export_desc": "Bake the animation and generate a complete resource pack and animation-driving datapack",
    "dap.export.title": "Export Resource Pack and Datapack",
    "dap.export.output": "Export Contents",
    "dap.export.pack_name": "Pack Name",
    "dap.export.asset_namespace": "Asset Namespace",
    "dap.export.item_model": "Item Model Name",
    "dap.export.base_item": "Mapped Item",
    "dap.export.display_name": "Item Display Name",
    "dap.export.data_namespace": "Datapack Namespace",
    "dap.export.frame_objective": "Frame Scoreboard",
    "dap.export.mode_objective": "Mode Scoreboard",
    "dap.export.playing_tag": "Playback Tag",
    "dap.export.mode.both_default": "Resource Pack + Datapack (Shared Root)",
    "dap.export.mode.both_separate": "Resource Pack + Datapack (Separate Parents)",
    "dap.export.mode.resource_only": "Resource Pack Only",
    "dap.export.mode.datapack_only": "Datapack Only",
    "dap.export.cancel": "Cancel",
    "dap.export.cancel_export": "Cancel Export",
    "dap.export.export_anyway": "Export Anyway",
    "dap.export.warnings_title": "Review Export Warnings",
    "dap.export.cancelled": "Export cancelled; no files were generated",
    "dap.export.preparing_files": "Warnings confirmed; preparing pack files\u2026",
    "dap.export.overwrite": "Overwrite and Export",
    "dap.export.resource_pack": "Resource Pack",
    "dap.export.datapack": "Datapack",
    "dap.export.pick_shared": "Select export root (creates resource-packs/{pack}/ and datapacks/{pack}/)",
    "dap.export.pick_resource": "Select resource-pack parent folder (creates {pack}/)",
    "dap.export.pick_datapack": "Select datapack parent folder (creates {pack}/)",
    "dap.export.baking": "Baking {frames} frames at {fps} FPS\u2026",
    "dap.export.failed": "Export Failed",
    "dap.export.no_frames": "No frames were baked. Make sure the animation contains keyframes.",
    "dap.export.resampled_title": "Resampled to the Game Frame Rate",
    "dap.export.resampled_message": "The animation snapping rate is {source_fps} FPS, while Minecraft displays at most {game_fps} frames per second.\n\nThis export will use {frames} frames at {game_fps} FPS to preserve its duration.",
    "dap.export.texture_mismatch_title": "Texture Resolution Mismatch",
    "dap.export.texture_mismatch": "Project UV resolution is {project_width}\xD7{project_height}, but these textures use different dimensions:\n\n{textures}\n\nExported UVs may be offset. Update File \u2192 Project Settings before exporting.",
    "dap.export.bounds_title": "Some Frames Exceed Model Bounds",
    "dap.export.resource_description": "{name} ({frames} frames @ {fps} FPS)",
    "dap.export.datapack_description": "Frame animation driver for {name} ({frames} frames)",
    "dap.export.complete": "Export Complete",
    "dap.export.locations": "Verified and wrote {count} files.\n\n{locations}",
    "dap.export.optimization": "Space optimization: sampled {sampled} frames, wrote {unique} unique models, and deduplicated {duplicates} frames.\nModel JSON: {before} \u2192 {after}.",
    "dap.export.omitted": "Omitted {faces} untextured faces and removed {elements} elements without visible faces.",
    "dap.export.commands": "In-game commands:",
    "dap.export.write_error": "An error occurred while writing files:\n{error}",
    "dap.export.target_exists": "Target Pack Already Exists",
    "dap.export.target_exists_message": "Continuing overwrites matching files but does not delete other files:\n\n{summary}",
    "dap.export.file_count": "{count} files",
    "dap.export.prepare_failed": "Export Preparation Failed",
    "dap.export.busy": "The previous export is still running",
    "dap.export.no_animation_title": "No Animation to Export",
    "dap.export.no_animation_message": "Create an animation with keyframes before exporting.",
    "dap.export.fps_exact": "Exports {frames} frames at 20 FPS, one frame per game tick.",
    "dap.export.fps_resample": "The current snapping rate is {source_fps} FPS ({source_frames} source samples). Export resamples to {game_fps} FPS ({game_frames} frames) while preserving duration.",
    "dap.export.folder_help": "On macOS, Open selects a parent folder; the plugin then creates <pack name>/ inside it.<br>The default mode creates resource-packs/<pack name>/ and datapacks/<pack name>/.",
    "dap.bounds.no_animation": "No animation is available to check",
    "dap.bounds.passed_title": "Model Bounds Check Passed",
    "dap.bounds.passed_message": "Checked {frames} frames at {fps} FPS. All coordinates are within -16 to 32.",
    "dap.bounds.frame": "Frame {frame}: {parts}, {field}.{axis} = {value}",
    "dap.bounds.parts_many": "{names} and {count} parts",
    "dap.bounds.summary": "Parts exceed Minecraft model bounds in {frames} frames (every axis must remain between -16 and 32).",
    "dap.bounds.guidance": "Out-of-range frames may render offset or disappear. Use the datapack next/prev functions to inspect these frames, then reduce the affected motion in Blockbench:",
    "dap.bounds.omitted": "\u2026and {count} more out-of-range frames.",
    "dap.rollback.title": "Incomplete Rollback \u2014 Do Not Save",
    "dap.rollback.message": "The keyframe count changed after baking: {before} before, {after} now ({lost} missing).\n\nUndo immediately with Ctrl+Z, or close without saving and reopen the file.",
    "dap.permission.export": "Resource-pack and datapack export requires access to the selected folder",
    "dap.error.write_permission": "Write permission was not granted; no files were generated",
    "dap.error.read_permission": "Read permission was not granted; export cannot continue",
    "dap.error.file_not_written": "File was not written: {path}",
    "dap.error.file_verify": "Written file failed content verification: {path}",
    "dap.error.manifest_not_written": "Export manifest was not written: {path}",
    "dap.error.manifest_verify": "Written export manifest failed verification: {path}",
    "dap.error.no_models": "No models are available for the item definition",
    "dap.error.external_texture": 'Texture "{label}" still references external atlas "{value}". Minecraft 26.2 item models cannot mix item and block atlases.',
    "dap.error.texture_not_generated": "Model references a texture that was not generated: {value}",
    "dap.datapack.loaded": "Datapack loaded. Run /function {namespace}:give to get the animated item.",
    "dap.datapack.item_given": "Animated item given. Use play_loop, play_once, or next/prev while holding it.",
    "dap.datapack.hold_item": "Hold the animated item in your main hand first.",
    "dap.datapack.loop_started": "Loop playback started (20 FPS, frames 0-{last_frame}).",
    "dap.datapack.once_started": "Single playback started and will stop on frame {last_frame}.",
    "dap.datapack.current_frame": "Current frame: ",
    "dap.datapack.reset": "Reset to frame 0.",
    "dap.datapack.stopped": "Playback stopped on the current frame.",
    "dap.slot.thirdperson_righthand": "Third Person - Right Hand",
    "dap.slot.thirdperson_lefthand": "Third Person - Left Hand",
    "dap.slot.firstperson_righthand": "First Person - Right Hand",
    "dap.slot.firstperson_lefthand": "First Person - Left Hand",
    "dap.slot.head": "Head",
    "dap.slot.gui": "GUI / Inventory",
    "dap.slot.ground": "Ground",
    "dap.slot.fixed": "Item Frame",
    "dap.slot.embedded": "Embedded",
    "dap.slot.on_shelf": "On Shelf"
  };
  var ZH = {
    "dap.format.name": "Java \u9010\u5E27\u663E\u793A\u52A8\u753B",
    "dap.format.description": "\u4E3A Minecraft Java \u7248\u521B\u5EFA\u9010\u5E27\u51E0\u4F55\u70D8\u7119\u5173\u952E\u5E27\u52A8\u753B\u5DE5\u7A0B",
    "dap.property.name": "\u663E\u793A\u4F4D\u7F6E\u52A8\u753B",
    "dap.property.description": "\u5206\u522B\u51B3\u5B9A\u6BCF\u4E2A\u7269\u54C1\u663E\u793A\u4F4D\u7F6E\u662F\u5426\u64AD\u653E\u9010\u5E27\u52A8\u753B",
    "dap.panel.name": "\u663E\u793A\u4F4D\u7F6E\u52A8\u753B\u9884\u89C8",
    "dap.panel.slot": "\u663E\u793A\u4F4D\u7F6E",
    "dap.panel.animate": "\u5F53\u524D\u663E\u793A\u4F4D\u7F6E\u64AD\u653E\u52A8\u753B",
    "dap.panel.animate_hint": "\u542F\u7528\u540E\u968F custom_model_data \u64AD\u653E\u9010\u5E27\u52A8\u753B\uFF0C\u5173\u95ED\u65F6\u56FA\u5B9A\u4F7F\u7528\u7B2C 0 \u5E27\u3002",
    "dap.panel.play": "\u64AD\u653E / \u6682\u505C",
    "dap.panel.play_disabled": "\u5F53\u524D\u663E\u793A\u4F4D\u7F6E\u5DF2\u5173\u95ED\u52A8\u753B\u3002",
    "dap.panel.loop": "\u5FAA\u73AF\u64AD\u653E",
    "dap.panel.low_fps": "\u4F4E\u5E27",
    "dap.panel.low_fps_hint": "\u6309\u52A8\u753B\u5438\u9644\u5E27\u7387\u9010\u5E27\u9884\u89C8\uFF0C\u6A21\u62DF\u6E38\u620F\u5185\u65E0\u63D2\u503C\u64AD\u653E",
    "dap.action.open": "\u6253\u5F00\u663E\u793A\u4F4D\u7F6E\u52A8\u753B\u9884\u89C8",
    "dap.action.open_desc": "\u6309\u663E\u793A\u4F4D\u7F6E\u9884\u89C8\u52A8\u753B\u5E76\u63D0\u4F9B\u72EC\u7ACB\u64AD\u653E\u63A7\u4EF6",
    "dap.action.bounds": "\u68C0\u67E5\u52A8\u753B\u6A21\u578B\u8303\u56F4",
    "dap.action.bounds_desc": "\u5217\u51FA\u70D8\u7119\u540E\u8D85\u51FA Minecraft -16 \u5230 32 \u6A21\u578B\u9650\u5236\u7684\u5E27",
    "dap.action.export": "\u5BFC\u51FA\u8D44\u6E90\u5305\u548C\u6570\u636E\u5305",
    "dap.action.export_desc": "\u70D8\u7119\u52A8\u753B\u5E76\u751F\u6210\u5B8C\u6574\u8D44\u6E90\u5305\u548C\u52A8\u753B\u9A71\u52A8\u6570\u636E\u5305",
    "dap.export.title": "\u5BFC\u51FA\u8D44\u6E90\u5305\u548C\u6570\u636E\u5305",
    "dap.export.output": "\u5BFC\u51FA\u5185\u5BB9",
    "dap.export.pack_name": "\u5305\u540D",
    "dap.export.asset_namespace": "\u8D44\u6E90\u547D\u540D\u7A7A\u95F4",
    "dap.export.item_model": "\u7269\u54C1\u6A21\u578B\u540D",
    "dap.export.base_item": "\u6620\u5C04\u7269\u54C1",
    "dap.export.display_name": "\u7269\u54C1\u663E\u793A\u540D",
    "dap.export.data_namespace": "\u6570\u636E\u5305\u547D\u540D\u7A7A\u95F4",
    "dap.export.frame_objective": "\u5E27\u8BB0\u5206\u677F",
    "dap.export.mode_objective": "\u6A21\u5F0F\u8BB0\u5206\u677F",
    "dap.export.playing_tag": "\u64AD\u653E\u6807\u8BB0",
    "dap.export.mode.both_default": "\u8D44\u6E90\u5305 + \u6570\u636E\u5305\uFF08\u5171\u7528\u6839\u76EE\u5F55\uFF09",
    "dap.export.mode.both_separate": "\u8D44\u6E90\u5305 + \u6570\u636E\u5305\uFF08\u5206\u522B\u9009\u62E9\u7236\u76EE\u5F55\uFF09",
    "dap.export.mode.resource_only": "\u4EC5\u8D44\u6E90\u5305",
    "dap.export.mode.datapack_only": "\u4EC5\u6570\u636E\u5305",
    "dap.export.cancel": "\u53D6\u6D88",
    "dap.export.cancel_export": "\u53D6\u6D88\u5BFC\u51FA",
    "dap.export.export_anyway": "\u4ECD\u7136\u5BFC\u51FA",
    "dap.export.warnings_title": "\u8BF7\u786E\u8BA4\u5BFC\u51FA\u8B66\u544A",
    "dap.export.cancelled": "\u5DF2\u53D6\u6D88\u5BFC\u51FA\uFF0C\u6CA1\u6709\u751F\u6210\u6587\u4EF6",
    "dap.export.preparing_files": "\u5DF2\u786E\u8BA4\u8B66\u544A\uFF0C\u6B63\u5728\u751F\u6210\u5305\u6587\u4EF6\u2026",
    "dap.export.overwrite": "\u8986\u76D6\u5E76\u5BFC\u51FA",
    "dap.export.resource_pack": "\u8D44\u6E90\u5305",
    "dap.export.datapack": "\u6570\u636E\u5305",
    "dap.export.pick_shared": "\u9009\u62E9\u5BFC\u51FA\u6839\u76EE\u5F55\uFF08\u5C06\u521B\u5EFA resource-packs/{pack}/ \u548C datapacks/{pack}/\uFF09",
    "dap.export.pick_resource": "\u9009\u62E9\u8D44\u6E90\u5305\u7236\u76EE\u5F55\uFF08\u5C06\u521B\u5EFA {pack}/\uFF09",
    "dap.export.pick_datapack": "\u9009\u62E9\u6570\u636E\u5305\u7236\u76EE\u5F55\uFF08\u5C06\u521B\u5EFA {pack}/\uFF09",
    "dap.export.baking": "\u6B63\u5728\u4EE5 {fps} FPS \u70D8\u7119 {frames} \u5E27\u2026",
    "dap.export.failed": "\u5BFC\u51FA\u5931\u8D25",
    "dap.export.no_frames": "\u6CA1\u6709\u70D8\u7119\u51FA\u4EFB\u4F55\u5E27\u3002\u8BF7\u786E\u8BA4\u52A8\u753B\u4E2D\u5305\u542B\u5173\u952E\u5E27\u3002",
    "dap.export.resampled_title": "\u5DF2\u91CD\u91C7\u6837\u4E3A\u6E38\u620F\u5E27\u7387",
    "dap.export.resampled_message": "\u52A8\u753B\u5438\u9644\u5E27\u7387\u4E3A {source_fps} FPS\uFF0C\u800C Minecraft \u6BCF\u79D2\u6700\u591A\u663E\u793A {game_fps} \u5E27\u3002\n\n\u672C\u6B21\u5BFC\u51FA\u5C06\u4F7F\u7528 {game_fps} FPS \u7684 {frames} \u5E27\uFF0C\u5E76\u4FDD\u6301\u539F\u52A8\u753B\u65F6\u957F\u3002",
    "dap.export.texture_mismatch_title": "\u7EB9\u7406\u5206\u8FA8\u7387\u4E0D\u4E00\u81F4",
    "dap.export.texture_mismatch": "\u5DE5\u7A0B UV \u5206\u8FA8\u7387\u4E3A {project_width}\xD7{project_height}\uFF0C\u4F46\u4EE5\u4E0B\u7EB9\u7406\u4F7F\u7528\u4E86\u4E0D\u540C\u5C3A\u5BF8\uFF1A\n\n{textures}\n\n\u5BFC\u51FA\u7684 UV \u53EF\u80FD\u504F\u79FB\u3002\u8BF7\u5728\u5BFC\u51FA\u524D\u66F4\u65B0\u201C\u6587\u4EF6 \u2192 \u9879\u76EE\u8BBE\u7F6E\u201D\u3002",
    "dap.export.bounds_title": "\u90E8\u5206\u5E27\u8D85\u51FA\u6A21\u578B\u8303\u56F4",
    "dap.export.resource_description": "{name}\uFF08{frames} \u5E27 @ {fps} FPS\uFF09",
    "dap.export.datapack_description": "{name} \u7684\u9010\u5E27\u52A8\u753B\u9A71\u52A8\uFF08{frames} \u5E27\uFF09",
    "dap.export.complete": "\u5BFC\u51FA\u5B8C\u6210",
    "dap.export.locations": "\u5DF2\u9A8C\u8BC1\u5E76\u5199\u5165 {count} \u4E2A\u6587\u4EF6\u3002\n\n{locations}",
    "dap.export.optimization": "\u7A7A\u95F4\u4F18\u5316\uFF1A\u91C7\u6837 {sampled} \u5E27\uFF0C\u5199\u5165 {unique} \u4E2A\u552F\u4E00\u6A21\u578B\uFF0C\u53BB\u91CD {duplicates} \u5E27\u3002\n\u6A21\u578B JSON\uFF1A{before} \u2192 {after}\u3002",
    "dap.export.omitted": "\u5DF2\u5FFD\u7565 {faces} \u4E2A\u672A\u8D34\u56FE\u9762\uFF0C\u5E76\u79FB\u9664 {elements} \u4E2A\u6CA1\u6709\u53EF\u89C1\u9762\u7684\u5143\u7D20\u3002",
    "dap.export.commands": "\u6E38\u620F\u5185\u547D\u4EE4\uFF1A",
    "dap.export.write_error": "\u5199\u5165\u6587\u4EF6\u65F6\u53D1\u751F\u9519\u8BEF\uFF1A\n{error}",
    "dap.export.target_exists": "\u76EE\u6807\u5305\u5DF2\u5B58\u5728",
    "dap.export.target_exists_message": "\u7EE7\u7EED\u64CD\u4F5C\u4F1A\u8986\u76D6\u540C\u540D\u6587\u4EF6\uFF0C\u4F46\u4E0D\u4F1A\u5220\u9664\u5176\u4ED6\u6587\u4EF6\uFF1A\n\n{summary}",
    "dap.export.file_count": "{count} \u4E2A\u6587\u4EF6",
    "dap.export.prepare_failed": "\u5BFC\u51FA\u51C6\u5907\u5931\u8D25",
    "dap.export.busy": "\u4E0A\u4E00\u6B21\u5BFC\u51FA\u4ECD\u5728\u8FDB\u884C\u4E2D",
    "dap.export.no_animation_title": "\u6CA1\u6709\u53EF\u5BFC\u51FA\u7684\u52A8\u753B",
    "dap.export.no_animation_message": "\u8BF7\u5148\u521B\u5EFA\u5305\u542B\u5173\u952E\u5E27\u7684\u52A8\u753B\u3002",
    "dap.export.fps_exact": "\u5C06\u4EE5 20 FPS \u5BFC\u51FA {frames} \u5E27\uFF0C\u6BCF\u4E2A\u6E38\u620F\u523B\u5BF9\u5E94\u4E00\u5E27\u3002",
    "dap.export.fps_resample": "\u5F53\u524D\u5438\u9644\u5E27\u7387\u4E3A {source_fps} FPS\uFF08{source_frames} \u4E2A\u6E90\u91C7\u6837\uFF09\u3002\u5BFC\u51FA\u65F6\u5C06\u91CD\u91C7\u6837\u4E3A {game_fps} FPS\uFF08{game_frames} \u5E27\uFF09\uFF0C\u5E76\u4FDD\u6301\u52A8\u753B\u65F6\u957F\u3002",
    "dap.export.folder_help": "\u5728 macOS \u4E0A\uFF0C\u201C\u6253\u5F00\u201D\u7528\u4E8E\u9009\u62E9\u7236\u76EE\u5F55\uFF0C\u63D2\u4EF6\u968F\u540E\u4F1A\u5728\u5176\u4E2D\u521B\u5EFA <\u5305\u540D>/\u3002<br>\u9ED8\u8BA4\u6A21\u5F0F\u4F1A\u521B\u5EFA resource-packs/<\u5305\u540D>/ \u548C datapacks/<\u5305\u540D>/\u3002",
    "dap.bounds.no_animation": "\u6CA1\u6709\u53EF\u68C0\u67E5\u7684\u52A8\u753B",
    "dap.bounds.passed_title": "\u6A21\u578B\u8303\u56F4\u68C0\u67E5\u901A\u8FC7",
    "dap.bounds.passed_message": "\u5DF2\u6309 {fps} FPS \u68C0\u67E5 {frames} \u5E27\uFF0C\u6240\u6709\u5750\u6807\u5747\u5728 -16 \u5230 32 \u8303\u56F4\u5185\u3002",
    "dap.bounds.frame": "\u7B2C {frame} \u5E27\uFF1A{parts}\uFF0C{field}.{axis} = {value}",
    "dap.bounds.parts_many": "{names} \u7B49 {count} \u4E2A\u90E8\u4EF6",
    "dap.bounds.summary": "\u5171\u6709 {frames} \u5E27\u4E2D\u7684\u90E8\u4EF6\u8D85\u51FA Minecraft \u6A21\u578B\u8303\u56F4\uFF08\u6BCF\u4E2A\u5750\u6807\u8F74\u5FC5\u987B\u4F4D\u4E8E -16 \u5230 32 \u4E4B\u95F4\uFF09\u3002",
    "dap.bounds.guidance": "\u8D8A\u754C\u5E27\u53EF\u80FD\u51FA\u73B0\u504F\u79FB\u6216\u6D88\u5931\u3002\u53EF\u4F7F\u7528\u6570\u636E\u5305\u7684 next/prev \u51FD\u6570\u9010\u5E27\u68C0\u67E5\uFF0C\u7136\u540E\u5728 Blockbench \u4E2D\u51CF\u5C0F\u5BF9\u5E94\u52A8\u4F5C\u5E45\u5EA6\uFF1A",
    "dap.bounds.omitted": "\u2026\u2026\u53E6\u6709 {count} \u4E2A\u8D8A\u754C\u5E27\u672A\u663E\u793A\u3002",
    "dap.rollback.title": "\u56DE\u6EDA\u4E0D\u5B8C\u6574\u2014\u2014\u8BF7\u52FF\u4FDD\u5B58",
    "dap.rollback.message": "\u70D8\u7119\u524D\u6709 {before} \u4E2A\u5173\u952E\u5E27\uFF0C\u6062\u590D\u540E\u4E3A {after} \u4E2A\uFF0C\u7F3A\u5C11 {lost} \u4E2A\u3002\n\n\u8BF7\u7ACB\u5373\u6309 Ctrl+Z \u64A4\u9500\uFF0C\u6216\u4E0D\u4FDD\u5B58\u5173\u95ED\u6587\u4EF6\u540E\u91CD\u65B0\u6253\u5F00\u3002",
    "dap.permission.export": "\u5BFC\u51FA\u8D44\u6E90\u5305\u548C\u6570\u636E\u5305\u9700\u8981\u8BBF\u95EE\u6240\u9009\u6587\u4EF6\u5939",
    "dap.error.write_permission": "\u672A\u6388\u4E88\u5199\u5165\u6743\u9650\uFF0C\u6CA1\u6709\u751F\u6210\u4EFB\u4F55\u6587\u4EF6",
    "dap.error.read_permission": "\u672A\u6388\u4E88\u8BFB\u53D6\u6743\u9650\uFF0C\u65E0\u6CD5\u7EE7\u7EED\u5BFC\u51FA",
    "dap.error.file_not_written": "\u6587\u4EF6\u672A\u6210\u529F\u5199\u5165\uFF1A{path}",
    "dap.error.file_verify": "\u5199\u5165\u540E\u7684\u6587\u4EF6\u5185\u5BB9\u6821\u9A8C\u5931\u8D25\uFF1A{path}",
    "dap.error.manifest_not_written": "\u5BFC\u51FA\u6E05\u5355\u672A\u6210\u529F\u5199\u5165\uFF1A{path}",
    "dap.error.manifest_verify": "\u5199\u5165\u540E\u7684\u5BFC\u51FA\u6E05\u5355\u6821\u9A8C\u5931\u8D25\uFF1A{path}",
    "dap.error.no_models": "\u6CA1\u6709\u53EF\u7528\u4E8E\u7269\u54C1\u5B9A\u4E49\u7684\u6A21\u578B",
    "dap.error.external_texture": "\u7EB9\u7406\u201C{label}\u201D\u4ECD\u5F15\u7528\u5916\u90E8\u56FE\u96C6\u201C{value}\u201D\u3002Minecraft 26.2 \u7269\u54C1\u6A21\u578B\u4E0D\u80FD\u6DF7\u7528\u7269\u54C1\u4E0E\u65B9\u5757\u56FE\u96C6\u3002",
    "dap.error.texture_not_generated": "\u6A21\u578B\u5F15\u7528\u4E86\u672A\u751F\u6210\u7684\u7EB9\u7406\uFF1A{value}",
    "dap.datapack.loaded": "\u6570\u636E\u5305\u5DF2\u52A0\u8F7D\u3002\u8FD0\u884C /function {namespace}:give \u83B7\u53D6\u52A8\u753B\u7269\u54C1\u3002",
    "dap.datapack.item_given": "\u5DF2\u7ED9\u4E88\u52A8\u753B\u7269\u54C1\u3002\u624B\u6301\u7269\u54C1\u65F6\u53EF\u4F7F\u7528 play_loop\u3001play_once \u6216 next/prev\u3002",
    "dap.datapack.hold_item": "\u8BF7\u5148\u5C06\u52A8\u753B\u7269\u54C1\u62FF\u5728\u4E3B\u624B\u3002",
    "dap.datapack.loop_started": "\u5DF2\u5F00\u59CB\u5FAA\u73AF\u64AD\u653E\uFF0820 FPS\uFF0C\u7B2C 0-{last_frame} \u5E27\uFF09\u3002",
    "dap.datapack.once_started": "\u5DF2\u5F00\u59CB\u5355\u6B21\u64AD\u653E\uFF0C\u5C06\u5728\u7B2C {last_frame} \u5E27\u505C\u6B62\u3002",
    "dap.datapack.current_frame": "\u5F53\u524D\u5E27\uFF1A",
    "dap.datapack.reset": "\u5DF2\u91CD\u7F6E\u5230\u7B2C 0 \u5E27\u3002",
    "dap.datapack.stopped": "\u64AD\u653E\u5DF2\u505C\u6B62\u5E76\u505C\u7559\u5728\u5F53\u524D\u5E27\u3002",
    "dap.slot.thirdperson_righthand": "\u7B2C\u4E09\u4EBA\u79F0-\u53F3\u624B",
    "dap.slot.thirdperson_lefthand": "\u7B2C\u4E09\u4EBA\u79F0-\u5DE6\u624B",
    "dap.slot.firstperson_righthand": "\u7B2C\u4E00\u4EBA\u79F0-\u53F3\u624B",
    "dap.slot.firstperson_lefthand": "\u7B2C\u4E00\u4EBA\u79F0-\u5DE6\u624B",
    "dap.slot.head": "\u5934\u90E8",
    "dap.slot.gui": "GUI/\u80CC\u5305\u56FE\u6807",
    "dap.slot.ground": "\u5730\u9762",
    "dap.slot.fixed": "\u5C55\u793A\u6846",
    "dap.slot.embedded": "\u5185\u5D4C",
    "dap.slot.on_shelf": "\u5C55\u793A\u67B6"
  };
  function registerTranslations() {
    Language.addTranslations("en", EN);
    Language.addTranslations("zh", ZH);
  }
  function isChineseOnlyBuild() {
    return false;
  }
  function tr(key, replacements = {}) {
    const forcedLanguage = false ? null : null;
    let text = forcedLanguage === "zh" ? ZH[key] ?? EN[key] ?? key : tl(key);
    if (text === key) text = EN[key] ?? key;
    for (const [name, value] of Object.entries(replacements)) {
      text = text.split(`{${name}}`).join(String(value));
    }
    return text;
  }

  // src/display-animation-settings.ts
  var DISPLAY_CONTEXTS = [
    { id: "thirdperson_righthand", label: "Third Person - Right Hand", defaultAnimated: false },
    { id: "thirdperson_lefthand", label: "Third Person - Left Hand", defaultAnimated: false },
    { id: "firstperson_righthand", label: "First Person - Right Hand", defaultAnimated: true },
    { id: "firstperson_lefthand", label: "First Person - Left Hand", defaultAnimated: true },
    { id: "head", label: "Head", defaultAnimated: false },
    { id: "gui", label: "GUI / Inventory", defaultAnimated: false },
    { id: "ground", label: "Ground", defaultAnimated: false },
    { id: "fixed", label: "Item Frame", defaultAnimated: false }
  ];
  var PROPERTY_NAME = "display_anim_variants";
  var settingsProperty = null;
  function projectSettings() {
    if (!Project) return {};
    const value = Project[PROPERTY_NAME];
    return value && typeof value === "object" ? value : {};
  }
  function registerDisplayAnimationProperty() {
    if (ModelProject.properties?.[PROPERTY_NAME]) return;
    settingsProperty = new Property(ModelProject, "object", PROPERTY_NAME, {
      default: {},
      label: tr("dap.property.name"),
      description: tr("dap.property.description")
    });
  }
  function unregisterDisplayAnimationProperty() {
    settingsProperty?.delete();
    settingsProperty = null;
  }
  function getDisplayAnimationEnabled(slot) {
    const stored = projectSettings()[slot];
    if (typeof stored?.animated === "boolean") return stored.animated;
    return DISPLAY_CONTEXTS.find((context) => context.id === slot)?.defaultAnimated ?? false;
  }
  function setDisplayAnimationEnabled(slot, animated) {
    if (!Project) return;
    const cleaned = {};
    for (const context of DISPLAY_CONTEXTS) {
      const stored = projectSettings()[context.id];
      if (typeof stored?.animated === "boolean") {
        cleaned[context.id] = { animated: stored.animated };
      }
    }
    cleaned[slot] = { animated };
    Project[PROPERTY_NAME] = cleaned;
    Project.saved = false;
  }
  function configuredDisplayAnimations() {
    return DISPLAY_CONTEXTS.map((context) => ({
      context,
      animated: getDisplayAnimationEnabled(context.id)
    }));
  }

  // src/playback.ts
  var lowFpsPreview = false;
  var onTick = () => {
  };
  var listenersRegistered = false;
  var quantizedPreviewInProgress = false;
  var previewPlaybackTimer = null;
  function getAnimation() {
    return Animation.selected ?? Animation.all[0] ?? null;
  }
  function quantize(time) {
    if (!lowFpsPreview) return time;
    const step = Timeline.getStep();
    if (!step || step <= 0) return time;
    const epsilon = step * 1e-7;
    return Math.floor((time + epsilon) / step) * step;
  }
  function report(time = Timeline.time) {
    const animation = getAnimation();
    if (!animation) return;
    onTick(Math.min(quantize(time), animation.length), animation.length, Timeline.playing);
  }
  function usesPreviewPlaybackDriver() {
    return ["edit", "paint", "display"].includes(Modes.selected.id);
  }
  function isCurrentDisplayAnimationEnabled() {
    return getDisplayAnimationEnabled(DisplayMode.display_slot);
  }
  function previewPlaybackAllowed() {
    return Modes.selected.id !== "display" || isCurrentDisplayAnimationEnabled();
  }
  function stopPreviewPlaybackDriver() {
    if (previewPlaybackTimer !== null) {
      clearInterval(previewPlaybackTimer);
      previewPlaybackTimer = null;
    }
  }
  function drivePreviewPlayback() {
    if (!Timeline.playing || !usesPreviewPlaybackDriver() || !previewPlaybackAllowed()) {
      stopPreviewPlaybackDriver();
      return;
    }
    Timeline.loop();
  }
  function syncPreviewPlaybackDriver() {
    if (Timeline.playing && usesPreviewPlaybackDriver() && previewPlaybackAllowed()) {
      if (previewPlaybackTimer === null) {
        previewPlaybackTimer = setInterval(drivePreviewPlayback, 16);
      }
    } else {
      stopPreviewPlaybackDriver();
    }
  }
  function enforceCurrentDisplayAnimationPolicy() {
    if (Modes.selected.id !== "display" || isCurrentDisplayAnimationEnabled()) {
      syncPreviewPlaybackDriver();
      report();
      return;
    }
    if (Timeline.playing) Timeline.pause();
    seekTo(0);
    stopPreviewPlaybackDriver();
  }
  function handleDisplayFrame() {
    if (quantizedPreviewInProgress) return;
    const animation = getAnimation();
    if (!animation) return;
    const rawTime = Timeline.time;
    const displayTime = Math.min(quantize(rawTime), animation.length);
    if (lowFpsPreview && Timeline.playing && Math.abs(displayTime - rawTime) > 1e-8) {
      quantizedPreviewInProgress = true;
      try {
        Timeline.time = displayTime;
        Animator.preview(true);
      } finally {
        Timeline.time = rawTime;
        quantizedPreviewInProgress = false;
      }
    }
    onTick(displayTime, animation.length, Timeline.playing);
  }
  function handleTimelinePlay() {
    if (!previewPlaybackAllowed()) {
      Timeline.pause();
      Blockbench.showQuickMessage(
        tr("dap.panel.play_disabled"),
        2200
      );
      return;
    }
    syncPreviewPlaybackDriver();
    report();
  }
  function handleTimelinePause() {
    stopPreviewPlaybackDriver();
    if (lowFpsPreview) {
      seekTo(Timeline.time);
    } else {
      report();
    }
  }
  function handleModeSelect() {
    enforceCurrentDisplayAnimationPolicy();
  }
  function initializePlaybackSync() {
    if (listenersRegistered) return;
    Blockbench.on("display_animation_frame", handleDisplayFrame);
    Blockbench.on("timeline_play", handleTimelinePlay);
    Blockbench.on("timeline_pause", handleTimelinePause);
    Blockbench.on("select_mode", handleModeSelect);
    listenersRegistered = true;
    syncPreviewPlaybackDriver();
  }
  function disposePlaybackSync() {
    if (!listenersRegistered) return;
    Blockbench.removeListener("display_animation_frame", handleDisplayFrame);
    Blockbench.removeListener("timeline_play", handleTimelinePlay);
    Blockbench.removeListener("timeline_pause", handleTimelinePause);
    Blockbench.removeListener("select_mode", handleModeSelect);
    stopPreviewPlaybackDriver();
    listenersRegistered = false;
    onTick = () => {
    };
  }
  function isLooping() {
    return BarItems.looped_animation_playback.value;
  }
  function setLooping(value) {
    BarItems.looped_animation_playback.set(value);
  }
  function isLowFpsPreview() {
    return lowFpsPreview;
  }
  function setLowFpsPreview(value) {
    lowFpsPreview = value;
    if (Timeline.playing) {
      handleDisplayFrame();
    } else {
      seekTo(Timeline.time);
    }
  }
  function setTickCallback(cb) {
    onTick = cb;
    report();
  }
  function seekTo(time) {
    const animation = getAnimation();
    if (!animation) return;
    const clamped = Math.min(Math.max(time, 0), animation.length);
    const displayTime = quantize(clamped);
    Timeline.setTime(displayTime);
    Animator.preview();
    onTick(displayTime, animation.length, Timeline.playing);
  }
  function togglePlay() {
    if (!getAnimation()) return;
    if (Modes.selected.id === "display" && !isCurrentDisplayAnimationEnabled()) {
      Blockbench.showQuickMessage(
        tr("dap.panel.play_disabled"),
        2200
      );
      return;
    }
    if (Timeline.playing) {
      Timeline.pause();
    } else {
      Timeline.start();
    }
  }
  function stop() {
    if (Timeline.playing) Timeline.pause();
  }
  function selectAnimationAndReset() {
    const animation = getAnimation();
    if (animation) {
      stop();
      animation.select();
      seekTo(0);
    }
    return animation;
  }

  // src/slot-controller.ts
  var previousModeId = null;
  function enterDisplaySlot(slot) {
    if (Modes.selected.id !== "display") {
      previousModeId = Modes.selected.id;
      Modes.options.display?.select();
    }
    DisplayMode.load(slot);
    enforceCurrentDisplayAnimationPolicy();
  }
  function restorePreviousMode() {
    if (previousModeId) {
      Modes.options[previousModeId]?.select();
    }
    previousModeId = null;
  }
  function listAvailableSlots() {
    return DisplayMode.slots;
  }
  function currentSlot() {
    return DisplayMode.display_slot;
  }

  // src/control-panel.ts
  var panel = null;
  var slotSelectEl = null;
  var sliderEl = null;
  var timeLabelEl = null;
  var playButtonEl = null;
  var animatedCheckboxEl = null;
  var animationSwitchRowEl = null;
  var slotMonitorTimer = null;
  var observedSlot = "";
  var SLOT_LABELS = {
    thirdperson_righthand: "dap.slot.thirdperson_righthand",
    thirdperson_lefthand: "dap.slot.thirdperson_lefthand",
    firstperson_righthand: "dap.slot.firstperson_righthand",
    firstperson_lefthand: "dap.slot.firstperson_lefthand",
    ground: "dap.slot.ground",
    gui: "dap.slot.gui",
    head: "dap.slot.head",
    embedded: "dap.slot.embedded",
    fixed: "dap.slot.fixed",
    on_shelf: "dap.slot.on_shelf"
  };
  function formatTime(t) {
    return t.toFixed(2) + "s";
  }
  function updateControlsUI(time, length, playing) {
    syncDisplayControls();
    if (sliderEl) {
      sliderEl.max = String(length);
      sliderEl.value = String(time);
    }
    if (timeLabelEl) {
      timeLabelEl.innerText = `${formatTime(time)} / ${formatTime(length)}`;
    }
    if (playButtonEl) {
      playButtonEl.innerHTML = `<i class="material-icons">${playing ? "pause" : "play_arrow"}</i>`;
    }
  }
  function refreshModeVisibility() {
    if (animationSwitchRowEl) {
      animationSwitchRowEl.style.display = Modes.selected.id === "display" ? "flex" : "none";
    }
  }
  function refreshPlayButtonState() {
    if (!playButtonEl) return;
    const enabled = Modes.selected.id !== "display" || isCurrentDisplayAnimationEnabled();
    playButtonEl.style.opacity = enabled ? "1" : "0.35";
    playButtonEl.style.cursor = enabled ? "pointer" : "not-allowed";
    playButtonEl.title = enabled ? tr("dap.panel.play") : tr("dap.panel.play_disabled");
  }
  function syncDisplayControls(force = false) {
    refreshModeVisibility();
    const slot = currentSlot();
    if (!force && observedSlot === slot) return;
    observedSlot = slot;
    if (slotSelectEl) slotSelectEl.value = slot;
    if (animatedCheckboxEl) {
      animatedCheckboxEl.checked = getDisplayAnimationEnabled(slot);
    }
    refreshPlayButtonState();
    enforceCurrentDisplayAnimationPolicy();
  }
  function startSlotMonitor() {
    if (slotMonitorTimer !== null) return;
    slotMonitorTimer = setInterval(() => syncDisplayControls(), 150);
  }
  function stopSlotMonitor() {
    if (slotMonitorTimer === null) return;
    clearInterval(slotMonitorTimer);
    slotMonitorTimer = null;
  }
  function buildSlotPicker(container) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "6px";
    row.style.padding = "4px 0";
    row.style.flexWrap = "wrap";
    const label = document.createElement("span");
    label.innerText = tr("dap.panel.slot");
    label.style.fontSize = "11px";
    label.style.whiteSpace = "nowrap";
    label.style.flex = "0 0 auto";
    const select = document.createElement("select");
    select.style.flex = "1 1 120px";
    select.style.minWidth = "0";
    for (const slot of listAvailableSlots()) {
      const option = document.createElement("option");
      option.value = slot;
      option.innerText = SLOT_LABELS[slot] ? tr(SLOT_LABELS[slot]) : slot;
      select.appendChild(option);
    }
    select.value = currentSlot();
    select.onchange = (event) => {
      const slot = event.target.value;
      enterDisplaySlot(slot);
      syncDisplayControls(true);
    };
    slotSelectEl = select;
    row.appendChild(label);
    row.appendChild(select);
    container.appendChild(row);
  }
  function buildAnimationSwitch(container) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "6px";
    row.style.padding = "4px 0";
    row.style.flexWrap = "wrap";
    animationSwitchRowEl = row;
    const animated = document.createElement("input");
    animated.type = "checkbox";
    animated.title = tr("dap.panel.animate_hint");
    animated.onchange = () => {
      const slot = currentSlot();
      setDisplayAnimationEnabled(slot, animated.checked);
      enforceCurrentDisplayAnimationPolicy();
      refreshPlayButtonState();
    };
    animatedCheckboxEl = animated;
    const animatedLabel = document.createElement("span");
    animatedLabel.innerText = tr("dap.panel.animate");
    animatedLabel.style.fontSize = "11px";
    animatedLabel.style.whiteSpace = "nowrap";
    row.appendChild(animated);
    row.appendChild(animatedLabel);
    container.appendChild(row);
    refreshModeVisibility();
    syncDisplayControls(true);
  }
  function buildTransportControls(container) {
    const bar = document.createElement("div");
    bar.style.display = "flex";
    bar.style.alignItems = "center";
    bar.style.gap = "6px";
    bar.style.padding = "4px 0";
    bar.style.flexWrap = "wrap";
    const buttonGroup = document.createElement("div");
    buttonGroup.style.display = "flex";
    buttonGroup.style.alignItems = "center";
    buttonGroup.style.gap = "6px";
    buttonGroup.style.flex = "0 0 auto";
    const playButton = document.createElement("button");
    playButton.innerHTML = '<i class="material-icons">play_arrow</i>';
    playButton.title = tr("dap.panel.play");
    playButton.style.flex = "0 0 auto";
    playButton.onclick = () => togglePlay();
    playButtonEl = playButton;
    refreshPlayButtonState();
    const loopButton = document.createElement("button");
    loopButton.innerHTML = '<i class="material-icons">repeat</i>';
    loopButton.title = tr("dap.panel.loop");
    loopButton.style.flex = "0 0 auto";
    loopButton.style.opacity = isLooping() ? "1" : "0.4";
    loopButton.onclick = () => {
      setLooping(!isLooping());
      loopButton.style.opacity = isLooping() ? "1" : "0.4";
    };
    const lowFpsButton = document.createElement("button");
    lowFpsButton.innerText = tr("dap.panel.low_fps");
    lowFpsButton.title = tr("dap.panel.low_fps_hint");
    lowFpsButton.style.flex = "0 0 auto";
    lowFpsButton.style.whiteSpace = "nowrap";
    lowFpsButton.style.opacity = isLowFpsPreview() ? "1" : "0.4";
    lowFpsButton.onclick = () => {
      setLowFpsPreview(!isLowFpsPreview());
      lowFpsButton.style.opacity = isLowFpsPreview() ? "1" : "0.4";
    };
    const scrubGroup = document.createElement("div");
    scrubGroup.style.display = "flex";
    scrubGroup.style.alignItems = "center";
    scrubGroup.style.gap = "6px";
    scrubGroup.style.flex = "1 1 140px";
    scrubGroup.style.minWidth = "0";
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.001";
    slider.value = "0";
    slider.style.flex = "1 1 auto";
    slider.style.minWidth = "0";
    slider.oninput = (event) => {
      stop();
      seekTo(parseFloat(event.target.value));
      updateControlsUI(parseFloat(event.target.value), parseFloat(slider.max), false);
    };
    sliderEl = slider;
    const timeLabel = document.createElement("span");
    timeLabel.style.fontSize = "11px";
    timeLabel.style.textAlign = "right";
    timeLabel.style.whiteSpace = "nowrap";
    timeLabel.style.flex = "0 0 auto";
    timeLabelEl = timeLabel;
    buttonGroup.appendChild(playButton);
    buttonGroup.appendChild(loopButton);
    buttonGroup.appendChild(lowFpsButton);
    scrubGroup.appendChild(slider);
    scrubGroup.appendChild(timeLabel);
    bar.appendChild(buttonGroup);
    bar.appendChild(scrubGroup);
    container.appendChild(bar);
  }
  function openControlPanel() {
    setTickCallback(updateControlsUI);
    if (panel) {
      const animation2 = selectAnimationAndReset();
      syncDisplayControls(true);
      startSlotMonitor();
      if (animation2) updateControlsUI(0, animation2.length, false);
      return;
    }
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "2px";
    wrapper.style.padding = "0 4px 4px";
    wrapper.style.minWidth = "0";
    buildSlotPicker(wrapper);
    buildAnimationSwitch(wrapper);
    buildTransportControls(wrapper);
    panel = new Panel("display_anim_preview_controls", {
      name: tr("dap.panel.name"),
      icon: "movie",
      growable: true,
      resizable: true,
      // Leave enough height for a third wrapped row.
      default_position: { slot: "left_bar", height: 165, width: 320 }
    });
    panel.node.appendChild(wrapper);
    const animation = selectAnimationAndReset();
    syncDisplayControls(true);
    startSlotMonitor();
    if (animation) updateControlsUI(0, animation.length, false);
  }
  function closeControlPanel() {
    stopSlotMonitor();
    stop();
    restorePreviousMode();
  }
  function disposeControlPanel() {
    closeControlPanel();
    panel?.delete();
    panel = null;
    slotSelectEl = null;
    sliderEl = null;
    timeLabelEl = null;
    playButtonEl = null;
    animatedCheckboxEl = null;
    animationSwitchRowEl = null;
    observedSlot = "";
  }

  // src/display-snapshot.ts
  function cloneCompiledDisplay(display) {
    return display ? JSON.parse(JSON.stringify(display)) : void 0;
  }
  function applyCompiledDisplaySnapshot(json2, display) {
    if (!display) return json2;
    const compiled = JSON.parse(json2);
    compiled.display = display;
    return JSON.stringify(compiled);
  }

  // src/java-block-codec.ts
  function isCompilingCodec(value) {
    return Boolean(
      value && typeof value.compile === "function"
    );
  }
  function resolveJavaBlockCodec() {
    const candidates = [
      typeof Format !== "undefined" ? Format?.codec : void 0,
      typeof Formats !== "undefined" ? Formats.java_block?.codec : void 0,
      typeof Codecs !== "undefined" ? Codecs.java_block : void 0
    ];
    const codec = candidates.find(isCompilingCodec);
    if (!codec) {
      throw new Error(
        "Blockbench's Java block/item model compiler is unavailable. Reload Blockbench and try again."
      );
    }
    return codec;
  }

  // src/bake.ts
  function snapshotCompiledDisplay() {
    try {
      const compiled = JSON.parse(
        resolveJavaBlockCodec().compile({ prevent_dialog: true })
      );
      return cloneCompiledDisplay(compiled.display);
    } catch (err) {
      console.warn("Unable to snapshot current display settings before baking", err);
      return void 0;
    }
  }
  var COORDINATE_MIN = -16;
  var COORDINATE_MAX = 32;
  var AXIS_NAMES = ["x", "y", "z"];
  function applyAnimatedOffsets(node) {
    const offsetRotation = [0, 0, 0];
    const offsetPosition = [0, 0, 0];
    for (const animation of Animator.animations) {
      if (!animation.playing) continue;
      const animator = animation.getBoneAnimator(node);
      if (!animator) continue;
      if (!(node instanceof Group)) continue;
      const multiplier = animation.blend_weight ? Math.max(Animator.MolangParser.parse(animation.blend_weight), 0) : 1;
      if (animator.channels.rotation) {
        const rotation = animator.interpolate("rotation");
        if (rotation instanceof Array) {
          offsetRotation.V3_add(rotation.map((v) => v * multiplier));
        }
      }
      if (animator.channels.position) {
        const position = animator.interpolate("position");
        if (position instanceof Array) {
          offsetPosition.V3_add(position.map((v) => v * multiplier));
        }
      }
    }
    if (node.getTypeBehavior("rotatable") && node.rotation) {
      node.rotation[0] += offsetRotation[0];
      node.rotation[1] += offsetRotation[1];
      node.rotation[2] += offsetRotation[2];
    }
    applyPositionOffset(node, offsetPosition);
  }
  function applyPositionOffset(node, offset) {
    if (node instanceof Group) {
      node.origin?.V3_add(offset);
      for (const child of node.children) {
        applyPositionOffset(child, offset);
      }
      return;
    }
    node.from?.V3_add(offset);
    node.to?.V3_add(offset);
    if (node.origin && node.origin !== node.from) {
      node.origin.V3_add(offset);
    }
  }
  function flattenHierarchy() {
    for (let round = 0; round < 100; round++) {
      const topLevel = Group.all.filter((group) => !(group.parent instanceof Group));
      if (!topLevel.length) return;
      for (const group of topLevel) {
        group.resolve(false);
      }
    }
    console.warn("Bone hierarchy did not fully flatten within the iteration cap");
  }
  function belongsToRoot(node, rootGroupUuid) {
    let current = node;
    while (current && current !== "root") {
      if (current.uuid === rootGroupUuid) return true;
      current = current.parent;
    }
    return false;
  }
  function restrictExportToRoot(rootGroupUuid) {
    if (!rootGroupUuid) return;
    for (const element of Outliner.elements) {
      if (!belongsToRoot(element, rootGroupUuid)) {
        element.export = false;
      }
    }
  }
  function collectOutOfBounds(frame, json2) {
    const hits = [];
    let parsed;
    try {
      parsed = JSON.parse(json2);
    } catch (err) {
      console.error(`Frame ${frame}: compiled model is not valid JSON`, err);
      return hits;
    }
    const elements = parsed.elements ?? [];
    elements.forEach((element, elementIndex) => {
      const fields = [
        ["from", element.from],
        ["to", element.to]
      ];
      for (const [field, values] of fields) {
        if (!(values instanceof Array)) continue;
        values.forEach((value, axis) => {
          if (value >= COORDINATE_MIN && value <= COORDINATE_MAX) return;
          hits.push({
            frame,
            elementIndex,
            elementName: element.name ?? `element ${elementIndex}`,
            axis: AXIS_NAMES[axis] ?? "x",
            field,
            value
          });
        });
      }
    });
    return hits;
  }
  function countKeyframes() {
    let total = 0;
    for (const animation of Animation.all) {
      const animators = animation.animators ?? {};
      for (const key of Object.keys(animators)) {
        total += animators[key]?.keyframes?.length ?? 0;
      }
    }
    return total;
  }
  function bakeFrames(frameCount, fps, rootGroupUuid) {
    const frames = [];
    const outOfBounds = [];
    const originalTime = Timeline.time;
    const originalAnimation = Animation.selected;
    const playingStates = Animation.all.map((animation) => ({
      animation,
      playing: animation.playing
    }));
    const originalSaved = Project?.saved;
    const keyframesBefore = countKeyframes();
    const originalModeId = Modes.selected.id;
    const displaySnapshot = snapshotCompiledDisplay();
    try {
      Modes.options.animate?.select();
      originalAnimation?.select();
      for (let frame = 0; frame < frameCount; frame++) {
        Timeline.setTime(frame / fps);
        Animator.preview();
        const token = Undo.initEdit({
          elements: Outliner.elements.slice(),
          groups: Group.all.slice(),
          outliner: true,
          // Required: Group.resolve() deletes groups whose animators own the keyframes.
          animations: Animation.all.slice()
        });
        try {
          restrictExportToRoot(rootGroupUuid);
          const animatableElements = Outliner.elements.filter(
            (element) => element.constructor.animator
          );
          for (const node of [...Group.all, ...animatableElements]) {
            applyAnimatedOffsets(node);
          }
          flattenHierarchy();
          const json2 = applyCompiledDisplaySnapshot(
            resolveJavaBlockCodec().compile({ prevent_dialog: true }),
            displaySnapshot
          );
          frames.push({ frame, json: json2 });
          outOfBounds.push(...collectOutOfBounds(frame, json2));
        } finally {
          if (Undo.current_save === token) {
            Undo.cancelEdit(true);
          }
        }
      }
    } finally {
      Timeline.setTime(originalTime);
      for (const state of playingStates) {
        state.animation.playing = state.playing;
      }
      originalAnimation?.select();
      Modes.options[originalModeId]?.select();
      Animator.preview();
      if (Project && originalSaved !== void 0) {
        Project.saved = originalSaved;
      }
      const keyframesAfter = countKeyframes();
      if (keyframesAfter !== keyframesBefore) {
        const lost = keyframesBefore - keyframesAfter;
        console.error(
          `Bake rollback incomplete: ${keyframesBefore} keyframes before, ${keyframesAfter} after (lost ${lost})`
        );
        Blockbench.showMessageBox({
          title: tr("dap.rollback.title"),
          message: tr("dap.rollback.message", {
            before: keyframesBefore,
            after: keyframesAfter,
            lost
          }),
          icon: "error"
        });
      }
    }
    return { frames, outOfBounds };
  }
  function frameCountFor(length, fps) {
    return Math.floor(length * fps) + 1;
  }

  // src/bounds-report.ts
  function summarizeByFrame(hits) {
    const byFrame = /* @__PURE__ */ new Map();
    for (const hit of hits) {
      const list = byFrame.get(hit.frame);
      if (list) {
        list.push(hit);
      } else {
        byFrame.set(hit.frame, [hit]);
      }
    }
    const frames = [...byFrame.keys()].sort((a, b) => a - b);
    return frames.map((frame) => {
      const frameHits = byFrame.get(frame) ?? [];
      const worst = frameHits.reduce(
        (acc, hit) => Math.abs(hit.value) > Math.abs(acc.value) ? hit : acc
      );
      const names = [...new Set(frameHits.map((hit) => hit.elementName))];
      const nameList = names.length > 2 ? tr("dap.bounds.parts_many", {
        names: names.slice(0, 2).join(", "),
        count: names.length
      }) : names.join(", ");
      return tr("dap.bounds.frame", {
        frame,
        parts: nameList,
        field: worst.field,
        axis: worst.axis,
        value: worst.value.toFixed(2)
      });
    });
  }
  function describeOutOfBounds(hits) {
    if (!hits.length) return null;
    const lines2 = summarizeByFrame(hits);
    const shown = lines2.slice(0, 12);
    const omitted = lines2.length - shown.length;
    const parts = [
      tr("dap.bounds.summary", { frames: lines2.length }),
      "",
      tr("dap.bounds.guidance"),
      "",
      ...shown
    ];
    if (omitted > 0) {
      parts.push(tr("dap.bounds.omitted", { count: omitted }));
    }
    return parts.join("\n");
  }

  // src/resource-pack.ts
  var RESOURCE_PACK_FORMAT = [88, 0];
  function sanitizeTextureName(name, fallbackIndex) {
    const safe = name.replace(/\.png$/i, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
    return safe || `texture_${fallbackIndex}`;
  }
  function collectTextures() {
    const used = /* @__PURE__ */ new Set();
    return Texture.all.map((texture, index) => {
      const base = sanitizeTextureName(texture.name, index);
      let name = base;
      let suffix = 2;
      while (used.has(name)) {
        name = `${base}_${suffix++}`;
      }
      used.add(name);
      return {
        id: String(texture.id),
        name,
        link: texture.javaTextureLink(),
        dataUrl: texture.getDataURL()
      };
    });
  }
  function rewriteTextureRefs(json2, options, textures) {
    const model = JSON.parse(json2);
    if (!model.textures) return JSON.stringify(model);
    for (const key of Object.keys(model.textures)) {
      const value = model.textures[key];
      if (value.startsWith("#")) continue;
      const valueStem = value.split("/").pop()?.replace(/\.png$/i, "");
      const texture = textures.find(
        (candidate) => candidate.id === key || candidate.link === value || candidate.name === key || candidate.name === valueStem
      );
      if (texture) {
        model.textures[key] = `${options.namespace}:item/${options.itemModel}/${texture.name}`;
      }
    }
    if (!model.textures.particle) {
      const firstTextureKey = Object.keys(model.textures).find(
        (key) => key !== "particle" && !model.textures[key].startsWith("#")
      );
      if (firstTextureKey) model.textures.particle = `#${firstTextureKey}`;
    }
    return JSON.stringify(model);
  }
  function animatedModel(modelPaths) {
    const uniquePaths = [...new Set(modelPaths)];
    if (uniquePaths.length === 1) {
      return { type: "minecraft:model", model: uniquePaths[0] };
    }
    const entries = modelPaths.map((model, frame) => ({
      threshold: frame,
      model: { type: "minecraft:model", model }
    }));
    return {
      type: "minecraft:range_dispatch",
      property: "minecraft:custom_model_data",
      index: 0,
      fallback: { type: "minecraft:model", model: modelPaths[0] },
      entries
    };
  }
  function buildItemDefinition(options, modelPaths) {
    if (!modelPaths.length) throw new Error(tr("dap.error.no_models"));
    let model = animatedModel(modelPaths);
    if (options.displayContexts?.length) {
      const cases = options.displayContexts.map((route) => ({
        when: route.context,
        model: route.animated ? animatedModel(modelPaths) : { type: "minecraft:model", model: modelPaths[0] }
      }));
      model = {
        type: "minecraft:select",
        property: "minecraft:display_context",
        cases,
        fallback: { type: "minecraft:model", model: modelPaths[0] }
      };
    }
    return `${JSON.stringify(
      {
        model,
        // Verified in 26.2: this field prevents equip bobbing on each custom_model_data update.
        swap_animation_scale: 0
      },
      null,
      2
    )}
`;
  }
  function buildPackMcmeta(options) {
    return `${JSON.stringify(
      {
        pack: {
          description: options.description,
          min_format: RESOURCE_PACK_FORMAT,
          max_format: RESOURCE_PACK_FORMAT
        }
      },
      null,
      2
    )}
`;
  }
  function sanitizeTextureRefs(frameJson, options, textureNames) {
    const model = JSON.parse(frameJson);
    const prefix2 = `${options.namespace}:item/${options.itemModel}/`;
    const textures = model.textures ?? {};
    let omittedFaces = 0;
    let omittedElements = 0;
    const validateResolvedTexture = (value, label) => {
      if (!value.startsWith(prefix2)) {
        throw new Error(tr("dap.error.external_texture", { label, value }));
      }
      const stem = value.slice(prefix2.length);
      if (!textureNames.has(stem)) {
        throw new Error(tr("dap.error.texture_not_generated", { value }));
      }
    };
    const resolveTexture = (reference) => {
      let value = reference;
      const visited = /* @__PURE__ */ new Set();
      while (value.startsWith("#")) {
        const key = value.slice(1);
        if (!key || key === "missing" || visited.has(key) || !textures[key]) {
          return null;
        }
        visited.add(key);
        value = textures[key];
      }
      return value;
    };
    for (const [key, rawValue] of Object.entries(textures)) {
      const value = resolveTexture(rawValue);
      if (!value) continue;
      validateResolvedTexture(value, `#${key}`);
    }
    for (const element of model.elements ?? []) {
      for (const [faceName, face] of Object.entries(element.faces ?? {})) {
        const value = face.texture ? resolveTexture(face.texture) : null;
        if (!value) {
          delete element.faces?.[faceName];
          omittedFaces++;
        } else {
          validateResolvedTexture(value, face.texture ?? faceName);
        }
      }
    }
    if (model.elements) {
      model.elements = model.elements.filter((element) => {
        if (Object.keys(element.faces ?? {}).length) return true;
        omittedElements++;
        return false;
      });
    }
    return {
      json: JSON.stringify(model),
      omittedFaces,
      omittedElements
    };
  }
  function buildResourcePack(frames, options) {
    const files = [];
    const assetRoot = `assets/${options.namespace}`;
    const textures = collectTextures();
    const textureNames = new Set(textures.map((texture) => texture.name));
    const modelPaths = [];
    const uniqueModels = /* @__PURE__ */ new Map();
    let sampledFrames = 0;
    let modelBytesBefore = 0;
    let modelBytesAfter = 0;
    let omittedUntexturedFaces = 0;
    let omittedEmptyElements = 0;
    files.push({ path: "pack.mcmeta", content: buildPackMcmeta(options) });
    for (const frame of frames) {
      const rewritten = rewriteTextureRefs(frame.json, options, textures);
      const sanitized = sanitizeTextureRefs(rewritten, options, textureNames);
      omittedUntexturedFaces += sanitized.omittedFaces;
      omittedEmptyElements += sanitized.omittedElements;
      sampledFrames++;
      modelBytesBefore += sanitized.json.length;
      let modelPath = uniqueModels.get(sanitized.json);
      if (!modelPath) {
        const uniqueIndex = uniqueModels.size;
        modelPath = `${options.namespace}:item/${options.itemModel}/generated/model_${uniqueIndex}`;
        uniqueModels.set(sanitized.json, modelPath);
        modelBytesAfter += sanitized.json.length;
        files.push({
          path: `${assetRoot}/models/item/${options.itemModel}/generated/model_${uniqueIndex}.json`,
          content: `${sanitized.json}
`
        });
      }
      modelPaths.push(modelPath);
    }
    files.push({
      path: `${assetRoot}/items/${options.itemModel}.json`,
      content: buildItemDefinition(options, modelPaths)
    });
    for (const texture of textures) {
      files.push({
        path: `${assetRoot}/textures/item/${options.itemModel}/${texture.name}.png`,
        content: texture.dataUrl,
        isImage: true
      });
    }
    return {
      files,
      report: {
        sampledFrames,
        uniqueModels: uniqueModels.size,
        duplicateFrames: sampledFrames - uniqueModels.size,
        modelBytesBefore,
        modelBytesAfter,
        omittedUntexturedFaces,
        omittedEmptyElements
      }
    };
  }

  // src/datapack.ts
  var DATA_PACK_FORMAT = [107, 1];
  function prefix(options) {
    return `{"text":"[${options.packName}] ","color":"gold"}`;
  }
  function tellraw(options, text, color, target = "@s") {
    return `tellraw ${target} [${prefix(options)},{"text":${JSON.stringify(text)},"color":"${color}"}]`;
  }
  function json(value) {
    return `${JSON.stringify(value, null, 2)}
`;
  }
  function lines(...commands) {
    return `${commands.join("\n")}
`;
  }
  function customNameComponent(name) {
    const component = JSON.stringify({ text: name, color: "gold", italic: false }).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `minecraft:custom_name='${component}'`;
  }
  function buildDatapack(options) {
    const {
      dataNamespace: ns,
      frameObjective: frameScore,
      modeObjective: modeScore,
      playingTag: tag,
      frameCount
    } = options;
    const lastFrame = Math.max(frameCount - 1, 0);
    const itemModelId = `${options.assetNamespace}:${options.itemModel}`;
    const heldItem = `*[minecraft:item_model="${itemModelId}"]`;
    const ifHeld = `execute if items entity @s weapon.mainhand ${heldItem} run`;
    const applyFrame = `${ifHeld} item modify entity @s weapon.mainhand ${ns}:set_frame`;
    const files = [];
    const fn = (name, content) => {
      files.push({ path: `data/${ns}/function/${name}.mcfunction`, content });
    };
    files.push({
      path: "pack.mcmeta",
      content: json({
        pack: {
          description: options.description,
          min_format: DATA_PACK_FORMAT,
          max_format: DATA_PACK_FORMAT
        }
      })
    });
    fn(
      "load",
      lines(
        `scoreboard objectives add ${frameScore} dummy`,
        `scoreboard objectives add ${modeScore} dummy`,
        tellraw(options, tr("dap.datapack.loaded", { namespace: ns }), "green", "@a")
      )
    );
    fn(
      "tick",
      lines(
        `execute as @a[tag=${tag}] unless items entity @s weapon.mainhand ${heldItem} run scoreboard players set @s ${modeScore} 0`,
        `execute as @a[tag=${tag}] unless items entity @s weapon.mainhand ${heldItem} run tag @s remove ${tag}`,
        `execute as @a[tag=${tag}] if items entity @s weapon.mainhand ${heldItem} run function ${ns}:_tick_player`
      )
    );
    fn(
      "_tick_player",
      lines(
        `scoreboard players add @s ${frameScore} 1`,
        `execute if score @s ${modeScore} matches 1 if score @s ${frameScore} matches ${frameCount}.. run scoreboard players set @s ${frameScore} 0`,
        `execute if score @s ${modeScore} matches 2 if score @s ${frameScore} matches ${frameCount}.. run scoreboard players set @s ${frameScore} ${lastFrame}`,
        applyFrame,
        `execute if score @s ${modeScore} matches 2 if score @s ${frameScore} matches ${lastFrame} run tag @s remove ${tag}`
      )
    );
    fn(
      "give",
      lines(
        `give @s ${options.baseItem}[minecraft:item_model="${itemModelId}",minecraft:custom_model_data={floats:[0.0]},${customNameComponent(options.itemDisplayName)}]`,
        `scoreboard players set @s ${frameScore} 0`,
        `scoreboard players set @s ${modeScore} 0`,
        `tag @s remove ${tag}`,
        tellraw(options, tr("dap.datapack.item_given"), "green")
      )
    );
    const startGuard = `execute unless items entity @s weapon.mainhand ${heldItem} run`;
    fn(
      "play_loop",
      lines(
        `${startGuard} ${tellraw(options, tr("dap.datapack.hold_item"), "red")}`,
        `${ifHeld} scoreboard players set @s ${frameScore} 0`,
        `${ifHeld} scoreboard players set @s ${modeScore} 1`,
        applyFrame,
        `${ifHeld} tag @s add ${tag}`,
        `${ifHeld} ${tellraw(options, tr("dap.datapack.loop_started", { last_frame: lastFrame }), "green")}`
      )
    );
    fn(
      "play_once",
      lines(
        `${startGuard} ${tellraw(options, tr("dap.datapack.hold_item"), "red")}`,
        `${ifHeld} scoreboard players set @s ${frameScore} 0`,
        `${ifHeld} scoreboard players set @s ${modeScore} 2`,
        applyFrame,
        `${ifHeld} tag @s add ${tag}`,
        `${ifHeld} ${tellraw(options, tr("dap.datapack.once_started", { last_frame: lastFrame }), "green")}`
      )
    );
    const frameReadout = `tellraw @s [${prefix(options)},{"text":${JSON.stringify(tr("dap.datapack.current_frame"))},"color":"gold"},{"score":{"name":"@s","objective":"${frameScore}"},"color":"aqua"}]`;
    fn(
      "next",
      lines(
        `${ifHeld} tag @s remove ${tag}`,
        `${ifHeld} scoreboard players add @s ${frameScore} 1`,
        `${ifHeld} execute if score @s ${frameScore} matches ${frameCount}.. run scoreboard players set @s ${frameScore} 0`,
        applyFrame,
        `${ifHeld} ${frameReadout}`
      )
    );
    fn(
      "prev",
      lines(
        `${ifHeld} tag @s remove ${tag}`,
        `${ifHeld} scoreboard players remove @s ${frameScore} 1`,
        `${ifHeld} execute if score @s ${frameScore} matches ..-1 run scoreboard players set @s ${frameScore} ${lastFrame}`,
        applyFrame,
        `${ifHeld} ${frameReadout}`
      )
    );
    fn(
      "reset",
      lines(
        `${ifHeld} tag @s remove ${tag}`,
        `${ifHeld} scoreboard players set @s ${frameScore} 0`,
        `${ifHeld} scoreboard players set @s ${modeScore} 0`,
        applyFrame,
        `${ifHeld} ${tellraw(options, tr("dap.datapack.reset"), "green")}`
      )
    );
    fn(
      "stop",
      lines(
        `tag @s remove ${tag}`,
        `scoreboard players set @s ${modeScore} 0`,
        tellraw(options, tr("dap.datapack.stopped"), "yellow")
      )
    );
    files.push({
      path: `data/${ns}/item_modifier/set_frame.json`,
      content: json({
        function: "minecraft:set_custom_model_data",
        floats: {
          values: [{ type: "minecraft:score", target: "this", score: frameScore }],
          mode: "replace_all"
        }
      })
    });
    files.push({
      path: "data/minecraft/tags/function/load.json",
      content: json({ values: [`${ns}:load`] })
    });
    files.push({
      path: "data/minecraft/tags/function/tick.json",
      content: json({ values: [`${ns}:tick`] })
    });
    return files;
  }

  // src/file-writer.ts
  var MANIFEST_NAME = ".display-anim-preview-manifest.json";
  function getScopedFs(scopeRoot, prompt) {
    const fs = requireNativeModule("fs", {
      scope: scopeRoot,
      message: tr("dap.permission.export"),
      show_permission_dialog: prompt
    });
    return fs ?? null;
  }
  function getPathModule() {
    return requireNativeModule("path");
  }
  function isSafeGeneratedPath(relativePath) {
    if (!relativePath || relativePath.startsWith("/") || relativePath.includes("..")) {
      return false;
    }
    return relativePath === "pack.mcmeta" || relativePath.startsWith("assets/") || relativePath.startsWith("data/");
  }
  function cleanPreviousGeneratedFiles(fs, pathModule, target) {
    const manifestPath = pathModule.join(target.root, MANIFEST_NAME);
    if (!fs.existsSync(manifestPath)) return;
    let previous = [];
    try {
      const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      if (Array.isArray(parsed.files)) {
        previous = parsed.files.filter((value) => typeof value === "string");
      }
    } catch (err) {
      console.warn("Could not read the previous export manifest; skipping stale-file cleanup", err);
      return;
    }
    const current = new Set(target.files.map((file) => file.path));
    for (const relativePath of previous) {
      if (current.has(relativePath) || !isSafeGeneratedPath(relativePath)) continue;
      const fullPath = pathModule.join(target.root, relativePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  }
  function writePacks(scopeRoot, targets) {
    const fs = getScopedFs(scopeRoot, true);
    if (!fs) {
      throw new Error(tr("dap.error.write_permission"));
    }
    const pathModule = getPathModule();
    let written = 0;
    for (const target of targets) {
      cleanPreviousGeneratedFiles(fs, pathModule, target);
      for (const file of target.files) {
        const fullPath = pathModule.join(target.root, file.path);
        fs.mkdirSync(pathModule.dirname(fullPath), { recursive: true });
        Blockbench.writeFile(fullPath, {
          content: file.content,
          savetype: file.isImage ? "image" : "text"
        });
        if (!fs.existsSync(fullPath)) {
          throw new Error(tr("dap.error.file_not_written", { path: fullPath }));
        }
        if (!file.isImage && fs.readFileSync(fullPath, "utf8") !== file.content) {
          throw new Error(tr("dap.error.file_verify", { path: fullPath }));
        }
        written++;
      }
      const manifestPath = pathModule.join(target.root, MANIFEST_NAME);
      const manifestContent = `${JSON.stringify(
        { version: 1, files: target.files.map((file) => file.path) },
        null,
        2
      )}
`;
      Blockbench.writeFile(manifestPath, {
        content: manifestContent,
        savetype: "text"
      });
      if (!fs.existsSync(manifestPath)) {
        throw new Error(tr("dap.error.manifest_not_written", { path: manifestPath }));
      }
      if (fs.readFileSync(manifestPath, "utf8") !== manifestContent) {
        throw new Error(tr("dap.error.manifest_verify", { path: manifestPath }));
      }
    }
    return written;
  }
  function inspectExisting(scopeRoot, dir) {
    const fs = getScopedFs(scopeRoot, true);
    if (!fs) {
      throw new Error(tr("dap.error.read_permission"));
    }
    if (!fs.existsSync(dir)) return null;
    const pathModule = getPathModule();
    let count = 0;
    const walk = (current) => {
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const child = pathModule.join(current, entry.name);
        if (entry.isDirectory()) {
          walk(child);
        } else {
          count++;
        }
      }
    };
    walk(dir);
    return count;
  }

  // src/vanilla-items.ts
  var VANILLA_ITEM_IDS = [
    "acacia_boat",
    "acacia_button",
    "acacia_chest_boat",
    "acacia_door",
    "acacia_fence",
    "acacia_fence_gate",
    "acacia_hanging_sign",
    "acacia_leaves",
    "acacia_log",
    "acacia_planks",
    "acacia_pressure_plate",
    "acacia_sapling",
    "acacia_shelf",
    "acacia_sign",
    "acacia_slab",
    "acacia_stairs",
    "acacia_trapdoor",
    "acacia_wood",
    "activator_rail",
    "air",
    "allay_spawn_egg",
    "allium",
    "amethyst_block",
    "amethyst_cluster",
    "amethyst_shard",
    "ancient_debris",
    "andesite",
    "andesite_slab",
    "andesite_stairs",
    "andesite_wall",
    "angler_pottery_sherd",
    "anvil",
    "apple",
    "archer_pottery_sherd",
    "armadillo_scute",
    "armadillo_spawn_egg",
    "armor_stand",
    "arms_up_pottery_sherd",
    "arrow",
    "axolotl_bucket",
    "axolotl_spawn_egg",
    "azalea",
    "azalea_leaves",
    "azure_bluet",
    "baked_potato",
    "bamboo",
    "bamboo_block",
    "bamboo_button",
    "bamboo_chest_raft",
    "bamboo_door",
    "bamboo_fence",
    "bamboo_fence_gate",
    "bamboo_hanging_sign",
    "bamboo_mosaic",
    "bamboo_mosaic_slab",
    "bamboo_mosaic_stairs",
    "bamboo_planks",
    "bamboo_pressure_plate",
    "bamboo_raft",
    "bamboo_shelf",
    "bamboo_sign",
    "bamboo_slab",
    "bamboo_stairs",
    "bamboo_trapdoor",
    "barrel",
    "barrier",
    "basalt",
    "bat_spawn_egg",
    "beacon",
    "bedrock",
    "bee_nest",
    "bee_spawn_egg",
    "beef",
    "beehive",
    "beetroot",
    "beetroot_seeds",
    "beetroot_soup",
    "bell",
    "big_dripleaf",
    "birch_boat",
    "birch_button",
    "birch_chest_boat",
    "birch_door",
    "birch_fence",
    "birch_fence_gate",
    "birch_hanging_sign",
    "birch_leaves",
    "birch_log",
    "birch_planks",
    "birch_pressure_plate",
    "birch_sapling",
    "birch_shelf",
    "birch_sign",
    "birch_slab",
    "birch_stairs",
    "birch_trapdoor",
    "birch_wood",
    "black_banner",
    "black_bed",
    "black_bundle",
    "black_candle",
    "black_carpet",
    "black_concrete",
    "black_concrete_powder",
    "black_dye",
    "black_glazed_terracotta",
    "black_harness",
    "black_shulker_box",
    "black_stained_glass",
    "black_stained_glass_pane",
    "black_terracotta",
    "black_wool",
    "blackstone",
    "blackstone_slab",
    "blackstone_stairs",
    "blackstone_wall",
    "blade_pottery_sherd",
    "blast_furnace",
    "blaze_powder",
    "blaze_rod",
    "blaze_spawn_egg",
    "blue_banner",
    "blue_bed",
    "blue_bundle",
    "blue_candle",
    "blue_carpet",
    "blue_concrete",
    "blue_concrete_powder",
    "blue_dye",
    "blue_egg",
    "blue_glazed_terracotta",
    "blue_harness",
    "blue_ice",
    "blue_orchid",
    "blue_shulker_box",
    "blue_stained_glass",
    "blue_stained_glass_pane",
    "blue_terracotta",
    "blue_wool",
    "bogged_spawn_egg",
    "bolt_armor_trim_smithing_template",
    "bone",
    "bone_block",
    "bone_meal",
    "book",
    "bookshelf",
    "bordure_indented_banner_pattern",
    "bow",
    "bowl",
    "brain_coral",
    "brain_coral_block",
    "brain_coral_fan",
    "bread",
    "breeze_rod",
    "breeze_spawn_egg",
    "brewer_pottery_sherd",
    "brewing_stand",
    "brick",
    "brick_slab",
    "brick_stairs",
    "brick_wall",
    "bricks",
    "brown_banner",
    "brown_bed",
    "brown_bundle",
    "brown_candle",
    "brown_carpet",
    "brown_concrete",
    "brown_concrete_powder",
    "brown_dye",
    "brown_egg",
    "brown_glazed_terracotta",
    "brown_harness",
    "brown_mushroom",
    "brown_mushroom_block",
    "brown_shulker_box",
    "brown_stained_glass",
    "brown_stained_glass_pane",
    "brown_terracotta",
    "brown_wool",
    "brush",
    "bubble_coral",
    "bubble_coral_block",
    "bubble_coral_fan",
    "bucket",
    "budding_amethyst",
    "bundle",
    "burn_pottery_sherd",
    "bush",
    "cactus",
    "cactus_flower",
    "cake",
    "calcite",
    "calibrated_sculk_sensor",
    "camel_husk_spawn_egg",
    "camel_spawn_egg",
    "campfire",
    "candle",
    "carrot",
    "carrot_on_a_stick",
    "cartography_table",
    "carved_pumpkin",
    "cat_spawn_egg",
    "cauldron",
    "cave_spider_spawn_egg",
    "chain_command_block",
    "chainmail_boots",
    "chainmail_chestplate",
    "chainmail_helmet",
    "chainmail_leggings",
    "charcoal",
    "cherry_boat",
    "cherry_button",
    "cherry_chest_boat",
    "cherry_door",
    "cherry_fence",
    "cherry_fence_gate",
    "cherry_hanging_sign",
    "cherry_leaves",
    "cherry_log",
    "cherry_planks",
    "cherry_pressure_plate",
    "cherry_sapling",
    "cherry_shelf",
    "cherry_sign",
    "cherry_slab",
    "cherry_stairs",
    "cherry_trapdoor",
    "cherry_wood",
    "chest",
    "chest_minecart",
    "chicken",
    "chicken_spawn_egg",
    "chipped_anvil",
    "chiseled_bookshelf",
    "chiseled_cinnabar",
    "chiseled_copper",
    "chiseled_deepslate",
    "chiseled_nether_bricks",
    "chiseled_polished_blackstone",
    "chiseled_quartz_block",
    "chiseled_red_sandstone",
    "chiseled_resin_bricks",
    "chiseled_sandstone",
    "chiseled_stone_bricks",
    "chiseled_sulfur",
    "chiseled_tuff",
    "chiseled_tuff_bricks",
    "chorus_flower",
    "chorus_fruit",
    "chorus_plant",
    "cinnabar",
    "cinnabar_brick_slab",
    "cinnabar_brick_stairs",
    "cinnabar_brick_wall",
    "cinnabar_bricks",
    "cinnabar_slab",
    "cinnabar_stairs",
    "cinnabar_wall",
    "clay",
    "clay_ball",
    "clock",
    "closed_eyeblossom",
    "coal",
    "coal_block",
    "coal_ore",
    "coarse_dirt",
    "coast_armor_trim_smithing_template",
    "cobbled_deepslate",
    "cobbled_deepslate_slab",
    "cobbled_deepslate_stairs",
    "cobbled_deepslate_wall",
    "cobblestone",
    "cobblestone_slab",
    "cobblestone_stairs",
    "cobblestone_wall",
    "cobweb",
    "cocoa_beans",
    "cod",
    "cod_bucket",
    "cod_spawn_egg",
    "command_block",
    "command_block_minecart",
    "comparator",
    "compass",
    "composter",
    "conduit",
    "cooked_beef",
    "cooked_chicken",
    "cooked_cod",
    "cooked_mutton",
    "cooked_porkchop",
    "cooked_rabbit",
    "cooked_salmon",
    "cookie",
    "copper_axe",
    "copper_bars",
    "copper_block",
    "copper_boots",
    "copper_bulb",
    "copper_chain",
    "copper_chest",
    "copper_chestplate",
    "copper_door",
    "copper_golem_spawn_egg",
    "copper_golem_statue",
    "copper_grate",
    "copper_helmet",
    "copper_hoe",
    "copper_horse_armor",
    "copper_ingot",
    "copper_lantern",
    "copper_leggings",
    "copper_nautilus_armor",
    "copper_nugget",
    "copper_ore",
    "copper_pickaxe",
    "copper_shovel",
    "copper_spear",
    "copper_sword",
    "copper_torch",
    "copper_trapdoor",
    "cornflower",
    "cow_spawn_egg",
    "cracked_deepslate_bricks",
    "cracked_deepslate_tiles",
    "cracked_nether_bricks",
    "cracked_polished_blackstone_bricks",
    "cracked_stone_bricks",
    "crafter",
    "crafting_table",
    "creaking_heart",
    "creaking_spawn_egg",
    "creeper_banner_pattern",
    "creeper_head",
    "creeper_spawn_egg",
    "crimson_button",
    "crimson_door",
    "crimson_fence",
    "crimson_fence_gate",
    "crimson_fungus",
    "crimson_hanging_sign",
    "crimson_hyphae",
    "crimson_nylium",
    "crimson_planks",
    "crimson_pressure_plate",
    "crimson_roots",
    "crimson_shelf",
    "crimson_sign",
    "crimson_slab",
    "crimson_stairs",
    "crimson_stem",
    "crimson_trapdoor",
    "crossbow",
    "crying_obsidian",
    "cut_copper",
    "cut_copper_slab",
    "cut_copper_stairs",
    "cut_red_sandstone",
    "cut_red_sandstone_slab",
    "cut_sandstone",
    "cut_sandstone_slab",
    "cyan_banner",
    "cyan_bed",
    "cyan_bundle",
    "cyan_candle",
    "cyan_carpet",
    "cyan_concrete",
    "cyan_concrete_powder",
    "cyan_dye",
    "cyan_glazed_terracotta",
    "cyan_harness",
    "cyan_shulker_box",
    "cyan_stained_glass",
    "cyan_stained_glass_pane",
    "cyan_terracotta",
    "cyan_wool",
    "damaged_anvil",
    "dandelion",
    "danger_pottery_sherd",
    "dark_oak_boat",
    "dark_oak_button",
    "dark_oak_chest_boat",
    "dark_oak_door",
    "dark_oak_fence",
    "dark_oak_fence_gate",
    "dark_oak_hanging_sign",
    "dark_oak_leaves",
    "dark_oak_log",
    "dark_oak_planks",
    "dark_oak_pressure_plate",
    "dark_oak_sapling",
    "dark_oak_shelf",
    "dark_oak_sign",
    "dark_oak_slab",
    "dark_oak_stairs",
    "dark_oak_trapdoor",
    "dark_oak_wood",
    "dark_prismarine",
    "dark_prismarine_slab",
    "dark_prismarine_stairs",
    "daylight_detector",
    "dead_brain_coral",
    "dead_brain_coral_block",
    "dead_brain_coral_fan",
    "dead_bubble_coral",
    "dead_bubble_coral_block",
    "dead_bubble_coral_fan",
    "dead_bush",
    "dead_fire_coral",
    "dead_fire_coral_block",
    "dead_fire_coral_fan",
    "dead_horn_coral",
    "dead_horn_coral_block",
    "dead_horn_coral_fan",
    "dead_tube_coral",
    "dead_tube_coral_block",
    "dead_tube_coral_fan",
    "debug_stick",
    "decorated_pot",
    "deepslate",
    "deepslate_brick_slab",
    "deepslate_brick_stairs",
    "deepslate_brick_wall",
    "deepslate_bricks",
    "deepslate_coal_ore",
    "deepslate_copper_ore",
    "deepslate_diamond_ore",
    "deepslate_emerald_ore",
    "deepslate_gold_ore",
    "deepslate_iron_ore",
    "deepslate_lapis_ore",
    "deepslate_redstone_ore",
    "deepslate_tile_slab",
    "deepslate_tile_stairs",
    "deepslate_tile_wall",
    "deepslate_tiles",
    "detector_rail",
    "diamond",
    "diamond_axe",
    "diamond_block",
    "diamond_boots",
    "diamond_chestplate",
    "diamond_helmet",
    "diamond_hoe",
    "diamond_horse_armor",
    "diamond_leggings",
    "diamond_nautilus_armor",
    "diamond_ore",
    "diamond_pickaxe",
    "diamond_shovel",
    "diamond_spear",
    "diamond_sword",
    "diorite",
    "diorite_slab",
    "diorite_stairs",
    "diorite_wall",
    "dirt",
    "dirt_path",
    "disc_fragment_5",
    "dispenser",
    "dolphin_spawn_egg",
    "donkey_spawn_egg",
    "dragon_breath",
    "dragon_egg",
    "dragon_head",
    "dried_ghast",
    "dried_kelp",
    "dried_kelp_block",
    "dripstone_block",
    "dropper",
    "drowned_spawn_egg",
    "dune_armor_trim_smithing_template",
    "echo_shard",
    "egg",
    "elder_guardian_spawn_egg",
    "elytra",
    "emerald",
    "emerald_block",
    "emerald_ore",
    "enchanted_book",
    "enchanted_golden_apple",
    "enchanting_table",
    "end_crystal",
    "end_portal_frame",
    "end_rod",
    "end_stone",
    "end_stone_brick_slab",
    "end_stone_brick_stairs",
    "end_stone_brick_wall",
    "end_stone_bricks",
    "ender_chest",
    "ender_dragon_spawn_egg",
    "ender_eye",
    "ender_pearl",
    "enderman_spawn_egg",
    "endermite_spawn_egg",
    "evoker_spawn_egg",
    "experience_bottle",
    "explorer_pottery_sherd",
    "exposed_chiseled_copper",
    "exposed_copper",
    "exposed_copper_bars",
    "exposed_copper_bulb",
    "exposed_copper_chain",
    "exposed_copper_chest",
    "exposed_copper_door",
    "exposed_copper_golem_statue",
    "exposed_copper_grate",
    "exposed_copper_lantern",
    "exposed_copper_trapdoor",
    "exposed_cut_copper",
    "exposed_cut_copper_slab",
    "exposed_cut_copper_stairs",
    "exposed_lightning_rod",
    "eye_armor_trim_smithing_template",
    "farmland",
    "feather",
    "fermented_spider_eye",
    "fern",
    "field_masoned_banner_pattern",
    "filled_map",
    "fire_charge",
    "fire_coral",
    "fire_coral_block",
    "fire_coral_fan",
    "firefly_bush",
    "firework_rocket",
    "firework_star",
    "fishing_rod",
    "fletching_table",
    "flint",
    "flint_and_steel",
    "flow_armor_trim_smithing_template",
    "flow_banner_pattern",
    "flow_pottery_sherd",
    "flower_banner_pattern",
    "flower_pot",
    "flowering_azalea",
    "flowering_azalea_leaves",
    "fox_spawn_egg",
    "friend_pottery_sherd",
    "frog_spawn_egg",
    "frogspawn",
    "furnace",
    "furnace_minecart",
    "ghast_spawn_egg",
    "ghast_tear",
    "gilded_blackstone",
    "glass",
    "glass_bottle",
    "glass_pane",
    "glistering_melon_slice",
    "globe_banner_pattern",
    "glow_berries",
    "glow_ink_sac",
    "glow_item_frame",
    "glow_lichen",
    "glow_squid_spawn_egg",
    "glowstone",
    "glowstone_dust",
    "goat_horn",
    "goat_spawn_egg",
    "gold_block",
    "gold_ingot",
    "gold_nugget",
    "gold_ore",
    "golden_apple",
    "golden_axe",
    "golden_boots",
    "golden_carrot",
    "golden_chestplate",
    "golden_dandelion",
    "golden_helmet",
    "golden_hoe",
    "golden_horse_armor",
    "golden_leggings",
    "golden_nautilus_armor",
    "golden_pickaxe",
    "golden_shovel",
    "golden_spear",
    "golden_sword",
    "granite",
    "granite_slab",
    "granite_stairs",
    "granite_wall",
    "grass_block",
    "gravel",
    "gray_banner",
    "gray_bed",
    "gray_bundle",
    "gray_candle",
    "gray_carpet",
    "gray_concrete",
    "gray_concrete_powder",
    "gray_dye",
    "gray_glazed_terracotta",
    "gray_harness",
    "gray_shulker_box",
    "gray_stained_glass",
    "gray_stained_glass_pane",
    "gray_terracotta",
    "gray_wool",
    "green_banner",
    "green_bed",
    "green_bundle",
    "green_candle",
    "green_carpet",
    "green_concrete",
    "green_concrete_powder",
    "green_dye",
    "green_glazed_terracotta",
    "green_harness",
    "green_shulker_box",
    "green_stained_glass",
    "green_stained_glass_pane",
    "green_terracotta",
    "green_wool",
    "grindstone",
    "guardian_spawn_egg",
    "gunpowder",
    "guster_banner_pattern",
    "guster_pottery_sherd",
    "hanging_roots",
    "happy_ghast_spawn_egg",
    "hay_block",
    "heart_of_the_sea",
    "heart_pottery_sherd",
    "heartbreak_pottery_sherd",
    "heavy_core",
    "heavy_weighted_pressure_plate",
    "hoglin_spawn_egg",
    "honey_block",
    "honey_bottle",
    "honeycomb",
    "honeycomb_block",
    "hopper",
    "hopper_minecart",
    "horn_coral",
    "horn_coral_block",
    "horn_coral_fan",
    "horse_spawn_egg",
    "host_armor_trim_smithing_template",
    "howl_pottery_sherd",
    "husk_spawn_egg",
    "ice",
    "infested_chiseled_stone_bricks",
    "infested_cobblestone",
    "infested_cracked_stone_bricks",
    "infested_deepslate",
    "infested_mossy_stone_bricks",
    "infested_stone",
    "infested_stone_bricks",
    "ink_sac",
    "iron_axe",
    "iron_bars",
    "iron_block",
    "iron_boots",
    "iron_chain",
    "iron_chestplate",
    "iron_door",
    "iron_golem_spawn_egg",
    "iron_helmet",
    "iron_hoe",
    "iron_horse_armor",
    "iron_ingot",
    "iron_leggings",
    "iron_nautilus_armor",
    "iron_nugget",
    "iron_ore",
    "iron_pickaxe",
    "iron_shovel",
    "iron_spear",
    "iron_sword",
    "iron_trapdoor",
    "item_frame",
    "jack_o_lantern",
    "jigsaw",
    "jukebox",
    "jungle_boat",
    "jungle_button",
    "jungle_chest_boat",
    "jungle_door",
    "jungle_fence",
    "jungle_fence_gate",
    "jungle_hanging_sign",
    "jungle_leaves",
    "jungle_log",
    "jungle_planks",
    "jungle_pressure_plate",
    "jungle_sapling",
    "jungle_shelf",
    "jungle_sign",
    "jungle_slab",
    "jungle_stairs",
    "jungle_trapdoor",
    "jungle_wood",
    "kelp",
    "knowledge_book",
    "ladder",
    "lantern",
    "lapis_block",
    "lapis_lazuli",
    "lapis_ore",
    "large_amethyst_bud",
    "large_fern",
    "lava_bucket",
    "lead",
    "leaf_litter",
    "leather",
    "leather_boots",
    "leather_chestplate",
    "leather_helmet",
    "leather_horse_armor",
    "leather_leggings",
    "lectern",
    "lever",
    "light",
    "light_blue_banner",
    "light_blue_bed",
    "light_blue_bundle",
    "light_blue_candle",
    "light_blue_carpet",
    "light_blue_concrete",
    "light_blue_concrete_powder",
    "light_blue_dye",
    "light_blue_glazed_terracotta",
    "light_blue_harness",
    "light_blue_shulker_box",
    "light_blue_stained_glass",
    "light_blue_stained_glass_pane",
    "light_blue_terracotta",
    "light_blue_wool",
    "light_gray_banner",
    "light_gray_bed",
    "light_gray_bundle",
    "light_gray_candle",
    "light_gray_carpet",
    "light_gray_concrete",
    "light_gray_concrete_powder",
    "light_gray_dye",
    "light_gray_glazed_terracotta",
    "light_gray_harness",
    "light_gray_shulker_box",
    "light_gray_stained_glass",
    "light_gray_stained_glass_pane",
    "light_gray_terracotta",
    "light_gray_wool",
    "light_weighted_pressure_plate",
    "lightning_rod",
    "lilac",
    "lily_of_the_valley",
    "lily_pad",
    "lime_banner",
    "lime_bed",
    "lime_bundle",
    "lime_candle",
    "lime_carpet",
    "lime_concrete",
    "lime_concrete_powder",
    "lime_dye",
    "lime_glazed_terracotta",
    "lime_harness",
    "lime_shulker_box",
    "lime_stained_glass",
    "lime_stained_glass_pane",
    "lime_terracotta",
    "lime_wool",
    "lingering_potion",
    "llama_spawn_egg",
    "lodestone",
    "loom",
    "mace",
    "magenta_banner",
    "magenta_bed",
    "magenta_bundle",
    "magenta_candle",
    "magenta_carpet",
    "magenta_concrete",
    "magenta_concrete_powder",
    "magenta_dye",
    "magenta_glazed_terracotta",
    "magenta_harness",
    "magenta_shulker_box",
    "magenta_stained_glass",
    "magenta_stained_glass_pane",
    "magenta_terracotta",
    "magenta_wool",
    "magma_block",
    "magma_cream",
    "magma_cube_spawn_egg",
    "mangrove_boat",
    "mangrove_button",
    "mangrove_chest_boat",
    "mangrove_door",
    "mangrove_fence",
    "mangrove_fence_gate",
    "mangrove_hanging_sign",
    "mangrove_leaves",
    "mangrove_log",
    "mangrove_planks",
    "mangrove_pressure_plate",
    "mangrove_propagule",
    "mangrove_roots",
    "mangrove_shelf",
    "mangrove_sign",
    "mangrove_slab",
    "mangrove_stairs",
    "mangrove_trapdoor",
    "mangrove_wood",
    "map",
    "medium_amethyst_bud",
    "melon",
    "melon_seeds",
    "melon_slice",
    "milk_bucket",
    "minecart",
    "miner_pottery_sherd",
    "mojang_banner_pattern",
    "mooshroom_spawn_egg",
    "moss_block",
    "moss_carpet",
    "mossy_cobblestone",
    "mossy_cobblestone_slab",
    "mossy_cobblestone_stairs",
    "mossy_cobblestone_wall",
    "mossy_stone_brick_slab",
    "mossy_stone_brick_stairs",
    "mossy_stone_brick_wall",
    "mossy_stone_bricks",
    "mourner_pottery_sherd",
    "mud",
    "mud_brick_slab",
    "mud_brick_stairs",
    "mud_brick_wall",
    "mud_bricks",
    "muddy_mangrove_roots",
    "mule_spawn_egg",
    "mushroom_stem",
    "mushroom_stew",
    "music_disc_11",
    "music_disc_13",
    "music_disc_5",
    "music_disc_blocks",
    "music_disc_bounce",
    "music_disc_cat",
    "music_disc_chirp",
    "music_disc_creator",
    "music_disc_creator_music_box",
    "music_disc_far",
    "music_disc_lava_chicken",
    "music_disc_mall",
    "music_disc_mellohi",
    "music_disc_otherside",
    "music_disc_pigstep",
    "music_disc_precipice",
    "music_disc_relic",
    "music_disc_stal",
    "music_disc_strad",
    "music_disc_tears",
    "music_disc_wait",
    "music_disc_ward",
    "mutton",
    "mycelium",
    "name_tag",
    "nautilus_shell",
    "nautilus_spawn_egg",
    "nether_brick",
    "nether_brick_fence",
    "nether_brick_slab",
    "nether_brick_stairs",
    "nether_brick_wall",
    "nether_bricks",
    "nether_gold_ore",
    "nether_quartz_ore",
    "nether_sprouts",
    "nether_star",
    "nether_wart",
    "nether_wart_block",
    "netherite_axe",
    "netherite_block",
    "netherite_boots",
    "netherite_chestplate",
    "netherite_helmet",
    "netherite_hoe",
    "netherite_horse_armor",
    "netherite_ingot",
    "netherite_leggings",
    "netherite_nautilus_armor",
    "netherite_pickaxe",
    "netherite_scrap",
    "netherite_shovel",
    "netherite_spear",
    "netherite_sword",
    "netherite_upgrade_smithing_template",
    "netherrack",
    "note_block",
    "oak_boat",
    "oak_button",
    "oak_chest_boat",
    "oak_door",
    "oak_fence",
    "oak_fence_gate",
    "oak_hanging_sign",
    "oak_leaves",
    "oak_log",
    "oak_planks",
    "oak_pressure_plate",
    "oak_sapling",
    "oak_shelf",
    "oak_sign",
    "oak_slab",
    "oak_stairs",
    "oak_trapdoor",
    "oak_wood",
    "observer",
    "obsidian",
    "ocelot_spawn_egg",
    "ochre_froglight",
    "ominous_bottle",
    "ominous_trial_key",
    "open_eyeblossom",
    "orange_banner",
    "orange_bed",
    "orange_bundle",
    "orange_candle",
    "orange_carpet",
    "orange_concrete",
    "orange_concrete_powder",
    "orange_dye",
    "orange_glazed_terracotta",
    "orange_harness",
    "orange_shulker_box",
    "orange_stained_glass",
    "orange_stained_glass_pane",
    "orange_terracotta",
    "orange_tulip",
    "orange_wool",
    "oxeye_daisy",
    "oxidized_chiseled_copper",
    "oxidized_copper",
    "oxidized_copper_bars",
    "oxidized_copper_bulb",
    "oxidized_copper_chain",
    "oxidized_copper_chest",
    "oxidized_copper_door",
    "oxidized_copper_golem_statue",
    "oxidized_copper_grate",
    "oxidized_copper_lantern",
    "oxidized_copper_trapdoor",
    "oxidized_cut_copper",
    "oxidized_cut_copper_slab",
    "oxidized_cut_copper_stairs",
    "oxidized_lightning_rod",
    "packed_ice",
    "packed_mud",
    "painting",
    "pale_hanging_moss",
    "pale_moss_block",
    "pale_moss_carpet",
    "pale_oak_boat",
    "pale_oak_button",
    "pale_oak_chest_boat",
    "pale_oak_door",
    "pale_oak_fence",
    "pale_oak_fence_gate",
    "pale_oak_hanging_sign",
    "pale_oak_leaves",
    "pale_oak_log",
    "pale_oak_planks",
    "pale_oak_pressure_plate",
    "pale_oak_sapling",
    "pale_oak_shelf",
    "pale_oak_sign",
    "pale_oak_slab",
    "pale_oak_stairs",
    "pale_oak_trapdoor",
    "pale_oak_wood",
    "panda_spawn_egg",
    "paper",
    "parched_spawn_egg",
    "parrot_spawn_egg",
    "pearlescent_froglight",
    "peony",
    "petrified_oak_slab",
    "phantom_membrane",
    "phantom_spawn_egg",
    "pig_spawn_egg",
    "piglin_banner_pattern",
    "piglin_brute_spawn_egg",
    "piglin_head",
    "piglin_spawn_egg",
    "pillager_spawn_egg",
    "pink_banner",
    "pink_bed",
    "pink_bundle",
    "pink_candle",
    "pink_carpet",
    "pink_concrete",
    "pink_concrete_powder",
    "pink_dye",
    "pink_glazed_terracotta",
    "pink_harness",
    "pink_petals",
    "pink_shulker_box",
    "pink_stained_glass",
    "pink_stained_glass_pane",
    "pink_terracotta",
    "pink_tulip",
    "pink_wool",
    "piston",
    "pitcher_plant",
    "pitcher_pod",
    "player_head",
    "plenty_pottery_sherd",
    "podzol",
    "pointed_dripstone",
    "poisonous_potato",
    "polar_bear_spawn_egg",
    "polished_andesite",
    "polished_andesite_slab",
    "polished_andesite_stairs",
    "polished_basalt",
    "polished_blackstone",
    "polished_blackstone_brick_slab",
    "polished_blackstone_brick_stairs",
    "polished_blackstone_brick_wall",
    "polished_blackstone_bricks",
    "polished_blackstone_button",
    "polished_blackstone_pressure_plate",
    "polished_blackstone_slab",
    "polished_blackstone_stairs",
    "polished_blackstone_wall",
    "polished_cinnabar",
    "polished_cinnabar_slab",
    "polished_cinnabar_stairs",
    "polished_cinnabar_wall",
    "polished_deepslate",
    "polished_deepslate_slab",
    "polished_deepslate_stairs",
    "polished_deepslate_wall",
    "polished_diorite",
    "polished_diorite_slab",
    "polished_diorite_stairs",
    "polished_granite",
    "polished_granite_slab",
    "polished_granite_stairs",
    "polished_sulfur",
    "polished_sulfur_slab",
    "polished_sulfur_stairs",
    "polished_sulfur_wall",
    "polished_tuff",
    "polished_tuff_slab",
    "polished_tuff_stairs",
    "polished_tuff_wall",
    "popped_chorus_fruit",
    "poppy",
    "porkchop",
    "potato",
    "potent_sulfur",
    "potion",
    "powder_snow_bucket",
    "powered_rail",
    "prismarine",
    "prismarine_brick_slab",
    "prismarine_brick_stairs",
    "prismarine_bricks",
    "prismarine_crystals",
    "prismarine_shard",
    "prismarine_slab",
    "prismarine_stairs",
    "prismarine_wall",
    "prize_pottery_sherd",
    "pufferfish",
    "pufferfish_bucket",
    "pufferfish_spawn_egg",
    "pumpkin",
    "pumpkin_pie",
    "pumpkin_seeds",
    "purple_banner",
    "purple_bed",
    "purple_bundle",
    "purple_candle",
    "purple_carpet",
    "purple_concrete",
    "purple_concrete_powder",
    "purple_dye",
    "purple_glazed_terracotta",
    "purple_harness",
    "purple_shulker_box",
    "purple_stained_glass",
    "purple_stained_glass_pane",
    "purple_terracotta",
    "purple_wool",
    "purpur_block",
    "purpur_pillar",
    "purpur_slab",
    "purpur_stairs",
    "quartz",
    "quartz_block",
    "quartz_bricks",
    "quartz_pillar",
    "quartz_slab",
    "quartz_stairs",
    "rabbit",
    "rabbit_foot",
    "rabbit_hide",
    "rabbit_spawn_egg",
    "rabbit_stew",
    "rail",
    "raiser_armor_trim_smithing_template",
    "ravager_spawn_egg",
    "raw_copper",
    "raw_copper_block",
    "raw_gold",
    "raw_gold_block",
    "raw_iron",
    "raw_iron_block",
    "recovery_compass",
    "red_banner",
    "red_bed",
    "red_bundle",
    "red_candle",
    "red_carpet",
    "red_concrete",
    "red_concrete_powder",
    "red_dye",
    "red_glazed_terracotta",
    "red_harness",
    "red_mushroom",
    "red_mushroom_block",
    "red_nether_brick_slab",
    "red_nether_brick_stairs",
    "red_nether_brick_wall",
    "red_nether_bricks",
    "red_sand",
    "red_sandstone",
    "red_sandstone_slab",
    "red_sandstone_stairs",
    "red_sandstone_wall",
    "red_shulker_box",
    "red_stained_glass",
    "red_stained_glass_pane",
    "red_terracotta",
    "red_tulip",
    "red_wool",
    "redstone",
    "redstone_block",
    "redstone_lamp",
    "redstone_ore",
    "redstone_torch",
    "reinforced_deepslate",
    "repeater",
    "repeating_command_block",
    "resin_block",
    "resin_brick",
    "resin_brick_slab",
    "resin_brick_stairs",
    "resin_brick_wall",
    "resin_bricks",
    "resin_clump",
    "respawn_anchor",
    "rib_armor_trim_smithing_template",
    "rooted_dirt",
    "rose_bush",
    "rotten_flesh",
    "saddle",
    "salmon",
    "salmon_bucket",
    "salmon_spawn_egg",
    "sand",
    "sandstone",
    "sandstone_slab",
    "sandstone_stairs",
    "sandstone_wall",
    "scaffolding",
    "scrape_pottery_sherd",
    "sculk",
    "sculk_catalyst",
    "sculk_sensor",
    "sculk_shrieker",
    "sculk_vein",
    "sea_lantern",
    "sea_pickle",
    "seagrass",
    "sentry_armor_trim_smithing_template",
    "shaper_armor_trim_smithing_template",
    "sheaf_pottery_sherd",
    "shears",
    "sheep_spawn_egg",
    "shelter_pottery_sherd",
    "shield",
    "short_dry_grass",
    "short_grass",
    "shroomlight",
    "shulker_box",
    "shulker_shell",
    "shulker_spawn_egg",
    "silence_armor_trim_smithing_template",
    "silverfish_spawn_egg",
    "skeleton_horse_spawn_egg",
    "skeleton_skull",
    "skeleton_spawn_egg",
    "skull_banner_pattern",
    "skull_pottery_sherd",
    "slime_ball",
    "slime_block",
    "slime_spawn_egg",
    "small_amethyst_bud",
    "small_dripleaf",
    "smithing_table",
    "smoker",
    "smooth_basalt",
    "smooth_quartz",
    "smooth_quartz_slab",
    "smooth_quartz_stairs",
    "smooth_red_sandstone",
    "smooth_red_sandstone_slab",
    "smooth_red_sandstone_stairs",
    "smooth_sandstone",
    "smooth_sandstone_slab",
    "smooth_sandstone_stairs",
    "smooth_stone",
    "smooth_stone_slab",
    "sniffer_egg",
    "sniffer_spawn_egg",
    "snort_pottery_sherd",
    "snout_armor_trim_smithing_template",
    "snow",
    "snow_block",
    "snow_golem_spawn_egg",
    "snowball",
    "soul_campfire",
    "soul_lantern",
    "soul_sand",
    "soul_soil",
    "soul_torch",
    "spawner",
    "spectral_arrow",
    "spider_eye",
    "spider_spawn_egg",
    "spire_armor_trim_smithing_template",
    "splash_potion",
    "sponge",
    "spore_blossom",
    "spruce_boat",
    "spruce_button",
    "spruce_chest_boat",
    "spruce_door",
    "spruce_fence",
    "spruce_fence_gate",
    "spruce_hanging_sign",
    "spruce_leaves",
    "spruce_log",
    "spruce_planks",
    "spruce_pressure_plate",
    "spruce_sapling",
    "spruce_shelf",
    "spruce_sign",
    "spruce_slab",
    "spruce_stairs",
    "spruce_trapdoor",
    "spruce_wood",
    "spyglass",
    "squid_spawn_egg",
    "stick",
    "sticky_piston",
    "stone",
    "stone_axe",
    "stone_brick_slab",
    "stone_brick_stairs",
    "stone_brick_wall",
    "stone_bricks",
    "stone_button",
    "stone_hoe",
    "stone_pickaxe",
    "stone_pressure_plate",
    "stone_shovel",
    "stone_slab",
    "stone_spear",
    "stone_stairs",
    "stone_sword",
    "stonecutter",
    "stray_spawn_egg",
    "strider_spawn_egg",
    "string",
    "stripped_acacia_log",
    "stripped_acacia_wood",
    "stripped_bamboo_block",
    "stripped_birch_log",
    "stripped_birch_wood",
    "stripped_cherry_log",
    "stripped_cherry_wood",
    "stripped_crimson_hyphae",
    "stripped_crimson_stem",
    "stripped_dark_oak_log",
    "stripped_dark_oak_wood",
    "stripped_jungle_log",
    "stripped_jungle_wood",
    "stripped_mangrove_log",
    "stripped_mangrove_wood",
    "stripped_oak_log",
    "stripped_oak_wood",
    "stripped_pale_oak_log",
    "stripped_pale_oak_wood",
    "stripped_spruce_log",
    "stripped_spruce_wood",
    "stripped_warped_hyphae",
    "stripped_warped_stem",
    "structure_block",
    "structure_void",
    "sugar",
    "sugar_cane",
    "sulfur",
    "sulfur_brick_slab",
    "sulfur_brick_stairs",
    "sulfur_brick_wall",
    "sulfur_bricks",
    "sulfur_cube_bucket",
    "sulfur_cube_spawn_egg",
    "sulfur_slab",
    "sulfur_spike",
    "sulfur_stairs",
    "sulfur_wall",
    "sunflower",
    "suspicious_gravel",
    "suspicious_sand",
    "suspicious_stew",
    "sweet_berries",
    "tadpole_bucket",
    "tadpole_spawn_egg",
    "tall_dry_grass",
    "tall_grass",
    "target",
    "terracotta",
    "test_block",
    "test_instance_block",
    "tide_armor_trim_smithing_template",
    "tinted_glass",
    "tipped_arrow",
    "tnt",
    "tnt_minecart",
    "torch",
    "torchflower",
    "torchflower_seeds",
    "totem_of_undying",
    "trader_llama_spawn_egg",
    "trapped_chest",
    "trial_key",
    "trial_spawner",
    "trident",
    "tripwire_hook",
    "tropical_fish",
    "tropical_fish_bucket",
    "tropical_fish_spawn_egg",
    "tube_coral",
    "tube_coral_block",
    "tube_coral_fan",
    "tuff",
    "tuff_brick_slab",
    "tuff_brick_stairs",
    "tuff_brick_wall",
    "tuff_bricks",
    "tuff_slab",
    "tuff_stairs",
    "tuff_wall",
    "turtle_egg",
    "turtle_helmet",
    "turtle_scute",
    "turtle_spawn_egg",
    "twisting_vines",
    "vault",
    "verdant_froglight",
    "vex_armor_trim_smithing_template",
    "vex_spawn_egg",
    "villager_spawn_egg",
    "vindicator_spawn_egg",
    "vine",
    "wandering_trader_spawn_egg",
    "ward_armor_trim_smithing_template",
    "warden_spawn_egg",
    "warped_button",
    "warped_door",
    "warped_fence",
    "warped_fence_gate",
    "warped_fungus",
    "warped_fungus_on_a_stick",
    "warped_hanging_sign",
    "warped_hyphae",
    "warped_nylium",
    "warped_planks",
    "warped_pressure_plate",
    "warped_roots",
    "warped_shelf",
    "warped_sign",
    "warped_slab",
    "warped_stairs",
    "warped_stem",
    "warped_trapdoor",
    "warped_wart_block",
    "water_bucket",
    "waxed_chiseled_copper",
    "waxed_copper_bars",
    "waxed_copper_block",
    "waxed_copper_bulb",
    "waxed_copper_chain",
    "waxed_copper_chest",
    "waxed_copper_door",
    "waxed_copper_golem_statue",
    "waxed_copper_grate",
    "waxed_copper_lantern",
    "waxed_copper_trapdoor",
    "waxed_cut_copper",
    "waxed_cut_copper_slab",
    "waxed_cut_copper_stairs",
    "waxed_exposed_chiseled_copper",
    "waxed_exposed_copper",
    "waxed_exposed_copper_bars",
    "waxed_exposed_copper_bulb",
    "waxed_exposed_copper_chain",
    "waxed_exposed_copper_chest",
    "waxed_exposed_copper_door",
    "waxed_exposed_copper_golem_statue",
    "waxed_exposed_copper_grate",
    "waxed_exposed_copper_lantern",
    "waxed_exposed_copper_trapdoor",
    "waxed_exposed_cut_copper",
    "waxed_exposed_cut_copper_slab",
    "waxed_exposed_cut_copper_stairs",
    "waxed_exposed_lightning_rod",
    "waxed_lightning_rod",
    "waxed_oxidized_chiseled_copper",
    "waxed_oxidized_copper",
    "waxed_oxidized_copper_bars",
    "waxed_oxidized_copper_bulb",
    "waxed_oxidized_copper_chain",
    "waxed_oxidized_copper_chest",
    "waxed_oxidized_copper_door",
    "waxed_oxidized_copper_golem_statue",
    "waxed_oxidized_copper_grate",
    "waxed_oxidized_copper_lantern",
    "waxed_oxidized_copper_trapdoor",
    "waxed_oxidized_cut_copper",
    "waxed_oxidized_cut_copper_slab",
    "waxed_oxidized_cut_copper_stairs",
    "waxed_oxidized_lightning_rod",
    "waxed_weathered_chiseled_copper",
    "waxed_weathered_copper",
    "waxed_weathered_copper_bars",
    "waxed_weathered_copper_bulb",
    "waxed_weathered_copper_chain",
    "waxed_weathered_copper_chest",
    "waxed_weathered_copper_door",
    "waxed_weathered_copper_golem_statue",
    "waxed_weathered_copper_grate",
    "waxed_weathered_copper_lantern",
    "waxed_weathered_copper_trapdoor",
    "waxed_weathered_cut_copper",
    "waxed_weathered_cut_copper_slab",
    "waxed_weathered_cut_copper_stairs",
    "waxed_weathered_lightning_rod",
    "wayfinder_armor_trim_smithing_template",
    "weathered_chiseled_copper",
    "weathered_copper",
    "weathered_copper_bars",
    "weathered_copper_bulb",
    "weathered_copper_chain",
    "weathered_copper_chest",
    "weathered_copper_door",
    "weathered_copper_golem_statue",
    "weathered_copper_grate",
    "weathered_copper_lantern",
    "weathered_copper_trapdoor",
    "weathered_cut_copper",
    "weathered_cut_copper_slab",
    "weathered_cut_copper_stairs",
    "weathered_lightning_rod",
    "weeping_vines",
    "wet_sponge",
    "wheat",
    "wheat_seeds",
    "white_banner",
    "white_bed",
    "white_bundle",
    "white_candle",
    "white_carpet",
    "white_concrete",
    "white_concrete_powder",
    "white_dye",
    "white_glazed_terracotta",
    "white_harness",
    "white_shulker_box",
    "white_stained_glass",
    "white_stained_glass_pane",
    "white_terracotta",
    "white_tulip",
    "white_wool",
    "wild_armor_trim_smithing_template",
    "wildflowers",
    "wind_charge",
    "witch_spawn_egg",
    "wither_rose",
    "wither_skeleton_skull",
    "wither_skeleton_spawn_egg",
    "wither_spawn_egg",
    "wolf_armor",
    "wolf_spawn_egg",
    "wooden_axe",
    "wooden_hoe",
    "wooden_pickaxe",
    "wooden_shovel",
    "wooden_spear",
    "wooden_sword",
    "writable_book",
    "written_book",
    "yellow_banner",
    "yellow_bed",
    "yellow_bundle",
    "yellow_candle",
    "yellow_carpet",
    "yellow_concrete",
    "yellow_concrete_powder",
    "yellow_dye",
    "yellow_glazed_terracotta",
    "yellow_harness",
    "yellow_shulker_box",
    "yellow_stained_glass",
    "yellow_stained_glass_pane",
    "yellow_terracotta",
    "yellow_wool",
    "zoglin_spawn_egg",
    "zombie_head",
    "zombie_horse_spawn_egg",
    "zombie_nautilus_spawn_egg",
    "zombie_spawn_egg",
    "zombie_villager_spawn_egg",
    "zombified_piglin_spawn_egg"
  ];

  // src/export-dialog.ts
  var DIALOG_ID = "display_anim_preview_export";
  var OUTPUT_MODE_KEYS = {
    both_default: "dap.export.mode.both_default",
    both_separate: "dap.export.mode.both_separate",
    resource_only: "dap.export.mode.resource_only",
    datapack_only: "dap.export.mode.datapack_only"
  };
  function outputModes() {
    return Object.fromEntries(
      Object.entries(OUTPUT_MODE_KEYS).map(([id, key]) => [id, tr(key)])
    );
  }
  var exportInProgress = false;
  var GAME_FPS = 20;
  var VANILLA_ITEM_OPTIONS = Object.fromEntries(
    VANILLA_ITEM_IDS.map((id) => [`minecraft:${id}`, `minecraft:${id}`])
  );
  function sanitizeId(value, fallback) {
    const safe = value.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "_").replace(/^_+|_+$/g, "");
    return safe || fallback;
  }
  function sanitizeObjective(value, fallback) {
    return sanitizeId(value, fallback).slice(0, 16);
  }
  function normalizeItemId(value) {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return "minecraft:potion";
    return trimmed.includes(":") ? trimmed : `minecraft:${trimmed}`;
  }
  function includesResource(mode) {
    return mode !== "datapack_only";
  }
  function includesDatapack(mode) {
    return mode !== "resource_only";
  }
  function subtleInfo(text) {
    return `<span style="color:var(--color-subtle_text);font-size:11px;font-weight:400;line-height:1.45;display:block">${text}</span>`;
  }
  function describeTextureSizeMismatch() {
    if (!Project) return null;
    const mismatched = Texture.all.filter(
      (texture) => texture.width !== Project.texture_width || texture.height !== Project.texture_height
    );
    if (!mismatched.length) return null;
    const list = mismatched.map((texture) => `  ${texture.name}: ${texture.width}\xD7${texture.height}`).join("\n");
    return tr("dap.export.texture_mismatch", {
      project_width: Project.texture_width,
      project_height: Project.texture_height,
      textures: list
    });
  }
  function confirmWarnings(warnings) {
    if (!warnings.length) return Promise.resolve(true);
    const message = warnings.map(
      (warning, index) => `**${index + 1}. ${warning.title}**

${warning.message}`
    ).join("\n\n---\n\n");
    return new Promise((resolve) => {
      Blockbench.showMessageBox(
        {
          title: tr("dap.export.warnings_title"),
          message,
          icon: "warning",
          buttons: [tr("dap.export.cancel_export"), tr("dap.export.export_anyway")],
          confirm: 1,
          cancel: 0
        },
        (button) => resolve(button === 1)
      );
    });
  }
  function pickParent(resourceId, title) {
    return Blockbench.pickDirectory({
      resource_id: resourceId,
      title
    }) ?? null;
  }
  function chooseDestinations(mode, packName) {
    if (mode === "both_default") {
      const root = pickParent(
        "display_anim_export",
        tr("dap.export.pick_shared", { pack: packName })
      );
      if (!root) return null;
      return [
        {
          label: tr("dap.export.resource_pack"),
          scopeRoot: root,
          targetRoot: `${root}/resource-packs/${packName}`,
          kind: "resource"
        },
        {
          label: tr("dap.export.datapack"),
          scopeRoot: root,
          targetRoot: `${root}/datapacks/${packName}`,
          kind: "datapack"
        }
      ];
    }
    if (mode === "both_separate") {
      const resourceParent = pickParent(
        "display_anim_export_resource_parent",
        tr("dap.export.pick_resource", { pack: packName })
      );
      if (!resourceParent) return null;
      const datapackParent = pickParent(
        "display_anim_export_datapack_parent",
        tr("dap.export.pick_datapack", { pack: packName })
      );
      if (!datapackParent) return null;
      return [
        {
          label: tr("dap.export.resource_pack"),
          scopeRoot: resourceParent,
          targetRoot: `${resourceParent}/${packName}`,
          kind: "resource"
        },
        {
          label: tr("dap.export.datapack"),
          scopeRoot: datapackParent,
          targetRoot: `${datapackParent}/${packName}`,
          kind: "datapack"
        }
      ];
    }
    if (mode === "resource_only") {
      const parent2 = pickParent(
        "display_anim_export_resource_parent",
        tr("dap.export.pick_resource", { pack: packName })
      );
      return parent2 ? [{ label: tr("dap.export.resource_pack"), scopeRoot: parent2, targetRoot: `${parent2}/${packName}`, kind: "resource" }] : null;
    }
    const parent = pickParent(
      "display_anim_export_datapack_parent",
      tr("dap.export.pick_datapack", { pack: packName })
    );
    return parent ? [{ label: tr("dap.export.datapack"), scopeRoot: parent, targetRoot: `${parent}/${packName}`, kind: "datapack" }] : null;
  }
  function writeDestinations(destinations, targets) {
    const grouped = /* @__PURE__ */ new Map();
    destinations.forEach((destination, index) => {
      const list = grouped.get(destination.scopeRoot) ?? [];
      list.push(targets[index]);
      grouped.set(destination.scopeRoot, list);
    });
    let count = 0;
    for (const [scopeRoot, scopedTargets] of grouped) {
      count += writePacks(scopeRoot, scopedTargets);
    }
    return count;
  }
  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  async function runExport(form, animation) {
    const mode = form.output_mode || "both_default";
    const sourceFps = animation.snapping || GAME_FPS;
    const fps = GAME_FPS;
    const frameCount = frameCountFor(animation.length, fps);
    const packName = sanitizeId(form.pack_name, "display_animation");
    const assetNamespace = sanitizeId(form.asset_namespace, "kaleidoscope_lab");
    const itemModel = sanitizeId(form.item_model, "item");
    const dataNamespace = sanitizeId(form.data_namespace, packName);
    const displayName = form.display_name.trim() || animation.name;
    const destinations = chooseDestinations(mode, packName);
    if (!destinations) {
      Blockbench.showQuickMessage(tr("dap.export.cancelled"), 2500);
      return;
    }
    let frames = [];
    let displayContexts;
    let exportedFrameCount = frameCount;
    let outOfBounds = [];
    const warnings = [];
    if (includesResource(mode)) {
      displayContexts = configuredDisplayAnimations().map(
        ({ context, animated }) => ({
          context: context.id,
          animated
        })
      );
      exportedFrameCount = displayContexts.some((route) => route.animated) ? frameCount : 1;
      Blockbench.showQuickMessage(
        tr("dap.export.baking", { frames: exportedFrameCount, fps }),
        2e3
      );
      const result = bakeFrames(exportedFrameCount, fps);
      frames = result.frames;
      outOfBounds = result.outOfBounds;
      if (!frames.length) {
        Blockbench.showMessageBox({
          title: tr("dap.export.failed"),
          message: tr("dap.export.no_frames"),
          icon: "error"
        });
        return;
      }
      if (sourceFps !== GAME_FPS) {
        warnings.push({
          title: tr("dap.export.resampled_title"),
          message: tr("dap.export.resampled_message", {
            source_fps: sourceFps,
            game_fps: GAME_FPS,
            frames: frameCount
          })
        });
      }
      const textureSizeWarning = describeTextureSizeMismatch();
      if (textureSizeWarning) {
        warnings.push({ title: tr("dap.export.texture_mismatch_title"), message: textureSizeWarning });
      }
      const boundsWarning = describeOutOfBounds(outOfBounds);
      if (boundsWarning) {
        warnings.push({ title: tr("dap.export.bounds_title"), message: boundsWarning });
      }
    }
    const warningsAccepted = await confirmWarnings(warnings);
    if (!warningsAccepted) {
      Blockbench.showQuickMessage(tr("dap.export.cancelled"), 2500);
      return;
    }
    Blockbench.showQuickMessage(tr("dap.export.preparing_files"), 2e3);
    const resourceOptions = {
      packName,
      namespace: assetNamespace,
      itemModel,
      description: tr("dap.export.resource_description", {
        name: displayName,
        frames: exportedFrameCount,
        fps
      }),
      displayContexts
    };
    const datapackOptions = {
      packName,
      dataNamespace,
      assetNamespace,
      itemModel,
      baseItem: normalizeItemId(form.base_item),
      itemDisplayName: displayName,
      frameObjective: sanitizeObjective(form.frame_objective, "dap_frame"),
      modeObjective: sanitizeObjective(form.mode_objective, "dap_mode"),
      playingTag: sanitizeId(form.playing_tag, "dap_playing"),
      frameCount: exportedFrameCount,
      description: tr("dap.export.datapack_description", {
        name: displayName,
        frames: exportedFrameCount
      })
    };
    try {
      let packReport = null;
      const resourceBuild = includesResource(mode) ? buildResourcePack(frames, resourceOptions) : null;
      if (resourceBuild) packReport = resourceBuild.report;
      const targets = destinations.map((destination) => ({
        root: destination.targetRoot,
        files: destination.kind === "resource" ? resourceBuild.files : buildDatapack(datapackOptions)
      }));
      const existing = destinations.map((destination) => ({
        destination,
        count: inspectExisting(destination.scopeRoot, destination.targetRoot)
      })).filter((entry) => entry.count !== null);
      if (existing.length) {
        const summary = existing.map(
          ({ destination, count }) => `${destination.targetRoot}/ (${tr("dap.export.file_count", { count: count ?? 0 })})`
        ).join("\n");
        const overwriteAccepted = await new Promise((resolve) => {
          Blockbench.showMessageBox(
            {
              title: tr("dap.export.target_exists"),
              message: tr("dap.export.target_exists_message", { summary }),
              icon: "warning",
              buttons: [tr("dap.export.cancel"), tr("dap.export.overwrite")],
              confirm: 1,
              cancel: 0
            },
            (button) => resolve(button === 1)
          );
        });
        if (!overwriteAccepted) {
          Blockbench.showQuickMessage(tr("dap.export.cancelled"), 2500);
          return;
        }
      }
      try {
        const count = writeDestinations(destinations, targets);
        const locations = destinations.map((destination) => `${destination.label}\uFF1A${destination.targetRoot}/`).join("\n");
        const optimization = packReport ? `

${tr("dap.export.optimization", {
          sampled: packReport.sampledFrames,
          unique: packReport.uniqueModels,
          duplicates: packReport.duplicateFrames,
          before: formatBytes(packReport.modelBytesBefore),
          after: formatBytes(packReport.modelBytesAfter)
        })}` + (packReport.omittedUntexturedFaces ? `
${tr("dap.export.omitted", {
          faces: packReport.omittedUntexturedFaces,
          elements: packReport.omittedEmptyElements
        })}` : "") : "";
        const commands = includesDatapack(mode) ? `

${tr("dap.export.commands")}
/function ${dataNamespace}:give
/function ${dataNamespace}:play_loop` : "";
        Blockbench.showMessageBox({
          title: tr("dap.export.complete"),
          message: `${tr("dap.export.locations", { count, locations })}${optimization}${commands}`,
          icon: "check_circle"
        });
      } catch (err) {
        console.error("Export failed", err);
        Blockbench.showMessageBox({
          title: tr("dap.export.failed"),
          message: tr("dap.export.write_error", {
            error: err.message ?? String(err)
          }),
          icon: "error"
        });
      }
    } catch (err) {
      Blockbench.showMessageBox({
        title: tr("dap.export.prepare_failed"),
        message: err.message ?? String(err),
        icon: "error"
      });
    }
  }
  function openExportDialog() {
    if (exportInProgress) {
      Blockbench.showQuickMessage(tr("dap.export.busy"), 2e3);
      return;
    }
    const animation = Animation.selected ?? Animation.all[0];
    if (!animation) {
      Blockbench.showMessageBox({
        title: tr("dap.export.no_animation_title"),
        message: tr("dap.export.no_animation_message"),
        icon: "error"
      });
      return;
    }
    const fps = animation.snapping || GAME_FPS;
    const frameCount = frameCountFor(animation.length, fps);
    const gameFrameCount = frameCountFor(animation.length, GAME_FPS);
    const defaultPackName = sanitizeId(animation.name, "display_animation");
    const defaultItemModel = sanitizeId(Project?.name ?? "", defaultPackName);
    const fpsText = fps === GAME_FPS ? tr("dap.export.fps_exact", { frames: gameFrameCount }) : tr("dap.export.fps_resample", {
      source_fps: fps,
      source_frames: frameCount,
      game_fps: GAME_FPS,
      game_frames: gameFrameCount
    });
    const helpText = tr("dap.export.folder_help");
    new Dialog(DIALOG_ID, {
      title: tr("dap.export.title"),
      form: {
        info: { type: "info", text: subtleInfo(fpsText), full_width: true },
        help: { type: "info", text: subtleInfo(helpText), full_width: true },
        output_mode: {
          label: tr("dap.export.output"),
          type: "select",
          value: "both_default",
          options: outputModes()
        },
        pack_name: { label: tr("dap.export.pack_name"), type: "text", value: defaultPackName },
        asset_namespace: { label: tr("dap.export.asset_namespace"), type: "text", value: "kaleidoscope_lab" },
        item_model: { label: tr("dap.export.item_model"), type: "text", value: defaultItemModel },
        base_item: {
          label: tr("dap.export.base_item"),
          type: "select",
          value: "minecraft:potion",
          options: VANILLA_ITEM_OPTIONS
        },
        display_name: { label: tr("dap.export.display_name"), type: "text", value: animation.name },
        data_namespace: { label: tr("dap.export.data_namespace"), type: "text", value: defaultPackName },
        frame_objective: { label: tr("dap.export.frame_objective"), type: "text", value: "dap_frame" },
        mode_objective: { label: tr("dap.export.mode_objective"), type: "text", value: "dap_mode" },
        playing_tag: { label: tr("dap.export.playing_tag"), type: "text", value: "dap_playing" }
      },
      onConfirm(result) {
        exportInProgress = true;
        void runExport(result, animation).catch((err) => {
          console.error("Unexpected export failure", err);
          Blockbench.showMessageBox({
            title: tr("dap.export.failed"),
            message: err.message ?? String(err),
            icon: "error"
          });
        }).finally(() => {
          exportInProgress = false;
        });
      }
    }).show();
  }

  // src/format.ts
  var FORMAT_ID = "display_animation_sequence";
  var FORMAT_COORDINATE_OPTIONS = {
    centered_grid: false
  };
  var ownedFormat = null;
  function createFormat(id) {
    const javaBlockCodec = resolveJavaBlockCodec();
    return new ModelFormat(id, {
      id,
      name: tr("dap.format.name"),
      icon: "icon-format_block",
      category: "minecraft",
      target: "Minecraft: Java Edition",
      description: tr("dap.format.description"),
      show_in_start_screen: true,
      box_uv: false,
      optional_box_uv: true,
      single_texture: false,
      bone_rig: true,
      ...FORMAT_COORDINATE_OPTIONS,
      rotate_cubes: true,
      integer_size: false,
      animation_mode: true,
      display_mode: true,
      codec: javaBlockCodec
    });
  }
  function registerModelFormat() {
    if (!Formats[FORMAT_ID]) {
      ownedFormat = createFormat(FORMAT_ID);
      console.log(`Registered custom format "${FORMAT_ID}".`);
    }
  }
  function unregisterModelFormat() {
    if (ownedFormat && Formats[FORMAT_ID] === ownedFormat) {
      ownedFormat.delete();
      console.log(`Unregistered custom format "${FORMAT_ID}".`);
    }
    ownedFormat = null;
  }

  // src/plugin.ts
  var OPEN_ACTION_ID = "display_anim_preview_open_action";
  var CHECK_BOUNDS_ACTION_ID = "display_anim_preview_check_bounds";
  var EXPORT_ACTION_ID = "display_anim_preview_export_packs";
  var openAction = null;
  var checkBoundsAction = null;
  var exportAction = null;
  function checkAnimationBounds() {
    const animation = Animation.selected ?? Animation.all[0];
    if (!animation) {
      Blockbench.showQuickMessage(tr("dap.bounds.no_animation"), 2e3);
      return;
    }
    const fps = animation.snapping || 20;
    const frameCount = frameCountFor(animation.length, fps);
    const { frames, outOfBounds } = bakeFrames(frameCount, fps);
    const description = describeOutOfBounds(outOfBounds);
    if (!description) {
      Blockbench.showMessageBox({
        title: tr("dap.bounds.passed_title"),
        message: tr("dap.bounds.passed_message", { frames: frames.length, fps }),
        icon: "check_circle"
      });
      return;
    }
    Blockbench.showMessageBox({
      title: tr("dap.export.bounds_title"),
      message: description,
      icon: "warning"
    });
  }
  Plugin.register("display_anim_preview", {
    title: isChineseOnlyBuild() ? "Java \u9010\u5E27\u663E\u793A\u52A8\u753B" : "Java Display Animator",
    author: "rieyi",
    description: isChineseOnlyBuild() ? "\u6309\u663E\u793A\u4F4D\u7F6E\u9884\u89C8 Minecraft Java \u9010\u5E27\u70D8\u7119\u7269\u54C1\u52A8\u753B\uFF0C\u5E76\u5BFC\u51FA\u5B8C\u6574\u8D44\u6E90\u5305\u548C\u52A8\u753B\u9A71\u52A8\u6570\u636E\u5305\u3002" : "Preview frame-baked Minecraft Java item animations per display context and export complete resource packs and animation-driving datapacks.",
    ...true ? {} : { about: isChineseOnlyBuild() ? ABOUT_ZH : ABOUT_EN },
    icon: "icon.png",
    tags: ["Minecraft: Java Edition", "Animation", "Exporter"],
    version: "1.0.0",
    min_version: "5.1.5",
    variant: "desktop",
    creation_date: "2026-08-07",
    has_changelog: true,
    repository: "https://github.com/rieyi/display-anim-preview",
    bug_tracker: "https://github.com/rieyi/display-anim-preview/issues",
    await_loading: true,
    contributes: {
      formats: [FORMAT_ID]
    },
    onload() {
      registerTranslations();
      registerDisplayAnimationProperty();
      registerModelFormat();
      initializePlaybackSync();
      openAction = new Action(OPEN_ACTION_ID, {
        name: tr("dap.action.open"),
        description: tr("dap.action.open_desc"),
        icon: "movie",
        category: "animation",
        click() {
          openControlPanel();
          enterDisplaySlot(currentSlot());
        }
      });
      checkBoundsAction = new Action(CHECK_BOUNDS_ACTION_ID, {
        name: tr("dap.action.bounds"),
        description: tr("dap.action.bounds_desc"),
        icon: "settings_overscan",
        category: "animation",
        click: checkAnimationBounds
      });
      exportAction = new Action(EXPORT_ACTION_ID, {
        name: tr("dap.action.export"),
        description: tr("dap.action.export_desc"),
        icon: "inventory_2",
        category: "animation",
        click: openExportDialog
      });
      for (const action of [openAction, checkBoundsAction, exportAction]) {
        for (const path of ["filter", "tools"]) {
          try {
            MenuBar.addAction(action, path);
          } catch (err) {
            console.warn(`Menu path "${path}" not available, skipping`, err);
          }
        }
      }
    },
    onunload() {
      disposeControlPanel();
      disposePlaybackSync();
      openAction?.delete();
      openAction = null;
      checkBoundsAction?.delete();
      checkBoundsAction = null;
      exportAction?.delete();
      exportAction = null;
      unregisterModelFormat();
      unregisterDisplayAnimationProperty();
    }
  });
})();
