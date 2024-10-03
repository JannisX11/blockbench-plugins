export function dictFromTexture(image, ns, name){
    var ret = ""
    Texture.all.forEach(function(tx){
        if ((tx.name == image) || (image == "particle" && tx.particle == true)){
            if (tx.namespace == ""){
                ret = ns + ":blocks/" + name + "_" + cleanFileName(tx.name.split(".")[0])
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