(function() {

	let action, setting_login;

	async function getToken(login, password) {

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
			settings.light_tracer_login.value = login;
			return result.message.token;
		} else {
			Blockbench.showMessageBox({
				title: 'Failed to Upload Model',
				icon: 'error',
				message: (result && result.message) ? result.message : 'Cannot connect to server',
			})
			console.error(result)
		}
	}

	async function uploadLightTracerModel() {
		if (Cube.all.length === 0) return;

		let login = Settings.get('light_tracer_login');
		
		var dialog = new Dialog({
			id: 'light_tracer_uploader',
			title: 'Upload To Light Tracer',
			width: 540,
			form: {
				login: {label: 'Email', value: login},
				password: {label: 'Password', value: '', type: 'password'},
				info: {label: ' ', nocolon: true, type: 'info', text: 'Don\'t have an account? [Sign up](https://lighttracer.org/accounts/signup/)'},
				name: {label: 'Name', value: Project.name},
				description: {label: 'Description', type: 'textarea'},
				public: {label: 'Public', type: 'checkbox'},
			},
			onConfirm: async function(formResult) {

				if (!formResult.login || !formResult.password) {
					Blockbench.showQuickMessage('Email and password are required')
					return;
				}

				dialog.hide();
				Blockbench.showQuickMessage('Uploading... this may take a few moments...', 3000)

				let token = await getToken(formResult.login, formResult.password);

				if (!token) return;

				var data = new FormData()
				data.append('login', formResult.login);
				data.append('token', token);
				data.append('name', formResult.name);
				data.append('description', formResult.description);
				data.append('public', formResult.public);
	
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

							Blockbench.showMessageBox({
								title: 'Failed to Upload Model',
								icon: 'error',
								message: `Unable to upload model`,
							})
							console.error(response);
						}
					})
				})
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
		},
		onunload() {
			action.delete();
			setting_login.delete();
		}
	})

})()
