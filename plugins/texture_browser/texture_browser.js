(() => {
	"use strict"

	/** @type {(() => void)[]} */
	const disposers = [];

	const deleteOnUnload = deletable => {
		disposers.push(() => deletable.delete());
		return deletable;
	};

	const storageKey = "texture_browser";
	const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".tga"]);

	const loadState = () => {
		try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
		catch { return {}; }
	};
	const saveState = patch => {
		localStorage.setItem(storageKey, JSON.stringify({ ...loadState(), ...patch }));
	};

	const patternToRegex = pattern => {
		pattern = (pattern || "").trim();
		if (!pattern || pattern === "*") return /.*/;
		const wild = pattern.includes("*") || pattern.includes("?");
		const expression = (wild ? pattern : "*" + pattern + "*")
			.replace(/[.+^${}()|[\]\\]/g, "\\$&")
			.replace(/\*/g, ".*")
			.replace(/\?/g, ".");
		return new RegExp("^" + expression + "$", "i");
	};

	const scanFiles = (folderPath, pattern, maxDepth) => {
		const fileSystem = requireNativeModule("fs");
		if (!fileSystem) return [];
		const nodePath = requireNativeModule("path");
		const regex = patternToRegex(pattern);
		const results = [];
		const walk = (dirPath, depth) => {
			if (depth > maxDepth) return;
			let entries;
			try { entries = fileSystem.readdirSync(dirPath, { withFileTypes: true }); }
			catch { return; }
			for (const entry of entries) {
				const fullPath = nodePath.join(dirPath, entry.name);
				if (entry.isDirectory()) walk(fullPath, depth + 1);
				else if (entry.isFile() && imageExtensions.has(nodePath.extname(entry.name).toLowerCase()) && regex.test(entry.name))
					results.push({ name: entry.name, path: fullPath });
			}
		};
		walk(folderPath, 0);
		return results;
	};

	const pickFolder = async () => {
		const dialog = requireNativeModule("dialog");
		if (!dialog) return null;
		const result = await dialog.showOpenDialog({
			properties: ["openDirectory"]
		});
		return result.canceled ? null : result.filePaths[0];
	};

	const pathToFileUrl = path => {
		const rightSlashedPath = path.replace(/\\/g, "/");
		return rightSlashedPath.startsWith("/")
			? "file://" + rightSlashedPath
			: "file:///" + rightSlashedPath;
	};

	// ── BarTextInput ────────────────────────────────────────────────────────

	const BarTextInput = class extends Widget {
		constructor(id, data) {
			super(id, data);
			this.input = document.createElement("input");
			this.input.type = "text";
			this.input.value = data.value || "";
			this.input.placeholder = data.placeholder || "";
			this.input.className = "dark_bordered focusable_input";
			this.input.style.width = "100%";
			this.input.style.boxSizing = "border-box";

			this.node = document.createElement("div");
			this.node.className = "tool widget";
			this.node.setAttribute("toolbar_item", this.id);
			this.node.style.flex = "1";
			this.node.append(this.input);

			this.addLabel();

			$(this.input).on("input", () => {
				this.value = this.input.value;
				if (data.onChange) data.onChange(this.value);
			});
		}
		get() { return this.value; }
		set(value) { this.value = value; this.input.value = value; }
	};

	// ── Registration ───────────────────────────────────────────────────────

	BBPlugin.register("texture_browser", {
		title: "Texture Browser",
		icon: "image_search",
		author: "nklbdev",
		description: "Browse textures from a local folder and assign them to selected faces",
		version: "1.0.0",
		min_version: "5.0.0",
		variant: "desktop",

		onload() {
			const maxDepth = deleteOnUnload(new Setting("texture_browser_max_depth", {
				name: "Texture Browser: Max Folder Depth",
				description: "How deep to scan the folder tree for textures (1 = selected folder only)",
				category: "preview",
				type: "number", value: 5, min: 1, max: 10, step: 1,
			}));
			const removeOrphans = deleteOnUnload(new Setting("texture_browser_remove_orphans", {
				name: "Texture Browser: Remove Unused Textures",
				description: "Delete textures that become unreferenced after assigning a new one from the browser",
				category: "preview",
				type: "toggle", value: true,
			}));
			const thumbnailSize = deleteOnUnload(new Setting("texture_browser_thumbnail_size", {
				name: "Texture Browser: Thumbnail Size",
				description: "Size of texture thumbnails in the grid, as a percentage of the default 64 px (10–200, step 10)",
				category: "preview",
				type: "number", value: 100, min: 10, max: 200, step: 10,
				onChange(value) {
					if (state._vue) state._vue.thumbScale = value / 100;
				},
			}));

			// ── Shared state ──────────────────────────────────────────

			const state = {
				folderPath: loadState().folderPath || '',
				filter: loadState().filter || '',
				showOnlyUsed: loadState().showOnlyUsed || false,
				files: [],
				status: "idle",
				error: "",
				usedPathsSet: {},
				_vue: null,
				_debounceTimer: null,

				scan() {
					if (!this.folderPath) { this.status = "idle"; this.updateGrid(); return; }
					this.status = "scanning";
					this.updateGrid();
					setTimeout(() => {
						try {
							this.files = scanFiles(this.folderPath, this.filter || "*", maxDepth.value);
							this.updateUsed();
							this.status = "ready";
						} catch (e) {
							this.error = e.message;
							this.status = "error";
						}
						this.updateGrid();
					}, 0);
				},
				debounceScan() {
					clearTimeout(this._debounceTimer);
					this._debounceTimer = setTimeout(() => this.scan(), 300);
				},
				updateUsed() {
					const usedUuids = new Set(
						Mesh.all.flatMap(m => Object.values(m.faces).map(f => f.texture)).filter(Boolean)
					);
					const usedPaths = new Set(
						Texture.all.filter(t => usedUuids.has(t.uuid)).map(t => t.path)
					);
					const map = {};
					for (const p of usedPaths) map[p] = true;
					this.usedPathsSet = map;
				},
				updateGrid() {
					const v = this._vue;
					if (!v) return;
					v.files = this.files;
					v.status = this.status;
					v.error = this.error;
					v.folderPath = this.folderPath;
					v.filter = this.filter;
					v.showOnlyUsed = this.showOnlyUsed;
					v.usedPathsSet = this.usedPathsSet;
				},
				use(file) {
					const meshes = Mesh.selected;
					const faces = meshes.flatMap(m => m.getSelectedFaces().map(key => m.faces[key]) );
					if (!faces.length) return;

					Undo.initEdit({ elements: meshes, textures: Texture.all });

					let texture = Texture.all.find(t => t.path === file.path);
					if (!texture) {
						texture = new Texture({ name: file.name, render_sides: "front", wrap_mode: "repeat" });
						texture.flags.add("update_uv_size_from_resolution");
						texture.fromPath(file.path);
						texture.add(false);
					}
					for (const face of faces) face.texture = texture.uuid;

					if (removeOrphans.value) {
						const usedTextures = new Set(Mesh.all.flatMap(m => Object.values(m.faces).map(f => f.texture)));
						for (const texture of Texture.all.slice())
							if (!usedTextures.has(texture.uuid)) texture.remove(true);
					}

					Undo.finishEdit("Assign texture");
					Canvas.updateAll();
					texture.select();
					this.updateUsed();
					this.updateGrid();
				},
			};

			// ── Toolbar inputs ────────────────────────────────────────

			const pathInput = deleteOnUnload(new BarTextInput("texture_browser_path_input", {
				name: "Folder Path",
				value: state.folderPath,
				placeholder: "Folder path...",
				onChange(val) {
					state.folderPath = val;
					saveState({ folderPath: val });
					state.scan();
				},
			}));

			// ── Panel ─────────────────────────────────────────────────

			const browseAction = deleteOnUnload(new Action("texture_browser_browse_action", {
				description: "Open a dialog to select the root folder for texture browsing",
				name: "Browse", icon: "folder_open", category: "edit",
				private: true, work_in_dialog: true, searchable: false,
				async click() {
					const dir = await pickFolder();
					if (!dir) return;
					state.folderPath = dir;
					pathInput.set(dir);
					saveState({ folderPath: dir });
					state.scan();
				},
			}));
			
			const filterInput = deleteOnUnload(new BarTextInput("texture_browser_filter_input", {
				name: "Filter", value: state.filter, placeholder: "Filter: *.png, brick_*",
				onChange(val) {
					state.filter = val;
					saveState({ filter: val });
					state.debounceScan();
				},
			}));

			const refreshAction = deleteOnUnload(new Action("texture_browser_refresh_action", {
				description: "Re-scan the selected folder to update the texture list",
				name: "Refresh", icon: "refresh", category: "edit",
				private: true, work_in_dialog: false, searchable: false,
				click() { state.scan(); },
			}));

			const onlyUsedToggle = deleteOnUnload(new Toggle("texture_browser_used_toggle", {
				description: "Show only the textures used in this project.",
				name: "Only Used", icon: "inventory", category: "edit",
				private: true, work_in_dialog: false, searchable: false,
				value: state.showOnlyUsed,
				onChange(val) {
					state.showOnlyUsed = val;
					saveState({ showOnlyUsed: val });
					state.updateUsed();
					state.updateGrid();
				},
			}));

			const toolbar = deleteOnUnload(new Toolbar("texture_browser_toolbar", {
				name: "Texture Browser",
				children: [pathInput, browseAction, "#", filterInput, refreshAction, onlyUsedToggle]
			}));
			// Hide the panel menu expansion button
			toolbar.no_wrap = true;
			for (const n of toolbar.node.childNodes)
				if (n.className === "tool toolbar_menu")
					n.style.display = "none";


			deleteOnUnload(new Panel("texture_browser_panel", {
				name: "Texture Browser",
				icon: "image_search",
				growable: true,
				resizable: true,
				condition: () => Modes.edit,
				default_position: {
					attached_to: "textures", attached_index: 1, slot: "left_bar", sidebar_index: 5,
					float_position: [0, 0], float_size: [300, 500], height: 500,
				},
				toolbars: [toolbar],
				component: {
					data() { return {
						folderPath: state.folderPath,
						filter: state.filter,
						showOnlyUsed: state.showOnlyUsed,
						thumbScale: thumbnailSize.value / 100,
						usedPathsSet: state.usedPathsSet,
						files: state.files,
						status: state.status,
						error: state.error,
					}},
					computed: {
						displayFiles() {
							return this.showOnlyUsed
								? this.files.filter(f => this.usedPathsSet[f.path])
								: this.files;
						},
					},
					mounted() {
						state._vue = this;
						if (this.folderPath) state.scan();
					},
					methods: {
						toSrc: pathToFileUrl,
						relativePath(fullPath) {
							try { return PathModule.relative(this.folderPath, fullPath); }
							catch { return fullPath; }
						},
						use(file) { state.use(file); },
					},
					template: `
						<div class="texture_browser-panel">
							<div class="texture_browser-status" v-if="status === 'scanning'">Scanning...</div>
							<div class="texture_browser-status texture_browser-error" v-else-if="status === 'error'">{{ error }}</div>
							<div class="texture_browser-status" v-else-if="!folderPath">Select a folder to browse textures.</div>
							<div class="texture_browser-status" v-else-if="status === 'ready' && displayFiles.length === 0">No files match the filter.</div>
							<div class="texture_browser-grid" v-if="status === 'ready' && displayFiles.length > 0">
								<div v-for="file in displayFiles" :key="file.path"
									class="texture_browser-item"
									:class="{ 'texture_browser-item-used': usedPathsSet[file.path] }"
									:title="file.name + '\\n' + relativePath(file.path)"
									@click="use(file)">
									<img :src="toSrc(file.path)" class="texture_browser-img"
										:style="{ width: 128 * thumbScale + 'px', height: 128 * thumbScale + 'px' }" />
								</div>
							</div>
						</div>
					`,
				},
			}));

			const style = document.createElement("style");
			style.textContent = '\
				.texture_browser-panel { display: flex; flex-direction: column; height: 100%; padding: 0 4px 4px; gap: 4px; box-sizing: border-box; overflow: hidden; }\
				.texture_browser-status { padding: 12px 8px; text-align: center; color: var(--color-subtle_text); font-size: 13px; }\
				.texture_browser-error { color: var(--color-error, #e55); }\
				.texture_browser-grid { flex: 1; overflow-y: auto; display: flex; flex-wrap: wrap; gap: 2px; padding: 2px; align-content: flex-start; }\
				.texture_browser-item { display: flex; padding: 2px; border-radius: 3px; cursor: pointer; box-sizing: border-box; }\
				.texture_browser-item:hover { background: var(--color-button); }\
				.texture_browser-item-used .texture_browser-img { outline: 2px solid #6af; outline-offset: -2px; }\
				.texture_browser-img { object-fit: contain; image-rendering: pixelated; background: repeating-conic-gradient(#999 0% 25%, #ccc 0% 50%) 0 0 / 12px 12px; }\
			';
				document.head.appendChild(style);
			disposers.push(() => style.remove());
		},

		onunload() {
			for (const disposer of disposers.reverse())
				disposer();
			disposers.length = 0;
		},
	});
})();
