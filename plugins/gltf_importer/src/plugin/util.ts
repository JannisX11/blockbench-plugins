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
    let canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
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

export function eulerDegreesFromQuat(quat: THREE.Quaternion): THREE.Vector3 {
    return new THREE.Euler().setFromQuaternion(quat).toVector3().multiplyScalar(180/Math.PI);
}
