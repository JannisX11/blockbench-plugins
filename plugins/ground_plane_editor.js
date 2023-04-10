(async function() {
    let aboutAction, groundPlaneAction, groundPlaneDialog;
    const id = "ground_plane_editor"
    const name = "Ground Plane Editor"
    const icon = "icon-format_free"
    const author = "SirJain"

    // Store the ground plane material in a dialog
    let groundPlane = Canvas.ground_plane.material

    // localStorage variables
    let localStorageColor = localStorage.getItem("groundPlaneColor")
    let localStorageOpacity = localStorage.getItem("groundPlaneOpacity")

    const links = {
        twitter: "https://www.twitter.com/SirJain2",
        discordlink: "https://discord.gg/wM4CKTbFVN"
    }

    // Register plugin
    Plugin.register(id, {
        title: name,
        icon,
        author,
        description: "Edits the opacity and color of the ground plane feature in Blockbench.",
        about: "This simple plugin allows you to customize the ground plane feature in Blockbench; more specifically, the opacity and color.\n## How to use\nTo use this plugin, simply go to `Tools > Ground Plane Editor`, fill out the appropriate categories, and hit `Done`. You can choose to edit either the color, the opacity, or both!\n\nPlease report any bugs or suggestions you may have.",
        tags: ["Ground Plane", "Animation", "Customization"],
        version: "1.1.1",
        min_version: "4.2.0",
        variant: "both",

        oninstall() {
            showAbout(true)
            Blockbench.showQuickMessage("Successfully Installed Ground Plane Editor!");
        },
        onuninstall() {
            Blockbench.showQuickMessage("Uninstalled Ground Plane Editor");
        },
        onload() {
            addAbout()

            // Handles the ground plane on loading the plugin
            groundPlane.transparent = true;

            if (localStorageColor) groundPlane.color.setHex(JSON.parse(localStorageColor))
            else groundPlane.color.setHex(parseInt("#21252B".substring(1), 16))

            if (localStorageOpacity) groundPlane.opacity = localStorageOpacity / 255
            else groundPlane.opacity = 1
    
            groundPlaneAction = new Action({
                name: "Edit Ground Plane",
                id: "edit_ground_plane_action",
                icon: icon,
                condition: () => Format?.id !== "image",
                click: () => openDialog()
            })

            MenuBar.addAction(groundPlaneAction, "tools")
        },

        onunload() {
            aboutAction.delete()
            groundPlaneAction.delete()

            // Reset values if plugin is uninstalled
            localStorage.removeItem("groundPlaneColor")
            localStorage.removeItem("groundPlaneOpacity")
            groundPlane.color.setHex(parseInt("#21252B".substring(1), 16))
            groundPlane.opacity = 1

            MenuBar.removeAction(`help.about_plugins.about_${id}`)
        }
    })

    function openDialog() {
        groundPlaneDialog = new Dialog("ground_plane_dialog", {
            name: "Edit Ground Plane",
            part_order: ["form", "lines", "component"],

            form: {
                color: {
                    label: "Color",
                    value: getPlaneColor(),
                    type: "color"
                },
                opacity: {
                    label: "Opacity", 
                    value: getPlaneOpacity(),
                    type: "range",
                    min: 60,
                    max: 255,
                    step: 1
                }
            },

            component: {
                template: `
                    <div>
                        <div style="display:flex;gap:8px">
                            <button @click="resetPlaneValues()" style="margin-top: 15px;">Reset Values</button>
                        </div>
                    </div>
                `,
                methods: {
                    resetPlaneValues() {
                        groundPlane.color.setHex(parseInt("#21252B".substring(1), 16))
                        groundPlane.opacity = 1
                        groundPlaneDialog.hide()
                
                        localStorage.setItem("groundPlaneColor", groundPlane.color)
                        localStorage.setItem("groundPlaneOpacity", groundPlane.opacity)

                        Blockbench.showQuickMessage("Reset ground plane values!", 1500)
                    }
                }
            },

            onConfirm(formData) {
                const planeColor = parseInt(formData.color.toHexString().substring(1), 16)

                groundPlane.color.setHex(planeColor)
                groundPlane.opacity = formData.opacity / 255

                localStorage.setItem("groundPlaneColor", planeColor)
                localStorage.setItem("groundPlaneOpacity", formData.opacity)

                console.log(groundPlane.color)
                Blockbench.showQuickMessage("Updated ground plane values!", 1500)
            }
        }).show()
    }

    function getPlaneColor() {
        return '#' + groundPlane.color.getHexString()
    }

    function getPlaneOpacity() {
        return groundPlane.opacity * 255;
    }

    // Adds about dialog
    function addAbout() {
        let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")

        if (!about) {
            about = new Action("about_plugins", {
                name: "About Plugins...",
                icon: "info",
                children: []
            })
            MenuBar.addAction(about, "help")
        }

        aboutAction = new Action(`about_${id}`, {
            name: `About ${name}...`,
            icon,
            click: () => showAbout()
        })

        about.children.push(aboutAction)
    }

    function showAbout(banner) {
        const infoBox = new Dialog({
            id: "about",
            title: name,
            width: 780,
            buttons: [],
            lines: [`
                <li></li>
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
                    <p>This plugin is used for changing the opacity and color of the ground plane feature in Blockbench.</p>
                    <h4>Worth noting:</h4>
                    <p>- There is currently no way to revert back to the default ground plane. However, adding this feature is planned. For now you'll have to uninstall the plugin and restart Blockbench to revert back to the default.</p>
                    <p>- Just like the default ground plane, changing it's properties in one tab will update in other tabs as well.</p>
                    <h4>How to use:</h4>
                    <p>To use this plugin, simply go to <b>Tools > Ground Plane Editor</b>, fill out the appropriate categories, and hit <b>Done</b>. You can choose to edit either the color, the opacity, or both!</p>
                    <p>Please report any bugs or suggestions you may have to make this plugin more enjoyable for everyone.</p>
                    <br>
                    <div class="socials">
                        <a href="${links["twitter"]}" class="open-in-browser">
                            <i class="fa-brands fa-twitter" style="color:#00acee"></i>
                            <label>By ${author}</label>
                        </a>
                        <a href="${links["discordlink"]}" class="open-in-browser">
                            <i class="fa-brands fa-discord" style="color:#5865F2"></i>
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
