const EPSILON = 1e-6;
const FACE_KEYS = ['north', 'east', 'south', 'west', 'up', 'down'];
const FACE_AXES = {
    north: [0, 1], south: [0, 1],
    east: [2, 1], west: [2, 1],
    up: [0, 2], down: [0, 2],
};
const AXIS_NAMES = ['x', 'y', 'z'];

function isInteger(n) {
    return Math.abs(n - Math.round(n)) < EPSILON;
}

function round6(n) {
    return Math.round(n * 1e6) / 1e6;
}

function cubeSize(from, to) {
    return [0, 1, 2].map(i => to[i] - from[i]);
}

function faceHasTexture(face, textures) {
    return !!(face && face.texture !== null && face.texture !== undefined && face.texture !== false && textures[face.texture]);
}

// Box UV layout
function boxFaceUVs(size, offset) {
    const [x, y, z] = size;
    const layout = {
        east: [[0, z], [z, y]],
        west: [[z + x, z], [z, y]],
        up: [[z + x, z], [-x, -z]],
        down: [[z + x * 2, 0], [-x, z]],
        south: [[z * 2 + x, z], [x, y]],
        north: [[z, z], [x, y]],
    };
    const uvs = {};
    for (const fkey of FACE_KEYS) {
        const [[fx, fy], [sx, sy]] = layout[fkey];
        uvs[fkey] = [
            fx + offset[0],
            fy + offset[1],
            fx + sx + offset[0],
            fy + sy + offset[1],
        ];
    }
    return uvs;
}

function boxNetSize(size) {
    const [x, y, z] = size;
    return { width: 2 * (x + z), height: z + y };
}

function boxNetCorners(size) {
    const [x, , z] = size;
    if (z <= 0) {
        return [];
    }
    return [
        { x: 0, y: 0, w: z, h: z },
        { x: z + 2 * x, y: 0, w: z, h: z },
    ];
}

// Face UV mapping
function rotatedCorners(rotation) {
    const arr = [[0, 0], [1, 0], [0, 1], [1, 1]];
    let rot = rotation || 0;
    while (rot > 0) {
        const a = arr[0];
        arr[0] = arr[2];
        arr[2] = arr[3];
        arr[3] = arr[1];
        arr[1] = a;
        rot -= 90;
    }
    return arr;
}

function faceLocalToUV(uv, rotation, s, t) {
    const [A, B, C] = rotatedCorners(rotation);
    const a = A[0] + s * (B[0] - A[0]) + t * (C[0] - A[0]);
    const b = A[1] + s * (B[1] - A[1]) + t * (C[1] - A[1]);
    return [uv[0] + a * (uv[2] - uv[0]), uv[1] + b * (uv[3] - uv[1])];
}

function faceTexelSize(face, texture) {
    const w = Math.abs(face.uv[2] - face.uv[0]) * texture.width / texture.uvWidth;
    const h = Math.abs(face.uv[3] - face.uv[1]) * texture.height / texture.uvHeight;
    const quarterTurns = Math.round((face.rotation || 0) / 90) % 2;
    return quarterTurns ? [h, w] : [w, h];
}

// Geometry changes
function detectInflate(cube, textures) {
    const size = cubeSize(cube.from, cube.to);
    if (size.some(n => n <= EPSILON)) {
        return 0;
    }
    const implied = [null, null, null];
    for (const fkey of FACE_KEYS) {
        const face = cube.faces[fkey];
        if (!faceHasTexture(face, textures)) {
            continue;
        }
        const tex = textures[face.texture];
        const texel = faceTexelSize(face, tex);
        const lengths = [texel[0] * tex.uvWidth / tex.width, texel[1] * tex.uvHeight / tex.height];
        for (let j = 0; j < 2; j++) {
            const axis = FACE_AXES[fkey][j];
            if (implied[axis] === null) {
                implied[axis] = lengths[j];
            } else if (Math.abs(implied[axis] - lengths[j]) > EPSILON) {
                return 0;
            }
        }
    }
    if (implied.some(n => n === null || n < 1 - EPSILON || !isInteger(n))) {
        return 0;
    }
    const deltas = size.map((n, i) => n - implied[i]);
    const t = deltas[0] / 2;
    if (t <= EPSILON) {
        return 0;
    }
    if (deltas.some(d => Math.abs(d / 2 - t) > EPSILON)) {
        return 0;
    }
    return round6(t);
}

function integerSizeFix(size) {
    const growth = size.map(n => (isInteger(n) ? Math.round(n) : Math.ceil(n)) - n);
    if (growth.every(g => g <= EPSILON)) {
        return { growth, inflate: 0, error: [0, 0, 0], rounded: false };
    }
    const flat = size.some(n => Math.abs(n) < EPSILON);
    let inflate = 0;
    if (!flat) {
        const significant = growth.map(g => (g <= EPSILON ? 0 : g));
        inflate = -(Math.min(...significant) + Math.max(...significant)) / 4;
    }
    const error = growth.map(g => round6(g + 2 * inflate));
    return { growth, inflate: round6(inflate), error, rounded: true };
}

function planGeometry(cubes, textures, options = {}) {
    return cubes.map(cube => {
        const from = cube.from.slice();
        const to = cube.to.slice();
        let inflate = cube.inflate || 0;
        const notes = [];

        if (options.useInflate !== false) {
            const t = detectInflate(cube, textures);
            if (t) {
                for (let i = 0; i < 3; i++) {
                    from[i] += t;
                    to[i] -= t;
                }
                inflate += t;
                notes.push({ type: 'inflate', amount: t });
            }
        }

        const fix = integerSizeFix(cubeSize(from, to));
        for (let i = 0; i < 3; i++) {
            from[i] -= fix.growth[i] / 2;
            to[i] += fix.growth[i] / 2;
        }
        if (fix.rounded) {
            inflate += fix.inflate;
            notes.push({
                type: 'rounded',
                original: cubeSize(cube.from, cube.to).map(round6),
                inflate: fix.inflate,
                error: fix.error,
            });
        }

        return {
            id: cube.id,
            name: cube.name,
            from: from.map(round6),
            to: to.map(round6),
            inflate: round6(inflate),
            size: cubeSize(from, to).map(n => Math.round(n)),
            notes,
        };
    });
}

// Packing
function rectContains(a, b) {
    return b.x >= a.x && b.y >= a.y && b.x + b.w <= a.x + a.w && b.y + b.h <= a.y + a.h;
}

function rectsIntersect(a, b) {
    return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

function packIntoBin(items, width, height) {
    let free = [{ x: 0, y: 0, w: width, h: height }];
    const placements = {};

    for (const item of items) {
        if (item.width <= 0 || item.height <= 0) {
            placements[item.id] = { x: 0, y: 0 };
            continue;
        }
        let best = null;
        for (const rect of free) {
            if (item.width > rect.w || item.height > rect.h) {
                continue;
            }
            const shortSide = Math.min(rect.w - item.width, rect.h - item.height);
            const longSide = Math.max(rect.w - item.width, rect.h - item.height);
            if (!best
                || shortSide < best.shortSide
                || (shortSide === best.shortSide && longSide < best.longSide)
                || (shortSide === best.shortSide && longSide === best.longSide
                    && (rect.y < best.y || (rect.y === best.y && rect.x < best.x)))) {
                best = { x: rect.x, y: rect.y, shortSide, longSide };
            }
        }
        if (!best) {
            return null;
        }
        const used = { x: best.x, y: best.y, w: item.width, h: item.height };
        placements[item.id] = { x: used.x, y: used.y };

        const next = [];
        for (const rect of free) {
            if (!rectsIntersect(rect, used)) {
                next.push(rect);
                continue;
            }
            if (used.x > rect.x) next.push({ x: rect.x, y: rect.y, w: used.x - rect.x, h: rect.h });
            if (used.x + used.w < rect.x + rect.w) {
                next.push({ x: used.x + used.w, y: rect.y, w: rect.x + rect.w - used.x - used.w, h: rect.h });
            }
            if (used.y > rect.y) next.push({ x: rect.x, y: rect.y, w: rect.w, h: used.y - rect.y });
            if (used.y + used.h < rect.y + rect.h) {
                next.push({ x: rect.x, y: used.y + used.h, w: rect.w, h: rect.y + rect.h - used.y - used.h });
            }
        }
        for (const corner of item.corners || []) {
            next.push({ x: used.x + corner.x, y: used.y + corner.y, w: corner.w, h: corner.h });
        }
        free = next.filter((rect, i) => !next.some((other, j) => (
            j !== i && rectContains(other, rect) && (!rectContains(rect, other) || j < i)
        )));
    }
    return placements;
}

function packNets(items, maxSize = 4096) {
    const sorted = items.slice().sort((a, b) => (b.height - a.height) || (b.width - a.width));
    const area = items.reduce((sum, item) => sum + item.width * item.height, 0);
    const maxW = Math.max(1, ...items.map(item => item.width));
    const maxH = Math.max(1, ...items.map(item => item.height));

    const sizes = [];
    for (let w = 16; w <= maxSize; w *= 2) {
        for (let h = 16; h <= maxSize; h *= 2) {
            if (w >= maxW && h >= maxH && w * h >= area) {
                sizes.push([w, h]);
            }
        }
    }
    sizes.sort((a, b) => (a[0] * a[1] - b[0] * b[1])
        || (Math.abs(Math.log2(a[0] / a[1])) - Math.abs(Math.log2(b[0] / b[1])))
        || (b[0] - a[0]));

    for (const [width, height] of sizes) {
        const placements = packIntoBin(sorted, width, height);
        if (placements) {
            return { width, height, placements };
        }
    }
    return null;
}

// Painting and verification
function forEachFacePixel(uv, density, callback) {
    const du = uv[2] - uv[0];
    const dv = uv[3] - uv[1];
    if (Math.abs(du) < EPSILON || Math.abs(dv) < EPSILON) {
        return;
    }
    const x0 = Math.round(Math.min(uv[0], uv[2]) * density);
    const x1 = Math.round(Math.max(uv[0], uv[2]) * density);
    const y0 = Math.round(Math.min(uv[1], uv[3]) * density);
    const y1 = Math.round(Math.max(uv[1], uv[3]) * density);
    for (let py = y0; py < y1; py++) {
        const t = ((py + 0.5) / density - uv[1]) / dv;
        for (let px = x0; px < x1; px++) {
            const s = ((px + 0.5) / density - uv[0]) / du;
            callback(px, py, s, t);
        }
    }
}

function sourcePixelIndex(texture, u, v) {
    let px = Math.floor(u * texture.width / texture.uvWidth + EPSILON);
    let py = Math.floor(v * texture.height / texture.uvHeight + EPSILON);
    if (texture.wrap === 'repeat') {
        px = ((px % texture.width) + texture.width) % texture.width;
        py = ((py % texture.height) + texture.height) % texture.height;
    } else {
        px = Math.min(Math.max(px, 0), texture.width - 1);
        py = Math.min(Math.max(py, 0), texture.height - 1);
    }
    return (py * texture.width + px) * 4;
}

function packAndPaint(cubes, plans, textures, density = 1) {
    const items = plans.map(plan => ({
        id: plan.id,
        ...boxNetSize(plan.size),
        corners: boxNetCorners(plan.size),
    }));
    const packing = packNets(items);
    if (!packing) {
        throw new Error('The box UV nets do not fit into a 4096x4096 texture.');
    }

    const width = Math.round(packing.width * density);
    const height = Math.round(packing.height * density);
    const atlas = {
        uvWidth: packing.width,
        uvHeight: packing.height,
        width,
        height,
        data: new Uint8ClampedArray(width * height * 4),
    };
    const owner = new Int32Array(width * height).fill(-1);
    const uvOffsets = {};
    const faceUVs = {};
    const report = { overlaps: 0, resampled: [], painted: 0 };

    plans.forEach((plan, index) => {
        const cube = cubes[index];
        const placement = packing.placements[plan.id];
        uvOffsets[plan.id] = [placement.x, placement.y];
        faceUVs[plan.id] = boxFaceUVs(plan.size, uvOffsets[plan.id]);

        for (const fkey of FACE_KEYS) {
            const face = cube.faces[fkey];
            const targetUV = faceUVs[plan.id][fkey];
            if (!faceHasTexture(face, textures)) {
                continue;
            }
            const source = textures[face.texture];

            const target = FACE_AXES[fkey].map(axis => plan.size[axis] * density);
            const texel = faceTexelSize(face, source);
            if (target[0] > 0 && target[1] > 0
                && (Math.abs(texel[0] - target[0]) > EPSILON || Math.abs(texel[1] - target[1]) > EPSILON)) {
                report.resampled.push({ cube: plan.name, face: fkey, from: texel.map(round6), to: target });
            }

            const faceId = index * 6 + FACE_KEYS.indexOf(fkey);
            forEachFacePixel(targetUV, density, (px, py, s, t) => {
                if (px < 0 || py < 0 || px >= width || py >= height) {
                    return;
                }
                const [u, v] = faceLocalToUV(face.uv, face.rotation, s, t);
                const src = sourcePixelIndex(source, u, v);
                const pixel = py * width + px;
                if (owner[pixel] !== -1 && owner[pixel] !== faceId) {
                    report.overlaps++;
                }
                owner[pixel] = faceId;
                atlas.data.set(source.data.subarray(src, src + 4), pixel * 4);
                report.painted++;
            });
        }
    });
    return { atlas, uvOffsets, faceUVs, report };
}

function verifyAtlas(cubes, faceUVs, textures, atlas, density = 1) {
    const result = { checked: 0, mismatched: 0, faces: [] };
    cubes.forEach(cube => {
        for (const fkey of FACE_KEYS) {
            const face = cube.faces[fkey];
            if (!faceHasTexture(face, textures)) {
                continue;
            }
            const source = textures[face.texture];
            let bad = 0;
            forEachFacePixel(faceUVs[cube.id][fkey], density, (px, py, s, t) => {
                result.checked++;
                const [u, v] = faceLocalToUV(face.uv, face.rotation, s, t);
                const src = sourcePixelIndex(source, u, v);
                const dst = (py * atlas.width + px) * 4;
                const inside = px >= 0 && py >= 0 && px < atlas.width && py < atlas.height;
                for (let c = 0; c < 4; c++) {
                    if (!inside || source.data[src + c] !== atlas.data[dst + c]) {
                        bad++;
                        break;
                    }
                }
            });
            if (bad) {
                result.mismatched += bad;
                result.faces.push({ cube: cube.name, face: fkey, mismatched: bad });
            }
        }
    });
    return result;
}

// Blockbench
const PLUGIN_ID = 'modded_entity_texture_remapper';
const REMAP_FORMAT_ID = PLUGIN_ID + '_format';
const REMAP_FORMAT_NAME = 'Modded Entity (Remap Texture)';
const INFLATE_SETTING_ID = PLUGIN_ID + '_use_inflate';
let remapFormat;
let inflateSetting;

function readTexturePixels(texture) {
    const img = texture.img;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return {
        width: canvas.width,
        height: canvas.height,
        data: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
        uvWidth: texture.getUVWidth(),
        uvHeight: texture.getUVHeight(),
        wrap: texture.wrap_mode,
    };
}

function waitForTextures(timeout = 10000) {
    const pending = Texture.all
        .filter(texture => texture.img && !texture.img.complete)
        .map(texture => new Promise(resolve => {
            texture.img.addEventListener('load', resolve, { once: true });
            texture.img.addEventListener('error', resolve, { once: true });
        }));
    const timer = new Promise(resolve => setTimeout(resolve, timeout));
    return Promise.race([Promise.all(pending), timer]);
}

function snapshotProject() {
    const textures = {};
    const unreadable = [];
    for (const texture of Texture.all) {
        if (texture.img && texture.img.naturalWidth) {
            textures[texture.uuid] = readTexturePixels(texture);
        } else {
            unreadable.push(texture.name);
        }
    }
    const cubes = Cube.all.map(cube => {
        const faces = {};
        for (const fkey of FACE_KEYS) {
            const face = cube.faces[fkey];
            const texture = face.getTexture();
            faces[fkey] = {
                uv: face.uv.slice(),
                rotation: face.rotation || 0,
                texture: texture ? texture.uuid : null,
            };
        }
        return {
            id: cube.uuid,
            name: cube.parent instanceof Group ? `${cube.parent.name}/${cube.name}` : cube.name,
            from: cube.from.slice(),
            to: cube.to.slice(),
            inflate: cube.inflate || 0,
            faces,
        };
    });
    const main = Texture.getDefault() || Texture.all[0];
    const density = main && textures[main.uuid]
        ? textures[main.uuid].width / textures[main.uuid].uvWidth
        : 1;
    return { cubes, textures, unreadable, density: density > 0 ? density : 1, mainTexture: main };
}

function droppedElements() {
    const dropped = [];
    if (typeof Mesh !== 'undefined' && Mesh.all.length) {
        dropped.push(`${Mesh.all.length} mesh(es)`);
    }
    if (typeof SplineMesh !== 'undefined' && SplineMesh.all.length) {
        dropped.push(`${SplineMesh.all.length} spline(s)`);
    }
    if (typeof TextureMesh !== 'undefined' && TextureMesh.all.length) {
        dropped.push(`${TextureMesh.all.length} texture mesh(es)`);
    }
    return dropped;
}

function escapeHTML(text) {
    return String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function formatList(items) {
    if (!items.length) return '';
    return '<ul>' + items.map(item => `<li>${escapeHTML(item)}</li>`).join('') + '</ul>';
}

function describeNotes(plans) {
    const lines = [];
    for (const plan of plans) {
        for (const note of plan.notes) {
            if (note.type === 'inflate') {
                lines.push(`${plan.name}: shrunk by ${note.amount} per side, inflate +${note.amount}`);
            } else if (note.type === 'rounded') {
                const errors = note.error
                    .map((e, i) => (Math.abs(e) > EPSILON ? `${AXIS_NAMES[i]} ${e > 0 ? '+' : ''}${e}` : null))
                    .filter(Boolean);
                lines.push(`${plan.name}: size ${note.original.join(' x ')} rounded up to ${plan.size.join(' x ')}`
                    + (note.inflate ? `, inflate ${note.inflate}` : ', no inflate (flat cube)')
                    + (errors.length ? `; still off by ${errors.join(', ')}` : ''));
            }
        }
    }
    return lines;
}

function showResult(result) {
    const { plans, painted, verification, atlas, dropped, unreadable, textureCount } = result;
    let html = `<p>Texture: ${atlas.uvWidth} x ${atlas.uvHeight} (${atlas.width} x ${atlas.height} px). `
        + 'Save the new texture before exporting.</p>';
    if (verification.mismatched || painted.report.overlaps) {
        html += `<p><b>Problem:</b> ${verification.mismatched} of ${verification.checked} texels don't match `
            + `the original, ${painted.report.overlaps} overlapping. Please report this.</p>`
            + formatList(verification.faces.map(f => `${f.cube} ${f.face}: ${f.mismatched}`));
    } else {
        html += `<p>Verified: all ${verification.checked} texels match the original model.</p>`;
    }
    if (dropped.length) {
        html += `<p><b>Deleted</b> (not supported by Modded Entity): ${escapeHTML(dropped.join(', '))}</p>`;
    }
    if (unreadable.length) {
        html += '<p><b>Textures that could not be read</b> (their faces are now transparent):</p>' + formatList(unreadable);
    }
    if (textureCount > 1) {
        html += `<p>${textureCount} textures were merged into one.</p>`;
    }
    const lines = describeNotes(plans);
    if (lines.length) {
        html += '<p><b>Geometry changes:</b></p>' + formatList(lines);
    }
    if (painted.report.resampled.length) {
        html += '<p><b>Resampled faces</b> (pixels dropped or doubled):</p>' + formatList(
            painted.report.resampled.map(r => `${r.cube} ${r.face}: ${r.from.join('x')} → ${r.to.join('x')}`)
        );
    }
    new Dialog({
        id: PLUGIN_ID + '_result',
        title: `Converted to ${REMAP_FORMAT_NAME}`,
        width: 560,
        lines: [html],
        buttons: ['dialog.ok'],
    }).show();
}

async function convertWithRemap() {
    await waitForTextures();
    const dropped = droppedElements();
    const snapshot = snapshotProject();
    const useInflate = Settings.get(INFLATE_SETTING_ID) !== false;

    const plans = planGeometry(snapshot.cubes, snapshot.textures, { useInflate });
    const painted = packAndPaint(snapshot.cubes, plans, snapshot.textures, snapshot.density);
    const atlas = painted.atlas;

    Formats.modded_entity.convertTo();

    const cubes = Cube.all.slice();
    const oldTextures = Texture.all.slice();
    Undo.initEdit({ elements: cubes, outliner: true, textures: oldTextures, bitmap: true, uv_mode: true });

    const canvas = document.createElement('canvas');
    canvas.width = atlas.width;
    canvas.height = atlas.height;
    canvas.getContext('2d').putImageData(new ImageData(atlas.data, atlas.width, atlas.height), 0, 0);
    const baseName = snapshot.mainTexture ? snapshot.mainTexture.name.replace(/\.png$/i, '') : Project.name;
    const texture = new Texture({ name: `${baseName || 'texture'}_entity.png` }).fromDataURL(canvas.toDataURL());
    texture.add(false);
    for (const old of oldTextures) {
        old.remove(true);
    }
    Project.texture_width = atlas.uvWidth;
    Project.texture_height = atlas.uvHeight;

    const byId = Object.fromEntries(plans.map(plan => [plan.id, plan]));
    for (const cube of cubes) {
        const plan = byId[cube.uuid];
        if (!plan) {
            continue;
        }
        cube.from.V3_set(plan.from);
        cube.to.V3_set(plan.to);
        cube.inflate = plan.inflate;
        cube.box_uv = true;
        cube.mirror_uv = false;
        cube.uv_offset[0] = painted.uvOffsets[plan.id][0];
        cube.uv_offset[1] = painted.uvOffsets[plan.id][1];
        cube.applyTexture(texture, true);
    }

    Undo.finishEdit('Remap texture for box UV', {
        elements: cubes, outliner: true, textures: [texture], bitmap: true, uv_mode: true,
    });
    Canvas.updateAll();

    const actualUVs = {};
    for (const cube of cubes) {
        actualUVs[cube.uuid] = {};
        for (const fkey of FACE_KEYS) {
            actualUVs[cube.uuid][fkey] = cube.faces[fkey].uv.slice();
        }
    }
    const verification = verifyAtlas(snapshot.cubes, actualUVs, snapshot.textures, atlas, snapshot.density);
    showResult({
        plans, painted, verification, atlas, dropped,
        unreadable: snapshot.unreadable,
        textureCount: Object.keys(snapshot.textures).length,
    });
}

function showError(error) {
    console.error(`[${PLUGIN_ID}]`, error);
    Blockbench.showMessageBox({
        title: 'Conversion failed',
        message: String(error && error.message || error),
        icon: 'error',
    });
}

if (typeof Plugin !== 'undefined') {
    Plugin.register(PLUGIN_ID, {
        title: 'Modded Entity Texture Remapper',
        author: 'Globox_Z',
        description: 'Converts per-face UV models like Generic Model to Modded Entity and remaps the texture into box UV, so every face keeps its pixels.',
        icon: 'icon.png',
        version: '1.0.0',
        min_version: '5.2.0',
        variant: 'both',
        tags: ['Minecraft: Java Edition', 'Texture', 'Utility'],
        has_changelog: true,

        onload() {
            inflateSetting = new Setting(INFLATE_SETTING_ID, {
                name: 'Remap Texture: Use Inflate for Overlay Cubes',
                description: 'When converting with "Modded Entity (Remap Texture)", turn cubes whose texture belongs to a smaller box (like a hat around a head) into that box plus inflate, instead of resampling their pixels.',
                category: 'edit',
                value: true,
            });

            remapFormat = new ModelFormat(REMAP_FORMAT_ID, {
                name: REMAP_FORMAT_NAME,
                description: 'Converts to Modded Entity and remaps the texture into box UV, so every face keeps its pixels.',
                icon: 'icon-format_java',
                category: 'minecraft',
                target: 'Minecraft: Java Edition',
                show_on_start_screen: false,
            });
            remapFormat.show_in_new_list = false;
            Object.defineProperty(remapFormat, 'can_convert_to', {
                configurable: true,
                get: () => !!Format && Format.id !== 'modded_entity' && Cube.all.length > 0,
            });
            remapFormat.convertTo = function () {
                convertWithRemap().catch(showError);
            };
        },

        onunload() {
            if (remapFormat) {
                remapFormat.delete();
                remapFormat = null;
            }
            if (inflateSetting) {
                inflateSetting.delete();
                inflateSetting = null;
            }
        },
    });
}
