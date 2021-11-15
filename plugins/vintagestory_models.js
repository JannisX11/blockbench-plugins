(function(){
    let exportVsAction;
    Plugin.register('vintagestory_models', {
        title: 'Vintage Story Models',
        icon: 'park',
        author: 'Malik12tree',
        description: 'Allows to export VintageStory models.',
        version: '1.0.0',
        variant: "both",
        onload() {
            exportVsAction = new Action("exportVsModel", {
                name: "Export Vintage Story Model",
                icon: "park",
                click: function(){
                    const worldcenter = Format.name === "Java Block/Item" ? 0: 8;
                    let VSjson = {
                        textureWidth: Project.texture_width,
                        textureHeight: Project.texture_height,
                        textureSizes: {
                        },
                        textures: {
                        },
                        elements: [
                        ],
                        animations:[
                        ]
                    };
                    //textures
                    if (Project.textures.length > 0) {
                        let TFS = "" // Texture Folder Suffix
                        for (let i = 0; i < Project.textures.length; i++) {
                            eval(`VSjson.textureSizes["${Project.textures[i].id}"] = [${Project.textures[i].width}, ${Project.textures[i].height}]`)
                            if (Project.textures[i].folder) {
                                TFS = "/";
                            } else {
                                TFS = "";
                            }
                            eval(`VSjson.textures["${Project.textures[i].id}"] = "${(Project.textures[i].folder + TFS) + (Project.textures[i].name).replace(".png", "")}"`)
                        }
                    }
                    //elements
                    let elemALL = [];
                    let axis = ["x", "y", "z"];
                    let faces = ["north","east","south","west","up","down",]
                    let channels = ["rotation", "position", "scale"];
                    for (let i = 0; i < Group.all.length; i++) {
                        let elem = {
                            name:           Group.all[i].name,
                            rotationOrigin: [Group.all[i].origin[0]+worldcenter,Group.all[i].origin[1],Group.all[i].origin[2]+worldcenter],
                            from:           [0,0,0],
                            to:             [0,0,0],
                            parent:         Group.all[i].parent === "root" ? null : Group.all[i].parent.name,
                            faces:          {north: {    texture: "#", uv: [ 0,0,0,0 ] },east: {     texture: "#", uv: [ 0,0,0,0 ] },south: {    texture: "#", uv: [ 0,0,0,0 ] },west: {     texture: "#", uv: [ 0,0,0,0 ] },up: {       texture: "#", uv: [ 0,0,0,0 ] },down: {     texture: "#", uv: [ 0,0,0,0 ] }},
                        }
                        // rotations
                        axis.forEach((axis, index) => {
                            if (Group.all[i].rotation[index] !== 0) {
                                elem["rotation" + axis.toUpperCase()] = Group.all[i].rotation[index];
                            }
                        });
                        elemALL.push(elem)

                    }
                    for (let i = 0; i < Cube.all.length; i++) {
                        let elem = {
                            name :          Cube.all[i].name + i, // index incase
                            from:           [Cube.all[i].from[0]+worldcenter,Cube.all[i].from[1],Cube.all[i].from[2]+worldcenter],
                            to:             [Cube.all[i].to[0]+worldcenter,Cube.all[i].to[1],Cube.all[i].to[2]+worldcenter],
                            rotationOrigin: [Cube.all[i].origin[0]+worldcenter,Cube.all[i].origin[1],Cube.all[i].origin[2]+worldcenter],
                            faces: {
                                north: {    texture: "#0", uv: [ 0, 0, 0, 0 ] },
                                east: {     texture: "#0", uv: [ 0, 0, 0, 0 ] },
                                south: {    texture: "#0", uv: [ 0, 0, 0, 0 ] },
                                west: {     texture: "#0", uv: [ 0, 0, 0, 0 ] },
                                up: {       texture: "#0", uv: [ 0, 0, 0, 0 ] },
                                down: {     texture: "#0", uv: [ 0, 0, 0, 0 ] }
                            },
                            parent: Cube.all[i].parent === "root" ? null : Cube.all[i].parent.name
                        };

                        //rotations
                        axis.forEach((axis, index) => {
                            if (Cube.all[i].rotation[index] !== 0) {
                                elem["rotation" + axis.toUpperCase()] = Cube.all[i].rotation[index];
                            }
                        });

                        //faces
                        faces.forEach(face => {
                            if (Project.textures.length > 0) {
                                if (!Format.single_texture) {
                                    if (Project.textures.find(e => e.uuid == Cube.all[i].faces[face].texture) !== false) {
                                        elem.faces[face].texture = "#" + Project.textures.find(e => e.uuid == Cube.all[i].faces[face].texture).id;
                                    } else {
                                        elem.faces[face].texture = "#missing";
                                    }   

                                } else {
                                    elem.faces[face].texture = "#" + Project.textures[0].id;
                                }
                            }
                            elem.faces[face].autoUv = Project.box_uv;
                            elem.faces[face].uv = [Cube.all[i].faces[face].uv[0],Cube.all[i].faces[face].uv[1],Cube.all[i].faces[face].uv[2],Cube.all[i].faces[face].uv[3]];
                            if (Cube.all[i].faces[face].rotation !== 0) {
                                elem.faces[face].rotation = Cube.all[i].faces[face].rotation;
                            }
                        });

                        // VSjson.elements.push(elem);
                        elemALL.push(elem);
                    }
                    VSjson.elements = list_to_tree(elemALL);

                    //Animation
                    if (Format.animation_mode) {
                        for (let i = 0; i < Animation.all.length; i++) {
                            const snap_time = (1/Math.clamp(Animation.all[i].snapping, 1, 120)).toFixed(4)*1;
                            // console.log(snap_time);

                            let animators = []
                            Object.keys(Animation.all[i].animators).forEach(key => {
                                animators.push(Animation.all[i].animators[key]);
                            });
                            let anim = {
                                name: Animation.all[i].name,
                                code: (Animation.all[i].name).toLowerCase().replace(" ", "_"),
			                    onActivityStopped: "EaseOut",
                                onAnimationEnd: "Repeat",
                                quantityframes: (Animation.all[i].length*30).toFixed()*1,
                                keyframes: [
                                ],
                            }
                            animators.forEach(animator => {
                                // loop mode
                                if (animator.animation.loop === "hold") {
                                    anim.onAnimationEnd = "Hold"
                                } else if (animator.animation.loop === "once"){
                                    anim.onAnimationEnd = "Stop"
                                }

                                // keyframes

                                //gather
                                let newKfs  = [];
                                channels.forEach(channel => {
                                    if (animator.group !== undefined && animator[channel].length > 0) {
                                        var keyframes_sorted = animator[channel].slice().sort((a, b) => a.time - b.time);
                                        for (let k = 0; k <= keyframes_sorted.last().time + 0.5; k+=snap_time) {
                                            const timeIndex = Math.trunc(k*10000)/10000;

                                            //target kf
                                            const findingKF = animator[channel].find(kf => getRangeBool(kf.time, timeIndex-.02, timeIndex+.02));
                                            if(findingKF !== undefined){

                                                const tIndex = newKfs.findIndex(e => e.find(f => f.time == findingKF.time));
                                                if (tIndex !== -1) {
                                                    newKfs[tIndex].push(findingKF);
                                                } else {
                                                    newKfs.push([findingKF]);
                                                }
                                            }
                                        }
                                    }
                                });
                                newKfs.forEach((frame, indexf) => {
                                    let keyframe = {
                                        frame: ((frame[0].time*30).toFixed()*1),
                                        elements: {
                                        }
                                    }
                                    const groupC = [animator.group]

                                    for (let g = 0; g < groupC.length; g++) {
                                        let elemA = {};

                                        if (animator.keyframes.length > 0) {
                                            frame.forEach(kf => {
                                                axis.forEach(a => {
                                                    elemA[kf.channel.replace("position", "offset").replace("scale", "stretch") + a.toUpperCase()] = kf.data_points[0][a]*1;
                                                });
                                            });
                                            // 30 is fps VS uses for anims
                                            if (anim.keyframes.find(e => e.frame === (frame[0].time*30).toFixed()*1) !== undefined) {
                                                anim.keyframes.find(e => e.frame === (frame[0].time*30).toFixed()*1).elements[groupC[g].name] = elemA;
                                            } else {
                                                keyframe.elements[groupC[g].name] = elemA;
                                            }
                                        }
                                    }
                                    if (anim.keyframes.find(e => e.frame === (frame[0].time*30).toFixed()*1) === undefined) {
                                        anim.keyframes.push(keyframe);
                                    }
                                });
                            });
                            anim.keyframes.sort((a, b) => a.frame - b.frame);
                            VSjson.animations.push(anim)
                        }
                    }
                    if (isApp) {
                            Blockbench.export({
                                type: 'VintageStory Model',
                                extensions: ['json'],
                                name: (Project.name !== '' ? Project.name: "model"),
                                content: autoStringify(VSjson),
                                savetype: 'json'
                            });
                    } else{
                        var blob = new Blob([autoStringify(VSjson)], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, (Project.name !== '' ? Project.name: "model") + ".json");
                    }
                    console.log(VSjson);
                }
            })
            MenuBar.addAction(exportVsAction, "file.export");
        },
        onunload() {
            exportVsAction.delete();
        }
    });
    
function getRangeBool(x, min, max) {
    return x >= min && x <= max;
}


function list_to_tree(list) {
    var map = {}, node, roots = [], i;
    
    for (i = 0; i < list.length; i ++) {
      map[list[i].name] = i;
      list[i].children = [];
    }
    
    for (i = 0; i < list.length; i ++) {
      node = list[i];
      if (node.parent !== null) {
        list[map[node.parent]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
})()