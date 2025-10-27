// =============================================================================
// Minecraft Java Edition Rotation Checker - Multi-Language
// =============================================================================
// For Minecraft Java Edition 1.8 - 1.18.x (versions with 22.5° rotation restrictions)
// Automatically detects Blockbench's language setting and adapts UI accordingly
// Detects non-standard rotations in exported models and shows confirmation dialog
// ONLY when exporting to JSON or BBModel formats for older Java Edition versions.
// 
// Note: Minecraft 1.19+ may have relaxed rotation restrictions - verify compatibility
// Features: Multi-language support, rotation error detection, dialog with Cancel/Continue buttons
// =============================================================================

(function() {
    'use strict';
    
    const translations = {
        en: {
            title: 'Minecraft Java Edition Rotation Checker',
            description: 'For Minecraft Java Edition 1.8-1.18.x: Detects non-standard rotations in your models and warns you before export to prevent display issues.',
            about: `# Minecraft Java Edition Rotation Checker
For Minecraft Java Edition 1.8 - 1.18.x (versions with rotation restrictions)

## ⚠️ Important Note
This plugin is designed for **older Minecraft Java Edition versions** (1.8 - 1.18.x) that have 22.5° rotation restrictions. Minecraft 1.19+ may have relaxed these restrictions - please verify compatibility with your target version.

## 🎯 Features
• **Smart Detection**: Identifies rotations that don't follow Java Edition's 22.5° standard
• **Export Protection**: Shows warning dialog before exporting JSON or BBModel files
• **Auto-Fix**: Automatically corrects rotations to nearest standard values
• **User Choice**: Continue export or cancel to fix rotations first

## 📐 Minecraft Java Edition Standards (1.8 - 1.18.x)
Minecraft Java Edition 1.8 - 1.18.x supports rotations in 22.5° increments:
**-45°, -22.5°, 0°, 22.5°, 45°**

Non-standard rotations may cause visual glitches in these versions.

## 💡 How It Works
1. Plugin scans rotation values when exporting JSON or BBModel files
2. Shows warning dialog if non-standard rotations are found
3. Lists problematic elements with suggested corrections
4. Choose to fix automatically or continue export

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
            chooseFixStrategy: 'Choose Fix Strategy',
            useClosest: 'Use Closest',
            useFurthest: 'Use Furthest',
            useClosestDescription: 'Fix each rotation to its nearest standard value',
            useFurthestDescription: 'Fix each rotation to its second nearest standard value',
            fixAllDescription: 'This affects all rotations that have multiple options.',
            fixAllSuccess: 'All rotations have been fixed!',
        },
        fr: {
            title: 'Vérificateur de Rotations Minecraft Java Edition',
            description: 'Pour Minecraft Java Edition 1.8-1.18.x: Détecte automatiquement les rotations non-standard dans vos modèles et vous avertit avant l\'export pour éviter les problèmes d\'affichage.',
            rotationIssues: 'Problèmes de Rotation :',
            quickFix: 'Correction Rapide',
            continueExport: 'Continuer l\'Export',
            cancel: 'Annuler',
            fixAll: 'Tout Corriger',
            fix: 'Corriger',
            fixed: 'Corrigé ✓',
            rotationsFixed: 'rotations corrigées ✓',
            chooseFixStrategy: 'Choisir la Stratégie de Correction',
            useClosest: 'Utiliser le Plus Proche',
            useFurthest: 'Utiliser le Plus Éloigné',
            useClosestDescription: 'Corrige chaque rotation vers sa valeur standard la plus proche',
            useFurthestDescription: 'Corrige chaque rotation vers sa deuxième valeur standard la plus proche',
            fixAllDescription: 'Ceci affecte toutes les rotations qui ont plusieurs options.',
            fixAllSuccess: 'Toutes les rotations ont été corrigées !',
            about: `# Vérificateur de Rotations Minecraft Java Edition
Pour Minecraft Java Edition 1.8 - 1.18.x (versions avec restrictions de rotation)

## ⚠️ Note Importante
Ce plugin est conçu pour les **versions plus anciennes de Minecraft Java Edition** (1.8 - 1.18.x) qui ont des restrictions de rotation de 22,5°. Minecraft 1.19+ peut avoir assoupli ces restrictions - veuillez vérifier la compatibilité avec votre version cible.

## 🎯 Fonctionnalités
• **Détection Intelligente** : Identifie les rotations qui ne suivent pas la norme 22,5° de Java Edition
• **Protection d'Export** : Affiche une boîte de dialogue d'avertissement avant l'export des fichiers JSON ou BBModel
• **Correction Auto** : Corrige automatiquement les rotations vers les valeurs standard les plus proches
• **Choix de l'Utilisateur** : Continuer l'export ou annuler pour corriger les rotations d'abord

## 📐 Normes Minecraft Java Edition (1.8 - 1.18.x)
Minecraft Java Edition 1.8 - 1.18.x supporte les rotations par incréments de 22,5° :
**-45°, -22,5°, 0°, 22,5°, 45°**

Les rotations non-standard peuvent causer des problèmes visuels dans ces versions.

## 💡 Comment Ça Marche
1. Le plugin analyse les valeurs de rotation lors de l'export JSON ou BBModel
2. Affiche une boîte de dialogue d'avertissement si des rotations non-standard sont trouvées
3. Liste les éléments problématiques avec les corrections suggérées
4. Choisir de corriger automatiquement ou continuer l'export

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
        }
    };

    function detectLanguage() {
        if (typeof Settings !== 'undefined' && Settings.language) {
            return Settings.language.startsWith('fr') ? 'fr' : 'en';
        }
        
        const docLang = document.documentElement.lang || navigator.language;
        if (docLang && docLang.startsWith('fr')) {
            return 'fr';
        }
        
        return 'en';
    }

    function t(key) {
        const lang = detectLanguage();
        return translations[lang][key] || translations.en[key] || key;
    }

    Plugin.register('check_invalid_rotation', {
        title: t('title'),
        author: 'AnnJ',
        description: t('description'),
        icon: 'warning',
        version: '1.0.0',
        variant: 'both',
        tags: ['rotation', 'validation', 'export'],
        about: t('about'),
        onload() {
            initialize();
        },
        onunload() {
            if (clickHandler) {
                document.removeEventListener('click', clickHandler, true);
                clickHandler = null;
            }
            
            if (window.rotationCheckerOriginalFunctions && typeof Codecs !== 'undefined') {
                if (window.rotationCheckerOriginalFunctions.java_block && Codecs.java_block) {
                    Codecs.java_block.export = window.rotationCheckerOriginalFunctions.java_block;
                }
                if (window.rotationCheckerOriginalFunctions.bedrock && Codecs.bedrock) {
                    Codecs.bedrock.export = window.rotationCheckerOriginalFunctions.bedrock;
                }
                delete window.rotationCheckerOriginalFunctions;
            }
        }
    });
    
    const STANDARD_ROTATIONS = [-45, -22.5, 0, 22.5, 45];
    const ROTATION_TOLERANCE = 0.1;
    
    function isStandardRotation(rotation) {
        let normalizedRotation = ((rotation % 360) + 360) % 360;
        
        let isStandard = STANDARD_ROTATIONS.some(standard => 
            Math.abs(normalizedRotation - standard) <= ROTATION_TOLERANCE
        );
        
        if (!isStandard) {
            isStandard = STANDARD_ROTATIONS.some(standard => 
                Math.abs(rotation - standard) <= ROTATION_TOLERANCE
            );
        }
        
        return isStandard;
    }
    
    function getNearestStandard(rotation) {
        let nearest = 0;
        let minDiff = Infinity;
        
        STANDARD_ROTATIONS.forEach(standard => {
            let diff = Math.abs(rotation - standard);
            
            if (diff > 180) {
                diff = 360 - diff;
            }
            
            if (diff < minDiff) {
                minDiff = diff;
                nearest = standard;
            }
        });
        
        return nearest;
    }
    
    function getNearestStandards(rotation, count = 2) {
        const distances = STANDARD_ROTATIONS.map(standard => {
            let diff = Math.abs(rotation - standard);
            if (diff > 180) {
                diff = 360 - diff;
            }
            return { standard, distance: diff };
        });
        
        distances.sort((a, b) => a.distance - b.distance);
        return distances.slice(0, count).map(item => item.standard);
    }
    
    function extractRotations(modelData) {
        const nonStandardRotations = [];
        const processedRotations = new Set();
        
        function checkElement(element, path = '') {
            if (!element) return;
            
            const rotationProps = ['rotation', 'rot', 'rotation_x', 'rotation_y', 'rotation_z', 'rx', 'ry', 'rz'];
            
            rotationProps.forEach(prop => {
                if (element[prop] !== undefined) {
                    const rotationValue = element[prop];
                    
                    if (Array.isArray(rotationValue)) {
                        rotationValue.forEach((rotation, index) => {
                            const rotationNum = parseFloat(rotation);
                            if (!isNaN(rotationNum) && !isStandardRotation(rotationNum)) {
                                const axis = ['X', 'Y', 'Z'][index] || index;
                                const rotationKey = `${path}:${prop}[${axis}]:${rotationNum}:${element.uuid || 'no-uuid'}`;
                                
                                if (!processedRotations.has(rotationKey)) {
                                    processedRotations.add(rotationKey);
                                    nonStandardRotations.push({
                                        path: path || 'root',
                                        property: `${prop}[${axis}]`,
                                        value: rotationNum,
                                        element: element
                                    });
                                }
                            }
                        });
                    } else {
                        const rotation = parseFloat(rotationValue);
                        if (!isNaN(rotation) && !isStandardRotation(rotation)) {
                            const rotationKey = `${path}:${prop}:${rotation}:${element.uuid || 'no-uuid'}`;
                            
                            if (!processedRotations.has(rotationKey)) {
                                processedRotations.add(rotationKey);
                                nonStandardRotations.push({
                                    path: path || 'root',
                                    property: prop,
                                    value: rotation,
                                    element: element
                                });
                            }
                        }
                    }
                }
            });
            
            if (element.children) {
                element.children.forEach((child, index) => {
                    checkElement(child, `${path}.children[${index}]`);
                });
            }
            
            if (element.elements) {
                element.elements.forEach((elem, index) => {
                    checkElement(elem, `${path}.elements[${index}]`);
                });
            }
        }
        
        const processedElements = new Set();
        
        if (modelData.elements) {
            modelData.elements.forEach((element, index) => {
                if (!processedElements.has(element)) {
                    processedElements.add(element);
                    checkElement(element, `elements[${index}]`);
                }
            });
        }
        
        if (modelData.bones) {
            modelData.bones.forEach((bone, index) => {
                if (!processedElements.has(bone)) {
                    processedElements.add(bone);
                    checkElement(bone, `bones[${index}]`);
                }
            });
        }
        
        if (modelData.children) {
            modelData.children.forEach((child, index) => {
                if (!processedElements.has(child)) {
                    processedElements.add(child);
                    checkElement(child, `children[${index}]`);
                }
            });
        }
        
        const rootProperties = Object.keys(modelData).filter(key => 
            !['elements', 'bones', 'children'].includes(key)
        );
        
        if (rootProperties.length > 0 && !processedElements.has(modelData)) {
            let hasProcessedChildren = false;
            if (modelData.elements) {
                hasProcessedChildren = modelData.elements.some(element => processedElements.has(element));
            }
            if (modelData.bones) {
                hasProcessedChildren = hasProcessedChildren || modelData.bones.some(bone => processedElements.has(bone));
            }
            if (modelData.children) {
                hasProcessedChildren = hasProcessedChildren || modelData.children.some(child => processedElements.has(child));
            }
            
            if (!hasProcessedChildren) {
                checkElement(modelData, 'root');
            }
        }
        
        return nonStandardRotations;
    }
    
    function applyRotationFix(rotation) {
        const standardValue = getNearestStandard(rotation.value);
        return applyRotationFixWithValue(rotation, standardValue);
    }
        
    function applyRotationFixWithValue(rotation, standardValue) {
        
        const pathParts = rotation.property.match(/^(.+?)\[([XYZ])\]$/);
        if (pathParts) {
            const baseProperty = pathParts[1];
            const axis = pathParts[2];
            const axisIndex = ['X', 'Y', 'Z'].indexOf(axis);
            
            if (axisIndex !== -1 && rotation.element[baseProperty] && Array.isArray(rotation.element[baseProperty])) {
                rotation.element[baseProperty][axisIndex] = standardValue;
                
                if (rotation.element.uuid && Outliner && Outliner.elements) {
                    const sceneElement = Outliner.elements.find(el => el.uuid === rotation.element.uuid);
                    if (sceneElement && sceneElement.rotation) {
                        sceneElement.rotation[axisIndex] = standardValue;
                    }
                }
                
                if (Project && Project.geometry && Project.geometry.elements) {
                    const projectElement = Project.geometry.elements.find(el => el.uuid === rotation.element.uuid);
                    if (projectElement && projectElement[baseProperty]) {
                        projectElement[baseProperty][axisIndex] = standardValue;
                    }
                }
                
                return true;
            }
        } else {
            if (rotation.element[rotation.property] !== undefined) {
                rotation.element[rotation.property] = standardValue;
                
                if (rotation.element.uuid && Outliner && Outliner.elements) {
                    const sceneElement = Outliner.elements.find(el => el.uuid === rotation.element.uuid);
                    if (sceneElement) {
                        sceneElement[rotation.property] = standardValue;
                    }
                }
                
                if (Project && Project.geometry && Project.geometry.elements) {
                    const projectElement = Project.geometry.elements.find(el => el.uuid === rotation.element.uuid);
                    if (projectElement) {
                        projectElement[rotation.property] = standardValue;
                    }
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    function applyAllRotationFixes(rotations, optionIndex = 0) {
        let fixedCount = 0;
        const fixedRotations = new Set();
        
        rotations.forEach(rotation => {
            const rotationKey = `${rotation.path}:${rotation.property}:${rotation.value}`;
            
            if (!fixedRotations.has(rotationKey)) {
                const nearestStandards = getNearestStandards(rotation.value, 2);
                const selectedStandard = nearestStandards[optionIndex] || nearestStandards[0];
                
                if (applyRotationFixWithValue(rotation, selectedStandard)) {
                    fixedCount++;
                    fixedRotations.add(rotationKey);
                }
            }
        });
        
        if (fixedCount > 0) {
            refreshScene();
        }
        
        return fixedCount;
    }
    
    function refreshScene() {
            // Removed non-compatible Blockbench API calls
            // The scene will refresh automatically when needed
    }
    
    function showRotationWarningDialog(rotations, onConfirm, onCancel) {
        
        let rotationListHTML = '';
        rotations.forEach((rotation, index) => {
            const elementName = rotation.element.name || rotation.path || 'Unknown Element';
            const propertyName = rotation.property;
            const currentValue = rotation.value;
            const nearestStandards = getNearestStandards(rotation.value, 2);
            
            const optionsHTML = nearestStandards.map((standard, optionIndex) => {
                const isClosest = optionIndex === 0;
                const buttonStyle = isClosest ? 
                    'background: #4caf50; color: white;' : 
                    'background: #2196f3; color: white;';
                const buttonText = isClosest ? 
                    `${t('fix')} → ${standard}°` : 
                    `${standard}°`;
                
                return `
                    <button id="fix_btn_${index}_${optionIndex}" class="button" style="${buttonStyle} border: none; padding: 4px 8px; border-radius: 3px; font-size: 11px; cursor: pointer; margin-left: 4px;">
                        ${buttonText}
                    </button>
                `;
            }).join('');
            
            rotationListHTML += `
                <div style="padding: 8px; border-bottom: 1px solid var(--color-border, #555);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <div>
                            <div style="font-weight: 500;">${elementName}</div>
                            <div style="font-size: 12px; color: var(--color-text-secondary, #aaa);">
                                ${propertyName}: <span style="color: #f44336;">${currentValue}°</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            ${optionsHTML}
                        </div>
                    </div>
                    <div style="font-size: 11px; color: var(--color-text-secondary, #aaa);">
                        Choose: ${nearestStandards.map(s => `${s}°`).join(' or ')}
                    </div>
            </div>
        `;
        });
        
        const dialog = new Dialog('rotation_warning_dialog', {
            title: t('dialogTitle'),
            width: 600,
            buttons: [t('fixAll'), t('cancelExport'), t('continueExport')],
            cancelIndex: 1,
            confirmIndex: 2,
            component: {
                data() {
                    return {
                        rotations: rotations,
                        fixedCount: 0,
                        isFixed: false
                    };
                },
                template: `
                    <div>
                        <div v-if="!isFixed" style="background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.3); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <i class="material-icons" style="color: #f44336; margin-right: 8px; font-size: 18px;">error_outline</i>
                <strong style="color: #f44336;">${rotations.length} ${t('warningMessage')}</strong>
            </div>
            <p style="margin: 0; color: var(--color-text, #ffffff); font-size: 14px;">
                ${t('warningDescription')}
            </p>
                </div>
                        <div v-else style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <i class="material-icons" style="color: #4caf50; margin-right: 8px; font-size: 18px;">check_circle</i>
                                <strong style="color: #4caf50;">{{ fixedCount }} ${t('rotationsFixed')}</strong>
                            </div>
                            <p style="margin: 0; color: var(--color-text, #ffffff); font-size: 14px;">
                                All rotations have been fixed to standard values. You can now export safely or cancel to review the changes.
                            </p>
                        </div>
                        <div style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <i class="material-icons" style="color: #4caf50; margin-right: 8px; font-size: 18px;">auto_fix_high</i>
                                <strong style="color: #4caf50;">${t('quickFix')}</strong>
            </div>
            <p style="margin: 0; color: var(--color-text, #ffffff); font-size: 14px;">
                ${t('quickFixDescription')}
            </p>
                </div>
                        <h4 style="margin: 0 0 8px 0; color: var(--color-text, #ffffff); font-size: 16px; font-weight: 600;">${t('rotationIssues')}</h4>
                        <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--color-border, #555); border-radius: 4px; background: var(--color-background, #2d2d2d);">
                            ${rotationListHTML}
                        </div>
                    </div>
                `
            },
            onButton(index) {
                if (index === 0) {
                    showFixAllChoiceDialog(rotations, dialog);
                    return false;
                } else if (index === 1) {
            onCancel();
                } else if (index === 2) {
            onConfirm();
                }
            }
        });
        
        const setupEventDelegation = () => {
            const dialogElement = document.querySelector('.dialog[data-dialog="rotation_warning_dialog"]') || 
                                 document.querySelector('#rotation_warning_dialog') ||
                                 document.querySelector('.dialog');
            
            if (dialogElement) {
                dialogElement.addEventListener('click', (event) => {
                    const target = event.target;
                    if (target && target.id && target.id.startsWith('fix_btn_')) {
                        const idParts = target.id.replace('fix_btn_', '').split('_');
                        const rotationIndex = parseInt(idParts[0]);
                        const optionIndex = parseInt(idParts[1]);
                        const rotation = rotations[rotationIndex];
                        
                        if (rotation) {
                            event.preventDefault();
                            event.stopPropagation();
                            
                            const nearestStandards = getNearestStandards(rotation.value, 2);
                            const selectedStandard = nearestStandards[optionIndex];
                            
                            if (applyRotationFixWithValue(rotation, selectedStandard)) {
                                const allButtons = dialogElement.querySelectorAll(`[id^="fix_btn_${rotationIndex}_"]`);
                                allButtons.forEach(btn => {
                                    btn.innerHTML = t('fixed');
                                    btn.style.background = '#4caf50';
                                    btn.disabled = true;
                                });
                                refreshScene();
                            }
                        }
                    }
                });
            } else {
                setTimeout(setupEventDelegation, 50);
            }
        };
        
        setupEventDelegation();
        dialog.show();
    }

    function showFixAllChoiceDialog(rotations, parentDialog) {
        const choiceDialog = new Dialog('fix_all_choice_dialog', {
            title: t('chooseFixStrategy'),
            width: 400,
            buttons: [t('useClosest'), t('useFurthest'), t('cancel')],
            cancelIndex: 2,
            lines: [
                t('chooseFixStrategy'),
                '',
                `• ${t('useClosest')}: ${t('useClosestDescription')}`,
                `• ${t('useFurthest')}: ${t('useFurthestDescription')}`,
                '',
                t('fixAllDescription')
            ],
            onButton(index) {
                if (index === 0) {
                    const fixedCount = applyAllRotationFixes(rotations, 0);
                    if (fixedCount > 0) {
                        refreshScene();
                        parentDialog.component.data.fixedCount = fixedCount;
                        parentDialog.component.data.isFixed = true;
                        
                        rotations.forEach((rotation, rotationIndex) => {
                            const allButtons = document.querySelectorAll(`[id^="fix_btn_${rotationIndex}_"]`);
                            allButtons.forEach(btn => {
                                btn.innerHTML = t('fixed');
                                btn.style.background = '#4caf50';
                                btn.disabled = true;
                            });
                        });
                    }
                } else if (index === 1) {
                    const fixedCount = applyAllRotationFixes(rotations, 1);
                    if (fixedCount > 0) {
                        refreshScene();
                        parentDialog.component.data.fixedCount = fixedCount;
                        parentDialog.component.data.isFixed = true;
                        
                        rotations.forEach((rotation, rotationIndex) => {
                            const allButtons = document.querySelectorAll(`[id^="fix_btn_${rotationIndex}_"]`);
                            allButtons.forEach(btn => {
                                btn.innerHTML = t('fixed');
                                btn.style.background = '#4caf50';
                                btn.disabled = true;
                            });
                        });
                    }
                }
            }
        });
        
        choiceDialog.show();
    }
    
    let clickHandler = null;
    
    function initialize() {
        if (typeof Codecs !== 'undefined') {
            const originalExportFunctions = {};
            
            if (Codecs.java_block && Codecs.java_block.export) {
                originalExportFunctions.java_block = Codecs.java_block.export;
                Codecs.java_block.export = function() {
                    const nonStandardRotations = extractRotations(Project);
                            if (nonStandardRotations.length > 0) {
                                showRotationWarningDialog(
                                    nonStandardRotations,
                            () => originalExportFunctions.java_block.call(this),
                            () => {}
                                );
                            } else {
                        originalExportFunctions.java_block.call(this);
                    }
                };
            }
            
            if (Codecs.bedrock && Codecs.bedrock.export) {
                originalExportFunctions.bedrock = Codecs.bedrock.export;
                Codecs.bedrock.export = function() {
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                        showRotationWarningDialog(
                            nonStandardRotations,
                            () => originalExportFunctions.bedrock.call(this),
                            () => {}
                        );
                    } else {
                        originalExportFunctions.bedrock.call(this);
                    }
                };
            }
            
            window.rotationCheckerOriginalFunctions = originalExportFunctions;
        }
    }
    
})();
