import { GLTF, parseGltf } from './parse_gltf';
import { imageBitmapToDataUri, valuesAndIndices } from './util';
import { VectorHashMap } from './vector_hash_map';

export type ImportOptions = {
    file: Filesystem.FileResult,
    scale:      number,
    groups:     boolean,
    cameras:    boolean,
    animations: boolean,
};

export type ImportedContent = {
    // Used for undo system
    groups:     Group[],
    elements:   OutlinerElement[],
    textures:   Texture[],
    animations: BBAnimation[],
    // Used for displaying warnings to the user
    uvOutOfBounds:         boolean,
    usesRepeatingWrapMode: boolean,
    unsupportedArmatures:  boolean,
    // To keep track of which THREE texture corresponds to which Blockbench texture
    texturesById: {[textureId: string]: Texture};
};

// MARK: 🟥 gltf
export async function importGltf(options: ImportOptions): Promise<ImportedContent> {

    // TODO: cameras!
    // TODO: animations!
    // TODO: armatures!

    console.log('options', options); // TODO: remove

    let gltf = await parseGltf(options.file);

    let sceneRoot = gltf.scene as unknown as THREE.Group;

    console.log('gltf', gltf); // TODO: remove

    let rootGroup = Outliner.root.find(n => n instanceof Group); // TODO: doesn't always work
    // keep track of all the things we imported for the undo system
    let content: ImportedContent = {
        groups:     [],
        elements:   [],
        textures:   [],
        animations: [],
        uvOutOfBounds:         false,
        usesRepeatingWrapMode: false,
        unsupportedArmatures:  false,
        texturesById: {},
    };
    Undo.initEdit({
        outliner: true,
        selection: true,
        group: rootGroup,
        elements: content.elements,
        textures: content.textures,
        animations: content.animations,
    });

    await importTextures(gltf, options, content);

    importNode(sceneRoot, options, content);

    // Check if any samplers use the repeating wrap mode
    content.usesRepeatingWrapMode = gltf.parser.json.samplers.some((s: any) =>
        s.wrapS == undefined || s.wrapT == undefined || s.wrapS === 10497 || s.wrapT === 10497 );

    // TODO: Select all the elements we imported

    console.log('content', content); // TODO: remove

    Undo.finishEdit('Import glTF');
    console.log(`Imported glTF with ${content.groups.length} groups, ${content.elements.length} elements, ${content.textures.length} textures and ${content.animations.length} animations.`);

    return content;
}

// MARK: 🟥 textures
async function importTextures(gltf: GLTF, options: ImportOptions, content: ImportedContent): Promise<void> {

    // TODO: imports textures that aren't used by blockbench like normal maps, probably go back to lazy way it was done before

    // The GLTF loader's internal texture cache holds information 
    // on texture's sources inside the cache keys
    // We extract these keys so we can later use it to load the textures ourselves
    let textureCache = (gltf.parser as any).textureCache as {[textureCacheKey: string]: Promise<THREE.Texture>};

    for (let [cacheKey, threeTexturePromise] of Object.entries(textureCache)) {
        let bbTexture = new Texture();
        let threeTexture = await threeTexturePromise;
        // Strip suffix (probably the sampler or something, don't care)
        let cacheKeySource = cacheKey.substring(0, cacheKey.indexOf(':'));

        // If the cache key is a number, that means the texture is embedded
        if (isStringNumber(cacheKeySource)) {
            if (!(threeTexture.image instanceof ImageBitmap)) {
                console.warn('Imported texture has unknown format: ', threeTexture.image);
                bbTexture.remove();
                return;
            }
            let dataUri = await imageBitmapToDataUri(threeTexture.image, 'image/png', 1);
            bbTexture.fromDataURL(dataUri);

        // Embededd data uri
        } else if (cacheKeySource.startsWith('data:')) {
            bbTexture.fromDataURL(cacheKeySource);

        // Otherwise the texture is from a file
        } else {
            let absoluteTexturePath = PathModule.join(PathModule.dirname(options.file.path), cacheKeySource);
            bbTexture.fromPath(absoluteTexturePath);
        }

        bbTexture.add(false);
        content.texturesById[threeTexture.uuid] = bbTexture;
        content.textures.push(bbTexture);
    }
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
            name: node.name, // TODO: what if its empty? what if its duplicate?
            origin: node.getWorldPosition(new THREE.Vector3()).multiplyScalar(options.scale).toArray(),  // TODO: global position ignoring rotations
            rotation: node.rotation.toArray() as ArrayVector3,
            // TODO:
        }).init();
        content.groups.push(group);
        group.openUp();
    }

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
        name: node.name, // TODO: what if its empty? what if its duplicate?
        origin: node.getWorldPosition(new THREE.Vector3()).multiplyScalar(options.scale).toArray(), // TODO: global position ignoring rotations
        rotation: node.rotation.toArray() as ArrayVector3,
        vertices: {},
        // TODO:
    });
    content.elements.push(mesh);

    // Lookup of primitive to texture
    let primitiveTextures = primitives.map(p => content.texturesById[(p.material as any)?.map?.uuid]);

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

    // De-duplicate, scale and merge primitives
    for (let [primitive, primitiveIndex] of valuesAndIndices(primitives)) {
        primitiveToUniqueVertexIndices[primitiveIndex] = [];

        for (let vertexIndex = 0; vertexIndex < primitive.geometry.attributes.position.count; vertexIndex++ ) {
            let x = primitive.geometry.attributes.position.array[vertexIndex*3];
            let y = primitive.geometry.attributes.position.array[vertexIndex*3 + 1];
            let z = primitive.geometry.attributes.position.array[vertexIndex*3 + 2];

            // Apply scale
            x *= options.scale;
            y *= options.scale;
            z *= options.scale;

            let vertex: ArrayVector3 = [x, y, z];

            // If this is a new position, add it to unique vertices
            if (!uniqueVertexIndices.has(vertex)) {
                let newUniqueVertexIndex = uniqueVertices.push(vertex) - 1;
                uniqueVertexIndices.set(vertex, newUniqueVertexIndex);
            }

            // Remember the unique vertex index for the original vertex index into this primitive
            primitiveToUniqueVertexIndices[primitiveIndex].push(uniqueVertexIndices.get(vertex));
        }
    }

    // Blockbench seems to like to reorder vertices randomly if we give it vertices with Mesh.addVertices()
    // So we create vertex keys and add them ourselves
    let vertexKeys = Array.from({ length: uniqueVertices.length }, () => bbuid(4));
    mesh.vertices = Object.fromEntries(uniqueVertices.map((v,i) => [vertexKeys[i], v]));
    let faces: MeshFace[] = [];
    
    // Construct faces by using the primitive's original vertex index to look up UV and unique vertex key
    for (let [primitive, primitiveIndex] of valuesAndIndices(primitives)) {
        for (let faceIndex = 0; faceIndex < primitive.geometry.index.count; faceIndex++ ) {
            let texture = primitiveTextures[primitiveIndex];
            let uvWidth  = texture?.uv_width  ?? Project.texture_width;
            let uvHeight = texture?.uv_height ?? Project.texture_height;
            let uvComponents = primitive.geometry.attributes.uv.array;
            
            // Original vertex index
            let v1Idx = primitive.geometry.index.array[faceIndex*3];
            let v2Idx = primitive.geometry.index.array[faceIndex*3 + 1];
            let v3Idx = primitive.geometry.index.array[faceIndex*3 + 2];
            // UV
            let v1Uv = [ uvComponents[v1Idx*2] , uvComponents[v1Idx*2 + 1] ];
            let v2Uv = [ uvComponents[v2Idx*2] , uvComponents[v2Idx*2 + 1] ];
            let v3Uv = [ uvComponents[v3Idx*2] , uvComponents[v3Idx*2 + 1] ];
            let v1UvScaled: ArrayVector2 = [ v1Uv[0] * uvWidth, v1Uv[1] * uvHeight ];
            let v2UvScaled: ArrayVector2 = [ v2Uv[0] * uvWidth, v2Uv[1] * uvHeight ];
            let v3UvScaled: ArrayVector2 = [ v3Uv[0] * uvWidth, v3Uv[1] * uvHeight ];
            // Unique vertex keys
            let v1Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v1Idx]];
            let v2Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v2Idx]];
            let v3Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v3Idx]];

            faces.push(new MeshFace(mesh, {
                vertices: [v1Key, v2Key, v3Key],
                uv: {
                    [v1Key]: v1UvScaled,
                    [v2Key]: v2UvScaled,
                    [v3Key]: v3UvScaled,
                },
                texture: texture,
            }));

            // If any UV component is outside 0..1, remember that
            content.uvOutOfBounds ||= [ ...v1Uv, ...v2Uv, ...v3Uv ].some(x => x < 0 || x > 1);
        }
    }

    mesh.addFaces(...faces);
    mesh.init();

    return mesh;
}
