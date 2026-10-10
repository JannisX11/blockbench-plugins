(function () {
  const PLUGIN_ID = "two_bone_ik";
  const EPSILON = 0.000001;
  const PROJECT_DATA_PROPERTY = "two_bone_ik_settings";
  const PROJECT_DATA_VERSION = 3;
  const MAX_RANGE_BAKE_FRAMES = 10000;
  const MAX_RANGE_BAKE_KEYFRAMES = 100000;
  const MAXIMUM_SPLINE_CONTROL_COUNT = 8;
  const MINIMUM_SPLINE_GUIDE_ALIGNMENT = 0.35;
  const MAXIMUM_SPLINE_TURN_DOT_DEVIATION = 0.5;
  const ENGLISH_TRANSLATIONS = {
    "two_bone_ik.panel.name": "IK Tools",
    "two_bone_ik.action.open": "Open IK Tools Panel",
    "two_bone_ik.action.open.description":
      "Open the sidebar panel for adding, editing, previewing, and baking IK chains.",
    "two_bone_ik.node.bone": "Bone",
    "two_bone_ik.node.locator": "Locator",
    "two_bone_ik.node.null": "Null",
    "two_bone_ik.node.object": "Object",
    "two_bone_ik.node.none": "None",
    "two_bone_ik.select.bone": "Select a bone",
    "two_bone_ik.select.object": "Select an object",
    "two_bone_ik.ui.add": "Add IK",
    "two_bone_ik.ui.add.title": "Create IK from the selected end bone",
    "two_bone_ik.ui.preview_all": "Preview All",
    "two_bone_ik.ui.preview_all.title":
      "Toggle live preview for every IK constraint",
    "two_bone_ik.ui.bake_all": "Bake All",
    "two_bone_ik.ui.bake_all.title": "Bake every IK pose at the current frame",
    "two_bone_ik.ui.bake_one": "Bake",
    "two_bone_ik.ui.bake_one.title":
      "Bake only this IK pose at the current frame",
    "two_bone_ik.ui.empty.title": "No IK constraints yet",
    "two_bone_ik.ui.empty.description":
      "Select an end point, then click Add IK and choose an IK type.",
    "two_bone_ik.ui.empty.action": "Create First IK",
    "two_bone_ik.ui.expand": "Expand IK",
    "two_bone_ik.ui.collapse": "Collapse IK",
    "two_bone_ik.ui.edit": "Edit",
    "two_bone_ik.ui.delete": "Delete",
    "two_bone_ik.ui.ik_weight": "IK / FK Blend",
    "two_bone_ik.ui.weight": "Weight",
    "two_bone_ik.ui.ik_weight_hint":
      "0% keeps the FK pose; 100% applies the full IK solution. Baking a partial blend turns Live Preview off to keep the baked pose stable.",
    "two_bone_ik.ui.target": "Target",
    "two_bone_ik.ui.pole": "Pole",
    "two_bone_ik.ui.live": "Live",
    "two_bone_ik.ui.guides": "Guides",
    "two_bone_ik.ui.bake_current": "Bake All at Current Frame",
    "two_bone_ik.ui.bake_range": "Bake Range",
    "two_bone_ik.ui.bake_range_all": "Bake Range · All IK",
    "two_bone_ik.ui.bake_range_one": "Bake Range · %0",
    "two_bone_ik.ui.start_frame": "Start Frame",
    "two_bone_ik.ui.end_frame": "End Frame",
    "two_bone_ik.ui.frame_step": "Frame Step",
    "two_bone_ik.ui.range_timing": "%0 FPS · frames 0–%1",
    "two_bone_ik.ui.range_hint":
      "Includes both endpoints. Replaces rotation keys in this range for the chosen IK only. Partial blends turn Live off after baking.",
    "two_bone_ik.ui.clear_all": "Clear All",
    "two_bone_ik.ui.edit_ik": "Edit IK",
    "two_bone_ik.ui.new_ik": "New IK",
    "two_bone_ik.ui.close": "Close",
    "two_bone_ik.ui.name": "Name",
    "two_bone_ik.ui.auto_name": "Automatic name",
    "two_bone_ik.ui.ik_type": "IK Type",
    "two_bone_ik.type.two_bone": "Two-Bone IK",
    "two_bone_ik.type.chain": "Chain IK (FABRIK)",
    "two_bone_ik.type.spline": "Spline IK",
    "two_bone_ik.type.aim": "Aim IK",
    "two_bone_ik.ui.chain": "Chain",
    "two_bone_ik.ui.root_bone": "Root Bone",
    "two_bone_ik.ui.aim_bone": "Aim Bone",
    "two_bone_ik.ui.aim_reference": "Aim Reference",
    "two_bone_ik.ui.upper_bone": "Upper Bone",
    "two_bone_ik.ui.lower_bone": "Lower Bone",
    "two_bone_ik.ui.end_effector": "End Effector",
    "two_bone_ik.ui.tip_target": "Tip Target",
    "two_bone_ik.ui.curve_controls": "Curve Controls",
    "two_bone_ik.ui.controls": "Controls",
    "two_bone_ik.ui.add_control": "Add Control Point",
    "two_bone_ik.ui.add_selected": "Add Selected",
    "two_bone_ik.ui.move_up": "Move Up",
    "two_bone_ik.ui.move_down": "Move Down",
    "two_bone_ik.ui.remove_control": "Remove Control Point",
    "two_bone_ik.ui.control_order_hint":
      "Add 1–8 objects from root to tip. Controls must stay outside the bone chain. Bone lengths are preserved, so a strongly mismatched curve may not reach the tip exactly.",
    "two_bone_ik.ui.root_stiffness": "Root Stiffness",
    "two_bone_ik.ui.root_stiffness_hint":
      "Higher values keep the curve straighter near the root.",
    "two_bone_ik.ui.mode": "Mode",
    "two_bone_ik.ui.object": "Object",
    "two_bone_ik.ui.fixed_point": "Fixed Point",
    "two_bone_ik.ui.coordinates": "Coordinates",
    "two_bone_ik.ui.pole_bend": "Pole / Bend",
    "two_bone_ik.ui.pole_object": "Pole Object",
    "two_bone_ik.ui.bend_direction": "Bend Direction",
    "two_bone_ik.ui.direction": "Direction",
    "two_bone_ik.ui.hierarchy_hint":
      "Targets, Two-Bone poles, and Spline controls may stay inside the rig root, but must remain outside their controlled bone chain.",
    "two_bone_ik.ui.live_preview": "Live Preview",
    "two_bone_ik.ui.show_guides": "Show Guides",
    "two_bone_ik.ui.cancel": "Cancel",
    "two_bone_ik.ui.save": "Save",
    "two_bone_ik.dialog.validation.title": "Check IK Setup",
    "two_bone_ik.dialog.ok": "OK",
    "two_bone_ik.message.saved": "IK saved · %0 total",
    "two_bone_ik.message.preview_enabled": "All IK previews enabled",
    "two_bone_ik.message.preview_disabled": "All IK previews disabled",
    "two_bone_ik.message.cleared": "All IK constraints cleared",
    "two_bone_ik.message.baked": "%0 IK poses baked at the current frame",
    "two_bone_ik.message.baked_unreachable":
      "%0 IK poses baked; %1 target(s) could not be reached exactly",
    "two_bone_ik.message.baked_one": "“%0” baked at the current frame",
    "two_bone_ik.message.baked_one_unreachable":
      "“%0” baked; its target could not be reached exactly",
    "two_bone_ik.undo.bake": "Bake current IK poses",
    "two_bone_ik.undo.bake_one": "Bake IK pose: %0",
    "two_bone_ik.undo.bake_range": "Bake IK range: frames %0–%1",
    "two_bone_ik.message.range_baked":
      "%0 IK · %1 sampled frames · %2 rotation keys baked",
    "two_bone_ik.message.range_unreachable":
      "%0 IK/frame sample(s) could not reach the target exactly.",
    "two_bone_ik.error.bake_range_invalid":
      "Use whole frame numbers: 0 ≤ Start ≤ End, Frame Step ≥ 1, and End within 1000 seconds.",
    "two_bone_ik.error.bake_range_length":
      "End Frame must be within the selected animation (0–%0).",
    "two_bone_ik.error.bake_range_limit":
      "This range is too large. Use a shorter range or a larger Frame Step (up to %0 samples and %1 rotation keys per bake).",
    "two_bone_ik.error.bake_range_busy":
      "Finish the current edit before baking a range.",
    "two_bone_ik.error.bake_range_pose":
      "Could not sample “%0” at frame %1. No keys were changed.",
    "two_bone_ik.error.open_project": "Open a model project first.",
    "two_bone_ik.error.select_chain":
      "Select an upper bone, lower bone, and end effector.",
    "two_bone_ik.error.select_chain_root":
      "Select a root bone and an end effector for Chain IK.",
    "two_bone_ik.error.chain_hierarchy":
      "The end effector must be below the Chain IK root bone.",
    "two_bone_ik.error.chain_too_short":
      "Chain IK needs at least two controlled bones. Move the root higher in the hierarchy.",
    "two_bone_ik.error.select_spline":
      "Select a root bone and an end effector for Spline IK.",
    "two_bone_ik.error.spline_hierarchy":
      "The end effector must be below the Spline IK root bone.",
    "two_bone_ik.error.spline_too_short":
      "Spline IK needs at least two controlled bones. Move the root higher in the hierarchy.",
    "two_bone_ik.error.spline_control_required":
      "Add at least one curve control object for Spline IK.",
    "two_bone_ik.error.spline_control_limit":
      "Spline IK supports up to %0 curve control objects.",
    "two_bone_ik.error.spline_control_invalid":
      "Select a valid object for every Spline control point.",
    "two_bone_ik.error.spline_control_duplicate":
      "Each Spline control point must use a different object.",
    "two_bone_ik.error.spline_control_cycle":
      "Spline control objects must be outside the controlled bone chain.",
    "two_bone_ik.error.spline_control_matches_target":
      "The Tip Target and curve control points must use different objects.",
    "two_bone_ik.error.spline_curve_degenerate":
      "The Spline curve needs at least two different world-space positions.",
    "two_bone_ik.error.dependency_cycle":
      "This IK creates a driver cycle with “%0”. Move one target or control outside the other IK's controlled chain.",
    "two_bone_ik.error.newer_project_data":
      "This project contains IK settings from a newer plugin version. Update IK Tools before editing them.",
    "two_bone_ik.error.select_aim":
      "Select an aim bone and a descendant aim reference.",
    "two_bone_ik.error.aim_hierarchy":
      "The aim reference must be a child or descendant of the aim bone.",
    "two_bone_ik.error.same_bones":
      "The upper and lower bones must be different.",
    "two_bone_ik.error.lower_hierarchy":
      "The lower bone must be a child or descendant of the upper bone.",
    "two_bone_ik.error.end_hierarchy":
      "The end effector must be a child or descendant of the lower bone.",
    "two_bone_ik.error.overlap":
      "Each IK constraint must control different bones. This chain overlaps “%0”.",
    "two_bone_ik.error.target_invalid": "Select a valid target object.",
    "two_bone_ik.error.target_cycle":
      "The target object must be outside the IK bone chain.",
    "two_bone_ik.error.pole_invalid": "Select a valid pole target.",
    "two_bone_ik.error.pole_cycle":
      "The pole target must be outside the IK bone chain.",
    "two_bone_ik.error.zero_direction":
      "The bend direction cannot be a zero vector.",
    "two_bone_ik.error.preview_transform":
      "One or more selected nodes do not have a usable preview transform.",
    "two_bone_ik.error.upper_zero_length":
      "The upper bone has zero length. Check the upper and lower bone pivots.",
    "two_bone_ik.error.lower_zero_length":
      "The lower bone has zero length. Check the lower bone and end-effector pivots.",
    "two_bone_ik.error.configure_first": "Configure an IK chain first.",
    "two_bone_ik.error.select_animation":
      "Select an animation and switch to Animate mode before baking.",
    "two_bone_ik.error.cannot_bake.title": "Cannot Bake IK",
    "two_bone_ik.error.solve_failed":
      "One or more IK solvers could not produce a pose for the current frame.",
    "two_bone_ik.error.keyframe_failed":
      "One or more rotation keyframes could not be created. No changes were baked.",
    "two_bone_ik.error.unsupported_bone":
      "The selected animation format cannot animate one of the IK bones.",
    "two_bone_ik.error.global_rotation":
      "Turn off “Rotate in Global Space” for all IK bones, then bake again.",
  };
  const KOREAN_TRANSLATIONS = {
    "two_bone_ik.panel.name": "IK 도구",
    "two_bone_ik.action.open": "IK 도구 패널 열기",
    "two_bone_ik.action.open.description":
      "IK 체인을 추가·수정·미리보기·Bake하는 사이드바 패널을 엽니다.",
    "two_bone_ik.node.bone": "뼈",
    "two_bone_ik.node.locator": "로케이터",
    "two_bone_ik.node.null": "Null",
    "two_bone_ik.node.object": "오브젝트",
    "two_bone_ik.node.none": "없음",
    "two_bone_ik.select.bone": "뼈 선택",
    "two_bone_ik.select.object": "오브젝트 선택",
    "two_bone_ik.ui.add": "IK 추가",
    "two_bone_ik.ui.add.title": "선택한 끝뼈에서 새 IK 만들기",
    "two_bone_ik.ui.preview_all": "전체 미리보기",
    "two_bone_ik.ui.preview_all.title": "모든 IK의 실시간 미리보기 켜기/끄기",
    "two_bone_ik.ui.bake_all": "전체 Bake",
    "two_bone_ik.ui.bake_all.title": "현재 프레임에서 모든 IK 포즈 Bake",
    "two_bone_ik.ui.bake_one": "Bake",
    "two_bone_ik.ui.bake_one.title": "현재 프레임에서 이 IK 포즈만 Bake",
    "two_bone_ik.ui.empty.title": "아직 IK가 없습니다",
    "two_bone_ik.ui.empty.description":
      "끝점을 선택하고 IK 추가를 누른 다음 IK 종류를 고르세요.",
    "two_bone_ik.ui.empty.action": "첫 IK 만들기",
    "two_bone_ik.ui.expand": "IK 펼치기",
    "two_bone_ik.ui.collapse": "IK 접기",
    "two_bone_ik.ui.edit": "수정",
    "two_bone_ik.ui.delete": "삭제",
    "two_bone_ik.ui.ik_weight": "IK / FK 블렌드",
    "two_bone_ik.ui.weight": "가중치",
    "two_bone_ik.ui.ik_weight_hint":
      "0%는 FK 포즈를 유지하고, 100%는 IK 결과를 완전히 적용합니다. 중간값을 Bake하면 포즈 누적을 막기 위해 실시간 미리보기가 꺼집니다.",
    "two_bone_ik.ui.target": "타깃",
    "two_bone_ik.ui.pole": "Pole",
    "two_bone_ik.ui.live": "실시간",
    "two_bone_ik.ui.guides": "가이드",
    "two_bone_ik.ui.bake_current": "현재 포즈 전체 Bake",
    "two_bone_ik.ui.bake_range": "구간 Bake",
    "two_bone_ik.ui.bake_range_all": "구간 Bake · 전체 IK",
    "two_bone_ik.ui.bake_range_one": "구간 Bake · %0",
    "two_bone_ik.ui.start_frame": "시작 프레임",
    "two_bone_ik.ui.end_frame": "끝 프레임",
    "two_bone_ik.ui.frame_step": "프레임 간격",
    "two_bone_ik.ui.range_timing": "%0 FPS · 0–%1 프레임",
    "two_bone_ik.ui.range_hint":
      "시작·끝 프레임을 모두 포함합니다. 선택한 IK의 구간 내 회전 키만 교체합니다. 부분 블렌드는 Bake 후 Live가 꺼집니다.",
    "two_bone_ik.ui.clear_all": "모두 지우기",
    "two_bone_ik.ui.edit_ik": "IK 수정",
    "two_bone_ik.ui.new_ik": "새 IK",
    "two_bone_ik.ui.close": "닫기",
    "two_bone_ik.ui.name": "이름",
    "two_bone_ik.ui.auto_name": "자동 이름",
    "two_bone_ik.ui.ik_type": "IK 종류",
    "two_bone_ik.type.two_bone": "Two-Bone IK",
    "two_bone_ik.type.chain": "Chain IK (FABRIK)",
    "two_bone_ik.type.spline": "Spline IK",
    "two_bone_ik.type.aim": "Aim IK",
    "two_bone_ik.ui.chain": "체인",
    "two_bone_ik.ui.root_bone": "루트 뼈",
    "two_bone_ik.ui.aim_bone": "조준 뼈",
    "two_bone_ik.ui.aim_reference": "조준 기준점",
    "two_bone_ik.ui.upper_bone": "상단 뼈",
    "two_bone_ik.ui.lower_bone": "하단 뼈",
    "two_bone_ik.ui.end_effector": "끝점",
    "two_bone_ik.ui.tip_target": "끝 타깃",
    "two_bone_ik.ui.curve_controls": "곡선 컨트롤",
    "two_bone_ik.ui.controls": "컨트롤",
    "two_bone_ik.ui.add_control": "컨트롤 포인트 추가",
    "two_bone_ik.ui.add_selected": "선택 항목 추가",
    "two_bone_ik.ui.move_up": "위로 이동",
    "two_bone_ik.ui.move_down": "아래로 이동",
    "two_bone_ik.ui.remove_control": "컨트롤 포인트 제거",
    "two_bone_ik.ui.control_order_hint":
      "루트에서 끝 방향 순서로 오브젝트를 1~8개 추가하세요. 컨트롤은 뼈 체인 밖에 있어야 합니다. 뼈 길이를 유지하므로 곡선 길이 차이가 크면 끝 타깃에 정확히 닿지 않을 수 있습니다.",
    "two_bone_ik.ui.root_stiffness": "루트 강도",
    "two_bone_ik.ui.root_stiffness_hint":
      "값이 높을수록 루트 근처 곡선을 더 곧게 유지합니다.",
    "two_bone_ik.ui.mode": "방식",
    "two_bone_ik.ui.object": "오브젝트",
    "two_bone_ik.ui.fixed_point": "고정 좌표",
    "two_bone_ik.ui.coordinates": "좌표",
    "two_bone_ik.ui.pole_bend": "Pole / 굽힘",
    "two_bone_ik.ui.pole_object": "Pole 오브젝트",
    "two_bone_ik.ui.bend_direction": "굽힘 방향",
    "two_bone_ik.ui.direction": "방향",
    "two_bone_ik.ui.hierarchy_hint":
      "타깃, Two-Bone Pole, Spline 컨트롤은 리그 루트 안에 둘 수 있지만 자신이 제어하는 뼈 체인 밖에 있어야 합니다.",
    "two_bone_ik.ui.live_preview": "실시간 미리보기",
    "two_bone_ik.ui.show_guides": "가이드 표시",
    "two_bone_ik.ui.cancel": "취소",
    "two_bone_ik.ui.save": "저장",
    "two_bone_ik.dialog.validation.title": "IK 설정 확인",
    "two_bone_ik.dialog.ok": "확인",
    "two_bone_ik.message.saved": "IK 저장됨 · 총 %0개",
    "two_bone_ik.message.preview_enabled": "모든 IK 미리보기를 켰습니다",
    "two_bone_ik.message.preview_disabled": "모든 IK 미리보기를 껐습니다",
    "two_bone_ik.message.cleared": "모든 IK 설정을 지웠습니다",
    "two_bone_ik.message.baked": "현재 프레임에 IK 포즈 %0개를 Bake했습니다",
    "two_bone_ik.message.baked_unreachable":
      "IK 포즈 %0개를 Bake했습니다. 타깃 %1개는 정확히 도달할 수 없었습니다",
    "two_bone_ik.message.baked_one": "현재 프레임에 “%0”을 Bake했습니다",
    "two_bone_ik.message.baked_one_unreachable":
      "“%0”을 Bake했습니다. 타깃에 정확히 도달할 수 없었습니다",
    "two_bone_ik.undo.bake": "현재 IK 포즈 Bake",
    "two_bone_ik.undo.bake_one": "IK 포즈 Bake: %0",
    "two_bone_ik.undo.bake_range": "IK 구간 Bake: %0–%1 프레임",
    "two_bone_ik.message.range_baked":
      "IK %0개 · %1프레임 · 회전 키 %2개를 Bake했습니다",
    "two_bone_ik.message.range_unreachable":
      "IK/프레임 샘플 %0개에서 타깃에 정확히 도달하지 못했습니다.",
    "two_bone_ik.error.bake_range_invalid":
      "프레임은 정수로 입력하세요: 0 ≤ 시작 ≤ 끝, 간격 ≥ 1, 끝 프레임은 1000초 이내여야 합니다.",
    "two_bone_ik.error.bake_range_length":
      "끝 프레임은 선택한 애니메이션 범위(0–%0) 안이어야 합니다.",
    "two_bone_ik.error.bake_range_limit":
      "구간이 너무 큽니다. 범위를 줄이거나 프레임 간격을 늘리세요(한 번에 최대 %0개 샘플·회전 키 %1개).",
    "two_bone_ik.error.bake_range_busy":
      "진행 중인 편집을 마친 뒤 구간을 Bake하세요.",
    "two_bone_ik.error.bake_range_pose":
      "%1프레임에서 “%0”의 포즈를 계산하지 못했습니다. 키는 변경되지 않았습니다.",
    "two_bone_ik.error.open_project": "먼저 모델 프로젝트를 여세요.",
    "two_bone_ik.error.select_chain": "상단 뼈, 하단 뼈, 끝점을 선택하세요.",
    "two_bone_ik.error.select_chain_root":
      "Chain IK의 루트 뼈와 끝점을 선택하세요.",
    "two_bone_ik.error.chain_hierarchy":
      "끝점은 Chain IK 루트 뼈의 하위 항목이어야 합니다.",
    "two_bone_ik.error.chain_too_short":
      "Chain IK에는 제어할 뼈가 두 개 이상 필요합니다. 루트 뼈를 더 위에서 선택하세요.",
    "two_bone_ik.error.select_spline":
      "Spline IK의 루트 뼈와 끝점을 선택하세요.",
    "two_bone_ik.error.spline_hierarchy":
      "끝점은 Spline IK 루트 뼈의 하위 항목이어야 합니다.",
    "two_bone_ik.error.spline_too_short":
      "Spline IK에는 제어할 뼈가 두 개 이상 필요합니다. 루트 뼈를 더 위에서 선택하세요.",
    "two_bone_ik.error.spline_control_required":
      "Spline IK에 곡선 컨트롤 오브젝트를 하나 이상 추가하세요.",
    "two_bone_ik.error.spline_control_limit":
      "Spline IK 곡선 컨트롤은 최대 %0개까지 사용할 수 있습니다.",
    "two_bone_ik.error.spline_control_invalid":
      "모든 Spline 컨트롤 포인트에 올바른 오브젝트를 선택하세요.",
    "two_bone_ik.error.spline_control_duplicate":
      "각 Spline 컨트롤 포인트에는 서로 다른 오브젝트를 사용하세요.",
    "two_bone_ik.error.spline_control_cycle":
      "Spline 컨트롤 오브젝트는 제어되는 뼈 체인 밖에 있어야 합니다.",
    "two_bone_ik.error.spline_control_matches_target":
      "끝 타깃과 곡선 컨트롤 포인트에는 서로 다른 오브젝트를 사용하세요.",
    "two_bone_ik.error.spline_curve_degenerate":
      "Spline 곡선에는 서로 다른 월드 좌표가 두 개 이상 필요합니다.",
    "two_bone_ik.error.dependency_cycle":
      "이 IK는 “%0”과 드라이버 순환을 만듭니다. 한쪽 타깃 또는 컨트롤을 다른 IK의 제어 체인 밖으로 옮기세요.",
    "two_bone_ik.error.newer_project_data":
      "이 프로젝트에는 더 최신 플러그인에서 만든 IK 설정이 있습니다. 수정하기 전에 IK 도구를 업데이트하세요.",
    "two_bone_ik.error.select_aim":
      "조준 뼈와 그 하위의 조준 기준점을 선택하세요.",
    "two_bone_ik.error.aim_hierarchy":
      "조준 기준점은 조준 뼈의 자식 또는 하위 항목이어야 합니다.",
    "two_bone_ik.error.same_bones": "상단 뼈와 하단 뼈는 서로 달라야 합니다.",
    "two_bone_ik.error.lower_hierarchy":
      "하단 뼈는 상단 뼈의 자식 또는 하위 항목이어야 합니다.",
    "two_bone_ik.error.end_hierarchy":
      "끝점은 하단 뼈의 자식 또는 하위 항목이어야 합니다.",
    "two_bone_ik.error.overlap":
      "각 IK는 서로 다른 뼈를 제어해야 합니다. 이 체인은 “%0”과 겹칩니다.",
    "two_bone_ik.error.target_invalid": "올바른 타깃 오브젝트를 선택하세요.",
    "two_bone_ik.error.target_cycle":
      "타깃 오브젝트는 IK 뼈 체인 밖에 있어야 합니다.",
    "two_bone_ik.error.pole_invalid": "올바른 Pole 타깃을 선택하세요.",
    "two_bone_ik.error.pole_cycle":
      "Pole 타깃은 IK 뼈 체인 밖에 있어야 합니다.",
    "two_bone_ik.error.zero_direction": "굽힘 방향은 0 벡터일 수 없습니다.",
    "two_bone_ik.error.preview_transform":
      "선택한 항목 중 미리보기 변환을 사용할 수 없는 항목이 있습니다.",
    "two_bone_ik.error.upper_zero_length":
      "상단 뼈 길이가 0입니다. 상단·하단 뼈의 피벗을 확인하세요.",
    "two_bone_ik.error.lower_zero_length":
      "하단 뼈 길이가 0입니다. 하단 뼈와 끝점의 피벗을 확인하세요.",
    "two_bone_ik.error.configure_first": "먼저 IK 체인을 설정하세요.",
    "two_bone_ik.error.select_animation":
      "Bake하기 전에 애니메이션을 선택하고 Animate 모드로 전환하세요.",
    "two_bone_ik.error.cannot_bake.title": "IK를 Bake할 수 없음",
    "two_bone_ik.error.solve_failed":
      "현재 프레임에서 하나 이상의 IK 포즈를 계산하지 못했습니다.",
    "two_bone_ik.error.keyframe_failed":
      "하나 이상의 회전 키프레임을 만들지 못했습니다. 변경 사항은 Bake되지 않았습니다.",
    "two_bone_ik.error.unsupported_bone":
      "선택한 애니메이션 형식에서 IK 뼈 중 하나를 애니메이션할 수 없습니다.",
    "two_bone_ik.error.global_rotation":
      "모든 IK 뼈에서 “Rotate in Global Space”를 끈 다음 다시 Bake하세요.",
  };

  let setupAction;
  let ikPanel;
  let pluginStyles;
  // Keep listener disposal in the same order as the plugin's teardown.
  const pluginEventDisposers = {
    displayAnimationFrame: null,
    selectProject: null,
    parsedProject: null,
    selectMode: null,
    finishedEdit: null,
  };
  let projectDataProperty;
  let activeConfigurations = [];
  let helperGroup = null;
  let helperDisplays = new Map();
  let isSolving = false;
  let suppressLiveSolver = false;

  function registerTranslations() {
    Language.addTranslations("en", ENGLISH_TRANSLATIONS);
    Language.addTranslations("ko", KOREAN_TRANSLATIONS);
  }

  function localize(translationKey, replacements) {
    let translatedText =
      typeof tl === "function" ? tl(translationKey) : translationKey;

    if (!translatedText || translatedText === translationKey) {
      translatedText = ENGLISH_TRANSLATIONS[translationKey] || translationKey;
    }

    if (Array.isArray(replacements)) {
      replacements.forEach(function (replacement, replacementIndex) {
        translatedText = translatedText
          .split("%" + replacementIndex)
          .join(String(replacement));
      });
    }

    return translatedText;
  }

  function createConstraintId() {
    if (typeof guid === "function") {
      return guid();
    }

    return (
      "ik_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function getAllPositionNodes() {
    const result = [];
    const seenUuids = new Set();
    const collections = [
      typeof Group !== "undefined" ? Group.all : [],
      typeof Locator !== "undefined" ? Locator.all : [],
      typeof NullObject !== "undefined" ? NullObject.all : [],
    ];

    collections.forEach(function (collection) {
      collection.forEach(function (node) {
        if (!seenUuids.has(node.uuid)) {
          seenUuids.add(node.uuid);
          result.push(node);
        }
      });
    });

    return result;
  }

  function findPositionNode(uuid) {
    return (
      getAllPositionNodes().find(function (node) {
        return node.uuid === uuid;
      }) || null
    );
  }

  function findGroup(uuid) {
    return (
      Group.all.find(function (group) {
        return group.uuid === uuid;
      }) || null
    );
  }

  function isDescendantOf(node, possibleAncestor) {
    let currentNode = node;

    while (currentNode && currentNode !== "root") {
      if (currentNode === possibleAncestor) {
        return true;
      }
      currentNode = currentNode.parent;
    }

    return false;
  }

  function getNodeWorldPosition(node) {
    if (!node) {
      return null;
    }

    if (
      node instanceof Group &&
      node.mesh &&
      typeof node.mesh.getWorldPosition === "function"
    ) {
      return node.mesh.getWorldPosition(new THREE.Vector3());
    }

    if (typeof node.getWorldCenter === "function") {
      return node.getWorldCenter(true);
    }

    if (node.mesh && typeof node.mesh.getWorldPosition === "function") {
      return node.mesh.getWorldPosition(new THREE.Vector3());
    }

    return null;
  }

  function isFiniteWorldPosition(position) {
    return Boolean(
      position &&
      Number.isFinite(position.x) &&
      Number.isFinite(position.y) &&
      Number.isFinite(position.z),
    );
  }

  function clampNumber(value, minimum, maximum, fallbackValue) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return fallbackValue;
    }
    return Math.min(maximum, Math.max(minimum, numericValue));
  }

  function getIkWeight(configuration) {
    const storedWeight = configuration && configuration.ikWeight;
    if (
      (typeof storedWeight !== "number" && typeof storedWeight !== "string") ||
      (typeof storedWeight === "string" && !storedWeight.trim())
    ) {
      return 1;
    }
    return clampNumber(storedWeight, 0, 1, 1);
  }

  function getTargetWorldPosition(configuration) {
    if (configuration.targetMode === "object") {
      return getNodeWorldPosition(
        findPositionNode(configuration.targetNodeUuid),
      );
    }

    return new THREE.Vector3(
      configuration.targetPoint[0],
      configuration.targetPoint[1],
      configuration.targetPoint[2],
    );
  }

  function getPoleWorldPosition(configuration, rootPosition, firstBoneLength) {
    if (configuration.poleMode === "object") {
      return getNodeWorldPosition(findPositionNode(configuration.poleNodeUuid));
    }

    const bendDirection = new THREE.Vector3(
      configuration.bendDirection[0],
      configuration.bendDirection[1],
      configuration.bendDirection[2],
    );

    if (bendDirection.lengthSq() < EPSILON) {
      return null;
    }

    return rootPosition
      .clone()
      .add(bendDirection.normalize().multiplyScalar(firstBoneLength));
  }

  function getIkType(configuration) {
    const ikType = configuration && configuration.ikType;
    return ikType === "chain" || ikType === "spline" || ikType === "aim"
      ? ikType
      : "two_bone";
  }

  function getSplineControlNodeUuids(configuration) {
    if (
      !configuration ||
      !Array.isArray(configuration.splineControlNodeUuids)
    ) {
      return [];
    }

    return configuration.splineControlNodeUuids.slice();
  }

  function getSplineControlNodes(configuration) {
    return getSplineControlNodeUuids(configuration).map(function (nodeUuid) {
      return findPositionNode(nodeUuid);
    });
  }

  function getSplineControlWorldPositions(configuration) {
    return getSplineControlNodes(configuration).map(getNodeWorldPosition);
  }

  function getChainBones(configuration) {
    const rootBone = findGroup(configuration.upperBoneUuid);
    const endEffector = findPositionNode(configuration.endEffectorUuid);
    const reversedBones = [];
    let currentNode = endEffector ? endEffector.parent : null;

    while (currentNode && currentNode !== "root") {
      if (currentNode instanceof Group) {
        reversedBones.push(currentNode);
        if (currentNode === rootBone) {
          return reversedBones.reverse();
        }
      }
      currentNode = currentNode.parent;
    }

    return [];
  }

  function getControlledBones(configuration) {
    const ikType = getIkType(configuration);

    if (ikType === "chain" || ikType === "spline") {
      return getChainBones(configuration);
    }

    const upperBone = findGroup(configuration.upperBoneUuid);
    if (ikType === "aim") {
      return upperBone ? [upperBone] : [];
    }

    const lowerBone = findGroup(configuration.lowerBoneUuid);
    return [upperBone, lowerBone].filter(Boolean);
  }

  function getConfigurationNodes(configuration) {
    return {
      upperBone: findGroup(configuration.upperBoneUuid),
      lowerBone: findGroup(configuration.lowerBoneUuid),
      endEffector: findPositionNode(configuration.endEffectorUuid),
      controlledBones: getControlledBones(configuration),
    };
  }

  function getConfigurationDriverNodes(configuration) {
    const driverNodes = [];

    if (configuration.targetMode === "object") {
      driverNodes.push(findPositionNode(configuration.targetNodeUuid));
    }
    if (
      getIkType(configuration) === "two_bone" &&
      configuration.poleMode === "object"
    ) {
      driverNodes.push(findPositionNode(configuration.poleNodeUuid));
    }
    if (getIkType(configuration) === "spline") {
      driverNodes.push.apply(driverNodes, getSplineControlNodes(configuration));
    }

    return driverNodes.filter(function (node, nodeIndex) {
      return node && driverNodes.indexOf(node) === nodeIndex;
    });
  }

  function configurationDependsOn(dependentConfiguration, driverConfiguration) {
    if (
      !dependentConfiguration ||
      !driverConfiguration ||
      dependentConfiguration.id === driverConfiguration.id
    ) {
      return false;
    }

    const driverBones = getControlledBones(driverConfiguration);
    const dependentRootBone = findGroup(dependentConfiguration.upperBoneUuid);
    const dependentRootFollowsDriver = driverBones.some(function (driverBone) {
      return isDescendantOf(dependentRootBone, driverBone);
    });
    const driverNodeFollowsDriver = getConfigurationDriverNodes(
      dependentConfiguration,
    ).some(function (driverNode) {
      return driverBones.some(function (driverBone) {
        return isDescendantOf(driverNode, driverBone);
      });
    });

    return dependentRootFollowsDriver || driverNodeFollowsDriver;
  }

  function getConfigurationsWithCandidate(candidateConfiguration) {
    return activeConfigurations
      .filter(function (configuration) {
        return (
          configuration.projectReference ===
            candidateConfiguration.projectReference &&
          configuration.id !== candidateConfiguration.id
        );
      })
      .concat([candidateConfiguration]);
  }

  function findDriverDependencyCycle(configuration) {
    const configurations = getConfigurationsWithCandidate(configuration);
    const visitingConfigurationIds = new Set();
    const visitedConfigurationIds = new Set();

    function visitConfiguration(currentConfiguration) {
      visitingConfigurationIds.add(currentConfiguration.id);

      for (
        let driverIndex = 0;
        driverIndex < configurations.length;
        driverIndex += 1
      ) {
        const possibleDriverConfiguration = configurations[driverIndex];
        if (
          !configurationDependsOn(
            currentConfiguration,
            possibleDriverConfiguration,
          )
        ) {
          continue;
        }
        if (visitingConfigurationIds.has(possibleDriverConfiguration.id)) {
          return currentConfiguration;
        }
        if (!visitedConfigurationIds.has(possibleDriverConfiguration.id)) {
          const cycleConfiguration = visitConfiguration(
            possibleDriverConfiguration,
          );
          if (cycleConfiguration) {
            return cycleConfiguration;
          }
        }
      }

      visitingConfigurationIds.delete(currentConfiguration.id);
      visitedConfigurationIds.add(currentConfiguration.id);
      return null;
    }

    return visitConfiguration(configuration);
  }

  function getConfigurationEvaluationOrder(configurations) {
    const remainingConfigurations = configurations.slice();
    const orderedConfigurations = [];

    while (remainingConfigurations.length > 0) {
      const readyConfigurationIndex = remainingConfigurations.findIndex(
        function (configuration) {
          return !remainingConfigurations.some(function (possibleDriver) {
            return configurationDependsOn(configuration, possibleDriver);
          });
        },
      );

      if (readyConfigurationIndex === -1) {
        orderedConfigurations.push.apply(
          orderedConfigurations,
          remainingConfigurations,
        );
        break;
      }

      orderedConfigurations.push(
        remainingConfigurations.splice(readyConfigurationIndex, 1)[0],
      );
    }

    return orderedConfigurations;
  }

  function getConfigurationDependencyClosure(
    requestedConfigurations,
    availableConfigurations,
  ) {
    const includedConfigurationIds = new Set(
      requestedConfigurations.map(function (configuration) {
        return configuration.id;
      }),
    );
    let addedDependency = true;

    while (addedDependency) {
      addedDependency = false;
      availableConfigurations.forEach(function (configuration) {
        if (!includedConfigurationIds.has(configuration.id)) {
          return;
        }
        availableConfigurations.forEach(function (possibleDriver) {
          if (
            !includedConfigurationIds.has(possibleDriver.id) &&
            configurationDependsOn(configuration, possibleDriver)
          ) {
            includedConfigurationIds.add(possibleDriver.id);
            addedDependency = true;
          }
        });
      });
    }

    return getConfigurationEvaluationOrder(
      availableConfigurations.filter(function (configuration) {
        return includedConfigurationIds.has(configuration.id);
      }),
    );
  }

  function validateTargetAndPole(configuration, rootBone) {
    if (configuration.targetMode === "object") {
      const targetNode = findPositionNode(configuration.targetNodeUuid);
      if (!targetNode) {
        return localize("two_bone_ik.error.target_invalid");
      }
      if (isDescendantOf(targetNode, rootBone)) {
        return localize("two_bone_ik.error.target_cycle");
      }
    }

    const ikType = getIkType(configuration);
    if (ikType === "spline") {
      const controlNodeUuids = getSplineControlNodeUuids(configuration);
      if (controlNodeUuids.length === 0) {
        return localize("two_bone_ik.error.spline_control_required");
      }
      if (controlNodeUuids.length > MAXIMUM_SPLINE_CONTROL_COUNT) {
        return localize("two_bone_ik.error.spline_control_limit", [
          MAXIMUM_SPLINE_CONTROL_COUNT,
        ]);
      }

      const uniqueControlNodeUuids = new Set();
      for (
        let controlIndex = 0;
        controlIndex < controlNodeUuids.length;
        controlIndex += 1
      ) {
        const controlNodeUuid = controlNodeUuids[controlIndex];
        const controlNode = findPositionNode(controlNodeUuid);
        if (!controlNode) {
          return localize("two_bone_ik.error.spline_control_invalid");
        }
        if (uniqueControlNodeUuids.has(controlNodeUuid)) {
          return localize("two_bone_ik.error.spline_control_duplicate");
        }
        uniqueControlNodeUuids.add(controlNodeUuid);
        if (
          configuration.targetMode === "object" &&
          controlNodeUuid === configuration.targetNodeUuid
        ) {
          return localize("two_bone_ik.error.spline_control_matches_target");
        }
        if (isDescendantOf(controlNode, rootBone)) {
          return localize("two_bone_ik.error.spline_control_cycle");
        }
      }

      return null;
    }

    if (ikType !== "two_bone") {
      return null;
    }

    if (configuration.poleMode === "object") {
      const poleNode = findPositionNode(configuration.poleNodeUuid);
      if (!poleNode) {
        return localize("two_bone_ik.error.pole_invalid");
      }
      if (isDescendantOf(poleNode, rootBone)) {
        return localize("two_bone_ik.error.pole_cycle");
      }
    } else {
      const bendDirection = new THREE.Vector3(
        configuration.bendDirection[0],
        configuration.bendDirection[1],
        configuration.bendDirection[2],
      );
      if (bendDirection.lengthSq() < EPSILON) {
        return localize("two_bone_ik.error.zero_direction");
      }
    }

    return null;
  }

  function validateConfiguration(configuration) {
    if (!Project) {
      return localize("two_bone_ik.error.open_project");
    }

    const ikType = getIkType(configuration);
    const nodes = getConfigurationNodes(configuration);

    if (ikType === "two_bone") {
      if (!nodes.upperBone || !nodes.lowerBone || !nodes.endEffector) {
        return localize("two_bone_ik.error.select_chain");
      }
      if (nodes.upperBone === nodes.lowerBone) {
        return localize("two_bone_ik.error.same_bones");
      }
      if (!isDescendantOf(nodes.lowerBone, nodes.upperBone)) {
        return localize("two_bone_ik.error.lower_hierarchy");
      }
      if (
        nodes.endEffector === nodes.lowerBone ||
        !isDescendantOf(nodes.endEffector, nodes.lowerBone)
      ) {
        return localize("two_bone_ik.error.end_hierarchy");
      }
    } else if (ikType === "chain" || ikType === "spline") {
      if (!nodes.upperBone || !nodes.endEffector) {
        return localize(
          ikType === "spline"
            ? "two_bone_ik.error.select_spline"
            : "two_bone_ik.error.select_chain_root",
        );
      }
      if (!isDescendantOf(nodes.endEffector, nodes.upperBone)) {
        return localize(
          ikType === "spline"
            ? "two_bone_ik.error.spline_hierarchy"
            : "two_bone_ik.error.chain_hierarchy",
        );
      }
      if (nodes.controlledBones.length < 2) {
        return localize(
          ikType === "spline"
            ? "two_bone_ik.error.spline_too_short"
            : "two_bone_ik.error.chain_too_short",
        );
      }
    } else if (!nodes.upperBone || !nodes.endEffector) {
      return localize("two_bone_ik.error.select_aim");
    } else if (
      nodes.endEffector === nodes.upperBone ||
      !isDescendantOf(nodes.endEffector, nodes.upperBone)
    ) {
      return localize("two_bone_ik.error.aim_hierarchy");
    }

    const controlledBoneUuids = nodes.controlledBones.map(function (bone) {
      return bone.uuid;
    });
    const overlappingConfiguration = activeConfigurations.find(
      function (otherConfiguration) {
        if (otherConfiguration.id === configuration.id) {
          return false;
        }
        const otherControlledBoneUuids = getControlledBones(
          otherConfiguration,
        ).map(function (bone) {
          return bone.uuid;
        });
        return controlledBoneUuids.some(function (boneUuid) {
          return otherControlledBoneUuids.includes(boneUuid);
        });
      },
    );

    if (overlappingConfiguration) {
      return localize("two_bone_ik.error.overlap", [
        overlappingConfiguration.name,
      ]);
    }

    const targetOrPoleError = validateTargetAndPole(
      configuration,
      nodes.upperBone,
    );
    if (targetOrPoleError) {
      return targetOrPoleError;
    }

    const dependencyCycleConfiguration =
      findDriverDependencyCycle(configuration);
    if (dependencyCycleConfiguration) {
      return localize("two_bone_ik.error.dependency_cycle", [
        dependencyCycleConfiguration.name,
      ]);
    }

    Canvas.scene.updateMatrixWorld(true);
    const chainPositions = nodes.controlledBones
      .map(getNodeWorldPosition)
      .concat([getNodeWorldPosition(nodes.endEffector)]);

    if (
      chainPositions.some(function (position) {
        return !isFiniteWorldPosition(position);
      })
    ) {
      return localize("two_bone_ik.error.preview_transform");
    }

    if (ikType === "spline") {
      const splineControlPositions =
        getSplineControlWorldPositions(configuration);
      const targetPosition = getTargetWorldPosition(configuration);
      if (
        splineControlPositions.some(function (position) {
          return !isFiniteWorldPosition(position);
        }) ||
        !isFiniteWorldPosition(targetPosition)
      ) {
        return localize("two_bone_ik.error.preview_transform");
      }

      const splineCurveData = createSplineCurveData(
        [chainPositions[0]]
          .concat(splineControlPositions)
          .concat([targetPosition]),
      );
      if (
        !splineCurveData ||
        sampleSplineCurve(splineCurveData, 16).length === 0
      ) {
        return localize("two_bone_ik.error.spline_curve_degenerate");
      }
    }

    for (
      let positionIndex = 1;
      positionIndex < chainPositions.length;
      positionIndex += 1
    ) {
      if (
        chainPositions[positionIndex - 1].distanceTo(
          chainPositions[positionIndex],
        ) < EPSILON
      ) {
        return localize(
          positionIndex === 1
            ? "two_bone_ik.error.upper_zero_length"
            : "two_bone_ik.error.lower_zero_length",
        );
      }
    }

    return null;
  }

  function chooseFallbackBendDirection(targetDirection, currentJointDirection) {
    const projectedCurrentDirection = currentJointDirection
      .clone()
      .sub(
        targetDirection
          .clone()
          .multiplyScalar(currentJointDirection.dot(targetDirection)),
      );

    if (projectedCurrentDirection.lengthSq() >= EPSILON) {
      return projectedCurrentDirection.normalize();
    }

    const fallbackAxis =
      Math.abs(targetDirection.y) < 0.9
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0);

    return fallbackAxis
      .sub(
        targetDirection
          .clone()
          .multiplyScalar(fallbackAxis.dot(targetDirection)),
      )
      .normalize();
  }

  function applyWorldDirectionRotation(
    mesh,
    currentDirection,
    desiredDirection,
  ) {
    if (
      currentDirection.lengthSq() < EPSILON ||
      desiredDirection.lengthSq() < EPSILON
    ) {
      return;
    }

    const normalizedCurrentDirection = currentDirection.clone().normalize();
    const normalizedDesiredDirection = desiredDirection.clone().normalize();
    const worldRotationDelta = new THREE.Quaternion().setFromUnitVectors(
      normalizedCurrentDirection,
      normalizedDesiredDirection,
    );
    const currentWorldQuaternion = mesh.getWorldQuaternion(
      new THREE.Quaternion(),
    );
    const desiredWorldQuaternion = worldRotationDelta.multiply(
      currentWorldQuaternion,
    );
    const parentWorldQuaternion = mesh.parent
      ? mesh.parent.getWorldQuaternion(new THREE.Quaternion())
      : new THREE.Quaternion();
    const desiredLocalQuaternion = parentWorldQuaternion
      .invert()
      .multiply(desiredWorldQuaternion);

    mesh.quaternion.copy(desiredLocalQuaternion.normalize());
    mesh.updateMatrixWorld(true);
  }

  function normalizeDegrees(angle) {
    let normalizedAngle = angle % 360;

    if (normalizedAngle > 180) {
      normalizedAngle -= 360;
    } else if (normalizedAngle < -180) {
      normalizedAngle += 360;
    }

    return Math.round(normalizedAngle * 10000) / 10000;
  }

  function getAnimationRotationFromMesh(mesh) {
    const baseRotation =
      mesh.fix_rotation || new THREE.Euler(0, 0, 0, mesh.rotation.order);

    return [
      normalizeDegrees(
        THREE.MathUtils.radToDeg(mesh.rotation.x - baseRotation.x),
      ),
      normalizeDegrees(
        THREE.MathUtils.radToDeg(mesh.rotation.y - baseRotation.y),
      ),
      normalizeDegrees(
        THREE.MathUtils.radToDeg(mesh.rotation.z - baseRotation.z),
      ),
    ];
  }

  function createSolvedPose(controlledBones, reachedTarget) {
    return {
      boneRotations: controlledBones.map(function (bone) {
        return {
          bone: bone,
          rotation: getAnimationRotationFromMesh(bone.mesh),
        };
      }),
      reachedTarget: reachedTarget,
    };
  }

  function getChainWorldPositions(controlledBones, endEffector) {
    return controlledBones
      .map(getNodeWorldPosition)
      .concat([getNodeWorldPosition(endEffector)]);
  }

  function getChainGeometry(positions) {
    const segmentLengths = [];
    let totalLength = 0;

    for (
      let segmentIndex = 0;
      segmentIndex < positions.length - 1;
      segmentIndex += 1
    ) {
      const segmentLength = positions[segmentIndex].distanceTo(
        positions[segmentIndex + 1],
      );
      segmentLengths.push(segmentLength);
      totalLength += segmentLength;
    }

    return {
      segmentLengths: segmentLengths,
      totalLength: totalLength,
    };
  }

  function applySolvedChainPositions(
    controlledBones,
    endEffector,
    solvedPositions,
  ) {
    controlledBones.forEach(function (bone, boneIndex) {
      // Each parent rotation changes the world positions of the next segment.
      Canvas.scene.updateMatrixWorld(true);
      const currentStartPosition = getNodeWorldPosition(bone);
      const currentEndPosition = getNodeWorldPosition(
        boneIndex + 1 < controlledBones.length
          ? controlledBones[boneIndex + 1]
          : endEffector,
      );
      applyWorldDirectionRotation(
        bone.mesh,
        currentEndPosition.clone().sub(currentStartPosition),
        solvedPositions[boneIndex + 1].clone().sub(solvedPositions[boneIndex]),
      );
    });
    Canvas.scene.updateMatrixWorld(true);
  }

  function captureControlledBoneQuaternions(controlledBones) {
    return controlledBones.map(function (bone) {
      return bone.mesh.quaternion.clone();
    });
  }

  function restoreControlledBoneQuaternions(
    controlledBones,
    originalQuaternions,
  ) {
    controlledBones.forEach(function (bone, boneIndex) {
      bone.mesh.quaternion.copy(originalQuaternions[boneIndex]);
    });
    Canvas.scene.updateMatrixWorld(true);
  }

  function applyIkWeightToControlledBones(
    controlledBones,
    originalQuaternions,
    ikWeight,
  ) {
    const normalizedWeight = clampNumber(ikWeight, 0, 1, 1);
    if (normalizedWeight >= 1) {
      Canvas.scene.updateMatrixWorld(true);
      return;
    }

    const solvedQuaternions = captureControlledBoneQuaternions(controlledBones);
    controlledBones.forEach(function (bone, boneIndex) {
      if (normalizedWeight <= 0) {
        bone.mesh.quaternion.copy(originalQuaternions[boneIndex]);
        return;
      }

      const blendedQuaternion = originalQuaternions[boneIndex]
        .clone()
        .slerp(solvedQuaternions[boneIndex], normalizedWeight)
        .normalize();
      bone.mesh.quaternion.copy(blendedQuaternion);
    });
    Canvas.scene.updateMatrixWorld(true);
  }

  function updateConstraintHelperFromCurrentPose(configuration) {
    const nodes = getConfigurationNodes(configuration);
    const ikType = getIkType(configuration);
    const targetPosition = getTargetWorldPosition(configuration);
    let chainPositions;
    let polePosition = null;
    let splineCurvePoints = null;

    if (ikType === "aim") {
      chainPositions = [
        getNodeWorldPosition(nodes.upperBone),
        getNodeWorldPosition(nodes.endEffector),
      ];
    } else {
      chainPositions = getChainWorldPositions(
        nodes.controlledBones,
        nodes.endEffector,
      );
    }

    if (ikType === "two_bone") {
      polePosition = getPoleWorldPosition(
        configuration,
        chainPositions[0],
        chainPositions[0].distanceTo(chainPositions[1]),
      );
    } else if (ikType === "spline") {
      const splineCurveData = createSplineCurveData(
        [chainPositions[0]]
          .concat(getSplineControlWorldPositions(configuration))
          .concat([targetPosition]),
      );
      if (splineCurveData) {
        const curveSampleCount = Math.min(
          128,
          Math.max(32, nodes.controlledBones.length * 12),
        );
        splineCurvePoints = sampleSplineCurve(
          splineCurveData,
          curveSampleCount,
        );
      }
    }

    updateHelperDisplay(
      configuration.id,
      chainPositions,
      targetPosition,
      polePosition,
      splineCurvePoints,
    );
  }

  function solveTwoBoneConstraint(configuration, updateHelpers) {
    const nodes = getConfigurationNodes(configuration);
    const rootPosition = getNodeWorldPosition(nodes.upperBone);
    const originalJointPosition = getNodeWorldPosition(nodes.lowerBone);
    const originalEndPosition = getNodeWorldPosition(nodes.endEffector);
    const targetPosition = getTargetWorldPosition(configuration);
    const firstBoneLength = rootPosition.distanceTo(originalJointPosition);
    const secondBoneLength =
      originalJointPosition.distanceTo(originalEndPosition);
    const rootToTarget = targetPosition.clone().sub(rootPosition);
    let targetDistance = rootToTarget.length();
    let targetDirection;

    if (targetDistance < EPSILON) {
      targetDirection = originalJointPosition
        .clone()
        .sub(rootPosition)
        .normalize();
      targetDistance = EPSILON;
    } else {
      targetDirection = rootToTarget.clone().divideScalar(targetDistance);
    }

    const minimumReach = Math.max(
      Math.abs(firstBoneLength - secondBoneLength) + EPSILON,
      EPSILON,
    );
    const maximumReach = Math.max(
      firstBoneLength + secondBoneLength - EPSILON,
      minimumReach,
    );
    const solvedDistance = Math.min(
      maximumReach,
      Math.max(minimumReach, targetDistance),
    );
    const solvedEndPosition = rootPosition
      .clone()
      .add(targetDirection.clone().multiplyScalar(solvedDistance));
    const polePosition = getPoleWorldPosition(
      configuration,
      rootPosition,
      firstBoneLength,
    );
    const currentJointDirection = originalJointPosition
      .clone()
      .sub(rootPosition);
    let bendDirection = polePosition
      ? polePosition.clone().sub(rootPosition)
      : currentJointDirection.clone();

    bendDirection.sub(
      targetDirection
        .clone()
        .multiplyScalar(bendDirection.dot(targetDirection)),
    );
    if (bendDirection.lengthSq() < EPSILON) {
      bendDirection = chooseFallbackBendDirection(
        targetDirection,
        currentJointDirection,
      );
    } else {
      bendDirection.normalize();
    }

    const distanceAlongTarget =
      (firstBoneLength * firstBoneLength -
        secondBoneLength * secondBoneLength +
        solvedDistance * solvedDistance) /
      (2 * solvedDistance);
    const distanceFromTargetLine = Math.sqrt(
      Math.max(
        firstBoneLength * firstBoneLength -
          distanceAlongTarget * distanceAlongTarget,
        0,
      ),
    );
    const solvedJointPosition = rootPosition
      .clone()
      .add(targetDirection.clone().multiplyScalar(distanceAlongTarget))
      .add(bendDirection.clone().multiplyScalar(distanceFromTargetLine));

    applyWorldDirectionRotation(
      nodes.upperBone.mesh,
      originalJointPosition.clone().sub(rootPosition),
      solvedJointPosition.clone().sub(rootPosition),
    );
    Canvas.scene.updateMatrixWorld(true);

    const adjustedJointPosition = getNodeWorldPosition(nodes.lowerBone);
    const adjustedEndPosition = getNodeWorldPosition(nodes.endEffector);
    applyWorldDirectionRotation(
      nodes.lowerBone.mesh,
      adjustedEndPosition.clone().sub(adjustedJointPosition),
      solvedEndPosition.clone().sub(adjustedJointPosition),
    );
    Canvas.scene.updateMatrixWorld(true);

    const finalPositions = [
      rootPosition,
      getNodeWorldPosition(nodes.lowerBone),
      getNodeWorldPosition(nodes.endEffector),
    ];
    if (updateHelpers) {
      updateHelperDisplay(
        configuration.id,
        finalPositions,
        targetPosition,
        polePosition ||
          rootPosition
            .clone()
            .add(bendDirection.clone().multiplyScalar(firstBoneLength)),
      );
    }

    return createSolvedPose(
      [nodes.upperBone, nodes.lowerBone],
      Math.abs(targetDistance - solvedDistance) < 0.0001,
    );
  }

  function getMaximumPositionChange(positions, previousPositions) {
    return positions.reduce(function (
      currentMaximum,
      position,
      positionIndex,
    ) {
      return Math.max(
        currentMaximum,
        position.distanceTo(previousPositions[positionIndex]),
      );
    }, 0);
  }

  function runFabrikIterations(
    positions,
    segmentLengths,
    rootPosition,
    targetPosition,
    maximumIterations,
    tolerance,
  ) {
    for (let iteration = 0; iteration < maximumIterations; iteration += 1) {
      const previousPositions = positions.map(function (position) {
        return position.clone();
      });
      positions[positions.length - 1] = targetPosition.clone();
      for (
        let positionIndex = positions.length - 2;
        positionIndex >= 0;
        positionIndex -= 1
      ) {
        let direction = positions[positionIndex]
          .clone()
          .sub(positions[positionIndex + 1]);
        if (direction.lengthSq() < EPSILON) {
          direction = previousPositions[positionIndex]
            .clone()
            .sub(previousPositions[positionIndex + 1]);
        }
        direction.normalize();
        positions[positionIndex] = positions[positionIndex + 1]
          .clone()
          .add(direction.multiplyScalar(segmentLengths[positionIndex]));
      }

      positions[0] = rootPosition.clone();
      for (
        let positionIndex = 1;
        positionIndex < positions.length;
        positionIndex += 1
      ) {
        let direction = positions[positionIndex]
          .clone()
          .sub(positions[positionIndex - 1]);
        if (direction.lengthSq() < EPSILON) {
          direction = previousPositions[positionIndex]
            .clone()
            .sub(previousPositions[positionIndex - 1]);
        }
        direction.normalize();
        positions[positionIndex] = positions[positionIndex - 1]
          .clone()
          .add(direction.multiplyScalar(segmentLengths[positionIndex - 1]));
      }

      const maximumPositionChange = getMaximumPositionChange(
        positions,
        previousPositions,
      );
      if (
        positions[positions.length - 1].distanceTo(targetPosition) <=
          tolerance ||
        maximumPositionChange <= tolerance
      ) {
        break;
      }
    }
  }

  function collapseSplineAnchorPositions(anchorPositions) {
    const collapsedPositions = [];

    anchorPositions.forEach(function (position) {
      if (!isFiniteWorldPosition(position)) {
        return;
      }

      const previousPosition =
        collapsedPositions[collapsedPositions.length - 1];
      if (
        !previousPosition ||
        previousPosition.distanceTo(position) >= EPSILON
      ) {
        collapsedPositions.push(position.clone());
      }
    });

    return collapsedPositions;
  }

  function createLinearSplineCurve(startPosition, endPosition) {
    const lineDirection = endPosition.clone().sub(startPosition);

    return {
      getPointAt: function (curvePosition) {
        const normalizedPosition = clampNumber(curvePosition, 0, 1, 0);
        return startPosition
          .clone()
          .add(lineDirection.clone().multiplyScalar(normalizedPosition));
      },
      getTangentAt: function () {
        return lineDirection.clone().normalize();
      },
    };
  }

  function createSplineCurveData(anchorPositions) {
    const collapsedPositions = collapseSplineAnchorPositions(anchorPositions);
    if (collapsedPositions.length < 2) {
      return null;
    }

    let curve;
    if (collapsedPositions.length === 2) {
      curve = createLinearSplineCurve(
        collapsedPositions[0],
        collapsedPositions[1],
      );
    } else {
      curve = new THREE.CatmullRomCurve3(
        collapsedPositions,
        false,
        "centripetal",
        0.5,
      );
      curve.arcLengthDivisions = Math.min(
        512,
        Math.max(128, collapsedPositions.length * 48),
      );
    }

    return {
      anchorPositions: collapsedPositions,
      curve: curve,
    };
  }

  function sampleSplineCurve(splineCurveData, sampleCount) {
    const curvePoints = [];
    const safeSampleCount = Math.max(2, Math.floor(sampleCount));

    for (let sampleIndex = 0; sampleIndex < safeSampleCount; sampleIndex += 1) {
      const curvePoint = splineCurveData.curve.getPointAt(
        sampleIndex / Math.max(1, safeSampleCount - 1),
      );
      if (!isFiniteWorldPosition(curvePoint)) {
        return [];
      }
      curvePoints.push(curvePoint);
    }

    return curvePoints;
  }

  function createSplineSeedData(
    splineCurveData,
    originalPositions,
    segmentLengths,
    rootStiffness,
  ) {
    const totalLength = segmentLengths.reduce(function (sum, segmentLength) {
      return sum + segmentLength;
    }, 0);
    const rootPosition = originalPositions[0].clone();
    const tipPosition = splineCurveData.curve.getPointAt(1);
    const straightDirection = tipPosition.clone().sub(rootPosition);
    const guidePositions = [rootPosition.clone()];
    let cumulativeLength = 0;

    for (
      let positionIndex = 1;
      positionIndex < originalPositions.length;
      positionIndex += 1
    ) {
      cumulativeLength += segmentLengths[positionIndex - 1];
      const normalizedLength = cumulativeLength / totalLength;
      const guidePosition = splineCurveData.curve.getPointAt(normalizedLength);
      if (positionIndex < originalPositions.length - 1) {
        const rootInfluence = rootStiffness * Math.pow(1 - normalizedLength, 2);
        const straightGuidePosition = rootPosition
          .clone()
          .add(straightDirection.clone().multiplyScalar(normalizedLength));
        guidePosition.lerp(straightGuidePosition, rootInfluence);
      }
      guidePositions.push(guidePosition);
    }

    const seededPositions = [originalPositions[0].clone()];
    const guideDirections = [];
    cumulativeLength = 0;
    for (
      let positionIndex = 1;
      positionIndex < originalPositions.length;
      positionIndex += 1
    ) {
      cumulativeLength += segmentLengths[positionIndex - 1];
      const normalizedLength = cumulativeLength / totalLength;
      let desiredDirection = guidePositions[positionIndex]
        .clone()
        .sub(guidePositions[positionIndex - 1]);

      if (desiredDirection.lengthSq() < EPSILON) {
        desiredDirection = splineCurveData.curve.getTangentAt(normalizedLength);
      }
      if (
        !isFiniteWorldPosition(desiredDirection) ||
        desiredDirection.lengthSq() < EPSILON
      ) {
        desiredDirection = straightDirection.clone();
      }
      if (desiredDirection.lengthSq() < EPSILON) {
        desiredDirection = new THREE.Vector3(0, 1, 0);
      }

      desiredDirection.normalize();
      guideDirections.push(desiredDirection.clone());

      seededPositions.push(
        seededPositions[positionIndex - 1]
          .clone()
          .add(
            desiredDirection.multiplyScalar(segmentLengths[positionIndex - 1]),
          ),
      );
    }

    return {
      guideDirections: guideDirections,
      positions: seededPositions,
    };
  }

  function isSplineProjectionAcceptable(positions, guideDirections) {
    let previousProjectedDirection = null;

    for (
      let segmentIndex = 0;
      segmentIndex < guideDirections.length;
      segmentIndex += 1
    ) {
      const projectedDirection = positions[segmentIndex + 1]
        .clone()
        .sub(positions[segmentIndex]);
      if (
        !isFiniteWorldPosition(projectedDirection) ||
        projectedDirection.lengthSq() < EPSILON
      ) {
        return false;
      }
      projectedDirection.normalize();
      if (
        projectedDirection.dot(guideDirections[segmentIndex]) <
        MINIMUM_SPLINE_GUIDE_ALIGNMENT
      ) {
        return false;
      }
      if (previousProjectedDirection) {
        const guideTurnDot = guideDirections[segmentIndex - 1].dot(
          guideDirections[segmentIndex],
        );
        if (
          previousProjectedDirection.dot(projectedDirection) <
          guideTurnDot - MAXIMUM_SPLINE_TURN_DOT_DEVIATION
        ) {
          return false;
        }
      }
      previousProjectedDirection = projectedDirection;
    }

    return true;
  }

  function runSplineProjectionIterations(
    seededPositions,
    guideDirections,
    segmentLengths,
    rootPosition,
    targetPosition,
    maximumIterations,
    tolerance,
  ) {
    let acceptedPositions = seededPositions.map(function (position) {
      return position.clone();
    });

    for (let iteration = 0; iteration < maximumIterations; iteration += 1) {
      const candidatePositions = acceptedPositions.map(function (position) {
        return position.clone();
      });
      runFabrikIterations(
        candidatePositions,
        segmentLengths,
        rootPosition,
        targetPosition,
        1,
        tolerance,
      );

      if (!isSplineProjectionAcceptable(candidatePositions, guideDirections)) {
        break;
      }

      const maximumPositionChange = getMaximumPositionChange(
        candidatePositions,
        acceptedPositions,
      );
      acceptedPositions = candidatePositions;

      if (
        acceptedPositions[acceptedPositions.length - 1].distanceTo(
          targetPosition,
        ) <= tolerance ||
        maximumPositionChange <= tolerance
      ) {
        break;
      }
    }

    return acceptedPositions;
  }

  function solveChainConstraint(configuration, updateHelpers) {
    const nodes = getConfigurationNodes(configuration);
    const controlledBones = nodes.controlledBones;
    const originalPositions = getChainWorldPositions(
      controlledBones,
      nodes.endEffector,
    );
    const solvedPositions = originalPositions.map(function (position) {
      return position.clone();
    });
    const chainGeometry = getChainGeometry(solvedPositions);
    const segmentLengths = chainGeometry.segmentLengths;
    const totalLength = chainGeometry.totalLength;

    const rootPosition = solvedPositions[0].clone();
    const targetPosition = getTargetWorldPosition(configuration);
    const rootToTarget = targetPosition.clone().sub(rootPosition);
    const rootToTargetDistance = rootToTarget.length();
    const targetDirection =
      rootToTargetDistance >= EPSILON
        ? rootToTarget.clone().divideScalar(rootToTargetDistance)
        : originalPositions[1].clone().sub(rootPosition).normalize();

    if (rootToTargetDistance > totalLength) {
      for (
        let positionIndex = 1;
        positionIndex < solvedPositions.length;
        positionIndex += 1
      ) {
        solvedPositions[positionIndex] = solvedPositions[positionIndex - 1]
          .clone()
          .add(
            targetDirection
              .clone()
              .multiplyScalar(segmentLengths[positionIndex - 1]),
          );
      }
    } else {
      runFabrikIterations(
        solvedPositions,
        segmentLengths,
        rootPosition,
        targetPosition,
        64,
        0.00001,
      );
    }

    applySolvedChainPositions(
      controlledBones,
      nodes.endEffector,
      solvedPositions,
    );

    const finalPositions = getChainWorldPositions(
      controlledBones,
      nodes.endEffector,
    );
    if (updateHelpers) {
      updateHelperDisplay(
        configuration.id,
        finalPositions,
        targetPosition,
        null,
      );
    }

    const reachedTarget =
      finalPositions[finalPositions.length - 1].distanceTo(targetPosition) <
      0.001;
    return createSolvedPose(controlledBones, reachedTarget);
  }

  function solveSplineConstraint(configuration, updateHelpers) {
    const nodes = getConfigurationNodes(configuration);
    const controlledBones = nodes.controlledBones;
    const originalPositions = getChainWorldPositions(
      controlledBones,
      nodes.endEffector,
    );
    const chainGeometry = getChainGeometry(originalPositions);
    const segmentLengths = chainGeometry.segmentLengths;
    const totalLength = chainGeometry.totalLength;

    const rootPosition = originalPositions[0].clone();
    const targetPosition = getTargetWorldPosition(configuration);
    const splineControlPositions =
      getSplineControlWorldPositions(configuration);
    const splineCurveData = createSplineCurveData(
      [rootPosition].concat(splineControlPositions).concat([targetPosition]),
    );
    if (!splineCurveData) {
      return null;
    }

    const rootStiffness = clampNumber(
      configuration.splineRootStiffness,
      0,
      1,
      0.35,
    );
    const splineSeedData = createSplineSeedData(
      splineCurveData,
      originalPositions,
      segmentLengths,
      rootStiffness,
    );
    let solvedPositions = splineSeedData.positions;
    const rootToTarget = targetPosition.clone().sub(rootPosition);
    const rootToTargetDistance = rootToTarget.length();
    let targetDirection = rootToTarget.clone();
    if (targetDirection.lengthSq() < EPSILON) {
      targetDirection = originalPositions[originalPositions.length - 1]
        .clone()
        .sub(rootPosition);
    }
    if (targetDirection.lengthSq() < EPSILON) {
      targetDirection = originalPositions[1].clone().sub(rootPosition);
    }
    targetDirection.normalize();

    const maximumSegmentLength = Math.max.apply(null, segmentLengths);
    const minimumReach = Math.max(0, maximumSegmentLength * 2 - totalLength);
    let distanceIsReachable = true;

    if (rootToTargetDistance > totalLength) {
      distanceIsReachable = false;
      for (
        let positionIndex = 1;
        positionIndex < solvedPositions.length;
        positionIndex += 1
      ) {
        solvedPositions[positionIndex] = solvedPositions[positionIndex - 1]
          .clone()
          .add(
            targetDirection
              .clone()
              .multiplyScalar(segmentLengths[positionIndex - 1]),
          );
      }
    } else {
      let solvedTargetPosition = targetPosition;
      if (rootToTargetDistance < minimumReach) {
        distanceIsReachable = false;
        solvedTargetPosition = rootPosition
          .clone()
          .add(targetDirection.clone().multiplyScalar(minimumReach));
      }

      solvedPositions = runSplineProjectionIterations(
        solvedPositions,
        splineSeedData.guideDirections,
        segmentLengths,
        rootPosition,
        solvedTargetPosition,
        64,
        0.00001,
      );
    }

    applySolvedChainPositions(
      controlledBones,
      nodes.endEffector,
      solvedPositions,
    );

    const finalPositions = getChainWorldPositions(
      controlledBones,
      nodes.endEffector,
    );
    if (updateHelpers) {
      const curveSampleCount = Math.min(
        128,
        Math.max(32, controlledBones.length * 12),
      );
      updateHelperDisplay(
        configuration.id,
        finalPositions,
        targetPosition,
        null,
        sampleSplineCurve(splineCurveData, curveSampleCount),
      );
    }

    const reachedTarget =
      distanceIsReachable &&
      finalPositions[finalPositions.length - 1].distanceTo(targetPosition) <
        0.001;
    return createSolvedPose(controlledBones, reachedTarget);
  }

  function solveAimConstraint(configuration, updateHelpers) {
    const nodes = getConfigurationNodes(configuration);
    const rootPosition = getNodeWorldPosition(nodes.upperBone);
    const originalReferencePosition = getNodeWorldPosition(nodes.endEffector);
    const targetPosition = getTargetWorldPosition(configuration);
    const desiredDirection = targetPosition.clone().sub(rootPosition);

    if (desiredDirection.lengthSq() < EPSILON) {
      return null;
    }

    applyWorldDirectionRotation(
      nodes.upperBone.mesh,
      originalReferencePosition.clone().sub(rootPosition),
      desiredDirection,
    );
    Canvas.scene.updateMatrixWorld(true);
    const finalReferencePosition = getNodeWorldPosition(nodes.endEffector);

    if (updateHelpers) {
      updateHelperDisplay(
        configuration.id,
        [rootPosition, finalReferencePosition],
        targetPosition,
        null,
      );
    }

    return createSolvedPose([nodes.upperBone], true);
  }

  function solveConstraint(configuration, updateHelpers) {
    if (!configuration || isSolving) {
      return null;
    }

    const validationError = validateConfiguration(configuration);
    if (validationError) {
      setHelperDisplayVisibility(configuration.id, false);
      return null;
    }

    const controlledBones = getControlledBones(configuration);
    const originalQuaternions =
      captureControlledBoneQuaternions(controlledBones);
    isSolving = true;
    try {
      Canvas.scene.updateMatrixWorld(true);
      const ikType = getIkType(configuration);
      let solvedPose;
      if (ikType === "chain") {
        solvedPose = solveChainConstraint(configuration, false);
      } else if (ikType === "spline") {
        solvedPose = solveSplineConstraint(configuration, false);
      } else if (ikType === "aim") {
        solvedPose = solveAimConstraint(configuration, false);
      } else {
        solvedPose = solveTwoBoneConstraint(configuration, false);
      }

      if (!solvedPose) {
        restoreControlledBoneQuaternions(
          controlledBones,
          originalQuaternions,
        );
        return null;
      }

      applyIkWeightToControlledBones(
        controlledBones,
        originalQuaternions,
        getIkWeight(configuration),
      );

      if (updateHelpers) {
        updateConstraintHelperFromCurrentPose(configuration);
      }

      return createSolvedPose(controlledBones, solvedPose.reachedTarget);
    } catch (error) {
      restoreControlledBoneQuaternions(controlledBones, originalQuaternions);
      throw error;
    } finally {
      isSolving = false;
    }
  }

  function createDynamicLine(pointCount, color) {
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(pointCount * 3);
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3),
    );

    const material = new THREE.LineBasicMaterial({
      color: color,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 1000;
    line.frustumCulled = false;
    return line;
  }

  function setDynamicLinePoints(line, points) {
    let positionAttribute = line.geometry.getAttribute("position");

    if (positionAttribute.count !== points.length) {
      positionAttribute = new THREE.BufferAttribute(
        new Float32Array(points.length * 3),
        3,
      );
      line.geometry.setAttribute("position", positionAttribute);
    }

    points.forEach(function (point, pointIndex) {
      positionAttribute.setXYZ(pointIndex, point.x, point.y, point.z);
    });

    positionAttribute.needsUpdate = true;
    line.geometry.computeBoundingSphere();
  }

  function createHelperDisplay() {
    helperGroup = new THREE.Group();
    helperGroup.name = "IK Tools Helpers";
    helperGroup.no_export = true;
    helperGroup.visible = true;
    Canvas.scene.add(helperGroup);
  }

  function createConstraintHelperDisplay(configurationId) {
    if (!helperGroup) {
      return null;
    }

    const constraintHelperGroup = new THREE.Group();
    constraintHelperGroup.name = "IK Tools Helper " + configurationId;
    constraintHelperGroup.no_export = true;
    constraintHelperGroup.visible = false;

    const targetMaterial = new THREE.MeshBasicMaterial({
      color: 0x35d9ff,
      depthTest: false,
      depthWrite: false,
    });
    const poleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4bd8,
      depthTest: false,
      depthWrite: false,
    });
    const markerGeometry = new THREE.SphereGeometry(0.28, 12, 8);
    const targetMarker = new THREE.Mesh(markerGeometry, targetMaterial);
    const poleMarker = new THREE.Mesh(markerGeometry.clone(), poleMaterial);

    targetMarker.renderOrder = 1001;
    poleMarker.renderOrder = 1001;

    const helperObjects = {
      chainLine: createDynamicLine(2, 0x75ff79),
      curveLine: createDynamicLine(2, 0xffb347),
      targetLine: createDynamicLine(2, 0x35d9ff),
      poleLine: createDynamicLine(2, 0xff4bd8),
      targetMarker: targetMarker,
      poleMarker: poleMarker,
    };
    helperObjects.curveLine.visible = false;

    Object.keys(helperObjects).forEach(function (key) {
      constraintHelperGroup.add(helperObjects[key]);
    });

    helperGroup.add(constraintHelperGroup);

    const helperDisplay = {
      group: constraintHelperGroup,
      objects: helperObjects,
    };
    helperDisplays.set(configurationId, helperDisplay);
    return helperDisplay;
  }

  function getConstraintHelperDisplay(configurationId) {
    return (
      helperDisplays.get(configurationId) ||
      createConstraintHelperDisplay(configurationId)
    );
  }

  function setHelperDisplayVisibility(configurationId, visible) {
    const helperDisplay = helperDisplays.get(configurationId);

    if (helperDisplay) {
      helperDisplay.group.visible = visible;
    }
  }

  function hideAllHelperDisplays() {
    helperDisplays.forEach(function (helperDisplay) {
      helperDisplay.group.visible = false;
    });
  }

  function updateHelperDisplay(
    configurationId,
    chainPositions,
    targetPosition,
    polePosition,
    splineCurvePoints,
  ) {
    const helperDisplay = getConstraintHelperDisplay(configurationId);

    if (!helperDisplay) {
      return;
    }

    const helperObjects = helperDisplay.objects;
    const rootPosition = chainPositions[0];
    const endPosition = chainPositions[chainPositions.length - 1];
    setDynamicLinePoints(helperObjects.chainLine, chainPositions);
    setDynamicLinePoints(helperObjects.targetLine, [
      endPosition,
      targetPosition,
    ]);
    helperObjects.curveLine.visible = Boolean(
      splineCurvePoints && splineCurvePoints.length >= 2,
    );
    if (helperObjects.curveLine.visible) {
      setDynamicLinePoints(helperObjects.curveLine, splineCurvePoints);
    }
    helperObjects.targetMarker.position.copy(targetPosition);
    helperObjects.poleLine.visible = Boolean(polePosition);
    helperObjects.poleMarker.visible = Boolean(polePosition);
    if (polePosition) {
      setDynamicLinePoints(helperObjects.poleLine, [
        rootPosition,
        polePosition,
      ]);
      helperObjects.poleMarker.position.copy(polePosition);
    }
    helperDisplay.group.visible = true;
  }

  function removeConstraintHelperDisplay(configurationId) {
    const helperDisplay = helperDisplays.get(configurationId);

    if (!helperDisplay) {
      return;
    }

    helperGroup.remove(helperDisplay.group);

    Object.keys(helperDisplay.objects).forEach(function (key) {
      const object = helperDisplay.objects[key];
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        object.material.dispose();
      }
    });

    helperDisplays.delete(configurationId);
  }

  function disposeHelperDisplay() {
    if (!helperGroup) {
      return;
    }

    Canvas.scene.remove(helperGroup);

    Array.from(helperDisplays.keys()).forEach(function (configurationId) {
      removeConstraintHelperDisplay(configurationId);
    });

    helperDisplays.clear();
    helperGroup = null;
  }

  function getNodeTypeLabel(node) {
    if (node instanceof Group) {
      return localize("two_bone_ik.node.bone");
    }
    if (typeof Locator !== "undefined" && node instanceof Locator) {
      return localize("two_bone_ik.node.locator");
    }
    if (typeof NullObject !== "undefined" && node instanceof NullObject) {
      return localize("two_bone_ik.node.null");
    }
    return localize("two_bone_ik.node.object");
  }

  function getNodeChoiceList(nodes, emptyLabel) {
    const choices = [
      {
        uuid: "",
        label: emptyLabel,
      },
    ];

    nodes.forEach(function (node) {
      choices.push({
        uuid: node.uuid,
        label: node.name + " [" + getNodeTypeLabel(node) + "]",
      });
    });

    return choices;
  }

  function getNodeDisplayName(uuid) {
    const node = findPositionNode(uuid);
    return node ? node.name : localize("two_bone_ik.node.none");
  }

  function getSuggestedSelection(existingConfiguration) {
    let endEffector = null;
    let lowerBone = null;
    let upperBone = null;

    if (existingConfiguration) {
      return {
        upperBoneUuid: existingConfiguration.upperBoneUuid,
        lowerBoneUuid: existingConfiguration.lowerBoneUuid,
        endEffectorUuid: existingConfiguration.endEffectorUuid,
      };
    }

    const selectedPositionNode =
      Outliner.selected.find(function (node) {
        return Boolean(node && node.uuid && findPositionNode(node.uuid));
      }) || Group.first_selected;

    if (selectedPositionNode) {
      endEffector = selectedPositionNode;
      lowerBone =
        endEffector.parent instanceof Group ? endEffector.parent : null;
      upperBone =
        lowerBone && lowerBone.parent instanceof Group
          ? lowerBone.parent
          : null;
    }

    return {
      upperBoneUuid: upperBone ? upperBone.uuid : "",
      lowerBoneUuid: lowerBone ? lowerBone.uuid : "",
      endEffectorUuid: endEffector ? endEffector.uuid : "",
    };
  }

  function getSuggestedPoint(selection) {
    const endEffector = findPositionNode(selection.endEffectorUuid);

    if (endEffector) {
      Canvas.scene.updateMatrixWorld(true);
      const position = getNodeWorldPosition(endEffector);
      if (position) {
        return position.toArray();
      }
    }

    return [0, 0, 0];
  }

  function toFiniteNumber(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  function normalizeStoredVector(vector, fallbackVector) {
    if (!Array.isArray(vector)) {
      return fallbackVector.slice();
    }

    return fallbackVector.map(function (fallbackValue, componentIndex) {
      const numericValue = Number(vector[componentIndex]);
      return Number.isFinite(numericValue) ? numericValue : fallbackValue;
    });
  }

  function normalizeStoredUuidList(uuidList) {
    if (!Array.isArray(uuidList)) {
      return [];
    }

    return uuidList
      .filter(function (nodeUuid) {
        return typeof nodeUuid === "string" && Boolean(nodeUuid.trim());
      })
      .map(function (nodeUuid) {
        return nodeUuid.trim();
      });
  }

  // Project data stays independent of the runtime scene and panel state.
  function getProjectConfigurations(projectReference = Project) {
    return activeConfigurations.filter(function (configuration) {
      return configuration.projectReference === projectReference;
    });
  }

  function serializeConfiguration(configuration) {
    return {
      id: String(configuration.id || createConstraintId()),
      name: String(configuration.name || ""),
      ikType: getIkType(configuration),
      upperBoneUuid: String(configuration.upperBoneUuid || ""),
      lowerBoneUuid: String(configuration.lowerBoneUuid || ""),
      endEffectorUuid: String(configuration.endEffectorUuid || ""),
      targetMode: configuration.targetMode === "point" ? "point" : "object",
      targetNodeUuid: String(configuration.targetNodeUuid || ""),
      targetPoint: normalizeStoredVector(configuration.targetPoint, [0, 0, 0]),
      poleMode: configuration.poleMode === "object" ? "object" : "direction",
      poleNodeUuid: String(configuration.poleNodeUuid || ""),
      bendDirection: normalizeStoredVector(
        configuration.bendDirection,
        [0, 0, 1],
      ),
      splineControlNodeUuids: normalizeStoredUuidList(
        configuration.splineControlNodeUuids,
      ),
      splineRootStiffness: clampNumber(
        configuration.splineRootStiffness,
        0,
        1,
        0.35,
      ),
      ikWeight: getIkWeight(configuration),
      livePreview: configuration.livePreview !== false,
      showHelpers: configuration.showHelpers !== false,
    };
  }

  function sanitizeStoredConfiguration(
    storedConfiguration,
    configurationIndex,
    projectReference,
    usedConfigurationIds,
  ) {
    if (!storedConfiguration || typeof storedConfiguration !== "object") {
      return null;
    }

    let configurationId =
      typeof storedConfiguration.id === "string" &&
      storedConfiguration.id.trim()
        ? storedConfiguration.id
        : createConstraintId();

    while (usedConfigurationIds.has(configurationId)) {
      configurationId = createConstraintId();
    }
    usedConfigurationIds.add(configurationId);

    return {
      id: configurationId,
      name:
        typeof storedConfiguration.name === "string" &&
        storedConfiguration.name.trim()
          ? storedConfiguration.name
          : "IK " + (configurationIndex + 1),
      projectReference: projectReference,
      ikType: getIkType(storedConfiguration),
      upperBoneUuid:
        typeof storedConfiguration.upperBoneUuid === "string"
          ? storedConfiguration.upperBoneUuid
          : "",
      lowerBoneUuid:
        typeof storedConfiguration.lowerBoneUuid === "string"
          ? storedConfiguration.lowerBoneUuid
          : "",
      endEffectorUuid:
        typeof storedConfiguration.endEffectorUuid === "string"
          ? storedConfiguration.endEffectorUuid
          : "",
      targetMode:
        storedConfiguration.targetMode === "point" ? "point" : "object",
      targetNodeUuid:
        typeof storedConfiguration.targetNodeUuid === "string"
          ? storedConfiguration.targetNodeUuid
          : "",
      targetPoint: normalizeStoredVector(
        storedConfiguration.targetPoint,
        [0, 0, 0],
      ),
      poleMode:
        storedConfiguration.poleMode === "object" ? "object" : "direction",
      poleNodeUuid:
        typeof storedConfiguration.poleNodeUuid === "string"
          ? storedConfiguration.poleNodeUuid
          : "",
      bendDirection: normalizeStoredVector(
        storedConfiguration.bendDirection,
        [0, 0, 1],
      ),
      splineControlNodeUuids: normalizeStoredUuidList(
        storedConfiguration.splineControlNodeUuids,
      ),
      splineRootStiffness: clampNumber(
        storedConfiguration.splineRootStiffness,
        0,
        1,
        0.35,
      ),
      ikWeight: getIkWeight(storedConfiguration),
      livePreview: storedConfiguration.livePreview !== false,
      showHelpers: storedConfiguration.showHelpers !== false,
    };
  }

  function createProjectData(projectReference) {
    return {
      version: PROJECT_DATA_VERSION,
      constraints: getProjectConfigurations(projectReference).map(serializeConfiguration),
    };
  }

  function persistConfigurationsForProject(projectReference, markAsUnsaved) {
    if (!projectReference) {
      return;
    }

    if (hasUnsupportedProjectDataVersion(projectReference)) {
      return;
    }

    const projectData = createProjectData(projectReference);
    const existingProjectData = projectReference[PROJECT_DATA_PROPERTY];
    let projectDataChanged = true;

    try {
      projectDataChanged =
        JSON.stringify(existingProjectData) !== JSON.stringify(projectData);
    } catch (error) {
      projectDataChanged = true;
    }

    if (!projectDataChanged) {
      return;
    }

    projectReference[PROJECT_DATA_PROPERTY] = projectData;
    if (markAsUnsaved && projectReference.saved !== false) {
      projectReference.saved = false;
    }
  }

  function readStoredProjectData(projectReference) {
    let projectData = projectReference
      ? projectReference[PROJECT_DATA_PROPERTY]
      : null;

    if (typeof projectData === "string") {
      try {
        projectData = JSON.parse(projectData);
      } catch (error) {
        return null;
      }
    }

    return projectData;
  }

  function hasUnsupportedProjectDataVersion(projectReference) {
    const projectData = readStoredProjectData(projectReference);

    return Boolean(
      projectData &&
      !Array.isArray(projectData) &&
      typeof projectData === "object" &&
      Number.isFinite(Number(projectData.version)) &&
      Number(projectData.version) > PROJECT_DATA_VERSION,
    );
  }

  function readStoredConstraints(projectReference) {
    const projectData = readStoredProjectData(projectReference);

    if (Array.isArray(projectData)) {
      return projectData;
    }

    if (
      !projectData ||
      typeof projectData !== "object" ||
      !Array.isArray(projectData.constraints)
    ) {
      return [];
    }

    return projectData.constraints;
  }

  function clearConstraintHelperDisplays() {
    Array.from(helperDisplays.keys()).forEach(function (configurationId) {
      removeConstraintHelperDisplay(configurationId);
    });
  }

  function restoreConfigurationsFromProject(projectReference) {
    activeConfigurations.splice(0, activeConfigurations.length);
    clearConstraintHelperDisplays();
    resetIkPanelEditor();

    if (!projectReference) {
      refreshIkPanel();
      return;
    }

    if (hasUnsupportedProjectDataVersion(projectReference)) {
      refreshIkPanel();
      return;
    }

    const usedConfigurationIds = new Set();
    readStoredConstraints(projectReference).forEach(
      function (storedConfiguration, configurationIndex) {
        const configuration = sanitizeStoredConfiguration(
          storedConfiguration,
          configurationIndex,
          projectReference,
          usedConfigurationIds,
        );

        if (configuration) {
          activeConfigurations.push(configuration);
        }
      },
    );

    persistConfigurationsForProject(projectReference, false);

    refreshIkPanel();

    if (Modes.animate && Animation.selected && activeConfigurations.length) {
      Animator.preview();
    }
  }

  function registerProjectDataProperty() {
    projectDataProperty = new Property(
      ModelProject,
      "object",
      PROJECT_DATA_PROPERTY,
      {
        exposed: false,
        default: {
          version: PROJECT_DATA_VERSION,
          constraints: [],
        },
      },
    );

    if (Array.isArray(ModelProject.all)) {
      ModelProject.all.forEach(function (projectReference) {
        if (projectReference[PROJECT_DATA_PROPERTY] === undefined) {
          projectDataProperty.reset(projectReference, true);
        }
      });
    }
  }

  function createSplineControlRows(configuration) {
    const controlNodeUuids = normalizeStoredUuidList(
      configuration && configuration.splineControlNodeUuids,
    );
    const rows = controlNodeUuids.map(function (nodeUuid) {
      return {
        rowId: createConstraintId(),
        nodeUuid: nodeUuid,
      };
    });

    if (rows.length === 0) {
      rows.push({
        rowId: createConstraintId(),
        nodeUuid: "",
      });
    }

    return rows;
  }

  function createEditorForm(configuration) {
    const existingConfiguration = configuration || {};
    const suggestedSelection = getSuggestedSelection(configuration);
    const suggestedPoint = configuration
      ? configuration.targetPoint.slice()
      : getSuggestedPoint(suggestedSelection);
    const bendDirection = configuration
      ? configuration.bendDirection.slice()
      : [0, 0, 1];

    return {
      name: existingConfiguration.name || "",
      ikType: getIkType(existingConfiguration),
      upperBoneUuid: suggestedSelection.upperBoneUuid,
      lowerBoneUuid: suggestedSelection.lowerBoneUuid,
      endEffectorUuid: suggestedSelection.endEffectorUuid,
      targetMode: existingConfiguration.targetMode || "object",
      targetNodeUuid: existingConfiguration.targetNodeUuid || "",
      targetX: suggestedPoint[0],
      targetY: suggestedPoint[1],
      targetZ: suggestedPoint[2],
      poleMode: existingConfiguration.poleMode || "direction",
      poleNodeUuid: existingConfiguration.poleNodeUuid || "",
      bendDirectionX: bendDirection[0],
      bendDirectionY: bendDirection[1],
      bendDirectionZ: bendDirection[2],
      splineControlRows: createSplineControlRows(configuration),
      splineRootStiffness: clampNumber(
        existingConfiguration.splineRootStiffness,
        0,
        1,
        0.35,
      ),
      ikWeightPercent: Math.round(getIkWeight(existingConfiguration) * 100),
      livePreview: existingConfiguration.livePreview !== false,
      showHelpers: existingConfiguration.showHelpers !== false,
    };
  }

  function createConfigurationFromForm(form, configurationId) {
    const ikType = getIkType(form);
    const upperBone = findGroup(form.upperBoneUuid);
    const lowerBone = findGroup(form.lowerBoneUuid);
    const endEffector = findPositionNode(form.endEffectorUuid);
    let defaultName = "IK " + (activeConfigurations.length + 1);

    if (ikType === "aim" && upperBone) {
      defaultName = upperBone.name + " Aim";
    } else if (
      (ikType === "chain" || ikType === "spline") &&
      upperBone &&
      endEffector
    ) {
      defaultName = upperBone.name + " → " + endEffector.name;
    } else if (upperBone && lowerBone) {
      defaultName = upperBone.name + " / " + lowerBone.name;
    }

    return {
      id: configurationId || createConstraintId(),
      name: String(form.name || "").trim() || defaultName,
      projectReference: Project,
      ikType: ikType,
      upperBoneUuid: form.upperBoneUuid,
      lowerBoneUuid: form.lowerBoneUuid,
      endEffectorUuid: form.endEffectorUuid,
      targetMode: form.targetMode,
      targetNodeUuid: form.targetNodeUuid,
      targetPoint: [
        toFiniteNumber(form.targetX),
        toFiniteNumber(form.targetY),
        toFiniteNumber(form.targetZ),
      ],
      poleMode: form.poleMode,
      poleNodeUuid: form.poleNodeUuid,
      bendDirection: [
        toFiniteNumber(form.bendDirectionX),
        toFiniteNumber(form.bendDirectionY),
        toFiniteNumber(form.bendDirectionZ),
      ],
      splineControlNodeUuids: normalizeStoredUuidList(
        (Array.isArray(form.splineControlRows)
          ? form.splineControlRows
          : []
        ).map(function (controlRow) {
          return typeof controlRow === "string"
            ? controlRow
            : controlRow && controlRow.nodeUuid;
        }),
      ),
      splineRootStiffness: clampNumber(form.splineRootStiffness, 0, 1, 0.35),
      ikWeight:
        clampNumber(form.ikWeightPercent, 0, 100, 100) / 100,
      livePreview: Boolean(form.livePreview),
      showHelpers: Boolean(form.showHelpers),
    };
  }

  function refreshIkPanel() {
    if (ikPanel && ikPanel.inside_vue) {
      ikPanel.inside_vue.revision += 1;
    }
  }

  function resetIkPanelEditor() {
    if (!ikPanel || !ikPanel.inside_vue) {
      return;
    }

    ikPanel.inside_vue.editorOpen = false;
    ikPanel.inside_vue.rangeBakeOpen = false;
    ikPanel.inside_vue.rangeBakeConfigurationId = null;
    ikPanel.inside_vue.editingConfigurationId = null;
    ikPanel.inside_vue.editorForm = createEditorForm(null);
    ikPanel.inside_vue.expandedConfigurationIds = [];
  }

  function solveConfigurationWithDependencies(
    configuration,
    updateHelpers,
    includeLiveConfigurations = false,
  ) {
    const projectConfigurations = getProjectConfigurations(configuration.projectReference);
    const requestedConfigurations = includeLiveConfigurations
      ? projectConfigurations.filter(function (candidate) {
          return candidate.id === configuration.id || candidate.livePreview;
        })
      : [configuration];
    const configurationsToSolve = getConfigurationDependencyClosure(
      requestedConfigurations,
      projectConfigurations,
    );

    configurationsToSolve.forEach(function (configurationToSolve) {
      solveConstraint(
        configurationToSolve,
        configurationToSolve.id === configuration.id
          ? updateHelpers
          : configurationToSolve.showHelpers,
      );
    });
    if (typeof Animator.displayMeshDeformation === "function") {
      Animator.displayMeshDeformation();
    }
  }

  function previewAnimationWithoutIk() {
    suppressLiveSolver = true;
    try {
      Animator.preview();
    } finally {
      suppressLiveSolver = false;
    }
  }

  // Preview always starts from the animation's FK pose before applying manual IK.
  function previewConfiguration(configuration, includeLiveConfigurations = false) {
    if (!Modes.animate || !Animation.selected) {
      return;
    }

    if (configuration.livePreview) {
      Animator.preview();
      return;
    }

    previewAnimationWithoutIk();
    solveConfigurationWithDependencies(
      configuration,
      configuration.showHelpers,
      includeLiveConfigurations,
    );
  }

  function saveConfiguration(form, configurationId) {
    if (hasUnsupportedProjectDataVersion(Project)) {
      return localize("two_bone_ik.error.newer_project_data");
    }

    const configuration = createConfigurationFromForm(form, configurationId);
    const validationError = validateConfiguration(configuration);

    if (validationError) {
      return validationError;
    }

    const existingIndex = activeConfigurations.findIndex(
      function (existingConfiguration) {
        return existingConfiguration.id === configuration.id;
      },
    );

    if (existingIndex === -1) {
      activeConfigurations.push(configuration);
    } else {
      activeConfigurations.splice(existingIndex, 1, configuration);
    }

    persistConfigurationsForProject(Project, true);

    previewConfiguration(configuration);

    if (!configuration.showHelpers) {
      setHelperDisplayVisibility(configuration.id, false);
    }

    refreshIkPanel();
    return null;
  }

  function removeConfiguration(configurationId) {
    const configurationIndex = activeConfigurations.findIndex(
      function (configuration) {
        return configuration.id === configurationId;
      },
    );

    if (configurationIndex === -1) {
      return;
    }

    activeConfigurations.splice(configurationIndex, 1);
    persistConfigurationsForProject(Project, true);
    removeConstraintHelperDisplay(configurationId);
    refreshIkPanel();

    if (Modes.animate && Animation.selected) {
      Animator.preview();
    }
  }

  function setConfigurationPreview(configurationId, enabled) {
    const configuration = activeConfigurations.find(function (candidate) {
      return candidate.id === configurationId;
    });

    if (!configuration) {
      return;
    }

    configuration.livePreview = enabled;
    persistConfigurationsForProject(Project, true);
    if (!enabled) {
      setHelperDisplayVisibility(configuration.id, false);
    }

    if (Modes.animate && Animation.selected) {
      Animator.preview();
    }
    refreshIkPanel();
  }

  function setConfigurationHelpers(configurationId, enabled) {
    const configuration = activeConfigurations.find(function (candidate) {
      return candidate.id === configurationId;
    });

    if (!configuration) {
      return;
    }

    configuration.showHelpers = enabled;
    persistConfigurationsForProject(Project, true);
    if (enabled) {
      previewConfiguration(configuration);
    } else {
      setHelperDisplayVisibility(configuration.id, false);
    }
    refreshIkPanel();
  }

  function setConfigurationWeight(configurationId, weightPercent) {
    const configuration = activeConfigurations.find(function (candidate) {
      return (
        candidate.id === configurationId &&
        candidate.projectReference === Project
      );
    });

    if (
      !configuration ||
      (typeof weightPercent !== "number" && typeof weightPercent !== "string") ||
      (typeof weightPercent === "string" && !weightPercent.trim()) ||
      !Number.isFinite(Number(weightPercent))
    ) {
      return;
    }

    configuration.ikWeight =
      clampNumber(weightPercent, 0, 100, 100) / 100;
    persistConfigurationsForProject(Project, true);

    previewConfiguration(configuration, true);

    refreshIkPanel();
  }

  // The panel owns presentation; its methods delegate scene and data changes above.
  function createIkPanel() {
    ikPanel = new Panel("two_bone_ik_panel", {
      name: localize("two_bone_ik.panel.name"),
      icon: "precision_manufacturing",
      optional: true,
      growable: true,
      resizable: true,
      min_height: 260,
      default_position: {
        slot: "right_bar",
        height: 500,
      },
      condition: function () {
        return Boolean(Project && Format && Format.animation_mode);
      },
      component: createIkPanelComponent(),
    });
  }

  function createIkPanelComponent() {
    return {
      data: createIkPanelData,
      computed: {
        constraints: function () {
          this.revision;
          return activeConfigurations;
        },
        groupChoices: function () {
          this.revision;
          return getNodeChoiceList(
            Group.all,
            localize("two_bone_ik.select.bone"),
          );
        },
        positionNodeChoices: function () {
          this.revision;
          return getNodeChoiceList(
            getAllPositionNodes(),
            localize("two_bone_ik.select.object"),
          );
        },
      },
      methods: Object.assign(
        createIkPanelEditorMethods(),
        createIkPanelConstraintMethods(),
        createIkPanelRangeBakeMethods(),
        createIkPanelLabelMethods(),
      ),
      template: getIkPanelTemplate(),
    };
  }

  function createIkPanelData() {
    return {
      revision: 0,
      editorOpen: false,
      rangeBakeOpen: false,
      rangeBakeConfigurationId: null,
      rangeBakeStartFrame: 0,
      rangeBakeEndFrame: 0,
      rangeBakeFrameStep: 1,
      editingConfigurationId: null,
      editorForm: createEditorForm(null),
      expandedConfigurationIds: [],
      maximumSplineControlCount: MAXIMUM_SPLINE_CONTROL_COUNT,
    };
  }

  function createIkPanelEditorMethods() {
    return {
      openAddEditor: function () {
        this.editingConfigurationId = null;
        this.editorForm = createEditorForm(null);
        this.editorOpen = true;
      },
      openEditEditor: function (configurationId) {
        const configuration = activeConfigurations.find(
          function (candidate) {
            return candidate.id === configurationId;
          },
        );
        if (!configuration) {
          return;
        }
        this.editingConfigurationId = configuration.id;
        this.editorForm = createEditorForm(configuration);
        this.editorOpen = true;
      },
      cancelEditor: function () {
        this.editorOpen = false;
        this.editingConfigurationId = null;
      },
      addSplineControlPoint: function () {
        if (
          this.editorForm.splineControlRows.length >=
          MAXIMUM_SPLINE_CONTROL_COUNT
        ) {
          return;
        }
        this.editorForm.splineControlRows.push({
          rowId: createConstraintId(),
          nodeUuid: "",
        });
      },
      addSelectedSplineControls: function () {
        const selectedGroups = Array.isArray(Group.multi_selected)
          ? Group.multi_selected.slice()
          : Group.first_selected
            ? [Group.first_selected]
            : [];
        const selectedOutlinerNodes = (
          Array.isArray(Outliner.selected) ? Outliner.selected : []
        ).filter(function (selectedNode) {
          return !selectedGroups.some(function (selectedGroup) {
            return isDescendantOf(selectedNode, selectedGroup);
          });
        });
        const selectedNodes = selectedGroups.concat(
          selectedOutlinerNodes,
          Group.first_selected ? [Group.first_selected] : [],
        );
        const existingNodeUuids = new Set(
          this.editorForm.splineControlRows.map(function (controlRow) {
            return controlRow.nodeUuid;
          }),
        );

        selectedNodes.forEach(
          function (selectedNode) {
            if (
              !selectedNode ||
              !selectedNode.uuid ||
              !findPositionNode(selectedNode.uuid) ||
              existingNodeUuids.has(selectedNode.uuid)
            ) {
              return;
            }

            const emptyControlRow = this.editorForm.splineControlRows.find(
              function (controlRow) {
                return !controlRow.nodeUuid;
              },
            );
            if (emptyControlRow) {
              emptyControlRow.nodeUuid = selectedNode.uuid;
            } else if (
              this.editorForm.splineControlRows.length >=
              MAXIMUM_SPLINE_CONTROL_COUNT
            ) {
              return;
            } else {
              this.editorForm.splineControlRows.push({
                rowId: createConstraintId(),
                nodeUuid: selectedNode.uuid,
              });
            }
            existingNodeUuids.add(selectedNode.uuid);
          }.bind(this),
        );
      },
      moveSplineControlPoint: function (controlIndex, direction) {
        const destinationIndex = controlIndex + direction;
        if (
          destinationIndex < 0 ||
          destinationIndex >= this.editorForm.splineControlRows.length
        ) {
          return;
        }

        const movedRows = this.editorForm.splineControlRows.splice(
          controlIndex,
          1,
        );
        this.editorForm.splineControlRows.splice(
          destinationIndex,
          0,
          movedRows[0],
        );
      },
      removeSplineControlPoint: function (controlIndex) {
        if (this.editorForm.splineControlRows.length === 1) {
          this.editorForm.splineControlRows[0].nodeUuid = "";
          return;
        }
        this.editorForm.splineControlRows.splice(controlIndex, 1);
      },
      saveEditor: function () {
        const validationError = saveConfiguration(
          this.editorForm,
          this.editingConfigurationId,
        );

        if (validationError) {
          Blockbench.showMessageBox({
            title: localize("two_bone_ik.dialog.validation.title"),
            message: validationError,
            buttons: [localize("two_bone_ik.dialog.ok")],
          });
          return;
        }

        this.editorOpen = false;
        this.editingConfigurationId = null;
        Blockbench.showQuickMessage(
          localize("two_bone_ik.message.saved", [
            activeConfigurations.length,
          ]),
          1800,
        );
      },
    };
  }

  function createIkPanelConstraintMethods() {
    return {
      isConstraintExpanded: function (configurationId) {
        return this.expandedConfigurationIds.includes(configurationId);
      },
      toggleConstraintExpanded: function (configurationId) {
        const expandedIndex =
          this.expandedConfigurationIds.indexOf(configurationId);

        if (expandedIndex === -1) {
          this.expandedConfigurationIds.push(configurationId);
        } else {
          this.expandedConfigurationIds.splice(expandedIndex, 1);
        }
      },
      removeConstraint: function (configurationId) {
        const expandedIndex =
          this.expandedConfigurationIds.indexOf(configurationId);
        if (expandedIndex !== -1) {
          this.expandedConfigurationIds.splice(expandedIndex, 1);
        }
        removeConfiguration(configurationId);
      },
      setPreview: function (configurationId, enabled) {
        setConfigurationPreview(configurationId, enabled);
      },
      setHelpers: function (configurationId, enabled) {
        setConfigurationHelpers(configurationId, enabled);
      },
      setWeight: function (configurationId, weightPercent) {
        setConfigurationWeight(configurationId, weightPercent);
      },
      toggleAllPreview: function () {
        toggleLivePreview();
      },
      bakeAll: function () {
        bakeCurrentPose();
      },
      bakeOne: function (configurationId) {
        bakeCurrentPose(configurationId);
      },
      clearAll: function () {
        this.expandedConfigurationIds.splice(
          0,
          this.expandedConfigurationIds.length,
        );
        clearConstraints();
      },
    };
  }

  function createIkPanelRangeBakeMethods() {
    return {
      openRangeBake: function (configurationId) {
        if (!Modes.animate || !Animation.selected) {
          Blockbench.showMessageBox({
            title: localize("two_bone_ik.panel.name"),
            message: localize("two_bone_ik.error.select_animation"),
            buttons: [localize("two_bone_ik.dialog.ok")],
          });
          return;
        }
        this.rangeBakeConfigurationId =
          typeof configurationId === "string" ? configurationId : null;
        this.rangeBakeStartFrame = 0;
        this.rangeBakeEndFrame = Math.floor(
          Animation.selected.length * getBakeFrameRate() + EPSILON,
        );
        this.rangeBakeFrameStep = 1;
        this.rangeBakeOpen = true;
        this.editorOpen = false;
        this.$nextTick(function () {
          if (this.$refs.rangeBakeForm) {
            this.$refs.rangeBakeForm.scrollIntoView({block: "nearest"});
            this.$refs.rangeBakeStart.focus();
          }
        });
      },
      rangeBakeTitle: function () {
        const configuration = activeConfigurations.find(function (candidate) {
          return candidate.id === this.rangeBakeConfigurationId;
        }, this);
        return configuration
          ? localize("two_bone_ik.ui.bake_range_one", [configuration.name])
          : localize("two_bone_ik.ui.bake_range_all");
      },
      rangeBakeTiming: function () {
        const framesPerSecond = getBakeFrameRate();
        const lastFrame = Animation.selected
          ? Math.floor(Animation.selected.length * framesPerSecond + EPSILON)
          : 0;
        return localize("two_bone_ik.ui.range_timing", [framesPerSecond, lastFrame]);
      },
      applyRangeBake: function () {
        if (bakeAnimationRange(
          this.rangeBakeConfigurationId, this.rangeBakeStartFrame,
          this.rangeBakeEndFrame, this.rangeBakeFrameStep,
        )) {
          this.rangeBakeOpen = false;
        }
      },
    };
  }

  function createIkPanelLabelMethods() {
    return {
      text: function (translationKey) {
        return localize(translationKey);
      },
      chainLabel: function (configuration) {
        const ikType = getIkType(configuration);
        if (ikType === "aim" || ikType === "chain" || ikType === "spline") {
          return (
            getNodeDisplayName(configuration.upperBoneUuid) +
            " → " +
            getNodeDisplayName(configuration.endEffectorUuid)
          );
        }
        return (
          getNodeDisplayName(configuration.upperBoneUuid) +
          " → " +
          getNodeDisplayName(configuration.lowerBoneUuid) +
          " → " +
          getNodeDisplayName(configuration.endEffectorUuid)
        );
      },
      typeLabel: function (configuration) {
        return localize("two_bone_ik.type." + getIkType(configuration));
      },
      weightPercent: function (configuration) {
        return Math.round(getIkWeight(configuration) * 100);
      },
      targetLabel: function (configuration) {
        if (configuration.targetMode === "object") {
          return getNodeDisplayName(configuration.targetNodeUuid);
        }
        return configuration.targetPoint.join(", ");
      },
      splineControlsLabel: function (configuration) {
        const controlNodeUuids = getSplineControlNodeUuids(configuration);
        if (controlNodeUuids.length === 0) {
          return localize("two_bone_ik.node.none");
        }
        return controlNodeUuids.map(getNodeDisplayName).join(" → ");
      },
      splineRootStiffnessPercent: function () {
        return Math.round(
          clampNumber(this.editorForm.splineRootStiffness, 0, 1, 0.35) *
            100,
        );
      },
      poleLabel: function (configuration) {
        if (getIkType(configuration) !== "two_bone") {
          return localize("two_bone_ik.node.none");
        }
        if (configuration.poleMode === "object") {
          return getNodeDisplayName(configuration.poleNodeUuid);
        }
        return (
          localize("two_bone_ik.ui.direction") +
          " " +
          configuration.bendDirection.join(", ")
        );
      },
    };
  }

  function getIkPanelTemplate() {
    return `
                    <div class="two_bone_ik_panel">
                        <div class="ik_toolbar">
                            <button class="ik_primary" @click="openAddEditor" :title="text('two_bone_ik.ui.add.title')">
                                <i class="material-icons">add</i><span>{{ text('two_bone_ik.ui.add') }}</span>
                            </button>
                            <div class="ik_toolbar_actions">
                                <button @click="toggleAllPreview" :disabled="constraints.length === 0" :title="text('two_bone_ik.ui.preview_all.title')">
                                    <i class="material-icons">visibility</i><span>{{ text('two_bone_ik.ui.preview_all') }}</span>
                                </button>
                                <button @click="bakeAll" :disabled="constraints.length === 0" :title="text('two_bone_ik.ui.bake_all.title')">
                                    <i class="material-icons">add_to_photos</i><span>{{ text('two_bone_ik.ui.bake_all') }}</span>
                                </button>
                            </div>
                            <button class="ik_range_open" @click="openRangeBake()" :disabled="constraints.length === 0">
                                <i class="material-icons">date_range</i><span>{{ text('two_bone_ik.ui.bake_range_all') }}</span>
                            </button>
                        </div>

                        <form v-if="rangeBakeOpen && !editorOpen" ref="rangeBakeForm" class="ik_range_bake" @submit.prevent="applyRangeBake">
                            <div class="ik_range_header">
                                <strong>{{ rangeBakeTitle() }}</strong>
                                <button type="button" @click="rangeBakeOpen = false" :aria-label="text('two_bone_ik.ui.close')"><i class="material-icons">close</i></button>
                            </div>
                            <span class="ik_range_timing">{{ rangeBakeTiming() }}</span>
                            <div class="ik_range_inputs">
                                <label class="ik_field"><span>{{ text('two_bone_ik.ui.start_frame') }}</span><input ref="rangeBakeStart" type="number" min="0" step="1" required v-model.number="rangeBakeStartFrame"></label>
                                <label class="ik_field"><span>{{ text('two_bone_ik.ui.end_frame') }}</span><input type="number" min="0" step="1" required v-model.number="rangeBakeEndFrame"></label>
                                <label class="ik_field"><span>{{ text('two_bone_ik.ui.frame_step') }}</span><input type="number" min="1" step="1" required v-model.number="rangeBakeFrameStep"></label>
                            </div>
                            <small>{{ text('two_bone_ik.ui.range_hint') }}</small>
                            <button type="submit" class="ik_primary"><i class="material-icons">date_range</i><span>{{ text('two_bone_ik.ui.bake_range') }}</span></button>
                        </form>

                        <div v-if="!editorOpen" class="ik_constraint_list">
                            <div v-if="constraints.length === 0" class="ik_empty_state">
                                <i class="material-icons">precision_manufacturing</i>
                                <strong>{{ text('two_bone_ik.ui.empty.title') }}</strong>
                                <span>{{ text('two_bone_ik.ui.empty.description') }}</span>
                                <button class="ik_primary" @click="openAddEditor">{{ text('two_bone_ik.ui.empty.action') }}</button>
                            </div>

                            <div v-for="configuration in constraints" :key="configuration.id" class="ik_constraint_card">
                                <div class="ik_card_header">
                                    <button class="ik_card_fold" @click="toggleConstraintExpanded(configuration.id)" :aria-expanded="isConstraintExpanded(configuration.id)" :aria-label="isConstraintExpanded(configuration.id) ? text('two_bone_ik.ui.collapse') : text('two_bone_ik.ui.expand')" :title="isConstraintExpanded(configuration.id) ? text('two_bone_ik.ui.collapse') : text('two_bone_ik.ui.expand')">
                                        <i class="material-icons" aria-hidden="true">{{ isConstraintExpanded(configuration.id) ? 'expand_less' : 'expand_more' }}</i>
                                    </button>
                                    <div class="ik_card_title">
                                        <div class="ik_card_title_line">
                                            <strong>{{ configuration.name }}</strong>
                                            <em>{{ typeLabel(configuration) }}</em>
                                        </div>
                                        <small>{{ chainLabel(configuration) }}</small>
                                    </div>
                                    <button @click="openEditEditor(configuration.id)" :title="text('two_bone_ik.ui.edit')"><i class="material-icons">edit</i></button>
                                    <button class="ik_danger" @click="removeConstraint(configuration.id)" :title="text('two_bone_ik.ui.delete')"><i class="material-icons">delete</i></button>
                                </div>
                                <div class="ik_card_weight" :title="text('two_bone_ik.ui.ik_weight_hint')">
                                    <span aria-hidden="true">FK</span>
                                    <input type="range" min="0" max="100" step="1" :value="weightPercent(configuration)" @input="setWeight(configuration.id, $event.target.value)" :aria-label="configuration.name + ': ' + text('two_bone_ik.ui.ik_weight')">
                                    <span aria-hidden="true">IK</span>
                                    <label class="ik_weight_value">
                                        <input type="number" min="0" max="100" step="1" :value="weightPercent(configuration)" @input="setWeight(configuration.id, $event.target.value)" @change="$event.target.value = weightPercent(configuration)" @blur="$event.target.value = weightPercent(configuration)" @keydown.enter="$event.target.blur()" :aria-label="configuration.name + ': ' + text('two_bone_ik.ui.weight')">
                                        <span aria-hidden="true">%</span>
                                    </label>
                                </div>
                                <div v-show="isConstraintExpanded(configuration.id)" class="ik_card_body">
                                    <div class="ik_card_details">
                                        <div><b>{{ configuration.ikType === 'spline' ? text('two_bone_ik.ui.tip_target') : text('two_bone_ik.ui.target') }}</b><span>{{ targetLabel(configuration) }}</span></div>
                                        <div v-if="configuration.ikType === 'spline'"><b>{{ text('two_bone_ik.ui.controls') }}</b><span>{{ splineControlsLabel(configuration) }}</span></div>
                                        <div v-if="configuration.ikType === 'two_bone'"><b>{{ text('two_bone_ik.ui.pole') }}</b><span>{{ poleLabel(configuration) }}</span></div>
                                    </div>
                                    <div class="ik_card_footer">
                                        <div class="ik_card_toggles">
                                            <label><input type="checkbox" :checked="configuration.livePreview" @change="setPreview(configuration.id, $event.target.checked)"> {{ text('two_bone_ik.ui.live') }}</label>
                                            <label><input type="checkbox" :checked="configuration.showHelpers" @change="setHelpers(configuration.id, $event.target.checked)"> {{ text('two_bone_ik.ui.guides') }}</label>
                                        </div>
                                        <div class="ik_card_bake_actions">
                                            <button class="ik_card_bake" @click="bakeOne(configuration.id)" :title="text('two_bone_ik.ui.bake_one.title')"><i class="material-icons">add_to_photos</i><span>{{ text('two_bone_ik.ui.bake_one') }}</span></button>
                                            <button class="ik_card_range_bake" @click="openRangeBake(configuration.id)" :title="text('two_bone_ik.ui.bake_range')" :aria-label="text('two_bone_ik.ui.bake_range') + ': ' + configuration.name"><i class="material-icons">date_range</i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="constraints.length > 0" class="ik_list_footer">
                                <button class="ik_bake_button" @click="bakeAll"><i class="material-icons">add_to_photos</i>{{ text('two_bone_ik.ui.bake_current') }}</button>
                                <button class="ik_text_danger" @click="clearAll">{{ text('two_bone_ik.ui.clear_all') }}</button>
                            </div>
                        </div>

                        <div v-else class="ik_editor">
                            <div class="ik_editor_header">
                                <strong>{{ editingConfigurationId ? text('two_bone_ik.ui.edit_ik') : text('two_bone_ik.ui.new_ik') }}</strong>
                                <button @click="cancelEditor" :title="text('two_bone_ik.ui.close')"><i class="material-icons">close</i></button>
                            </div>

                            <label class="ik_field"><span>{{ text('two_bone_ik.ui.name') }}</span><input type="text" v-model="editorForm.name" :placeholder="text('two_bone_ik.ui.auto_name')"></label>
                            <label class="ik_field"><span>{{ text('two_bone_ik.ui.ik_type') }}</span><select v-model="editorForm.ikType"><option value="two_bone">{{ text('two_bone_ik.type.two_bone') }}</option><option value="chain">{{ text('two_bone_ik.type.chain') }}</option><option value="spline">{{ text('two_bone_ik.type.spline') }}</option><option value="aim">{{ text('two_bone_ik.type.aim') }}</option></select></label>
                            <div class="ik_section_title">{{ text('two_bone_ik.ui.chain') }}</div>
                            <label class="ik_field"><span>{{ editorForm.ikType === 'chain' || editorForm.ikType === 'spline' ? text('two_bone_ik.ui.root_bone') : editorForm.ikType === 'aim' ? text('two_bone_ik.ui.aim_bone') : text('two_bone_ik.ui.upper_bone') }}</span><select v-model="editorForm.upperBoneUuid"><option v-for="choice in groupChoices" :key="choice.uuid" :value="choice.uuid">{{ choice.label }}</option></select></label>
                            <label v-if="editorForm.ikType === 'two_bone'" class="ik_field"><span>{{ text('two_bone_ik.ui.lower_bone') }}</span><select v-model="editorForm.lowerBoneUuid"><option v-for="choice in groupChoices" :key="choice.uuid" :value="choice.uuid">{{ choice.label }}</option></select></label>
                            <label class="ik_field"><span>{{ editorForm.ikType === 'aim' ? text('two_bone_ik.ui.aim_reference') : text('two_bone_ik.ui.end_effector') }}</span><select v-model="editorForm.endEffectorUuid"><option v-for="choice in positionNodeChoices" :key="choice.uuid" :value="choice.uuid">{{ choice.label }}</option></select></label>

                            <template v-if="editorForm.ikType === 'spline'">
                                <div class="ik_section_title">{{ text('two_bone_ik.ui.curve_controls') }}</div>
                                <div class="ik_spline_controls">
                                    <div v-for="(controlRow, controlIndex) in editorForm.splineControlRows" :key="controlRow.rowId" class="ik_spline_control_row">
                                        <span>{{ controlIndex + 1 }}</span>
                                        <select v-model="controlRow.nodeUuid"><option v-for="choice in positionNodeChoices" :key="choice.uuid" :value="choice.uuid">{{ choice.label }}</option></select>
                                        <button @click="moveSplineControlPoint(controlIndex, -1)" :disabled="controlIndex === 0" :title="text('two_bone_ik.ui.move_up')"><i class="material-icons">arrow_upward</i></button>
                                        <button @click="moveSplineControlPoint(controlIndex, 1)" :disabled="controlIndex === editorForm.splineControlRows.length - 1" :title="text('two_bone_ik.ui.move_down')"><i class="material-icons">arrow_downward</i></button>
                                        <button class="ik_danger" @click="removeSplineControlPoint(controlIndex)" :title="text('two_bone_ik.ui.remove_control')"><i class="material-icons">close</i></button>
                                    </div>
                                    <div class="ik_spline_control_actions">
                                        <button @click="addSplineControlPoint" :disabled="editorForm.splineControlRows.length >= maximumSplineControlCount"><i class="material-icons">add</i><span>{{ text('two_bone_ik.ui.add_control') }}</span></button>
                                        <button @click="addSelectedSplineControls"><i class="material-icons">playlist_add</i><span>{{ text('two_bone_ik.ui.add_selected') }}</span></button>
                                    </div>
                                </div>
                                <p class="ik_hint ik_compact_hint">{{ text('two_bone_ik.ui.control_order_hint') }}</p>
                                <label class="ik_range_field">
                                    <span><b>{{ text('two_bone_ik.ui.root_stiffness') }}</b><output>{{ splineRootStiffnessPercent() }}%</output></span>
                                    <input type="range" min="0" max="1" step="0.05" v-model.number="editorForm.splineRootStiffness">
                                    <small>{{ text('two_bone_ik.ui.root_stiffness_hint') }}</small>
                                </label>
                            </template>

                            <div class="ik_section_title">{{ editorForm.ikType === 'spline' ? text('two_bone_ik.ui.tip_target') : text('two_bone_ik.ui.target') }}</div>
                            <label class="ik_field"><span>{{ text('two_bone_ik.ui.mode') }}</span><select v-model="editorForm.targetMode"><option value="object">{{ text('two_bone_ik.ui.object') }}</option><option value="point">{{ text('two_bone_ik.ui.fixed_point') }}</option></select></label>
                            <label v-if="editorForm.targetMode === 'object'" class="ik_field"><span>{{ text('two_bone_ik.ui.object') }}</span><select v-model="editorForm.targetNodeUuid"><option v-for="choice in positionNodeChoices" :key="choice.uuid" :value="choice.uuid">{{ choice.label }}</option></select></label>
                            <div v-else class="ik_vector_field">
                                <span>{{ text('two_bone_ik.ui.coordinates') }}</span>
                                <div class="ik_vector_inputs">
                                    <label><b>X</b><input type="number" step="any" v-model.number="editorForm.targetX"></label>
                                    <label><b>Y</b><input type="number" step="any" v-model.number="editorForm.targetY"></label>
                                    <label><b>Z</b><input type="number" step="any" v-model.number="editorForm.targetZ"></label>
                                </div>
                            </div>

                            <template v-if="editorForm.ikType === 'two_bone'">
                                <div class="ik_section_title">{{ text('two_bone_ik.ui.pole_bend') }}</div>
                                <label class="ik_field"><span>{{ text('two_bone_ik.ui.mode') }}</span><select v-model="editorForm.poleMode"><option value="object">{{ text('two_bone_ik.ui.pole_object') }}</option><option value="direction">{{ text('two_bone_ik.ui.bend_direction') }}</option></select></label>
                                <label v-if="editorForm.poleMode === 'object'" class="ik_field"><span>{{ text('two_bone_ik.ui.object') }}</span><select v-model="editorForm.poleNodeUuid"><option v-for="choice in positionNodeChoices" :key="choice.uuid" :value="choice.uuid">{{ choice.label }}</option></select></label>
                                <div v-else class="ik_vector_field">
                                    <span>{{ text('two_bone_ik.ui.direction') }}</span>
                                    <div class="ik_vector_inputs">
                                        <label><b>X</b><input type="number" step="any" v-model.number="editorForm.bendDirectionX"></label>
                                        <label><b>Y</b><input type="number" step="any" v-model.number="editorForm.bendDirectionY"></label>
                                        <label><b>Z</b><input type="number" step="any" v-model.number="editorForm.bendDirectionZ"></label>
                                    </div>
                                </div>
                            </template>

                            <p class="ik_hint">{{ text('two_bone_ik.ui.hierarchy_hint') }}</p>

                            <div class="ik_editor_toggles">
                                <label><input type="checkbox" v-model="editorForm.livePreview"> {{ text('two_bone_ik.ui.live_preview') }}</label>
                                <label><input type="checkbox" v-model="editorForm.showHelpers"> {{ text('two_bone_ik.ui.show_guides') }}</label>
                            </div>

                            <div class="ik_editor_actions">
                                <button @click="cancelEditor">{{ text('two_bone_ik.ui.cancel') }}</button>
                                <button class="ik_primary" @click="saveEditor">{{ text('two_bone_ik.ui.save') }}</button>
                            </div>
                        </div>
                    </div>
                `;
  }

  function openIkPanel() {
    if (!ikPanel) {
      return;
    }

    if (ikPanel.slot === "hidden") {
      ikPanel.moveTo("right_bar");
    }

    const containerPanel = ikPanel.getContainerPanel();
    if (containerPanel.folded) {
      containerPanel.fold(false);
    }

    const hostPanel = ikPanel.getHostPanel();
    if (hostPanel) {
      hostPanel.selectTab(ikPanel);
    } else {
      ikPanel.selectTab();
    }
    ikPanel.update();
    refreshIkPanel();
  }

  function createPluginStyles() {
    pluginStyles = Blockbench.addCSS(getIkPanelStyles());
  }

  function getIkPanelStyles() {
    return `
            .two_bone_ik_panel {
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                width: 100%;
                min-width: 0;
                min-height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 8px;
                color: var(--color-text);
                font: inherit;
            }
            .two_bone_ik_panel button {
                box-sizing: border-box;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 30px;
                min-width: 0;
                padding: 0 9px;
                border: 1px solid var(--color-border);
                border-radius: 4px;
                background: var(--color-button, var(--color-ui));
                color: var(--color-text);
                cursor: pointer;
                font: inherit;
                white-space: nowrap;
            }
            .two_bone_ik_panel button:hover:not(:disabled) {
                background: var(--color-accent);
                color: var(--color-accent_text);
            }
            .two_bone_ik_panel button:disabled {
                opacity: 0.45;
                cursor: default;
            }
            .two_bone_ik_panel button .material-icons {
                font-size: 18px;
            }
            .two_bone_ik_panel .ik_primary {
                border-color: var(--color-accent);
                background: var(--color-accent);
                color: var(--color-accent_text);
            }
            .two_bone_ik_panel .ik_toolbar {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 10px;
            }
            .two_bone_ik_panel .ik_toolbar > .ik_primary {
                gap: 5px;
                width: 100%;
                min-height: 34px;
            }
            .two_bone_ik_panel .ik_toolbar_actions {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                gap: 6px;
            }
            .two_bone_ik_panel .ik_toolbar_actions button {
                gap: 5px;
                width: 100%;
                overflow: hidden;
            }
            .two_bone_ik_panel .ik_toolbar_actions button span {
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .two_bone_ik_panel .ik_range_open,
            .two_bone_ik_panel .ik_range_bake > button {
                justify-content: center;
                gap: 5px;
            }
            .two_bone_ik_panel .ik_range_bake {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin: 0 0 10px;
                padding: 10px;
                border: 1px solid var(--color-border);
                border-radius: 6px;
                background: var(--color-back);
                min-width: 0;
            }
            .two_bone_ik_panel .ik_range_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
            }
            .two_bone_ik_panel .ik_range_header strong {
                min-width: 0;
                overflow-wrap: anywhere;
            }
            .two_bone_ik_panel .ik_range_header button {
                flex-shrink: 0;
                padding: 0 3px;
                background: transparent;
                border-color: transparent;
            }
            .two_bone_ik_panel .ik_range_inputs {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 6px;
            }
            .two_bone_ik_panel .ik_range_inputs > label:last-child {
                grid-column: 1 / -1;
            }
            .two_bone_ik_panel .ik_range_bake small,
            .two_bone_ik_panel .ik_range_timing {
                font: inherit;
                color: var(--color-subtle_text);
            }
            .two_bone_ik_panel .ik_card_bake_actions {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .two_bone_ik_panel .ik_card_range_bake {
                padding: 0 5px;
            }
            .two_bone_ik_panel .ik_constraint_list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_empty_state {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 7px;
                padding: 22px 12px;
                border: 1px dashed var(--color-border);
                border-radius: 6px;
                text-align: center;
                color: var(--color-subtle_text);
            }
            .two_bone_ik_panel .ik_empty_state > .material-icons {
                font-size: 30px;
                color: var(--color-accent);
            }
            .two_bone_ik_panel .ik_empty_state strong {
                color: var(--color-text);
            }
            .two_bone_ik_panel .ik_empty_state span {
                line-height: inherit;
            }
            .two_bone_ik_panel .ik_empty_state button {
                margin-top: 5px;
                padding: 0 12px;
            }
            .two_bone_ik_panel .ik_constraint_card {
                box-sizing: border-box;
                width: 100%;
                min-width: 0;
                padding: 10px;
                border: 1px solid var(--color-border);
                border-radius: 6px;
                background: var(--color-back);
            }
            .two_bone_ik_panel .ik_card_header {
                display: grid;
                grid-template-columns: 28px minmax(0, 1fr) 30px 30px;
                gap: 4px;
                align-items: center;
            }
            .two_bone_ik_panel .ik_card_header > button {
                width: 30px;
                min-height: 28px;
                padding: 0;
                border-color: transparent;
                background: transparent;
            }
            .two_bone_ik_panel .ik_card_header > .ik_card_fold {
                width: 28px;
                color: var(--color-accent);
            }
            .two_bone_ik_panel .ik_card_header > .ik_danger:hover {
                background: #c74444;
                color: white;
            }
            .two_bone_ik_panel .ik_card_title {
                min-width: 0;
            }
            .two_bone_ik_panel .ik_card_title_line {
                display: flex;
                align-items: center;
                gap: 5px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_card_title_line strong {
                flex: 1 1 auto;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_card_title strong,
            .two_bone_ik_panel .ik_card_title em,
            .two_bone_ik_panel .ik_card_title small {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .two_bone_ik_panel .ik_card_title em {
                flex: 0 1 auto;
                max-width: 48%;
                width: fit-content;
                margin-top: 0;
                padding: 1px 5px;
                border-radius: 3px;
                background: var(--color-ui);
                color: var(--color-accent);
                font-size: inherit;
                font-style: normal;
            }
            .two_bone_ik_panel .ik_card_title small {
                margin-top: 2px;
                color: var(--color-subtle_text);
                font-size: inherit;
            }
            .two_bone_ik_panel .ik_card_body {
                min-width: 0;
            }
            .two_bone_ik_panel .ik_card_weight {
                display: grid;
                grid-template-columns: auto minmax(0, 1fr) auto 68px;
                align-items: center;
                gap: 6px;
                margin-top: 8px;
                min-width: 0;
                color: var(--color-subtle_text);
                font: inherit;
            }
            .two_bone_ik_panel .ik_card_weight input[type="range"] {
                width: 100%;
                min-width: 0;
                height: 28px;
                margin: 0;
                accent-color: var(--color-accent);
            }
            .two_bone_ik_panel .ik_weight_value {
                display: flex;
                align-items: center;
                gap: 2px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_weight_value input {
                box-sizing: border-box;
                width: 100%;
                min-width: 0;
                height: 28px;
                padding: 2px 3px;
                border: 1px solid var(--color-border);
                border-radius: 4px;
                background: var(--color-ui);
                color: var(--color-text);
                font: inherit;
                text-align: right;
            }
            .two_bone_ik_panel .ik_card_details {
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin: 8px 0;
            }
            .two_bone_ik_panel .ik_card_details > div {
                display: grid;
                grid-template-columns: 58px minmax(0, 1fr);
                gap: 5px;
                align-items: baseline;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_card_details span {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--color-subtle_text);
            }
            .two_bone_ik_panel .ik_card_details b {
                color: var(--color-text);
            }
            .two_bone_ik_panel .ik_card_toggles,
            .two_bone_ik_panel .ik_editor_toggles {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }
            .two_bone_ik_panel .ik_card_footer {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px;
            }
            .two_bone_ik_panel .ik_card_footer .ik_card_toggles {
                flex: 1 1 140px;
            }
            .two_bone_ik_panel .ik_card_footer .ik_card_bake {
                gap: 4px;
                min-height: 28px;
                margin-left: auto;
                padding: 0 9px;
            }
            .two_bone_ik_panel .ik_card_toggles label,
            .two_bone_ik_panel .ik_editor_toggles label {
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
            }
            .two_bone_ik_panel .ik_list_footer {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-top: 2px;
            }
            .two_bone_ik_panel .ik_list_footer .ik_bake_button {
                gap: 6px;
                width: 100%;
            }
            .two_bone_ik_panel .ik_list_footer .ik_text_danger {
                min-height: 24px;
                border-color: transparent;
                background: transparent;
                color: var(--color-subtle_text);
            }
            .two_bone_ik_panel .ik_list_footer .ik_text_danger:hover {
                background: #c74444;
                color: white;
            }
            .two_bone_ik_panel .ik_editor {
                display: flex;
                flex-direction: column;
                gap: 9px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_editor_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 7px;
                border-bottom: 1px solid var(--color-border);
            }
            .two_bone_ik_panel .ik_editor_header button {
                min-height: 26px;
                width: 28px;
                padding: 0;
                border-color: transparent;
                background: transparent;
            }
            .two_bone_ik_panel .ik_section_title {
                margin-top: 7px;
                padding-bottom: 3px;
                border-bottom: 1px solid var(--color-border);
                color: var(--color-accent);
                font-weight: 700;
                letter-spacing: 0.04em;
                text-transform: uppercase;
            }
            .two_bone_ik_panel .ik_field,
            .two_bone_ik_panel .ik_vector_field {
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_field > span,
            .two_bone_ik_panel .ik_vector_field > span {
                color: var(--color-subtle_text);
            }
            .two_bone_ik_panel .ik_field input,
            .two_bone_ik_panel .ik_field select,
            .two_bone_ik_panel .ik_vector_field input,
            .two_bone_ik_panel .ik_spline_control_row select {
                box-sizing: border-box;
                width: 100%;
                height: 30px;
                min-width: 0;
                padding: 3px 6px;
                border: 1px solid var(--color-border);
                border-radius: 3px;
                background: var(--color-ui);
                color: var(--color-text);
                font: inherit;
            }
            .two_bone_ik_panel .ik_spline_controls {
                display: flex;
                flex-direction: column;
                gap: 5px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_spline_control_row {
                display: grid;
                grid-template-columns: 20px minmax(0, 1fr) 28px 28px 28px;
                gap: 4px;
                align-items: center;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_spline_control_row > span {
                color: var(--color-subtle_text);
                text-align: center;
            }
            .two_bone_ik_panel .ik_spline_control_row > button {
                width: 28px;
                min-height: 28px;
                padding: 0;
            }
            .two_bone_ik_panel .ik_spline_control_row > .ik_danger:hover:not(:disabled) {
                background: #c74444;
                color: white;
            }
            .two_bone_ik_panel .ik_spline_control_actions {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                gap: 5px;
            }
            .two_bone_ik_panel .ik_spline_control_actions button {
                gap: 4px;
                overflow: hidden;
            }
            .two_bone_ik_panel .ik_spline_control_actions button span {
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .two_bone_ik_panel .ik_range_field {
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_range_field > span {
                display: flex;
                justify-content: space-between;
                gap: 8px;
                color: var(--color-subtle_text);
            }
            .two_bone_ik_panel .ik_range_field output {
                color: var(--color-text);
            }
            .two_bone_ik_panel .ik_range_field input[type="range"] {
                width: 100%;
                margin: 2px 0;
                accent-color: var(--color-accent);
            }
            .two_bone_ik_panel .ik_range_field small {
                color: var(--color-subtle_text);
                font-size: inherit;
                line-height: inherit;
            }
            .two_bone_ik_panel .ik_vector_inputs {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 5px;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_vector_inputs label {
                display: grid;
                grid-template-columns: 16px minmax(0, 1fr);
                gap: 3px;
                align-items: center;
                min-width: 0;
            }
            .two_bone_ik_panel .ik_vector_inputs b {
                color: var(--color-subtle_text);
                text-align: center;
            }
            .two_bone_ik_panel .ik_hint {
                margin: 4px 0;
                padding: 8px;
                border-left: 3px solid var(--color-accent);
                background: var(--color-back);
                color: var(--color-subtle_text);
                line-height: inherit;
            }
            .two_bone_ik_panel .ik_compact_hint {
                margin-top: 0;
                padding: 6px 8px;
            }
            .two_bone_ik_panel .ik_editor_actions {
                position: sticky;
                bottom: -8px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 7px;
                margin: 5px -8px -8px;
                padding: 8px;
                border-top: 1px solid var(--color-border);
                background: var(--color-ui);
            }
        `;
  }

  function toggleLivePreview() {
    if (!activeConfigurations.length) {
      openIkPanel();
      return;
    }

    const enableLivePreview = activeConfigurations.some(
      function (configuration) {
        return !configuration.livePreview;
      },
    );

    activeConfigurations.forEach(function (configuration) {
      configuration.livePreview = enableLivePreview;
      if (!enableLivePreview) {
        setHelperDisplayVisibility(configuration.id, false);
      }
    });

    persistConfigurationsForProject(Project, true);

    if (Modes.animate) {
      Animator.preview();
    }

    refreshIkPanel();

    Blockbench.showQuickMessage(
      localize(
        enableLivePreview
          ? "two_bone_ik.message.preview_enabled"
          : "two_bone_ik.message.preview_disabled",
      ),
      1800,
    );
  }

  // Baking separates validation, pose sampling, keyframe writes, and UI restoration.
  function showBakeError(message, titleKey = "two_bone_ik.error.cannot_bake.title") {
    Blockbench.showMessageBox({
      title: localize(titleKey),
      message: message,
      buttons: [localize("two_bone_ik.dialog.ok")],
    });
    return false;
  }

  function getBakeConfigurations(configurationId) {
    return getConfigurationEvaluationOrder(
      getProjectConfigurations().filter(function (configuration) {
        return typeof configurationId !== "string" || configuration.id === configurationId;
      }),
    );
  }

  function getBakeValidationError(configurations) {
    for (const configuration of configurations) {
      const validationError = validateConfiguration(configuration);
      if (validationError) {
        return configuration.name + ": " + validationError;
      }
    }
    return null;
  }

  function disableBakedPartialWeightPreview(configurations) {
    let liveStateChanged = false;
    configurations.forEach(function (configuration) {
      const ikWeight = getIkWeight(configuration);
      if (configuration.livePreview && ikWeight > 0 && ikWeight < 1) {
        // The baked rotations already contain the blend; do not apply it twice.
        configuration.livePreview = false;
        setHelperDisplayVisibility(configuration.id, false);
        liveStateChanged = true;
      }
    });
    if (liveStateChanged) {
      persistConfigurationsForProject(Project, true);
    }
    return liveStateChanged;
  }

  function getBakeFrameRate() {
    if (typeof Timeline !== "undefined" && typeof Timeline.getStep === "function") {
      const frameStep = Timeline.getStep();
      if (Number.isFinite(frameStep) && frameStep > 0) {
        return 1 / frameStep;
      }
    }
    return clampNumber(Animation.selected && Animation.selected.snapping, 1, 120, 30);
  }

  function getRangeBakeTimes(startFrame, endFrame, frameStep, framesPerSecond) {
    const values = [startFrame, endFrame, frameStep];
    if (
      values.some(function (value) {
        return (
          (typeof value !== "number" && typeof value !== "string") ||
          (typeof value === "string" && !value.trim()) ||
          !Number.isSafeInteger(Number(value))
        );
      }) ||
      !Number.isFinite(framesPerSecond) || framesPerSecond <= 0
    ) {
      throw new Error(localize("two_bone_ik.error.bake_range_invalid"));
    }
    const firstFrame = Number(startFrame);
    const lastFrame = Number(endFrame);
    const sampleStep = Number(frameStep);
    if (
      firstFrame < 0 || lastFrame < firstFrame || sampleStep < 1 ||
      lastFrame / framesPerSecond > 1000
    ) {
      throw new Error(localize("two_bone_ik.error.bake_range_invalid"));
    }
    const span = lastFrame - firstFrame;
    const sampleCount = Math.floor(span / sampleStep) + 1 +
      (span % sampleStep === 0 ? 0 : 1);
    if (sampleCount > MAX_RANGE_BAKE_FRAMES) {
      throw new Error(localize("two_bone_ik.error.bake_range_limit", [
        MAX_RANGE_BAKE_FRAMES, MAX_RANGE_BAKE_KEYFRAMES,
      ]));
    }
    const times = [];
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const frame = Math.min(lastFrame, firstFrame + sampleIndex * sampleStep);
      times.push(frame / framesPerSecond);
    }
    return times;
  }

  function prepareRangeBakeTracks(animation, configurations) {
    const sampledTracks = new Map();
    configurations.forEach(function (configuration) {
      const controlledBones = getControlledBones(configuration);
      if (!controlledBones.length) {
        throw new Error(localize("two_bone_ik.error.solve_failed"));
      }
      controlledBones.forEach(function (bone) {
        const animator = animation.getBoneAnimator(bone);
        if (
          !animator || !animator.channels || !animator.channels.rotation ||
          !Array.isArray(animator.rotation) || typeof animator.addKeyframe !== "function"
        ) {
          throw new Error(localize("two_bone_ik.error.unsupported_bone"));
        }
        if (animator.rotation_global) {
          throw new Error(localize("two_bone_ik.error.global_rotation"));
        }
        sampledTracks.set(bone.uuid, {
          configurationId: configuration.id,
          animator: animator,
          samples: [],
        });
      });
    });
    return sampledTracks;
  }

  function createRangeBakePlan(animation, configurationsToBake, startFrame, endFrame, frameStep) {
    const framesPerSecond = getBakeFrameRate();
    const sampleTimes = getRangeBakeTimes(startFrame, endFrame, frameStep, framesPerSecond);
    const lastAnimationFrame = Math.floor(animation.length * framesPerSecond + EPSILON);
    if (!Number.isFinite(lastAnimationFrame) || Number(endFrame) > lastAnimationFrame) {
      throw new Error(localize("two_bone_ik.error.bake_range_length", [lastAnimationFrame]));
    }

    const configurationsToSolve = getConfigurationDependencyClosure(
      configurationsToBake, getProjectConfigurations(),
    );
    const validationError = getBakeValidationError(configurationsToSolve);
    if (validationError) {
      throw new Error(validationError);
    }

    // Prepare animators before taking Undo's full animation snapshot.
    const sampledTracks = prepareRangeBakeTracks(animation, configurationsToBake);
    if (sampleTimes.length * sampledTracks.size > MAX_RANGE_BAKE_KEYFRAMES) {
      throw new Error(localize("two_bone_ik.error.bake_range_limit", [
        MAX_RANGE_BAKE_FRAMES, MAX_RANGE_BAKE_KEYFRAMES,
      ]));
    }
    return {
      framesPerSecond: framesPerSecond,
      sampleTimes: sampleTimes,
      sampledTracks: sampledTracks,
      configurationsToSolve: configurationsToSolve,
      configurationIdsToBake: new Set(configurationsToBake.map(function (configuration) {
        return configuration.id;
      })),
    };
  }

  function appendRangeBakeSample(track, boneRotation, configurationId, time) {
    if (
      !track || track.configurationId !== configurationId ||
      !Array.isArray(boneRotation.rotation) || boneRotation.rotation.length !== 3 ||
      !boneRotation.rotation.every(Number.isFinite)
    ) {
      throw new Error(localize("two_bone_ik.error.solve_failed"));
    }
    const previousSample = track.samples[track.samples.length - 1];
    const rotation = boneRotation.rotation.map(function (angle, axis) {
      return previousSample
        ? angle + 360 * Math.round((previousSample.rotation[axis] - angle) / 360)
        : angle;
    });
    track.samples.push({time: time, rotation: rotation});
  }

  function sampleRangeBakePoses(bakePlan) {
    let unreachableSampleCount = 0;
    bakePlan.sampleTimes.forEach(function (time) {
      Timeline.time = time;
      previewAnimationWithoutIk();
      bakePlan.configurationsToSolve.forEach(function (configuration) {
        const solvedPose = solveConstraint(configuration, false);
        if (!solvedPose) {
          throw new Error(localize("two_bone_ik.error.bake_range_pose", [
            configuration.name, Math.round(time * bakePlan.framesPerSecond),
          ]));
        }
        if (!bakePlan.configurationIdsToBake.has(configuration.id)) {
          return;
        }
        if (!solvedPose.reachedTarget) {
          unreachableSampleCount += 1;
        }
        solvedPose.boneRotations.forEach(function (boneRotation) {
          appendRangeBakeSample(
            bakePlan.sampledTracks.get(boneRotation.bone.uuid),
            boneRotation, configuration.id, time,
          );
        });
      });
    });
    bakePlan.sampledTracks.forEach(function (track) {
      if (track.samples.length !== bakePlan.sampleTimes.length) {
        throw new Error(localize("two_bone_ik.error.solve_failed"));
      }
      track.animator.addToTimeline();
    });
    return unreachableSampleCount;
  }

  function writeRangeBakeKeyframes(bakePlan) {
    const rangeStart = bakePlan.sampleTimes[0];
    const rangeEnd = bakePlan.sampleTimes[bakePlan.sampleTimes.length - 1];
    bakePlan.sampledTracks.forEach(function (track) {
      track.animator.rotation.slice().forEach(function (keyframe) {
        if (keyframe.time >= rangeStart && keyframe.time <= rangeEnd) {
          keyframe.remove();
        }
      });
      track.samples.forEach(function (sample) {
        const keyframe = track.animator.addKeyframe({
          channel: "rotation",
          time: sample.time,
          interpolation: "linear",
          data_points: [{
            x: sample.rotation[0], y: sample.rotation[1], z: sample.rotation[2],
          }],
        });
        if (!keyframe) {
          throw new Error(localize("two_bone_ik.error.keyframe_failed"));
        }
      });
    });
  }

  function bakeAnimationRange(configurationId, startFrame, endFrame, frameStep) {
    if (!Modes.animate || !Animation.selected) {
      return showBakeError(localize("two_bone_ik.error.select_animation"));
    }
    if (Undo.current_save) {
      return showBakeError(localize("two_bone_ik.error.bake_range_busy"));
    }
    const animation = Animation.selected;
    const configurationsToBake = getBakeConfigurations(configurationId);
    if (!configurationsToBake.length) {
      return showBakeError(localize("two_bone_ik.error.configure_first"));
    }

    let bakePlan;
    try {
      bakePlan = createRangeBakePlan(animation, configurationsToBake, startFrame, endFrame, frameStep);
    } catch (error) {
      return showBakeError(error.message);
    }

    const originalTime = Timeline.time;
    const wasPlaying = Timeline.playing;
    let undoStarted = false;
    let completed = false;
    let unreachableSampleCount = 0;
    let failureMessage = null;
    try {
      if (wasPlaying) {
        Timeline.pause();
      }
      // Sample the untouched animation in full before creating any baked keys.
      unreachableSampleCount = sampleRangeBakePoses(bakePlan);

      // Full animation snapshots also restore deleted in-between keys on failure.
      Undo.initEdit({animations: [animation]});
      undoStarted = true;
      writeRangeBakeKeyframes(bakePlan);
      animation.setLength();
      Undo.finishEdit(localize("two_bone_ik.undo.bake_range", [startFrame, endFrame]));
      undoStarted = false;
      completed = true;
    } catch (error) {
      if (undoStarted) {
        Undo.cancelEdit(true);
      }
      failureMessage = error.message || localize("two_bone_ik.error.keyframe_failed");
    } finally {
      if (completed) {
        disableBakedPartialWeightPreview(configurationsToBake);
      }
      Timeline.setTime(originalTime);
      Animator.preview();
      if (wasPlaying) {
        Timeline.start();
      }
      refreshIkPanel();
    }
    if (!completed) {
      return showBakeError(failureMessage);
    }
    let message = localize("two_bone_ik.message.range_baked", [
      configurationsToBake.length, bakePlan.sampleTimes.length,
      bakePlan.sampleTimes.length * bakePlan.sampledTracks.size,
    ]);
    if (unreachableSampleCount) {
      message += " · " + localize("two_bone_ik.message.range_unreachable", [unreachableSampleCount]);
    }
    Blockbench.showQuickMessage(message, 4000);
    return true;
  }

  function solveCurrentBakePoses(configurationsToSolve, configurationsToBake) {
    previewAnimationWithoutIk();
    const solvedPoses = [];
    const configurationIdsToBake = new Set(
      configurationsToBake.map(function (configuration) {
        return configuration.id;
      }),
    );
    let solveFailed = false;

    configurationsToSolve.forEach(function (configuration) {
      const solvedPose = solveConstraint(
        configuration,
        configuration.showHelpers,
      );
      if (!solvedPose) {
        solveFailed = true;
      } else if (configurationIdsToBake.has(configuration.id)) {
        solvedPoses.push({
          configurationId: configuration.id,
          solvedPose: solvedPose,
        });
      }
    });

    if (solveFailed || solvedPoses.length !== configurationsToBake.length) {
      return null;
    }
    return solvedPoses;
  }

  function prepareCurrentPoseBakeEntries(animation, solvedPoses) {
    const bakeEntries = [];
    let hasUnsupportedBone = false;
    let hasGlobalRotation = false;

    solvedPoses.forEach(function (solvedPoseEntry) {
      solvedPoseEntry.solvedPose.boneRotations.forEach(function (boneRotation) {
        const animator = animation.getBoneAnimator(boneRotation.bone);

        if (!animator) {
          hasUnsupportedBone = true;
          return;
        }
        if (animator.rotation_global) {
          hasGlobalRotation = true;
        }
        bakeEntries.push({
          animator: animator,
          configurationId: solvedPoseEntry.configurationId,
          rotation: boneRotation.rotation,
        });
      });
    });

    if (hasUnsupportedBone) {
      throw new Error(localize("two_bone_ik.error.unsupported_bone"));
    }

    if (hasGlobalRotation) {
      throw new Error(localize("two_bone_ik.error.global_rotation"));
    }
    return bakeEntries;
  }

  function writeCurrentPoseKeyframes(bakeEntries, undoLabel) {
    const createdKeyframes = [];
    const preparedAnimators = new Set();
    bakeEntries.forEach(function (bakeEntry) {
      if (!preparedAnimators.has(bakeEntry.animator)) {
        bakeEntry.animator.addToTimeline();
        preparedAnimators.add(bakeEntry.animator);
      }
    });
    Undo.initEdit({ keyframes: createdKeyframes });

    bakeEntries.forEach(function (bakeEntry) {
      const keyframe = bakeEntry.animator.createKeyframe(
        {
          x: bakeEntry.rotation[0],
          y: bakeEntry.rotation[1],
          z: bakeEntry.rotation[2],
          interpolation: "linear",
        },
        Timeline.time,
        "rotation",
        false,
        false,
      );

      if (keyframe) {
        createdKeyframes.push(keyframe);
      }
    });

    if (createdKeyframes.length !== bakeEntries.length) {
      Undo.cancelEdit(true);
      return false;
    }

    Undo.finishEdit(undoLabel, { keyframes: createdKeyframes });
    return true;
  }

  function showCurrentPoseBakeResult(configurationsToBake, solvedPoses, isSingleConfigurationBake) {
    const unreachableTargetCount = solvedPoses.filter(
      function (solvedPoseEntry) {
        return !solvedPoseEntry.solvedPose.reachedTarget;
      },
    ).length;

    let bakeMessage;
    if (isSingleConfigurationBake) {
      bakeMessage = localize(
        unreachableTargetCount === 0
          ? "two_bone_ik.message.baked_one"
          : "two_bone_ik.message.baked_one_unreachable",
        [configurationsToBake[0].name],
      );
    } else {
      bakeMessage =
        unreachableTargetCount === 0
          ? localize("two_bone_ik.message.baked", [configurationsToBake.length])
          : localize("two_bone_ik.message.baked_unreachable", [
              configurationsToBake.length,
              unreachableTargetCount,
            ]);
    }

    Blockbench.showQuickMessage(bakeMessage, 2600);
  }

  function bakeCurrentPose(configurationId) {
    const isSingleConfigurationBake = typeof configurationId === "string";
    const configurationsToBake = getBakeConfigurations(configurationId);
    const configurationsToSolve = isSingleConfigurationBake
      ? getConfigurationDependencyClosure(configurationsToBake, getProjectConfigurations())
      : configurationsToBake;

    if (!configurationsToBake.length) {
      if (!isSingleConfigurationBake) {
        showBakeError(localize("two_bone_ik.error.configure_first"), "two_bone_ik.panel.name");
      }
      return;
    }
    if (!Modes.animate || !Animation.selected) {
      showBakeError(localize("two_bone_ik.error.select_animation"), "two_bone_ik.panel.name");
      return;
    }

    const validationError = getBakeValidationError(configurationsToSolve);
    if (validationError) {
      showBakeError(validationError);
      return;
    }
    const solvedPoses = solveCurrentBakePoses(configurationsToSolve, configurationsToBake);
    if (!solvedPoses) {
      showBakeError(localize("two_bone_ik.error.solve_failed"));
      return;
    }

    let bakeEntries;
    try {
      bakeEntries = prepareCurrentPoseBakeEntries(Animation.selected, solvedPoses);
    } catch (error) {
      showBakeError(error.message);
      return;
    }
    const undoLabel = isSingleConfigurationBake
      ? localize("two_bone_ik.undo.bake_one", [configurationsToBake[0].name])
      : localize("two_bone_ik.undo.bake");
    if (!writeCurrentPoseKeyframes(bakeEntries, undoLabel)) {
      Animator.preview();
      showBakeError(localize("two_bone_ik.error.keyframe_failed"));
      return;
    }

    // A successful transaction wrote every entry; only nonempty constraints are baked.
    const bakedConfigurationIds = new Set(bakeEntries.map(function (bakeEntry) {
      return bakeEntry.configurationId;
    }));
    const bakedConfigurations = configurationsToBake.filter(function (configuration) {
      return bakedConfigurationIds.has(configuration.id);
    });
    if (disableBakedPartialWeightPreview(bakedConfigurations)) {
      refreshIkPanel();
      Animator.preview();
    } else {
      previewAnimationWithoutIk();
    }
    showCurrentPoseBakeResult(configurationsToBake, solvedPoses, isSingleConfigurationBake);
  }

  function clearConstraints() {
    activeConfigurations.splice(0, activeConfigurations.length);
    persistConfigurationsForProject(Project, true);
    clearConstraintHelperDisplays();

    if (Modes.animate && Animation.selected) {
      Animator.preview();
    }

    refreshIkPanel();
    Blockbench.showQuickMessage(localize("two_bone_ik.message.cleared"), 1800);
  }

  // Plugin lifecycle: subscribe and dispose every external resource in one place.
  function addActionToMenu(action) {
    if (MenuBar.menus.animation) {
      MenuBar.menus.animation.addAction(action);
    } else {
      MenuBar.menus.tools.addAction(action);
    }
  }

  function handleAnimationFrame() {
    if (suppressLiveSolver) {
      return;
    }
    if (!Modes.animate || !activeConfigurations.length) {
      hideAllHelperDisplays();
      return;
    }

    let solvedAnyConstraint = false;

    const previewConfigurations = getConfigurationEvaluationOrder(
      getProjectConfigurations().filter(function (configuration) {
        return configuration.livePreview;
      }),
    );
    previewConfigurations.forEach(function (configuration) {
      const solvedPose = solveConstraint(
        configuration,
        configuration.showHelpers,
      );
      solvedAnyConstraint = Boolean(solvedPose) || solvedAnyConstraint;
    });

    if (
      solvedAnyConstraint &&
      typeof Animator.displayMeshDeformation === "function"
    ) {
      Animator.displayMeshDeformation();
    }
  }

  function handleProjectChange() {
    restoreConfigurationsFromProject(Project);
  }

  function handleModeChange() {
    if (!Modes.animate) {
      hideAllHelperDisplays();
      return;
    }
    if (activeConfigurations.length && Animation.selected) {
      Animator.preview();
    }
    refreshIkPanel();
  }

  function handleFinishedEdit() {
    if (
      Modes.animate &&
      activeConfigurations.length &&
      Animation.selected
    ) {
      Animator.preview();
    }
    refreshIkPanel();
  }

  function subscribePluginEvent(eventSource, eventNames, eventHandler) {
    eventNames.forEach(function (eventName) {
      eventSource.on(eventName, eventHandler);
    });
    return function () {
      eventNames.forEach(function (eventName) {
        eventSource.removeListener(eventName, eventHandler);
      });
    };
  }

  function subscribeBlockbenchEvents() {
    pluginEventDisposers.displayAnimationFrame = subscribePluginEvent(
      Blockbench, ["display_animation_frame"], handleAnimationFrame,
    );
    pluginEventDisposers.selectProject = subscribePluginEvent(
      Blockbench, ["select_project"], handleProjectChange,
    );
    pluginEventDisposers.selectMode = subscribePluginEvent(
      Blockbench, ["select_mode", "unselect_mode"], handleModeChange,
    );
    pluginEventDisposers.finishedEdit = subscribePluginEvent(
      Blockbench, ["finished_edit"], handleFinishedEdit,
    );
  }

  function disposePluginEvents() {
    Object.keys(pluginEventDisposers).forEach(function (subscriptionName) {
      const disposeSubscription = pluginEventDisposers[subscriptionName];
      if (disposeSubscription) {
        disposeSubscription();
        pluginEventDisposers[subscriptionName] = null;
      }
    });
  }

  function loadPlugin() {
    registerTranslations();
    registerProjectDataProperty();
    createHelperDisplay();
    createPluginStyles();
    createIkPanel();

    pluginEventDisposers.parsedProject = subscribePluginEvent(
      Codecs.project, ["parsed"], handleProjectChange,
    );
    restoreConfigurationsFromProject(Project);

    setupAction = new Action("two_bone_ik_setup", {
      name: localize("two_bone_ik.action.open"),
      description: localize("two_bone_ik.action.open.description"),
      icon: "precision_manufacturing",
      category: "animation",
      condition: function () {
        return Boolean(Project && Format && Format.animation_mode);
      },
      click: function () {
        openIkPanel();
      },
    });

    addActionToMenu(setupAction);

    subscribeBlockbenchEvents();
  }

  function unloadPlugin() {
    persistConfigurationsForProject(Project, false);

    if (setupAction) {
      setupAction.delete();
    }
    if (ikPanel) {
      ikPanel.delete();
      ikPanel = null;
    }
    if (pluginStyles) {
      pluginStyles.delete();
      pluginStyles = null;
    }

    disposePluginEvents();

    activeConfigurations.splice(0, activeConfigurations.length);
    disposeHelperDisplay();

    if (projectDataProperty) {
      projectDataProperty.delete();
      projectDataProperty = null;
    }

    if (Modes.animate && Animation.selected) {
      Animator.preview();
    }
  }

  Plugin.register(PLUGIN_ID, {
    title: "IK Tools",
    author: "dh",
    description:
      "Two-bone IK, pure FABRIK chain IK, Spline IK, and aim IK with IK/FK blending, project-saved constraints, live preview, and individual or batch pose and frame-range baking.",
    icon: "precision_manufacturing",
    version: "2.6.1",
    min_version: "5.1.0",
    variant: "both",
    tags: ["Animation"],
    onload: loadPlugin,
    onunload: unloadPlugin,
  });
})();
