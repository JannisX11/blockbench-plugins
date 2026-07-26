(function() {

// Plugin variables isolated outside registration
let fixEnabled = false;
let originalRenderOrders = new Map();
let toggleAction;

function hasTransparentTexture(cube) {
    if (!cube.faces) return false;

    for (let face in cube.faces) {
        let faceData = cube.faces[face];
        if (faceData.texture !== null && faceData.texture !== undefined) {
            let tex = Texture.all.find(t => t.uuid === faceData.texture || t.id == faceData.texture);
            if (tex && tex.ctx) {
                try {
                    let canvas = tex.ctx.canvas || tex.canvas;
                    if (canvas) {
                        let ctx = canvas.getContext('2d');
                        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        for (let i = 3; i < imgData.data.length; i += 4) {
                            if (imgData.data[i] < 250 && imgData.data[i] > 0) {
                                return true;
                            }
                        }
                    }
                } catch (e) {}
            }
        }
    }
    return false;
}

function isGlassByName(name) {
    if (!name) return false;
    let n = name.toLowerCase();
    return n.includes('glass') || n.includes('window') || n.includes('transparent') ||
           n.includes('crystal') || n.includes('ice') || n.includes('water');
}

function isInnerByName(name) {
    if (!name) return false;
    let n = name.toLowerCase();
    return n.includes('liquid') || n.includes('glow') || n.includes('inner') ||
           n.includes('potion') || n.includes('contents') || n.includes('fill');
}

function isInsideOther(cube, allCubes) {
    let from1 = cube.from || [0, 0, 0];
    let to1 = cube.to || [0, 0, 0];

    for (let other of allCubes) {
        if (other.uuid === cube.uuid) continue;

        let from2 = other.from || [0, 0, 0];
        let to2 = other.to || [0, 0, 0];

        if (from1[0] >= from2[0] && to1[0] <= to2[0] &&
            from1[1] >= from2[1] && to1[1] <= to2[1] &&
            from1[2] >= from2[2] && to1[2] <= to2[2]) {
            if (hasTransparentTexture(other) || isGlassByName(other.name)) {
                return true;
            }
        }
    }
    return false;
}

function applyTransparencyFix() {
    if (typeof Cube === 'undefined' || !Cube.all) return;

    let allCubes = Cube.all;
    let transparentCubes = [];
    let innerCubes = [];

    allCubes.forEach(cube => {
        if (!cube.mesh) return;

        if (!originalRenderOrders.has(cube.uuid)) {
            originalRenderOrders.set(cube.uuid, cube.mesh.renderOrder);
        }

        let isTransparent = hasTransparentTexture(cube) || isGlassByName(cube.name);
        let isInner = isInnerByName(cube.name);

        if (isTransparent && !isInner) {
            transparentCubes.push(cube);
        } else if (isInner || isInsideOther(cube, allCubes)) {
            innerCubes.push(cube);
        }
    });

    innerCubes.forEach(cube => {
        cube.mesh.renderOrder = -100;
    });

    transparentCubes.forEach(cube => {
        cube.mesh.renderOrder = 100;
    });

    Canvas.updateView({elements: allCubes, element_aspects: {transform: true}});
}

function removeTransparencyFix() {
    if (typeof Cube !== 'undefined' && Cube.all) {
        Cube.all.forEach(cube => {
            if (!cube.mesh) return;
            cube.mesh.renderOrder = originalRenderOrders.get(cube.uuid) || 0;
        });

        Canvas.updateView({elements: Cube.all, element_aspects: {transform: true}});
    }

    originalRenderOrders.clear();
}

Plugin.register('transparency_fix', {
    title: 'Transparency Fix',
    author: 'Larsonix',
    description: 'Shows objects inside transparent containers (glass, windows, etc.)',
    about: 'This plugin fixes the visibility of objects inside transparent containers by adjusting render order.\n\n## Features\n- Auto-detects transparent textures by scanning alpha values\n- Name-based detection (glass, window, crystal, ice, liquid, glow, etc.)\n- Geometry detection - finds cubes inside transparent containers\n\n## Usage\nGo to **View > Toggle Transparency Fix** to enable/disable.\n\n## Note\nSome visual artifacts on transparent faces are a WebGL limitation and cannot be fixed. Models will render correctly in game engines.',
    icon: 'visibility',
    version: '2.1.0',
    min_version: '4.0.0',
    variant: 'both',
    tags: ['Rendering', 'Utility'],

    onload() {
        toggleAction = new Action('toggle_transparency_fix', {
            name: 'Toggle Transparency Fix',
            description: 'See objects inside transparent cubes (glass, windows, etc.)',
            icon: 'visibility',
            click() {
                fixEnabled = !fixEnabled;
                if (fixEnabled) {
                    applyTransparencyFix();
                    Blockbench.showQuickMessage('Transparency Fix: ON', 1500);
                } else {
                    removeTransparencyFix();
                    Blockbench.showQuickMessage('Transparency Fix: OFF', 1500);
                }
            }
        });

        MenuBar.addAction(toggleAction, 'view');

        // Enable by default
        fixEnabled = true;
        setTimeout(applyTransparencyFix, 500);

        Blockbench.on('select_project', () => {
            if (fixEnabled) {
                originalRenderOrders.clear();
                setTimeout(applyTransparencyFix, 200);
            }
        });

        Blockbench.on('load_project', () => {
            if (fixEnabled) {
                originalRenderOrders.clear();
                setTimeout(applyTransparencyFix, 200);
            }
        });

        Blockbench.on('update_texture', () => {
            if (fixEnabled) setTimeout(applyTransparencyFix, 100);
        });
    },

    onunload() {
        if (fixEnabled) removeTransparencyFix();
        toggleAction.delete();
    },

    oninstall() {
        Blockbench.showQuickMessage('Transparency Fix installed! Find it in View menu.', 3000);
    }
});

})();
