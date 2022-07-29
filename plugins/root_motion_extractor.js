(function() {

    const planeGeometry = new THREE.PlaneBufferGeometry(64, 64 );
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0x00FFDD,side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    var floorHeight = 0;

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = floorHeight;

    const action = new Action({
        id: 'root_motion_extractor',
        name: 'Extract Root Motion',
        icon: "fa-person-running",
        click: () => {
            scene.add( plane );
            let dia = new Dialog({
                id: 'extractor_dialog',
                title: 'Extract Root Motion',
                form : {
                    floorHeight : {label: 'Floor Height', type: 'number', value: floorHeight, step: 0.5, min: -1024.0, max: 1024.0},
                },
                onFormChange: (formData) => {
                    floorHeight = formData.floorHeight;
                    scene.remove(plane);
                    plane.position.y = floorHeight;
                    scene.add(plane);
                },
                onConfirm: (formData) => {
                    scene.remove(plane);
                    dia.hide();
                    runThroughFrames();
                },
                onCancel: () => {
                    scene.remove(plane);
                }
            }).show();
            
        }
    })

    Plugin.register("root_motion_extractor", {
        title: "Root Motion Extractor",
        icon: "fa-exchange",
        author: "Tschipp",
        description: "Attempts to extract root motion from an animation",
        version: "1.0.0",
        tags: ["Minecraft: Bedrock Edition"],
        onload() {
            Blockbench.on("select_mode", (event) => {
                if (event.mode.name != "Animate")
                    scene.remove( plane );
            });

            Blockbench.on("display_animation_frame", onAnimFrame);

            MenuBar.addAction(action, 'animation');
        },
        onunload() {
            Blockbench.removeListener("select_mode");
            Blockbench.removeListener("display_animation_frame", onAnimFrame);
            action.delete();
        }
    });

    
    var oldSpheres = [];

    function findFloorContacts(frame, previousContacts)
    {
        let contacts = {};
        for(let sp of oldSpheres)
            scene.remove(sp);
        oldSpheres = [];

        Outliner.root.forEach(root => {
            if (root instanceof Group)
                root.forEachChild(child => {
                    //Threejs mesh
                    let mesh = child.getMesh();
                    //get the vertices in world space and print their coordinates
                    let vertices = mesh.geometry.attributes.position;
                    let cubeid = mesh.geometry.uuid;
                    let positions = [];
                    for (let i = 0; i < vertices.count; i += vertices.itemSize) {
                        let pos = new THREE.Vector3(vertices.array[i], vertices.array[i + 1], vertices.array[i + 2]);
                        pos.applyMatrix4(mesh.matrixWorld);
                        positions.push({[cubeid + "_" + i] : pos});

                        //remder a sphere at the vertex
                        if(pos.y < floorHeight)
                        {
                            let sphereGeometry = new THREE.SphereGeometry(0.3, 8, 8);
                            let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x00FF11, transparent: true, opacity: 0.5});
                            let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                            sphere.position.copy(pos);
                            scene.add(sphere);
                            oldSpheres.push(sphere);
                        }  
                    }

                    let cFilter = (contact) => {
                        let vertId = Object.keys(contact)[0];
                        let lastContact = undefined;

                        for(let k in previousContacts) {
                            let conts = previousContacts[k];
                            for(let c of conts) {
                                if(vertId === Object.keys(c)[0]) {
                                    lastContact = c;
                                }
                            }

                        }

                        if(lastContact) {

                            let y = lastContact[vertId].y;
                            let res = false;
                            if(y < floorHeight)
                                res = contact[vertId].y >= floorHeight;
                            else
                                res = contact[vertId].y < floorHeight;

                            return res;
                        }

                        return contact[vertId].y < floorHeight;
                    };


                    let filtered = positions.filter(cFilter);
                    if(filtered.length > 0)
                    {
                        let cont = contacts[frame];
                        if(!cont)
                            cont = [];

                        cont.push(...filtered);
                        contacts[frame] = cont;
                    }

                }, Cube, false);
        });

        return contacts;
    }

    var processingMotion = false;
    var processedContacts = {}
    var motionData = {};

    function runThroughFrames() {
        if(Animator.selected)
        {
            processedContacts = {};
            console.log("Extracting root motion...");
            Timeline.time = 0;
            Timeline.start();

            processingMotion = true;
        }
    }

    

    function onAnimFrame()
    {
        if(processingMotion)
        {
            if(Timeline.time >= Timeline.animation_length)
            {
                console.log("Finished processing motion");
                Blockbench.showQuickMessage('Finished extracting root motion');
                processingMotion = false;
                console.log(processedContacts);
                processMotionData();
                // await Timeline.pause();
                return;
            }

            let res = findFloorContacts(Timeline.time, processedContacts);
            processedContacts = Object.assign(processedContacts, res);
        }
        
    }

    function processMotionData() {
        motionData = {};

        let temp = {};

        for(let frame in processedContacts)
        {
            let contacts = processedContacts[frame];
            for(let contact of contacts)
            {
                let key = Object.keys(contact)[0];
                if(temp[key])
                {
                    let prev = motionData[key];
                    if(!prev)
                        prev = [];

                    prev.push({
                        startTime : temp[key].frame,
                        endTime : frame,
                        startPos : temp[key][key],
                        endPos : contact[key]
                    });

                    motionData[key] = prev;
                    delete temp[key];
                }
                else
                {
                    temp[key] = {...contact, frame: frame};
                }
            }
        }

        console.log(motionData);
        computeAverageRootMotion();
    }

    function computeAverageRootMotion()
    {
        let size = 0;
        for(let key in motionData)
        {
            let data = motionData[key];
            size += data.length;
        }

        let factor = 1.0 / size;

        let avgSpeed = 0;

        for(let key in motionData)
        {
            let data = motionData[key];
            for(let d of data)
            {
                let diff = d.endPos.clone().sub(d.startPos);
                diff.y = 0;
                let timeDiff = d.endTime - d.startTime;
                avgSpeed += factor * (diff.length() / timeDiff);
            }
        }

        for(let old of oldSpheres)
            scene.remove(old);

        let statsDialog = new Dialog({
            id: 'stats_dialog',
            title: 'Root Motion Statistics',
            onConfirm: () => {
                Timeline.pause();
                statsDialog.hide();
            },
            onCancel: () => {
                Timeline.pause();
            },
            lines : [`<p>Average speed (pixels/s): ${avgSpeed.toFixed(5)}</p>`,
                     `<p>Average speed (m/s): ${(avgSpeed / 16.0).toFixed(5)}</p>`,
                     `<p>Movement Component Speed: ${((avgSpeed / 16.0) / (6.6 * Math.sqrt((avgSpeed / 16.0)))).toFixed(5)}</p>`]
        }).show();
    }

    

})();