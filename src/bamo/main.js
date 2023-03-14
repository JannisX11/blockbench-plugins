import BamoBaseComponent from './components/BamoBaseComponent.vue';
import codec, { loadCodec, unloadCodec } from './util/Codec';
import bamoSettings, {BAMO_SETTINGS_DEFAULT} from './util/Settings';
const css = require('./components/bamo.css').toString();

let btn;
let exportWindow;
let cssData;
let minecraftFolder;

Plugin.register('bamo', {
	title: 'BAMO Exporter',
	author: 'Ryytikki',
	description: 'Create custom Minecraft blocks without having to write a single line of code when paired with the BAMO mod. https://www.curseforge.com/minecraft/mc-mods/bamo-block-and-move-on',
	icon: 'bar_chart',
	tags: ['Minecraft: Java Edition'],
	version: '0.4.3',
	variant: 'desktop',
	
	onload() {

		loadCodec();

		// Setting that holds the resource pack folder location
		minecraftFolder = new Setting('minecraftFolder', {
			name : 'Minecraft Folder Location',
			description: 'Location of the Minecraft folder on your PC',
			category: 'export',
			type: 'text',
			value: ''
		});

		// Export button in menu
		btn = new Action('bamo', {
			name: 'BAMO Exporter',
			description: 'Exports a block for the BAMO mod',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAN6SURBVDhPJZJrTJtVGMd/b99CYUOgLTA6oKV1HWvHitwnGyZzW7INw5RIXBbjjJc598WpM+oXxz6a+JFETVzch8XEaGKcM9lCNIToqGDHTSiXAV2h5VZKW6illPb1fV/Pyck5Oec5z/O/PMKHv5yVtFotO7spIpENQMBYYSQ4HcBgMGAymViPhIlFo5ABnU5HPB5naWkJh8OBBo1ANBPDrCvBnm/GVWlnpmOUwnI9ceFf/n7kwWU8QH15NXvy84ilN9XENpuNdG4GjbPKxmzHEFXHqvhne5bJ2BOyCrIoOFhI5PISznonvpw1BEGg9dkGNt5dxpfwkyzcYfHyHMIZa4nkuPQR499+jiaZQ/2fzYy1PUIryuA0GvZ069l8aRlzn5OpE4O0nj2Ce8CPLkvkiMuEcOfjDmlsch67rZzW6krevvEDV187zvjcMjnZWoaGAghPCaRCcawXr5E99B2NLju37g1Qbd2HaCnK6xqZX6PWXsZMcJ1cXZqSIj0PBqbwr0ZIaTLUHSxDX5yP5/d7WCtMzAbWKTXkceH5GoSRL69Id3qG2N7ZJZNMYLlwk+CPN8nK3cvrZ+rZTWf45tdB9azQUs7Nhy0MjPupshQjZglSl+wdb5xr4PDTZYRHethv2kcoKjswtYgki3ffPUVR4V4WQjE240kCa1EanRWk0xLi1fbmrpXwFsOPg2rwuG8di0lPdCvBqKyDIM+2FgeSBF7fKhkpoyJ5MDBNtlZEtBbnd9UfKqdncEYOhWxZ3d88j1X+TY4KNXg2EGI5vKm+XTz1jCxeKcGlVVxVZrmR5KHwVBR99XStKkx5cQHd751XkfR5JnmrrVFd7okFxmQUD0emKeu8gXfah3D7+ouSYpmSRBElntjhVN0Bvvi+j9O1ZnrFFo4m+siI2QRWo/wx5uPNF5oYlJNMBGMIn3a2SO4JP++cP8rDUR819lI2EylO1Nj46q4bfa4GSdSxlUhSmJerAFbpXGlvVotqFPuUz57JRWS6DAdSBFc26Pf6Oeaykkhr6B2e4/orz6n79k6Kay8fp3dkHrd3AeHW++3S5JNVFdrtTzr5+ud+vAsh6ioN9HmXZS3a1ardP/VzssHOX7L/SpKGQxXqvdjWZO8KhqJ8dukk92UnzKUGtOkkxnMfYAyPEk2mZUeiaqMtrESotpWyv6iA/4vO8x8IAITQHDgPDwAAAABJRU5ErkJggg==',
			click: function () {
				if (Project.name != undefined){
					if (Texture.all.length == 0){
						Blockbench.showMessageBox({buttons: ["Ok"], title: "Error", message: "Please create a texture"});
						return;
					}
					
					// If the bamoSettings for the file havent been generated, generate
					if (typeof bamoSettings[Project.uuid] !== 'object'){
						bamoSettings[Project.uuid] = Object.assign({}, BAMO_SETTINGS_DEFAULT);
        				bamoSettings[Project.uuid].displayName = Project.name
					}
					

					if ((Settings.get('minecraftFolder') != undefined) && (Settings.get('minecraftFolder') != '')){
						exportWindow.show();
						exportWindow.content_vue.updateValues()
					}else{
						Blockbench.showMessageBox({buttons: ["Ok"], title: "Error", message: "You must set your Minecraft folder location under Settings->Export"});
					}
				}else{
					Blockbench.showMessageBox({buttons: ["Ok"], title: "Error", message: "Please ensure your file is saved before exporting. If you see this for a saved file, reload it and try again"});
				}
			}
		});

		MenuBar.addAction(btn, 'tools');

		// Dialog that opens when you click the button1
		// See the BamoComponent object for details
		exportWindow = new Dialog('BAMOExportWindow', {
			id: "BAMO",
			title: 'BAMO Exporter',
			component: BamoBaseComponent,
			buttons: [],
			padding: !1,
			width: 720,
			height: 620,
		});

		cssData = Blockbench.addCSS(css);
	},

	onunload() {
		btn.delete();
		minecraftFolder.delete();
		//cssData.delete();
		unloadCodec();
	}
});
