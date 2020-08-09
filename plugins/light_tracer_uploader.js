(function() {

	let action, setting_login, setting_token;

	async function getToken() {

		if (Settings.get('light_tracer_token')) {
			return Settings.get('light_tracer_token');
		}

		let dialog_promise = new Promise((resolve, reject) => {
			var dialog = new Dialog({
				id: 'light_tracer_login',
				title: 'Light Tracer Login',
				width: 500,
				form: {
					login: {label: 'Email', value: Settings.get('light_tracer_login')},
					password: {label: 'Password', value: '', type: 'password'},
					info: {type: 'info', text: 'Don\'t have an account? [Sign up](https://lighttracer.org/accounts/signup/)'}
				},
				onConfirm(formResult) {
					dialog.hide();
					resolve(formResult);
				},
				onCancel() {
					dialog.hide();
					reject()
				}
			})
			dialog.show()
		})
		let {login, password} = await dialog_promise;

		var data = new FormData()
		data.append('login', login)
		data.append('password', password)

		let result = await $.ajax({
			url: 'https://lighttracer.org/app/generate/',
			data: data,
			cache: false,
			contentType: false,
			processData: false,
			type: 'POST'
		})

		if (result && result.message && result.message.token) {
			settings.light_tracer_token.value = result.message.token;
			settings.light_tracer_login.value = login;
			return result.message.token;
		} else {
			console.error('Failed to generate token', result)
		}
	}

	async function uploadLightTracerModel() {
		if (Cube.all.length === 0) return;

		let token = await getToken();
		let login = Settings.get('light_tracer_login');
		
		var dialog = new Dialog({
			id: 'light_tracer_uploader',
			title: 'Upload To Light Tracer',
			width: 540,
			form: {
				login: {label: 'Email', value: login},
				token: {label: 'Token', value: token, type: 'password'},
				name: {label: 'Name', value: Project.name},
				author: {label: 'Author'},
				description: {label: 'Description', type: 'textarea'},
				public: {label: 'Public', type: 'checkbox'},
			},
			onConfirm: function(formResult) {

				var data = new FormData()
				data.append('login', formResult.login);
				data.append('token', formResult.token);
				data.append('name', formResult.name);
				data.append('author', formResult.author);
				data.append('description', formResult.description);
				data.append('public', formResult.public);

				if (formResult.token) settings.light_tracer_token.value = formResult.token;
	
				Codecs.gltf.compile({animations: false}, (content) => {
	
					var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
					var file = new File([blob], 'model.gltf');
					data.append('file', file);

					$.ajax({
						url: 'https://lighttracer.org/app/model/',
						data: data,
						cache: false,
						contentType: false,
						processData: false,
						type: 'POST',
						success: function(response) {

							let link = `https://lighttracer.org/dash/model/${response.id}`;
							Blockbench.showMessageBox({
								title: 'Model uploaded to Light Tracer',
								message: `[${formResult.name}](${link})`,
							})
						},
						error: function(response) {

							Blockbench.showQuickMessage('Failed to Upload Model', 1500);
							console.error(response);
						}
					})
				})
				dialog.hide();
			}
		})
		dialog.show();
	}

	Plugin.register('light_tracer_uploader', {
		title: 'Light Tracer Uploader',
		icon: 'fas.fa-feather',
		author: 'JannisX11',
		description: 'Upload models to Light Tracer to share them or to create renders',
		version: '0.0.1',
		variant: 'both',
		onload() {

			action = new Action({
				id: 'upload_light_tracer',
				name: 'Upload to Light Tracer',
				icon: 'fas.fa-feather',
				category: 'file',
				click: () => {
					uploadLightTracerModel();
				}
			});
			MenuBar.addAction(action, 'file.export');
			
			setting_login = new Setting('light_tracer_login', {
				name: 'Light Tracer Email',
				description: 'Light Tracer login email address',
				category: 'export',
				value: '',
				type: 'text'
			});
			setting_token = new Setting('light_tracer_token', {
				name: 'Light Tracer Token',
				description: 'Light Tracer API access token',
				category: 'export',
				value: '',
				type: 'password'
			});
		},
		onunload() {
			action.delete();
			setting_login.delete();
			setting_token.delete();
		}
	})

})()
