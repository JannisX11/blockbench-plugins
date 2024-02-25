import { action } from "../actions.js";
import { areVectorsCollinear } from "../utils/utils.js";

export default action("tris_to_quad", () => {
  Undo.initEdit({ elements: Mesh.selected, selection: true });
  /* selected meshes */
  Mesh.selected.forEach((mesh) =>
    /* selected faces */
    mesh.getSelectedFaces().forEach((_face) => {
      const face = mesh.faces[_face];

      if (!face || face.vertices.length != 3) return;

      const adjacentFaces = [];
      const vertices = face.getSortedVertices();
      const faceNormal = face.getNormal();

      for (let i = 0; i < 3; i++) {
        const currentAjcFaceData = face.getAdjacentFace(i);
        if (!currentAjcFaceData) continue;

        const currentAjcFaceKey = currentAjcFaceData.key;
        const currentAjcFace = currentAjcFaceData.face;

        adjacentFaces.push(currentAjcFaceKey);

        if (currentAjcFace?.vertices?.length != 3) continue;
        if (i != 0 && adjacentFaces.last() == adjacentFaces[i]) break;

        // Check Normals
        if (
          !currentAjcFace.isSelected() ||
          !areVectorsCollinear(currentAjcFace.getNormal(), faceNormal)
        )
          continue;

        const currentVertices = currentAjcFace.getSortedVertices();
        const uniqueVertex = vertices.find(
          (key) => !currentVertices.includes(key)
        );
        const uniqueUvKey = currentVertices.find(
          (key) => !vertices.includes(key)
        );
        currentVertices.push(uniqueVertex);

        const new_quad = new MeshFace(mesh, {
          vertices: currentVertices,
        });

        if (!areVectorsCollinear(new_quad.getNormal(), faceNormal)) continue;

        new_quad.uv = face.uv;
        new_quad.uv[uniqueUvKey] = currentAjcFace.uv[uniqueUvKey];
        new_quad.texture = face.texture;
        mesh.addFaces(new_quad);
        delete mesh.faces[currentAjcFaceKey];
        delete mesh.faces[_face];
        break;
      }
    })
  );
  Undo.finishEdit("MTools: Convert selected Triangles to Quads");
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
});
