(function() {
    var button;

    function calculateRects()
    {
        var width = 0;
        var height = 0;
        var rects = [];
        var x = 0;
        var t = [];

        t.push(...textures);
        t.sort((a, b) => (a.width + a.height) - (b.width + b.height));

        var h = 0;
        var y = 0;

        t.forEach((texture, i) => 
        {
            rects.push({
                texture: texture,
                x: x,
                y: y
            });

            x += texture.width;
            h = Math.max(h, texture.height);

            if ((i + 1) % 3 == 0)
            {
                y += h;
                h = 0;
                x = 0;
            }
        });

        rects.forEach(rect => 
        {
            width = Math.max(width, rect.x + rect.texture.width);
            height = Math.max(height, rect.y + rect.texture.height);
        });

        return {
            w: width,
            h: height,
            rects: rects
        };
    }

    function stitchTextures()
    {
        const data = calculateRects();
        const rects = data.rects;

        const offscreen = new OffscreenCanvas(data.w, data.h);
        const c = offscreen.getContext('2d');

        rects.forEach(rect => c.drawImage(rect.texture.img, rect.x, rect.y));

        const config = {
            type: 'image/png' 
        };

        offscreen.convertToBlob(config).then(blob => {
            var reader = new FileReader();
            
            reader.readAsDataURL(blob);
            reader.onloadend = () => 
            {
                replaceTextures(rects, reader.result, data.w, data.h);
            };
        });
    }

    function replaceTextures(rects, data, w, h)
    {
        const getRect = texture_uuid =>
        {
            for (var i = 0; i < rects.length; i++)
            {
                if (rects[i].texture.uuid === texture_uuid)
                {
                    return rects[i];
                }
            }

            return null;
        };

        var sides = ['north', 'east', 'south', 'west', 'up', 'down']
        var texture = new Texture({
            mode: 'bitmap',
            name: 'stiched_texture',
            keep_size : true
        });

        Undo.initEdit({
            elements: Cube.all,
            textures: textures,
            bitmap: true,
            uv_mode: true
        });

        var newTextures = [];
        textures.forEach(t => newTextures.push(t));
        newTextures.forEach(t => t.remove(true));

        texture.fromDataURL(data).add(false).select();

        Cube.all.forEach(cube => 
        {
            if (Project.box_uv)
            {
                var north = cube.faces['north'];
                var rect = getRect(north.texture);

                if (rect != null)
                {
                    cube.uv_offset[0] += rect.x;
                    cube.uv_offset[1] += rect.y;
                }
            }
            else
            {
                sides.forEach(side =>
                {
                    var face = cube.faces[side];
                    var rect = getRect(face.texture);

                    if (rect !== null)
                    {
                        face.uv[0] += rect.x;
                        face.uv[1] += rect.y;
                        face.uv[2] += rect.x;
                        face.uv[3] += rect.y;
                    }
                });
            }

            cube.applyTexture(texture, true);
        });

        Project.texture_width = w;
        Project.texture_height = h;
        Undo.finishEdit('finished stitching');
    }

    Plugin.register('texture_stitcher', {
        title: 'Texture Stitcher',
        author: 'McHorse',
        description: 'Adds a menu item to textures editor that stitches multiple textures into one',
        icon: 'fa-compress-arrows-alt',
        version: '1.0.0',
        variant: 'both',
        onload() 
        {
            button = new Action('texture_stitcher', {
                name: 'Stitch all textures',
                category: 'textures',
                description: 'Stitch all of the textures into single texture (you might want to make a back up of the project)',
                icon: 'fa-compress-arrows-alt',
                click: stitchTextures
            });

            Interface.Panels.textures.menu.addAction(button);
        },
        onunload() 
        {
            button.delete();
        }
    });
})();