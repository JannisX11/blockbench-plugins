// Плагин для Blockbench, который заполняет пространство кубами 1x1x1 и корректирует UV-развертку
(function() {
    const ID = 'plugin-blocker';
    const NAME = 'FrostCraft Blocker';

    Plugin.register(ID, {
        title: NAME,
        icon: 'border_outer',
        author: 'dysceeds',
        description: 'The plugin allows you to convert a model consisting of cubic rectangles into a mold made of 1x1x1 blocks with UV mapping like minecraft blocks. The plugin helps create models for resource packs that use textures from Minecraft for models. Simply select a group of meshes or a single mesh and press the split 1x1x1 button in your tools menu.',
        version: '1.0.0',
        variant: 'both',
        onload() {
            let action = new Action('fill_space_action', {
                name: 'Fill with 1x1 Blocks',
                icon: 'border_all',
                description: 'Заполнить пространство кубами 1x1x1 и обновить UV',
                click: function() {
                    Undo.initEdit({elements: Cube.all});
                    Cube.all.forEach(cube => {
                        fillSpaceWith1x1Cubes(cube);
                    });
                    Undo.finishEdit('Fill with 1x1 Blocks');
                }
            });
            MenuBar.addAction(action, 'filter');
        },
        onunload() {
            MenuBar.removeAction('fill_space_action');
        }
    });

    function fillSpaceWith1x1Cubes(cube) {
        const { from, to } = cube;
        let xSize = to[0] - from[0];
        let ySize = to[1] - from[1];
        let zSize = to[2] - from[2];

        // Создаем блоки 1x1x1 и добавляем их в папку Blocked, сохраняя наследство групп
        let blockedGroup = Group.all.find(group => group.name === 'Blocked') || new Group('Blocked').init();
        let parentGroup = cube.parent;
        let targetGroup = blockedGroup;

        if (parentGroup && parentGroup !== 'root') {
            // Создаем группы внутри Blocked, чтобы сохранить наследство
            let inheritedGroup = blockedGroup.children.find(group => group.name === parentGroup.name) || new Group(parentGroup.name).addTo(blockedGroup).init();
            targetGroup = inheritedGroup;
        }

        for (let x = 0; x < xSize; x++) {
            for (let y = 0; y < ySize; y++) {
                for (let z = 0; z < zSize; z++) {
                    let newCube = new Cube({
                        from: [from[0] + x, from[1] + y, from[2] + z],
                        to: [from[0] + x + 1, from[1] + y + 1, from[2] + z + 1],
                        name: `${cube.name}_1x1x1_${x}_${y}_${z}`
                    }).init();
                    ensureCubeFaces(newCube);
                    updateCubeUV(newCube);
                    newCube.addTo(targetGroup);
                }
            }
        }
    }

    function ensureCubeFaces(cube) {
        // Полная переинициализация всех сторон куба, чтобы гарантировать, что каждая из них присутствует
        const directions = ['north', 'south', 'east', 'west', 'up', 'down'];
    
        directions.forEach(face => {
            // Если сторона не существует, создаем ее
            if (!cube.faces[face]) {
                cube.faces[face] = new Face({
                    direction: face,
                    uv: [0, 0, 16, 16],
                    texture: '#texture'  // Применяем текстуру, указывающую на любой существующий текстурный элемент
                });
            }
        
            // Обновляем UV для каждой стороны, чтобы убедиться, что стороны корректно отображаются
            cube.faces[face].uv = [0, 0, 16, 16];
            cube.faces[face].enabled = true;  // Делаем сторону активной, если она была выключена
            cube.faces[face].cullface = face; // Устанавливаем правильное направление для cullface
        });

        // Обновляем сам куб, чтобы убедиться, что изменения вступили в силу
        cube.extend({
            faces: cube.faces
        });
    }

    function updateCubeUV(cube) {
        // Устанавливаем UV, чтобы каждая сторона была полным квадратом, как в Minecraft
        ['north', 'south', 'east', 'west', 'up', 'down'].forEach(face => {
            if (cube.faces[face]) {
                cube.faces[face].uv = [0, 0, 16, 16];
            }
        });
        cube.applyTexture(Texture.all[0]); // Применяем первую текстуру из списка, можно доработать
    }
})();
