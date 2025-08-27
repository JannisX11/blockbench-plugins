(function() {

let deferred = [];

Plugin.register('repeating_textures', {

    title:         'Repeating Textures',
    author:        '0x13F',
    description:   'Enables repeating textures',
    icon:          'icon.png',
    creation_date: '2025-06-15',
    version:       '3.0.0',
    variant:       'both',
    min_version:   '4.12.4',
    has_changelog: false,
    tags:          [ 'Texture', 'Viewport', 'Utility' ],
	repository:    'https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/repeating_textures',
    
    onload() {

        // Hook into the Texture.getMaterial() method to set the wrap mode
        {
            let original = Texture.prototype.getMaterial;
            Texture.prototype.getMaterial = function () {
                let result = original.apply(this);
                updateTextureWrapMode(this);
                return result;
            };
            defer(() => Texture.prototype.getMaterial = original);
        }

        // Setting
        deferDelete(new Setting('repeating_textures', {
            name: 'Repeating Textures',
            description: 'Wrap textures when UV is beyond the texture bounds',
            category: 'view',
            value: true,
            onChange() {
                updateAllTextureWrapModes();
            },
        }));

        // Toggle
        let repeatingTexturesToggle = deferDelete(new Toggle('toggle_repeating_textures', {
            name: 'Repeating Textures',
            description: 'Wrap textures when UV is beyond the texture bounds',
            icon: 'qr_code',
            category: 'view',
            linked_setting: 'repeating_textures',
        }));
        let shadingToggleIndex = MenuBar.menus.view.structure.indexOf('toggle_shading');
        let repeatingTexturesToggleIndex = shadingToggleIndex + 1;
        MenuBar.menus.view.structure.splice(repeatingTexturesToggleIndex, 0, repeatingTexturesToggle);
        defer(() => MenuBar.menus.file.structure.splice(MenuBar.menus.view.structure.indexOf(repeatingTexturesToggle), 1));

        // Apply setting on load
        updateAllTextureWrapModes();
        // Disable on unload
        defer(() => updateAllTextureWrapModes(false));

    },

    onunload() {

        for (let lambda of deferred.reverse())
            lambda();
        
    },

});

function updateAllTextureWrapModes(force = undefined) {

    for (let texture of Texture.all)
        updateTextureWrapMode(texture, force);

}

function updateTextureWrapMode(texture, force = undefined) {

    let useRepeating = force ?? Settings.get('repeating_textures');
    let wrapMode = useRepeating ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    let map = texture.material?.map ?? texture.img?.tex;

    if (map.wrapS === wrapMode && map.wrapT === wrapMode)
        return;

    map.wrapS = wrapMode;
    map.wrapT = wrapMode;
    map.needsUpdate = true;

}

function defer(lambda) {
    deferred.push(lambda);
}

function deferDelete(deletable) {
    if (deletable.delete == undefined) {
        console.warn('deferDelete() called with object that isn\'t deletable: ', deletable);
        return;
    }
    defer(() => deletable.delete());
    return deletable;
}

})();
