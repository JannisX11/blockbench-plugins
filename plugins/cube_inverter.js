(async function() {
        let aboutAction, cubeInverterAction
        const id = "cube_inverter"
        const name = "Cube Inverter"
        const icon = "swap_horiz"
        const author = "SirJain"

        // Used for about dialog
        const links = {
                website: "https://sirjain0.github.io/",
                twitter: "https://twitter.com/SirJain2",
                discord: "https://discord.gg/wM4CKTbFVN"
        }

        // Registers plugin data
        Plugin.register(id, {
                title: name,
                icon,
                author,
                description: "Adds a button that inverts selected cube sizes.",
                about: "This plugin adds a button that inverts the size values of each selected cube.\n## How to use\nTo use this plugin, go to the toolbar at the top of the screen (the one with the move, resize, and rotation tools) and click the `Invert Cubes` button. If you don't see the button, make sure to select some cubes. The button is also keybinded with a default of `Shift + I`.\n\nPlease report any bugs or suggestions you may have.",
                version: "1.0.0",
                min_version: "4.2.0",
                variant: "both",
                oninstall: () => showAbout(true),
                onload() {
                        addAbout()

                        cubeInverterAction = new Action("cube_inverter_action", {
                                name: "Invert Cubes",
                                icon: icon,
                                description: "Invert the values of all axes of selected cubes.",
                                keybind: new Keybind({key: 'i', shift: true}),
                                condition: () => Cube.selected.length,
                                click: () => invertCubes()
                        })

                        Toolbars.main_tools.add(cubeInverterAction);
                },
                onunload() {
                        aboutAction.delete()
                        cubeInverterAction.delete()
                        MenuBar.removeAction(`help.about_plugins.about_${id}`)
                        Blockbench.showQuickMessage("Uninstalled Cube Inverter plugin")
                }
        })

        function invertCubes() {
                Undo.initEdit({elements: Cube.selected, outliner: true});

                for (const cube of Cube.selected) {

                        // Handles size dimensions
                        [cube.from, cube.to] = [cube.to, cube.from]

                        // UV handling
                        cube.faces.north.uv = cube.faces.south.uv
                        cube.faces.south.uv = cube.faces.north.uv
                        cube.faces.north.texture = cube.faces.south.texture 
                        cube.faces.south.texture = cube.faces.north.texture
                        cube.faces.north.cullface = cube.faces.south.cullface 
                        cube.faces.south.cullface = cube.faces.north.cullface
                        cube.faces.north.rotation = (cube.faces.north.rotation + 180) % 360
                        cube.faces.south.rotation = (cube.faces.south.rotation + 180) % 360

                        cube.faces.east.uv = cube.faces.west.uv
                        cube.faces.west.uv = cube.faces.east.uv
                        cube.faces.east.texture = cube.faces.west.texture 
                        cube.faces.west.texture = cube.faces.east.texture
                        cube.faces.east.cullface = cube.faces.west.cullface 
                        cube.faces.west.cullface = cube.faces.east.cullface
                        cube.faces.east.rotation = (cube.faces.east.rotation + 180) % 360
                        cube.faces.west.rotation = (cube.faces.west.rotation + 180) % 360

                        cube.faces.up.uv = cube.faces.down.uv
                        cube.faces.down.uv = cube.faces.up.uv
                        cube.faces.up.texture = cube.faces.down.texture 
                        cube.faces.down.texture = cube.faces.up.texture
                        cube.faces.up.cullface = cube.faces.down.cullface 
                        cube.faces.down.cullface = cube.faces.up.cullface
                        cube.faces.up.rotation = (cube.faces.up.rotation + 180) % 360
                        cube.faces.down.rotation = (cube.faces.down.rotation + 180) % 360
                }

                Canvas.updateView({
                        elements: Cube.selected,
                        element_aspects: {transform: true, geometry: true},
                })

                Undo.finishEdit("Inverted cube values", {elements: Cube.selected, outliner: true});
        }

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
                                        <p>Adds a button that inverts selected cube sizes.</p>
                                        <h4>Worth noting:</h4>
                                        <p>- The plugin inverts each value of all the cubes selected - Positive to Negative or Negative to Positive.</p>
                                        <p>- This plugin logically works on cubes - no meshes or other outliner elements.</p>
                                        <p>- Like all other keybindings, the keybind tied to the 'Invert Cube' action can be changed in the settings.</p>
                                        <h4>How to use:</h4>
                                        <p>To use this plugin, press the <b>Invert Cubes</b> button which is located next to the Inflation number in the edit tab.</p>
                                        <br>
                                        <div class="socials">
                                                <a href="${links["website"]}" class="open-in-browser">
                                                        <i class="icon material-icons" style="color:#33E38E">language</i>
                                                        <label>Website</label>
                                                </a>
                                                <a href="${links["discord"]}" class="open-in-browser">
                                                        <i class="icon fab fa-discord" style="color:#727FFF"></i>
                                                        <label>Discord Server</label>
                                                </a>
                                                <a href="${links["twitter"]}" class="open-in-browser">
                                                        <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
                                                        <label>Twitter</label>
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