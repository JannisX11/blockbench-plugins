export function genStairState(namespace, model, outer, inner){
    return `
    {
        "variants": {
            "facing=east,half=bottom,shape=straight": { "model": "${namespace}:${model}" },
            "facing=west,half=bottom,shape=straight": { "model": "${namespace}:${model}", "y": 180, "uvlock": true },
            "facing=south,half=bottom,shape=straight": { "model": "${namespace}:${model}", "y": 90, "uvlock": true },
            "facing=north,half=bottom,shape=straight": { "model": "${namespace}:${model}", "y": 270, "uvlock": true },

            "facing=east,half=top,shape=straight": { "model": "${namespace}:${model}", "x": 180, "uvlock": true },
            "facing=west,half=top,shape=straight": { "model": "${namespace}:${model}", "x": 180, "y": 180, "uvlock": true },
            "facing=south,half=top,shape=straight": { "model": "${namespace}:${model}", "x": 180, "y": 90, "uvlock": true },
            "facing=north,half=top,shape=straight": { "model": "${namespace}:${model}", "x": 180, "y": 270, "uvlock": true },
            
            "facing=east,half=bottom,shape=outer_right": { "model": "${namespace}:${outer}" },
            "facing=west,half=bottom,shape=outer_right": { "model": "${namespace}:${outer}", "y": 180, "uvlock": true },
            "facing=south,half=bottom,shape=outer_right": { "model": "${namespace}:${outer}", "y": 90, "uvlock": true },
            "facing=north,half=bottom,shape=outer_right": { "model": "${namespace}:${outer}", "y": 270, "uvlock": true },

            "facing=east,half=bottom,shape=outer_left": { "model": "${namespace}:${outer}", "y": 270, "uvlock": true },
            "facing=west,half=bottom,shape=outer_left": { "model": "${namespace}:${outer}", "y": 90, "uvlock": true },
            "facing=south,half=bottom,shape=outer_left": { "model": "${namespace}:${outer}" },
            "facing=north,half=bottom,shape=outer_left": { "model": "${namespace}:${outer}", "y": 180, "uvlock": true },

            "facing=east,half=bottom,shape=inner_right": { "model": "${namespace}:${inner}" },
            "facing=west,half=bottom,shape=inner_right": { "model": "${namespace}:${inner}", "y": 180, "uvlock": true },
            "facing=south,half=bottom,shape=inner_right": { "model": "${namespace}:${inner}", "y": 90, "uvlock": true },
            "facing=north,half=bottom,shape=inner_right": { "model": "${namespace}:${inner}", "y": 270, "uvlock": true },

            "facing=east,half=bottom,shape=inner_left": { "model": "${namespace}:${inner}", "y": 270, "uvlock": true },
            "facing=west,half=bottom,shape=inner_left": { "model": "${namespace}:${inner}", "y": 90, "uvlock": true },
            "facing=south,half=bottom,shape=inner_left": { "model": "${namespace}:${inner}" },
            "facing=north,half=bottom,shape=inner_left": { "model": "${namespace}:${inner}", "y": 180, "uvlock": true },
           
            "facing=east,half=top,shape=outer_left": { "model": "${namespace}:${outer}", "x": 180, "uvlock": true },
            "facing=west,half=top,shape=outer_left": { "model": "${namespace}:${outer}", "x": 180, "y": 180, "uvlock": true },
            "facing=south,half=top,shape=outer_left": { "model": "${namespace}:${outer}", "x": 180, "y": 90, "uvlock": true },
            "facing=north,half=top,shape=outer_left": { "model": "${namespace}:${outer}", "x": 180, "y": 270, "uvlock": true },

            "facing=east,half=top,shape=outer_right": { "model": "${namespace}:${outer}", "x": 180, "y": 90, "uvlock": true },
            "facing=west,half=top,shape=outer_right": { "model": "${namespace}:${outer}", "x": 180, "y": 270, "uvlock": true },
            "facing=south,half=top,shape=outer_right": { "model": "${namespace}:${outer}", "x": 180, "y": 180, "uvlock": true },
            "facing=north,half=top,shape=outer_right": { "model": "${namespace}:${outer}", "x": 180, "uvlock": true },

            "facing=east,half=top,shape=inner_left": { "model": "${namespace}:${inner}", "x": 180, "uvlock": true },
            "facing=west,half=top,shape=inner_left": { "model": "${namespace}:${inner}", "x": 180, "y": 180, "uvlock": true },
            "facing=south,half=top,shape=inner_left": { "model": "${namespace}:${inner}", "x": 180, "y": 90, "uvlock": true },
            "facing=north,half=top,shape=inner_left": { "model": "${namespace}:${inner}", "x": 180, "y": 270, "uvlock": true },

            "facing=east,half=top,shape=inner_right": { "model": "${namespace}:${inner}", "x": 180, "y": 90, "uvlock": true },
            "facing=west,half=top,shape=inner_right": { "model": "${namespace}:${inner}", "x": 180, "y": 270, "uvlock": true },
            "facing=south,half=top,shape=inner_right": { "model": "${namespace}:${inner}", "x": 180, "y": 180, "uvlock": true },
            "facing=north,half=top,shape=inner_right": { "model": "${namespace}:${inner}", "x": 180, "uvlock": true }
        }
    }`
}

export function genWallState(namespace, post, side, tall){
    return `{
        "multipart":[
            {"when":{"up":"true"},"apply":{"model":"${namespace}:${post}"}},
            {"when":{"north":"low"},"apply":{"model":"${namespace}:${side}","uvlock":true}},
            {"when":{"east":"low"},"apply":{"model":"${namespace}:${side}","y":90,"uvlock":true}},
            {"when":{"south":"low"},"apply":{"model":"${namespace}:${side}","y":180,"uvlock":true}},
            {"when":{"west":"low"},"apply":{"model":"${namespace}:${side}","y":270,"uvlock":true}},
            {"when":{"north":"tall"},"apply":{"model":"${namespace}:${tall}","uvlock":true}},
            {"when":{"east":"tall"},"apply":{"model":"${namespace}:${tall}","y":90,"uvlock":true}},
            {"when":{"south":"tall"},"apply":{"model":"${namespace}:${tall}","y":180,"uvlock":true}},
            {"when":{"west":"tall"},"apply":{"model":"${namespace}:${tall}","y":270,"uvlock":true}}
        ]
    }`
}