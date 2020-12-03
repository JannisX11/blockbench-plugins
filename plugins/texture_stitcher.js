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
            var multX = Project.texture_width / texture.width;
            var multY = Project.texture_height / texture.height;
            var rect = {
                texture: texture,
                x: x,
                y: y,
                w: multX * texture.width,
                h: multY * texture.height,
                mx: multX,
                my: multY
            };

            rects.push(rect);

            x += rect.w;
            h = Math.max(h, rect.h);

            if ((i + 1) % 3 == 0)
            {
                y += h;
                h = 0;
                x = 0;
            }
        });

        rects.forEach(rect => 
        {
            width = Math.max(width, rect.x + rect.w);
            height = Math.max(height, rect.y + rect.h);
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
        const tmp = new OffscreenCanvas(10, 10);
        const c = offscreen.getContext('2d');

        rects.forEach(rect => drawToCanvas(c, tmp, rect));

        const config = {
            type: 'image/png' 
        };

        offscreen.convertToBlob(config).then(blob => {
            var reader = new FileReader();
            
            reader.readAsDataURL(blob);
            reader.onloadend = () => replaceTextures(rects, reader.result, data.w, data.h);
        });
    }

    function drawToCanvas(c, tmp, rect)
    {
        if (rect.mx === 1 && rect.my === 1)
        {
            c.drawImage(rect.texture.img, rect.x, rect.y);

            return;
        }

        const getIndex = (x, y, width) =>
        {
            return y * (width * 4) + x * 4;
        };

        tmp.width = rect.texture.width;
        tmp.height = rect.texture.height;

        var ct = tmp.getContext('2d');

        ct.clearRect(0, 0, tmp.width, tmp.height);
        ct.drawImage(rect.texture.img, 0, 0);

        var data = ct.getImageData(0, 0, tmp.width, tmp.height);

        for (var x = 0; x < rect.w; x++)
        {
            for (var y = 0; y < rect.h; y++)
            {
                var ix = Math.floor(x / rect.mx);
                var iy = Math.floor(y / rect.my);

                var index = getIndex(ix, iy, data.width);
                var r = data.data[index];
                var g = data.data[index + 1];
                var b = data.data[index + 2];
                var a = data.data[index + 3] / 255;

                c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                c.fillRect(rect.x + x, rect.y + y, 1, 1);
            }
        }
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