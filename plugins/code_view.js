var codeViewVue;

(function() {

var openCodeViewAction;
var codeViewDialog;
    
Plugin.register('code_view', {
	title: 'Code View',
	icon: 'developer_mode',
	author: 'Wither',
	description: 'View the model you are currently editing in the raw format',
	version: '1.0.0',
	variant: 'both',
	onload() {
        codeViewDialog = new Dialog({
			title: 'Code View',
			id: 'code_view',
			resizable: true,
			width: 650,
            lines: [
                '<vue-prism-editor id="code-view-output" v-model="text" language="json" style="height: 25em;" :line-numbers="true" />',
                '<button onclick="navigator.clipboard.writeText(codeViewVue.text);" style="width: 100%;">Copy</button>'
            ]
        });

        openCodeViewAction = new Action('open_code_view', {
			name: 'Open Code View',
			description: '',
			icon: 'developer_mode',
			click() {
				codeViewDialog.show();
				codeViewVue = new Vue({
					components: {VuePrismEditor},
					el: 'dialog#code_view > vue-prism-editor',
					data: {
						text: Format.codec.compile()
					}
				})
			}
		})

		MenuBar.addAction(openCodeViewAction, 'filter')

	},
	onunload() {
		openCodeViewAction.delete();
	}
});

})()