/// <reference path="../node_modules/blockbench-types/types/plugin.d.ts" />

import {compile} from "./compile";


let exportButton: Action
let exportDialog = new Dialog("export-to-3mf-dialog", {
    title: "3MF Model Exporter",

    form: {
        exportUnits: {
            label: "Unit",
            description: "Convert pixels into the selected unit",
            type: "select",
            default: "millimeter",
            options: {
                micron: {
                    name: "Micrometres"
                },
                millimeter: {
                    name: "Millimetres"
                },
                centimeter: {
                    name: "Centimetres"
                },
                meter: {
                    name: "Metres"
                },
                inch: {
                    name: "Inches"
                },
                foot: {
                    name: "Feet"
                }
            }
        },
        exportGroups: {
            label: "Split",
            description: "Export model as multiple objects (useful for multi material printing)",
            type: "select",
            toggle_default: false,
            toggle_enabled: true,
            options: {
                group: {
                    name: "By group"
                },
                marker: {
                    name: "By marker colour"
                }
            }
        },
    },
    lines: [
        "<p>Some models may result in an invalid 3MF file during export. To ensure a successful export, make sure all parts of your model have actual thickness and form enclosed, printable volumes.<p/><br/>"
    ],
    async onConfirm({exportUnits, exportGroups}: { exportUnits: string, exportGroups: undefined|"group"|"marker" }) {

        const content = await compile(exportUnits, exportGroups)


        Blockbench.export({
            resource_id: "CAD",
            extensions: ["3mf"],
            type: "3D Manufacturing Format",
            name: `${Project?.name ?? "unknown"}.3mf`,
            content
        })

    }
})

function load() {
    exportButton = new Action("export-to-3mf-button", {
        click(): void {
            exportDialog.show()
        },
        icon: "fa-file-export",
        name: "Export 3MF Model"
    })

    MenuBar.addAction(exportButton, "file.export")
}



function unload() {
    exportButton.delete()
    exportDialog.delete()
}


BBPlugin.register("export_to_3mf", {
    "title": "Export to 3MF",
    "author": "Ayden Hodgins-de Jonge",
    "description": "Export geometry as 3MF for 3D printing",
    "tags": ["Exporter", "3D Printing", "3MF"],
    "icon": "icon.png",
    "variant": "both",
    "version": "0.0.1",
    "min_version": "4.12.5",
    "has_changelog": false,
    "repository": "https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/export_to_3mf",
    onload: load,
    onunload: unload
})