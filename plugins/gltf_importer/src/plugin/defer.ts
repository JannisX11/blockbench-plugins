let deferred: (()=>void)[] = [];

// Runs a lambda when the plugin is unloaded
export function defer(lambda: ()=>void) {
    deferred.push(lambda);
}

// Deletes a Deletable when the plugin is unloaded
export function deferDelete<T extends Deletable>(deletable: T): T {
    defer(() => deletable.delete());
    return deletable;
}

// Call this when the plugin is unloaded
export function runDeferred() {
    for (let lambda of deferred.reverse())
        lambda();
}

// Removes a HTML element once the plugin is unloaded
export function deferRemoveElement(element: HTMLElement): HTMLElement {
    defer(() => element.parentElement?.removeChild(element));
    return element;
}
