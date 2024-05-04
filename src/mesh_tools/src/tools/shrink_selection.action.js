import { action } from "../actions.js";
import Neighborhood from "../utils/mesh/neighborhood.js";
import { selectFacesAndEdgesByVertices } from "../utils/utils.js";

export default action("shrink_selection", () => {
  Mesh.selected.forEach((mesh) => {
    const neighborMap = Neighborhood.VertexVertices(mesh);

    const selectedVertices = mesh.getSelectedVertices();
    const selectedVertexSet = new Set(selectedVertices);
    for (const vertexKey of selectedVertices) {
      const neighbors = neighborMap[vertexKey];

      for (const neighbor of neighbors) {
        const isNotSelected = !selectedVertexSet.has(neighbor);

        if (isNotSelected) {
          selectedVertexSet.delete(vertexKey);
          break;
        }
      }
    }
    selectFacesAndEdgesByVertices(mesh, selectedVertexSet);
  });
  Canvas.updateView({ elements: Mesh.selected, selection: true });
});
