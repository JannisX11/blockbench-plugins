var codeViewVue;

(function() {

var openCodeViewAction;
var codeViewDialog;
    
Plugin.register('code_view', {
	title: 'Code View',
	icon: 'developer_mode',
	author: 'Wither',
	description: 'View the model you are currently editing in the raw format',
	version: '1.0.1',
	variant: 'both',
	onload() {
        codeViewDialog = new Dialog({
			title: 'Code View',
			id: 'code_view',
			resizable: true,
			width: 650,
			component: {
				components: {VuePrismEditor},
				data: {
					text: ''
				},
				methods: {
					copyText() {
						navigator.clipboard.writeText(this.text);
					}
				},
				template: `
					<div>
						<vue-prism-editor id="code-view-output" v-model="text" language="json" style="height: 25em;" :line-numbers="true" />
						<button @click="copyText()" style="width: 100%;">Copy</button>
					</div>
				`
			}
        });

        openCodeViewAction = new Action('open_code_view', {
			name: 'Open Code View',
			description: '',
			icon: 'developer_mode',
			click() {
				codeViewDialog.show();
				codeViewDialog.content_vue.text = Format ? Format.codec.compile() : '';
			}
		})

		MenuBar.addAction(openCodeViewAction, 'filter')

	},
	onunload() {
		openCodeViewAction.delete();
	}
});

})()