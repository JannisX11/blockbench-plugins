/*
 * Clean Animation Speed — Cmetanochka Creations
 * Discord: https://discord.gg/Xjp4ApB2qg
 *
 * Свободно для использования с указанием авторства (Cmetanochka Creations).
 * Нельзя перезаливать или продавать как своё. Правки — только для личного пользования.
 *
 * Free to use with attribution (Cmetanochka Creations).
 * Do not reupload or sell as your own. Edits for personal use only.
 *
 * © Cmetanochka Creations. Provided "as is", without warranty.
 */
(function () {
    function L(ru, en) { try { return (typeof Language !== 'undefined' && Language.code === 'ru') ? ru : en; } catch (e) { return en; } }
    let action;

    function clampInt(v, a, b) {
        v = Math.round(v);
        return v < a ? a : (v > b ? b : v);
    }

    function openDialog() {
        if (typeof Animation === 'undefined' || !Animation.selected) {
            Blockbench.showQuickMessage(L('Сначала выбери анимацию','Select an animation first'), 1600);
            return;
        }
        const animation = Animation.selected;

        Undo.initEdit({ animations: [animation] });

        // собрать все кадры и запомнить исходные времена
        const keyframes = [];
        for (const id in animation.animators) {
            const an = animation.animators[id];
            if (an && an.keyframes) keyframes.push(...an.keyframes);
        }
        const initial_times = {};
        const initial_bezier = {};
        keyframes.forEach(kf => {
            initial_times[kf.uuid] = kf.time;
            if (kf.bezier_left_time && kf.bezier_right_time) {
                initial_bezier[kf.uuid] = {
                    left: kf.bezier_left_time.slice(),
                    right: kf.bezier_right_time.slice()
                };
            }
        });
        const initial_length = animation.length;
        // привязка по умолчанию — целая (если была испорчена дробной, округляем)
        const initial_snapping = clampInt(animation.snapping || 24, 1, 120);

        function apply(speed, snapping) {
            const fps = clampInt(snapping, 1, 120);
            speed = Math.clamp(speed, 0.1, 10);
            animation.snapping = fps;

            keyframes.forEach(kf => {
                const t = initial_times[kf.uuid] / speed;
                kf.time = Math.max(0, Math.round(t * fps) / fps); // строго на целый кадр
                if (kf.interpolation === 'bezier' && initial_bezier[kf.uuid]) {
                    const ob = initial_bezier[kf.uuid];
                    kf.bezier_left_time.V3_set(ob.left).V3_divide(speed);
                    kf.bezier_right_time.V3_set(ob.right).V3_divide(speed);
                }
            });

            const newLen = Math.round((initial_length / speed) * fps) / fps;
            animation.setLength(newLen);
            try { Animator.preview(); } catch (e) {}
            try { Timeline.updateSize(); } catch (e) {}
        }

        const dialog = new Dialog({
            id: 'clean_animation_speed',
            title: L('Скорость анимации (без дробных)','Animation speed (no fractions)'),
            darken: false, // не затемнять — видно таймлайн
            form: {
                speed: {
                    label: L('Скорость','Speed'), type: 'range',
                    value: 1, min: 0.1, max: 4, step: 0.01,
                    editable_range_label: true, full_width: true
                },
                snapping: {
                    label: L('Привязка (кадр/сек)','Snapping (frames/sec)'), type: 'number',
                    value: initial_snapping, min: 1, max: 120, step: 1
                },
                info: {
                    type: 'info',
                    text: L('Привязка всегда целая — кадры садятся строго на целые позиции. Чтобы починить уже испорченную анимацию, поставь скорость 1 и целую привязку (напр. 24) и подтверди.', 'Snapping is always an integer — keyframes land exactly on whole positions. To fix an already broken animation, set speed to 1 and an integer snapping (e.g. 24), then confirm.')
                }
            },
            onFormChange(result) {
                apply(result.speed, result.snapping);
            },
            onConfirm(result) {
                // финальный проход по актуальным значениям формы
                apply(result.speed, result.snapping);
                Undo.finishEdit('Change animation speed (clean)');
                Blockbench.showQuickMessage(L('Скорость применена, кадры на целых позициях','Speed applied, keyframes on whole positions'), 1800);
            },
            onCancel() {
                Undo.cancelEdit();
                try { Animator.preview(); } catch (e) {}
                try { Timeline.updateSize(); } catch (e) {}
            }
        });
        dialog.show();
    }

    Plugin.register('clean_animation_speed', {
        title: 'Clean Animation Speed',
        author: 'Cmetanochkaa (Cmetanochka Creations)', website: 'https://discord.gg/Xjp4ApB2qg',
        icon: 'speed',
        description: L('Меняет скорость анимации, но привязка остаётся целой и кадры садятся строго на целые позиции — никаких дробных чисел на таймлайне. Умеет починить уже испорченную (дробную) привязку.', 'Changes animation speed while snapping stays integer and keyframes land exactly on whole positions — no fractional numbers on the timeline. Can also fix an already broken (fractional) snapping.'),
        version: '1.0.0',
        variant: 'both',
        min_version: '4.8.0',
        tags: ['Animation', 'Timeline'],

        onload() {
            action = new Action('clean_animation_speed', {
                name: L('Скорость (без дробных)','Speed (no fractions)'),
                description: L('Изменить скорость анимации, сохранив целые позиции кадров','Change animation speed while keeping whole keyframe positions'),
                icon: 'speed',
                category: 'animation',
                condition: { modes: ['animate'], method: () => !!(typeof Animation !== 'undefined' && Animation.selected) },
                click: openDialog
            });

            try { MenuBar.addAction(action, 'animation'); } catch (e) {}

            const targets = ['timeline', 'main_tools', 'tools'];
            for (const id of targets) {
                try {
                    if (Toolbars[id] && !Toolbars[id].children.includes(action)) {
                        Toolbars[id].add(action, -1);
                        break;
                    }
                } catch (e) { /* следующий */ }
            }
        },

        onunload() {
            if (action) action.delete();
        }
    });
})();
