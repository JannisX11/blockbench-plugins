(function() {
    let action_posekey;

    function getAllDescendants(groups) {
        let all_groups = [];
        function recurse(arr) {
            arr.forEach(item => {
                if (item.type === 'group') {
                    if (!all_groups.includes(item)) all_groups.push(item);
                    if (item.children && item.children.length > 0) recurse(item.children);
                }
            });
        }
        recurse(groups);
        return all_groups;
    }

    BBPlugin.register('posekey', {
        title: 'PoseKey',
        author: 'FroXaL',
        icon: 'key',
        description: 'Adds a single keyframe (position, rotation, scale) at the current timeline position for all selected groups and their descendants. Useful for quickly setting key poses without affecting other keyframes.',
        version: '3.0.0',
        variant: 'both',

        onload() {
            action_posekey = new Action('pose_key_action_id', {
                name: 'PoseKey', 
                description: 'Unique P+R+S keyframe at cursor',
                icon: 'key',
                category: 'animation',
                condition: () => Animator.open, 

                click: function() {
                    let anim = Animator.animation;
                    if (!anim && Animation.selected) anim = Animation.selected;

                    if (!anim) {
                        Blockbench.showQuickMessage("⚠️ No active animation!");
                        return;
                    }

                    let selection_base = [];
                    if (Group.selected.length > 0) selection_base.push(...Group.selected);
                    
                    if (Cube.selected.length > 0) {
                        Cube.selected.forEach(cube => {
                            if (cube.parent && cube.parent.type === 'group') {
                                if (!selection_base.includes(cube.parent)) selection_base.push(cube.parent);
                            }
                        });
                    }

                    if (selection_base.length === 0) {
                        Blockbench.showQuickMessage("⚠️ Select an object!");
                        return;
                    }

                    let final_targets = getAllDescendants(selection_base);

                    Undo.initEdit({animations: [anim]});

                    let currentTime = Timeline.time;

                    final_targets.forEach(group => {
                        let uuid = group.uuid;
                        
                        let bone_animator = anim.animators[uuid];
                        if (!bone_animator) {
                            bone_animator = new GeneralAnimator(uuid, anim);
                            bone_animator.init();
                            anim.animators[uuid] = bone_animator;
                        }

                        ['position', 'rotation', 'scale'].forEach(channel => {
                            
                            let channel_array = bone_animator[channel];
                            let was_empty = channel_array.length === 0;

                            bone_animator.getOrMakeKeyframe(channel, currentTime);

                            if (was_empty && currentTime > 0 && channel_array.length > 1) {
                                let key_at_zero = channel_array.find(k => k.time === 0);
                                if (key_at_zero) {
                                    key_at_zero.remove();
                                }
                            }
                        });
                    });

                    Undo.finishEdit('PoseKey', {animations: [anim]});
                    if (Animator.open) Animator.preview();
                    
                    Blockbench.showQuickMessage(`🔑 Unique keyframe set on ${final_targets.length} groups!`);
                }
            });
        },

        onunload() {
            if (action_posekey) action_posekey.delete();
        }
    });
})();
