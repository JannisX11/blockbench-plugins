let loadAction;
let loadFromUrlAction;
let changeAssetsFolderAction;
let resolveTexturesAction;

const links = {
  website: {
    text: "By Pastelito",
    link: "https://pastelito.dev/",
    icon: "far.fa-copy",
    colour: "#33E38E"
  },
  twitter: {
    text: "Twitter",
    link: "https://x.com/MrPastelitoo_",
    icon: "fab.fa-x-twitter",
    colour: "#1DA1F2"
  }
}

Plugin.register('hytale_avatar_loader', {
    title: 'Hytale Avatar Loader',
    author: 'PasteDev',
    description: 'Loads Hytale avatar models with textures and colors from local JSON files or from crafthead.net',
    icon: 'icon.png',
    version: '1.2.0',
    min_version: '5.0.7',
    variant: 'desktop',
    tags: ['Hytale'],
    website: "https://pastelito.dev",
    creation_date: "2026-01-16",
    onload() {
        if (window.hytaleAvatarLoaderInitialized) return;
        window.hytaleAvatarLoaderInitialized = true;

        Blockbench.addCSS(`
            .action_load_avatar .icon {
                filter: brightness(1.2) contrast(1.1) !important;
            }
        `);
        
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
                        
                        const cachedAssetsPath = localStorage.getItem('hytale_assets_path');
                        
                        if (cachedAssetsPath) {
                            loadAvatar(avatarData, cachedAssetsPath).catch((err) => {
                                Blockbench.showMessageBox({
                                    title: 'Error',
                                    message: `Error loading avatar: ${err.message}`,
                                    buttons: ['OK']
                                });
                            });
                        } else {
                            const assetsZipPath = expandPath('%appdata%\\Hytale\\install\\release\\package\\game\\latest');
                            
                            Blockbench.showMessageBox({
                                title: 'Select Assets Folder',
                                message: '**Step 2: Select the extracted Assets folder**\n\n' +
                                         '**Instructions:**\n\n' +
                                         '1. Extract `Assets.zip` from:\n' +
                                         '   📁 `%appdata%\\Hytale\\install\\release\\package\\game\\latest`\n\n' +
                                         '2. Navigate to the extracted Assets folder\n\n' +
                                         '3. Select the Assets folder when prompted\n\n' +
                                         '⚠️ **Important:** You must extract Assets.zip first before selecting the folder.\n\n' +
                                         'This path will be saved for future use.',
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
                                    
                                    localStorage.setItem('hytale_assets_path', assetsDir);
                                    
                                    loadAvatar(avatarData, assetsDir).catch((err) => {
                                        Blockbench.showMessageBox({
                                            title: 'Error',
                                            message: `Error loading avatar: ${err.message}`,
                                            buttons: ['OK']
                                        });
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
        
        loadFromUrlAction = new Action('load_avatar_from_url', {
            name: 'Load Hytale Avatar with Username',
            description: 'Loads a Hytale avatar from crafthead.net',
            icon: 'cloud_download',
            condition: {formats: ['hytale_character']},
            click: async function() {
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
                
                const username = await new Promise((resolve) => {
                    const dialog = new Dialog({
                        id: 'hytale_username_dialog',
                        title: 'Load Avatar from Crafthead',
                        form: {
                            username: {label: 'Username', type: 'text', value: ''}
                        },
                        onConfirm(formData) {
                            dialog.hide();
                            resolve(formData.username);
                        },
                        onCancel() {
                            dialog.hide();
                            resolve(null);
                        }
                    });
                    dialog.show();
                });
                
                if (!username || !username.trim()) {
                    Blockbench.showMessageBox({
                        title: 'No Username',
                        message: 'Please enter a username to load.',
                        buttons: ['OK']
                    });
                    return;
                }
                
                try {
                    Blockbench.showStatusMessage('Fetching avatar data...', 2000);
                    const url = `https://crafthead.net/hytale/profile/${encodeURIComponent(username.trim())}`;
                    
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch avatar: ${response.status} ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    
                    // Extract the skin data from the crafthead response
                    const avatarData = data.skin || data;
                    
                    if (!avatarData || typeof avatarData !== 'object') {
                        throw new Error('Invalid avatar data received from server');
                    }
                    
                    const cachedAssetsPath = localStorage.getItem('hytale_assets_path');
                    
                    if (cachedAssetsPath) {
                        loadAvatar(avatarData, cachedAssetsPath).catch((err) => {
                            Blockbench.showMessageBox({
                                title: 'Error',
                                message: `Error loading avatar: ${err.message}`,
                                buttons: ['OK']
                            });
                        });
                    } else {
                        const assetsZipPath = expandPath('%appdata%\\Hytale\\install\\release\\package\\game\\latest');
                        
                        Blockbench.showMessageBox({
                            title: 'Select Assets Folder',
                            message: '**Select the extracted Assets folder**\n\n' +
                                     '**Instructions:**\n\n' +
                                     '1. Extract `Assets.zip` from:\n' +
                                     '   📁 `%appdata%\\Hytale\\install\\release\\package\\game\\latest`\n\n' +
                                     '2. Navigate to the extracted Assets folder\n\n' +
                                     '3. Select the Assets folder when prompted\n\n' +
                                     '⚠️ **Important:** You must extract Assets.zip first before selecting the folder.\n\n' +
                                     'This path will be saved for future use.',
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
                                
                                localStorage.setItem('hytale_assets_path', assetsDir);
                                
                                loadAvatar(avatarData, assetsDir).catch((err) => {
                                    Blockbench.showMessageBox({
                                        title: 'Error',
                                        message: `Error loading avatar: ${err.message}`,
                                        buttons: ['OK']
                                    });
                                });
                            }
                        });
                    }
                } catch (err) {
                    Blockbench.showMessageBox({
                        title: 'Error Loading Avatar',
                        message: `Failed to load avatar from URL: ${err.message}`,
                        buttons: ['OK']
                    });
                    console.error('Error loading avatar from URL:', err);
                }
            }
        });
        
        changeAssetsFolderAction = new Action('change_hytale_assets_folder', {
            name: 'Change Hytale Assets Folder',
            description: 'Change the location of the Hytale assets folder',
            icon: 'folder_open',
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
                function wrapPathForMessage(path, maxLength) {
                    if (!path || !maxLength) return path;
                    const parts = path.split('\\');
                    const lines = [];
                    let currentLine = '';
                    for (const part of parts) {
                        const nextLine = currentLine ? `${currentLine}\\${part}` : part;
                        if (nextLine.length > maxLength && currentLine) {
                            lines.push(currentLine);
                            currentLine = part;
                        } else {
                            currentLine = nextLine;
                        }
                    }
                    if (currentLine) lines.push(currentLine);
                    return lines.join('\n');
                }
                
                const currentPath = localStorage.getItem('hytale_assets_path');
                const assetsZipPath = expandPath('%appdata%\\Hytale\\install\\release\\package\\game\\latest');
                const displayCurrentPath = currentPath ? wrapPathForMessage(currentPath, 48) : '';
                
                const message = currentPath 
                    ? `**Current Assets Folder:**\n${displayCurrentPath}\n\n**Instructions:**\n\n1. Extract \`Assets.zip\` from:\n   📁 \`%appdata%\\Hytale\\install\\release\\package\\game\\latest\`\n\n2. Select the extracted Assets folder when prompted`
                    : '**Instructions:**\n\n1. Extract `Assets.zip` from:\n   📁 `%appdata%\\Hytale\\install\\release\\package\\game\\latest`\n\n2. Select the extracted Assets folder when prompted';
                
                Blockbench.showMessageBox({
                    title: 'Change Assets Folder',
                    message: message,
                    buttons: ['OK']
                }, () => {
                    if (typeof Blockbench.pickDirectory === 'function') {
                        const assetsDir = Blockbench.pickDirectory({
                            title: 'Select Assets Folder (extracted)',
                            resource_id: 'avatar_assets_folder'
                        });
                        
                        if (!assetsDir) {
                            return;
                        }
                        
                        localStorage.setItem('hytale_assets_path', assetsDir);
                        
                        Blockbench.showMessageBox({
                            title: 'Success',
                            message: `Assets folder updated to:\n${wrapPathForMessage(assetsDir, 48)}`,
                            buttons: ['OK']
                        });
                    }
                });
            }
        });
        
        MenuBar.addAction(loadAction, 'file.import');
        MenuBar.addAction(loadFromUrlAction, 'file.import');
        MenuBar.addAction(changeAssetsFolderAction, 'file.preferences');
        
        function getTextureGroupsFromCollections() {
            if (typeof Collection === 'undefined' || !Collection.all || typeof TextureGroup === 'undefined' || !TextureGroup.all) return [];
            const groups = [];
            for (const collection of Collection.all) {
                const group = TextureGroup.all.find(tg => tg.name === collection.name);
                if (group) groups.push(group);
            }
            return groups;
        }
        
        function getTexturesFromGroups(groups) {
            if (!groups || groups.length === 0) return [];
            const textures = [];
            for (const group of groups) {
                const groupTextures = typeof group.getTextures === 'function'
                    ? group.getTextures()
                    : Texture.all.filter(t => t.group === group.uuid);
                textures.push(...groupTextures);
            }
            return textures.filter(Boolean);
        }
        
        function resolveMissingTextures() {
            const collectionGroups = getTextureGroupsFromCollections();
            if (!collectionGroups || collectionGroups.length === 0) {
                Blockbench.showMessageBox({
                    title: 'Resolve Textures',
                    message: 'No texture groups were found.',
                    buttons: ['OK']
                });
                return;
            }
            const groupTextures = getTexturesFromGroups(collectionGroups);
            Undo.initEdit({ textures: groupTextures, texture_groups: collectionGroups });
            for (const group of collectionGroups) {
                const textures = typeof group.getTextures === 'function'
                    ? group.getTextures()
                    : Texture.all.filter(t => t.group === group.uuid);
                group.remove();
                for (const texture of textures) {
                    texture.group = '';
                }
            }
            Undo.finishEdit('Resolve texture groups');
            Blockbench.showStatusMessage('Resolved texture groups', 3000);
            if (typeof BARS !== 'undefined' && typeof BARS.updateConditions === 'function') {
                BARS.updateConditions();
            }
        }
        
        if (typeof BarItems !== 'undefined' && BarItems.resolve_textures_hytale_avatar) {
            BarItems.resolve_textures_hytale_avatar.delete();
        }
        resolveTexturesAction = new Action('resolve_textures_hytale_avatar', {
            name: 'Resolve Textures',
            description: 'Resolve missing texture paths',
            icon: 'fa-leaf',
            category: 'textures',
            condition: () => getTextureGroupsFromCollections().length > 0,
            click: resolveMissingTextures
        });
        resolveTexturesAction.uniqueNode = true;
        
        function addResolveButtonToTexturesToolbar() {
            const texturesPanel = Panels.textures || Interface?.Panels?.textures;
            const panelToolbar = texturesPanel?.toolbars?.[0];
            const listToolbar = (typeof Toolbars !== 'undefined' && Toolbars.texturelist) ? Toolbars.texturelist : null;
            const toolbar = panelToolbar || listToolbar;
            if (!toolbar) return false;
            const actionId = resolveTexturesAction?.id || 'resolve_textures_hytale_avatar';
            const removeDuplicates = (tb) => {
                if (!tb || !tb.children) return;
                const dupes = tb.children.filter(child => child && child.id === actionId);
                for (const child of dupes) {
                    tb.remove(child, false);
                }
                tb.remove(resolveTexturesAction, false);
            };
            removeDuplicates(panelToolbar);
            removeDuplicates(listToolbar);
            if (!toolbar.children.includes(resolveTexturesAction)) {
                toolbar.add(resolveTexturesAction, 3);
            }
            return true;
        }
        
        let resolveToolbarAttempts = 0;
        const resolveToolbarInterval = setInterval(() => {
            if (addResolveButtonToTexturesToolbar() || resolveToolbarAttempts > 50) {
                clearInterval(resolveToolbarInterval);
            }
            resolveToolbarAttempts++;
        }, 200);
    },
    onunload() {
        if (loadAction) loadAction.delete();
        if (loadFromUrlAction) loadFromUrlAction.delete();
        if (changeAssetsFolderAction) changeAssetsFolderAction.delete();
        if (resolveTexturesAction) resolveTexturesAction.delete();
        window.hytaleAvatarLoaderInitialized = false;
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

function parseJsonFile(file) {
    if (file && file.content) {
        try {
            return JSON.parse(file.content);
        } catch (err) {
        }
    }
    return null;
}

function ensureDir(fsSync, dir) {
    if (!fsSync.existsSync(dir)) {
        fsSync.mkdirSync(dir, { recursive: true });
    }
}

function getRelativePathFromCommon(texturePath, commonPath) {
    let relativePath = texturePath;
    if (relativePath.startsWith(commonPath)) {
        relativePath = relativePath.substring(commonPath.length);
        if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
            relativePath = relativePath.substring(1);
        }
    }
    return relativePath;
}

function getOutputPathFromTexture(texturePath, commonPath, tempDir, pathJoin) {
    const normalizedPath = getRelativePathFromCommon(texturePath, commonPath).replace(/\\/g, '/');
    const pathParts = normalizedPath.split('/').filter(p => p);
    const fileName = pathParts.pop();
    const outputDir = pathJoin(tempDir, ...pathParts);
    const outputPath = pathJoin(outputDir, fileName);
    return { outputDir, outputPath };
}

function updateTextureUv(texture) {
    if (!texture) return;
    let width = texture.width;
    let height = texture.height;
    if ((!width || !height) && texture.img && texture.img.width && texture.img.height) {
        width = texture.img.width;
        height = texture.img.height;
        texture.width = width;
        texture.height = height;
    }
    if (width && height) {
        if (texture.uv_width !== width || texture.uv_height !== height) {
            texture.uv_width = width;
            texture.uv_height = height;
        }
    }
}

function scheduleTextureUvUpdates(textures, delays, postUpdate) {
    const run = () => {
        for (const tex of textures) {
            updateTextureUv(tex);
        }
        if (postUpdate) postUpdate();
    };
    for (const delay of delays) {
        setTimeout(run, delay);
    }
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
            const parsedFiles = files.map(parseJsonFile);
            const hairColors = parsedFiles[0];
            const eyeColors = parsedFiles[1];
            const genericColors = parsedFiles[2];
            const gradientSets = parsedFiles[3];
            
            const mappingKeys = Object.keys(mappingFiles);
            for (let i = 0; i < mappingKeys.length; i++) {
                const mappingData = parsedFiles[i + 4];
                if (mappingData) {
                    mappings[mappingKeys[i]] = mappingData;
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
    const findSet = (id) => gradientSets.find(gs => gs.Id === id);
    
    const fieldToGradientSet = {
        'bodyCharacteristic': 'Skin',
        'haircut': 'Hair',
        'eyebrows': 'Hair',
        'eyes': 'Eyes_Gradient',
        'facialHair': 'Hair'
    };
    
    const gradientSetId = fieldToGradientSet[field];
    if (gradientSetId) {
        const found = findSet(gradientSetId);
        if (found) return found;
    }
    
    const itemToUse = variantItem || item;
    
    if (itemToUse && itemToUse.GradientSet) {
        const found = findSet(itemToUse.GradientSet);
        if (found) return found;
    }
    
    if (itemToUse && itemToUse.MaterialType) {
        const found = findSet(itemToUse.MaterialType);
        if (found) return found;
    }
    
    const clothingFields = new Set([
        'undertop', 'overtop', 'pants', 'overpants', 'shoes', 'gloves', 'cape',
        'headAccessory', 'faceAccessory', 'earAccessory', 'underwear'
    ]);
    
    if (clothingFields.has(field)) {
        
        const checkGradientSet = (searchText) => {
            const lowerText = searchText.toLowerCase();
            const matchers = [
                ['Colored_Cotton', (t) => t.includes('colored_cotton') || t.includes('coloredcotton') || t.includes('colored_')],
                ['Shiny_Fabric', (t) => t.includes('shiny_fabric') || t.includes('shinyfabric')],
                ['Fantasy_Cotton', (t) => t.includes('fantasy_cotton') || t.includes('fantasycotton') || (t.includes('fantasy') && !t.includes('dark'))],
                ['Pastel_Cotton', (t) => t.includes('pastel_cotton') || t.includes('pastelcotton') || t.includes('pastel')],
                ['Faded_Leather', (t) => t.includes('faded_leather') || t.includes('fadedleather') || t.includes('leather')],
                ['Flashy_Synthetic', (t) => t.includes('flashy_synthetic') || t.includes('flashysynthetic') || t.includes('synthetic')],
                ['Jean_Generic', (t) => t.includes('jean') || t.includes('jeans') || t.includes('denim')],
                ['Fantasy_Cotton_Dark', (t) => t.includes('dark_fantasy') || t.includes('darkfantasy')],
                ['Ornamented_Metal', (t) => t.includes('ornamented_metal') || t.includes('ornamentedmetal') || t.includes('metal')],
                ['Rotten_Fabric', (t) => t.includes('rotten_fabric') || t.includes('rottenfabric')]
            ];
            for (const [id, test] of matchers) {
                if (test(lowerText)) return findSet(id);
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
                    const grayscaleThreshold = 1;
                    const whiteThreshold = 255;
                    
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
        ensureDir(fs, baseTempDir);
        ensureDir(fs, tempDir);
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
                    const { outputDir, outputPath } = getOutputPathFromTexture(info.texturePath, commonPath, tempDir, pathJoin);
                    
                        try {
                        ensureDir(fs, outputDir);
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
            const { outputDir, outputPath } = getOutputPathFromTexture(info.texturePath, commonPath, tempDir, pathJoin);
            
            try {
                ensureDir(fs, outputDir);
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
        const { outputDir, outputPath } = getOutputPathFromTexture(info.texturePath, commonPath, tempDir, pathJoin);
        
        try {
            ensureDir(fs, outputDir);
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
                
                if (variantItem.Textures && typeof variantItem.Textures === 'object' && !Array.isArray(variantItem.Textures) && color) {
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
                
                if (item.Textures && typeof item.Textures === 'object' && !Array.isArray(item.Textures) && color) {
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

function normalizeBoneOffsets(nodes) {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
        if (!node) continue;
        if (node.shape && node.shape.type === 'none' && node.shape.offset) {
            node.shape.offset = { x: 0, y: 0, z: 0 };
        }
        if (node.children && Array.isArray(node.children)) {
            normalizeBoneOffsets(node.children);
        }
    }
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
        await loadAnimations(pathJoin, assetsBasePath);
        Blockbench.showStatusMessage('Avatar loaded successfully', 3000);
    } catch (err) {
        Blockbench.showStatusMessage('Avatar processed', 3000);
    }
}

async function loadAnimations(pathJoin, assetsBasePath) {
    try {
        const fs = requireNativeModule('fs');
        if (!fs) return;
        
        const animationsPath = pathJoin(assetsBasePath, 'Common', 'Characters', 'Animations', 'Default');
        
        if (!fs.existsSync(animationsPath)) {
            return;
        }
        
        const files = fs.readdirSync(animationsPath);
        const animationFiles = files.filter(file => 
            file.endsWith('.blockyanim') && !file.endsWith('_FPS.blockyanim')
        );
        
        if (animationFiles.length === 0) {
            return;
        }
        
        const animationPaths = animationFiles.map(file => pathJoin(animationsPath, file));
        
        Blockbench.read(animationPaths, { readtype: 'text' }, (files) => {
            for (const file of files) {
                if (!file || !file.content) continue;
                try {
                    const content = JSON.parse(file.content);
                    parseAnimationFile(file, content);
                } catch (err) {
                    console.error(`Error parsing animation ${file.path}:`, err);
                }
            }
        });
    } catch (err) {
        console.error('Error loading animations:', err);
    }
}

function parseAnimationFile(file, content) {
    const FPS = 60;
    const Animation = window.Animation;
    
    if (!Animation) {
        console.error('Animation class not available');
        return;
    }
    
    function pathToName(path, includeExtension) {
        if (typeof window.pathToName === 'function') {
            return window.pathToName(path, includeExtension);
        }
        const parts = (path || '').split(/[/\\]/);
        const fileName = parts[parts.length - 1] || '';
        if (includeExtension) {
            return fileName;
        }
        return fileName.replace(/\.[^.]*$/, '');
    }
    
    const animation = new Animation({
        name: pathToName(file.name || file.path, false),
        length: content.duration / FPS,
        loop: content.holdLastKeyframe ? "hold" : "loop",
        path: file.path,
        snapping: FPS
    });
    
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler(0, 0, 0, "ZYX");
    
    for (const name in content.nodeAnimations) {
        const anim_data = content.nodeAnimations[name];
        const group_name = name;
        const group = Group.all.find((g) => g.name == group_name);
        const uuid = group ? group.uuid : guid();
        const ba = new BoneAnimator(uuid, animation, group_name);
        animation.animators[uuid] = ba;
        
        const anim_channels = [
            { channel: "rotation", keyframes: anim_data.orientation },
            { channel: "position", keyframes: anim_data.position },
            { channel: "scale", keyframes: anim_data.shapeStretch },
            { channel: "visibility", keyframes: anim_data.shapeVisible }
        ];
        
        for (const { channel, keyframes } of anim_channels) {
            if (!keyframes || keyframes.length == 0) continue;
            for (const kf_data of keyframes) {
                let data_point;
                if (channel == "visibility") {
                    data_point = {
                        visibility: kf_data.delta
                    };
                } else {
                    const delta = kf_data.delta;
                    if (channel == "rotation") {
                        quaternion.set(delta.x, delta.y, delta.z, delta.w);
                        euler.setFromQuaternion(quaternion.normalize(), "ZYX");
                        data_point = {
                            x: Math.radToDeg(euler.x),
                            y: Math.radToDeg(euler.y),
                            z: Math.radToDeg(euler.z)
                        };
                    } else {
                        data_point = {
                            x: delta.x,
                            y: delta.y,
                            z: delta.z
                        };
                    }
                }
                ba.addKeyframe({
                    time: kf_data.time / FPS,
                    channel,
                    interpolation: kf_data.interpolationType == "smooth" ? "catmullrom" : "linear",
                    data_points: [data_point]
                });
            }
        }
    }
    
    animation.add(false);
    if (!Animation.selected && Animator.open) {
        animation.select();
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
                    updateTextureUv(existingTexture);
                    texturesToUse.push(existingTexture);
                } else {
                    const texture = new Texture().fromPath(texturePath).add(false, true);
                    scheduleTextureUvUpdates([texture], [100, 300, 500, 1000], () => {
                        if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                            Canvas.updateAllFaces();
                        }
                    });
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
                        updateTextureUv(tex);
                        if (texturesToUse.length === 0) {
                            texturesToUse.push(tex);
                        }
                    }
                }
            } else {
                for (const tex of content.new_textures) {
                    updateTextureUv(tex);
                }
                if (texturesToUse.length === 0) {
                    texturesToUse = content.new_textures;
                }
            }
        }
        
        scheduleTextureUvUpdates(texturesToUse, [300, 600, 1000], () => {
            if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                Canvas.updateAllFaces();
            }
        });
        
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
        normalizeBoneOffsets(modelData.nodes);
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
                    updateTextureUv(existingTexture);
                    texturesToProcess.push(existingTexture);
                } else {
                    const texture = new Texture().fromPath(texturePath).add(false);
                    scheduleTextureUvUpdates([texture], [100, 300, 500, 1000], () => {
                        if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                            Canvas.updateAllFaces();
                        }
                    });
                    texturesToProcess.push(texture);
                }
            } catch (err) {
            }
        } else if (content.new_textures && content.new_textures.length > 0) {
            const matchingTexture = content.new_textures.find(t => t.path === texturePath);
            if (matchingTexture) {
                updateTextureUv(matchingTexture);
                texturesToProcess = [matchingTexture];
            } else {
                const firstTexture = content.new_textures[0];
                updateTextureUv(firstTexture);
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
                updateTextureUv(tex);
            }
            
            scheduleTextureUvUpdates(texturesToProcess, [300, 600, 1000], () => {
                if (typeof Canvas !== 'undefined' && typeof Canvas.updateAllFaces === 'function') {
                    Canvas.updateAllFaces();
                }
            });
            
            let texture = texturesToProcess.find(t => t.name && t.name.startsWith(attachmentName)) || texturesToProcess[0];
            if (texture && texture.uuid) {
                collection.texture = texture.uuid;
            }
        }
        
        Canvas.updateAllFaces();
    } catch (err) {
    }
}
