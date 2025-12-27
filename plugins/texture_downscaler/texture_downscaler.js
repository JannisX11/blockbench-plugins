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
    creation_date: '2025-10-26',
    version:       '1.0.0',
    variant:       'both',
    min_version:   '5.0.3',
    has_changelog: false,
    tags:          [ 'Texture', 'Viewport', 'Utility' ],
	repository:    'https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/texture_downscaler',
    
    onload() {

        // Downscale properties for Texture
        deferDelete(new Property(Texture, 'number', 'downscale_target_width',  {default: undefined}));
        deferDelete(new Property(Texture, 'number', 'downscale_target_height', {default: undefined}));
        deferDelete(new Property(Texture, 'string', 'downscale_filter', {default: undefined}));

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
                    text: 'Non-destructively downscale texture.',
                },
                ['ratio']: {
                    type: 'number',
                    label: 'Scale',
                    value: 4,
                    min: 1,
                },
                ['target']: {
                    type: 'vector',
                    label: 'Target Size',
                    dimensions: 2,
                    value: [128, 128],
                    min: 1,
                    max: 2048,
                },
                ['filter']: {
                    type: 'select',
                    label: 'Downsampling Filter',
                    options: {
                        ['nearest']: 'Nearest',
                        ['linear' ]: 'Linear',
                    },
                    value: 'nearest',
                },
            },
            onOpen() {
                onOpenDownscaleDialog(downscaleDialog)
            },
            onConfirm(result) {
                onConfirmDownscaleDialog(result)
            },
        }));

        // Alter properties dialog
        // Hook into Texture.openMenu() to edit the dialog after it's opened
        replaceMethod(Texture, 'openMenu', function (original) {
            original();
            let dialog = Dialog.stack[0];
            alterTexturePropertiesDialog(dialog);
        });

        // Hook into Texture.updateMaterial() to update the downscaled version of the texture
        // whenever the original changes
        replaceMethod(Texture, 'updateMaterial', function (original) {
            original();
            updateDownscaledTexture(this);
            return this;
        });

        // Hook into Texture.load() to make sure downscaled version
        // is updated whenever a texture is first loaded
        replaceMethod(Texture, 'load', function (original, cb) {
            return original((texture) => {
                updateDownscaledTexture(texture);
                updateTexturesPanelItem(texture);
                if (cb != undefined)
                    return cb(texture);
            });
        });

        // Hook into Texture.updateLayerChanges() to make sure the downscaled version
        // is updated when a texture gets painted on in Paint mode
        replaceMethod(Texture, 'updateLayerChanges', function (original, update_data_url) {
            original(update_data_url);
            updateDownscaledTexture(this);
            return this;
        });

        // Update any textures that are already loaded when the plugin loads
        updateAllDownscaledTextures();
        updateAllTexturesPanelItems();

        // Update textures when switching projects
        deferDelete(Blockbench.addListener('select_project',
            () => setTimeout(updateAllTexturesPanelItems)));

        // Restore all textures to their original versions when the plugin is unloaded
        defer(restoreAllDownscaledTextures);
        defer(restoreAllTexturePanelItems);
    },

    onunload() {
        runDeferred();
    },

});

//  ######## ######## ##     ## ######## ##     ## ########  ########  ######  
//     ##    ##        ##   ##     ##    ##     ## ##     ## ##       ##    ## 
//     ##    ##         ## ##      ##    ##     ## ##     ## ##       ##       
//     ##    ######      ###       ##    ##     ## ########  ######    ######  
//     ##    ##         ## ##      ##    ##     ## ##   ##   ##             ## 
//     ##    ##        ##   ##     ##    ##     ## ##    ##  ##       ##    ## 
//     ##    ######## ##     ##    ##     #######  ##     ## ########  ######  

function updateAllDownscaledTextures() {
    for (let texture of ModelProject.all.flatMap(p => p.textures))
        updateDownscaledTexture(texture);
}

function updateDownscaledTexture(texture) {

    // Downscaling disabled
    if (!texture.downscale_target_width) {
        if (texture.material.map.image !== texture.canvas) {
            texture.material.map.image = texture.canvas;
            texture.material.map.needsUpdate = true;
        }
        return;
    }

    if (texture.downscale_canvas == undefined) {
        texture.downscale_canvas = document.createElement('canvas');
        texture.downscale_ctx = texture.downscale_canvas.getContext('2d');
    }

    texture.downscale_canvas.width  = texture.downscale_target_width;
    texture.downscale_canvas.height = texture.downscale_target_height;

    // Smoothing quality 'medium' should be linear
    texture.downscale_ctx.imageSmoothingQuality = 'medium';
    texture.downscale_ctx.imageSmoothingEnabled = texture.downscale_filter === 'linear';

    texture.downscale_ctx.drawImage(texture.canvas, 0, 0, texture.downscale_target_width, texture.downscale_target_height);

    // Tell THREE.js to use the right canvas
    let isDownscaled = texture.downscale_target_width < texture.width;
    texture.material.map.image = isDownscaled ? texture.downscale_canvas : texture.canvas;
    texture.material.map.needsUpdate = true;
}

function restoreAllDownscaledTextures() {
    restoreAllTexturePanelItems();
    for (let texture of ModelProject.all.flatMap(p => p.textures)) {
        texture.material.map.image = texture.canvas;
        texture.material.map.needsUpdate = true;
    }
}

//  ########     ###    ##    ## ######## ##       
//  ##     ##   ## ##   ###   ## ##       ##       
//  ##     ##  ##   ##  ####  ## ##       ##       
//  ########  ##     ## ## ## ## ######   ##       
//  ##        ######### ##  #### ##       ##       
//  ##        ##     ## ##   ### ##       ##       
//  ##        ##     ## ##    ## ######## ######## 

function updateAllTexturesPanelItems() {
    for (let texture of Texture.all)
        updateTexturesPanelItem(texture);
}

function updateTexturesPanelItem(texture) {
    let textureLi = document.querySelector(`#texture_list>[texid="${texture.uuid}"]`);
    if (textureLi == undefined)
        return;

    let ratio = texture.width / (texture.downscale_target_width || texture.width);
    ratio = Math.roundTo(ratio, 2);

    textureLi.style.alignItems = 'start';
    let textureResDiv = textureLi.querySelector(`.texture_res`);
    textureResDiv.style.transform = ratio > 1 ? 'translateY(-5px)' : '';

    if (textureResDiv.nextElementSibling == undefined) {
        textureResDiv.parentElement.appendChild(Interface.createElement('div', {
            class: 'texture_res texture_downscale',
            style: 'transform: translateY(-10px);',
        }));
    }

    textureResDiv.nextElementSibling.style.display = ratio > 1 ? 'block' : 'none';
    textureResDiv.nextElementSibling.textContent = `Downscaled 1:${ratio} (${texture.downscale_filter})`;
}

function restoreAllTexturePanelItems() {
    for (let texture of ModelProject.all.flatMap(p => p.textures)) {
        let textureLi = document.querySelector(`#texture_list>[texid="${texture.uuid}"]`);
        if (textureLi == undefined)
            continue;

        let textureResDiv = textureLi.querySelector(`.texture_res`);
        textureResDiv.style.transform = '';

        textureResDiv.nextElementSibling?.remove();
    }
}

//  ########  ####    ###    ##        #######   ######   
//  ##     ##  ##    ## ##   ##       ##     ## ##    ##  
//  ##     ##  ##   ##   ##  ##       ##     ## ##        
//  ##     ##  ##  ##     ## ##       ##     ## ##   #### 
//  ##     ##  ##  ######### ##       ##     ## ##    ##  
//  ##     ##  ##  ##     ## ##       ##     ## ##    ##  
//  ########  #### ##     ## ########  #######   ######   

function onOpenDownscaleDialog(dialog) {
    let texture = Texture.selected;
    let ratio = texture.width / (texture.downscale_target_width || texture.width);
    ratio = Math.roundTo(ratio, 2);
    let targetWidth = texture.downscale_target_width || texture.width;
    let targetHeight = texture.downscale_target_height || texture.height;

    let ratioInput        = dialog.object.querySelector('#ratio');
    let targetWidthInput  = dialog.object.querySelector('#target_0');
    let targetHeightInput = dialog.object.querySelector('#target_1');
    let filterInput       = dialog.object.querySelector('#filter');

    ratioInput.value        = '' + ratio;
    targetWidthInput.value  = '' + targetWidth;
    targetHeightInput.value = '' + targetHeight;
    filterInput.value       = texture.downscale_filter || 'nearest';

    ratioInput.oninput        = () => changeRatio('ratio',  false);
    targetWidthInput.oninput  = () => changeRatio('width',  false);
    targetHeightInput.oninput = () => changeRatio('height', false);

    function changeRatio(changed) {
        let result = dialog.getFormResult();

        let newRatio = changed == 'ratio'  ? result.ratio
                     : changed == 'width'  ? texture.width  / result.target[0]
                     : changed == 'height' ? texture.height / result.target[1]
                     : 1;

        newRatio = Math.max(1, Math.roundTo(newRatio, 2));
        let newWidth  = Math.ceil(texture.width / newRatio);
        let newHeight = Math.ceil(texture.height / newRatio);

        if (changed != 'ratio')  ratioInput.value        = '' + newRatio;
        if (changed != 'width')  targetWidthInput.value  = '' + newWidth;
        if (changed != 'height') targetHeightInput.value = '' + newHeight;
    } 
}

function onConfirmDownscaleDialog(result) {
    let texture = Texture.selected;

    Undo.initEdit({ textures: [texture] });

    texture.downscale_target_width = result.target[0];
    texture.downscale_target_height = result.target[1];
    texture.downscale_filter = result.filter;

    Undo.finishEdit('Change texture downscaling');

    updateDownscaledTexture(texture);
    updateTexturesPanelItem(texture);
}

//  ########  ########   #######  ########  ######## ########  ######## #### ########  ######  
//  ##     ## ##     ## ##     ## ##     ## ##       ##     ##    ##     ##  ##       ##    ## 
//  ##     ## ##     ## ##     ## ##     ## ##       ##     ##    ##     ##  ##       ##       
//  ########  ########  ##     ## ########  ######   ########     ##     ##  ######    ######  
//  ##        ##   ##   ##     ## ##        ##       ##   ##      ##     ##  ##             ## 
//  ##        ##    ##  ##     ## ##        ##       ##    ##     ##     ##  ##       ##    ## 
//  ##        ##     ##  #######  ##        ######## ##     ##    ##    #### ########  ######  

function alterTexturePropertiesDialog(dialog) {

    let nameInput = dialog.object.querySelector('#name');
    let form = nameInput.parentElement.parentElement;

    let texture = Texture.selected;
    let ratio = texture.width / (texture.downscale_target_width || texture.width);
    ratio = Math.roundTo(ratio, 2);
    let downscaleText = ratio > 1 ? `1:${ratio} (${texture.downscale_filter})` : 'Disabled';

    let editButton =  Interface.createElement('button', {
        style: 'height: 100%; min-width: 80px; margin-left: 10px;',
    }, 'Edit');
    editButton.onclick = () => {
        dialog.close();
        BarItems['downscale_texture'].trigger();
    };

    form.appendChild(Interface.createElement('hr'));
    form.appendChild(Interface.createElement('div',
        { class: 'dialog_bar bar form_bar', },
        [
            Interface.createElement('label', {
                class: 'name_space_left',
                for: 'downscaling',
            }, 'Downscaling'),
            Interface.createElement('div', {
                id: 'downscaling',
                class: 'half',
            }, [
                downscaleText,
                editButton,
            ]),
        ],
    ));
    
}

//  ##     ## ######## #### ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//  ##     ##    ##     ##  ##       
//   #######     ##    #### ######## 

function replaceMethod(klass, methodName, newMethod) {
    let originalMethod = klass.prototype[methodName];
    klass.prototype[methodName] = function (...args) {
        let originalCaller = (...a) => originalMethod.apply(this, a);
        return newMethod.apply(this, [originalCaller, ...args]);
    };
    defer(() => klass.prototype[methodName] = originalMethod);
}

function insertAfterAndDeferRemove(array, before, item) {
    array.splice(array.indexOf(before) + 1, 0, item);
    defer(() => array.remove(item));
}

function defer(lambda) {
    deferred.push(lambda);
}

function deferDelete(deletable) {
    defer(() => deletable.delete());
    return deletable;
}

function runDeferred() {
    for (let lambda of deferred.reverse())
        lambda();
}

})();
