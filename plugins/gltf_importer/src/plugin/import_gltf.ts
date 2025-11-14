import { GLTF, parseGltf } from './parse_gltf';
import { arrayEquals, eulerDegreesFromQuat, imageBitmapToDataUri, modulo, valuesAndIndices } from './util';
import { VectorHashMap } from './vector_hash_map';

export type ImportOptions = {
    file: Filesystem.FileResult,
    scale:        number,
    groups:       boolean,
    cameras:      boolean|'NOT_INSTALLED',
    animations:   boolean,
    mergeQuads:   boolean,
    undoable:     boolean,
    selectResult: boolean,
};

export type ImportedContent = {
    // Used for undo system
    groups:     Group[],
    elements:   OutlinerElement[],
    textures:   Texture[],
    animations: BBAnimation[],
    // Used for displaying warnings
    uvOutOfBounds:         boolean,
    usesRepeatingWrapMode: boolean,
    unsupportedArmatures:  boolean,
    // To keep track of which THREE texture corresponds to which Blockbench texture
    texturesById: {[textureId: string]: Texture|null};
    // Each THREE texture's cache key, containing source information
    textureCacheKeys: {[textureId: string]: string};
};


// MARK: 🟥 gltf
export async function importGltf(options: ImportOptions): Promise<ImportedContent|'UNSUPPORTED_CAMERAS'> {

    // TODO: cameras!
    // TODO: animations!
    // TODO: armatures!

    let gltf = await parseGltf(options.file);

    // console.log('gltf', gltf); // TODO: remove

    // Stop early if cameras are enabled, but not installed, and the model does include cameras
    if (options.cameras === 'NOT_INSTALLED' && gltf.cameras.length !== 0)
        return 'UNSUPPORTED_CAMERAS';

    // Keep track of all the things we importeNd
    let content: ImportedContent = {
        groups:     [],
        elements:   [],
        textures:   [],
        animations: [],
        uvOutOfBounds:         false,
        usesRepeatingWrapMode: false,
        unsupportedArmatures:  false,
        texturesById: {},
        textureCacheKeys: await prepareTextureCacheKeys(gltf),
    };

    if (options.undoable) {
        let rootGroup = Outliner.root.find(n => n instanceof Group);
        Undo.initEdit({
            outliner: true,
            selection: true,
            group: rootGroup,
            elements: content.elements,
            textures: content.textures,
            animations: content.animations,
        });
    }

    // Navigate node tree and import what we find
    let sceneRoot = gltf.scene as unknown as THREE.Group;
    importNode(sceneRoot, options, content);

    // Check if any samplers use the repeating wrap mode
    content.usesRepeatingWrapMode = gltf.parser.json.samplers?.some((s: any) =>
        s.wrapS == undefined || s.wrapT == undefined || s.wrapS === 10497 || s.wrapT === 10497 )
        ?? false;

    // Select all the elements we imported
    if (options.selectResult) {
        Outliner.selected.empty();
        Outliner.selected.push(...content.elements);
        Group.all.forEach(g => g.unselect());
        content.groups.forEach(g => g.multiSelect());
    }

    if (options.undoable)
        Undo.finishEdit('Import glTF');

    return content;
}

// MARK: 🟥 node
function importNode(node: THREE.Object3D, options: ImportOptions, content: ImportedContent): Group|Mesh|null {
    switch (node.type) {
        case 'Group':
            // If this is not the root, it's representing one mesh with multiple primitives
            if (node.parent != undefined)
                return importMeshPrimitives(node as THREE.Group, node.children as THREE.Mesh[], options, content);
            // else it's the root, treat as group
            // fall through...
        case 'Object3D':
            return importGroup(node, options, content);
        case 'Mesh':
        case 'SkinnedMesh':
            return importSingleMesh(node as THREE.Mesh, options, content);
        default:
            console.warn(`[gltf_importer]: Skipping unknown node type "${node.type}"`);
            return null;
    }
}

// MARK: 🟥 group
function importGroup(node: THREE.Object3D, options: ImportOptions, content: ImportedContent): Group|null {
    let isRoot = node.parent == undefined;
    let group: Group|null = null;

    // Only create outliner group if the option is enabled and if the current node is not the root
    if (options.groups && !isRoot) {
        group = new Group({
            name: node.userData.name || node.name || 'group',
            origin: node.getWorldPosition(new THREE.Vector3()).multiplyScalar(options.scale).toArray(),
            rotation: eulerDegreesFromQuat(node.getWorldQuaternion(new THREE.Quaternion())).toArray() as ArrayVector3,
        });
        group.init();
        group.createUniqueName();
        group.openUp();
        content.groups.push(group);
    }

    // Child nodes
    for (let child of node.children) {
        let result = importNode(child, options, content);
        result?.addTo(group ?? 'root');
    }
    
    return group;
}

// MARK: 🟥 mesh

function importSingleMesh(node: THREE.Mesh, options: ImportOptions, content: ImportedContent): Mesh {
    return importMeshPrimitives(node, [node], options, content);
}

// Meshes in glTFs are made of one or more primitives which can have different materials
// THREE.js turns this into a Group with multiple meshes
// In Blockbench we would like this to be one mesh again, and just set the different textures on the faces
// We also de-duplicate vertices across primitives
function importMeshPrimitives(node: THREE.Object3D, primitives: THREE.Mesh[], options: ImportOptions, content: ImportedContent): Mesh {

    // Take info like name and origin from the encompassing group
    let mesh = new Mesh({
        name: node.userData.name || node.name || 'mesh',
        origin: node.getWorldPosition(new THREE.Vector3()).multiplyScalar(options.scale).toArray(),
        rotation:  eulerDegreesFromQuat(node.getWorldQuaternion(new THREE.Quaternion())).toArray() as ArrayVector3,
        vertices: {},
    });
    content.elements.push(mesh);

    let scale = node.getWorldScale(new THREE.Vector3()).multiplyScalar(options.scale);

    // Lookup of primitive to texture
    let primitiveTextures = primitives.map(p => importTexture((p.material as any), options, content));

    // Potentially confusing terms:
    // Original Vertex:      Vertex from incoming glTF vertex buffer
    // Unique Vertex:        Vertex with unique position, to be used for the Blockbench mesh result
    // Vertex Index/Indices: Index of a vertex, either from the vertex buffer, or in the unique vertices list
    // Unique Vertex Key:    The string key that Blockbench came up with for a *unique* vertex

    // Unique vertex positions
    let uniqueVertices: ArrayVector3[] = [];
    // Hash map of position to index into uniqueVertices
    // i.e. uniqueVertexIndices.get([x,y,z]) -> index into uniqueVertices
    let uniqueVertexIndices = new VectorHashMap<ArrayVector3, number>();
    // Lookup of primitive's original vertex index to index into uniqueVertices
    // i.e. primitiveToUniqueVertexIndices[primitiveIndex][vertexIndex] -> index into uniqueVertices
    let primitiveToUniqueVertexIndices: number[][] = [];

    // TODO: also de-duplicate on vertex weights! Probably make the key [x,y,z, bone0,... weight0...]

    // De-duplicate, scale and merge primitives
    for (let [primitive, primitiveIndex] of valuesAndIndices(primitives)) {
        primitiveToUniqueVertexIndices[primitiveIndex] = [];

        for (let vertexIndex = 0; vertexIndex < primitive.geometry.attributes.position.count; vertexIndex++ ) {
            let x = primitive.geometry.attributes.position.array[vertexIndex*3];
            let y = primitive.geometry.attributes.position.array[vertexIndex*3 + 1];
            let z = primitive.geometry.attributes.position.array[vertexIndex*3 + 2];

            // Apply scale
            let vertex: ArrayVector3 = [
                x * scale.x,
                y * scale.y,
                z * scale.z,
            ];

            // If this is a new position, add it to unique vertices
            if (!uniqueVertexIndices.has(vertex)) {
                let newUniqueVertexIndex = uniqueVertices.push(vertex) - 1;
                uniqueVertexIndices.set(vertex, newUniqueVertexIndex);
            }

            // Remember the unique vertex index for the original vertex index into this primitive
            primitiveToUniqueVertexIndices[primitiveIndex].push(uniqueVertexIndices.get(vertex)!);
        }
    }

    // Blockbench seems to like to reorder vertices randomly if we give it vertices with Mesh.addVertices()
    // So we create vertex keys and add them ourselves
    let vertexKeys = Array.from({ length: uniqueVertices.length }, () => bbuid(4));
    mesh.vertices = Object.fromEntries(uniqueVertices.map((v,i) => [vertexKeys[i], v]));
    let faces: MeshFace[] = [];

    // TODO: auto uv if not present somehow?
    
    // Construct faces by using the primitive's original vertex index to look up UV and unique vertex key
    for (let [primitive, primitiveIndex] of valuesAndIndices(primitives)) {
        if (primitive.geometry.index == undefined)
            continue; // I guess indices are optional? seems weird

        for (let faceIndex = 0; faceIndex < primitive.geometry.index.count/3; faceIndex++ ) {
            let texture = primitiveTextures[primitiveIndex];
            let uvWidth  = texture?.uv_width  ?? Project?.texture_width  ?? 16;
            let uvHeight = texture?.uv_height ?? Project?.texture_height ?? 16;
            let v1Uv: ArrayVector2, v2Uv: ArrayVector2, v3Uv: ArrayVector2;
            
            // Original vertex index
            let v1Idx = primitive.geometry.index.array[faceIndex*3];
            let v2Idx = primitive.geometry.index.array[faceIndex*3 + 1];
            let v3Idx = primitive.geometry.index.array[faceIndex*3 + 2];
            // Unique vertex keys
            let v1Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v1Idx]];
            let v2Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v2Idx]];
            let v3Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v3Idx]];
            let faceVertexKeys = [v1Key, v2Key, v3Key]

            // UV (optional apparently)
            if (primitive.geometry.attributes.uv != undefined) {
                let uvComponents = primitive.geometry.attributes.uv.array;
                v1Uv = [ uvComponents[v1Idx*2] , uvComponents[v1Idx*2 + 1] ];
                v2Uv = [ uvComponents[v2Idx*2] , uvComponents[v2Idx*2 + 1] ];
                v3Uv = [ uvComponents[v3Idx*2] , uvComponents[v3Idx*2 + 1] ];
            } else {
                // TODO: this currently doesn't allow for merging into quad
                // maybe fill missing uvs after creating primitive
                // then the quads are already created
                // or find Blockbench auto uv function
                v1Uv = [0,0];
                v2Uv = [1,0];
                v3Uv = [0,1];
            }
            let v1UvScaled: ArrayVector2 = [ v1Uv[0] * uvWidth, v1Uv[1] * uvHeight ];
            let v2UvScaled: ArrayVector2 = [ v2Uv[0] * uvWidth, v2Uv[1] * uvHeight ];
            let v3UvScaled: ArrayVector2 = [ v3Uv[0] * uvWidth, v3Uv[1] * uvHeight ];
            let uv = {
                [v1Key]: v1UvScaled,
                [v2Key]: v2UvScaled,
                [v3Key]: v3UvScaled,
            };

            // Remember whether any UV component is outside 0..1
            content.uvOutOfBounds ||= [ ...v1Uv, ...v2Uv, ...v3Uv ].some(x => x < 0 || x > 1);

            // TODO: Improvement for quad merging:
            // Currently we only merge quads of subsequent faces.
            // We could allow non-subsequent faces by having a map of
            // vertex keys to faces that use that vertex key.
            // Then for any triangle, we look up all the faces that use any of its vertices
            // to get a set of candidate triangles for merging into a quad

            // TODO: the option to merge quads is currently commented out in the import form
            // Try merging into quad with previous face
            let facesMergedIntoQuad = options.mergeQuads && (() => {
                if (faces.length < 1)
                    return false; // Can't be first face
                
                let lastFace = faces[faces.length - 1];
                if (lastFace.vertices.length !== 3)
                    return false; // Previous face must be a tri
                // because Blockbench doesn't support n-gons

                let nonSharedVertexKeys: string[] = [];
                let sharedVertexKeys: string[] = [];
                for (let vertKey of lastFace.vertices)
                    (faceVertexKeys.includes(vertKey) ? sharedVertexKeys : nonSharedVertexKeys).push(vertKey);

                if (sharedVertexKeys.length !== 2 || nonSharedVertexKeys.length !== 1)
                    return false; // Faces must share exactly 2 vertices

                if (sharedVertexKeys.some(vk => !arrayEquals(uv[vk], lastFace.uv[vk])))
                    return false; // UVs of shared vertices must be identical

                let face1VertAafterB = (   faceVertexKeys.indexOf(sharedVertexKeys[0]) + 1) % 3 ===    faceVertexKeys.indexOf(sharedVertexKeys[1]);
                let face2VertAafterB = (lastFace.vertices.indexOf(sharedVertexKeys[0]) + 1) % 3 === lastFace.vertices.indexOf(sharedVertexKeys[1]);
                if (face1VertAafterB === face2VertAafterB)
                    return false; // The order of the shared vertices should be reversed
                
                let newVertexKey = nonSharedVertexKeys[0];

                // TODO:
                // Validate normals are (roughly) the same (coplanar)
                // by finding the first face's normal and projecting the new vertex onto it (dot product)
                // If the resulting projected length is greater than 0, the two faces are not coplanar

                // TODO: consider checking rough shape, could eliminate n-gon fans
                // TODO: if a third triangle in a row is connect, maybe consider it an n-gon fan and dont merge?

                // Find where in the last face to insert the new vertex
                let face2VertBeforeNewVert = faceVertexKeys[modulo(faceVertexKeys.indexOf(newVertexKey) - 1, 3)];
                let face1VertBeforeNewVertIndex = lastFace.vertices.indexOf(face2VertBeforeNewVert);

                // Expand previous face into quad
                lastFace.vertices.splice(face1VertBeforeNewVertIndex, 0, newVertexKey);
                lastFace.uv[newVertexKey] = uv[newVertexKey];

                return true;
            })();

            // If not quad, create new face
            if (!facesMergedIntoQuad) {
                faces.push(new MeshFace(mesh, {
                    vertices: faceVertexKeys,
                    uv: uv,
                    texture: texture,
                }));
            }
        }
    }

    mesh.addFaces(...faces);
    mesh.init();

    return mesh;
}

// MARK: 🟥 textures
async function prepareTextureCacheKeys(gltf: GLTF): Promise<{[textureId: string]: string}> {
    
    // The GLTF loader's internal texture cache holds information 
    // on texture's sources inside the cache keys
    // We extract these keys so we can later use it to load the textures ourselves
    let textureCache = (gltf.parser as any).textureCache as {[textureCacheKey: string]: Promise<THREE.Texture>};

    // Await all the texture promises
    let textures = await Promise.all(Object.values(textureCache));
    
    // Strip suffix (probably the sampler index or something, don't care)
    let cacheKeys = Object.keys(textureCache).map(key => key.substring(0, key.lastIndexOf(':')));

    let textureCacheKeys = Object.fromEntries(cacheKeys.map((key, i) => [textures[i].uuid, key]));
    return textureCacheKeys;
}

function importTexture(threeMaterial: THREE.MeshStandardMaterial|undefined, options: ImportOptions, content: ImportedContent): Texture|undefined {
    let threeTexture = threeMaterial?.map;

    // No texture
    if (threeTexture == undefined)
        return undefined;

    // Already imported
    if (content.texturesById[threeTexture.uuid] !== undefined) {
        let bbTexture = content.texturesById[threeTexture.uuid] ?? undefined;
        // Make double-sided if necesary
        if (threeMaterial?.side !== THREE.FrontSide && bbTexture != undefined)
            bbTexture.render_sides = 'double';
        return bbTexture;
    }

    let cacheKey = content.textureCacheKeys[threeTexture.uuid];
    let bbTexture: Texture|null = null;

    // No cache key means no texture
    if (cacheKey == undefined) {

    // If the cache key is a number, that means the texture is embedded in a buffer
    } else if (isStringNumber(cacheKey)) {
        if (!(threeTexture.image instanceof ImageBitmap)) {
            console.warn('Imported texture has unknown format: ', threeTexture.image);
        } else {
            let dataUri = imageBitmapToDataUri(threeTexture.image, 'image/png', 1);
            bbTexture = new Texture().fromDataURL(dataUri);
        }

    // Embededd data uri
    } else if (cacheKey.startsWith('data:')) {
        bbTexture = new Texture().fromDataURL(cacheKey);

    // Otherwise the texture is from a file
    } else {
        let absoluteTexturePath = PathModule.join(PathModule.dirname(options.file.path), cacheKey);
        bbTexture = new Texture().fromPath(absoluteTexturePath);
    }
    // TODO: are we sure it cant still be some other stupid thing?

    if (bbTexture != undefined) {
        bbTexture.name = threeTexture.name || 'texture',
        bbTexture.add(false);
        content.textures.push(bbTexture);

        // Make double-sided if necesary
        if (threeMaterial?.side !== THREE.FrontSide && bbTexture != undefined)
            bbTexture.render_sides = 'double';
    }

    content.texturesById[threeTexture.uuid] = bbTexture;

    return bbTexture ?? undefined;
}
