import { action } from "../actions.js";
import Neighborhood from "../utils/mesh/neighborhood.js";
import { selectFacesAndEdgesByVertices } from "../utils/utils.js";

export default action("expand_selection", () => {
  Mesh.selected.forEach((mesh) => {
    const neighborMap = Neighborhood.VertexVertices(mesh);

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
