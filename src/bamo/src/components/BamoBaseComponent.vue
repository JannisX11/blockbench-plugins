<script>
import { rotationTypes, soundOptions, materialOptions, transparencyOptions, tabOptions, particleOptions, customTypeOptions } from '../util/OptionArrays.js';
import {genWallState, genStairState} from '../util/GenStates.js'
import {genLootTable, genMineableTag, genStonecuttingRecipes} from '../util/GenDataFiles.js'
import {dictFromTexture, cleanFileName} from '../util/Utils.js'
import bamoSettings, { BAMO_SETTINGS_DEFAULT } from "../util/Settings.js";
import BamoAdvancedProperties from './BamoAdvancedProperties.vue';

export default {
    components: {BamoAdvancedProperties},
    data() {
        return {
            step: "start",
            error: "",

            rotationTypes: rotationTypes,
            soundOptions: soundOptions,
            materialOptions: materialOptions,
            transparencyOptions: transparencyOptions,
            tabOptions: tabOptions,
            particleOptions: particleOptions,
            customTypeOptions: customTypeOptions,
            
            properties: BAMO_SETTINGS_DEFAULT,

            lastID: "",
            swap: false
        }
    },
    methods: {

        updateValues(){
            
            if (Project.uuid != this.lastID){
                this.properties = bamoSettings[Project.uuid];
                this.lastID = Project.uuid;
                this.swap = true;
                this.reset(null);
            }

            // Initialize the textures if not done so yet
            if (this.properties.variant.default.all == "") {
                this.properties.variant.default.all = Texture.all[0].name;
                this.properties.variant.stair.top = Texture.all[0].name;
                this.properties.variant.stair.bottom = Texture.all[0].name;
                this.properties.variant.stair.side = Texture.all[0].name;
                this.properties.variant.slab.top = Texture.all[0].name;
                this.properties.variant.slab.bottom = Texture.all[0].name;
                this.properties.variant.slab.side = Texture.all[0].name;
                this.properties.variant.wall.wall = Texture.all[0].name;
            }
        },

        Textures(){
            return Texture.all
        },

        changePage(event, page){
            if (this.properties.displayName == ""){
                this.error = "name"
            }else{

                if ((this.step == "types" && page == "physical") || (this.step == "physical" && page == "types")){
                    if (this.properties.types.block) {page = "variant"}
                }

                this.error = ""
                this.step = page
            }
        },

        toggleType(event, type){
            
            if (this.properties.types.custom && type=="custom"){
                this.properties.types.block = false
                this.properties.types.stair = false
                this.properties.types.slab = false
                this.properties.types.wall = false
                return
            }

            if (this.properties.types.block && type=="block"){
                this.properties.types.custom = false
                return
            }
        },

        reset(event){
            this.error = ""
            this.step = "start"
        },

        createJSON(event){

            // Ensure a name is set
            if (this.properties.displayName == ""){
                this.error = "name";
                return;
            }

            // Ensure a particle texture is set
            var part = false
            Texture.all.forEach(function(tx){
                if (tx.particle == true){
                    part = true
                }
            })

            if (part == false){
                Blockbench.showMessageBox({buttons: ["Ok"], title: "Error", message: "Please ensure you have set a particle texture"});
                return;
            }

            var zip = new JSZip();

            // Trim invalid chars from the name
            var packName = cleanFileName(this.properties.displayName);

            // Define folder locations
            var objFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\objects\\";
            var blockstatesFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\blockstates\\";
            var blockModelsFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\models\\block\\";
            var itemModelsFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\models\\item\\";
            var blockTexturesFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\textures\\blocks\\";
            var dataFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\data\\";

            // Create the folders if they dont exist
            var folderList = [objFolder, blockstatesFolder, blockModelsFolder, itemModelsFolder, blockTexturesFolder, dataFolder];
            var fs = require('fs');

            folderList.forEach(function(folder){
                if (!fs.existsSync(folder)){
                    fs.mkdirSync(folder, {recursive: true});
                }
            })

            // Create mcmeta file
            var mcmetaData = {"pack" : {"pack_format" : 6, "description" : "Resource Pack for BAMO test files"}};
            fs.writeFile(settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\pack.mcmeta", JSON.stringify(mcmetaData), "utf8", (err) => {if (err != null) {console.log("Error generating mcmeta file:", err);}});
            zip.file("pack.mcmeta", JSON.stringify(mcmetaData))

            // Generate block name from the displayname
            var blockName = cleanFileName(this.properties.displayName);

            //generate the list of blocks to be exported
            var blockList = [];

            var codecData = Format.codec.compile();

            // Custom Block
            if (this.properties.types.custom){
                // Pull the model data from the codec
                var modelData = JSON.parse(codecData);
                modelData["parent"] = "block/block";

                var stateData = "";
                // Create blockstates data
                if (this.properties.rotType == "y_axis"){
                    stateData = JSON.stringify({"variants" : {"facing=north" : {"model" : this.properties.namespace + ":block/" + blockName},
                                                                "facing=east" : {"model" : this.properties.namespace + ":block/" + blockName, "y": 90},
                                                                "facing=south" : {"model" : this.properties.namespace + ":block/" + blockName, "y": 180},
                                                                "facing=west" : {"model" : this.properties.namespace + ":block/" + blockName, "y": 270},
                                                                }})
                }else{
                    stateData = JSON.stringify({"variants" : {"" : {"model" : this.properties.namespace + ":block/" + blockName}}});
                }
                
                var textureData = {}

                // Setup texture dict
                ns = this.properties.namespace
                Object.keys(modelData.textures).forEach((key) => {
                    var comp
                    var partCheck
                    if (typeof modelData.textures[key] === 'object'){
                        comp = modelData.textures[key]["id"]
                        partCheck = modelData.textures[key].particle
                    }else if (typeof modelData.textures[key] === 'string'){
                        comp = key
                        partCheck = (key == "particle")
                    }

                    Texture.all.forEach(function(tx){
                        if ((tx.id == comp) || (partCheck && tx.particle == true)){
                            if (tx.namespace == ""){
                                textureData[key] = ns + ":blocks/" + cleanFileName(tx.name.split(".")[0]);
                            }else{
                                textureData[key] = tx.namespace + ":" + tx.folder + "/" + cleanFileName(tx.name.split(".")[0])
                            } 
                        }
                    })
                })

                // Looting file
                var lootData = genLootTable(this.properties.namespace, blockName)
                var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + blockName + ".json"

                fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {recursive: true});
                fs.writeFile(lootTags, lootData, "utf8", err => {if (err != null) {console.log("Error found when writing custom block looting file:", err)}});
                zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/"+ blockName + ".json", lootData)

                // Stonecutting Table Recipes
                genStonecuttingRecipes(this.properties, blockName, dataFolder, zip)

                modelData.textures = textureData

                var boxList = [];
                modelData.elements.forEach((model) =>{
                    boxList.push([model["from"], model["to"]]);
                });

                blockList.push({"name": blockName, "types": [], "model": modelData, "state": stateData, "hitbox": boxList});
            }

            // Regular Block
            if (this.properties.types.block){
                var modelData = {};
                modelData["credit"] = codecData["credit"];
                modelData["parent"] = "block/cube_all";
                modelData["textures"] = {
                    "all": dictFromTexture(this.properties.variant.default.all, this.properties.namespace),
                    "particle": dictFromTexture("particle", this.properties.namespace)
                };

                // Looting file
                var lootData = genLootTable(this.properties.namespace, blockName)
                var lootTags = dataFolder + this.properties.namespace  + "\\loot_tables\\blocks\\" + blockName + ".json"

                fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {recursive: true});
                fs.writeFile(lootTags, lootData, "utf8", err => {if (err != null) {console.log("Error found when writing wall tags:", err)}});
                zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/" + blockName + ".json", lootData)

                // Stonecutting Table Recipes
                genStonecuttingRecipes(this.properties, blockName, dataFolder, zip)

                var state = JSON.stringify({"variants": {"": {"model": this.properties.namespace + ":block/" + blockName}}});

                var typeList = [];
                if (this.properties.types.stair) typeList.push("stairs");
                if (this.properties.types.slab) typeList.push("slab");
                if (this.properties.types.wall) typeList.push("wall");

                blockList.push({"name": blockName, "types": typeList, "state": state, "model": modelData, "hitbox": []});
            }

            // Stair Block
            if (this.properties.types.stair){

                var name = blockName + "_stairs";

                var modelData = {};
                modelData["credit"] = codecData["credit"];
                modelData["parent"] = "minecraft:block/stairs";
                modelData["textures"] = {
                    "top": dictFromTexture(this.properties.variant.stair.top, this.properties.namespace),
                    "bottom": dictFromTexture(this.properties.variant.stair.bottom, this.properties.namespace), 
                    "side": dictFromTexture(this.properties.variant.stair.side, this.properties.namespace),
                    "particle": dictFromTexture("particle", this.properties.namespace)
                };


                // Looting file
                var lootData = genLootTable(this.properties.namespace, name)
                var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + name + ".json"

                fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {recursive: true});
                fs.writeFile(lootTags, lootData, "utf8", err => {if (err != null) {console.log("Error found when writing wall tags:", err)}});
                zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/"+ name + ".json", lootData)

                // Stonecutting Table Recipes
                genStonecuttingRecipes(this.properties, name, dataFolder, zip)
                
                // Write state
                var state = genStairState(this.properties.namespace, "block/" + name, "block/" + name + "_outer", "block/" + name + "_inner")
                fs.writeFile(blockstatesFolder + "\\" + name + ".json", state, "utf8", (err) => {if (err != null) {console.log("Error generating blockstate:", err);}});
                zip.file("assets/" + this.properties.namespace + "/blockstates/" + name + ".json", state)
                // write the 4 stair models
                // Base
                fs.writeFile(blockModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + ".json", JSON.stringify(modelData))
                // Item
                fs.writeFile(itemModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing item model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/item/" + name + ".json", JSON.stringify(modelData))
                // Inner
                modelData["parent"] = "minecraft:block/inner_stairs"
                fs.writeFile(blockModelsFolder + "\\" + name + "_inner.json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_inner.json", JSON.stringify(modelData))
                // Outer
                modelData["parent"] = "minecraft:block/outer_stairs"
                fs.writeFile(blockModelsFolder + "\\" + name + "_outer.json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_outer.json", JSON.stringify(modelData))
            }

            if (this.properties.types.slab){

                var name = blockName + "_slab";

                var modelData = {};
                modelData["credit"] = codecData["credit"];
                modelData["parent"] = "minecraft:block/slab"
                modelData["textures"] = {
                    "top": dictFromTexture(this.properties.variant.slab.top, this.properties.namespace),
                    "bottom": dictFromTexture(this.properties.variant.slab.bottom, this.properties.namespace), 
                    "side": dictFromTexture(this.properties.variant.slab.side, this.properties.namespace),
                    "particle": dictFromTexture("particle", this.properties.namespace)
                }

                // Looting file
                var lootData = genLootTable(this.properties.namespace, name)
                var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + name + ".json"

                fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {recursive: true});
                fs.writeFile(lootTags, lootData, "utf8", err => {if (err != null) {console.log("Error found when writing wall tags:", err)}});
                zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/"+ name + ".json", lootData)

                // Stonecutting Table Recipes
                genStonecuttingRecipes(this.properties, name, dataFolder, zip)

                // Write State
                var state = {"variants" : {
                    "type=bottom" : {"model": this.properties.namespace + ":block/" + name}, 
                    "type=double":{"model":this.properties.namespace + ":block/" + blockName},
                    "type=top": {"model": this.properties.namespace + ":block/" + name + "_top"}
                }}
                fs.writeFile(blockstatesFolder + "\\" + name + ".json", JSON.stringify(state), "utf8", (err) => {if (err != null) {console.log("Error generating blockstate:", err);}});
                zip.file("assets/" + this.properties.namespace + "/blockstates/" + name + ".json", JSON.stringify(state))

                // Write the 3 slab models
                // Base
                fs.writeFile(blockModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + ".json", JSON.stringify(modelData))
                // Item
                fs.writeFile(itemModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing item model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/item/" + name + ".json", JSON.stringify(modelData))
                // Top
                modelData["parent"] = "minecraft:block/slab_top"
                fs.writeFile(blockModelsFolder + "\\" + name + "_top.json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_top.json", JSON.stringify(modelData))
            }

            if (this.properties.types.wall){
                var name = blockName + "_wall";

                var modelData = {};
                modelData["credit"] = codecData["credit"];
                modelData["parent"] = "minecraft:block/template_wall_post";
                modelData["textures"] = {
                    "wall": dictFromTexture(this.properties.variant.wall.wall, this.properties.namespace),
                    "particle": dictFromTexture("particle", this.properties.namespace)
                }

                // Looting file
                var lootData = genLootTable(this.properties.namespace, name)
                var lootTags = dataFolder + this.properties.namespace  + "\\loot_tables\\blocks\\" + name + ".json"

                fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {recursive: true});
                fs.writeFile(lootTags, lootData, "utf8", err => {if (err != null) {console.log("Error found when writing wall tags:", err)}});
                zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/"+ name + ".json", lootData)

                // Stonecutting Table Recipes
                genStonecuttingRecipes(this.properties, name, dataFolder, zip)

                // Write State
                var state = genWallState(this.properties.namespace, "block/" + name + "_post", "block/" + name + "_side", "block/" + name + "_side_tall")
                fs.writeFile(blockstatesFolder + "\\" + name + ".json", state, "utf8", (err) => {if (err != null) {console.log("Error generating blockstate:", err);}});
                zip.file("assets/" + this.properties.namespace + "/blockstates/" + name + ".json", state)

                // Write the 4  wall models
                // Base
                fs.writeFile(blockModelsFolder + "\\" + name + "_post.json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_post.json", JSON.stringify(modelData))
                // Item
                modelData["parent"] = "minecraft:block/wall_inventory"
                fs.writeFile(itemModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing item model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/item/" + name + ".json", JSON.stringify(modelData))
                // Side
                modelData["parent"] = "minecraft:block/template_wall_side"
                fs.writeFile(blockModelsFolder + "\\" + name + "_side.json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_side.json", JSON.stringify(modelData))
                // Side Tall
                modelData["parent"] = "minecraft:block/template_wall_side_tall"
                fs.writeFile(blockModelsFolder + "\\" + name + "_side_tall.json", JSON.stringify(modelData), "utf8", err => {if (err != null) {console.log("Error Found writing item model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_side_tall.json", JSON.stringify(modelData))

                // Deal with the tags
                var wallTags = dataFolder + "minecraft\\tags\\blocks\\walls.json"
                var tagVal = this.properties.namespace + ":" + name

                fs.mkdirSync(dataFolder + "minecraft\\tags\\blocks\\", {recursive: true});
                var tagData = {"replace" : false, "values": [tagVal]};

                fs.writeFile(wallTags, JSON.stringify(tagData), "utf8", err => {if (err != null) {console.log("Error found when writing wall tags:", err)}});
                zip.file("data/minecraft/tags/blocks/walls.json", JSON.stringify(tagData))
            }

            var modelData = JSON.parse(codecData);
            var ns = this.properties.namespace
            // Copy texture files
            Texture.all.forEach(function(tx){
                var image;
                if (tx.namespace != "minecraft"){
                    if (tx.img.currentSrc.slice(0, 4) == "data"){
                        image = nativeImage.createFromDataURL(tx.img.currentSrc).toPNG();
                    }else if(tx.img.currentSrc.slice(0, 4) == "file"){
                        image = nativeImage.createFromPath(tx.source.replace(/\?\d+$/, '')).toPNG();
                    }
        
                    fs.writeFile(blockTexturesFolder + "\\" + cleanFileName(tx.name), image, (err) => {if (err != null) {console.log("Error Found writing texture data:", err);}});
                    zip.file("assets/" + ns + "/textures/blocks/" + cleanFileName(tx.name), image)
                }
            })

            /*console.log("Block List:")
            console.log(blockList)*/

            blockList.forEach(block => {

                // Generate Mining file
                var mineableData = genMineableTag(this.properties.namespace, block["name"], block["types"])
                var mineableTags = dataFolder + "minecraft\\tags\\blocks\\mineable\\pickaxe.json"

                fs.mkdirSync(dataFolder + "minecraft\\tags\\blocks\\mineable", {recursive: true});
                fs.writeFile(mineableTags, mineableData, "utf8", err => {if (err != null) {console.log("Error found when writing wall tags:", err)}});
                zip.file("data/minecraft/tags/blocks/mineable/pickaxe.json", mineableData)

                // Write state file
                fs.writeFile(blockstatesFolder + "\\" + block["name"] + ".json", block["state"], "utf8", (err) => {if (err != null) {console.log("Error generating blockstate:", err);}});
                zip.file("assets/" + this.properties.namespace + "/blockstates/" + block["name"] + ".json", block["state"])

                // Write model files
                fs.writeFile(blockModelsFolder + "\\" + block["name"] + ".json", JSON.stringify(block["model"]), "utf8", err => {if (err != null) {console.log("Error Found writing block model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/block/" + block["name"] + ".json", JSON.stringify(block["model"]))
                fs.writeFile(itemModelsFolder + "\\" + block["name"] + ".json", JSON.stringify(block["model"]), "utf8", err => {if (err != null) {console.log("Error Found writing item model data:", err);}});
                zip.file("assets/" + this.properties.namespace + "/models/item/" + block["name"] + ".json", JSON.stringify(block["model"]))
                
                // Write block properties file
                var data = {
                    "displayName" : this.properties.displayName.replace(/[^a-zA-Z\d\s._]/g, ''), 
                    "typeList" : block["types"],
                    "material" : this.properties.material,
                    "blastRes" : this.properties.blastRes,
                    "slip" : this.properties.slip,
                    "gravity" : this.properties.gravity,
                    "rotType" : this.properties.rotType,
                    "sounds" : this.properties.sounds,
                    "lum" : this.properties.lum,
                    "maxStack" : this.properties.maxStack,
                    "fireproof" : this.properties.fireproof,
                    "creativeTab" : this.properties.creativeTab,
                    "transparency": this.properties.transparency,
                    "hitbox": block["hitbox"],
                    "hitboxBuffer": (this.properties.bufferedHitbox ? this.properties.hitboxBuffer.toString() : ""),
                    "blockType" : this.properties.types.customType,
                    "particleType": (this.properties.particles ? this.properties.particleType : ""),
                    "particlePos": [this.properties.particlePos.x / 16.0, this.properties.particlePos.y / 16.0, this.properties.particlePos.z / 16.0],
                    "particleSpread": [this.properties.particleSpread.x / 8.0, this.properties.particleSpread.y / 8.0, this.properties.particleSpread.z / 8.0],
                    "particleVel": [this.properties.particleVel.x, this.properties.particleVel.y, this.properties.particleVel.z],
                    "nameGenType" : "3.3" // Allows for names where " " is replaced with "_" to coexist with the older "" system
                };

                fs.writeFile(objFolder + "\\" + block["name"] + ".json", JSON.stringify(data), "utf8", err => {if (err != null) {console.log("Error writing block properties:", err);}});
                zip.file("objects/" + block["name"] + ".json", JSON.stringify(data))

                /*console.log("Object File Contents:")
                console.log(data)*/
            })

            zip.generateAsync({type:"nodebuffer"})
            .then(function (content) {
                fs.writeFile(settings.minecraftFolder.value + "\\bamopacks\\" + packName + ".zip", content, err => {});
            });

            fs.rm(settings.minecraftFolder.value + "\\bamopacks\\" + packName, {recursive: true}, err => {});

            console.log("BAMO data saved in folder at location " + settings.minecraftFolder.value + "\\bamopacks\\" + packName)
            

            let e = open_interface;
            e.hide();
        },
    },
    watch: {
        properties: {
            handler: function(val){
                if (this.swap == false){
                    Project.saved = false;
                }else{
                    this.swap = false
                }
            },
            deep: true
        }
    }
}
</script>

<template>
    <div>
        <BamoAdvancedProperties></BamoAdvancedProperties>
    </div>
</template>
