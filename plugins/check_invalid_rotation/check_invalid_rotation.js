// =============================================================================
// Minecraft Rotation Checker - Unified Version (Multi-Language)
// =============================================================================
// Automatically detects Blockbench's language setting and adapts UI accordingly
// Detects non-standard rotations in exported models and shows confirmation dialog
// ONLY when exporting to JSON or BBModel formats.
// 
// Features: Multi-language support, rotation error detection, dialog with Cancel/Continue buttons
// =============================================================================

(function() {
    'use strict';
    
    // Store original functions (must be declared before any functions that use it)
    let originalFunctions = {};
    
    // Language detection and translations
    const translations = {
        en: {
            title: 'Minecraft Rotation Checker',
            description: '⚠️ Automatically detects non-standard rotations in your models and warns you before export to prevent Minecraft display issues.',
            about: `# Minecraft Rotation Checker
Protect your models from Minecraft compatibility issues by detecting non-standard rotations before export.

## 🎯 Key Features
• **Smart Detection**: Identifies rotations that don't follow Minecraft Bedrock's 22.5° increment standard
• **Export Protection**: Shows warning dialog before exporting JSON or BBModel files
• **Detailed Information**: Lists all problematic rotations with suggested corrections
• **User Choice**: Continue export or cancel to fix rotations first
• **Zero Interference**: Only activates during export, doesn't affect normal workflow

## 📐 Minecraft Bedrock Standards
Minecraft Bedrock supports rotations in 22.5° increments:
**-45°, -22.5°, 0°, 22.5°, 45°**

Non-standard rotations may cause visual glitches or incorrect model orientation in-game.

## 💡 How It Works
1. When you export a model as JSON or BBModel, the plugin automatically scans all rotation values
2. If non-standard rotations are found, a beautiful warning dialog appears
3. The dialog shows exactly which elements have problematic rotations and suggests corrections
4. You can choose to continue export (at your own risk) or cancel to fix the rotations first
5. Models with only standard rotations export normally without any interruption

## 🚀 Benefits
• **Prevent Export Errors**: Catch rotation issues before they cause problems in Minecraft
• **Save Time**: No more trial-and-error with model exports
• **Professional Results**: Ensure your models display correctly in-game
• **Educational**: Learn about Minecraft's rotation standards
• **Non-Intrusive**: Only activates when needed, doesn't slow down your workflow

*Version 1.0.0 - Compatible with Blockbench 4.12.6+*`,
            dialogTitle: 'Non-Standard Rotations Detected',
            warningMessage: 'non-standard rotation(s) found',
            warningDescription: 'These rotations may cause display issues in Minecraft. Consider fixing them before export.',
            rotationIssues: 'Rotation Issues:',
            quickFix: 'Quick Fix',
            quickFixDescription: 'Automatically fix all rotations to their nearest standard values.',
            fixAll: 'Fix All',
            fix: 'Fix',
            fixed: 'Fixed ✓',
            rotationsFixed: 'rotations fixed ✓',
            cancelExport: 'Cancel Export',
            continueExport: 'Continue Export',
            save: 'Save',
            consolePrefix: '[Rotation Checker]',
            loading: 'Loading...',
            loaded: 'Plugin loaded successfully',
            unloaded: 'Plugin unloaded',
            initializing: 'Initializing...',
            initialized: 'Initialized successfully',
            startingExtraction: 'Starting rotation extraction...',
            modelDataKeys: 'Model data keys:',
            processingElements: 'Processing elements array with',
            elements: 'elements',
            processingElement: 'Processing element',
            skippingDuplicate: 'Skipping duplicate element',
            rootUniqueProperties: 'Root has unique properties:',
            rootProcessedChildren: 'Root has processed children (elements):',
            rootProcessedBones: 'Root has processed children (bones):',
            rootProcessedChildrenArray: 'Root has processed children (children):',
            processingRoot: 'Processing root object',
            skippingRoot: 'Skipping root object (has processed children)',
            skippingRootNoProps: 'Skipping root object (no unique properties or already processed)',
            extractionComplete: 'Rotation extraction completed. Found',
            uniqueRotations: 'unique rotations:',
            attemptingFix: 'Attempting to fix',
            rotations: 'rotations...',
            rotationFixed: 'Fixed rotation',
            failedFix: 'Failed to fix rotation',
            skippedDuplicate: 'Skipped duplicate rotation:',
            appliedFixes: 'Successfully applied',
            uniqueFixes: 'unique rotation fixes out of',
            totalRotations: 'total rotations',
            updatedViewport: 'Updated viewport',
            updatedOutliner: 'Updated outliner',
            updatedProject: 'Updated project',
            updatedCanvas: 'Updated canvas',
            sceneRefreshed: 'Scene refreshed successfully',
            errorRefreshing: 'Error refreshing scene:',
            storedFunction: 'Stored Blockbench.export function',
            functionNotAvailable: 'Blockbench.export not available during initialization',
            matchFound: 'MATCH FOUND! Menu item:',
            exportClicked: 'Export menu clicked:',
            checkingRotations: 'Checking rotations in project data...',
            foundRotations: 'Found non-standard rotations:',
            exportConfirmed: 'Export confirmed by user',
            exportCancelled: 'Export cancelled by user',
            noIssuesFound: 'No rotation issues found, proceeding with export',
            functionStoredAfterDelay: 'Successfully stored Blockbench.export function after delay',
            errorInitializing: 'Error during initialization:',
            appliedFix: 'Applied fix for rotation',
            appliedAllFixes: 'Applied all',
            rotationFixes: 'rotation fixes'
        },
        fr: {
            title: 'Vérificateur de Rotations Minecraft',
            description: '⚠️ Détecte automatiquement les rotations non-standard dans vos modèles et vous avertit avant l\'export pour éviter les problèmes d\'affichage dans Minecraft.',
            about: `# Vérificateur de Rotations Minecraft
Protégez vos modèles des problèmes de compatibilité Minecraft en détectant les rotations non-standard avant l'export.

## 🎯 Fonctionnalités Principales
• **Détection Intelligente** : Identifie les rotations qui ne suivent pas la norme d'incréments de 22,5° de Minecraft Bedrock
• **Protection d'Export** : Affiche une boîte de dialogue d'avertissement avant l'export des fichiers JSON ou BBModel
• **Informations Détaillées** : Liste toutes les rotations problématiques avec les corrections suggérées
• **Choix de l'Utilisateur** : Continuer l'export ou annuler pour corriger les rotations d'abord
• **Zéro Interférence** : Ne s'active que pendant l'export, n'affecte pas le flux de travail normal

## 📐 Normes Minecraft Bedrock
Minecraft Bedrock supporte les rotations par incréments de 22,5° :
**-45°, -22,5°, 0°, 22,5°, 45°**

Les rotations non-standard peuvent causer des problèmes visuels ou une orientation incorrecte du modèle en jeu.

## 💡 Comment Ça Marche
1. Quand vous exportez un modèle en JSON ou BBModel, le plugin analyse automatiquement toutes les valeurs de rotation
2. Si des rotations non-standard sont trouvées, une belle boîte de dialogue d'avertissement apparaît
3. La boîte de dialogue montre exactement quels éléments ont des rotations problématiques et suggère des corrections
4. Vous pouvez choisir de continuer l'export (à vos risques) ou annuler pour corriger les rotations d'abord
5. Les modèles avec seulement des rotations standard s'exportent normalement sans interruption

## 🚀 Avantages
• **Prévenir les Erreurs d'Export** : Attraper les problèmes de rotation avant qu'ils causent des problèmes dans Minecraft
• **Gagner du Temps** : Plus d'essais et d'erreurs avec les exports de modèles
• **Résultats Professionnels** : Assurez-vous que vos modèles s'affichent correctement en jeu
• **Éducatif** : Apprenez les normes de rotation de Minecraft
• **Non-Intrusif** : Ne s'active que quand nécessaire, ne ralentit pas votre flux de travail

*Version 1.0.0 - Compatible avec Blockbench 4.12.6+*`,
            dialogTitle: 'Rotations Non-Standard Détectées',
            warningMessage: 'rotation(s) non-standard trouvée(s)',
            warningDescription: 'Ces rotations peuvent causer des problèmes d\'affichage dans Minecraft. Considérez les corriger avant l\'export.',
            rotationIssues: 'Problèmes de Rotation :',
            quickFix: 'Correction Rapide',
            quickFixDescription: 'Corriger automatiquement toutes les rotations vers leurs valeurs standard les plus proches.',
            fixAll: 'Tout Corriger',
            fix: 'Corriger',
            fixed: 'Corrigé ✓',
            rotationsFixed: 'rotations corrigées ✓',
            cancelExport: 'Annuler l\'Export',
            continueExport: 'Continuer l\'Export',
            save: 'Enregistrer',
            consolePrefix: '[Vérificateur de Rotations]',
            loading: 'Chargement...',
            loaded: 'Plugin chargé avec succès',
            unloaded: 'Plugin déchargé',
            initializing: 'Initialisation...',
            initialized: 'Initialisé avec succès',
            startingExtraction: 'Début de l\'extraction des rotations...',
            modelDataKeys: 'Clés des données du modèle:',
            processingElements: 'Traitement du tableau d\'éléments avec',
            elements: 'éléments',
            processingElement: 'Traitement de l\'élément',
            skippingDuplicate: 'Ignorer l\'élément en double',
            rootUniqueProperties: 'La racine a des propriétés uniques:',
            rootProcessedChildren: 'La racine a des enfants traités (éléments):',
            rootProcessedBones: 'La racine a des enfants traités (os):',
            rootProcessedChildrenArray: 'La racine a des enfants traités (enfants):',
            processingRoot: 'Traitement de l\'objet racine',
            skippingRoot: 'Ignorer l\'objet racine (a des enfants traités)',
            skippingRootNoProps: 'Ignorer l\'objet racine (pas de propriétés uniques ou déjà traité)',
            extractionComplete: 'Extraction des rotations terminée. Trouvé',
            uniqueRotations: 'rotations uniques:',
            attemptingFix: 'Tentative de correction de',
            rotations: 'rotations...',
            rotationFixed: 'Rotation corrigée',
            failedFix: 'Échec de la correction de la rotation',
            skippedDuplicate: 'Rotation en double ignorée:',
            appliedFixes: 'Appliqué avec succès',
            uniqueFixes: 'corrections de rotation uniques sur',
            totalRotations: 'rotations totales',
            updatedViewport: 'Vue mise à jour',
            updatedOutliner: 'Organisateur mis à jour',
            updatedProject: 'Projet mis à jour',
            updatedCanvas: 'Canvas mis à jour',
            sceneRefreshed: 'Scène actualisée avec succès',
            errorRefreshing: 'Erreur lors de l\'actualisation de la scène:',
            storedFunction: 'Fonction Blockbench.export stockée',
            functionNotAvailable: 'Blockbench.export non disponible lors de l\'initialisation',
            matchFound: 'CORRESPONDANCE TROUVÉE ! Élément de menu:',
            exportClicked: 'Menu d\'export cliqué:',
            checkingRotations: 'Vérification des rotations dans les données du projet...',
            foundRotations: 'Rotations non-standard trouvées:',
            exportConfirmed: 'Export confirmé par l\'utilisateur',
            exportCancelled: 'Export annulé par l\'utilisateur',
            noIssuesFound: 'Aucun problème de rotation trouvé, procéder à l\'export',
            functionStoredAfterDelay: 'Fonction Blockbench.export stockée avec succès après délai',
            errorInitializing: 'Erreur lors de l\'initialisation:',
            appliedFix: 'Correction appliquée pour la rotation',
            appliedAllFixes: 'Appliqué toutes les',
            rotationFixes: 'corrections de rotation'
        }
    };

    // Detect Blockbench language
    function detectLanguage() {
        // Try to detect from Blockbench settings
        if (typeof Settings !== 'undefined' && Settings.language) {
            return Settings.language.startsWith('fr') ? 'fr' : 'en';
        }
        
        // Try to detect from document language
        const docLang = document.documentElement.lang || navigator.language;
        if (docLang && docLang.startsWith('fr')) {
            return 'fr';
        }
        
        // Default to English
        return 'en';
    }

    // Get translation
    function t(key) {
        const lang = detectLanguage();
        return translations[lang][key] || translations.en[key] || key;
    }

    console.log(`${t('consolePrefix')} ${t('loading')}`);
    
    // Plugin registration
    Plugin.register('check_invalid_rotation', {
        title: t('title'),
        author: 'AnnJ',
        description: t('description'),
        icon: 'icon-warning',
        version: '1.0.0',
        variant: 'both',
        tags: ['minecraft', 'rotation', 'validation', 'export'],
        about: t('about'),
        onload() {
            console.log(`${t('consolePrefix')} ${t('loaded')}`);
            initialize();
        },
        onunload() {
            console.log(`${t('consolePrefix')} ${t('unloaded')}`);
        }
    });
    
    // Standard Minecraft Bedrock rotation values (restricted set for elements)
    const STANDARD_ROTATIONS = [-45, -22.5, 0, 22.5, 45];
    const ROTATION_TOLERANCE = 0.1;
    
    /**
     * Check if a rotation value is standard for Minecraft
     */
    function isStandardRotation(rotation) {
        // Handle both positive and negative rotations properly
        // First normalize to 0-360 range
        let normalizedRotation = ((rotation % 360) + 360) % 360;
        
        // Check if the normalized rotation matches any standard value
        let isStandard = STANDARD_ROTATIONS.some(standard => 
            Math.abs(normalizedRotation - standard) <= ROTATION_TOLERANCE
        );
        
        // Also check the original rotation directly (for negative values)
        if (!isStandard) {
            isStandard = STANDARD_ROTATIONS.some(standard => 
                Math.abs(rotation - standard) <= ROTATION_TOLERANCE
            );
        }
        
        return isStandard;
    }
    
    /**
     * Get nearest standard rotation (IMPROVED ALGORITHM)
     */
    function getNearestStandard(rotation) {
        let nearest = 0;
        let minDiff = 360;
        
        // Handle both the original rotation and its normalized version
        const rotationsToCheck = [rotation, ((rotation % 360) + 360) % 360];
        
        rotationsToCheck.forEach(rotToCheck => {
            STANDARD_ROTATIONS.forEach(standard => {
                // Calculate the shortest angular distance
                let diff = Math.abs(rotToCheck - standard);
                
                // If the difference is more than 180°, take the shorter path
                if (diff > 180) {
                    diff = 360 - diff;
                }
                
                if (diff < minDiff) {
                    minDiff = diff;
                    nearest = standard;
                }
            });
        });
        
        return nearest;
    }
    
    /**
     * Extract rotation values from model data
     */
    function extractRotations(modelData) {
        const nonStandardRotations = [];
        const processedRotations = new Set(); // Track processed rotations to avoid duplicates
        
        function checkElement(element, path = '') {
            if (!element) return;
            
            // Check for rotation properties (prioritize 'rotation' array over individual properties)
            const rotationProps = ['rotation', 'rot', 'rotation_x', 'rotation_y', 'rotation_z', 'rx', 'ry', 'rz'];
            
            rotationProps.forEach(prop => {
                if (element[prop] !== undefined) {
                    const rotationValue = element[prop];
                    
                    // Handle array rotation values [x, y, z]
                    if (Array.isArray(rotationValue)) {
                        rotationValue.forEach((rotation, index) => {
                            const rotationNum = parseFloat(rotation);
                            if (!isNaN(rotationNum) && !isStandardRotation(rotationNum)) {
                                const axis = ['X', 'Y', 'Z'][index] || index;
                                const rotationKey = `${path}:${prop}[${axis}]:${rotationNum}:${element.uuid || 'no-uuid'}`;
                                
                                // Only add if we haven't processed this exact rotation before
                                if (!processedRotations.has(rotationKey)) {
                                    processedRotations.add(rotationKey);
                                    nonStandardRotations.push({
                                        path: path || 'root',
                                        property: `${prop}[${axis}]`,
                                        value: rotationNum,
                                        normalized: ((rotationNum % 360) + 360) % 360,
                                        element: element,
                                        elementPath: path, // Store the actual path for better identification
                                        originalValue: rotationNum // Store original value for reference
                                    });
                                }
                            }
                        });
                    } else {
                        // Handle single rotation value
                        const rotation = parseFloat(rotationValue);
                        if (!isNaN(rotation) && !isStandardRotation(rotation)) {
                            const rotationKey = `${path}:${prop}:${rotation}:${element.uuid || 'no-uuid'}`;
                            
                            // Only add if we haven't processed this exact rotation before
                            if (!processedRotations.has(rotationKey)) {
                                processedRotations.add(rotationKey);
                                nonStandardRotations.push({
                                    path: path || 'root',
                                    property: prop,
                                    value: rotation,
                                    normalized: ((rotation % 360) + 360) % 360,
                                    element: element,
                                    elementPath: path, // Store the actual path for better identification
                                    originalValue: rotation // Store original value for reference
                                });
                            }
                        }
                    }
                }
            });
            
            // Check nested elements
            if (element.children) {
                element.children.forEach((child, index) => {
                    checkElement(child, `${path}.children[${index}]`);
                });
            }
            
            // Check elements array (Blockbench format)
            if (element.elements) {
                element.elements.forEach((elem, index) => {
                    checkElement(elem, `${path}.elements[${index}]`);
                });
            }
        }
        
        // Check different possible data structures (avoid duplicates)
        const processedElements = new Set(); // Track actual element objects to avoid duplicates
        
        console.log(`${t('consolePrefix')} ${t('startingExtraction')}`);
        console.log(`${t('consolePrefix')} ${t('modelDataKeys')}`, Object.keys(modelData));
        
        // Process elements array first
        if (modelData.elements) {
            console.log(`${t('consolePrefix')} ${t('processingElements')}`, modelData.elements.length, t('elements'));
            modelData.elements.forEach((element, index) => {
                if (!processedElements.has(element)) {
                    processedElements.add(element);
                    console.log(`${t('consolePrefix')} ${t('processingElement')}[${index}]`);
                    checkElement(element, `elements[${index}]`);
                } else {
                    console.log(`${t('consolePrefix')} ${t('skippingDuplicate')}[${index}]`);
                }
            });
        }
        
        // Process bones array
        if (modelData.bones) {
            modelData.bones.forEach((bone, index) => {
                if (!processedElements.has(bone)) {
                    processedElements.add(bone);
                    checkElement(bone, `bones[${index}]`);
                }
            });
        }
        
        // Process children array
        if (modelData.children) {
            modelData.children.forEach((child, index) => {
                if (!processedElements.has(child)) {
                    processedElements.add(child);
                    checkElement(child, `children[${index}]`);
                }
            });
        }
        
        // Only check root object if it has unique properties that aren't already covered
        // AND it's not the same as any of the arrays we already processed
        const rootProperties = Object.keys(modelData).filter(key => 
            !['elements', 'bones', 'children'].includes(key)
        );
        
        // Only process root if it has unique properties and isn't already processed
        // AND if we haven't already processed any of its child elements
        if (rootProperties.length > 0 && !processedElements.has(modelData)) {
            console.log(`${t('consolePrefix')} ${t('rootUniqueProperties')}:`, rootProperties);
            
            // Check if any of the root's elements have already been processed
            let hasProcessedChildren = false;
            if (modelData.elements) {
                hasProcessedChildren = modelData.elements.some(element => processedElements.has(element));
                console.log(`${t('consolePrefix')} ${t('rootProcessedChildren')}:`, hasProcessedChildren);
            }
            if (modelData.bones) {
                hasProcessedChildren = hasProcessedChildren || modelData.bones.some(bone => processedElements.has(bone));
                console.log(`${t('consolePrefix')} ${t('rootProcessedBones')}:`, hasProcessedChildren);
            }
            if (modelData.children) {
                hasProcessedChildren = hasProcessedChildren || modelData.children.some(child => processedElements.has(child));
                console.log(`${t('consolePrefix')} ${t('rootProcessedChildrenArray')}:`, hasProcessedChildren);
            }
            
            // Only process root if it doesn't have any processed children
            if (!hasProcessedChildren) {
                console.log(`${t('consolePrefix')} ${t('processingRoot')}`);
                checkElement(modelData, 'root');
            } else {
                console.log(`${t('consolePrefix')} ${t('skippingRoot')}`);
            }
        } else {
            console.log(`${t('consolePrefix')} ${t('skippingRootNoProps')}`);
        }
        
        console.log(`${t('consolePrefix')} ${t('extractionComplete')}`, nonStandardRotations.length, t('uniqueRotations'));
        nonStandardRotations.forEach((rotation, index) => {
            console.log(`${t('consolePrefix')}   ${index + 1}. ${rotation.path} - ${rotation.property} = ${rotation.value}°`);
        });
        
        return nonStandardRotations;
    }
    
    /**
     * Apply rotation fix to a specific element
     */
    function applyRotationFix(rotation) {
        const standardValue = getNearestStandard(rotation.normalized);
        
        // Parse the property path to find the element and property
        const pathParts = rotation.property.match(/^(.+?)\[([XYZ])\]$/);
        if (pathParts) {
            const baseProperty = pathParts[1];
            const axis = pathParts[2];
            const axisIndex = ['X', 'Y', 'Z'].indexOf(axis);
            
            if (axisIndex !== -1 && rotation.element[baseProperty] && Array.isArray(rotation.element[baseProperty])) {
                rotation.element[baseProperty][axisIndex] = standardValue;
                console.log(`${t('consolePrefix')} Fixed ${rotation.property}: ${rotation.value}° → ${standardValue}°`);
                
                // Update the scene if this is a Blockbench element
                if (rotation.element.uuid && Outliner && Outliner.elements) {
                    const sceneElement = Outliner.elements.find(el => el.uuid === rotation.element.uuid);
                    if (sceneElement && sceneElement.rotation) {
                        sceneElement.rotation[axisIndex] = standardValue;
                        console.log(`${t('consolePrefix')} Updated scene element rotation: ${axis} = ${standardValue}°`);
                    }
                }
                
                // Also update the element in the Project data
                if (Project && Project.geometry && Project.geometry.elements) {
                    const projectElement = Project.geometry.elements.find(el => el.uuid === rotation.element.uuid);
                    if (projectElement && projectElement[baseProperty]) {
                        projectElement[baseProperty][axisIndex] = standardValue;
                        console.log(`${t('consolePrefix')} Updated project element ${rotation.property}: ${standardValue}°`);
                    }
                }
                
                return true;
            }
        } else {
            // Single rotation value
            if (rotation.element[rotation.property] !== undefined) {
                rotation.element[rotation.property] = standardValue;
                console.log(`${t('consolePrefix')} Fixed ${rotation.property}: ${rotation.value}° → ${standardValue}°`);
                
                // Update the scene if this is a Blockbench element
                if (rotation.element.uuid && Outliner && Outliner.elements) {
                    const sceneElement = Outliner.elements.find(el => el.uuid === rotation.element.uuid);
                    if (sceneElement) {
                        sceneElement[rotation.property] = standardValue;
                        console.log(`${t('consolePrefix')} Updated scene element ${rotation.property}: ${standardValue}°`);
                    }
                }
                
                // Also update the element in the Project data
                if (Project && Project.geometry && Project.geometry.elements) {
                    const projectElement = Project.geometry.elements.find(el => el.uuid === rotation.element.uuid);
                    if (projectElement) {
                        projectElement[rotation.property] = standardValue;
                        console.log(`${t('consolePrefix')} Updated project element ${rotation.property}: ${standardValue}°`);
                    }
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Apply all rotation fixes
     */
    function applyAllRotationFixes(rotations) {
        let fixedCount = 0;
        const fixedRotations = new Set(); // Track which rotations have been fixed
        
        console.log(`${t('consolePrefix')} ${t('attemptingFix')} ${rotations.length} ${t('rotations')}`);
        
        rotations.forEach((rotation, index) => {
            // Create a unique key for this rotation to avoid duplicates
            const rotationKey = `${rotation.path}:${rotation.property}:${rotation.value}`;
            
            if (!fixedRotations.has(rotationKey)) {
                if (applyRotationFix(rotation)) {
                    fixedCount++;
                    fixedRotations.add(rotationKey);
                    console.log(`${t('consolePrefix')} ${t('rotationFixed')} ${index + 1}/${rotations.length}: ${rotation.property} = ${rotation.value}° → ${getNearestStandard(rotation.normalized)}°`);
                } else {
                    console.log(`${t('consolePrefix')} ${t('failedFix')} ${index + 1}/${rotations.length}: ${rotation.property}`);
                }
            } else {
                console.log(`${t('consolePrefix')} ${t('skippedDuplicate')}: ${rotation.property}`);
            }
        });
        
        console.log(`${t('consolePrefix')} ${t('appliedFixes')} ${fixedCount} ${t('uniqueFixes')} ${rotations.length} ${t('totalRotations')}`);
        
        // Refresh the scene to show the changes
        if (fixedCount > 0) {
            // Immediate refresh
            refreshScene();
            
            // Additional refresh after a short delay to ensure all changes are processed
            setTimeout(() => {
                console.log(`${t('consolePrefix')} Performing additional scene refresh to ensure updates are visible`);
                refreshScene();
            }, 200);
        }
        
        return fixedCount;
    }
    
    /**
     * Refresh the Blockbench scene to show rotation changes
     */
    function refreshScene() {
        try {
            // First, trigger immediate updates
            if (Interface && Interface.updateViewport) {
                Interface.updateViewport();
                console.log(`${t('consolePrefix')} ${t('updatedViewport')}`);
            }
            
            if (Outliner && Outliner.update) {
                Outliner.update();
                console.log(`${t('consolePrefix')} ${t('updatedOutliner')}`);
            }
            
            if (Project && Project.update) {
                Project.update();
                console.log(`${t('consolePrefix')} ${t('updatedProject')}`);
            }
            
            if (Canvas && Canvas.updateAll) {
                Canvas.updateAll();
                console.log(`${t('consolePrefix')} ${t('updatedCanvas')}`);
            }
            
            // Force a render update on the canvas
            if (Canvas && Canvas.render) {
                Canvas.render();
                console.log(`${t('consolePrefix')} Forced canvas render`);
            }
            
            // Update the timeline if it exists
            if (Timeline && Timeline.update) {
                Timeline.update();
                console.log(`${t('consolePrefix')} Updated timeline`);
            }
            
            // Force a redraw of the viewport
            if (Interface && Interface.viewport && Interface.viewport.render) {
                Interface.viewport.render();
                console.log(`${t('consolePrefix')} Forced viewport render`);
            }
            
            console.log(`${t('consolePrefix')} ${t('sceneRefreshed')}`);
            
            // Schedule additional updates with a delay to ensure changes are processed
            setTimeout(() => {
                try {
                    if (Interface && Interface.updateViewport) {
                        Interface.updateViewport();
                    }
                    if (Outliner && Outliner.update) {
                        Outliner.update();
                    }
                    if (Canvas && Canvas.updateAll) {
                        Canvas.updateAll();
                    }
                    console.log(`${t('consolePrefix')} Delayed scene refresh completed`);
                } catch (error) {
                    console.error(`${t('consolePrefix')} Error in delayed refresh:`, error);
                }
            }, 100);
            
        } catch (error) {
            console.error(`${t('consolePrefix')} ${t('errorRefreshing')}:`, error);
        }
    }
    
    /**
     * Show rotation warning dialog
     */
    function showRotationWarningDialog(rotations, onConfirm, onCancel, exportType) {
        // Remove any existing dialog
        const existingDialog = document.getElementById('rotation_checker_warning');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        // Create dialog container
        const dialog = document.createElement('div');
        dialog.id = 'rotation_checker_warning';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Roboto', sans-serif;
        `;
        
        // Create dialog content
        const content = document.createElement('div');
        content.className = 'dialog draggable ui-draggable';
        content.style.cssText = `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-background, #2d2d2d);
            border: 1px solid var(--color-border, #555);
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            z-index: 10001;
        `;
        
        // Create header
        const header = document.createElement('div');
        header.className = 'dialog_handle ui-draggable-handle';
        header.style.cssText = `
            background: #2d2d2d;
            padding: 20px 24px 16px 24px;
            border-bottom: 1px solid var(--color-border, #555);
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            user-select: none;
            flex-shrink: 0;
        `;
        
        header.innerHTML = `
            <div class="dialog_title" style="color: var(--color-text, #ffffff); font-weight: 600; font-size: 18px; display: flex; align-items: center; line-height: 1.2;">
                <i class="material-icons" style="margin-right: 12px; color: #ff9800; font-size: 24px;">warning</i>
                ${t('dialogTitle')}
            </div>
        `;
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--color-text, #ffffff);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s;
        `;
        
        closeBtn.onmouseover = () => {
            closeBtn.style.background = 'var(--color-accent, #4a9eff)';
        };
        
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'none';
        };
        
        closeBtn.onclick = () => {
            dialog.remove();
            onCancel();
        };
        
        header.appendChild(closeBtn);
        
        // Create body
        const body = document.createElement('div');
        body.className = 'dialog_content';
        body.style.cssText = `
            padding: 20px 24px;
            overflow-y: auto;
            flex: 1;
            background: var(--color-background, #2d2d2d);
            color: var(--color-text, #ffffff);
            min-height: 0;
        `;
        
        // Create warning message
        const warningMsg = document.createElement('div');
        warningMsg.style.cssText = `
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 20px;
        `;
        
        warningMsg.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <i class="material-icons" style="color: #f44336; margin-right: 8px;">error_outline</i>
                <strong style="color: #f44336;">${rotations.length} ${t('warningMessage')}</strong>
            </div>
            <p style="margin: 0; color: var(--color-text, #ffffff); font-size: 14px;">
                ${t('warningDescription')}
            </p>
        `;
        
        body.appendChild(warningMsg);
        
        // Create quick fix section
        const quickFixSection = document.createElement('div');
        quickFixSection.style.cssText = `
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 20px;
        `;
        
        quickFixSection.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center;">
                    <i class="material-icons" style="color: #4caf50; margin-right: 8px;">auto_fix_high</i>
                    <strong style="color: #4caf50;">${t('quickFix')}</strong>
                </div>
                <button id="fix_all_btn" style="
                    background: #4caf50;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.2s;
                ">${t('fixAll')}</button>
            </div>
            <p style="margin: 0; color: var(--color-text, #ffffff); font-size: 14px;">
                ${t('quickFixDescription')}
            </p>
        `;
        
        body.appendChild(quickFixSection);
        
        // Create rotation list
        const rotationList = document.createElement('div');
        rotationList.style.cssText = `
            margin-bottom: 20px;
        `;
        
        const listTitle = document.createElement('h4');
        listTitle.style.cssText = `
            margin: 0 0 12px 0;
            color: var(--color-text, #ffffff);
            font-size: 16px;
            font-weight: 600;
        `;
        listTitle.textContent = t('rotationIssues');
        
        rotationList.appendChild(listTitle);
        
        // Create scrollable list container
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid var(--color-border, #555);
            border-radius: 4px;
            background: var(--color-background, #2d2d2d);
        `;
        
        rotations.forEach((rotation, index) => {
            const rotationItem = document.createElement('div');
            rotationItem.style.cssText = `
                padding: 12px;
                border-bottom: 1px solid var(--color-border, #555);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--color-background, #2d2d2d);
            `;
            
            if (index === rotations.length - 1) {
                rotationItem.style.borderBottom = 'none';
            }
            
            const rotationInfo = document.createElement('div');
            rotationInfo.style.cssText = `
                flex: 1;
                color: var(--color-text, #ffffff);
            `;
            
            const elementName = rotation.path || 'Unknown Element';
            const propertyName = rotation.property;
            const currentValue = rotation.value;
            const suggestedValue = getNearestStandard(rotation.normalized);
            
            rotationInfo.innerHTML = `
                <div style="font-weight: 500; margin-bottom: 4px;">${elementName}</div>
                <div style="font-size: 13px; color: var(--color-text-secondary, #aaa);">
                    ${propertyName}: ${currentValue}° → <span style="color: #4caf50; font-weight: 500;">${suggestedValue}°</span>
                </div>
            `;
            
            const fixButton = document.createElement('button');
            fixButton.id = `fix_btn_${index}`;
            fixButton.style.cssText = `
                background: #2196f3;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: background-color 0.2s;
                margin-left: 12px;
            `;
            fixButton.textContent = t('fix');
            
            fixButton.onmouseover = () => {
                fixButton.style.background = '#1976d2';
            };
            
            fixButton.onmouseout = () => {
                fixButton.style.background = '#2196f3';
            };
            
            fixButton.onclick = () => {
                if (applyRotationFix(rotation)) {
                    fixButton.textContent = t('fixed');
                    fixButton.style.background = '#4caf50';
                    fixButton.disabled = true;
                    
                    // Update the rotation info to show it's fixed
                    rotationInfo.innerHTML = `
                        <div style="font-weight: 500; margin-bottom: 4px;">${elementName}</div>
                        <div style="font-size: 13px; color: #4caf50;">
                            ${propertyName}: ${currentValue}° → <span style="color: #4caf50; font-weight: 500;">${suggestedValue}°</span> ✓
                        </div>
                    `;
                    
                    // Refresh the scene to show the change
                    refreshScene();
                }
            };
            
            rotationItem.appendChild(rotationInfo);
            rotationItem.appendChild(fixButton);
            listContainer.appendChild(rotationItem);
        });
        
        rotationList.appendChild(listContainer);
        body.appendChild(rotationList);
        
        // Create footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 16px 24px 20px 24px;
            border-top: 1px solid var(--color-border, #555);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        `;
        
        // Create cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.style.cssText = `
            background: var(--color-background, #2d2d2d);
            color: var(--color-text, #ffffff);
            border: 1px solid var(--color-border, #555);
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        `;
        cancelBtn.textContent = t('cancelExport');
        
        cancelBtn.onmouseover = () => {
            cancelBtn.style.background = 'var(--color-accent, #4a9eff)';
            cancelBtn.style.borderColor = 'var(--color-accent, #4a9eff)';
        };
        
        cancelBtn.onmouseout = () => {
            cancelBtn.style.background = 'var(--color-background, #2d2d2d)';
            cancelBtn.style.borderColor = 'var(--color-border, #555)';
        };
        
        cancelBtn.onclick = () => {
            dialog.remove();
            onCancel();
        };
        
        // Create continue button
        const continueBtn = document.createElement('button');
        continueBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        `;
        continueBtn.textContent = t('continueExport');
        
        continueBtn.onmouseover = () => {
            continueBtn.style.background = '#d32f2f';
        };
        
        continueBtn.onmouseout = () => {
            continueBtn.style.background = '#f44336';
        };
        
        continueBtn.onclick = () => {
            dialog.remove();
            onConfirm();
        };
        
        footer.appendChild(cancelBtn);
        footer.appendChild(continueBtn);
        
        // Assemble dialog
        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        dialog.appendChild(content);
        
        // Add to document
        document.body.appendChild(dialog);
        
        // Add drag functionality
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let initialLeft = 0;
        let initialTop = 0;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                // Get the current position of the content element
                const rect = content.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;
                
                // Change cursor to indicate dragging
                content.style.cursor = 'grabbing';
                header.style.cursor = 'grabbing';
                
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                
                const newLeft = initialLeft + deltaX;
                const newTop = initialTop + deltaY;
                
                // Keep dialog within viewport bounds
                const maxLeft = window.innerWidth - content.offsetWidth;
                const maxTop = window.innerHeight - content.offsetHeight;
                
                content.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
                content.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
                content.style.transform = 'none'; // Remove the initial transform
                
                e.preventDefault();
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                content.style.cursor = '';
                header.style.cursor = 'move';
            }
        });
        
        // Add event listeners
        const fixAllBtn = document.getElementById('fix_all_btn');
        if (fixAllBtn) {
            fixAllBtn.onclick = () => {
                const fixedCount = applyAllRotationFixes(rotations);
                if (fixedCount > 0) {
                    fixAllBtn.textContent = `${fixedCount} ${t('rotationsFixed')}`;
                    fixAllBtn.style.background = '#4caf50';
                    fixAllBtn.disabled = true;
                }
            };
        }
        
        // Close on background click
        dialog.onclick = (e) => {
            if (e.target === dialog) {
                dialog.remove();
                onCancel();
            }
        };
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', handleEscape);
                onCancel();
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    /**
     * Initialize the plugin
     */
    function initialize() {
        try {
            console.log(`${t('consolePrefix')} ${t('initializing')}`);
            
            // Store original Blockbench.export function
            if (typeof Blockbench !== 'undefined' && Blockbench.export) {
                originalFunctions.export = Blockbench.export;
                console.log(`${t('consolePrefix')} ${t('storedFunction')}`);
            } else {
                console.log(`${t('consolePrefix')} ${t('functionNotAvailable')}`);
                
                // Try to store it after a delay
                setTimeout(() => {
                    if (typeof Blockbench !== 'undefined' && Blockbench.export) {
                        originalFunctions.export = Blockbench.export;
                        console.log(`${t('consolePrefix')} ${t('functionStoredAfterDelay')}`);
                    }
                }, 1000);
            }
            
            // Set up click event listener for export menu items
            const clickHandler = function(event) {
                const target = event.target;
                if (!target) return;
                
                // Don't interfere with our own dialog
                if (target.closest('.dialog') || target.closest('#rotation_checker_warning')) {
                    return;
                }
                
                let element = target;
                while (element && element !== document.body) {
                    const menuItem = element.getAttribute('menu_item');
                    
                    if (menuItem === 'export_blockmodel' || menuItem === 'export_json' || menuItem === 'export_bedrock' || menuItem === 'export' || menuItem === 'save_project' || menuItem === 'save_project_as') {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        
                        const projectData = Project;
                        if (projectData) {
                            const nonStandardRotations = extractRotations(projectData);
                            
                            if (nonStandardRotations.length > 0) {
                                showRotationWarningDialog(
                                    nonStandardRotations,
                                    () => {
                                        // User confirmed export
                                        console.log(`${t('consolePrefix')} ${t('exportConfirmed')}`);
                                        document.removeEventListener('click', clickHandler, true);
                                        setTimeout(() => {
                                            element.click();
                                            setTimeout(() => {
                                                document.addEventListener('click', clickHandler, true);
                                            }, 100);
                                        }, 50);
                                    },
                                    () => {
                                        // User cancelled export
                                        console.log(`${t('consolePrefix')} ${t('exportCancelled')}`);
                                    },
                                    menuItem
                                );
                            } else {
                                // No rotation issues found, proceed with export
                                console.log(`${t('consolePrefix')} ${t('noIssuesFound')}`);
                                document.removeEventListener('click', clickHandler, true);
                                setTimeout(() => {
                                    element.click();
                                    setTimeout(() => {
                                        document.addEventListener('click', clickHandler, true);
                                    }, 100);
                                }, 50);
                            }
                        }
                        return;
                    }
                    element = element.parentElement;
                }
            };
            
            document.addEventListener('click', clickHandler, true);
            
            console.log(`${t('consolePrefix')} ${t('initialized')}`);
        } catch (error) {
            console.error(`${t('consolePrefix')} ${t('errorInitializing')}:`, error);
        }
    }
    
    // Test function to verify rotation detection and fixing works correctly
    function testRotationFunctions() {
        console.log(`${t('consolePrefix')} Testing rotation functions...`);
        
        // Test cases for isStandardRotation
        const testCases = [
            // Valid rotations (should return true)
            { rotation: -45, expected: true, description: 'Valid: -45°' },
            { rotation: -22.5, expected: true, description: 'Valid: -22.5°' },
            { rotation: 0, expected: true, description: 'Valid: 0°' },
            { rotation: 22.5, expected: true, description: 'Valid: 22.5°' },
            { rotation: 45, expected: true, description: 'Valid: 45°' },
            { rotation: 360, expected: true, description: 'Valid: 360° (normalized to 0°)' },
            { rotation: -360, expected: true, description: 'Valid: -360° (normalized to 0°)' },
            { rotation: 382.5, expected: true, description: 'Valid: 382.5° (normalized to 22.5°)' },
            
            // Invalid rotations (should return false)
            { rotation: 23, expected: false, description: 'Invalid: 23°' },
            { rotation: 67.5, expected: false, description: 'Invalid: 67.5°' },
            { rotation: 90, expected: false, description: 'Invalid: 90°' },
            { rotation: 135, expected: false, description: 'Invalid: 135°' },
            { rotation: 180, expected: false, description: 'Invalid: 180°' },
            { rotation: -23, expected: false, description: 'Invalid: -23°' },
            { rotation: -67.5, expected: false, description: 'Invalid: -67.5°' },
            { rotation: -90, expected: false, description: 'Invalid: -90°' }
        ];
        
        let passedTests = 0;
        let totalTests = testCases.length;
        
        testCases.forEach(testCase => {
            const result = isStandardRotation(testCase.rotation);
            const passed = result === testCase.expected;
            
            if (passed) {
                passedTests++;
                console.log(`${t('consolePrefix')} ✓ ${testCase.description} - Result: ${result}`);
            } else {
                console.error(`${t('consolePrefix')} ✗ ${testCase.description} - Expected: ${testCase.expected}, Got: ${result}`);
            }
        });
        
        // Test getNearestStandard function
        console.log(`${t('consolePrefix')} Testing getNearestStandard function...`);
        const nearestTests = [
            { rotation: 23, expected: 22.5, description: '23° → nearest: 22.5°' },
            { rotation: 67.5, expected: 67.5, description: '67.5° → nearest: 67.5° (should be invalid but test nearest)' },
            { rotation: 90, expected: 90, description: '90° → nearest: 90° (should be invalid but test nearest)' },
            { rotation: -23, expected: -22.5, description: '-23° → nearest: -22.5°' },
            { rotation: -67.5, expected: -67.5, description: '-67.5° → nearest: -67.5° (should be invalid but test nearest)' },
            { rotation: 382.5, expected: 22.5, description: '382.5° → nearest: 22.5° (normalized)' }
        ];
        
        nearestTests.forEach(testCase => {
            const result = getNearestStandard(testCase.rotation);
            const passed = result === testCase.expected;
            
            if (passed) {
                console.log(`${t('consolePrefix')} ✓ ${testCase.description} - Result: ${result}°`);
            } else {
                console.error(`${t('consolePrefix')} ✗ ${testCase.description} - Expected: ${testCase.expected}°, Got: ${result}°`);
            }
        });
        
        console.log(`${t('consolePrefix')} Rotation function tests completed: ${passedTests}/${totalTests} passed`);
        
        // Test tolerance edge cases
        console.log(`${t('consolePrefix')} Testing tolerance edge cases...`);
        const toleranceTests = [
            { rotation: 22.6, expected: false, description: '22.6° (within 0.1 tolerance of 22.5°)' },
            { rotation: 22.4, expected: false, description: '22.4° (within 0.1 tolerance of 22.5°)' },
            { rotation: 22.55, expected: false, description: '22.55° (within 0.1 tolerance of 22.5°)' },
            { rotation: 22.45, expected: false, description: '22.45° (within 0.1 tolerance of 22.5°)' }
        ];
        
        toleranceTests.forEach(testCase => {
            const result = isStandardRotation(testCase.rotation);
            console.log(`${t('consolePrefix')} Tolerance test: ${testCase.description} - Result: ${result}`);
        });
    }
    
    // Run tests when plugin loads (only in development)
    if (typeof console !== 'undefined' && console.log) {
        // Uncomment the next line to run tests when plugin loads
        // testRotationFunctions();
    }
    
    console.log(`${t('consolePrefix')} ${t('loaded')}`);
})();
