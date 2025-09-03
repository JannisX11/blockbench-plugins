export function isPluginInstalled(pluginId: string): boolean {
    return Plugins.installed.some(p => p.id === pluginId);
}

export function showPlugin(pluginId: string) {
    Plugins.dialog.component.data.selected_plugin = Plugins.all.find(p => p.id === pluginId);
    Plugins.dialog.show();
}

export function valuesAndIndices<T>(array: T[]): [T, number][] {
    return array.map((v, i) => [v, i] as [T, number])
}