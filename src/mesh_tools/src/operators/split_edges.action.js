import { action } from "../actions.js";
import { MTEdge } from "../utils/geometry.js";

function runEdit(angle = 30, amend = false) {
  angle = Math.degToRad(angle);
  Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);
  Mesh.selected.forEach((mesh) => {
    MTEdge.reset();

    const faces = mesh.faces;
    for (const key in faces) {
      const face = faces[key];

      const vertices = face.getSortedVertices();
      const len = vertices.length;
      if (len <= 2) continue;
      for (let i = 0; i < len; i++) {
        const a = vertices[i];
        const b = vertices[(i + 1) % len];
        const center = mesh.vertices[a]
          .slice()
          .V3_add(mesh.vertices[b])
          .V3_divide(2);

        const earlyEdge = MTEdge.all.find((e) => e.equalsV(a, b));
        if (earlyEdge) {
          if (earlyEdge.faces.length >= 2) {
            Blockbench.showQuickMessage(
              "Error: non-manifold meshes are not allowed",
              2000
            );
            throw new Error("non-manifold meshes are not allowed");
          }
          earlyEdge.faces.push(face);
          continue;
        }
        // indices in the non sorted order
        const indices = [];
        indices[0] = face.vertices.findIndex((vkey) => vkey == a);
        indices[1] = face.vertices.findIndex((vkey) => vkey == b);

        const e = new MTEdge(a, b, { center, indices });
        e.faces = [face];
      }
    }

    const edgesLength = MTEdge.all.length; // skip calculating length each iteration
    for (let i = 0; i < edgesLength; i++) {
      const edge = MTEdge.all[i];
      if (edge.faces.length < 2) continue;

      const [face1, face2] = edge.faces;

      // Duplicate code!!
      const disp1 = face2.getCenter().V3_subtract(edge.center).V3_toThree();
      const disp2 = face2.getCenter().V3_subtract(edge.center).V3_toThree();

      const theta = disp1.angleTo(disp2);

      // splitting process

      // saved indices since: faces update, edge vertices doesnt
      if (theta <= angle) {
        const newVertices = mesh.addVertices(
          mesh.vertices[edge.vertexA],
          mesh.vertices[edge.vertexB]
        );
        const indexA = edge.indices[0];
        const indexB = edge.indices[1];

        face1.uv[newVertices[0]] = face1.uv[edge.vertexA];
        face1.uv[newVertices[1]] = face1.uv[edge.vertexB];
        face1.vertices[indexA] = newVertices[0];
        face1.vertices[indexB] = newVertices[1];
      }
    }
  });
  Undo.finishEdit("MTools: Split edges");
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
}

export default action("split_edges", () => {
  runEdit(180);
  Undo.amendEdit(
    {
      angle: { label: "Angle", value: 180, min: 0, max: 180 },
    },
    (form) => {
      runEdit(form.angle, true);
    }
  );
});
