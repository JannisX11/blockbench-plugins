import {
    MeshBVH,
} from 'three-mesh-bvh';

declare const THREE: typeof import('three');
interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface VectorPool {
    origin: THREE.Vector3;
    direction: THREE.Vector3;
    normal: THREE.Vector3;
}

interface PixelResult {
    color: [number, number, number, number];
    backfaceRatio: number;
}

// New interface for the face mapping
interface FaceMapping {
    faceIndexToBlockbenchFace: Map<number, MeshFace>;
}

let button: Action;

(Plugin as any).register('baked_ambient_occlusion', {
    "title": "Mr Salmon's Baked Ambient Occlusion",
    "author": "Kai Salmon",
    "description": "Baked Ambient Occlusion, creating instant shading",
    "icon": "icon.png",
    "version": "1.0.0",
    "min_version": "4.8.0",
    "variant": "both",
    "repository": "https://github.com/kaisalmon/MrSalmonsBlockbenchBakedAmbientOcclusion",
    "has_changelog": false,
    "tags": [
        "Texture",
        "Shading"
    ],
    onload(): void {
        button = new Action('bake_ambient_occlusion', {
            name: 'Bake Ambient Occlusion',
            description: 'Perform ambient occlusion baking on selected meshes',
            icon: 'cake',
            click: function (): void {
                showAmbientOcclusionDialog();
            }
        });
        MenuBar.addAction(button, 'filter');
    },
    onunload(): void {
        button.delete();
    }
});

/**
 * Convert RGB color object to hex string for color picker
 */
function colorToHex(color: Color): string {
    const r = Math.round(color.r).toString(16).padStart(2, '0');
    const g = Math.round(color.g).toString(16).padStart(2, '0');
    const b = Math.round(color.b).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

/**
 * Convert hex string to RGB color object
 */
function hexToColor(hex: string, alpha: number): Color {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b, a: alpha };
}

function showAmbientOcclusionDialog(): void {
    if (Mesh.selected.length === 0) {
        Blockbench.showToastNotification({
            text: 'No meshes selected',
        });
        return;
    }
    if (Mesh.selected.length > 1) {
        Blockbench.showToastNotification({
            text: 'Multiple meshes selected',
        });
        return;
    }


    // Load saved settings or use defaults
    const savedSettings = getPluginSettings();

    const dialog = new Dialog('ambient_occlusion_config', {
        title: 'Ambient Occlusion Settings',
        // width: 400,
        form: {
            highlight_color: {
                label: 'Highlight Color',
                type: 'color',
                value: colorToHex(savedSettings.highlightColor),
                description: 'Color used for areas with high ambient lighting'
            },
            highlight_alpha: {
                label: 'Highlight Opacity',
                type: 'range',
                min: 0,
                max: 1,
                step: 0.01,
                value: savedSettings.highlightColor.a,
                description: 'Opacity of the highlight color overlay'
            },
            highlight_gamma: {
                label: 'Highlight Gamma',
                type: 'range',
                min: 0.2,
                max: 2.0,
                step: 0.1,
                value: savedSettings.highlightGamma,
                description: 'Gamma correction for highlight areas (lower = more contrast)'
            },
            shadow_color: {
                label: 'Shadow Color',
                type: 'color',
                value: colorToHex(savedSettings.shadowColor),
                description: 'Color used for occluded/shadowed areas'
            },
            shadow_alpha: {
                label: 'Shadow Opacity',
                type: 'range',
                min: 0,
                max: 1,
                step: 0.01,
                value: savedSettings.shadowColor.a,
                description: 'Opacity of the shadow color overlay'
            },
            shadow_gamma: {
                label: 'Shadow Gamma',
                type: 'range',
                min: 0.2,
                max: 2.0,
                step: 0.1,
                value: savedSettings.shadowGamma,
                description: 'Gamma correction for shadow areas (higher = softer shadows)'
            },
            samples: {
                label: 'Samples per pixel',
                type: 'number',
                min: 10,
                max: 10000,
                step: 100,
                value: savedSettings.samples,
                description: 'Number of samples per pixel (higher = better quality, slower). 100 recommended for uniform sampling, 1000 for random sampling.'
            },
            sample_method: {
                label: 'Sample Method',
                type: 'inline_select',
                options: {
                    'random': 'Random',
                    'uniform': 'Uniform',
                },
                value: savedSettings.sampleMethod,
                description: 'Method for sampling ambient occlusion rays. Random is slightly more accurate but noisier, uniform is smoother for less samples but is more prone to artifacts.'
            },
            ambient_occlusion_radius: {
                label: 'Ambient Occlusion Radius',
                type: 'number',
                min: 1,
                max: 32,
                step: 1,
                value: savedSettings.ambientOcclusionRadius,
                description: 'Radius for ambient occlusion effect (Bigger is better for larger models or higher-resolution textures)'
            },
            simulate_ground_plane: {
                label: 'Simulate Ground Plane',
                type: 'checkbox',
                value: savedSettings.simulateGroundPlane,
                description: 'Simulate a ground plane, adding shadows at the base of the model'
            },
            retain_texture_transparency: {
                label: 'Retain Texture Transparency',
                type: 'checkbox',
                value: savedSettings.retainTextureTransparency,
                description: 'Preserve the original transparency of textures'
            },
            sample_texture_transparency: {
                label: 'Sample Texture Transparency',
                type: 'checkbox',
                value: savedSettings.sampleTextureTransparency,
                description: 'Consider texture transparency when calculating occlusion (slower but more accurate)'
            },
        },
        onConfirm: async function (formResult: any) {
            const options: BakeAmbientOcclusionOptions = {
                onProgress: (progress: number) => {
                    Blockbench.setProgress(progress)
                    loadingDialog.progress_bar!.setProgress(progress);
                    const elapsedMs = performance.now() - startTime;
                    const dialogObject: Element = (loadingDialog as any).object;
                    const titleElem = dialogObject.querySelector('.dialog_title');
                    if (titleElem) {
                        if (elapsedMs > 3000 || progress > 0.2) {
                            const estimatedTotalMs = elapsedMs / progress;
                            const estimatedRemainingMs = estimatedTotalMs - elapsedMs;
                            const formattedTime = formatMsToReadableTime(estimatedRemainingMs);
                            titleElem.textContent = `Baking Ambient Occlusion (~ ${formattedTime} remaining)`;
                        } else {
                            titleElem.textContent = `Baking Ambient Occlusion`;
                        }
                    }
                },
                highlightColor: hexToColor('#' + formResult.highlight_color.toHex(), formResult.highlight_alpha),
                shadowColor: hexToColor('#' + formResult.shadow_color.toHex(), formResult.shadow_alpha),
                samples: formResult.samples,
                ambientOcclusionRadius: formResult.ambient_occlusion_radius,
                retainTextureTransparency: formResult.retain_texture_transparency,
                sampleTextureTransparency: formResult.sample_texture_transparency,
                shadowGamma: formResult.shadow_gamma,
                highlightGamma: formResult.highlight_gamma,
                simulateGroundPlane: formResult.simulate_ground_plane,
                sampleMethod: formResult.sample_method
            };

            // Save settings for next session
            savePluginSettings({
                highlightColor: options.highlightColor,
                shadowColor: options.shadowColor,
                samples: options.samples,
                ambientOcclusionRadius: options.ambientOcclusionRadius,
                retainTextureTransparency: options.retainTextureTransparency,
                sampleTextureTransparency: options.sampleTextureTransparency,
                shadowGamma: options.shadowGamma,
                highlightGamma: options.highlightGamma,
                simulateGroundPlane: options.simulateGroundPlane,
                sampleMethod: options.sampleMethod
            });

            const startTime = performance.now();
            const jobController = {
                cancelled: false
            }
            const loadingDialog = new Dialog('bake_ambient_occlusion_loading', {
                title: 'Baking Ambient Occlusion',
                progress_bar: {
                    progress: 0,
                },
                cancel_on_click_outside: false,
                singleButton: true,
                buttons: ['Cancel'],
                onCancel: function () {
                    jobController.cancelled = true;
                }
            });

            loadingDialog.show();
            try {
                await bakeAmbientOcclusion(options, jobController);
            } finally {
                loadingDialog.hide();
                Blockbench.setProgress(0);
            }
        },
        buttons: ['Confirm', 'Restore Defaults', 'Cancel'],
        onButton(button_index: number, e: Event): void {
            if (button_index === 1) {
                localStorage.removeItem('blockbench_baked_ao_settings');
                showAmbientOcclusionDialog();
            }
        },
    });

    dialog.show();
}

interface BakeAmbientOcclusionOptions {
    sampleMethod: 'random' | 'uniform';
    onProgress?: (progress: number) => void;
    highlightColor: Color;
    shadowColor: Color;
    samples: number;
    ambientOcclusionRadius: number;
    retainTextureTransparency: boolean;
    sampleTextureTransparency: boolean;
    shadowGamma: number;
    highlightGamma: number;
    simulateGroundPlane: boolean;
}
interface JobController {
    cancelled: boolean;
}

async function bakeAmbientOcclusion(opts: BakeAmbientOcclusionOptions, jobController: JobController): Promise<void> {
    let anyMissing: boolean = false;
    let anyWithTextures: boolean = false;
    let pixelCount: number = 0;
    let faceCount: number = 0;

    performance.mark("startAO");

    for (const mesh of Mesh.selected) {
        let hasSelectedFaces: boolean = false;
        let facesInMesh = 0;
        mesh.forAllFaces((face: MeshFace) => {
            if (face.isSelected()) {
                hasSelectedFaces = true;
            }
            facesInMesh++;
        });

        // Process each face
        const result = await processMeshFaces(mesh, hasSelectedFaces, opts, jobController);
        anyMissing = anyMissing || result.anyMissing;
        anyWithTextures = anyWithTextures || result.anyWithTextures;
        pixelCount += result.totalPixelsProcessed;
        faceCount += result.totalFacesProcessed;
    }

    performance.mark("endAO");
    const measure: PerformanceMeasure = performance.measure("AO Processing Time", "startAO", "endAO");
    console.log(`AO Processing Time: ${measure.duration}ms`);

    if (!anyWithTextures) {
        Blockbench.showToastNotification({
            text: 'No textures found on selected meshes',
        });
    } else if (anyMissing) {
        Blockbench.showToastNotification({
            text: 'Some faces are missing textures',
        });
    }

}


function buildFaceMapping(mesh: Mesh): FaceMapping {
    // NOTE: This code duplicates some esoteric logic in from within Blockbench
    const faceIndexToBlockbenchFace = new Map<number, MeshFace>();
    let currentFaceIndex = 0;

    for (let key in mesh.faces) {
        const face = mesh.faces[key];
        const vertices = face.vertices;

        if (vertices.length < 3) continue;

        if (vertices.length === 3) {
            faceIndexToBlockbenchFace.set(currentFaceIndex, face);
            currentFaceIndex += 1;
        } else if (vertices.length === 4) {
            faceIndexToBlockbenchFace.set(currentFaceIndex, face);
            faceIndexToBlockbenchFace.set(currentFaceIndex + 1, face);
            currentFaceIndex += 2;
        }
    }

    return { faceIndexToBlockbenchFace };
}

interface ProcessMeshFacesResult {
    anyMissing: boolean;
    anyWithTextures: boolean;
    totalPixelsProcessed: number;
    totalFacesProcessed: number;
}


async function processMeshFaces(mesh: Mesh, hasSelectedFaces: boolean, opts: BakeAmbientOcclusionOptions, jobController: JobController): Promise<ProcessMeshFacesResult> {
    let anyMissing: boolean = false;
    let anyWithTextures: boolean = false;
    let totalPixelsProcessed: number = 0;
    let totalFacesProcessed = 0;
    const faces: MeshFace[] = [];
    mesh.forAllFaces((face: MeshFace) => faces.push(face));

    // Group faces by texture
    const facesByTexture: Map<Texture, MeshFace[]> = new Map();

    for (const face of faces) {
        const tex: Texture | undefined = face.getTexture();
        if (!tex) {
            anyMissing = true;
            continue;
        }

        if (hasSelectedFaces && !face.isSelected()) continue;

        anyWithTextures = true;

        if (!facesByTexture.has(tex)) {
            facesByTexture.set(tex, []);
        }
        facesByTexture.get(tex)!.push(face);
    }

    const [lowestY]: [number, number] = getHighestAndLowestY(mesh);

    const groundPlane: THREE.Mesh | null = opts.simulateGroundPlane ? createGroundPlane(lowestY) : null;

    const geometry: THREE.BufferGeometry = (mesh.mesh as THREE.Mesh).geometry;
    const geometryBackup = geometry.clone(); // Backup as BVH mutates the geometry in a way that causes bugs in Blockbench
    const bvh: MeshBVH = new MeshBVH(geometry, {
        indirect: true,
        maxDepth: 1000,
        maxLeafTris: 1,
    });

    const faceMapping = buildFaceMapping(mesh);

    try {
        for (const [texture, textureFaces] of facesByTexture) {
            const { pixelsProcessed, facesProcessed } = await processTextureWithFaces(
                texture, textureFaces, mesh, groundPlane, bvh, faceMapping, opts, jobController
            );
            totalPixelsProcessed += pixelsProcessed;
            totalFacesProcessed += facesProcessed;
        }

        return { anyMissing, anyWithTextures, totalPixelsProcessed, totalFacesProcessed };
    } finally {
        (mesh.mesh as THREE.Mesh).geometry = geometryBackup;
    }
}

function createGroundPlane(lowestY: number) {
    const groundPlane: THREE.Mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.FrontSide,
            transparent: true,
            opacity: 0.5
        })
    );
    groundPlane.rotation.set(-Math.PI / 2, 0, 0); // Rotate to be horizontal
    groundPlane.position.setY(lowestY - 1);
    groundPlane.updateMatrix();
    groundPlane.updateWorldMatrix(false, false);
    return groundPlane;
}

async function processTextureWithFaces(
    texture: Texture,
    faces: MeshFace[],
    mesh: Mesh,
    groundPlane: THREE.Mesh | null,
    bvh: MeshBVH,
    faceMapping: FaceMapping,
    opts: BakeAmbientOcclusionOptions,
    jobController: JobController
): Promise<{
    pixelsProcessed: number;
    facesProcessed: number;
}> {

    const bestResults: Map<string, PixelResult> = new Map();

    let facesProcessed: number = 0;
    for (const face of faces) {
        const occupationMatrix: Record<string, Record<string, boolean>> = face.getOccupationMatrix();
        const texture = face.getTexture();
        if (!texture) continue;
        const pixelDensityU = texture.width / texture.uv_width;
        const pixelDensityV = texture.height / texture.uv_height;
        if (pixelDensityU !== pixelDensityV) {
            throw new Error(`Non-uniform pixel density detected for texture ${texture.name}`);
        }
        const pixelCoords: [number, number][] = [];
        Object.keys(occupationMatrix).forEach((uStr: string) => {
            Object.keys(occupationMatrix[uStr]).forEach((vStr: string) => {
                const value: boolean = occupationMatrix[uStr][vStr];
                const u = parseInt(uStr, 10);
                const v = parseInt(vStr, 10);
                if (value === true) {
                    for (let x = 0; x < pixelDensityU; x++) {
                        for (let y = 0; y < pixelDensityV; y++) {
                            pixelCoords.push([Math.floor(u * pixelDensityU + x), Math.floor(v * pixelDensityV + y)]);
                        }
                    }
                }
            });
        });

        let i = 0;
        // Process pixels for this face
        for (const [u, v] of pixelCoords) {
            const key: string = `${u},${v}`;

            // Get x,y,z in 3d space of the face at this u,v
            let { x, y, z } = face.UVToLocal([(u + 0.5) / pixelDensityU, (v + 0.5) / pixelDensityV]);
            const result = calculateAmbientOcclusion([x, y, z], [u, v], face, mesh, groundPlane, bvh, faceMapping, opts, generateFibonacciSpherePoints(opts.samples));

            if (result) {
                const [color, backfaceRatio] = result;

                // Check if this is the best result for this pixel so far
                const existing = bestResults.get(key);
                if (!existing || backfaceRatio < existing.backfaceRatio) {
                    bestResults.set(key, {
                        color: color,
                        backfaceRatio: backfaceRatio
                    });
                }
            }

            i++;
            if (i % 32 === 0) {
                // Yield to allow UI updates
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            if (jobController.cancelled) {
                throw new Error('Job cancelled');
            }
        }
        facesProcessed++;
        opts?.onProgress?.(facesProcessed / faces.length);
    }

    let processedPixels: number = 0;
    texture.edit((htmlCanvasElement: HTMLCanvasElement) => {
        const ctx: CanvasRenderingContext2D = htmlCanvasElement.getContext('2d')!;

        for (const [pixelKey, result] of bestResults) {
            const [u, v] = pixelKey.split(',').map(x => parseInt(x, 10));
            let [r, g, b, a] = result.color;

            if (opts.retainTextureTransparency) {
                const srcAlpha = ctx.getImageData(u, v, 1, 1).data[3];
                a *= srcAlpha / 255;
            }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctx.fillRect(u, v, 1, 1);
            processedPixels++;
        }
    });

    return {
        pixelsProcessed: processedPixels,
        facesProcessed: faces.length
    };
}

const vectorPool: VectorPool = {
    origin: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    normal: new THREE.Vector3()
};


function calculateAmbientOcclusion(
    position: [number, number, number],
    uv: [number, number],
    face: MeshFace,
    mesh: Mesh,
    groundPlane: THREE.Mesh | null,
    bvh: MeshBVH,
    faceMapping: FaceMapping,
    opts: BakeAmbientOcclusionOptions,
    spherePoints: Record<number, THREE.Vector3>,
): [[number, number, number, number], number] | null {
    const [x, y, z]: [number, number, number] = position;
    const [normalX, normalY, normalZ]: [number, number, number] = face.getNormal(true);

    vectorPool.normal.set(normalX, normalY, normalZ);

    let occlusion: number = 0;
    let backfaceHits: number = 0;
    const rayCount: number = opts.samples;

    for (let i: number = 0; i < rayCount; i++) {
        let direction: THREE.Vector3;
        vectorPool.origin.set(x, y, z)
            .addScaledVector(vectorPool.normal, 0.5);
        if (opts.sampleMethod === 'random') {
            vectorPool.origin.x += (Math.random() - 0.5) * 0.5
            vectorPool.origin.y += (Math.random() - 0.5) * 0.5;
            vectorPool.origin.z += (Math.random() - 0.5) * 0.5;
            vectorPool.direction.set(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize();
            direction = vectorPool.direction;
        } else {
            direction = spherePoints[i];
        }
        const raycaster: THREE.Raycaster = new THREE.Raycaster(vectorPool.origin, direction, 0.001, opts.ambientOcclusionRadius);

        const hit = bvh.raycastFirst(raycaster.ray, THREE.DoubleSide);
        if (hit) {
            const faceNormal = hit.face!.normal!;
            const dot = vectorPool.direction.dot(faceNormal);
            if (dot > 0) {
                backfaceHits += 1;
            }
            if (!opts.sampleTextureTransparency) {
                occlusion += 1;
            } else {
                // Use the optimized face lookup instead of the expensive linear search
                const blockbenchFace = faceMapping.faceIndexToBlockbenchFace.get(hit.faceIndex!);
                if (blockbenchFace) {
                    const [hitU, hitV] = blockbenchFace.localToUV(hit.point!);
                    const texture: Texture | undefined = blockbenchFace.getTexture();
                    if (texture) {
                        const pixelColor: ImageData = texture.ctx.getImageData(hitU, hitV, 1, 1);
                        occlusion += pixelColor.data[3] / 255;
                    } else {
                        occlusion += 1;
                    }
                } else {
                    // Fallback to 1 if face not found (shouldn't happen with proper mapping)
                    occlusion += 1;
                }
            }
        } else {
            // Check if the ray intersects the ground plane
            const groundPlaneHit = groundPlane && raycaster.intersectObject(groundPlane).length > 0;
            if (groundPlaneHit) {
                occlusion += 1;
            }
        }
    }

    let occlusionFactor: number = 1 - occlusion / rayCount;
    const backfaceRatio = backfaceHits / rayCount;

    let t: number;
    let color: Color;

    if (occlusionFactor < 0.5) {
        t = (0.5 - occlusionFactor) * 2;
        t = Math.pow(t, opts.shadowGamma);
        color = opts.shadowColor;
    } else {
        t = (occlusionFactor - 0.5) * 2;
        t = Math.pow(t, opts.highlightGamma);
        color = opts.highlightColor;
    }

    return [
        [color.r, color.g, color.b, color.a * t],
        backfaceRatio
    ];
}

/**
 * Get the highest and lowest Y coordinates of all vertices in a mesh
 * @param mesh - The mesh to analyze
 * @returns [lowestY, highestY]
 */
function getHighestAndLowestY(mesh: Mesh): [number, number] {

    if (!mesh.mesh || !(mesh.mesh instanceof THREE.Mesh)) {
        console.log(mesh);
        throw new Error('Invalid mesh object');
    }

    const geometry = mesh.mesh.geometry;

    if (!geometry || !geometry.attributes || !geometry.attributes.position) {
        console.log(geometry);
        throw new Error('Mesh does not have valid geometry attributes');
    }

    const positionAttribute: THREE.BufferAttribute = geometry.attributes.position as THREE.BufferAttribute;
    let highestY: number = -Infinity;
    let lowestY: number = Infinity;

    for (let i: number = 0; i < positionAttribute.count; i++) {
        const y: number = positionAttribute.getY(i);
        if (y > highestY) highestY = y;
        if (y < lowestY) lowestY = y;
    }

    return [lowestY, highestY];
}

function formatMsToReadableTime(estimatedRemainingMs: number) {
    const totalSeconds = Math.floor(estimatedRemainingMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
}

function generateFibonacciSpherePoints(n: number): Record<number, THREE.Vector3> {
    const points: Record<number, THREE.Vector3> = {};
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2; // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y); // Radius at y
        const theta = phi * i; // Golden angle increment
        points[i] = new THREE.Vector3(
            radius * Math.cos(theta),
            y,
            radius * Math.sin(theta)
        );
    }
    return points;
}

function getPluginSettings(): BakeAmbientOcclusionOptions {
    const savedSettings = localStorage.getItem('blockbench_baked_ao_settings');
    const defaultSettings = {
        sampleMethod: 'random' as 'random' | 'uniform',
        highlightColor: { r: 231, g: 225, b: 164, a: 0.4 },
        shadowColor: { r: 36, g: 11, b: 55, a: 0.5 },
        samples: 1000,
        ambientOcclusionRadius: 8,
        retainTextureTransparency: false,
        sampleTextureTransparency: false,
        shadowGamma: 1.0,
        highlightGamma: 0.5,
        simulateGroundPlane: true
    };

    if (savedSettings) {
        try {
            return { ...defaultSettings, ...JSON.parse(savedSettings) };
        } catch (e) {
            console.warn('Failed to parse saved AO settings, using defaults');
        }
    }

    return defaultSettings;
}

function savePluginSettings(options: Partial<BakeAmbientOcclusionOptions>): void {
    localStorage.setItem('blockbench_baked_ao_settings', JSON.stringify(options));
}