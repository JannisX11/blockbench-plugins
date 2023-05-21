Plugin.register('sphere', {
    title: 'PixelArt Sphere Generator',
    author: 'hamburger2506',
    icon: 'circle',
    description: 'A plugin to create pixelated spheres, since minecraft does not allow real spheres due to something to do with rotation. Also I needed a sphere that I could do pixel art on to make it look like a planet. (Feel free to update or republish this plugin if you\'d like since I probably won\'t do mayor updates to it anymore.)',
    version: '1.0.0',
    variant: 'both',
    tags: ['Minecraft: Java Edition'],
    onload() {
        var button = new Action('generate_sphere', {
            name: 'New Sphere',
            description: 'Opens the sphere generator menu',
            icon: 'circle',
            click: function() {
                sphereDialog();
            }
        });
        MenuBar.addAction(button, 'filter');
    },
    onunload() {
        MenuBar.removeAction(button, 'filter');
    },
});

// GUI Settings
function sphereDialog() {
    var dialog = new Dialog({
        title: 'Sphere creator',
        id: 'sphere_dialog',
        form: {
            radius: {label: 'Radius', type: 'number', value: 7.5},
            center: {label: 'Center', type: 'vector', value: [7.5, 7.5, 7.5]}
        },

        onConfirm(result) {
            dialog.hide();
            addCubes(result.radius, result.center);
        }
    }).show();
}

function addCubes(radius, center) {
    Undo.initEdit({elements: []});
    const new_cubes = [];
    let i = -1;
    let group = new Group({name: 'Sphere'}).init();
    for (let x = center[0] - radius; x <= center[0] + radius; x++) {
        for (let y = center[1] - radius; y <= center[1] + radius; y++) {
            for (let z = center[2] - radius; z <= center[2] + radius; z++) {
                if (distance([x, y, z], center) > radius**2 - radius/1.03 && distance([x, y, z], center) < radius**2 + radius/1.03) {
                    i++;
                    new_cubes.push(new Cube({name: 'Cube', to: [1, 1, 1]}).addTo(group).init());
                    new_cubes[i].moveVector([x, y, z]);
                }
            }
        }
    }
    Undo.finishEdit('Added cubes', {elements: new_cubes});
}

function distance(vectorOffset, vectorCenter) {
    let OffsetX = vectorCenter[0] - vectorOffset[0];
    let OffsetY = vectorCenter[1] - vectorOffset[1];
    let OffsetZ = vectorCenter[2] - vectorOffset[2];
    return Math.round(OffsetX**2 + OffsetY**2 + OffsetZ**2);
}