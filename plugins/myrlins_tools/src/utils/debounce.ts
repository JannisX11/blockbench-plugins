/**
 * Debounce utility - delays function execution until after wait period
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    ms: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
            timeout = null;
        }, ms);
    };
}
