

/**
 * Converts a mesh to a polymesh.
 * @param {Object} polyMesh The polymesh to save to. If not defined, a new polymesh will be created.
 * @param {Mesh} mesh The mesh to save.
 * @returns {Object} The polymesh with the mesh saved to it.
 */
function compileMesh(polyMesh, mesh) {
    polyMesh ??= 
    {
        meta: settings["meta_data"].value ? 
        {
            meshes: [],
        } : undefined,
		normalized_uvs: settings["normalized_uvs"].value,
        positions: [],
		normals: [],
        uvs: [],
        polys: []
    };

    //vertex keys -> value
	const postionMap = new Map();
    const normalMap = new Map();
    const uvMap = new Map();
    const vertexFacesMap = new Map();

    //normal arr -> value
    const normals = new Map();

    //Make a map of faces a vertex is appart of 
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
        if (poly.length < 4) poly.push(poly[2]);
        return poly;
    });

    if (settings["meta_data"].value) {
        const mesh_meta = {
            name: mesh.name,
            position: mesh.position,
            origin: mesh.origin,
            rotation: mesh.rotation,
            start: polyMesh.polys.length,
            length: polys.length
        }
        polyMesh.meta.meshes.push(mesh_meta);
    }

    //Spread opertator fails here so we loop for each
    for (let poly of polys) polyMesh.polys.push(poly);
    return polyMesh;
}

function parseMesh(polyMesh, group) {
    /**
     * Adds meta data to mesh. This is to recover the original objects after exporting
     * sense only one can be save to a group at a time this also used for saving the rotation and position.
     */
    if (polyMesh.meta) {
        for (let meta of polyMesh.meta.meshes) {
            const mesh = new Mesh({name: meta.name, autouv: 0, color: group.color, vertices: []});
            meta.position ??= [0, 0, 0];
            meta.rotation ??= [0, 0, 0];
            meta.origin ??= [0, 0, 0];
            const polys = polyMesh.polys.slice(meta.start, meta.start + meta.length);
            for ( let face of polys ) {
                const unique = new Set();
                const vertices = []
                const uvs = {}
                for (let point of face ) {

                    //Make sure we don't add the same vertex twice ( This means that a quad was folded in half )
                    if (unique.has(point.toString())) continue;
                    unique.add(point.toString());

                    //Do the transformations to revert the vertices
                    let postion = polyMesh.positions[point[0]]
                    postion = postion.map((x, i) => x - meta.origin[i])
                    postion = rotatePoint(postion, meta.origin, multiplyScalar(meta.rotation, -1))

                    //Save the point to the mesh
                    mesh.vertices[`v${point[0]}`] = postion;
                    vertices.push(`v${point[0]}`);

                    const uv = [...polyMesh.uvs[point[2]]]
                    if (polyMesh.normalized_uvs) { 
                        uv.V2_multiply(Project.texture_width, Project.texture_height)
                    }
                    uv[1] = Project.texture_height - uv[1]  //Invert y axis
                    uvs[`v${point[0]}`] = uv;

                }
                mesh.addFaces(new MeshFace(mesh, {  uv: uvs, vertices }));
            }
            mesh.origin = meta.origin
            mesh.rotation = meta.rotation     
            mesh.addTo(group).init();
        }
    }
    else {
        const mesh = new Mesh({name: "mesh", autouv: 0, color: group.color, vertices: []});
        for ( let face of polyMesh.polys ) {
            const unique = new Set();
            const vertices = []
            const uvs = {}
            for (let point of face ) {
                if (unique.has(point.toString())) continue;
                unique.add(point.toString());

                const postion = polyMesh.positions[point[0]]
                mesh.vertices[`v${point[0]}`] = postion;
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
}

function uvOnSave(...uv) { 
    uv[1] = Project.texture_height - uv[1] //Invert y axis
    if (!settings["normalized_uvs"].value) return uv
    uv[0] /= Project.texture_width
    uv[1] /= Project.texture_height
    return uv
}

//gets vertices of a Mesh and applys transformations to the points so that they can be exported
function getVertices(mesh) {
	const verts = Object.entries(mesh.vertices).map( ( [key, point ]) => {
		point = rotatePoint(point, mesh.origin, mesh.rotation)
        point.V3_add(mesh.position[0], mesh.position[1], mesh.position[2])
		return [ key, point ]
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
    if (settings["skip_normals"].value) return [ 0,1,0 ];
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

function multiplyScalar(vec, scalar) {
    return vec.map((coord) => coord * scalar);
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
