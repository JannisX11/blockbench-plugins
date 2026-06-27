import {importTabula, importTabulaV2} from "tabula.js"

Plugin.register('mod_utils', {
	title: 'Mod Utils',
	author: 'JTK222 (Maintainer), Wither (For the original Techne importer), Ocraftyone (VoxelShape improvements)',
	icon: 'fa-cubes',
	description: 'Allows importing Tabula files, and exporting VoxelShapes',
    tags: ["Minecraft: Java Edition"],
	version: '1.7.1',
	variant: 'desktop',

	onload() {
		if(isValidVersion){

			// helpMenu = new BarMenu('help', []);
			// helpMenu.label.textContent = 'Help';
			// MenuBar.update();
			
			//MenuBar.addAction(exportVoxelShapeAction, 'file.export');
			MenuBar.addAction(importTabulaV2, 'file.import');
			MenuBar.addAction(importTabula, 'file.import');
			//MenuBar.addAction(importTechne, 'file.import');
			//MenuBar.addAction(modUtilsHelp, 'help');
		}
	},
	onunload() {
		if(isValidVersion){
			//exportVoxelShapeAction.delete();
			importTabula.delete();
			importTabula2.delete();
			//importTechne.delete();
			//modUtilsHelp.delete();

			// helpMenu.hide();
		}
	},
	oninstall(){},
	onuninstall() {}
});