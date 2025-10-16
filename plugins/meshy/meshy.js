(function() {
    const pluginInfo = {"name":"Meshy","id":"meshy","version":"1.0.5","repository":"https://github.com/Shadowkitten47/Meshy"};
    
    const pluginSettings = [
        {
            id: 'meshy_normalized_mesh_uvs',
            name: 'Normalize Mesh UVs',
            description: 'Normalize UVs of polymeshes',
            category: 'export',
            value: true,
            plugin: pluginInfo.id,
        },
        {
            id: 'meshy_skip_mesh_normals',
            name: 'Skip Mesh Normals',
            description: 'Skips normal claculation on polymeshes',
            category: 'export',
            value: false,
            plugin: pluginInfo.id,
        },
        {
            //Force disable single texture on bedrock formats having more than one texture with meshes is pretty useful
            id: 'meshy_force_textures',
            name: 'Force Multi-Textures',
            description: 'Forces bedrock formats to use allow more than one texture ( You will need to stitch the textures )',
            category: 'edit',
            value: false,
            plugin: pluginInfo.id,
            onChange: (value) => {
                Formats['bedrock'].single_texture = !value;
                Formats['bedrock_old'].single_texture = !value;
            },
        },
    ];
    
    //Function names for events to remove
    const listOfFunctions = [ meshyOnParseEvent.name, meshyOnCompileEvent.name, meshyOnBedrockCompileEvent.name];
    
    Plugin.register(pluginInfo.id, {
        title: pluginInfo.name, //Meshy
        author: 'Shadowkitten47',
        creation_date: '2024-09-28',
        icon: 'diamond',
        description: 'Enables the use of a meshes in bedrock formats and to export them to Minecraft Bedrock',
        variant: 'both',
        version: pluginInfo.version, //1.0.4
        tags: ['Minecraft: Bedrock Edition', 'Entity Models', 'Mesh'],
        has_changelog: true,
        min_version: '4.10.4',
        repository: pluginInfo.repository, //Link
        onload() {
            let bedrock_old = Formats['bedrock_old'];
            let bedrock = Formats['bedrock'];
            bedrock.meshes = true;
            bedrock_old.meshes = true;
            for (let s of pluginSettings) {
                if (!settings[s.id]) {
                    new Setting(s.id, s);
                }
            }
            bedrock.single_texture = !settings['meshy_force_textures']?.value;
            bedrock_old.single_texture = !settings['meshy_force_textures']?.value;
    
            let codec = Codecs['bedrock'];
            purgeEvents(codec); //Removes all of events that match the function names used so that duplicates don't occur
    
            codec.on('parsed', meshyOnParseEvent);
            codec.on('compile', meshyOnBedrockCompileEvent);
    
            codec = Codecs['bedrock_old'];
            purgeEvents(codec);
    
            codec.on('parsed', meshyOnParseEvent);
            codec.on('compile', meshyOnCompileEvent);
            //pivot_tool = Toolbars["tools"].children.find((t) => t.id == 'pivot_tool').condition = () => { return false; };

        },
        onunload() {
            let bedrock_old = Formats['bedrock_old'];
            let bedrock = Formats['bedrock'];
            bedrock.meshes = false;
            bedrock_old.meshes = false;
            bedrock.single_texture = true;
            bedrock_old.single_texture = true;
            for (let s of pluginSettings) {
                if (settings[s.id]) {
                    settings[s.id].delete();
                }
            }
            let codec = Codecs['bedrock'];
            purgeEvents(codec);
            codec = Codecs['bedrock_old'];
            purgeEvents(codec);
            

        },
    });
    
    //Beaware: Function zone below
    function meshyOnCompileEvent({model, options}) {
        let groups = getAllGroups();
        let loose_elements = [];
        Outliner.root.forEach((obj) => {
            if (obj instanceof OutlinerElement) {
                loose_elements.push(obj);
            }
        });
        if (loose_elements.length) {
            let group = new Group({
                name: 'bb_main',
            });
            group.children.push(...loose_elements);
            group.is_catch_bone = true;
            group.createUniqueName();
            groups.splice(0, 0, group);
        }
        for (let i = 0; i < groups.length; i++) {
            const g = groups[i];
            if (g.type !== 'group' || g.export == false) return;
            if (!settings.export_empty_groups.value && !g.children.find((child) => child.export)) return;
            const bone = model.bones.find((b) => b.name === g.name);
            let poly_mesh = null;
            for (var obj of g.children) {
                if (obj instanceof Mesh) {
                    poly_mesh = compileMesh(poly_mesh, obj);
                }
            }
            if (poly_mesh !== null) {
                bone.poly_mesh = poly_mesh;
            }
        }
    }
    function meshyOnParseEvent({model}) {
        for (let i = 0; i < model.bones.length; i++) {
            const bone = model.bones[i];
            //The groups and bone should be parrel but to make sure it works in all cases below os freaky
            const group = Project.groups[i].name === bone.name ? Project.groups[i] : Project.groups.find((g) => g.name === bone.name) ?? new Group({name: bone.name});
            if (bone.poly_mesh != null) {
                parseMesh(bone.poly_mesh, group);
            }
        }
    }
    function meshyOnBedrockCompileEvent({model, options}) { //Extra step for non-legacy bedrock
        model = model['minecraft:geometry'][0];
        meshyOnCompileEvent({model, options});
    }
    
    //Ensures every function is removed with the names used here. This is so that if duplicates are created it doesn't cause issues
    //The regular version does not do this
    function purgeEvents(codec) {
        
        for (let i = 0; i < codec.events['parsed']?.length; i++) {
            if (listOfFunctions.includes(codec.events['parsed'][i].name)) {
                codec.events['parsed'].splice(i, 1);
            }
        }
        for (let i = 0; i < codec.events['compile']?.length; i++) {
            if (listOfFunctions.includes(codec.events['compile'][i].name)) {
                codec.events['compile'].splice(i, 1);
            }
                
        }
    }
    
    /**
     * Converts a mesh to a polymesh.
     * @param {Object} polyMesh The polymesh to save to. If not defined, a new polymesh will be created.
     * @param {Mesh} mesh The mesh to save.
     * @returns {Object} The polymesh with the mesh saved to it.
     */
    function compileMesh(polyMesh, mesh) {
        polyMesh ??= 
        {
            normalized_uvs: settings["meshy_normalized_mesh_uvs"].value,
            positions: [],
            normals: [],
            uvs: [],
            polys: []
        };

        //vertex keys -> value
        const postionMap = new Map();
        const normalMap = new Map();
        const uvMap = new Map();
        
    
        //normal arr -> value
        const normals = new Map();
    
        //Make a map of faces a vertex is appart of 
        const vertexFacesMap = new Map();
        for (let faceKey in mesh.faces) {
            let face = mesh.faces[faceKey];
            for (let vertexKey of face.vertices) {
                if (!vertexFacesMap.has(vertexKey)) {
                    vertexFacesMap.set(vertexKey, []);
                }
                vertexFacesMap.get(vertexKey).push(faceKey);
            }
        }

        for (let [key, pos] of getVertices(mesh)) {
            postionMap.set(key, polyMesh.positions.length);
            polyMesh.positions.push(pos);
    
            const normal = getVertexNormal(mesh, key, vertexFacesMap);

            if (!normals.has(normal.toString())) {
                normalMap.set(key, polyMesh.normals.length);
                normals.set(normal.toString(), polyMesh.normals.length);
                polyMesh.normals.push(normal);
            }
            else normalMap.set(key, normals.get(normal.toString()))
        }
    
        normals.clear();

        let polys = Object.values(mesh.faces).map((face) => {
            const poly = face.getSortedVertices().map((vertexKey) => {
                const uv = uvOnSave(...face.uv[vertexKey]);
    
                const uIndex = uvMap.get(uv.toString()) ?? (() => {
                    const index = polyMesh.uvs.length;
                    polyMesh.uvs.push(uv);
                    uvMap.set(uv.toString(), index);
                    return index;
                })();
    
                return [postionMap.get(vertexKey), normalMap.get(vertexKey), uIndex];
            });
            if (poly.length < 4) 
                //Fill the poly with the first vertex if less than a quad change: Support for less than 3 vertices
                return poly.concat(Array(4 - poly.length).fill(poly[0]));
            return poly;
        });
        //Spread opertator fails here so we loop for each
        for (let poly of polys) polyMesh.polys.push(poly);
        return polyMesh;
    }
    
    function parseMesh(polyMesh, group) {
        const mesh = new Mesh({name: "mesh", autouv: 0, color: group.color, vertices: []});
        const uniquePoints = new Set();
        for ( let face of polyMesh.polys ) {
                const unique = new Set();
                const vertices = []
                const uvs = {}
                for (let point of face ) {
                    if (unique.has(point.toString())) continue;
                    unique.add(point.toString());
    
                    if ( !uniquePoints.has(point[0])) {
                        uniquePoints.add(point[0]);
                        let position = polyMesh.positions[point[0]]
                        position[0] *= -1;
                        mesh.vertices[`v${point[0]}`] = position;
                    }

                    vertices.push(`v${point[0]}`);
        
                    const uv = [...polyMesh.uvs[point[2]]]
                    if (polyMesh.normalized_uvs) { 
                        uv.V2_multiply(Project.texture_width, Project.texture_height)
                    }
                    uv[1] = Project.texture_height - uv[1]  //Invert y axis
                    uvs[`v${point[0]}`] = uv;
                }
                mesh.addFaces(new MeshFace(mesh, { uv: uvs, vertices }));
        }
        mesh.addTo(group).init();
    }
    
    function uvOnSave(...uv) { 
        uv[1] = Project.texture_height - uv[1] //Invert y axis
        if (!settings["meshy_normalized_mesh_uvs"].value) return uv
        uv[0] /= Project.texture_width
        uv[1] /= Project.texture_height
        return uv
    }
    
    //gets vertices of a Mesh and applys transformations to the points so that they can be exported
    function getVertices(mesh) {
        const verts = Object.entries(mesh.vertices).map( ( [key, point ]) => { 
            //Generate a copy of the point so that it won't effect the original point
            let p = [...point]

            p.V3_add(mesh.origin)
            p = rotatePoint(p, mesh.origin, mesh.rotation)
            p[0] *= -1;

            return [ key, p ]
        }) 
        return verts;
    }
    
    /**
     * Gets the vertex normal of a mesh
     * @param {Mesh} mesh The mesh to get the vertex normal from
     * @param {string} vertexKey The key of the vertex
     * @param {Map} vertexFacesMap The map of vertex faces
     * The vertexFacesMap is used to get the faces of the vertex 
     * This so we don't have to loop through the faces for each vertex
     */
    function getVertexNormal(mesh, vertexKey, vertexFacesMap) {
        if (settings["meshy_skip_mesh_normals"].value) return [ 0,1,0 ];
        let normalSum = [0, 0, 0];
        let faceCount = 0;
    
        const faces = vertexFacesMap.get(vertexKey) || []
        for (let face of faces) {
            face = mesh.faces[face];
            let faceNormal = face.getNormal();
            normalSum[0] += faceNormal[0];
            normalSum[1] += faceNormal[1];
            normalSum[2] += faceNormal[2];
            faceCount++;
        }
    
        let normalLength = Math.sqrt(normalSum[0] * normalSum[0] + normalSum[1] * normalSum[1] + normalSum[2] * normalSum[2]);
        if (normalLength === 0) {
            return [0, 1, 0]; // Default to up vector if normal is zero
        }
        return [
            normalSum[0] / normalLength,
            normalSum[1] / normalLength,
            normalSum[2] / normalLength
        ];
    }
    
    
    function rotatePoint(point, center, rotation) {
        // Convert rotation angles to radians
        const [rx, ry, rz] = rotation.map(Math.degToRad);
    
        // Translate point to origin
        let [x, y, z] = point.map((coord, i) => coord - center[i]);
    
        // Rotate around X-axis
        let temp = y;
        y = y * Math.cos(rx) - z * Math.sin(rx);
        z = temp * Math.sin(rx) + z * Math.cos(rx);
    
        // Rotate around Y-axis
        temp = x;
        x = x * Math.cos(ry) + z * Math.sin(ry);
        z = -temp * Math.sin(ry) + z * Math.cos(ry);
    
        // Rotate around Z-axis
        temp = x;
        x = x * Math.cos(rz) - y * Math.sin(rz);
        y = temp * Math.sin(rz) + y * Math.cos(rz);
    
        // Translate back
        return [
            x + center[0],
            y + center[1],
            z + center[2]
        ];
    }
    
    })();
    
    
    
    