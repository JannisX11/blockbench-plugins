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
        
        const loadAvatarIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQMAAABtzGvEAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAAZQTFRFAAAAAAAApWe5zwAAAAJ0Uk5TAP9bkSK1AAAAj0lEQVR4nI3PQQ6CUAwE0KkkskRPwE3waOrN0HuY2Bv8sCAujDjTSkBX/s1Lmml/a+DrrgZUt9ZIPWzPK8bNhTQFon6sYVGRQx9MENUT4BQmRHuPIhPieIL6GCT2CpSHG/O74taUab/AbhXVjV806z+++7QR9MP8rfgsEZsRreZ5ClHU8xTPUzxPWRqSuMjfxpJZMWa9gqsAAAAASUVORK5CYII=';
        
        loadAction = new Action('load_avatar', {
            name: 'Load Hytale Avatar',
            description: 'Loads a complete Hytale avatar from a JSON file',
            icon: loadAvatarIcon,
            condition: {formats: ['hytale_character']},
            click: function() {
                
                function expandPath(path) {
                    if (path.includes('%appdata%')) {
                        try {
                            const appDataPath = SystemInfo.appdata_directory || '';
                            return path.replace(/%appdata%/gi, appDataPath);
                        } catch (err) {
                            return path;
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
                    title: 'Select Avatar JSON File',
                    message: '**Step 1: Select your avatar JSON file**\n\n' +
                             'Navigate to the following folder and select your avatar JSON file:\n\n' +
                             '📁 `%appdata%\\Hytale\\UserData\\CachedPlayerSkins`\n\n' +
                             'The JSON file contains all your avatar customizations.',
                    buttons: ['OK']
                }, () => {
                    Blockbench.import({
                        type: 'json',
                        extensions: ['json'],
                        multiple: false,
                        title: 'Select Avatar JSON File',
                        startpath: skinFolderPath
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
                            title: 'Select Assets Folder',
                            message: '**Step 2: Select the extracted Assets folder**\n\n' +
                                     '**Instructions:**\n\n' +
                                     '1. Extract `Assets.zip` from:\n' +
                                     '   📁 `%appdata%\\Hytale\\install\\release\\package\\game\\latest`\n\n' +
                                     '2. Navigate to the extracted Assets folder\n\n' +
                                     '3. Select the Assets folder when prompted\n\n' +
                                     '⚠️ **Important:** You must extract Assets.zip first before selecting the folder.',
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
                title: 'Error: Assets Folder Not Found',
                message: `**Could not find the Assets folder**\n\n` +
                         `**Selected path:**\n\`${assetsBasePath}\`\n\n` +
                         `**Please verify:**\n\n` +
                         `• You selected the extracted Assets folder (not the zip file)\n` +
                         `• The folder contains: \`Cosmetics\\CharacterCreator\\\`\n` +
                         `• The folder contains: \`Common\\\`\n\n` +
                         `The Assets folder should be extracted from Assets.zip.`,
                buttons: ['OK']
            });
            return;
        }
        
        const characterCreatorPath = pathJoin(actualAssetsPath, 'Cosmetics', 'CharacterCreator');
        
        if (!fs.existsSync(characterCreatorPath)) {
            Blockbench.showMessageBox({
                title: 'Error: CharacterCreator Folder Not Found',
                message: `**Could not find CharacterCreator folder**\n\n` +
                         `**Assets path:**\n\`${actualAssetsPath}\`\n\n` +
                         `**Expected path:**\n\`${characterCreatorPath}\`\n\n` +
                         `Please verify that the Assets folder is correctly extracted from Assets.zip.`,
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
                    title: 'Error: Mapping Files Not Found',
                    message: `**Could not load mapping files**\n\n` +
                             `**Searched path:**\n\`${characterCreatorPath}\`\n\n` +
                             `**Please verify:**\n\n` +
                             `• The Assets folder contains \`Cosmetics\\CharacterCreator\\\`\n` +
                             `• The CharacterCreator folder contains JSON mapping files\n` +
                             `• The Assets folder was correctly extracted from Assets.zip`,
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
                    const basePathLower = baseImagePath.toLowerCase().replace(/\\/g, '/');
                    const isSkinTexture = basePathLower.includes('player_textures') || 
                                         basePathLower.includes('faces') || 
                                         basePathLower.includes('ears') ||
                                         basePathLower.includes('mouths') ||
                                         basePathLower.includes('makeup') ||
                                         basePathLower.includes('cosmetics/head') ||
                                         basePathLower.includes('earring');
                    const isSpecialTexture = basePathLower.includes('frilly_greyscale') ||
                                            basePathLower.includes('schoolsocks_greyscale') ||
                                            basePathLower.includes('paintspill_shirt_greyscale');
                    const grayscaleThreshold = 3;
                    const whiteThreshold = isSpecialTexture ? 185 : 255;
                    
                    for (let i = 0; i < baseImageData.data.length; i += 4) {
                        const r = baseImageData.data[i];
                        const g = baseImageData.data[i + 1];
                        const b = baseImageData.data[i + 2];
                        const a = baseImageData.data[i + 3];
                        
                        const minChannel = Math.min(r, g, b);
                        const maxChannel = Math.max(r, g, b);
                        const avgChannel = (r + g + b) / 3;
                        const isWhite = minChannel >= whiteThreshold && avgChannel >= whiteThreshold;
                        
                        if (isColorfulTexture) {
                            const luminance = Math.round(
                                r * 0.299 + 
                                g * 0.587 + 
                                b * 0.114
                            );
                            
                            if (luminance >= whiteThreshold) {
                                outputImageData.data[i] = 255;
                                outputImageData.data[i + 1] = 255;
                                outputImageData.data[i + 2] = 255;
                                outputImageData.data[i + 3] = a;
                            } else {
                            const gradientIndex = Math.min(255, Math.max(0, luminance)) * 4;
                            
                            outputImageData.data[i] = gradientMapData.data[gradientIndex];
                            outputImageData.data[i + 1] = gradientMapData.data[gradientIndex + 1];
                            outputImageData.data[i + 2] = gradientMapData.data[gradientIndex + 2];
                            outputImageData.data[i + 3] = a;
                            }
                        } else {
                            if (isWhite && !isSkinTexture) {
                                outputImageData.data[i] = r;
                                outputImageData.data[i + 1] = g;
                                outputImageData.data[i + 2] = b;
                                outputImageData.data[i + 3] = a;
                            } else {
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