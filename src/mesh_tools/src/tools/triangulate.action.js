import { action } from "../actions.js";
import { triangulate } from "../utils/utils.js";

/**
 * ! I'm very aware that BlockBench only supports quadrilaterals and triangles for faces.
 * ! However, this action is kept for the future if higher vertex polygons are implemented.
 * !
 */
export default action("triangulate", () => {
  Undo.initEdit({ elements: Mesh.selected, selection: true });
  /* selected meshes */
  Mesh.selected.forEach((mesh) => {
    /* selected faces */
    mesh.getSelectedFaces().forEach((key) => {
      const face = mesh.faces[key];
      const vertices = face.getSortedVertices();
      if (!(vertices.length <= 3)) {
        const triangles = triangulate(
          vertices.map((key) => mesh.vertices[key]),
          face.getNormal(true)
        );
        // create faces
        for (let i = 0; i < triangles.length; i++) {
          const newTri = new MeshFace(mesh, face).extend({
            vertices: [
              vertices[triangles[i][0]],
              vertices[triangles[i][2]],
              vertices[triangles[i][1]],
            ],
          });
          mesh.addFaces(newTri);
        }
        delete mesh.faces[key];
      }
    });
  });
  Undo.finishEdit("MTools: Triangulate mesh face selection");
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
});
