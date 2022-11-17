(async function() {
	let aboutAction;
	const id = "image_centering";
	const name = "Image Centering";
	const icon = "center_focus_strong";
	const author = "SirJain";
	let button;
	const links = {
		twitter: "https://twitter.com/SirJain2",
		discord: "https://discord.gg/wM4CKTbFVN"
	}
	Plugin.register(id, {
		title: name,
		icon,
		author,
		description: "Adds a button that centers the image viewport in an Image format.",
		about: "This plugin adds a button that allows you to reset your viewport in the Image format.\n## How to use\nTo use this plugin, go to the brush toolbar (top of the image mode) and click the `Center Image Viewport` button. If it doesn't show up, make sure you are in the Image format. If you are, you can add the tool using the `Customize Toolbar` option. There will be a confirmation message displayed on-screen once you center the viewport.\n\nPlease report any bugs or suggestions you may have.",
		tags: ["Customization", "Format: Image", "UX"],
		version: "1.0.0",
		min_version: "4.2.0",
		variant: "both",
		oninstall: () => showAbout(true),
		onload() {
			addAboutButton();
			Blockbench.showQuickMessage("Successfully installed Image Centering plugin!", 2000);
			button = new Action("image_center_button", {
				name: 'Center Image Viewport',
				icon: 'center_focus_strong',
				description: 'Center the viewport of your image',
				condition: () => Format?.id == "image",
				click() {
					CenterViewport()
					SetZoom()
					Blockbench.showQuickMessage("Centered viewport!", 2000)
				}
			})

			Toolbars.brush.add(button);
		},
		onunload() {
			aboutAction.delete();
			button.delete();
			MenuBar.removeAction(`help.about_plugins.about_${id}`);
			Blockbench.showQuickMessage("Uninstalled Image Centering plugin", 2000);
		}
	})

	function CenterViewport() {
		let uv_viewport = UVEditor.vue.$refs.viewport;
		if (!uv_viewport) return;
		UVEditor.setZoom(Project.uv_viewport.zoom);
		Vue.nextTick(() => {
			uv_viewport.scrollLeft = Project.uv_viewport.offset[0] * UVEditor.vue.inner_width + UVEditor.width/2;
			uv_viewport.scrollTop = Project.uv_viewport.offset[1] * UVEditor.vue.inner_height + UVEditor.height/2;
		})
	}

	function SetZoom(zoom) {
		let max_zoom = Math.round((UVEditor.vue.texture ? UVEditor.vue.texture.height : Project.texture_width) * 32 / UVEditor.width);
		zoom = Math.clamp(zoom, 0.85, Math.clamp(max_zoom, 16, 64));
		UVEditor.vue.zoom = zoom;
		Project.uv_viewport.zoom = UVEditor.zoom;
		Vue.nextTick(() => {
			if (Painter.selection.overlay) UVEditor.updatePastingOverlay();
		})
		return UVEditor;
	}

	function addAboutButton() {
		let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins");
		if (!about) {
			about = new Action("about_plugins", {
				name: "About Plugins...",
				icon: "info",
				children: []
			})
			MenuBar.addAction(about, "help");
		}
		aboutAction = new Action(`about_${id}`, {
			name: `About ${name}...`,
			icon,
			click: () => showAbout()
		})
		about.children.push(aboutAction);
	}

	function showAbout(banner) {
		const infoBox = new Dialog({
			id: "about",
			title: name,
			width: 780,
			buttons: [],
			lines: [`
                <style>
					dialog#about .dialog_title {
						padding-left: 0;
						display: flex;
						align-items: center;
						gap: 10px;
					}

					dialog#about .dialog_content {
						text-align: left!important;
						margin: 0!important;
					}

					dialog#about .socials {
						padding: 0!important;
					}

					dialog#about #banner {
						background-color: var(--color-accent);
						color: var(--color-accent_text);
						width: 100%;
						padding: 0 8px
					}

					dialog#about #content {
						margin: 24px;
					}
                </style>
                ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
                <div id="content">
					<h1 style="margin-top:-10px">${name}</h1>
					<p>Adds a button that centers the image viewport in an Image format.</p>
					<h4>Worth noting:</h4>
					<p>- You need to be in the Image format for this plugin to work.</p>
					<p>- You can add or remove the button from the toolbar using the<b> Customize Toolbar</b> button.</p>
					<h4>How to use:</h4>
					<p>To use this plugin, go to the brush toolbar (top of the image mode) and click the <b>Center Image Viewport</b> button. There will be a confirmation message displayed on-screen once you center the viewport.</p>
					<br>
					<div class="socials">
						<a href="${links["twitter"]}" class="open-in-browser">
							<i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
							<label>By ${author}</label>
						</a>
						<a href="${links["discord"]}" class="open-in-browser">
							<i class="icon fab fa-discord" style="color:#727FFF"></i>
							<label>Discord Server</label>
						</a>
					</div>
                </div>
            `]
		}).show()
		$("dialog#about .dialog_title").html(`
    <i class="icon material-icons">${icon}</i>
    ${name}
    `)
	}
})()