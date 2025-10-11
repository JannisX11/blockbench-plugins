(function() {
    'use strict';

    const PLUGIN_ID = 'translation_plane_gizmo';
    const DEBUG = false; // Disabled by default to prevent log spam

    function dlog(...args){
        if(DEBUG || window.PlaneGizmo?.debugMode) {
            console.log('[PlaneGizmo]', ...args);
        }
    }

    const PLANE_CONFIG = {
        size: { XY: 0.95, XZ: 1, YZ: 0.95 }, // Individual sizes for each plane
        color: { XY: 0x4444ff, XZ: 0x44ff44, YZ: 0xff4444 },
        baseOpacity: 0.4, // Reduced from 0.65 to 0.35 for more transparency
        hoverOpacity: 0.6, // Reduced from 0.95 to 0.75 for more subtle hover effect
        offset: 0.6,
        renderOrder: 99999,
        snapToGrid: true,
        gridSize: 1,
        enableUndo: true,
        MAX_SCALE: 8.0, // Allow larger planes for easier selection
        MIN_SCALE: 0.5  // Keep a reasonable minimum size
    };

    let planeGeo = null;
    let planeHandles = [];
    let gizmoGroup = null;
    let isDragging = false;
    let currentDragPlane = null;
    let dragStartPoint = null;
    let dragStartPosition = null;
    let dragAppliedDelta = null; // cumulative delta already applied via Blockbench API
    let updateInterval = null;
    let eventHandlers = {};
    let isGizmoEnabled = true; // Track gizmo state
    let menuAction = null; // Store reference to menu action

    // Warn only once per unique tag to avoid console spam
    const warnedTags = new Set();
    function warnOnce(tag, ...args) {
        if (window.PlaneGizmo?.verboseWarnings === false) return; // allow global mute
        if (warnedTags.has(tag)) return;
        warnedTags.add(tag);
        console.warn(...args);
    }

    function createGradientMaterial(colors, opacity) {
        // Convert hex colors to RGB
        const color1 = new THREE.Color(colors[0].color);
        const color2 = new THREE.Color(colors[1].color);
        
        // Create custom shader material for gradient
        const gradientMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: color1 },
                color2: { value: color2 },
                opacity: { value: opacity }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform float opacity;
                varying vec2 vUv;
                
                void main() {
                    // Create gradient from color1 to color2 based on UV coordinates
                    vec3 gradient = mix(color1, color2, vUv.x);
                    gl_FragColor = vec4(gradient, opacity);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false
        });
        
        return gradientMaterial;
    }

    function getGizmoParent() {
        if (gizmoGroup) return gizmoGroup;
        
        // Try multiple scene sources to find the correct one
        let targetScene = null;
        
        // Method 1: Try global scene (most likely)
        if (typeof scene !== 'undefined' && scene) {
            targetScene = scene;
            warnOnce('scene_global', '[PlaneGizmo] ✅ Using global scene for gizmo group');
        }
        // Method 2: Try Canvas.scene
        else if (Canvas && Canvas.scene) {
            targetScene = Canvas.scene;
            warnOnce('scene_canvas', '[PlaneGizmo] ⚠️ Using Canvas.scene for gizmo group');
        }
        // Method 3: Try to find scene in Blockbench
        else if (typeof Blockbench !== 'undefined' && Blockbench.scene) {
            targetScene = Blockbench.scene;
            warnOnce('scene_bb', '[PlaneGizmo] ⚠️ Using Blockbench.scene for gizmo group');
        }
        
        if (targetScene) {
            gizmoGroup = new THREE.Group();
            gizmoGroup.name = 'PlaneGizmoGroup';
            gizmoGroup.renderOrder = PLANE_CONFIG.renderOrder;
            targetScene.add(gizmoGroup);
            warnOnce('scene_added', '[PlaneGizmo] ✅ Gizmo group added to scene:', targetScene.name || 'unnamed');
            return gizmoGroup;
        }
        
        warnOnce('no_scene', '[PlaneGizmo] ❌ CRITICAL: No valid scene found for gizmo group!');
        return null;
    }

    function createPlaneHandles(){
        if(planeHandles.length) return;
        // Create individual geometries for each plane with different sizes
        const planeGeometries = {
            XY: new THREE.PlaneGeometry(PLANE_CONFIG.size.XY, PLANE_CONFIG.size.XY),
            XZ: new THREE.PlaneGeometry(PLANE_CONFIG.size.XZ, PLANE_CONFIG.size.XZ),
            YZ: new THREE.PlaneGeometry(PLANE_CONFIG.size.YZ, PLANE_CONFIG.size.YZ)
        };

        const planes = [
            { name:'XY', color:PLANE_CONFIG.color.XY, axes:['x','y'], rotation:new THREE.Euler(0,0,0) },
            { name:'XZ', color:PLANE_CONFIG.color.XZ, axes:['x','z'], rotation:new THREE.Euler(-Math.PI/2,0,0) },
            { name:'YZ', color:PLANE_CONFIG.color.YZ, axes:['y','z'], rotation:new THREE.Euler(0,Math.PI/2,0) }
        ];

        const parent = getGizmoParent();
        if(!parent) {
            console.warn('[PlaneGizmo] ❌ CRITICAL: No parent found for plane handles - cannot create planes!');
            dlog('❌ No parent found for plane handles');
            return;
        }

        planes.forEach(p=>{
            // Create gradient material based on the axes the plane controls
            let gradientMaterial;
            
            if(p.name === 'XY') {
                // XY plane: Green to Red gradient (Y to X axis)
                gradientMaterial = createGradientMaterial([
                    { color: 0x00ff00, position: 0 }, // Green (Y axis)
                    { color: 0xff0000, position: 1 }  // Red (X axis)
                ], PLANE_CONFIG.baseOpacity);
            } else if(p.name === 'XZ') {
                // XZ plane: Red to Blue gradient (X to Z axis)
                gradientMaterial = createGradientMaterial([
                    { color: 0xff0000, position: 0 }, // Red (X axis)
                    { color: 0x0000ff, position: 1 }  // Blue (Z axis)
                ], PLANE_CONFIG.baseOpacity);
            } else if(p.name === 'YZ') {
                // YZ plane: Green to Blue gradient (Y to Z axis)
                gradientMaterial = createGradientMaterial([
                    { color: 0x00ff00, position: 0 }, // Green (Y axis)
                    { color: 0x0000ff, position: 1 }  // Blue (Z axis)
                ], PLANE_CONFIG.baseOpacity);
            }
            
            const mesh = new THREE.Mesh(planeGeometries[p.name], gradientMaterial);
            mesh.rotation.copy(p.rotation);
            mesh.renderOrder = PLANE_CONFIG.renderOrder;

            // Ensure the mesh is properly set up for raycasting
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.frustumCulled = false; // Disable frustum culling to ensure planes are always rendered

            // Set initial scale larger for easier clicking
            mesh.scale.setScalar(3.5);

            mesh.userData = {
                planeName:p.name,
                axes:p.axes,
                baseOpacity:PLANE_CONFIG.baseOpacity,
                isPlaneGizmo: true,
                clickable: true,
                cssClass: `plane_gizmo ${p.name.toLowerCase()}`,
                planeLabel: p.name
            };

            // Add to parent and ensure it's visible
            parent.add(mesh);
            mesh.visible = true; // Explicitly set visible
            
            dlog('Created plane:', p.name, 'Position:', mesh.position, 'Rotation:', mesh.rotation, 'Scale:', mesh.scale, 'Visible:', mesh.visible, 'Parent:', !!parent);

            planeHandles.push(mesh);
        });
        
        // Force update the parent's matrix to ensure planes are properly positioned
        parent.updateMatrixWorld(true);
        
        dlog('Planes created:', planeHandles.map(h=>h.userData.planeName), 'Parent children:', parent.children.length);
    }

    function toggleGizmo() {
        isGizmoEnabled = !isGizmoEnabled;
        updatePlaneHandles();
        console.log(`[PlaneGizmo] Gizmo ${isGizmoEnabled ? 'enabled' : 'disabled'}`);
        return isGizmoEnabled;
    }

    function updatePlaneHandles(){
        try {
            // Enhanced visibility conditions - show when translate or move mode is active AND gizmo is enabled
            const mode = Toolbox?.selected?.transformerMode;
            const isTranslate = mode === 'translate' || mode === 'move';
            const show = isGizmoEnabled // Check if gizmo is enabled
                         && Transformer && Transformer.visible
                         && Toolbox && Toolbox.selected
                         && isTranslate
                         && Outliner && Outliner.selected && Outliner.selected.length>0
                         && !isDragging; // Hide planes during dragging to avoid conflicts

            // Only update visibility if it changed to prevent flickering
            planeHandles.forEach(h=>{
                const wasVisible = h.visible;
                h.visible = show;

                // Only log if visibility state changed
                if(wasVisible !== show && DEBUG) {
                    if(!show) {
                        dlog('Planes hidden:', {
                            transformer: !!Transformer,
                            transformerVisible: Transformer?.visible,
                            toolbox: !!Toolbox,
                            selectedTool: Toolbox?.selected,
                            transformerMode: Toolbox?.selected?.transformerMode,
                            outliner: !!Outliner,
                            selectedElements: Outliner?.selected?.length,
                            isDragging
                        });
                    } else {
                        dlog('Planes shown - updating positions');
                    }
                }

                if(!show) return;

                // Position planes at the center of the selection
                let center = new THREE.Vector3();
                let hasSelection = false;
                
                // Calculate center of all selected objects
                if(Outliner && Outliner.selected && Outliner.selected.length > 0) {
                    Outliner.selected.forEach(el => {
                        if(el.from && el.to) {
                            // For cubes, use the center of the bounding box
                            const cubeCenter = new THREE.Vector3(
                                (el.from[0] + el.to[0]) / 2,
                                (el.from[1] + el.to[1]) / 2,
                                (el.from[2] + el.to[2]) / 2
                            );
                            center.add(cubeCenter);
                            hasSelection = true;
                        } else if(el.position) {
                            // For meshes/groups, use their position
                            center.add(new THREE.Vector3(el.position[0], el.position[1], el.position[2]));
                            hasSelection = true;
                        }
                    });
                    
                    if(hasSelection) {
                        center.divideScalar(Outliner.selected.length);
                    }
                }
                
                // Fallback to transformer position if no selection center
                if(!hasSelection && Transformer && Transformer.position) {
                    center.copy(Transformer.position);
                    hasSelection = true;
                }
                
                if(hasSelection) {
                    // Position planes at the center of selection
                    h.position.copy(center);
                    dlog(`Positioned ${h.userData.planeName} plane at:`, h.position.toArray());
                } else {
                    // Fallback: position planes at origin if no selection
                    h.position.set(0, 0, 0);
                    dlog(`Fallback positioned ${h.userData.planeName} plane at:`, h.position.toArray());
                }
                
                // Keep planes strictly at selection center; do not move toward camera.
                // This avoids large parallax and unexpected dragging behavior.

                // Conservative scaling for natural interaction - use individual plane size
                let dynamicScale = PLANE_CONFIG.size[h.userData.planeName] * 1.5;
                
                // Only make small adjustments based on selection size
                if(Outliner && Outliner.selected && Outliner.selected.length > 0) {
                    const bbox = new THREE.Box3();
                    Outliner.selected.forEach(el => {
                        if (el.mesh) {
                            bbox.expandByObject(el.mesh);
                        } else if (el.from && el.to) {
                            const min = new THREE.Vector3(el.from[0], el.from[1], el.from[2]);
                            const max = new THREE.Vector3(el.to[0], el.to[1], el.to[2]);
                            bbox.expandByPoint(min);
                            bbox.expandByPoint(max);
                        }
                    });
                    if (!bbox.isEmpty()) {
                        const size = bbox.getSize(new THREE.Vector3());
                        const avgSize = (size.x + size.y + size.z) / 3 || 1;
                        // Small scaling based on selection size (±20% max)
                        const sizeFactor = THREE.MathUtils.clamp(avgSize * 0.35, 0.8, 1.2);
                        dynamicScale *= sizeFactor;
                    }
                }

                // Do not scale by camera distance; keep plane size stable.
                
                // Clamp to comfortable range
                dynamicScale = THREE.MathUtils.clamp(dynamicScale, 1.2, 8.0);

                // Cache base scale and only apply hover modifier elsewhere to avoid flicker
                h.userData.baseScale = dynamicScale;
                if (!h.userData.isHovered) {
                    h.scale.setScalar(h.userData.baseScale);
                }

                // Set opacity based on hover state - handle both regular and shader materials
                if(h.material.uniforms && h.material.uniforms.opacity) {
                    h.material.uniforms.opacity.value = h.userData.baseOpacity;
                } else {
                h.material.opacity = h.userData.baseOpacity;
                }

                // Force visible for debugging (can be toggled)
                if(window.PlaneGizmo && window.PlaneGizmo.forceVisible) {
                    h.visible = true;
                }
            });
        } catch(e){
            console.error('[PlaneGizmo] updatePlaneHandles error', e);
        }
    }

    function getRaycaster(event){
        const rc = new THREE.Raycaster();
        // Ensure we don't accidentally filter by layers
        if (rc.layers && typeof rc.layers.mask === 'number') {
            rc.layers.mask = 0xFFFFFFFF;
        }
        
        // Resolve a viewport element and its bounding rect (Blockbench uses #preview div)
        let viewportEl = null;
        let rect = null;
        if (document.getElementById('preview')) {
            viewportEl = document.getElementById('preview');
            rect = viewportEl.getBoundingClientRect();
            warnOnce('el_preview', '[PlaneGizmo] ✅ Using #preview element for mouse coords');
        }
        if ((!viewportEl || !rect || rect.width === 0) && Canvas && Canvas.canvas) {
            viewportEl = Canvas.canvas;
            rect = viewportEl.getBoundingClientRect();
            warnOnce('el_canvas', '[PlaneGizmo] ⚠️ Using Canvas.canvas for mouse coords');
        }
        if ((!viewportEl || !rect || rect.width === 0)) {
            const anyCanvas = document.querySelector('canvas');
            if (anyCanvas) {
                viewportEl = anyCanvas;
                rect = anyCanvas.getBoundingClientRect();
                warnOnce('el_anycanvas', '[PlaneGizmo] ⚠️ Using first <canvas> for mouse coords');
            }
        }
        if(!viewportEl || !rect || rect.width === 0) {
            warnOnce('no_view_el', '[PlaneGizmo] ❌ CRITICAL: No viewport element found for mouse coords');
            return rc;
        }

        const mouse = new THREE.Vector2(
            ((event.clientX-rect.left)/rect.width)*2-1,
            -((event.clientY-rect.top)/rect.height)*2+1
        );

        dlog('Raycast setup:', {
            mouseX: event.clientX,
            mouseY: event.clientY,
            canvasFound: !!viewportEl,
            canvasRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
            normalizedMouse: { x: mouse.x, y: mouse.y }
        });

        // Use Blockbench's camera system if available - try multiple camera sources
        let cameraUsed = null;
        let cameraPosition = null;

        // Debug: Check all available cameras with more detail
        dlog('🔍 Searching for cameras...');

        // Check Preview camera
        if(Preview) {
            dlog('  Preview exists:', !!Preview);
            if(Preview.selected) {
                dlog('    Preview.selected exists:', !!Preview.selected);
                if(Preview.selected.camera) {
                    dlog('      ✅ Preview camera found:', {
                        position: Preview.selected.camera.position.toArray(),
                        type: Preview.selected.camera.type,
                        uuid: Preview.selected.camera.uuid,
                        fov: Preview.selected.camera.fov,
                        near: Preview.selected.camera.near,
                        far: Preview.selected.camera.far
                    });
                } else {
                    dlog('      ❌ Preview.selected.camera is null/undefined');
                }
            } else {
                dlog('    ❌ Preview.selected is null/undefined');
            }
        } else {
            dlog('  ❌ Preview is null/undefined');
        }

        // Check Transformer camera
        if(Transformer) {
            dlog('  Transformer exists:', !!Transformer);
            if(Transformer.camera) {
                dlog('    ✅ Transformer camera found:', {
                    position: Transformer.camera.position.toArray(),
                    type: Transformer.camera.type,
                    uuid: Transformer.camera.uuid
                });
            } else {
                dlog('    ❌ Transformer.camera is null/undefined');
            }
        } else {
            dlog('  ❌ Transformer is null/undefined');
        }

        // Check scene cameras
        dlog('  Scene exists:', !!scene, 'Scene.children exists:', !!(scene && scene.children));
        if(scene && scene.children) {
            const cameras = scene.children.filter(child => child instanceof THREE.Camera);
            dlog('  Found', cameras.length, 'cameras in scene:');
            cameras.forEach((cam, i) => {
                dlog(`    Camera ${i}:`, {
                    position: cam.position.toArray(),
                    type: cam.type,
                    uuid: cam.uuid,
                    name: cam.name || 'unnamed'
                });
            });
        }

        // Simplified camera detection - try multiple sources robustly
        let camerasTried = [];

        // Method 1: Try Canvas camera (desktop builds may not expose Canvas.camera)
        if(Canvas && Canvas.camera) {
            rc.setFromCamera(mouse, Canvas.camera);
            cameraUsed = 'Canvas.camera';
            cameraPosition = Canvas.camera.position.clone();
            camerasTried.push('Canvas camera');
            warnOnce('cam_canvas', '[PlaneGizmo] ✅ Using Canvas.camera for raycast');
        }
        // Method 2: Try the main preview camera
        else if(typeof Preview !== 'undefined' && Preview) {
            let previewCam = null;
            if (Preview.selected && Preview.selected.camera) {
                previewCam = Preview.selected.camera;
                camerasTried.push('Preview selected');
            } else if (Preview.all && Preview.all.length) {
                for (let p of Preview.all) {
                    if (p && p.camera) { previewCam = p.camera; camerasTried.push('Preview any'); break; }
                }
            }
            if (previewCam) {
                rc.setFromCamera(mouse, previewCam);
                cameraUsed = 'Preview.camera';
                cameraPosition = previewCam.position.clone();
                warnOnce('cam_preview_any', '[PlaneGizmo] ⚠️ Using Preview.camera for raycast');
            }
        }
        // Method 3: Try the transformer camera
        if(!cameraUsed && Transformer && Transformer.camera) {
            rc.setFromCamera(mouse, Transformer.camera);
            cameraUsed = 'Transformer.camera';
            cameraPosition = Transformer.camera.position.clone();
            camerasTried.push('Transformer camera');
            warnOnce('cam_transformer', '[PlaneGizmo] ⚠️ Using Transformer.camera for raycast');
        }
        // Method 4: Try to find any camera in the scene
        if(!cameraUsed && scene && scene.children && scene.children.length > 0) {
            // Look for PerspectiveCamera or OrthographicCamera
            const perspectiveCameras = scene.children.filter(child => child instanceof THREE.PerspectiveCamera);
            const orthoCameras = scene.children.filter(child => child instanceof THREE.OrthographicCamera);

            if(perspectiveCameras.length > 0) {
                rc.setFromCamera(mouse, perspectiveCameras[0]);
                cameraUsed = 'Scene.PerspectiveCamera';
                cameraPosition = perspectiveCameras[0].position.clone();
                camerasTried.push('Perspective camera');
                warnOnce('cam_scene_persp', '[PlaneGizmo] ⚠️ Using Scene.PerspectiveCamera for raycast');
            } else if(orthoCameras.length > 0) {
                rc.setFromCamera(mouse, orthoCameras[0]);
                cameraUsed = 'Scene.OrthographicCamera';
                cameraPosition = orthoCameras[0].position.clone();
                camerasTried.push('Orthographic camera');
                warnOnce('cam_scene_ortho', '[PlaneGizmo] ⚠️ Using Scene.OrthographicCamera for raycast');
            } else {
                // Look for any camera
                const camera = scene.children.find(child => child instanceof THREE.Camera);
                if(camera) {
                    rc.setFromCamera(mouse, camera);
                    cameraUsed = 'Scene.camera';
                    cameraPosition = camera.position.clone();
                    camerasTried.push('Any camera');
                    warnOnce('cam_scene_any', '[PlaneGizmo] ⚠️ Using Scene.camera for raycast');
                }
            }
        }

        // If no camera found, try to use a default position
        if(!cameraUsed) {
            warnOnce('cam_default', '[PlaneGizmo] ⚠️ WARNING: No camera found, using default raycast setup - this may cause incorrect raycasting!');
            dlog('No camera found, using default raycast setup');
            rc.setFromCamera(mouse, new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
            cameraUsed = 'Default camera';
            cameraPosition = new THREE.Vector3(0, 0, 10);
            camerasTried.push('Default camera');
        }

        dlog('Camera used for raycast:', cameraUsed, 'Camera position:', cameraPosition, 'Ray direction:', rc.ray.direction, 'Ray origin:', rc.ray.origin, 'Cameras tried:', camerasTried);

        return rc;
    }

    // Utility function to check if we're in the right mode
    function shouldShowPlanes() {
        const mode = Toolbox?.selected?.transformerMode;
        const isTranslate = mode === 'translate' || mode === 'move';
        return !!(Transformer && Transformer.visible && Outliner && Outliner.selected && Outliner.selected.length > 0 && isTranslate);
    }

    // Enhanced hover detection with better precision and visual feedback
    function updateHoverState(event) {
        if(!planeHandles.length) return;
        if(!shouldShowPlanes()) {
            // Ensure hover visuals reset when planes hidden
            planeHandles.forEach(h=>{ h.userData.isHovered=false; if(h.material){ h.material.opacity=h.userData.baseOpacity||PLANE_CONFIG.baseOpacity; h.scale.setScalar(h.userData.baseScale||h.scale.x); }});
            return;
        }

        const ray = getRaycaster(event);
        let intersects = ray.intersectObjects(planeHandles, true);
        if (intersects.length === 0) {
            // use expanded hitbox for hover too
            const expanded=[];
            planeHandles.forEach(p=>{
                const box=new THREE.Box3().setFromObject(p).expandByScalar(6.0);
                const hp=new THREE.Vector3();
                if(ray.ray.intersectBox(box,hp)){
                    expanded.push({object:p, point:hp.clone(), distance: ray.ray.origin.distanceTo(hp)});
                }
            });
            if(expanded.length){
                expanded.sort((a,b)=>a.distance-b.distance);
                intersects=[expanded[0]];
            }
        }

        // Reset all plane visual states without overriding base scale
        planeHandles.forEach(h => {
            h.userData.isHovered = false;
            if(h.material) {
                // Handle both regular materials and shader materials
                if(h.material.uniforms && h.material.uniforms.opacity) {
                    h.material.uniforms.opacity.value = h.userData.baseOpacity;
                } else {
                h.material.opacity = h.userData.baseOpacity;
                }
                h.scale.setScalar(h.userData.baseScale || h.scale.x);
            }
        });

        // Highlight hovered plane with enhanced visual feedback
        if(intersects.length > 0) {
            const hoveredPlane = intersects[0].object;
            if(hoveredPlane.material) {
                // Handle both regular materials and shader materials
                if(hoveredPlane.material.uniforms && hoveredPlane.material.uniforms.opacity) {
                    hoveredPlane.material.uniforms.opacity.value = PLANE_CONFIG.hoverOpacity;
                } else {
                hoveredPlane.material.opacity = PLANE_CONFIG.hoverOpacity;
                }
                // Make hovered plane slightly larger for better feedback
                hoveredPlane.userData.isHovered = true;
                hoveredPlane.scale.setScalar((hoveredPlane.userData.baseScale || hoveredPlane.scale.x) * 1.15);

                dlog('🎯 Hovered plane:', hoveredPlane.userData.planeName, 'at position:', hoveredPlane.position);
            }
        }
    }

    function addMouseEvents(){
        eventHandlers.hover = function(e){
            try {
                updateHoverState(e);
            } catch(e) {
                console.error('[PlaneGizmo] hover error', e);
            }
        };

        eventHandlers.mousedown = function(e){
            dlog('🖱️ MOUSE DOWN - Button:', e.button, 'Target:', e.target?.tagName || 'unknown', 'ClientX:', e.clientX, 'ClientY:', e.clientY);

            // Only react to left-clicks on the viewport canvas
            const isCanvasTarget = (e.target === Canvas?.canvas) || (e.target?.closest && Canvas?.canvas && e.target.closest('canvas') === Canvas.canvas) || e.target?.tagName?.toLowerCase() === 'canvas';
            if(e.button!==0 || !isCanvasTarget || !shouldShowPlanes()) {
                dlog('❌ Mouse down ignored:', { button: e.button, shouldShow: shouldShowPlanes() });
                return;
            }

            const ray = getRaycaster(e);
            // Intersect planes; use recursive=true, no optional target (older Three.js expects array)
            const intersects = ray.intersectObjects(planeHandles, true);
            if (intersects.length === 0) {
                // Conservative fallback hitbox to help clicks near plane, without stealing gizmo arrow clicks
                const expanded = [];
                planeHandles.forEach(p => {
                    const box = new THREE.Box3().setFromObject(p).expandByScalar(3.0);
                    const hitPoint = new THREE.Vector3();
                    if (ray.ray.intersectBox(box, hitPoint)) {
                        expanded.push({ object: p, point: hitPoint.clone(), distance: ray.ray.origin.distanceTo(hitPoint) });
                    }
                });
                if (expanded.length) {
                    expanded.sort((a,b)=>a.distance-b.distance);
                    // Only accept if the ray actually passes inside the projected rectangle (distance threshold small)
                    if (expanded[0].distance < 5) {
                        intersects.push(expanded[0]);
                        dlog('✅ Found intersection using conservative hitbox');
                    }
                }
            }

            dlog('🎯 Raycast found', intersects.length, 'intersections');
            if(intersects.length > 0) {
                dlog('✅ SUCCESS! Found intersections with planes');
                intersects.forEach((intersect, i) => {
                    dlog(`  Intersection ${i}:`, intersect.object.userData.planeName, 'Distance:', intersect.distance, 'Point:', intersect.point);
                });

                e.preventDefault();
                // Avoid blocking other UI handlers globally
                e.stopPropagation();

            isDragging=true;
            currentDragPlane=intersects[0].object;
            dragStartPoint=intersects[0].point.clone();
            dragStartPosition={};
            dragAppliedDelta=new THREE.Vector3(0,0,0);

                // Store original positions for all selected elements
            Outliner.selected.forEach(el=>{
                    if(el.from && el.to) {
                        dragStartPosition[el.uuid]={from:[...el.from],to:[...el.to]};
                    } else if(el.position) {
                        dragStartPosition[el.uuid]={position:[...el.position]};
                    }
                });

                dlog('✅ DRAG STARTED on', currentDragPlane.userData.planeName, 'with', Outliner.selected.length, 'selected elements');

                // Integrate with Blockbench's undo system
                if(PLANE_CONFIG.enableUndo && Undo && Undo.initEdit) {
                    Undo.initEdit({elements:Outliner.selected});
                }
                // During drag, capture mouse events at the document level to avoid misses
                document.addEventListener('mousemove', eventHandlers.mousemove, true);
                document.addEventListener('mouseup', eventHandlers.mouseup, true);
            } else {
                // No plane hit: let default transformer arrows handle the click
                return;
            }
        };

        eventHandlers.mousemove=function(e){
            if(!isDragging||!currentDragPlane||!Outliner.selected) {
                // Only log this occasionally to reduce spam
                if(DEBUG && Math.random() < 0.05) {
                    dlog('Mouse move ignored:', { isDragging, currentDragPlane: !!currentDragPlane, selectedCount: Outliner.selected?.length });
                }
                return;
            }

            dlog('🎮 DRAG IN PROGRESS - Plane:', currentDragPlane.userData.planeName);

            const ray = getRaycaster(e);
            const planeName=currentDragPlane.userData.planeName;
            const plane=new THREE.Plane();

            // Calculate plane orientation based on the current drag plane
            switch(planeName){
                case 'XY': plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0,0,1), dragStartPoint); break;
                case 'XZ': plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0), dragStartPoint); break;
                case 'YZ': plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(1,0,0), dragStartPoint); break;
            }

            const intersectPoint = new THREE.Vector3();
            if(!ray.ray.intersectPlane(plane,intersectPoint)) {
                dlog('❌ No plane intersection during drag');
                return;
            }

            // Constrain movement to the active plane axes only
            const delta3 = intersectPoint.clone().sub(dragStartPoint);
            let desired = new THREE.Vector3(
                (planeName === 'XY' || planeName === 'XZ') ? delta3.x : 0,
                (planeName === 'XY' || planeName === 'YZ') ? delta3.y : 0,
                (planeName === 'XZ' || planeName === 'YZ') ? delta3.z : 0
            );
            // Apply grid snapping if enabled (hold Shift to toggle)
            const snapping = PLANE_CONFIG.snapToGrid ^ (e.shiftKey === true);
            if(snapping) {
                const g = PLANE_CONFIG.gridSize;
                desired.x = Math.round(desired.x / g) * g;
                desired.y = Math.round(desired.y / g) * g;
                desired.z = Math.round(desired.z / g) * g;
            }
            // Compute incremental delta to apply this frame
            const inc = desired.clone().sub(dragAppliedDelta || new THREE.Vector3());
            dragAppliedDelta.add(inc);

            dlog('📏 Inc delta:', inc.x.toFixed(3), inc.y.toFixed(3), inc.z.toFixed(3));

            // Use Blockbench transformation helpers so all types update correctly
            if (inc.x) moveElementsInSpace(inc.x, 0);
            if (inc.y) moveElementsInSpace(inc.y, 1);
            if (inc.z) moveElementsInSpace(inc.z, 2);

            // Update transformer and scene to reflect changes
            if(Transformer && Transformer.update) Transformer.update();
            if(Canvas && Canvas.updatePositions) Canvas.updatePositions();
            if(Canvas && Canvas.updateView) {
                Canvas.updateView({
                    elements: Outliner.selected,
                    element_aspects: { transform: true, geometry: true }
                });
            }
            if(Project && Project.preview) Project.preview.all_faces.forEach(f=>f.updateGeometry && f.updateGeometry());
        };

        eventHandlers.mouseup=function(e){
            if(!isDragging) return;

            dlog('Drag finished on', currentDragPlane ? currentDragPlane.userData.planeName : 'unknown plane');

            // Complete the undo operation if enabled
            if(PLANE_CONFIG.enableUndo && Undo && Undo.finishEdit) {
                Undo.finishEdit('Déplacement sur plan 2D');
            }

            // Reset drag state
            isDragging=false;
            currentDragPlane=null;
            dragStartPoint=null;
            dragStartPosition=null;
            dragAppliedDelta=null;

            // Remove document-level listeners added during drag
            document.removeEventListener('mousemove', eventHandlers.mousemove, true);
            document.removeEventListener('mouseup', eventHandlers.mouseup, true);

            // Update Blockbench's UI to reflect changes
            if(Canvas && Canvas.updateView) {
                Canvas.updateView({
                    elements: Outliner.selected,
                    element_aspects: {geometry: true, transform: true},
                    selection: true
                });
            }

            // Trigger a final transformer update
            if(Transformer && Transformer.update) {
                Transformer.update();
            }
        };

        // Attach event listeners with debugging
        const canvas = Canvas?.canvas;
        if (canvas) {
            // Attach without capture so app menus continue receiving events
            canvas.addEventListener('mousemove', eventHandlers.hover, false);
            canvas.addEventListener('mousedown', eventHandlers.mousedown, false);
            canvas.addEventListener('mouseup', eventHandlers.mouseup, false);
            warnOnce('events_canvas', '[PlaneGizmo] ✅ Mouse event listeners attached to canvas');
            dlog('✅ Mouse event listeners attached to canvas');

            // Add a comprehensive test to verify mouse events are working
            let testEventsReceived = 0;
            const testHandler = (e) => {
                testEventsReceived++;
                if (testEventsReceived <= 3) { // Only log first few events
                    dlog('🖱️ Raw mouse event received on canvas:', e.type, 'at', e.clientX, e.clientY, 'Target:', e.target?.tagName);
                }
            };

            // Store reference for cleanup
            window.planeGizmoTestHandler = testHandler;

            canvas.addEventListener('mousedown', testHandler, false);
            canvas.addEventListener('mousemove', testHandler, false);
            canvas.addEventListener('mouseup', testHandler, false);

            // Log after a short delay to see if events are being received
            setTimeout(() => {
                if(testEventsReceived === 0) warnOnce('no_mouse_events', '[PlaneGizmo] ⚠️ WARNING: No mouse events received - event system may be broken!');
                dlog('📊 Event reception test:', testEventsReceived, 'events received in first second');
            }, 1000);
        } else {
            // Fallback to document if canvas not available
            warnOnce('events_doc_fallback', '[PlaneGizmo] ⚠️ WARNING: Canvas not found, using document fallback - this may cause issues!');
            document.addEventListener('mousemove', eventHandlers.hover, true);
            document.addEventListener('mousedown', eventHandlers.mousedown, true);
            document.addEventListener('mouseup', eventHandlers.mouseup, true);
            dlog('⚠️ Mouse event listeners attached to document (canvas not found)');
        }
    }

    function removeMouseEvents(){
        const canvas = Canvas?.canvas;
        if (canvas) {
            // Match the addEventListener options (bubble phase)
            canvas.removeEventListener('mousemove', eventHandlers.hover, false);
            canvas.removeEventListener('mousedown', eventHandlers.mousedown, false);
            canvas.removeEventListener('mouseup', eventHandlers.mouseup, false);

            // Remove test handlers if they exist
            if (window.planeGizmoTestHandler) {
                canvas.removeEventListener('mousedown', window.planeGizmoTestHandler);
                canvas.removeEventListener('mousemove', window.planeGizmoTestHandler);
                canvas.removeEventListener('mouseup', window.planeGizmoTestHandler);
                window.planeGizmoTestHandler = null;
            }
        } else {
            document.removeEventListener('mousemove', eventHandlers.hover, true);
            document.removeEventListener('mousedown', eventHandlers.mousedown, true);
            document.removeEventListener('mouseup', eventHandlers.mouseup, true);
        }
        eventHandlers={};
        dlog('Mouse event listeners removed');
    }

    function removePlaneHandles(){
        planeHandles.forEach(h=>{ 
            if(h.parent) h.parent.remove(h); 
            if(h.material) h.material.dispose(); 
            if(h.geometry) h.geometry.dispose(); 
        });
        planeHandles=[];
    }

    function addPlaneGizmoStyles(){
        // Create a style element for the plane gizmo
        const style = document.createElement('style');
        style.id = 'plane-gizmo-styles';
        style.textContent = `
            /* Plane Gizmo Visual Enhancements */
            .plane_gizmo {
                transition: opacity 0.2s ease, transform 0.2s ease;
                cursor: pointer;
            }
            
            .plane_gizmo:hover {
                opacity: 0.9 !important;
                transform: scale(1.05);
            }
            
            .plane_gizmo.xy {
                border: 2px solid #4444ff;
                box-shadow: 0 0 10px rgba(68, 68, 255, 0.3);
            }
            
            .plane_gizmo.xz {
                border: 2px solid #44ff44;
                box-shadow: 0 0 10px rgba(68, 255, 68, 0.3);
            }
            
            .plane_gizmo.yz {
                border: 2px solid #ff4444;
                box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
            }
            
            /* Debug overlay for plane gizmo */
            .plane-gizmo-debug {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-width: 300px;
            }
            
            .plane-gizmo-debug h4 {
                margin: 0 0 5px 0;
                color: #4CAF50;
            }
            
            .plane-gizmo-debug .status {
                margin: 2px 0;
            }
            
            .plane-gizmo-debug .status.success {
                color: #4CAF50;
            }
            
            .plane-gizmo-debug .status.error {
                color: #f44336;
            }
            
            .plane-gizmo-debug .status.warning {
                color: #ff9800;
            }
        `;
        
        // Add the styles to the document head
        document.head.appendChild(style);
        dlog('✅ Plane gizmo styles added');
    }

    function removePlaneGizmoStyles(){
        const style = document.getElementById('plane-gizmo-styles');
        if(style) {
            style.remove();
            dlog('✅ Plane gizmo styles removed');
        }
    }

    // Debug utilities for development
    window.PlaneGizmo = {
        debug: DEBUG,
        debugMode: false, // Can be toggled on/off for debugging
        // Controls whether one-time warnings (warnOnce) are printed
        verboseWarnings: false,
        config: PLANE_CONFIG,
        planes: () => planeHandles,
        isDragging: () => isDragging,
        currentPlane: () => currentDragPlane,
        update: updatePlaneHandles,
        show: () => planeHandles.forEach(h => h.visible = true),
        hide: () => planeHandles.forEach(h => h.visible = false),
        toggle: toggleGizmo,
        isEnabled: () => isGizmoEnabled,
        forceVisible: false,

        // Debug mode controls
        enableDebug: () => {
            window.PlaneGizmo.debugMode = true;
            console.log('🔧 PlaneGizmo debug mode ENABLED');
        },
        disableDebug: () => {
            window.PlaneGizmo.debugMode = false;
            console.log('🔧 PlaneGizmo debug mode DISABLED');
        },

        enableForceVisible: () => { 
            window.PlaneGizmo.forceVisible = true; 
            updatePlaneHandles(); 
            dlog('Force visible enabled'); 
        },
        disableForceVisible: () => { 
            window.PlaneGizmo.forceVisible = false; 
            updatePlaneHandles(); 
            dlog('Force visible disabled'); 
        },
        enableVerboseWarnings: () => { window.PlaneGizmo.verboseWarnings = true; console.log('🔧 PlaneGizmo verbose warnings ENABLED'); },
        disableVerboseWarnings: () => { window.PlaneGizmo.verboseWarnings = false; console.log('🔧 PlaneGizmo verbose warnings DISABLED'); },
        debugRaycast: (x, y) => {
            console.log('🔍 DEBUG RAYCAST');
            console.log('Planes:', planeHandles.map(p => ({
                name: p.userData.planeName,
                visible: p.visible,
                position: p.position.toArray(),
                scale: p.scale.toArray(),
                worldPosition: p.getWorldPosition(new THREE.Vector3()).toArray()
            })));
            
            // Test with current mouse position or provided coordinates
            const testEvent = x !== undefined && y !== undefined ? 
                { clientX: x, clientY: y } : 
                { clientX: 400, clientY: 300 }; // Default test position
                
            const ray = getRaycaster(testEvent);
            console.log('Ray origin:', ray.ray.origin.toArray());
            console.log('Ray direction:', ray.ray.direction.toArray());
            
            const intersects = ray.intersectObjects(planeHandles, true);
            console.log('Intersections found:', intersects.length);
            intersects.forEach((intersect, i) => {
                console.log(`  ${i}: ${intersect.object.userData.planeName} at distance ${intersect.distance.toFixed(2)}`);
            });
            
            // Test with expanded boxes
            const expanded = [];
            planeHandles.forEach(p => {
                const box = new THREE.Box3().setFromObject(p).expandByScalar(0.75);
                const hitPoint = new THREE.Vector3();
                if (ray.ray.intersectBox(box, hitPoint)) {
                    expanded.push({ object: p, point: hitPoint.clone(), distance: ray.ray.origin.distanceTo(hitPoint) });
                }
            });
            console.log('Expanded box intersections:', expanded.length);
        },
        testClick: () => {
            console.log('🧪 TESTING CLICK SIMULATION');
            const canvas = Canvas?.canvas;
            if (!canvas) {
                console.log('❌ No canvas found');
                return;
            }
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            console.log('Simulating click at canvas center:', centerX, centerY);
            
            const testEvent = {
                clientX: centerX,
                clientY: centerY,
                button: 0,
                target: canvas,
                preventDefault: () => {},
                stopImmediatePropagation: () => {}
            };
            
            // Call the mousedown handler directly
            if (eventHandlers.mousedown) {
                eventHandlers.mousedown(testEvent);
            } else {
                console.log('❌ No mousedown handler found');
            }
        },
        forceUpdatePlanes: () => {
            console.log('🔄 FORCE UPDATING PLANE MATRICES');
            planeHandles.forEach(p => {
                p.updateMatrix();
                p.updateMatrixWorld(true);
            });
            if (gizmoGroup) {
                gizmoGroup.updateMatrix();
                gizmoGroup.updateMatrixWorld(true);
            }
            console.log('✅ Plane matrices updated');
        },
        log: dlog,
        debugVisibility: () => {
            dlog('Debug Visibility:', {
                transformer: !!Transformer,
                transformerVisible: Transformer?.visible,
                toolbox: !!Toolbox,
                selectedTool: Toolbox?.selected,
                transformerMode: Toolbox?.selected?.transformerMode,
                outliner: !!Outliner,
                selectedElements: Outliner?.selected?.length,
                isDragging,
                planesVisible: planeHandles.map(h => ({name: h.userData.planeName, visible: h.visible, position: h.position}))
            });
        },
        checkConditions: () => {
            const conditions = {
                transformer: !!Transformer,
                transformerVisible: Transformer?.visible,
                toolbox: !!Toolbox,
                selectedTool: !!Toolbox?.selected,
                transformerMode: Toolbox?.selected?.transformerMode,
                outliner: !!Outliner,
                selectedElements: Outliner?.selected?.length,
                isDragging,
                allConditionsMet: Transformer && Transformer.visible
                                 && Toolbox && Toolbox.selected
                                 && Toolbox.selected.transformerMode === 'translate'
                                 && Outliner && Outliner.selected && Outliner.selected.length>0
                                 && !isDragging
            };
            dlog('Conditions check:', conditions);
            return conditions;
        },
        testDrag: () => {
            if(!Outliner.selected || Outliner.selected.length === 0) {
                dlog('❌ No elements selected for testing');
                return;
            }

            dlog('🧪 Testing drag functionality...');

            // Simulate a small movement on XY plane
            const testDelta = { x: 1, y: 1, z: 0 };

            Outliner.selected.forEach(el => {
                if(el.from && el.to) {
                    el.from[0] += testDelta.x;
                    el.from[1] += testDelta.y;
                    el.to[0] += testDelta.x;
                    el.to[1] += testDelta.y;
                    dlog('✅ Test moved cube:', el.name || el.uuid);
                } else if(el.position) {
                    el.position[0] += testDelta.x;
                    el.position[1] += testDelta.y;
                    dlog('✅ Test moved mesh:', el.name || el.uuid);
                }

                if(Canvas && Canvas.adaptObjectPosition) {
                    Canvas.adaptObjectPosition(el);
                }
            });

            if(Transformer && Transformer.update) {
                Transformer.update();
            }

            dlog('🎯 Test drag completed - check if objects moved');
        },
        testClickDetection: () => {
            dlog('🔍 Testing plane click detection...');

            // Create a test raycast to see if planes are detectable
            if(planeHandles.length === 0) {
                dlog('❌ No planes available for testing');
                return;
            }

            // Test raycasting against plane centers with multiple methods
            planeHandles.forEach(plane => {
                dlog(`\n📋 Testing ${plane.userData.planeName}:`);

                // Method 1: Standard raycast from camera center
                const testRay1 = getRaycaster({ clientX: 400, clientY: 300 }); // Center of canvas
                const intersects1 = testRay1.intersectObject(plane);
                dlog(`  Center raycast:`, intersects1.length > 0 ? '✅ Clickable' : '❌ Not clickable');

                // Method 2: Raycast from camera toward plane center
                const testRay2 = new THREE.Raycaster();
                if(Preview && Preview.selected && Preview.selected.camera) {
                    const center = plane.getWorldPosition(new THREE.Vector3());
                    testRay2.setFromCamera(new THREE.Vector2(0, 0), Preview.selected.camera);
                    const direction = center.clone().sub(testRay2.ray.origin).normalize();
                    testRay2.ray.direction.copy(direction);
                    const intersects2 = testRay2.intersectObject(plane);
                    dlog(`  Directed raycast:`, intersects2.length > 0 ? '✅ Clickable' : '❌ Not clickable');
                }

                // Method 3: Bounding sphere test
                const planeBox = new THREE.Box3().setFromObject(plane);
                const center = planeBox.getCenter(new THREE.Vector3());
                const radius = planeBox.getSize(new THREE.Vector3()).length() / 2;
                dlog(`  Bounding box:`, planeBox.min, 'to', planeBox.max, 'Radius:', radius);
            });
        },
        analyzeCameraPlane: () => {
            dlog('📊 Camera vs Plane Analysis:');

            if(Preview && Preview.selected && Preview.selected.camera) {
                const camera = Preview.selected.camera;
                const cameraForward = camera.getWorldDirection(new THREE.Vector3());

                dlog('Camera position:', camera.position.toArray());
                dlog('Camera forward direction:', cameraForward.toArray());
                dlog('Camera up vector:', camera.up.toArray());

                planeHandles.forEach(plane => {
                    const planePos = plane.getWorldPosition(new THREE.Vector3());
                    const distance = camera.position.distanceTo(planePos);
                    const direction = planePos.clone().sub(camera.position).normalize();
                    const dotProduct = cameraForward.dot(direction);

                    // Calculate angle between camera forward and plane direction
                    const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct))) * (180 / Math.PI);

                    dlog(`${plane.userData.planeName}:`, {
                        distance: distance.toFixed(2),
                        direction: direction.toArray(),
                        dotProduct: dotProduct.toFixed(3),
                        angleFromCamera: angle.toFixed(1) + '°',
                        inFrontOfCamera: dotProduct > 0,
                        behindCamera: dotProduct < 0,
                        planeNormal: plane.geometry ? 'Has geometry' : 'No geometry'
                    });
                });
            } else {
                dlog('❌ No camera available for analysis');
            }
        },
        forceUpdatePlanes: () => {
            dlog('🔄 Force updating all plane positions and matrices...');
            planeHandles.forEach(plane => {
                plane.updateMatrixWorld(true); // Force update world matrix
                dlog(`${plane.userData.planeName} world position:`, plane.getWorldPosition(new THREE.Vector3()));
            });
            dlog('✅ All planes updated');
        },
        manualClickTest: (clientX = 400, clientY = 300) => {
            dlog('🧪 Manual click test at:', clientX, clientY);

            // Simulate a mouse event for testing
            const testEvent = {
                clientX: clientX,
                clientY: clientY,
                button: 0,
                target: Canvas?.canvas || document.querySelector('canvas'),
                preventDefault: () => {},
                stopImmediatePropagation: () => {}
            };

            // Test if our mousedown handler would detect the click
            const ray = getRaycaster(testEvent);
            const intersects = ray.intersectObjects(planeHandles, true);

            dlog('Manual test results:', intersects.length, 'intersections');
            intersects.forEach((intersect, i) => {
                dlog(`  ${i}:`, intersect.object.userData.planeName, 'at', intersect.point);
            });

            if(intersects.length > 0) {
                dlog('✅ Manual test SUCCESS - planes are clickable!');
                return true;
            } else {
                dlog('❌ Manual test FAILED - planes not clickable at this position');
                return false;
            }
        },
        createDebugOverlay: () => {
            // Create a debug overlay to show real-time status
            const overlay = document.createElement('div');
            overlay.className = 'plane-gizmo-debug';
            overlay.innerHTML = `
                <h4>Plane Gizmo Debug</h4>
                <div class="status" id="pg-status">Initializing...</div>
                <div class="status" id="pg-planes">Planes: 0</div>
                <div class="status" id="pg-selected">Selected: 0</div>
                <div class="status" id="pg-mode">Mode: Unknown</div>
            `;
            document.body.appendChild(overlay);
            
            // Update the overlay periodically
            const updateOverlay = () => {
                const statusEl = document.getElementById('pg-status');
                const planesEl = document.getElementById('pg-planes');
                const selectedEl = document.getElementById('pg-selected');
                const modeEl = document.getElementById('pg-mode');
                
                if(statusEl && planesEl && selectedEl && modeEl) {
                    const conditions = window.PlaneGizmo.checkConditions();
                    const show = conditions.allConditionsMet;
                    
                    statusEl.textContent = show ? 'Active' : 'Inactive';
                    statusEl.className = `status ${show ? 'success' : 'warning'}`;
                    
                    planesEl.textContent = `Planes: ${planeHandles.length}`;
                    selectedEl.textContent = `Selected: ${Outliner?.selected?.length || 0}`;
                    modeEl.textContent = `Mode: ${Toolbox?.selected?.transformerMode || 'None'}`;
                }
            };
            
            // Update every 500ms
            const overlayInterval = setInterval(updateOverlay, 500);
            
            // Store reference for cleanup
            window.planeGizmoDebugOverlay = {
                element: overlay,
                interval: overlayInterval
            };
            
            dlog('✅ Debug overlay created');
        },
        removeDebugOverlay: () => {
            if(window.planeGizmoDebugOverlay) {
                clearInterval(window.planeGizmoDebugOverlay.interval);
                window.planeGizmoDebugOverlay.element.remove();
                delete window.planeGizmoDebugOverlay;
                dlog('✅ Debug overlay removed');
            }
        },
        quickStatus: () => {
            console.warn('[PlaneGizmo] === QUICK STATUS CHECK ===');
            console.warn('[PlaneGizmo] Canvas:', !!Canvas);
            console.warn('[PlaneGizmo] Canvas.canvas:', !!Canvas?.canvas);
            console.warn('[PlaneGizmo] Canvas.camera:', !!Canvas?.camera);
            console.warn('[PlaneGizmo] Scene:', !!scene);
            console.warn('[PlaneGizmo] THREE:', !!THREE);
            console.warn('[PlaneGizmo] Plane handles:', planeHandles.length);
            console.warn('[PlaneGizmo] Gizmo group:', !!gizmoGroup);
            console.warn('[PlaneGizmo] Transformer:', !!Transformer);
            console.warn('[PlaneGizmo] Outliner:', !!Outliner);
            console.warn('[PlaneGizmo] Selected elements:', Outliner?.selected?.length || 0);
            console.warn('[PlaneGizmo] Toolbox mode:', Toolbox?.selected?.transformerMode);
            
            if(planeHandles.length > 0) {
                console.warn('[PlaneGizmo] First plane visible:', planeHandles[0].visible);
                console.warn('[PlaneGizmo] First plane position:', planeHandles[0].position.toArray());
                console.warn('[PlaneGizmo] First plane world position:', planeHandles[0].getWorldPosition(new THREE.Vector3()).toArray());
                console.warn('[PlaneGizmo] First plane scale:', planeHandles[0].scale.toArray());
            }
            
            // Check which scene the gizmo group is in
            if(gizmoGroup && gizmoGroup.parent) {
                console.warn('[PlaneGizmo] Gizmo group parent:', gizmoGroup.parent.name || 'unnamed');
                console.warn('[PlaneGizmo] Gizmo group parent type:', gizmoGroup.parent.type);
            }
            
            return {
                canvas: !!Canvas,
                canvasCamera: !!Canvas?.camera,
                scene: !!scene,
                three: !!THREE,
                planes: planeHandles.length,
                selected: Outliner?.selected?.length || 0,
                mode: Toolbox?.selected?.transformerMode
            };
        },
        debugRaycast: () => {
            console.warn('[PlaneGizmo] 🔍 COMPREHENSIVE RAYCAST DEBUG - Running diagnostic tests...');
            dlog('🔍 COMPREHENSIVE RAYCAST DEBUG');
            
            // First, check basic system status
            console.warn('[PlaneGizmo] === SYSTEM STATUS CHECK ===');
            console.warn('[PlaneGizmo] Canvas object:', !!Canvas);
            console.warn('[PlaneGizmo] Canvas.canvas:', !!Canvas?.canvas);
            console.warn('[PlaneGizmo] Scene object:', !!scene);
            console.warn('[PlaneGizmo] THREE object:', !!THREE);
            console.warn('[PlaneGizmo] Plane handles count:', planeHandles.length);
            console.warn('[PlaneGizmo] Gizmo group:', !!gizmoGroup);
            
            if(planeHandles.length === 0) {
                console.warn('[PlaneGizmo] ❌ CRITICAL: No plane handles created!');
                return { error: 'No plane handles' };
            }
            
            // Test with center of screen
            const testEvent = {
                clientX: window.innerWidth / 2,
                clientY: window.innerHeight / 2,
                button: 0,
                target: Canvas?.canvas || document.querySelector('canvas'),
                preventDefault: () => {},
                stopImmediatePropagation: () => {}
            };
            
            console.warn('[PlaneGizmo] Test event:', testEvent);
            dlog('Test event:', testEvent);
            
            const ray = getRaycaster(testEvent);
            console.warn('[PlaneGizmo] Raycaster created:', {
                rayOrigin: ray.ray.origin,
                rayDirection: ray.ray.direction,
                rayLength: ray.ray.direction.length()
            });
            dlog('Raycaster created:', {
                rayOrigin: ray.ray.origin,
                rayDirection: ray.ray.direction,
                rayLength: ray.ray.direction.length()
            });
            
            // Test intersection with all planes
            console.warn('[PlaneGizmo] === INDIVIDUAL PLANE TESTS ===');
            planeHandles.forEach((plane, i) => {
                console.warn(`[PlaneGizmo] --- Plane ${i}: ${plane.userData.planeName} ---`);
                console.warn('[PlaneGizmo] Position:', plane.position.toArray());
                console.warn('[PlaneGizmo] World position:', plane.getWorldPosition(new THREE.Vector3()).toArray());
                console.warn('[PlaneGizmo] Visible:', plane.visible);
                console.warn('[PlaneGizmo] Scale:', plane.scale.toArray());
                console.warn('[PlaneGizmo] Rotation:', plane.rotation.toArray());
                console.warn('[PlaneGizmo] Geometry:', plane.geometry ? 'OK' : 'MISSING');
                console.warn('[PlaneGizmo] Material:', plane.material ? 'OK' : 'MISSING');
                
                if(plane.material) {
                    console.warn('[PlaneGizmo] Material properties:', {
                        transparent: plane.material.transparent,
                        opacity: plane.material.opacity,
                        side: plane.material.side,
                        depthTest: plane.material.depthTest,
                        depthWrite: plane.material.depthWrite
                    });
                }
                
                // Test individual raycast
                const intersects = ray.intersectObject(plane);
                console.warn('[PlaneGizmo] Individual raycast result:', intersects.length, 'intersections');
                if(intersects.length > 0) {
                    console.warn('[PlaneGizmo] Intersection point:', intersects[0].point);
                    console.warn('[PlaneGizmo] Intersection distance:', intersects[0].distance);
                }
                
                // Test bounding box
                const box = new THREE.Box3().setFromObject(plane);
                console.warn('[PlaneGizmo] Bounding box:', box.min.toArray(), 'to', box.max.toArray());
                console.warn('[PlaneGizmo] Box size:', box.getSize(new THREE.Vector3()).toArray());
                
                dlog(`\n--- Plane ${i}: ${plane.userData.planeName} ---`);
                dlog('Plane position:', plane.position.toArray());
                dlog('Plane world position:', plane.getWorldPosition(new THREE.Vector3()).toArray());
                dlog('Plane visible:', plane.visible);
                dlog('Plane scale:', plane.scale.toArray());
                dlog('Plane rotation:', plane.rotation.toArray());
                dlog('Plane geometry:', plane.geometry ? 'OK' : 'MISSING');
                dlog('Plane material:', plane.material ? 'OK' : 'MISSING');
                
                if(plane.material) {
                    dlog('Material properties:', {
                        transparent: plane.material.transparent,
                        opacity: plane.material.opacity,
                        side: plane.material.side,
                        depthTest: plane.material.depthTest,
                        depthWrite: plane.material.depthWrite
                    });
                }
                
                // Test individual raycast
                const intersects2 = ray.intersectObject(plane);
                dlog('Individual raycast result:', intersects2.length, 'intersections');
                if(intersects2.length > 0) {
                    dlog('Intersection point:', intersects2[0].point);
                    dlog('Intersection distance:', intersects2[0].distance);
                }
                
                // Test bounding box
                const box2 = new THREE.Box3().setFromObject(plane);
                dlog('Bounding box:', box2.min.toArray(), 'to', box2.max.toArray());
                dlog('Box size:', box2.getSize(new THREE.Vector3()).toArray());
            });
            
            // Test with all planes at once
            const allIntersects = ray.intersectObjects(planeHandles, true);
            console.warn('[PlaneGizmo] --- ALL PLANES RAYCAST RESULTS ---');
            console.warn('[PlaneGizmo] Total intersections:', allIntersects.length);
            dlog('\n--- ALL PLANES RAYCAST ---');
            dlog('Total intersections:', allIntersects.length);
            allIntersects.forEach((intersect, i) => {
                console.warn(`[PlaneGizmo] Intersection ${i}:`, intersect.object.userData.planeName, 'at', intersect.point, 'distance:', intersect.distance);
                dlog(`Intersection ${i}:`, intersect.object.userData.planeName, 'at', intersect.point, 'distance:', intersect.distance);
            });
            
            if(allIntersects.length === 0) {
                console.warn('[PlaneGizmo] ❌ CRITICAL: No intersections found - raycast system is completely broken!');
                
                // Additional diagnostic: Check if planes are in the right scene
                console.warn('[PlaneGizmo] === SCENE DIAGNOSTIC ===');
                if(gizmoGroup && gizmoGroup.parent) {
                    console.warn('[PlaneGizmo] Gizmo group is in scene:', gizmoGroup.parent.name || 'unnamed');
                    console.warn('[PlaneGizmo] Gizmo group parent type:', gizmoGroup.parent.type);
                } else {
                    console.warn('[PlaneGizmo] ❌ Gizmo group has no parent!');
                }
                
                // Check if planes are actually visible in the scene
                planeHandles.forEach((plane, i) => {
                    const worldPos = plane.getWorldPosition(new THREE.Vector3());
                    const distance = ray.ray.origin.distanceTo(worldPos);
                    console.warn(`[PlaneGizmo] Plane ${i} (${plane.userData.planeName}):`, {
                        worldPosition: worldPos.toArray(),
                        distanceFromRayOrigin: distance.toFixed(2),
                        visible: plane.visible,
                        inScene: !!plane.parent
                    });
                });
                
            } else {
                console.warn('[PlaneGizmo] ✅ SUCCESS: Raycast system is working!');
            }
            
            return {
                ray: ray,
                individualResults: planeHandles.map(p => ({
                    name: p.userData.planeName,
                    intersects: ray.intersectObject(p).length
                })),
                allIntersects: allIntersects.length
            };
        },
        testSceneIntegration: () => {
            console.warn('[PlaneGizmo] === SCENE INTEGRATION TEST ===');
            
            // Check if planes are in the scene
            if(gizmoGroup && gizmoGroup.parent) {
                console.warn('[PlaneGizmo] ✅ Gizmo group is in scene:', gizmoGroup.parent.name || 'unnamed');
                console.warn('[PlaneGizmo] Gizmo group children count:', gizmoGroup.children.length);
                
                // Check if planes are actually in the gizmo group
                planeHandles.forEach((plane, i) => {
                    const inGizmoGroup = gizmoGroup.children.includes(plane);
                    const inScene = plane.parent === gizmoGroup;
                    console.warn(`[PlaneGizmo] Plane ${i} (${plane.userData.planeName}):`, {
                        inGizmoGroup: inGizmoGroup,
                        inScene: inScene,
                        parent: plane.parent?.name || 'none'
                    });
                });
            } else {
                console.warn('[PlaneGizmo] ❌ Gizmo group has no parent!');
            }
            
            // Test if we can find the planes in the scene hierarchy
            let foundPlanes = 0;
            if(scene) {
                scene.traverse((child) => {
                    if(child.userData && child.userData.isPlaneGizmo) {
                        foundPlanes++;
                        console.warn('[PlaneGizmo] Found plane in scene:', child.userData.planeName, 'at', child.getWorldPosition(new THREE.Vector3()).toArray());
                    }
                });
            }
            console.warn('[PlaneGizmo] Total planes found in scene:', foundPlanes);
            
            return {
                gizmoGroupInScene: !!(gizmoGroup && gizmoGroup.parent),
                planesInGizmoGroup: planeHandles.filter(p => gizmoGroup.children.includes(p)).length,
                planesFoundInScene: foundPlanes
            };
        },
        quickTest: () => {
            console.warn('[PlaneGizmo] 🧪 QUICK FUNCTIONALITY TEST');
            
            // Test 1: Check if planes are visible and positioned correctly
            console.warn('[PlaneGizmo] Test 1: Plane visibility and positioning');
            planeHandles.forEach((plane, i) => {
                const worldPos = plane.getWorldPosition(new THREE.Vector3());
                console.warn(`[PlaneGizmo] Plane ${i} (${plane.userData.planeName}):`, {
                    visible: plane.visible,
                    position: plane.position.toArray(),
                    worldPosition: worldPos.toArray(),
                    scale: plane.scale.toArray(),
                    inScene: !!plane.parent
                });
            });
            
            // Test 2: Check camera and raycasting setup
            console.warn('[PlaneGizmo] Test 2: Camera and raycasting setup');
            if(Preview && Preview.selected && Preview.selected.camera) {
                const cam = Preview.selected.camera;
                console.warn('[PlaneGizmo] Camera position:', cam.position.toArray());
                console.warn('[PlaneGizmo] Camera direction:', cam.getWorldDirection(new THREE.Vector3()).toArray());
            } else {
                console.warn('[PlaneGizmo] ❌ No camera found!');
            }
            
            // Test 3: Simulate a click at canvas center
            console.warn('[PlaneGizmo] Test 3: Simulating click at canvas center');
            const canvas = Canvas?.canvas;
            if(canvas) {
                const rect = canvas.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const testEvent = {
                    clientX: centerX,
                    clientY: centerY,
                    button: 0,
                    target: canvas,
                    preventDefault: () => {},
                    stopImmediatePropagation: () => {}
                };
                
                const ray = getRaycaster(testEvent);
                const intersects = ray.intersectObjects(planeHandles, true);
                console.warn('[PlaneGizmo] Center click intersections:', intersects.length);
                
                if(intersects.length > 0) {
                    console.warn('[PlaneGizmo] ✅ SUCCESS: Planes are clickable at center!');
                    intersects.forEach((intersect, i) => {
                        console.warn(`[PlaneGizmo] Intersection ${i}:`, intersect.object.userData.planeName, 'at distance', intersect.distance.toFixed(2));
                    });
                } else {
                    console.warn('[PlaneGizmo] ❌ FAILED: No intersections at center');
                }
            } else {
                console.warn('[PlaneGizmo] ❌ No canvas found!');
            }
            
            return {
                planesVisible: planeHandles.filter(p => p.visible).length,
                planesInScene: planeHandles.filter(p => p.parent).length,
                cameraFound: !!(Preview && Preview.selected && Preview.selected.camera),
                canvasFound: !!Canvas?.canvas
            };
        }
    };

    Plugin.register(PLUGIN_ID,{
        title:'Translation Plane Gizmo',
        author:'AnnJ',
        description:'Enhanced 2D plane gizmo for simultaneous multi-axis translation',
        icon:'control_camera',
        version:'2.0.0',
        min_version:'4.0.0',
        variant:'both',
        about: `
# Enhanced Translation Plane Gizmo v2.0

## Features:
- **2D Plane Movement**: Drag colored planes to move objects along two axes simultaneously
- **RGB Color Coding**: XY (Blue), XZ (Green), YZ (Red) planes for easy identification
- **Smart Integration**: Seamlessly works with Blockbench's transform system
- **Grid Snapping**: Automatic grid alignment when enabled
- **Undo Support**: Full integration with Blockbench's undo system
- **Performance Optimized**: Minimal overhead and efficient event handling

## How it works:
- **XY Plane (Blue)**: Move objects in X and Y directions simultaneously
- **XZ Plane (Green)**: Move objects in X and Z directions simultaneously
- **YZ Plane (Red)**: Move objects in Y and Z directions simultaneously

## Usage:
1. Select objects in the 3D view
2. Switch to **Move tool**
3. You'll see three colored planes around the selection
4. Click and drag any plane to move the object in that 2D plane
5. Hold Shift for grid snapping (if enabled)

## Integration:
- Works with cubes, meshes, and groups
- Respects Blockbench's transform space settings
- Compatible with proportional editing
- Supports both local and global transform spaces
        `,

        onload(){
            try{
                console.log('[Translation Plane Gizmo] Loading enhanced plugin...');
                createPlaneHandles();

                // Add CSS styling for better visual feedback
                addPlaneGizmoStyles();

                // Initial setup with delay to ensure Blockbench is ready
                setTimeout(()=>{
                    updatePlaneHandles();
                    console.log('[Translation Plane Gizmo] Initial setup complete');
                }, 200);

                // Set up regular updates (conditional updates only when needed)
                if(!updateInterval) {
                    updateInterval = setInterval(() => {
                        // Only update if transformer is visible and has selected elements
                        if(Transformer && Transformer.visible && Outliner && Outliner.selected && Outliner.selected.length > 0) {
                            updatePlaneHandles();
                        }
                    }, 200); // 5fps - minimal updates to prevent flickering
                }

                addMouseEvents();

                // Add keyboard shortcuts for debugging
                if(typeof Blockbench !== 'undefined' && Blockbench.keybinds) {
                    Blockbench.keybinds.add('plane_gizmo.toggle', 'Ctrl+Shift+P', () => {
                        toggleGizmo();
                    });
                }

                // Add toolbar button and menu item for toggling gizmo
                if(typeof Action !== 'undefined') {
                    // Check if action already exists to prevent duplicates during reload
                    if(MenuBar && MenuBar.actions && MenuBar.actions.plane_gizmo_toggle) {
                        console.log('[PlaneGizmo] Action already exists, skipping creation');
                        return;
                    }
                    
                    menuAction = new Action('plane_gizmo_toggle', {
                        name: 'Toggle Plane Gizmo',
                        description: 'Toggle the translation plane gizmo on/off',
                        icon: 'move',
                        click: () => {
                            const enabled = toggleGizmo();
                            // Update the action icon to reflect current state
                            if(menuAction) {
                                menuAction.icon = enabled ? 'move' : 'block';
                                menuAction.name = enabled ? 'Disable Plane Gizmo' : 'Enable Plane Gizmo';
                                // Force toolbar update
                                if(menuAction.node) {
                                    menuAction.node.innerHTML = `<i class="icon ${menuAction.icon}"></i>`;
                                }
                            }
                        }
                    });
                    
                    // Try multiple methods to add to toolbar
                    let toolbarAdded = false;
                    
                    // Method 1: Try MenuBar API (but don't mark as added yet)
                    if(typeof MenuBar !== 'undefined') {
                        try {
                            MenuBar.addAction(menuAction, 'toolbar');
                            console.log('[PlaneGizmo] Toolbar button added via MenuBar');
                            // Don't mark as added yet - we'll check if it's actually visible
                        } catch(e) {
                            console.warn('[PlaneGizmo] MenuBar toolbar method failed:', e);
                        }
                    }
                    
                    // Method 2: Try direct toolbar integration
                    if(!toolbarAdded && typeof Toolbar !== 'undefined') {
                        try {
                            Toolbar.addAction(menuAction);
                            console.log('[PlaneGizmo] Toolbar button added via Toolbar');
                            toolbarAdded = true;
                        } catch(e) {
                            console.warn('[PlaneGizmo] Toolbar method failed:', e);
                        }
                    }
                    
                    // Method 3: Try adding to specific toolbar sections
                    if(!toolbarAdded) {
                        const toolbarSections = ['tools', 'transform', 'edit', 'view'];
                        for(const section of toolbarSections) {
                            try {
                                if(typeof MenuBar !== 'undefined') {
                                    MenuBar.addAction(menuAction, section);
                                    console.log(`[PlaneGizmo] Toolbar button added to ${section} section`);
                                    toolbarAdded = true;
                                    break;
                                }
                            } catch(e) {
                                console.warn(`[PlaneGizmo] Failed to add to ${section}:`, e);
                            }
                        }
                    }
                    
                    // Method 4: Always try direct DOM manipulation to ensure visibility
                    try {
                        // Check if MenuBar action is actually visible
                        const menuBarElement = document.querySelector('[data-action="plane_gizmo_toggle"]');
                        if(!menuBarElement) {
                            console.log('[PlaneGizmo] MenuBar action not found in DOM, using direct DOM method');
                            
                            // Find the main toolbar (toolbar no_wrap with 3 children)
                            const mainToolbar = document.querySelector('.toolbar.no_wrap');
                            if(mainToolbar) {
                                // Create a button element
                                const button = document.createElement('button');
                                button.className = 'tool';
                                button.title = 'Toggle Plane Gizmo';
                                button.style.width = '32px';
                                button.style.height = '32px';
                                button.style.minWidth = '32px';
                                button.style.minHeight = '32px';
                                button.style.padding = '4px';
                                button.style.display = 'flex';
                                button.style.alignItems = 'center';
                                button.style.justifyContent = 'center';
                                
                                // Create icon element
                                const icon = document.createElement('i');
                                icon.className = 'icon';
                                icon.style.fontSize = '16px';
                                icon.style.color = '#ffffff';
                                
                                // Use a simple text-based icon that will always work
                                const updateIcon = (enabled) => {
                                    if(enabled) {
                                        icon.textContent = '↔'; // Move symbol
                                        icon.title = 'Disable Plane Gizmo';
                                    } else {
                                        icon.textContent = '⏸'; // Pause symbol
                                        icon.title = 'Enable Plane Gizmo';
                                    }
                                };
                                
                                updateIcon(true); // Start enabled
                                button.appendChild(icon);
                                
                                button.onclick = () => {
                                    const enabled = toggleGizmo();
                                    updateIcon(enabled);
                                };
                                
                                // Add to toolbar
                                mainToolbar.appendChild(button);
                                console.log('[PlaneGizmo] Toolbar button added via direct DOM manipulation');
                                toolbarAdded = true;
                                
                                // Store reference for cleanup
                                menuAction.domButton = button;
                            } else {
                                console.warn('[PlaneGizmo] Main toolbar not found');
                            }
                        } else {
                            console.log('[PlaneGizmo] MenuBar action found in DOM, using that');
                            toolbarAdded = true;
                        }
                    } catch(e) {
                        console.warn('[PlaneGizmo] Direct DOM manipulation failed:', e);
                    }
                    
                    // Always add to view menu for accessibility
                    if(typeof MenuBar !== 'undefined') {
                        try {
                            MenuBar.addAction(menuAction, 'view');
                            console.log('[PlaneGizmo] Menu item added');
                        } catch(e) {
                            console.warn('[PlaneGizmo] Failed to add menu item:', e);
                        }
                    }
                    
                    if(!toolbarAdded) {
                        console.warn('[PlaneGizmo] Could not add to toolbar, only available in View menu');
                    } else {
                        // Debug: Check if the action is actually visible
                        setTimeout(() => {
                            console.log('[PlaneGizmo] Debug - Action details:', {
                                id: menuAction.id,
                                name: menuAction.name,
                                icon: menuAction.icon,
                                node: !!menuAction.node,
                                visible: menuAction.node ? menuAction.node.style.display !== 'none' : 'no node',
                                parent: menuAction.node ? menuAction.node.parentElement : 'no parent'
                            });
                            
                            // Try to find the action in the DOM
                            const actionElement = document.querySelector('[data-action="plane_gizmo_toggle"]');
                            if(actionElement) {
                                console.log('[PlaneGizmo] Found action element in DOM:', actionElement);
                                console.log('[PlaneGizmo] Element visibility:', {
                                    display: actionElement.style.display,
                                    visibility: actionElement.style.visibility,
                                    opacity: actionElement.style.opacity,
                                    parent: actionElement.parentElement
                                });
                            } else {
                                console.warn('[PlaneGizmo] Action element not found in DOM');
                                
                                // Try to find any toolbar elements
                                const toolbars = document.querySelectorAll('.toolbar, .menu_bar, [class*="toolbar"], [class*="menu"]');
                                console.log('[PlaneGizmo] Found toolbar elements:', toolbars.length);
                                toolbars.forEach((toolbar, i) => {
                                    console.log(`[PlaneGizmo] Toolbar ${i}:`, toolbar.className, toolbar.children.length, 'children');
                                });
                            }
                        }, 1000);
                    }
                }

                dlog('Enhanced plugin loaded successfully');
                console.warn('[Translation Plane Gizmo] ✅ Plugin loaded');
            } catch(e) {
                console.error('[PlaneGizmo] onload error', e);
            }
        },

        onunload(){
            try{
                console.log('[Translation Plane Gizmo] Unloading plugin...');
                removeMouseEvents();
                if(updateInterval){
                    clearInterval(updateInterval);
                    updateInterval=null;
                }
                removePlaneHandles();
                removePlaneGizmoStyles();
                
                // Clean up debug overlay if it exists
                if(window.PlaneGizmo && window.PlaneGizmo.removeDebugOverlay) {
                    window.PlaneGizmo.removeDebugOverlay();
                }
                
                gizmoGroup=null;

                // Clean up toolbar button and menu item
                if(menuAction) {
                    try {
                        // Remove from toolbar using MenuBar API (use string ID)
                        if(typeof MenuBar !== 'undefined') {
                            MenuBar.removeAction('plane_gizmo_toggle', 'toolbar');
                            console.log('[PlaneGizmo] Toolbar button removed');
                            
                            // Remove from view menu
                            MenuBar.removeAction('plane_gizmo_toggle', 'view');
                            console.log('[PlaneGizmo] Menu item removed');
                        }
                        
                        // Clean up DOM button if it was created
                        if(menuAction && menuAction.domButton) {
                            try {
                                menuAction.domButton.remove();
                                console.log('[PlaneGizmo] DOM button removed');
                            } catch(e) {
                                console.warn('[PlaneGizmo] Failed to remove DOM button:', e);
                            }
                        }
                        
                        // Clear the action reference
                        menuAction = null;
                    } catch(e) {
                        console.warn('[PlaneGizmo] Could not remove toolbar/menu items:', e);
                        // Try alternative cleanup method
                        try {
                            if(typeof MenuBar !== 'undefined') {
                                MenuBar.removeAction('plane_gizmo_toggle', 'toolbar');
                                MenuBar.removeAction('plane_gizmo_toggle', 'view');
                            }
                            console.log('[PlaneGizmo] Alternative cleanup successful');
                        } catch(e2) {
                            console.warn('[PlaneGizmo] Alternative cleanup also failed:', e2);
                        }
                        menuAction = null;
                    }
                }

                // Clean up keyboard shortcut
                if(typeof Blockbench !== 'undefined' && Blockbench.keybinds) {
                    try {
                        Blockbench.keybinds.remove('plane_gizmo.toggle');
                        console.log('[PlaneGizmo] Keyboard shortcut removed');
                    } catch(e) {
                        console.warn('[PlaneGizmo] Could not remove keyboard shortcut:', e);
                    }
                }

                // Clean up global references
                if(window.PlaneGizmo) {
                    delete window.PlaneGizmo;
                }

                dlog('Plugin unloaded successfully');
            } catch(e) {
                console.error('[PlaneGizmo] onunload error', e);
            }
        }
    });
})();
