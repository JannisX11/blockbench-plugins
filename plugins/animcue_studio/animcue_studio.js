/* SPDX-License-Identifier: LGPL-3.0-or-later */
(() => {
"use strict";
const Locale = (() => {
    const PREFIX = 'animcue_studio';

    const DICT = {
        en: {
            plugin_title: 'AnimCue Studio',
            plugin_description: 'Animate multiple models and a scene camera on one Blockbench timeline, with PAL / MoreRotation bend support.',
            format_name: 'AnimCue Scene',
            format_description: 'Multi-texture scene format for AnimCue interactive animations.',
            panel_title: 'AnimCue',
            menu_root: 'AnimCue',
            menu_add_participant: 'Add Actor',
            menu_import_bbmodel: 'Model File (.bbmodel / .geo.json)...',
            menu_import_pal_player: 'PAL Bend Player',
            menu_import_pal_dragoncore: 'PAL DragonCore Player',
            menu_import_vanilla: 'Vanilla Entity...',
            menu_add_camera: 'Add Camera',
            menu_edit_participant: 'Edit Actor...',
            menu_place_viewport: 'Place at Frame 0',
            menu_set_start_pos: 'Start Position (Frame 0)...',
            menu_import_actor_anim: 'Import Animation onto Actor...',
            menu_add_event: 'Add Event Marker...',
            menu_show_tracks: 'Show Active Tracks',
            menu_import_scene: 'AnimCue Animation...',
            menu_export_scene: 'AnimCue Animation...',
            menu_export_selected: 'Export Selected Animation...',
            menu_export_all: 'Export All Animations...',
            menu_new_scene: 'AnimCue Scene',
            menu_select_root: 'Select Root',
            menu_duplicate_participant: 'Duplicate',
            menu_remove_participant: 'Remove',
            menu_look_camera: 'Look Through Camera',
            toolbar_import: 'Import AnimCue Animation',
            toolbar_export: 'Export AnimCue Animation',
            kind_model: 'Model',
            kind_entity: 'Entity',
            kind_block: 'Block',
            kind_item: 'Item',
            rig_auto: 'Auto',
            rig_generic: 'Bedrock',
            rig_pal_player: 'PAL Bend',
            rig_pal_dragoncore: 'DragonCore',
            badge_pal_linked: 'PAL {version}',
            badge_pal_standalone: 'Built-in Bend',
            badge_subject: 'Subject',
            badge_pal: 'PAL',
            badge_dragoncore: 'DragonCore',
            badge_camera: 'Camera',
            panel_no_project: 'Open a rigged model, or create a new AnimCue Scene.',
            panel_create_scene: 'New Scene',
            panel_subject_label: 'Subject',
            panel_subject_unnamed: 'Untitled',
            panel_participants_heading: 'Actors',
            panel_footer_actor_one: '1 actor',
            panel_footer_actor_many: '{count} actors',
            panel_empty_participants: 'No actors yet. Click + above to add a model or player.',
            panel_camera_heading: 'Camera',
            panel_camera_none: 'No camera',
            panel_camera_ready: 'Camera track',
            panel_btn_add: 'Add Actor',
            panel_btn_add_file: 'Model File',
            panel_btn_add_pal: 'PAL Player',
            panel_btn_add_dc: 'DragonCore',
            panel_btn_add_vanilla: 'Vanilla',
            panel_btn_add_camera: 'Add Camera',
            panel_btn_event: 'Add Event',
            panel_btn_tracks: 'Show Active Tracks',
            panel_btn_import: 'Import',
            panel_btn_export: 'Export',
            tip_toggle_vis: 'Toggle visibility',
            tip_select_root: 'Select root',
            tip_place_zero: 'Move at Frame 0',
            tip_start_pos: 'Exact Frame 0 position',
            tip_import_anim: 'Import animation onto actor',
            tip_edit: 'Edit actor',
            tip_move_up: 'Move up',
            tip_move_down: 'Move down',
            tip_duplicate: 'Duplicate',
            tip_remove: 'Remove',
            tip_more: 'More actions',
            tip_look_camera: 'Look through camera',
            tip_place_camera: 'Move camera',
            tip_pal_linked: 'Linked with PAL Bend Player Tools (PAL, MoreRotation, DragonCore & Emote).',
            tip_pal_standalone: 'PAL Bend Player Tools not installed. Basic *_bend export still works.',
            dialog_participant_add_file: 'Add Actor',
            dialog_participant_add_pal: 'Add PAL Player',
            dialog_participant_add_dc: 'Add DragonCore Player',
            dialog_participant_add_vanilla: 'Add Vanilla Entity',
            dialog_participant_edit: 'Edit Actor',
            field_role: 'Role',
            field_role_desc: 'Used to bind this actor in code (cannot be "primary").',
            field_type: 'Asset Type',
            field_id: 'Asset ID',
            field_id_desc: 'Resource ID in namespace:path format.',
            field_rig_mode: 'Rig Mode',
            field_initial_offset: 'Frame 0 Offset',
            field_initial_offset_desc: 'Optional starting offset in model units (16 = 1 block).',
            field_texture_optional: 'Texture (.png)',
            dialog_geo_texture_title: 'Select Texture',
            dialog_geo_texture_msg: 'Load a .png texture for this geometry now, or skip.',
            btn_choose_texture: 'Load Texture...',
            btn_skip_texture: 'Skip',
            dialog_vanilla_title: 'Vanilla Entity Template',
            field_vanilla_search: 'Search...',
            field_vanilla_entry: 'Entity',
            dialog_start_pos_title: 'Start Position (Frame 0)',
            dialog_event_title: 'Add Event Marker',
            field_event_name: 'Event',
            field_event_time: 'Time (s)',
            field_event_desc: 'Written to the primary animation timeline.',
            dialog_export_title: 'Export AnimCue Animation',
            field_export_scope: 'Scope',
            scope_selected: 'Selected ({name})',
            scope_all: 'All ({count})',
            field_export_static: 'Include unkeyed visible actors at Frame 0',
            field_export_camera: 'Include camera track',
            field_export_primary_pal: 'Convert subject with PAL / MoreRotation',
            field_export_summary: 'Summary',
            export_summary_text: '{clips} clip(s), {participants} actor(s), Camera: {camera}, PAL: {pal}',
            export_yes: 'Yes',
            export_no: 'No',
            export_file_type: 'AnimCue Animation',
            dialog_import_scene_title: 'Import AnimCue Animation',
            dialog_import_missing_title: 'Missing Roles',
            dialog_import_missing_msg: 'Imported {clips} clip(s). Roles not in this scene: {roles}.',
            dialog_confirm_remove_title: 'Remove Actor',
            dialog_confirm_remove_msg: 'Remove "{role}" from this scene?',
            dialog_confirm_remove_camera: 'Remove the scene camera?',
            msg_scene_copied: 'Opened multi-texture copy "{name}".',
            msg_scene_created: 'Created new AnimCue scene.',
            msg_participant_added: 'Added "{role}".',
            msg_participant_removed: 'Removed "{role}".',
            msg_camera_added: 'Added scene camera.',
            msg_camera_aligned: 'Aligned to camera ({time}s).',
            msg_event_inserted: 'Added event "{name}" at {time}s.',
            msg_exported: 'Exported {name}.',
            msg_imported_scene: 'Imported {clips} clip(s), {matched} actor track(s){extra}.',
            msg_imported_actor: 'Imported {clips} clip(s) onto "{role}" ({profile}).',
            msg_pal_plugin_required: 'Install "PAL Bend Player Tools" to add built-in PAL / DragonCore players or import .emote files.',
            err_switch_back_project: 'Switch back to the AnimCue project first.',
            err_switch_back_anim: 'Switch back to the original animation first.',
            err_no_project: 'Open or create a rigged model project first.',
            err_select_participant: 'Select an actor in the AnimCue panel or Outliner.',
            err_role_invalid: 'Enter a role name other than "primary".',
            err_type_invalid: 'Select a valid asset type.',
            err_id_invalid: 'Asset ID must use namespace:path format.',
            err_role_duplicate: 'Role "{role}" already exists.',
            err_max_participants: 'At most 64 actors are supported per animation.',
            err_invalid_bbmodel: 'Select a valid .bbmodel or Bedrock .geo.json file.',
            err_empty_model: 'The selected model has no bones or elements.',
            err_duplicate_bone: 'Duplicate or reserved bone name "{name}".',
            err_nested_scene: 'Select a single model, not another AnimCue scene.',
            err_unsupported_element: 'Unsupported element type "{type}".',
            err_create_participant_failed: 'Failed to add actor "{role}".',
            err_scene_copy_failed: 'Could not create multi-texture scene copy.',
            err_root_not_top_level: 'Move actor root groups back to the top level of the Outliner.',
            err_no_animation: 'Create or select an animation first.',
            err_duplicate_anim_name: 'Duplicate animation name "{name}".',
            err_duplicate_display_bone: 'Duplicate bone name in Outliner: "{name}".',
            err_nested_participant_root: 'Actor root groups must stay at the top level.',
            err_global_rotation: '{role} / {bone} uses global rotation (relative_to). Use local rotation or the actor root.',
            err_invalid_time: 'Invalid keyframe time "{time}".',
            err_empty_keyframe: 'Keyframe has no value.',
            err_unsupported_lerp: 'Unsupported interpolation "{mode}".',
            err_vector_length: 'Vector must have 3 numbers [X, Y, Z].',
            err_numeric_required: 'Actor tracks only support numeric keyframes.',
            err_invalid_coords: 'Enter valid numbers for X, Y, and Z.',
            err_event_empty: 'Enter an event name.',
            err_invalid_json: 'Invalid JSON: {message}',
            err_not_animcue_file: 'File has no "animations" field.',
            err_vanilla_offline: 'Could not load CEM templates. Import a local .bbmodel or .geo.json instead.',
            err_vanilla_missing: 'Template "{id}" not found.',
            err_vanilla_no_format: 'OptiFine entity format is unavailable in this Blockbench build.',
            err_vanilla_select: 'Select a template.',
            err_no_camera: 'Add a camera first.',
            err_camera_invalid_channel: 'Camera / {channel}: {message}',
            err_emote_needs_pal: 'Importing .emote files requires "PAL Bend Player Tools".'
        },
        zh: {
            plugin_title: 'AnimCue 合拍',
            plugin_description: '在同一时间轴制作多角色互动动画与镜头轨道，支持 PAL / MoreRotation 弯曲骨骼。',
            format_name: '合拍场景 (AnimCue)',
            format_description: '支持多贴图与多角色同轴编辑的合拍动画场景。',
            panel_title: '合拍场景',
            menu_root: '合拍 (AnimCue)',
            menu_add_participant: '添加角色',
            menu_import_bbmodel: '模型文件 (.bbmodel / .geo.json)...',
            menu_import_pal_player: 'PAL 弯曲玩家',
            menu_import_pal_dragoncore: 'PAL 龙核玩家',
            menu_import_vanilla: '原版实体模板...',
            menu_add_camera: '添加镜头',
            menu_edit_participant: '编辑角色...',
            menu_place_viewport: '第 0 帧摆位',
            menu_set_start_pos: '设置起始坐标 (0s)...',
            menu_import_actor_anim: '导入动画到该角色...',
            menu_add_event: '插入事件标记...',
            menu_show_tracks: '展开当前轨道',
            menu_import_scene: '合拍动画 (.animation.json)...',
            menu_export_scene: '合拍动画 (.animation.json)...',
            menu_export_selected: '导出当前动画...',
            menu_export_all: '导出全部动画...',
            menu_new_scene: '合拍场景 (AnimCue)',
            menu_select_root: '选中根组',
            menu_duplicate_participant: '复制角色',
            menu_remove_participant: '移除角色',
            menu_look_camera: '预览镜头视角',
            toolbar_import: '导入合拍动画',
            toolbar_export: '导出合拍动画',
            kind_model: '模型',
            kind_entity: '实体',
            kind_block: '方块',
            kind_item: '物品',
            rig_auto: '自动',
            rig_generic: '基岩骨骼',
            rig_pal_player: 'PAL 弯曲',
            rig_pal_dragoncore: '龙核玩家',
            badge_pal_linked: 'PAL {version}',
            badge_pal_standalone: '基础弯曲',
            badge_subject: '主体',
            badge_pal: 'PAL',
            badge_dragoncore: '龙核',
            badge_camera: '镜头',
            panel_no_project: '先打开带骨骼的模型，或新建一个合拍场景。',
            panel_create_scene: '新建场景',
            panel_subject_label: '主体',
            panel_subject_unnamed: '未命名',
            panel_participants_heading: '角色列表',
            panel_footer_actor_one: '1 个角色',
            panel_footer_actor_many: '{count} 个角色',
            panel_empty_participants: '还没有参与者，点上方 + 号添加模型或玩家。',
            panel_camera_heading: '镜头',
            panel_camera_none: '未添加镜头',
            panel_camera_ready: '镜头轨道',
            panel_btn_add: '添加角色',
            panel_btn_add_file: '模型文件',
            panel_btn_add_pal: 'PAL 玩家',
            panel_btn_add_dc: '龙核玩家',
            panel_btn_add_vanilla: '原版实体',
            panel_btn_add_camera: '添加镜头',
            panel_btn_event: '插事件',
            panel_btn_tracks: '展开轨道',
            panel_btn_import: '导入',
            panel_btn_export: '导出',
            tip_toggle_vis: '显示 / 隐藏',
            tip_select_root: '选中根组',
            tip_place_zero: '第 0 帧摆位',
            tip_start_pos: '输入第 0 帧坐标',
            tip_import_anim: '导入动画到该角色（PAL / Emote / 龙核 / 基岩）',
            tip_edit: '编辑角色',
            tip_move_up: '上移顺序',
            tip_move_down: '下移顺序',
            tip_duplicate: '复制一份',
            tip_remove: '移除',
            tip_more: '更多操作',
            tip_look_camera: '按当前帧预览镜头视角',
            tip_place_camera: '移动镜头',
            tip_pal_linked: '已连接 PAL Bend Player Tools（支持 PAL、MoreRotation、龙核与 Emote）。',
            tip_pal_standalone: '未安装 PAL Bend Player Tools，仍可使用基础 *_bend 导出。',
            dialog_participant_add_file: '添加角色',
            dialog_participant_add_pal: '添加 PAL 弯曲玩家',
            dialog_participant_add_dc: '添加龙核玩家',
            dialog_participant_add_vanilla: '添加原版实体',
            dialog_participant_edit: '编辑角色',
            field_role: '角色名',
            field_role_desc: '代码绑定用的名称（不能填 primary）。',
            field_type: '素材类型',
            field_id: '资源 ID',
            field_id_desc: '格式：namespace:path。',
            field_rig_mode: '骨骼模式',
            field_initial_offset: '第 0 帧偏移',
            field_initial_offset_desc: '可选起始位移（模型单位，16 = 1 格）。',
            field_texture_optional: '贴图 (.png)',
            dialog_geo_texture_title: '选择贴图',
            dialog_geo_texture_msg: '现在为这个模型指定一张 .png 贴图，或者先跳过。',
            btn_choose_texture: '选择贴图...',
            btn_skip_texture: '跳过',
            dialog_vanilla_title: '原版实体模板',
            field_vanilla_search: '搜索实体...',
            field_vanilla_entry: '实体',
            dialog_start_pos_title: '起始坐标 (0s)',
            dialog_event_title: '插入事件标记',
            field_event_name: '事件名',
            field_event_time: '时间 (秒)',
            field_event_desc: '写入主动画 timeline 轨道。',
            dialog_export_title: '导出合拍动画',
            field_export_scope: '范围',
            scope_selected: '当前动画（{name}）',
            scope_all: '全部动画（{count} 个）',
            field_export_static: '包含无关键帧的可见角色（写入第 0 帧静止位）',
            field_export_camera: '导出镜头轨道',
            field_export_primary_pal: '主体按 PAL / MoreRotation 转换',
            field_export_summary: '摘要',
            export_summary_text: '{clips} 个动画，{participants} 个角色，镜头：{camera}，PAL：{pal}',
            export_yes: '是',
            export_no: '否',
            export_file_type: '合拍动画',
            dialog_import_scene_title: '导入合拍动画',
            dialog_import_missing_title: '部分角色未匹配',
            dialog_import_missing_msg: '已导入 {clips} 个动画，场景中缺少这些角色：{roles}。',
            dialog_confirm_remove_title: '移除角色',
            dialog_confirm_remove_msg: '确定移除角色「{role}」？',
            dialog_confirm_remove_camera: '确定移除场景镜头？',
            msg_scene_copied: '已新建多贴图副本「{name}」。',
            msg_scene_created: '已新建合拍场景。',
            msg_participant_added: '已添加「{role}」。',
            msg_participant_removed: '已移除「{role}」。',
            msg_camera_added: '已添加镜头。',
            msg_camera_aligned: '已对齐到 {time}s 镜头视角。',
            msg_event_inserted: '已在 {time}s 插入事件「{name}」。',
            msg_exported: '已导出 {name}。',
            msg_imported_scene: '已导入 {clips} 个动画，匹配 {matched} 组角色轨道{extra}。',
            msg_imported_actor: '已向「{role}」导入 {clips} 个动画（{profile}）。',
            msg_pal_plugin_required: '请先安装并启用「PAL Bend Player Tools」插件以使用内置 PAL / 龙核玩家或导入 .emote。',
            err_switch_back_project: '请先切回刚才的合拍工程。',
            err_switch_back_anim: '请先切回刚才的动画。',
            err_no_project: '请先打开或新建带骨骼的模型工程。',
            err_select_participant: '请先在合拍面板或大纲中选中一个角色。',
            err_role_invalid: '请填写角色名（不能用 primary）。',
            err_type_invalid: '请选择有效的素材类型。',
            err_id_invalid: '资源 ID 必须是 namespace:path 格式。',
            err_role_duplicate: '角色「{role}」已存在。',
            err_max_participants: '单个动画最多支持 64 个角色。',
            err_invalid_bbmodel: '请选择有效的 .bbmodel 或 Bedrock .geo.json 文件。',
            err_empty_model: '模型里没有骨骼或方块。',
            err_duplicate_bone: '骨骼名重复或受保留：「{name}」。',
            err_nested_scene: '请导入单个模型，不要嵌套导入合拍场景。',
            err_unsupported_element: '当前场景不支持部件类型「{type}」。',
            err_create_participant_failed: '无法添加角色「{role}」。',
            err_scene_copy_failed: '无法创建多贴图场景副本。',
            err_root_not_top_level: '请把角色根组移回大纲顶层。',
            err_no_animation: '请先新建或选中一个动画。',
            err_duplicate_anim_name: '动画名重复：「{name}」。',
            err_duplicate_display_bone: '大纲里有重名骨骼：「{name}」。',
            err_nested_participant_root: '角色根组必须在大纲顶层。',
            err_global_rotation: '{role} / {bone} 使用了全局旋转，请改用局部旋转或角色根组。',
            err_invalid_time: '无效时间：{time}。',
            err_empty_keyframe: '关键帧没有数值。',
            err_unsupported_lerp: '运行端不支持插值「{mode}」。',
            err_vector_length: '向量需要 3 个数字 [X, Y, Z]。',
            err_numeric_required: '角色轨道只支持数值关键帧。',
            err_invalid_coords: '请填写有效的 X、Y、Z 数值。',
            err_event_empty: '请填写事件名。',
            err_invalid_json: 'JSON 解析失败：{message}',
            err_not_animcue_file: '文件里没有 animations 字段。',
            err_vanilla_offline: '暂时连不上 CEM 模板库，可以先导入本地 .bbmodel 或 .geo.json。',
            err_vanilla_missing: '找不到模板「{id}」。',
            err_vanilla_no_format: '当前 Blockbench 不支持 OptiFine 实体模板。',
            err_vanilla_select: '请先选一个模板。',
            err_no_camera: '请先添加镜头。',
            err_camera_invalid_channel: '镜头 / {channel}：{message}',
            err_emote_needs_pal: '导入 .emote 需要安装「PAL Bend Player Tools」插件。'
        }
    };

    function keyOf(key) {
        return `${PREFIX}.${key}`;
    }

    function code() {
        if (typeof Language !== 'undefined' && Language?.code) return String(Language.code).toLowerCase();
        if (typeof navigator !== 'undefined') {
            const raw = (navigator.languages && navigator.languages[0]) || navigator.language;
            if (raw) return String(raw).toLowerCase().replace(/-\w+$/, '');
        }
        return 'en';
    }

    function register() {
        if (typeof Language === 'undefined' || typeof Language.addTranslations !== 'function') return;
        const wrap = table => Object.fromEntries(Object.entries(table).map(([k, v]) => [keyOf(k), v]));
        Language.addTranslations('en', wrap(DICT.en));
        Language.addTranslations('zh', wrap(DICT.zh));
        Language.addTranslations('zh_tw', wrap(DICT.zh));
    }

    function fallback(key) {
        const table = code().startsWith('zh') ? DICT.zh : DICT.en;
        return table[key] ?? DICT.en[key] ?? key;
    }

    function t(key, params = {}) {
        const fb = fallback(key);
        const template = typeof tl === 'function' ? tl(keyOf(key), undefined, fb) : fb;
        return String(template).replace(/\{(\w+)\}/g, (_m, name) => (params[name] === undefined ? '' : String(params[name])));
    }

    return {register, t, code, keyOf};
})();

const PalBridge = (() => {
    const HELPER_SUFFIX = '_bend';
    const BEND_HELPERS = {
        torso: 'torso_bend',
        right_arm: 'right_arm_bend',
        left_arm: 'left_arm_bend',
        right_leg: 'right_leg_bend',
        left_leg: 'left_leg_bend'
    };
    const DRAGONCORE_MARKERS = new Set([
        'Body_Lower', 'Right_Arm_Lower', 'Left_Arm_Lower', 'Right_Leg_Lower', 'Left_Leg_Lower'
    ]);
    const listeners = new Set();
    let boundReady = null;
    let boundUnload = null;

    function api() {
        return globalThis.PalBendPlayerToolsAPI?.apiVersion >= 1 ? globalThis.PalBendPlayerToolsAPI : null;
    }

    function isAvailable() {
        return Boolean(api());
    }

    function version() {
        return api()?.version || '';
    }

    function notify() {
        for (const fn of listeners) {
            try { fn(isAvailable()); } catch (error) { console.warn('[AnimCue] PalBridge listener error', error); }
        }
    }

    function onChange(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    }

    function register() {
        if (typeof Blockbench !== 'undefined' && typeof Blockbench.on === 'function') {
            boundReady = () => notify();
            boundUnload = () => notify();
            Blockbench.on('pal_bend_player_tools_ready', boundReady);
            Blockbench.on('pal_bend_player_tools_unloaded', boundUnload);
        }
        return {
            delete() {
                if (typeof Blockbench !== 'undefined' && typeof Blockbench.removeListener === 'function') {
                    if (boundReady) Blockbench.removeListener('pal_bend_player_tools_ready', boundReady);
                    if (boundUnload) Blockbench.removeListener('pal_bend_player_tools_unloaded', boundUnload);
                }
                boundReady = null;
                boundUnload = null;
                listeners.clear();
            }
        };
    }

    function collectSubtreeEntries(rootGroup) {
        const entries = [];
        function walk(group, parentOriginal) {
            for (const child of group.children ?? []) {
                if (!(child instanceof Group)) continue;
                const name = child[Participants.boneKey] || child.name;
                entries.push({
                    name,
                    parentName: parentOriginal || null,
                    origin: Array.isArray(child.origin) ? child.origin.slice(0, 3) : [0, 0, 0]
                });
                walk(child, name);
            }
        }
        walk(rootGroup, null);
        return entries;
    }

    function collectPrimaryEntries() {
        const entries = [];
        function walk(nodes, parentOriginal) {
            for (const node of nodes ?? []) {
                if (!(node instanceof Group)) continue;
                if (node[Participants.slotKey]?.role || node[SceneCameraRig.cameraKey]) continue;
                const name = node.name;
                entries.push({
                    name,
                    parentName: parentOriginal || null,
                    origin: Array.isArray(node.origin) ? node.origin.slice(0, 3) : [0, 0, 0]
                });
                walk(node.children, name);
            }
        }
        walk(Outliner.root, null);
        return entries;
    }

    function fallbackDetectEntries(entries) {
        const names = new Set(entries.map(item => String(item.name || '').trim()));
        const lower = new Set(Array.from(names, n => n.toLowerCase()));
        if (Array.from(names).some(n => DRAGONCORE_MARKERS.has(n))) {
            return {preset: 'dragoncore', rig: null, hasBendHelpers: true, source: 'builtin_fallback'};
        }
        const hasHelper = Object.values(BEND_HELPERS).some(h => lower.has(h));
        if (hasHelper) {
            return {preset: 'player', rig: null, hasBendHelpers: true, source: 'builtin_fallback'};
        }
        return null;
    }

    function detectEntries(entries) {
        const bridge = api();
        if (bridge) {
            const detected = bridge.detectRig(entries);
            if (detected) return {...detected, source: 'pal_plugin'};
        }
        return fallbackDetectEntries(entries);
    }

    function detectParticipantRig(rootGroup) {
        if (!rootGroup) return null;
        const slot = rootGroup[Participants.slotKey];
        if (slot?.rigMode === 'generic') return null;
        const detected = detectEntries(collectSubtreeEntries(rootGroup));
        if (slot?.rigMode === 'pal_player') {
            return detected || {preset: 'player', rig: api()?.getPresetRig('player') || null, hasBendHelpers: true, source: isAvailable() ? 'pal_plugin' : 'builtin_fallback'};
        }
        if (slot?.rigMode === 'pal_dragoncore') {
            return detected || {preset: 'dragoncore', rig: api()?.getPresetRig('dragoncore') || null, hasBendHelpers: true, source: isAvailable() ? 'pal_plugin' : 'builtin_fallback'};
        }
        return detected;
    }

    function detectPrimaryRig() {
        if (typeof Project === 'undefined' || !Project) return null;
        const marker = Project.pal_bend_player_tools_rig;
        const entries = collectPrimaryEntries();
        const detected = detectEntries(entries);
        if (marker === 'dragoncore' || marker === 'dragoncore_compatible') {
            return detected || {preset: 'dragoncore', rig: api()?.getPresetRig('dragoncore') || null, hasBendHelpers: true, source: isAvailable() ? 'pal_plugin' : 'builtin_fallback'};
        }
        if (marker === 'player') {
            return detected || {preset: 'player', rig: api()?.getPresetRig('player') || null, hasBendHelpers: true, source: isAvailable() ? 'pal_plugin' : 'builtin_fallback'};
        }
        return detected;
    }

    function getPresetGeometry(preset) {
        const bridge = api();
        if (!bridge) throw new Error(Locale.t('msg_pal_plugin_required'));
        return bridge.getPresetGeometry(preset);
    }

    function getDefaultTexture() {
        const bridge = api();
        return bridge ? bridge.getDefaultTexture() : null;
    }

    function mirrorVec3(vec, channel) {
        const out = [Number(vec[0]) || 0, Number(vec[1]) || 0, Number(vec[2]) || 0];
        if (channel === 'rotation' || channel === 'bend') {
            out[0] = cleanZero(-out[0]);
            out[1] = cleanZero(-out[1]);
        } else if (channel === 'position') {
            out[0] = cleanZero(-out[0]);
        }
        return out;
    }

    function cleanZero(n) {
        return Math.abs(n) < 1e-6 ? 0 : Math.round(n * 1e6) / 1e6;
    }

    function mapCurveVec3(curve, transform) {
        if (Array.isArray(curve)) return transform(curve);
        if (typeof curve === 'number') return transform([curve, 0, 0]);
        if (!curve || typeof curve !== 'object') return curve;
        if (Object.hasOwn(curve, 'pre') || Object.hasOwn(curve, 'post')) {
            const out = {};
            if (curve.pre !== undefined) out.pre = mapCurveVec3(curve.pre, transform);
            if (curve.post !== undefined) out.post = mapCurveVec3(curve.post, transform);
            if (curve.lerp_mode !== undefined) out.lerp_mode = curve.lerp_mode;
            return out;
        }
        const result = {};
        for (const [t, frame] of Object.entries(curve)) {
            result[t] = mapCurveVec3(frame, transform);
        }
        return result;
    }

    function fallbackExportBones(bones) {
        const out = {};
        let needsMoreRotation = false;
        const copy = structuredClone(bones || {});
        for (const [rawName, track] of Object.entries(copy)) {
            const name = rawName.toLowerCase();
            if (name.endsWith(HELPER_SUFFIX)) continue;
            const target = {};
            for (const ch of ['position', 'rotation', 'scale', 'bend']) {
                if (track[ch] !== undefined) target[ch] = mapCurveVec3(track[ch], v => mirrorVec3(v, ch));
            }
            if (Object.keys(target).length) out[name] = target;
        }
        for (const [rawName, track] of Object.entries(copy)) {
            const name = rawName.toLowerCase();
            if (!name.endsWith(HELPER_SUFFIX) || track.rotation === undefined) continue;
            const base = name.slice(0, -HELPER_SUFFIX.length);
            const bendCurve = mapCurveVec3(track.rotation, v => {
                const mirrored = mirrorVec3(v, 'bend');
                if (Math.abs(mirrored[1]) > 1e-6 || Math.abs(mirrored[2]) > 1e-6) needsMoreRotation = true;
                return mirrored;
            });
            out[base] = out[base] || {};
            out[base].bend = bendCurve;
        }
        return {bones: out, format: needsMoreRotation ? 'more_rotation' : 'pal_original', needsMoreRotation};
    }

    function exportTracks(animationName, bones, rigInfo, options = {}) {
        const bridge = api();
        if (bridge) {
            return bridge.exportBoneTracks(animationName, bones, {
                preset: rigInfo?.preset || 'player',
                rig: rigInfo?.rig || undefined,
                length: options.length ?? 0,
                loop: options.loop,
                animcueStrict: options.animcueStrict !== false,
                preserveBodyRoot: Boolean(options.preserveBodyRoot)
            });
        }
        return fallbackExportBones(bones);
    }

    function fallbackImportBones(inputData) {
        if (inputData?.emote) throw new Error(Locale.t('err_emote_needs_pal'));
        const animations = {};
        for (const [name, anim] of Object.entries(inputData?.animations ?? {})) {
            const bones = {};
            for (const [rawName, track] of Object.entries(anim?.bones ?? {})) {
                const boneName = rawName.toLowerCase();
                const out = {};
                for (const ch of ['position', 'rotation', 'scale']) {
                    if (track[ch] !== undefined) out[ch] = mapCurveVec3(track[ch], v => mirrorVec3(v, ch));
                }
                if (Object.keys(out).length) bones[boneName] = out;
                if (track.bend !== undefined) {
                    const helper = BEND_HELPERS[boneName] || (boneName + HELPER_SUFFIX);
                    const bendTrack = track.bend?.rotation !== undefined ? track.bend.rotation : track.bend;
                    bones[helper] = bones[helper] || {};
                    bones[helper].rotation = mapCurveVec3(bendTrack, v => mirrorVec3(v, 'bend'));
                }
            }
            animations[name] = {...anim, bones};
        }
        return {animations, profile: 'builtin_fallback', profileLabel: Locale.t('badge_pal_standalone')};
    }

    function importTracks(inputData, rigInfo, options = {}) {
        const bridge = api();
        if (bridge) {
            return bridge.importBoneTracks(inputData, {
                targetPreset: rigInfo?.preset || 'player',
                targetRig: rigInfo?.rig || undefined,
                fileName: options.fileName || 'animation'
            });
        }
        return fallbackImportBones(inputData);
    }

    return {
        register,
        onChange,
        isAvailable,
        version,
        detectParticipantRig,
        detectPrimaryRig,
        getPresetGeometry,
        getDefaultTexture,
        exportTracks,
        importTracks
    };
})();

const SceneProject = (() => {
    const formatId = 'animcue_scene';

    function register() {
        const format = new ModelFormat(formatId, {
            ...Formats.free,
            id: formatId,
            name: Locale.t('format_name'),
            description: Locale.t('format_description'),
            icon: 'movie_creation',
            category: 'minecraft',
            show_on_start_screen: true,
            show_in_new_list: true,
            single_texture: false,
            single_texture_default: false,
            per_texture_uv_size: true,
            box_uv: false,
            optional_box_uv: true,
            bone_rig: true,
            centered_grid: true,
            rotate_cubes: true,
            animation_mode: true,
            animation_files: true,
            texture_meshes: true,
            bone_binding_expression: true,
            molang: true,
            codec: Codecs.project,
            animation_codec: AnimationCodec.codecs.bedrock
        });
        format.new = () => {
            createBlankScene();
            return true;
        };
        return format;
    }

    function createBlankScene() {
        newProject(Formats[formatId]);
        Project.name = 'animcue_scene';
        Project.saved = false;
        Blockbench.showQuickMessage(Locale.t('msg_scene_created'), 2600);
        StudioPanel.refresh();
    }

    function ensureMultiTextureScene() {
        if (!Format?.single_texture) return false;
        const original = Project;
        const activeTexture = Texture.getDefault()?.uuid;
        const preservedPalRig = original.pal_bend_player_tools_rig || '';
        const suffix = Locale.code().startsWith('zh') ? ' · 合拍' : ' · AnimCue';
        const baseName = original.name || Locale.t('panel_subject_unnamed');
        const label = baseName.endsWith(suffix) ? baseName : baseName + suffix;
        const snapshot = Codecs.project.compile({raw: true, bitmaps: true, absolute_paths: true});
        snapshot.meta.backup = true;
        for (const animation of snapshot.animations ?? []) delete animation.path;
        for (const controller of snapshot.animation_controllers ?? []) delete controller.path;
        Codecs.project.load(snapshot, {path: original.save_path || '', no_file: true});
        if (Project === original) throw new Error(Locale.t('err_scene_copy_failed'));
        Texture.all.find(texture => texture.uuid === activeTexture)?.select();
        Formats[formatId].convertTo();
        if (preservedPalRig) Project.pal_bend_player_tools_rig = preservedPalRig;
        Project.name = label;
        Project.saved = false;
        Blockbench.showQuickMessage(Locale.t('msg_scene_copied', {name: label}), 4200);
        return true;
    }

    function captureModeState() {
        return {
            modeId: Mode?.selected?.id || null,
            clipName: Animation?.selected?.name || null,
            time: typeof Timeline !== 'undefined' ? (Timeline.time || 0) : 0,
            wasPlaying: typeof Timeline !== 'undefined' && Boolean(Timeline.playing)
        };
    }

    function enterSafeEditMode(state) {
        if (state.wasPlaying && typeof Timeline !== 'undefined' && typeof Timeline.pause === 'function') {
            Timeline.pause();
        }
        if (typeof Modes !== 'undefined' && !Modes.edit && Modes.options?.edit && Format?.edit_mode !== false) {
            Modes.options.edit.select();
        }
    }

    function restoreModeState(state) {
        if (!state?.modeId || typeof Modes === 'undefined') return;
        const targetMode = Modes.options?.[state.modeId];
        if (!targetMode || Mode?.selected === targetMode) {
            if (Modes.animate && Animation?.selected && typeof Animator !== 'undefined') Animator.preview();
            return;
        }
        if (state.modeId === 'animate' && !Format?.animation_mode) return;
        if (typeof targetMode.condition === 'function' && !targetMode.condition()) return;
        targetMode.select();
        if (state.modeId === 'animate') {
            const clip = (state.clipName && Animation.all.find(a => a.name === state.clipName))
                || Animation.selected
                || Animation.all[0];
            if (clip) clip.select();
            if (typeof Timeline !== 'undefined' && typeof Timeline.setTime === 'function') {
                Timeline.setTime(state.time);
            }
            if (typeof Animator !== 'undefined') Animator.preview();
        }
    }

    function withEditMode(fn) {
        const state = captureModeState();
        enterSafeEditMode(state);
        try {
            return fn();
        } finally {
            restoreModeState(state);
        }
    }

    async function withEditModeAsync(fn) {
        const state = captureModeState();
        enterSafeEditMode(state);
        try {
            return await fn();
        } finally {
            restoreModeState(state);
        }
    }

    return {register, createBlankScene, ensureMultiTextureScene, withEditMode, withEditModeAsync, formatId};
})();

const SceneCameraRig = (() => {
    const cameraKey = 'animcue_camera';

    function register() {
        return new Property(Group, 'boolean', cameraKey, {default: false});
    }

    function find() {
        return Group.all.find(group => Boolean(group[cameraKey])) || null;
    }

    function add() {
        const existing = find();
        if (existing) {
            existing.select();
            return existing;
        }
        const camera = SceneProject.withEditMode(() => {
            const undoGroups = [];
            const undoElements = [];
            Undo.initEdit({outliner: true, groups: undoGroups, elements: undoElements, selection: true});
            const cam = new Group({
                name: 'animcue_camera',
                origin: [0, 0, 0],
                rotation: [0, 0, 0],
                color: 5,
                export: false
            }).init();
            cam[cameraKey] = true;

            // Lightweight non-exported camera body & lens guide placed behind z=0 so lookThrough() at origin is never occluded.
            const body = new Cube({
                name: 'camera_body',
                from: [-2.5, -1.8, -6.5],
                to: [2.5, 1.8, -2],
                color: 5,
                export: false
            }).addTo(cam).init();
            const lens = new Cube({
                name: 'camera_lens',
                from: [-1.2, -1.2, -2],
                to: [1.2, 1.2, -0.3],
                color: 5,
                export: false
            }).addTo(cam).init();
            const top = new Cube({
                name: 'camera_top',
                from: [-0.9, 1.8, -5.5],
                to: [0.9, 2.8, -2.8],
                color: 5,
                export: false
            }).addTo(cam).init();
            for (const cube of [body, lens, top]) {
                for (const face of Object.values(cube.faces ?? {})) face.texture = false;
            }

            cam.isOpen = false;
            undoGroups.push(cam);
            undoElements.push(body, lens, top);
            cam.select();
            Undo.finishEdit('Add AnimCue scene camera');
            Canvas.updateAll();
            return cam;
        });

        if (Animation.selected) {
            const track = Animation.selected.getBoneAnimator(camera);
            if (!track.position.length) track.createKeyframe({x: 0, y: 26, z: -48}, 0, 'position', false);
            track.addToTimeline();
            if (Modes.animate) Animator.preview();
        }
        Blockbench.showQuickMessage(Locale.t('msg_camera_added'), 3000);
        StudioPanel.refresh();
        return camera;
    }

    function remove() {
        const camera = find();
        if (!camera) return;
        SceneProject.withEditMode(() => {
            const groups = [camera];
            const elements = camera.children.slice();
            const animations = (Animation.all ?? []).filter(clip => Boolean(clip.animators?.[camera.uuid]));
            Undo.initEdit({outliner: true, groups, elements, selection: true, animations});
            for (const clip of animations) {
                if (clip.animators?.[camera.uuid]) clip.removeAnimator(camera.uuid);
            }
            camera.remove(false);
            groups.length = 0;
            elements.length = 0;
            Undo.finishEdit('Remove AnimCue scene camera');
            Canvas.updateAllBones?.();
        });
        StudioPanel.refresh();
    }

    function focusForAnimate() {
        const camera = find() || add();
        const clip = Animation.selected || Participants.ensureDefaultAnimation();
        Modes.options.animate.select();
        clip.select();
        if (Timeline.playing) Timeline.pause();
        camera.select();
        const track = clip.getBoneAnimator(camera);
        track.addToTimeline();
        track.expanded = true;
        BarItems.move_tool?.select();
        Animator.preview();
    }

    function lookThrough() {
        const camera = find();
        if (!camera) throw new Error(Locale.t('err_no_camera'));
        const preview = Preview.selected;
        if (!preview?.camera || !preview?.controls) return;
        if (Modes.animate && Animation.selected) Animator.preview();
        camera.mesh.updateWorldMatrix(true, false);
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        camera.mesh.getWorldPosition(worldPos);
        camera.mesh.getWorldQuaternion(worldQuat);
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuat).normalize();
        const target = worldPos.clone().addScaledVector(forward, 24);
        preview.camera.position.copy(worldPos);
        preview.controls.target.copy(target);
        preview.controls.update();
        const sec = Math.round((Timeline.time || 0) * 100) / 100;
        Blockbench.showQuickMessage(Locale.t('msg_camera_aligned', {time: sec}), 2200);
    }

    return {register, find, add, remove, focusForAnimate, lookThrough, cameraKey};
})();

const Participants = (() => {
    const slotKey = 'animcue_participant';
    const boneKey = 'animcue_bone_name';
    const resourceId = /^[a-z0-9_.-]+:[a-z0-9/._-]+$/;

    function register() {
        return [
            new Property(Group, 'object', slotKey),
            new Property(Group, 'string', boneKey)
        ];
    }

    function roots() {
        return Outliner.root.filter(node => node instanceof Group && Boolean(node[slotKey]?.role));
    }

    function findByRole(role) {
        return roots().find(group => group[slotKey]?.role === role) || null;
    }

    function rootOf(node) {
        let current = node;
        while (current && current !== 'root') {
            if (current instanceof Group && current.parent === 'root' && current[slotKey]?.role) return current;
            current = current.parent;
        }
        return null;
    }

    function selectedRoot() {
        const found = rootOf(Group.first_selected ?? Outliner.selected[0]);
        if (!found) throw new Error(Locale.t('err_select_participant'));
        return found;
    }

    function uniqueRole(base) {
        const clean = String(base || 'actor')
            .toLowerCase()
            .replace(/[^a-z0-9_.-]+/g, '_')
            .replace(/^_+|_+$/g, '') || 'actor';
        const stem = clean === 'primary' ? 'actor' : clean;
        const existing = new Set(roots().map(group => group[slotKey]?.role));
        if (!existing.has(stem)) return stem;
        let idx = 2;
        while (existing.has(`${stem}_${idx}`)) idx += 1;
        return `${stem}_${idx}`;
    }

    function guessDefaults(fileName, data) {
        const stem = String(fileName || 'actor')
            .split(/[\\/]/)
            .pop()
            .replace(/(\.geo\.json|\.bbmodel|\.json)$/i, '');
        const groupNames = collectRawGroupNames(data);
        const lower = new Set(groupNames.map(n => n.toLowerCase()));
        const isDragoncore = groupNames.some(n => n === 'Body_Lower' || n === 'Right_Arm_Lower');
        const isPalPlayer = isDragoncore || (lower.has('torso_bend') && lower.has('right_arm_bend'));
        const isVanillaPlayer = lower.has('head') && lower.has('left_arm') && lower.has('right_arm') && lower.has('left_leg');
        if (isPalPlayer || isVanillaPlayer) {
            return {
                role: uniqueRole(isPalPlayer ? 'player' : stem),
                type: 'entity',
                id: 'minecraft:player',
                rigMode: isDragoncore ? 'pal_dragoncore' : (isPalPlayer ? 'pal_player' : 'auto')
            };
        }
        const safePath = stem.toLowerCase().replace(/[^a-z0-9_.-]+/g, '_').replace(/^_+|_+$/g, '') || 'actor';
        return {
            role: uniqueRole(safePath),
            type: 'model',
            id: `minecraft:${safePath}`,
            rigMode: 'auto'
        };
    }

    function collectRawGroupNames(data) {
        const names = [];
        if (Array.isArray(data?.groups)) {
            for (const g of data.groups) if (g?.name) names.push(g.name);
        } else if (Array.isArray(data?.outliner)) {
            const walk = list => {
                for (const item of list ?? []) {
                    if (item && typeof item === 'object') {
                        if (item.name) names.push(item.name);
                        walk(item.children);
                    }
                }
            };
            walk(data.outliner);
        } else if (Array.isArray(data?.['minecraft:geometry'])) {
            for (const bone of data['minecraft:geometry'][0]?.bones ?? []) {
                if (bone?.name) names.push(bone.name);
            }
        }
        return names;
    }

    function describe(input, editing) {
        const role = String(input.role ?? '').trim();
        const id = String(input.id ?? '').trim();
        const type = input.type || 'model';
        const rigMode = ['auto', 'generic', 'pal_player', 'pal_dragoncore'].includes(input.rigMode)
            ? input.rigMode : 'auto';
        if (!role || role === 'primary') throw new Error(Locale.t('err_role_invalid'));
        if (!['model', 'entity', 'block', 'item'].includes(type)) throw new Error(Locale.t('err_type_invalid'));
        if (!resourceId.test(id)) throw new Error(Locale.t('err_id_invalid'));
        if (roots().some(group => group !== editing && group[slotKey].role === role)) {
            throw new Error(Locale.t('err_role_duplicate', {role}));
        }
        if (!editing && roots().length >= 64) throw new Error(Locale.t('err_max_participants'));
        return {role, type, id, rigMode};
    }

    function importProject(data, path, input, options = {}) {
        const slot = describe(input);
        if (!data?.meta || !Array.isArray(data.outliner) || !Array.isArray(data.elements ?? data.cubes)) {
            throw new Error(Locale.t('err_invalid_bbmodel'));
        }
        if (!data.outliner.length) throw new Error(Locale.t('err_empty_model'));

        const source = structuredClone(data);
        const sourceFormat = Formats[source.meta.model_format]
            ?? (source.meta.bone_rig ? Formats.bedrock_old : Formats.java_block);
        const model = {
            meta: source.meta,
            resolution: source.resolution ?? {width: 16, height: 16},
            elements: source.elements ?? source.cubes,
            textures: source.textures ?? [],
            texture_groups: source.texture_groups,
            outliner: source.outliner,
            groups: source.groups
        };

        const group = SceneProject.withEditMode(() => {
            SceneProject.ensureMultiTextureScene();

            const uuid = guid();
            const used = new Set(Group.all.map(g => g.name));
            const displayName = uniqueName(slot.role, used);
            const anchor = {
                name: displayName,
                uuid,
                origin: [0, 0, 0],
                rotation: [0, 0, 0],
                [slotKey]: slot
            };
            const sourceNames = new Set();

            function tag(g) {
                const original = g[boneKey] || g.name;
                if (!original || original === 'interactive_animation:root' || sourceNames.has(original)) {
                    throw new Error(Locale.t('err_duplicate_bone', {name: original}));
                }
                if (g[slotKey]?.role) throw new Error(Locale.t('err_nested_scene'));
                sourceNames.add(original);
                g[boneKey] = original;
                g.name = uniqueName(displayName + '_' + original, used);
            }

            if (Array.isArray(model.groups)) {
                model.groups.forEach(tag);
                model.groups.push(anchor);
                model.outliner = [{uuid, children: model.outliner}];
            } else {
                const walk = nodes => {
                    for (const node of nodes ?? []) {
                        if (typeof node !== 'object' || !node) continue;
                        tag(node);
                        walk(node.children);
                    }
                };
                walk(model.outliner);
                model.outliner = [{...anchor, children: model.outliner}];
            }

            preserveTextures(model, sourceFormat);
            for (const element of model.elements) {
                if (element.type && !OutlinerElement.isTypePermitted(element.type)) {
                    throw new Error(Locale.t('err_unsupported_element', {type: element.type}));
                }
            }
            Codecs.project.merge(model, path || '');
            const merged = Group.all.find(bone => bone.uuid === uuid);
            if (!merged || merged[slotKey]?.role !== slot.role) {
                throw new Error(Locale.t('err_create_participant_failed', {role: slot.role}));
            }
            return merged;
        });

        const offset = parseOffsetVector(options.initialOffset);
        if (offset && (offset[0] !== 0 || offset[1] !== 0 || offset[2] !== 0)) {
            const clip = Animation.selected || ensureDefaultAnimation();
            const track = clip.getBoneAnimator(group);
            track.createKeyframe({x: offset[0], y: offset[1], z: offset[2]}, 0, 'position', false);
            if (Modes.animate) Animator.preview();
        }

        Blockbench.showQuickMessage(Locale.t('msg_participant_added', {role: slot.role}), 2800);
        StudioPanel.refresh();
        return group;
    }

    async function compileBedrockGeometry(geoJson, textureInfo, targetProject) {
        if (Project !== targetProject) throw new Error(Locale.t('err_switch_back_project'));
        if (!Formats.bedrock || !Codecs.bedrock) throw new Error(Locale.t('err_invalid_bbmodel'));
        return SceneProject.withEditModeAsync(async () => {
            const existingProjects = new Set(ModelProject.all);
            try {
                newProject(Formats.bedrock);
                if (typeof Codecs.bedrock.parseGeometry === 'function' && Array.isArray(geoJson?.['minecraft:geometry'])) {
                    Codecs.bedrock.parseGeometry({object: structuredClone(geoJson['minecraft:geometry'][0])}, {
                        switch_to_existing_tab: false
                    });
                } else {
                    Codecs.bedrock.parse(structuredClone(geoJson), '');
                }
                if (textureInfo?.dataURL) {
                    const tex = new Texture({
                        name: textureInfo.name || 'texture.png',
                        keep_size: true,
                        uv_width: textureInfo.width || Project.texture_width || 64,
                        uv_height: textureInfo.height || Project.texture_height || 64
                    });
                    await new Promise(resolve => {
                        let done = false;
                        const finish = () => {
                            if (done) return;
                            done = true;
                            resolve();
                        };
                        tex.load_callback = finish;
                        tex.fromDataURL(textureInfo.dataURL).add(false);
                        if (tex.img?.complete && tex.img.naturalWidth > 0) finish();
                        setTimeout(finish, 1500);
                    });
                    for (const cube of Cube.all) cube.applyTexture(tex, true);
                    Canvas.updateAllFaces?.();
                }
                return Codecs.project.compile({raw: true, bitmaps: true});
            } finally {
                const leaked = ModelProject.all.filter(proj => !existingProjects.has(proj) && proj !== targetProject);
                for (const proj of leaked) {
                    try { await proj.close(true); } catch (error) { console.warn('[AnimCue] Failed to close scratch project', error); }
                }
                if (targetProject && ModelProject.all.includes(targetProject) && Project !== targetProject) {
                    targetProject.select();
                }
            }
        });
    }

    async function importBedrockGeometry(geoJson, fileName, textureInfo, input, options = {}) {
        const target = Project;
        const compiled = await compileBedrockGeometry(geoJson, textureInfo, target);
        if (Project !== target) throw new Error(Locale.t('err_switch_back_project'));
        return importProject(compiled, '', input, options);
    }

    async function importPalPlayer(preset, input, options = {}) {
        const geometry = PalBridge.getPresetGeometry(preset);
        const texture = PalBridge.getDefaultTexture();
        const rigMode = preset === 'dragoncore' ? 'pal_dragoncore' : 'pal_player';
        return importBedrockGeometry(geometry, `pal_${preset}.geo.json`, texture, {...input, rigMode}, options);
    }

    function preserveTextures(model, sourceFormat) {
        if (!sourceFormat?.per_texture_uv_size) {
            for (const texture of model.textures) {
                texture.uv_width = model.resolution.width;
                texture.uv_height = model.resolution.height;
            }
        }
        if (!sourceFormat?.single_texture) return;
        if (model.textures.length) return;
        model.meta.model_format = SceneProject.formatId;
        for (const element of model.elements) {
            for (const face of Object.values(element.faces ?? {})) {
                if (face.texture !== null) face.texture = false;
            }
        }
    }

    function uniqueName(input, used) {
        const name = String(input || '').replace(/[^\p{L}\p{N}_-]+/gu, '_') || 'participant';
        let choice = name;
        let suffix = 2;
        while (used.has(choice)) choice = name + '_' + suffix++;
        used.add(choice);
        return choice;
    }

    function parseOffsetVector(value) {
        if (!value) return null;
        if (Array.isArray(value) && value.length === 3 && value.every(v => Number.isFinite(Number(v)))) {
            return value.map(Number);
        }
        return null;
    }

    function ensureDefaultAnimation() {
        if (Animation.selected) return Animation.selected;
        if (Animation.all.length) {
            Animation.all[0].select();
            return Animation.all[0];
        }
        const clip = new Animation({
            name: 'animation.scene.interaction',
            loop: 'once',
            length: 2,
            snapping: 20
        }).add();
        clip.select();
        return clip;
    }

    function openStartingFrame(root, animation, toolId = 'move_tool') {
        const clip = animation || ensureDefaultAnimation();
        Modes.options.animate.select();
        clip.select();
        if (Timeline.playing) Timeline.pause();
        Timeline.setTime(0);
        root.select();
        const track = clip.getBoneAnimator(root);
        track.addToTimeline();
        track.expanded = true;
        BarItems[toolId]?.select();
        return {track, clip};
    }

    function startingKey(track) {
        return track.position.find(key => Math.abs(key.time) < 0.00001) || null;
    }

    function placeInViewport(root) {
        const targetRoot = root || selectedRoot();
        const {track} = openStartingFrame(targetRoot, Animation.selected, 'move_tool');
        const key = startingKey(track) ?? track.createKeyframe(null, 0, 'position', true);
        key.select();
        Animator.preview();
        StudioPanel.refresh();
    }

    function edit(group, input) {
        const slot = describe(input, group);
        Undo.initEdit({groups: [group], outliner: true});
        group[slotKey] = slot;
        Undo.finishEdit('Edit AnimCue participant');
        StudioPanel.refresh();
    }

    function collectSubtree(root) {
        const groups = [];
        const elements = [];
        const walk = node => {
            if (node instanceof Group) {
                groups.push(node);
                for (const child of node.children ?? []) walk(child);
            } else if (node) {
                elements.push(node);
            }
        };
        walk(root);
        return {groups, elements};
    }

    function moveOrder(group, delta) {
        const list = roots();
        const index = list.indexOf(group);
        const nextIndex = index + delta;
        if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return;
        const swapWith = list[nextIndex];
        const a = Outliner.root.indexOf(group);
        const b = Outliner.root.indexOf(swapWith);
        if (a < 0 || b < 0) return;
        SceneProject.withEditMode(() => {
            Undo.initEdit({outliner: true});
            Outliner.root.splice(a, 1);
            Outliner.root.splice(b, 0, group);
            Undo.finishEdit('Reorder AnimCue participants');
        });
        StudioPanel.refresh();
    }

    function toggleVisibility(group) {
        if (!group) return;
        Undo.initEdit({groups: [group], outliner: true});
        group.visibility = !group.visibility;
        Undo.finishEdit('Toggle AnimCue participant visibility');
        Canvas.updateVisibility?.();
        StudioPanel.refresh();
    }

    function duplicate(group) {
        const slot = group?.[slotKey];
        if (!slot?.role) return null;
        const role = uniqueRole(slot.role);
        const cloned = SceneProject.withEditMode(() => {
            const used = new Set(Group.all.map(g => g.name));
            const newRootName = uniqueName(role, used);
            const undoGroups = [];
            const undoElements = [];
            Undo.initEdit({outliner: true, groups: undoGroups, elements: undoElements, selection: true});
            const copy = group.duplicate();
            if (copy.parent !== 'root') copy.addTo('root');
            copy.name = newRootName;
            copy[slotKey] = {...slot, role};
            const renameChildren = parent => {
                for (const child of parent.children ?? []) {
                    if (!(child instanceof Group)) continue;
                    const orig = child[boneKey] || child.name;
                    child[boneKey] = orig;
                    child.name = uniqueName(newRootName + '_' + orig, used);
                    renameChildren(child);
                }
            };
            renameChildren(copy);
            const subtree = collectSubtree(copy);
            undoGroups.push(...subtree.groups);
            undoElements.push(...subtree.elements);
            copy.select();
            Undo.finishEdit('Duplicate AnimCue participant');
            Canvas.updateAll();
            return copy;
        });
        Blockbench.showQuickMessage(Locale.t('msg_participant_added', {role}), 2400);
        StudioPanel.refresh();
        return cloned;
    }

    function remove(group) {
        const role = group?.[slotKey]?.role;
        if (!role) return;
        SceneProject.withEditMode(() => {
            const {groups, elements} = collectSubtree(group);
            const groupUuids = new Set(groups.map(g => g.uuid));
            const animations = (Animation.all ?? []).filter(clip =>
                clip.animators && Object.keys(clip.animators).some(uuid => groupUuids.has(uuid))
            );
            Undo.initEdit({outliner: true, groups, elements, selection: true, animations});
            for (const clip of animations) {
                for (const uuid of groupUuids) {
                    if (clip.animators?.[uuid]) clip.removeAnimator(uuid);
                }
            }
            group.remove(false);
            groups.length = 0;
            elements.length = 0;
            Undo.finishEdit('Remove AnimCue participant');
            Canvas.updateAllBones?.();
        });
        Blockbench.showQuickMessage(Locale.t('msg_participant_removed', {role}), 2400);
        StudioPanel.refresh();
    }

    function boneGroupMap(root) {
        const map = new Map();
        const walk = node => {
            for (const child of node.children ?? []) {
                if (!(child instanceof Group)) continue;
                const orig = child[boneKey] || child.name;
                map.set(orig, child);
                map.set(orig.toLowerCase(), child);
                walk(child);
            }
        };
        walk(root);
        return map;
    }

    return {
        register,
        roots,
        findByRole,
        rootOf,
        selectedRoot,
        uniqueRole,
        guessDefaults,
        describe,
        importProject,
        importBedrockGeometry,
        importPalPlayer,
        ensureDefaultAnimation,
        openStartingFrame,
        startingKey,
        placeInViewport,
        edit,
        moveOrder,
        toggleVisibility,
        duplicate,
        remove,
        boneGroupMap,
        slotKey,
        boneKey
    };
})();

const VanillaTemplates = (() => {
    let library;
    const providers = [
        'https://wynem.com/assets',
        'https://raw.githubusercontent.com/ewanhowell5195/wynem/main/src/assets',
        'https://cdn.jsdelivr.net/gh/ewanhowell5195/wynem/src/assets'
    ];

    async function catalog() {
        if (!library) {
            library = (async () => {
                for (const root of providers) {
                    try {
                        const response = await fetch(root + '/json/cem_template_models.json', {signal: AbortSignal.timeout(12000)});
                        if (!response.ok) continue;
                        const data = await response.json();
                        if (!data.categories || !data.models) continue;
                        const entities = data.categories.flatMap(category => category.entities ?? [])
                            .filter(entry => entry.id && !entry.type)
                            .flatMap(entry => [entry, ...(entry.variants ?? []).map(variant => ({
                                ...variant,
                                model: variant.model ?? entry.model ?? entry.id,
                                baseId: entry.id
                            }))]);
                        return {root, entities, models: data.models};
                    } catch (error) {
                        console.warn('AnimCue could not read vanilla templates from ' + root, error);
                    }
                }
                throw new Error(Locale.t('err_vanilla_offline'));
            })().catch(error => {
                library = undefined;
                throw error;
            });
        }
        return library;
    }

    async function fetchTextureDataURL(relativePath, preferredRoot) {
        const roots = [preferredRoot, ...providers.filter(r => r !== preferredRoot)].filter(Boolean);
        for (const root of roots) {
            try {
                const response = await fetch(`${root}/${relativePath}`, {signal: AbortSignal.timeout(10000)});
                if (!response.ok) continue;
                const contentType = response.headers.get('content-type') || '';
                if (contentType.startsWith('text/html')) continue;
                const blob = await response.blob();
                if (!blob || blob.size < 32) continue;
                return await blobToDataURL(blob);
            } catch (_ignore) {}
        }
        return null;
    }

    function blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
            reader.onerror = () => reject(reader.error || new Error('Failed to read texture blob'));
            reader.readAsDataURL(blob);
        });
    }

    async function resolve(entry) {
        const source = await catalog();
        const modelKey = entry.model ?? entry.id;
        const model = source.models[modelKey];
        if (!model?.model) throw new Error(Locale.t('err_vanilla_missing', {id: entry.id}));

        const textures = [];
        if (!entry.textureless) {
            const vanillaNames = Array.isArray(entry.vanilla_textures)
                ? entry.vanilla_textures
                : [entry.vanilla_textures ?? entry.id];
            for (const [index, name] of vanillaNames.entries()) {
                const suffix = index ? `_${index}` : '';
                let dataURL = await fetchTextureDataURL(`images/minecraft/entities/${entry.id}${suffix}.png`, source.root);
                if (!dataURL && entry.baseId && entry.baseId !== entry.id) {
                    dataURL = await fetchTextureDataURL(`images/minecraft/entities/${entry.baseId}${suffix}.png`, source.root);
                }
                if (dataURL) {
                    const cleanName = String(name || entry.id);
                    textures.push({
                        name: cleanName.endsWith('.png') ? cleanName : cleanName + '.png',
                        dataURL
                    });
                }
            }
            if (!textures.length && model.texture_data) {
                const rawList = Array.isArray(model.texture_data) ? model.texture_data : [model.texture_data];
                const rawNames = Array.isArray(entry.texture) ? entry.texture : [entry.texture ?? entry.id];
                rawList.forEach((bitmap, idx) => {
                    if (typeof bitmap !== 'string' || !bitmap) return;
                    const nm = String(rawNames[idx] || `${entry.id}_${idx + 1}`);
                    textures.push({
                        name: nm.endsWith('.png') ? nm : nm + '.png',
                        dataURL: bitmap.startsWith('data:') ? bitmap : 'data:image/png;base64,' + bitmap
                    });
                });
            }
            if (!textures.length && (entry.id === 'player' || entry.baseId === 'player')) {
                const fallbackSkin = PalBridge.getDefaultTexture();
                if (fallbackSkin?.dataURL) {
                    textures.push({name: fallbackSkin.name || 'player.png', dataURL: fallbackSkin.dataURL});
                }
            }
        }
        return {geometry: JSON.parse(model.model), textures, entityId: entry.baseId ?? entry.id};
    }

    function loadTextureAndWait(info) {
        return new Promise(resolve => {
            const tex = new Texture({
                name: info.name || 'texture.png',
                keep_size: true,
                uv_width: Project.texture_width || 64,
                uv_height: Project.texture_height || 64
            });
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve(tex);
            };
            tex.load_callback = finish;
            tex.fromDataURL(info.dataURL).add(false);
            if (tex.img?.complete && tex.img.naturalWidth > 0) finish();
            setTimeout(finish, 2000);
        });
    }

    function sanitizeGroupNames() {
        const used = new Set();
        for (const group of Group.all) {
            let base = String(group.name || '').trim();
            if (!base || base === 'interactive_animation:root') base = 'submodel';
            let candidate = base;
            let suffix = 2;
            while (used.has(candidate)) candidate = `${base}_${suffix++}`;
            used.add(candidate);
            if (group.name !== candidate) group.name = candidate;
        }
    }

    async function closeScratchProjects(existingProjects, target) {
        const leaked = ModelProject.all.filter(proj => !existingProjects.has(proj) && proj !== target);
        for (const proj of leaked) {
            try {
                await proj.close(true);
            } catch (error) {
                console.warn('[AnimCue] Failed to close scratch project', error);
            }
        }
        if (target && ModelProject.all.includes(target) && Project !== target) {
            target.select();
        }
    }

    async function compile(template, target) {
        if (Project !== target) throw new Error(Locale.t('err_switch_back_project'));
        if (!Formats.optifine_entity) throw new Error(Locale.t('err_vanilla_no_format'));
        return SceneProject.withEditModeAsync(async () => {
            const existingProjects = new Set(ModelProject.all);
            try {
                newProject(Formats.optifine_entity);
                Formats.optifine_entity.codec.parse(template.geometry, '');
                if (template.entityId === 'player') attachPlayerLayers();
                sanitizeGroupNames();

                const loadedTextures = [];
                for (const info of template.textures ?? []) {
                    if (!info?.dataURL) continue;
                    loadedTextures.push(await loadTextureAndWait(info));
                }
                if (loadedTextures.length) {
                    const primary = loadedTextures[0];
                    if (loadedTextures.length === 1) primary.use_as_default = true;
                    for (const cube of Cube.all) {
                        const hasTex = Object.values(cube.faces ?? {}).some(face => Boolean(face.texture));
                        if (!hasTex) cube.applyTexture(primary, true);
                    }
                    Canvas.updateAllFaces?.();
                }
                return Codecs.project.compile({raw: true, bitmaps: true});
            } finally {
                await closeScratchProjects(existingProjects, target);
            }
        });
    }

    function attachPlayerLayers() {
        const pairs = {
            headwear: 'head',
            jacket: 'body',
            left_sleeve: 'left_arm',
            right_sleeve: 'right_arm',
            left_pants: 'left_leg',
            right_pants: 'right_leg'
        };
        const groups = new Map(Group.all.map(group => [group.name, group]));
        for (const [layer, bodyPart] of Object.entries(pairs)) {
            const parent = groups.get(bodyPart);
            if (parent) groups.get(layer)?.addTo(parent);
        }
    }

    return {catalog, resolve, compile};
})();

const InteractionCodec = (() => {
    const ROOT = 'interactive_animation:root';
    const SECTION = 'interactive_animation:interactions';
    const CHANNELS = ['position', 'rotation', 'scale', 'bend'];
    let hookedCodec = null;
    let originalCodecLoad = null;

    function buildDocument(animations, roots, options = {}) {
        if (!animations.length) throw new Error(Locale.t('err_no_animation'));
        if (Group.all.some(group => group[Participants.slotKey]?.role && !roots.includes(group))) {
            throw new Error(Locale.t('err_root_not_top_level'));
        }
        if (roots.length > 64) throw new Error(Locale.t('err_max_participants'));

        const codec = AnimationCodec.codecs.bedrock;
        const primary = Object.create(null);
        const interactions = Object.create(null);
        const roles = new Set();
        const owned = new Map();
        const cameraGroup = options.includeCamera !== false ? SceneCameraRig.find() : null;
        const cameraName = cameraGroup ? cameraGroup.name : null;
        const primaryRig = options.convertPrimaryPal ? PalBridge.detectPrimaryRig() : null;
        const palConvertedRoles = new Set();
        const moreRotationRoles = new Set();

        const rigs = roots.map(root => {
            const slot = root[Participants.slotKey];
            if (roles.has(slot.role)) throw new Error(Locale.t('err_role_duplicate', {role: slot.role}));
            roles.add(slot.role);
            const bones = new Set();
            function bind(group, original) {
                if (bones.has(original)) throw new Error(Locale.t('err_duplicate_bone', {name: original}));
                if (owned.has(group.name)) throw new Error(Locale.t('err_duplicate_display_bone', {name: group.name}));
                bones.add(original);
                owned.set(group.name, {role: slot.role, bone: original});
                for (const child of group.children ?? []) {
                    if (!(child instanceof Group)) continue;
                    if (child[Participants.slotKey]?.role) throw new Error(Locale.t('err_nested_participant_root'));
                    bind(child, child[Participants.boneKey] || child.name);
                }
            }
            bind(root, ROOT);
            return {
                root,
                slot: {role: slot.role, type: slot.type, id: slot.id},
                palRig: PalBridge.detectParticipantRig(root)
            };
        });

        let activeCameraCount = 0;
        for (const clip of animations) {
            if (Object.hasOwn(primary, clip.name)) throw new Error(Locale.t('err_duplicate_anim_name', {name: clip.name}));
            const animation = codec.compileAnimation(clip);
            const rawCamera = cameraName && animation.bones?.[cameraName] ? animation.bones[cameraName] : null;
            if (cameraName && animation.bones) delete animation.bones[cameraName];

            const byRoleRaw = new Map(rigs.map(entry => [entry.slot.role, {rootTrack: null, childBones: Object.create(null)}]));
            for (const [name, track] of Object.entries(animation.bones ?? {})) {
                const owner = owned.get(name);
                if (!owner) continue;
                const bucket = byRoleRaw.get(owner.role);
                if (owner.bone === ROOT) bucket.rootTrack = track;
                else bucket.childBones[owner.bone] = track;
                delete animation.bones[name];
            }

            if (primaryRig && animation.bones && Object.keys(animation.bones).length) {
                const rawPrimaryBones = compileRawBonesForGroups(clip, primaryGroupList(), group => group.name);
                if (Object.keys(rawPrimaryBones).length) {
                    const convertedPrimary = PalBridge.exportTracks(clip.name, rawPrimaryBones, primaryRig, {
                        length: clip.length,
                        loop: clip.loop,
                        animcueStrict: false
                    });
                    animation.bones = convertedPrimary.bones;
                    palConvertedRoles.add('primary');
                    if (convertedPrimary.needsMoreRotation) moreRotationRoles.add('primary');
                }
            }
            animation.bones ??= {};

            const activeParticipants = [];
            let maxTime = maxPrimaryTime(animation);
            for (const entry of rigs) {
                const bucket = byRoleRaw.get(entry.slot.role);
                const outBones = Object.create(null);

                if (bucket.rootTrack) {
                    const rootValidated = numericTrack(bucket.rootTrack, {role: entry.slot.role, bone: ROOT});
                    if (Object.keys(rootValidated).length) {
                        outBones[ROOT] = rootValidated;
                        maxTime = Math.max(maxTime, maxTrackTime(rootValidated));
                    }
                }

                const hasChildren = Object.keys(bucket.childBones).length > 0;
                if (hasChildren) {
                    let processed = bucket.childBones;
                    if (entry.palRig) {
                        // Compile raw Blockbench keyframes so PAL export mirrors North/South exactly once.
                        const rawChildBones = compileRawBonesForGroups(
                            clip,
                            descendantGroups(entry.root),
                            group => group[Participants.boneKey] || group.name
                        );
                        const converted = PalBridge.exportTracks(clip.name, rawChildBones, entry.palRig, {
                            length: clip.length,
                            loop: clip.loop,
                            animcueStrict: true
                        });
                        processed = converted.bones;
                        palConvertedRoles.add(entry.slot.role);
                        if (converted.needsMoreRotation) moreRotationRoles.add(entry.slot.role);
                    }
                    for (const [boneName, rawTrack] of Object.entries(processed)) {
                        const validated = numericTrack(rawTrack, {role: entry.slot.role, bone: boneName});
                        if (Object.keys(validated).length) {
                            outBones[boneName] = validated;
                            maxTime = Math.max(maxTime, maxTrackTime(validated));
                        }
                    }
                }

                if (!Object.keys(outBones).length && options.includeStaticVisible && entry.root.visibility !== false) {
                    outBones[ROOT] = {position: {'0': [0, 0, 0]}};
                }

                if (Object.keys(outBones).length) {
                    activeParticipants.push({...entry.slot, bones: outBones});
                }
            }

            let cameraOut = null;
            if (rawCamera) {
                cameraOut = numericCameraTrack(rawCamera);
                if (cameraOut && Object.keys(cameraOut).length) {
                    activeCameraCount += 1;
                    maxTime = Math.max(maxTime, maxTrackTime(cameraOut));
                } else {
                    cameraOut = null;
                }
            }

            if (animation.animation_length !== undefined && maxTime > Number(animation.animation_length) + 1e-5) {
                animation.animation_length = roundNumber(maxTime);
            }
            if (activeParticipants.length) {
                formatMarkers(animation.timeline);
                const ext = {participants: activeParticipants};
                if (cameraOut) ext.camera = cameraOut;
                interactions[clip.name] = ext;
            }
            primary[clip.name] = animation;
        }

        const document = {format_version: '1.8.0', animations: primary};
        if (Object.keys(interactions).length) document[SECTION] = interactions;
        return {
            document,
            stats: {
                clipCount: animations.length,
                interactionClipCount: Object.keys(interactions).length,
                participantCount: rigs.length,
                hasCamera: activeCameraCount > 0,
                palConvertedRoles: Array.from(palConvertedRoles),
                moreRotationRoles: Array.from(moreRotationRoles)
            }
        };
    }

    function formatMarkers(timeline) {
        const label = line => typeof line === 'string' && /^[\p{L}\p{N}_:.\/-]+;$/u.test(line)
            ? line.slice(0, -1) : line;
        for (const [time, instruction] of Object.entries(timeline ?? {})) {
            timeline[time] = Array.isArray(instruction) ? instruction.map(label) : label(instruction);
        }
    }

    function numericCameraTrack(track) {
        const output = {};
        for (const channel of ['position', 'rotation']) {
            if (track[channel] === undefined) continue;
            try {
                output[channel] = numericCurve(track[channel], channel);
            } catch (error) {
                throw new Error(Locale.t('err_camera_invalid_channel', {channel, message: error.message}));
            }
        }
        return output;
    }

    function numericTrack(track, owner) {
        if (track.relative_to) {
            throw new Error(Locale.t('err_global_rotation', {role: owner.role, bone: owner.bone}));
        }
        const output = {};
        for (const [channel, curve] of Object.entries(track)) {
            if (!CHANNELS.includes(channel)) continue;
            try {
                output[channel] = numericCurve(curve, channel);
            } catch (error) {
                throw new Error(`${owner.role} / ${owner.bone} / ${channel} · ${error.message}`);
            }
        }
        return output;
    }

    function numericCurve(value, channel) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) return vector3(value, channel);
        if (Object.hasOwn(value, 'pre') || Object.hasOwn(value, 'post') || Object.hasOwn(value, 'vector')) {
            return numericFrame(value, channel);
        }
        const result = Object.create(null);
        for (const [time, frame] of Object.entries(value)) {
            if (!/^\d+(?:\.\d+)?$/.test(time)) throw new Error(Locale.t('err_invalid_time', {time}));
            result[time] = frame && typeof frame === 'object' && !Array.isArray(frame)
                ? numericFrame(frame, channel) : vector3(frame, channel);
        }
        return result;
    }

    function numericFrame(frame, channel) {
        const key = {};
        if (frame.pre !== undefined) key.pre = vector3(frame.pre, channel);
        if (frame.post !== undefined) key.post = vector3(frame.post, channel);
        else if (frame.vector !== undefined) key.post = vector3(frame.vector, channel);
        if (key.pre === undefined && key.post === undefined) throw new Error(Locale.t('err_empty_keyframe'));
        if (frame.lerp_mode !== undefined) {
            if (!['linear', 'catmullrom'].includes(frame.lerp_mode)) {
                throw new Error(Locale.t('err_unsupported_lerp', {mode: frame.lerp_mode}));
            }
            key.lerp_mode = frame.lerp_mode;
        }
        return key;
    }

    function vector3(values, channel) {
        if (!Array.isArray(values)) {
            const n = numericComponent(values);
            // AnimCue AnimationCurve expands scalar to (n,n,n), so bend must ALWAYS be [n, 0, 0] to avoid Y/Z pollution.
            return channel === 'bend' ? [n, 0, 0] : [n, n, n];
        }
        if (values.length !== 3) throw new Error(Locale.t('err_vector_length'));
        return values.map(numericComponent);
    }

    function numericComponent(value) {
        if ((typeof value === 'number' || (typeof value === 'string' && value.trim())) && Number.isFinite(Number(value))) {
            return Number(value);
        }
        throw new Error(Locale.t('err_numeric_required'));
    }

    function maxPrimaryTime(animation) {
        let max = 0;
        for (const bone of Object.values(animation.bones ?? {})) {
            max = Math.max(max, maxTrackTime(bone));
        }
        for (const t of Object.keys(animation.timeline ?? {})) {
            const n = Number(t);
            if (Number.isFinite(n) && n >= 0) max = Math.max(max, n);
        }
        return max;
    }

    function maxTrackTime(track) {
        let max = 0;
        for (const curve of Object.values(track ?? {})) {
            if (!curve || typeof curve !== 'object' || Array.isArray(curve)) continue;
            if (Object.hasOwn(curve, 'pre') || Object.hasOwn(curve, 'post')) continue;
            for (const key of Object.keys(curve)) {
                const n = Number(key);
                if (Number.isFinite(n) && n >= 0) max = Math.max(max, n);
            }
        }
        return max;
    }

    function roundNumber(value) {
        return Math.round(Number(value) * 1e6) / 1e6;
    }

    function uniqueClipName(base) {
        const clean = String(base || 'animation').trim() || 'animation';
        const used = new Set((Animation.all ?? []).map(a => a.name));
        if (!used.has(clean)) return clean;
        let idx = 2;
        while (used.has(`${clean}_${idx}`)) idx += 1;
        return `${clean}_${idx}`;
    }

    function loopModeFromJson(value) {
        const raw = String(value ?? '').toLowerCase();
        if (value === true || raw === 'true' || raw === 'loop') return 'loop';
        if (raw === 'hold' || raw === 'hold_on_last_frame') return 'hold';
        return 'once';
    }

    function descendantGroups(root) {
        const list = [];
        const walk = node => {
            for (const child of node.children ?? []) {
                if (!(child instanceof Group)) continue;
                list.push(child);
                walk(child);
            }
        };
        walk(root);
        return list;
    }

    function primaryGroupList() {
        const participantSet = new Set(Participants.roots());
        const cameraGroup = SceneCameraRig.find();
        const list = [];
        const walk = nodes => {
            for (const node of nodes ?? []) {
                if (!(node instanceof Group)) continue;
                if (participantSet.has(node) || node === cameraGroup) continue;
                list.push(node);
                walk(node.children);
            }
        };
        walk(Outliner.root);
        return list;
    }

    function compileRawBonesForGroups(clip, groups, nameOf) {
        const bones = {};
        for (const group of groups) {
            const animator = clip.animators?.[group.uuid];
            if (!animator) continue;
            const boneOut = {};
            for (const channel of ['position', 'rotation', 'scale']) {
                const keyframes = Array.isArray(animator[channel]) ? animator[channel] : [];
                if (!keyframes.length) continue;
                const track = {};
                keyframes.slice().sort((a, b) => a.time - b.time).forEach(kf => {
                    const timeKey = formatSecondsKey(kf.time);
                    const points = Array.isArray(kf.data_points) && kf.data_points.length
                        ? kf.data_points
                        : [{x: kf.get?.('x') ?? 0, y: kf.get?.('y') ?? 0, z: kf.get?.('z') ?? 0}];
                    const toVec = pt => {
                        const fb = channel === 'scale' ? 1 : 0;
                        return [
                            rawAxisNum(pt?.x, fb),
                            rawAxisNum(pt?.y, fb),
                            rawAxisNum(pt?.z, fb)
                        ];
                    };
                    const post = toVec(points[points.length - 1]);
                    const hasPre = points.length > 1;
                    const hasLerp = Boolean(kf.interpolation && kf.interpolation !== 'linear');
                    const hasEasing = Boolean(kf.easing && String(kf.easing).toLowerCase() !== 'linear');
                    const palMeta = kf.pal_bend_easing && typeof kf.pal_bend_easing === 'object' ? kf.pal_bend_easing : null;
                    if (!hasPre && !hasLerp && !hasEasing && !palMeta) {
                        track[timeKey] = post;
                    } else {
                        const obj = {post};
                        if (hasPre) obj.pre = toVec(points[0]);
                        if (hasLerp) obj.lerp_mode = kf.interpolation;
                        if (hasEasing) obj.easing = kf.easing;
                        if (palMeta) Object.assign(obj, structuredClone(palMeta));
                        track[timeKey] = obj;
                    }
                });
                if (Object.keys(track).length) boneOut[channel] = track;
            }
            if (Object.keys(boneOut).length) bones[nameOf(group)] = boneOut;
        }
        return bones;
    }

    function rawAxisNum(value, fallback) {
        if (value === undefined || value === null || value === '') return fallback;
        const n = Number(value);
        return Number.isFinite(n) ? n : value;
    }

    function formatSecondsKey(seconds) {
        const n = Math.round((Number(seconds) || 0) * 1e6) / 1e6;
        return Number.isInteger(n) ? String(n) : String(n);
    }

    function applyCurveToAnimator(animator, channel, curve, options = {}) {
        if (!animator || curve === undefined || curve === null) return;
        const entries = extractCurveEntries(curve, channel, Boolean(options.fromBedrock));
        for (const entry of entries) {
            const opts = {
                time: entry.time,
                channel,
                data_points: entry.points,
                interpolation: entry.interpolation
            };
            const kf = animator.addKeyframe(opts);
            if (kf && entry.interpolation && entry.interpolation !== 'linear') {
                kf.interpolation = entry.interpolation;
            }
        }
    }

    function extractCurveEntries(curve, channel, fromBedrock = false) {
        const out = [];
        const fallback = channel === 'scale' ? 1 : 0;
        const flip = (x, y, z) => {
            if (!fromBedrock) return {x, y, z};
            if (channel === 'position') return {x: cleanSign(-x), y, z};
            if (channel === 'rotation') return {x: cleanSign(-x), y: cleanSign(-y), z};
            return {x, y, z};
        };
        const toPoint = raw => {
            if (Array.isArray(raw)) {
                return flip(Number(raw[0]) || 0, Number(raw[1]) || 0, Number(raw[2]) || 0);
            }
            const n = Number(raw);
            const v = Number.isFinite(n) ? n : fallback;
            return channel === 'bend' ? {x: v, y: 0, z: 0} : flip(v, v, v);
        };
        const parseFrame = (time, frame) => {
            if (frame && typeof frame === 'object' && !Array.isArray(frame)) {
                const points = [];
                if (frame.pre !== undefined) points.push(toPoint(frame.pre));
                if (frame.post !== undefined) points.push(toPoint(frame.post));
                else if (frame.vector !== undefined) points.push(toPoint(frame.vector));
                else if (!points.length) points.push(toPoint(0));
                const lerp = frame.lerp_mode === 'catmullrom' ? 'catmullrom' : 'linear';
                out.push({time, points, interpolation: lerp});
            } else {
                out.push({time, points: [toPoint(frame)], interpolation: 'linear'});
            }
        };
        if (Array.isArray(curve) || typeof curve === 'number' || typeof curve === 'string'
            || (typeof curve === 'object' && (curve.pre !== undefined || curve.post !== undefined || curve.vector !== undefined))) {
            parseFrame(0, curve);
        } else if (typeof curve === 'object') {
            Object.entries(curve)
                .map(([k, v]) => [Number(k), v])
                .filter(([t]) => Number.isFinite(t) && t >= 0)
                .sort((a, b) => a[0] - b[0])
                .forEach(([t, v]) => parseFrame(t, v));
        }
        return out;
    }

    function cleanSign(n) {
        return Math.abs(n) < 1e-9 ? 0 : n;
    }

    function applyBoneTracksToMap(clip, bones, groupLookup, options = {}) {
        let applied = 0;
        for (const [boneName, track] of Object.entries(bones ?? {})) {
            if (!track || typeof track !== 'object') continue;
            const group = groupLookup(boneName);
            if (!group) continue;
            const animator = clip.getBoneAnimator(group);
            for (const channel of ['position', 'rotation', 'scale']) {
                if (track[channel] !== undefined) applyCurveToAnimator(animator, channel, track[channel], options);
            }
            applied += 1;
        }
        return applied;
    }

    function primaryGroupMap() {
        const participantSet = new Set(Participants.roots());
        const cameraGroup = SceneCameraRig.find();
        const map = new Map();
        const walk = nodes => {
            for (const node of nodes ?? []) {
                if (!(node instanceof Group)) continue;
                if (participantSet.has(node) || node === cameraGroup) continue;
                map.set(node.name, node);
                map.set(node.name.toLowerCase(), node);
                walk(node.children);
            }
        };
        walk(Outliner.root);
        return map;
    }

    function insertEventMarker(clip, time, name) {
        const clean = String(name || '').trim();
        if (!clean) throw new Error(Locale.t('err_event_empty'));
        const seconds = Math.max(0, Number(time) || 0);
        if (!clip.animators.effects && typeof EffectAnimator !== 'undefined') {
            clip.animators.effects = new EffectAnimator(clip);
        }
        const effects = clip.animators.effects;
        if (!effects) return null;
        effects.addToTimeline?.();
        const kf = effects.addKeyframe({
            time: seconds,
            channel: 'timeline',
            data_points: [{script: clean}]
        });
        if (seconds > clip.length) clip.length = seconds;
        return kf;
    }

    function importSceneDocument(data, options = {}) {
        if (!data || typeof data !== 'object' || !data.animations || typeof data.animations !== 'object') {
            throw new Error(Locale.t('err_not_animcue_file'));
        }
        const interactions = data[SECTION] || {};
        const primaryRig = PalBridge.detectPrimaryRig();
        const primaryLookupMap = primaryGroupMap();
        const primaryLookup = name => primaryLookupMap.get(name) || primaryLookupMap.get(String(name).toLowerCase()) || null;

        let clipsCreated = 0;
        let matchedParticipantTracks = 0;
        let cameraTracksLoaded = 0;
        const unmatchedRoles = new Set();
        let firstClip = null;

        for (const [animName, rawAnim] of Object.entries(data.animations)) {
            if (!rawAnim || typeof rawAnim !== 'object') continue;
            const clip = new Animation({
                name: uniqueClipName(animName),
                length: Number(rawAnim.animation_length) || 0,
                snapping: 20,
                loop: loopModeFromJson(rawAnim.loop)
            }).add();
            if (!firstClip) firstClip = clip;

            // 1. Primary subject tracks
            let primaryBones = rawAnim.bones || {};
            const primaryFromPal = Boolean(primaryRig && Object.keys(primaryBones).length);
            if (primaryFromPal) {
                const imported = PalBridge.importTracks({animations: {[animName]: rawAnim}}, primaryRig, {fileName: options.fileName});
                primaryBones = imported.animations[animName]?.bones || primaryBones;
            }
            applyBoneTracksToMap(clip, primaryBones, primaryLookup, {fromBedrock: !primaryFromPal});

            // 2. Timeline event markers
            for (const [timeKey, payload] of Object.entries(rawAnim.timeline ?? {})) {
                const sec = Number(timeKey);
                if (!Number.isFinite(sec) || sec < 0) continue;
                const lines = Array.isArray(payload) ? payload : [payload];
                for (const line of lines) {
                    if (typeof line === 'string' && line.trim()) insertEventMarker(clip, sec, line.trim());
                }
            }

            // 3. AnimCue interaction participants & camera
            const ext = interactions[animName];
            if (ext && typeof ext === 'object') {
                for (const participant of ext.participants ?? []) {
                    const root = Participants.findByRole(participant.role);
                    if (!root) {
                        unmatchedRoles.add(participant.role);
                        continue;
                    }
                    const rawBones = participant.bones || {};
                    const rootCurve = rawBones[ROOT];
                    if (rootCurve) {
                        const rootAnimator = clip.getBoneAnimator(root);
                        for (const ch of ['position', 'rotation', 'scale']) {
                            if (rootCurve[ch] !== undefined) applyCurveToAnimator(rootAnimator, ch, rootCurve[ch], {fromBedrock: true});
                        }
                    }
                    const childBones = {};
                    for (const [bName, bTrack] of Object.entries(rawBones)) {
                        if (bName !== ROOT) childBones[bName] = bTrack;
                    }
                    let readyBones = childBones;
                    const rigInfo = PalBridge.detectParticipantRig(root);
                    const childFromPal = Boolean(rigInfo && Object.keys(childBones).length);
                    if (childFromPal) {
                        const imported = PalBridge.importTracks({
                            animations: {[animName]: {animation_length: clip.length, bones: childBones}}
                        }, rigInfo, {fileName: options.fileName});
                        readyBones = imported.animations[animName]?.bones || childBones;
                    }
                    const boneMap = Participants.boneGroupMap(root);
                    applyBoneTracksToMap(
                        clip,
                        readyBones,
                        name => boneMap.get(name) || boneMap.get(String(name).toLowerCase()) || null,
                        {fromBedrock: !childFromPal}
                    );
                    matchedParticipantTracks += 1;
                }

                if (ext.camera && typeof ext.camera === 'object') {
                    const cam = SceneCameraRig.find() || SceneCameraRig.add();
                    const camAnim = clip.getBoneAnimator(cam);
                    for (const ch of ['position', 'rotation']) {
                        if (ext.camera[ch] !== undefined) applyCurveToAnimator(camAnim, ch, ext.camera[ch], {fromBedrock: true});
                    }
                    cameraTracksLoaded += 1;
                }
            }

            if (typeof clip.calculateSnappingFromKeyframes === 'function') {
                clip.calculateSnappingFromKeyframes();
            }
            clipsCreated += 1;
        }

        if (firstClip) {
            Modes.options.animate.select();
            firstClip.select();
            showActiveTracks(firstClip);
            Animator.preview();
        }
        StudioPanel.refresh();

        const extra = cameraTracksLoaded ? ` · ${Locale.t('badge_camera')}` : '';
        Blockbench.showQuickMessage(Locale.t('msg_imported_scene', {
            clips: clipsCreated,
            matched: matchedParticipantTracks,
            extra
        }), 4200);
        if (unmatchedRoles.size) {
            Blockbench.showMessageBox({
                title: Locale.t('dialog_import_missing_title'),
                message: Locale.t('dialog_import_missing_msg', {
                    clips: clipsCreated,
                    roles: Array.from(unmatchedRoles).join(', ')
                }),
                icon: 'warning'
            });
        }
        return {clipsCreated, matchedParticipantTracks, cameraTracksLoaded, unmatchedRoles: Array.from(unmatchedRoles)};
    }

    function importActorAnimation(root, data, options = {}) {
        const slot = root[Participants.slotKey];
        const rigInfo = PalBridge.detectParticipantRig(root);
        let animationsMap;
        let profileLabel = Locale.t('rig_generic');
        const usedPalImport = Boolean(data?.emote || rigInfo);
        if (usedPalImport) {
            const converted = PalBridge.importTracks(data, rigInfo || {preset: 'player'}, {fileName: options.fileName});
            animationsMap = converted.animations;
            profileLabel = converted.profileLabel || converted.profile;
        } else if (data?.animations && typeof data.animations === 'object') {
            animationsMap = data.animations;
        } else {
            throw new Error(Locale.t('err_not_animcue_file'));
        }

        const entries = Object.entries(animationsMap);
        if (!entries.length) throw new Error(Locale.t('err_no_animation'));

        const boneMap = Participants.boneGroupMap(root);
        const lookup = name => boneMap.get(name) || boneMap.get(String(name).toLowerCase()) || null;
        const mergeCurrent = Boolean(options.mergeIntoSelected && Animation.selected && entries.length === 1);
        let firstClip = null;
        let count = 0;

        for (const [animName, animObj] of entries) {
            const clip = mergeCurrent
                ? Animation.selected
                : new Animation({
                    name: uniqueClipName(animName),
                    length: Number(animObj.animation_length) || 0,
                    snapping: 20,
                    loop: loopModeFromJson(animObj.loop)
                }).add();
            if (!firstClip) firstClip = clip;
            const len = Number(animObj.animation_length) || 0;
            if (len > clip.length) clip.length = len;
            applyBoneTracksToMap(clip, animObj.bones || {}, lookup, {fromBedrock: !usedPalImport});
            count += 1;
        }

        if (firstClip) {
            Modes.options.animate.select();
            firstClip.select();
            showActiveTracks(firstClip);
            Animator.preview();
        }
        StudioPanel.refresh();
        Blockbench.showQuickMessage(Locale.t('msg_imported_actor', {
            clips: count,
            role: slot.role,
            profile: profileLabel
        }), 3800);
        return {count, profileLabel};
    }

    function showActiveTracks(clip = Animation.selected) {
        if (!clip) return;
        for (const root of Participants.roots()) {
            const track = clip.getBoneAnimator(root);
            track.addToTimeline();
            track.expanded = true;
        }
        const cam = SceneCameraRig.find();
        if (cam) {
            const camTrack = clip.getBoneAnimator(cam);
            camTrack.addToTimeline();
        }
        for (const track of Object.values(clip.animators ?? {})) {
            if (track?.keyframes?.length) track.addToTimeline();
        }
    }

    function hookNativeImport() {
        const codec = AnimationCodec?.codecs?.bedrock;
        const methodName = codec && (typeof codec.importFile === 'function'
            ? 'importFile'
            : (typeof codec.loadFile === 'function' ? 'loadFile' : (typeof codec.load === 'function' ? 'load' : null)));
        if (!codec || !methodName || codec.animcue_studio_hook) return {delete() {}};
        hookedCodec = codec;
        originalCodecLoad = {methodName, fn: codec[methodName]};
        codec.animcue_studio_hook = function(...args) {
            const first = args[0];
            const list = Array.isArray(first) ? first : (first ? [first] : []);
            const parsed = [];
            let hasInteractions = false;
            for (const file of list) {
                const raw = file?.content !== undefined ? file.content : file;
                if (typeof raw === 'string') {
                    try {
                        const json = autoParseJSON(raw, false);
                        if (json && json[SECTION]) {
                            hasInteractions = true;
                            parsed.push({json, name: file?.name || file?.path || 'animation.json'});
                        }
                    } catch (_ignore) {}
                } else if (raw && typeof raw === 'object' && raw[SECTION]) {
                    hasInteractions = true;
                    parsed.push({json: raw, name: file?.name || file?.path || 'animation.json'});
                }
            }
            if (hasInteractions && parsed.length === list.length) {
                for (const item of parsed) {
                    try {
                        importSceneDocument(item.json, {fileName: item.name});
                    } catch (error) {
                        Blockbench.showMessageBox({title: Locale.t('plugin_title'), message: error.message, icon: 'error'});
                    }
                }
                return true;
            }
            return originalCodecLoad.fn.apply(this, args);
        };
        codec[methodName] = codec.animcue_studio_hook;
        return {
            delete() {
                if (hookedCodec && originalCodecLoad && hookedCodec[originalCodecLoad.methodName] === hookedCodec.animcue_studio_hook) {
                    hookedCodec[originalCodecLoad.methodName] = originalCodecLoad.fn;
                }
                if (hookedCodec) delete hookedCodec.animcue_studio_hook;
                hookedCodec = null;
                originalCodecLoad = null;
            }
        };
    }

    return {
        ROOT,
        SECTION,
        buildDocument,
        importSceneDocument,
        importActorAnimation,
        insertEventMarker,
        showActiveTracks,
        hookNativeImport
    };
})();

const StudioDialogs = (() => {
    const ready = () => Boolean(Project && Format?.bone_rig && Format.animation_mode);

    function guard(action) {
        return async (...args) => {
            try {
                return await action(...args);
            } catch (error) {
                console.error('[AnimCue Studio]', error);
                Blockbench.showMessageBox({
                    title: Locale.t('plugin_title'),
                    message: error?.message || String(error),
                    icon: 'error'
                });
            }
        };
    }

    function ensureProject(target) {
        if (Project !== target || !ready()) throw new Error(Locale.t('err_switch_back_project'));
    }

    function kindOptions() {
        return {
            model: Locale.t('kind_model'),
            entity: Locale.t('kind_entity'),
            block: Locale.t('kind_block'),
            item: Locale.t('kind_item')
        };
    }

    function rigModeOptions() {
        return {
            auto: Locale.t('rig_auto'),
            generic: Locale.t('rig_generic'),
            pal_player: Locale.t('rig_pal_player'),
            pal_dragoncore: Locale.t('rig_pal_dragoncore')
        };
    }

    function openParticipantDialog(title, defaults, options, onConfirm) {
        const showOffset = Boolean(options?.showOffset);
        const form = {
            role: {
                label: Locale.t('field_role'),
                description: Locale.t('field_role_desc'),
                type: 'text',
                value: defaults.role ?? ''
            },
            type: {
                label: Locale.t('field_type'),
                type: 'select',
                options: kindOptions(),
                value: defaults.type ?? 'model'
            },
            id: {
                label: Locale.t('field_id'),
                description: Locale.t('field_id_desc'),
                type: 'text',
                value: defaults.id ?? ''
            },
            rigMode: {
                label: Locale.t('field_rig_mode'),
                type: 'select',
                options: rigModeOptions(),
                value: defaults.rigMode ?? 'auto'
            }
        };
        if (showOffset) {
            form.offset = {
                label: Locale.t('field_initial_offset'),
                description: Locale.t('field_initial_offset_desc'),
                type: 'vector',
                value: defaults.offset ?? [0, 0, 0]
            };
        }
        new Dialog({
            id: 'animcue_participant',
            title,
            form,
            onConfirm: guard(onConfirm)
        }).show();
    }

    function importModelFile() {
        if (!ready()) throw new Error(Locale.t('err_no_project'));
        const target = Project;
        Blockbench.import({
            extensions: ['bbmodel', 'json'],
            type: 'Blockbench / Bedrock Geometry',
            readtype: 'text',
            multiple: false
        }, guard(files => {
            if (!files?.length) return;
            const file = files[0];
            let data;
            try {
                data = autoParseJSON(file.content, false);
            } catch (error) {
                throw new Error(Locale.t('err_invalid_json', {message: error.message}));
            }
            const defaults = Participants.guessDefaults(file.name || file.path, data);
            const isGeo = Array.isArray(data?.['minecraft:geometry']);
            if (isGeo) {
                openParticipantDialog(Locale.t('dialog_participant_add_file'), defaults, {showOffset: true}, async form => {
                    ensureProject(target);
                    askOptionalTexture(async textureInfo => {
                        ensureProject(target);
                        const group = await Participants.importBedrockGeometry(data, file.name, textureInfo, form, {
                            initialOffset: form.offset
                        });
                        group.select();
                    });
                });
                return;
            }
            openParticipantDialog(Locale.t('dialog_participant_add_file'), defaults, {showOffset: true}, form => {
                ensureProject(target);
                const group = Participants.importProject(data, file.path, form, {initialOffset: form.offset});
                group.select();
            });
        }));
    }

    function askOptionalTexture(callback) {
        new Dialog({
            id: 'animcue_geo_texture',
            title: Locale.t('dialog_geo_texture_title'),
            lines: [`<p>${Locale.t('dialog_geo_texture_msg')}</p>`],
            buttons: [Locale.t('btn_choose_texture'), Locale.t('btn_skip_texture')],
            confirmIndex: 0,
            cancelIndex: 1,
            onConfirm: guard(() => {
                Blockbench.import({
                    extensions: ['png'],
                    type: 'PNG Texture',
                    readtype: 'image',
                    multiple: false
                }, guard(async files => {
                    const texFile = files?.[0];
                    const textureInfo = texFile ? {name: texFile.name || 'texture.png', dataURL: texFile.content} : null;
                    await callback(textureInfo);
                }));
            }),
            onCancel: guard(async () => {
                await callback(null);
            })
        }).show();
    }

    function importPalPlayer(preset) {
        if (!ready()) throw new Error(Locale.t('err_no_project'));
        if (!PalBridge.isAvailable()) {
            Blockbench.showMessageBox({
                title: Locale.t('plugin_title'),
                message: Locale.t('msg_pal_plugin_required'),
                icon: 'info'
            });
            return;
        }
        const target = Project;
        const defaults = {
            role: Participants.uniqueRole('player'),
            type: 'entity',
            id: 'minecraft:player',
            rigMode: preset === 'dragoncore' ? 'pal_dragoncore' : 'pal_player',
            offset: [Participants.roots().length ? 24 : 0, 0, 0]
        };
        const title = preset === 'dragoncore'
            ? Locale.t('dialog_participant_add_dc')
            : Locale.t('dialog_participant_add_pal');
        openParticipantDialog(title, defaults, {showOffset: true}, async form => {
            ensureProject(target);
            const group = await Participants.importPalPlayer(preset, form, {initialOffset: form.offset});
            group.select();
        });
    }

    async function importVanilla() {
        if (!ready()) throw new Error(Locale.t('err_no_project'));
        const target = Project;
        if (typeof MinecraftEULA !== 'undefined' && !await MinecraftEULA.promptUser('animcue_studio')) return;
        const data = await VanillaTemplates.catalog();
        ensureProject(target);
        const entries = data.entities.filter(entry => data.models[entry.model ?? entry.id]?.model);
        const items = entries.map(entry => ({
            id: entry.id,
            label: String(entry.display ?? entry.name ?? entry.id),
            entry
        }));
        let chosen = items.find(i => i.id === 'player')?.id || items[0]?.id || '';

        const dialog = new Dialog({
            id: 'animcue_vanilla',
            title: Locale.t('dialog_vanilla_title'),
            component: {
                data() {
                    return {
                        query: '',
                        selected: chosen,
                        items
                    };
                },
                computed: {
                    filtered() {
                        const q = this.query.trim().toLowerCase();
                        if (!q) return this.items;
                        return this.items.filter(item =>
                            item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
                    }
                },
                watch: {
                    selected(val) {
                        chosen = val;
                    },
                    filtered(list) {
                        if (list.length && !list.some(item => item.id === this.selected)) {
                            this.selected = list[0].id;
                        }
                    }
                },
                methods: {
                    t: (key, params) => Locale.t(key, params),
                    pick(id) {
                        this.selected = id;
                    },
                    confirmPick(id) {
                        this.selected = id;
                        chosen = id;
                        dialog.confirm();
                    }
                },
                template: `
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <input class="dark_bordered" type="text" v-model="query" :placeholder="t('field_vanilla_search')" style="width:100%;padding:5px 8px;" />
                        <div style="max-height:260px;overflow-y:auto;border:1px solid var(--color-border);border-radius:3px;background:var(--color-back);">
                            <div v-for="item in filtered" :key="item.id"
                                 @click="pick(item.id)"
                                 @dblclick="confirmPick(item.id)"
                                 style="padding:5px 8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;"
                                 :style="{background: item.id === selected ? 'var(--color-accent)' : 'transparent', color: item.id === selected ? 'var(--color-accent_text)' : 'var(--color-text)'}">
                                <span>{{ item.label }}</span>
                                <span style="opacity:0.7;font-size:11px;">{{ item.id }}</span>
                            </div>
                        </div>
                    </div>
                `
            },
            onConfirm: guard(async (formResult) => {
                const pickId = formResult?.entry || chosen;
                const entity = entries.find(candidate => candidate.id === pickId);
                if (!entity) throw new Error(Locale.t('err_vanilla_select'));
                const template = await VanillaTemplates.resolve(entity);
                ensureProject(target);
                const resource = 'minecraft:' + (entity.baseId ?? entity.id);
                openParticipantDialog(Locale.t('dialog_participant_add_vanilla'), {
                    role: Participants.uniqueRole(entity.id),
                    type: 'entity',
                    id: resource,
                    rigMode: 'generic'
                }, {showOffset: true}, async form => {
                    const model = await VanillaTemplates.compile(template, target);
                    ensureProject(target);
                    const group = Participants.importProject(model, '', form, {initialOffset: form.offset});
                    group.select();
                });
            })
        });
        dialog.show();
    }

    function editParticipant(root) {
        const targetRoot = root || Participants.selectedRoot();
        const target = Project;
        openParticipantDialog(Locale.t('dialog_participant_edit'), targetRoot[Participants.slotKey], {showOffset: false}, form => {
            ensureProject(target);
            Participants.edit(targetRoot, form);
        });
    }

    function setStartPosition(root) {
        const targetRoot = root || Participants.selectedRoot();
        const animation = Animation.selected || Participants.ensureDefaultAnimation();
        const target = Project;
        const track = animation.getBoneAnimator(targetRoot);
        const previous = Participants.startingKey(track);
        const position = previous ? previous.data_points[0] : {};
        new Dialog({
            id: 'animcue_start_position',
            title: Locale.t('dialog_start_pos_title'),
            form: Object.fromEntries(['x', 'y', 'z'].map(axis => [axis, {
                label: axis.toUpperCase(),
                type: 'number',
                value: Number(position[axis]) || 0,
                step: 0.25
            }])),
            onConfirm: guard(({x, y, z}) => {
                ensureProject(target);
                if (animation !== Animation.selected) throw new Error(Locale.t('err_switch_back_anim'));
                if (![x, y, z].every(Number.isFinite)) throw new Error(Locale.t('err_invalid_coords'));
                const {track} = Participants.openStartingFrame(targetRoot, animation);
                const existing = Participants.startingKey(track);
                if (existing) {
                    Undo.initEdit({keyframes: [existing]});
                    existing.data_points[0].extend({x, y, z});
                    Undo.finishEdit('Set AnimCue start position');
                    existing.select();
                } else {
                    const created = track.createKeyframe({x, y, z}, 0, 'position', true);
                    created?.select();
                }
                Animator.preview();
            })
        }).show();
    }

    function insertEventDialog() {
        if (!ready()) throw new Error(Locale.t('err_no_project'));
        const clip = Animation.selected || Participants.ensureDefaultAnimation();
        const target = Project;
        new Dialog({
            id: 'animcue_event_marker',
            title: Locale.t('dialog_event_title'),
            form: {
                name: {
                    label: Locale.t('field_event_name'),
                    description: Locale.t('field_event_desc'),
                    type: 'text',
                    value: ''
                },
                time: {
                    label: Locale.t('field_event_time'),
                    type: 'number',
                    value: Math.round((Timeline.time || 0) * 1000) / 1000,
                    min: 0,
                    step: 0.05
                }
            },
            onConfirm: guard(({name, time}) => {
                ensureProject(target);
                Modes.options.animate.select();
                clip.select();
                InteractionCodec.insertEventMarker(clip, time, name);
                Blockbench.showQuickMessage(Locale.t('msg_event_inserted', {name: name.trim(), time}), 2400);
            })
        }).show();
    }

    function importSceneFile() {
        if (!ready()) throw new Error(Locale.t('err_no_project'));
        const target = Project;
        Blockbench.import({
            extensions: ['json'],
            type: Locale.t('export_file_type'),
            readtype: 'text',
            multiple: false
        }, guard(files => {
            if (!files?.length) return;
            ensureProject(target);
            let data;
            try {
                data = autoParseJSON(files[0].content, false);
            } catch (error) {
                throw new Error(Locale.t('err_invalid_json', {message: error.message}));
            }
            InteractionCodec.importSceneDocument(data, {fileName: files[0].name || files[0].path});
        }));
    }

    function importActorAnimationFile(root) {
        const targetRoot = root || Participants.selectedRoot();
        const target = Project;
        Blockbench.import({
            extensions: ['json', 'emote'],
            type: 'PAL / Emotecraft / Bedrock Animation',
            readtype: 'text',
            multiple: false
        }, guard(files => {
            if (!files?.length) return;
            ensureProject(target);
            let data;
            try {
                data = autoParseJSON(files[0].content, false);
            } catch (error) {
                throw new Error(Locale.t('err_invalid_json', {message: error.message}));
            }
            const clipCount = data?.emote ? 1 : Object.keys(data?.animations || {}).length;
            const mergeIntoSelected = Boolean(Animation.selected && clipCount === 1);
            InteractionCodec.importActorAnimation(targetRoot, data, {
                fileName: files[0].name || files[0].path,
                mergeIntoSelected
            });
        }));
    }

    function exportDialog(defaultScope) {
        if (!ready()) throw new Error(Locale.t('err_no_project'));
        if (!Animation.all.length) throw new Error(Locale.t('err_no_animation'));
        const roots = Participants.roots();
        const hasCamera = Boolean(SceneCameraRig.find());
        const primaryPal = Boolean(PalBridge.detectPrimaryRig());
        const palRoles = roots.filter(r => Boolean(PalBridge.detectParticipantRig(r))).length + (primaryPal ? 1 : 0);
        const selectedName = Animation.selected?.name || Animation.all[0].name;
        const scopeDefault = defaultScope || (Animation.selected ? 'selected' : 'all');

        const scopeOptions = {
            selected: Locale.t('scope_selected', {name: selectedName}),
            all: Locale.t('scope_all', {count: Animation.all.length})
        };

        const form = {
            scope: {
                label: Locale.t('field_export_scope'),
                type: 'select',
                options: scopeOptions,
                value: scopeDefault
            },
            includeStaticVisible: {
                label: Locale.t('field_export_static'),
                type: 'checkbox',
                value: false
            },
            includeCamera: {
                label: Locale.t('field_export_camera'),
                type: 'checkbox',
                value: hasCamera,
                condition: () => hasCamera
            },
            convertPrimaryPal: {
                label: Locale.t('field_export_primary_pal'),
                type: 'checkbox',
                value: primaryPal,
                condition: () => primaryPal
            },
            summary: {
                label: Locale.t('field_export_summary'),
                type: 'info',
                text: Locale.t('export_summary_text', {
                    clips: scopeDefault === 'all' ? Animation.all.length : 1,
                    participants: roots.length,
                    camera: hasCamera ? Locale.t('export_yes') : Locale.t('export_no'),
                    pal: palRoles > 0 ? Locale.t('export_yes') : Locale.t('export_no')
                })
            }
        };

        new Dialog({
            id: 'animcue_export',
            title: Locale.t('dialog_export_title'),
            form,
            onConfirm: guard(result => {
                const clips = result.scope === 'all' ? Animation.all.slice() : [Animation.selected || Animation.all[0]].filter(Boolean);
                runExport(clips, {
                    includeStaticVisible: Boolean(result.includeStaticVisible),
                    includeCamera: hasCamera && result.includeCamera !== false,
                    convertPrimaryPal: primaryPal && Boolean(result.convertPrimaryPal)
                });
            })
        }).show();
    }

    function runExport(clips, options = {}) {
        const roots = Participants.roots();
        const {document, stats} = InteractionCodec.buildDocument(clips, roots, options);
        const fileName = (Project.name || 'interaction').replace(/[<>:"/\\|?*]+/g, '_') + '.animation';
        Blockbench.export({
            type: Locale.t('export_file_type'),
            extensions: ['json'],
            name: fileName,
            savetype: 'text',
            content: JSON.stringify(document, null, 2) + '\n'
        });
        Blockbench.showQuickMessage(Locale.t('msg_exported', {
            clips: stats.clipCount,
            name: fileName + '.json'
        }), 3000);
        return {document, stats};
    }

    function confirmRemoveParticipant(root) {
        const targetRoot = root || Participants.selectedRoot();
        const role = targetRoot[Participants.slotKey]?.role;
        new Dialog({
            id: 'animcue_confirm_remove',
            title: Locale.t('dialog_confirm_remove_title'),
            lines: [`<p>${Locale.t('dialog_confirm_remove_msg', {role})}</p>`],
            onConfirm: guard(() => Participants.remove(targetRoot))
        }).show();
    }

    function confirmRemoveCamera() {
        if (!SceneCameraRig.find()) return;
        new Dialog({
            id: 'animcue_confirm_remove_camera',
            title: Locale.t('panel_camera_heading'),
            lines: [`<p>${Locale.t('dialog_confirm_remove_camera')}</p>`],
            onConfirm: guard(() => SceneCameraRig.remove())
        }).show();
    }

    return {
        ready,
        guard,
        importModelFile,
        importPalPlayer,
        importVanilla,
        editParticipant,
        setStartPosition,
        insertEventDialog,
        importSceneFile,
        importActorAnimationFile,
        exportDialog,
        runExport,
        confirmRemoveParticipant,
        confirmRemoveCamera
    };
})();

const StudioPanel = (() => {
    let panel = null;
    let cssHandle = null;
    let vm = null;
    const eventCleanups = [];

    const STYLES = `
        .animcue-panel {
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 0;
            font-size: 12px;
        }
        .animcue-bar {
            display: flex;
            align-items: center;
            height: 34px;
            padding: 0 6px;
            gap: 4px;
            border-bottom: 1px solid var(--color-border);
            flex-shrink: 0;
        }
        .animcue-bar .animcue-spacer {
            flex: 1;
        }
        .animcue-action-btn {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            height: 24px;
            padding: 0 8px;
            border-radius: 4px;
            border: 1px solid var(--color-border);
            background: var(--color-button);
            color: var(--color-text);
            font-size: 11.5px;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.12s ease, border-color 0.12s ease;
        }
        .animcue-action-btn:hover {
            background: var(--color-selected);
            color: var(--color-light);
        }
        .animcue-action-btn.primary {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: var(--color-accent_text);
            font-weight: 500;
        }
        .animcue-action-btn.primary:hover {
            filter: brightness(1.08);
        }
        .animcue-action-btn i {
            font-size: 15px;
        }
        .animcue-tool {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            cursor: pointer;
            color: var(--color-subtle_text);
            border-radius: 4px;
            transition: background 0.12s ease, color 0.12s ease;
        }
        .animcue-tool:hover {
            color: var(--color-light);
            background: var(--color-selected);
        }
        .animcue-tool i {
            font-size: 17px;
        }
        .animcue-body {
            flex: 1;
            overflow-y: auto;
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-height: 0;
        }
        .animcue-card {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 5px 8px;
            background: var(--color-back);
            border: 1px solid var(--color-border);
            border-radius: 5px;
            cursor: pointer;
            user-select: none;
            transition: border-color 0.12s ease, background 0.12s ease;
        }
        .animcue-card:hover {
            border-color: var(--color-subtle_text);
            background: var(--color-ui);
        }
        .animcue-card.selected {
            border-color: var(--color-accent);
            box-shadow: inset 3px 0 0 var(--color-accent);
            background: var(--color-ui);
        }
        .animcue-card.dimmed {
            opacity: 0.5;
        }
        .animcue-card.subject {
            cursor: default;
            background: var(--color-back);
        }
        .animcue-card.subject:hover {
            border-color: var(--color-border);
            background: var(--color-back);
        }
        .animcue-avatar {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border-radius: 4px;
            background: var(--color-button);
            color: var(--color-subtle_text);
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
        }
        .animcue-card.selected .animcue-avatar {
            background: var(--color-accent);
            color: var(--color-accent_text);
        }
        .animcue-avatar i {
            font-size: 15px;
        }
        .animcue-info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 1px;
        }
        .animcue-name-line {
            display: flex;
            align-items: center;
            gap: 5px;
            min-width: 0;
        }
        .animcue-name {
            font-size: 12.5px;
            font-weight: 500;
            color: var(--color-text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .animcue-sub {
            font-size: 10.5px;
            color: var(--color-subtle_text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .animcue-chip {
            display: inline-flex;
            align-items: center;
            height: 16px;
            padding: 0 5px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 500;
            background: var(--color-button);
            color: var(--color-subtle_text);
            flex-shrink: 0;
        }
        .animcue-chip.accent {
            background: rgba(62, 144, 255, 0.16);
            color: var(--color-accent);
            border: 1px solid rgba(62, 144, 255, 0.35);
        }
        .animcue-row-btns {
            display: flex;
            align-items: center;
            gap: 2px;
            flex-shrink: 0;
        }
        .animcue-row-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            color: var(--color-subtle_text);
            border-radius: 4px;
            transition: background 0.1s ease, color 0.1s ease;
        }
        .animcue-row-btn:hover {
            color: var(--color-light);
            background: var(--color-button);
        }
        .animcue-row-btn i {
            font-size: 15px;
        }
        .animcue-group-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2px 2px 0;
            font-size: 11px;
            color: var(--color-subtle_text);
        }
        .animcue-empty-box {
            padding: 14px 10px;
            text-align: center;
            color: var(--color-subtle_text);
            font-size: 11.5px;
            line-height: 1.5;
            background: var(--color-back);
            border: 1px dashed var(--color-border);
            border-radius: 5px;
        }
        .animcue-cam-add {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            height: 28px;
            border-radius: 5px;
            border: 1px dashed var(--color-border);
            color: var(--color-subtle_text);
            font-size: 11.5px;
            cursor: pointer;
            transition: border-color 0.12s ease, color 0.12s ease, background 0.12s ease;
        }
        .animcue-cam-add:hover {
            border-color: var(--color-accent);
            color: var(--color-text);
            background: var(--color-back);
        }
        .animcue-cam-add i {
            font-size: 15px;
        }
        .animcue-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 24px;
            padding: 0 8px;
            border-top: 1px solid var(--color-border);
            font-size: 11px;
            color: var(--color-subtle_text);
            flex-shrink: 0;
        }
        .animcue-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 5px;
            background: var(--color-subtle_text);
            vertical-align: middle;
        }
        .animcue-dot.on {
            background: #4ade80;
            box-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
        }
    `;

    function snapshot() {
        const hasProject = StudioDialogs.ready();
        const palLinked = PalBridge.isAvailable();
        const palVersion = PalBridge.version();
        const primaryRig = hasProject ? PalBridge.detectPrimaryRig() : null;
        const selectedRoot = hasProject ? Participants.rootOf(Group.first_selected ?? Outliner.selected[0]) : null;
        const camera = hasProject ? SceneCameraRig.find() : null;

        const participants = hasProject ? Participants.roots().map((root, index) => {
            const slot = root[Participants.slotKey];
            const rig = PalBridge.detectParticipantRig(root);
            return {
                uuid: root.uuid,
                index: index + 1,
                role: slot.role,
                type: slot.type,
                id: slot.id,
                visible: root.visibility !== false,
                selected: root === selectedRoot,
                rigBadge: rig ? (rig.preset === 'dragoncore' ? Locale.t('badge_dragoncore') : Locale.t('badge_pal')) : ''
            };
        }) : [];

        return {
            hasProject,
            palLinked,
            palStatus: palLinked ? Locale.t('badge_pal_linked', {version: palVersion}) : Locale.t('badge_pal_standalone'),
            palTooltip: palLinked ? Locale.t('tip_pal_linked') : Locale.t('tip_pal_standalone'),
            subjectName: hasProject ? (Project.name || Locale.t('panel_subject_unnamed')) : '',
            subjectRigBadge: primaryRig
                ? (primaryRig.preset === 'dragoncore' ? Locale.t('badge_dragoncore') : Locale.t('badge_pal'))
                : '',
            participants,
            hasCamera: Boolean(camera),
            cameraSelected: Boolean(camera && Group.first_selected === camera)
        };
    }

    function refresh() {
        if (!vm) return;
        Object.assign(vm, snapshot());
    }

    function groupByUuid(uuid) {
        return Participants.roots().find(group => group.uuid === uuid) || null;
    }

    function openAddMenu(event) {
        const anchor = event?.currentTarget instanceof HTMLElement ? event.currentTarget : event;
        new Menu([
            {
                name: Locale.t('menu_import_bbmodel'),
                icon: 'group_add',
                click: StudioDialogs.guard(() => StudioDialogs.importModelFile())
            },
            '_',
            {
                name: Locale.t('menu_import_pal_player'),
                icon: 'accessibility_new',
                click: StudioDialogs.guard(() => StudioDialogs.importPalPlayer('player'))
            },
            {
                name: Locale.t('menu_import_pal_dragoncore'),
                icon: 'sports_martial_arts',
                click: StudioDialogs.guard(() => StudioDialogs.importPalPlayer('dragoncore'))
            },
            '_',
            {
                name: Locale.t('menu_import_vanilla'),
                icon: 'person_add',
                click: StudioDialogs.guard(() => StudioDialogs.importVanilla())
            }
        ]).open(anchor);
    }

    function openActorMenu(uuid, index, total, event) {
        const root = groupByUuid(uuid);
        if (!root) return;
        const anchor = event?.type === 'contextmenu'
            ? event
            : (event?.currentTarget instanceof HTMLElement ? event.currentTarget : event);
        const items = [
            {
                name: Locale.t('tip_place_zero'),
                icon: 'open_with',
                click: StudioDialogs.guard(() => Participants.placeInViewport(root))
            },
            {
                name: Locale.t('tip_start_pos'),
                icon: 'place',
                click: StudioDialogs.guard(() => StudioDialogs.setStartPosition(root))
            },
            {
                name: Locale.t('tip_import_anim'),
                icon: 'file_upload',
                click: StudioDialogs.guard(() => StudioDialogs.importActorAnimationFile(root))
            },
            {
                name: Locale.t('tip_edit'),
                icon: 'edit',
                click: StudioDialogs.guard(() => StudioDialogs.editParticipant(root))
            },
            '_'
        ];
        if (index > 0) {
            items.push({
                name: Locale.t('tip_move_up'),
                icon: 'arrow_upward',
                click: StudioDialogs.guard(() => Participants.moveOrder(root, -1))
            });
        }
        if (index < total - 1) {
            items.push({
                name: Locale.t('tip_move_down'),
                icon: 'arrow_downward',
                click: StudioDialogs.guard(() => Participants.moveOrder(root, 1))
            });
        }
        items.push(
            {
                name: Locale.t('tip_duplicate'),
                icon: 'content_copy',
                click: StudioDialogs.guard(() => Participants.duplicate(root))
            },
            {
                name: Locale.t('tip_remove'),
                icon: 'delete_outline',
                click: StudioDialogs.guard(() => StudioDialogs.confirmRemoveParticipant(root))
            }
        );
        new Menu(items).open(anchor);
    }

    function register() {
        if (typeof Blockbench !== 'undefined' && typeof Blockbench.addCSS === 'function') {
            cssHandle = Blockbench.addCSS(STYLES);
        }
        panel = new Panel('animcue_studio_panel', {
            id: 'animcue_studio_panel',
            name: Locale.t('panel_title'),
            icon: 'movie_creation',
            growable: true,
            resizable: true,
            default_position: {
                slot: 'left_bar',
                float_position: [0, 0],
                float_size: [280, 360],
                height: 310
            },
            insert_after: 'animations',
            component: {
                data() {
                    return snapshot();
                },
                mounted() {
                    vm = this;
                },
                beforeDestroy() {
                    if (vm === this) vm = null;
                },
                methods: {
                    t: (key, params) => Locale.t(key, params),
                    newScene: StudioDialogs.guard(() => SceneProject.createBlankScene()),
                    openAdd: (event) => openAddMenu(event),
                    openMenu: (uuid, idx, event) => openActorMenu(uuid, idx, Participants.roots().length, event),
                    selectActor(uuid) {
                        const root = groupByUuid(uuid);
                        if (root) {
                            root.select();
                            refresh();
                        }
                    },
                    toggleVis(uuid) {
                        const root = groupByUuid(uuid);
                        if (root) Participants.toggleVisibility(root);
                    },
                    placeZero(uuid) {
                        const root = groupByUuid(uuid);
                        if (root) Participants.placeInViewport(root);
                    },
                    moveActor(uuid, delta) {
                        const root = groupByUuid(uuid);
                        if (root) Participants.moveOrder(root, delta);
                    },
                    duplicateActor(uuid) {
                        const root = groupByUuid(uuid);
                        if (root) Participants.duplicate(root);
                    },
                    addCamera: StudioDialogs.guard(() => SceneCameraRig.add()),
                    selectCamera() {
                        const cam = SceneCameraRig.find();
                        if (cam) {
                            cam.select();
                            refresh();
                        }
                    },
                    placeCamera: StudioDialogs.guard(() => SceneCameraRig.focusForAnimate()),
                    lookCamera: StudioDialogs.guard(() => SceneCameraRig.lookThrough()),
                    removeCamera: StudioDialogs.guard(() => StudioDialogs.confirmRemoveCamera()),
                    insertEvent: StudioDialogs.guard(() => StudioDialogs.insertEventDialog()),
                    showTracks: StudioDialogs.guard(() => InteractionCodec.showActiveTracks()),
                    importScene: StudioDialogs.guard(() => StudioDialogs.importSceneFile()),
                    exportScene: StudioDialogs.guard(() => StudioDialogs.exportDialog())
                },
                template: `
                    <div class="animcue-panel">
                        <div class="animcue-bar" v-if="hasProject">
                            <div class="animcue-action-btn" :title="t('panel_btn_add')" @click="openAdd($event)">
                                <i class="material-icons">add</i><span>{{ t('panel_btn_add') }}</span>
                            </div>
                            <div class="animcue-tool" :title="t('panel_btn_event')" @click="insertEvent">
                                <i class="material-icons">flag</i>
                            </div>
                            <div class="animcue-tool" :title="t('panel_btn_tracks')" @click="showTracks">
                                <i class="material-icons">view_timeline</i>
                            </div>
                            <div class="animcue-spacer"></div>
                            <div class="animcue-tool" :title="t('toolbar_import')" @click="importScene">
                                <i class="material-icons">file_upload</i>
                            </div>
                            <div class="animcue-action-btn primary" :title="t('toolbar_export')" @click="exportScene">
                                <i class="material-icons">movie</i><span>{{ t('panel_btn_export') }}</span>
                            </div>
                        </div>

                        <div v-if="!hasProject" class="animcue-body">
                            <div class="animcue-empty-box">
                                <div>{{ t('panel_no_project') }}</div>
                                <div class="animcue-action-btn primary" style="margin-top:8px;" @click="newScene">
                                    <i class="material-icons">add</i><span>{{ t('panel_create_scene') }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-else class="animcue-body">
                            <div class="animcue-card subject" :title="subjectName">
                                <div class="animcue-avatar"><i class="material-icons">deployed_code</i></div>
                                <div class="animcue-info">
                                    <div class="animcue-name-line">
                                        <span class="animcue-name">{{ subjectName }}</span>
                                    </div>
                                    <div class="animcue-sub">{{ t('badge_subject') }}</div>
                                </div>
                                <span v-if="subjectRigBadge" class="animcue-chip accent">{{ subjectRigBadge }}</span>
                            </div>

                            <div class="animcue-group-label">
                                <span>{{ t('panel_participants_heading') }}</span>
                                <span>{{ participants.length }}</span>
                            </div>

                            <div v-if="!participants.length" class="animcue-empty-box">
                                {{ t('panel_empty_participants') }}
                            </div>

                            <div v-for="(actor, idx) in participants" :key="actor.uuid"
                                 class="animcue-card"
                                 :class="{selected: actor.selected, dimmed: !actor.visible}"
                                 @click="selectActor(actor.uuid)"
                                 @dblclick="placeZero(actor.uuid)"
                                 @contextmenu.prevent="openMenu(actor.uuid, idx, $event)">
                                <div class="animcue-avatar">{{ actor.index }}</div>
                                <div class="animcue-info">
                                    <div class="animcue-name-line">
                                        <span class="animcue-name">{{ actor.role }}</span>
                                        <span v-if="actor.rigBadge" class="animcue-chip accent">{{ actor.rigBadge }}</span>
                                    </div>
                                    <div class="animcue-sub">{{ actor.id }}</div>
                                </div>
                                <div class="animcue-row-btns" @click.stop>
                                    <div class="animcue-row-btn" :title="t('tip_place_zero')" @click="placeZero(actor.uuid)">
                                        <i class="material-icons">open_with</i>
                                    </div>
                                    <div class="animcue-row-btn" :title="t('tip_toggle_vis')" @click="toggleVis(actor.uuid)">
                                        <i class="material-icons">{{ actor.visible ? 'visibility' : 'visibility_off' }}</i>
                                    </div>
                                    <div class="animcue-row-btn" :title="t('tip_more')" @click="openMenu(actor.uuid, idx, $event)">
                                        <i class="material-icons">more_vert</i>
                                    </div>
                                </div>
                            </div>

                            <div v-if="hasCamera" class="animcue-card" :class="{selected: cameraSelected}"
                                 @click="selectCamera" @dblclick="placeCamera">
                                <div class="animcue-avatar"><i class="material-icons">videocam</i></div>
                                <div class="animcue-info">
                                    <div class="animcue-name">{{ t('badge_camera') }}</div>
                                    <div class="animcue-sub">{{ t('panel_camera_ready') }}</div>
                                </div>
                                <div class="animcue-row-btns" @click.stop>
                                    <div class="animcue-row-btn" :title="t('tip_place_camera')" @click="placeCamera">
                                        <i class="material-icons">open_with</i>
                                    </div>
                                    <div class="animcue-row-btn" :title="t('tip_look_camera')" @click="lookCamera">
                                        <i class="material-icons">center_focus_strong</i>
                                    </div>
                                    <div class="animcue-row-btn" :title="t('tip_remove')" @click="removeCamera">
                                        <i class="material-icons">delete_outline</i>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="animcue-cam-add" @click="addCamera">
                                <i class="material-icons">videocam</i><span>{{ t('panel_btn_add_camera') }}</span>
                            </div>
                        </div>

                        <div class="animcue-footer" :title="palTooltip">
                            <span><span class="animcue-dot" :class="{on: palLinked}"></span>{{ palStatus }}</span>
                            <span v-if="hasProject">{{ participants.length === 1 ? t('panel_footer_actor_one') : t('panel_footer_actor_many', {count: participants.length}) }}</span>
                        </div>
                    </div>
                `
            }
        });

        const hook = event => {
            const handler = () => refresh();
            Blockbench.on(event, handler);
            eventCleanups.push(() => Blockbench.removeListener(event, handler));
        };
        ['select_project', 'close_project', 'update_selection', 'finished_edit', 'select_mode', 'load_project'].forEach(hook);
        eventCleanups.push(PalBridge.onChange(() => refresh()));

        return {
            delete() {
                while (eventCleanups.length) eventCleanups.pop()();
                if (panel) panel.delete();
                panel = null;
                vm = null;
                if (cssHandle) cssHandle.delete();
                cssHandle = null;
            }
        };
    }

    return {register, refresh};
})();

const StudioMenus = (() => {
    const cleanups = [];

    function register() {
        const ready = StudioDialogs.ready;
        const guard = StudioDialogs.guard;

        const addAction = (id, nameKey, icon, condition, click) => {
            const action = new Action(id, {name: Locale.t(nameKey), icon, condition, click: guard(click)});
            cleanups.push(() => action.delete());
            return action;
        };

        const actNewScene = addAction('animcue_new_scene', 'menu_new_scene', 'movie_creation', true, () => SceneProject.createBlankScene());
        const actImportFile = addAction('animcue_import_participant', 'menu_import_bbmodel', 'group_add', ready, () => StudioDialogs.importModelFile());
        const actImportPal = addAction('animcue_import_pal_player', 'menu_import_pal_player', 'accessibility_new', ready, () => StudioDialogs.importPalPlayer('player'));
        const actImportDc = addAction('animcue_import_pal_dragoncore', 'menu_import_pal_dragoncore', 'sports_martial_arts', ready, () => StudioDialogs.importPalPlayer('dragoncore'));
        const actImportVanilla = addAction('animcue_import_vanilla', 'menu_import_vanilla', 'person_add', ready, () => StudioDialogs.importVanilla());
        const actAddCamera = addAction('animcue_add_camera', 'menu_add_camera', 'videocam', ready, () => SceneCameraRig.add());
        const actLookCamera = addAction('animcue_look_camera', 'menu_look_camera', 'center_focus_strong', () => ready() && Boolean(SceneCameraRig.find()), () => SceneCameraRig.lookThrough());
        const actEditSlot = addAction('animcue_edit_participant', 'menu_edit_participant', 'edit', ready, () => StudioDialogs.editParticipant());
        const actPlaceViewport = addAction('animcue_place_in_viewport', 'menu_place_viewport', 'open_with', ready, () => Participants.placeInViewport());
        const actStartPos = addAction('animcue_start_position', 'menu_set_start_pos', 'place', ready, () => StudioDialogs.setStartPosition());
        const actImportActorAnim = addAction('animcue_import_actor_anim', 'menu_import_actor_anim', 'file_upload', ready, () => StudioDialogs.importActorAnimationFile());
        const actInsertEvent = addAction('animcue_insert_event', 'menu_add_event', 'flag', ready, () => StudioDialogs.insertEventDialog());
        const actShowTracks = addAction('animcue_show_tracks', 'menu_show_tracks', 'view_timeline', () => ready() && Boolean(Animation.selected), () => InteractionCodec.showActiveTracks());
        const actImportScene = addAction('animcue_import_scene', 'menu_import_scene', 'file_upload', ready, () => StudioDialogs.importSceneFile());
        const actExportDialog = addAction('animcue_export_dialog', 'menu_export_scene', 'movie', ready, () => StudioDialogs.exportDialog());
        const actExportSelected = addAction('animcue_export_selected', 'menu_export_selected', 'movie', ready, () => StudioDialogs.exportDialog('selected'));
        const actExportAll = addAction('animcue_export_all', 'menu_export_all', 'video_library', ready, () => StudioDialogs.exportDialog('all'));

        // File menu entries
        MenuBar.addAction(actNewScene, 'file.new');
        MenuBar.addAction(actImportScene, 'file.import');
        MenuBar.addAction(actExportDialog, 'file.export');

        // Grouped submenu under Tools (keeps Blockbench's Tools menu clean)
        const toolsSubmenu = {
            id: 'animcue_tools_menu',
            name: Locale.t('menu_root'),
            icon: 'movie_creation',
            condition: ready,
            children: [
                {
                    id: 'animcue_add_submenu',
                    name: Locale.t('menu_add_participant'),
                    icon: 'group_add',
                    children: [actImportFile, actImportPal, actImportDc, actImportVanilla]
                },
                actAddCamera,
                actLookCamera,
                '_',
                actPlaceViewport,
                actStartPos,
                actEditSlot,
                actImportActorAnim,
                '_',
                actInsertEvent,
                actShowTracks,
                '_',
                actImportScene,
                actExportSelected,
                actExportAll
            ]
        };
        MenuBar.addAction(toolsSubmenu, 'tools');
        cleanups.push(() => MenuBar.menus?.tools?.removeAction(toolsSubmenu));

        // Animation menu shortcut
        MenuBar.addAction(actShowTracks, 'animation');
        MenuBar.addAction(actInsertEvent, 'animation');

        // Outliner right-click context menu on participant root or descendant groups
        const outlinerSubmenu = {
            id: 'animcue_outliner_menu',
            name: Locale.t('menu_root'),
            icon: 'movie_creation',
            condition: () => ready() && Boolean(Participants.rootOf(Group.first_selected)),
            children: [
                {
                    name: Locale.t('menu_select_root'),
                    icon: 'account_tree',
                    click: guard(() => Participants.selectedRoot().select())
                },
                {
                    name: Locale.t('menu_place_viewport'),
                    icon: 'open_with',
                    click: guard(() => Participants.placeInViewport())
                },
                {
                    name: Locale.t('menu_set_start_pos'),
                    icon: 'place',
                    click: guard(() => StudioDialogs.setStartPosition())
                },
                {
                    name: Locale.t('menu_import_actor_anim'),
                    icon: 'file_upload',
                    click: guard(() => StudioDialogs.importActorAnimationFile())
                },
                {
                    name: Locale.t('menu_edit_participant'),
                    icon: 'edit',
                    click: guard(() => StudioDialogs.editParticipant())
                },
                '_',
                {
                    name: Locale.t('menu_duplicate_participant'),
                    icon: 'content_copy',
                    click: guard(() => Participants.duplicate(Participants.selectedRoot()))
                },
                {
                    name: Locale.t('menu_remove_participant'),
                    icon: 'delete_outline',
                    click: guard(() => StudioDialogs.confirmRemoveParticipant())
                }
            ]
        };
        if (Group?.prototype?.menu && typeof Group.prototype.menu.addAction === 'function') {
            Group.prototype.menu.addAction(outlinerSubmenu);
            cleanups.push(() => Group.prototype.menu.removeAction(outlinerSubmenu));
        }

        // Animation panel toolbar quick actions (matching pal_bend_player_tools ergonomics)
        const attachToolbar = () => {
            if (!globalThis.Toolbars?.animations || typeof Toolbars.animations.add !== 'function') return;
            const toolbar = Toolbars.animations;
            const has = id => Array.isArray(toolbar.children) && toolbar.children.some(item => item === id || item?.id === id);
            if (!has(actExportDialog.id)) {
                toolbar.add(actExportDialog);
                cleanups.push(() => toolbar.remove?.(actExportDialog));
            }
        };
        attachToolbar();
        const timer = setTimeout(attachToolbar, 250);
        cleanups.push(() => clearTimeout(timer));

        return {
            delete() {
                while (cleanups.length) {
                    try { cleanups.pop()(); } catch (_ignore) {}
                }
            }
        };
    }

    return {register};
})();

const cleanup = [];

Plugin.register('animcue_studio', {
    title: 'AnimCue Studio',
    author: 'kltyton',
    description: 'Animate multiple models and a scene camera on one Blockbench timeline, with PAL / MoreRotation bend support.',
    icon: 'icon.png',
    tags: ['Minecraft: Java Edition', 'Animation', 'Tools'],
    version: '0.3.0',
    min_version: '5.0.0',
    variant: 'both',
    await_loading: true,
    creation_date: '2026/11/24',
    website: 'https://github.com/kltyton/AnimCue-Studio/wiki',
    repository: 'https://github.com/kltyton/AnimCue-Studio',
    bug_tracker: 'https://github.com/kltyton/AnimCue-Studio/issues',
    onload() {
        Locale.register();
        cleanup.push(...Participants.register());
        cleanup.push(SceneCameraRig.register());
        cleanup.push(PalBridge.register());
        cleanup.push(SceneProject.register());
        cleanup.push(InteractionCodec.hookNativeImport());
        cleanup.push(StudioPanel.register());
        cleanup.push(StudioMenus.register());
        StudioPanel.refresh();
    },
    onunload() {
        for (const entry of cleanup.splice(0).reverse()) {
            try { entry.delete(); } catch (_ignore) {}
        }
    }
});

})();
