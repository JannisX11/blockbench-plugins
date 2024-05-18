(function() {
    var button;
    var createRect = (x, y, w, h) => { return {x, y, w, h}; };

    function packBoxes(boxes, padding)
    {
        var areas = [];
        var w = getInitialWidth(boxes, padding);
        var finalW = 0;
        var finalH = 0;

        boxes.sort((a, b) => b.h - a.h);
        areas.push(createRect(0, 0, w, Number.MAX_VALUE));

        boxes.forEach(box =>
        {
            for (var i = areas.length - 1; i >= 0; i--)
            {
                var area = areas[i];

                if (box.w > area.w || box.h > area.h)
                {
                    continue;
                }

                box.x = area.x;
                box.y = area.y;

                finalH = Math.max(finalH, box.y + box.h);
                finalW = Math.max(finalW, box.x + box.w);

                if (box.w == area.w && box.h == area.h)
                {
                    var last = areas.pop();

                    if (i < areas.length)
                    {
                        areas.set(i, last);
                    }
                }
                else if (box.h == area.h)
                {
                    area.x += box.w;
                    area.w -= box.w;

                }
                else if (box.w == area.w)
                {
                    area.y += box.h;
                    area.h -= box.h;

                }
                else
                {
                    areas.push(createRect(area.x + box.w, area.y, area.w - box.w, box.h));

                    area.y += box.h;
                    area.h -= box.h;
                }

                break;
            }
        });

        /* Remove padding from boxes and add them to the final area */
        if (padding != 0)
        {
            boxes.forEach(glyph =>
            {
                glyph.w -= padding;
                glyph.h -= padding;
                glyph.x += padding;
                glyph.y += padding;
            });

            finalW += padding;
            finalH += padding;
        }

        return [finalW, finalH];
    }

    function getInitialWidth(glyphs, padding)
    {
        var totalArea = 0;
        var maxW = 0;

        glyphs.forEach(box =>
        {
            box.w += padding;
            box.h += padding;

            totalArea += box.w * box.h;
            maxW = Math.max(maxW, box.w);
        });

        return Math.max(Math.ceil(Math.sqrt(totalArea)), maxW);
    }

    function calculateRects()
    {
        var rects = [];

        Texture.all.forEach(t =>
        {
            var rect = createRect(0, 0, t.width, t.height);

            rect.texture = t;

            rects.push(rect);
        });

        var size = packBoxes(rects, 1);
        var width = size[0];
        var height = size[1];

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

        rects.forEach(rect => drawToCanvas(c, rect));

        const config = {
            type: 'image/png' 
        };

        offscreen.convertToBlob(config).then(blob => {
            var reader = new FileReader();
            
            reader.readAsDataURL(blob);
            reader.onloadend = () => replaceTextures(rects, reader.result, data.w, data.h);
        });
    }

    function drawToCanvas(c, rect)
    {
        c.drawImage(rect.texture.img, rect.x, rect.y);
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
        texture.uv_width = w;
        texture.uv_height = h;

        console.log(texture, texture.uv_width, texture.uv_height, data.w, data.h);

        Cube.all.forEach(cube => 
        {
            var toApplySides = [];

            sides.forEach(side =>
            {
                var face = cube.faces[side];
                var rect = getRect(face.texture);

                if (rect !== null)
                {
                    var mx = rect.texture.width / rect.texture.uv_width;
                    var my = rect.texture.height / rect.texture.uv_height;

                    face.uv[0] = face.uv[0] * mx + rect.x;
                    face.uv[1] = face.uv[1] * my + rect.y;
                    face.uv[2] = face.uv[2] * mx + rect.x;
                    face.uv[3] = face.uv[3] * my + rect.y;

                    if (face.texture !== false)
                    {
                        toApplySides.push(side);
                    }
                }
            });

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
                        var mx = rect.texture.width / rect.texture.uv_width;
                        var my = rect.texture.height / rect.texture.uv_height;

                        uv[0] = uv[0] * mx + rect.x;
                        uv[1] = uv[1] * my + rect.y;

                        applied = true;
                    });
                });

                if (applied)
                {
                    mesh.applyTexture(texture, true);
                }
            });
        }

        Undo.finishEdit('finished stitching');
    }

    Plugin.register('texture_stitcher', {
        title: 'Texture Stitcher',
        author: 'McHorse',
        description: 'Adds a menu item to textures editor that stitches multiple textures into one',
        icon: 'fa-compress-arrows-alt',
        version: '1.0.4',
        min_version: "4.8.0",
        tags: ["Texture"],
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