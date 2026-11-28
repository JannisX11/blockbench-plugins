/**
 * The open project as a JSON object.
 *
 * Blockbench 5 returns Codecs.project.compile() as a JSON string; 3.4.0 used it
 * as an object, so the validation panel, export dialogs and spec check saw no
 * "elements" and reported an unknown format.
 */
export function parseCompiled(compiled: unknown): Record<string, unknown> | null {
    if (typeof compiled === 'string') {
        try {
            return JSON.parse(compiled);
        } catch {
            return null;
        }
    }
    return (compiled && typeof compiled === 'object') ? compiled as Record<string, unknown> : null;
}
