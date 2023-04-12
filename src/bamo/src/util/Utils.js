export function imageNameToTexture(namespace, type, image){
    var nm = ""
    if (image.name){
        nm = cleanFileName(image.name.split(".")[0])
    }else{
        nm = cleanFileName(image.split(".")[0])
    }
    return namespace + ":" + type + "/" + nm
}

export function dictFromTexture(image, ns){
    var ret = ""
    Texture.all.forEach(function(tx){
        if ((tx.name == image) || (image == "particle" && tx.particle == true)){
            if (tx.namespace == ""){
                ret = ns + ":blocks/" + cleanFileName(tx.name.split(".")[0])
            }else{
                ret = tx.namespace + ":" + tx.folder + "/" + cleanFileName(tx.name.split(".")[0])
            }
        }
    })

    return ret
}

export function cleanFileName(name){
    return name.replace(/[^a-zA-Z\d\s._]/g, '').replace(/\s+/g, "_").toLowerCase()
}