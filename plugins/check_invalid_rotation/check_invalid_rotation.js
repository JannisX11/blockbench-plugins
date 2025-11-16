(function() {
    'use strict';
    
    const translations = {
        en: {
            title: 'Invalid Rotation Checker',
            description: 'Detects non-standard rotations and warns before save/export.',
            about: `Minecraft Java Edition Rotation Checker

For Minecraft Java Edition 1.8 - 1.18.x (versions with rotation restrictions)

<h3>What It Does</h3>
Comprehensive rotation validation that protects your models from compatibility issues. Works with ALL save and export operations to catch non-standard rotations before they cause display problems in Minecraft.

<h3>How It Works</h3>
1. Universal Protection: Scans rotations during save (Ctrl+Alt+S), save as (Ctrl+Shift+Alt+S), and export operations</br>
2. Smart Detection: Identifies rotations that don't follow the 22.5° standard</br>
3. Context-Aware Warnings: Shows operation-specific dialogs with appropriate button text</br>
4. Quick Fix Options: Automatically fix rotations or choose to fix individually with nearest/furthest options
5. User Control: Continue the operation or cancel to fix rotations first
`,
            dialogTitle: 'Non-Standard Rotations Detected',
            warningMessage: 'non-standard rotation(s) found',
            warningDescription: 'These rotations may cause display issues in Minecraft. Consider fixing them before saving/exporting.',
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
            rotationsWillBeCorrected: 'rotation(s) will be corrected',
            clickOptionThenButtons: 'Click on an option above, then use the buttons below',
            fixAllSuccess: 'All rotations have been fixed!',
        },
        fr: {
            title: 'Vérificateur de Rotations',
            description: 'Détecte les rotations non-standard et avertit avant sauvegarde/export.',
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
            rotationsWillBeCorrected: 'rotation(s) sera(ont) corrigée(s)',
            clickOptionThenButtons: 'Cliquez sur une option ci-dessus, puis utilisez les boutons ci-dessous',
            fixAllSuccess: 'Toutes les rotations ont été corrigées !',
            about: `Vérificateur de Rotations Minecraft Java Edition

Pour Minecraft Java Edition 1.8 - 1.18.x (versions avec restrictions de rotation)

<h3>Fonctionnalités</h3>
Validation complète des rotations qui protège vos modèles des problèmes de compatibilité. Fonctionne avec TOUTES les opérations de sauvegarde et d'export pour détecter les rotations non-standard avant qu'elles ne causent des problèmes d'affichage dans Minecraft.

<h3>Comment Ça Marche</h3>
1. Protection Universelle : Analyse les rotations lors de la sauvegarde (Ctrl+Alt+S), enregistrer sous (Ctrl+Shift+Alt+S), et les opérations d'export</br>
2. Détection Intelligente : Identifie les rotations qui ne suivent pas la norme 22,5°</br>
3. Avertissements Contextuels : Affiche des dialogues spécifiques à l'opération avec le texte de bouton approprié</br>
4. Options de Correction Rapide : Corrige automatiquement les rotations ou choisissez de les corriger individuellement avec options plus proche/plus éloigné</br>
5. Contrôle Utilisateur : Continuer l'opération ou annuler pour corriger les rotations d'abord
`,
            dialogTitle: 'Rotations Non-Standard Détectées',
            warningMessage: 'rotation(s) non-standard trouvée(s)',
            warningDescription: 'Ces rotations peuvent causer des problèmes d\'affichage dans Minecraft. Considérez de les corriger avant la sauvegarde/export.',
            rotationIssues: 'Problèmes de Rotation :',
            quickFix: 'Correction Rapide',
            quickFixDescription: 'Corriger automatiquement toutes les rotations vers leurs valeurs standard les plus proches.',
            fixAll: 'Tout Corriger',
            fix: 'Corriger',
            fixed: 'Corrigé ✓',
            rotationsFixed: 'Rotations corrigées ✓',
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
        tags: ['Rotation', 'Validation', 'Export'],
        about: t('about'),
        onload() {
            initialize();
            setTimeout(() => {
                addSaveIntegration();
            }, 3000);
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
            
            if (window.rotationCheckerOriginalSaveFunctions) {
                if (MenuBar && MenuBar.actions) {
                    const saveAction = MenuBar.actions.find(action => action.id === 'file.save');
                    const saveAsAction = MenuBar.actions.find(action => action.id === 'file.save_as');
                    
                    if (saveAction && window.rotationCheckerOriginalSaveFunctions.save) {
                        saveAction.click = window.rotationCheckerOriginalSaveFunctions.save;
                    }
                    if (saveAsAction && window.rotationCheckerOriginalSaveFunctions.saveAs) {
                        saveAsAction.click = window.rotationCheckerOriginalSaveFunctions.saveAs;
                    }
                }
                
                delete window.rotationCheckerOriginalSaveFunctions;
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
        if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
            Canvas.updateAll();
        }
        if (typeof Outliner !== 'undefined' && Outliner.update) {
            Outliner.update();
        }
        if (typeof Interface !== 'undefined' && Interface.update) {
            Interface.update();
        }
    }
    
    function showRotationWarningDialog(rotations, onConfirm, onCancel, context = 'export') {
        const getButtonText = (buttonType) => {
            const lang = detectLanguage();
            const translations = {
                en: {
                    export: {
                        fixAll: 'Fix All',
                        cancel: 'Cancel Export',
                        continue: 'Continue Export'
                    },
                    save: {
                        fixAll: 'Fix All',
                        cancel: 'Cancel Save',
                        continue: 'Continue Save'
                    },
                    saveAs: {
                        fixAll: 'Fix All',
                        cancel: 'Cancel Save As',
                        continue: 'Continue Save As'
                    },
                    saveIncrement: {
                        fixAll: 'Fix All',
                        cancel: 'Cancel Save with Increment',
                        continue: 'Continue Save with Increment'
                    }
                },
                fr: {
                    export: {
                        fixAll: 'Tout Corriger',
                        cancel: 'Annuler l\'Export',
                        continue: 'Continuer l\'Export'
                    },
                    save: {
                        fixAll: 'Tout Corriger',
                        cancel: 'Annuler la Sauvegarde',
                        continue: 'Continuer la Sauvegarde'
                    },
                    saveAs: {
                        fixAll: 'Tout Corriger',
                        cancel: 'Annuler Enregistrer Sous',
                        continue: 'Continuer Enregistrer Sous'
                    },
                    saveIncrement: {
                        fixAll: 'Tout Corriger',
                        cancel: 'Annuler Enregistrer avec Incrément',
                        continue: 'Continuer Enregistrer avec Incrément'
                    }
                }
            };
            return translations[lang]?.[context]?.[buttonType] || translations.en[context]?.[buttonType] || buttonType;
        };
        
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
            buttons: [getButtonText('fixAll'), getButtonText('cancel'), getButtonText('continue')],
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
            }
        });
        
        dialog.onButton = function(index) {
            if (index === 0) {
                showFixAllChoiceDialog(rotations, dialog);
                return false;
            } else if (index === 1) {
                onCancel();
                return true;
            } else if (index === 2) {
                onConfirm();
                return true;
            }
            return true;
        };
        
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
                                setTimeout(() => {
                                    refreshScene();
                                }, 100);
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
            width: 500,
            height: 300,
            buttons: [t('fixAll'), t('cancel')],
            cancelIndex: 1,
            component: {
                template: `
                    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">
                                ${t('chooseFixStrategy')}
                            </div>
                            <div style="font-size: 14px; color: #aaa; margin-bottom: 20px;">
                                ${t('fixAllDescription')}
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                            <div style="flex: 1; padding: 16px; background: linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%); border-radius: 8px; border: 2px solid #4a4a4a; cursor: pointer; transition: all 0.2s ease;" 
                                 @click="selectStrategy('closest')" 
                                 :style="{ borderColor: selectedStrategy === 'closest' ? '#4caf50' : '#4a4a4a', background: selectedStrategy === 'closest' ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)' : 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)' }">
                                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                    <div style="width: 24px; height: 24px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px; font-weight: bold; color: white;">
                                        ✓
                                    </div>
                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff;">
                                        ${t('useClosest')}
                                    </div>
                                </div>
                                <div style="font-size: 13px; color: #ccc; line-height: 1.4;">
                                    ${t('useClosestDescription')}
                                </div>
                                <div style="margin-top: 8px; font-size: 12px; color: #888; font-style: italic;">
                                    Ex: 23° → 22.5°
                                </div>
                            </div>
                            
                            <div style="flex: 1; padding: 16px; background: linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%); border-radius: 8px; border: 2px solid #4a4a4a; cursor: pointer; transition: all 0.2s ease;" 
                                 @click="selectStrategy('furthest')" 
                                 :style="{ borderColor: selectedStrategy === 'furthest' ? '#2196f3' : '#4a4a4a', background: selectedStrategy === 'furthest' ? 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)' : 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)' }">
                                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                    <div style="width: 24px; height: 24px; background: #2196f3; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px; font-weight: bold; color: white;">
                                        →
                                    </div>
                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff;">
                                        ${t('useFurthest')}
                                    </div>
                                </div>
                                <div style="font-size: 13px; color: #ccc; line-height: 1.4;">
                                    ${t('useFurthestDescription')}
                                </div>
                                <div style="margin-top: 8px; font-size: 12px; color: #888; font-style: italic;">
                                    Ex: 23° → 45°
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; padding: 16px; background: #1a1a1a; border-radius: 6px; border: 1px solid #333;">
                            <div style="font-size: 12px; color: #888; margin-bottom: 4px;">
                                ${rotations.length} ${t('rotationsWillBeCorrected')}
                            </div>
                            <div style="font-size: 11px; color: #666;">
                                ${t('clickOptionThenButtons')}
                            </div>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        selectedStrategy: 'closest'
                    };
                },
                methods: {
                    selectStrategy(strategy) {
                        this.selectedStrategy = strategy;
                    }
                }
            },
            onButton(index) {
                if (index === 0) {
                    const selectedStrategy = choiceDialog.component.data.selectedStrategy;
                    const strategyIndex = selectedStrategy === 'closest' ? 0 : 1;
                    const fixedCount = applyAllRotationFixes(rotations, strategyIndex);
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
                        
                        Blockbench.showQuickMessage(t('fixAllSuccess'), 2000);
                        if (typeof Interface !== 'undefined' && Interface.update) {
                            Interface.update();
                        }
                    }
                    return true;
                } else {
                    return true;
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
                            () => {},
                            'export'
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
                            () => {},
                            'export'
                        );
                    } else {
                        originalExportFunctions.bedrock.call(this);
                    }
                };
            }
            
            window.rotationCheckerOriginalFunctions = originalExportFunctions;
        }
    }
    
    function addSaveIntegration() {
        if (!window.rotationCheckerOriginalSaveFunctions) {
            window.rotationCheckerOriginalSaveFunctions = {};
        }
        
        if (typeof Blockbench !== 'undefined') {
            if (Blockbench.save && !window.rotationCheckerOriginalSaveFunctions.blockbenchSave) {
                window.rotationCheckerOriginalSaveFunctions.blockbenchSave = Blockbench.save;
                Blockbench.save = function() {
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                        showRotationWarningDialog(
                            nonStandardRotations,
                            () => {
                                window.rotationCheckerOriginalSaveFunctions.blockbenchSave();
                            },
                            () => {},
                            'save'
                        );
                    } else {
                        window.rotationCheckerOriginalSaveFunctions.blockbenchSave();
                    }
                };
            }
            
            if (Blockbench.saveAs && !window.rotationCheckerOriginalSaveFunctions.blockbenchSaveAs) {
                window.rotationCheckerOriginalSaveFunctions.blockbenchSaveAs = Blockbench.saveAs;
                Blockbench.saveAs = function() {
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                        showRotationWarningDialog(
                            nonStandardRotations,
                            () => {
                                window.rotationCheckerOriginalSaveFunctions.blockbenchSaveAs();
                            },
                            () => {},
                            'saveAs'
                        );
                    } else {
                        window.rotationCheckerOriginalSaveFunctions.blockbenchSaveAs();
                    }
                };
            }
            
            if (Blockbench.saveIncrement && !window.rotationCheckerOriginalSaveFunctions.blockbenchSaveIncrement) {
                window.rotationCheckerOriginalSaveFunctions.blockbenchSaveIncrement = Blockbench.saveIncrement;
                Blockbench.saveIncrement = function() {
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                        showRotationWarningDialog(
                            nonStandardRotations,
                            () => {
                                window.rotationCheckerOriginalSaveFunctions.blockbenchSaveIncrement();
                            },
                            () => {},
                            'saveIncrement'
                        );
                    } else {
                        window.rotationCheckerOriginalSaveFunctions.blockbenchSaveIncrement();
                    }
                };
            }
        }
        
        if (MenuBar && MenuBar.menus && MenuBar.menus.file && MenuBar.menus.file.structure) {
            let saveItem = MenuBar.menus.file.structure.find(item => 
                (typeof item === 'string' && item === 'save_project') || 
                (typeof item === 'object' && item && item.id === 'save_project')
            );
            let saveAsItem = MenuBar.menus.file.structure.find(item => 
                (typeof item === 'string' && item === 'save_project_as') || 
                (typeof item === 'object' && item && item.id === 'save_project_as')
            );
            let saveIncrementItem = MenuBar.menus.file.structure.find(item => 
                (typeof item === 'string' && item === 'save_project_incremental') || 
                (typeof item === 'object' && item && item.id === 'save_project_incremental')
            );
            
            if (!saveItem || !saveAsItem || !saveIncrementItem) {
                MenuBar.menus.file.structure.forEach(item => {
                    if (item && item.children && Array.isArray(item.children)) {
                        item.children.forEach(child => {
                            if (child && child.id) {
                                if (child.id === 'save_project' && !saveItem) {
                                    saveItem = child;
                                }
                                if (child.id === 'save_project_as' && !saveAsItem) {
                                    saveAsItem = child;
                                }
                                if (child.id === 'save_project_incremental' && !saveIncrementItem) {
                                    saveIncrementItem = child;
                                }
                            }
                        });
                    }
                });
            }
            
            if (!saveItem || !saveAsItem || !saveIncrementItem) {
                const allItems = [];
                
                MenuBar.menus.file.structure.forEach(item => {
                    if (item && typeof item === 'object' && item.id) {
                        allItems.push(item);
                        if (item.children && Array.isArray(item.children)) {
                            item.children.forEach(child => {
                                if (child && typeof child === 'object' && child.id) {
                                    allItems.push(child);
                                }
                            });
                        }
                    }
                });
                
                saveItem = allItems.find(item => item.id === 'save_project' || item.id === 'save' || item.id.includes('save_project'));
                saveAsItem = allItems.find(item => item.id === 'save_project_as' || item.id === 'save_as' || item.id.includes('save_project_as'));
                saveIncrementItem = allItems.find(item => item.id === 'save_project_incremental' || item.id === 'save_incremental' || item.id.includes('save_project_incremental'));
            }
            
            if (saveItem && typeof saveItem === 'string') {
                if (MenuBar.actions) {
                    saveItem = MenuBar.actions.find(action => action.id === saveItem);
                } else {
                    saveItem = MenuBar.menus.file.structure.find(item => 
                        typeof item === 'object' && item && item.id === saveItem
                    );
                }
            }
            if (saveAsItem && typeof saveAsItem === 'string') {
                if (MenuBar.actions) {
                    saveAsItem = MenuBar.actions.find(action => action.id === saveAsItem);
                } else {
                    saveAsItem = MenuBar.menus.file.structure.find(item => 
                        typeof item === 'object' && item && item.id === saveAsItem
                    );
                }
            }
            if (saveIncrementItem && typeof saveIncrementItem === 'string') {
                if (MenuBar.actions) {
                    saveIncrementItem = MenuBar.actions.find(action => action.id === saveIncrementItem);
                } else {
                    saveIncrementItem = MenuBar.menus.file.structure.find(item => 
                        typeof item === 'object' && item && item.id === saveIncrementItem
                    );
                }
            }
            
            if (saveItem && typeof saveItem === 'object' && saveItem.click && !window.rotationCheckerOriginalSaveFunctions.save) {
                window.rotationCheckerOriginalSaveFunctions.save = saveItem.click;
                saveItem.click = function() {
                    checkRotationsBeforeSave(window.rotationCheckerOriginalSaveFunctions.save, 'save');
                };
            }
            
            if (saveAsItem && typeof saveAsItem === 'object' && saveAsItem.click && !window.rotationCheckerOriginalSaveFunctions.saveAs) {
                window.rotationCheckerOriginalSaveFunctions.saveAs = saveAsItem.click;
                saveAsItem.click = function() {
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                        showRotationWarningDialog(
                            nonStandardRotations,
                            () => {
                                window.rotationCheckerOriginalSaveFunctions.saveAs();
                            },
                            () => {},
                            'saveAs'
                        );
                    } else {
                        window.rotationCheckerOriginalSaveFunctions.saveAs();
                    }
                };
            }
            
            if (saveIncrementItem && typeof saveIncrementItem === 'object' && saveIncrementItem.click && !window.rotationCheckerOriginalSaveFunctions.saveIncrement) {
                window.rotationCheckerOriginalSaveFunctions.saveIncrement = saveIncrementItem.click;
                saveIncrementItem.click = function() {
                    checkRotationsBeforeSave(window.rotationCheckerOriginalSaveFunctions.saveIncrement, 'saveIncrement');
                };
            }
        }

        try {
            if (typeof BarItems !== 'undefined') {
                if (BarItems.save_project_as && typeof BarItems.save_project_as.click === 'function' && !window.rotationCheckerOriginalSaveFunctions.barSaveAs) {
                    window.rotationCheckerOriginalSaveFunctions.barSaveAs = BarItems.save_project_as.click;
                    BarItems.save_project_as.click = function() {
                        const nonStandardRotations = extractRotations(Project);
                        if (nonStandardRotations.length > 0) {
                            showRotationWarningDialog(
                                nonStandardRotations,
                                () => {
                                    Promise.resolve().then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
                                        window.rotationCheckerOriginalSaveFunctions.barSaveAs.call(this);
                                    })));
                                },
                                () => {},
                                'saveAs'
                            );
                        } else {
                            window.rotationCheckerOriginalSaveFunctions.barSaveAs.call(this);
                        }
                    };
                }
                if (BarItems.save_project && typeof BarItems.save_project.click === 'function' && !window.rotationCheckerOriginalSaveFunctions.barSave) {
                    window.rotationCheckerOriginalSaveFunctions.barSave = BarItems.save_project.click;
                    BarItems.save_project.click = function() {
                        checkRotationsBeforeSave(window.rotationCheckerOriginalSaveFunctions.barSave.bind(this), 'save');
                    };
                }
                if (BarItems.save_project_incremental && typeof BarItems.save_project_incremental.click === 'function' && !window.rotationCheckerOriginalSaveFunctions.barSaveInc) {
                    window.rotationCheckerOriginalSaveFunctions.barSaveInc = BarItems.save_project_incremental.click;
                    BarItems.save_project_incremental.click = function() {
                        checkRotationsBeforeSave(window.rotationCheckerOriginalSaveFunctions.barSaveInc.bind(this), 'saveIncrement');
                    };
                }
            }
        } catch (e) {
        }
        
        const triggerSaveAsAction = () => {
            try {
                if (typeof BarItems !== 'undefined' && BarItems.save_project_as && typeof BarItems.save_project_as.click === 'function') {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            BarItems.save_project_as.click();
                        });
                    });
                    return true;
                }
            } catch (e) {
            }
            try {
                const el = document.querySelector('li[menu_item="save_project_as"]');
                if (el) {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            el.click();
                        });
                    });
                    return true;
                }
            } catch (e) {
            }
            try {
                if (typeof window.saveAs === 'function') {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            window.saveAs();
                        });
                    });
                    return true;
                }
            } catch (e) {
            }
            return false;
        };

        const addMenuClickListeners = () => {
            const saveMenuItem = document.querySelector('li[menu_item="save_project"]');
            if (saveMenuItem && !saveMenuItem.hasAttribute('data-rotation-checker-hooked')) {
                saveMenuItem.setAttribute('data-rotation-checker-hooked', 'true');
                const originalClick = saveMenuItem.onclick;
                saveMenuItem.onclick = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                        showRotationWarningDialog(
                            nonStandardRotations,
                            () => {
                                if (originalClick) originalClick.call(this, event);
                            },
                            () => {},
                            'save'
                        );
                    } else {
                        if (originalClick) originalClick.call(this, event);
                    }
                };
            }
            
            const saveAsMenuItem = document.querySelector('li[menu_item="save_project_as"]');
            if (saveAsMenuItem && !saveAsMenuItem.hasAttribute('data-rotation-checker-hooked')) {
                saveAsMenuItem.setAttribute('data-rotation-checker-hooked', 'true');
                const originalClick = saveAsMenuItem.onclick;
                saveAsMenuItem.onclick = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
                    
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                            showRotationWarningDialog(
                                nonStandardRotations,
                                () => {
                                    Promise.resolve().then(() => {
                                        requestAnimationFrame(() => {
                                            requestAnimationFrame(() => {
                                                const ok = triggerSaveAsAction();
                                                if (!ok && originalClick) {
                                                    setTimeout(() => originalClick.call(this, event), 300);
                                                }
                                            });
                                        });
                                    });
                                },
                            () => {},
                            'saveAs'
                        );
                    } else {
                        const ok = triggerSaveAsAction();
                        if (!ok && originalClick) originalClick.call(this, event);
                    }
                };
            }
            
            const saveIncrementMenuItem = document.querySelector('li[menu_item="save_project_incremental"]');
            if (saveIncrementMenuItem && !saveIncrementMenuItem.hasAttribute('data-rotation-checker-hooked')) {
                saveIncrementMenuItem.setAttribute('data-rotation-checker-hooked', 'true');
                const originalClick = saveIncrementMenuItem.onclick;
                saveIncrementMenuItem.onclick = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    const nonStandardRotations = extractRotations(Project);
                    if (nonStandardRotations.length > 0) {
                        showRotationWarningDialog(
                            nonStandardRotations,
                            () => {
                                if (originalClick) originalClick.call(this, event);
                            },
                            () => {},
                            'saveIncrement'
                        );
                    } else {
                        if (originalClick) originalClick.call(this, event);
                    }
                };
            }
        };
        
        addMenuClickListeners();
    }
    
    function checkRotationsBeforeSave(originalSaveFunction, context = 'save') {
        const nonStandardRotations = extractRotations(Project);
        if (nonStandardRotations.length > 0) {
            showRotationWarningDialog(
                nonStandardRotations,
                () => {
                    if (originalSaveFunction) {
                        originalSaveFunction.call(this);
                    }
                },
                () => {
                },
                context
            );
        } else {
            if (originalSaveFunction) {
                originalSaveFunction.call(this);
            }
        }
    }
})();
