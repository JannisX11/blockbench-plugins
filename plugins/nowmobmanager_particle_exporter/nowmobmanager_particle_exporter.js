const PARTICLE_CELL_SIZE = 1.0;
const BLOCKBENCH_TO_MINECRAFT_SCALE = 0.5;

const BAKED_FRAME_RATE = 20;
const BAKED_FRAME_TIME = 1.0 / BAKED_FRAME_RATE;

let exportAction = null;
let exporterBaseCubeGeometry = new Map();
let exporterBaseParticles = [];


Plugin.register('nowmobmanager_particle_exporter', {
    title: 'nowMobmanager Particle Exporter',
    author: '_NotWhale (now)',
    description: 'Export Blockbench models and animations as baked particle animations for nowMobmanager.',
    icon: 'icon.png',
    version: '1.0.0',
    variant: 'desktop',
    min_version: '5.0.0',
    new_repository_format: true,
    tags: ['Minecraft: Java Edition', 'Animation', 'Exporter'],
    onload() {
        exportAction = new Action(
            'nowmobmanager_particle_exporter_baked',
            {
                name: 'Export nowMobmanager Particle Animation',
                description: 'Export the current Blockbench model as baked particle animation.',
                icon: 'save',
                click() {exportBakedParticleAnimation();}
            }
        );
        MenuBar.menus.tools.addAction(exportAction);
        console.log('[nowMobmanager Particle Exporter] ' + 'Loaded nowMobmanager Particle Exporter v1.0.0');
    },
    onunload() {
        if (exportAction) {
            exportAction.delete();
            exportAction = null;
        }
        exporterBaseParticles = [];
        exporterBaseCubeGeometry.clear();
        console.log('[nowMobmanager Particle Exporter] ' + 'Unloaded.');
    }
});

function roundParticleCoordinate(value) {
    const rounded = Math.round(value * 1000000) / 1000000;
    if (Math.abs(rounded) < 0.000001) {return 0;}
    return rounded;
}

function vectorToPlainObject(vector) {
    if (!vector) {return {x: 0, y: 0, z: 0};}
    if (Number.isFinite(vector.x) &&
        Number.isFinite(vector.y) &&
        Number.isFinite(vector.z)
    ) {
        return {
            x: Number(vector.x),
            y: Number(vector.y),
            z: Number(vector.z)
        };
    }
    if (Number.isFinite(vector[0]) &&
        Number.isFinite(vector[1]) &&
        Number.isFinite(vector[2])
    ) {
        return {
            x: Number(vector[0]),
            y: Number(vector[1]),
            z: Number(vector[2])
        };
    }
    throw new Error('Unsupported Blockbench vector format.');
}

function distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
}

function findTrueCubeEdges(worldVertices) {
    if (!Array.isArray(worldVertices) || worldVertices.length !== 8) {return null;}
    const tolerance = 0.00001;
    const base = worldVertices[0];
    const candidates =
        worldVertices.slice(1).map(vertex => ({
            x: vertex.x - base.x,
            y: vertex.y - base.y,
            z: vertex.z - base.z,
            length: Math.sqrt(
                distanceSquared(base, vertex)
            )
        }));

    function containsVertex(point) {
        const toleranceSquared = tolerance * tolerance;
        for (const vertex of worldVertices) {if (distanceSquared(vertex, point) <= toleranceSquared) {return true;}}
        return false;
    }

    function pointFromVectors(a, b = null, c = null) {
        return {
            x:
                base.x +
                a.x +
                (b ? b.x : 0) +
                (c ? c.x : 0),
            y:
                base.y +
                a.y +
                (b ? b.y : 0) +
                (c ? c.y : 0),
            z:
                base.z +
                a.z +
                (b ? b.z : 0) +
                (c ? c.z : 0)
        };
    }

    for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
            for (let k = j + 1; k < candidates.length; k++) {
                const a = candidates[i];
                const b = candidates[j];
                const c = candidates[k];
                const expectedVertices = [
                    pointFromVectors(a),
                    pointFromVectors(b),
                    pointFromVectors(c),
                    pointFromVectors(a, b),
                    pointFromVectors(a, c),
                    pointFromVectors(b, c),
                    pointFromVectors(a, b, c)
                ];
                let valid = true;
                for (const expected of expectedVertices) {
                    if (!containsVertex(expected)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {return [a, b, c];}
            }
        }
    }
    return null;
}

function createParticleDataFromCube(cube) {
    if (!cube) {return [];}
    let vertices;
    try {vertices = cube.getGlobalVertexPositions();
    } catch (error) {
        console.error(
            '[nowMobmanager Particle Exporter] ' +
            'Failed to read cube global vertices:',
            cube.name,
            error
        );
        return [];
    }
    if (!Array.isArray(vertices) || vertices.length !== 8) {
        console.error(
            '[nowMobmanager Particle Exporter] ' +
            'Cube does not have 8 global vertices:',
            cube.name
        );
        return [];
    }
    const worldVertices = vertices.map(vectorToPlainObject);
    const center = {x: 0, y: 0, z: 0};
    for (const vertex of worldVertices) {
        center.x += vertex.x;
        center.y += vertex.y;
        center.z += vertex.z;
    }
    center.x /= worldVertices.length;
    center.y /= worldVertices.length;
    center.z /= worldVertices.length;
    const edgeVectors = findTrueCubeEdges(worldVertices);
    if (!edgeVectors) {
        console.error(
            '[nowMobmanager Particle Exporter] ' +
            'Failed to reconstruct cube edges:',
            cube.name
        );
        return [];
    }
    const sortedEdges = [...edgeVectors].sort((a, b) => b.length - a.length);
    const axisEdges = {
        x: sortedEdges[0],
        y: sortedEdges[1],
        z: sortedEdges[2]
    };
    const sizeX = axisEdges.x.length;
    const sizeY = axisEdges.y.length;
    const sizeZ = axisEdges.z.length;
    const countX = Math.max(1, Math.ceil(sizeX / PARTICLE_CELL_SIZE));
    const countY = Math.max(1, Math.ceil(sizeY / PARTICLE_CELL_SIZE));
    const countZ = Math.max(1, Math.ceil(sizeZ / PARTICLE_CELL_SIZE));
    const positions = [];
    let particleIndex = 0;
    for (let x = 0; x < countX; x++) {
        for (let y = 0; y < countY; y++) {
            for (let z = 0; z < countZ; z++) {
                const u = (x + 0.5) / countX;
                const v = (y + 0.5) / countY;
                const w = (z + 0.5) / countZ;
                const dx = u - 0.5;
                const dy = v - 0.5;
                const dz = w - 0.5;
                positions.push({
                    id: `${cube.uuid}_${particleIndex}`,
                    name: `${cube.name || 'cube'}_${particleIndex + 1}`,
                    particle: 'END_ROD',
                    sourceUuid: cube.uuid || null,
                    visible: cube.visibility !== false,
                    x: roundParticleCoordinate(
                        (
                            center.x +
                            axisEdges.x.x * dx +
                            axisEdges.y.x * dy +
                            axisEdges.z.x * dz
                        ) * BLOCKBENCH_TO_MINECRAFT_SCALE
                    ),
                    y: roundParticleCoordinate(
                        (
                            center.y +
                            axisEdges.x.y * dx +
                            axisEdges.y.y * dy +
                            axisEdges.z.y * dz
                        ) * BLOCKBENCH_TO_MINECRAFT_SCALE
                    ),
                    z: roundParticleCoordinate(
                        (
                            center.z +
                            axisEdges.x.z * dx +
                            axisEdges.y.z * dy +
                            axisEdges.z.z * dz
                        ) * BLOCKBENCH_TO_MINECRAFT_SCALE
                    )
                });
                particleIndex++;
            }
        }
    }
    return positions;
}

function buildBaseParticleData() {
    const cubes = Cube.all || [];
    const particles = [];
    for (const cube of cubes) {
        const cubeParticles = createParticleDataFromCube(cube);
        particles.push(...cubeParticles);
    }
    return particles;
}

function buildCurrentFramePositions() {
    const positions = [];
    const currentCubeGeometry = new Map();
    for (const cube of Cube.all || []) {
        let vertices;
        try {vertices = cube.getGlobalVertexPositions();
        } catch (error) {throw new Error(`[nowMobmanager Particle Exporter] ` + `Failed to read animated vertices for cube "${cube.name}": ${error}`);}
        if (!Array.isArray(vertices) || vertices.length !== 8) {throw new Error(`[nowMobmanager Particle Exporter] ` + `Animated cube "${cube.name}" returned invalid vertices.`);}
        const worldVertices = vertices.map(vectorToPlainObject);
        const center = {x: 0, y: 0, z: 0};
        for (const vertex of worldVertices) {
            center.x += vertex.x;
            center.y += vertex.y;
            center.z += vertex.z;
        }
        center.x /= 8;
        center.y /= 8;
        center.z /= 8;
        const edgeVectors = findTrueCubeEdges(worldVertices);
        if (!edgeVectors) {throw new Error(`[nowMobmanager Particle Exporter] ` + `Failed to reconstruct animated edges for cube "${cube.name}".`);}
        const sortedEdges = [...edgeVectors].sort((a, b) => b.length - a.length);
        currentCubeGeometry.set(
            cube.uuid,
            {
                center,
                edges: {
                    x: sortedEdges[0],
                    y: sortedEdges[1],
                    z: sortedEdges[2]
                }
            }
        );
    }
    for (const particle of exporterBaseParticles) {
        const cubeUuid = particle.sourceUuid;
        const baseGeometry = exporterBaseCubeGeometry.get(cubeUuid);
        const currentGeometry = currentCubeGeometry.get(cubeUuid);
        if (!baseGeometry || !currentGeometry) {
            positions.push({
                x: particle.position?.x ?? particle.x ?? 0,
                y: particle.position?.y ?? particle.y ?? 0,
                z: particle.position?.z ?? particle.z ?? 0
            });
            continue;
        }
        const particleWorld = {
            x:
                (
                    particle.x ??
                    particle.position?.x ??
                    0
                ) / BLOCKBENCH_TO_MINECRAFT_SCALE,
            y:
                (
                    particle.y ??
                    particle.position?.y ??
                    0
                ) / BLOCKBENCH_TO_MINECRAFT_SCALE,
            z:
                (
                    particle.z ??
                    particle.position?.z ??
                    0
                ) / BLOCKBENCH_TO_MINECRAFT_SCALE
        };
        const relative = {
            x: particleWorld.x - baseGeometry.center.x,
            y: particleWorld.y - baseGeometry.center.y,
            z: particleWorld.z - baseGeometry.center.z
        };
        const ex = baseGeometry.edges.x;
        const ey = baseGeometry.edges.y;
        const ez = baseGeometry.edges.z;
        const exLenSq = ex.x * ex.x + ex.y * ex.y + ex.z * ex.z;
        const eyLenSq = ey.x * ey.x + ey.y * ey.y + ey.z * ey.z;
        const ezLenSq = ez.x * ez.x + ez.y * ez.y + ez.z * ez.z;
        const localX =
            (
                relative.x * ex.x +
                relative.y * ex.y +
                relative.z * ex.z
            ) / exLenSq;
        const localY =
            (
                relative.x * ey.x +
                relative.y * ey.y +
                relative.z * ey.z
            ) / eyLenSq;
        const localZ =
            (
                relative.x * ez.x +
                relative.y * ez.y +
                relative.z * ez.z
            ) / ezLenSq;
        const current = currentGeometry;
        const currentWorldPosition = {
            x:
                current.center.x +
                current.edges.x.x * localX +
                current.edges.y.x * localY +
                current.edges.z.x * localZ,
            y:
                current.center.y +
                current.edges.x.y * localX +
                current.edges.y.y * localY +
                current.edges.z.y * localZ,
            z:
                current.center.z +
                current.edges.x.z * localX +
                current.edges.y.z * localY +
                current.edges.z.z * localZ
        };
        positions.push({
            x: roundParticleCoordinate(currentWorldPosition.x * BLOCKBENCH_TO_MINECRAFT_SCALE),
            y: roundParticleCoordinate(currentWorldPosition.y * BLOCKBENCH_TO_MINECRAFT_SCALE),
            z: roundParticleCoordinate(currentWorldPosition.z * BLOCKBENCH_TO_MINECRAFT_SCALE)
        });
    }
    return positions;
}

function applyAnimationTime(animation, time) {
    if (!animation) {
        console.warn('[nowMobmanager] ' + 'applyAnimationTime: animation is null');
        return false;
    }
    console.log(`[nowMobmanager] Applying animation "${animation.name}" at time ${time}`);
    try {Timeline.time = time;
    } catch (error) {
        console.error('[nowMobmanager] ' + 'Failed to set Timeline.time:', error);
        return false;
    }
    try {
        Animator.showDefaultPose(true);
        Animator.stackAnimations([animation], false);
    } catch (error) {
        console.error('[nowMobmanager] ' + 'Failed to apply animation frame:', error);
        return false;
    }
    try {if (typeof Animator.displayMeshDeformation === 'function') {Animator.displayMeshDeformation();}
    } catch (error) {console.warn('[nowMobmanager] ' + 'displayMeshDeformation() failed:', error);}
    try {if (typeof Canvas !== 'undefined' && Canvas.scene) {Canvas.scene.updateMatrixWorld(true);}
    } catch (error) {console.warn('[nowMobmanager] ' + 'Matrix update failed:', error);}
    return true;
}

function captureAnimationFrame(animation, time, expectedCoordinateCount) {
    if (!animation) {throw new Error('[nowMobmanager Particle Exporter] ' + 'Animation is null.');}
    console.log(`[nowMobmanager] Capturing frame at ${time.toFixed(3)}s`);
    if (!applyAnimationTime(animation, time)) {throw new Error('[nowMobmanager Particle Exporter] ' + `Failed to apply animation at ${time}s`);}
    const positions = buildCurrentFramePositions();
    const expectedParticleCount = exporterBaseParticles.length;
    if (positions.length !== expectedParticleCount) {
        throw new Error(
            '[nowMobmanager Particle Exporter] ' +
            `Particle count mismatch at ${time}s. ` +
            `Expected ${expectedParticleCount}, ` +
            `got ${positions.length}.`
        );
    }
    const actualCoordinateCount = positions.length * 3;
    if (actualCoordinateCount !== expectedCoordinateCount) {
        throw new Error(
            '[nowMobmanager Particle Exporter] ' +
            `Coordinate count mismatch at ${time}s. ` +
            `Expected ${expectedCoordinateCount}, ` +
            `got ${actualCoordinateCount}.`
        );
    }
    return positions.flatMap(position => [position.x, position.y, position.z]);
}

function bakeAnimation(animation, expectedCoordinateCount) {
    console.log('[nowMobmanager Particle Exporter] ' + 'Baking animation:', animation.name);
    const length = Math.max(0, Number(animation.length || 0));
    const frames = [];
    for (let frameIndex = 0, time = 0; time < length; frameIndex++, time += BAKED_FRAME_TIME) {
        const frameTime = Number(time.toFixed(6));
        const positions = captureAnimationFrame(animation, frameTime, expectedCoordinateCount);
        frames.push({positions:positions});
        if (frameIndex % BAKED_FRAME_RATE === 0) {console.log('[nowMobmanager Particle Exporter] ' + `Baked frame ${frameIndex} ` + `at ${frameTime}s`);}
    }
    const finalTime = Number(length.toFixed(6));
    const finalPositions = captureAnimationFrame(animation, finalTime, expectedCoordinateCount);
    const lastFrame = frames.length > 0 ? frames[frames.length - 1] : null;
    const sameAsLastFrame = lastFrame && arraysEqual(lastFrame.positions, finalPositions);
    if (!sameAsLastFrame) {frames.push({positions:finalPositions});}
    return {
        uuid: animation.uuid,
        name: animation.name,
        length: length,
        loop: animation.loop || 'once',
        frameRate: BAKED_FRAME_RATE,
        frames: frames
    };
}

function arraysEqual(a, b) {
    if (a === b) {return true;}
    if (!a || !b) {return false;}
    if (a.length !== b.length) {return false;}
    for (let i = 0; i < a.length; i++) {if (a[i] !== b[i]) {return false;}}
    return true;
}

function showDefaultPose() {
    if (typeof Animator !== 'undefined' && typeof Animator.showDefaultPose === 'function') {
        try {Animator.showDefaultPose();
        } catch (error) {console.warn('[nowMobmanager Particle Exporter] ' + 'Failed to show default pose:', error);}
    }
    if (typeof Canvas !== 'undefined') {
        try {Canvas.updateAll();
        } catch (error) {console.warn('[nowMobmanager Particle Exporter] ' + 'Failed to update canvas:', error);}
    }
}

function cacheBaseCubeGeometry() {
    exporterBaseCubeGeometry.clear();
    if (typeof Animator !== 'undefined' && typeof Animator.showDefaultPose === 'function') {Animator.showDefaultPose(true);}
    if (typeof Canvas !== 'undefined') {
        try {Canvas.updateAll();
        } catch (error) {console.warn('[nowMobmanager Particle Exporter] ' + 'Failed to update canvas before base geometry cache:', error);}
    }
    for (const cube of Cube.all || []) {
        let vertices;
        try {vertices = cube.getGlobalVertexPositions();
        } catch (error) {throw new Error(`[nowMobmanager Particle Exporter] ` + `Failed to cache vertices for cube "${cube.name}": ${error}`);}
        if (!Array.isArray(vertices) || vertices.length !== 8) {throw new Error(`[nowMobmanager Particle Exporter] ` + `Cube "${cube.name}" must have exactly 8 vertices.`);}
        const worldVertices = vertices.map(vectorToPlainObject);
        const center = {x: 0, y: 0, z: 0};
        for (const vertex of worldVertices) {
            center.x += vertex.x;
            center.y += vertex.y;
            center.z += vertex.z;
        }
        center.x /= worldVertices.length;
        center.y /= worldVertices.length;
        center.z /= worldVertices.length;
        const edgeVectors = findTrueCubeEdges(worldVertices);
        if (!edgeVectors) {throw new Error(`[nowMobmanager Particle Exporter] ` + `Failed to reconstruct base edges for cube "${cube.name}".`);}
        const sortedEdges = [...edgeVectors].sort((a, b) => b.length - a.length);
        exporterBaseCubeGeometry.set(
            cube.uuid,
            {
                center,
                edges: {
                    x: sortedEdges[0],
                    y: sortedEdges[1],
                    z: sortedEdges[2]
                }
            }
        );
    }
}

function exportBakedParticleAnimation() {
    console.log('==================================================');
    console.log('[nowMobmanager Particle Exporter] ' + 'Starting baked export...');
    showDefaultPose();
    const baseParticles = buildBaseParticleData();
    if (!baseParticles || baseParticles.length === 0) {
        console.error('[nowMobmanager Particle Exporter] ' + 'No particles found.');
        return;
    }
    exporterBaseParticles = baseParticles;
    try {cacheBaseCubeGeometry();
    } catch (error) {
        showDefaultPose();
        console.error('[nowMobmanager Particle Exporter] ' + 'BASE GEOMETRY CACHE FAILED:', error);
        return;
    }
    console.log('[nowMobmanager Particle Exporter] ' + 'Base particles:', exporterBaseParticles.length);
    const expectedCoordinateCount = exporterBaseParticles.length * 3;
    if (typeof Animation === 'undefined') {
        console.error('[nowMobmanager Particle Exporter] ' + 'Animation API unavailable.');
        return;
    }
    const animations = Animation.all || [];
    if (animations.length === 0) {
        console.error('[nowMobmanager Particle Exporter] ' + 'No animations found.');
        return;
    }
    console.log('[nowMobmanager Particle Exporter] ' + 'Animations:', animations.length);
    const bakedAnimations = [];
    try {
        for (const animation of animations) {
            if (!animation) {continue;}
            const bakedAnimation = bakeAnimation(animation, expectedCoordinateCount);
            bakedAnimations.push(bakedAnimation);
        }
    } catch (error) {
        showDefaultPose();
        console.error('[nowMobmanager Particle Exporter] ' + 'BAKING FAILED:', error);
        return;
    }
    showDefaultPose();
    const exportData = {
        format: 'nowmobmanager_particle',
        version: 3,
        particles:
            exporterBaseParticles.map(
                particle => ({
                    id: particle.id,
                    name: particle.name,
                    particle: particle.particle,
                    sourceUuid: particle.sourceUuid,
                    visible: particle.visible
                })
            ),
        animations: bakedAnimations
    };
    const json = JSON.stringify(exportData, null, 4);
    console.log('[nowMobmanager Particle Exporter] ' + 'Export completed.');
    console.log('[nowMobmanager Particle Exporter] ' + 'JSON size:', json.length, 'characters');
    console.log('[nowMobmanager Particle Exporter] ' + 'Animations exported:', bakedAnimations.length);
    Blockbench.export({
        type: 'JSON File',
        extensions: ['json'],
        name: 'particle_model_baked.json',
        content: json,
        savetype: 'text',
        resource_id: 'nowmobmanager_particle_export_baked'
    }, path => {
        if (path) {console.log('[nowMobmanager Particle Exporter] ' + 'File saved:', path);
        } else {console.log('[nowMobmanager Particle Exporter] ' + 'Export cancelled.');}
    });
    console.log('==================================================');
}