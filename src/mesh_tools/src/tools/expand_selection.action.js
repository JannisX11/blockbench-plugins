import { action } from "../actions.js";
import { computeVertexNeighborhood } from "../utils/utils.js";

export default action("expand_selection", () => {
  Mesh.selected.forEach((mesh) => {
    const neighborMap = computeVertexNeighborhood(mesh);

    const vertices = mesh.getSelectedVertices().slice();

    for (let vertexKey of vertices) {
      const neighbors = neighborMap[vertexKey];
      Project.mesh_selection[mesh.uuid].vertices.safePush(...neighbors);
    }
  });
  Canvas.updateView({ elements: Mesh.selected, selection: true });
});
