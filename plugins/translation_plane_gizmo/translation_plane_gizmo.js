(function() {
    'use strict';

    /**
     * Translation Plane Gizmo Plugin v1.0.1
     * 
     * Provides Blender-style 2D plane handles for simultaneous multi-axis translation
     * in Blockbench. Features smart camera scaling, proper margins, and seamless
     * integration with Blockbench's transform system.
     * 
     * @author AnnJ
     * @version 1.0.1
     * @compatibility Blockbench v4.8.0+
     */

    const PLUGIN_ID = 'translation_plane_gizmo';

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

    const translations = {
        en: {
            'plane_gizmo_toggle': 'Toggle Translation Plane Gizmo',
            'plane_gizmo_description': 'Enhanced 2D plane gizmo for simultaneous multi-axis translation',
            'plane_gizmo_plugin_description': 'Adds 2D plane gizmos for multi-axis translation'
        },
        fr: {
            'plane_gizmo_toggle': 'Basculer le Gizmo de Plan de Translation',
            'plane_gizmo_description': 'Gizmo de plan 2D amélioré pour la translation multi-axes simultanée',
            'plane_gizmo_plugin_description': 'Ajoute des gizmos de plan 2D pour la translation multi-axes'
        }
    };


    const PLANE_CONFIG = {
        baseOpacity: 0.6,
        hoverOpacity: 1,
        renderOrder: 99999,
        snapToGrid: true,
        gridSize: 1,
        enableUndo: true,
        planeSize: 0.15,
        hoverScale: 1.1,
        offsetDistance: 4
    };

    let planeHandles = [];
    let gizmoGroup = null;
    let isDragging = false;
    let currentDragPlane = null;
    let dragStartPoint = null;
    let dragAppliedDelta = null;
    let updateInterval = null;
    let selectionPollingInterval = null;
    let isGizmoEnabled = true;
    let menuAction = null;
    let lastHoveredPlane = null;
    let cameraEventHandlers = { wheel: null, cameraMove: null };

    /**
     * Check if the current model format supports parent space rotation
     * Java Block models don't support proper parent space, so we disable this feature for them
     */
    function supportsParentSpaceRotation() {
        if (typeof Format === 'undefined' || !Format || !Format.id) {
            return false;
        }
        
        if (Format.id === 'java_block') {
            return false;
        }
        
        return true;
    }

    function isEntityFormat() {
        if (typeof Format === 'undefined' || !Format || !Format.id) {
            return false;
        }
        
        return Format.id !== 'java_block';
    }

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

        gizmoGroup = new THREE.Group();
        gizmoGroup.name = 'PlaneGizmoGroup';
        gizmoGroup.renderOrder = PLANE_CONFIG.renderOrder;
        scene.add(gizmoGroup);
        return gizmoGroup;
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
                rotation: new THREE.Euler(0, 0, 0), 
                offset: new THREE.Vector3(PLANE_CONFIG.offsetDistance * 0.5, PLANE_CONFIG.offsetDistance * 0.5, 0) 
            },
            { 
                name: 'XZ', 
                rotation: new THREE.Euler(-Math.PI/2, 0, 0), 
                offset: new THREE.Vector3(PLANE_CONFIG.offsetDistance * 0.5, 0, PLANE_CONFIG.offsetDistance * 0.5) 
            },
            { 
                name: 'YZ', 
                rotation: new THREE.Euler(0, Math.PI/2, 0), 
                offset: new THREE.Vector3(0, PLANE_CONFIG.offsetDistance * 0.5, PLANE_CONFIG.offsetDistance * 0.5) 
            }
        ];

        const parent = getGizmoParent();

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
                baseOpacity: PLANE_CONFIG.baseOpacity,
                baseScale: PLANE_CONFIG.planeSize,
                isPlaneGizmo: true,
                offset: plane.offset.clone(),
                originalRotation: plane.rotation.clone()
            };

            parent.add(mesh);
            mesh.visible = true;
            planeHandles.push(mesh);

        });

        parent.updateMatrixWorld(true);
        
        // Force canvas to recognize new objects and refresh raycasting system
        if (Canvas && Canvas.scene) {
            Canvas.scene.updateMatrixWorld(true);
        }
        
        // Ensure raycasting knows about the plane objects
        if (Canvas && Canvas.scene) {
            Canvas.scene.traverse((obj) => {
                if (obj.userData && obj.userData.isPlaneGizmo) {
                    // Ensure proper raycast method is available
                    if (!obj.raycast || typeof obj.raycast !== 'function') {
                        obj.raycast = THREE.Mesh.prototype.raycast;
                    }
                }
            });
        }
        
        // Force canvas update to register new objects
        if (Canvas && typeof Canvas.updateAll === 'function') {
            Canvas.updateAll();
        }
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
        let validSelection = false;
        
        if (isEntityFormat()) {
            if (hasSelection) {
                validSelection = Outliner.selected.some(el => el);
            } else {
                const allGroups = Project && Project.groups ? Project.groups : [];
                const selectedGroups = allGroups.filter(g => g && g.selected);
                validSelection = selectedGroups.length > 0;
            }
        } else {
            if (hasSelection) {
                validSelection = Outliner.selected.some(el => el && (el.from || el.position));
            }
        }

        const show = isGizmoEnabled 
                         && Transformer && Transformer.visible
                         && Toolbox && Toolbox.selected
                         && isTranslate
                         && validSelection;

        let center = new THREE.Vector3();
        let hasValidSelection = false;

        if (show && Transformer) {
            if (Transformer.position) {
                center.copy(Transformer.position);
                hasValidSelection = true;
            } else if (isEntityFormat() && hasSelection && Outliner.selected.length > 0) {
                const firstSelected = Outliner.selected[0];
                if (firstSelected) {
                    if (firstSelected.origin && Array.isArray(firstSelected.origin) && firstSelected.origin.length >= 3) {
                        center.set(firstSelected.origin[0] || 0, firstSelected.origin[1] || 0, firstSelected.origin[2] || 0);
                        hasValidSelection = true;
                    } else if (firstSelected.position && Array.isArray(firstSelected.position) && firstSelected.position.length >= 3) {
                        center.set(firstSelected.position[0] || 0, firstSelected.position[1] || 0, firstSelected.position[2] || 0);
                        hasValidSelection = true;
                    } else {
                        center.set(0, 0, 0);
                        hasValidSelection = true;
                    }
                }
            }
        }

        let cameraScale = 1.0;
        if (hasValidSelection && Preview && Preview.selected && typeof Preview.selected.calculateControlScale === 'function') {
            cameraScale = Preview.selected.calculateControlScale(center);
        }

        const scaledOffsetMultiplier = cameraScale * 1.5;
        const baseScaleMultiplier = cameraScale * cachedControlSize * 0.74;
        const touchMultiplier = cachedIsTouch ? 1.5 : 1.0;

        planeHandles.forEach(handle => {
            // During dragging, only show the current drag plane
            if (isDragging && currentDragPlane) {
                handle.visible = (handle === currentDragPlane) && show;
            } else {
                handle.visible = show;
            }
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

                let isParentSpace = false;
                let parentRotation = null;
                if (supportsParentSpaceRotation() && Transformer && typeof Transformer.getTransformSpace === 'function') {
                    const space = Transformer.getTransformSpace();
                    if (typeof space === 'object' && space !== null) {
                        isParentSpace = true;
                        if (space.rotation) {
                            const rot = space.rotation;
                            if (Array.isArray(rot) && rot.length >= 3) {
                                parentRotation = new THREE.Euler(
                                    THREE.MathUtils.degToRad(rot[0]),
                                    THREE.MathUtils.degToRad(rot[1]),
                                    THREE.MathUtils.degToRad(rot[2]),
                                    'XYZ'
                                );
                            }
                        }
                    }
                }
                
                if (!parentRotation && isParentSpace && Transformer.rotation) {
                    parentRotation = Transformer.rotation;
                }
                
                if (isParentSpace && parentRotation) {
                    const baseRotation = handle.userData.originalRotation || new THREE.Euler(0, 0, 0);
                    const parentQuat = new THREE.Quaternion().setFromEuler(parentRotation);
                    const baseQuat = new THREE.Quaternion().setFromEuler(baseRotation);
                    const finalQuat = parentQuat.clone().multiply(baseQuat);
                    handle.rotation.setFromQuaternion(finalQuat);
                } else {
                    handle.rotation.copy(handle.userData.originalRotation || new THREE.Euler(0, 0, 0));
                }
            } else {
                handle.position.set(0, 0, 0);
                handle.visible = false;
            }

            let dynamicScale = 1.0;

            if (hasValidSelection) {
                dynamicScale = baseScaleMultiplier * touchMultiplier;
                dynamicScale = THREE.MathUtils.clamp(dynamicScale, 0.8, 1000.0);
            }
            handle.userData.baseScale = dynamicScale;

            if (!handle.userData.isHovered) {
                handle.scale.setScalar(handle.userData.baseScale);
                handle.material.opacity = handle.userData.baseOpacity;
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
        let validSelection = false;
        
        if (isEntityFormat()) {
            if (hasSelection) {
                validSelection = Outliner.selected.some(el => el);
            } else {
                const allGroups = Project && Project.groups ? Project.groups : [];
                const selectedGroups = allGroups.filter(g => g && g.selected);
                validSelection = selectedGroups.length > 0;
            }
        } else {
            if (hasSelection) {
                validSelection = Outliner.selected.some(el => el && (el.from || el.position));
            }
        }
        
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
        let validSelection = false;
        
        if (isEntityFormat()) {
            if (hasSelection) {
                validSelection = Outliner.selected.some(el => el);
            } else {
                const allGroups = Project && Project.groups ? Project.groups : [];
                const selectedGroups = allGroups.filter(g => g && g.selected);
                validSelection = selectedGroups.length > 0;
            }
        } else {
            if (hasSelection) {
                validSelection = Outliner.selected.some(el => el && (el.from || el.position));
            }
        }
        
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
        dragAppliedDelta = new THREE.Vector3(0, 0, 0);

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

        const localNormal = new THREE.Vector3(0, 0, 1);
        const worldNormal = localNormal.clone().applyQuaternion(
            currentDragPlane.getWorldQuaternion(new THREE.Quaternion())
        );
        plane.setFromNormalAndCoplanarPoint(worldNormal, dragStartPoint);

        const intersectPoint = new THREE.Vector3();
        if (!ray.ray.intersectPlane(plane, intersectPoint)) return;

        const worldDelta = intersectPoint.clone().sub(dragStartPoint);

        let isParentSpace = false;
        let parentRotation = null;
        if (supportsParentSpaceRotation() && Transformer && typeof Transformer.getTransformSpace === 'function') {
            const space = Transformer.getTransformSpace();
            if (typeof space === 'object' && space !== null) {
                isParentSpace = true;
                if (space.rotation) {
                    const rot = space.rotation;
                    if (Array.isArray(rot) && rot.length >= 3) {
                        parentRotation = new THREE.Euler(
                            THREE.MathUtils.degToRad(rot[0]),
                            THREE.MathUtils.degToRad(rot[1]),
                            THREE.MathUtils.degToRad(rot[2]),
                            'XYZ'
                        );
                    }
                }
            }
        }
        
        if (!parentRotation && isParentSpace && Transformer && Transformer.rotation) {
            parentRotation = Transformer.rotation;
        }
        
        let parentXAxis = new THREE.Vector3(1, 0, 0);
        let parentYAxis = new THREE.Vector3(0, 1, 0);
        let parentZAxis = new THREE.Vector3(0, 0, 1);
        
        if (isParentSpace && parentRotation) {
            const parentQuaternion = new THREE.Quaternion().setFromEuler(parentRotation);
            parentXAxis.applyQuaternion(parentQuaternion);
            parentYAxis.applyQuaternion(parentQuaternion);
            parentZAxis.applyQuaternion(parentQuaternion);
        }

        let desired = new THREE.Vector3();
        if (planeName === 'XY') {
            desired.x = worldDelta.dot(parentXAxis);
            desired.y = worldDelta.dot(parentYAxis);
            desired.z = 0;
        } else if (planeName === 'XZ') {
            desired.x = worldDelta.dot(parentXAxis);
            desired.y = 0;
            desired.z = worldDelta.dot(parentZAxis);
        } else if (planeName === 'YZ') {
            desired.x = 0;
            desired.y = worldDelta.dot(parentYAxis);
            desired.z = worldDelta.dot(parentZAxis);
        }

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


    function getLocalizedActionName() {
        return t('plane_gizmo_toggle');
    }

    function getLocalizedPluginDescription() {
        return t('plane_gizmo_description');
    }

    function createToolbarButton() {
        const actionName = getLocalizedActionName();

        if (typeof Action !== 'undefined') {
            menuAction = new Action('plane_gizmo_toggle', {
                name: actionName,
                description: t('plane_gizmo_description'),
                icon: 'view_in_ar',
                click: () => {
                    toggleGizmo();
                },
                condition: {
                    modes: ['edit']
                }
            });

            if (MenuBar && typeof MenuBar.addAction === 'function') {
                MenuBar.addAction(menuAction, 'toolbar');
            }
        }
    }


    Plugin.register(PLUGIN_ID, {
        title: 'Translation Plane Gizmo',
        author: 'AnnJ',
        description: getLocalizedPluginDescription(),
        icon: 'control_camera',
        version: '1.0.1',
        min_version: '4.8.0',
        variant: 'both',
        tags: ['Gizmo', 'Translation', 'Tools'],
        contributes: {
            actions: [
                {
                    id: 'plane_gizmo_toggle',
                    name: 'Toggle Translation Plane Gizmo',
                    description: 'Enable/disable the translation plane gizmo for multi-axis movement',
                    icon: 'view_in_ar'
                }
            ],
            tools: [
                {
                    id: 'translation_plane_gizmo',
                    name: 'Translation Plane Gizmo',
                    description: '2D plane handles for multi-axis translation (XY=Blue, XZ=Green, YZ=Red)',
                    icon: 'control_camera'
                }
            ]
        },

        onload() {
            // Defer gizmo creation to ensure canvas is fully ready
            setTimeout(() => {
                createPlaneHandles();
                addMouseEvents();
                
                // Force another update after initialization to ensure raycasting is ready
                if (Canvas && typeof Canvas.updateAll === 'function') {
                    Canvas.updateAll();
                }
            }, 100);
            
            createToolbarButton();


            updateInterval = setInterval(() => {
                if (Transformer && Transformer.visible) {
                    updatePlaneHandles();
                }
            }, 16);

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

            if (gizmoGroup && scene) {
                scene.remove(gizmoGroup);
            }

            if (menuAction && MenuBar && typeof MenuBar.removeAction === 'function') {
                MenuBar.removeAction('plane_gizmo_toggle', 'toolbar');
                MenuBar.removeAction('plane_gizmo_toggle', 'view');
                MenuBar.removeAction('plane_gizmo_toggle', 'edit');
                menuAction = null;
            }

            gizmoGroup = null;
            lastHoveredPlane = null;
            cameraEventHandlers = { wheel: null, cameraMove: null };
        }
    });
})()
