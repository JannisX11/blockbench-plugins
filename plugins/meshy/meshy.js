//This is a bundle of JS files


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


(function() {
const pluginInfo = {"name":"Meshy","id":"meshy","version":"1.0.3","repository":"https://github.com/Shadowkitten47/Meshy"};

const pluginSettings = [
    {
        id: "meshy_normalized_mesh_uvs",
        name: "Normalize Mesh UVs",
        description: "Normalize UVs of polymeshes",
        category: 'export',
        value: true,
        plugin: pluginInfo.id
    },
    {
        id: "meshy_meta_data",
        name: "Meshy Meta Data",
        description: "Adds meta data to bedrock polymeshes",
        category: 'export',
        value: true,
        plugin: pluginInfo.id
    },
    {
        id: "meshy_skip_mesh_normals",
        name: "Skip Mesh Normals",
        description: "Skips normal claculation on polymeshes",
        category: 'export',
        value: false,
        plugin: pluginInfo.id
    },
    {
        //Force disable single texture on bedrock formats having more than one texture with meshes is pretty useful
        id: "meshy_force_textures",
        name: "Force Multi-Textures",
        description: "Forces bedrock formats to use allow more than one texture ( You will need to stitch the textures )",
        category: 'edit',
        value: false,
        plugin: pluginInfo.id,
        onChange: (value) => {
            Formats['bedrock'].single_texture = !value
            Formats['bedrock_old'].single_texture = !value
        }
    }
]

Plugin.register(pluginInfo.id, {
	title: pluginInfo.name,
	author: 'Shadowkitten47',
	icon: 'diamond',
	description: 'Enables the use of a meshes in bedrock formats and to export them to Minecraft Bedrock',
	version: pluginInfo.version,
	variant: 'both',
    repository: pluginInfo.repository,
    onload() {
        let bedrock_old = Formats['bedrock_old']
        let bedrock = Formats['bedrock']
        bedrock.meshes = true;
        bedrock_old.meshes = true;
        for (let s of pluginSettings) {
            if (!settings[s.id]) {
                new Setting(s.id, s);
            }
        }

        bedrock.single_texture = !settings["single_texture"]?.value
        bedrock_old.single_texture = !settings["single_texture"]?.value
    },
    onunload() {
        let bedrock_old = Formats['bedrock_old']
        let bedrock = Formats['bedrock']
        bedrock.meshes = false;
        bedrock_old.meshes = false;
        bedrock.single_texture = true;
        bedrock_old.single_texture = true;
        for (let s of pluginSettings) {
            if (settings[s.id]) {
                settings[s.id].delete(); 
            }
        }

    }
});

//Unfinshed
// function BedrockOldCompile(model, options) {
//     const groups = getAllGroups();
//     for (const group of groups) {
//         console.warn(group)
//     }
//     model.bones = []
// }
})();


//#region Source Files


// File: bedrock-old.js
(function() {
var codec = Codecs["bedrock_old"]
codec.parse = parse;
codec.compile = compile;

/*
	master/js/io/formats/bedrock_old.js
	function codec.parse
	function codec.compile

	function parseGeometry
*/

function parse (data, path) {
	let geometries = [];
	for (let key in data) {
		if (typeof data[key] !== 'object') continue;
		geometries.push({
			name: key,
			object: data[key]
		});
	}
	if (geometries.length === 1) {
		parseGeometry(geometries[0]);
		return;
	} else if (isApp && BedrockEntityManager.CurrentContext?.geometry) {
		return parseGeometry(geometries.find(geo => geo.name == BedrockEntityManager.CurrentContext.geometry));
	}

	geometries.forEach(geo => {
		geo.uuid = guid();

		geo.bonecount = 0;
		geo.cubecount = 0;
		if (geo.object.bones instanceof Array) {
			geo.object.bones.forEach(bone => {
				geo.bonecount++;
				if (bone.cubes instanceof Array) geo.cubecount += bone.cubes.length;
			})
		}
	})

	let selected = null;
	new Dialog({
		id: 'bedrock_model_select',
		title: 'dialog.select_model.title',
		buttons: ['Import', 'dialog.cancel'],
		component: {
			data() {return {
				search_term: '',
				geometries,
				selected: null,
			}},
			computed: {
				filtered_geometries() {
					if (!this.search_term) return this.geometries;
					let term = this.search_term.toLowerCase();
					return this.geometries.filter(geo => {
						return geo.name.toLowerCase().includes(term)
					})
				}
			},
			methods: {
				selectGeometry(geo) {
					this.selected = selected = geo;
				},
				open(geo) {
					Dialog.open.hide();
					parseGeometry(geo);
				},
				tl
			},
			template: `
				<div>
					<search-bar v-model="search_term"></search-bar>
					<ul class="list" id="model_select_list">
						<li v-for="geometry in filtered_geometries" :key="geometry.uuid" :class="{selected: geometry == selected}" @click="selectGeometry(geometry)" @dblclick="open(geometry)">
							<p>{{ geometry.name }}</p>
							<label>{{ geometry.bonecount+' ${tl('dialog.select_model.bones')}' }}, {{ geometry.cubecount+' ${tl('dialog.select_model.cubes')}' }}</label>
						</li>
					</ul>
				</div>
			`
		},
		onConfirm() {
			parseGeometry(selected);
		}
	}).show();
}

function compile(options) {
	if (options === undefined) options = {}
	var entitymodel = {}
	entitymodel.texturewidth = Project.texture_width;
	entitymodel.textureheight = Project.texture_height;
	var bones = []
	var visible_box = new THREE.Box3()

	var groups = getAllGroups();
	var loose_elements = [];
	Outliner.root.forEach(obj => {
		if (obj.type === 'cube' || obj.type == 'locator') {
			loose_elements.push(obj)
		}
	})
	if (loose_elements.length) {
		let group = new Group({
			name: 'bb_main'
		});
		group.children.push(...loose_elements);
		group.is_catch_bone = true;
		group.createUniqueName();
		groups.splice(0, 0, group);
	}

	groups.forEach(function(g) {
		if (g.type !== 'group' || g.export == false) return;
		if (!settings.export_empty_groups.value && !g.children.find(child => child.export)) return;
		//Bone
		var bone = {}
		bone.name = g.name
		if (g.parent.type === 'group') {
			bone.parent = g.parent.name
		}
		bone.pivot = g.origin.slice()
		bone.pivot[0] *= -1
		if (!g.rotation.allEqual(0)) {
			bone.rotation = [
				-g.rotation[0],
				-g.rotation[1],
				g.rotation[2]
			]
		}
		if (g.reset) bone.reset = true;
		if (g.mirror_uv && Project.box_uv) bone.mirror = true;
		if (g.material) bone.material = g.material;

		//Elements
		var cubes = []
		var locators = {};
		var poly_mesh = null;

		for (var obj of g.children) {
			if (obj.export) {
				if (obj instanceof Cube) {
					var template = new oneLiner()
					template.origin = obj.from.slice()
					template.size = obj.size()
					template.origin[0] = -(template.origin[0] + template.size[0])
					template.uv = obj.uv_offset
					if (obj.inflate && typeof obj.inflate === 'number') {
						template.inflate = obj.inflate
					}
					if (obj.mirror_uv === !bone.mirror) {
						template.mirror = obj.mirror_uv
					}
					//Visible Bounds
					var mesh = obj.mesh
					if (mesh) {
						visible_box.expandByObject(mesh)
					}
					cubes.push(template)

				} else if (obj instanceof Locator) {

					locators[obj.name] = obj.position.slice();
					locators[obj.name][0] *= -1;
				} else if (obj instanceof Mesh ) {
					poly_mesh = compileMesh(poly_mesh, obj);
				}
			}
		}
		if (cubes.length) {
			bone.cubes = cubes
		}
		if (Object.keys(locators).length) {
			bone.locators = locators
		}
		if (poly_mesh !== null) {
			bone.poly_mesh = poly_mesh
		}
		bones.push(bone)
	})

	if (bones.length && options.visible_box !== false) {

		let visible_box = calculateVisibleBox();
		entitymodel.visible_bounds_width = visible_box[0] || 0;
		entitymodel.visible_bounds_height = visible_box[1] || 0;
		entitymodel.visible_bounds_offset = [0, visible_box[2] || 0, 0]
	}
	if (bones.length) {
		entitymodel.bones = bones
	}
	this.dispatchEvent('compile', {model: entitymodel, options});

	if (options.raw) {
		return entitymodel
	} else {
		var model_name = 'geometry.' + (Project.geometry_name||Project.name||'unknown')
		return autoStringify({
			format_version: '1.10.0',
			[model_name]: entitymodel
		})
	}
}

function parseGeometry(data) {
	let geometry_name = data.name.replace(/^geometry\./, '');

	let existing_tab = isApp && ModelProject.all.find(project => (
		Project !== project && project.export_path == Project.export_path && project.geometry_name == geometry_name
	))
	if (existing_tab) {
		Project.close().then(() =>  {
			existing_tab.select();
		});
		return;
	}

	codec.dispatchEvent('parse', {model: data.object});
	Project.geometry_name = geometry_name;
	Project.texture_width = data.object.texturewidth || 64;
	Project.texture_height = data.object.textureheight || 64;

	if (typeof data.object.visible_bounds_width == 'number' && typeof data.object.visible_bounds_height == 'number') {
		Project.visible_box[0] = Math.max(Project.visible_box[0], data.object.visible_bounds_width || 0);
		Project.visible_box[1] = Math.max(Project.visible_box[1], data.object.visible_bounds_height || 0);
		if (data.object.visible_bounds_offset && typeof data.object.visible_bounds_offset[1] == 'number') {
			Project.visible_box[2] = data.object.visible_bounds_offset[1] || 0;
		}
	}

	var bones = {}

	if (data.object.bones) {
		var included_bones = []
		data.object.bones.forEach(function(b) {
			included_bones.push(b.name)
		})
		data.object.bones.forEach(function(b, bi) {
			var group = new Group({
				name: b.name,
				origin: b.pivot,
				rotation: b.rotation,
				material: b.material,
				color: Group.all.length%markerColors.length
			}).init()
			bones[b.name] = group
			if (b.pivot) {
				group.origin[0] *= -1
			}
			group.rotation[0] *= -1;
			group.rotation[1] *= -1;
			
			group.mirror_uv = b.mirror === true
			group.reset = b.reset === true

			if (b.cubes) {
				b.cubes.forEach(function(s) {
					var base_cube = new Cube({name: b.name, autouv: 0, color: group.color})
					if (s.origin) {
						base_cube.from.V3_set(s.origin);
						base_cube.from[0] = -(base_cube.from[0] + s.size[0])
						if (s.size) {
							base_cube.to[0] = s.size[0] + base_cube.from[0]
							base_cube.to[1] = s.size[1] + base_cube.from[1]
							base_cube.to[2] = s.size[2] + base_cube.from[2]
						}
					}
					if (s.uv) {
						base_cube.uv_offset[0] = s.uv[0]
						base_cube.uv_offset[1] = s.uv[1]
					}
					if (s.inflate && typeof s.inflate === 'number') {
						base_cube.inflate = s.inflate
					}
					if (s.mirror === undefined) {
						base_cube.mirror_uv = group.mirror_uv
					} else {
						base_cube.mirror_uv = s.mirror === true
					}
					base_cube.addTo(group).init()
				})
			}
			//Changed Code
			if (b.poly_mesh) {
				parseMesh(b.poly_mesh, group)
			}
			//End if change
			if (b.children) {
				b.children.forEach(function(cg) {
					cg.addTo(group)
				})
			}
			if (b.locators) {
				for (var key in b.locators) {
					var coords, rotation;
					if (b.locators[key] instanceof Array) {
						coords = b.locators[key];
					} else {
						coords = b.locators[key].offset;
						rotation = b.locators[key].rotation;
					}
					coords[0] *= -1
					var locator = new Locator({position: coords, name: key, rotation}).addTo(group).init();
				}
			}
			var parent_group = 'root';
			if (b.parent) {
				if (bones[b.parent]) {
					parent_group = bones[b.parent]
				} else {
					data.object.bones.forEach(function(ib) {
						if (ib.name === b.parent) {
							ib.children && ib.children.length ? ib.children.push(group) : ib.children = [group]
						}
					})
				}
			}
			group.addTo(parent_group)
		})
	}

	codec.dispatchEvent('parsed', {model: data.object});

	Canvas.updateAllBones()
	setProjectTitle()
	if (isApp && Project.geometry_name && Project.BedrockEntityManager) {
		Project.BedrockEntityManager.initEntity()
	}
	Validator.validate()
	updateSelection()
}







})();



// File: bedrock.js
(function() {
var codec = Codecs["bedrock"]
codec.compile = compile;
codec.parse = parse;

/*
    master/js/io/formats/bedrock.js
    function codec.parse
    function codec.compile
    
    function parseGeometry
    function parseBone
    function parseCube

    function compileGroup
    function compileCube
    function getFormatVersion
*/

//#region parse
function parse(data, path) {
    if (Format != Formats.bedrock && Format != Formats.bedrock_block) Formats.bedrock.select()

    let geometries = [];
    for (let geo of data['minecraft:geometry']) {
        if (typeof geo !== 'object') continue;
        geometries.push({
            object: geo,
            name: geo.description?.identifier || ''
        });
    }
    if (geometries.length === 1) {
        return parseGeometry(geometries[0]);
    } else if (isApp && BedrockEntityManager.CurrentContext?.geometry) {
        return parseGeometry(geometries.find(geo => geo.name == BedrockEntityManager.CurrentContext.geometry));
    }

    geometries.forEach(geo => {
        geo.uuid = guid();
        geo.bonecount = 0;
        geo.cubecount = 0;
        if (geo.object.bones instanceof Array) {
            geo.object.bones.forEach(bone => {
                geo.bonecount++;
                if (bone.cubes instanceof Array) geo.cubecount += bone.cubes.length;
            })
        }
    })

    let selected = null;
    new Dialog({
        id: 'bedrock_model_select',
        title: 'dialog.select_model.title',
        buttons: ['Import', 'dialog.cancel'],
        component: {
            data() {return {
                search_term: '',
                geometries,
                selected: null,
            }},
            computed: {
                filtered_geometries() {
                    if (!this.search_term) return this.geometries;
                    let term = this.search_term.toLowerCase();
                    return this.geometries.filter(geo => {
                        return geo.name.toLowerCase().includes(term)
                    })
                }
            },
            methods: {
                selectGeometry(geo) {
                    this.selected = selected = geo;
                },
                open(geo) {
                    Dialog.open.hide();
                    parseGeometry(geo);
                },
                tl
            },
            template: `
                <div>
                    <search-bar v-model="search_term"></search-bar>
                    <ul class="list" id="model_select_list">
                        <li v-for="geometry in filtered_geometries" :key="geometry.uuid" :class="{selected: geometry == selected}" @click="selectGeometry(geometry)" @dblclick="open(geometry)">
                            <p>{{ geometry.name }}</p>
                            <label>{{ geometry.bonecount+' ${tl('dialog.select_model.bones')}' }}, {{ geometry.cubecount+' ${tl('dialog.select_model.cubes')}' }}</label>
                        </li>
                    </ul>
                </div>
            `
        },
        onConfirm() {
            parseGeometry(selected);
        }
    }).show();
}

function parseGeometry(data) {

    let {description} = data.object;
    let geometry_name = (description.identifier && description.identifier.replace(/^geometry\./, '')) || '';


    codec.dispatchEvent('parse', {model: data.object});

    Project.geometry_name = geometry_name;
    Project.texture_width = 16;
    Project.texture_height = 16;

    if (typeof description.visible_bounds_width == 'number' && typeof description.visible_bounds_height == 'number') {
        Project.visible_box[0] = Math.max(Project.visible_box[0], description.visible_bounds_width || 0);
        Project.visible_box[1] = Math.max(Project.visible_box[1], description.visible_bounds_height || 0);
        if (description.visible_bounds_offset && typeof description.visible_bounds_offset[1] == 'number') {
            Project.visible_box[2] = description.visible_bounds_offset[1] || 0;
        }
    }

    if (description.texture_width !== undefined) {
        Project.texture_width = description.texture_width;
    }
    if (description.texture_height !== undefined) {
        Project.texture_height = description.texture_height;
    }

    var bones = {}

    if (data.object.bones) {
        var included_bones = []
        data.object.bones.forEach(function(b) {
            included_bones.push(b.name)
        })
        data.object.bones.forEach(function(b) {
            parseBone(b, bones, data.object.bones)
        })
    }

    Project.box_uv = Cube.all.filter(cube => cube.box_uv).length > Cube.all.length/2;

    codec.dispatchEvent('parsed', {model: data.object});

    
    Canvas.updateAllBones()
    setProjectTitle()
    if (isApp && Project.geometry_name) {
        if (Format.id == 'bedrock') Project.BedrockEntityManager.initEntity();
        if (Format.id == 'bedrock_block') Project.BedrockBlockManager.initBlock();
    }
    Validator.validate()
    updateSelection()
}

function parseBone(b, bones, parent_list) {
    var group = new Group({
        name: b.name,
        origin: b.pivot,
        rotation: b.rotation,
        material: b.material,
        bedrock_binding: b.binding,
        color: Group.all.length%markerColors.length
    }).init()
    group.createUniqueName();
    bones[b.name] = group
    if (b.pivot) {
        group.origin[0] *= -1
    }
    group.rotation.forEach(function(br, axis) {
        if (axis !== 2) group.rotation[axis] *= -1
    })
    
    group.mirror_uv = b.mirror === true
    group.reset = b.reset === true

    if (b.cubes) {
        b.cubes.forEach(function(s) {
            parseCube(s, group)
        })
    }
    if (b.locators) {
        for (let key in b.locators) {
            let coords, rotation, ignore_inherited_scale;
            if (b.locators[key] instanceof Array) {
                coords = b.locators[key];
            } else {
                coords = b.locators[key].offset;
                rotation = b.locators[key].rotation;
                ignore_inherited_scale = b.locators[key].ignore_inherited_scale;
            }
            coords[0] *= -1;
            if (rotation instanceof Array) {
                rotation[0] *= -1;
                rotation[1] *= -1;
            }
            if (key.substr(0, 6) == '_null_' && b.locators[key] instanceof Array) {
                new NullObject({from: coords, name: key.substr(6)}).addTo(group).init();
            } else {
                new Locator({position: coords, name: key, rotation, ignore_inherited_scale}).addTo(group).init();
            }
        }
    }
    if (b.texture_meshes instanceof Array) {
        b.texture_meshes.forEach(tm => {
            let texture = Texture.all.find(tex => tex.name == tm.texture);
            let texture_mesh = new TextureMesh({
                texture_name: tm.texture,
                texture: texture ? texture.uuid : null,
                origin: tm.position,
                rotation: tm.rotation,
                local_pivot: tm.local_pivot,
                scale: tm.scale,
            })
            texture_mesh.local_pivot[2] *= -1;
            texture_mesh.origin[1] *= -1;

            if (b.pivot) texture_mesh.origin[1] += b.pivot[1];

            texture_mesh.origin[0] *= -1;
            texture_mesh.rotation[0] *= -1;
            texture_mesh.rotation[1] *= -1;
            texture_mesh.addTo(group).init();
        })
    }
    if (b.children) {
        b.children.forEach(function(cg) {
            cg.addTo(group);
        })
    }

    //Change
    if (b.poly_mesh) {
        parseMesh(b.poly_mesh, group)
    }
    //End Change
    var parent_group = 'root';
    if (b.parent) {
        if (bones[b.parent]) {
            parent_group = bones[b.parent]
        } else {
            parent_list.forEach(function(ib) {
                if (ib.name === b.parent) {
                    ib.children && ib.children.length ? ib.children.push(group) : ib.children = [group]
                }
            })
        }
    }
    group.addTo(parent_group)
}
function parseCube(s, group) {
    var base_cube = new Cube({
        name: s.name || group.name,
        autouv: 0,
        color: group.color,
        rotation: s.rotation,
        origin: s.pivot
    })
    base_cube.rotation.forEach(function(br, axis) {
        if (axis != 2) base_cube.rotation[axis] *= -1
    })
    base_cube.origin[0] *= -1;
    if (s.origin) {
        base_cube.from.V3_set(s.origin)
        base_cube.from[0] = -(base_cube.from[0] + s.size[0])
        if (s.size) {
            base_cube.to[0] = s.size[0] + base_cube.from[0]
            base_cube.to[1] = s.size[1] + base_cube.from[1]
            base_cube.to[2] = s.size[2] + base_cube.from[2]
        }
    }
    if (s.uv instanceof Array) {
        base_cube.uv_offset[0] = s.uv[0]
        base_cube.uv_offset[1] = s.uv[1]
        base_cube.box_uv = true;
    } else if (s.uv) {
        base_cube.box_uv = false;
        for (var key in base_cube.faces) {
            var face = base_cube.faces[key]
            if (s.uv[key]) {
                face.extend({
                    material_name: s.uv[key].material_instance,
                    uv: [
                        s.uv[key].uv[0],
                        s.uv[key].uv[1]
                    ],
                    rotation: s.uv[key].uv_rotation
                })
                if (s.uv[key].uv_size) {
                    face.uv_size = [
                        s.uv[key].uv_size[0],
                        s.uv[key].uv_size[1]
                    ]
                } else {
                    base_cube.autouv = 1;
                    base_cube.mapAutoUV();
                }
                if (key == 'up' || key == 'down') {
                    face.uv = [face.uv[2], face.uv[3], face.uv[0], face.uv[1]]
                }
            } else {
                face.texture = null;
                face.uv = [0, 0, 0, 0],
                face.rotation = 0;
            }
        }
        
    }
    if (s.inflate && typeof s.inflate === 'number') {
        base_cube.inflate = s.inflate;
    }
    if (s.mirror === undefined) {
        base_cube.mirror_uv = group.mirror_uv;
    } else {
        base_cube.mirror_uv = s.mirror === true;
    }
    base_cube.addTo(group).init();
    return base_cube;
}
//#endregion


//#region compile
function compile(options) {
    if (options === undefined) options = {}

    var entitymodel = {}
    var main_tag = {
        format_version: getFormatVersion(),
        'minecraft:geometry': [entitymodel]
    }
    entitymodel.description = {
        identifier: 'geometry.' + (Project.geometry_name||'unknown'),
        texture_width:  Project.texture_width || 16,
        texture_height: Project.texture_height || 16,
    }
    var bones = []

    var groups = getAllGroups();
    var loose_elements = [];
    Outliner.root.forEach(obj => {
        if (obj instanceof OutlinerElement) {
            loose_elements.push(obj)
        }
    })
    if (loose_elements.length) {
        let group = new Group({
            name: 'bb_main'
        });
        group.children.push(...loose_elements);
        group.is_catch_bone = true;
        group.createUniqueName();
        groups.splice(0, 0, group);
    }
    groups.forEach(function(g) {
        let bone = compileGroup(g);
        bones.push(bone)
    })

    if (bones.length && options.visible_box !== false) {

        let visible_box = calculateVisibleBox();
        entitymodel.description.visible_bounds_width = visible_box[0] || 0;
        entitymodel.description.visible_bounds_height = visible_box[1] || 0;
        entitymodel.description.visible_bounds_offset = [0, visible_box[2] || 0 , 0]
    }
    if (bones.length) {
        entitymodel.bones = bones
    }
    this.dispatchEvent('compile', {model: main_tag, options});

    if (options.raw) {
        return main_tag
    } else {
        return autoStringify(main_tag)
    }
}

function getFormatVersion() {
	for (let cube of Cube.all) {
		for (let fkey in cube.faces) {
			if (cube.faces[fkey].rotation) return '1.21.0';
		}
	}
	if (Group.all.find(group => group.bedrock_binding)) return '1.16.0';
	return '1.12.0';
}

function compileCube(cube, bone) {
    var template = {
        origin: cube.from.slice(),
        size: cube.size(),
        inflate: cube.inflate||undefined,
    }
    if (cube.box_uv) {
        template = new oneLiner(template);
    }
    template.origin[0] = -(template.origin[0] + template.size[0])

    if (!cube.rotation.allEqual(0)) {
        template.pivot = cube.origin.slice();
        template.pivot[0] *= -1;
        
        template.rotation = cube.rotation.slice();
        template.rotation.forEach(function(br, axis) {
            if (axis != 2) template.rotation[axis] *= -1
        })
    }

    if (cube.box_uv) {
        template.uv = cube.uv_offset;
        if (cube.mirror_uv === !bone.mirror) {
            template.mirror = cube.mirror_uv
        }
    } else {
        template.uv = {};
        for (var key in cube.faces) {
            var face = cube.faces[key];
            if (face.texture !== null) {
                template.uv[key] = new oneLiner({
                    uv: [
                        face.uv[0],
                        face.uv[1],
                    ],
                    uv_size: [
                        face.uv_size[0],
                        face.uv_size[1],
                    ]
                });
                if (face.rotation) {
                    template.uv[key].uv_rotation = face.rotation;
                }
                if (face.material_name) {
                    template.uv[key].material_instance = face.material_name;
                }
                if (key == 'up' || key == 'down') {
                    template.uv[key].uv[0] += template.uv[key].uv_size[0];
                    template.uv[key].uv[1] += template.uv[key].uv_size[1];
                    template.uv[key].uv_size[0] *= -1;
                    template.uv[key].uv_size[1] *= -1;
                }
            }
        }
    }
    return template;
}
function compileGroup(g) {

    if (g.type !== 'group' || g.export == false) return;
    if (!settings.export_empty_groups.value && !g.children.find(child => child.export)) return;
    //Bone
    var bone = {}
    bone.name = g.name
    if (g.parent.type === 'group') {
        bone.parent = g.parent.name
    }
    bone.pivot = g.origin.slice()
    bone.pivot[0] *= -1
    if (!g.rotation.allEqual(0)) {
        bone.rotation = g.rotation.slice()
        bone.rotation[0] *= -1;
        bone.rotation[1] *= -1;
    }
    if (g.bedrock_binding) {
        bone.binding = g.bedrock_binding
    }
    if (g.reset) {
        bone.reset = true
    }
    if (g.mirror_uv && Project.box_uv) {
        bone.mirror = true
    }
    if (g.material) {
        bone.material = g.material
    }
    // Elements
    var cubes = []
    var locators = {};
    var texture_meshes = [];
    var poly_mesh = null;
    for (var obj of g.children) {
        if (obj.export) {
            if (obj instanceof Cube) {
                let template = compileCube(obj, bone);
                cubes.push(template);
            } else if (obj instanceof Mesh ) {
                poly_mesh = compileMesh(poly_mesh, obj);
            } else if (obj instanceof Locator || obj instanceof NullObject) {
                let key = obj.name;
                if (obj instanceof NullObject) key = '_null_' + key;
                let offset = obj.position.slice();
                offset[0] *= -1;

                if ((obj.rotatable && !obj.rotation.allEqual(0)) || obj.ignore_inherited_scale) {
                    locators[key] = {
                        offset
                    };
                    if (obj.rotatable) {
                        locators[key].rotation = [
                            -obj.rotation[0],
                            -obj.rotation[1],
                            obj.rotation[2]
                        ]
                    }
                    if (obj.ignore_inherited_scale) {
                        locators[key].ignore_inherited_scale = true;
                    }
                } else {
                    locators[key] = offset;
                }
            } else if (obj instanceof TextureMesh) {
                let texmesh = {
                    texture: obj.texture_name,
                    position: obj.origin.slice(),
                }
                texmesh.position[0] *= -1;
                texmesh.position[1] -= bone.pivot[1];
                texmesh.position[1] *= -1;

                if (!obj.rotation.allEqual(0)) {
                    texmesh.rotation = [
                        -obj.rotation[0],
                        -obj.rotation[1],
                        obj.rotation[2]
                    ]
                }
                if (!obj.local_pivot.allEqual(0)) {
                    texmesh.local_pivot = obj.local_pivot.slice();
                    texmesh.local_pivot[2] *= -1;
                }
                if (!obj.scale.allEqual(1)) {
                    texmesh.scale = obj.scale.slice();
                }
                texture_meshes.push(texmesh);
            } 
        }
        
    }

    if (cubes.length) {
        bone.cubes = cubes
    }
    if (texture_meshes.length) {
        bone.texture_meshes = texture_meshes
    }
    if (Object.keys(locators).length) {
        bone.locators = locators
    }
    if (poly_mesh !== null) {
        bone.poly_mesh = poly_mesh
    }
    return bone;
}
//#endregion


})();


//#endregion
