/// <reference path="../node_modules/blockbench-types/types/plugin.d.ts" />

import {isObjectManifold} from "./validation";


declare const THREE: typeof import('three');

const contentTypes = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" /></Types>`
const rels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" /></Relationships>`

const colourHexes = [
    { hex: "#6EC9F4", name: "Light Blue" },
    { hex: "#F7D84A", name: "Yellow" },
    { hex: "#F4A428", name: "Orange" },
    { hex: "#E64545", name: "Red" },
    { hex: "#AD4ED2", name: "Purple" },
    { hex: "#5B89E5", name: "Blue" },
    { hex: "#30B75B", name: "Green" },
    { hex: "#7CF38C", name: "Lime" },
    { hex: "#F874D6", name: "Pink" },
    { hex: "#D8D8D8", name: "Silver" },
];


export type MFObject = {name: string, vertices: Vertex[], triangles: IndexedTriangle[]}
export type Vertex = [number, number, number]
export type RawTriangle = {vertices: Vertex[], colour: number, object: number}
export type IndexedTriangle = {indexes: [number, number, number]}

export async function compile(units: string, splitGroups: undefined|"group"|"marker"): Promise<ArrayBuffer> {
    // @ts-ignore
    const zip = new JSZip()

    // Basic stuff
    zip.file("[Content_Types].xml", contentTypes)
    zip.folder("_rels")?.file(".rels", rels)


    // Geometry
    const trianglesRaw: RawTriangle[] = []

    const objects: {[key: number]: MFObject} = {}

    let objectIndex = 1000

    function addGeometry(geometry: THREE.BufferGeometry, mesh: {matrixWorld: THREE.Matrix4}, cube: {color: number}, object: number) {
        const position = geometry.attributes.position
        const index = geometry.index!

        const positions = position.array
        const indices = index.array

        const matrix = mesh.matrixWorld


        for (let i = 0; i < indices.length; i += 3) {
            const v: [number, number, number][] = [];

            for (let j = 0; j < 3; j++) {
                const idx = indices[i + j] * 3;
                const x = positions[idx];
                const y = positions[idx + 1];
                const z = positions[idx + 2];

                const vec = new THREE.Vector3(x, y, z).applyMatrix4(matrix);
                v.push([vec.x, vec.z, vec.y]);
            }

            trianglesRaw.push({vertices: v, colour: +cube.color - 1, object});
        }
    }

    function addCube(cube: Cube, object: number) {
        const mesh = cube.mesh

        mesh.updateMatrixWorld()

        const geometry = mesh.geometry
        addGeometry(geometry, mesh, cube, object);
    }

    function addMesh(meshObj: Mesh, object: number) {
        const mesh = meshObj.mesh

        mesh.updateMatrixWorld()

        mesh.traverse(child => {
            if (!(child as THREE.Mesh).isMesh) {
                return
            }


            const childMesh = child as THREE.Mesh

            const geometry = childMesh.geometry
            addGeometry(geometry, mesh, meshObj, object);

        })
    }

    function addGroup(group: Group) {
        objects[++objectIndex] ??= {name: group.name ?? "Group", vertices: [], triangles: []}

        addChildren(group.children, objectIndex)
    }

    function addChildren(children: OutlinerNode[], objectIndex: number) {
        for (const child of children) {
            if (child instanceof Cube)
                addCube(child, objectIndex)
            else if (child instanceof Mesh)
                addMesh(child, objectIndex)
            else if (child instanceof Group)
                addGroup(child)
        }
    }

    if (splitGroups !== "marker")
        objects[objectIndex] ??= {name: Project?.name && Project.name.length > 0 ? Project.name : "BBRoot", vertices: [], triangles: []}
    addChildren(splitGroups === "group" ? Outliner.root : [...Cube.all, ...Mesh.all], objectIndex)

    for (const triangle of trianglesRaw) {
        const indexes = []

        if (splitGroups === "marker")
            objects[triangle.colour] ??= {name: colourHexes[triangle.colour].name, vertices: [], triangles: []}


        const object = objects[splitGroups === "marker" ? triangle.colour : triangle.object]

        for (const vertex of triangle.vertices) {

            const [x, y, z] = vertex
            let index = object.vertices.findIndex(d => d[0] === x && d[1] === y && d[2] === z)

            if (index === -1) {
                index = object.vertices.length
                object.vertices.push(vertex)
            }

            indexes.push(index)
        }

        object.triangles.push({indexes} as IndexedTriangle)
    }

    const filteredObjects = Object.values(objects).filter(({vertices}) => vertices.length > 0)

    const model = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="${units}" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
    <resources>
${filteredObjects.map(({name, vertices, triangles}, index) => `
        <object id="${index}" type="model" name="${name}">
        <mesh>
            <vertices>${vertices.map(([x, y, z]) => `<vertex x="${x}" y="${y}" z="${z}" />`).join("")}</vertices>
            <triangles>${triangles.map(({indexes}) => `<triangle v1='${indexes[0]}' v2='${indexes[1]}' v3='${indexes[2]}' />`)}</triangles>
        </mesh>
        </object>`).join("\n")}
    </resources>
    <build>
${filteredObjects.map(({vertices}, index) => vertices.length > 0 ? `<item objectid="${index}" />` : "").join("\n")}
    </build>
</model>
`

    for (const object of filteredObjects) {
        if (isObjectManifold(object))
            continue

        console.error(object, "Object failed validation")
    }

    zip.folder("3D")?.file("3dmodel.model", model)


    return zip.generateAsync({type: "arraybuffer", compression: "DEFLATE"})
}