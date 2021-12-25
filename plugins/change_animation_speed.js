(function() {
    Plugin.register('change_animation_speed', {
        title: 'Animation Speed Changer',
        author: 'Ancientkingg',
        description: 'Allows you to change the speed of animations',
        icon: 'fa-tachometer-alt',
        version: '0.0.1',
        variant: 'both',
        onload() {
            button = new Action('change_speed_button', {
                name: 'Change Animation Speed',
                description: 'Change the speed of an animation',
                icon: 'fa-tachometer-alt',
                click: function() {
                    change_speed();
                }
            });
            MenuBar.addAction(button, 'animation');
        },
        onunload() {
            button.delete();
        }
    });
    function change_speed(){
        let all_animations = Animation.all.map(n => n.name);
        all_animations.unshift('Current Selected Keyframes')
        all_animations = all_animations.reduce((a, v, index) => ({ ...a, [index]: v}), {}) 
        new Dialog({
            id: 'change_speed',
            title: 'Change Animation Speed',
            lines: [`
            <script>
                function changeSpeedSync(label) {
                    if (label) {
                        var size = $('#ak_change_speed_label').val()
                        $('#ak_change_speed_range').val(size)
                    } else {
                        var size = $('#ak_change_speed_range').val()
                        $('#ak_change_speed_label').val(size)
                    }
                }
            </script>
            <label class="tl">Animation Speed Modifier (%)</label>
			<div class="dialog_bar" style="height: 32px;">
				<input type="range" id="ak_change_speed_range" style="width:calc(100% - 60px);float:left;height:31px;padding-top:3px;" value="50" min="1" max="400" step="1" oninput="changeSpeedSync()">
				<input type="number" class="f_left dark_bordered" id="ak_change_speed_label" style="width:60px;padding-top:3px;text-align:center;float:left;" value="50" min="1" max="400" step="1" oninput="changeSpeedSync(true)">
			</div>
            `],
            form: {
                selection: {label: 'Selection', type: 'select', options: all_animations},
            },
            onConfirm: function(formData) {
                Undo.initEdit({animations:[Animation.all[formData.selection-1]]});
                const speed = $('#ak_change_speed_label').val();
                if (formData.selection == 0) {
                    let selectedKeyframes = 0;
                    for (const animator in Animation.selected.animators) {

                        if (Animation.selected.animators.hasOwnProperty(animator)) {

                            try{
                                for (i in Animation.selected.animators[animator].position) {
                                    if (Animation.selected.animators[animator].position[i].selected){
                                        Animation.selected.animators[animator].position[i].time /= speed / 100;
                                        selectedKeyframes++;
                                    }
                                }
                                for (i in Animation.selected.animators[animator].rotation) {
                                    if (Animation.selected.animators[animator].rotation[i].selected){
                                        Animation.selected.animators[animator].rotation[i].time /= speed / 100;
                                        selectedKeyframes++;
                                    }
                                }
                                for (i in Animation.selected.animators[animator].rotation) {
                                    if (Animation.selected.animators[animator].scale[i].selected){
                                        Animation.selected.animators[animator].scale[i].time /= speed / 100;
                                        selectedKeyframes++;
                                    }
                                }
                            }catch(e){}
                        }
                    }
                    if (selectedKeyframes == 0) {
                        Blockbench.showQuickMessage('No keyframes selected');
                    }
                } else {
                    for (const animator in Animation.all[formData.selection-1].animators) {

                        if (Animation.all[formData.selection-1].animators.hasOwnProperty(animator)) {
                            try {
                                for (i in Animation.all[formData.selection-1].animators[animator].position) {
                                    Animation.all[formData.selection-1].animators[animator].position[i].time /= speed / 100;
                                }
                                for (i in Animation.all[formData.selection-1].animators[animator].rotation) {
                                    Animation.all[formData.selection-1].animators[animator].rotation[i].time /= speed / 100;
                                }
                                for (i in Animation.all[formData.selection-1].animators[animator].rotation) {
                                    Animation.all[formData.selection-1].animators[animator].scale[i].time /= speed / 100;
                                }
                            } catch (error) {}
                        }
                    }
                }
                Undo.finishEdit('Change Animation Speed');
            }
        }).show()
    }
})();


