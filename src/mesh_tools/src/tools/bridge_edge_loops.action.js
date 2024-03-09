import { action } from "../actions.js";
import {
  extractEdgeKey,
  gatherEdgeLoopsIncluding,
  findMin,
  getSelectedEdgesConnectedCountMap,
  groupElementsCollided,
  lerp3,
  selectFacesAndEdgesByVertices,
  computeCentroid,
} from "../utils/utils.js";

/**
 *
 * @param {Mesh} mesh
 * @param {*} edgeLoopA
 * @param {*} edgeLoopB
 */
function bridgeLoops(mesh, edgeLoopA, edgeLoopB) {
  for (let i = 0; i < edgeLoopA.length; i++) {
    const edgeA = edgeLoopA[i];
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
function bridgeLoopsConfigured(
  mesh,
  edgeLoopA,
  edgeLoopB,
  { twist, numberOfCuts }
) {
  const subEdgeLoops = [];
  while (twist < 0) twist += edgeLoopA.length;
  while (twist >= edgeLoopA.length) twist -= edgeLoopA.length;

  const sub = edgeLoopB.splice(0, twist);
  edgeLoopB.push(...sub.reverse());

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
    bridgeLoops(mesh, fromEdgeLoop, intoEdgeLoop);
  }
}

function runEdit(amend, numberOfCuts, twist, cutHoles) {
  Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);

  for (const mesh of Mesh.selected) {
    // Delete selected faces and keep outer edges
    let keptVerticesSet;
    if (BarItems["selection_mode"].value == "face") {
      keptVerticesSet = new Set();
      const keptEdges = new Set();
      const {
        selectedConnectedCount: edgesConnectedCount,
        connectedCount: edgesAllConnectedCount,
      } = getSelectedEdgesConnectedCountMap(mesh);

      for (const edge in edgesConnectedCount) {
        const [a, b] = extractEdgeKey(edge);
        const count = edgesConnectedCount[edge];
        const allCount = edgesAllConnectedCount[edge];

        if (count == 1) {
          keptEdges.add(edge);
          keptVerticesSet.add(a);
          keptVerticesSet.add(b);

          if (allCount == 1 && cutHoles) {
            mesh.addFaces(
              new MeshFace(mesh, {
                vertices: [a, b],
              })
            );
          }
        }
      }

      if (cutHoles) {
        const leftVerticesSet = new Set();
        for (const vertexKey of mesh.getSelectedVertices()) {
          if (!keptVerticesSet.has(vertexKey)) {
            leftVerticesSet.add(vertexKey);
          }
        }
        for (const vertexKey of leftVerticesSet) {
          delete mesh.vertices[vertexKey];
        }
        for (const faceKey of mesh.getSelectedFaces()) {
          delete mesh.faces[faceKey];
        }
      }
      selectFacesAndEdgesByVertices(mesh, keptVerticesSet);
    } else {
      keptVerticesSet = new Set(mesh.getSelectedVertices());
    }
    const edgeLoops = gatherEdgeLoopsIncluding(mesh, keptVerticesSet);
    if (edgeLoops.length < 2) continue;
    for (let i = 0; i < edgeLoops.length; i++) {
      edgeLoops[i] = {
        edges: edgeLoops[i],
        centroid: computeCentroid(edgeLoops[i].map((e) => mesh.vertices[e[0]])),
      };
    }

    const sortedEdgeLoops = [edgeLoops.pop()];
    while (edgeLoops.length) {
      const currEdgeLoop = sortedEdgeLoops.last();
      const closestLoop = findMin(edgeLoops, (e) =>
        e.centroid.distanceToSquared(currEdgeLoop.centroid)
      );

      sortedEdgeLoops.push(closestLoop);
      edgeLoops.remove(closestLoop);
    }
    for (let i = 0; i < sortedEdgeLoops.length - 1; i++) {
      const fromEdgeLoop = sortedEdgeLoops[i];
      const intoEdgeLoop = sortedEdgeLoops[i + 1];
      bridgeLoopsConfigured(mesh, fromEdgeLoop.edges, intoEdgeLoop.edges, {
        twist,
        numberOfCuts,
      });
    }
  }
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
  });
  Undo.finishEdit("MTools: Bridged Edge Loops.");
}
export default action("bridge_edge_loops", () => {
  runEdit(false, 2, 0, true);
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
      cut_holes: {
        type: "checkbox",
        label: "Cut Holes",
        value: true,
        condition: () => BarItems["selection_mode"].value == "face",
      },
    },
    (form) => runEdit(true, form.num_cuts + 1, form.twist, form.cut_holes)
  );
});
