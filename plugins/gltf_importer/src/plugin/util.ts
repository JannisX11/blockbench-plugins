export function isPluginInstalled(pluginId: string): boolean {
    return Plugins.installed.some(p => p.id === pluginId && p.disabled !== true);
}

export function showPlugin(pluginId: string) {
    Plugins.dialog.component.data.selected_plugin = Plugins.all.find(p => p.id === pluginId);
    Plugins.dialog.show();
}

export function valuesAndIndices<T>(array: T[]): [T, number][] {
    return array.map((v, i) => [v, i] as [T, number]);
}

export function imageBitmapToDataUri(imageBitmap: ImageBitmap, type = 'image/png', quality?: number): string {
    let canvas = document.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    let ctx = canvas.getContext('2d');
    if (ctx == undefined)
        throw new Error('Failed to get 2D context');
    ctx.drawImage(imageBitmap, 0, 0);

    return canvas.toDataURL(type, quality);
}

export function arrayEquals(a: any[], b: any[]): boolean {
    return !a.some((v, i) => b[i] !== v);
}

// Actual proper modulo, not the fake % remainder bs
// Allows negative values of 'a' to wrap correctly
export function modulo(a: number, b: number): number {
    return ((a % b) + b) % b;
}

export function eulerDegreesFromQuat(quat: THREE.Quaternion, order: THREE.EulerOrder = 'XYZ'): THREE.Vector3 {
    const THREE = (window as any).THREE;
    const euler = new THREE.Euler().setFromQuaternion(quat, order);
    const degrees = new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI);
    console.log(`[gltf_importer]: Quaternion: (${quat.x.toFixed(4)}, ${quat.y.toFixed(4)}, ${quat.z.toFixed(4)}, ${quat.w.toFixed(4)}) -> Euler (${order}): (${degrees.x.toFixed(4)}, ${degrees.y.toFixed(4)}, ${degrees.z.toFixed(4)})`);
    return degrees;
}
