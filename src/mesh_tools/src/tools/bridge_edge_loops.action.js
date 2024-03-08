import { action } from "../actions.js";
import {
  gatherSelectedEdgeLoops,
  groupElementsCollided,
  lerp3,
} from "../utils/utils.js";

function runEdit(amend, numberOfCuts, twist) {
  Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);

  /**
   *
   * @param {Mesh} mesh
   * @param {*} edgeLoopA
   * @param {*} edgeLoopB
   */
  function bridgeSingle(mesh, edgeLoopA, edgeLoopB) {
    for (let i = 0; i < edgeLoopA.length; i++) {
      let realI = i + twist;
      while (realI < 0) realI += edgeLoopA.length;
      while (realI >= edgeLoopA.length) realI -= edgeLoopA.length;

      const edgeA = edgeLoopA[realI];
      const edgeB = edgeLoopB[Math.min(i, edgeLoopB.length - 1)];

      let vertexA = edgeA[0];
      let vertexB = edgeA[1];
      let vertexC = edgeB[1];
      let vertexD = edgeB[0];
      const face = new MeshFace(mesh, {
        vertices: [vertexB, vertexA, vertexD, vertexC],
      });
      mesh.addFaces(face);
    }
  }
  /**
   *
   * @param {Mesh} mesh
   * @param {*} edgeLoopA
   * @param {*} edgeLoopB
   */
  function bridge(mesh, edgeLoopA, edgeLoopB) {
    const subEdgeLoops = [];
    for (let i = 0; i < numberOfCuts; i++) {
      const t = i / (numberOfCuts - 1);

      const subEdgeLoop = [];
      for (let j = 0; j < edgeLoopA.length; j++) {
        const edgeA = edgeLoopA[j];
        const edgeB = edgeLoopB[Math.min(j, edgeLoopB.length - 1)];

        if (i == 0) {
          subEdgeLoop.push(edgeA[0]);
        } else if (i == numberOfCuts - 1) {
          subEdgeLoop.push(edgeB[0]);
        } else {
          const vertex = lerp3(
            mesh.vertices[edgeA[0]],
            mesh.vertices[edgeB[0]],
            t
          );
          subEdgeLoop.push(mesh.addVertices(vertex)[0]);
        }
      }

      subEdgeLoops.push(groupElementsCollided(subEdgeLoop, 2));
    }

    for (let i = 0; i < subEdgeLoops.length - 1; i++) {
      const fromEdgeLoop = subEdgeLoops[i];
      const intoEdgeLoop = subEdgeLoops[i + 1];
      bridgeSingle(mesh, fromEdgeLoop, intoEdgeLoop);
    }
  }
  for (const mesh of Mesh.selected) {
    const edgeLoops = gatherSelectedEdgeLoops(mesh);
    if (edgeLoops.length < 2) continue;

    edgeLoops.sort((a, b) => {
      if (a.centroid.x != b.centroid.x) {
        return a.centroid.x - b.centroid.x;
      }
      if (a.centroid.y != b.centroid.y) {
        return a.centroid.y - b.centroid.y;
      }
      return a.centroid.z - b.centroid.z;
    });
    for (let i = 0; i < edgeLoops.length - 1; i++) {
      const fromEdgeLoop = edgeLoops[i];
      const intoEdgeLoop = edgeLoops[i + 1];
      bridge(mesh, fromEdgeLoop.edges, intoEdgeLoop.edges);
    }
  }
  Canvas.updatePositions();
  Undo.finishEdit("MTools: Bridged Edge Loops.");
}
export default action("bridge_edge_loops", () => {
  runEdit(false, 2, 0);
  Undo.amendEdit(
    {
      num_cuts: {
        type: "number",
        label: "Number Of Cuts",
        min: 1,
        value: 1,
      },
      twist: {
        type: "number",
        label: "Twist",
        value: 0,
      },
    },
    (form) => runEdit(true, form.num_cuts + 1, form.twist)
  );
});
