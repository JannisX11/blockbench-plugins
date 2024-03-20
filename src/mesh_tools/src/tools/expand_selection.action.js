import { action } from "../actions.js";
import { computeVertexNeighborhood, selectFacesAndEdgesByVertices } from "../utils/utils.js";

export default action("expand_selection", () => {
  Mesh.selected.forEach((mesh) => {
    const neighborMap = computeVertexNeighborhood(mesh);

    const selectedVertices = mesh.getSelectedVertices();
    const selectedVertexSet = new Set(selectedVertices);
    for (const vertexKey of selectedVertices) {
      const neighbors = neighborMap[vertexKey];
      if (neighbors) {
        for (const neighbor of neighbors) {
          selectedVertexSet.add(neighbor);
        }
      }
    }
    selectFacesAndEdgesByVertices(mesh, selectedVertexSet);
  });
  Canvas.updateView({ elements: Mesh.selected, selection: true });
});
