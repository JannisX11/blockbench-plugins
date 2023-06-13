/// <reference path="../types/index.d.ts" />

(function() {

var performance_audit_action;

Plugin.register('performance_audit', {
	title: 'Performance Audit',
	icon: 'network_check',
	author: 'JannisX11',
	description: 'Find performance issues and bottlenecks in your Blockbench installation.',
	about: 'You can run a performance audit via Help > Audit Performance.',
	version: '1.0.0',
	min_version: '3.0.0',
	variant: 'both',
	onload() {

		function measurePerformance(method, count = 5) {
			let start = Date.now();
			for (let i = 0; i < count; i++) {
				method();
			}
			let time = (Date.now() - start) / count;
			return time
		}
		async function measurePerformanceAsync(method, count = 5, delay = 20) {
			let start = Date.now();
			for (let i = 0; i < count; i++) {
				method();
				await new Promise(r => setTimeout(r, delay));
			}
			let time = (Date.now() - start) / count;
			return time - delay;
		}

		performance_audit_action = new Action({
			id: 'performance_audit',
			name: 'Audit Performance',
			icon: 'network_check',
			category: 'help',
			click: async () => {
				let toast = Blockbench.showToastNotification({
					text: 'Auditing performance...',
					icon: 'network_check',
				})

				let fps_sum = Prop.fps;
				await new Promise(r => setTimeout(r, 1008));
				fps_sum += Prop.fps;
				await new Promise(r => setTimeout(r, 1008));
				fps_sum += Prop.fps;
				let avg_fps = fps_sum / 3;
				
				let render_time = measurePerformance(() => {
					Preview.all.forEach(function(prev) {
						if (prev.canvas.isConnected) {
							prev.render()
						}
					})
				})
				let animate_time = measurePerformance(() => {
					if (Animator.open) {
						if (Timeline.playing) {
							Timeline.loop();
						} else if (AnimationController.selected) {
							AnimationController.selected.updatePreview();
						}
					}
					if (quad_previews.current) {
						WinterskyScene.updateFacingRotation(quad_previews.current.camera);
					}
				})
				let dispatch_time = measurePerformance(() => {
					Blockbench.dispatchEvent('render_frame');
				})
				let animate_time_sum = render_time + animate_time + dispatch_time;

				let selection_update_time = measurePerformance(updateSelection);

				let selection_time = measurePerformance(() => {
					BarItems.invert_selection.click();
				}, 4);

				let uv_editor_time = await measurePerformanceAsync(() => {
					Panels.uv.fold();
					Panels.uv.fold();
				}, 2, 20);
				let outliner_time = await measurePerformanceAsync(() => {
					Panels.outliner.fold();
					Panels.outliner.fold();
				}, 2, 20);


				let conclusion = 'Your performance is good!';
				let tips = [];
				if (avg_fps < 40) {
					if (animate_time_sum > 23) {
						conclusion = 'Your performance is limited by CPU power...';
						tips = [
							'Try and reduce the number of elements in your project, or hide elements you don\'t use'
						]
					} else {
						conclusion = 'Your performance is limited by graphics rendering power...';
						tips = [
							'Close or minimize other performance-intensive applications, such as games or 3D or 2D editor',
							'Check if there are any updates for your graphics drivers',
						]
					}
				}
				if (avg_fps > 59) {
					conclusion = 'Your performance is great!';
				}

				let faces_total = 0;
				let faces_selected = 0;
				for (let el of Outliner.elements) {
					if (el.faces) {
						let amount = 0;
						if (el instanceof Cube) {
							amount = Object.keys(el.faces).filter(fkey => el.faces[fkey].texture !== null).length;
						} else {
							amount = Object.keys(el.faces).length;
						}
						if (el.selected) faces_selected += amount;
						faces_total += amount;
					}
				}

				new Dialog('performance_audit', {
					title: 'Performance Audit Results',
					buttons: ['Close', 'Re-Run'],
					cancelIndex: 0,
					form: {
						conclusion: {type: 'info', text: '#### ' + conclusion},
						tips:		{type: 'info', text: '* ' + tips.join('\n* '), condition: tips.length > 0},
						'_1': '_',

						fps: 			{type: 'info', text: Math.roundTo(avg_fps, 2).toString(), label: 'Average FPS'},
						cpu_load:		{type: 'info', text: Math.roundTo(animate_time_sum * 100 / (1000 / avg_fps), 1) + '%', label: 'CPU Load'},
						'_2': '_',

						frame_time: 	{type: 'info', text: Math.roundTo(animate_time_sum, 2).toString(), label: 'Frame Time'},
						render_time:	{type: 'info', text: Math.roundTo(render_time, 2).toString(), label: 'Render Time'},
						animate_time:	{type: 'info', text: Math.roundTo(animate_time, 2).toString(), label: 'Animate Time'},
						dispatch_time:	{type: 'info', text: Math.roundTo(dispatch_time, 2).toString(), label: 'Render Event Hook'},
						'_3': '_',
						
						selection_update:{type: 'info', text: Math.roundTo(selection_update_time, 2).toString(), label: 'Selection Update Time'},
						selection:		{type: 'info', text: Math.roundTo(selection_time, 2).toString(), label: 'Selection Change Time'},
						uv_editor_time: {type: 'info', text: Math.roundTo(uv_editor_time, 2).toString(), label: 'UV Editor Impact'},
						outliner_time:	{type: 'info', text: Math.roundTo(outliner_time, 2).toString(), label: 'Outliner Impact'},
						'_4': '_',

						elements:		{type: 'info', text: `${Outliner.selected.length} / ${Outliner.elements.length}`, label: 'Elements'},
						faces:			{type: 'info', text: `${faces_selected} / ${faces_total}`, label: 'Faces'},
					},
					onButton(button) {
						if (button == 1) {
							performance_audit_action.click();
						}
					}
				}).show();

				toast.delete();
			}
		})
		MenuBar.menus.help.addAction(performance_audit_action);
	},
	onunload() {
		performance_audit_action.delete()
	}
});

})()
