const AVATAR_BLACK_LOADER_ICON = 'data:image/png;base64,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'

let loadAction;

Plugin.register('hytale_avatar_loader', {
    title: 'Hytale Avatar Loader',
    author: 'PasteDev',
    description: 'Loads Hytale avatar models with textures and colors from JSON files',
    icon: 'icon.png',
    version: '1.0.0',
    min_version: '5.0.7',
    variant: 'desktop',
    tags: ['Hytale'],
    onload() {
        Blockbench.addCSS(`
            .outliner_node.avatar_attachment_hidden {
                display: none !important;
            }
            .action_load_avatar .icon {
                filter: brightness(1.2) contrast(1.1) !important;
            }
        `);
        
        function hideAttachmentsFromOutliner() {
            if (!Panels.outliner?.node) return;
            const outlinerNode = Panels.outliner.node;
            
            if (typeof Collection !== 'undefined' && Collection.all) {
                for (const collection of Collection.all) {
                    if (collection.export_codec === 'blockymodel') {
                        for (const child of collection.getChildren()) {
                            const node = outlinerNode.querySelector(`[id="${child.uuid}"]`);
                            if (node) {
                                node.classList.add('avatar_attachment_hidden');
                            }
                        }
                    }
                }
            }
        }
        
        Blockbench.on('update_selection', hideAttachmentsFromOutliner);
        Blockbench.on('finished_edit', hideAttachmentsFromOutliner);
        setTimeout(hideAttachmentsFromOutliner, 500);
        
        loadAction = new Action('load_avatar', {
            name: 'Load Avatar from JSON',
            description: 'Loads a complete avatar from a JSON file',
            icon: AVATAR_BLACK_LOADER_ICON || 'icon-player_head',
            condition: {formats: ['hytale_character']},
            click: function() {
                
                function expandPath(path) {
                    if (path.includes('%appdata%')) {
                        try {
                            const os = requireNativeModule('os');
                            const appDataPath = process.env.APPDATA || (os.homedir ? pathJoin(os.homedir(), 'AppData', 'Roaming') : '');
                            return path.replace(/%appdata%/gi, appDataPath);
                        } catch (err) {
                            try {
                                const appDataPath = process.env.APPDATA || '';
                                return path.replace(/%appdata%/gi, appDataPath);
                            } catch (e) {
                                return path;
                            }
                        }
                    }
                    return path;
                }
                
                function getPathModule() {
                    try {
                        return requireNativeModule('path');
                    } catch (err) {
                        try {
                            return require('path');
                        } catch (e) {
                            return null;
                        }
                    }
                }
                
                const pathModule = getPathModule();
                if (!pathModule) {
                    Blockbench.showMessageBox({
                        title: 'Error',
                        message: 'Could not load path module. This plugin requires the desktop version of Blockbench.',
                        buttons: ['OK']
                    });
                    return;
                }
                
                const pathJoin = pathModule.join;
                const skinFolderPath = expandPath('%appdata%\\Hytale\\UserData\\CachedPlayerSkins');
                
                Blockbench.showMessageBox({
                    title: 'Skin JSON File Location',
                    message: '**To load the avatar, you need to select the skin JSON file.**\n\n' +
                             '**Location:**\n' +
                             '`%appdata%\\Hytale\\UserData\\CachedPlayerSkins`\n\n' +
                             'Navigate to this folder and select your avatar JSON file.',
                    buttons: ['OK']
                }, () => {
                    Blockbench.import({
                        type: 'json',
                        extensions: ['json'],
                        multiple: false,
                        title: 'Select Avatar JSON File'
                    }, async (files) => {
                        if (!files || files.length === 0) return;
                        
                        const jsonFile = files[0];
                        let avatarData;
                        
                        try {
                            if (jsonFile.content) {
                                avatarData = JSON.parse(jsonFile.content);
                            } else {
                                throw new Error('Could not read file content');
                            }
                        } catch (err) {
                            Blockbench.showMessageBox({
                                title: 'Error',
                                message: `Error reading JSON file: ${err.message}`,
                                buttons: ['OK']
                            });
                            return;
                        }
                        
                        const assetsZipPath = expandPath('%appdata%\\Hytale\\install\\release\\package\\game\\latest');
                        
                        Blockbench.showMessageBox({
                            title: 'Assets.zip Location',
                            message: '**Now you need to select the Assets folder.**\n\n' +
                                     '**Step 1:** Extract `Assets.zip` from:\n' +
                                     '`%appdata%\\Hytale\\install\\release\\package\\game\\latest`\n\n' +
                                     '**Step 2:** Navigate to the extracted Assets folder and select it.\n\n' +
                                     '⚠️ **IMPORTANT:** You must extract Assets.zip first before selecting the folder.',
                            buttons: ['OK']
                        }, () => {
                            if (typeof Blockbench.pickDirectory === 'function') {
                                const assetsDir = Blockbench.pickDirectory({
                                    title: 'Select Assets Folder (extracted)',
                                    resource_id: 'avatar_assets_folder'
                                });
                                
                                if (!assetsDir) {
                                    Blockbench.showMessageBox({
                                        title: 'Error',
                                        message: 'You must select the Assets folder',
                                        buttons: ['OK']
                                    });
                                    return;
                                }
                                
                                loadAvatar(avatarData, assetsDir).catch((err) => {
                                    Blockbench.showMessageBox({
                                        title: 'Error',
                                        message: `Error loading avatar: ${err.message}`,
                                        buttons: ['OK']
                                    });
                                });
                            }
                        });
                    });
                });
            }
        });
        
        MenuBar.addAction(loadAction, 'file.import');
    },
    onunload() {
        if (loadAction) loadAction.delete();
    }
});

function getPath() {
    if (typeof require !== 'undefined') {
        try {
            return require('path');
        } catch (err) {
        }
    }
    return null;
}

async function loadAvatar(avatarData, assetsBasePath) {
    try {
        Blockbench.showStatusMessage('Loading avatar...', 2000);
        
        if (Format.id !== 'hytale_character') {
            if (typeof Format.select === 'function') {
                Format.select('hytale_character');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        if (typeof Project.newProject === 'function') {
            Project.newProject('hytale_character');
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        if (Project.name !== undefined) {
            Project.name = 'Avatar';
        }
        
        const path = getPath();
        if (!path) {
            Blockbench.showMessageBox({
                title: 'Error',
                message: 'Path module is not available. This plugin requires the desktop version of Blockbench.',
                buttons: ['OK']
            });
            return;
        }
        
        const pathJoin = path.join;
        const fs = requireNativeModule('fs');
        
        function findAssetsPath(basePath) {
            const normalizedPath = basePath.replace(/\\/g, '/');
            
            if (normalizedPath.endsWith('Assets') || normalizedPath.endsWith('Assets/')) {
                return basePath;
            }
            
            if (normalizedPath.includes('Assets/') || normalizedPath.includes('Assets\\')) {
                const assetsIndex = Math.max(normalizedPath.lastIndexOf('Assets/'), normalizedPath.lastIndexOf('Assets\\'));
                if (assetsIndex !== -1) {
                    const assetsPath = basePath.substring(0, assetsIndex + 'Assets'.length);
                    const cosmeticsPath = pathJoin(assetsPath, 'Cosmetics', 'CharacterCreator');
                    if (fs.existsSync(cosmeticsPath)) {
                        return assetsPath;
                    }
                }
            }
            
            const possiblePaths = [
                pathJoin(basePath, 'Assets'),
                pathJoin(basePath, '..', 'Assets'),
                pathJoin(basePath, '..', '..', 'Assets'),
                pathJoin(basePath, '..', '..', '..', 'Assets')
            ];
            
            for (const possiblePath of possiblePaths) {
                if (fs.existsSync(possiblePath)) {
                    const cosmeticsPath = pathJoin(possiblePath, 'Cosmetics', 'CharacterCreator');
                    if (fs.existsSync(cosmeticsPath)) {
                        return possiblePath;
                    }
                }
            }
            
            return null;
        }
        
        const actualAssetsPath = findAssetsPath(assetsBasePath);
        if (!actualAssetsPath) {
            Blockbench.showMessageBox({
                title: 'Error',
                message: `Could not find Assets folder.\n\nSelected path: ${assetsBasePath}\n\nPlease make sure you select the extracted Assets folder that contains the Cosmetics\\CharacterCreator directory.\n\nThe Assets folder should be extracted from Assets.zip and should contain:\n- Cosmetics\\CharacterCreator\\\n- Common\\`,
                buttons: ['OK']
            });
            return;
        }
        
        const characterCreatorPath = pathJoin(actualAssetsPath, 'Cosmetics', 'CharacterCreator');
        
        if (!fs.existsSync(characterCreatorPath)) {
            Blockbench.showMessageBox({
                title: 'Error',
                message: `Could not find CharacterCreator folder.\n\nAssets path: ${actualAssetsPath}\n\nExpected path: ${characterCreatorPath}\n\nPlease verify that the Assets folder is correctly extracted.`,
                buttons: ['OK']
            });
            return;
        }
        
        const mappingFiles = {
            'haircut': 'Haircuts.json',
            'pants': 'Pants.json',
            'overpants': 'Overpants.json',
            'undertop': 'Undertops.json',
            'overtop': 'Overtops.json',
            'shoes': 'Shoes.json',
            'headAccessory': 'HeadAccessory.json',
            'faceAccessory': 'FaceAccessory.json',
            'earAccessory': 'EarAccessory.json',
            'gloves': 'Gloves.json',
            'cape': 'Capes.json',
            'face': 'Faces.json',
            'eyes': 'Eyes.json',
            'eyebrows': 'Eyebrows.json',
            'facialHair': 'FacialHair.json',
            'bodyCharacteristic': 'BodyCharacteristics.json',
            'ears': 'Ears.json',
            'mouth': 'Mouths.json',
            'underwear': 'Underwear.json'
        };
        
        const mappingFilePaths = [];
        for (const [key, fileName] of Object.entries(mappingFiles)) {
            const filePath = pathJoin(characterCreatorPath, fileName);
            mappingFilePaths.push(filePath);
        }
        
        const hairColorsPath = pathJoin(characterCreatorPath, 'HairColors.json');
        const eyeColorsPath = pathJoin(characterCreatorPath, 'EyeColors.json');
        const genericColorsPath = pathJoin(characterCreatorPath, 'GenericColors.json');
        const gradientSetsPath = pathJoin(characterCreatorPath, 'GradientSets.json');
        
        Blockbench.read([hairColorsPath, eyeColorsPath, genericColorsPath, gradientSetsPath, ...mappingFilePaths], { readtype: 'text' }, (files) => {
            const mappings = {};
            let hairColors = null;
            let eyeColors = null;
            let genericColors = null;
            let gradientSets = null;
            
            if (files[0] && files[0].content) {
                try {
                    hairColors = JSON.parse(files[0].content);
                } catch (err) {
                }
            }
            
            if (files[1] && files[1].content) {
                try {
                    eyeColors = JSON.parse(files[1].content);
                } catch (err) {
                }
            }
            
            if (files[2] && files[2].content) {
                try {
                    genericColors = JSON.parse(files[2].content);
                } catch (err) {
                }
            }
            
            if (files[3] && files[3].content) {
                try {
                    gradientSets = JSON.parse(files[3].content);
                } catch (err) {
                }
            }
            
            for (let i = 4; i < files.length; i++) {
                const file = files[i];
                const key = Object.keys(mappingFiles)[i - 4];
                const fileName = mappingFiles[key];
                
                if (file && file.content) {
                    try {
                        mappings[key] = JSON.parse(file.content);
                    } catch (err) {
                    }
                }
            }
            
            if (Object.keys(mappings).length === 0) {
                Blockbench.showMessageBox({
                    title: 'Error',
                    message: `Could not load mapping files.\n\nSearched path: ${characterCreatorPath}\n\nVerify that the Assets folder contains Cosmetics\\CharacterCreator with the JSON files.`,
                    buttons: ['OK']
                });
                return;
            }
            
            continueLoadingAvatar(avatarData, actualAssetsPath, mappings, pathJoin, hairColors, eyeColors, genericColors, gradientSets);
        });
    } catch (err) {
        throw err;
    }
}

function getGradientSetForField(field, item, gradientSets, variantItem = null, itemId = null) {
    if (!gradientSets || !Array.isArray(gradientSets)) {
        return null;
    }
    
    const fieldToGradientSet = {
        'bodyCharacteristic': 'Skin',
        'haircut': 'Hair',
        'eyebrows': 'Hair',
        'eyes': 'Eyes_Gradient',
        'facialHair': 'Hair'
    };
    
    const gradientSetId = fieldToGradientSet[field];
    if (gradientSetId) {
        const found = gradientSets.find(gs => gs.Id === gradientSetId);
        if (found) return found;
    }
    
    const itemToUse = variantItem || item;
    
    if (itemToUse && itemToUse.GradientSet) {
        const found = gradientSets.find(gs => gs.Id === itemToUse.GradientSet);
        if (found) return found;
    }
    
    if (itemToUse && itemToUse.MaterialType) {
        const found = gradientSets.find(gs => gs.Id === itemToUse.MaterialType);
        if (found) return found;
    }
    
    if (field === 'undertop' || field === 'overtop' || field === 'pants' || field === 'overpants' || 
        field === 'shoes' || field === 'gloves' || field === 'cape' || field === 'headAccessory' ||
        field === 'faceAccessory' || field === 'earAccessory' || field === 'underwear') {
        
        const checkGradientSet = (searchText) => {
            const lowerText = searchText.toLowerCase();
            if (lowerText.includes('colored_cotton') || lowerText.includes('coloredcotton') || lowerText.includes('colored_')) {
                return gradientSets.find(gs => gs.Id === 'Colored_Cotton');
            } else if (lowerText.includes('shiny_fabric') || lowerText.includes('shinyfabric')) {
                return gradientSets.find(gs => gs.Id === 'Shiny_Fabric');
            } else if (lowerText.includes('fantasy_cotton') || lowerText.includes('fantasycotton') || 
                      (lowerText.includes('fantasy') && !lowerText.includes('dark'))) {
                return gradientSets.find(gs => gs.Id === 'Fantasy_Cotton');
            } else if (lowerText.includes('pastel_cotton') || lowerText.includes('pastelcotton') || lowerText.includes('pastel')) {
                return gradientSets.find(gs => gs.Id === 'Pastel_Cotton');
            } else if (lowerText.includes('faded_leather') || lowerText.includes('fadedleather') || lowerText.includes('leather')) {
                return gradientSets.find(gs => gs.Id === 'Faded_Leather');
            } else if (lowerText.includes('flashy_synthetic') || lowerText.includes('flashysynthetic') || lowerText.includes('synthetic')) {
                return gradientSets.find(gs => gs.Id === 'Flashy_Synthetic');
            } else if (lowerText.includes('jean') || lowerText.includes('jeans') || lowerText.includes('denim')) {
                return gradientSets.find(gs => gs.Id === 'Jean_Generic');
            } else if (lowerText.includes('dark_fantasy') || lowerText.includes('darkfantasy')) {
                return gradientSets.find(gs => gs.Id === 'Fantasy_Cotton_Dark');
            } else if (lowerText.includes('ornamented_metal') || lowerText.includes('ornamentedmetal') || lowerText.includes('metal')) {
                return gradientSets.find(gs => gs.Id === 'Ornamented_Metal');
            } else if (lowerText.includes('rotten_fabric') || lowerText.includes('rottenfabric')) {
                return gradientSets.find(gs => gs.Id === 'Rotten_Fabric');
            }
            return null;
        };
        
        const greyscaleTexture = itemToUse ? itemToUse.GreyscaleTexture : null;
        const itemIdToCheck = itemId || (item ? item.Id : null);
        
        if (greyscaleTexture) {
            const textureGradient = checkGradientSet(greyscaleTexture);
            if (textureGradient) {
                return textureGradient;
            }
        }
        
        if (itemIdToCheck) {
            const itemGradient = checkGradientSet(itemIdToCheck);
            if (itemGradient) {
                return itemGradient;
            }
        }
        
        const defaultGradientSet = gradientSets.find(gs => gs.Id === 'Colored_Cotton');
        if (defaultGradientSet) {
            return defaultGradientSet;
        }
    }
    
    return null;
}

function applyGradientMap(baseImagePath, gradientMapPath, outputPath, fs, pathJoin) {
    return new Promise((resolve, reject) => {
        try {
            const fsSync = requireNativeModule('fs');
            const baseBuffer = fsSync.readFileSync(baseImagePath);
            const gradientBuffer = fsSync.readFileSync(gradientMapPath);
            
            const baseBlob = new Blob([baseBuffer], { type: 'image/png' });
            const gradientBlob = new Blob([gradientBuffer], { type: 'image/png' });
            
            const baseUrl = URL.createObjectURL(baseBlob);
            const gradientUrl = URL.createObjectURL(gradientBlob);
            
            const baseCanvas = document.createElement('canvas');
            const baseCtx = baseCanvas.getContext('2d');
            const baseImg = new Image();
            
            baseImg.onload = () => {
                baseCanvas.width = baseImg.width;
                baseCanvas.height = baseImg.height;
                baseCtx.drawImage(baseImg, 0, 0);
                const baseImageData = baseCtx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);
                
                const gradientCanvas = document.createElement('canvas');
                const gradientCtx = gradientCanvas.getContext('2d');
                const gradientImg = new Image();
                
                gradientImg.onload = () => {
                    gradientCanvas.width = 256;
                    gradientCanvas.height = 1;
                    gradientCtx.drawImage(gradientImg, 0, 0, 256, 1);
                    const gradientMapData = gradientCtx.getImageData(0, 0, 256, 1);
                    
                    const outputCanvas = document.createElement('canvas');
                    const outputCtx = outputCanvas.getContext('2d');
                    outputCanvas.width = baseCanvas.width;
                    outputCanvas.height = baseCanvas.height;
                    const outputImageData = outputCtx.createImageData(baseCanvas.width, baseCanvas.height);
                    
                    const isColorfulTexture = baseImagePath.toLowerCase().includes('colorful.png');
                    const grayscaleThreshold = 15;
                    
                    for (let i = 0; i < baseImageData.data.length; i += 4) {
                        const r = baseImageData.data[i];
                        const g = baseImageData.data[i + 1];
                        const b = baseImageData.data[i + 2];
                        const a = baseImageData.data[i + 3];
                        
                        if (isColorfulTexture) {
                            const luminance = Math.round(
                                r * 0.299 + 
                                g * 0.587 + 
                                b * 0.114
                            );
                            
                            const gradientIndex = Math.min(255, Math.max(0, luminance)) * 4;
                            
                            outputImageData.data[i] = gradientMapData.data[gradientIndex];
                            outputImageData.data[i + 1] = gradientMapData.data[gradientIndex + 1];
                            outputImageData.data[i + 2] = gradientMapData.data[gradientIndex + 2];
                            outputImageData.data[i + 3] = a;
                        } else {
                            const maxChannel = Math.max(r, g, b);
                            const minChannel = Math.min(r, g, b);
                            const isGrayscale = (maxChannel - minChannel) <= grayscaleThreshold;
                            
                            if (isGrayscale) {
                                const luminance = Math.round(
                                    r * 0.299 + 
                                    g * 0.587 + 
                                    b * 0.114
                                );
                                
                                const gradientIndex = Math.min(255, Math.max(0, luminance)) * 4;
                                
                                outputImageData.data[i] = gradientMapData.data[gradientIndex];
                                outputImageData.data[i + 1] = gradientMapData.data[gradientIndex + 1];
                                outputImageData.data[i + 2] = gradientMapData.data[gradientIndex + 2];
                                outputImageData.data[i + 3] = a;
                            } else {
                                outputImageData.data[i] = r;
                                outputImageData.data[i + 1] = g;
                                outputImageData.data[i + 2] = b;
                                outputImageData.data[i + 3] = a;
                            }
                        }
                    }
                    
                    outputCtx.putImageData(outputImageData, 0, 0);
                    
                    outputCanvas.toBlob((blob) => {
                        URL.revokeObjectURL(baseUrl);
                        URL.revokeObjectURL(gradientUrl);
                        
                        if (!blob) {
                            reject(new Error('Failed to create blob from canvas'));
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = () => {
                            try {
                                const pathModule = requireNativeModule('path');
                                const outputDir = pathModule.dirname(outputPath);
                                
                                if (!fsSync.existsSync(outputDir)) {
                                    fsSync.mkdirSync(outputDir, { recursive: true });
                                }
                                
                                const buffer = Buffer.from(reader.result);
                                fsSync.writeFileSync(outputPath, buffer);
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        };
                        reader.onerror = () => {
                            reject(new Error('Failed to read blob'));
                        };
                        reader.readAsArrayBuffer(blob);
                    }, 'image/png');
                };
                
                gradientImg.onerror = () => {
                    URL.revokeObjectURL(baseUrl);
                    URL.revokeObjectURL(gradientUrl);
                    reject(new Error('Failed to load gradient image'));
                };
                
                gradientImg.src = gradientUrl;
            };
            
            baseImg.onerror = () => {
                URL.revokeObjectURL(baseUrl);
                URL.revokeObjectURL(gradientUrl);
                reject(new Error('Failed to load base image'));
            };
            
            baseImg.src = baseUrl;
        } catch (err) {
            reject(err);
        }
    });
}

async function processTexturesWithGradientMaps(itemInfo, assetsBasePath, gradientSets, mappings, pathJoin, fs) {
    const parentDir = pathJoin(assetsBasePath, '..');
    const baseTempDir = pathJoin(parentDir, 'temp_avatar_loader');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').substring(0, 19);
    const tempDir = pathJoin(baseTempDir, timestamp);
    
    try {
        if (!fs.existsSync(baseTempDir)) {
            fs.mkdirSync(baseTempDir, { recursive: true });
        }
        
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
    } catch (err) {
        throw new Error(`Failed to create temp directory: ${err.message}`);
    }
    
    const processedTextures = new Map();
    let processedCount = 0;
    let skippedCount = 0;
    let bodyCharacteristicColor = null;
    
    for (const info of itemInfo) {
        if (info.field === 'bodyCharacteristic' && info.color) {
            bodyCharacteristicColor = info.color;
        }
        
        if (!info.texturePath) {
            skippedCount++;
            continue;
        }
        
        if (!fs.existsSync(info.texturePath)) {
            skippedCount++;
            continue;
        }
        
        if (!info.color) {
            const item = info.item || (info.field !== 'bodyCharacteristic' && mappings[info.field] ? mappings[info.field].find(i => i.Id === info.itemId) : null);
            const variantItem = info.variantItem;
            const itemToUse = variantItem || item;
            
            let gradientSetToUse = null;
            let colorToUse = null;
            
            if (itemToUse && itemToUse.GradientSet) {
                gradientSetToUse = gradientSets.find(gs => gs.Id === itemToUse.GradientSet);
                if (gradientSetToUse && bodyCharacteristicColor) {
                    colorToUse = bodyCharacteristicColor;
                }
            } else if ((info.field === 'face' || info.field === 'ears') && bodyCharacteristicColor) {
                gradientSetToUse = gradientSets.find(gs => gs.Id === 'Skin');
                colorToUse = bodyCharacteristicColor;
            }
            
            if (gradientSetToUse && colorToUse && gradientSetToUse.Gradients && gradientSetToUse.Gradients[colorToUse]) {
                const gradient = gradientSetToUse.Gradients[colorToUse];
                const gradientMapPath = pathJoin(assetsBasePath, 'Common', gradient.Texture);
                
                if (fs.existsSync(gradientMapPath) && fs.existsSync(info.texturePath)) {
                    const commonPath = pathJoin(assetsBasePath, 'Common');
                    let textureRelativePath = info.texturePath;
                    if (textureRelativePath.startsWith(commonPath)) {
                        textureRelativePath = textureRelativePath.substring(commonPath.length);
                        if (textureRelativePath.startsWith(pathJoin.sep) || textureRelativePath.startsWith('/') || textureRelativePath.startsWith('\\')) {
                            textureRelativePath = textureRelativePath.substring(1);
                        }
                    }
                    
                    const normalizedPath = textureRelativePath.replace(/\\/g, '/');
                    const pathParts = normalizedPath.split('/').filter(p => p);
                    const fileName = pathParts.pop();
                    const outputDir = pathJoin(tempDir, ...pathParts);
                    const outputPath = pathJoin(outputDir, fileName);
                    
                        try {
                            if (!fs.existsSync(outputDir)) {
                                fs.mkdirSync(outputDir, { recursive: true });
                            }
                            
                            await applyGradientMap(info.texturePath, gradientMapPath, outputPath, fs, pathJoin);
                            info.texturePath = outputPath;
                            processedTextures.set(info.texturePath, outputPath);
                            processedCount++;
                        } catch (err) {
                        }
                    continue;
                }
            }
            
            const commonPath = pathJoin(assetsBasePath, 'Common');
            let textureRelativePath = info.texturePath;
            if (textureRelativePath.startsWith(commonPath)) {
                textureRelativePath = textureRelativePath.substring(commonPath.length);
                if (textureRelativePath.startsWith(pathJoin.sep) || textureRelativePath.startsWith('/') || textureRelativePath.startsWith('\\')) {
                    textureRelativePath = textureRelativePath.substring(1);
                }
            }
            
            const normalizedPath = textureRelativePath.replace(/\\/g, '/');
            const pathParts = normalizedPath.split('/').filter(p => p);
            const fileName = pathParts.pop();
            const outputDir = pathJoin(tempDir, ...pathParts);
            const outputPath = pathJoin(outputDir, fileName);
            
            try {
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                
                const fsSync = requireNativeModule('fs');
                fsSync.copyFileSync(info.texturePath, outputPath);
                info.texturePath = outputPath;
                processedTextures.set(info.texturePath, outputPath);
                processedCount++;
            } catch (err) {
            }
            continue;
        }
        
        const item = info.item || (info.field !== 'bodyCharacteristic' && mappings[info.field] ? mappings[info.field].find(i => i.Id === info.itemId) : null);
        const variantItem = info.variantItem;
        
        const gradientSet = getGradientSetForField(info.field, item, gradientSets, variantItem, info.itemId);
        if (!gradientSet || !gradientSet.Gradients) {
            skippedCount++;
            continue;
        }
        
        const gradient = gradientSet.Gradients[info.color];
        if (!gradient || !gradient.Texture) {
            skippedCount++;
            continue;
        }
        
        const gradientMapPath = pathJoin(assetsBasePath, 'Common', gradient.Texture);
        
        if (!fs.existsSync(gradientMapPath)) {
            skippedCount++;
            continue;
        }
        
        if (!fs.existsSync(info.texturePath)) {
            skippedCount++;
            continue;
        }
        
        const commonPath = pathJoin(assetsBasePath, 'Common');
        let textureRelativePath = info.texturePath;
        if (textureRelativePath.startsWith(commonPath)) {
            textureRelativePath = textureRelativePath.substring(commonPath.length);
            if (textureRelativePath.startsWith(pathJoin.sep) || textureRelativePath.startsWith('/') || textureRelativePath.startsWith('\\')) {
                textureRelativePath = textureRelativePath.substring(1);
            }
        }
        
        const normalizedPath = textureRelativePath.replace(/\\/g, '/');
        const pathParts = normalizedPath.split('/').filter(p => p);
        const fileName = pathParts.pop();
        const outputDir = pathJoin(tempDir, ...pathParts);
        const outputPath = pathJoin(outputDir, fileName);
        
        try {
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            await applyGradientMap(info.texturePath, gradientMapPath, outputPath, fs, pathJoin);
            
            info.texturePath = outputPath;
            processedTextures.set(info.texturePath, outputPath);
            processedCount++;
        } catch (err) {
            if (err.message && err.message.includes('No image processing library')) {
                throw err;
            }
        }
    }
    
    return processedTextures;
}

async function continueLoadingAvatar(avatarData, assetsBasePath, mappings, pathJoin, hairColors, eyeColors, genericColors, gradientSets) {
    try {
        const loadOrder = [
            'bodyCharacteristic',
            'underwear',
            'pants',
            'undertop',
            'overtop',
            'overpants',
            'shoes',
            'face',
            'eyes',
            'eyebrows',
            'mouth',
            'ears',
            'haircut',
            'facialHair',
            'headAccessory',
            'faceAccessory',
            'earAccessory',
            'gloves',
            'cape'
        ];
        
        const modelPaths = [];
        const texturePaths = [];
        const itemInfo = [];
        
        for (const field of loadOrder) {
            const value = avatarData[field];
            if (!value) continue;
            
            const { itemId, color, variant } = parseValue(value);
            
            if (field === 'bodyCharacteristic') {
                const commonPath = pathJoin(assetsBasePath, 'Common');
                
                const modelPath = pathJoin(commonPath, 'Characters', 'Player.blockymodel');
                modelPaths.push(modelPath);
                
                let texturePath = null;
                
                if (itemId === 'Muscular') {
                    texturePath = pathJoin(commonPath, 'Characters', 'Player_Textures', 'Player_Muscular_Greyscale.png');
                } else if (itemId === 'Default') {
                    texturePath = pathJoin(commonPath, 'Characters', 'Player_Textures', 'Player_Greyscale.png');
                }
                
                itemInfo.push({ field, itemId, color, variant, modelPath, texturePath, item: null, variantItem: null });
                if (texturePath) {
                    texturePaths.push(texturePath);
                }
                continue;
            }
            
            const mapping = mappings[field];
            if (!mapping) {
                continue;
            }
            
            const item = mapping.find(i => i.Id === itemId);
            if (!item) {
                continue;
            }
            
            let modelPath = null;
            let texturePath = null;
            
            if (variant && item.Variants && item.Variants[variant]) {
                const variantItem = item.Variants[variant];
                modelPath = variantItem.Model;
                
                if (variantItem.Textures && color) {
                    if (variantItem.Textures[color]) {
                        texturePath = variantItem.Textures[color].Texture;
                    } else {
                        const availableColors = Object.keys(variantItem.Textures);
                        if (availableColors.length > 0) {
                            texturePath = variantItem.Textures[availableColors[0]].Texture;
                        }
                    }
                }
                if (!texturePath && variantItem.GreyscaleTexture) {
                    texturePath = variantItem.GreyscaleTexture;
                }
            } else {
                modelPath = item.Model;
                
                if (item.Textures && color) {
                    if (item.Textures[color]) {
                        texturePath = item.Textures[color].Texture;
                    } else {
                        const availableColors = Object.keys(item.Textures);
                        if (availableColors.length > 0) {
                            texturePath = item.Textures[availableColors[0]].Texture;
                        }
                    }
                }
                if (!texturePath && item.GreyscaleTexture) {
                    texturePath = item.GreyscaleTexture;
                }
            }
            
            if (modelPath) {
                const commonPath = pathJoin(assetsBasePath, 'Common');
                
                const fullModelPath = pathJoin(commonPath, modelPath);
                modelPaths.push(fullModelPath);
                const fullTexturePath = texturePath ? pathJoin(commonPath, texturePath) : null;
                let variantItem = null;
                if (variant && item.Variants && item.Variants[variant]) {
                    variantItem = item.Variants[variant];
                }
                
                itemInfo.push({ 
                    field, 
                    itemId, 
                    color, 
                    variant, 
                    modelPath: fullModelPath, 
                    texturePath: fullTexturePath,
                    item: item,
                    variantItem: variantItem
                });
                if (texturePath) {
                    texturePaths.push(fullTexturePath);
                }
            }
        }
        
        const fs = requireNativeModule('fs');
        
        if (gradientSets && fs) {
            try {
                await processTexturesWithGradientMaps(itemInfo, assetsBasePath, gradientSets, mappings, pathJoin, fs);
                Blockbench.showStatusMessage('Gradientmaps processed successfully', 2000);
            } catch (err) {
                Blockbench.showStatusMessage(`Error processing gradientmaps: ${err.message}`, 3000);
            }
        }
        
        Blockbench.read(modelPaths, { readtype: 'text' }, async (modelFiles) => {
            await loadAllModels(modelFiles, itemInfo, pathJoin, assetsBasePath);
        });
    } catch (err) {
        throw err;
    }
}

function parseValue(value) {
    const parts = value.split('.');
    const itemId = parts[0];
    let color = null;
    let variant = null;
    
    if (parts.length === 2) {
        color = parts[1];
    } else if (parts.length === 3) {
        color = parts[1];
        variant = parts[2];
    } else if (parts.length > 3) {
        color = parts[1];
        variant = parts.slice(2).join('.');
    }
    
    return { itemId, color, variant };
}

async function loadAllModels(modelFiles, itemInfo, pathJoin, assetsBasePath) {
    const isMainModel = (field) => field === 'bodyCharacteristic';
    
    for (let i = 0; i < modelFiles.length && i < itemInfo.length; i++) {
        const modelFile = modelFiles[i];
        const info = itemInfo[i];
        
        if (!modelFile || !modelFile.content) {
            continue;
        }
        
        try {
            const modelData = JSON.parse(modelFile.content);
            const texturePath = info.texturePath;
            
            if (isMainModel(info.field)) {
                await loadMainModel(modelData, texturePath, modelFile.path, info);
            } else {
                await loadAttachmentModel(modelData, texturePath, modelFile.path, info);
            }
        } catch (err) {
        }
    }
    
    try {
        if (typeof Canvas.updateView === 'function' && Project.root) {
            Canvas.updateView();
        }
        Blockbench.showStatusMessage('Avatar loaded successfully', 3000);
    } catch (err) {
        Blockbench.showStatusMessage('Avatar processed', 3000);
    }
}

function loadMainModel(modelData, texturePath, filePath, info) {
    if (!modelData || !modelData.nodes || !Array.isArray(modelData.nodes)) {
        return;
    }
    
    if (typeof Codecs === 'undefined' || !Codecs.blockymodel) {
        return;
    }
    
    try {
        const content = Codecs.blockymodel.parse(modelData, filePath, {});
        
        if (!content || !content.new_groups) {
            return;
        }
        
        let texturesToUse = [];
        
        if (texturePath) {
            try {
                let existingTexture = Texture.all.find(t => t.path === texturePath);
                if (existingTexture) {
                    if (existingTexture.uv_width !== existingTexture.width || existingTexture.uv_height !== existingTexture.height) {
                        existingTexture.uv_width = existingTexture.width;
                        existingTexture.uv_height = existingTexture.height;
                    }
                    texturesToUse.push(existingTexture);
                } else {
                    const texture = new Texture().fromPath(texturePath).add(false, true);
                    const updateUVSize = () => {
                        if (texture) {
                            if (texture.width && texture.height) {
                            texture.uv_width = texture.width;
                            texture.uv_height = texture.height;
                            } else if (texture.img && texture.img.width && texture.img.height) {
                                texture.uv_width = texture.img.width;
                                texture.uv_height = texture.img.height;
                                if (texture.width !== texture.img.width) texture.width = texture.img.width;
                                if (texture.height !== texture.img.height) texture.height = texture.img.height;
                            }
                            if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                                Canvas.updateAllFaces();
                            }
                        }
                    };
                    setTimeout(updateUVSize, 100);
                    setTimeout(updateUVSize, 300);
                    setTimeout(updateUVSize, 500);
                    setTimeout(updateUVSize, 1000);
                    texturesToUse.push(texture);
                }
            } catch (err) {
            }
        }
        
        if (content.new_textures && content.new_textures.length > 0) {
            if (texturePath) {
                for (const tex of content.new_textures) {
                    if (tex.path !== texturePath && typeof tex.remove === 'function') {
                        tex.remove(true);
                    } else if (tex.path === texturePath) {
                        if (tex.width && tex.height) {
                            tex.uv_width = tex.width;
                            tex.uv_height = tex.height;
                        }
                        if (texturesToUse.length === 0) {
                            texturesToUse.push(tex);
                        }
                    }
                }
            } else {
                for (const tex of content.new_textures) {
                    if (tex.width && tex.height) {
                        tex.uv_width = tex.width;
                        tex.uv_height = tex.height;
                    }
                }
                if (texturesToUse.length === 0) {
                    texturesToUse = content.new_textures;
                }
            }
        }
        
        const updateAllUVSizes = () => {
            for (const tex of texturesToUse) {
                if (tex) {
                    let width = tex.width;
                    let height = tex.height;
                    
                    if (!width || !height) {
                        if (tex.img && tex.img.width && tex.img.height) {
                            width = tex.img.width;
                            height = tex.img.height;
                            tex.width = width;
                            tex.height = height;
                        }
                    }
                    
                    if (width && height) {
                        if (tex.uv_width !== width || tex.uv_height !== height) {
                            tex.uv_width = width;
                            tex.uv_height = height;
                        }
                    }
                }
            }
            if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                Canvas.updateAllFaces();
            }
        };
        
        setTimeout(updateAllUVSizes, 300);
        setTimeout(updateAllUVSizes, 600);
        setTimeout(updateAllUVSizes, 1000);
        
        if (texturesToUse.length > 0) {
            const primaryTexture = texturesToUse[0];
            
            const existingDefault = Texture.all.find(t => t.use_as_default);
            if (existingDefault && existingDefault !== primaryTexture) {
                existingDefault.use_as_default = false;
            }
            
            primaryTexture.use_as_default = true;
            if (typeof primaryTexture.setAsDefaultTexture === 'function') {
                primaryTexture.setAsDefaultTexture();
            }
            
            if (typeof Cube !== 'undefined' && Cube.all) {
                const primaryTextureUuid = primaryTexture.uuid;
                for (const cube of Cube.all) {
                    for (const faceKey of ['north', 'south', 'east', 'west', 'up', 'down']) {
                        if (cube.faces && cube.faces[faceKey]) {
                            const face = cube.faces[faceKey];
                            if (face.texture === null || face.texture === undefined) {
                                face.texture = primaryTextureUuid;
                            }
                        }
                    }
                }
            }
            
            setTimeout(() => {
                try {
                    if (typeof Canvas !== 'undefined' && Canvas) {
                    if (typeof Canvas.updateAllFaces === 'function') {
                        Canvas.updateAllFaces(primaryTexture);
                    }
                        if (typeof Canvas.updateView === 'function' && Canvas.viewport) {
                        Canvas.updateView();
                    }
                    if (typeof Canvas.updateSelection === 'function') {
                        Canvas.updateSelection();
                    }
                    }
                } catch (err) {
                }
            }, 300);
        }
    } catch (err) {
    }
}

function loadAttachmentModel(modelData, texturePath, filePath, info) {
    if (!modelData || !modelData.nodes || !Array.isArray(modelData.nodes)) {
        return;
    }
    
    if (typeof Codecs === 'undefined' || !Codecs.blockymodel) {
        return;
    }
    
    const collectionName = info.itemId;
    const attachmentName = collectionName;
    
    try {
        const content = Codecs.blockymodel.parse(modelData, filePath, {attachment: attachmentName});
        
        if (!content || !content.new_groups) {
            return;
        }
        
        const newGroups = content.new_groups;
        const rootGroups = newGroups.filter(group => !newGroups.includes(group.parent));
        
        if (rootGroups.length === 0) {
            return;
        }
        
        if (content.new_textures && content.new_textures.length > 0) {
            for (const tex of content.new_textures) {
                if (texturePath && tex.path !== texturePath && typeof tex.remove === 'function') {
                    tex.remove(true);
                }
            }
        }
        
        const collection = new Collection({
            name: collectionName,
            children: rootGroups.map(g => g.uuid),
            export_codec: 'blockymodel',
            visibility: true
        });
        collection.add();
        collection.export_path = filePath;
        
        let texturesToProcess = [];
        
        if (texturePath) {
            try {
                let existingTexture = Texture.all.find(t => t.path === texturePath);
                if (existingTexture) {
                    if (existingTexture.uv_width !== existingTexture.width || existingTexture.uv_height !== existingTexture.height) {
                        existingTexture.uv_width = existingTexture.width;
                        existingTexture.uv_height = existingTexture.height;
                    }
                    texturesToProcess.push(existingTexture);
                } else {
                    const texture = new Texture().fromPath(texturePath).add(false);
                    const updateUVSize = () => {
                        if (texture) {
                            if (texture.width && texture.height) {
                            texture.uv_width = texture.width;
                            texture.uv_height = texture.height;
                            } else if (texture.img && texture.img.width && texture.img.height) {
                                texture.uv_width = texture.img.width;
                                texture.uv_height = texture.img.height;
                                if (texture.width !== texture.img.width) texture.width = texture.img.width;
                                if (texture.height !== texture.img.height) texture.height = texture.img.height;
                            }
                            if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                                Canvas.updateAllFaces();
                            }
                        }
                    };
                    setTimeout(updateUVSize, 100);
                    setTimeout(updateUVSize, 300);
                    setTimeout(updateUVSize, 500);
                    setTimeout(updateUVSize, 1000);
                    texturesToProcess.push(texture);
                }
            } catch (err) {
            }
        } else if (content.new_textures && content.new_textures.length > 0) {
            const matchingTexture = content.new_textures.find(t => t.path === texturePath);
            if (matchingTexture) {
                if (matchingTexture.width && matchingTexture.height) {
                    matchingTexture.uv_width = matchingTexture.width;
                    matchingTexture.uv_height = matchingTexture.height;
                }
                texturesToProcess = [matchingTexture];
            } else {
                const firstTexture = content.new_textures[0];
                if (firstTexture.width && firstTexture.height) {
                    firstTexture.uv_width = firstTexture.width;
                    firstTexture.uv_height = firstTexture.height;
                }
                texturesToProcess = [firstTexture];
            }
        }
        
        if (texturesToProcess.length > 0) {
            let textureGroup = TextureGroup.all.find(tg => tg.name === attachmentName);
            if (!textureGroup) {
                textureGroup = new TextureGroup({ name: attachmentName });
                textureGroup.folded = true;
                textureGroup.add();
            }
            
            for (const tex of texturesToProcess) {
                tex.group = textureGroup.uuid;
                if (tex.width && tex.height) {
                    tex.uv_width = tex.width;
                    tex.uv_height = tex.height;
                }
            }
            
            const updateAttachmentUVSizes = () => {
                for (const tex of texturesToProcess) {
                    if (tex) {
                        let width = tex.width;
                        let height = tex.height;
                        
                        if (!width || !height) {
                            if (tex.img && tex.img.width && tex.img.height) {
                                width = tex.img.width;
                                height = tex.img.height;
                                tex.width = width;
                                tex.height = height;
                            }
                        }
                        
                        if (width && height) {
                            if (tex.uv_width !== width || tex.uv_height !== height) {
                                tex.uv_width = width;
                                tex.uv_height = height;
                            }
                        }
                    }
                }
                if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                    Canvas.updateAllFaces();
                }
            };
            
            setTimeout(updateAttachmentUVSizes, 300);
            setTimeout(updateAttachmentUVSizes, 600);
            setTimeout(updateAttachmentUVSizes, 1000);
            
            let texture = texturesToProcess.find(t => t.name && t.name.startsWith(attachmentName)) || texturesToProcess[0];
            if (texture && texture.uuid) {
                collection.texture = texture.uuid;
            }
        }
        
        setTimeout(() => {
            if (Panels.outliner?.node) {
                const outlinerNode = Panels.outliner.node;
                for (const group of rootGroups) {
                    const node = outlinerNode.querySelector(`[id="${group.uuid}"]`);
                    if (node) {
                        node.classList.add('avatar_attachment_hidden');
                    }
                    if (group.children) {
                        for (const child of group.children) {
                            if (child instanceof Group || child instanceof Cube) {
                                const childNode = outlinerNode.querySelector(`[id="${child.uuid}"]`);
                                if (childNode) {
                                    childNode.classList.add('avatar_attachment_hidden');
                                }
                            }
                        }
                    }
                }
            }
        }, 100);
        
        Canvas.updateAllFaces();
    } catch (err) {
    }
}

function parseVector(vec, fallback = [0, 0, 0]) {
    if (!vec) return fallback;
    return [vec.x || 0, vec.y || 0, vec.z || 0];
}

function getMainShape(group) {
    if (!group || !group.children) return null;
    for (const child of group.children) {
        if (child instanceof Cube) {
            return child;
        }
    }
    return null;
}

function getNodeOffset(group) {
    const cube = getMainShape(group);
    if (cube) {
        const centerPos = [
            (cube.from[0] + cube.to[0]) / 2,
            (cube.from[1] + cube.to[1]) / 2,
            (cube.from[2] + cube.to[2]) / 2
        ];
        return [
            centerPos[0] - group.origin[0],
            centerPos[1] - group.origin[1],
            centerPos[2] - group.origin[2]
        ];
    }
    return null;
}

function loadModelNodes(nodes, parent, texture = null, returnGroups = false, parentNode = null) {
    const createdGroups = [];
    const parentGroup = parent === 'root' ? Project.root : parent;
    
    nodes.forEach(node => {
        if (!node) return;
        
        const quaternion = node.orientation ? {
            x: node.orientation.x,
            y: node.orientation.y,
            z: node.orientation.z,
            w: node.orientation.w
        } : { x: 0, y: 0, z: 0, w: 1 };
        
        const q = new THREE.Quaternion();
        q.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        const euler = new THREE.Euler().setFromQuaternion(q.normalize(), 'ZYX');
        const rotation = [
            Math.roundTo(Math.radToDeg(euler.x), 3),
            Math.roundTo(Math.radToDeg(euler.y), 3),
            Math.roundTo(Math.radToDeg(euler.z), 3)
        ];
        
        const offset = node.shape?.offset ? parseVector(node.shape.offset) : [0, 0, 0];
        let origin = parseVector(node.position);
        
        if (parentGroup instanceof Group) {
            const parentGeoOrigin = getMainShape(parentGroup)?.origin || parentGroup.origin;
            if (parentGeoOrigin) {
                origin = [
                    origin[0] + parentGeoOrigin[0],
                    origin[1] + parentGeoOrigin[1],
                    origin[2] + parentGeoOrigin[2]
                ];
            }
            if (returnGroups) {
                const parentOffset = getNodeOffset(parentGroup);
                if (parentOffset) {
                    origin = [
                        origin[0] + parentOffset[0],
                        origin[1] + parentOffset[1],
                        origin[2] + parentOffset[2]
                    ];
                }
            }
        }
        
        let group = null;
        if (!node.shape?.settings?.isStaticBox && node.name) {
            group = new Group({
                name: node.name,
                autouv: 1,
                origin: origin,
                rotation: rotation
            });
            
            group.addTo(parentGroup);
            group.init();
            
            if (node.shape?.settings?.isPiece !== undefined) {
                group.extend({ is_piece: node.shape.settings.isPiece });
            }
            
            if (returnGroups) {
                createdGroups.push(group);
            }
        }
        
        if (node.shape && node.shape.type && node.shape.type !== 'none') {
            const cubeData = node.shape;
            const size = parseVector(cubeData.settings?.size, [16, 16, 16]);
            const stretch = parseVector(cubeData.stretch, [1, 1, 1]);
            
            let adjustedSize = size.slice();
            if (cubeData.type === 'quad') {
                const axis = cubeData.settings?.normal?.substring(1) || 'Z';
                if (axis === 'X') {
                    adjustedSize = [0, size[1], size[0]];
                } else if (axis === 'Y') {
                    adjustedSize = [size[0], size[1], 0];
                } else if (axis === 'Z') {
                    adjustedSize[2] = 0;
                }
            }
            
            const cube = new Cube({
                name: node.name || 'Cube',
                autouv: 1,
                rotation: [0, 0, 0],
                stretch: stretch,
                from: [
                    -adjustedSize[0]/2 + origin[0] + offset[0],
                    -adjustedSize[1]/2 + origin[1] + offset[1],
                    -adjustedSize[2]/2 + origin[2] + offset[2]
                ],
                to: [
                    adjustedSize[0]/2 + origin[0] + offset[0],
                    adjustedSize[1]/2 + origin[1] + offset[1],
                    adjustedSize[2]/2 + origin[2] + offset[2]
                ]
            });
            
            if (group) {
                cube.origin.V3_set(
                    Math.lerp(cube.from[0], cube.to[0], 0.5),
                    Math.lerp(cube.from[1], cube.to[1], 0.5),
                    Math.lerp(cube.from[2], cube.to[2], 0.5)
                );
            } else {
                cube.extend({
                    origin: origin,
                    rotation: rotation
                });
            }
            
            if (cubeData.shadingMode) {
                cube.extend({ shading_mode: cubeData.shadingMode });
            }
            if (cubeData.doubleSided !== undefined) {
                cube.extend({ double_sided: cubeData.doubleSided });
            }
            
            if (texture && cubeData.textureLayout) {
                applyTextureToCube(cube, cubeData.textureLayout, texture, adjustedSize, cubeData.type, cubeData.settings?.normal);
            }
            
            cube.addTo(group || parentGroup).init();
        }
        
        if (node.children && Array.isArray(node.children)) {
            const childParent = group || parentGroup;
            const childGroups = loadModelNodes(node.children, childParent, texture, returnGroups, node);
            if (returnGroups && childGroups) {
                createdGroups.push(...childGroups);
            }
        }
    });
    
    return returnGroups ? createdGroups : undefined;
}

function applyTextureToCube(cube, textureLayout, texture, size, shapeType, normal) {
    const HytaleToBBDirection = {
        back: 'north',
        front: 'south',
        left: 'west',
        right: 'east',
        top: 'up',
        bottom: 'down'
    };
    
    const normalFaces = {
        '-X': 'west',
        '+X': 'east',
        '-Y': 'down',
        '+Y': 'up',
        '-Z': 'north',
        '+Z': 'south'
    };
    
    function resetFace(faceName) {
        cube.faces[faceName].texture = null;
        cube.faces[faceName].uv = [0, 0, 0, 0];
    }
    
    function parseUVVector(vec, fallback = [0, 0]) {
        if (!vec) return fallback;
        return [vec.x || 0, vec.y || 0];
    }
    
    let normalFace = null;
    if (shapeType === 'quad' && normal) {
        normalFace = normalFaces[normal];
    }
    
    for (const key in HytaleToBBDirection) {
        const faceName = HytaleToBBDirection[key];
        let uvSource = textureLayout[key];
        
        if (normalFace === faceName) {
            if (faceName !== 'south') resetFace('south');
            uvSource = textureLayout['front'];
        }
        
        if (!uvSource) {
            resetFace(faceName);
            continue;
        }
        
        const uvOffset = parseUVVector(uvSource.offset);
        let uvSize = [size[0], size[1]];
        const uvMirror = [
            uvSource.mirror?.x ? -1 : 1,
            uvSource.mirror?.y ? -1 : 1
        ];
        const uvRotation = uvSource.angle || 0;
        
        if (key === 'left' || key === 'right') {
            uvSize[0] = size[2];
        } else if (key === 'top' || key === 'bottom') {
            uvSize[1] = size[2];
        }
        
        let result = [0, 0, 0, 0];
        switch (uvRotation) {
            case 90: {
                [uvSize[0], uvSize[1]] = [uvSize[1], uvSize[0]];
                [uvMirror[0], uvMirror[1]] = [uvMirror[1], uvMirror[0]];
                uvMirror[0] *= -1;
                result = [
                    uvOffset[0],
                    uvOffset[1] + uvSize[1] * uvMirror[1],
                    uvOffset[0] + uvSize[0] * uvMirror[0],
                    uvOffset[1]
                ];
                break;
            }
            case 270: {
                [uvSize[0], uvSize[1]] = [uvSize[1], uvSize[0]];
                [uvMirror[0], uvMirror[1]] = [uvMirror[1], uvMirror[0]];
                uvMirror[1] *= -1;
                result = [
                    uvOffset[0] + uvSize[0] * uvMirror[0],
                    uvOffset[1],
                    uvOffset[0],
                    uvOffset[1] + uvSize[1] * uvMirror[1]
                ];
                break;
            }
            case 180: {
                uvMirror[0] *= -1;
                uvMirror[1] *= -1;
                result = [
                    uvOffset[0] + uvSize[0] * uvMirror[0],
                    uvOffset[1] + uvSize[1] * uvMirror[1],
                    uvOffset[0],
                    uvOffset[1]
                ];
                break;
            }
            case 0:
            default: {
                result = [
                    uvOffset[0],
                    uvOffset[1],
                    uvOffset[0] + uvSize[0] * uvMirror[0],
                    uvOffset[1] + uvSize[1] * uvMirror[1]
                ];
                break;
            }
        }
        
        cube.faces[faceName].rotation = uvRotation;
        cube.faces[faceName].uv = result;
        cube.faces[faceName].texture = texture;
    }
}