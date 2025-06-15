(function() {

let deferred = [];

Plugin.register('repeating_textures', {

    title:         'Repeating Textures',
    author:        '0x13F',
    description:   'Enables repeating textures',
    icon:          'icon.png',
    creation_date: '2025-06-15',
    version:       '2.0.0',
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
                applyRepeatingTextureFor(this);
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
                applyRepeatingTextures();
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
        applyRepeatingTextures();
        // Disable on unload
        defer(() => applyRepeatingTextures(false));

    },

    onunload() {

        for (let lambda of deferred.reverse())
            lambda();
        
    },

});

function applyRepeatingTextures(force = undefined) {

    Texture.all.forEach(t => applyRepeatingTextureFor(t, force));

}

function applyRepeatingTextureFor(texture, force = undefined) {

    if (force ?? Settings.get('repeating_textures')) {
        if (texture.img.tex.wrapS !== THREE.RepeatWrapping
            || texture.img.tex.wrapT !== THREE.RepeatWrapping) {
            texture.img.tex.wrapS = THREE.RepeatWrapping;
            texture.img.tex.wrapT = THREE.RepeatWrapping;
            texture.img.tex.needsUpdate = true;
        }
    } else {
        if (texture.img.tex.wrapS !== THREE.ClampToEdgeWrapping
            || texture.img.tex.wrapT !== THREE.ClampToEdgeWrapping) {
            texture.img.tex.wrapS = THREE.ClampToEdgeWrapping;
            texture.img.tex.wrapT = THREE.ClampToEdgeWrapping;
            texture.img.tex.needsUpdate = true;
        }
    }

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
