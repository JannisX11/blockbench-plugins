(function() {

let deferred = [];

//  ########  ##       ##     ##  ######   #### ##    ## 
//  ##     ## ##       ##     ## ##    ##   ##  ###   ## 
//  ##     ## ##       ##     ## ##         ##  ####  ## 
//  ########  ##       ##     ## ##   ####  ##  ## ## ## 
//  ##        ##       ##     ## ##    ##   ##  ##  #### 
//  ##        ##       ##     ## ##    ##   ##  ##   ### 
//  ##        ########  #######   ######   #### ##    ## 

Plugin.register('texture_downscaler', {

    title:         'Texture Downscaler',
    author:        '0x13F',
    description:   'Downscale textures non-destructively',
    icon:          'icon.png',
    creation_date: '//TODO',
    version:       '1.0.0',
    variant:       'both',
    min_version:   '5.0.3',
    has_changelog: false,
    tags:          [ 'Texture', 'Viewport', 'Utility' ],
	repository:    'https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/texture_downscaler',
    
    onload() {

        // Downscale action
        let downscaleAction = deferDelete(new Action('downscale_texture', {
            name: 'Downscale Texture...',
            icon: 'photo_size_select_large',
		    category: 'textures',
		    condition: () => Texture.selected,
            click() {  
                downscaleDialog.show();
            },
        }));
        insertAfterAndDeferRemove(MenuBar.menus.image.structure, 'resize_texture', downscaleAction)
        insertAfterAndDeferRemove(Texture.prototype.menu.structure, 'resize_texture', downscaleAction)

        // Downscale dialog
        let downscaleDialog = deferDelete(new Dialog('downscale_dialog', {
            title: 'Downscale Texture',
            form: {
                ['info']: {
                    type: 'info',
                    text: 'Non-destructively downscale texture',
                },
                ['ratio']: {
                    type: 'range',
                    label: 'Ratio',
                    value: 1,
                    min: 1,
                    max: 8,
                    step: 1,
                    editable_range_label: true,
                    force_step: false,
                },
                ['target']: {
                    type: 'vector',
                    label: 'Target size',
                    dimensions: 2,
                    value: [128, 128],
                    min: 1,
                    max: 2048,
                    linked_ratio: false,
                },
                ['preview']: {
                    type: 'info',
                    text: 'Preview:',
                },
            },
            onOpen() {
                onOpenDownscaleDialog(downscaleDialog)
            },
            onConfirm(result) {
                onConfirmDownscaleDialog(downscaleDialog, result)
            },
        }));

        // Alter properties dialog
        // Hook into Texture.openMenu() to edit the dialog after it's opened
        {
            let original = Texture.prototype.openMenu;
            Texture.prototype.openMenu = function () {
                original()
                let dialog = Dialog.stack[0];
                alterTexturePropertiesDialog(dialog)

            };
            defer(() => Texture.prototype.openMenu = original);
        }
    },

    onunload() {

        for (let lambda of deferred.reverse())
            lambda();
        
    },

});

//  ########  ####    ###    ##        #######   ######   
//  ##     ##  ##    ## ##   ##       ##     ## ##    ##  
//  ##     ##  ##   ##   ##  ##       ##     ## ##        
//  ##     ##  ##  ##     ## ##       ##     ## ##   #### 
//  ##     ##  ##  ######### ##       ##     ## ##    ##  
//  ##     ##  ##  ##     ## ##       ##     ## ##    ##  
//  ########  #### ##     ## ########  #######   ######   

function onOpenDownscaleDialog(dialog) {

}

function onConfirmDownscaleDialog(dialog, result) {

}

//  ########  ########   #######  ########  ######## ########  ######## #### ########  ######  
//  ##     ## ##     ## ##     ## ##     ## ##       ##     ##    ##     ##  ##       ##    ## 
//  ##     ## ##     ## ##     ## ##     ## ##       ##     ##    ##     ##  ##       ##       
//  ########  ########  ##     ## ########  ######   ########     ##     ##  ######    ######  
//  ##        ##   ##   ##     ## ##        ##       ##   ##      ##     ##  ##             ## 
//  ##        ##    ##  ##     ## ##        ##       ##    ##     ##     ##  ##       ##    ## 
//  ##        ##     ##  #######  ##        ######## ##     ##    ##    #### ########  ######  

function alterTexturePropertiesDialog(dialog) {

}

//  ##     ## ######## #### ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//   #######     ##    #### ######## 

function insertAfterAndDeferRemove(array, before, item) {
    array.splice(array.indexOf(before) + 1, 0, item)
    defer(() => array.remove(item))
}

function defer(lambda) {
    deferred.push(lambda);
}

function deferDelete(deletable) {
    defer(() => deletable.delete());
    return deletable;
}

})();
