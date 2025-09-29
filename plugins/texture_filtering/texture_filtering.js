// Based on the Repeating Textures plugin by 0x13F with permission. Thanks!
(function() {

let deferred = [];

Plugin.register('texture_filtering', {

    title:         'Texture Filtering',
    author:        'HeyItsDuke, 0x13F',
    description:   'Toggles between Nearest (Blockbench default) and Linear texture filtering',
    icon:          'deblur',
    creation_date: '2025-09-01',
    version:       '1.0.0',
    variant:       'both',
    min_version:   '4.12.4',
    has_changelog: false,
    tags:          [ 'Texture', 'Viewport', 'Utility' ],
	repository:    'https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/texture_filtering',
    
    onload() {

        // Hook into the Texture.getMaterial() method to set the filter mode
        {
            let original = Texture.prototype.getMaterial;
            Texture.prototype.getMaterial = function () {
                let result = original.apply(this);
                updateTextureFilterMode(this);
                return result;
            };
            defer(() => Texture.prototype.getMaterial = original);
        }

        // Setting
        deferDelete(new Setting('texture_filtering', {
            name: 'Texture Filtering',
            description: 'Toggles between Nearest (Blockbench default) and Linear texture filtering',
            category: 'view',
            value: true,
            onChange() {
                updateAllTextureFilterModes();
            },
        }));

        // Toggle
        let filterTexturesToggle = deferDelete(new Toggle('texture_filtering_toggle', {
            name: 'Texture Filtering',
            description: 'Toggles between Nearest (Blockbench default) and Linear texture filtering',
            icon: 'deblur',
            category: 'view',
            linked_setting: 'texture_filtering',
        }));
        let shadingToggleIndex = MenuBar.menus.view.structure.indexOf('toggle_shading');
        let filterTexturesToggleIndex = shadingToggleIndex + 1;
        MenuBar.menus.view.structure.splice(filterTexturesToggleIndex, 0, filterTexturesToggle);
        defer(() => MenuBar.menus.view.structure.splice(MenuBar.menus.view.structure.indexOf(filterTexturesToggle), 1));

        // Apply setting on load
        updateAllTextureFilterModes();
        // Disable on unload
        defer(() => updateAllTextureFilterModes(false));

    },

    onunload() {

        for (let lambda of deferred.reverse())
            lambda();
        
    },

});

function updateAllTextureFilterModes(force = undefined) {

    for (let texture of Texture.all)
        updateTextureFilterMode(texture, force);

}

// update the filter mode for a specific texture
// based on the filter_textures setting, 
// unless a 'force' parameter is given (true or false)
function updateTextureFilterMode(texture, force = undefined) {

    // Decide whether to use filtered or non-filtered textures
    let useFiltering;
    // if a 'force' parameter was given, use that
    if (force != undefined) {
        useFiltering = force;
    // otherwise read the 'filter_textures' setting from blockbench
    // which we created earlier
    } else {
        useFiltering = Settings.get('texture_filtering');
    }

    // The actual value THREE.js wants for the filter mode we want to use 
    let filterMode;
    // If we want filtered textures, use THREE.LinearFilter
    if (useFiltering) {
        filterMode = THREE.LinearFilter;
    // Otherwise use the default THREE.NearestFilter
    } else {
        filterMode = THREE.NearestFilter;
    }

    // Find the texture object we need to edit
    // In Blockbench 5.0 the object was moved from texture.img.tex to texture.material.map
    let map;
    // If texture.material.map exists that means we're in 5.0 so we'll use that
    if (texture.material?.map) {
        map = texture.material.map;
    // Otherwise use the old texture.img.tex
    } else {
        map = texture.img.tex;
    }

    // If the filter mode is already correct, stop early
    if (map.minFilter === filterMode && map.magFilter === filterMode) {
        return;
    }

    // Set the filter mode
    map.minFilter = filterMode;
    map.magFilter = filterMode;

    // Let THREE.js know we changed something
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
