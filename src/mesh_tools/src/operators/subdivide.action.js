import { action } from "../actions.js";
import { CMFace, CMEdge } from "../utils/geometry.js";
import { getFaceUVCenter, v3Tov2 } from "../utils/utils.js";

export default action("subdivide", () => {
  Undo.initEdit({ elements: Mesh.selected, selection: true });
  Mesh.selected.forEach((mesh) => {
    CMEdge.all = [];
    CMFace.all = [];
    const originalVertices = Object.keys(mesh.vertices);
    const { faces } = mesh;

    for (let key in faces) {
      const face = faces[key];

      const vertices = face.getSortedVertices();
      const len = vertices.length;
      if (len < 3) {
        continue;
      }
      const cmface = new CMFace(face, key);
      cmface.vertices = vertices;

      for (let i = 0; i < len; i++) {
        const a = vertices[i];
        const b = vertices[(i + 1) % len];
        const center = mesh.vertices[a]
          .slice()
          .V3_add(mesh.vertices[b])
          .V3_divide(2);

        const targetEdge =
          CMEdge.all.find((e) => e.equalsV(a, b)) ??
          new CMEdge(a, b, null, center);

        cmface.edgePoints.push(targetEdge);
      }
    }

    const cmedgeLength = CMEdge.all.length;
    for (let i = 0; i < cmedgeLength; i++) {
      const edge = CMEdge.all[i];
      const averagedPoint = [0, 0, 0];
      const cmfaceLength = CMFace.all.length;

      let k = 0;
      for (let j = 0; j < cmfaceLength; j++) {
        const face = CMFace.all[j];
        if (face.edgePoints.find((e) => edge.equalsU(e))) {
          averagedPoint.V3_add(face.facePoint);
          k++;
        }
      }
      if (k < 2) {
        edge.edgePoint = edge.center;
      } else {
        edge.edgePoint = averagedPoint.V3_divide(k);
        edge.edgePoint.V3_add(edge.center).V3_divide(2);
      }
      edge.edgePointKey = mesh.addVertices(edge.edgePoint)[0];
    }

    const originalVertexLength = originalVertices.length;
    for (let index = 0; index < originalVertexLength; index++) {
      const key = originalVertices[index];
      const P = mesh.vertices[key]; // originalPoint;

      const F = [0, 0, 0]; // The average of touching face points
      let l = CMFace.all.length;
      let tlength = 0;
      let atleastFace = false;

      for (let i = 0; i < l; i++) {
        const face = CMFace.all[i];
        if (!face.for(key)) continue;

        F.V3_add(face.facePoint);
        atleastFace = true;
        tlength++;
      }

      if (!atleastFace) continue;

      F.V3_divide(tlength);

      const R = [0, 0, 0]; // The average of touching edge points
      l = CMEdge.all.length;
      let elength = 0;
      for (let i = 0; i < l; i++) {
        const edge = CMEdge.all[i];
        if (!edge.for(key)) continue;

        R.V3_add(edge.center);
        elength++;
      }
      R.V3_divide(elength);

      if (elength != tlength) {
        P.V3_add(R).V3_divide(2);
      } else {
        for (let i = 0; i < 3; i++) {
          P[i] = (F[i] + 2 * R[i] + (tlength - 3) * P[i]) / tlength;
        }
      }
      mesh.vertices[key] = P;
    }

    let facesLength = CMFace.all.length;
    for (let i = 0; i < facesLength; i++) {
      const currentFace = CMFace.all[i];
      const bbFace = currentFace.bbFace;
      const vertices = currentFace.vertices;
      const verticesLen = vertices.length;

      for (let j = 0; j < verticesLen; j++) {
        const vertexA = vertices[j];
        const vertexB = vertices[(j + 1) % verticesLen];
        const vertexBeforeA = vertices[(j - 1 + verticesLen) % verticesLen];
        /*
									-->
								c -- b -- z
								|	 |	  | |
								d -- a -- y v
								|	 |    |
								x -- w -- u
								*/

        const a = currentFace.facePointKey;
        const b = currentFace.edgePoints.find((e) =>
          e.equalsV(vertexA, vertexB)
        ).edgePointKey;
        const c = vertexA;
        const d = currentFace.edgePoints.find((e) =>
          e.equalsV(vertexA, vertexBeforeA)
        ).edgePointKey;

        const newFace = new MeshFace(mesh, bbFace).extend({
          vertices: [d, c, b, a],
        });

        // uv center point
        newFace.uv[currentFace.facePointKey] = getFaceUVCenter(bbFace);

        // uv edges
        const bPoint = [0, 0, 0]
          .V3_add(bbFace.uv[vertexA])
          .V3_add(bbFace.uv[vertexB]);
        bPoint.V3_divide(2);

        const dPoint = [0, 0, 0]
          .V3_add(bbFace.uv[vertexA])
          .V3_add(bbFace.uv[vertexBeforeA]);
        dPoint.V3_divide(2);

        newFace.uv[b] = v3Tov2(bPoint);
        newFace.uv[d] = v3Tov2(dPoint);
        //

        mesh.addFaces(newFace);
      }
      delete mesh.faces[currentFace.key];
    }
  });
  Undo.finishEdit("MTools: Subdivide selected meshes");
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
});
