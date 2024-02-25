import { action } from "../actions.js";
import { computeVertexNeighborhood } from "../utils/utils.js";

export default action("shrink_selection", () => {
  Mesh.selected.forEach((mesh) => {
    const neighborMap = computeVertexNeighborhood(mesh);

    const vertices = mesh.getSelectedVertices().slice();

    for (let vertexKey of vertices) {
      const neighbors = neighborMap[vertexKey];
      let atleastOneNeighborIsNotSelected = false;

      for (const neigbor of neighbors) {
        atleastOneNeighborIsNotSelected = !vertices.includes(neigbor);

        if (atleastOneNeighborIsNotSelected) break;
      }

      if (atleastOneNeighborIsNotSelected) {
        Project.mesh_selection[mesh.uuid].vertices.remove(vertexKey);
      }
    }
  });
  Canvas.updateView({ elements: Mesh.selected, selection: true });
});
