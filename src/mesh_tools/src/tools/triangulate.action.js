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
      let face = mesh.faces[key];
      let SortedV = face.getSortedVertices();
      if (!(SortedV.length <= 3)) {
        let triangles = triangulate(
          SortedV.map((a) => {
            return mesh.vertices[a];
          }),
          face.getNormal(true)
        );
        // create faces
        for (let i = 0; i < triangles.length; i++) {
          let new_face = new MeshFace(mesh, face).extend({
            vertices: [
              SortedV[triangles[i][0]],
              SortedV[triangles[i][2]],
              SortedV[triangles[i][1]],
            ],
          });
          mesh.addFaces(new_face);
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
