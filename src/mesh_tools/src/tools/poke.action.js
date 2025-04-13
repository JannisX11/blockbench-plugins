import { action } from "../actions.js";
import { getFaceUVCenter } from "../utils/utils.js";

function runEdit(meshes, facesByMesh, amended, depth) {
  Undo.initEdit({ elements: meshes, selection: true }, amended);

  meshes.forEach((mesh, meshIndex) => {
    const faces = facesByMesh[meshIndex];
    faces.forEach((key) => {
      const face = mesh.faces[key];

      /* center vertex creation */
      const am = face.getNormal(true).V3_multiply(depth);
      const centerVertex = mesh.addVertices(face.getCenter().V3_add(am))[0];

      /* faces creation */
      const vertices = face.getSortedVertices();
      for (let i = 0; i < vertices.length; i++) {
        const vertexA = vertices[i];
        const vertexB = vertices[(i + 1) % vertices.length];
        const new_face = new MeshFace(mesh, face).extend({
          vertices: [vertexA, vertexB, centerVertex],
        });
        new_face.uv[centerVertex] = getFaceUVCenter(face);

        mesh.addFaces(new_face);
      }
      delete mesh.faces[key];
    });
  });
  Undo.finishEdit("MTools: Poke mesh face selection");
  Canvas.updateView({
    elements: meshes,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
}

export default action("poke", () => {
  const meshes = Mesh.selected.slice();
  const facesByMesh = meshes.map((mesh) => mesh.getSelectedFaces().slice());

  runEdit(meshes, facesByMesh, false, 0);
  Undo.amendEdit(
    {
      depth: { type: "number", value: 0, label: "Depth" },
    },
    (form) => {
      runEdit(meshes, facesByMesh, true, form.depth);
    }
  );
});
