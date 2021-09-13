var exportResourcePackAction;

Plugin.register('resource_pack_exporter', {
    title: 'Resource Pack Exporter',
    icon: 'archive',
    author: 'Wither',
    description: 'Exports your model as a ready-to-use Minecraft resource pack',
    tags: ["Minecraft: Java Edition"],
    version: '1.0.0',
    min_version: '3.0.0',
    variant: 'both',

    onload() {
        exportResourcePackAction = new Action({
            id: 'export_rp',
            name: 'Export Resource Pack',
            icon: 'archive',
            description: 'Exports your model as a ready-to-use Minecraft resource pack',
            category: 'file',
            condition: () => Format.id === "java_block",
            click: function (ev) {
                packDialog.show();
            }
        });
        MenuBar.addAction(exportResourcePackAction, 'file.export');
    },
    onunload() {
        this.onuninstall();
    },
    onuninstall() {
        exportResourcePackAction.delete();
    }
})

var packDialog = new Dialog({
    id: 'create_pack',
    title: 'Pack Settings',
    draggable: true,
    form: {
        pack_name: {label: 'Pack Name', value: 'My Pack'},
        pack_description: {label: 'Pack Description', value: 'My Description'}
    },
    onConfirm: function(data) {
        exportResourcePack(data.pack_name, data.pack_description);
        packDialog.hide();
    }
});

function exportResourcePack(name, description) {
    Screencam.cleanCanvas({width: 100, height: 100}, base64 => {
        let packZip = new JSZip();
        packZip.file('pack.png', base64.split(',')[1], {base64: true});

        let manifestObject = {pack: {description: description !== '' ? description : 'My Description', pack_format: 4}};
        let animTextureObject = {animation: {frametime: 2}};

        packZip.file('pack.mcmeta', JSON.stringify(manifestObject, null, '\t'));

        let assetsFolder = packZip.folder('assets');
        let minecraftFolder = assetsFolder.folder('minecraft');
        let modelsFolder = minecraftFolder.folder('models');
        let blockFolder = modelsFolder.folder('block');
    
        let texturesFolder = minecraftFolder.folder('textures');
        let blockbenchTexturesFolder = texturesFolder.folder('blockbench')
    
        for(let textureIndex = 0; textureIndex < textures.length; textureIndex++) {
            textures[textureIndex].name = `texture_${textureIndex}.png`;
            textures[textureIndex].folder = 'blockbench';
            textures[textureIndex].namespace = 'minecraft';
            if (textures[textureIndex].frameCount > 1) {
                blockbenchTexturesFolder.file(`texture_${textureIndex}.png.mcmeta`, JSON.stringify(animTextureObject, null, "\t"));
            }
            blockbenchTexturesFolder.file(`texture_${textureIndex}.png`, textures[textureIndex].getBase64(), {base64: true});
        }
    
        blockFolder.file('glass.json', Codecs.java_block.compile());
    
        packZip.generateAsync({type: 'blob'}).then(content => {
            Blockbench.export({
                type: 'Zip Archive',
                extensions: ['zip'],
                name: name !== '' ? name : 'My Pack',
                content: content,
                savetype: 'zip'
            });
        });
    });
}