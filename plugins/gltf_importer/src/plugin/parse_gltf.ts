// Import ONLY the types
import type {GLTF as _GLTF, GLTFLoader as _GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import the actual loader, unless something else already did
if (THREE['GLTFLoader'] == undefined)
    require('./GLTFLoader.js');

type GLTFLoaderConstructor = { new (loadingManager: THREE.LoadingManager|undefined): GLTFLoader; };

export type GLTFLoader = _GLTFLoader;
export type GLTF = _GLTF;

export async function parseGltf(file: Filesystem.FileResult): Promise<GLTF> {
    
    let loadingManager = new THREE.LoadingManager();
    let gltfLoader = createGltfLoader(loadingManager);
    return await parseGltfWithLoader(gltfLoader, file);
}

export function createGltfLoader(loadingManager: THREE.LoadingManager|undefined = undefined): GLTFLoader {
    let _GLTFLoaderClass = THREE['GLTFLoader'] as GLTFLoaderConstructor;
    return new _GLTFLoaderClass(loadingManager);
}

export function parseGltfWithLoader(loader: _GLTFLoader, file: Filesystem.FileResult): Promise<GLTF> {
    return new Promise((resolve, reject) =>
        loader.parse(file.content!, PathModule.dirname(file.path) + PathModule.sep, resolve, reject));
}
