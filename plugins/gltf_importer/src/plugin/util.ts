export function isPluginInstalled(pluginId: string): boolean {
    return Plugins.installed.some(p => p.id === pluginId);
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
