export function genLootTable(namespace, block){

        return  `{
    "type": "minecraft:block",
    "pools": [
        {
            "rolls": 1,
            "entries": [
                {
                    "type": "minecraft:item",
                    "name": "${namespace}:${block}"
                }
            ],
            "conditions": []
        }
    ]
}`

}

export function genMineableTag(namespace, block, variants){
    if (variants.length == 0){
        return `{
    "replace": false,
    "values": [
        "${namespace}:${block}"
    ]
}`

    }else{

        var tagValues = [`${namespace}:${block}`]
        variants.forEach(function(v){
            tagValues.push(`${namespace}:${block}_${v}`)
        })

        var data = {
            "replace": false,
            "values": tagValues
        }

        return JSON.stringify(data)
    }
    
}

export function genStonecuttingRecipes(properties, blockName, dataFolder, zip){
    console.log(properties)
    if (properties.genScRecipe){
        var stData = genStonecuttingRecipe(properties.namespace, blockName)
        var stDir = dataFolder + properties.namespace + "\\recipes\\"

        fs.mkdirSync(stDir, {recursive: true})
        fs.writeFile(stDir + blockName + ".json", stData, "utf8", err => {if (err != null) {console.log("Error found when writing custom block stonecutting recipe:", err)}});
        zip.file("data/" + properties.namespace + "/recipes/" + blockName + ".json", stData)
    }

    if (properties.genReversableScRecipe){
        var stData = genStonecuttingReverseRecipe(properties.namespace, blockName)
        var stDir = dataFolder + properties.namespace + "\\recipes\\"

        fs.mkdirSync(stDir, {recursive: true})
        fs.writeFile(stDir + blockName + "_rv.json", stData, "utf8", err => {if (err != null) {console.log("Error found when writing custom block stonecutting recipe:", err)}});
        zip.file("data/" + properties.namespace + "/recipes/" + blockName + "_rv.json", stData)
    }


    
}

export function genStonecuttingRecipe(namespace, block){
    return `
    {
        "type": "minecraft:stonecutting",
        "ingredient": {
            "item": "bamo:bamo_crate"
        },
        "result": "${namespace}:${block}",
        "count": 1
    }`
}

export function genStonecuttingReverseRecipe(namespace, block){
    return `
    {
        "type": "minecraft:stonecutting",
        "ingredient": {
            "item": "${namespace}:${block}"
        },
        "result": "bamo:bamo_crate",
        "count": 1
    }`
}