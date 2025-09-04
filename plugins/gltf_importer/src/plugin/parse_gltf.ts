// Import ONLY the types
import type { GLTFLoader as _GLTFLoader, GLTF as _GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import the actual loader, unless something else already did
if (THREE['GLTFLoader'] == undefined)
    require('./GLTFLoader.js');

type GLTFLoaderConstructor = { new (loadingManager: THREE.LoadingManager|undefined): GLTFLoader; };

export type GLTFLoader = _GLTFLoader;
export type GLTF = _GLTF;

export async function parseGltf(file: Filesystem.FileResult): Promise<GLTF> {
    
    let loadingManager = new THREE.LoadingManager();
    fixStupidRelativePathBug(loadingManager, file);

    let gltfLoader = createGltfLoader(loadingManager);

    let gltf = await parseGltfWithLoader(gltfLoader, file);

    return gltf;
}

export function createGltfLoader(loadingManager: THREE.LoadingManager|undefined = undefined): GLTFLoader {
    let _GLTFLoaderClass = THREE['GLTFLoader'] as GLTFLoaderConstructor;
    let loader = new _GLTFLoaderClass(loadingManager);
    return loader;
}

export function parseGltfWithLoader(loader: _GLTFLoader, file: Filesystem.FileResult): Promise<GLTF> {
    return new Promise((resolve, reject) =>
        loader.parse(file.content, PathModule.dirname(file.path), resolve, reject));
}

export function fixStupidRelativePathBug(loadingManager: THREE.LoadingManager, file: Filesystem.FileResult) {
    // GLTFLoader is an idiot and forgets to add the path seperator after the parent directory
    // when a referenced file's relative path doesn't start with ./
    // We detect when it makes this mistake and fix it
    loadingManager.setURLModifier((url) => {
        let basePathWithoutSep = PathModule.dirname(file.path);
        let basePathWithSlash = basePathWithoutSep + PathModule.sep;
        // HACK: we don't need to do startsWith twice here if we look at char indices
        if (url.startsWith(basePathWithoutSep) && !url.startsWith(basePathWithSlash))
            return url.replace(basePathWithoutSep, basePathWithSlash);
        return url;
    });
}
