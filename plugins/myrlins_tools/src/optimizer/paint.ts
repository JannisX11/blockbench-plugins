/**
 * Paint check for Optimize Boxes.
 *
 * Merging two boxes keeps the first box's face UVs. That only looks the same
 * when every face of both boxes shows one flat color, the same color face by
 * face, and (because Hytale maps a face from its UV corner at a fixed pixel
 * density) the texture still shows that color over the merged face's area.
 * Anything else (a painted model, where each box has its own painted area)
 * would move or stretch the paint, so such boxes are left alone.
 *
 * Pixel reads are cached per texture for one optimizer run (clearPaintCache).
 */

export const FACE_KEYS = ['north', 'south', 'east', 'west', 'up', 'down'];

/** Per-face paint of a box: 'none' (no texture), a '#rrggbbaa' flat color, or 'mixed' */
export type FacePaint = string;

export interface CubePaint {
    /** True when at least one face carries a texture */
    painted: boolean;
    /** True when every textured face is one flat color (safe to consider for a merge) */
    flat: boolean;
    faces: Record<string, FacePaint>;
}

interface TexturePixels {
    width: number;
    height: number;
    /** UV units per texture pixel conversion (texture px / uv units) */
    scaleX: number;
    scaleY: number;
    data: Uint8ClampedArray | null;
}

const textureCache = new Map<any, TexturePixels | null>();
const cubePaintCache = new Map<any, CubePaint>();

/** Drop cached pixels and paint (call at the start and end of each run). */
export function clearPaintCache(): void {
    textureCache.clear();
    cubePaintCache.clear();
}

function faceTexture(face: any): any | null {
    // null: the face is off (no texture). false: the default texture, which is how
    // Hytale's single-texture formats paint every face, so ask getTexture()
    if (!face || face.texture === null || face.texture === undefined) return null;
    try {
        if (typeof face.getTexture === 'function') {
            const t = face.getTexture();
            if (t) return t;
        }
    } catch {
        // fall through to the uuid lookup
    }
    if (face.texture === false) {
        // Older Blockbench without getTexture(): the default texture, else the only one
        // @ts-ignore - Texture is a global from Blockbench
        if (typeof Texture !== 'undefined' && Texture.all) {
            // @ts-ignore
            return Texture.all.find((t: any) => t.use_as_default) || (Texture.all.length === 1 ? Texture.all[0] : null);
        }
        return null;
    }
    // @ts-ignore - Texture is a global from Blockbench
    if (typeof Texture !== 'undefined' && Texture.all) {
        // @ts-ignore
        return Texture.all.find((t: any) => t.uuid === face.texture) || null;
    }
    return null;
}

function readTexture(texture: any): TexturePixels | null {
    if (textureCache.has(texture)) return textureCache.get(texture) || null;
    let result: TexturePixels | null = null;
    try {
        const width = texture.width || (texture.img && texture.img.naturalWidth) || 0;
        const height = texture.height || (texture.img && texture.img.naturalHeight) || 0;
        // @ts-ignore - Project is a global from Blockbench
        const projectUvW = (typeof Project !== 'undefined' && Project && Project.texture_width) || width;
        // @ts-ignore
        const projectUvH = (typeof Project !== 'undefined' && Project && Project.texture_height) || height;
        const uvW = texture.uv_width || projectUvW || width;
        const uvH = texture.uv_height || projectUvH || height;
        let data: Uint8ClampedArray | null = null;
        if (typeof texture.getPixels === 'function') {
            // Test and future hook: a texture that hands over its RGBA pixels directly
            data = texture.getPixels();
        } else if (width > 0 && height > 0 && typeof document !== 'undefined') {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            const source = texture.canvas && texture.canvas.width ? texture.canvas : texture.img;
            if (ctx && source) {
                ctx.drawImage(source, 0, 0, width, height);
                data = ctx.getImageData(0, 0, width, height).data;
            }
        }
        if (data && width > 0 && height > 0) {
            result = { width, height, scaleX: width / uvW, scaleY: height / uvH, data };
        }
    } catch (e) {
        // A tainted or unloaded texture: treat its paint as unknown (never merged)
        console.warn("[Myrlin's Tools] Could not read texture pixels for the paint check:", e);
        result = null;
    }
    textureCache.set(texture, result);
    return result;
}

/**
 * The single color of a UV rectangle, or 'mixed' when it has more than one
 * color or cannot be read. Coordinates are in UV units.
 */
function rectColor(pixels: TexturePixels, u0: number, v0: number, u1: number, v1: number): FacePaint {
    const x0 = Math.floor(Math.min(u0, u1) * pixels.scaleX + 1e-6);
    const x1 = Math.ceil(Math.max(u0, u1) * pixels.scaleX - 1e-6);
    const y0 = Math.floor(Math.min(v0, v1) * pixels.scaleY + 1e-6);
    const y1 = Math.ceil(Math.max(v0, v1) * pixels.scaleY - 1e-6);
    if (x0 < 0 || y0 < 0 || x1 > pixels.width || y1 > pixels.height) return 'mixed';
    if (x1 <= x0 || y1 <= y0 || !pixels.data) return 'mixed';
    const data = pixels.data;
    let first = -1;
    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            const i = (y * pixels.width + x) * 4;
            // Fully transparent pixels are all the same, whatever their RGB
            const value = data[i + 3] === 0 ? 0 : ((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3]) >>> 0;
            if (first === -1) first = value;
            else if (value !== first) return 'mixed';
        }
    }
    return '#' + (first >>> 0).toString(16).padStart(8, '0');
}

/** The paint of one box (cached for the run). */
export function getCubePaint(cube: any): CubePaint {
    const cached = cubePaintCache.get(cube);
    if (cached) return cached;
    const faces: Record<string, FacePaint> = {};
    let painted = false;
    let flat = true;
    for (const key of FACE_KEYS) {
        const face = cube.faces ? cube.faces[key] : null;
        const texture = faceTexture(face);
        if (!texture) {
            faces[key] = 'none';
            continue;
        }
        painted = true;
        const pixels = readTexture(texture);
        const uv = face.uv || [0, 0, 0, 0];
        const color = pixels ? rectColor(pixels, uv[0], uv[1], uv[2], uv[3]) : 'mixed';
        faces[key] = color;
        if (color === 'mixed') flat = false;
    }
    const result = { painted, flat, faces };
    cubePaintCache.set(cube, result);
    return result;
}

/** True when two boxes show the same paint face by face (both unpainted, or the same flat colors). */
export function samePaint(a: any, b: any): boolean {
    const pa = getCubePaint(a);
    const pb = getCubePaint(b);
    if (!pa.flat || !pb.flat) return false;
    for (const key of FACE_KEYS) {
        if (pa.faces[key] !== pb.faces[key]) return false;
    }
    return true;
}

// Which model axes a face's U and V run along (before UV rotation)
const FACE_AXES: Record<string, [number, number]> = {
    north: [0, 1], south: [0, 1],
    east: [2, 1], west: [2, 1],
    up: [0, 2], down: [0, 2],
};

/**
 * True when the first box's flat face colors still cover the merged box.
 *
 * keepCube is the real box whose UVs the merged box keeps; origFrom/origTo
 * are its size before this run; mergedFrom/mergedTo the size after the merge.
 * For each painted face that grows, the UV rectangle is widened by the growth
 * on both sides (conservative: covers either anchor Hytale may use) and must
 * still be the same single color.
 */
export function paintCoversMerge(keepCube: any, origFrom: number[], origTo: number[],
                                 mergedFrom: number[], mergedTo: number[]): boolean {
    const paint = getCubePaint(keepCube);
    if (!paint.painted) return true;
    if (!paint.flat) return false;
    for (const key of FACE_KEYS) {
        const color = paint.faces[key];
        if (color === 'none') continue;
        const face = keepCube.faces[key];
        const texture = faceTexture(face);
        const pixels = texture ? readTexture(texture) : null;
        if (!pixels) return false;
        const uv = face.uv || [0, 0, 0, 0];
        let [axisU, axisV] = FACE_AXES[key];
        const rot = ((face.rotation || 0) % 360 + 360) % 360;
        if (rot === 90 || rot === 270) [axisU, axisV] = [axisV, axisU];
        const uvW = Math.abs(uv[2] - uv[0]);
        const uvH = Math.abs(uv[3] - uv[1]);
        const origU = Math.abs(origTo[axisU] - origFrom[axisU]);
        const origV = Math.abs(origTo[axisV] - origFrom[axisV]);
        const newU = Math.abs(mergedTo[axisU] - mergedFrom[axisU]);
        const newV = Math.abs(mergedTo[axisV] - mergedFrom[axisV]);
        // UV units per model unit on each face axis (Hytale: fixed pixel density)
        const ratioU = origU > 0 ? uvW / origU : 0;
        const ratioV = origV > 0 ? uvH / origV : 0;
        const growU = Math.max(0, (newU - origU) * ratioU);
        const growV = Math.max(0, (newV - origV) * ratioV);
        if (growU === 0 && growV === 0) continue;
        const u0 = Math.min(uv[0], uv[2]) - growU;
        const u1 = Math.max(uv[0], uv[2]) + growU;
        const v0 = Math.min(uv[1], uv[3]) - growV;
        const v1 = Math.max(uv[1], uv[3]) + growV;
        if (rectColor(pixels, u0, v0, u1, v1) !== color) return false;
    }
    return true;
}
