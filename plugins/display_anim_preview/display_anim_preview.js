"use strict";
(() => {
  // src/i18n.ts
  var EN = {
    "dap.menu.name": "Java Display Animator",
    "dap.fp.open": "Open First-person Preview",
    "dap.fp.open_desc": "Open the live animation preview with native display framing",
    "dap.fp.name": "First-person Animation Preview",
    "dap.fp.side": "First-person Display Context",
    "dap.format.name": "Java Display Animation",
    "dap.format.description": "Create frame-baked keyframe animation projects for Minecraft Java Edition",
    "dap.property.name": "Display Context Animation",
    "dap.property.description": "Choose whether each item display context plays the frame animation",
    "dap.panel.name": "Display Animation Preview",
    "dap.panel.slot": "Display Context",
    "dap.panel.animation": "Preview Animation",
    "dap.panel.animate": "Animate Current Display Context",
    "dap.panel.animate_hint": "Enabled contexts follow custom_model_data frames; disabled contexts stay on frame 0.",
    "dap.panel.play": "Play / Pause",
    "dap.panel.play_disabled": "Animation is disabled for this display context.",
    "dap.panel.loop": "Loop Playback",
    "dap.panel.low_fps": "Low FPS",
    "dap.panel.low_fps_hint": "Preview at the animation snapping rate to simulate non-interpolated in-game playback",
    "dap.panel.preview_fps": "FPS",
    "dap.panel.preview_fps_hint": "Project animation rate from 1 to Minecraft's 20 FPS limit. This controls preview, exported model frames, and datapack playback pacing.",
    "dap.action.open": "Open Display Animation Preview",
    "dap.action.open_desc": "Preview animation by display context with independent playback controls",
    "dap.action.bounds": "Check Animation Model Bounds",
    "dap.action.bounds_desc": "List baked frames outside Minecraft's -16 to 32 model limits",
    "dap.action.export": "Export Resource Pack and Datapack",
    "dap.action.export_desc": "Select and bake multiple animations, then generate a complete resource pack and animation-driving datapack",
    "dap.action.settings": "Java Display Animator Project Settings",
    "dap.action.settings_desc": "Edit animations, pack folders, item mapping, and datapack runtime settings",
    "dap.settings.title": "Java Display Animator Project Settings",
    "dap.settings.no_project": "Open a project before editing export settings",
    "dap.settings.page.general": "General",
    "dap.settings.page.hands": "Player Arms",
    "dap.settings.page.animations": "Animations",
    "dap.settings.page.files": "Pack Files",
    "dap.settings.page.datapack": "Datapack",
    "dap.settings.page.api": "Developer API",
    "dap.settings.general_desc": "Project identity and generated item settings.",
    "dap.settings.hands_desc": "Create or delete the position-placeholder arm rig for first-person player-skin hands.",
    "dap.settings.animations_desc": "Choose the complete exported animation group and its default animation.",
    "dap.settings.files_desc": "Create new packs or point directly at existing unpacked pack folders. Resource-pack and datapack locations are independent.",
    "dap.settings.datapack_desc": "Advanced runtime names used by the generated animation driver.",
    "dap.settings.api_desc": "Quick reference generated from the current project settings.",
    "dap.settings.copy": "Copy",
    "dap.settings.copied": "Copied to clipboard",
    "dap.settings.copy_failed": "Could not access the clipboard",
    "dap.settings.clipboard_permission": "Java Display Animator needs clipboard access to copy this datapack API reference.",
    "dap.settings.api_item": "Item model ID",
    "dap.settings.api_item_note": "Use this ID in the minecraft:item_model component.",
    "dap.settings.api_common": "Common functions",
    "dap.settings.api_common_note": "Give the animated item or stop the current animation.",
    "dap.settings.api_short": "Short functions for testing and fixed animation calls",
    "dap.settings.api_short_note": "Replace <animation> with an exported animation key.",
    "dap.settings.api_macro": "Macro functions for dynamic datapack calls",
    "dap.settings.api_macro_note": "Use these when the animation name or mode is supplied dynamically.",
    "dap.settings.api_context": "Run as a specified player",
    "dap.settings.api_context_note": "Public functions operate on executor @s; use execute as for another player.",
    "dap.settings.api_animation_placeholder": "animation",
    "dap.settings.api_player_placeholder": "player",
    "dap.settings.api_no_animation": "No animation is currently selected for export.",
    "dap.settings.api_reference": "Datapack reference: public functions are under data/jsb/function/{project}/. Functions operate on executor @s. Each unstackable item stores its own playback state in custom_data.jsb; custom_model_data.strings[0] stores the animation key and floats[0] stores the local frame.",
    "dap.settings.shared_root": "Shared Create Root",
    "dap.settings.resource_folder": "Resource-Pack Folder / Parent",
    "dap.settings.datapack_folder": "Datapack Folder / Parent",
    "dap.settings.folder_empty": "Choose a folder or leave empty to ask during export",
    "dap.settings.browse": "Browse...",
    "dap.settings.saved_hint": "Changes are stored in this Blockbench project immediately; save the project to keep them.",
    "dap.settings.close": "Close",
    "dap.settings.valid_identifier": "Valid Minecraft identifier",
    "dap.settings.invalid_identifier": "Use lowercase a-z, 0-9, underscore, hyphen, or period; reserved path names are not allowed.",
    "dap.settings.valid_runtime_name": "Valid runtime name",
    "dap.settings.invalid_runtime_name": "Use 1-16 characters: letters, numbers, period, underscore, plus, or hyphen.",
    "dap.settings.valid_playing_tag": "Valid playback tag",
    "dap.settings.invalid_playing_tag": "Use letters, numbers, period, underscore, plus, or hyphen; spaces are not allowed.",
    "dap.settings.folder_optional": "No folder configured; Blockbench will ask during export.",
    "dap.settings.folder_missing": "The selected path does not exist.",
    "dap.settings.folder_unreadable": "This path is not a readable folder or permission has not been granted.",
    "dap.settings.folder_valid_parent": "Valid output parent folder",
    "dap.settings.folder_no_pack_meta": "Insert mode requires pack.mcmeta in this folder.",
    "dap.settings.folder_invalid_pack_meta": "pack.mcmeta is not valid JSON with a pack object.",
    "dap.settings.folder_valid_pack": "Valid existing unpacked pack",
    "dap.settings.folder_no_assets": "pack.mcmeta is valid; the missing assets folder will be created during insertion.",
    "dap.settings.folder_no_data": "pack.mcmeta is valid; the missing data folder will be created during insertion.",
    "dap.settings.folder_valid_shared": "Both named packs exist under resource-packs/ and datapacks/.",
    "dap.settings.folder_invalid_shared": "Expected resource-packs/<pack>/pack.mcmeta and datapacks/<pack>/pack.mcmeta under this root.",
    "dap.settings.create_desc": "Create named pack folders inside the selected output location.",
    "dap.settings.insert_desc": "Read and update existing unpacked packs while preserving unrelated files.",
    "dap.settings.shared_desc": "Keep resource-packs/<pack> and datapacks/<pack> under one map output root.",
    "dap.settings.separate_desc": "Configure resource-pack and datapack locations independently.",
    "dap.settings.resource_only_desc": "Generate or update only models, item definitions, and textures.",
    "dap.settings.datapack_only_desc": "Generate or update only the animation driver; requires a matching resource pack.",
    "dap.settings.animations_valid": "{count} animations selected; every generated key is valid and unique.",
    "dap.settings.animations_empty": "Select at least one animation.",
    "dap.settings.animations_invalid": "Resolve invalid or duplicate animation keys: {details}",
    "dap.export.open_settings_hint": "Open Java Display Animator Project Settings to correct this value, then export again.",
    "dap.export.property.name": "Animation Export Selection",
    "dap.export.property.description": "Remembers export settings only after files are written successfully",
    "dap.export.title": "Export Resource Pack and Datapack",
    "dap.export.select_title": "Select Animations to Export",
    "dap.export.select_help": "Choose the animations to bake. Each Minecraft key is generated from its Blockbench animation name and is used by the play, loop, and frame commands.",
    "dap.export.selection": "Selection",
    "dap.export.select_all": "Select All",
    "dap.export.select_none": "Select None",
    "dap.export.select_required": "Select at least one animation before continuing.",
    "dap.export.animation_row": "Key: {key} \xB7 Duration: {duration}s \xB7 Source: {source_fps} FPS \xB7 Output: {game_frames} frames at {game_fps} FPS",
    "dap.export.invalid_key": "invalid key",
    "dap.export.key_conflict_title": "Animation Names Cannot Be Exported",
    "dap.export.key_conflict_message": "Rename the listed animations so every generated Minecraft key is valid and unique:\n\n{details}",
    "dap.export.key_conflict_entry": 'Key "{key}": {animations}',
    "dap.export.animation_summary": "{animation} \u2192 {key} \xB7 {source_fps} FPS \u2192 {game_frames} game frames",
    "dap.export.default_animation": "Default Animation",
    "dap.export.default_missing": "The selected default animation is no longer available.",
    "dap.export.output": "Export Contents",
    "dap.export.write_mode": "Write Mode",
    "dap.export.write_mode.create": "Create New Pack",
    "dap.export.write_mode.insert": "Insert into Existing Pack",
    "dap.export.pack_name": "Pack Name",
    "dap.export.project_name": "Project Name",
    "dap.export.project_name_hint": "Unique module ID under the fixed jsb namespace. Used in paths and commands.",
    "dap.export.base_item": "Mapped Item",
    "dap.export.display_name": "Item Display Name",
    "dap.export.frame_objective": "Frame Scoreboard",
    "dap.export.mode_objective": "Mode Scoreboard",
    "dap.export.max_frame_objective": "Maximum Frame Scoreboard",
    "dap.export.objective_conflict": "Frame, mode, and maximum-frame scoreboards must use three different names.",
    "dap.export.playing_tag": "Playback Tag",
    "dap.export.mode.both_default": "Resource Pack + Datapack (Shared Root)",
    "dap.export.mode.both_separate": "Resource Pack + Datapack (Separate Parents)",
    "dap.export.mode.resource_only": "Resource Pack Only",
    "dap.export.mode.datapack_only": "Datapack Only",
    "dap.export.cancel": "Cancel",
    "dap.export.cancel_export": "Cancel Export",
    "dap.export.export_anyway": "Export Anyway",
    "dap.export.warnings_title": "Review Export Warnings",
    "dap.export.open_bounds_check": "Open Bounds Checker",
    "dap.export.problem_frames": "Problem frames",
    "dap.export.locate_frame": "Frame {frame}",
    "dap.export.located_frame": "Located {animation}, frame {frame}",
    "dap.export.cancelled": "Export cancelled; no files were generated",
    "dap.export.preparing_files": "Warnings confirmed; preparing pack files\u2026",
    "dap.export.overwrite": "Overwrite and Export",
    "dap.export.resource_pack": "Resource Pack",
    "dap.export.datapack": "Datapack",
    "dap.export.pick_shared": "Select export root (creates resource-packs/{pack}/ and datapacks/{pack}/)",
    "dap.export.pick_resource": "Select resource-pack parent folder (creates {pack}/)",
    "dap.export.pick_datapack": "Select datapack parent folder (creates {pack}/)",
    "dap.export.pick_existing_resource": "Select an existing unpacked resource-pack folder",
    "dap.export.pick_existing_datapack": "Select an existing unpacked datapack folder",
    "dap.export.baking": "Baking {frames} frames at {fps} FPS\u2026",
    "dap.export.baking_animation": "Baking {animation}: {frames} frames at {fps} FPS\u2026",
    "dap.export.failed": "Export Failed",
    "dap.export.no_frames": "No frames were baked. Make sure the animation contains keyframes.",
    "dap.export.no_frames_for_animation": "No frames were baked for {animation}. Make sure the animation contains keyframes.",
    "dap.export.no_animated_context_title": "No Display Context Plays Animation",
    "dap.export.no_animated_context_message": "Every display context has animation disabled. The resource pack will contain only frame 0 of the default animation {default_animation}; the other selected animations will not have a visible playback route.",
    "dap.export.datapack_only_title": "Datapack Requires a Matching Resource Pack",
    "dap.export.datapack_only_message": "This datapack uses the selected animation keys and frame counts. Pair it only with a resource pack exported with the same animation mapping.",
    "dap.export.resampled_title": "Resampled to the Game Frame Rate",
    "dap.export.resampled_message": "The animation snapping rate is {source_fps} FPS, while the project export rate is {game_fps} FPS.\n\nThis export will use {frames} frames at {game_fps} FPS to preserve its duration.",
    "dap.export.texture_mismatch_title": "Texture Resolution Mismatch",
    "dap.export.texture_mismatch": "Project UV resolution is {project_width}\xD7{project_height}, but these textures use different dimensions:\n\n{textures}\n\nExported UVs may be offset. Update File \u2192 Project Settings before exporting.",
    "dap.export.bounds_title": "Some Frames Exceed Model Bounds",
    "dap.export.resource_description": "{name} ({frames} frames @ {fps} FPS)",
    "dap.export.datapack_description": "Frame animation driver for {name} ({frames} frames)",
    "dap.export.resource_description_multi": "{name} ({animations} animations, {frames} sampled frames @ {fps} FPS)",
    "dap.export.datapack_description_multi": "Multi-animation frame driver for {name} ({animations} animations, {frames} frames)",
    "dap.export.complete": "Export Complete",
    "dap.export.complete_heading": "Export succeeded",
    "dap.export.item_model_id": "Item model ID: {id}",
    "dap.export.locations": "Verified and wrote {count} files.\n\n{locations}",
    "dap.export.write_success": "Successfully verified and wrote {count} files",
    "dap.export.output_locations": "Output locations",
    "dap.export.optimization": "Space optimization: sampled {sampled} frames, wrote {unique} unique models, and deduplicated {duplicates} frames.\nModel JSON: {before} \u2192 {after}.",
    "dap.export.space_optimization": "Space optimization:",
    "dap.export.optimization_statistics": "Sampled {sampled} frames, wrote {unique} unique models, and deduplicated {duplicates} frames.",
    "dap.export.model_json_size": "Model JSON: {before} \u2192 {after}",
    "dap.export.animation_report": "{animation}: {frames} sampled frames",
    "dap.export.omitted": "Omitted {faces} untextured faces and removed {elements} elements without visible faces.",
    "dap.export.animation_keys": "Animation keys: {keys}",
    "dap.export.commands": "In-game commands:",
    "dap.settings.developer_tips": "Developer tips",
    "dap.settings.developer_tips_help": "Show in-game feedback when the datapack activates, gives the item, or starts and stops playback. Turn off for a fully silent datapack.",
    "dap.settings.hand_rendering": "Render player-skin hands",
    "dap.settings.hand_rendering_help": "Creates standard 4\xD74\xD712 box-UV placeholder arm cubes (left at 0,0,4, right at 12,0,4) textured with the built-in 16\xD716 default texture; Exported position and rotation follow the arm groups, including their static placement and animation. Preview dimensions are independent; left/right marker scales remain fixed. Exports a Minecraft 26.2 core entity shader, which may conflict with packs replacing the same shader.",
    "dap.hand.skin_version_help": "Player-skin arms currently require Minecraft Java 1.21.11 or newer.",
    "dap.hand.shader_incompatible": "Incompatible with shader packs",
    "dap.hand.shader_incompatible_help": "Disable shader packs when using player-skin arms. Shader packs can bypass the arm texture conversion and display player-head textures instead.",
    "dap.hand.undo_create": "Create player hand rig",
    "dap.hand.undo_delete": "Delete player hand rig",
    "dap.hand.delete": "Delete player hand binding\u2026",
    "dap.hand.delete_title": "Delete Player Hand Binding",
    "dap.hand.delete_message": "Plugin-created arm groups and their animation tracks will be removed. Adopted lefthand/righthand groups are only unbound and are not deleted.",
    "dap.hand.delete_confirm": "Delete binding",
    "dap.hand.scale_unsupported": "Animation {animation} contains scale keyframes on {group}. Player-hand scale animation is unsupported because the shader uses exact scale values to identify each arm.",
    "dap.hand.rig_missing": 'Player-hand rendering is enabled, but the arm binding is missing. Re-enable "Render player arms" in Project Settings to recreate it.',
    "dap.settings.exact_bounds_export": "Run exact bounds check before export",
    "dap.settings.exact_bounds_export_help": "Validate the isolated export bake and remember exact per-animation results. Disable this to bake without range warnings or detection status.",
    "dap.export.summary": "Export summary",
    "dap.export.developer_info": "Developer information",
    "dap.export.developer_tips_status": "Developer tips: {status}",
    "dap.export.hand_rendering_status": "Player-skin hands: {status}",
    "dap.export.developer_tips_enabled": "Enabled",
    "dap.export.developer_tips_disabled": "Disabled",
    "dap.export.hand_rendering_warning_title": "Player-Skin Hands Use a Core Shader",
    "dap.export.hand_rendering_warning_message": "This export replaces Minecraft 26.2's entity core shader and can conflict with shader/resource packs that replace the same file. Left and right arm poses are sampled per frame and exported to both first-person display contexts.",
    "dap.export.hand_rendering_resource_only_title": "A Profile-Bearing Player Head Is Required",
    "dap.export.hand_rendering_resource_only_message": "Resource-pack-only export cannot assign the viewer's skin. Use a minecraft:player_head carrying minecraft:profile and the generated item_model, or export the matching datapack and run its give function.",
    "dap.export.preflight_title": "Review File Changes",
    "dap.export.preflight_message": "The JSB project module will make these changes:\n\n{summary}",
    "dap.export.preflight_added": "New project files",
    "dap.export.preflight_updated": "Updated project files",
    "dap.export.preflight_removed": "Removed stale project files",
    "dap.export.preflight_merged": "Merged load/tick tags",
    "dap.export.confirm_write": "Write Changes",
    "dap.export.conflict_title": "Path Conflict",
    "dap.export.conflict_message": "The following paths already exist but are not owned by this JSB project. No files were written:\n\n{paths}",
    "dap.export.invalid_identifier_title": "Invalid Pack or Project Name",
    "dap.export.invalid_identifier_message": "Use a safe lowercase Minecraft-style ID containing only a-z, 0-9, underscore, hyphen, or period. The project name cannot be _generated, . or ..",
    "dap.export.write_error": "An error occurred while writing files:\n{error}",
    "dap.export.target_exists": "Target Pack Already Exists",
    "dap.export.target_exists_message": "Continuing overwrites matching files but does not delete other files:\n\n{summary}",
    "dap.export.file_count": "{count} files",
    "dap.export.prepare_failed": "Export Preparation Failed",
    "dap.export.busy": "The previous export is still running",
    "dap.export.no_animation_title": "No Animation to Export",
    "dap.export.no_animation_message": "Create an animation with keyframes before exporting.",
    "dap.export.fps_exact": "Exports {frames} frames at the project rate of {game_fps} FPS.",
    "dap.export.fps_resample": "The current snapping rate is {source_fps} FPS ({source_frames} source samples). Export resamples to {game_fps} FPS ({game_frames} frames) while preserving duration.",
    "dap.export.folder_help": "Create mode selects a parent folder and creates <pack name>/ inside it. Insert mode selects an existing unpacked pack folder with pack.mcmeta. Paths are not stored in the project.",
    "dap.bounds.no_animation": "No animation is available to check",
    "dap.bounds.passed_title": "Model Bounds Check Passed",
    "dap.bounds.passed_heading": "No out-of-range frames found",
    "dap.bounds.passed_message": "Checked {frames} frames at {fps} FPS. All coordinates are within -16 to 32.",
    "dap.bounds.passed_animation": "Animation checked: {animation}",
    "dap.bounds.passed_animations": "Animations checked: {animations}",
    "dap.bounds.panel_title": "Model Bounds Check",
    "dap.bounds.panel_checked_animations": "Checked {animations} animations",
    "dap.bounds.panel_failed": "Found problems in {frames} frames",
    "dap.bounds.panel_passed": "All {frames} frames passed",
    "dap.bounds.panel_all_passed": "All animations passed",
    "dap.bounds.animation_failed": "{frames} problem frames",
    "dap.bounds.animation_passed": "Passed \xB7 {frames} frames",
    "dap.bounds.panel_hint": "Select a frame to locate it, outline affected parts, and open the nearest influencing keyframe. After editing, run the check again.",
    "dap.bounds.recheck": "Check Again",
    "dap.bounds.mode.quick": "Quick Math Check",
    "dap.bounds.mode.exact": "Exact Isolated Check",
    "dap.bounds.mode.export_bake": "Isolated Export Bake",
    "dap.bounds.choose_title": "Choose Bounds Check Mode",
    "dap.bounds.choose_message": "Quick Check uses non-destructive matrix math. Exact Check creates a disposable in-memory project and verifies every frame with Blockbench's Java codec.",
    "dap.bounds.choose_cancel": "Cancel",
    "dap.bounds.progress_preparing": "Preparing range check\u2026",
    "dap.bounds.progress_title": "{mode}: {animation}",
    "dap.bounds.progress_frames": "Animation frame {frame}/{frames} \xB7 Total {completed}/{total}",
    "dap.bounds.progress_status": "{mode}: {animation} {frame}/{frames}",
    "dap.bounds.export_bake_complete": "Isolated export bake complete",
    "dap.bounds.export_bake_complete_detail": "Generated {frames} frames from {animations} animations. You can continue the export workflow.",
    "dap.bounds.cancel": "Cancel Check",
    "dap.bounds.cancelling": "Cancelling\u2026",
    "dap.bounds.cancelled": "Bounds check cancelled; no partial result was cached",
    "dap.bounds.cache_reused": "Reused valid results for {animations} animations",
    "dap.bounds.cache_all_reused": "The model has not changed; all valid range results were reused",
    "dap.bounds.status.unchecked": "Not checked",
    "dap.bounds.status.stale": "Changed after check",
    "dap.bounds.status.quick_passed": "Quick passed",
    "dap.bounds.status.quick_failed": "Quick warning",
    "dap.bounds.status.exact_passed": "Exact passed",
    "dap.bounds.status.exact_failed": "Exact warning",
    "dap.bounds.checking": "Checking {animation} at the project animation rate\u2026",
    "dap.bounds.checking_animations": "Checking {animations} animations at the project animation rate\u2026",
    "dap.bounds.check_in_progress": "A model bounds check is already running",
    "dap.bounds.located": "Located {animation}, frame {frame}",
    "dap.bounds.edit_in_progress_title": "Finish the Current Edit First",
    "dap.bounds.edit_in_progress_message": "Blockbench still has an unfinished model or keyframe edit. Press Enter or click the viewport to commit it, then run the bounds check again. No check was started.",
    "dap.bounds.check_failed_title": "Bounds Check Failed",
    "dap.bake.active_edit": "Bounds checking and export cannot bake frames while another Blockbench edit transaction is active.",
    "dap.bounds.frame": "Frame {frame}: {parts}, {field}.{axis} = {value}",
    "dap.bounds.parts_many": "{names} and {count} parts",
    "dap.bounds.summary": "Parts exceed Minecraft model bounds in {frames} frames (every axis must remain between -16 and 32).",
    "dap.bounds.guidance": "Out-of-range frames may render offset or disappear. Use the datapack frame command to inspect these frames, then reduce the affected motion in Blockbench:",
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
    "dap.error.duplicate_target": "Two generated packs resolve to the same target folder: {path}",
    "dap.error.unsafe_path": "Generated file path is unsafe and was rejected: {path}",
    "dap.error.no_models": "No models are available for the item definition",
    "dap.error.external_texture": 'Texture "{label}" still references external atlas "{value}". Minecraft 26.2 item models cannot mix item and block atlases.',
    "dap.error.texture_not_generated": "Model references a texture that was not generated: {value}",
    "dap.error.manifest_invalid": "The JSB project manifest is invalid: {path}",
    "dap.error.invalid_pack": "Insert mode requires an unpacked pack folder with a valid pack.mcmeta: {path}",
    "dap.error.shared_tag_invalid": "The existing function tag is invalid and was not modified: {path}",
    "dap.error.path_conflicts": "Existing files are not owned by this JSB project and cannot be overwritten:\n{paths}",
    "dap.error.rollback_partial": "The export failed and the automatic rollback could not restore some files; check these paths manually:\n{paths}",
    "dap.datapack.loaded": "Datapack loaded. Run /function {namespace}/give to get the animated item.",
    "dap.datapack.item_given": "Animated item given ({animation}, frame 0). While holding it, call /function {namespace}/play/<animation>, /function {namespace}/loop/<animation>, or /function {namespace}/frame/<animation> {frame:12}; use /function {namespace}/stop to stop.",
    "dap.datapack.hold_item": "Hold the animated item in your main hand first.",
    "dap.datapack.loop_started": "Loop playback started for {animation} ({fps} FPS, frames 0-{last_frame}).",
    "dap.datapack.once_started": "Single playback started for {animation}; after frame {last_frame}, it will reset to the default animation's frame 0.",
    "dap.datapack.current_frame": "Current frame: ",
    "dap.datapack.reset": "Reset to frame 0.",
    "dap.datapack.stopped": "Playback stopped and reset to the default animation's frame 0.",
    "dap.datapack.invalid_animation": "Unknown animation key: {animation}",
    "dap.datapack.invalid_mode": "Invalid playback mode: {mode}. Use once or loop.",
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
    "dap.menu.name": "Java \u9010\u5E27\u663E\u793A\u52A8\u753B",
    "dap.format.name": "Java \u9010\u5E27\u663E\u793A\u52A8\u753B",
    "dap.format.description": "\u4E3A Minecraft Java \u7248\u521B\u5EFA\u9010\u5E27\u51E0\u4F55\u70D8\u7119\u5173\u952E\u5E27\u52A8\u753B\u5DE5\u7A0B",
    "dap.property.name": "\u663E\u793A\u4F4D\u7F6E\u52A8\u753B",
    "dap.property.description": "\u5206\u522B\u51B3\u5B9A\u6BCF\u4E2A\u7269\u54C1\u663E\u793A\u4F4D\u7F6E\u662F\u5426\u64AD\u653E\u9010\u5E27\u52A8\u753B",
    "dap.fp.open": "\u5F00\u542F\u7B2C\u4E00\u4EBA\u79F0\u9884\u89C8",
    "dap.fp.open_desc": "\u6253\u5F00\u4E0E\u539F\u751F\u663E\u793A\u753B\u5E45\u4E00\u81F4\u7684\u7B2C\u4E00\u4EBA\u79F0\u52A8\u753B\u5B9E\u65F6\u9884\u89C8\u9762\u677F",
    "dap.fp.name": "\u7B2C\u4E00\u4EBA\u79F0\u52A8\u753B\u9884\u89C8",
    "dap.fp.side": "\u7B2C\u4E00\u4EBA\u79F0\u663E\u793A\u4F4D\u7F6E",
    "dap.panel.name": "\u663E\u793A\u4F4D\u7F6E\u52A8\u753B\u9884\u89C8",
    "dap.panel.slot": "\u663E\u793A\u4F4D\u7F6E",
    "dap.panel.animation": "\u9884\u89C8\u52A8\u753B",
    "dap.panel.animate": "\u5F53\u524D\u663E\u793A\u4F4D\u7F6E\u64AD\u653E\u52A8\u753B",
    "dap.panel.animate_hint": "\u542F\u7528\u540E\u968F custom_model_data \u64AD\u653E\u9010\u5E27\u52A8\u753B\uFF0C\u5173\u95ED\u65F6\u56FA\u5B9A\u4F7F\u7528\u7B2C 0 \u5E27\u3002",
    "dap.panel.play": "\u64AD\u653E / \u6682\u505C",
    "dap.panel.play_disabled": "\u5F53\u524D\u663E\u793A\u4F4D\u7F6E\u5DF2\u5173\u95ED\u52A8\u753B\u3002",
    "dap.panel.loop": "\u5FAA\u73AF\u64AD\u653E",
    "dap.panel.low_fps": "\u4F4E\u5E27",
    "dap.panel.low_fps_hint": "\u6309\u53F3\u4FA7\u624B\u52A8\u5E27\u7387\u9010\u5E27\u9884\u89C8\uFF0C\u6A21\u62DF\u6E38\u620F\u5185\u65E0\u63D2\u503C\u64AD\u653E",
    "dap.panel.preview_fps": "\u9884\u89C8 FPS",
    "dap.panel.preview_fps_hint": "\u53EF\u624B\u52A8\u8BBE\u7F6E 1\u201320 FPS\uFF0C\u4E0A\u9650\u4E0E Minecraft \u6BCF\u79D2 20 \u6E38\u620F\u523B\u4E00\u81F4\uFF1B\u540C\u65F6\u63A7\u5236\u9884\u89C8\u3001\u5BFC\u51FA\u6A21\u578B\u5E27\u6570\u548C\u6570\u636E\u5305\u64AD\u653E\u8282\u594F\u3002",
    "dap.action.open": "\u6253\u5F00\u663E\u793A\u4F4D\u7F6E\u52A8\u753B\u9884\u89C8",
    "dap.action.open_desc": "\u6309\u663E\u793A\u4F4D\u7F6E\u9884\u89C8\u52A8\u753B\u5E76\u63D0\u4F9B\u72EC\u7ACB\u64AD\u653E\u63A7\u4EF6",
    "dap.action.bounds": "\u68C0\u67E5\u52A8\u753B\u6A21\u578B\u8303\u56F4",
    "dap.action.bounds_desc": "\u5217\u51FA\u70D8\u7119\u540E\u8D85\u51FA Minecraft -16 \u5230 32 \u6A21\u578B\u9650\u5236\u7684\u5E27",
    "dap.action.export": "\u5BFC\u51FA\u8D44\u6E90\u5305\u548C\u6570\u636E\u5305",
    "dap.action.export_desc": "\u9009\u62E9\u5E76\u70D8\u7119\u591A\u6BB5\u52A8\u753B\uFF0C\u7136\u540E\u751F\u6210\u5B8C\u6574\u8D44\u6E90\u5305\u548C\u52A8\u753B\u9A71\u52A8\u6570\u636E\u5305",
    "dap.action.settings": "Java \u663E\u793A\u52A8\u753B\u5668\u9879\u76EE\u8BBE\u7F6E",
    "dap.action.settings_desc": "\u5728\u5236\u4F5C\u8FC7\u7A0B\u4E2D\u4FEE\u6539\u52A8\u753B\u3001\u5305\u76EE\u5F55\u3001\u7269\u54C1\u6620\u5C04\u548C\u6570\u636E\u5305\u9A71\u52A8\u8BBE\u7F6E",
    "dap.settings.title": "Java \u663E\u793A\u52A8\u753B\u5668\u9879\u76EE\u8BBE\u7F6E",
    "dap.settings.no_project": "\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A\u9879\u76EE",
    "dap.settings.page.general": "\u5E38\u89C4",
    "dap.settings.page.hands": "\u73A9\u5BB6\u624B\u81C2",
    "dap.settings.page.animations": "\u52A8\u753B",
    "dap.settings.page.files": "\u5305\u6587\u4EF6",
    "dap.settings.page.datapack": "\u6570\u636E\u5305",
    "dap.settings.page.api": "\u5F00\u53D1\u63A5\u53E3",
    "dap.settings.general_desc": "\u8BBE\u7F6E\u9879\u76EE\u6807\u8BC6\u548C\u751F\u6210\u7269\u54C1\u3002",
    "dap.settings.hands_desc": "\u521B\u5EFA\u6216\u5220\u9664\u7B2C\u4E00\u4EBA\u79F0\u73A9\u5BB6\u624B\u81C2\u7684\u4F4D\u7F6E\u5360\u4F4D\u9AA8\u67B6\u3002",
    "dap.settings.animations_desc": "\u9009\u62E9\u8981\u5BFC\u51FA\u7684\u5B8C\u6574\u52A8\u753B\u7EC4\u548C\u9ED8\u8BA4\u52A8\u753B\u3002",
    "dap.settings.files_desc": "\u521B\u5EFA\u65B0\u5305\uFF0C\u6216\u76F4\u63A5\u6307\u5411\u5DF2\u89E3\u538B\u7684\u73B0\u6709\u5305\u76EE\u5F55\u3002\u8D44\u6E90\u5305\u4E0E\u6570\u636E\u5305\u5206\u522B\u914D\u7F6E\u3002",
    "dap.settings.datapack_desc": "\u914D\u7F6E\u52A8\u753B\u9A71\u52A8\u4F7F\u7528\u7684\u9AD8\u7EA7\u8FD0\u884C\u65F6\u540D\u79F0\u3002",
    "dap.settings.api_desc": "\u6839\u636E\u5F53\u524D\u9879\u76EE\u8BBE\u7F6E\u663E\u793A\u8C03\u7528\u901F\u67E5\u3002",
    "dap.settings.copy": "\u590D\u5236",
    "dap.settings.copied": "\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",
    "dap.settings.copy_failed": "\u65E0\u6CD5\u8BBF\u95EE\u526A\u8D34\u677F",
    "dap.settings.clipboard_permission": "Java \u663E\u793A\u52A8\u753B\u5668\u9700\u8981\u8BBF\u95EE\u526A\u8D34\u677F\uFF0C\u624D\u80FD\u590D\u5236\u6570\u636E\u5305\u63A5\u53E3\u5F15\u7528\u3002",
    "dap.settings.api_item": "\u7269\u54C1\u6A21\u578B ID",
    "dap.settings.api_item_note": "\u7528\u4E8E minecraft:item_model \u7269\u54C1\u7EC4\u4EF6\u3002",
    "dap.settings.api_common": "\u901A\u7528\u51FD\u6570",
    "dap.settings.api_common_note": "\u7ED9\u4E88\u52A8\u753B\u7269\u54C1\uFF0C\u6216\u505C\u6B62\u5F53\u524D\u52A8\u753B\u3002",
    "dap.settings.api_short": "\u6D4B\u8BD5\u4E0E\u56FA\u5B9A\u52A8\u753B\u8C03\u7528",
    "dap.settings.api_short_note": "\u5C06 <\u52A8\u753B\u540D> \u66FF\u6362\u4E3A\u5BFC\u51FA\u7684\u52A8\u753B key\u3002",
    "dap.settings.api_macro": "\u6570\u636E\u5305\u52A8\u6001\u8C03\u7528\u5B8F\u63A5\u53E3",
    "dap.settings.api_macro_note": "\u52A8\u753B\u540D\u6216\u64AD\u653E\u6A21\u5F0F\u9700\u8981\u7531\u5730\u56FE\u903B\u8F91\u52A8\u6001\u4F20\u5165\u65F6\u4F7F\u7528\u3002",
    "dap.settings.api_context": "\u6307\u5B9A\u73A9\u5BB6\u4F5C\u4E3A\u6267\u884C\u8005",
    "dap.settings.api_context_note": "\u516C\u5F00\u51FD\u6570\u4EE5\u6267\u884C\u8005 @s \u4E3A\u76EE\u6807\uFF1B\u64CD\u4F5C\u5176\u4ED6\u73A9\u5BB6\u65F6\u4F7F\u7528 execute as\u3002",
    "dap.settings.api_animation_placeholder": "\u52A8\u753B\u540D",
    "dap.settings.api_player_placeholder": "\u73A9\u5BB6",
    "dap.settings.api_no_animation": "\u5F53\u524D\u6CA1\u6709\u9009\u62E9\u9700\u8981\u5BFC\u51FA\u7684\u52A8\u753B\u3002",
    "dap.settings.api_reference": "\u6570\u636E\u5305\u5F15\u7528\uFF1A\u516C\u5F00\u51FD\u6570\u4F4D\u4E8E data/jsb/function/{project}/\u3002\u51FD\u6570\u4EE5\u6267\u884C\u8005 @s \u4E3A\u76EE\u6807\uFF1B\u6BCF\u4EF6\u4E0D\u53EF\u5806\u53E0\u7269\u54C1\u5728 custom_data.jsb \u4E2D\u4FDD\u5B58\u72EC\u7ACB\u64AD\u653E\u72B6\u6001\uFF0Ccustom_model_data.strings[0] \u4FDD\u5B58\u52A8\u753B key\uFF0Cfloats[0] \u4FDD\u5B58\u5C40\u90E8\u5E27\u3002",
    "dap.settings.shared_root": "\u5171\u4EAB\u521B\u5EFA\u6839\u76EE\u5F55",
    "dap.settings.resource_folder": "\u8D44\u6E90\u5305\u76EE\u5F55 / \u7236\u76EE\u5F55",
    "dap.settings.datapack_folder": "\u6570\u636E\u5305\u76EE\u5F55 / \u7236\u76EE\u5F55",
    "dap.settings.folder_empty": "\u9009\u62E9\u76EE\u5F55\uFF0C\u6216\u7559\u7A7A\u4EE5\u5728\u5BFC\u51FA\u65F6\u8BE2\u95EE",
    "dap.settings.browse": "\u6D4F\u89C8\u2026",
    "dap.settings.saved_hint": "\u4FEE\u6539\u4F1A\u7ACB\u5373\u5199\u5165\u5F53\u524D Blockbench \u9879\u76EE\uFF1B\u8BF7\u4FDD\u5B58\u9879\u76EE\u4EE5\u4FDD\u7559\u3002",
    "dap.settings.close": "\u5173\u95ED",
    "dap.settings.valid_identifier": "Minecraft \u6807\u8BC6\u7B26\u6709\u6548",
    "dap.settings.invalid_identifier": "\u4EC5\u4F7F\u7528\u5C0F\u5199 a-z\u30010-9\u3001\u4E0B\u5212\u7EBF\u3001\u8FDE\u5B57\u7B26\u6216\u53E5\u70B9\uFF0C\u4E14\u4E0D\u80FD\u4F7F\u7528\u4FDD\u7559\u8DEF\u5F84\u540D\u3002",
    "dap.settings.valid_runtime_name": "\u8FD0\u884C\u65F6\u540D\u79F0\u6709\u6548",
    "dap.settings.invalid_runtime_name": "\u4F7F\u7528 1\u201316 \u4E2A\u5B57\u7B26\uFF1A\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u53E5\u70B9\u3001\u4E0B\u5212\u7EBF\u3001\u52A0\u53F7\u6216\u8FDE\u5B57\u7B26\u3002",
    "dap.settings.valid_playing_tag": "\u64AD\u653E\u6807\u8BB0\u6709\u6548",
    "dap.settings.invalid_playing_tag": "\u4EC5\u4F7F\u7528\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u53E5\u70B9\u3001\u4E0B\u5212\u7EBF\u3001\u52A0\u53F7\u6216\u8FDE\u5B57\u7B26\uFF0C\u4E0D\u80FD\u5305\u542B\u7A7A\u683C\u3002",
    "dap.settings.folder_optional": "\u672A\u914D\u7F6E\u76EE\u5F55\uFF1B\u5BFC\u51FA\u65F6\u7531 Blockbench \u8BE2\u95EE\u3002",
    "dap.settings.folder_missing": "\u6240\u9009\u8DEF\u5F84\u4E0D\u5B58\u5728\u3002",
    "dap.settings.folder_unreadable": "\u8BE5\u8DEF\u5F84\u4E0D\u662F\u53EF\u8BFB\u6587\u4EF6\u5939\uFF0C\u6216\u5C1A\u672A\u6388\u6743\u8BBF\u95EE\u3002",
    "dap.settings.folder_valid_parent": "\u6709\u6548\u7684\u8F93\u51FA\u7236\u76EE\u5F55",
    "dap.settings.folder_no_pack_meta": "\u63D2\u5165\u6A21\u5F0F\u8981\u6C42\u8BE5\u76EE\u5F55\u4E2D\u5B58\u5728 pack.mcmeta\u3002",
    "dap.settings.folder_invalid_pack_meta": "pack.mcmeta \u4E0D\u662F\u5305\u542B pack \u5BF9\u8C61\u7684\u6709\u6548 JSON\u3002",
    "dap.settings.folder_valid_pack": "\u6709\u6548\u7684\u5DF2\u89E3\u538B\u73B0\u6709\u5305",
    "dap.settings.folder_no_assets": "pack.mcmeta \u6709\u6548\uFF1B\u7F3A\u5C11\u7684 assets \u76EE\u5F55\u5C06\u5728\u63D2\u5165\u65F6\u521B\u5EFA\u3002",
    "dap.settings.folder_no_data": "pack.mcmeta \u6709\u6548\uFF1B\u7F3A\u5C11\u7684 data \u76EE\u5F55\u5C06\u5728\u63D2\u5165\u65F6\u521B\u5EFA\u3002",
    "dap.settings.folder_valid_shared": "resource-packs/ \u548C datapacks/ \u4E0B\u7684\u4E24\u4E2A\u540C\u540D\u5305\u5747\u5B58\u5728\u3002",
    "dap.settings.folder_invalid_shared": "\u8BE5\u6839\u76EE\u5F55\u4E0B\u5E94\u5B58\u5728 resource-packs/<\u5305\u540D>/pack.mcmeta \u548C datapacks/<\u5305\u540D>/pack.mcmeta\u3002",
    "dap.settings.create_desc": "\u5728\u6240\u9009\u8F93\u51FA\u4F4D\u7F6E\u5185\u521B\u5EFA\u6307\u5B9A\u5305\u540D\u7684\u6587\u4EF6\u5939\u3002",
    "dap.settings.insert_desc": "\u8BFB\u53D6\u5E76\u66F4\u65B0\u5DF2\u89E3\u538B\u73B0\u6709\u5305\uFF0C\u4FDD\u7559\u65E0\u5173\u6587\u4EF6\u3002",
    "dap.settings.shared_desc": "\u5C06 resource-packs/<\u5305> \u548C datapacks/<\u5305> \u4FDD\u5B58\u5728\u540C\u4E00\u5730\u56FE\u8F93\u51FA\u6839\u76EE\u5F55\u3002",
    "dap.settings.separate_desc": "\u5206\u522B\u914D\u7F6E\u8D44\u6E90\u5305\u4E0E\u6570\u636E\u5305\u4F4D\u7F6E\u3002",
    "dap.settings.resource_only_desc": "\u4EC5\u751F\u6210\u6216\u66F4\u65B0\u6A21\u578B\u3001\u7269\u54C1\u5B9A\u4E49\u548C\u7EB9\u7406\u3002",
    "dap.settings.datapack_only_desc": "\u4EC5\u751F\u6210\u6216\u66F4\u65B0\u52A8\u753B\u9A71\u52A8\uFF1B\u5FC5\u987B\u914D\u5408\u6620\u5C04\u4E00\u81F4\u7684\u8D44\u6E90\u5305\u3002",
    "dap.settings.animations_valid": "\u5DF2\u9009 {count} \u6BB5\u52A8\u753B\uFF1B\u6240\u6709\u751F\u6210 key \u5747\u6709\u6548\u4E14\u552F\u4E00\u3002",
    "dap.settings.animations_empty": "\u81F3\u5C11\u9009\u62E9\u4E00\u6BB5\u52A8\u753B\u3002",
    "dap.settings.animations_invalid": "\u8BF7\u89E3\u51B3\u65E0\u6548\u6216\u91CD\u590D\u52A8\u753B key\uFF1A{details}",
    "dap.export.open_settings_hint": "\u8BF7\u6253\u5F00\u201CJava \u663E\u793A\u52A8\u753B\u5668\u9879\u76EE\u8BBE\u7F6E\u201D\u4FEE\u6B63\u540E\u91CD\u65B0\u5BFC\u51FA\u3002",
    "dap.export.property.name": "\u52A8\u753B\u5BFC\u51FA\u9009\u62E9",
    "dap.export.property.description": "\u4EC5\u5728\u6587\u4EF6\u6210\u529F\u5199\u5165\u540E\u8BB0\u4F4F\u5168\u90E8\u5BFC\u51FA\u8BBE\u7F6E",
    "dap.export.title": "\u5BFC\u51FA\u8D44\u6E90\u5305\u548C\u6570\u636E\u5305",
    "dap.export.select_title": "\u9009\u62E9\u8981\u5BFC\u51FA\u7684\u52A8\u753B",
    "dap.export.select_help": "\u9009\u62E9\u8981\u70D8\u7119\u7684\u52A8\u753B\u3002Minecraft key \u7531 Blockbench \u52A8\u753B\u540D\u81EA\u52A8\u751F\u6210\uFF0C\u5E76\u4F9B play\u3001loop \u4E0E frame \u547D\u4EE4\u4F7F\u7528\u3002",
    "dap.export.selection": "\u9009\u62E9\u64CD\u4F5C",
    "dap.export.select_all": "\u5168\u9009",
    "dap.export.select_none": "\u5168\u4E0D\u9009",
    "dap.export.select_required": "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u6BB5\u52A8\u753B\u540E\u518D\u7EE7\u7EED\u3002",
    "dap.export.animation_row": "Key\uFF1A{key} \xB7 \u65F6\u957F\uFF1A{duration} \u79D2 \xB7 \u6E90\u5E27\u7387\uFF1A{source_fps} FPS \xB7 \u8F93\u51FA\uFF1A{game_fps} FPS\u3001{game_frames} \u5E27",
    "dap.export.invalid_key": "\u65E0\u6548 key",
    "dap.export.key_conflict_title": "\u52A8\u753B\u540D\u79F0\u65E0\u6CD5\u5BFC\u51FA",
    "dap.export.key_conflict_message": "\u8BF7\u91CD\u547D\u540D\u4E0B\u5217\u52A8\u753B\uFF0C\u786E\u4FDD\u6BCF\u4E2A\u81EA\u52A8\u751F\u6210\u7684 Minecraft key \u90FD\u6709\u6548\u4E14\u552F\u4E00\uFF1A\n\n{details}",
    "dap.export.key_conflict_entry": "Key\u201C{key}\u201D\uFF1A{animations}",
    "dap.export.animation_summary": "{animation} \u2192 {key} \xB7 {source_fps} FPS \u2192 {game_frames} \u4E2A\u6E38\u620F\u5E27",
    "dap.export.default_animation": "\u9ED8\u8BA4\u52A8\u753B",
    "dap.export.default_missing": "\u6240\u9009\u9ED8\u8BA4\u52A8\u753B\u5DF2\u4E0D\u5B58\u5728\u3002",
    "dap.export.output": "\u5BFC\u51FA\u5185\u5BB9",
    "dap.export.write_mode": "\u5199\u5165\u65B9\u5F0F",
    "dap.export.write_mode.create": "\u521B\u5EFA\u65B0\u5305",
    "dap.export.write_mode.insert": "\u63D2\u5165\u73B0\u6709\u5305",
    "dap.export.pack_name": "\u5305\u540D",
    "dap.export.project_name": "\u9879\u76EE\u540D",
    "dap.export.project_name_hint": "\u56FA\u5B9A jsb \u547D\u540D\u7A7A\u95F4\u4E0B\u7684\u552F\u4E00\u6A21\u5757 ID\uFF0C\u7528\u4E8E\u76EE\u5F55\u3001\u7269\u54C1\u6A21\u578B\u548C\u51FD\u6570\u547D\u4EE4\u3002",
    "dap.export.base_item": "\u6620\u5C04\u7269\u54C1",
    "dap.export.display_name": "\u7269\u54C1\u663E\u793A\u540D",
    "dap.export.frame_objective": "\u5E27\u8BB0\u5206\u677F",
    "dap.export.mode_objective": "\u6A21\u5F0F\u8BB0\u5206\u677F",
    "dap.export.max_frame_objective": "\u6700\u5927\u5E27\u8BB0\u5206\u677F",
    "dap.export.objective_conflict": "\u5E27\u3001\u6A21\u5F0F\u548C\u6700\u5927\u5E27\u8BB0\u5206\u677F\u5FC5\u987B\u4F7F\u7528\u4E09\u4E2A\u4E0D\u540C\u7684\u540D\u79F0\u3002",
    "dap.export.playing_tag": "\u64AD\u653E\u6807\u8BB0",
    "dap.export.mode.both_default": "\u8D44\u6E90\u5305 + \u6570\u636E\u5305\uFF08\u5171\u7528\u6839\u76EE\u5F55\uFF09",
    "dap.export.mode.both_separate": "\u8D44\u6E90\u5305 + \u6570\u636E\u5305\uFF08\u5206\u522B\u9009\u62E9\u7236\u76EE\u5F55\uFF09",
    "dap.export.mode.resource_only": "\u4EC5\u8D44\u6E90\u5305",
    "dap.export.mode.datapack_only": "\u4EC5\u6570\u636E\u5305",
    "dap.export.cancel": "\u53D6\u6D88",
    "dap.export.cancel_export": "\u53D6\u6D88\u5BFC\u51FA",
    "dap.export.export_anyway": "\u4ECD\u7136\u5BFC\u51FA",
    "dap.export.warnings_title": "\u8BF7\u786E\u8BA4\u5BFC\u51FA\u8B66\u544A",
    "dap.export.open_bounds_check": "\u6253\u5F00\u8303\u56F4\u68C0\u6D4B",
    "dap.export.problem_frames": "\u95EE\u9898\u5E27",
    "dap.export.locate_frame": "\u7B2C {frame} \u5E27",
    "dap.export.located_frame": "\u5DF2\u5B9A\u4F4D\u5230 {animation} \u7684\u7B2C {frame} \u5E27",
    "dap.export.cancelled": "\u5DF2\u53D6\u6D88\u5BFC\u51FA\uFF0C\u6CA1\u6709\u751F\u6210\u6587\u4EF6",
    "dap.export.preparing_files": "\u5DF2\u786E\u8BA4\u8B66\u544A\uFF0C\u6B63\u5728\u751F\u6210\u5305\u6587\u4EF6\u2026",
    "dap.export.overwrite": "\u8986\u76D6\u5E76\u5BFC\u51FA",
    "dap.export.resource_pack": "\u8D44\u6E90\u5305",
    "dap.export.datapack": "\u6570\u636E\u5305",
    "dap.export.pick_shared": "\u9009\u62E9\u5BFC\u51FA\u6839\u76EE\u5F55\uFF08\u5C06\u521B\u5EFA resource-packs/{pack}/ \u548C datapacks/{pack}/\uFF09",
    "dap.export.pick_resource": "\u9009\u62E9\u8D44\u6E90\u5305\u7236\u76EE\u5F55\uFF08\u5C06\u521B\u5EFA {pack}/\uFF09",
    "dap.export.pick_datapack": "\u9009\u62E9\u6570\u636E\u5305\u7236\u76EE\u5F55\uFF08\u5C06\u521B\u5EFA {pack}/\uFF09",
    "dap.export.pick_existing_resource": "\u9009\u62E9\u5DF2\u6709\u4E14\u5DF2\u89E3\u538B\u7684\u8D44\u6E90\u5305\u6587\u4EF6\u5939",
    "dap.export.pick_existing_datapack": "\u9009\u62E9\u5DF2\u6709\u4E14\u5DF2\u89E3\u538B\u7684\u6570\u636E\u5305\u6587\u4EF6\u5939",
    "dap.export.baking": "\u6B63\u5728\u4EE5 {fps} FPS \u70D8\u7119 {frames} \u5E27\u2026",
    "dap.export.baking_animation": "\u6B63\u5728\u70D8\u7119 {animation}\uFF1A\u4EE5 {fps} FPS \u8F93\u51FA {frames} \u5E27\u2026",
    "dap.export.failed": "\u5BFC\u51FA\u5931\u8D25",
    "dap.export.no_frames": "\u6CA1\u6709\u70D8\u7119\u51FA\u4EFB\u4F55\u5E27\u3002\u8BF7\u786E\u8BA4\u52A8\u753B\u4E2D\u5305\u542B\u5173\u952E\u5E27\u3002",
    "dap.export.no_frames_for_animation": "\u6CA1\u6709\u4E3A {animation} \u70D8\u7119\u51FA\u4EFB\u4F55\u5E27\u3002\u8BF7\u786E\u8BA4\u8BE5\u52A8\u753B\u4E2D\u5305\u542B\u5173\u952E\u5E27\u3002",
    "dap.export.no_animated_context_title": "\u6CA1\u6709\u663E\u793A\u4F4D\u7F6E\u542F\u7528\u52A8\u753B",
    "dap.export.no_animated_context_message": "\u6240\u6709\u663E\u793A\u4F4D\u7F6E\u90FD\u5173\u95ED\u4E86\u52A8\u753B\u3002\u8D44\u6E90\u5305\u53EA\u4F1A\u5199\u5165\u9ED8\u8BA4\u52A8\u753B {default_animation} \u7684\u7B2C 0 \u5E27\uFF1B\u5176\u4ED6\u5DF2\u9009\u52A8\u753B\u4E0D\u4F1A\u6709\u53EF\u89C1\u7684\u64AD\u653E\u8DEF\u5F84\u3002",
    "dap.export.datapack_only_title": "\u6570\u636E\u5305\u9700\u8981\u5339\u914D\u7684\u8D44\u6E90\u5305",
    "dap.export.datapack_only_message": "\u6B64\u6570\u636E\u5305\u4F7F\u7528\u672C\u6B21\u6240\u9009\u52A8\u753B\u7684 key \u548C\u5E27\u6570\uFF0C\u53EA\u80FD\u4E0E\u4F7F\u7528\u76F8\u540C\u52A8\u753B\u6620\u5C04\u5BFC\u51FA\u7684\u8D44\u6E90\u5305\u914D\u5957\u4F7F\u7528\u3002",
    "dap.export.resampled_title": "\u5DF2\u91CD\u91C7\u6837\u4E3A\u6E38\u620F\u5E27\u7387",
    "dap.export.resampled_message": "\u52A8\u753B\u5438\u9644\u5E27\u7387\u4E3A {source_fps} FPS\uFF0C\u5DE5\u7A0B\u5BFC\u51FA\u5E27\u7387\u4E3A {game_fps} FPS\u3002\n\n\u672C\u6B21\u5BFC\u51FA\u5C06\u4F7F\u7528 {game_fps} FPS \u7684 {frames} \u5E27\uFF0C\u5E76\u4FDD\u6301\u539F\u52A8\u753B\u65F6\u957F\u3002",
    "dap.export.texture_mismatch_title": "\u7EB9\u7406\u5206\u8FA8\u7387\u4E0D\u4E00\u81F4",
    "dap.export.texture_mismatch": "\u5DE5\u7A0B UV \u5206\u8FA8\u7387\u4E3A {project_width}\xD7{project_height}\uFF0C\u4F46\u4EE5\u4E0B\u7EB9\u7406\u4F7F\u7528\u4E86\u4E0D\u540C\u5C3A\u5BF8\uFF1A\n\n{textures}\n\n\u5BFC\u51FA\u7684 UV \u53EF\u80FD\u504F\u79FB\u3002\u8BF7\u5728\u5BFC\u51FA\u524D\u66F4\u65B0\u201C\u6587\u4EF6 \u2192 \u9879\u76EE\u8BBE\u7F6E\u201D\u3002",
    "dap.export.bounds_title": "\u90E8\u5206\u5E27\u8D85\u51FA\u6A21\u578B\u8303\u56F4",
    "dap.export.resource_description": "{name}\uFF08{frames} \u5E27 @ {fps} FPS\uFF09",
    "dap.export.datapack_description": "{name} \u7684\u9010\u5E27\u52A8\u753B\u9A71\u52A8\uFF08{frames} \u5E27\uFF09",
    "dap.export.resource_description_multi": "{name}\uFF08{animations} \u6BB5\u52A8\u753B\uFF0C{frames} \u4E2A\u91C7\u6837\u5E27 @ {fps} FPS\uFF09",
    "dap.export.datapack_description_multi": "{name} \u7684\u591A\u6BB5\u9010\u5E27\u52A8\u753B\u9A71\u52A8\uFF08{animations} \u6BB5\u52A8\u753B\uFF0C\u5171 {frames} \u5E27\uFF09",
    "dap.export.complete": "\u5BFC\u51FA\u5B8C\u6210",
    "dap.export.complete_heading": "\u5BFC\u51FA\u6210\u529F",
    "dap.export.item_model_id": "\u7269\u54C1\u6A21\u578B ID\uFF1A{id}",
    "dap.export.locations": "\u5DF2\u9A8C\u8BC1\u5E76\u5199\u5165 {count} \u4E2A\u6587\u4EF6\u3002\n\n{locations}",
    "dap.export.write_success": "\u5DF2\u6210\u529F\u9A8C\u8BC1\u5E76\u5199\u5165 {count} \u4E2A\u6587\u4EF6",
    "dap.export.output_locations": "\u8F93\u51FA\u4F4D\u7F6E",
    "dap.export.optimization": "\u7A7A\u95F4\u4F18\u5316\uFF1A\u91C7\u6837 {sampled} \u5E27\uFF0C\u5199\u5165 {unique} \u4E2A\u552F\u4E00\u6A21\u578B\uFF0C\u53BB\u91CD {duplicates} \u5E27\u3002\n\u6A21\u578B JSON\uFF1A{before} \u2192 {after}\u3002",
    "dap.export.space_optimization": "\u7A7A\u95F4\u4F18\u5316\uFF1A",
    "dap.export.optimization_statistics": "\u91C7\u6837 {sampled} \u5E27\uFF0C\u5199\u5165 {unique} \u4E2A\u552F\u4E00\u6A21\u578B\uFF0C\u53BB\u91CD {duplicates} \u5E27\u3002",
    "dap.export.model_json_size": "\u6A21\u578B JSON\uFF1A{before} \u2192 {after}",
    "dap.export.animation_report": "{animation}\uFF1A\u91C7\u6837 {frames} \u5E27",
    "dap.export.omitted": "\u5DF2\u5FFD\u7565 {faces} \u4E2A\u672A\u8D34\u56FE\u9762\uFF0C\u5E76\u79FB\u9664 {elements} \u4E2A\u6CA1\u6709\u53EF\u89C1\u9762\u7684\u5143\u7D20\u3002",
    "dap.export.animation_keys": "\u52A8\u753B key\uFF1A{keys}",
    "dap.export.commands": "\u6E38\u620F\u5185\u547D\u4EE4\uFF1A",
    "dap.settings.developer_tips": "\u5F00\u53D1\u8005\u63D0\u793A",
    "dap.settings.developer_tips_help": "\u5F00\u542F\u6570\u636E\u5305\u6FC0\u6D3B\u3001\u7ED9\u4E88\u7269\u54C1\u548C\u64AD\u653E\u63A7\u5236\u65F6\u7684\u6E38\u620F\u5185\u63D0\u793A\uFF1B\u5173\u95ED\u540E\u6570\u636E\u5305\u5B8C\u5168\u9759\u9ED8\uFF0C\u9002\u5408\u6B63\u5F0F\u5730\u56FE\u3002",
    "dap.settings.hand_rendering": "\u6E32\u67D3\u73A9\u5BB6\u76AE\u80A4\u624B\u90E8",
    "dap.settings.hand_rendering_help": "\u751F\u6210\u6807\u51C6 4\xD74\xD712 \u7BB1\u578B UV \u624B\u81C2\u5360\u4F4D\u6A21\u578B\uFF08\u5DE6 0,0,4\u3001\u53F3 12,0,4\uFF09\uFF0C\u4F7F\u7528\u8F6F\u4EF6\u5185\u7F6E 16\xD716 \u9ED8\u8BA4\u7EB9\u7406\uFF1B\u5BFC\u51FA\u4F4D\u7F6E\u4E0E\u65CB\u8F6C\u8BFB\u53D6\u624B\u81C2\u7EC4\u7684\u9759\u6001\u6446\u653E\u53CA\u52A8\u753B\uFF1B\u9884\u89C8\u5C3A\u5BF8\u72EC\u7ACB\uFF0C\u5DE6\u53F3\u624B scale \u6807\u8BB0\u56FA\u5B9A\u4E0D\u53D8\u3002\u4F1A\u5BFC\u51FA Minecraft 26.2 \u6838\u5FC3\u5B9E\u4F53\u7740\u8272\u5668\uFF0C\u53EF\u80FD\u4E0E\u66FF\u6362\u540C\u540D\u7740\u8272\u5668\u7684\u8D44\u6E90\u5305\u51B2\u7A81\u3002",
    "dap.hand.skin_version_help": "\u624B\u81C2\u76AE\u80A4\u76EE\u524D\u4EC5\u652F\u6301 Minecraft Java 1.21.11 \u53CA\u4EE5\u4E0A\u7248\u672C\u3002",
    "dap.hand.shader_incompatible": "\u4E0E\u5149\u5F71\u4E0D\u517C\u5BB9",
    "dap.hand.shader_incompatible_help": "\u4F7F\u7528\u73A9\u5BB6\u76AE\u80A4\u624B\u81C2\u65F6\u8BF7\u5173\u95ED\u5149\u5F71\u3002\u5F00\u542F\u5149\u5F71\u4F1A\u4F7F\u624B\u81C2\u8D34\u56FE\u8F6C\u6362\u5931\u6548\uFF0C\u663E\u793A\u4E3A\u73A9\u5BB6\u5934\u90E8\u8D34\u56FE\u3002",
    "dap.hand.undo_create": "\u521B\u5EFA\u73A9\u5BB6\u624B\u81C2\u7ED1\u5B9A",
    "dap.hand.undo_delete": "\u5220\u9664\u73A9\u5BB6\u624B\u81C2\u7ED1\u5B9A",
    "dap.hand.delete": "\u5220\u9664\u624B\u81C2\u7ED1\u5B9A\u2026",
    "dap.hand.delete_title": "\u5220\u9664\u73A9\u5BB6\u624B\u81C2\u7ED1\u5B9A",
    "dap.hand.delete_message": "\u63D2\u4EF6\u521B\u5EFA\u7684\u624B\u81C2\u7EC4\u53CA\u5176\u52A8\u753B\u8F68\u5C06\u88AB\u5220\u9664\u3002\u63A5\u7BA1\u7684 lefthand/righthand \u7EC4\u53EA\u4F1A\u89E3\u9664\u7ED1\u5B9A\uFF0C\u4E0D\u4F1A\u5220\u9664\u3002",
    "dap.hand.delete_confirm": "\u5220\u9664\u7ED1\u5B9A",
    "dap.hand.scale_unsupported": "\u52A8\u753B {animation} \u5728 {group} \u4E0A\u542B\u6709\u7F29\u653E\u5173\u952E\u5E27\u3002\u7740\u8272\u5668\u4F9D\u8D56\u7CBE\u786E\u7F29\u653E\u503C\u8BC6\u522B\u5DE6\u53F3\u624B\uFF0C\u56E0\u6B64\u4E0D\u652F\u6301\u624B\u81C2\u7F29\u653E\u52A8\u753B\u3002",
    "dap.hand.rig_missing": "\u5DF2\u542F\u7528\u73A9\u5BB6\u624B\u81C2\u6E32\u67D3\uFF0C\u4F46\u627E\u4E0D\u5230\u624B\u81C2\u7ED1\u5B9A\u3002\u8BF7\u5728\u5DE5\u7A0B\u8BBE\u7F6E\u4E2D\u91CD\u65B0\u52FE\u9009\u201C\u6E32\u67D3\u73A9\u5BB6\u76AE\u80A4\u624B\u90E8\u201D\u4EE5\u91CD\u65B0\u521B\u5EFA\u3002",
    "dap.settings.exact_bounds_export": "\u5BFC\u51FA\u524D\u8FDB\u884C\u7CBE\u786E\u8303\u56F4\u68C0\u6D4B",
    "dap.settings.exact_bounds_export_help": "\u6821\u9A8C\u9694\u79BB\u5BFC\u51FA\u70D8\u7119\u5E76\u8BB0\u5FC6\u6BCF\u6BB5\u52A8\u753B\u7684\u7CBE\u786E\u7ED3\u679C\uFF1B\u5173\u95ED\u540E\u4ECD\u4F1A\u9694\u79BB\u70D8\u7119\uFF0C\u4F46\u4E0D\u751F\u6210\u8303\u56F4\u8B66\u544A\u6216\u68C0\u6D4B\u72B6\u6001\u3002",
    "dap.export.summary": "\u5BFC\u51FA\u6458\u8981",
    "dap.export.developer_info": "\u5F00\u53D1\u8005\u4FE1\u606F",
    "dap.export.developer_tips_status": "\u5F00\u53D1\u8005\u63D0\u793A\u4FE1\u606F\uFF1A{status}",
    "dap.export.hand_rendering_status": "\u73A9\u5BB6\u76AE\u80A4\u624B\u90E8\uFF1A{status}",
    "dap.export.developer_tips_enabled": "\u5F00\u542F",
    "dap.export.developer_tips_disabled": "\u5173\u95ED",
    "dap.export.hand_rendering_warning_title": "\u73A9\u5BB6\u76AE\u80A4\u624B\u90E8\u4F1A\u4F7F\u7528\u6838\u5FC3\u7740\u8272\u5668",
    "dap.export.hand_rendering_warning_message": "\u672C\u6B21\u5BFC\u51FA\u4F1A\u66FF\u6362 Minecraft 26.2 \u7684\u5B9E\u4F53\u6838\u5FC3\u7740\u8272\u5668\uFF0C\u53EF\u80FD\u4E0E\u66FF\u6362\u540C\u540D\u6587\u4EF6\u7684\u7740\u8272\u5668\u6216\u8D44\u6E90\u5305\u51B2\u7A81\u3002\u5DE6\u53F3\u624B\u59FF\u6001\u4F1A\u9010\u5E27\u91C7\u6837\uFF0C\u5E76\u5BFC\u51FA\u5230\u5DE6\u53F3\u4E24\u79CD\u7B2C\u4E00\u4EBA\u79F0\u663E\u793A\u4F4D\u7F6E\u3002",
    "dap.export.hand_rendering_resource_only_title": "\u5FC5\u987B\u4F7F\u7528\u5E26\u73A9\u5BB6\u6863\u6848\u7684\u73A9\u5BB6\u5934\u9885",
    "dap.export.hand_rendering_resource_only_message": "\u4EC5\u5BFC\u51FA\u8D44\u6E90\u5305\u65F6\u65E0\u6CD5\u81EA\u52A8\u5199\u5165\u89C2\u5BDF\u8005\u76AE\u80A4\u3002\u8BF7\u4F7F\u7528\u540C\u65F6\u5E26 minecraft:profile \u4E0E\u751F\u6210 item_model \u7684 minecraft:player_head\uFF0C\u6216\u914D\u5957\u5BFC\u51FA\u6570\u636E\u5305\u5E76\u8FD0\u884C\u5176 give \u51FD\u6570\u3002",
    "dap.export.preflight_title": "\u786E\u8BA4\u6587\u4EF6\u53D8\u66F4",
    "dap.export.preflight_message": "\u672C\u6B21 JSB \u9879\u76EE\u6A21\u5757\u5C06\u6267\u884C\u4EE5\u4E0B\u53D8\u66F4\uFF1A\n\n{summary}",
    "dap.export.preflight_added": "\u65B0\u589E\u9879\u76EE\u6587\u4EF6",
    "dap.export.preflight_updated": "\u66F4\u65B0\u9879\u76EE\u6587\u4EF6",
    "dap.export.preflight_removed": "\u5220\u9664\u65E7\u9879\u76EE\u6587\u4EF6",
    "dap.export.preflight_merged": "\u5408\u5E76 load/tick \u6807\u7B7E",
    "dap.export.confirm_write": "\u5199\u5165\u53D8\u66F4",
    "dap.export.conflict_title": "\u8DEF\u5F84\u51B2\u7A81",
    "dap.export.conflict_message": "\u4EE5\u4E0B\u8DEF\u5F84\u5DF2\u7ECF\u5B58\u5728\uFF0C\u4F46\u4E0D\u5C5E\u4E8E\u5F53\u524D JSB \u9879\u76EE\u3002\u6CA1\u6709\u5199\u5165\u4EFB\u4F55\u6587\u4EF6\uFF1A\n\n{paths}",
    "dap.export.invalid_identifier_title": "\u5305\u540D\u6216\u9879\u76EE\u540D\u65E0\u6548",
    "dap.export.invalid_identifier_message": "\u8BF7\u4F7F\u7528\u5B89\u5168\u7684\u5C0F\u5199 Minecraft ID\uFF0C\u4EC5\u5305\u542B a-z\u30010-9\u3001\u4E0B\u5212\u7EBF\u3001\u77ED\u6A2A\u7EBF\u6216\u70B9\u3002\u9879\u76EE\u540D\u4E0D\u80FD\u662F _generated\u3001. \u6216 ..\u3002",
    "dap.export.write_error": "\u5199\u5165\u6587\u4EF6\u65F6\u53D1\u751F\u9519\u8BEF\uFF1A\n{error}",
    "dap.export.target_exists": "\u76EE\u6807\u5305\u5DF2\u5B58\u5728",
    "dap.export.target_exists_message": "\u7EE7\u7EED\u64CD\u4F5C\u4F1A\u8986\u76D6\u540C\u540D\u6587\u4EF6\uFF0C\u4F46\u4E0D\u4F1A\u5220\u9664\u5176\u4ED6\u6587\u4EF6\uFF1A\n\n{summary}",
    "dap.export.file_count": "{count} \u4E2A\u6587\u4EF6",
    "dap.export.prepare_failed": "\u5BFC\u51FA\u51C6\u5907\u5931\u8D25",
    "dap.export.busy": "\u4E0A\u4E00\u6B21\u5BFC\u51FA\u4ECD\u5728\u8FDB\u884C\u4E2D",
    "dap.export.no_animation_title": "\u6CA1\u6709\u53EF\u5BFC\u51FA\u7684\u52A8\u753B",
    "dap.export.no_animation_message": "\u8BF7\u5148\u521B\u5EFA\u5305\u542B\u5173\u952E\u5E27\u7684\u52A8\u753B\u3002",
    "dap.export.fps_exact": "\u5C06\u4EE5\u5DE5\u7A0B\u8BBE\u7F6E\u7684 {game_fps} FPS \u5BFC\u51FA {frames} \u5E27\u3002",
    "dap.export.fps_resample": "\u5F53\u524D\u5438\u9644\u5E27\u7387\u4E3A {source_fps} FPS\uFF08{source_frames} \u4E2A\u6E90\u91C7\u6837\uFF09\u3002\u5BFC\u51FA\u65F6\u5C06\u91CD\u91C7\u6837\u4E3A {game_fps} FPS\uFF08{game_frames} \u5E27\uFF09\uFF0C\u5E76\u4FDD\u6301\u52A8\u753B\u65F6\u957F\u3002",
    "dap.export.folder_help": "\u521B\u5EFA\u6A21\u5F0F\u9009\u62E9\u7236\u76EE\u5F55\u5E76\u5728\u5176\u4E2D\u5EFA\u7ACB <\u5305\u540D>/\uFF1B\u63D2\u5165\u6A21\u5F0F\u9009\u62E9\u5E26\u6709\u6548 pack.mcmeta \u7684\u73B0\u6709\u5DF2\u89E3\u538B\u5305\u6587\u4EF6\u5939\u5185\u3002",
    "dap.bounds.no_animation": "\u6CA1\u6709\u53EF\u68C0\u67E5\u7684\u52A8\u753B",
    "dap.bounds.passed_title": "\u6A21\u578B\u8303\u56F4\u68C0\u67E5\u901A\u8FC7",
    "dap.bounds.passed_heading": "\u672A\u53D1\u73B0\u8D8A\u754C\u5E27",
    "dap.bounds.passed_message": "\u5DF2\u6309 {fps} FPS \u68C0\u67E5 {frames} \u5E27\uFF0C\u6240\u6709\u5750\u6807\u5747\u5728 -16 \u5230 32 \u8303\u56F4\u5185\u3002",
    "dap.bounds.passed_animation": "\u5DF2\u68C0\u67E5\u52A8\u753B\uFF1A{animation}",
    "dap.bounds.passed_animations": "\u5DF2\u68C0\u67E5\u52A8\u753B\uFF1A{animations} \u4E2A",
    "dap.bounds.panel_title": "\u6A21\u578B\u8303\u56F4\u68C0\u6D4B",
    "dap.bounds.panel_checked_animations": "\u5DF2\u68C0\u67E5 {animations} \u4E2A\u52A8\u753B",
    "dap.bounds.panel_failed": "\u53D1\u73B0 {frames} \u4E2A\u95EE\u9898\u5E27",
    "dap.bounds.panel_passed": "\u5168\u90E8 {frames} \u5E27\u5747\u901A\u8FC7\u68C0\u6D4B",
    "dap.bounds.panel_all_passed": "\u6240\u6709\u52A8\u753B\u5747\u901A\u8FC7\u68C0\u6D4B",
    "dap.bounds.animation_failed": "{frames} \u4E2A\u95EE\u9898\u5E27",
    "dap.bounds.animation_passed": "\u901A\u8FC7 \xB7 {frames} \u5E27",
    "dap.bounds.panel_hint": "\u70B9\u51FB\u95EE\u9898\u5E27\u53EF\u5B9A\u4F4D\u65F6\u95F4\u8F74\u3001\u9AD8\u4EAE\u76F8\u5173\u7EC4\u4EF6\u5E76\u6253\u5F00\u6700\u8FD1\u7684\u5F71\u54CD\u5173\u952E\u5E27\uFF1B\u4FEE\u6539\u540E\u70B9\u51FB\u201C\u91CD\u65B0\u68C0\u6D4B\u201D\u3002",
    "dap.bounds.recheck": "\u91CD\u65B0\u68C0\u6D4B",
    "dap.bounds.mode.quick": "\u5FEB\u901F\u6570\u5B66\u68C0\u6D4B",
    "dap.bounds.mode.exact": "\u7CBE\u786E\u9694\u79BB\u68C0\u6D4B",
    "dap.bounds.mode.export_bake": "\u9694\u79BB\u5BFC\u51FA\u70D8\u7119",
    "dap.bounds.choose_title": "\u9009\u62E9\u8303\u56F4\u68C0\u6D4B\u65B9\u5F0F",
    "dap.bounds.choose_message": "\u5FEB\u901F\u68C0\u6D4B\u4F7F\u7528\u4E0D\u4FEE\u6539\u5DE5\u7A0B\u7684\u77E9\u9635\u6570\u5B66\uFF1B\u7CBE\u786E\u68C0\u6D4B\u521B\u5EFA\u4E00\u6B21\u6027\u5185\u5B58\u5DE5\u7A0B\uFF0C\u5E76\u4F7F\u7528 Blockbench Java \u7F16\u8BD1\u5668\u9010\u5E27\u9A8C\u8BC1\u3002",
    "dap.bounds.choose_cancel": "\u53D6\u6D88",
    "dap.bounds.progress_preparing": "\u6B63\u5728\u51C6\u5907\u8303\u56F4\u68C0\u6D4B\u2026",
    "dap.bounds.progress_title": "{mode}\uFF1A{animation}",
    "dap.bounds.progress_frames": "\u5F53\u524D\u52A8\u753B {frame}/{frames} \u5E27 \xB7 \u603B\u8FDB\u5EA6 {completed}/{total}",
    "dap.bounds.progress_status": "{mode}\uFF1A{animation} {frame}/{frames}",
    "dap.bounds.export_bake_complete": "\u9694\u79BB\u5BFC\u51FA\u70D8\u7119\u5B8C\u6210",
    "dap.bounds.export_bake_complete_detail": "\u5DF2\u4ECE {animations} \u4E2A\u52A8\u753B\u751F\u6210 {frames} \u5E27\uFF0C\u53EF\u4EE5\u7EE7\u7EED\u5B8C\u6210\u5BFC\u51FA\u6D41\u7A0B\u3002",
    "dap.bounds.cancel": "\u53D6\u6D88\u68C0\u6D4B",
    "dap.bounds.cancelling": "\u6B63\u5728\u53D6\u6D88\u2026",
    "dap.bounds.cancelled": "\u5DF2\u53D6\u6D88\u8303\u56F4\u68C0\u6D4B\uFF0C\u672A\u7F13\u5B58\u4E0D\u5B8C\u6574\u7ED3\u679C",
    "dap.bounds.cache_reused": "\u5DF2\u590D\u7528 {animations} \u4E2A\u52A8\u753B\u7684\u6709\u6548\u68C0\u6D4B\u7ED3\u679C",
    "dap.bounds.cache_all_reused": "\u6A21\u578B\u672A\u4FEE\u6539\uFF0C\u5DF2\u590D\u7528\u5168\u90E8\u6709\u6548\u8303\u56F4\u68C0\u6D4B\u7ED3\u679C",
    "dap.bounds.status.unchecked": "\u672A\u68C0\u6D4B",
    "dap.bounds.status.stale": "\u68C0\u6D4B\u540E\u5DF2\u4FEE\u6539",
    "dap.bounds.status.quick_passed": "\u5FEB\u901F\u68C0\u6D4B\u901A\u8FC7",
    "dap.bounds.status.quick_failed": "\u5FEB\u901F\u68C0\u6D4B\u8B66\u544A",
    "dap.bounds.status.exact_passed": "\u7CBE\u786E\u68C0\u6D4B\u901A\u8FC7",
    "dap.bounds.status.exact_failed": "\u7CBE\u786E\u68C0\u6D4B\u8B66\u544A",
    "dap.bounds.checking": "\u6B63\u5728\u6309\u5DE5\u7A0B\u52A8\u753B FPS \u68C0\u67E5 {animation}\u2026",
    "dap.bounds.checking_animations": "\u6B63\u5728\u6309\u5DE5\u7A0B\u52A8\u753B FPS \u68C0\u67E5 {animations} \u4E2A\u52A8\u753B\u2026",
    "dap.bounds.check_in_progress": "\u6A21\u578B\u8303\u56F4\u68C0\u6D4B\u6B63\u5728\u8FDB\u884C\uFF0C\u8BF7\u52FF\u91CD\u590D\u70B9\u51FB",
    "dap.bounds.located": "\u5DF2\u5B9A\u4F4D\u5230 {animation} \u7684\u7B2C {frame} \u5E27",
    "dap.bounds.edit_in_progress_title": "\u8BF7\u5148\u5B8C\u6210\u5F53\u524D\u7F16\u8F91",
    "dap.bounds.edit_in_progress_message": "Blockbench \u4ECD\u6709\u5C1A\u672A\u7ED3\u675F\u7684\u6A21\u578B\u6216\u5173\u952E\u5E27\u7F16\u8F91\u3002\u8BF7\u6309 Enter \u6216\u70B9\u51FB\u9884\u89C8\u533A\u57DF\u63D0\u4EA4\u4FEE\u6539\uFF0C\u7136\u540E\u91CD\u65B0\u68C0\u6D4B\u3002\u672C\u6B21\u672A\u542F\u52A8\u4EFB\u4F55\u70D8\u7119\u64CD\u4F5C\u3002",
    "dap.bounds.check_failed_title": "\u6A21\u578B\u8303\u56F4\u68C0\u6D4B\u5931\u8D25",
    "dap.bake.active_edit": "Blockbench \u5B58\u5728\u5176\u4ED6\u7F16\u8F91\u4E8B\u52A1\u65F6\uFF0C\u8303\u56F4\u68C0\u6D4B\u548C\u5BFC\u51FA\u4E0D\u80FD\u542F\u52A8\u5E27\u70D8\u7119\u3002",
    "dap.bounds.frame": "\u7B2C {frame} \u5E27\uFF1A{parts}\uFF0C{field}.{axis} = {value}",
    "dap.bounds.parts_many": "{names} \u7B49 {count} \u4E2A\u90E8\u4EF6",
    "dap.bounds.summary": "\u5171\u6709 {frames} \u5E27\u4E2D\u7684\u90E8\u4EF6\u8D85\u51FA Minecraft \u6A21\u578B\u8303\u56F4\uFF08\u6BCF\u4E2A\u5750\u6807\u8F74\u5FC5\u987B\u4F4D\u4E8E -16 \u5230 32 \u4E4B\u95F4\uFF09\u3002",
    "dap.bounds.guidance": "\u8D8A\u754C\u5E27\u53EF\u80FD\u51FA\u73B0\u504F\u79FB\u6216\u6D88\u5931\u3002\u53EF\u4F7F\u7528\u6570\u636E\u5305\u7684 frame \u547D\u4EE4\u68C0\u67E5\u6307\u5B9A\u5E27\uFF0C\u7136\u540E\u5728 Blockbench \u4E2D\u51CF\u5C0F\u5BF9\u5E94\u52A8\u4F5C\u5E45\u5EA6\uFF1A",
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
    "dap.error.duplicate_target": "\u4E24\u4E2A\u751F\u6210\u5305\u6307\u5411\u4E86\u540C\u4E00\u4E2A\u76EE\u6807\u6587\u4EF6\u5939\uFF1A{path}",
    "dap.error.unsafe_path": "\u751F\u6210\u6587\u4EF6\u8DEF\u5F84\u4E0D\u5B89\u5168\uFF0C\u5DF2\u62D2\u7EDD\u5199\u5165\uFF1A{path}",
    "dap.error.no_models": "\u6CA1\u6709\u53EF\u7528\u4E8E\u7269\u54C1\u5B9A\u4E49\u7684\u6A21\u578B",
    "dap.error.external_texture": "\u7EB9\u7406\u201C{label}\u201D\u4ECD\u5F15\u7528\u5916\u90E8\u56FE\u96C6\u201C{value}\u201D\u3002Minecraft 26.2 \u7269\u54C1\u6A21\u578B\u4E0D\u80FD\u6DF7\u7528\u7269\u54C1\u4E0E\u65B9\u5757\u56FE\u96C6\u3002",
    "dap.error.texture_not_generated": "\u6A21\u578B\u5F15\u7528\u4E86\u672A\u751F\u6210\u7684\u7EB9\u7406\uFF1A{value}",
    "dap.error.manifest_invalid": "JSB \u9879\u76EE\u6E05\u5355\u65E0\u6548\uFF1A{path}",
    "dap.error.invalid_pack": "\u63D2\u5165\u6A21\u5F0F\u8981\u6C42\u9009\u62E9\u5E26\u6709\u6548 pack.mcmeta \u7684\u5DF2\u89E3\u538B\u5305\u6587\u4EF6\u5939\uFF1A{path}",
    "dap.error.shared_tag_invalid": "\u73B0\u6709\u51FD\u6570\u6807\u7B7E\u6587\u4EF6\u65E0\u6548\uFF0C\u672A\u8FDB\u884C\u4FEE\u6539\uFF1A{path}",
    "dap.error.path_conflicts": "\u73B0\u6709\u6587\u4EF6\u4E0D\u5C5E\u4E8E\u5F53\u524D JSB \u9879\u76EE\uFF0C\u4E0D\u80FD\u8986\u76D6\uFF1A\n{paths}",
    "dap.error.rollback_partial": "\u5BFC\u51FA\u5931\u8D25\uFF0C\u81EA\u52A8\u56DE\u6EDA\u672A\u80FD\u6062\u590D\u90E8\u5206\u6587\u4EF6\uFF0C\u8BF7\u624B\u52A8\u68C0\u67E5\u4EE5\u4E0B\u8DEF\u5F84\uFF1A\n{paths}",
    "dap.datapack.loaded": "\u6570\u636E\u5305\u5DF2\u52A0\u8F7D\u3002\u8FD0\u884C /function {namespace}/give \u83B7\u53D6\u52A8\u753B\u7269\u54C1\u3002",
    "dap.datapack.item_given": "\u5DF2\u7ED9\u4E88\u52A8\u753B\u7269\u54C1\uFF08\u9ED8\u8BA4\u52A8\u753B {animation}\uFF0C\u7B2C 0 \u5E27\uFF09\u3002\u624B\u6301\u65F6\u8C03\u7528 /function {namespace}/<play/loop/frame>/<\u52A8\u753B\u540D> {frame:12}\uFF1B\u4F7F\u7528 stop \u505C\u6B62\u52A8\u753B\u3002",
    "dap.datapack.hold_item": "\u8BF7\u5148\u5C06\u52A8\u753B\u7269\u54C1\u62FF\u5728\u4E3B\u624B\u3002",
    "dap.datapack.loop_started": "\u5DF2\u5F00\u59CB\u5FAA\u73AF\u64AD\u653E {animation}\uFF08{fps} FPS\uFF0C\u7B2C 0-{last_frame} \u5E27\uFF09\u3002",
    "dap.datapack.once_started": "\u5DF2\u5F00\u59CB\u5355\u6B21\u64AD\u653E {animation}\uFF1B\u663E\u793A\u7B2C {last_frame} \u5E27\u4E00\u4E2A\u6E38\u620F\u523B\u540E\uFF0C\u5C06\u590D\u4F4D\u5230\u9ED8\u8BA4\u52A8\u753B\u7B2C 0 \u5E27\u3002",
    "dap.datapack.current_frame": "\u5F53\u524D\u5E27\uFF1A",
    "dap.datapack.reset": "\u5DF2\u91CD\u7F6E\u5230\u7B2C 0 \u5E27\u3002",
    "dap.datapack.stopped": "\u64AD\u653E\u5DF2\u505C\u6B62\uFF0C\u5E76\u590D\u4F4D\u5230\u9ED8\u8BA4\u52A8\u753B\u7B2C 0 \u5E27\u3002",
    "dap.datapack.invalid_animation": "\u672A\u77E5\u7684\u52A8\u753B key\uFF1A{animation}",
    "dap.datapack.invalid_mode": "\u65E0\u6548\u7684\u64AD\u653E\u6A21\u5F0F\uFF1A{mode}\u3002\u8BF7\u4F7F\u7528 once \u6216 loop\u3002",
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

  // src/java-block-codec.ts
  function isCompilingCodec(value) {
    return Boolean(
      value && typeof value.compile === "function"
    );
  }
  function resolveJavaBlockCodec() {
    const candidates = [
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

  // src/format.ts
  var FORMAT_ID = "display_animation_sequence";
  var FORMAT_COORDINATE_OPTIONS = {
    centered_grid: false
  };
  var JAVA_MODEL_COMPATIBILITY_OPTIONS = {
    render_sides: "front",
    model_identifier: false,
    parent_model_id: true,
    vertex_color_ambient_occlusion: true,
    uv_rotation: true,
    java_cube_shading_properties: true,
    java_face_properties: true,
    cullfaces: true,
    animated_textures: true,
    select_texture_for_particles: true,
    texture_mcmeta: true,
    texture_folder: true,
    animation_controllers: true,
    animation_files: true
  };
  var ownedFormat = null;
  function rebindOpenProjects(format) {
    if (typeof ModelProject === "undefined" || !Array.isArray(ModelProject.all)) return;
    let reboundCurrentProject = false;
    for (const project of ModelProject.all) {
      if (project.format?.id !== FORMAT_ID || project.format === format) continue;
      project.format = format;
      reboundCurrentProject || (reboundCurrentProject = Project === project);
    }
    if (reboundCurrentProject) {
      format.select?.();
      Canvas.updateAll();
    }
  }
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
      ...JAVA_MODEL_COMPATIBILITY_OPTIONS,
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
      rebindOpenProjects(ownedFormat);
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

  // src/first-person-panel.ts
  var FIRST_PERSON_ASPECT = 993 / 556;
  function firstPersonFocalLength(aspect) {
    return aspect > 1.7 ? 18 / aspect : aspect > 1 ? 16.57 - 3.57 * aspect : 13 * aspect;
  }
  function fitFirstPersonViewport(width, height, aspect) {
    return width / height > aspect ? { width: height * aspect, height } : { width, height: width / aspect };
  }
  function applyFirstPersonDisplay(base, entry, side) {
    const sign = side === "left" ? -1 : 1;
    const rotation = entry?.rotation ?? [0, 0, 0];
    const translation = entry?.translation ?? [0, 0, 0];
    const scale = entry?.scale ?? [1, 1, 1];
    const mirror = entry?.mirror ?? [false, false, false];
    base.rotation.set(rotation[0] * Math.PI / 180, sign * rotation[1] * Math.PI / 180, sign * rotation[2] * Math.PI / 180);
    base.position.set(sign * translation[0], translation[1], translation[2]);
    base.scale.set((scale[0] || 1e-3) * (mirror[0] ? -1 : 1), (scale[1] || 1e-3) * (mirror[1] ? -1 : 1), (scale[2] || 1e-3) * (mirror[2] ? -1 : 1));
    const pivot = new THREE.Vector3().fromArray(entry?.rotation_pivot ?? [0, 0, 0]).multiplyScalar(16);
    const original = new THREE.Vector3().copy(pivot);
    base.position.sub(pivot.applyEuler(base.rotation).sub(original));
    pivot.fromArray(entry?.scale_pivot ?? [0, 0, 0]).multiplyScalar(16).applyEuler(base.rotation);
    pivot.x *= 1 - scale[0];
    pivot.y *= 1 - scale[1];
    pivot.z *= 1 - scale[2];
    base.position.add(pivot);
  }
  function applyFirstPersonScale(matrix) {
    matrix.elements[0] *= 1.31;
    matrix.elements[5] *= 1.31;
  }
  var panel = null;
  var frame = null;
  var disposeView = null;
  function registerFirstPersonPanel() {
    if (panel) return;
    let side = "right";
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.height = "100%";
    wrapper.style.minHeight = "0";
    wrapper.style.minWidth = "0";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.overflow = "hidden";
    wrapper.style.gap = "4px";
    wrapper.style.padding = "4px";
    const select = document.createElement("select");
    select.title = tr("dap.fp.side");
    select.style.width = "100%";
    select.style.minWidth = "0";
    select.style.flex = "0 0 auto";
    for (const value of ["right", "left"]) {
      const option = document.createElement("option");
      option.value = value;
      option.innerText = tr(`dap.slot.firstperson_${value}hand`);
      select.appendChild(option);
    }
    select.onchange = () => {
      side = select.value === "left" ? "left" : "right";
    };
    wrapper.appendChild(select);
    const viewport = document.createElement("div");
    viewport.className = "dap_first_person_viewport";
    viewport.style.position = "relative";
    viewport.style.flex = "0 0 auto";
    viewport.style.minHeight = "0";
    viewport.style.overflow = "hidden";
    viewport.style.background = "transparent";
    viewport.style.display = "flex";
    viewport.style.alignItems = "flex-start";
    viewport.style.justifyContent = "center";
    const picture = document.createElement("div");
    picture.className = "dap_first_person_frame";
    picture.style.position = "relative";
    picture.style.background = "var(--color-back)";
    picture.style.outline = "1px solid var(--color-border)";
    picture.style.flex = "0 0 auto";
    viewport.appendChild(picture);
    wrapper.appendChild(viewport);
    panel = new Panel("display_anim_first_person", {
      name: tr("dap.fp.name"),
      icon: "visibility",
      condition: { modes: ["animate"], formats: [FORMAT_ID, "java_block_sequence"] },
      growable: true,
      resizable: true,
      min_height: 190,
      default_position: { slot: "left_bar", height: 270, width: 340 }
    });
    panel.node.appendChild(wrapper);
    let renderer = null;
    const scene = new THREE.Scene();
    const area = new THREE.Object3D();
    const base = new THREE.Object3D();
    const model = new THREE.Object3D();
    model.position.set(-8, -8, -8);
    scene.add(area);
    area.add(base);
    base.add(model);
    const camera = new THREE.PerspectiveCamera(70, 1, 1, 3e4);
    camera.position.set(0, 24, 32.4);
    camera.aspect = FIRST_PERSON_ASPECT;
    camera.setFocalLength(firstPersonFocalLength(FIRST_PERSON_ASPECT));
    const inverseRoot = new THREE.Matrix4();
    const copies = /* @__PURE__ */ new Map();
    let sourceRoot = null;
    let width = 0;
    let height = 0;
    let pixelRatio = 0;
    let lights = null;
    function updateLayout(force = false) {
      const aspect = FIRST_PERSON_ASPECT;
      const availableHeight = Math.max(0, wrapper.clientHeight - select.clientHeight - 12);
      const { width: nextWidth, height: nextHeight } = fitFirstPersonViewport(viewport.clientWidth, availableHeight, aspect);
      const nextPixelRatio = devicePixelRatio;
      if (force || nextWidth !== width || nextHeight !== height || pixelRatio !== nextPixelRatio) {
        pixelRatio = nextPixelRatio;
        renderer?.setPixelRatio(pixelRatio);
        width = nextWidth;
        height = nextHeight;
        viewport.style.height = `${height}px`;
        picture.style.width = `${width}px`;
        picture.style.height = `${height}px`;
        renderer?.setSize(width, height);
        if (renderer) {
          renderer.domElement.style.width = "100%";
          renderer.domElement.style.height = "100%";
        }
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
      return width > 0 && height > 0;
    }
    const resizeObserver = new ResizeObserver(() => updateLayout());
    resizeObserver.observe(wrapper);
    function render() {
      frame = requestAnimationFrame(render);
      if (sourceRoot && sourceRoot !== Project?.model_3d) {
        model.clear();
        copies.clear();
        sourceRoot = null;
        if (lights) scene.remove(lights);
        lights = null;
      }
      if (!panel?.isVisible() || !panel.node.isConnected || Modes.selected.id !== "animate" || !Project || ![FORMAT_ID, "java_block_sequence"].includes(Format.id)) return;
      if (!updateLayout()) return;
      if (!renderer) {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.pointerEvents = "none";
        picture.appendChild(renderer.domElement);
        const crosshair = document.createElement("span");
        crosshair.innerText = "+";
        crosshair.style.position = "absolute";
        crosshair.style.left = "50%";
        crosshair.style.top = "50%";
        crosshair.style.transform = "translate(-50%, -50%)";
        crosshair.style.pointerEvents = "none";
        picture.appendChild(crosshair);
        updateLayout(true);
      }
      renderer.toneMapping = Preview.selected.renderer.toneMapping;
      if (sourceRoot !== Project.model_3d) {
        model.clear();
        copies.clear();
        sourceRoot = Project.model_3d;
        if (lights) scene.remove(lights);
        lights = Canvas.scene.children.find((child) => child.name === "lights")?.clone(true) ?? null;
        if (lights) scene.add(lights);
      }
      area.position.set(side === "left" ? -9.039 : 9.039, 24 - 8.318, 20.8);
      applyFirstPersonDisplay(base, Project.display_settings[`firstperson_${side}hand`], side);
      sourceRoot.updateMatrixWorld(true);
      inverseRoot.copy(sourceRoot.matrixWorld).invert();
      const active = /* @__PURE__ */ new Set();
      for (const element of Outliner.elements) {
        const source = element.mesh;
        if (!(source instanceof THREE.Mesh)) continue;
        active.add(source);
        let copy = copies.get(source);
        if (!copy) {
          copy = new THREE.Mesh(source.geometry, source.material);
          copy.matrixAutoUpdate = false;
          copies.set(source, copy);
          model.add(copy);
        }
        copy.geometry = source.geometry;
        copy.material = source.material;
        copy.visible = element.visibility !== false;
        for (let ancestor = source; ancestor && ancestor !== sourceRoot; ancestor = ancestor.parent) {
          if (!ancestor.visible) copy.visible = false;
        }
        copy.matrix.multiplyMatrices(inverseRoot, source.matrixWorld);
      }
      for (const [source, copy] of copies) {
        if (!active.has(source)) {
          model.remove(copy);
          copies.delete(source);
        }
      }
      const nativePreview = Preview.all.find((preview) => preview.id === "display");
      if (nativePreview && DisplayMode.display_slot.startsWith("firstperson_")) {
        camera.copy(nativePreview.camPers, false);
        camera.updateProjectionMatrix();
      }
      camera.aspect = FIRST_PERSON_ASPECT;
      camera.setFocalLength(firstPersonFocalLength(FIRST_PERSON_ASPECT));
      camera.updateProjectionMatrix();
      applyFirstPersonScale(camera.projectionMatrix);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      renderer.render(scene, camera);
    }
    disposeView = () => {
      resizeObserver.disconnect();
      copies.clear();
      model.clear();
      scene.clear();
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer = null;
    };
    frame = requestAnimationFrame(render);
  }
  function disposeFirstPersonPanel() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    disposeView?.();
    disposeView = null;
    panel?.delete();
    panel = null;
  }
  function openFirstPersonPanel() {
    registerFirstPersonPanel();
    if (!panel) return;
    if (Modes.selected.id !== "animate") Modes.options.animate?.select();
    if (panel.slot === "hidden") panel.moveTo("left_bar");
    panel.fold(false);
    panel.selectTab();
    panel.moveToFront();
    panel.update();
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
      exposed: false,
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

  // src/export-layout.ts
  var EXPORT_NAMESPACE = "jsb";
  var MAX_EXPORT_FPS = 20;
  function frameCountFor(length, fps) {
    return Math.floor(length * fps) + 1;
  }
  var DISPLAY_CONTEXT_PATHS = {
    firstperson_righthand: "fp_r",
    firstperson_lefthand: "fp_l",
    thirdperson_righthand: "tp_r",
    thirdperson_lefthand: "tp_l",
    gui: "gui",
    ground: "ground",
    head: "head",
    fixed: "fixed",
    embedded: "embed",
    on_shelf: "shelf"
  };
  var SAFE_SEGMENT = /^[a-z0-9_.-]+$/;
  var RUNTIME_NAME = /^[A-Za-z0-9._+\-]+$/;
  function isValidObjectiveName(value) {
    return value.length > 0 && value.length <= 16 && RUNTIME_NAME.test(value);
  }
  function isValidPlayingTag(value) {
    return value.length > 0 && RUNTIME_NAME.test(value);
  }
  function isSafeProjectName(value) {
    return Boolean(value) && value !== "." && value !== ".." && value !== "_generated" && SAFE_SEGMENT.test(value);
  }
  function sanitizeProjectName(value, fallback = "display_animation") {
    const sanitized = value.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "_").replace(/^_+|_+$/g, "");
    return isSafeProjectName(sanitized) ? sanitized : fallback;
  }
  function isReservedAnimationKey(value) {
    return value === "_generated";
  }
  function projectHash(value) {
    let hash2 = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash2 ^= value.charCodeAt(index);
      hash2 = Math.imul(hash2, 16777619);
    }
    return (hash2 >>> 0).toString(36).slice(0, 6).padStart(6, "0");
  }
  function phaseObjectiveFor(frameObjective) {
    return `jsb_${projectHash(frameObjective)}_p`;
  }
  function defaultRuntimeNames(projectName) {
    const hash2 = projectHash(projectName);
    return {
      frameObjective: `jsb_${hash2}_f`,
      modeObjective: `jsb_${hash2}_m`,
      maxFrameObjective: `jsb_${hash2}_x`,
      playingTag: `jsb_${hash2}_playing`
    };
  }

  // src/export-animation-settings.ts
  var PROPERTY_NAME2 = "display_anim_export_settings";
  var settingsProperty2 = null;
  function isOutputMode(value) {
    return ["both_default", "both_separate", "resource_only", "datapack_only"].includes(
      String(value)
    );
  }
  function isWriteMode(value) {
    return value === "create" || value === "insert";
  }
  function normalizeAnimationFps(value) {
    const numeric = typeof value === "number" ? value : Number(value);
    return Math.min(
      MAX_EXPORT_FPS,
      Math.max(1, Math.round(Number.isFinite(numeric) ? numeric : MAX_EXPORT_FPS))
    );
  }
  function storedSettings() {
    if (!Project) return null;
    const value = Project[PROPERTY_NAME2];
    if (!value || value.version !== 2 && value.version !== 3 && value.version !== 4 && value.version !== 5 && value.version !== 6 && value.version !== 7 || !Array.isArray(value.selectedAnimationUuids) || typeof value.defaultAnimationUuid !== "string" || typeof value.packName !== "string" || typeof value.projectName !== "string" || !isOutputMode(value.outputMode) || !isWriteMode(value.writeMode) || typeof value.baseItem !== "string" || typeof value.displayName !== "string" || typeof value.frameObjective !== "string" || typeof value.modeObjective !== "string" || typeof value.maxFrameObjective !== "string" || typeof value.playingTag !== "string") {
      return null;
    }
    return {
      version: 7,
      selectedAnimationUuids: value.selectedAnimationUuids.filter(
        (uuid) => typeof uuid === "string"
      ),
      defaultAnimationUuid: value.defaultAnimationUuid,
      packName: value.packName,
      projectName: value.projectName,
      outputMode: value.outputMode,
      writeMode: value.writeMode,
      baseItem: value.baseItem,
      displayName: value.displayName,
      frameObjective: value.frameObjective,
      modeObjective: value.modeObjective,
      maxFrameObjective: value.maxFrameObjective,
      playingTag: value.playingTag,
      debugEnabled: value.debugEnabled === true,
      handRenderingEnabled: value.handRenderingEnabled === true,
      handRigRootUuid: typeof value.handRigRootUuid === "string" ? value.handRigRootUuid : void 0,
      handLeftGroupUuid: typeof value.handLeftGroupUuid === "string" ? value.handLeftGroupUuid : void 0,
      handRightGroupUuid: typeof value.handRightGroupUuid === "string" ? value.handRightGroupUuid : void 0,
      handPreviewTextureUuid: typeof value.handPreviewTextureUuid === "string" ? value.handPreviewTextureUuid : void 0,
      exactBoundsOnExport: value.exactBoundsOnExport !== false,
      animationFps: normalizeAnimationFps(value.animationFps),
      sharedRoot: typeof value.sharedRoot === "string" ? value.sharedRoot : "",
      resourcePackFolder: typeof value.resourcePackFolder === "string" ? value.resourcePackFolder : "",
      datapackFolder: typeof value.datapackFolder === "string" ? value.datapackFolder : ""
    };
  }
  function registerExportAnimationSettingsProperty() {
    if (ModelProject.properties?.[PROPERTY_NAME2]) return;
    settingsProperty2 = new Property(ModelProject, "object", PROPERTY_NAME2, {
      default: {},
      exposed: false,
      label: tr("dap.export.property.name"),
      description: tr("dap.export.property.description")
    });
  }
  function unregisterExportAnimationSettingsProperty() {
    settingsProperty2?.delete();
    settingsProperty2 = null;
  }
  function initialExportSettings(animations) {
    const projectName = sanitizeProjectName(Project?.name ?? "", "display_animation");
    const runtime = defaultRuntimeNames(projectName);
    const stored = storedSettings();
    const available = new Set(animations.map((animation) => animation.uuid));
    const selected = stored?.selectedAnimationUuids.filter((uuid) => available.has(uuid)) ?? [];
    const fallback = Animation.selected ?? animations[0] ?? null;
    if (!stored && fallback) selected.push(fallback.uuid);
    const selectedSet = new Set(selected);
    const defaultAnimationUuid = (stored?.defaultAnimationUuid && selectedSet.has(stored.defaultAnimationUuid) ? stored.defaultAnimationUuid : Animation.selected && selectedSet.has(Animation.selected.uuid) ? Animation.selected.uuid : selected[0]) ?? "";
    return {
      version: 7,
      selectedAnimationUuids: selected,
      defaultAnimationUuid,
      packName: stored?.packName || projectName,
      projectName: stored?.projectName || projectName,
      outputMode: stored?.outputMode ?? "both_default",
      writeMode: stored?.writeMode ?? "create",
      baseItem: stored?.baseItem || "minecraft:potion",
      displayName: stored?.displayName || Project?.name?.trim() || projectName,
      frameObjective: stored?.frameObjective || runtime.frameObjective,
      modeObjective: stored?.modeObjective || runtime.modeObjective,
      maxFrameObjective: stored?.maxFrameObjective || runtime.maxFrameObjective,
      playingTag: stored?.playingTag || runtime.playingTag,
      debugEnabled: stored?.debugEnabled === true,
      handRenderingEnabled: stored?.handRenderingEnabled === true,
      handRigRootUuid: stored?.handRigRootUuid,
      handLeftGroupUuid: stored?.handLeftGroupUuid,
      handRightGroupUuid: stored?.handRightGroupUuid,
      handPreviewTextureUuid: stored?.handPreviewTextureUuid,
      exactBoundsOnExport: stored?.exactBoundsOnExport !== false,
      animationFps: stored?.animationFps ?? 20,
      sharedRoot: stored?.sharedRoot ?? "",
      resourcePackFolder: stored?.resourcePackFolder ?? "",
      datapackFolder: stored?.datapackFolder ?? ""
    };
  }
  function rememberExportSettings(settings) {
    if (!Project) return;
    Project[PROPERTY_NAME2] = {
      version: 7,
      ...settings,
      selectedAnimationUuids: [...settings.selectedAnimationUuids],
      debugEnabled: settings.debugEnabled === true,
      handRenderingEnabled: settings.handRenderingEnabled === true
    };
    Project.saved = false;
  }
  function rememberExportSettingsDraft(settings) {
    if (!Project) return;
    Project[PROPERTY_NAME2] = {
      ...settings,
      version: 7,
      selectedAnimationUuids: [...settings.selectedAnimationUuids],
      debugEnabled: settings.debugEnabled === true,
      handRenderingEnabled: settings.handRenderingEnabled === true
    };
    Project.saved = false;
  }
  function getProjectAnimationFps() {
    return storedSettings()?.animationFps ?? 20;
  }
  function setProjectAnimationFps(value) {
    const fps = normalizeAnimationFps(value);
    const settings = initialExportSettings(Animation.all);
    settings.animationFps = fps;
    rememberExportSettingsDraft(settings);
    return fps;
  }

  // src/playback.ts
  var lowFpsPreview = false;
  var previewLooping = false;
  var onTick = () => {
  };
  var listenersRegistered = false;
  var quantizedPreviewInProgress = false;
  var previewPlaybackTimer = null;
  var playbackIntent = false;
  var pauseResolutionToken = 0;
  var lastPlaybackTime = 0;
  var lastPlaybackAnimationUuid = "";
  var originalLoopToggleValue = null;
  function firstMinecraftFrameTime(animation) {
    return Math.min(1 / getProjectAnimationFps(), animation.length);
  }
  function getAnimation() {
    return Animation.selected ?? Animation.all[0] ?? null;
  }
  function quantize(time) {
    if (!lowFpsPreview) return time;
    const step = 1 / getProjectAnimationFps();
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
  function renderAtTimePreservingClock(time) {
    const rawTime = Timeline.time;
    quantizedPreviewInProgress = true;
    try {
      Timeline.time = time;
      Animator.preview(true);
    } finally {
      Timeline.time = rawTime;
      quantizedPreviewInProgress = false;
    }
  }
  function stopPreviewPlaybackDriver() {
    if (previewPlaybackTimer !== null) {
      clearInterval(previewPlaybackTimer);
      previewPlaybackTimer = null;
    }
  }
  function drivePreviewPlayback() {
    if (!Timeline.playing || !usesPreviewPlaybackDriver()) {
      stopPreviewPlaybackDriver();
      return;
    }
    Timeline.loop();
  }
  function syncPreviewPlaybackDriver() {
    if (Timeline.playing && usesPreviewPlaybackDriver()) {
      if (previewPlaybackTimer === null) {
        previewPlaybackTimer = setInterval(drivePreviewPlayback, 16);
      }
    } else {
      stopPreviewPlaybackDriver();
    }
  }
  function enforceCurrentDisplayAnimationPolicy() {
    if (Modes.selected.id !== "display" || isCurrentDisplayAnimationEnabled()) {
      if (Modes.selected.id === "display") Animator.preview();
      syncPreviewPlaybackDriver();
      report();
      return;
    }
    renderAtTimePreservingClock(0);
    syncPreviewPlaybackDriver();
    report();
  }
  function handleDisplayFrame() {
    if (quantizedPreviewInProgress) return;
    const animation = getAnimation();
    if (!animation) return;
    const rawTime = Timeline.time;
    const animationChanged = lastPlaybackAnimationUuid !== animation.uuid;
    if (animationChanged) {
      lastPlaybackAnimationUuid = animation.uuid;
      lastPlaybackTime = rawTime;
    } else if (playbackIntent && rawTime + 1e-7 < lastPlaybackTime) {
      if (!previewLooping) {
        playbackIntent = false;
        Timeline.pause();
        Timeline.setTime(animation.length);
        Animator.preview();
        lastPlaybackTime = animation.length;
        onTick(animation.length, animation.length, false);
        return;
      }
      const restartTime = firstMinecraftFrameTime(animation);
      Timeline.setTime(restartTime);
      lastPlaybackTime = restartTime;
      Animator.preview();
      onTick(restartTime, animation.length, true);
      return;
    }
    lastPlaybackTime = rawTime;
    if (Modes.selected.id === "display" && !isCurrentDisplayAnimationEnabled()) {
      renderAtTimePreservingClock(0);
      report(rawTime);
      return;
    }
    const displayTime = Math.min(quantize(rawTime), animation.length);
    if (lowFpsPreview && Timeline.playing && Math.abs(displayTime - rawTime) > 1e-8) {
      renderAtTimePreservingClock(displayTime);
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
    const animation = getAnimation();
    if (animation && !previewLooping && Timeline.time >= animation.length - 1e-7) {
      const restartTime = firstMinecraftFrameTime(animation);
      Timeline.setTime(restartTime);
      lastPlaybackAnimationUuid = animation.uuid;
      lastPlaybackTime = restartTime;
      Animator.preview();
    }
    playbackIntent = true;
    pauseResolutionToken++;
    syncPreviewPlaybackDriver();
    report();
  }
  function handleTimelinePause() {
    stopPreviewPlaybackDriver();
    const token = ++pauseResolutionToken;
    const pausedMode = Modes.selected.id;
    const shouldResumeAcrossModeChange = playbackIntent && pausedMode === "animate";
    setTimeout(() => {
      if (token !== pauseResolutionToken) return;
      if (shouldResumeAcrossModeChange && Modes.selected.id === "display") {
        Timeline.start();
        return;
      }
      playbackIntent = false;
      if (lowFpsPreview) {
        const animation = getAnimation();
        if (animation && Timeline.time >= animation.length - 1e-7) {
          const displayTime = Math.min(quantize(animation.length), animation.length);
          renderAtTimePreservingClock(displayTime);
          onTick(displayTime, animation.length, false);
        } else {
          seekTo(Timeline.time);
        }
      } else report();
    }, 0);
  }
  function handleAnimationSelect() {
    const animation = getAnimation();
    lastPlaybackAnimationUuid = animation?.uuid ?? "";
    lastPlaybackTime = Timeline.time;
    report();
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
    Blockbench.on("select_animation", handleAnimationSelect);
    listenersRegistered = true;
    previewLooping = false;
    originalLoopToggleValue = BarItems.looped_animation_playback.value;
    BarItems.looped_animation_playback.set(false);
    syncPreviewPlaybackDriver();
  }
  function disposePlaybackSync() {
    if (!listenersRegistered) return;
    Blockbench.removeListener("display_animation_frame", handleDisplayFrame);
    Blockbench.removeListener("timeline_play", handleTimelinePlay);
    Blockbench.removeListener("timeline_pause", handleTimelinePause);
    Blockbench.removeListener("select_mode", handleModeSelect);
    Blockbench.removeListener("select_animation", handleAnimationSelect);
    stopPreviewPlaybackDriver();
    listenersRegistered = false;
    onTick = () => {
    };
    if (originalLoopToggleValue !== null) {
      BarItems.looped_animation_playback.set(originalLoopToggleValue);
      originalLoopToggleValue = null;
    }
  }
  function isLooping() {
    return previewLooping;
  }
  function setLooping(value) {
    previewLooping = value;
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
  function getPreviewFps() {
    return getProjectAnimationFps();
  }
  function setPreviewFps(value) {
    const previewFps = setProjectAnimationFps(value);
    if (lowFpsPreview) {
      if (Timeline.playing) handleDisplayFrame();
      else seekTo(Timeline.time);
    }
    return previewFps;
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
  function selectPreviewAnimation(uuid) {
    const animation = Animation.all.find((item) => item.uuid === uuid) ?? null;
    if (!animation) return null;
    animation.select();
    const startTime = firstMinecraftFrameTime(animation);
    lastPlaybackAnimationUuid = animation.uuid;
    lastPlaybackTime = startTime;
    Timeline.setTime(startTime);
    if (Modes.selected.id === "display" && !isCurrentDisplayAnimationEnabled()) {
      renderAtTimePreservingClock(0);
    } else {
      Animator.preview();
    }
    syncPreviewPlaybackDriver();
    onTick(startTime, animation.length, Timeline.playing);
    return animation;
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
      seekTo(firstMinecraftFrameTime(animation));
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

  // src/ui-dom.ts
  function el(tag, text) {
    const node = document.createElement(tag);
    if (text) node.innerText = text;
    return node;
  }
  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }
  function applyFocusHighlight(control) {
    const focusable = control;
    focusable.onfocus = () => {
      control.style.borderColor = "var(--color-accent)";
    };
    focusable.onblur = () => {
      control.style.borderColor = "var(--color-border)";
    };
  }

  // src/control-panel.ts
  var panel2 = null;
  var slotSelectEl = null;
  var sliderEl = null;
  var timeLabelEl = null;
  var playButtonEl = null;
  var animatedCheckboxEl = null;
  var animationSelectEl = null;
  var animationSwitchRowEl = null;
  var slotMonitorTimer = null;
  var observedSlot = "";
  var observedAnimationUuid = "";
  var observedAnimationList = "";
  var lastTransportPlaying = null;
  var lastTransportLength = Number.NaN;
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
  function styleInputControl(input) {
    input.style.background = "var(--color-back)";
    input.style.color = "var(--color-text)";
    input.style.border = "1px solid var(--color-border)";
    input.style.borderRadius = "0";
    input.style.padding = "4px 7px";
    input.style.boxSizing = "border-box";
    input.style.outline = "none";
    applyFocusHighlight(input);
  }
  function updateControlsUI(time, length, playing) {
    syncDisplayControls();
    if (sliderEl) {
      if (length !== lastTransportLength) {
        sliderEl.max = String(length);
        lastTransportLength = length;
      }
      sliderEl.value = String(time);
    }
    if (timeLabelEl) {
      timeLabelEl.innerText = `${formatTime(time)} / ${formatTime(length)}`;
    }
    if (playButtonEl && playing !== lastTransportPlaying) {
      playButtonEl.innerHTML = `<i class="material-icons">${playing ? "pause" : "play_arrow"}</i>`;
      lastTransportPlaying = playing;
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
  function syncAnimationControl() {
    const listSignature = Animation.all.map((animation2) => `${animation2.uuid}\0${animation2.name}`).join("");
    if (animationSelectEl && listSignature !== observedAnimationList) {
      animationSelectEl.innerHTML = "";
      for (const animation2 of Animation.all) {
        const option = document.createElement("option");
        option.value = animation2.uuid;
        option.innerText = animation2.name;
        animationSelectEl.appendChild(option);
      }
      observedAnimationList = listSignature;
    }
    const selectedUuid = Animation.selected?.uuid ?? "";
    if (selectedUuid === observedAnimationUuid) return;
    observedAnimationUuid = selectedUuid;
    if (animationSelectEl) animationSelectEl.value = selectedUuid;
    const animation = Animation.selected;
    if (animation) updateControlsUI(Math.min(Timeline.time, animation.length), animation.length, Timeline.playing);
  }
  function startSlotMonitor() {
    if (slotMonitorTimer !== null) return;
    slotMonitorTimer = setInterval(() => {
      syncDisplayControls();
      syncAnimationControl();
    }, 150);
  }
  function buildAnimationPicker(container) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "6px";
    row.style.padding = "4px 0";
    row.style.flexWrap = "wrap";
    const label = document.createElement("span");
    label.innerText = tr("dap.panel.animation");
    label.style.fontSize = "inherit";
    label.style.whiteSpace = "nowrap";
    const select = document.createElement("select");
    select.style.flex = "1 1 150px";
    select.style.minWidth = "0";
    for (const animation of Animation.all) {
      const option = document.createElement("option");
      option.value = animation.uuid;
      option.innerText = animation.name;
      select.appendChild(option);
    }
    observedAnimationList = Animation.all.map((animation) => `${animation.uuid}\0${animation.name}`).join("");
    select.value = Animation.selected?.uuid ?? "";
    observedAnimationUuid = select.value;
    select.onchange = (event) => {
      const animation = selectPreviewAnimation(event.target.value);
      observedAnimationUuid = animation?.uuid ?? "";
    };
    animationSelectEl = select;
    row.appendChild(label);
    row.appendChild(select);
    container.appendChild(row);
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
    label.style.fontSize = "inherit";
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
    animatedLabel.style.fontSize = "inherit";
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
    buttonGroup.style.flex = "1 1 100%";
    buttonGroup.style.flexWrap = "wrap";
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
    const fpsGroup = document.createElement("label");
    fpsGroup.style.display = "flex";
    fpsGroup.style.alignItems = "center";
    fpsGroup.style.gap = "4px";
    fpsGroup.style.fontSize = "inherit";
    fpsGroup.style.whiteSpace = "nowrap";
    fpsGroup.style.flex = "1 1 118px";
    fpsGroup.innerText = tr("dap.panel.preview_fps");
    const fpsInput = document.createElement("input");
    fpsInput.type = "number";
    fpsInput.min = "1";
    fpsInput.max = "20";
    fpsInput.step = "1";
    fpsInput.value = String(getPreviewFps());
    fpsInput.title = tr("dap.panel.preview_fps_hint");
    fpsInput.style.width = "48px";
    styleInputControl(fpsInput);
    fpsInput.onchange = () => {
      fpsInput.value = String(setPreviewFps(parseFloat(fpsInput.value)));
    };
    fpsGroup.appendChild(fpsInput);
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
    timeLabel.style.fontSize = "inherit";
    timeLabel.style.textAlign = "right";
    timeLabel.style.whiteSpace = "nowrap";
    timeLabel.style.flex = "0 0 auto";
    timeLabelEl = timeLabel;
    buttonGroup.appendChild(playButton);
    buttonGroup.appendChild(loopButton);
    buttonGroup.appendChild(lowFpsButton);
    buttonGroup.appendChild(fpsGroup);
    scrubGroup.appendChild(slider);
    scrubGroup.appendChild(timeLabel);
    bar.appendChild(buttonGroup);
    bar.appendChild(scrubGroup);
    container.appendChild(bar);
  }
  function openControlPanel() {
    setTickCallback(updateControlsUI);
    if (panel2) {
      panel2.fold(false);
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
    buildAnimationPicker(wrapper);
    buildAnimationSwitch(wrapper);
    buildTransportControls(wrapper);
    panel2 = new Panel("display_anim_preview_controls", {
      name: tr("dap.panel.name"),
      icon: "movie",
      growable: true,
      resizable: true,
      // Leave enough height for a third wrapped row.
      default_position: { slot: "left_bar", height: 205, width: 340 }
    });
    panel2.node.appendChild(wrapper);
    panel2.fold(false);
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
    panel2?.delete();
    panel2 = null;
    slotSelectEl = null;
    sliderEl = null;
    timeLabelEl = null;
    playButtonEl = null;
    animatedCheckboxEl = null;
    animationSelectEl = null;
    animationSwitchRowEl = null;
    observedSlot = "";
    observedAnimationUuid = "";
    observedAnimationList = "";
    lastTransportPlaying = null;
    lastTransportLength = Number.NaN;
  }

  // src/bounds-cache.ts
  var projectCache = /* @__PURE__ */ new WeakMap();
  function stable(value) {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
    const record = value;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stable(record[key])}`).join(",")}}`;
  }
  function hash(value) {
    let result = 2166136261;
    for (let index = 0; index < value.length; index++) {
      result ^= value.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return (result >>> 0).toString(36);
  }
  function nodeParentUuid(node) {
    return node.parent && node.parent !== "root" ? node.parent.uuid : "root";
  }
  function modelBoundsFingerprint() {
    const elements = Outliner.elements.map((element) => ({
      uuid: element.uuid,
      type: element.constructor?.name ?? "element",
      parent: nodeParentUuid(element),
      from: element.from,
      to: element.to,
      origin: element.origin,
      rotation: element.rotation,
      inflate: element.inflate ?? 0,
      export: element.export !== false
    })).sort((left, right) => left.uuid.localeCompare(right.uuid));
    const groups = Group.all.map((group) => ({
      uuid: group.uuid,
      parent: nodeParentUuid(group),
      children: group.children.map((child) => child.uuid),
      origin: group.origin,
      rotation: group.rotation,
      export: group.export !== false
    })).sort((left, right) => left.uuid.localeCompare(right.uuid));
    return hash(stable({ format: Format.id, elements, groups }));
  }
  function keyframeSnapshot(keyframe) {
    const value = keyframe;
    const dataPoints = (keyframe.data_points ?? []).map((point) => Object.fromEntries(
      Object.entries(point).filter(([key, item]) => key !== "keyframe" && (item === null || ["string", "number", "boolean"].includes(typeof item) || Array.isArray(item) && item.every((entry) => entry === null || ["string", "number", "boolean"].includes(typeof entry))))
    ));
    return {
      time: keyframe.time,
      channel: keyframe.channel,
      interpolation: keyframe.interpolation,
      // KeyframeDataPoint refers back to its keyframe; retain serializable user data only.
      data_points: dataPoints,
      easing: value.easing,
      easingArgs: value.easingArgs,
      bezier_left_time: keyframe.bezier_left_time,
      bezier_left_value: keyframe.bezier_left_value,
      bezier_right_time: keyframe.bezier_right_time,
      bezier_right_value: keyframe.bezier_right_value
    };
  }
  function animationBoundsFingerprint(animation, modelFingerprint = modelBoundsFingerprint()) {
    const animators = Object.entries(animation.animators ?? {}).map(([uuid, animator]) => ({
      uuid,
      keyframes: (animator?.keyframes ?? []).map(keyframeSnapshot)
    })).sort((left, right) => left.uuid.localeCompare(right.uuid));
    return hash(stable({
      modelFingerprint,
      uuid: animation.uuid,
      name: animation.name,
      length: animation.length,
      snapping: animation.snapping,
      blendWeight: animation.blend_weight ?? "",
      animators
    }));
  }
  function cacheKey(mode, animationUuid) {
    return `${mode}:${animationUuid}`;
  }
  function rememberBoundsDetection(project, record) {
    let records = projectCache.get(project);
    if (!records) {
      records = /* @__PURE__ */ new Map();
      projectCache.set(project, records);
    }
    records.set(cacheKey(record.mode, record.animationUuid), record);
  }
  function validBoundsDetection(project, animation, mode, modelFingerprint = modelBoundsFingerprint()) {
    const record = projectCache.get(project)?.get(cacheKey(mode, animation.uuid)) ?? null;
    if (!record) return null;
    return record.fps === getProjectAnimationFps() && record.fingerprint === animationBoundsFingerprint(animation, modelFingerprint) ? record : null;
  }
  function detectionStatus(project, animation, modelFingerprint = modelBoundsFingerprint()) {
    const records = projectCache.get(project);
    const quickStored = records?.get(cacheKey("quick", animation.uuid)) ?? null;
    const exactStored = records?.get(cacheKey("exact", animation.uuid)) ?? null;
    const fingerprint = animationBoundsFingerprint(animation, modelFingerprint);
    const quick = quickStored?.fingerprint === fingerprint ? quickStored : null;
    const exact = exactStored?.fingerprint === fingerprint ? exactStored : null;
    return { quick, exact, stale: Boolean((quickStored || exactStored) && !quick && !exact) };
  }

  // src/bounds-report.ts
  function summarizeOutOfBoundsByFrame(hits) {
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
    return frames.map((frame2) => {
      const frameHits = byFrame.get(frame2) ?? [];
      const worst = frameHits.reduce(
        (acc, hit) => Math.abs(hit.value) > Math.abs(acc.value) ? hit : acc
      );
      const names = [...new Set(frameHits.map((hit) => hit.elementName))];
      const nameList = names.length > 2 ? tr("dap.bounds.parts_many", {
        names: names.slice(0, 2).join(", "),
        count: names.length
      }) : names.join(", ");
      return { frame: frame2, description: tr("dap.bounds.frame", {
        frame: frame2,
        parts: nameList,
        field: worst.field,
        axis: worst.axis,
        value: worst.value.toFixed(2)
      }) };
    });
  }
  function describeOutOfBounds(hits) {
    if (!hits.length) return null;
    const lines2 = summarizeOutOfBoundsByFrame(hits).map((item) => item.description);
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

  // src/bounds-task.ts
  var BoundsTaskCancelledError = class extends Error {
    constructor() {
      super("Bounds check cancelled");
      this.name = "BoundsTaskCancelledError";
    }
  };
  function assertBoundsTaskActive(control) {
    if (control.isCancelled()) throw new BoundsTaskCancelledError();
  }
  function yieldBoundsTask() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  // src/display-snapshot.ts
  function cloneCompiledDisplay(display) {
    return display ? JSON.parse(JSON.stringify(display)) : void 0;
  }
  function applyCompiledDisplaySnapshot(model, display) {
    if (!display) return model;
    model.display = display;
    return model;
  }

  // src/assets/missing.png
  var missing_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAHpJREFUOI21kjEKACEMBNdD/IGV/39abMwL0uSKgIiCyRVnETFsMrJsUlWEDxFlu0opIuJWZn4ABNUiAiADuChaawDGGNYB4BDs6yvhuRNsYJ3/n5DXd611c9khbPt8wtw33YwSps5x6dSdhKSq8Sz13r9niYiYOZ7wF+cqCUwV0Ir/AAAAAElFTkSuQmCC";

  // src/hand-rig.ts
  var ROLE_PROPERTY = "display_anim_hand_role";
  var GENERATED_PROPERTY = "display_anim_hand_generated";
  var PREVIEW_TEXTURE_PROPERTY = "display_anim_hand_preview_texture";
  var ROOT_ROLE = "root";
  var LEFT_ROLE = "left_arm";
  var RIGHT_ROLE = "right_arm";
  var DEFAULT_TEXTURE_NAME = "missing.png";
  var groupRoleProperty = null;
  var groupGeneratedProperty = null;
  var cubeRoleProperty = null;
  var cubeGeneratedProperty = null;
  var texturePreviewProperty = null;
  function registerHandRigProperties() {
    if (!Group.properties?.[ROLE_PROPERTY]) {
      groupRoleProperty = new Property(Group, "string", ROLE_PROPERTY, { default: "" });
    }
    if (!Group.properties?.[GENERATED_PROPERTY]) {
      groupGeneratedProperty = new Property(Group, "boolean", GENERATED_PROPERTY, { default: false });
    }
    if (!Cube.properties?.[ROLE_PROPERTY]) {
      cubeRoleProperty = new Property(Cube, "string", ROLE_PROPERTY, { default: "" });
    }
    if (!Cube.properties?.[GENERATED_PROPERTY]) {
      cubeGeneratedProperty = new Property(Cube, "boolean", GENERATED_PROPERTY, { default: false });
    }
    if (!Texture.properties?.[PREVIEW_TEXTURE_PROPERTY]) {
      texturePreviewProperty = new Property(Texture, "boolean", PREVIEW_TEXTURE_PROPERTY, { default: false });
    }
  }
  function unregisterHandRigProperties() {
    for (const property of [groupRoleProperty, groupGeneratedProperty, cubeRoleProperty, cubeGeneratedProperty, texturePreviewProperty]) {
      property?.delete();
    }
    groupRoleProperty = groupGeneratedProperty = cubeRoleProperty = cubeGeneratedProperty = null;
    texturePreviewProperty = null;
  }
  function roleOf(node) {
    return String(node[ROLE_PROPERTY] ?? "");
  }
  function setRole(node, role, generated) {
    const record = node;
    record[ROLE_PROPERTY] = role;
    record[GENERATED_PROPERTY] = generated;
  }
  function isGenerated(node) {
    return node[GENERATED_PROPERTY] === true;
  }
  function findGroup(uuid, role, compatibleName) {
    return (uuid ? Group.all.find((group) => group.uuid === uuid) : void 0) ?? Group.all.find((group) => roleOf(group) === role) ?? Group.all.find((group) => group.name.toLowerCase() === compatibleName) ?? null;
  }
  function resolveHandRig(settings) {
    const left = findGroup(settings.handLeftGroupUuid, LEFT_ROLE, "lefthand");
    const right = findGroup(settings.handRightGroupUuid, RIGHT_ROLE, "righthand");
    if (!left || !right) return null;
    const root = findGroup(settings.handRigRootUuid, ROOT_ROLE, "dap_playerhands");
    return { root, left, right };
  }
  function resolveProjectHandRig() {
    const settings = Project?.display_anim_export_settings;
    if (!settings?.handRenderingEnabled) return null;
    return resolveHandRig(settings);
  }
  function assertNoHandScaleKeyframes(animation, rig) {
    for (const hand of [rig.left, rig.right]) {
      let group = hand;
      while (group && group !== "root") {
        const animator = animation.animators?.[group.uuid];
        const hasScale = animator?.keyframes?.some((keyframe) => keyframe.channel === "scale") === true;
        if (hasScale) {
          throw new Error(tr("dap.hand.scale_unsupported", { animation: animation.name, group: group.name }));
        }
        group = group.parent;
      }
    }
  }
  function armPlaceholder(side) {
    return side === "right" ? { pivot: [14, 2, 16], from: [12, 0, 4], to: [16, 4, 16] } : { pivot: [2, 2, 16], from: [0, 0, 4], to: [4, 4, 16] };
  }
  function armBoxUvOffset() {
    return [0, 0, 0];
  }
  function applyArmTexture(cube, texture) {
    cube.applyTexture?.(texture, true);
    cube.box_uv = true;
    cube.uv_offset = armBoxUvOffset().slice();
    for (const faceName of Object.keys(cube.faces ?? {})) {
      const face = cube.faces?.[faceName];
      if (!face) continue;
      face.texture = texture.uuid;
    }
  }
  function createArmCube(group, texture, side) {
    const placeholder = armPlaceholder(side);
    const cube = new Cube({
      name: `DAP_${side === "right" ? "Right" : "Left"}Arm_Skin`,
      from: placeholder.from.slice(),
      to: placeholder.to.slice(),
      origin: placeholder.pivot.slice(),
      inflate: 0,
      export: false,
      visibility: true,
      autouv: 0
    }).init().addTo(group);
    setRole(cube, `${side}_skin`, true);
    applyArmTexture(cube, texture);
    return cube;
  }
  function armCubes(group, side) {
    const descendants = [];
    group.forEachChild?.((child) => descendants.push(child));
    const direct = group.children ?? [];
    const all = descendants.length ? descendants : direct;
    const skin = all.find((node) => roleOf(node) === `${side}_skin`) ?? all.find((node) => node instanceof Cube && (node.inflate ?? 0) < 0.1) ?? null;
    const stale = all.filter(
      (node) => node !== skin && node instanceof Cube && (roleOf(node) === `${side}_sleeve` || roleOf(node) === "")
    );
    return { skin, stale };
  }
  function ensureDefaultTexture(settings) {
    const existing = Texture.all.find((texture2) => texture2.uuid === settings.handPreviewTextureUuid) ?? Texture.all.find(
      (texture2) => texture2[PREVIEW_TEXTURE_PROPERTY] === true
    );
    if (existing) {
      existing[PREVIEW_TEXTURE_PROPERTY] = true;
      return existing;
    }
    const texture = new Texture({ name: DEFAULT_TEXTURE_NAME }).fromDataURL(missing_default).add(false);
    texture[PREVIEW_TEXTURE_PROPERTY] = true;
    return texture;
  }
  function refreshArm(group, texture, side, settings) {
    setRole(group, side === "left" ? LEFT_ROLE : RIGHT_ROLE, isGenerated(group));
    if (!isGenerated(group)) return;
    group.visibility = settings.handRenderingEnabled;
    const cubes = armCubes(group, side);
    if (cubes.skin && !isGenerated(cubes.skin)) return;
    const skin = cubes.skin ?? createArmCube(group, texture, side);
    setRole(skin, `${side}_skin`, true);
    skin.export = false;
    skin.visibility = settings.handRenderingEnabled;
    if (!cubes.skin) applyArmTexture(skin, texture);
  }
  function ensureHandRig(settings) {
    if (!Project) throw new Error(tr("dap.settings.no_project"));
    const beforeGroups = Group.all.slice();
    const beforeElements = Outliner.elements.slice();
    const beforeTextures = Texture.all.slice();
    Undo.initEdit({ elements: beforeElements, groups: beforeGroups, textures: beforeTextures, outliner: true, animations: Animation.all.slice() });
    try {
      const texture = ensureDefaultTexture(settings);
      let root = findGroup(settings.handRigRootUuid, ROOT_ROLE, "dap_playerhands");
      let left = findGroup(settings.handLeftGroupUuid, LEFT_ROLE, "lefthand");
      let right = findGroup(settings.handRightGroupUuid, RIGHT_ROLE, "righthand");
      if (!left || !right) {
        root = root ?? new Group({ name: "DAP_PlayerHands", origin: [8, 8, 8] }).init();
        setRole(root, ROOT_ROLE, true);
        if (!right) {
          right = new Group({ name: "DAP_RightArm", origin: armPlaceholder("right").pivot.slice() }).init().addTo(root);
          setRole(right, RIGHT_ROLE, true);
        }
        if (!left) {
          left = new Group({ name: "DAP_LeftArm", origin: armPlaceholder("left").pivot.slice() }).init().addTo(root);
          setRole(left, LEFT_ROLE, true);
        }
        if (!right || !left) throw new Error("Unable to create player hand groups.");
        setRole(right, RIGHT_ROLE, isGenerated(right));
        setRole(left, LEFT_ROLE, isGenerated(left));
      } else {
        setRole(left, LEFT_ROLE, isGenerated(left));
        setRole(right, RIGHT_ROLE, isGenerated(right));
      }
      refreshArm(left, texture, "left", settings);
      refreshArm(right, texture, "right", settings);
      settings.handRigRootUuid = root?.uuid;
      settings.handLeftGroupUuid = left.uuid;
      settings.handRightGroupUuid = right.uuid;
      settings.handPreviewTextureUuid = texture.uuid;
      Undo.finishEdit(tr("dap.hand.undo_create"), { elements: Outliner.elements.slice(), groups: Group.all.slice(), textures: Texture.all.slice(), outliner: true, animations: Animation.all.slice() });
      Canvas.updateAll();
      return { root, left, right };
    } catch (error) {
      Undo.cancelEdit(true);
      throw error;
    }
  }
  function setHandRigVisibility(settings) {
    const rig = resolveHandRig(settings);
    if (!rig) return;
    for (const [side, group] of [["left", rig.left], ["right", rig.right]]) {
      if (!isGenerated(group)) continue;
      group.visibility = settings.handRenderingEnabled;
      const cubes = armCubes(group, side);
      if (cubes.skin) cubes.skin.visibility = settings.handRenderingEnabled;
    }
    Canvas.updateAll();
  }
  function deleteHandRig(settings) {
    const rig = resolveHandRig(settings);
    if (!rig) return;
    Undo.initEdit({ elements: Outliner.elements.slice(), groups: Group.all.slice(), outliner: true, animations: Animation.all.slice() });
    try {
      for (const group of [rig.left, rig.right]) {
        if (isGenerated(group)) {
          const descendants = [];
          group.forEachChild?.((node) => descendants.push(node));
          if (descendants.every(isGenerated)) group.remove();
          else setRole(group, "", false);
        } else setRole(group, "", false);
      }
      if (rig.root && isGenerated(rig.root) && rig.root.children.length === 0) rig.root.remove();
      settings.handRigRootUuid = void 0;
      settings.handLeftGroupUuid = void 0;
      settings.handRightGroupUuid = void 0;
      Undo.finishEdit(tr("dap.hand.undo_delete"), { elements: Outliner.elements.slice(), groups: Group.all.slice(), outliner: true, animations: Animation.all.slice() });
      Canvas.updateAll();
    } catch (error) {
      Undo.cancelEdit(true);
      throw error;
    }
  }

  // src/hand-pose.ts
  var IDENTITY_MATRIX = [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ];
  function multiplyMatrices(left, right) {
    const result = new Array(16).fill(0);
    for (let column = 0; column < 4; column++) {
      for (let row = 0; row < 4; row++) {
        for (let index = 0; index < 4; index++) {
          result[column * 4 + row] += left[index * 4 + row] * right[column * 4 + index];
        }
      }
    }
    return result;
  }
  function invertRigidMatrix(matrix) {
    if (matrix.length !== 16) throw new Error("Expected a 4\xD74 hand matrix.");
    const result = IDENTITY_MATRIX.slice();
    for (let column = 0; column < 3; column++) {
      for (let row = 0; row < 3; row++) result[column * 4 + row] = matrix[row * 4 + column];
    }
    const x = matrix[12], y = matrix[13], z = matrix[14];
    result[12] = -(result[0] * x + result[4] * y + result[8] * z);
    result[13] = -(result[1] * x + result[5] * y + result[9] * z);
    result[14] = -(result[2] * x + result[6] * y + result[10] * z);
    return result;
  }
  function relativeHandMatrix(current, bind) {
    return { matrix: multiplyMatrices(current, invertRigidMatrix(bind)) };
  }
  function assertRigidHandPose(pose) {
    const matrix = pose?.matrix ?? IDENTITY_MATRIX;
    if (matrix.length !== 16 || matrix.some((value) => !Number.isFinite(value))) {
      throw new Error("Expected a finite 4\xD74 hand matrix.");
    }
    for (let column = 0; column < 3; column++) {
      for (let other = 0; other < 3; other++) {
        const dot = [0, 1, 2].reduce((sum, row) => sum + matrix[column * 4 + row] * matrix[other * 4 + row], 0);
        if (Math.abs(dot - (column === other ? 1 : 0)) > 1e-4) {
          throw new Error("Hand pose contains scale or shear; only position and rotation are supported.");
        }
      }
    }
    const determinant = matrix[0] * (matrix[5] * matrix[10] - matrix[9] * matrix[6]) - matrix[4] * (matrix[1] * matrix[10] - matrix[9] * matrix[2]) + matrix[8] * (matrix[1] * matrix[6] - matrix[5] * matrix[2]);
    if (Math.abs(determinant - 1) > 1e-4 || [3, 7, 11].some((i) => Math.abs(matrix[i]) > 1e-4) || Math.abs(matrix[15] - 1) > 1e-4) {
      throw new Error("Hand pose must be a proper rigid affine transform.");
    }
    return matrix;
  }
  var HAND_CALIBRATION = {
    left: { rotation: [0, 180, 0], translation: [-20.3, 5.5, 1.7] },
    right: { rotation: [180, 0, 0], translation: [-1, 1.4, 1.5] }
  };
  var HAND_MARKER_SCALE = {
    left: [0.471, 0.515, 1.515],
    right: [0.46629, 0.50985, 1.49985]
  };
  function handSpecialTransformation() {
    return {
      left_rotation: [1, 0, 0, 0],
      right_rotation: [0, 0, 0, 1],
      scale: [1, 1, 1],
      translation: [0.5, 0, 0.5]
    };
  }
  function degrees(value) {
    return value * Math.PI / 180;
  }
  function eulerXyzMatrix(rotation, translation = [0, 0, 0], scale = [1, 1, 1]) {
    const x = degrees(rotation[0]);
    const y = degrees(rotation[1]);
    const z = degrees(rotation[2]);
    const a = Math.cos(x), b = Math.sin(x);
    const c = Math.cos(y), d = Math.sin(y);
    const e = Math.cos(z), f = Math.sin(z);
    return [
      c * e * scale[0],
      (a * f + b * e * d) * scale[0],
      (b * f - a * e * d) * scale[0],
      0,
      -c * f * scale[1],
      (a * e - b * f * d) * scale[1],
      (b * e + a * f * d) * scale[1],
      0,
      d * scale[2],
      -b * c * scale[2],
      a * c * scale[2],
      0,
      translation[0],
      translation[1],
      translation[2],
      1
    ];
  }
  function radiansToDegrees(value) {
    return value * 180 / Math.PI;
  }
  function cleanNumber(value) {
    if (Math.abs(value) < 1e-10) return 0;
    return Number(value.toFixed(8));
  }
  function matrixEulerXyz(matrix) {
    const sx = Math.hypot(matrix[0], matrix[1], matrix[2]) || 1;
    const sy = Math.hypot(matrix[4], matrix[5], matrix[6]) || 1;
    const sz = Math.hypot(matrix[8], matrix[9], matrix[10]) || 1;
    const m00 = matrix[0] / sx;
    const m01 = matrix[4] / sy;
    const m11 = matrix[5] / sy;
    const m21 = matrix[6] / sy;
    const m02 = Math.max(-1, Math.min(1, matrix[8] / sz));
    const m12 = matrix[9] / sz;
    const m22 = matrix[10] / sz;
    let x;
    const y = Math.asin(m02);
    let z;
    if (Math.abs(m02) < 0.9999999) {
      x = Math.atan2(-m12, m22);
      z = Math.atan2(-m01, m00);
    } else {
      x = Math.atan2(m21, m11);
      z = 0;
    }
    return [x, y, z].map((value) => cleanNumber(radiansToDegrees(value)));
  }
  var HAND_REFERENCE_PIVOT = {
    left: [2, 2, 16],
    right: [14, 2, 16]
  };
  function captureHandPose(side, current) {
    assertRigidHandPose({ matrix: current });
    return relativeHandMatrix(current, eulerXyzMatrix([0, 0, 0], HAND_REFERENCE_PIVOT[side]));
  }
  function animatedHandDisplay(side, pose) {
    const delta = assertRigidHandPose(pose);
    const calibration = HAND_CALIBRATION[side];
    if (delta.every((value, index) => Math.abs(value - IDENTITY_MATRIX[index]) < 1e-9)) {
      return {
        rotation: calibration.rotation.slice(),
        translation: calibration.translation.slice(),
        scale: HAND_MARKER_SCALE[side].slice()
      };
    }
    const base = eulerXyzMatrix(calibration.rotation, calibration.translation);
    const centerY = -4 * HAND_MARKER_SCALE[side][1];
    const pivotOffset = [base[4] * centerY, base[5] * centerY, base[6] * centerY + 6];
    const anchorTranslation = calibration.translation.map((value, axis) => value + pivotOffset[axis] - HAND_REFERENCE_PIVOT[side][axis]);
    const anchor = eulerXyzMatrix([0, 0, 0], anchorTranslation);
    const motion = multiplyMatrices(multiplyMatrices(anchor, delta), invertRigidMatrix(anchor));
    const combined = multiplyMatrices(motion, base);
    return {
      rotation: matrixEulerXyz(combined),
      translation: [combined[12], combined[13], combined[14]].map(cleanNumber),
      scale: HAND_MARKER_SCALE[side].slice()
    };
  }
  function previewAlignedHandDisplay(side, pose, display = {}, leftContext = false) {
    const delta = assertRigidHandPose(pose);
    const group = multiplyMatrices(delta, eulerXyzMatrix([0, 0, 0], HAND_REFERENCE_PIVOT[side]));
    const rotation = (display.rotation ?? [0, 0, 0]).slice();
    const translation = (display.translation ?? [0, 0, 0]).slice();
    if (leftContext) {
      translation[0] *= -1;
      rotation[1] *= -1;
      rotation[2] *= -1;
    }
    const displayRotation = eulerXyzMatrix(rotation);
    const displayMatrix = eulerXyzMatrix(rotation, translation, display.scale ?? [1, 1, 1]);
    const center = pose.center ? pose.center.map((value) => value - 8) : [0, 1, 2].map((axis) => group[12 + axis] - 6 * group[8 + axis] - 8);
    const target = [0, 1, 2].map((axis) => displayMatrix[12 + axis] + center.reduce((sum, value, column) => sum + displayMatrix[column * 4 + axis] * value, 0));
    const orientation = multiplyMatrices(
      multiplyMatrices(displayRotation, group),
      eulerXyzMatrix(HAND_CALIBRATION[side].rotation)
    );
    const offset = -4 * HAND_MARKER_SCALE[side][1];
    const resultTranslation = target.map((value, axis) => cleanNumber(value - orientation[4 + axis] * offset));
    const resultRotation = matrixEulerXyz(orientation);
    if (leftContext) {
      resultTranslation[0] *= -1;
      resultRotation[1] *= -1;
      resultRotation[2] *= -1;
    }
    return { rotation: resultRotation, translation: resultTranslation, scale: HAND_MARKER_SCALE[side].slice() };
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
  function applyAnimatedOffsets(node, animation) {
    const offsetRotation = [0, 0, 0];
    const offsetPosition = [0, 0, 0];
    const animator = animation.getBoneAnimator(node);
    if (!animator || !(node instanceof Group)) return;
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
  function collectOutOfBounds(frame2, model, sources) {
    const hits = [];
    const elements = model.elements ?? [];
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
            frame: frame2,
            elementIndex,
            elementName: element.name ?? `element ${elementIndex}`,
            axis: AXIS_NAMES[axis] ?? "x",
            field,
            value,
            sourceElementUuid: sources[elementIndex]?.elementUuid,
            sourceGroupUuids: sources[elementIndex]?.groupUuids
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
  function modelStructureSignature() {
    const elements = Outliner.elements.map((element) => element.uuid).sort();
    const groups = Group.all.map((group) => group.uuid).sort();
    return `${elements.join(",")}|${groups.join(",")}`;
  }
  function safelyCancelBakeEdit(token) {
    if (Undo.current_save !== token) {
      throw new Error("Blockbench changed the active edit while restoring a baked frame.");
    }
    const previewDescriptor = Object.getOwnPropertyDescriptor(Animator, "preview");
    if (!previewDescriptor?.configurable) {
      throw new Error("Blockbench does not allow a safe animation-preview restore in this version.");
    }
    try {
      Object.defineProperty(Animator, "preview", {
        configurable: true,
        value: () => {
        }
      });
      Undo.cancelEdit(true);
    } finally {
      Object.defineProperty(Animator, "preview", previewDescriptor);
    }
    if (Undo.current_save) {
      throw new Error("Blockbench did not finish restoring the baked frame.");
    }
  }
  function readModelMatrix(group) {
    const chain = [];
    let current = group;
    while (current && current !== "root") {
      chain.unshift(current);
      current = current.parent;
    }
    let matrix = IDENTITY_MATRIX.slice();
    for (const item of chain) {
      item.mesh.updateMatrixWorld(true);
      const local = item.mesh.matrix.toArray();
      if (local.length !== 16 || local.some((value) => !Number.isFinite(value))) {
        throw new Error(`Invalid Blockbench model matrix for hand group ${item.name}.`);
      }
      matrix = multiplyMatrices(matrix, local);
    }
    return matrix;
  }
  function readHandMatrices(rig) {
    const read = (side) => {
      const group = rig[side];
      const pose = captureHandPose(side, readModelMatrix(group));
      const cubes = [];
      group.forEachChild?.((node) => {
        if (node instanceof Cube) cubes.push(node);
      });
      if (!cubes.length) return pose;
      const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
      const inverse = invertRigidMatrix(readModelMatrix(group));
      for (const cube of cubes) {
        const { from, to, origin } = cube;
        if (!from || !to || !origin) continue;
        const local = multiplyMatrices(inverse, readModelMatrix(cube));
        for (let corner = 0; corner < 8; corner++) {
          const point = [0, 1, 2].map((axis) => (corner & 1 << axis ? to[axis] : from[axis]) - origin[axis]);
          for (let axis = 0; axis < 3; axis++) {
            const value = local[12 + axis] + point.reduce((sum, v, column) => sum + local[column * 4 + axis] * v, 0);
            min[axis] = Math.min(min[axis], value);
            max[axis] = Math.max(max[axis], value);
          }
        }
      }
      const center = min.map((v, axis) => (v + max[axis]) / 2);
      if (center.every(Number.isFinite)) {
        const matrix = readModelMatrix(group);
        pose.center = [0, 1, 2].map((axis) => matrix[12 + axis] + center.reduce((sum, v, column) => sum + matrix[column * 4 + axis] * v, 0));
      }
      return pose;
    };
    return { left: read("left"), right: read("right") };
  }
  function* bakeFrameSteps(animation, frameCount, fps, rootGroupUuid, collectBounds = true, captureHands = false) {
    if (Undo.current_save) {
      throw new Error(tr("dap.bake.active_edit"));
    }
    const frames = [];
    const outOfBounds = [];
    const originalTime = Timeline.time;
    const sourceAnimationUuid = animation.uuid;
    const originalAnimationUuid = Animation.selected?.uuid;
    const playingStates = Animation.all.map((animation2) => ({
      uuid: animation2.uuid,
      playing: animation2.playing
    }));
    const originalSaved = Project?.saved;
    const keyframesBefore = countKeyframes();
    const structureBefore = modelStructureSignature();
    const originalModeId = Modes.selected.id;
    const displaySnapshot = snapshotCompiledDisplay();
    const sourceGroups = /* @__PURE__ */ new Map();
    let handRig = null;
    if (collectBounds) {
      for (const element of Outliner.elements) {
        const groupUuids = [];
        let parent = element.parent;
        while (parent && parent !== "root") {
          if (parent instanceof Group) groupUuids.push(parent.uuid);
          parent = parent.parent;
        }
        sourceGroups.set(element.uuid, groupUuids);
      }
    }
    try {
      Modes.options.animate?.select();
      for (const state of playingStates) {
        const current = Animation.all.find((item) => item.uuid === state.uuid);
        if (current) current.playing = false;
      }
      const initialTarget = Animation.all.find((item) => item.uuid === sourceAnimationUuid);
      if (!initialTarget) throw new Error(`Animation ${sourceAnimationUuid} is no longer available.`);
      initialTarget.select();
      if (captureHands) {
        handRig = resolveProjectHandRig();
        if (!handRig) throw new Error(tr("dap.hand.rig_missing"));
        assertNoHandScaleKeyframes(initialTarget, handRig);
      }
      initialTarget.playing = true;
      for (let frame2 = 0; frame2 < frameCount; frame2++) {
        const targetAnimation = Animation.all.find((item) => item.uuid === sourceAnimationUuid);
        if (!targetAnimation) throw new Error(`Animation ${sourceAnimationUuid} disappeared during baking.`);
        if (handRig) {
          handRig = resolveProjectHandRig();
          if (!handRig) throw new Error(tr("dap.hand.rig_missing"));
          Canvas.updateAll();
        }
        Timeline.setTime(frame2 / fps);
        Animator.preview();
        const currentHands = handRig ? readHandMatrices(handRig) : null;
        const hands = currentHands ?? void 0;
        const token = Undo.initEdit({
          elements: Outliner.elements.slice(),
          groups: Group.all.slice(),
          outliner: true,
          // Required: Group.resolve() deletes groups whose animators own the keyframes.
          animations: Animation.all.slice()
        });
        try {
          restrictExportToRoot(rootGroupUuid);
          if (handRig) {
            for (const group of [handRig.left, handRig.right]) {
              group.forEachChild?.((node) => {
                node.export = false;
              });
            }
          }
          const animatableElements = Outliner.elements.filter(
            (element) => element.constructor.animator
          );
          for (const node of [...Group.all, ...animatableElements]) {
            applyAnimatedOffsets(node, targetAnimation);
          }
          flattenHierarchy();
          const compiledSources = collectBounds ? Outliner.elements.filter((element) => element.export !== false).map((element) => ({
            elementUuid: element.uuid,
            groupUuids: sourceGroups.get(element.uuid) ?? []
          })) : [];
          const compiled = JSON.parse(
            resolveJavaBlockCodec().compile({ prevent_dialog: true })
          );
          const model = applyCompiledDisplaySnapshot(compiled, displaySnapshot);
          frames.push({ frame: frame2, model, hands });
          if (collectBounds) {
            outOfBounds.push(...collectOutOfBounds(frame2, model, compiledSources));
          }
        } finally {
          safelyCancelBakeEdit(token);
          if (modelStructureSignature() !== structureBefore) {
            throw new Error("Blockbench did not restore the model hierarchy after checking a frame.");
          }
        }
        yield { frame: frame2 + 1, total: frameCount };
      }
    } finally {
      for (const item of Animation.all) item.selected = false;
      const originalAnimation = originalAnimationUuid ? Animation.all.find((item) => item.uuid === originalAnimationUuid) ?? null : null;
      Animation.selected = originalAnimation;
      if (originalAnimation) originalAnimation.selected = true;
      for (const state of playingStates) {
        const current = Animation.all.find((item) => item.uuid === state.uuid);
        if (current) current.playing = state.playing;
      }
      Modes.options[originalModeId]?.select();
      Timeline.setTime(originalTime);
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
      if (modelStructureSignature() !== structureBefore) {
        console.error("Bake rollback incomplete: model hierarchy changed during baking");
      }
    }
    return { frames, outOfBounds };
  }
  async function bakeFramesAsync(animation, frameCount, fps, control, onFrame, rootGroupUuid, collectBounds = true, captureHands = false) {
    const generator = bakeFrameSteps(animation, frameCount, fps, rootGroupUuid, collectBounds, captureHands);
    let completed = false;
    try {
      while (true) {
        assertBoundsTaskActive(control);
        const step = generator.next();
        if (step.done) {
          completed = true;
          return step.value;
        }
        onFrame?.(step.value.frame, step.value.total);
        await yieldBoundsTask();
      }
    } finally {
      if (!completed) generator.return({ frames: [], outOfBounds: [] });
    }
  }

  // src/isolated-project.ts
  function cloneProjectModel() {
    const compiled = Codecs.project.compile({ raw: true, absolute_paths: true, editor_state: false });
    return JSON.parse(JSON.stringify(compiled));
  }
  function captureSourceState() {
    if (!Project) throw new Error("No active Blockbench project.");
    return {
      project: Project,
      projectUuid: String(Project.uuid),
      mode: Modes.selected.id,
      timelineTime: Timeline.time,
      animationUuid: Animation.selected?.uuid ?? null,
      playing: Animation.all.map((animation) => ({ uuid: animation.uuid, playing: animation.playing })),
      saved: Project.saved
    };
  }
  function restoreSourceState(state) {
    if (!ModelProject.all.includes(state.project)) {
      throw new Error("The source Blockbench project was closed during isolated checking.");
    }
    state.project.select();
    if (Project?.uuid !== state.projectUuid) {
      throw new Error("Blockbench did not restore the source project after isolated checking.");
    }
    Modes.options[state.mode]?.select();
    for (const animation of Animation.all) animation.selected = false;
    Animation.selected = state.animationUuid ? Animation.all.find((animation) => animation.uuid === state.animationUuid) ?? null : null;
    if (Animation.selected) Animation.selected.selected = true;
    for (const item of state.playing) {
      const animation = Animation.all.find((candidate) => candidate.uuid === item.uuid);
      if (animation) animation.playing = item.playing;
    }
    Timeline.setTime(state.timelineTime);
    Animator.preview();
    Project.saved = state.saved;
  }
  async function withIsolatedProject(operation) {
    const sourceState = captureSourceState();
    const snapshot = cloneProjectModel();
    const formatId = snapshot.meta?.model_format;
    const format = (formatId ? Formats[formatId] : void 0) ?? sourceState.project.format ?? Formats.free;
    if (!format) throw new Error(`The source project format "${formatId ?? "unknown"}" is not available.`);
    const scratch = new ModelProject({ format });
    let result;
    let operationError;
    try {
      if (!scratch.select()) throw new Error("Blockbench refused to select the isolated check project.");
      Codecs.project.parse(snapshot);
      scratch.name = `[JDA Check] ${snapshot.name ?? "Project"}`;
      scratch.save_path = "";
      scratch.export_path = "";
      scratch.saved = true;
      result = await operation(scratch, sourceState);
    } catch (error) {
      operationError = error;
    } finally {
      try {
        if (ModelProject.all.includes(scratch)) await scratch.close(true);
      } catch (closeError) {
        console.error("Failed to close the isolated check project", closeError);
      }
      try {
        restoreSourceState(sourceState);
      } catch (restoreError) {
        if (!operationError) operationError = restoreError;
        else console.error("Failed to restore the source project after an isolated check", restoreError);
      }
    }
    if (operationError) throw operationError;
    return result;
  }

  // src/exact-bounds.ts
  async function runExactBoundsScan(sourceAnimations, control, keysByUuid = /* @__PURE__ */ new Map(), framesByUuid = /* @__PURE__ */ new Map(), samplingFps = 20, collectBounds = true, captureHands = false) {
    const modelFingerprint = modelBoundsFingerprint();
    const requested = sourceAnimations.map((animation) => ({
      uuid: animation.uuid,
      name: animation.name,
      frames: framesByUuid.get(animation.uuid) ?? frameCountFor(animation.length, samplingFps),
      fingerprint: animationBoundsFingerprint(animation, modelFingerprint)
    }));
    const totalFrames = requested.reduce((sum, animation) => sum + animation.frames, 0);
    let completedFrames = 0;
    return withIsolatedProject(async () => {
      const records = [];
      const sequences = [];
      for (const item of requested) {
        const animation = Animation.all.find((candidate) => candidate.uuid === item.uuid);
        if (!animation) throw new Error(`Animation "${item.name}" is missing from the isolated project.`);
        const result = await bakeFramesAsync(animation, item.frames, samplingFps, control, (frame2, frames) => {
          completedFrames++;
          control.onProgress?.({
            mode: "exact",
            animationUuid: item.uuid,
            animationName: item.name,
            animationFrame: frame2,
            animationFrames: frames,
            completedFrames,
            totalFrames
          });
        }, void 0, collectBounds, captureHands);
        records.push({
          mode: "exact",
          animationUuid: item.uuid,
          animationName: item.name,
          fingerprint: item.fingerprint,
          frames: result.frames.length,
          hits: result.outOfBounds,
          checkedAt: Date.now(),
          fps: samplingFps
        });
        sequences.push({
          sourceUuid: item.uuid,
          sourceName: item.name,
          key: keysByUuid.get(item.uuid) ?? item.name,
          frames: result.frames,
          outOfBounds: result.outOfBounds
        });
      }
      return { records, sequences };
    });
  }

  // src/math-bounds.ts
  var MIN = -16;
  var MAX = 32;
  var DEG = Math.PI / 180;
  function vector(value, fallback = [0, 0, 0]) {
    return value ? [value[0] ?? 0, value[1] ?? 0, value[2] ?? 0] : [...fallback];
  }
  function rotateZYX(point, rotation, origin) {
    let x = point[0] - origin[0];
    let y = point[1] - origin[1];
    let z = point[2] - origin[2];
    const [rx, ry, rz] = rotation.map((value) => value * DEG);
    let cosine = Math.cos(rx);
    let sine = Math.sin(rx);
    [y, z] = [y * cosine - z * sine, y * sine + z * cosine];
    cosine = Math.cos(ry);
    sine = Math.sin(ry);
    [x, z] = [x * cosine + z * sine, -x * sine + z * cosine];
    cosine = Math.cos(rz);
    sine = Math.sin(rz);
    [x, y] = [x * cosine - y * sine, x * sine + y * cosine];
    return [x + origin[0], y + origin[1], z + origin[2]];
  }
  function add(left, right) {
    return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
  }
  function groupChain(element) {
    const result = [];
    let parent = element.parent;
    while (parent && parent !== "root") {
      if (parent instanceof Group) result.push(parent);
      parent = parent.parent;
    }
    return result;
  }
  function animationOffsets(animation, group) {
    const animator = animation.getBoneAnimator(group);
    if (!animator) return { position: [0, 0, 0], rotation: [0, 0, 0] };
    const multiplier = animation.blend_weight ? Math.max(Animator.MolangParser.parse(animation.blend_weight), 0) : 1;
    const position = animator.channels.position ? animator.interpolate("position") : null;
    const rotation = animator.channels.rotation ? animator.interpolate("rotation") : null;
    return {
      position: vector(position instanceof Array ? position.map((value) => value * multiplier) : void 0),
      rotation: vector(rotation instanceof Array ? rotation.map((value) => value * multiplier) : void 0)
    };
  }
  function transformedCorners(element, animation) {
    const from = vector(element.from);
    const to = vector(element.to);
    const inflate = element.inflate ?? 0;
    const lows = [from[0] - inflate, from[1] - inflate, from[2] - inflate];
    const highs = [to[0] + inflate, to[1] + inflate, to[2] + inflate];
    const elementOrigin = vector(element.origin, from);
    const elementRotation = vector(element.rotation);
    const groups = groupChain(element);
    const offsets = new Map(groups.map((group) => [group.uuid, animationOffsets(animation, group)]));
    const corners = [];
    for (const x of [lows[0], highs[0]]) for (const y of [lows[1], highs[1]]) for (const z of [lows[2], highs[2]]) {
      let point = rotateZYX([x, y, z], elementRotation, elementOrigin);
      for (const group of groups) {
        const offset = offsets.get(group.uuid);
        point = rotateZYX(point, add(vector(group.rotation), offset.rotation), vector(group.origin));
        point = add(point, offset.position);
      }
      corners.push(point);
    }
    return corners;
  }
  function collectFrameHits(frame2, animation) {
    const hits = [];
    for (let index = 0; index < Outliner.elements.length; index++) {
      const element = Outliner.elements[index];
      if (!element.from || !element.to || element.export === false) continue;
      const corners = transformedCorners(element, animation);
      const chain = groupChain(element).map((group) => group.uuid);
      for (let axis = 0; axis < 3; axis++) {
        const values = corners.map((corner) => corner[axis]);
        const low = Math.min(...values);
        const high = Math.max(...values);
        if (low < MIN) hits.push({
          frame: frame2,
          elementIndex: index,
          elementName: element.name,
          axis: ["x", "y", "z"][axis],
          field: "from",
          value: low,
          sourceElementUuid: element.uuid,
          sourceGroupUuids: chain
        });
        if (high > MAX) hits.push({
          frame: frame2,
          elementIndex: index,
          elementName: element.name,
          axis: ["x", "y", "z"][axis],
          field: "to",
          value: high,
          sourceElementUuid: element.uuid,
          sourceGroupUuids: chain
        });
      }
    }
    return hits;
  }
  async function runQuickBoundsScan(animations, control) {
    const originalTime = Timeline.time;
    const originalMode = Modes.selected.id;
    const originalAnimationUuid = Animation.selected?.uuid;
    const originalPlaying = Animation.all.map((animation) => ({ uuid: animation.uuid, playing: animation.playing }));
    const originalSaved = Project?.saved;
    const fps = getProjectAnimationFps();
    const modelFingerprint = modelBoundsFingerprint();
    const totalFrames = animations.reduce((sum, animation) => sum + frameCountFor(animation.length, fps), 0);
    let completedFrames = 0;
    const records = [];
    try {
      Modes.options.animate?.select();
      for (const state of originalPlaying) {
        const current = Animation.all.find((item) => item.uuid === state.uuid);
        if (current) current.playing = false;
      }
      for (const requested of animations) {
        const animation = Animation.all.find((item) => item.uuid === requested.uuid);
        if (!animation) continue;
        animation.select();
        animation.playing = true;
        const frames = frameCountFor(animation.length, fps);
        const hits = [];
        for (let frame2 = 0; frame2 < frames; frame2++) {
          assertBoundsTaskActive(control);
          Timeline.setTime(frame2 / fps);
          hits.push(...collectFrameHits(frame2, animation));
          completedFrames++;
          control.onProgress?.({
            mode: "quick",
            animationUuid: animation.uuid,
            animationName: animation.name,
            animationFrame: frame2 + 1,
            animationFrames: frames,
            completedFrames,
            totalFrames
          });
          if (frame2 % 5 === 0) await yieldBoundsTask();
        }
        animation.playing = false;
        records.push({
          mode: "quick",
          animationUuid: animation.uuid,
          animationName: animation.name,
          fingerprint: animationBoundsFingerprint(animation, modelFingerprint),
          frames,
          hits,
          checkedAt: Date.now(),
          fps
        });
      }
      return records;
    } finally {
      for (const item of Animation.all) item.selected = false;
      Animation.selected = originalAnimationUuid ? Animation.all.find((item) => item.uuid === originalAnimationUuid) ?? null : null;
      if (Animation.selected) Animation.selected.selected = true;
      for (const state of originalPlaying) {
        const current = Animation.all.find((item) => item.uuid === state.uuid);
        if (current) current.playing = state.playing;
      }
      Modes.options[originalMode]?.select();
      Timeline.setTime(originalTime);
      Animator.preview();
      if (Project && originalSaved !== void 0) Project.saved = originalSaved;
    }
  }

  // src/undo-idle.ts
  function waitForUndoIdle(options = {}) {
    const initialDelayMs = options.initialDelayMs ?? 50;
    const pollIntervalMs = options.pollIntervalMs ?? 50;
    const timeoutMs = options.timeoutMs ?? 5e3;
    const deadline = Date.now() + timeoutMs;
    return new Promise((resolve) => {
      const check = () => {
        if (!Undo.current_save) {
          resolve(true);
          return;
        }
        if (Date.now() >= deadline) {
          resolve(false);
          return;
        }
        setTimeout(check, pollIntervalMs);
      };
      setTimeout(check, initialDelayMs);
    });
  }

  // src/bounds-check-panel.ts
  var panel3 = null;
  var content = null;
  var checkedMode = "quick";
  var boundsCheckBusy = false;
  var recheckButton = null;
  var activeCancellation = null;
  var progressModeLabelOverride = null;
  var exportBakeOnly = false;
  function captureBoundsSourceState() {
    if (!Project) throw new Error("No active Blockbench project.");
    return {
      project: Project,
      mode: Modes.selected.id,
      timelineTime: Timeline.time,
      animationUuid: Animation.selected?.uuid ?? null,
      playing: Animation.all.map((animation) => ({ uuid: animation.uuid, playing: animation.playing })),
      saved: Project.saved
    };
  }
  function restoreBoundsSourceState(state, restoreMode) {
    if (Project !== state.project && ModelProject.all.includes(state.project)) {
      state.project.select();
    }
    if (!Project) throw new Error("Blockbench did not restore the source project after range checking.");
    if (restoreMode) Modes.options[state.mode]?.select();
    for (const animation of Animation.all) animation.selected = false;
    Animation.selected = state.animationUuid ? Animation.all.find((animation) => animation.uuid === state.animationUuid) ?? null : null;
    if (Animation.selected) Animation.selected.selected = true;
    for (const item of state.playing) {
      const animation = Animation.all.find((candidate) => candidate.uuid === item.uuid);
      if (animation) animation.playing = item.playing;
    }
    Timeline.setTime(state.timelineTime);
    Animator.preview();
    Project.saved = state.saved;
  }
  function modeLabel(mode) {
    return tr(mode === "quick" ? "dap.bounds.mode.quick" : "dap.bounds.mode.exact");
  }
  function highlightProblemElements(hits) {
    const uuids = new Set(hits.map((hit) => hit.sourceElementUuid).filter(Boolean));
    const elements = Outliner.elements.filter((element) => uuids.has(element.uuid));
    if (!elements.length) return;
    unselectAllElements();
    for (const element of elements) {
      element.selected = true;
      Outliner.selected.push(element);
    }
    updateSelection();
  }
  function openNearestKeyframe(animation, hits, time) {
    const groupUuids = [...new Set(hits.flatMap((hit) => hit.sourceGroupUuids ?? []))];
    for (const groupUuid of groupUuids) {
      const animator = animation.animators?.[groupUuid];
      if (!animator) continue;
      const nearest = [...animator.keyframes ?? []].sort((left, right) => {
        const distance = Math.abs(left.time - time) - Math.abs(right.time - time);
        if (Math.abs(distance) > 1e-6) return distance;
        if (left.channel === right.channel) return 0;
        return left.channel === "position" ? -1 : 1;
      })[0];
      if (!nearest) continue;
      animator.select();
      nearest.select();
      return;
    }
  }
  function locateFrame(animation, frame2, hits) {
    Timeline.pause();
    animation.select();
    const time = frame2 / getProjectAnimationFps();
    Timeline.setTime(time);
    Animator.preview();
    highlightProblemElements(hits);
    openNearestKeyframe(animation, hits, time);
    Blockbench.showQuickMessage(tr("dap.bounds.located", { animation: animation.name, frame: frame2 }), 2200);
  }
  function passedMessage(animations, frames, mode) {
    Blockbench.showMessageBox({
      title: tr("dap.bounds.passed_title"),
      message: `<div style="margin-bottom:14px"><div style="font-size:17px;font-weight:700;color:#59c36a">${escapeHtml(tr("dap.bounds.passed_heading"))}</div><div style="margin-top:3px">${escapeHtml(tr("dap.bounds.passed_message", { frames, fps: getProjectAnimationFps() }))}</div></div><div style="padding:9px 11px;border-left:3px solid #59c36a;background:var(--color-back)">${escapeHtml(modeLabel(mode))} \xB7 ${escapeHtml(tr("dap.bounds.passed_animations", { animations }))}</div>`,
      icon: "check_circle"
    });
  }
  var progressView = null;
  function renderProgress(progress) {
    if (!content) return;
    if (!progressView || progressView.shell.parentElement !== content) {
      content.innerHTML = "";
      progressView = buildProgressView();
      content.appendChild(progressView.shell);
    }
    const view = progressView;
    view.title.innerText = progress ? tr("dap.bounds.progress_title", { mode: progressModeLabelOverride ?? modeLabel(progress.mode), animation: progress.animationName }) : tr("dap.bounds.progress_preparing");
    view.detail.innerText = progress ? tr("dap.bounds.progress_frames", {
      frame: progress.animationFrame,
      frames: progress.animationFrames,
      completed: progress.completedFrames,
      total: progress.totalFrames
    }) : "";
    view.bar.style.width = progress && progress.totalFrames ? `${Math.min(100, progress.completedFrames / progress.totalFrames * 100).toFixed(1)}%` : "0%";
  }
  function buildProgressView() {
    const shell = el("div");
    shell.style.padding = "14px 10px";
    const title = el("div");
    title.style.fontWeight = "700";
    const detail = el("div", "");
    detail.style.marginTop = "7px";
    detail.style.color = "var(--color-subtle_text)";
    const track = el("div");
    track.style.height = "8px";
    track.style.marginTop = "12px";
    track.style.background = "var(--color-back)";
    const bar = el("div");
    bar.style.height = "100%";
    bar.style.width = "0%";
    bar.style.background = "var(--color-accent)";
    track.appendChild(bar);
    const cancel = el("button", tr("dap.bounds.cancel"));
    cancel.style.width = "100%";
    cancel.style.marginTop = "14px";
    cancel.style.borderRadius = "0";
    cancel.onclick = () => {
      if (activeCancellation) activeCancellation.cancelled = true;
      cancel.innerText = tr("dap.bounds.cancelling");
      cancel.disabled = true;
    };
    shell.appendChild(title);
    shell.appendChild(detail);
    shell.appendChild(track);
    shell.appendChild(cancel);
    return { shell, title, detail, bar };
  }
  function renderExportBakeComplete(animations, frames) {
    if (!content) return;
    content.innerHTML = "";
    progressView = null;
    const shell = el("div");
    shell.style.padding = "14px 10px";
    shell.style.borderLeft = "3px solid #59c36a";
    shell.style.background = "var(--color-back)";
    const title = el("div", tr("dap.bounds.export_bake_complete"));
    title.style.fontWeight = "700";
    title.style.color = "#59c36a";
    const detail = el("div", tr("dap.bounds.export_bake_complete_detail", { animations, frames }));
    detail.style.marginTop = "7px";
    detail.style.color = "var(--color-subtle_text)";
    shell.appendChild(title);
    shell.appendChild(detail);
    content.appendChild(shell);
  }
  function renderResults(results) {
    if (!content) return;
    content.innerHTML = "";
    progressView = null;
    const problemFrames = results.reduce((sum, result) => sum + new Set(result.hits.map((hit) => hit.frame)).size, 0);
    const mode = results[0]?.mode ?? checkedMode;
    const cachedCount = results.filter((result) => result.cached).length;
    const header = el("div");
    header.style.padding = "9px 10px";
    header.style.borderLeft = `3px solid ${problemFrames ? "#e25d68" : "#59c36a"}`;
    header.style.background = "var(--color-back)";
    const title = el("div", `${modeLabel(mode)} \xB7 ${tr("dap.bounds.panel_checked_animations", { animations: results.length })}`);
    title.style.fontWeight = "700";
    title.style.fontSize = "14px";
    const summary = el("div", problemFrames ? tr("dap.bounds.panel_failed", { frames: problemFrames }) : tr("dap.bounds.panel_all_passed"));
    summary.style.color = problemFrames ? "#e25d68" : "#59c36a";
    summary.style.marginTop = "3px";
    header.appendChild(title);
    header.appendChild(summary);
    if (cachedCount) {
      const reused = el("div", tr("dap.bounds.cache_reused", { animations: cachedCount }));
      reused.style.fontSize = "inherit";
      reused.style.marginTop = "3px";
      reused.style.color = "var(--color-subtle_text)";
      header.appendChild(reused);
    }
    content.appendChild(header);
    if (problemFrames) {
      const hint = el("div", tr("dap.bounds.panel_hint"));
      hint.style.color = "var(--color-subtle_text)";
      hint.style.fontSize = "inherit";
      hint.style.padding = "8px 2px 6px";
      content.appendChild(hint);
    }
    for (const result of results) {
      const animationHeader = el("div");
      animationHeader.style.display = "flex";
      animationHeader.style.justifyContent = "space-between";
      animationHeader.style.alignItems = "center";
      animationHeader.style.gap = "8px";
      animationHeader.style.padding = "8px 3px 5px";
      animationHeader.style.borderBottom = "1px solid var(--color-border)";
      const animationName = el("b", result.animation.name);
      const animationStatus = el("span", result.hits.length ? tr("dap.bounds.animation_failed", { frames: new Set(result.hits.map((hit) => hit.frame)).size }) : tr("dap.bounds.animation_passed", { frames: result.frames }));
      animationStatus.style.color = result.hits.length ? "#e25d68" : "#59c36a";
      animationStatus.style.fontSize = "inherit";
      animationHeader.appendChild(animationName);
      animationHeader.appendChild(animationStatus);
      content.appendChild(animationHeader);
      for (const item of summarizeOutOfBoundsByFrame(result.hits)) {
        const row = el("div");
        row.style.display = "block";
        row.style.width = "100%";
        row.style.textAlign = "left";
        row.style.padding = "8px 9px";
        row.style.margin = "0 0 5px";
        row.style.borderRadius = "0";
        row.style.borderLeft = "3px solid #e25d68";
        row.style.background = "var(--color-back)";
        row.style.boxSizing = "border-box";
        row.style.cursor = "pointer";
        row.style.lineHeight = "1.35";
        row.style.minHeight = "58px";
        row.innerHTML = `<b style="color:#e25d68">${escapeHtml(tr("dap.export.locate_frame", { frame: item.frame }))}</b><div style="font-size:inherit;color:var(--color-subtle_text);margin-top:3px;white-space:normal">${escapeHtml(item.description)}</div>`;
        const frameHits = result.hits.filter((hit) => hit.frame === item.frame);
        row.onclick = () => locateFrame(result.animation, item.frame, frameHits);
        content.appendChild(row);
      }
    }
  }
  function resolveBoundsCheckAnimations(preferredAnimations) {
    const source = preferredAnimations?.length ? preferredAnimations : Animation.all;
    const seen = /* @__PURE__ */ new Set();
    return source.filter((animation) => {
      if (seen.has(animation.uuid)) return false;
      seen.add(animation.uuid);
      return true;
    });
  }
  function setBoundsCheckBusy(busy) {
    boundsCheckBusy = busy;
    if (recheckButton) recheckButton.disabled = busy;
    if (!busy) {
      Blockbench.setProgress(0);
      Blockbench.setStatusBarText();
    }
  }
  function recordsToResults(animations, records, mode, cached) {
    return animations.map((animation) => {
      const record = records.find((candidate) => candidate.animationUuid === animation.uuid);
      if (!record) throw new Error(`No ${mode} range result was produced for "${animation.name}".`);
      return { animation, frames: record.frames, hits: record.hits, mode, cached: cached.has(animation.uuid) };
    });
  }
  function createBoundsProgressControl() {
    return {
      isCancelled: () => activeCancellation?.cancelled === true,
      onProgress: (progress) => {
        renderProgress(progress);
        Blockbench.setProgress(progress.totalFrames ? progress.completedFrames / progress.totalFrames : 0);
        Blockbench.setStatusBarText(tr("dap.bounds.progress_status", {
          mode: progressModeLabelOverride ?? modeLabel(progress.mode),
          animation: progress.animationName,
          frame: progress.animationFrame,
          frames: progress.animationFrames
        }));
      }
    };
  }
  async function performBoundsCheck(animationUuids, mode, project, sourceState) {
    try {
      const animations = animationUuids.map((uuid) => Animation.all.find((animation) => animation.uuid === uuid)).filter((animation) => Boolean(animation));
      if (!animations.length) {
        Blockbench.showQuickMessage(tr("dap.bounds.no_animation"), 2e3);
        return;
      }
      checkedMode = mode;
      openBoundsCheckPanel();
      const modelFingerprint = modelBoundsFingerprint();
      const cached = /* @__PURE__ */ new Map();
      for (const animation of animations) {
        const record = validBoundsDetection(project, animation, mode, modelFingerprint);
        if (record) cached.set(animation.uuid, record);
      }
      const pending = animations.filter((animation) => !cached.has(animation.uuid));
      if (!pending.length) {
        renderResults(recordsToResults(animations, [...cached.values()], mode, new Set(cached.keys())));
        Blockbench.showQuickMessage(tr("dap.bounds.cache_all_reused"), 2200);
        return;
      }
      activeCancellation = { cancelled: false };
      renderProgress();
      const control = createBoundsProgressControl();
      const scanned = mode === "quick" ? await runQuickBoundsScan(pending, control) : (await runExactBoundsScan(pending, control)).records;
      for (const record of scanned) rememberBoundsDetection(project, record);
      const results = recordsToResults(animations, [...cached.values(), ...scanned], mode, new Set(cached.keys()));
      renderResults(results);
      if (results.every((result) => !result.hits.length)) {
        passedMessage(animations.length, results.reduce((sum, result) => sum + result.frames, 0), mode);
      }
    } finally {
      restoreBoundsSourceState(sourceState, false);
    }
  }
  function chooseBoundsMode(animations) {
    Blockbench.showMessageBox({
      title: tr("dap.bounds.choose_title"),
      message: tr("dap.bounds.choose_message"),
      icon: "settings_overscan",
      buttons: [tr("dap.bounds.choose_cancel"), tr("dap.bounds.mode.quick"), tr("dap.bounds.mode.exact")],
      confirmIndex: 2,
      cancelIndex: 0
    }, (button) => {
      if (button === 1) runBoundsCheck(animations, "quick");
      if (button === 2) runBoundsCheck(animations, "exact");
    });
  }
  function runBoundsCheck(preferredAnimations, mode) {
    const animations = resolveBoundsCheckAnimations(preferredAnimations);
    if (!animations.length) {
      Blockbench.showQuickMessage(tr("dap.bounds.no_animation"), 2e3);
      return;
    }
    if (!mode) {
      chooseBoundsMode(animations);
      return;
    }
    if (boundsCheckBusy) {
      Blockbench.showQuickMessage(tr("dap.bounds.check_in_progress"), 1800);
      return;
    }
    setBoundsCheckBusy(true);
    const sourceState = captureBoundsSourceState();
    const animationUuids = animations.map((animation) => animation.uuid);
    const project = Project;
    const projectUuid = Project?.uuid;
    document.activeElement?.blur();
    void waitForUndoIdle().then(async (idle) => {
      if (!idle || Project?.uuid !== projectUuid) {
        if (!idle) Blockbench.showMessageBox({
          title: tr("dap.bounds.edit_in_progress_title"),
          message: tr("dap.bounds.edit_in_progress_message"),
          icon: "error"
        });
        return;
      }
      await performBoundsCheck(animationUuids, mode, project, sourceState);
    }).catch((error) => {
      if (error instanceof BoundsTaskCancelledError) {
        Blockbench.showQuickMessage(tr("dap.bounds.cancelled"), 2200);
        return;
      }
      Blockbench.showMessageBox({
        title: tr("dap.bounds.check_failed_title"),
        message: escapeHtml(error instanceof Error ? error.message : String(error)),
        icon: "error"
      });
    }).finally(() => {
      activeCancellation = null;
      setBoundsCheckBusy(false);
    });
  }
  async function runExactBoundsForExport(animations, keysByUuid, framesByUuid, samplingFps, rememberResults, showResults, captureHands = false) {
    if (boundsCheckBusy) throw new Error(tr("dap.bounds.check_in_progress"));
    const sourceProject = Project;
    const sourceState = captureBoundsSourceState();
    setBoundsCheckBusy(true);
    activeCancellation = { cancelled: false };
    progressModeLabelOverride = rememberResults || showResults ? null : tr("dap.bounds.mode.export_bake");
    const bakeOnly = !rememberResults && !showResults;
    exportBakeOnly = bakeOnly;
    try {
      openBoundsCheckPanel();
      checkedMode = "exact";
      renderProgress();
      const control = createBoundsProgressControl();
      const collectBounds = rememberResults || showResults;
      const result = await runExactBoundsScan(animations, control, keysByUuid, framesByUuid, samplingFps, collectBounds, captureHands);
      if (rememberResults) {
        for (const record of result.records) rememberBoundsDetection(sourceProject, record);
      }
      if (showResults) {
        const restoredAnimations = result.records.map((record) => Animation.all.find((animation) => animation.uuid === record.animationUuid)).filter((animation) => Boolean(animation));
        renderResults(recordsToResults(restoredAnimations, result.records, "exact", /* @__PURE__ */ new Set()));
      } else if (bakeOnly) {
        renderExportBakeComplete(
          result.sequences.length,
          result.sequences.reduce((sum, sequence) => sum + sequence.frames.length, 0)
        );
      }
      return result;
    } catch (error) {
      if (error instanceof BoundsTaskCancelledError) {
        Blockbench.showQuickMessage(tr("dap.bounds.cancelled"), 2200);
        return null;
      }
      throw error;
    } finally {
      activeCancellation = null;
      progressModeLabelOverride = null;
      exportBakeOnly = false;
      if (recheckButton) recheckButton.style.display = bakeOnly ? "none" : "";
      setBoundsCheckBusy(false);
      restoreBoundsSourceState(sourceState, true);
    }
  }
  function openBoundsCheckPanel() {
    Modes.options.animate?.select();
    if (panel3) {
      if (recheckButton) recheckButton.style.display = exportBakeOnly ? "none" : "";
      panel3.update();
      return;
    }
    const shell = el("div");
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.height = "100%";
    shell.style.minHeight = "0";
    shell.style.minWidth = "0";
    const results = el("div");
    results.style.flex = "1 1 auto";
    results.style.minHeight = "0";
    results.style.overflowY = "auto";
    results.style.overflowX = "hidden";
    results.style.padding = "4px 6px 8px 4px";
    results.style.boxSizing = "border-box";
    content = results;
    const footer = el("div");
    footer.style.flex = "0 0 auto";
    footer.style.padding = "7px 6px 5px 4px";
    footer.style.borderTop = "1px solid var(--color-border)";
    footer.style.background = "var(--color-ui)";
    const recheck = el("button", tr("dap.bounds.recheck"));
    recheckButton = recheck;
    recheck.style.display = exportBakeOnly ? "none" : "";
    recheck.style.width = "100%";
    recheck.style.borderRadius = "0";
    recheck.onclick = () => {
      runBoundsCheck(void 0, checkedMode);
    };
    footer.appendChild(recheck);
    shell.appendChild(results);
    shell.appendChild(footer);
    panel3 = new Panel("display_anim_preview_bounds", {
      name: tr("dap.bounds.panel_title"),
      icon: "settings_overscan",
      growable: true,
      resizable: true,
      condition: { modes: ["animate"] },
      default_position: { slot: "left_bar", height: 420, width: 350 }
    });
    panel3.node.style.minHeight = "140px";
    panel3.node.appendChild(shell);
  }
  function disposeBoundsCheckPanel() {
    if (activeCancellation) activeCancellation.cancelled = true;
    activeCancellation = null;
    progressModeLabelOverride = null;
    progressView = null;
    exportBakeOnly = false;
    panel3?.delete();
    panel3 = null;
    content = null;
    recheckButton = null;
    boundsCheckBusy = false;
  }

  // src/animation-export-plan.ts
  function animationKeyFromName(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "_").replace(/^_+|_+$/g, "");
  }
  function isValidAnimationKey(key) {
    return Boolean(key) && key !== "." && key !== ".." && !isReservedAnimationKey(key) && /^[a-z0-9_.-]+$/.test(key);
  }
  function findAnimationKeyConflicts(animations) {
    const groups = /* @__PURE__ */ new Map();
    for (const animation of animations) {
      const key = animationKeyFromName(animation.name);
      const names = groups.get(key) ?? [];
      names.push(animation.name);
      groups.set(key, names);
    }
    return [...groups.entries()].filter(([key, names]) => !isValidAnimationKey(key) || names.length > 1).map(([key, animationNames]) => ({ key, animationNames }));
  }
  function createExportAnimationSpecs(animations, fps) {
    return animations.map((animation) => ({
      animation,
      sourceUuid: animation.uuid,
      sourceName: animation.name,
      key: animationKeyFromName(animation.name),
      sourceFps: animation.snapping || fps,
      frameCount: frameCountFor(animation.length, fps)
    }));
  }

  // src/datapack.ts
  var DATA_PACK_FORMAT = [107, 1];
  function json(value) {
    return `${JSON.stringify(value, null, 2)}
`;
  }
  function lines(...commands) {
    return `${commands.join("\n")}
`;
  }
  function prefix(options) {
    return JSON.stringify({ text: `[${options.packName}] `, color: "gold" });
  }
  function tellraw(options, message, color, target = "@s") {
    return `tellraw ${target} [${prefix(options)},{"text":${JSON.stringify(message)},"color":"${color}"}]`;
  }
  function dynamicErrorTellraw(options, translationKey, placeholder, storagePath, runtimeStorage) {
    const marker = "__JSB_DYNAMIC_ARGUMENT__";
    const translated = tr(translationKey, { [placeholder]: marker });
    const parts = translated.includes(marker) ? translated.split(marker) : [`${translated}: `, ""];
    const components = [
      { text: `[${options.packName}] `, color: "gold" }
    ];
    parts.forEach((part, index) => {
      if (part) components.push({ text: part, color: "red" });
      if (index < parts.length - 1) {
        components.push({ nbt: storagePath, storage: runtimeStorage, color: "yellow" });
      }
    });
    return `tellraw @s ${JSON.stringify(components)}`;
  }
  function customNameComponent(name) {
    const component = JSON.stringify({ text: name, color: "gold", italic: false });
    return `minecraft:custom_name=${component}`;
  }
  function customModelData(animationKey, frame2) {
    return `{strings:[${JSON.stringify(animationKey)}],floats:[${frame2.toFixed(1)}]}`;
  }
  function itemAnimationState(projectName, animationKey, frame2, mode, max, phase) {
    const state = itemAnimationStateValue(projectName, animationKey, frame2, mode, max, phase);
    return `{jsb:{project:${JSON.stringify(state.jsb.project)},animation:${JSON.stringify(state.jsb.animation)},frame:${state.jsb.frame},mode:${state.jsb.mode},max:${state.jsb.max},phase:${state.jsb.phase}}}`;
  }
  function itemAnimationStateValue(projectName, animationKey, frame2, mode, max, phase) {
    return { jsb: { project: projectName, animation: animationKey, frame: frame2, mode, max, phase } };
  }
  function frameModifier(frameObjective, animationKey) {
    const modifier = {
      function: "minecraft:set_custom_model_data",
      floats: {
        values: [{ type: "minecraft:score", target: "this", score: frameObjective }],
        mode: "replace_all"
      }
    };
    if (animationKey !== void 0) {
      modifier.strings = { values: [animationKey], mode: "replace_all" };
    }
    return modifier;
  }
  function fixedFrameModifier(animationKey, frame2) {
    return {
      function: "minecraft:set_custom_model_data",
      strings: { values: [animationKey], mode: "replace_all" },
      floats: { values: [frame2], mode: "replace_all" }
    };
  }
  function validateAnimations(options) {
    if (!options.animations.length) throw new Error("At least one animation is required");
    const animations = /* @__PURE__ */ new Map();
    for (const animation of options.animations) {
      if (!isValidAnimationKey(animation.key)) {
        throw new Error(`Unsafe animation key: ${JSON.stringify(animation.key)}`);
      }
      if (!Number.isInteger(animation.frameCount) || animation.frameCount < 1) {
        throw new Error(`Animation ${JSON.stringify(animation.key)} has no frames`);
      }
      if (animations.has(animation.key)) {
        throw new Error(`Duplicate animation key: ${JSON.stringify(animation.key)}`);
      }
      animations.set(animation.key, animation);
    }
    if (!animations.has(options.defaultAnimationKey)) {
      throw new Error(`Default animation key was not exported: ${options.defaultAnimationKey}`);
    }
    return animations;
  }
  function buildDatapack(options) {
    if (!Number.isInteger(options.playbackFps) || options.playbackFps < 1 || options.playbackFps > MAX_EXPORT_FPS) {
      throw new Error(`Playback FPS must be an integer from 1 to ${MAX_EXPORT_FPS}: ${options.playbackFps}`);
    }
    const animations = validateAnimations(options);
    const ns = EXPORT_NAMESPACE;
    const root = options.projectName;
    const id = (path) => `${ns}:${root}/${path}`;
    const runtimeStorage = `${ns}:${root}/runtime`;
    const itemModelId = `${ns}:${root}`;
    const heldItem = `*[minecraft:item_model="${itemModelId}"]`;
    const ifHeld = `execute if items entity @s weapon.mainhand ${heldItem} run`;
    const unlessHeld = `execute unless items entity @s weapon.mainhand ${heldItem} run`;
    const frameScore = options.frameObjective;
    const modeScore = options.modeObjective;
    const maxFrameScore = options.maxFrameObjective;
    const phaseScore = phaseObjectiveFor(frameScore);
    const playbackFps = options.playbackFps;
    const tag = options.playingTag;
    const tips = options.debugEnabled === true;
    const holdItemLines = tips ? [`${unlessHeld} ${tellraw(options, tr("dap.datapack.hold_item"), "red")}`] : [];
    const defaultAnimation = animations.get(options.defaultAnimationKey);
    const defaultLastFrame = defaultAnimation.frameCount - 1;
    const inventorySlots = [
      ...Array.from({ length: 9 }, (_, slot) => `hotbar.${slot}`),
      ...Array.from({ length: 27 }, (_, slot) => `inventory.${slot}`),
      "weapon.offhand"
    ];
    const onceItem = `*[minecraft:item_model="${itemModelId}",minecraft:custom_data~{jsb:{project:${JSON.stringify(root)},mode:2}}]`;
    const files = [];
    const fn = (path, content2) => {
      files.push({ path: `data/${ns}/function/${root}/${path}.mcfunction`, content: content2 });
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
        `scoreboard objectives add ${maxFrameScore} dummy`,
        `scoreboard objectives add ${phaseScore} dummy`,
        ...options.debugEnabled ? [tellraw(options, tr("dap.datapack.loaded", { namespace: `${ns}:${root}` }), "green", "@a")] : []
      )
    );
    fn(
      "tick",
      lines(
        `execute as @a if items entity @s weapon.mainhand ${heldItem} run function ${id("_internal/sync_held")}`,
        `execute as @a[tag=${tag}] unless items entity @s weapon.mainhand ${heldItem} run function ${id("_internal/leave_held")}`
      )
    );
    fn(
      "_internal/load_held_state",
      lines(
        `scoreboard players set @s ${frameScore} 0`,
        `scoreboard players set @s ${modeScore} 0`,
        `scoreboard players set @s ${maxFrameScore} ${defaultLastFrame}`,
        `scoreboard players set @s ${phaseScore} 0`,
        `data modify storage ${runtimeStorage} held set value ${itemAnimationState(root, defaultAnimation.key, 0, 0, defaultLastFrame, 0).slice(5, -1)}`,
        `execute store result score @s ${frameScore} run data get entity @s SelectedItem.components."minecraft:custom_data".jsb.frame 1`,
        `execute store result score @s ${modeScore} run data get entity @s SelectedItem.components."minecraft:custom_data".jsb.mode 1`,
        `execute store result score @s ${maxFrameScore} run data get entity @s SelectedItem.components."minecraft:custom_data".jsb.max 1`,
        `execute store result score @s ${phaseScore} run data get entity @s SelectedItem.components."minecraft:custom_data".jsb.phase 1`,
        ...Array.from(
          animations.values(),
          (animation) => `execute if items entity @s weapon.mainhand *[minecraft:item_model="${itemModelId}",minecraft:custom_data~{jsb:{project:${JSON.stringify(root)},animation:${JSON.stringify(animation.key)}}}] run data modify storage ${runtimeStorage} held.animation set value ${JSON.stringify(animation.key)}`
        )
      )
    );
    fn(
      "_internal/save_scores_to_storage",
      lines(
        `execute store result storage ${runtimeStorage} held.frame int 1 run scoreboard players get @s ${frameScore}`,
        `execute store result storage ${runtimeStorage} held.mode int 1 run scoreboard players get @s ${modeScore}`,
        `execute store result storage ${runtimeStorage} held.max int 1 run scoreboard players get @s ${maxFrameScore}`,
        `execute store result storage ${runtimeStorage} held.phase int 1 run scoreboard players get @s ${phaseScore}`
      )
    );
    fn(
      "_internal/apply_animation_from_storage",
      lines(...Array.from(
        animations.values(),
        (animation) => `execute if data storage ${runtimeStorage} {held:{animation:${JSON.stringify(animation.key)}}} run item modify entity @s weapon.mainhand ${id(`set_frame/${animation.key}`)}`
      ))
    );
    fn(
      "_internal/save_held_state",
      lines(
        `function ${id("_internal/save_scores_to_storage")}`,
        `item modify entity @s weapon.mainhand ${id("state/copy_from_storage")}`,
        `function ${id("_internal/apply_animation_from_storage")}`
      )
    );
    fn(
      "_internal/reset_inactive_once",
      lines(...inventorySlots.map(
        (slot) => `execute if items entity @s ${slot} ${onceItem} run item modify entity @s ${slot} ${id("state/reset_default")}`
      ))
    );
    fn(
      "_internal/sync_held",
      lines(
        `function ${id("_internal/load_held_state")}`,
        `execute if entity @s[tag=${tag}] run function ${id("_internal/reset_inactive_once")}`,
        `function ${id("_internal/save_held_state")}`,
        `execute if score @s ${modeScore} matches 1..2 run tag @s add ${tag}`,
        `execute unless score @s ${modeScore} matches 1..2 run tag @s remove ${tag}`,
        `execute if score @s ${modeScore} matches 1..2 run function ${id("_internal/tick_player")}`
      )
    );
    fn(
      "_internal/leave_held",
      lines(
        `function ${id("_internal/reset_inactive_once")}`,
        `function ${id("_internal/cancel")}`
      )
    );
    fn(
      "_internal/tick_player",
      lines(
        `scoreboard players add @s ${phaseScore} ${playbackFps}`,
        `execute if score @s ${phaseScore} matches 20.. if score @s ${modeScore} matches 2 if score @s ${frameScore} = @s ${maxFrameScore} run function ${id("_internal/reset_default")}`,
        `execute if entity @s[tag=${tag}] if score @s ${phaseScore} matches 20.. run scoreboard players add @s ${frameScore} 1`,
        `execute if entity @s[tag=${tag}] if score @s ${phaseScore} matches 20.. run scoreboard players remove @s ${phaseScore} 20`,
        `execute if entity @s[tag=${tag}] if score @s ${maxFrameScore} matches 0 if score @s ${frameScore} > @s ${maxFrameScore} run scoreboard players set @s ${frameScore} 0`,
        `execute if entity @s[tag=${tag}] if score @s ${maxFrameScore} matches 1.. if score @s ${frameScore} > @s ${maxFrameScore} run scoreboard players set @s ${frameScore} 1`,
        `execute if entity @s[tag=${tag}] run function ${id("_internal/save_held_state")}`
      )
    );
    fn(
      "_internal/cancel",
      lines(
        `tag @s remove ${tag}`,
        `scoreboard players set @s ${frameScore} 0`,
        `scoreboard players set @s ${modeScore} 0`,
        `scoreboard players set @s ${maxFrameScore} ${defaultLastFrame}`,
        `scoreboard players set @s ${phaseScore} 0`
      )
    );
    fn(
      "_internal/reset_default",
      lines(
        `function ${id("_internal/cancel")}`,
        `${ifHeld} item modify entity @s weapon.mainhand ${id("state/reset_default")}`
      )
    );
    fn(
      "give",
      lines(
        options.handRenderingEnabled ? `loot give @s loot ${id("give")}` : `give @s ${options.baseItem}[minecraft:item_model="${itemModelId}",minecraft:custom_model_data=${customModelData(defaultAnimation.key, 0)},minecraft:custom_data=${itemAnimationState(root, defaultAnimation.key, 0, 0, defaultLastFrame, 0)},minecraft:max_stack_size=1,${customNameComponent(options.itemDisplayName)}]`,
        ...options.debugEnabled ? [tellraw(options, tr("dap.datapack.item_given", {
          namespace: `${ns}:${root}`,
          animation: defaultAnimation.key
        }), "green")] : []
      )
    );
    if (options.handRenderingEnabled) {
      files.push({
        path: `data/${ns}/loot_table/${root}/give.json`,
        content: json({
          type: "minecraft:command",
          pools: [{
            rolls: 1,
            entries: [{
              type: "minecraft:item",
              name: "minecraft:player_head",
              functions: [
                {
                  function: "minecraft:set_components",
                  components: {
                    "minecraft:item_model": itemModelId,
                    "minecraft:custom_model_data": { strings: [defaultAnimation.key], floats: [0] },
                    "minecraft:custom_data": itemAnimationStateValue(root, defaultAnimation.key, 0, 0, defaultLastFrame, 0),
                    "minecraft:max_stack_size": 1,
                    "minecraft:custom_name": { text: options.itemDisplayName, color: "gold", italic: false }
                  }
                },
                { function: "minecraft:fill_player_head", entity: "this" }
              ]
            }]
          }]
        })
      });
    }
    fn(
      "_internal/validate_animation",
      lines(
        `data modify storage ${runtimeStorage} request.valid_animation set value 0b`,
        ...Array.from(
          animations.values(),
          (animation) => `execute if data storage ${runtimeStorage} {request:{animation:${JSON.stringify(animation.key)}}} run data modify storage ${runtimeStorage} request.valid_animation set value 1b`
        )
      )
    );
    fn(
      "_internal/validate_mode",
      lines(
        `data modify storage ${runtimeStorage} request.valid_mode set value 0b`,
        `execute if data storage ${runtimeStorage} {request:{mode:"loop"}} run data modify storage ${runtimeStorage} request.valid_mode set value 1b`,
        `execute if data storage ${runtimeStorage} {request:{mode:"once"}} run data modify storage ${runtimeStorage} request.valid_mode set value 1b`
      )
    );
    fn(
      "_internal/error/invalid_animation",
      lines(
        ...tips ? [
          dynamicErrorTellraw(
            options,
            "dap.datapack.invalid_animation",
            "animation",
            "request.animation",
            runtimeStorage
          )
        ] : ["return 0"]
      )
    );
    fn(
      "_internal/error/invalid_mode",
      lines(
        ...tips ? [
          dynamicErrorTellraw(
            options,
            "dap.datapack.invalid_mode",
            "mode",
            "request.mode",
            runtimeStorage
          )
        ] : ["return 0"]
      )
    );
    fn(
      "play",
      lines(
        ...holdItemLines,
        `${unlessHeld} return 0`,
        `data remove storage ${runtimeStorage} request`,
        `$data modify storage ${runtimeStorage} request.animation set value "$(animation)"`,
        `$data modify storage ${runtimeStorage} request.mode set value "$(mode)"`,
        `function ${id("_internal/validate_animation")}`,
        `execute unless data storage ${runtimeStorage} {request:{valid_animation:1b}} run function ${id("_internal/error/invalid_animation")}`,
        `execute unless data storage ${runtimeStorage} {request:{valid_animation:1b}} run return 0`,
        `function ${id("_internal/validate_mode")}`,
        `execute unless data storage ${runtimeStorage} {request:{valid_mode:1b}} run function ${id("_internal/error/invalid_mode")}`,
        `execute unless data storage ${runtimeStorage} {request:{valid_mode:1b}} run return 0`,
        `$function ${id("_internal/play/$(animation)/$(mode)")}`
      )
    );
    fn(
      "frame",
      lines(
        ...holdItemLines,
        `${unlessHeld} return 0`,
        `data remove storage ${runtimeStorage} request`,
        `$data modify storage ${runtimeStorage} request.animation set value "$(animation)"`,
        `function ${id("_internal/validate_animation")}`,
        `execute unless data storage ${runtimeStorage} {request:{valid_animation:1b}} run function ${id("_internal/error/invalid_animation")}`,
        `execute unless data storage ${runtimeStorage} {request:{valid_animation:1b}} run return 0`,
        `$function ${id("_internal/frame/$(animation)")} {frame:$(frame)}`
      )
    );
    fn(
      "stop",
      lines(
        ...holdItemLines,
        `${unlessHeld} return 0`,
        `function ${id("_internal/reset_default")}`,
        ...tips ? [tellraw(options, tr("dap.datapack.stopped"), "yellow")] : []
      )
    );
    for (const animation of animations.values()) {
      const lastFrame = animation.frameCount - 1;
      const firstMotionFrame = lastFrame >= 1 ? 1 : 0;
      const start = [
        `scoreboard players set @s ${frameScore} ${firstMotionFrame}`,
        `scoreboard players set @s ${maxFrameScore} ${lastFrame}`,
        `scoreboard players set @s ${phaseScore} 0`,
        `data modify storage ${runtimeStorage} held set value {project:${JSON.stringify(root)},animation:${JSON.stringify(animation.key)},frame:${firstMotionFrame},mode:0,max:${lastFrame},phase:0}`
      ];
      const finish = [
        `function ${id("_internal/save_held_state")}`,
        `tag @s add ${tag}`
      ];
      fn(
        `_internal/play/${animation.key}/loop`,
        lines(
          ...start,
          `scoreboard players set @s ${modeScore} 1`,
          ...finish,
          ...tips ? [tellraw(options, tr("dap.datapack.loop_started", {
            animation: animation.displayName,
            fps: options.playbackFps,
            last_frame: lastFrame
          }), "green")] : []
        )
      );
      fn(
        `_internal/play/${animation.key}/once`,
        lines(
          ...start,
          `scoreboard players set @s ${modeScore} 2`,
          ...finish,
          ...tips ? [tellraw(options, tr("dap.datapack.once_started", {
            animation: animation.displayName,
            last_frame: lastFrame
          }), "green")] : []
        )
      );
      fn(
        `_internal/frame/${animation.key}`,
        lines(
          `tag @s remove ${tag}`,
          `scoreboard players set @s ${modeScore} 0`,
          `scoreboard players set @s ${maxFrameScore} ${lastFrame}`,
          `scoreboard players set @s ${frameScore} 0`,
          `scoreboard players set @s ${phaseScore} 0`,
          `data modify storage ${runtimeStorage} held set value {project:${JSON.stringify(root)},animation:${JSON.stringify(animation.key)},frame:0,mode:0,max:${lastFrame},phase:0}`,
          `$scoreboard players set @s ${frameScore} $(frame)`,
          `execute if score @s ${frameScore} matches ..-1 run scoreboard players set @s ${frameScore} 0`,
          `execute if score @s ${frameScore} > @s ${maxFrameScore} run scoreboard players operation @s ${frameScore} = @s ${maxFrameScore}`,
          `function ${id("_internal/save_held_state")}`
        )
      );
      fn(
        `play/${animation.key}`,
        lines(`function ${id("play")} {animation:${JSON.stringify(animation.key)},mode:"once"}`)
      );
      fn(
        `loop/${animation.key}`,
        lines(`function ${id("play")} {animation:${JSON.stringify(animation.key)},mode:"loop"}`)
      );
      fn(
        `frame/${animation.key}`,
        lines(`$function ${id("frame")} {animation:${JSON.stringify(animation.key)},frame:$(frame)}`)
      );
      files.push({
        path: `data/${ns}/item_modifier/${root}/set_frame/${animation.key}.json`,
        content: json(frameModifier(frameScore, animation.key))
      });
    }
    files.push({
      path: `data/${ns}/item_modifier/${root}/set_frame.json`,
      content: json(frameModifier(frameScore))
    });
    files.push({
      path: `data/${ns}/item_modifier/${root}/state/copy_from_storage.json`,
      content: json({
        function: "minecraft:copy_custom_data",
        source: { type: "minecraft:storage", source: runtimeStorage },
        ops: [{ source: "held", target: "jsb", op: "replace" }]
      })
    });
    files.push({
      path: `data/${ns}/item_modifier/${root}/state/reset_default.json`,
      content: json([
        {
          function: "minecraft:set_custom_data",
          tag: itemAnimationState(root, defaultAnimation.key, 0, 0, defaultLastFrame, 0)
        },
        fixedFrameModifier(defaultAnimation.key, 0)
      ])
    });
    files.push({
      path: "data/minecraft/tags/function/load.json",
      content: json({ values: [id("load")] })
    });
    files.push({
      path: "data/minecraft/tags/function/tick.json",
      content: json({ values: [id("tick")] })
    });
    return files;
  }

  // src/shaders/entity.fsh
  var entity_default = "#version 330\n\n#moj_import <minecraft:fog.glsl>\n#moj_import <minecraft:dynamictransforms.glsl>\n\nuniform sampler2D Sampler0;\n\n#ifdef DISSOLVE\nuniform sampler2D DissolveMaskSampler;\n#endif\n\nin float sphericalVertexDistance;\nin float cylindricalVertexDistance;\n#ifdef PER_FACE_LIGHTING\nin vec4 vertexPerFaceColorBack;\nin vec4 vertexPerFaceColorFront;\n#else\nin vec4 vertexColor;\n#endif\n\n#ifndef EMISSIVE\nin vec4 lightMapColor;\n#endif\n\n#ifndef NO_OVERLAY\nin vec4 overlayColor;\n#endif\n\nin vec2 texCoord0;\nin vec2 modelTexCoord;\nin vec3 modelPosition;\n\nout vec4 fragColor;\n\nconst float SKIN_SIZE = 64.0;\nconst float HEAD_FACE_SIZE = 8.0;\nconst float RIGHT_HAND_TAG_SCALE = 0.99;\nconst vec3 HAND_MODEL_SCALE = vec3(0.471, 0.515, 1.515);\nconst vec3 modelScaleF = 0.5 * HAND_MODEL_SCALE;\nconst vec3 modelScaleS = modelScaleF + (0.25 / 8.0) * HAND_MODEL_SCALE;\nconst vec3 hRefF = vec3(length(modelScaleF.xz), length(modelScaleF.yz), length(modelScaleF.xy));\nconst vec3 hRefS = vec3(length(modelScaleS.xz), length(modelScaleS.yz), length(modelScaleS.xy));\n\nconst ivec4 armUV[] = ivec4[](\n    ivec4(40, 52, 36, 64),\n    ivec4(44, 64, 48, 52),\n    ivec4(36, 64, 32, 52),\n    ivec4(44, 52, 40, 48),\n    ivec4(40, 52, 44, 64),\n    ivec4(36, 52, 40, 48)\n);\n\nconst ivec4 slimArmUV[] = ivec4[](\n    ivec4(39, 52, 36, 64),\n    ivec4(43, 64, 46, 52),\n    ivec4(36, 64, 32, 52),\n    ivec4(42, 52, 39, 48),\n    ivec4(39, 52, 43, 64),\n    ivec4(36, 52, 39, 48)\n);\n\nconst bool armRotateUV[] = bool[](\n    false, false, true, false, true, false\n);\n\nbool testDim(float h, float hRef) {\n    return abs(h - hRef) < 0.001;\n}\n\nbool testDims(float h, vec3 hRef) {\n    return testDim(h, hRef.x) || testDim(h, hRef.y) || testDim(h, hRef.z);\n}\n\nbool isSlimSkin() {\n    vec4 samp1 = texture(Sampler0, vec2(54.0 / SKIN_SIZE, 20.0 / SKIN_SIZE));\n    vec4 samp2 = texture(Sampler0, vec2(55.0 / SKIN_SIZE, 20.0 / SKIN_SIZE));\n    return samp1.a == 0.0 || (((samp1.r + samp1.g + samp1.b) == 0.0)\n        && ((samp2.r + samp2.g + samp2.b) == 0.0)\n        && samp1.a == 1.0 && samp2.a == 1.0);\n}\n\nfloat faceDiagonal() {\n    vec3 dpdx = dFdx(modelPosition);\n    vec3 dpdy = dFdy(modelPosition);\n    vec2 duvdx = dFdx(modelTexCoord);\n    vec2 duvdy = dFdy(modelTexCoord);\n    float determinant = duvdx.x * duvdy.y - duvdx.y * duvdy.x;\n    if (abs(determinant) < 1e-10) {\n        return 0.0;\n    }\n\n    vec3 dpdu = (dpdx * duvdy.y - dpdy * duvdx.y) / determinant;\n    vec3 dpdv = (dpdy * duvdx.x - dpdx * duvdy.x) / determinant;\n    return length((dpdv - dpdu) * (HEAD_FACE_SIZE / SKIN_SIZE));\n}\n\nbool decodeHeadUV(vec2 sourceCoord, out int face, out bool overlay, out vec2 faceCoord) {\n    vec2 pixel = sourceCoord * SKIN_SIZE;\n    overlay = pixel.x >= 32.0;\n    if (overlay) {\n        pixel.x -= 32.0;\n    }\n\n    vec2 faceOrigin;\n    if (pixel.y >= 0.0 && pixel.y <= 8.0 && pixel.x >= 8.0 && pixel.x <= 24.0) {\n        if (pixel.x < 16.0) {\n            face = 0;\n            faceOrigin = vec2(8.0, 0.0);\n        } else {\n            face = 1;\n            faceOrigin = vec2(16.0, 0.0);\n        }\n    } else if (pixel.y >= 8.0 && pixel.y <= 16.0 && pixel.x >= 0.0 && pixel.x <= 32.0) {\n        if (pixel.x < 8.0) {\n            face = 2;\n            faceOrigin = vec2(0.0, 8.0);\n        } else if (pixel.x < 16.0) {\n            face = 3;\n            faceOrigin = vec2(8.0, 8.0);\n        } else if (pixel.x < 24.0) {\n            face = 4;\n            faceOrigin = vec2(16.0, 8.0);\n        } else {\n            face = 5;\n            faceOrigin = vec2(24.0, 8.0);\n        }\n    } else {\n        return false;\n    }\n\n    faceCoord = clamp((pixel - faceOrigin) / HEAD_FACE_SIZE, vec2(0.0), vec2(1.0));\n    return true;\n}\n\nvec2 armTexCoord(int face, bool overlay, bool rightHand, bool slim, vec2 sourceFaceCoord) {\n    ivec4 uvData = slim ? slimArmUV[face] : armUV[face];\n    if (rightHand) {\n        uvData += ivec4(8, -32, 8, -32);\n        if (overlay) {\n            uvData.yw += 16;\n        }\n    } else if (overlay) {\n        uvData.xz += 16;\n    }\n\n    vec2 result;\n    if (armRotateUV[face]) {\n        result.x = mix(float(uvData.x), float(uvData.z), sourceFaceCoord.y);\n        result.y = mix(float(uvData.w), float(uvData.y), sourceFaceCoord.x);\n    } else {\n        result.x = mix(float(uvData.z), float(uvData.x), sourceFaceCoord.x);\n        result.y = mix(float(uvData.y), float(uvData.w), sourceFaceCoord.y);\n    }\n    return result / SKIN_SIZE;\n}\n\nvoid main() {\n    vec2 texCoord = texCoord0;\n\n    if (textureSize(Sampler0, 0) == ivec2(64, 64)) {\n        float h = faceDiagonal();\n        bool leftHand = testDims(h, hRefF) || testDims(h, hRefS);\n        bool rightHand = testDims(h, hRefF * RIGHT_HAND_TAG_SCALE)\n            || testDims(h, hRefS * RIGHT_HAND_TAG_SCALE);\n\n        int face;\n        bool overlay;\n        vec2 sourceFaceCoord;\n        if ((leftHand || rightHand) && decodeHeadUV(modelTexCoord, face, overlay, sourceFaceCoord)) {\n            // The player-head bottom face is 180 degrees opposite to the arm UV orientation.\n            if (face == 1) {\n                sourceFaceCoord = vec2(1.0) - sourceFaceCoord;\n            }\n            texCoord = armTexCoord(face, overlay, rightHand, isSlimSkin(), sourceFaceCoord);\n        }\n    }\n\n    vec4 color = texture(Sampler0, texCoord);\n#ifdef ALPHA_CUTOUT\n    if (color.a < ALPHA_CUTOUT) {\n        discard;\n    }\n#endif\n\n#ifdef PER_FACE_LIGHTING\n    vec4 faceVertexColor = gl_FrontFacing ? vertexPerFaceColorFront : vertexPerFaceColorBack;\n#else\n    vec4 faceVertexColor = vertexColor;\n#endif\n\n#ifdef DISSOLVE\n    if (faceVertexColor.a < texture(DissolveMaskSampler, texCoord).a) {\n        discard;\n    }\n    faceVertexColor.a = 1.0;\n#endif\n\n    color *= faceVertexColor * ColorModulator;\n#ifndef NO_OVERLAY\n    color.rgb = mix(overlayColor.rgb, color.rgb, overlayColor.a);\n#endif\n#ifndef EMISSIVE\n    color *= lightMapColor;\n#endif\n\n    fragColor = apply_fog(color, sphericalVertexDistance, cylindricalVertexDistance, FogEnvironmentalStart, FogEnvironmentalEnd, FogRenderDistanceStart, FogRenderDistanceEnd, FogColor);\n}\n";

  // src/shaders/entity.vsh
  var entity_default2 = "#version 330\n\n#if defined(PER_FACE_LIGHTING) || !defined(NO_CARDINAL_LIGHTING)\n#moj_import <minecraft:light.glsl>\n#endif\n#moj_import <minecraft:fog.glsl>\n#moj_import <minecraft:dynamictransforms.glsl>\n#moj_import <minecraft:projection.glsl>\n#moj_import <minecraft:sample_lightmap.glsl>\n\nin vec3 Position;\nin vec4 Color;\nin vec2 UV0;\nin ivec2 UV1;\nin ivec2 UV2;\nin vec3 Normal;\n\n#ifndef NO_OVERLAY\nuniform sampler2D Sampler1;\n#endif\n\n#ifndef EMISSIVE\nuniform sampler2D Sampler2;\n#endif\n\nout float sphericalVertexDistance;\nout float cylindricalVertexDistance;\n\n#ifdef PER_FACE_LIGHTING\nout vec4 vertexPerFaceColorBack;\nout vec4 vertexPerFaceColorFront;\n#else\nout vec4 vertexColor;\n#endif\n\n#ifndef EMISSIVE\nout vec4 lightMapColor;\n#endif\n\n#ifndef NO_OVERLAY\nout vec4 overlayColor;\n#endif\n\nout vec2 texCoord0;\nout vec2 modelTexCoord;\nout vec3 modelPosition;\n\nvoid main() {\n    gl_Position = ProjMat * ModelViewMat * vec4(Position, 1.0);\n\n    sphericalVertexDistance = fog_spherical_distance(Position);\n    cylindricalVertexDistance = fog_cylindrical_distance(Position);\n\n#ifdef PER_FACE_LIGHTING\n    vec2 light = minecraft_compute_light(Light0_Direction, Light1_Direction, Normal);\n    vertexPerFaceColorBack = minecraft_mix_light_separate(-light, Color);\n    vertexPerFaceColorFront = minecraft_mix_light_separate(light, Color);\n#elif defined(NO_CARDINAL_LIGHTING)\n    vertexColor = Color;\n#else\n    vertexColor = minecraft_mix_light(Light0_Direction, Light1_Direction, Normal, Color);\n#endif\n\n#ifndef EMISSIVE\n    lightMapColor = sample_lightmap(Sampler2, UV2);\n#endif\n\n#ifndef NO_OVERLAY\n    overlayColor = texelFetch(Sampler1, UV1, 0);\n#endif\n\n    modelTexCoord = UV0;\n    modelPosition = Position;\n    texCoord0 = UV0;\n\n#ifdef APPLY_TEXTURE_MATRIX\n    texCoord0 = (TextureMat * vec4(UV0, 0.0, 1.0)).xy;\n#endif\n}\n";

  // src/hand-rendering.ts
  var HAND_SHADER_PATHS = /* @__PURE__ */ new Set([
    "assets/minecraft/shaders/core/entity.vsh",
    "assets/minecraft/shaders/core/entity.fsh"
  ]);
  var HIDDEN_CONTEXTS = [
    "gui",
    "fixed",
    "ground",
    "thirdperson_righthand",
    "thirdperson_lefthand",
    "head",
    "on_shelf"
  ];
  function hiddenDisplays() {
    return Object.fromEntries(HIDDEN_CONTEXTS.map((context) => [context, { scale: [0, 0, 0] }]));
  }
  function handBaseModel(side, particleTexture, pose, display) {
    const animated = animatedHandDisplay(side, pose);
    return {
      textures: { particle: particleTexture },
      display: {
        firstperson_righthand: pose && display ? previewAlignedHandDisplay(side, pose, display.firstperson_righthand) : animated,
        firstperson_lefthand: pose && display ? previewAlignedHandDisplay(side, pose, display.firstperson_lefthand ?? display.firstperson_righthand, true) : animated,
        ...hiddenDisplays()
      }
    };
  }
  function playerSkinHands(model, projectName, bases) {
    const special = (side) => ({
      type: "minecraft:special",
      base: bases?.[side] ?? `jsb:${projectName}/_hand/${side}`,
      model: { type: "minecraft:player_head" },
      transformation: handSpecialTransformation()
    });
    return {
      type: "minecraft:composite",
      models: [model, special("left"), special("right")]
    };
  }
  function handRenderingFiles(projectName, particleTexture) {
    const json3 = (value) => `${JSON.stringify(value, null, 2)}
`;
    return [
      {
        path: `assets/jsb/models/${projectName}/_hand/left.json`,
        content: json3(handBaseModel("left", particleTexture))
      },
      {
        path: `assets/jsb/models/${projectName}/_hand/right.json`,
        content: json3(handBaseModel("right", particleTexture))
      },
      { path: "assets/minecraft/shaders/core/entity.vsh", content: entity_default2 },
      { path: "assets/minecraft/shaders/core/entity.fsh", content: entity_default }
    ];
  }

  // src/file-writer.ts
  var SHARED_TAGS = /* @__PURE__ */ new Set([
    "data/minecraft/tags/function/load.json",
    "data/minecraft/tags/function/tick.json"
  ]);
  function getScopedFs(scopeRoot) {
    const fs = requireNativeModule("fs", {
      scope: scopeRoot,
      message: tr("dap.permission.export"),
      show_permission_dialog: true
    });
    if (!fs) throw new Error(tr("dap.error.write_permission"));
    return fs;
  }
  function getPathModule() {
    return requireNativeModule("path");
  }
  function manifestRelativePath(kind) {
    return kind === "resource" ? "assets.jsbmeta" : "data.jsbmeta";
  }
  function isSafeRelativePath(relativePath) {
    return Boolean(relativePath) && !relativePath.startsWith("/") && !relativePath.includes("\\") && !relativePath.includes("\0") && !relativePath.split("/").some((segment) => !segment || segment === "." || segment === "..");
  }
  function isOwnedProjectPath(path, project) {
    const ns = EXPORT_NAMESPACE;
    return path === `assets/${ns}/items/${project}.json` || path.startsWith(`assets/${ns}/models/${project}/`) || path.startsWith(`assets/${ns}/textures/item/${project}/`) || path.startsWith(`data/${ns}/function/${project}/`) || path.startsWith(`data/${ns}/item_modifier/${project}/`) || path.startsWith(`data/${ns}/loot_table/${project}/`);
  }
  function isManagedProjectPath(path, project, kind) {
    return isOwnedProjectPath(path, project) || kind === "resource" && HAND_SHADER_PATHS.has(path);
  }
  function validateGeneratedPath(path, target) {
    if (!isSafeRelativePath(path)) {
      throw new Error(tr("dap.error.unsafe_path", { path }));
    }
    if (path !== "pack.mcmeta" && !SHARED_TAGS.has(path) && !isManagedProjectPath(path, target.projectName, target.kind)) {
      throw new Error(tr("dap.error.unsafe_path", { path }));
    }
  }
  function readManifest(fs, pathModule, target) {
    const fullPath = pathModule.join(target.root, manifestRelativePath(target.kind));
    if (!fs.existsSync(fullPath)) return { version: 1, projects: {} };
    let value;
    try {
      value = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch (error) {
      throw new Error(tr("dap.error.manifest_invalid", { path: fullPath }));
    }
    if (value.version !== 1 || !value.projects || typeof value.projects !== "object") {
      throw new Error(tr("dap.error.manifest_invalid", { path: fullPath }));
    }
    for (const [project, entry] of Object.entries(value.projects)) {
      if (!entry || entry.kind !== "resource" && entry.kind !== "datapack" || !Array.isArray(entry.files) || entry.files.some((path) => typeof path !== "string" || !isManagedProjectPath(path, project, entry.kind))) {
        throw new Error(tr("dap.error.manifest_invalid", { path: fullPath }));
      }
    }
    return value;
  }
  function validateExistingPack(fs, pathModule, target) {
    const packPath = pathModule.join(target.root, "pack.mcmeta");
    if (!target.insert) return;
    if (!fs.existsSync(packPath)) {
      throw new Error(tr("dap.error.invalid_pack", { path: target.root }));
    }
    try {
      const parsed = JSON.parse(fs.readFileSync(packPath, "utf8"));
      if (!parsed || typeof parsed.pack !== "object") throw new Error("missing pack object");
    } catch (error) {
      throw new Error(tr("dap.error.invalid_pack", { path: target.root }));
    }
  }
  function mergeFunctionTag(existing, generated, path) {
    let generatedValue;
    try {
      const parsed = JSON.parse(generated);
      generatedValue = parsed.values?.[0];
      if (typeof generatedValue !== "string") throw new Error("missing generated value");
    } catch (error) {
      throw new Error(tr("dap.error.shared_tag_invalid", { path }));
    }
    if (!existing) return `${JSON.stringify({ values: [generatedValue] }, null, 2)}
`;
    try {
      const parsed = JSON.parse(existing);
      if (!Array.isArray(parsed.values)) throw new Error("missing values");
      if (!parsed.values.some((value) => value === generatedValue)) parsed.values.push(generatedValue);
      return `${JSON.stringify(parsed, null, 2)}
`;
    } catch (error) {
      throw new Error(tr("dap.error.shared_tag_invalid", { path }));
    }
  }
  function prepareTarget(target, fs, pathModule) {
    for (const file of target.files) validateGeneratedPath(file.path, target);
    validateExistingPack(fs, pathModule, target);
    const manifest = readManifest(fs, pathModule, target);
    const previousEntry = manifest.projects[target.projectName];
    if (previousEntry && previousEntry.kind !== target.kind) {
      throw new Error(tr("dap.error.manifest_invalid", { path: pathModule.join(target.root, manifestRelativePath(target.kind)) }));
    }
    const owned = new Set(previousEntry?.files ?? []);
    const desired = /* @__PURE__ */ new Map();
    let merged = 0;
    for (const file of target.files) {
      if (file.path === "pack.mcmeta") {
        const fullPath = pathModule.join(target.root, file.path);
        if (target.insert) continue;
        if (fs.existsSync(fullPath)) continue;
      }
      if (SHARED_TAGS.has(file.path)) {
        const fullPath = pathModule.join(target.root, file.path);
        const existing = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
        const content2 = mergeFunctionTag(existing, file.content, file.path);
        desired.set(file.path, { ...file, content: content2 });
        if (existing !== content2) merged++;
        continue;
      }
      desired.set(file.path, file);
    }
    const currentOwned = new Set(
      [...desired.keys()].filter((path) => isManagedProjectPath(path, target.projectName, target.kind))
    );
    const sharedOwnedByAnotherProject = (path) => Object.entries(manifest.projects).some(
      ([project, entry]) => project !== target.projectName && entry.kind === "resource" && entry.files.includes(path)
    );
    const stale = [...owned].filter(
      (path) => !currentOwned.has(path) && (!HAND_SHADER_PATHS.has(path) || !sharedOwnedByAnotherProject(path))
    );
    const conflicts = [];
    for (const relativePath of currentOwned) {
      const fullPath = pathModule.join(target.root, relativePath);
      if (fs.existsSync(fullPath) && !owned.has(relativePath)) {
        const generated = desired.get(relativePath);
        const identicalSharedShader = HAND_SHADER_PATHS.has(relativePath) && generated && fs.readFileSync(fullPath, "utf8") === generated.content;
        if (!identicalSharedShader) conflicts.push(fullPath);
      }
    }
    for (const relativePath of stale) {
      if (!isManagedProjectPath(relativePath, target.projectName, target.kind)) {
        throw new Error(tr("dap.error.unsafe_path", { path: relativePath }));
      }
    }
    const manifestPath = pathModule.join(target.root, manifestRelativePath(target.kind));
    const nextProjects = { ...manifest.projects, [target.projectName]: { kind: target.kind, files: [...currentOwned].sort() } };
    desired.set(manifestRelativePath(target.kind), {
      path: manifestRelativePath(target.kind),
      content: `${JSON.stringify(
        {
          version: 1,
          projects: nextProjects
        },
        null,
        2
      )}
`
    });
    let added = 0;
    let updated = 0;
    for (const relativePath of desired.keys()) {
      if (SHARED_TAGS.has(relativePath)) continue;
      if (fs.existsSync(pathModule.join(target.root, relativePath))) updated++;
      else added++;
    }
    return {
      target,
      fs,
      path: pathModule,
      manifestPath,
      desired,
      owned,
      stale,
      preview: { root: target.root, added, updated, removed: stale.length, merged },
      conflicts
    };
  }
  function prepareTargets(targets) {
    const roots = /* @__PURE__ */ new Set();
    const filesystems = /* @__PURE__ */ new Map();
    const pathModule = getPathModule();
    return targets.map((target) => {
      if (roots.has(target.root)) {
        throw new Error(tr("dap.error.duplicate_target", { path: target.root }));
      }
      roots.add(target.root);
      let fs = filesystems.get(target.scopeRoot);
      if (!fs) {
        fs = getScopedFs(target.scopeRoot);
        filesystems.set(target.scopeRoot, fs);
      }
      return prepareTarget(target, fs, pathModule);
    });
  }
  function previewPacks(targets) {
    const prepared = prepareTargets(targets);
    const previews = prepared.map((entry) => entry.preview);
    return {
      added: previews.reduce((sum, value) => sum + value.added, 0),
      updated: previews.reduce((sum, value) => sum + value.updated, 0),
      removed: previews.reduce((sum, value) => sum + value.removed, 0),
      merged: previews.reduce((sum, value) => sum + value.merged, 0),
      conflicts: prepared.flatMap((entry) => entry.conflicts),
      targets: previews
    };
  }
  function writeStagedFile(fs, pathModule, stagingRoot, file) {
    const staged = pathModule.join(stagingRoot, "files", file.path);
    fs.mkdirSync(pathModule.dirname(staged), { recursive: true });
    Blockbench.writeFile(staged, {
      content: file.content,
      savetype: file.isImage ? "image" : "text"
    });
    if (!fs.existsSync(staged)) throw new Error(tr("dap.error.file_not_written", { path: staged }));
    if (!file.isImage && fs.readFileSync(staged, "utf8") !== file.content) {
      throw new Error(tr("dap.error.file_verify", { path: staged }));
    }
    return staged;
  }
  function pruneEmptyParents(entry, relativePaths) {
    const root = entry.target.root;
    for (const relativePath of relativePaths) {
      let directory = entry.path.dirname(entry.path.join(root, relativePath));
      while (directory !== root) {
        if (!entry.fs.existsSync(directory)) {
          directory = entry.path.dirname(directory);
          continue;
        }
        if (entry.fs.readdirSync(directory, { withFileTypes: true }).length) break;
        entry.fs.rmdirSync(directory);
        directory = entry.path.dirname(directory);
      }
    }
  }
  function removeTransactionRoot(entry, root) {
    entry.fs.rmSync(root, { recursive: true, force: true });
    const parent = entry.path.dirname(root);
    if (entry.fs.existsSync(parent) && entry.fs.readdirSync(parent, { withFileTypes: true }).length === 0) {
      entry.fs.rmdirSync(parent);
    }
  }
  function writePacks(targets) {
    const prepared = prepareTargets(targets);
    const conflicts = prepared.flatMap((entry) => entry.conflicts);
    if (conflicts.length) {
      throw new Error(tr("dap.error.path_conflicts", { paths: conflicts.join("\n") }));
    }
    const staged = /* @__PURE__ */ new Map();
    const mutations = [];
    try {
      prepared.forEach((entry, targetIndex) => {
        const stagingRoot = entry.path.join(
          entry.target.root,
          `.jsb-transaction-${entry.target.projectName}-${Date.now()}-${targetIndex}`
        );
        const stagedFiles = /* @__PURE__ */ new Map();
        for (const file of entry.desired.values()) {
          stagedFiles.set(
            file.path,
            writeStagedFile(entry.fs, entry.path, stagingRoot, file)
          );
        }
        staged.set(entry, { root: stagingRoot, files: stagedFiles });
      });
      for (const entry of prepared) {
        const stagedTarget = staged.get(entry);
        let backupIndex = 0;
        const replaceOrRemove = [...entry.desired.keys(), ...entry.stale];
        for (const relativePath of replaceOrRemove) {
          const finalPath = entry.path.join(entry.target.root, relativePath);
          let backupPath = null;
          if (entry.fs.existsSync(finalPath)) {
            backupPath = entry.path.join(stagedTarget.root, "backups", String(backupIndex++));
            entry.fs.mkdirSync(entry.path.dirname(backupPath), { recursive: true });
            entry.fs.renameSync(finalPath, backupPath);
          }
          mutations.push({ prepared: entry, finalPath, backupPath });
          const stagedPath = stagedTarget.files.get(relativePath);
          if (stagedPath) {
            entry.fs.mkdirSync(entry.path.dirname(finalPath), { recursive: true });
            entry.fs.renameSync(stagedPath, finalPath);
          }
        }
      }
    } catch (error) {
      const rollbackFailures = [];
      const rollbackErrors = [];
      for (const mutation of [...mutations].reverse()) {
        const { fs } = mutation.prepared;
        try {
          if (fs.existsSync(mutation.finalPath)) fs.unlinkSync(mutation.finalPath);
          if (mutation.backupPath && fs.existsSync(mutation.backupPath)) {
            fs.mkdirSync(mutation.prepared.path.dirname(mutation.finalPath), { recursive: true });
            fs.renameSync(mutation.backupPath, mutation.finalPath);
          }
        } catch (rollbackError) {
          rollbackErrors.push(rollbackError);
          rollbackFailures.push(mutation.finalPath);
        }
      }
      for (const [entry, value] of staged) {
        try {
          removeTransactionRoot(entry, value.root);
        } catch (cleanupError) {
          console.warn("Could not clean failed JSB transaction", cleanupError);
        }
      }
      if (rollbackFailures.length) {
        console.error("JSB transaction rollback could not restore some files", rollbackErrors);
        throw new Error(`${tr("dap.error.rollback_partial", { paths: rollbackFailures.join("\n") })}
${error instanceof Error ? error.message : String(error)}`);
      }
      throw error;
    }
    for (const [entry, value] of staged) {
      try {
        removeTransactionRoot(entry, value.root);
        pruneEmptyParents(entry, entry.stale);
        const transactionRoot = entry.path.dirname(value.root);
        if (entry.fs.existsSync(transactionRoot) && entry.fs.readdirSync(transactionRoot, { withFileTypes: true }).length === 0) {
          entry.fs.rmdirSync(transactionRoot);
        }
        const legacyTransactionRoot = entry.path.join(entry.target.root, ".jsb-transactions");
        if (entry.fs.existsSync(legacyTransactionRoot) && entry.fs.readdirSync(legacyTransactionRoot, { withFileTypes: true }).length === 0) {
          entry.fs.rmdirSync(legacyTransactionRoot);
        }
      } catch (error) {
        console.warn("Could not fully clean completed JSB transaction", error);
      }
    }
    return prepared.reduce((sum, entry) => sum + entry.desired.size, 0);
  }

  // src/resource-pack.ts
  var RESOURCE_PACK_FORMAT = [88, 0];
  function json2(value) {
    return `${JSON.stringify(value, null, 2)}
`;
  }
  function sanitizeTextureName(name, fallbackIndex) {
    const safe = name.replace(/\.png$/i, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
    return safe || `texture_${fallbackIndex}`;
  }
  function collectTextures() {
    const used = /* @__PURE__ */ new Set();
    const previewTextureUuid = typeof Project === "undefined" ? void 0 : Project?.display_anim_export_settings?.handPreviewTextureUuid;
    return Texture.all.filter(
      (texture) => (!previewTextureUuid || texture.uuid !== previewTextureUuid) && texture[PREVIEW_TEXTURE_PROPERTY] !== true && texture.name !== "DAP_Default_Player_Skin.png" && texture.name !== "missing.png"
    ).map((texture, index) => {
      const base = sanitizeTextureName(texture.name, index);
      let name = base;
      let suffix = 2;
      while (used.has(name)) name = `${base}_${suffix++}`;
      used.add(name);
      return {
        id: String(texture.id),
        name,
        link: texture.javaTextureLink(),
        dataUrl: texture.getDataURL()
      };
    });
  }
  function rewriteTextureRefs(model, projectName, textures) {
    if (!model.textures) return;
    for (const key of Object.keys(model.textures)) {
      const value = model.textures[key];
      if (value.startsWith("#")) continue;
      const valueStem = value.split("/").pop()?.replace(/\.png$/i, "");
      const texture = textures.find(
        (candidate) => candidate.id === key || candidate.link === value || candidate.name === key || candidate.name === valueStem
      );
      if (texture) model.textures[key] = `${EXPORT_NAMESPACE}:item/${projectName}/${texture.name}`;
    }
    if (!model.textures.particle) {
      const firstTextureKey = Object.keys(model.textures).find(
        (key) => key !== "particle" && !model.textures[key].startsWith("#")
      );
      if (firstTextureKey) model.textures.particle = `#${firstTextureKey}`;
    }
  }
  function sanitizeTextureRefs(model, projectName, textureNames) {
    const prefix2 = `${EXPORT_NAMESPACE}:item/${projectName}/`;
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
        if (!key || key === "missing" || visited.has(key) || !textures[key]) return null;
        visited.add(key);
        value = textures[key];
      }
      return value;
    };
    for (const [key, rawValue] of Object.entries(textures)) {
      const value = resolveTexture(rawValue);
      if (value) validateResolvedTexture(value, `#${key}`);
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
    return { omittedFaces, omittedElements };
  }
  function animatedModel(sequence, projectName, includeHands) {
    const frameModel = (frame2) => {
      const model = { type: "minecraft:model", model: sequence.modelPaths[frame2] };
      return includeHands ? playerSkinHands(model, projectName, sequence.handBasePaths[frame2]) : model;
    };
    if ([...new Set(sequence.modelPaths)].length === 1 && (!includeHands || sequence.handBasePaths.every((paths) => JSON.stringify(paths) === JSON.stringify(sequence.handBasePaths[0])))) {
      return frameModel(0);
    }
    return {
      type: "minecraft:range_dispatch",
      property: "minecraft:custom_model_data",
      index: 0,
      fallback: frameModel(0),
      entries: sequence.modelPaths.map((_model, frame2) => ({
        threshold: frame2,
        model: frameModel(frame2)
      }))
    };
  }
  function selectableAnimationModel(sequences, defaultAnimationKey, projectName, includeHands) {
    const fallback = sequences.find((sequence) => sequence.key === defaultAnimationKey);
    if (!fallback) throw new Error(`Unknown default animation key: ${defaultAnimationKey}`);
    return {
      type: "minecraft:select",
      property: "minecraft:custom_model_data",
      index: 0,
      cases: sequences.map((sequence) => ({
        when: sequence.key,
        model: animatedModel(sequence, projectName, includeHands)
      })),
      fallback: animatedModel(fallback, projectName, includeHands)
    };
  }
  function buildItemDefinition(options, staticModelPath, contextSequences, defaultHandBases) {
    const staticModel = { type: "minecraft:model", model: staticModelPath };
    const cases = options.displayContexts.map((route) => {
      const includeHands = options.handRenderingEnabled === true && (route.context === "firstperson_righthand" || route.context === "firstperson_lefthand");
      const routedModel = route.animated ? selectableAnimationModel(
        contextSequences.get(route.context) ?? [],
        options.defaultAnimationKey,
        options.projectName,
        includeHands
      ) : includeHands ? playerSkinHands(staticModel, options.projectName, defaultHandBases) : staticModel;
      return {
        when: route.context,
        model: routedModel
      };
    });
    return json2({
      model: {
        type: "minecraft:select",
        property: "minecraft:display_context",
        cases,
        fallback: staticModel
      },
      swap_animation_scale: 0
    });
  }
  function buildResourcePack(sequences, options) {
    if (!sequences.length || sequences.some((sequence) => !sequence.frames.length)) {
      throw new Error(tr("dap.error.no_models"));
    }
    const keys = /* @__PURE__ */ new Set();
    for (const sequence of sequences) {
      if (!sequence.key || keys.has(sequence.key)) {
        throw new Error(`Duplicate or empty animation key: ${sequence.key || "<empty>"}`);
      }
      keys.add(sequence.key);
    }
    if (!keys.has(options.defaultAnimationKey)) {
      throw new Error(`Unknown default animation key: ${options.defaultAnimationKey}`);
    }
    const files = [];
    const assetRoot = `assets/${EXPORT_NAMESPACE}`;
    const modelRoot = `${assetRoot}/models/${options.projectName}`;
    const textures = collectTextures();
    const textureNames = new Set(textures.map((texture) => texture.name));
    const uniqueModels = /* @__PURE__ */ new Map();
    const basePaths = /* @__PURE__ */ new Map();
    let sampledFrames = 0;
    let modelBytesBefore = 0;
    let modelBytesAfter = 0;
    let omittedUntexturedFaces = 0;
    let omittedEmptyElements = 0;
    let particleTexture = "minecraft:block/white_concrete";
    files.push({
      path: "pack.mcmeta",
      content: json2({
        pack: {
          description: options.description,
          min_format: RESOURCE_PACK_FORMAT,
          max_format: RESOURCE_PACK_FORMAT
        }
      })
    });
    if (options.handRenderingEnabled) {
      particleTexture = textures[0] ? `${EXPORT_NAMESPACE}:item/${options.projectName}/${textures[0].name}` : "minecraft:block/white_concrete";
      files.push(...handRenderingFiles(options.projectName, particleTexture));
    }
    const handModelPaths = /* @__PURE__ */ new Map();
    const resolveHandBasePaths = (frame2) => {
      if (!options.handRenderingEnabled || !frame2?.hands) return void 0;
      const key = JSON.stringify([frame2.hands, frame2.model.display]);
      const cached = handModelPaths.get(key);
      if (cached) return cached;
      const index = handModelPaths.size;
      const paths = {
        left: `${EXPORT_NAMESPACE}:${options.projectName}/_hand/_generated/left_${index}`,
        right: `${EXPORT_NAMESPACE}:${options.projectName}/_hand/_generated/right_${index}`
      };
      for (const side of ["left", "right"]) {
        files.push({
          path: `${modelRoot}/_hand/_generated/${side}_${index}.json`,
          content: json2(handBaseModel(side, particleTexture, frame2.hands[side], frame2.model.display ?? {}))
        });
      }
      handModelPaths.set(key, paths);
      return paths;
    };
    for (const sequence of sequences) {
      const paths = [];
      for (const frame2 of sequence.frames) {
        rewriteTextureRefs(frame2.model, options.projectName, textures);
        const sanitized = sanitizeTextureRefs(frame2.model, options.projectName, textureNames);
        omittedUntexturedFaces += sanitized.omittedFaces;
        omittedEmptyElements += sanitized.omittedElements;
        const finalJson = JSON.stringify(frame2.model);
        sampledFrames++;
        modelBytesBefore += finalJson.length;
        let modelPath = uniqueModels.get(finalJson);
        if (!modelPath) {
          const index = uniqueModels.size;
          modelPath = `${EXPORT_NAMESPACE}:${options.projectName}/_generated/model_${index}`;
          uniqueModels.set(finalJson, modelPath);
          modelBytesAfter += finalJson.length;
          files.push({
            path: `${modelRoot}/_generated/model_${index}.json`,
            content: `${finalJson}
`
          });
        }
        paths.push(modelPath);
      }
      basePaths.set(sequence.key, paths);
    }
    const contextSequences = /* @__PURE__ */ new Map();
    const animatedContextFolders = [];
    for (const route of options.displayContexts) {
      if (!route.animated) continue;
      const shortName = DISPLAY_CONTEXT_PATHS[route.context];
      if (!shortName) throw new Error(`Unknown display context: ${route.context}`);
      animatedContextFolders.push(shortName);
      const routedSequences = [];
      for (const sequence of sequences) {
        const paths = basePaths.get(sequence.key);
        const aliases = paths.map((parent, frame2) => {
          const alias = `${EXPORT_NAMESPACE}:${options.projectName}/${sequence.key}/${shortName}/${frame2}`;
          const content2 = json2({ parent });
          modelBytesAfter += content2.length;
          files.push({
            path: `${modelRoot}/${sequence.key}/${shortName}/${frame2}.json`,
            content: content2
          });
          return alias;
        });
        routedSequences.push({
          key: sequence.key,
          sourceName: sequence.sourceName,
          modelPaths: aliases,
          handBasePaths: sequence.frames.map((frame2) => resolveHandBasePaths(frame2))
        });
      }
      contextSequences.set(route.context, routedSequences);
    }
    const defaultPath = basePaths.get(options.defaultAnimationKey)?.[0];
    if (!defaultPath) throw new Error(tr("dap.error.no_models"));
    files.push({
      path: `${assetRoot}/items/${options.projectName}.json`,
      content: buildItemDefinition(
        options,
        defaultPath,
        contextSequences,
        resolveHandBasePaths(
          sequences.find((sequence) => sequence.key === options.defaultAnimationKey)?.frames[0]
        )
      )
    });
    for (const texture of textures) {
      files.push({
        path: `${assetRoot}/textures/item/${options.projectName}/${texture.name}.png`,
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
        omittedEmptyElements,
        animatedContextFolders,
        handRenderingEnabled: options.handRenderingEnabled === true,
        animations: sequences.map((sequence) => ({
          key: sequence.key,
          sourceName: sequence.sourceName,
          sampledFrames: sequence.frames.length
        }))
      }
    };
  }

  // src/export-dialog.ts
  var exportInProgress = false;
  function includesResource(mode) {
    return mode !== "datapack_only";
  }
  function includesDatapack(mode) {
    return mode !== "resource_only";
  }
  function normalizeItemId(value) {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return "minecraft:potion";
    return trimmed.includes(":") ? trimmed : `minecraft:${trimmed}`;
  }
  function animationIdentity(spec) {
    return `${spec.sourceName} (${spec.key})`;
  }
  function formatBytes(bytes) {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  }
  function escapeHtml2(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }
  function pickDirectory(resourceId, title) {
    return Blockbench.pickDirectory({ resource_id: resourceId, title }) ?? null;
  }
  function chooseDestinations(outputMode, writeMode, packName, settings) {
    if (writeMode === "insert") {
      if (outputMode === "both_default") {
        const root = settings.sharedRoot || pickDirectory("display_anim_insert_shared", tr("dap.export.pick_shared", { pack: packName }));
        if (!root) return null;
        return [
          { label: tr("dap.export.resource_pack"), scopeRoot: root, targetRoot: `${root}/resource-packs/${packName}`, kind: "resource", insert: true },
          { label: tr("dap.export.datapack"), scopeRoot: root, targetRoot: `${root}/datapacks/${packName}`, kind: "datapack", insert: true }
        ];
      }
      const destinations = [];
      if (includesResource(outputMode)) {
        const root = settings.resourcePackFolder || pickDirectory("display_anim_insert_resource", tr("dap.export.pick_existing_resource"));
        if (!root) return null;
        destinations.push({
          label: tr("dap.export.resource_pack"),
          scopeRoot: root,
          targetRoot: root,
          kind: "resource",
          insert: true
        });
      }
      if (includesDatapack(outputMode)) {
        const root = settings.datapackFolder || pickDirectory("display_anim_insert_datapack", tr("dap.export.pick_existing_datapack"));
        if (!root) return null;
        destinations.push({
          label: tr("dap.export.datapack"),
          scopeRoot: root,
          targetRoot: root,
          kind: "datapack",
          insert: true
        });
      }
      return destinations;
    }
    if (outputMode === "both_default") {
      const root = settings.sharedRoot || pickDirectory("display_anim_export", tr("dap.export.pick_shared", { pack: packName }));
      if (!root) return null;
      return [
        { label: tr("dap.export.resource_pack"), scopeRoot: root, targetRoot: `${root}/resource-packs/${packName}`, kind: "resource", insert: false },
        { label: tr("dap.export.datapack"), scopeRoot: root, targetRoot: `${root}/datapacks/${packName}`, kind: "datapack", insert: false }
      ];
    }
    if (outputMode === "both_separate") {
      const resourceParent = settings.resourcePackFolder || pickDirectory("display_anim_export_resource_parent", tr("dap.export.pick_resource", { pack: packName }));
      if (!resourceParent) return null;
      const datapackParent = settings.datapackFolder || pickDirectory("display_anim_export_datapack_parent", tr("dap.export.pick_datapack", { pack: packName }));
      if (!datapackParent) return null;
      return [
        { label: tr("dap.export.resource_pack"), scopeRoot: resourceParent, targetRoot: `${resourceParent}/${packName}`, kind: "resource", insert: false },
        { label: tr("dap.export.datapack"), scopeRoot: datapackParent, targetRoot: `${datapackParent}/${packName}`, kind: "datapack", insert: false }
      ];
    }
    const kind = outputMode === "resource_only" ? "resource" : "datapack";
    const configured = kind === "resource" ? settings.resourcePackFolder : settings.datapackFolder;
    const parent = configured || pickDirectory(
      kind === "resource" ? "display_anim_export_resource_parent" : "display_anim_export_datapack_parent",
      kind === "resource" ? tr("dap.export.pick_resource", { pack: packName }) : tr("dap.export.pick_datapack", { pack: packName })
    );
    return parent ? [{
      label: kind === "resource" ? tr("dap.export.resource_pack") : tr("dap.export.datapack"),
      scopeRoot: parent,
      targetRoot: `${parent}/${packName}`,
      kind,
      insert: false
    }] : null;
  }
  function describeTextureSizeMismatch() {
    if (!Project) return null;
    const previewTextureUuid = Project.display_anim_export_settings?.handPreviewTextureUuid;
    const mismatched = Texture.all.filter(
      (texture) => (!previewTextureUuid || texture.uuid !== previewTextureUuid) && texture[PREVIEW_TEXTURE_PROPERTY] !== true && texture.name !== "DAP_Default_Player_Skin.png" && texture.name !== "missing.png" && (texture.width !== Project.texture_width || texture.height !== Project.texture_height)
    );
    if (!mismatched.length) return null;
    return tr("dap.export.texture_mismatch", {
      project_width: Project.texture_width,
      project_height: Project.texture_height,
      textures: mismatched.map((texture) => `  ${texture.name}: ${texture.width}\xD7${texture.height}`).join("\n")
    });
  }
  function confirmWarnings(warnings) {
    if (!warnings.length) return Promise.resolve("continue");
    const boundsAnimationUuid = warnings.find((warning) => warning.boundsAnimationUuid)?.boundsAnimationUuid;
    const message = warnings.map((warning, index) => {
      const details = escapeHtml2(warning.message).replace(/\n/g, "<br>");
      return `<section style="padding:0 0 12px 12px;border-left:3px solid #e25d68;${index ? "margin-top:16px;" : ""}"><div style="color:#e25d68;font-size:15px;font-weight:700;margin-bottom:7px">\u26A0 ${index + 1}. ${escapeHtml2(warning.title)}</div><div style="line-height:1.5">${details}</div></section>`;
    }).join(`<div style="border-top:1px solid var(--color-border);margin:2px 0 14px"></div>`);
    return new Promise((resolve) => {
      const buttons = boundsAnimationUuid ? [tr("dap.export.cancel_export"), tr("dap.export.open_bounds_check"), tr("dap.export.export_anyway")] : [tr("dap.export.cancel_export"), tr("dap.export.export_anyway")];
      Blockbench.showMessageBox(
        {
          title: tr("dap.export.warnings_title"),
          message,
          icon: "warning",
          buttons,
          confirmIndex: buttons.length - 1,
          cancelIndex: 0
        },
        (button) => {
          if (boundsAnimationUuid && button === 1) {
            resolve("bounds");
          } else {
            resolve(button === buttons.length - 1 ? "continue" : "cancel");
          }
        }
      );
    });
  }
  function confirmPreflight(targets) {
    const preview = previewPacks(targets);
    if (preview.conflicts.length) {
      Blockbench.showMessageBox({
        title: tr("dap.export.conflict_title"),
        message: tr("dap.export.conflict_message", { paths: preview.conflicts.join("\n") }),
        icon: "error"
      });
      return Promise.resolve(false);
    }
    const targetsSummary = preview.targets.map((target) => `<b>${escapeHtml2(target.root)}</b><br><span style="color:#59c36a">\u25CF ${escapeHtml2(tr("dap.export.preflight_added"))}: ${target.added}</span><br><span style="color:#59c36a">\u25CF ${escapeHtml2(tr("dap.export.preflight_updated"))}: ${target.updated}</span><br><span style="color:${target.removed ? "#e25d68" : "#59c36a"}">${target.removed ? "\u26A0" : "\u25CF"} ${escapeHtml2(tr("dap.export.preflight_removed"))}: ${target.removed}</span><br><span style="color:#59c36a">\u25CF ${escapeHtml2(tr("dap.export.preflight_merged"))}: ${target.merged}</span>`).join("<br><br>");
    return new Promise((resolve) => {
      Blockbench.showMessageBox(
        {
          title: tr("dap.export.preflight_title"),
          message: tr("dap.export.preflight_message", { summary: targetsSummary }),
          icon: "rule",
          buttons: [tr("dap.export.cancel"), tr("dap.export.confirm_write")],
          confirmIndex: 1,
          cancelIndex: 0
        },
        (button) => resolve(button === 1)
      );
    });
  }
  async function runExport(form, specs, settings) {
    const defaultSpec = specs.find((spec) => spec.sourceUuid === form.default_animation);
    if (!defaultSpec) throw new Error(tr("dap.export.default_missing"));
    const packName = form.pack_name.trim();
    const projectName = form.project_name.trim();
    const displayName = form.display_name.trim() || projectName;
    const configuredBaseItem = normalizeItemId(form.base_item);
    const baseItem = settings.handRenderingEnabled ? "minecraft:player_head" : configuredBaseItem;
    const displayContexts = configuredDisplayAnimations().map(
      ({ context, animated }) => ({ context: context.id, animated })
    );
    const hasAnimatedContext = displayContexts.some((route) => route.animated);
    const sequences = [];
    const warnings = [];
    if (includesResource(form.output_mode)) {
      if (settings.handRenderingEnabled) {
        rememberExportSettingsDraft(settings);
      }
      if (!hasAnimatedContext && specs.length > 1) {
        warnings.push({
          title: tr("dap.export.no_animated_context_title"),
          message: tr("dap.export.no_animated_context_message", {
            default_animation: animationIdentity(defaultSpec)
          })
        });
      }
      const bakedSpecs = hasAnimatedContext ? specs : [defaultSpec];
      const frameCounts = new Map(bakedSpecs.map((spec) => [spec.sourceUuid, hasAnimatedContext ? spec.frameCount : 1]));
      const animationKeys = new Map(bakedSpecs.map((spec) => [spec.sourceUuid, spec.key]));
      const isolated = await runExactBoundsForExport(
        bakedSpecs.map((spec) => spec.animation),
        animationKeys,
        frameCounts,
        settings.animationFps,
        settings.exactBoundsOnExport && hasAnimatedContext,
        settings.exactBoundsOnExport,
        settings.handRenderingEnabled
      );
      if (!isolated) {
        Blockbench.showQuickMessage(tr("dap.export.cancelled"), 2500);
        return;
      }
      for (const result of isolated.sequences) {
        sequences.push({ key: result.key, sourceName: result.sourceName, frames: result.frames });
      }
      for (const spec of bakedSpecs) {
        if (spec.sourceFps !== settings.animationFps) {
          warnings.push({
            title: `${tr("dap.export.resampled_title")} \u2014 ${animationIdentity(spec)}`,
            message: tr("dap.export.resampled_message", {
              source_fps: spec.sourceFps,
              game_fps: settings.animationFps,
              frames: spec.frameCount
            })
          });
        }
        if (settings.exactBoundsOnExport) {
          const record = isolated.records.find((item) => item.animationUuid === spec.sourceUuid);
          const bounds = describeOutOfBounds(record?.hits ?? []);
          if (bounds) warnings.push({
            title: `${tr("dap.export.bounds_title")} \u2014 ${animationIdentity(spec)}`,
            message: bounds,
            boundsAnimationUuid: spec.sourceUuid
          });
        }
      }
      const textureWarning = describeTextureSizeMismatch();
      if (textureWarning) warnings.push({ title: tr("dap.export.texture_mismatch_title"), message: textureWarning });
    } else {
      warnings.push({ title: tr("dap.export.datapack_only_title"), message: tr("dap.export.datapack_only_message") });
    }
    if (settings.handRenderingEnabled && includesResource(form.output_mode)) {
      warnings.push({
        title: tr("dap.export.hand_rendering_warning_title"),
        message: tr("dap.export.hand_rendering_warning_message")
      });
      if (!includesDatapack(form.output_mode)) {
        warnings.push({
          title: tr("dap.export.hand_rendering_resource_only_title"),
          message: tr("dap.export.hand_rendering_resource_only_message")
        });
      }
    }
    const warningDecision = await confirmWarnings(warnings);
    if (warningDecision === "bounds") {
      runBoundsCheck(specs.map((spec) => spec.animation));
      return;
    }
    if (warningDecision === "cancel") {
      Blockbench.showQuickMessage(tr("dap.export.cancelled"), 2500);
      return;
    }
    const destinations = chooseDestinations(form.output_mode, form.write_mode, packName, settings);
    if (!destinations) {
      Blockbench.showQuickMessage(tr("dap.export.cancelled"), 2500);
      return;
    }
    const totalFrames = specs.reduce((sum, spec) => sum + spec.frameCount, 0);
    const resourceBuild = includesResource(form.output_mode) ? buildResourcePack(sequences, {
      packName,
      projectName,
      defaultAnimationKey: defaultSpec.key,
      displayContexts,
      handRenderingEnabled: settings.handRenderingEnabled,
      description: tr("dap.export.resource_description_multi", {
        name: displayName,
        animations: specs.length,
        frames: sequences.reduce((sum, sequence) => sum + sequence.frames.length, 0),
        fps: settings.animationFps
      })
    }) : null;
    const datapackOptions = {
      packName,
      projectName,
      baseItem,
      itemDisplayName: displayName,
      frameObjective: form.frame_objective,
      modeObjective: form.mode_objective,
      maxFrameObjective: form.max_frame_objective,
      playingTag: form.playing_tag,
      playbackFps: settings.animationFps,
      debugEnabled: settings.debugEnabled === true,
      handRenderingEnabled: settings.handRenderingEnabled,
      animations: specs.map((spec) => ({ key: spec.key, displayName: spec.sourceName, frameCount: spec.frameCount })),
      defaultAnimationKey: defaultSpec.key,
      description: tr("dap.export.datapack_description_multi", {
        name: displayName,
        animations: specs.length,
        frames: totalFrames
      })
    };
    const targets = destinations.map((destination) => ({
      scopeRoot: destination.scopeRoot,
      root: destination.targetRoot,
      kind: destination.kind,
      projectName,
      insert: destination.insert,
      files: [
        ...destination.kind === "resource" ? resourceBuild.files : buildDatapack(datapackOptions)
      ]
    }));
    if (!await confirmPreflight(targets)) {
      Blockbench.showQuickMessage(tr("dap.export.cancelled"), 2500);
      return;
    }
    const count = writePacks(targets);
    rememberExportSettings({
      selectedAnimationUuids: specs.map((spec) => spec.sourceUuid),
      defaultAnimationUuid: defaultSpec.sourceUuid,
      packName,
      projectName,
      outputMode: form.output_mode,
      writeMode: form.write_mode,
      baseItem: configuredBaseItem,
      displayName,
      frameObjective: form.frame_objective,
      modeObjective: form.mode_objective,
      maxFrameObjective: form.max_frame_objective,
      playingTag: form.playing_tag,
      debugEnabled: settings.debugEnabled === true,
      handRenderingEnabled: settings.handRenderingEnabled,
      handRigRootUuid: settings.handRigRootUuid,
      handLeftGroupUuid: settings.handLeftGroupUuid,
      handRightGroupUuid: settings.handRightGroupUuid,
      handPreviewTextureUuid: settings.handPreviewTextureUuid,
      exactBoundsOnExport: settings.exactBoundsOnExport,
      animationFps: settings.animationFps,
      sharedRoot: settings.sharedRoot,
      resourcePackFolder: settings.resourcePackFolder,
      datapackFolder: settings.datapackFolder
    });
    const report2 = resourceBuild?.report ?? null;
    const locations = destinations.map(
      (destination) => `<div style="margin-top:7px"><b>${escapeHtml2(destination.label)}\uFF1A</b><div style="margin-top:2px;overflow-wrap:anywhere">${escapeHtml2(`${destination.targetRoot}/`)}</div></div>`
    ).join("");
    const optimization = report2 ? describeOptimization(report2) : "";
    const itemModel = includesResource(form.output_mode) || includesDatapack(form.output_mode) ? tr("dap.export.item_model_id", { id: `${EXPORT_NAMESPACE}:${projectName}` }) : "";
    const tipsStatus = tr(settings.debugEnabled === true ? "dap.export.developer_tips_enabled" : "dap.export.developer_tips_disabled");
    const handStatus = tr(settings.handRenderingEnabled ? "dap.export.developer_tips_enabled" : "dap.export.developer_tips_disabled");
    Blockbench.showMessageBox({
      title: tr("dap.export.complete"),
      message: `<div style="font-size:16px;font-weight:700;color:#59c36a">\u2713 ${escapeHtml2(tr("dap.export.complete_heading"))}</div><div style="margin-top:2px">${escapeHtml2(tr("dap.export.write_success", { count }))}</div><div style="margin-top:13px;padding-top:7px;border-top:1px solid var(--color-border)"><div style="font-size:15px;font-weight:700;border-left:3px solid var(--color-accent);padding-left:7px">${escapeHtml2(tr("dap.export.output_locations"))}</div>${locations}</div>` + (optimization ? `<div style="margin-top:12px;padding-top:7px;border-top:1px solid var(--color-border)"><div style="font-size:15px;font-weight:700;border-left:3px solid var(--color-accent);padding-left:7px;margin-bottom:5px">${escapeHtml2(tr("dap.export.summary"))}</div>${optimization}</div>` : "") + `<div style="margin-top:12px;padding-top:7px;border-top:1px solid var(--color-border)"><div style="font-size:15px;font-weight:700;border-left:3px solid var(--color-accent);padding-left:7px;margin-bottom:5px">${escapeHtml2(tr("dap.export.developer_info"))}</div>` + (itemModel ? `<div>${escapeHtml2(itemModel)}</div>` : "") + `<div style="margin-top:3px">${escapeHtml2(tr("dap.export.developer_tips_status", { status: tipsStatus }))}</div><div style="margin-top:3px">${escapeHtml2(tr("dap.export.hand_rendering_status", { status: handStatus }))}</div></div>`,
      icon: "check_circle"
    });
  }
  function describeOptimization(report2) {
    const statistics = tr("dap.export.optimization_statistics", {
      sampled: report2.sampledFrames,
      unique: report2.uniqueModels,
      duplicates: report2.duplicateFrames
    });
    const modelJson = tr("dap.export.model_json_size", {
      before: formatBytes(report2.modelBytesBefore),
      after: formatBytes(report2.modelBytesAfter)
    });
    const animations = report2.animations.map((animation) => escapeHtml2(tr("dap.export.animation_report", {
      animation: `${animation.sourceName} (${animation.key})`,
      frames: animation.sampledFrames
    }))).join("<br>");
    return `<div style="font-weight:600">${escapeHtml2(tr("dap.export.space_optimization"))}</div><div style="margin-top:1px;line-height:1.3">${escapeHtml2(statistics)}</div><div style="margin-top:1px;line-height:1.3">${escapeHtml2(modelJson)}</div>` + (animations ? `<div style="margin-top:5px;line-height:1.35">${animations}</div>` : "");
  }
  function openPackConfigurationDialog(animations, initial, defaultAnimationUuid) {
    const specs = createExportAnimationSpecs(animations, initial.animationFps);
    const form = {
      pack_name: initial.packName,
      project_name: initial.projectName,
      base_item: initial.baseItem,
      display_name: initial.displayName,
      frame_objective: initial.frameObjective,
      mode_objective: initial.modeObjective,
      max_frame_objective: initial.maxFrameObjective,
      playing_tag: initial.playingTag,
      output_mode: initial.outputMode,
      write_mode: initial.writeMode,
      default_animation: defaultAnimationUuid
    };
    if (!isSafeProjectName(form.pack_name.trim()) || !isSafeProjectName(form.project_name.trim())) {
      Blockbench.showMessageBox({ title: tr("dap.export.invalid_identifier_title"), message: `${tr("dap.export.invalid_identifier_message")}

${tr("dap.export.open_settings_hint")}`, icon: "error" });
      return;
    }
    const objectives = [
      form.frame_objective,
      form.mode_objective,
      form.max_frame_objective,
      phaseObjectiveFor(form.frame_objective)
    ];
    if (objectives.some((value) => !isValidObjectiveName(value)) || new Set(objectives).size !== objectives.length || !isValidPlayingTag(form.playing_tag)) {
      Blockbench.showMessageBox({ title: tr("dap.export.failed"), message: `${tr("dap.export.objective_conflict")}

${tr("dap.export.open_settings_hint")}`, icon: "error" });
      return;
    }
    exportInProgress = true;
    void runExport(form, specs, initial).catch((error) => {
      console.error("JSB export failed", error);
      Blockbench.showMessageBox({ title: tr("dap.export.failed"), message: error.message ?? String(error), icon: "error" });
    }).finally(() => {
      exportInProgress = false;
    });
  }
  function openExportDialog() {
    if (exportInProgress) {
      Blockbench.showQuickMessage(tr("dap.export.busy"), 2e3);
      return;
    }
    const animations = Animation.all.slice();
    if (!animations.length) {
      Blockbench.showMessageBox({ title: tr("dap.export.no_animation_title"), message: tr("dap.export.no_animation_message"), icon: "error" });
      return;
    }
    const initial = initialExportSettings(animations);
    const selectedSet = new Set(initial.selectedAnimationUuids);
    const selected = animations.filter((animation) => selectedSet.has(animation.uuid));
    if (!selected.length) {
      Blockbench.showMessageBox({ title: tr("dap.export.select_title"), message: `${tr("dap.export.select_required")}

${tr("dap.export.open_settings_hint")}`, icon: "error" });
      return;
    }
    const conflicts = findAnimationKeyConflicts(selected);
    if (conflicts.length) {
      const details = conflicts.map((conflict) => tr("dap.export.key_conflict_entry", {
        key: conflict.key || tr("dap.export.invalid_key"),
        animations: conflict.animationNames.join(", ")
      })).join("\n");
      Blockbench.showMessageBox({ title: tr("dap.export.key_conflict_title"), message: `${tr("dap.export.key_conflict_message", { details })}

${tr("dap.export.open_settings_hint")}`, icon: "error" });
      return;
    }
    const defaultUuid = selectedSet.has(initial.defaultAnimationUuid) ? initial.defaultAnimationUuid : selected[0].uuid;
    openPackConfigurationDialog(selected, initial, defaultUuid);
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

  // src/project-settings-dialog.ts
  var overlay = null;
  function fieldLabel(text) {
    const label = el("label", text);
    label.style.display = "block";
    label.style.fontSize = "inherit";
    label.style.marginBottom = "5px";
    label.style.color = "var(--color-text)";
    return label;
  }
  function fieldWrap() {
    const wrap = el("div");
    wrap.style.marginBottom = "15px";
    return wrap;
  }
  function styleControl(control) {
    control.style.height = "38px";
    control.style.padding = "0 10px";
    control.style.boxSizing = "border-box";
    control.style.color = "var(--color-text)";
    control.style.background = "var(--color-back)";
    control.style.border = "1px solid var(--color-border)";
    control.style.borderRadius = "0";
    control.style.outline = "none";
    applyFocusHighlight(control);
  }
  function validationLine() {
    const line = el("div");
    line.style.fontSize = "inherit";
    line.style.marginTop = "5px";
    line.style.minHeight = "16px";
    return line;
  }
  function showValidation(line, result) {
    const colors = { valid: "#59c36a", warning: "#e6ad4f", error: "#e25d68", empty: "var(--color-subtle_text)" };
    const icons = { valid: "check_circle", warning: "warning", error: "error", empty: "info" };
    line.style.color = colors[result.state];
    line.innerHTML = `<i class="material-icons" style="font-size:14px;vertical-align:-2px;margin-right:4px">${icons[result.state]}</i>${result.message}`;
  }
  function identifierValidation(value) {
    return isSafeProjectName(value.trim()) ? { state: "valid", message: tr("dap.settings.valid_identifier") } : { state: "error", message: tr("dap.settings.invalid_identifier") };
  }
  function objectiveNameValidation(value) {
    return isValidObjectiveName(value) ? { state: "valid", message: tr("dap.settings.valid_runtime_name") } : { state: "error", message: tr("dap.settings.invalid_runtime_name") };
  }
  function playingTagValidation(value) {
    return isValidPlayingTag(value) ? { state: "valid", message: tr("dap.settings.valid_playing_tag") } : { state: "error", message: tr("dap.settings.invalid_playing_tag") };
  }
  function folderValidation(value, kind, insert, packName = "") {
    if (!value.trim()) return { state: "empty", message: tr("dap.settings.folder_optional") };
    let fs;
    try {
      fs = requireNativeModule("fs", { scope: value, message: tr("dap.permission.export"), show_permission_dialog: false });
      if (!fs || !fs.existsSync(value)) return { state: "error", message: tr("dap.settings.folder_missing") };
      fs.readdirSync(value, { withFileTypes: true });
    } catch (_error) {
      return { state: "error", message: tr("dap.settings.folder_unreadable") };
    }
    if (!insert) return { state: "valid", message: tr("dap.settings.folder_valid_parent") };
    if (kind === "shared") {
      const path2 = requireNativeModule("path");
      const resourceMeta = path2.join(value, "resource-packs", packName, "pack.mcmeta");
      const dataMeta = path2.join(value, "datapacks", packName, "pack.mcmeta");
      return fs.existsSync(resourceMeta) && fs.existsSync(dataMeta) ? { state: "valid", message: tr("dap.settings.folder_valid_shared") } : { state: "error", message: tr("dap.settings.folder_invalid_shared") };
    }
    const path = requireNativeModule("path");
    const packMeta = path.join(value, "pack.mcmeta");
    if (!fs.existsSync(packMeta)) return { state: "error", message: tr("dap.settings.folder_no_pack_meta") };
    try {
      const parsed = JSON.parse(fs.readFileSync(packMeta, "utf8"));
      if (!parsed || typeof parsed.pack !== "object") return { state: "error", message: tr("dap.settings.folder_invalid_pack_meta") };
    } catch (_error) {
      return { state: "error", message: tr("dap.settings.folder_invalid_pack_meta") };
    }
    const expected = path.join(value, kind === "resource" ? "assets" : "data");
    return fs.existsSync(expected) ? { state: "valid", message: tr("dap.settings.folder_valid_pack") } : { state: "warning", message: tr(kind === "resource" ? "dap.settings.folder_no_assets" : "dap.settings.folder_no_data") };
  }
  function textField(parent, label, value, change, validate) {
    const wrap = fieldWrap();
    wrap.appendChild(fieldLabel(label));
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    styleControl(input);
    const status = validationLine();
    input.oninput = (event) => {
      change(event.target.value);
      if (validate) showValidation(status, validate(event.target.value));
    };
    wrap.appendChild(input);
    if (validate) {
      showValidation(status, validate(value));
      wrap.appendChild(status);
    }
    parent.appendChild(wrap);
  }
  function selectField(parent, label, value, options, change, disabled = false) {
    const wrap = fieldWrap();
    wrap.appendChild(fieldLabel(label));
    const select = document.createElement("select");
    select.style.width = "100%";
    styleControl(select);
    for (const [id, title] of options) {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = title;
      select.appendChild(option);
    }
    select.value = value;
    select.disabled = disabled;
    if (disabled) select.style.opacity = "0.65";
    select.onchange = (event) => change(event.target.value);
    wrap.appendChild(select);
    parent.appendChild(wrap);
  }
  function checkboxField(parent, label, help, checked, change) {
    const wrap = fieldWrap();
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.style.marginRight = "8px";
    input.onchange = () => change(input.checked);
    const text = el("span", label);
    const row = el("label");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.cursor = "pointer";
    row.appendChild(input);
    row.appendChild(text);
    const hint = el("button", "?");
    hint.style.display = "inline-flex";
    hint.style.alignItems = "center";
    hint.style.justifyContent = "center";
    hint.style.width = "17px";
    hint.style.height = "17px";
    hint.style.marginLeft = "7px";
    hint.style.border = "1px solid var(--color-subtle_text)";
    hint.style.borderRadius = "50%";
    hint.style.fontSize = "inherit";
    hint.style.color = "var(--color-subtle_text)";
    hint.style.padding = "0";
    hint.style.cursor = "pointer";
    const helpBox = el("div", help);
    helpBox.style.display = "none";
    helpBox.style.margin = "8px 0 0 26px";
    helpBox.style.padding = "8px 10px";
    helpBox.style.background = "var(--color-back)";
    helpBox.style.borderLeft = "3px solid var(--color-accent)";
    helpBox.style.color = "var(--color-subtle_text)";
    helpBox.style.fontSize = "inherit";
    hint.onclick = () => {
      helpBox.style.display = helpBox.style.display === "none" ? "block" : "none";
    };
    row.appendChild(hint);
    wrap.appendChild(row);
    wrap.appendChild(helpBox);
    parent.appendChild(wrap);
  }
  function folderField(parent, label, value, resourceId, validate, change) {
    const wrap = fieldWrap();
    wrap.appendChild(fieldLabel(label));
    const row = el("div");
    row.style.display = "flex";
    row.style.gap = "8px";
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.placeholder = tr("dap.settings.folder_empty");
    input.style.flex = "1";
    styleControl(input);
    const status = validationLine();
    input.oninput = (event) => {
      change(event.target.value);
      showValidation(status, validate(event.target.value));
    };
    const browse = el("button", tr("dap.settings.browse"));
    browse.style.height = "38px";
    browse.style.padding = "0 18px";
    browse.style.borderRadius = "0";
    browse.onclick = () => {
      const picked = Blockbench.pickDirectory({ resource_id: resourceId, title: label });
      if (!picked) return;
      input.value = picked;
      change(picked);
      showValidation(status, validate(picked));
    };
    row.appendChild(input);
    row.appendChild(browse);
    wrap.appendChild(row);
    showValidation(status, validate(value));
    wrap.appendChild(status);
    parent.appendChild(wrap);
  }
  function pageTitle(parent, title, description) {
    const heading = el("h2", title);
    heading.style.margin = "0 0 6px";
    parent.appendChild(heading);
    const note = el("p", description);
    note.style.color = "var(--color-subtle_text)";
    note.style.margin = "0 0 20px";
    parent.appendChild(note);
  }
  function copyableCode(parent, title, description, value) {
    const wrap = fieldWrap();
    const heading = el("div", title);
    heading.style.fontWeight = "600";
    heading.style.marginBottom = "7px";
    wrap.appendChild(heading);
    const note = el("div", description);
    note.style.marginBottom = "7px";
    note.style.color = "var(--color-subtle_text)";
    note.style.fontSize = "inherit";
    wrap.appendChild(note);
    const row = el("div");
    row.style.display = "flex";
    row.style.alignItems = "stretch";
    const code = document.createElement("textarea");
    code.value = value;
    code.readOnly = true;
    code.style.flex = "1";
    code.style.margin = "0";
    code.style.padding = "10px 12px";
    code.style.background = "var(--color-back)";
    code.style.border = "1px solid var(--color-border)";
    code.style.resize = "vertical";
    code.style.minHeight = `${Math.max(44, value.split("\n").length * 22 + 18)}px`;
    code.style.color = "var(--color-text)";
    code.style.fontFamily = "var(--font-code), monospace";
    code.style.boxSizing = "border-box";
    const copy = el("button");
    copy.innerHTML = `<i class="material-icons" style="font-size:18px">content_copy</i>`;
    copy.title = tr("dap.settings.copy");
    copy.style.width = "44px";
    copy.style.borderRadius = "0";
    copy.onclick = () => {
      const clipboard = requireNativeModule("clipboard", {
        message: tr("dap.settings.clipboard_permission")
      });
      if (!clipboard) {
        Blockbench.showQuickMessage(tr("dap.settings.copy_failed"), 2e3);
        return;
      }
      clipboard.writeText(value);
      Blockbench.showQuickMessage(tr("dap.settings.copied"), 1500);
    };
    row.appendChild(code);
    row.appendChild(copy);
    wrap.appendChild(row);
    parent.appendChild(wrap);
  }
  function disposeProjectSettingsDialog() {
    overlay?.remove();
    overlay = null;
  }
  function openProjectSettingsDialog() {
    disposeProjectSettingsDialog();
    if (!Project) {
      Blockbench.showQuickMessage(tr("dap.settings.no_project"), 2e3);
      return;
    }
    const animations = Animation.all.slice();
    const settings = initialExportSettings(animations);
    const persist = () => rememberExportSettingsDraft(settings);
    overlay = el("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "10000";
    overlay.style.background = "rgba(0,0,0,.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    const shell = el("div");
    shell.id = "dap-project-settings-shell";
    shell.style.width = "900px";
    shell.style.maxWidth = "92vw";
    shell.style.height = "650px";
    shell.style.maxHeight = "88vh";
    shell.style.background = "var(--color-ui)";
    shell.style.border = "1px solid var(--color-border)";
    shell.style.boxShadow = "0 12px 50px rgba(0,0,0,.55)";
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.borderRadius = "0";
    const scopedStyle = el("style");
    scopedStyle.innerHTML = `
    #dap-project-settings-shell .dap-sidebar-button:hover,
    #dap-project-settings-shell .dap-sidebar-button:focus {
      color: var(--color-text) !important;
      background: var(--color-selected) !important;
    }
    #dap-project-settings-shell .dap-sidebar-button:hover *,
    #dap-project-settings-shell .dap-sidebar-button:focus * {
      color: inherit !important;
    }
    #dap-project-settings-shell .dap-hand-card {
      border: 1px solid var(--color-border);
      background: var(--color-back);
      padding: 16px;
    }
    #dap-project-settings-shell .dap-hand-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 14px;
      margin-top: 14px;
    }
    #dap-project-settings-shell .dap-hand-grid > div {
      margin-bottom: 0 !important;
    }
    #dap-project-settings-shell .dap-hand-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 14px;
      margin-top: 14px;
      border-top: 1px solid var(--color-border);
    }
    #dap-project-settings-shell .dap-hand-actions button {
      height: 34px;
      padding: 0 12px;
      margin: 0;
    }
  `;
    shell.appendChild(scopedStyle);
    const header = el("div", tr("dap.settings.title"));
    header.style.fontSize = "18px";
    header.style.fontWeight = "600";
    header.style.padding = "15px 18px";
    header.style.borderBottom = "1px solid var(--color-border)";
    shell.appendChild(header);
    const body = el("div");
    body.style.display = "flex";
    body.style.flex = "1";
    body.style.minHeight = "0";
    const sidebar = el("div");
    sidebar.style.width = "190px";
    sidebar.style.padding = "0";
    sidebar.style.background = "var(--color-back)";
    sidebar.style.borderRight = "1px solid var(--color-border)";
    const content2 = el("div");
    content2.style.flex = "1";
    content2.style.padding = "24px 28px";
    content2.style.overflowY = "auto";
    body.appendChild(sidebar);
    body.appendChild(content2);
    shell.appendChild(body);
    const renderHands = () => {
      pageTitle(content2, tr("dap.settings.page.hands"), tr("dap.settings.hands_desc"));
      checkboxField(
        content2,
        tr("dap.settings.hand_rendering"),
        tr("dap.settings.hand_rendering_help"),
        settings.handRenderingEnabled,
        (value) => {
          settings.handRenderingEnabled = value;
          if (value) ensureHandRig(settings);
          else setHandRigVisibility(settings);
          persist();
          content2.innerHTML = "";
          renderHands();
        }
      );
      const versionNotice = el("div", tr("dap.hand.skin_version_help"));
      versionNotice.className = "dap-hand-version-notice";
      versionNotice.style.cssText = "margin:12px 0;padding:12px;border:1px solid var(--color-warning);border-radius:6px;";
      content2.appendChild(versionNotice);
      if (!settings.handRenderingEnabled) return;
      const shaderNotice = el("div");
      shaderNotice.className = "dap-hand-shader-notice";
      shaderNotice.style.cssText = "margin:12px 0;padding:12px;border:1px solid var(--color-warning);border-radius:6px;";
      const shaderBadge = el("strong", tr("dap.hand.shader_incompatible"));
      shaderBadge.style.color = "var(--color-warning)";
      shaderNotice.appendChild(shaderBadge);
      shaderNotice.appendChild(el("p", tr("dap.hand.shader_incompatible_help")));
      content2.appendChild(shaderNotice);
      const actions = el("div");
      actions.className = "dap-hand-actions";
      const actionButton = (label, click, danger = false) => {
        const button = el("button", label);
        if (danger) {
          button.style.color = "#e25d68";
          button.style.marginLeft = "auto";
        }
        button.onclick = click;
        actions.appendChild(button);
      };
      actionButton(tr("dap.hand.delete"), () => {
        Blockbench.showMessageBox({
          title: tr("dap.hand.delete_title"),
          message: tr("dap.hand.delete_message"),
          icon: "warning",
          buttons: [tr("dap.export.cancel"), tr("dap.hand.delete_confirm")],
          confirmIndex: 1,
          cancelIndex: 0
        }, (button) => {
          if (button !== 1) return;
          deleteHandRig(settings);
          settings.handRenderingEnabled = false;
          persist();
          content2.innerHTML = "";
          renderHands();
        });
      }, true);
      content2.appendChild(actions);
    };
    const pages = [
      ["settings", tr("dap.settings.page.general"), function renderGeneral() {
        pageTitle(content2, tr("dap.settings.page.general"), tr("dap.settings.general_desc"));
        textField(content2, tr("dap.export.pack_name"), settings.packName, (v) => {
          settings.packName = v;
          persist();
        }, identifierValidation);
        textField(content2, tr("dap.export.project_name"), settings.projectName, (v) => {
          settings.projectName = v;
          persist();
        }, identifierValidation);
        selectField(
          content2,
          tr("dap.export.base_item"),
          settings.handRenderingEnabled ? "minecraft:player_head" : settings.baseItem,
          VANILLA_ITEM_IDS.map((id) => [`minecraft:${id}`, `minecraft:${id}`]),
          (v) => {
            settings.baseItem = v;
            persist();
          },
          settings.handRenderingEnabled
        );
        textField(content2, tr("dap.export.display_name"), settings.displayName, (v) => {
          settings.displayName = v;
          persist();
        });
        checkboxField(content2, tr("dap.settings.developer_tips"), tr("dap.settings.developer_tips_help"), settings.debugEnabled === true, (v) => {
          settings.debugEnabled = v;
          persist();
        });
      }],
      ["pan_tool", tr("dap.settings.page.hands"), renderHands],
      ["animation", tr("dap.settings.page.animations"), function renderAnimations() {
        pageTitle(content2, tr("dap.settings.page.animations"), tr("dap.settings.animations_desc"));
        const selectedAnimations = animations.filter((animation) => settings.selectedAnimationUuids.includes(animation.uuid));
        const conflicts = findAnimationKeyConflicts(selectedAnimations);
        const selectionStatus = validationLine();
        showValidation(selectionStatus, !selectedAnimations.length ? { state: "error", message: tr("dap.settings.animations_empty") } : conflicts.length ? { state: "error", message: tr("dap.settings.animations_invalid", { details: conflicts.map((item) => `${item.key || tr("dap.export.invalid_key")}: ${item.animationNames.join(", ")}`).join("; ") }) } : { state: "valid", message: tr("dap.settings.animations_valid", { count: selectedAnimations.length }) });
        selectionStatus.style.marginBottom = "12px";
        content2.appendChild(selectionStatus);
        checkboxField(
          content2,
          tr("dap.settings.exact_bounds_export"),
          tr("dap.settings.exact_bounds_export_help"),
          settings.exactBoundsOnExport,
          (value) => {
            settings.exactBoundsOnExport = value;
            persist();
          }
        );
        const modelFingerprint = modelBoundsFingerprint();
        for (const animation of animations) {
          const row = fieldWrap();
          row.style.padding = "10px";
          row.style.border = "1px solid var(--color-border)";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = settings.selectedAnimationUuids.includes(animation.uuid);
          checkbox.onchange = () => {
            settings.selectedAnimationUuids = checkbox.checked ? [.../* @__PURE__ */ new Set([...settings.selectedAnimationUuids, animation.uuid])] : settings.selectedAnimationUuids.filter((uuid) => uuid !== animation.uuid);
            if (!settings.selectedAnimationUuids.includes(settings.defaultAnimationUuid)) settings.defaultAnimationUuid = settings.selectedAnimationUuids[0] ?? "";
            persist();
            content2.innerHTML = "";
            renderAnimations();
          };
          row.appendChild(checkbox);
          const label = el("span", ` ${animation.name}  \u2192  ${animationKeyFromName(animation.name) || tr("dap.export.invalid_key")}`);
          label.style.flex = "1";
          row.appendChild(label);
          const status = detectionStatus(Project, animation, modelFingerprint);
          const statusKey = status.exact ? status.exact.hits.length ? "dap.bounds.status.exact_failed" : "dap.bounds.status.exact_passed" : status.quick ? status.quick.hits.length ? "dap.bounds.status.quick_failed" : "dap.bounds.status.quick_passed" : status.stale ? "dap.bounds.status.stale" : "dap.bounds.status.unchecked";
          const badge = el("span", tr(statusKey));
          badge.style.fontSize = "inherit";
          badge.style.color = status.exact || status.quick ? "var(--color-accent)" : "var(--color-subtle_text)";
          row.style.display = "flex";
          row.style.alignItems = "center";
          row.style.gap = "7px";
          row.appendChild(badge);
          content2.appendChild(row);
        }
        if (selectedAnimations.length) {
          selectField(content2, tr("dap.export.default_animation"), settings.defaultAnimationUuid, selectedAnimations.map((a) => [a.uuid, `${a.name} (${animationKeyFromName(a.name)})`]), (v) => {
            settings.defaultAnimationUuid = v;
            persist();
          });
        }
      }],
      ["folder", tr("dap.settings.page.files"), function renderFiles() {
        pageTitle(content2, tr("dap.settings.page.files"), tr("dap.settings.files_desc"));
        const rerender = () => {
          content2.innerHTML = "";
          renderFiles();
        };
        selectField(content2, tr("dap.export.write_mode"), settings.writeMode, [
          ["create", tr("dap.export.write_mode.create")],
          ["insert", tr("dap.export.write_mode.insert")]
        ], (v) => {
          settings.writeMode = v;
          persist();
          rerender();
        });
        selectField(content2, tr("dap.export.output"), settings.outputMode, [
          ["both_default", tr("dap.export.mode.both_default")],
          ["both_separate", tr("dap.export.mode.both_separate")],
          ["resource_only", tr("dap.export.mode.resource_only")],
          ["datapack_only", tr("dap.export.mode.datapack_only")]
        ], (v) => {
          settings.outputMode = v;
          persist();
          rerender();
        });
        if (settings.outputMode === "both_default") {
          folderField(content2, tr("dap.settings.shared_root"), settings.sharedRoot, "display_anim_settings_shared", (v) => folderValidation(v, "shared", settings.writeMode === "insert", settings.packName), (v) => {
            settings.sharedRoot = v;
            persist();
          });
        } else {
          if (settings.outputMode !== "datapack_only") {
            folderField(content2, tr("dap.settings.resource_folder"), settings.resourcePackFolder, "display_anim_settings_resource", (v) => folderValidation(v, "resource", settings.writeMode === "insert"), (v) => {
              settings.resourcePackFolder = v;
              persist();
            });
          }
          if (settings.outputMode !== "resource_only") {
            folderField(content2, tr("dap.settings.datapack_folder"), settings.datapackFolder, "display_anim_settings_datapack", (v) => folderValidation(v, "datapack", settings.writeMode === "insert"), (v) => {
              settings.datapackFolder = v;
              persist();
            });
          }
        }
      }],
      ["database", tr("dap.settings.page.datapack"), () => {
        pageTitle(content2, tr("dap.settings.page.datapack"), tr("dap.settings.datapack_desc"));
        textField(content2, tr("dap.export.frame_objective"), settings.frameObjective, (v) => {
          settings.frameObjective = v;
          persist();
        }, objectiveNameValidation);
        textField(content2, tr("dap.export.mode_objective"), settings.modeObjective, (v) => {
          settings.modeObjective = v;
          persist();
        }, objectiveNameValidation);
        textField(content2, tr("dap.export.max_frame_objective"), settings.maxFrameObjective, (v) => {
          settings.maxFrameObjective = v;
          persist();
        }, objectiveNameValidation);
        textField(content2, tr("dap.export.playing_tag"), settings.playingTag, (v) => {
          settings.playingTag = v;
          persist();
        }, playingTagValidation);
      }],
      ["code", tr("dap.settings.page.api"), () => {
        pageTitle(content2, tr("dap.settings.page.api"), tr("dap.settings.api_desc"));
        const project = settings.projectName || "<project>";
        const animationPlaceholder = `<${tr("dap.settings.api_animation_placeholder")}>`;
        const playerPlaceholder = `<${tr("dap.settings.api_player_placeholder")}>`;
        copyableCode(content2, tr("dap.settings.api_item"), tr("dap.settings.api_item_note"), `${EXPORT_NAMESPACE}:${project}`);
        copyableCode(content2, tr("dap.settings.api_common"), tr("dap.settings.api_common_note"), `/function ${EXPORT_NAMESPACE}:${project}/give
/function ${EXPORT_NAMESPACE}:${project}/stop`);
        copyableCode(content2, tr("dap.settings.api_short"), tr("dap.settings.api_short_note"), `/function ${EXPORT_NAMESPACE}:${project}/play/${animationPlaceholder}
/function ${EXPORT_NAMESPACE}:${project}/loop/${animationPlaceholder}
/function ${EXPORT_NAMESPACE}:${project}/frame/${animationPlaceholder} {frame:12}`);
        copyableCode(content2, tr("dap.settings.api_macro"), tr("dap.settings.api_macro_note"), `/function ${EXPORT_NAMESPACE}:${project}/play {animation:"${animationPlaceholder}",mode:"once"}
/function ${EXPORT_NAMESPACE}:${project}/play {animation:"${animationPlaceholder}",mode:"loop"}
/function ${EXPORT_NAMESPACE}:${project}/frame {animation:"${animationPlaceholder}",frame:12}`);
        copyableCode(content2, tr("dap.settings.api_context"), tr("dap.settings.api_context_note"), `execute as ${playerPlaceholder} run function ${EXPORT_NAMESPACE}:${project}/play/${animationPlaceholder}`);
        const reference = el("p", tr("dap.settings.api_reference", { project }));
        reference.style.color = "var(--color-subtle_text)";
        reference.style.lineHeight = "1.55";
        content2.appendChild(reference);
      }]
    ];
    const sidebarButtons = [];
    let activePage = 0;
    const showPage = (index, render) => {
      activePage = index;
      content2.innerHTML = "";
      sidebarButtons.forEach((button, buttonIndex) => {
        button.style.background = buttonIndex === index ? "var(--color-selected)" : "transparent";
        button.style.borderLeft = buttonIndex === index ? "5px solid var(--color-accent)" : "5px solid transparent";
        button.style.color = buttonIndex === index ? "var(--color-text)" : "var(--color-subtle_text)";
      });
      render();
    };
    pages.forEach(([icon, title, render], index) => {
      const button = el("button");
      button.className = "dap-sidebar-button";
      button.innerHTML = `<i class="material-icons" style="font-size:18px">${icon}</i><span>${title}</span>`;
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.gap = "9px";
      button.style.width = "100%";
      button.style.height = "50px";
      button.style.padding = "0 18px";
      button.style.marginBottom = "0";
      button.style.textAlign = "left";
      button.style.border = "0";
      button.style.borderLeft = "5px solid transparent";
      button.style.borderRadius = "0";
      button.onmouseenter = () => {
        button.style.color = "var(--color-text)";
        if (activePage !== index) button.style.background = "var(--color-back)";
      };
      button.onmouseleave = () => {
        button.style.color = activePage === index ? "var(--color-text)" : "var(--color-subtle_text)";
        button.style.background = activePage === index ? "var(--color-selected)" : "transparent";
      };
      button.onclick = () => showPage(index, render);
      sidebarButtons.push(button);
      sidebar.appendChild(button);
    });
    const footer = el("div");
    footer.style.padding = "10px 18px";
    footer.style.borderTop = "1px solid var(--color-border)";
    footer.style.display = "flex";
    footer.style.justifyContent = "space-between";
    footer.appendChild(el("span", tr("dap.settings.saved_hint")));
    const close = el("button", tr("dap.settings.close"));
    close.style.minWidth = "96px";
    close.style.height = "38px";
    close.style.borderRadius = "0";
    close.onclick = disposeProjectSettingsDialog;
    footer.appendChild(close);
    shell.appendChild(footer);
    overlay.appendChild(shell);
    document.body.appendChild(overlay);
    showPage(0, pages[0][2]);
  }

  // src/plugin.ts
  var OPEN_ACTION_ID = "display_anim_preview_open_action";
  var CHECK_BOUNDS_ACTION_ID = "display_anim_preview_check_bounds";
  var EXPORT_ACTION_ID = "display_anim_preview_export_packs";
  var SETTINGS_ACTION_ID = "display_anim_preview_project_settings";
  var TOOLS_MENU_ID = "display_anim_preview_tools";
  var FIRST_PERSON_ACTION_ID = "display_anim_first_person_open";
  var firstPersonAction = null;
  var openAction = null;
  var checkBoundsAction = null;
  var exportAction = null;
  var settingsAction = null;
  var toolsMenu = null;
  function openNewProjectPreview(data) {
    const event = data;
    if (event?.project?.format?.id === FORMAT_ID) openControlPanel();
  }
  Plugin.register("display_anim_preview", {
    title: isChineseOnlyBuild() ? "Java \u9010\u5E27\u663E\u793A\u52A8\u753B" : "Java Display Animator",
    author: "rieyi",
    description: isChineseOnlyBuild() ? "\u6309\u663E\u793A\u4F4D\u7F6E\u9884\u89C8 Minecraft Java \u9010\u5E27\u70D8\u7119\u7269\u54C1\u52A8\u753B\uFF0C\u5E76\u5C06\u591A\u6BB5\u52A8\u753B\u5BFC\u51FA\u4E3A\u5B8C\u6574\u8D44\u6E90\u5305\u548C\u52A8\u753B\u9A71\u52A8\u6570\u636E\u5305\u3002" : "Preview frame-baked Minecraft Java item animations per display context and export multiple animations as complete resource packs and animation-driving datapacks.",
    ...true ? {} : { about: isChineseOnlyBuild() ? ABOUT_ZH : ABOUT_EN },
    icon: "icon.png",
    tags: ["Minecraft: Java Edition", "Animation", "Exporter"],
    version: "1.1.2",
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
      registerHandRigProperties();
      registerDisplayAnimationProperty();
      registerExportAnimationSettingsProperty();
      registerModelFormat();
      Blockbench.on("new_project", openNewProjectPreview);
      initializePlaybackSync();
      registerFirstPersonPanel();
      firstPersonAction = new Action(FIRST_PERSON_ACTION_ID, {
        name: tr("dap.fp.open"),
        description: tr("dap.fp.open_desc"),
        icon: "visibility",
        category: "animation",
        condition: () => Modes.selected.id === "animate" && [FORMAT_ID, "java_block_sequence"].includes(Format.id),
        click: openFirstPersonPanel
      });
      const firstPersonIndex = Toolbars.timeline.children.findIndex(
        (item) => (typeof item === "string" ? item : item.id) === FIRST_PERSON_ACTION_ID
      );
      Toolbars.timeline.children = Toolbars.timeline.children.filter(
        (item) => (typeof item === "string" ? item : item.id) !== FIRST_PERSON_ACTION_ID
      );
      Toolbars.timeline.add(firstPersonAction, firstPersonIndex < 0 ? void 0 : firstPersonIndex);
      MenuBar.addAction(firstPersonAction, "animation");
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
        click: () => runBoundsCheck()
      });
      exportAction = new Action(EXPORT_ACTION_ID, {
        name: tr("dap.action.export"),
        description: tr("dap.action.export_desc"),
        icon: "inventory_2",
        category: "animation",
        click: openExportDialog
      });
      settingsAction = new Action(SETTINGS_ACTION_ID, {
        name: tr("dap.action.settings"),
        description: tr("dap.action.settings_desc"),
        icon: "tune",
        category: "animation",
        click: openProjectSettingsDialog
      });
      MenuBar.addAction(exportAction, "file.export");
      toolsMenu = new Action(TOOLS_MENU_ID, {
        name: tr("dap.menu.name"),
        icon: "movie",
        searchable: false,
        children: [settingsAction, openAction, firstPersonAction, checkBoundsAction, "_", exportAction]
      });
      MenuBar.addAction(toolsMenu, "tools");
    },
    onunload() {
      Blockbench.removeListener("new_project", openNewProjectPreview);
      toolsMenu?.delete();
      toolsMenu = null;
      firstPersonAction?.delete();
      firstPersonAction = null;
      disposeFirstPersonPanel();
      disposeControlPanel();
      disposePlaybackSync();
      disposeProjectSettingsDialog();
      disposeBoundsCheckPanel();
      openAction?.delete();
      openAction = null;
      checkBoundsAction?.delete();
      checkBoundsAction = null;
      exportAction?.delete();
      exportAction = null;
      settingsAction?.delete();
      settingsAction = null;
      unregisterModelFormat();
      unregisterDisplayAnimationProperty();
      unregisterExportAnimationSettingsProperty();
      unregisterHandRigProperties();
    }
  });
})();
