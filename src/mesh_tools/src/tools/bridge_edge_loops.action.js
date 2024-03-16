/**
 * !
 * ! Big thanks to Blender for inspiration.
 * ! Special thanks to this code that came in clutch when i was about to give up on path interpolation option.
 * ! https://github.com/blender/blender/blob/703353b5dafc344ac4080d280312ef3aa496b6de/source/blender/bmesh/operators/bmo_subdivide_edgering.cc#L67
 * !
 */

import { action } from "../actions.js";
import {
  CubicBezier as CB,
  closestToLine,
  computeCentroid,
  computeTriangleNormal,
  extractEdgeKey,
  findMin,
  getSelectedEdgesConnectedCountMap,
  getSelectedFacesAndEdgesByVertices,
  groupElementsCollided,
  lerp3,
  offsetArray,
  selectFacesAndEdgesByVertices,
} from "../utils/utils.js";
import {
  addVectors,
  distanceBetween,
  subtractVectors,
} from "../utils/vector.js";

// +
/**
 *
 * @param {THREE.Vector3} coordinateA
 * @param {THREE.Vector3} normalA
 * @param {THREE.Vector3} coordinateB
 * @param {THREE.Vector3} normalB
 * @returns {number}
 */
function bezierHandleCalcLength(coordinateA, normalA, coordinateB, normalB) {
  const dot = normalA.dot(normalB);
  /* gives closest approx at a circle with 2 parallel handles */
  let fac = 1.333333;
  let len;
  if (dot < 0.0) {
    /* Scale down to 0.666 if we point directly at each other rough but ok. */
    /* TODO: current blend from dot may not be optimal but its also a detail. */
    const t = 1.0 + dot;
    fac = fac * t + 0.75 * (1.0 - t);
  }

  /* 2d length projected on plane of normals */
  {
    let co_a_ofs = new THREE.Vector3().crossVectors(normalA, normalB);

    if (co_a_ofs.lengthSq() > Number.MIN_VALUE) {
      co_a_ofs.add(coordinateA);
      closestToLine(co_a_ofs, coordinateB, coordinateA, co_a_ofs);
    } else {
      co_a_ofs.copy(coordinateA);
    }
    len = co_a_ofs.distanceTo(coordinateB);
  }

  return len * 0.5 * fac;
}
// +

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

/**
 *
 * @param {Mesh} mesh
 * @param {*} edgeLoopA
 * @param {*} edgeLoopB
 * @param {THREE.Vector3} centroidA
 * @param {THREE.Vector3} centroidB
 */
function bridgeLoopsConfigured(
  mesh,
  edgeLoopA,
  edgeLoopB,
  centroidA,
  centroidB,
  { twist, numberOfCuts, blendPath, blendInfluence, reverse }
) {
  if (edgeLoopA.length < 3 || edgeLoopB.length < 3) {
    return;
  }
  edgeLoopA = edgeLoopA.map((e) => e.slice());
  edgeLoopB = edgeLoopB.map((e) => e.slice());

  const bestOffset = bestEdgeLoopsOffset(edgeLoopB, edgeLoopA, mesh);
  offsetArray(edgeLoopB, bestOffset);

  // TODO: Detect `reverse` automatically.
  if (reverse) {
    edgeLoopB.forEach((e) => e.reverse());
    edgeLoopB.reverse();

    const bestOffset2 = bestEdgeLoopsOffset(edgeLoopB, edgeLoopA, mesh);

    // Negation of `bestOffset2` since the array is reversed,
    // Does it make ANY sense?
    // It doesn't!
    // It just happens to work.
    offsetArray(edgeLoopB, -bestOffset2);
  }

  // const firstNLength = distanceBetween(
  //   mesh.vertices[edgeLoopA[0][0]],
  //   mesh.vertices[edgeLoopB[0][0]]
  // );
  // const lastNLength = distanceBetween(
  //   mesh.vertices[edgeLoopA.last()[0]],
  //   mesh.vertices[edgeLoopB.last()[0]]
  // );
  // const firstRLength = distanceBetween(
  //   mesh.vertices[edgeLoopA[0][0]],
  //   mesh.vertices[edgeLoopB.last()[0]]
  // );
  // const lastRLength = distanceBetween(
  //   mesh.vertices[edgeLoopA.last()[0]],
  //   mesh.vertices[edgeLoopB[0][0]]
  // );
  // console.log(
  //   firstNLength,
  //   lastNLength ,
  //   firstRLength,
  //   lastRLength ,
  // );

  let handleA;
  let handleB;
  let direction;
  if (blendPath) {
    // +
    direction = new THREE.Vector3().subVectors(centroidB, centroidA);
    const edgeLoopANormal = computeTriangleNormal(
      mesh.vertices[edgeLoopA[0][0]],
      mesh.vertices[edgeLoopA[1][0]],
      mesh.vertices[edgeLoopA[2][0]]
    ).normalize();
    const edgeLoopBNormal = computeTriangleNormal(
      mesh.vertices[edgeLoopB[0][0]],
      mesh.vertices[edgeLoopB[1][0]],
      mesh.vertices[edgeLoopB[2][0]]
    ).normalize();

    // Normals should be facing each other
    if (direction.dot(edgeLoopANormal) < 0) {
      edgeLoopANormal.negate();
    }
    if (direction.dot(edgeLoopBNormal) > 0) {
      edgeLoopBNormal.negate();
    }
    // +

    const handleLength =
      bezierHandleCalcLength(
        centroidA,
        edgeLoopANormal,
        centroidB,
        edgeLoopBNormal
      ) * blendInfluence;
    handleA = edgeLoopANormal.clone();
    handleA.setLength(handleLength);
    handleA.add(centroidA);
    handleB = edgeLoopBNormal.clone();
    handleB.setLength(handleLength);
    handleB.add(centroidB);
  }

  const subEdgeLoops = [];
  offsetArray(edgeLoopB, twist);

  for (let i = 0; i < numberOfCuts; i++) {
    const t = i / (numberOfCuts - 1);

    const subEdgeLoop = [];
    // TODO ??
    const centroid = lerp3(centroidA.toArray(), centroidB.toArray(), t);
    const normal = lerp3(centroidA.toArray(), centroidB.toArray(), t);

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
        if (handleA && handleB) {
          const v3Vertex = vertex.V3_toThree();
          subtractVectors(v3Vertex, centroid);

          // const smoothenedTangent = [
          //   CBTangent(t, centroidA.x, handleA.x, handleB.x, centroidB.x),
          //   CBTangent(t, centroidA.y, handleA.y, handleB.y, centroidB.y),
          //   CBTangent(t, centroidA.z, handleA.z, handleB.z, centroidB.z),
          // ].V3_toThree();
          // const eulerInitial = rotationFromDirection(direction);
          // const eulerTarget = rotationFromDirection(smoothenedTangent);
          // const matrix4Initial = new THREE.Matrix4().makeRotationFromEuler(
          //   eulerInitial
          // );
          // const matrix4Target = new THREE.Matrix4().makeRotationFromEuler(
          //   eulerTarget
          // );
          // const matrix = matrix4Initial
          //   .clone()
          //   .transpose()
          //   .multiply(matrix4Target);
          // v3Vertex.applyMatrix4(matrix);

          const smoothenedCentroid = [
            CB(t, centroidA.x, handleA.x, handleB.x, centroidB.x),
            CB(t, centroidA.y, handleA.y, handleB.y, centroidB.y),
            CB(t, centroidA.z, handleA.z, handleB.z, centroidB.z),
          ];

          addVectors(v3Vertex, smoothenedCentroid);
          vertex[0] = v3Vertex.x;
          vertex[1] = v3Vertex.y;
          vertex[2] = v3Vertex.z;
        }

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

function runEdit(
  amend,
  numberOfCuts,
  twist,
  cutHoles,
  blendPath,
  blendInfluence,
  reverse
) {
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
      const { centroid: fromCentroid, loop: fromEdgeLoop } = sortedEdgeLoops[i];
      const { centroid: intoCentroid, loop: intoEdgeLoop } =
        sortedEdgeLoops[i + 1];

      bridgeLoopsConfigured(
        mesh,
        fromEdgeLoop,
        intoEdgeLoop,
        fromCentroid,
        intoCentroid,
        {
          twist,
          numberOfCuts,
          blendPath,
          blendInfluence,
          reverse,
        }
      );
    }
  }
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
  });
  Undo.finishEdit("MTools: Bridged Edge Loops.");
}
export default action("bridge_edge_loops", () => {
  runEdit(false, 2, 0, true, true, 1, false);

  Undo.amendEdit(
    {
      blend_path: {
        type: "checkbox",
        label: "Blend Path",
        value: true,
      },
      /**
       * TODO: convert into a single field "reversed" when [#2231](https://github.com/JannisX11/blockbench/issues/2231) gets fixed.
       */
      order: {
        type: "checkbox",
        label: "[Ordered]/[Reversed]",
        value: true,
      },
      blend_influence: {
        type: "number",
        label: "Smoothness",
        value: 100,
        min: -200,
        max: 200,
      },
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
    (form) => {
      runEdit(
        true,
        form.num_cuts + 1,
        form.twist,
        form.cut_holes,
        form.blend_path,
        form.blend_influence / 100,
        !form.order
      );
    }
  );
});
function edgeLoopsLength(mesh, fromEdgeLoop, intoEdgeLoop) {
  let length = 0;
  for (let i = 0; i < fromEdgeLoop.length; i++) {
    const [vertexA0] = fromEdgeLoop[i];
    const [vertexB0] = intoEdgeLoop[Math.min(i, intoEdgeLoop.length - 1)];
    length += distanceBetween(mesh.vertices[vertexA0], mesh.vertices[vertexB0]);
  }
  return length;
}
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
