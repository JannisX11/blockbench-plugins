import { action } from "../actions.js";
import { getFaceUVCenter } from "../utils/utils.js";

function runEdit(amended, depth = 0) {
  Undo.initEdit({ elements: Mesh.selected, selection: true }, amended);
  /* selected meshes */
  Mesh.selected.forEach((mesh) => {
    /* selected faces */

    mesh.getSelectedFaces().forEach((key) => {
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
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
}

export default action("poke", () => {
  runEdit(false);
  Undo.amendEdit(
    {
      depth: { type: "number", value: 0, label: "Depth" },
    },
    (form) => {
      runEdit(true, form.depth);
    }
  );
});
