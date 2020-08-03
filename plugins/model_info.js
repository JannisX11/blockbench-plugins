var plugin_data = {
	id: 'model_info',
	title: 'Model Infomation',  
	icon: 'border_outer',
	author: 'Ryangar46',
	description: 'Finds out information about your model. more features will be added soon',
	version: '1.0.0',
	variant: 'desktop'
};

Plugin.register('model_info', {
	onload() {
		model_info = new Action({
			id: 'model_info',
			name: 'Model Infomation',
			icon: 'border_outer',
			category: 'filter',
			click: function(ev) {
				try {

					// where the user selects the options for the plugin
					var options_dialog = new Dialog({
						title:'Model Infomation', 
						id:'model_info_options', 
						lines:[
						'<p>Restrict to select: <input type="checkbox" id="restrict"></p>'
						],
						
						"onConfirm": function(data) {
							// hides the menu
							options_dialog.hide();
							
							var restrictToSelected = $("#restrict")[0].checked;
							var elements = Blockbench.elements;
							if (restrictToSelected) {
								elements = selected;
							}
						
							var cubes = elements.length; // how many cubes are in the model
							var vertices = elements.length * 4; // how many vertices are in the model
							var faces = elements.length * 6; // how many faces are in the model
							var tris = elements.length * 12; // how many tris are in the model
							
							// where the info is displayed
							var info_dialog = new Dialog({
								title:'Model Infomation', 
								id:'model_info', 
								lines:[
								'<p>Cubes </p>' + cubes,
								'<p>Vertices </p>' + vertices,
								'<p>Faces: </p>' + faces,
								'<p>Tris: </p>' + tris
								],
								
								"onConfirm": function(data) {
								// hides the menu
								info_dialog.hide();
								
								},
								
								"onCancel": function(data) {
									
									// hides the menu
									info_dialog.hide();
									
									// shows the menu
									options_dialog.show();
								}
							});
							// shows the menu
							info_dialog.show();
							
						}
					});
					
					// shows the menu
						options_dialog.show();
					
				} catch(err) {
					
					// where the user selects the options for the plugin
					var error_dialog = new Dialog({
						title:'Opps, an error occured', 
						id:'error_dialog', 
						lines:[
						'<p>Opps, an error occured, please tell the creator of this plugin at classic3d.mc@gmail.com</p>'
						],
						
						"onConfirm": function(data) {
						// hides the menu
						error_dialog.hide();
						
						}
					});
					
					// shows the menu
					error_dialog.show();
					
				}
			}
		});
		
		MenuBar.addAction(model_info, 'filter');
	},
	
	onunload() {
		model_info.delete();
	}
});