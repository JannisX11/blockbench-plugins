(function() {
    'use strict';

    /**
     * Translation Plane Gizmo Plugin v1.0.0
     * 
     * Provides Blender-style 2D plane handles for simultaneous multi-axis translation
     * in Blockbench. Features smart camera scaling, proper margins, and seamless
     * integration with Blockbench's transform system.
     * 
     * @author AnnJ
     * @version 1.0.0
     * @compatibility Blockbench v4.0.0+
     */
    
    const PLUGIN_ID = 'translation_plane_gizmo';
    
    try {
        if (typeof MenuBar !== 'undefined' && MenuBar.removeAction) {
            MenuBar.removeAction('plane_gizmo_toggle', 'toolbar');
            MenuBar.removeAction('plane_gizmo_toggle', 'view');
            MenuBar.removeAction('plane_gizmo_toggle', 'edit');
        }
        if (typeof MenuBar !== 'undefined' && MenuBar.actions) {
            const existingAction = MenuBar.actions.find(action => action.id === 'plane_gizmo_toggle');
            if (existingAction) {
                MenuBar.removeAction(existingAction, 'toolbar');
                MenuBar.removeAction(existingAction, 'view');
                MenuBar.removeAction(existingAction, 'edit');
            }
        }
    } catch (e) {
    }

    const PLANE_CONFIG = {
        color: { XY: 0x0000ff, XZ: 0x00ff00, YZ: 0xff0000 },
        baseOpacity: 0.6,
        hoverOpacity: 1,
        renderOrder: 99999,
        snapToGrid: true,
        gridSize: 1,
        enableUndo: true,
        planeSize: 0.25,
        hoverScale: 1.3,
        offsetDistance: 4
    };

    let planeHandles = [];
    let gizmoGroup = null;
    let isDragging = false;
    let currentDragPlane = null;
    let dragStartPoint = null;
    let dragStartPosition = null;
    let dragAppliedDelta = null;
    let updateInterval = null;
    let selectionPollingInterval = null;
    let isGizmoEnabled = true;
    let menuAction = null;
    let lastHoveredPlane = null;
    let cameraEventHandlers = { wheel: null, cameraMove: null };

    function createSolidMaterial(color, opacity) {
        return new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false,
            alphaTest: 0.1,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });
    }

    function getGizmoParent() {
        if (gizmoGroup) return gizmoGroup;
        
        if (typeof scene !== 'undefined' && scene) {
            gizmoGroup = new THREE.Group();
            gizmoGroup.name = 'PlaneGizmoGroup';
            gizmoGroup.renderOrder = PLANE_CONFIG.renderOrder;
            scene.add(gizmoGroup);
            return gizmoGroup;
        }
        
        return null;
    }

    function createPlaneHandles() {
        if (planeHandles.length) {
            return;
        }
        
        const handleSize = PLANE_CONFIG.planeSize;
        const planeGeometries = {
            XY: new THREE.PlaneGeometry(handleSize, handleSize),
            XZ: new THREE.PlaneGeometry(handleSize, handleSize),
            YZ: new THREE.PlaneGeometry(handleSize, handleSize)
        };

        const planes = [
            { 
                name: 'XY', 
                color: PLANE_CONFIG.color.XY, 
                axes: ['x', 'y'], 
                rotation: new THREE.Euler(0, 0, 0), 
                offset: new THREE.Vector3(PLANE_CONFIG.offsetDistance * 0.5, PLANE_CONFIG.offsetDistance * 0.5, 0) 
            },
            { 
                name: 'XZ', 
                color: PLANE_CONFIG.color.XZ, 
                axes: ['x', 'z'], 
                rotation: new THREE.Euler(-Math.PI/2, 0, 0), 
                offset: new THREE.Vector3(PLANE_CONFIG.offsetDistance * 0.5, 0, PLANE_CONFIG.offsetDistance * 0.5) 
            },
            { 
                name: 'YZ', 
                color: PLANE_CONFIG.color.YZ, 
                axes: ['y', 'z'], 
                rotation: new THREE.Euler(0, Math.PI/2, 0), 
                offset: new THREE.Vector3(0, PLANE_CONFIG.offsetDistance * 0.5, PLANE_CONFIG.offsetDistance * 0.5) 
            }
        ];

        const parent = getGizmoParent();
        if (!parent) {
            return;
        }

        planes.forEach(plane => {
            let material;
            
            if (plane.name === 'XY') {
                material = createSolidMaterial(0x0000ff, PLANE_CONFIG.baseOpacity);
            } else if (plane.name === 'XZ') {
                material = createSolidMaterial(0x00ff00, PLANE_CONFIG.baseOpacity);
            } else if (plane.name === 'YZ') {
                material = createSolidMaterial(0xff0000, PLANE_CONFIG.baseOpacity);
            }
            
            const mesh = new THREE.Mesh(planeGeometries[plane.name], material);
            mesh.rotation.copy(plane.rotation);
            mesh.renderOrder = PLANE_CONFIG.renderOrder;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.frustumCulled = false;
            mesh.scale.setScalar(1.0);
            mesh.userData = {
                planeName: plane.name,
                axes: plane.axes,
                baseOpacity: PLANE_CONFIG.baseOpacity,
                baseScale: PLANE_CONFIG.planeSize,
                baseColor: material.color.getHex(),
                isPlaneGizmo: true,
                clickable: true,
                offset: plane.offset.clone()
            };

            parent.add(mesh);
            mesh.visible = true;
            planeHandles.push(mesh);
            
        });
        
        parent.updateMatrixWorld(true);
    }

    function toggleGizmo() {
        isGizmoEnabled = !isGizmoEnabled;
        updatePlaneHandles();
        
        if (menuAction && menuAction.update) {
            menuAction.update();
        }
        
        return isGizmoEnabled;
    }
    
    let cachedControlSize = null;
    let cachedIsTouch = null;
    let lastControlSizeCheck = 0;
    let lastTouchCheck = 0;
    
    function updatePlaneHandles() {
        if (planeHandles.length === 0) return;
        
        const now = Date.now();
        if (now - lastControlSizeCheck > 100) {
            cachedControlSize = safeGetControlSize();
            lastControlSizeCheck = now;
        }
        if (now - lastTouchCheck > 1000) {
            cachedIsTouch = safeIsTouch();
            lastTouchCheck = now;
        }
        
        const mode = Toolbox?.selected?.transformerMode;
        const isTranslate = mode === 'translate' || mode === 'move';
        
        const hasSelection = Outliner && Outliner.selected && Outliner.selected.length > 0;
        const validSelection = hasSelection && Outliner.selected.some(el => el && (el.from || el.position));
            
        const show = isGizmoEnabled 
                         && Transformer && Transformer.visible
                         && Toolbox && Toolbox.selected
                         && isTranslate
                         && validSelection;
        
        let center = new THREE.Vector3();
        let hasValidSelection = false;
        
        if (show) {
            Outliner.selected.forEach(el => {
                if (el.from && el.to) {
                    center.x += (el.from[0] + el.to[0]) * 0.5;
                    center.y += (el.from[1] + el.to[1]) * 0.5;
                    center.z += (el.from[2] + el.to[2]) * 0.5;
                    hasValidSelection = true;
                } else if (el.position) {
                    center.x += el.position[0];
                    center.y += el.position[1];
                    center.z += el.position[2];
                    hasValidSelection = true;
                }
            });
                
            if (hasValidSelection) {
                const invLength = 1.0 / Outliner.selected.length;
                center.x *= invLength;
                center.y *= invLength;
                center.z *= invLength;
            }
        }
        
        let cameraScale = 1.0;
        if (hasValidSelection) {
            cameraScale = Preview.selected.calculateControlScale(center);
        }
        
        const scaledOffsetMultiplier = cameraScale * 1.5;
        const baseScaleMultiplier = cameraScale * cachedControlSize * 0.74;
        const touchMultiplier = cachedIsTouch ? 1.5 : 1.0;
        
        planeHandles.forEach(handle => {
            handle.visible = show;
            if (!show) return;

            if (hasValidSelection) {
                if (handle.userData.offset) {
                    const offset = handle.userData.offset;
                    handle.position.x = center.x + offset.x * scaledOffsetMultiplier;
                    handle.position.y = center.y + offset.y * scaledOffsetMultiplier;
                    handle.position.z = center.z + offset.z * scaledOffsetMultiplier;
                } else {
                    handle.position.copy(center);
                }
            } else {
                handle.position.set(0, 0, 0);
                handle.visible = false;
            }
            
            let dynamicScale = 1.0;
            
            if (hasValidSelection) {
                dynamicScale = baseScaleMultiplier * touchMultiplier;
                dynamicScale = THREE.MathUtils.clamp(dynamicScale, 0.1, 100.0);
            }
            handle.userData.baseScale = dynamicScale;
            
            if (!handle.userData.isHovered) {
                handle.scale.setScalar(handle.userData.baseScale);
                
                if (handle.material.uniforms && handle.material.uniforms.opacity) {
                    handle.material.uniforms.opacity.value = handle.userData.baseOpacity;
                } else {
                    handle.material.opacity = handle.userData.baseOpacity;
                }
            }
        });   
    }

    function getRaycaster(event) {
        const raycaster = new THREE.Raycaster();
        
        let viewportEl = document.getElementById('preview') || 
                        document.querySelector('#preview canvas') ||
                        document.querySelector('canvas');
        
        if (!viewportEl) {
            return raycaster;
        }

        const rect = viewportEl.getBoundingClientRect();
        
        if (rect.width === 0 || rect.height === 0) {
            return raycaster;
        }

        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        mouse.x = THREE.MathUtils.clamp(mouse.x, -1, 1);
        mouse.y = THREE.MathUtils.clamp(mouse.y, -1, 1);
        if (Preview && Preview.selected && Preview.selected.camera) {
            raycaster.setFromCamera(mouse, Preview.selected.camera);
        }

        return raycaster;
    }

    let hoverUpdateRequestId = null;
    
    function updateHoverState(event) {
        if (!planeHandles.length || isDragging) return;
        
        if (hoverUpdateRequestId) {
            cancelAnimationFrame(hoverUpdateRequestId);
        }
        hoverUpdateRequestId = requestAnimationFrame(() => {
            performHoverUpdate(event);
            hoverUpdateRequestId = null;
        });
    }
    
    function performHoverUpdate(event) {
        const mode = Toolbox?.selected?.transformerMode;
        const isTranslate = mode === 'translate' || mode === 'move';
        const hasSelection = Outliner && Outliner.selected && Outliner.selected.length > 0;
        const validSelection = hasSelection && Outliner.selected.some(el => el && (el.from || el.position));
        const shouldShow = !!(Transformer && Transformer.visible && Toolbox && Toolbox.selected && isTranslate && validSelection);
        
        if (!shouldShow) {
            if (lastHoveredPlane) {
                resetPlaneHover(lastHoveredPlane);
                lastHoveredPlane = null;
            }
            return;
        }
        if (planeHandles.length === 0) return;

        const ray = getRaycaster(event);
        const intersects = ray.intersectObjects(planeHandles, true);

        let hoveredPlane = null;
        if (intersects.length > 0) {
            if (intersects[0].distance < 100) {
                hoveredPlane = intersects[0].object;
            }
        }
        if (hoveredPlane !== lastHoveredPlane) {
            if (lastHoveredPlane) {
                resetPlaneHover(lastHoveredPlane);
            }
            
            if (hoveredPlane) {
                setPlaneHover(hoveredPlane);
            }
            
            lastHoveredPlane = hoveredPlane;
        }
    }
    
    function resetPlaneHover(plane) {
        if (!plane) return;
        
        plane.userData.isHovered = false;
        if (plane.material) {
            plane.material.opacity = plane.userData.baseOpacity;
            plane.material.needsUpdate = true;
            plane.scale.setScalar(plane.userData.baseScale || 1.0);
        }
    }
    
    function setPlaneHover(plane) {
        if (!plane) return;
        
        plane.userData.isHovered = true;
        if (plane.material) {
            plane.material.opacity = PLANE_CONFIG.hoverOpacity;
            plane.material.needsUpdate = true;
            plane.scale.setScalar((plane.userData.baseScale || 1.0) * PLANE_CONFIG.hoverScale);
        }
    }

    function onMouseMove(event) {
        if (!isDragging) {
            updateHoverState(event);
        }
    }

    function onMouseDown(event) {
        if (event.button !== 0) return;
        
        const isCanvasTarget = event.target.tagName?.toLowerCase() === 'canvas';
        if (!isCanvasTarget) return;
        
        const mode = Toolbox?.selected?.transformerMode;
        const isTranslate = mode === 'translate' || mode === 'move';
        const hasSelection = Outliner && Outliner.selected && Outliner.selected.length > 0;
        const validSelection = hasSelection && Outliner.selected.some(el => el && (el.from || el.position));
        const shouldShow = !!(Transformer && Transformer.visible && Toolbox && Toolbox.selected && isTranslate && validSelection);
        
        if (!shouldShow) return;

        const ray = getRaycaster(event);
        const intersects = ray.intersectObjects(planeHandles, true);
        
        if (intersects.length === 0) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        event.isPlaneGizmoInteraction = true;

        isDragging = true;
        currentDragPlane = intersects[0].object;
        dragStartPoint = intersects[0].point.clone();
        dragStartPosition = {};
        dragAppliedDelta = new THREE.Vector3(0, 0, 0);

        Outliner.selected.forEach(el => {
            if (el.from && el.to) {
                dragStartPosition[el.uuid] = { from: [...el.from], to: [...el.to] };
            } else if (el.position) {
                dragStartPosition[el.uuid] = { position: [...el.position] };
            }
        });

        if (PLANE_CONFIG.enableUndo && Undo && Undo.initEdit) {
            const undoable = (Outliner.selected || []).filter(el => typeof el.getUndoCopy === 'function');
            Undo.initEdit({
                elements: undoable,
                selection: true,
                outliner: true
            });
        }

        document.addEventListener('mousemove', onMouseMoveDrag, true);
        document.addEventListener('mouseup', onMouseUp, true);
    }

    function onMouseMoveDrag(event) {
        if (!isDragging || !currentDragPlane || !Outliner.selected) return;

        const ray = getRaycaster(event);
        const planeName = currentDragPlane.userData.planeName;
        const plane = new THREE.Plane();

        switch (planeName) {
            case 'XY': plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), dragStartPoint); break;
            case 'XZ': plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), dragStartPoint); break;
            case 'YZ': plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(1, 0, 0), dragStartPoint); break;
        }

            const intersectPoint = new THREE.Vector3();
        if (!ray.ray.intersectPlane(plane, intersectPoint)) return;

            const delta3 = intersectPoint.clone().sub(dragStartPoint);
            let desired = new THREE.Vector3(
                (planeName === 'XY' || planeName === 'XZ') ? delta3.x : 0,
                (planeName === 'XY' || planeName === 'YZ') ? delta3.y : 0,
                (planeName === 'XZ' || planeName === 'YZ') ? delta3.z : 0
            );

        const snapping = PLANE_CONFIG.snapToGrid ^ (event.shiftKey === true);
        if (snapping) {
            const g = PLANE_CONFIG.gridSize;
            desired.x = Math.round(desired.x / g) * g;
            desired.y = Math.round(desired.y / g) * g;
            desired.z = Math.round(desired.z / g) * g;
        }

        const inc = desired.clone().sub(dragAppliedDelta || new THREE.Vector3());
        dragAppliedDelta.add(inc);
        if (inc.x) moveElementsInSpace(inc.x, 0);
        if (inc.y) moveElementsInSpace(inc.y, 1);
        if (inc.z) moveElementsInSpace(inc.z, 2);

        if (Transformer && Transformer.update) Transformer.update();
        if (Canvas && Canvas.updatePositions) Canvas.updatePositions();
        if (Canvas && Canvas.updateView) {
            Canvas.updateView({
                elements: Outliner.selected,
                element_aspects: { transform: true, geometry: true }
            });
        }
    }

    function onMouseUp(event) {
        if (!isDragging) return;

        if (PLANE_CONFIG.enableUndo && Undo && Undo.finishEdit) {
            Undo.finishEdit('Plane Translation');
        }

        isDragging = false;
        currentDragPlane = null;
        dragStartPoint = null;
        dragStartPosition = null;
        dragAppliedDelta = null;
        document.removeEventListener('mousemove', onMouseMoveDrag, { passive: false, capture: true });
        document.removeEventListener('mouseup', onMouseUp, { passive: false, capture: true });

        if (Canvas && Canvas.updateView) {
                Canvas.updateView({
                    elements: Outliner.selected,
                element_aspects: { geometry: true, transform: true },
                    selection: true
                });
            }

        if (Transformer && Transformer.update) {
            Transformer.update();
        }
    }

    function addMouseEvents() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('mousemove', onMouseMove, { passive: true });
            canvas.addEventListener('mousedown', onMouseDown, true);
            canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
        }
    }

    function onMouseLeave(event) {
        if (lastHoveredPlane) {
            resetPlaneHover(lastHoveredPlane);
            lastHoveredPlane = null;
        }
    }

    function removeMouseEvents() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.removeEventListener('mousemove', onMouseMove, { passive: true });
            canvas.removeEventListener('mousedown', onMouseDown, true);
            canvas.removeEventListener('mouseleave', onMouseLeave, { passive: true });
            
            if (cameraEventHandlers.wheel) {
                canvas.removeEventListener('wheel', cameraEventHandlers.wheel, { passive: true });
            }
            if (cameraEventHandlers.cameraMove) {
                canvas.removeEventListener('mousemove', cameraEventHandlers.cameraMove, { passive: true });
            }
        }
        document.removeEventListener('mousemove', onMouseMoveDrag, { passive: false, capture: true });
        document.removeEventListener('mouseup', onMouseUp, { passive: false, capture: true });
    }

    function removePlaneHandles() {
        planeHandles.forEach(h => {
            if (h.parent) h.parent.remove(h);
            if (h.material) h.material.dispose();
            if (h.geometry) h.geometry.dispose();
        });
        planeHandles = [];
    }

    function safeGetControlSize() {
        return (settings && settings.control_size && settings.control_size.value) || 1.0;
    }

    function safeIsTouch() {
        return (Blockbench && typeof Blockbench.isTouch === 'boolean') ? Blockbench.isTouch : false;
    }

    function getCurrentLanguage() {
        const frenchIndicators = ['Fichier', 'Édition', 'Affichage', 'Outils', 'Aide'];
        for (const indicator of frenchIndicators) {
            if (document.querySelector(`[title*="${indicator}"]`) || 
                document.querySelector(`[aria-label*="${indicator}"]`) ||
                document.body.textContent.includes(indicator)) {
                return 'fr';
            }
        }
        
        return 'en';
    }

    function getLocalizedActionName() {
        const currentLang = getCurrentLanguage();
        
        if (typeof currentLang === 'string' && currentLang.startsWith('fr')) {
            return 'Activer/désactiver le gizmo de plans';
        }
        
        return 'Toggle Plane Gizmo';
    }

    function getLocalizedActionDescription() {
        const currentLang = getCurrentLanguage();
        
        if (typeof currentLang === 'string' && currentLang.startsWith('fr')) {
            return 'Activer/désactiver le gizmo de plans de translation';
        }
        
        return 'Toggle the translation plane gizmo on/off';
    }

    function getLocalizedPluginDescription() {
        const currentLang = getCurrentLanguage();
        
        if (typeof currentLang === 'string' && currentLang.startsWith('fr')) {
            return 'Gizmo de plans 2D pour la translation multi-axes simultanée';
        }
        
        return 'Enhanced 2D plane gizmo for simultaneous multi-axis translation';
    }

    function getLocalizedAbout() {
        const currentLang = getCurrentLanguage();
        
        if (typeof currentLang === 'string' && currentLang.startsWith('fr')) {
            return `
# Translation Plane Gizmo v1.0.0

## Fonctionnalités :
- **Mouvement 2D par Plans** : Glissez les plans colorés pour déplacer les objets le long de deux axes simultanément
- **Codage Couleur RGB** : Plans XY (Bleu), XZ (Vert), YZ (Rouge)
- **Style Blender** : Poignées carrées professionnelles qui s'adaptent au zoom
- **Bouton Toggle** : Bouton dans la barre d'outils pour activer/désactiver

## Utilisation :
1. Sélectionnez des objets et passez à l'outil **Déplacer**
2. Cliquez et glissez les plans colorés pour un mouvement 2D
3. Maintenez Shift pour l'accrochage grille
            `;
        }
        
        return `
# Translation Plane Gizmo v1.0.0

## Features:
- **2D Plane Movement**: Drag colored planes to move objects along two axes simultaneously
- **RGB Color Coding**: XY (Blue), XZ (Green), YZ (Red) planes
- **Blender-Style**: Professional square handles that scale with zoom
- **Toggle Button**: Toolbar button to enable/disable

## Usage:
1. Select objects and switch to **Move** tool
2. Click and drag colored planes for 2D movement
3. Hold Shift for grid snapping
        `;
    }

    function createToolbarButton() {
        try {
            if (menuAction) {
                menuAction = null;
            }
            
            const actionName = getLocalizedActionName();
            const actionDescription = getLocalizedActionDescription();
            
            menuAction = new Action('plane_gizmo_toggle', {
                name: actionName,
                description: actionDescription,
                icon: 'view_in_ar',
                click: () => {
                    toggleGizmo();
                },
                condition: {
                    modes: ['edit']
                }
            });

            MenuBar.addAction(menuAction, 'toolbar');
            MenuBar.addAction(menuAction, 'view');
            MenuBar.addAction(menuAction, 'edit');
            

        } catch (e) {
            window.togglePlaneGizmo = toggleGizmo;
        }
    }

    try {
        if (typeof MenuBar !== 'undefined' && MenuBar.removeAction) {
            MenuBar.removeAction('plane_gizmo_toggle', 'toolbar');
            MenuBar.removeAction('plane_gizmo_toggle', 'view');
            MenuBar.removeAction('plane_gizmo_toggle', 'edit');
        }
    } catch (e) {
    }

    Plugin.register(PLUGIN_ID, {
        title: 'Translation Plane Gizmo',
        author: 'AnnJ',
        description: getLocalizedPluginDescription(),
        icon: 'control_camera',
        version: '1.0.0',
        min_version: '4.0.0',
        variant: 'both',
        about: getLocalizedAbout(),

        onload() {
            createPlaneHandles();
            addMouseEvents();
            
            setTimeout(() => {
                createToolbarButton();
            }, 100);
            

            updateInterval = setInterval(() => {
                if (Transformer && Transformer.visible) {
                    updatePlaneHandles();
                }
            }, 16);

            if (typeof Outliner !== 'undefined' && Outliner.selected) {
                let lastSelectionLength = Outliner.selected ? Outliner.selected.length : 0;
                
                selectionPollingInterval = setInterval(() => {
                    const currentLength = Outliner.selected ? Outliner.selected.length : 0;
                    if (currentLength !== lastSelectionLength) {
                        lastSelectionLength = currentLength;
                        if (isGizmoEnabled) {
                            updatePlaneHandles();
                        }
                    }
                }, 50);
            }

            const canvas = document.querySelector('canvas');
            if (canvas) {
                cameraEventHandlers.wheel = () => {
                    if (isGizmoEnabled && Transformer && Transformer.visible) {
                        updatePlaneHandles();
                    }
                };
                canvas.addEventListener('wheel', cameraEventHandlers.wheel, { passive: true });

                cameraEventHandlers.cameraMove = (event) => {
                    if (isGizmoEnabled && Transformer && Transformer.visible && 
                        (event.buttons === 2 || event.buttons === 4)) {
                        updatePlaneHandles();
                    }
                };
                canvas.addEventListener('mousemove', cameraEventHandlers.cameraMove, { passive: true });
            }
        },

        onunload() {
            if (hoverUpdateRequestId) {
                cancelAnimationFrame(hoverUpdateRequestId);
                hoverUpdateRequestId = null;
            }
            
            removeMouseEvents();
            
            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
            
            if (selectionPollingInterval) {
                clearInterval(selectionPollingInterval);
                selectionPollingInterval = null;
            }
            
            removePlaneHandles();
            
            
            if (menuAction) {
                try {
                    MenuBar.removeAction('plane_gizmo_toggle', 'toolbar');
                    MenuBar.removeAction('plane_gizmo_toggle', 'view');
                    MenuBar.removeAction('plane_gizmo_toggle', 'edit');
                } catch (e) {
                }
                menuAction = null;
            }
            
            try {
                MenuBar.removeAction('plane_gizmo_toggle', 'toolbar');
                MenuBar.removeAction('plane_gizmo_toggle', 'view');
                MenuBar.removeAction('plane_gizmo_toggle', 'edit');
            } catch (e) {
            }
            
            if (window.togglePlaneGizmo) {
                delete window.togglePlaneGizmo;
            }

            if (typeof Blockbench !== 'undefined' && Blockbench.keybinds) {
                    try {
                        Blockbench.keybinds.remove('plane_gizmo.toggle');
                } catch (e) {
                }
            }
            
            gizmoGroup = null;
            lastHoveredPlane = null;
            cameraEventHandlers = { wheel: null, cameraMove: null };
        }
    });
})()