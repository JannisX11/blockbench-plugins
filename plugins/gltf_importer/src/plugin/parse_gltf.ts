// Import ONLY the types
import type { GLTFLoader as _GLTFLoader, GLTF as _GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import the actual loader, unless something else already did
if (THREE['GLTFLoader'] == undefined)
    require('./GLTFLoader.js');

type GLTFLoaderConstructor = { new (loadingManager: THREE.LoadingManager|undefined): _GLTFLoader; };

export type GLTFLOoader = _GLTFLoader;
export type GLTF = _GLTF;

export function createGltfLoader(loadingManager: THREE.LoadingManager|undefined = undefined): _GLTFLoader {
    let _GLTFLoader = THREE['GLTFLoader'] as GLTFLoaderConstructor;
    let loader = new _GLTFLoader(loadingManager);
    return loader;
}

export function parseGltf(loader: _GLTFLoader, file: Filesystem.FileResult): Promise<GLTF> {
    return new Promise((resolve, reject) =>
        loader.parse(file.content, PathModule.dirname(file.path), resolve, reject));
}

// TODO: delete this
export function spyGltfTextures(manager: THREE.LoadingManager): {[textureId: string]: string } {
    let trackedTextureLoader = new TrackedTextureLoader(manager);
    return trackedTextureLoader.textureUrls;
}

class TrackedTextureLoader extends THREE.TextureLoader {
    public textureUrls: { [textureId: string]: string } = {};

    load(
        url: string,
        onLoad?:     (texture: THREE.Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?:    (event: ErrorEvent) => void
    ): THREE.Texture {
        console.log('aaaa', url);  // TODO:
        return super.load(
            url,
            (texture) => {
                console.log('texture!', texture, url) // TODO:
                this.textureUrls[texture.uuid] = url;
                onLoad?.(texture);
            },
            onProgress,
            onError
        );
    }

    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<THREE.Texture> {
        console.log('bbbbbb', url) // TODO:
        return super.loadAsync(url, onProgress);
    }
}
