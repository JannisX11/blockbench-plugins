(function() {

let deletables = [];
let resize_line;
let sidebar_button;

const FAV_KEY = 'explorer.favorites';

BBPlugin.register('explorer', {
	title: 'Explorer',
	icon: 'fas.fa-folder-open',
	author: 'JannisX11',
	description: 'Navigate the files in your project from the sidebar in Blockbench!',
	version: '1.1.0',
	min_version: '5.1.0',
	variant: 'desktop',
	has_changelog: true,
	onload() {

		StateMemory.init(FAV_KEY, 'array');

		function getFileIcon(dirent) {
			let ext = dirent.name.split('.').last().toLowerCase();
			let icon_name = 'insert_drive_file';
			let color;
			switch (ext) {
				case 'bbmodel': icon_name = 'icon-blockbench_inverted'; color = '#a3cad9'; break;
				case 'json': icon_name = 'icon-format_block'; color = '#62a5df'; break;
				case 'jem': icon_name = 'icon-optifine_file'; color = '#df628a'; break;
				case 'jpm': icon_name = 'icon-optifine_file'; color = '#df628a'; break;
				case 'java': icon_name = 'icon-format_java'; color = '#dfd022'; break;
				case 'blockymodel': icon_name = 'icon-format_hytale'; color = '#aea0ffff'; break;
				case 'blockyanim': icon_name = 'movie'; color = '#97eaf5ff'; break;
				case 'png': icon_name = 'image'; color = '#42ab8d'; break;
			}
			if (dirent.isDirectory()) {
				icon_name = 'folder';
				color = '#c3a670';
			}
			if (dirent.name.endsWith('.geo.json')) {
				icon_name = 'icon-format_bedrock';
				color = '#e3815b';
			}
			if (icon_name == 'insert_drive_file' && Codec.getAllExtensions().includes(ext)) {
				icon_name = 'description';
			}

			return Blockbench.getIconNode(icon_name, color);
		}

		function getDragHandler(file) {
			let lower_case_name = file.name.toLowerCase();
			for (let key in Filesystem.drag_handlers) {
				if (key == 'model') continue;
				let handler = Filesystem.drag_handlers[key];
				if (!Condition(handler.condition)) continue;
				let extensions = typeof handler.extensions == 'function' ? handler.extensions() : handler.extensions;
				if (extensions && !extensions.some(ext => lower_case_name.endsWith(ext))) continue;
				if (handler.element) continue;
				return handler;
			}
		}

		let css = Blockbench.addCSS(`
			.sidebar_explorer_open_button {
				height: 100%;
				padding-top: 2px;
			}
			#sidebar_explorer {
				display: flex;
				flex-direction: column;
				width: 350px;
				bottom: 0;
				top: 25px;
				left: 0;
				background-color: var(--color-ui);
				box-shadow: 10px 4px 44px rgb(0 0 0 / 42%), 500px 0px 500px 2000px rgb(0 0 0 / 15%);
				transition: left 120ms ease-out, box-shadow 120ms linear;
				width: var(--width);
				border-radius: 7px;
			}
			#sidebar_explorer:not(.visible) {
				box-shadow: none;
				left: calc(var(--width) * -1);
			}
			#sidebar_explorer .bar {
				padding: 0px 4px;
				margin-top: 9px;
			}
			#sidebar_explorer ul.list {
				overflow-y: auto;
				margin-top: 8px;
				padding: 5px;
			}
			li.sidebar_explorer_file {
				display: flex;
				height: 30px;
				padding: 1px 10px;
				gap: 5px;
				align-items: center;
				cursor: pointer;
				border-radius: 5px;
			}
			li.sidebar_explorer_file.unsupported {
				color: var(--color-subtle_text);
			}
			li.sidebar_explorer_file:hover {
				background-color: var(--color-ui);
				color: var(--color-light);
			}
			li.sidebar_explorer_file.selected {
				background-color: var(--color-selected);
			}
			li.sidebar_explorer_file span {
				flex-grow: 1;
				overflow: hidden;
				white-space: nowrap;
				cursor: inherit;
				direction: initial;
			}
			li.sidebar_explorer_file i {
				height: 24px;
			}
			.sidebar_explorer_is_open_icon {
				color: var(--color-subtle_text);
				font-size: 13px;
				padding: 5px;
				width: 20px;
			}

			#sidebar_explorer .sidebar_explorer_location {
				overflow: hidden;
				justify-content: right;
				font-size: 0.95em;
				overflow-x: scroll;
				direction: rtl;
				height: 32px;
				flex-shrink: 0;
				padding-left: 6px;
				padding-right: 6px;
			}
			.sidebar_explorer_location::-webkit-scrollbar {
				height: 7px;
			}
			.sidebar_explorer_location > span {
				padding: 3px 0;
				cursor: pointer;
				white-space: nowrap;
			}
			.sidebar_explorer_location > span:first-child {
				margin-right: auto;
			}
			.sidebar_explorer_location > span:hover {
				color: var(--color-light);
				background-color: var(--color-ui);
			}
			.sidebar_explorer_location > span::after {
				content: "\\f105";
				font-family: 'Font Awesome 6 Free';
				font-weight: 900;
				color: var(--color-subtle_text);
				margin: 0 7px;
				vertical-align: baseline;
			}
			.sidebar_explorer_location > span:first-child::after {
				display: none;
			}
		`);
		deletables.push(css);

		const setting_search_deep = new Setting('explorer_search_deep', {
			name: 'Explorer: Search Deep',
			description: 'Include all sub folders of the current directory when using the search bar',
			type: 'toggle',
			value: true,
			category: 'application',
			plugin: 'explorer'
		});
		deletables.push(setting_search_deep);
		
		let temp_tab = null;
		let open_timeout = '';
		let explorer = new ShapelessDialog('sidebar_explorer', {
			darken: false,
			keyboard_actions: {
				enter: {
					keybind: new Keybind({key: 13}),
					run(event) {
						let vue = this.content_vue;
						let path = vue.selected[0];
						let file = path && vue.files.find(file => file.path == path);
						if (file) {
							vue.dblClickFile(file);
						}
						event.preventDefault();
					}
				},
			},
			component: {
				data() {return {
					path: '',
					directory: [],
					directory_recursive: null,
					selected: [],
					history: [],
					search_term: '',
					width: 350,
					max_files: 500,
					scan_error: false,
					loading: true,
					recursive_cached: false,

					file_menu: new Menu([
						{
							id: 'open',
							name: 'Open',
							icon: 'open_in_browser',
							click: (file, a) => {
								this.clickFile(file);
								this.dblClickFile(file);
							}
						},
						{
							id: 'load_as',
							name: 'Load As...',
							icon: 'add_photo_alternate',
							condition: (file) => {
								let name = file.name.toLowerCase();
								if (!name || !Texture.getAllExtensions) return false;
								return Texture.getAllExtensions().some(ext => name.endsWith('.'+ext));
							},
							click(file) {
								loadImages([{path: file.path, name: file.name}])
							}
						},
						{
							id: 'drop_in',
							name: 'Drop In',
							icon: 'system_update_alt',
							condition: file => file.type == 'file' && getDragHandler(file),
							click(file) {
								let handler = getDragHandler(file);
								Filesystem.readFile([file.path], {extensions: handler.extensions, readtype: handler.readtype}, files => {
									handler.cb(files);
								});
							}
						},
						'_',
						{
							id: 'open_externally',
							name: 'Open in Default Program',
							icon: 'open_in_new',
							condition: (file) => file.type == 'file',
							click(file) {
								requireNativeModule('shell').openPath(file.path);
							}
						},
						{
							id: 'open_folder',
							name: 'menu.texture.folder',
							icon: 'folder',
							click(file) {
								requireNativeModule('shell').showItemInFolder(file.path);
							}
						},
						{
							id: 'go_to_location',
							name: 'Open File Location',
							icon: 'snippet_folder',
							condition: (file) => this.recursive,
							click: (file) => {
								this.goTo(PathModule.dirname(file.path));
							}
						},
						{
							id: 'delete',
							name: 'generic.delete',
							icon: 'delete',
							condition: (file) => file.type == 'file',
							click: (file) => {
								let result = confirm(`Are you sure you want to move '${file.name}' to trash?`);
								if (result) {
									requireNativeModule('shell').trashItem(file.path);
									this.updateList();
								}
							}
						}
					])
				}},
				methods: {
					async updateList() {
						let list = this.directory;
						let deep = this.recursive;
						if (this.recursive) {
							if (!this.directory_recursive) this.directory_recursive = [];
							list = this.directory_recursive;
						}
						list.empty();
						this.scan_error = false;
						if (!this.path) return;

						let folders = [];
						if (deep) {
							this.recursive_cached = true;
						}
						this.loading = true;
						try {
							let fs = require('fs');
							let dirents = await fs.promises.readdir(this.path, {withFileTypes: true, recursive: deep});
							if (!dirents) return;
							dirents.forEach(dirent => {
								let {name} = dirent;
								let path = PathModule.join(dirent.parentPath, name);
								let is_folder = dirent.isDirectory();
								let file = {
									name,
									type: is_folder ? 'folder' : 'file',
									icon: getFileIcon(dirent),
									is_open: ModelProject.all.findIndex(project => project.save_path == path || project.export_path == path) !== -1,
									path,
								};
								if (file.type == 'folder') {
									folders.push(file);
								} else {
									list.push(file);
								}
							})
							if (folders.length) {
								list.splice(0, 0, ...folders);
							}
						} catch (err) {
							this.scan_error = err.code;
							if (err.code == 'EPERM') this.scan_error = 'Not permitted';
						}
						this.selected.empty();
						this.loading = false;
					},
					clickFile(file) {
						if (open_timeout == file.path) return;
						open_timeout = file.path;
						setTimeout(() => (open_timeout = ''), 360);
						
						this.selected.replace([file.path]);

						if (file.type != 'folder') {
							if (Project?.save_path == file.path || Project?.export_path == file.path) return;

							let project_before = Project;
							Blockbench.read([file.path], {}, async files => {
								loadModelFile(files[0]);
								let to_close = temp_tab;
								if (Project !== project_before) temp_tab = Project;
								if (to_close) {
									await to_close.close();
								}
							})
						}
					},
					dblClickFile(file) {
						if (file.type == 'folder') {
							this.goTo(file.path);
						} else {
							temp_tab = null;
							explorer.confirm();
						}
					},
					openContextMenu(file, event) {
						this.selected.replace([file.path]);
						this.file_menu.open(event, file);
					},

					goTo(path) {
						if (this.path) this.history.push(this.path);
						this.path = path;
						this.search_term = '';
						this.recursive_cached = false;
						this.directory_recursive = null;
						this.directory.empty();
						this.updateList();
					},
					directoryBack() {
						let last = this.history.pop();
						if (!last) return;
						this.goTo(last);
						this.history.pop();
					},
					directoryUp() {
						this.goTo(PathModule.dirname(this.path));
					},
					navigateBackTo(index) {
						if (!index) return;
						let arr = this.path.split(/[/\\]+/)
						arr = arr.slice(0, -Math.min(index, arr.length-2));
						if (!arr[0]) return;
						if (arr[0].length === 0) arr[0] = PathModule.sep;
						this.goTo(PathModule.join(...arr));
					},
					createFile(event) {
						let arr = [];
						let arr_bbmodel = [];
						let redact = settings.streamer_mode.value;
						for (let key in Formats) {
							let format = Formats[key];
							if (format.show_in_new_list == false) continue;
							if (key == 'image') continue;
							
							if (format.codec && format.codec.remember) {
								arr.push({
									id: format.id,
									name: (redact && format.confidential) ? `[${tl('generic.redacted')}]` : format.name,
									icon: format.icon,
									description: format.description,
									click: (e) => {
										explorer.hide();
										format.new();
										let project = Project;
										let update = () => {
											Blockbench.removeListener('update_project_settings', update);
											if (project == Project) {
												project.export_path = PathModule.join(this.path, (project.name||'new') + `.${format.codec.extension || 'txt'}`);
												Format.codec.write(Format.codec.compile(), Project.export_path);
											}
										}
										Blockbench.on('update_project_settings', update);
									}
								})
							}
							if (true && (!format.codec || format.codec.id !== 'project') && key !== 'skin') {
								arr_bbmodel.push({
									id: format.id,
									name: ((redact && format.confidential) ? `[${tl('generic.redacted')}]` : format.name) + ' (bbmodel)',
									icon: format.icon,
									description: format.description,
									click: (e) => {
										explorer.hide();
										format.new();
										let project = Project;
										let update = () => {
											Blockbench.removeListener('update_project_settings', update);
											if (project == Project) {
												project.save_path = PathModule.join(this.path, (project.name||'new') + '.bbmodel')
												Codecs.project.write(Codecs.project.compile(), Project.save_path);
											}
										}
										Blockbench.on('update_project_settings', update);
									}
								})
							}
						}
						arr.push('_', ...arr_bbmodel);
						new Menu('sidebar_explorer_new_file', arr).show(event.target);
					},
					getFolderName(path) {
						return PathModule.basename(path);
					},
					getFolderUpName(path) {
						return PathModule.basename(PathModule.dirname(path));
					},
					openSettings() {
						Settings.openDialog({search_term: 'Explorer'});
					},
					openFavoritesMenu(event) {
						let options = [];

						StateMemory[FAV_KEY].forEach((path, i) => {
							let option = {
								name: PathModule.basename(path),
								description: path,
								icon: 'folder',
								id: path,
								click: () => {
									this.goTo(path);
								},
								children: [
									{icon: 'delete', name: 'generic.delete', click() {
										StateMemory[FAV_KEY].remove(path);
										StateMemory.save(FAV_KEY);
									}}
								]
							}
							options.push(option);
						})
						
						if (this.path) {
							options.push(
								'_',
								{
									name: `Save "${PathModule.basename(this.path)}" to Favorites`,
									icon: 'star',
									id: 'save',
									click: () => {
										StateMemory[FAV_KEY].push(this.path);
										StateMemory.save(FAV_KEY);
									}
								}
							);
						}
						new Menu(options).open(event.target);
					},
					close(e) {
						explorer.cancel();
					}
				},
				computed: {
					recursive() {
						return setting_search_deep.value && !!this.search_term;
					},
					files() {
						let list = this.recursive ? this.directory_recursive : this.directory;
						if (!this.search_term) return list.slice(0, this.max_files);
						let terms = this.search_term.toLowerCase().split(/\s/);
						
						let i = 0;
						return list.filter(file => {
							i++;
							if (i > this.max_files) return false;
							return !terms.find(term => (
								!file.name.toLowerCase().includes(term)
							))
						})
					},
					path_array() {
						return this.path.split(/[/\\]+/).reverse();
					}
				},
				watch: {
					search_term() {
						if (this.recursive && !this.directory_recursive) {
							this.updateList();
						}
					}
				},
				template: `
					<div id="sidebar_explorer" :style="{'--width': width + 'px'}">
						<div class="dialog_handle"><div class="dialog_title">Explorer</div></div>
						<div class="dialog_close_button" @click="close($event)"><i class="material-icons">clear</i></div>

						<div class="bar flex">
							<search-bar id="sidebar_explorer_search_bar" v-model="search_term" style="flex-grow: 1; margin-left: 6px;" />
							<div class="tool" @click="openSettings()" title="Explorer Settings"><i class="material-icons">settings</i></div>
						</div>
						<div class="bar flex sidebar_explorer_location">
							<span v-for="(folder, i) in path_array" @click="navigateBackTo(i)">{{ folder }}</span>
						</div>
						<div class="bar flex">
							<div class="tool" @click="directoryBack()" :title="'Back to ' + getFolderName(history.at(-1))" v-if="history.length"><i class="material-icons">arrow_back</i></div>
							<div class="tool" @click="directoryUp()" :title="'Up to ' + getFolderUpName(path)" v-if="path"><i class="material-icons">arrow_upward</i></div>
							<div class="tool" @click="updateList()" title="Refresh"><i class="material-icons">refresh</i></div>
							<div class="tool" @click="createFile($event)" title="New File"><i class="material-icons">note_add</i></div>
							<div class="tool" @click="openFavoritesMenu($event)" title="Favorites" style="margin-left: auto;"><i class="material-icons">star</i></div>
						</div>
						<ul class="list">
							<li v-for="file in files" :key="file.path"
								class="sidebar_explorer_file" :class="{selected: selected.includes(file.path), unsupported: file.icon.textContent == 'insert_drive_file'}"
								@click="clickFile(file)" @dblclick="dblClickFile(file)" @contextmenu.stop="openContextMenu(file, $event)"
								:title="file.path"
							>
								<i v-html="file.icon.outerHTML" />
								<span>{{ file.name }}</span>
								<i class="material-icons sidebar_explorer_is_open_icon" v-if="file.is_open">fiber_manual_record</i>
							</li>
							<template v-if="files.length == max_files && directory.length > max_files">More files are hidden. Search to reveal them.</template>
							<template v-if="scan_error">Failed to scan directory directory: {{ scan_error }}</template>
							<template v-if="loading">Loading...</template>
						</ul>
					</div>
				`
			},
			onOpen() {
				temp_tab = null;
				let current_file = Project && (Project.export_path || Project.save_path);
				if (current_file) {
					this.content_vue.goTo(PathModule.dirname(current_file));
				} else if (!this.content_vue.path) {
					if ("SystemInfo" in window) {
						this.content_vue.goTo(SystemInfo.home_directory);
					} else {
						this.content_vue.goTo(electron.app.getPath('desktop'));
					}
				}
				this.content_vue.selected.replace(current_file ? [current_file] : []);
				setTimeout(() => {
					this.object.classList.add('visible');
					resize_line.update();
				}, 1);
			},
			onCancel() {
				this.object.classList.remove('visible');
				setTimeout(() => resize_line.update(), 0);
			},
			onConfirm() {
				this.object.classList.remove('visible');
				setTimeout(() => resize_line.update(), 0);
			}
		})
		//deletables.push(explorer);

		sidebar_button = Interface.createElement('div', {class: 'tool sidebar_explorer_open_button', title: 'Open Explorer'}, Blockbench.getIconNode('fas.fa-folder-open'));
		sidebar_button.addEventListener('click', event => {
			explorer.show();
		})
		let tab_bar = document.getElementById('tab_bar');
		tab_bar.prepend(sidebar_button);

		resize_line = new ResizeLine('sidebar_explorer', {
			condition() {
				return Dialog.open == explorer
			},
			get() {return explorer.content_vue.width},
			set(o, diff) {
				let calculated = Math.clamp(o + diff, 120, 800);
				explorer.content_vue.width = Math.snapToValues(calculated, [350], 16);
			},
			position() {
				this.setPosition({
					top: 0,
					bottom: 0,
					left: explorer.content_vue.width+2
				})
			}
		});
		Interface.page_wrapper.append(resize_line.node);
		resize_line.node.style.zIndex = 40;

		let action = new Action('open_explorer_sidebar', {
			name: 'Open Explorer Sidebar',
			icon: 'fas.fa-folder-open',
			click() {
				explorer.show();
			}
		})
		deletables.push(action);
	},
	onunload() {
		sidebar_button.remove();
		deletables.forEach(action => {
			action.delete();
		})
	}
});

})()
