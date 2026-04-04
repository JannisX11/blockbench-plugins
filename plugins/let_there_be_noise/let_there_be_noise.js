(function() {
    let dialog = null;
    let preview = null;
    let previewCtx = null;
    let original = null;

    Plugin.register('let_there_be_noise', {
    title: 'Let there Be Noise',
    author: 'Momoko',
    icon: 'grain',
    description: 'Adds a noise adding function to BlockBench, supports selections and colour channels',
    version: '1.0.0',
    min_version: '4.8.0',
    variant: 'both',
    tags: ['Texture', 'Paint', 'Tool'],
    creation_date: '2026-03-25',
    onload() {
    this.action = new Action('add_noise.apply', {
    name: 'Add Noise',
    description: 'Apply noise to the currently selected texture',
    icon: 'grain',
    category: 'textures',

    click: () => {
    const tex = Texture.getDefault() || Texture.all[0];
    if(!tex) {
    Blockbench.showQuickMessage('No texture Selected or Found', 2000);
    return;
    }

    //guard for versions of BlockBench that may not have getActiveCanvas() 4 ctx
    const active = tex.getActiveCanvas ? tex.getActiveCanvas() : tex;
    const canvas = active.canvas || tex.canvas;
    const ctx = active.ctx || tex.ctx;
    original = ctx.getImageData(0,0, tex.width, tex.height);

    if(dialog) dialog.hide();
    dialog = new Dialog({
    id: 'add_noise.dialog',
    title: 'Add Noise',
    width: 500,
     form: { //source used for checkerboard via https://css-tricks.com/
          preview_box: { type: 'info', text: '<div style="margin-bottom:15px;text-align:center;background:repeating-conic-gradient(#222 0% 25%,#333 0% 50%) 50%/16px 16px;padding:10px;border-radius:4px"><canvas id="add_noise_preview" style="border:2px solid #555;image-rendering:pixelated;width:400px;height:auto"></canvas></div>' },
          amount: { label: 'Amount', type: 'range', min: 0, max: 100, value: 20, step: 1, full_width: true },
          coverage: { label: 'Coverage', type: 'range', min: 0, max: 100, value: 100, step: 1, full_width: true },
          seed: { label: 'Seed', type: 'number', value: 1, step: 1, min: 0 },
          mode_separator: { type: 'info', text: '<hr>' },
          channel_mode: { label: 'Mode', type: 'select', options: { 'uniform': 'Uniform (All Channels)', 'individual': 'Per-Channel Control' }, value: 'uniform' },
          channel_separator: { type: 'info', text: '<h4>Channel Control</h4>', condition: (form) => form.channel_mode === 'individual' },
          red_channel: { label: 'Red Channel (Metalness)', type: 'checkbox', value: true, condition: (form) => form.channel_mode === 'individual' },
          green_channel: { label: 'Green Channel (Emissive)', type: 'checkbox', value: false, condition: (form) => form.channel_mode === 'individual' },
          blue_channel: { label: 'Blue Channel (Roughness)', type: 'checkbox', value: false, condition: (form) => form.channel_mode === 'individual' },
          alpha_channel: { label: 'Alpha Channel (Subsurface)', type: 'checkbox', value: false, condition: (form) => form.channel_mode === 'individual' }
    },
    onFormChange: function(data) {
    refreshPreview(tex, data);
    },
    onConfirm: function(data) {
    applyNoise(tex, data);
    dialog.hide();
    },
    onCancel: function() {
    dialog.hide();
    },
    onOpen: function() {
    setTimeout(function() {
    preview = document.getElementById('add_noise_preview');
    if(preview) {
    previewCtx = preview.getContext('2d');
    preview.width = tex.width;
    preview.height = tex.height;
    preview.style.width = '400px';
    preview.style.height = 'auto';
    preview.style.aspectRatio = preview.width + ' / ' + preview.height;
    refreshPreview(tex, dialog.getFormResult());
    }}, 100);}});dialog.show();}});

    MenuBar.addAction(this.action, 'image');
    },

    onunload() {
    if (this.action) this.action.delete();
    if(dialog) dialog.hide();
    }});

    function getSelectedBounds(tex){
    if(!tex.selection || tex.selection.override === true) return null;
    const arr = tex.selection.array;
    const width = tex.width;
    const height = tex.height;
    if(!arr || arr.length !== width * height) return null;

    let minX = width, minY = height, maxX = -1, maxY = -1;

    for(let i = 0; i < arr.length; i++) {
    if(arr[i] > 0){
    const x = i % width;
    const y = (i / width) | 0;

    if(x < minX) minX = x;
    if(y < minY) minY = y;
    if(x > maxX) maxX = x;
    if(y > maxY) maxY = y;
    }}
    if(maxX < 0) return null;
    return{x:minX, y:minY, w:(maxX - minX + 1), h:(maxY - minY + 1)};
    }

    function refreshPreview(tex, data){
    if(!previewCtx || !original) return;
    const result = processNoise(tex, data, original, true);
    previewCtx.putImageData(result, 0, 0);
    }


    function applyNoise(tex, data) {
    const active = tex.getActiveCanvas ? tex.getActiveCanvas() : tex;
    const canvas = active.canvas || tex.canvas;
    const ctx = canvas.getContext('2d');

    Undo.initEdit({ textures: [tex], bitmap: true });

    const src = ctx.getImageData(0,0,tex.width,tex.height);
    const result = processNoise(tex, data, src, true);

    ctx.putImageData(result, 0, 0);
    tex.updateChangesAfterEdit();
    Undo.finishEdit('Add noise');
    }

    function processNoise(tex, data, srcData, useSelect) {
    const rng = mulberry32(seedTo32(data.seed));
    const out = new Uint8ClampedArray(srcData.data);
    const amount = Number(data.amount) || 0;
    const coverage = (Number(data.coverage) || 0) / 100;

    const isIndividualMode = data.channel_mode === 'individual';
    const channels = {
    r: isIndividualMode ? (data.red_channel === true) : true,
    g: isIndividualMode ? (data.green_channel === true) : true,
    b: isIndividualMode ? (data.blue_channel === true) : true,
    a: isIndividualMode ? (data.alpha_channel === true) : false
    };

    let select = (tex.selection && tex.selection.override !== true) ? tex.selection.array : null;
    if(select && select.length !== srcData.width * srcData.height) select = null;
    const tex_w = srcData.width;

    let x0 = 0, y0 = 0, w0 = srcData.width, h0 = srcData.height;
    const bounds = getSelectedBounds(tex);
    if(!bounds) select = null;
    if(bounds) { x0 = bounds.x; y0 = bounds.y; w0 = bounds.w; h0 = bounds.h; }

    for(let y = 0; y < srcData.height; y++){
    for(let x = 0; x < srcData.width; x++){
    const p = (y * srcData.width + x) * 4;

    const coverageVal = rng();
    const nr = (rng() * 2 - 1) * amount;
    const ng = (rng() * 2 - 1) * amount;
    const nb = (rng() * 2 - 1) * amount;
    const na = (rng() * 2 - 1) * amount;

    if(useSelect && bounds){
    if(x < x0 || y < y0 || x >= (x0 + w0) || y >= (y0 + h0)) continue;
    }

    if(select && useSelect) {
    const gi = y * tex_w + x;
    if(select[gi] <= 0) continue;}
    if(coverageVal > coverage) continue;

    if(isIndividualMode) {
    if(channels.r) out[p] = clamp(out[p] + nr);
    if(channels.g) out[p + 1] = clamp(out[p + 1] + ng);
    if(channels.b) out[p + 2] = clamp(out[p + 2] + nb);
    if(channels.a) out[p + 3] = clamp(out[p + 3] + na);
    } else {
    out[p] = clamp(out[p] + nr);
    out[p + 1] = clamp(out[p + 1] + nr);
    out[p + 2] = clamp(out[p + 2] + nr);
    }
    }}
    return new ImageData(out, srcData.width, srcData.height);
    }

    function clamp(v){
    return v < 0 ? 0 : (v > 255 ? 255 : v);
    }

    function seedTo32(seed){
    seed = Number(seed) || 0;
    seed = seed | 0;
    return seed >>> 0;
    }

    //mulberry function rng https://github.com/cprosche/mulberry32
    function mulberry32(a){
    return function() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    }
})();