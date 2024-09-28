const pluginInfo = {
    "name": "Meshy",
    "id": "meshy",
    "version": "1.0.2",
    "repository": "https://github.com/Shadowkitten47/Meshy"
};

if (!settings["normalized_uvs"])
    new Setting("normalized_uvs", {
        name: "Normalize UVs",
        description: "Normalize uvs on export",
        value: true,
        plugin: pluginInfo.id
    })
if (!settings["meta_data"])
    new Setting("meta_data", {
        name: "Meta Data",
        description: "Adds meta data to mesh. ( For smaller file size disable this )",
        value: true,
        plugin: pluginInfo.id
    })
if (!settings["skip_normals"]) {
    new Setting("skip_normals", {
        name: "Skip Normals",
        description: "Model will lack all shading information",
        value: false,
        plugin: pluginInfo.id
    })
}
if (!settings["Force Multi-Textures"])
    new Setting("force_textures", {
        name: "Force Multi-Textures",
        description: "Forces bedrock formats to use Multi-Textures ( You will need to stitch the textures )",
        value: false,
        plugin: pluginInfo.id,
        onChange: (value) => {
            Formats['bedrock'].single_texture = !value
            Formats['bedrock_old'].single_texture = !value
        },        
        
})

Plugin.register(pluginInfo.id, {
	title: pluginInfo.name,
	author: 'Shadowkitten47',
	icon: 'diamond',
	description: 'Enables the use of a meshes in bedrock formats and to export them to Minecraft Bedrock',
	version: pluginInfo.version,
	variant: 'both',
    repository: pluginInfo.repository,
    onload() {
        const bedrock_old = Formats['bedrock_old']
        const bedrock = Formats['bedrock']
        bedrock.meshes = true;
        bedrock_old.meshes = true;
        bedrock.single_texture = !settings["single_texture"]?.value
        bedrock_old.single_texture = !settings["single_texture"]?.value
       
    },
    onunload() {
        const bedrock_old = Formats['bedrock_old']
        const bedrock = Formats['bedrock']
        bedrock.meshes = false;
        bedrock_old.meshes = false;
        bedrock.single_texture = true;
        bedrock_old.single_texture = true;
    }
});


if (!BarItems['quick_reload']) {
    new Action('quick_reload', {
        icon: 'undo',
        category: 'file',
        condition: () => Project.export_path != "",
        keybind: new Keybind({key: 'r', ctrl: true}),
        click(e) {
            Blockbench.read([Project.export_path], {}, (files) => {
                loadModelFile(files[0])
            })
        }
    })
}