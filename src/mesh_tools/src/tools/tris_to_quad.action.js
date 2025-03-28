import { action } from "../actions.js";
import { minIndex } from "../utils/array.js";
import { isValidQuad } from "../utils/utils.js";

function runEdit(meshes, facesByMesh, maxAngle, ignoreDisjointUVs, amend) {
  Undo.initEdit({ elements: meshes, selection: true }, amend);

  meshes.forEach((mesh, meshIndex) => {
    const faces = facesByMesh[meshIndex];

    faces.forEach((faceKey) => {
      const face = mesh.faces[faceKey];

      if (!face || face.vertices.length != 3) return;

      const vertices = face.getSortedVertices().slice();
      const faceNormal = face.getNormal(true);

      const adjacentFacesEdges = [];
      const adjacentFaces = [];
      const adjacentFaceKeys = [];
      const adjacentFacesIndices = [];
      for (let i = 0; i < 3; i++) {
        const currentAdjacentFaceData = face.getAdjacentFace(i);

        if (!currentAdjacentFaceData) continue;

        const currentAdjacentFace = currentAdjacentFaceData.face;
        const currentAdjacentFaceKey = currentAdjacentFaceData.key;
        const currentAdjacentFaceEdge = currentAdjacentFaceData.edge;

        if (currentAdjacentFace.vertices.length != 3) continue;
        if (
          adjacentFaces.length > 1 &&
          adjacentFaces.last() == adjacentFaces[i]
        )
          break;
        if (!faces.includes(currentAdjacentFaceKey)) continue;

        adjacentFaces.push(currentAdjacentFace);
        adjacentFacesEdges.push(currentAdjacentFaceEdge);
        adjacentFaceKeys.push(currentAdjacentFaceKey);
        adjacentFacesIndices.push(i);
      }
      const angles = adjacentFaces.map((e) => face.getAngleTo(e));
      const minAngledFaceIndex = minIndex(angles);
      if (minAngledFaceIndex == -1) return;
      const minAngle = angles[minAngledFaceIndex];
      const adjacentFace = adjacentFaces[minAngledFaceIndex];
      const adjacentFaceKey = adjacentFaceKeys[minAngledFaceIndex];
      const adjacentEdge = adjacentFacesEdges[minAngledFaceIndex];
      if (minAngle > maxAngle) {
        return;
      }
      const adjacentVertices = adjacentFace.getSortedVertices().slice();
      const uniqueVertex = vertices.find(
        (key) => !adjacentVertices.includes(key)
      );
      if (!uniqueVertex) {
        return;
      }

      adjacentVertices.splice(
        adjacentFacesIndices[minAngledFaceIndex] + 1,
        0,
        uniqueVertex
      );

      const newQuad = new MeshFace(mesh, {
        vertices: adjacentVertices,
      });
      const newFaceNormal = newQuad.getNormal(true);
      if (
        !isValidQuad(newQuad.getSortedVertices().map((e) => mesh.vertices[e]))
      ) {
        return;
      }
      if (newFaceNormal.V3_toThree().dot(faceNormal.V3_toThree()) < 0) {
        newQuad.invert();
      }

      if (ignoreDisjointUVs) {
        for (const edgeVertex of adjacentEdge) {
          const areUVsJoint =
            Math.roundTo(face.uv[edgeVertex][0], 5) ==
              Math.roundTo(adjacentFace.uv[edgeVertex][0], 5) &&
            Math.roundTo(face.uv[edgeVertex][1], 5) ==
              Math.roundTo(adjacentFace.uv[edgeVertex][1], 5);

          if (!areUVsJoint) {
            return;
          }
        }
      }

      newQuad.uv = adjacentFace.uv;
      if (face.uv[uniqueVertex] instanceof Array) {
        newQuad.uv[uniqueVertex] = face.uv[uniqueVertex];
      }
      for (const key of newQuad.vertices) {
        newQuad.uv[key] ??= [0, 0];
      }

      newQuad.texture = face.texture;
      mesh.addFaces(newQuad);
      delete mesh.faces[adjacentFaceKey];
      delete mesh.faces[faceKey];
    });
  });
  Undo.finishEdit("MTools: Convert selected Triangles to Quads");
  Canvas.updateView({
    elements: meshes,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
}
export default action("tris_to_quad", () => {
  const meshes = Mesh.selected.slice();
  const facesByMesh = meshes.map((mesh) => mesh.getSelectedFaces().slice());

  runEdit(meshes, facesByMesh, 45, true, false);
  Undo.amendEdit(
    {
      max_angle: {
        label: "Max Angle",
        value: 45,
        min: 0,
        max: 180,
        type: "range",
      },
      ignore_disjoint_uvs: {
        label: "Ignore Disjoint UVs",
        value: true,
        type: "checkbox",
      },
    },
    (out) =>
      runEdit(meshes, facesByMesh, out.max_angle, out.ignore_disjoint_uvs, true)
  );
});
