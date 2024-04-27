(function() {
    var button;

    function calculateRects()
    {
        var width = 0;
        var height = 0;
        var rects = [];
        var x = 0;
        var t = [];

        var ts = Texture.all;

        t.push(...ts);
        t.sort((a, b) => (a.width + a.height) - (b.width + b.height));

        /* Calculate max width and height */
        var maxW = Project.texture_width;
        var maxH = Project.texture_height;

        t.forEach(t => 
        {
            maxW = Math.max(maxW, t.width);
            maxH = Math.max(maxH, t.height);
        });

        var h = 0;
        var y = 0;
        var rows = Math.max(Math.ceil(Math.sqrt(ts.length)), 1);

        t.forEach((texture, i) => 
        {
            var multX = maxW / texture.width;
            var multY = maxH / texture.height;
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

            if ((i + 1) % rows == 0)
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
            mx: maxW / Project.texture_width,
            my: maxH / Project.texture_height,
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
            reader.onloadend = () => replaceTextures(rects, reader.result, data.w, data.h, data.mx, data.my);
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

    function replaceTextures(rects, data, w, h, mx, my)
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

        var ts = Texture.all;
        var elems = Cube.all;

        if (Mesh)
        {
            elems = elems.concat(Mesh.all);
        }

        Undo.initEdit({
            elements: elems,
            textures: ts,
            bitmap: true,
            uv_mode: true
        });

        var newTextures = [];
        ts.forEach(t => newTextures.push(t));
        newTextures.forEach(t => t.remove(true));

        texture.fromDataURL(data).add(false).select();

        Cube.all.forEach(cube => 
        {
            var toApplySides = [];

            if (Project.box_uv)
            {
                var north = cube.faces['north'];
                var rect = getRect(north.texture);

                if (rect != null)
                {
                    cube.uv_offset[0] += rect.x / rect.mx;
                    cube.uv_offset[1] += rect.y / rect.my;
                }

                toApplySides = north.texture !== false;
            }
            else
            {
                sides.forEach(side =>
                {
                    var face = cube.faces[side];
                    var rect = getRect(face.texture);

                    if (rect !== null)
                    {
                        face.uv[0] = face.uv[0] * rect.mx + rect.x;
                        face.uv[1] = face.uv[1] * rect.my + rect.y;
                        face.uv[2] = face.uv[2] * rect.mx + rect.x;
                        face.uv[3] = face.uv[3] * rect.my + rect.y;

                        if (face.texture !== false)
                        {
                            toApplySides.push(side);
                        }
                    }
                });
            }

            if (toApplySides !== false)
            {
                cube.applyTexture(texture, toApplySides);
            }
        });

        if (Mesh)
        {
            Mesh.all.forEach(mesh =>
            {
                var applied = false;

                Object.keys(mesh.faces).forEach(key =>
                {
                    var face = mesh.faces[key];
                    var rect = getRect(face.texture);

                    if (!rect)
                    {
                        return;
                    }

                    Object.keys(face.uv).forEach(key => 
                    {
                        var uv = face.uv[key];

                        uv[0] = uv[0] * rect.mx + rect.x;
                        uv[1] = uv[1] * rect.my + rect.y;

                        applied = true;
                    });
                });

                if (applied)
                {
                    mesh.applyTexture(texture, true);
                }
            });
        }

        Project.texture_width = Project.box_uv ? w / mx : w;
        Project.texture_height = Project.box_uv ? h / my : h;

        if (Format.per_texture_uv_size) {
            texture.uv_width = Project.texture_width;
            texture.uv_height = Project.texture_height;
        }

        Undo.finishEdit('finished stitching');
    }

    Plugin.register('texture_stitcher', {
        title: 'Texture Stitcher',
        author: 'McHorse',
        description: 'Adds a menu item to textures editor that stitches multiple textures into one',
        icon: 'fa-compress-arrows-alt',
        version: '1.0.3',
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
            Texture.prototype.menu.addAction(button);
        },
        onunload() 
        {
            button.delete();
        }
    });
})();