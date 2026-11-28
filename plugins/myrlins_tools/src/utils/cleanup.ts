/**
 * Cleanup utility for tracking and disposing plugin resources.
 *
 * Three cleanup patterns:
 * - Deletable: Objects with a delete() method (Blockbench Actions, Panels, etc.)
 * - EventCleanup: Event listeners with exact function references for removal
 * - CSSCleanup: Style elements injected into the DOM
 */

interface Deletable {
    delete(): void;
}

/** Tracked event listener for deterministic removal */
interface EventCleanup {
    target: EventTarget;
    event: string;
    handler: EventListener;
}

const trackedItems: Deletable[] = [];
const trackedEvents: EventCleanup[] = [];
const trackedStyles: HTMLStyleElement[] = [];

/**
 * Track a deletable object for cleanup on plugin unload.
 *
 * @param item - Any object with a delete() method
 * @returns The same item, for chaining
 */
export function track<T extends Deletable>(item: T): T {
    trackedItems.push(item);
    return item;
}

/**
 * Track an event listener for cleanup. Adds the listener and records it.
 *
 * @param target - The EventTarget to attach the listener to
 * @param event - The event name (e.g. 'click', 'resize')
 * @param handler - The event handler function
 * @returns The handler function, for reference
 */
export function trackEvent(target: EventTarget, event: string, handler: EventListener): EventListener {
    target.addEventListener(event, handler);
    trackedEvents.push({ target, event, handler });
    return handler;
}

/**
 * Track a CSS style element for cleanup. Creates and appends it to document head.
 *
 * @param css - The CSS text content to inject
 * @returns The created HTMLStyleElement
 */
export function trackStyle(css: string): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    trackedStyles.push(style);
    return style;
}

/**
 * Remove all tracked resources: deletables, event listeners, and CSS styles.
 * Called on plugin unload. Catches and logs individual cleanup failures.
 */
export function cleanup(): void {
    // Clean deletables
    for (const item of trackedItems) {
        try {
            item.delete();
        } catch (e) {
            console.warn('[Myrlin Tools] Failed to cleanup item:', e);
        }
    }
    trackedItems.length = 0;

    // Clean event listeners
    for (const { target, event, handler } of trackedEvents) {
        try {
            target.removeEventListener(event, handler);
        } catch (e) {
            console.warn('[Myrlin Tools] Failed to remove event listener:', e);
        }
    }
    trackedEvents.length = 0;

    // Clean CSS styles
    for (const style of trackedStyles) {
        try {
            style.remove();
        } catch (e) {
            console.warn('[Myrlin Tools] Failed to remove style:', e);
        }
    }
    trackedStyles.length = 0;
}
