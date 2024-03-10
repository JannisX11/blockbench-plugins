import { action } from "../actions.js";
import {
  computeCentroid,
  extractEdgeKey,
  findMin,
  getSelectedEdgesConnectedCountMap,
  getSelectedFacesAndEdgesByVertices,
  groupElementsCollided,
  lerp3,
  offsetArray,
  selectFacesAndEdgesByVertices,
} from "../utils/utils.js";
import { distanceBetween } from "../utils/vector.js";

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

    const width = distanceBetween(
      mesh.vertices[vertexB],
      mesh.vertices[vertexA]
    );
    const height = distanceBetween(
      mesh.vertices[vertexA],
      mesh.vertices[vertexD]
    );
    const face = new MeshFace(mesh, {
      vertices: [vertexB, vertexA, vertexD, vertexC],
      uv: {
        [vertexB]: [0, 0],
        [vertexA]: [width, 0],
        [vertexD]: [width, height],
        [vertexC]: [0, height],
      },
    });
    mesh.addFaces(face);
  }
}
function edgeLoopsBridgeLength(mesh, edgeLoopA, edgeLoopB) {
  let length = 0;
  for (let i = 0; i < edgeLoopA.length; i++) {
    const [vertexA0] = edgeLoopA[i];
    const [vertexB0] = edgeLoopB[Math.min(i, edgeLoopB.length - 1)];
    length += distanceBetween(mesh.vertices[vertexA0], mesh.vertices[vertexB0]);
  }
  return length;
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
  edgeLoopA = edgeLoopA.map((e) => e.slice());
  edgeLoopB = edgeLoopB.map((e) => e.slice());

  const subEdgeLoops = [];
  offsetArray(edgeLoopB, twist);

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

    const loops = [];
    const { edges } = getSelectedFacesAndEdgesByVertices(mesh, keptVerticesSet);

    const visitedEdges = new Set();
    for (const edge of edges) {
      if (visitedEdges.has(edge)) continue;
      visitedEdges.add(edge);

      const currentLoop = [edge];
      while (true) {
        const targetEdge = currentLoop.last();
        let connectedEdge;
        for (const otherEdge of edges) {
          if (
            !currentLoop.includes(otherEdge) &&
            (otherEdge[0] == targetEdge[0] ||
              otherEdge[1] == targetEdge[0] ||
              otherEdge[1] == targetEdge[1] ||
              otherEdge[0] == targetEdge[1])
          ) {
            connectedEdge = otherEdge;
            break;
          }
        }
        if (!connectedEdge) break;
        if (visitedEdges.has(connectedEdge)) break;

        visitedEdges.add(connectedEdge);
        currentLoop.push(connectedEdge);
      }
      // Organize unorganized loops
      for (let i = 0; i < currentLoop.length; i++) {
        const currEdge = currentLoop[i];
        const nextEdge = currentLoop[(i + 1) % currentLoop.length];
        if (currEdge[1] != nextEdge[0]) {
          nextEdge.reverse();
        }
      }

      loops.push(currentLoop);
    }

    if (loops.length < 2) continue;
    for (let i = 0; i < loops.length; i++) {
      loops[i] = {
        loop: loops[i],
        centroid: computeCentroid(loops[i].map((e) => mesh.vertices[e[0]])),
      };
    }

    const sortedEdgeLoops = [loops.pop()];
    while (loops.length) {
      const currEdgeLoop = sortedEdgeLoops.last();
      const closestLoop = findMin(loops, (e) =>
        e.centroid.distanceToSquared(currEdgeLoop.centroid)
      );

      sortedEdgeLoops.push(closestLoop);
      loops.remove(closestLoop);
    }
    for (let i = 0; i < sortedEdgeLoops.length - 1; i++) {
      const fromEdgeLoop = sortedEdgeLoops[i].loop.slice();
      const intoEdgeLoop = sortedEdgeLoops[i + 1].loop.slice();

      let bestOffset = bestEdgeLoopsOffset(intoEdgeLoop, fromEdgeLoop, mesh);
      offsetArray(intoEdgeLoop, bestOffset);

      bridgeLoopsConfigured(mesh, fromEdgeLoop, intoEdgeLoop, {
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
/**
 * Returns the best offset applied on {@linkcode intoEdgeLoop} when connected with {@linkcode fromEdgeLoop}
 * @param {*} fromEdgeLoop
 * @param {*} intoEdgeLoop
 * @param {Mesh} mesh
 * @returns {number}
 */
function bestEdgeLoopsOffset(fromEdgeLoop, intoEdgeLoop, mesh) {
  let bestOffset = 0;
  let minLength = Infinity;
  outer: for (let i = 0; i < intoEdgeLoop.length; i++) {
    let length = 0;
    for (let i = 0; i < fromEdgeLoop.length; i++) {
      const [vertexA0] = fromEdgeLoop[i];
      const [vertexB0] = intoEdgeLoop[Math.min(i, intoEdgeLoop.length - 1)];
      length += distanceBetween(
        mesh.vertices[vertexA0],
        mesh.vertices[vertexB0]
      );

      // Optimization
      if (length > minLength) {
        offsetArray(intoEdgeLoop, 1);
        continue outer;
      }
    }
    if (length <= minLength) {
      bestOffset = i;
      minLength = length;
    }
    offsetArray(intoEdgeLoop, 1);
  }
  return bestOffset;
}
