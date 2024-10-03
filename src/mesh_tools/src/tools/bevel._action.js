/**
 * !
 * ! Beveling is really brain draining!!! ...
 * ! Until my sanes are ready to continue, this action will be left silence.. alone...
 * !
 */
import { action } from "../actions.js";
import {
  groupElementsCollided,
  groupMultipleBy,
  lerp3,
} from "../utils/array.js";
import Neighborhood from "../utils/mesh/neighborhood.js";
import {
  extractEdgeKey,
  getEdgeKey,
  isEdgeKeySelected,
  quadrilate,
  sortVerticesByAngle,
} from "../utils/utils.js";
import { distanceBetweenSq } from "../utils/vector.js";
/**
 *
 * @param {*} v1
 * @param {*} v2
 * @param {*} factor
 * @returns {ArrayVector3}
 */
function interpolateEdge(v1, v2, factor) {
  return lerp3(v1, v2, factor);
  const offset = v2.slice().V3_subtract(v1);
  const direction = offset.V3_divide(
    Math.hypot(offset[0], offset[1], offset[2])
  );
  return direction.V3_multiply(factor);
}
function replaceVertexAndTriangulate(
  mesh,
  face,
  vertexKey,
  replacementVertices
) {
  const vertexKeys = face.getSortedVertices();
  const index = vertexKeys.indexOf(vertexKey);
  const nextVertexKey = vertexKeys[(index + 1) % vertexKeys.length];
  if (
    replacementVertices.length > 1 &&
    distanceBetweenSq(
      mesh.vertices[replacementVertices[0]],
      mesh.vertices[nextVertexKey]
    ) <
      distanceBetweenSq(
        mesh.vertices[replacementVertices[1]],
        mesh.vertices[nextVertexKey]
      )
  ) {
    replacementVertices.reverse();
  }

  vertexKeys.splice(index, 1, ...replacementVertices);

  replaceTriangulated(mesh, face, vertexKeys);
}
function runEdit(factor, amend) {
  Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);

  for (const mesh of Mesh.selected) {
    let veNeighborhood = Neighborhood.VertexEdges(mesh);
    let efNeighborhood = Neighborhood.EdgeFaces(mesh);
    let vfNeighborhood = Neighborhood.VertexFaces(mesh);
    const beveledEdgeVertices = new Map();

    const oppVertex = (face, edge, vertex) => {
      return extractEdgeKey(
        veNeighborhood[vertex].find(
          (e) =>
            e != edge && efNeighborhood[e] && efNeighborhood[e].includes(face)
        )
      ).find((e) => e != vertex);
    };

    function insetVertexFaces(
      vertexKey,
      edge,
      newVertexAKey,
      newVertexBKey,
      edgesA,
      edgesB,
      faces
    ) {
      const verticesToInset = veNeighborhood[vertexKey]
        .filter((e) => e != edge && !edgesA.includes(e) && !edgesB.includes(e))
        .map(extractEdgeKey)
        .map((e) => e.find((e) => e != vertexKey));

      const verticesToInsetMap = {};
      for (const vertexToInset of verticesToInset) {
        [verticesToInsetMap[vertexToInset]] = mesh.addVertices(
          interpolateEdge(
            mesh.vertices[vertexKey],
            mesh.vertices[vertexToInset],
            factor
          )
        );
      }
      const newFaceVertices = Object.values(verticesToInsetMap);
      newFaceVertices.unshift(newVertexAKey);
      newFaceVertices.push(newVertexBKey);

      // Inset Face
      const insetFace = new MeshFace(mesh, {
        vertices: sortVerticesByAngle(mesh, newFaceVertices),
      });
      mesh.addFaces(insetFace);
      replaceTriangulated(mesh, insetFace);

      for (const face of faces) {
        const edges = getEdgesOfFace(face);
        // TODO optimize by making use of face-face neighborhood
        const isNeighborWithA = edgesA.some((e) => edges.includes(e));
        const isNeighborWithB = edgesB.some((e) => edges.includes(e));

        const vertexKeys = face.getSortedVertices().slice();
        const replacementVertices = [];

        if (isNeighborWithA || isNeighborWithB) {
          replacementVertices.push(
            isNeighborWithA ? newVertexAKey : newVertexBKey
          );
        }

        for (let i = vertexKeys.length - 1; i >= 0; i--) {
          const vertexKey = vertexKeys[i];
          if (verticesToInsetMap[vertexKey]) {
            replacementVertices.push(verticesToInsetMap[vertexKey]);
          }
        }

        replaceVertexAndTriangulate(mesh, face, vertexKey, replacementVertices);
      }
    }
    function handleEdgeVertexFaces(
      vertexKey,
      edge,
      newVertexAKey,
      newVertexBKey,
      edgesA,
      edgesB,
      faces
    ) {
      if (faces.length < 1) {
        return;
      }
      if (faces.length > 1) {
        insetVertexFaces(
          vertexKey,
          edge,
          newVertexAKey,
          newVertexBKey,
          edgesA,
          edgesB,
          faces
        );
        return;
      }

      for (const face of faces)
        replaceVertexAndTriangulate(mesh, face, vertexKey, [
          newVertexBKey,
          newVertexAKey,
        ]);
    }

    for (const vertex in veNeighborhood) {
      const selectedEdges = veNeighborhood[vertex].filter(
        isEdgeKeySelected.bind(null, mesh)
      );
      const edges = veNeighborhood[vertex];
      if (selectedEdges.length == 0) continue;

      if (selectedEdges.length == 2) {
        const edgeA = selectedEdges[0];
        const edgeB = selectedEdges[1];
        const vertexA = extractEdgeKey(edgeA).find((e) => e != vertex);
        const vertexB = extractEdgeKey(edgeB).find((e) => e != vertex);

        const splitterEdges = edges.filter((e) => !selectedEdges.includes(e));
        function gatherNeighboringFacesUntilEdge(
          startingEdge,
          startingFace,
          targetEdge
        ) {
          let currentEdge;
          const faces = [];
          const foundEdges = [];
          const maxIterations = Object.values(mesh.faces).length ** 2;
          let safetyIndex = 0;
          while (safetyIndex <= maxIterations && currentEdge != targetEdge) {
            foundEdges.push(currentEdge ?? startingEdge);
            const facesEdges = (
              !currentEdge ? [startingFace] : efNeighborhood[currentEdge]
            ).map((e) => [e, getEdgesOfFace(e)]);

            currentEdge = undefined;
            for (const [face, edges] of facesEdges) {
              const edge = edges.find(
                (edge) =>
                  !foundEdges.includes(edge) &&
                  (splitterEdges.includes(edge) || edge == targetEdge)
              );
              if (edge) {
                currentEdge = edge;
                faces.push(face);
                break;
              }
            }
            if (!currentEdge) break;

            safetyIndex++;
          }

          return faces;
        }
        const facesA = efNeighborhood[edgeA];

        if (facesA.length != 2) {
          // TODO
          continue;
        }
        const facesB = efNeighborhood[edgeB];

        if (facesB.length != 2) {
          // TODO
          continue;
        }

        /**
         * Includes facesA[1] and (facesB[0] OR facesB[1])
         */
        const splitterFaces = gatherNeighboringFacesUntilEdge(
          edgeA,
          facesA[1],
          edgeB
        );

        // Make faces in the same order.
        if (!splitterFaces.includes(facesB[1])) {
          /**
           * Now splitterFaces includes facesA[1] and facesB[1]
           */
          facesB.reverse();
        }

        const commonFaces = gatherNeighboringFacesUntilEdge(
          edgeA,
          facesA[0],
          edgeB
        );

        let vertexCommon;
        let vertexSplit;
        {
          const oppVertexAAKey = oppVertex(facesA[0], edgeA, vertexA);
          const oppVertexABKey = oppVertex(facesA[1], edgeA, vertexA);
          const newVertexAA = interpolateEdge(
            mesh.vertices[vertexA],
            mesh.vertices[oppVertexAAKey],
            factor
          );
          const newVertexAB = interpolateEdge(
            mesh.vertices[vertexA],
            mesh.vertices[oppVertexABKey],
            factor
          );
          const oppVertexBAKey = oppVertex(facesB[0], edgeB, vertexB);
          const oppVertexBBKey = oppVertex(facesB[1], edgeB, vertexB);
          const newVertexBA = interpolateEdge(
            mesh.vertices[vertexB],
            mesh.vertices[oppVertexBAKey],
            factor
          );
          const newVertexBB = interpolateEdge(
            mesh.vertices[vertexB],
            mesh.vertices[oppVertexBBKey],
            factor
          );
          vertexCommon = newVertexAA
            .V3_subtract(mesh.vertices[vertexA])
            .V3_add(newVertexBA.V3_subtract(mesh.vertices[vertexB]))
            .V3_add(mesh.vertices[vertex]);
          vertexSplit = newVertexAB
            .V3_subtract(mesh.vertices[vertexA])
            .V3_add(newVertexBB.V3_subtract(mesh.vertices[vertexB]))
            .V3_add(mesh.vertices[vertex]);
        }

        const [vertexCommonKey, vertexSplitKey] = mesh.addVertices(
          vertexCommon,
          vertexSplit
        );
        /* Handle common */
        for (const commonFace of commonFaces) {
          const vertexIndex = commonFace.vertices.indexOf(vertex);
          commonFace.vertices[vertexIndex] = vertexCommonKey;
          commonFace.uv[vertexCommonKey] = commonFace.uv[vertex].slice();
        }

        /* Handle splitter */
        for (const splitterFace of splitterFaces) {
          const vertexIndex = splitterFace.vertices.indexOf(vertex);
          splitterFace.vertices[vertexIndex] = vertexSplitKey;
          splitterFace.uv[vertexSplitKey] = splitterFace.uv[vertex].slice();
        }

        /*  */
        beveledEdgeVertices.set(vertex, {
          newVertexAKey: vertexSplitKey,
          newVertexBKey: vertexCommonKey,
        });
      }
      if (selectedEdges.length == 1) {
        const edge = selectedEdges[0];
        if (efNeighborhood[edge].length < 2) {
          // TODO Disjoint
          continue;
        }
        if (efNeighborhood[edge].length > 2) {
          // TODO Non-Manifold
          continue;
        }

        const [faceA, faceB] = efNeighborhood[edge];
        const connectedFaces = vfNeighborhood[vertex].filter(
          (e) => e != faceA && e != faceB
        );
        const edgesA = getEdgesOfFace(faceA);
        const edgesB = getEdgesOfFace(faceB);

        /*  */
        const oppVertexAKey = oppVertex(faceA, edge, vertex);
        const oppVertexBKey = oppVertex(faceB, edge, vertex);
        const newVertexA = interpolateEdge(
          mesh.vertices[vertex],
          mesh.vertices[oppVertexAKey],
          factor
        );
        const newVertexB = interpolateEdge(
          mesh.vertices[vertex],
          mesh.vertices[oppVertexBKey],
          factor
        );
        let newVertexAKey = mesh.addVertices(newVertexA)[0];
        let newVertexBKey = mesh.addVertices(newVertexB)[0];
        handleEdgeVertexFaces(
          vertex,
          edge,
          newVertexAKey,
          newVertexBKey,
          edgesA,
          edgesB,
          connectedFaces
        );
        const vertexAIndex = faceA.vertices.indexOf(vertex);
        const vertexBIndex = faceB.vertices.indexOf(vertex);

        faceA.vertices[vertexAIndex] = newVertexAKey;
        faceB.vertices[vertexBIndex] = newVertexBKey;

        faceA.uv[newVertexAKey] = faceA.uv[vertex].slice();
        faceB.uv[newVertexBKey] = faceB.uv[vertex].slice();

        beveledEdgeVertices.set(vertex, {
          newVertexAKey,
          newVertexBKey,
        });
      }
    }

    // TODO use a real array of edges.
    for (const edge in efNeighborhood) {
      const [vertex0, vertex1] = extractEdgeKey(edge);
      if (
        !beveledEdgeVertices.has(vertex0) ||
        !beveledEdgeVertices.has(vertex1)
      )
        continue;
      const { newVertexAKey: newVertexA1Key, newVertexBKey: newVertexB1Key } =
        beveledEdgeVertices.get(vertex1);
      const { newVertexAKey: newVertexA0Key, newVertexBKey: newVertexB0Key } =
        beveledEdgeVertices.get(vertex0);

      const newFace = new MeshFace(mesh, {
        vertices: [
          newVertexA0Key,
          newVertexA1Key,
          newVertexB1Key,
          newVertexB0Key,
        ],
      });
      UVEditor.setAutoSize(null, true, mesh.addFaces(newFace));
    }
  }

  Undo.finishEdit("MTools: Bevel Edges");
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
}
function runEdit2(factor, amend) {
  Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);

  for (const mesh of Mesh.selected) {
    // A district?! 🤔
    // TODO move into more optimized Neighborhood.District(...);
    let veNeighborhood;
    let vfNeighborhood;
    let efNeighborhood;
    efNeighborhood = Neighborhood.EdgeFaces(mesh);
    veNeighborhood = Neighborhood.VertexEdges(mesh);
    vfNeighborhood = Neighborhood.VertexFaces(mesh);

    const oppVertex = (face, edge, vertex) => {
      return extractEdgeKey(
        veNeighborhood[vertex].find(
          (e) =>
            e != edge && efNeighborhood[e] && efNeighborhood[e].includes(face)
        )
      ).find((e) => e != vertex);
    };

    const processedEdgeSet = new Set();

    const edges = mesh.getSelectedEdges().map((e) => {
      e = getEdgeKey(e[0], e[1]);
      const vertices = extractEdgeKey(e);
      const tuple = vertices;
      tuple.push(e);

      return tuple;
    });

    /**
     * For Handling 2 connected edges
     */
    const verticesToMergeMap = new Map();
    const verticesToJoinMap = new Map();

    console.log(groupMultipleBy(edges, (value) => value.slice(0, 2)));
    for (const [vertex0Key, vertex1Key, edge] of edges) {
      if (processedEdgeSet.has(edge)) continue;
      processedEdgeSet.add(edge);

      const faces = efNeighborhood[edge];
      if (faces.length == 0) continue; /* Single Edge */
      if (faces.length == 1) continue; /* Single Face */
      if (faces.length > 2) continue; /* Non-Manifold */
      const [faceA, faceB] = faces;

      const verticesA = faceA.vertices;
      const verticesB = faceB.vertices;

      const sharedEdges0 = edges.filter(
        ([v0, v1, e]) => edge != e && (v0 == vertex0Key || v1 == vertex0Key)
      );
      const sharedEdges1 = edges.filter(
        ([v0, v1, e]) => edge != e && (v0 == vertex1Key || v1 == vertex1Key)
      );

      const oppVertexA0Key = oppVertex(faceA, edge, vertex0Key);
      const oppVertexA1Key = oppVertex(faceA, edge, vertex1Key);
      const oppVertexB0Key = oppVertex(faceB, edge, vertex0Key);
      const oppVertexB1Key = oppVertex(faceB, edge, vertex1Key);
      const vertexA0Index = verticesA.indexOf(vertex0Key);
      const vertexA1Index = verticesA.indexOf(vertex1Key);
      const vertexB0Index = verticesB.indexOf(vertex0Key);
      const vertexB1Index = verticesB.indexOf(vertex1Key);

      const vertex0 = mesh.vertices[vertex0Key];
      const vertex1 = mesh.vertices[vertex1Key];
      const oppVertexA0 = mesh.vertices[oppVertexA0Key];
      const oppVertexA1 = mesh.vertices[oppVertexA1Key];
      const oppVertexB0 = mesh.vertices[oppVertexB0Key];
      const oppVertexB1 = mesh.vertices[oppVertexB1Key];

      const newVertexA0 = lerp3(vertex0, oppVertexA0, factor);
      const newVertexA1 = lerp3(vertex1, oppVertexA1, factor);
      const newVertexB0 = lerp3(vertex0, oppVertexB0, factor);
      const newVertexB1 = lerp3(vertex1, oppVertexB1, factor);
      const newVertexA0Offset = newVertexA0.slice().V3_subtract(vertex0);
      const newVertexA1Offset = newVertexA1.slice().V3_subtract(vertex1);
      const newVertexB0Offset = newVertexB0.slice().V3_subtract(vertex0);
      const newVertexB1Offset = newVertexB1.slice().V3_subtract(vertex1);
      /* DO NOT SORT */
      const A0Edge = [vertex0Key, oppVertexA0Key].join("_");
      const A1Edge = [vertex1Key, oppVertexA1Key].join("_");
      const B0Edge = [vertex0Key, oppVertexB0Key].join("_");
      const B1Edge = [vertex1Key, oppVertexB1Key].join("_");
      let newVertexA0Key, newVertexA1Key, newVertexB0Key, newVertexB1Key;

      if (sharedEdges0.length == 1) {
        newVertexA0Key = verticesToMergeMap.get(A0Edge);
        newVertexB0Key = verticesToMergeMap.get(B0Edge);
      }
      if (sharedEdges1.length == 1) {
        newVertexA1Key = verticesToMergeMap.get(A1Edge);
        newVertexB1Key = verticesToMergeMap.get(B1Edge);
      }
      const toJoin0 = verticesToJoinMap.get(vertex0Key);
      const toJoin1 = verticesToJoinMap.get(vertex1Key);

      if (toJoin1) {
        if (!newVertexA1Key) {
          newVertexA1Key = toJoin1[0];
          mesh.vertices[newVertexA1Key].V3_add(newVertexA1Offset);
        }
        if (!newVertexB1Key) {
          newVertexB1Key = toJoin1[1];
          mesh.vertices[newVertexB1Key].V3_add(newVertexB1Offset);
        }
      }
      if (toJoin0) {
        if (!newVertexA0Key) {
          newVertexA0Key = toJoin0[0];
          mesh.vertices[newVertexA0Key].V3_add(newVertexA0Offset);
        }
        if (!newVertexB0Key) {
          newVertexB0Key = toJoin0[1];
          mesh.vertices[newVertexB0Key].V3_add(newVertexB0Offset);
        }
      }

      newVertexA0Key ??= mesh.addVertices(newVertexA0)[0];
      newVertexB0Key ??= mesh.addVertices(newVertexB0)[0];
      newVertexA1Key ??= mesh.addVertices(newVertexA1)[0];
      newVertexB1Key ??= mesh.addVertices(newVertexB1)[0];

      if (sharedEdges0.length == 1) {
        if (!verticesToJoinMap.has(vertex0Key)) {
          verticesToJoinMap.set(vertex0Key, [newVertexA0Key, newVertexB0Key]);
        }
      }
      if (sharedEdges1.length == 1) {
        if (!verticesToJoinMap.has(vertex1Key)) {
          verticesToJoinMap.set(vertex1Key, [newVertexA1Key, newVertexB1Key]);
        }
      }

      verticesToMergeMap.set(A0Edge, newVertexA0Key);
      verticesToMergeMap.set(B0Edge, newVertexB0Key);
      verticesToMergeMap.set(A1Edge, newVertexA1Key);
      verticesToMergeMap.set(B1Edge, newVertexB1Key);

      const newFace = new MeshFace(mesh, {
        vertices: [
          newVertexA0Key,
          newVertexA1Key,
          newVertexB1Key,
          newVertexB0Key,
        ],
        uv: {
          [newVertexA0Key]: faceA.uv[vertex0Key].slice(),
          [newVertexA1Key]: faceA.uv[vertex1Key].slice(),
          [newVertexB0Key]: faceB.uv[vertex0Key].slice(),
          [newVertexB1Key]: faceB.uv[vertex1Key].slice(),
        },
      });
      mesh.addFaces(newFace);

      const faces0 = vfNeighborhood[vertex0Key].filter(
        (e) => e != faceA && e != faceB
      );
      const faces1 = vfNeighborhood[vertex1Key].filter(
        (e) => e != faceA && e != faceB
      );

      const edgesA = getEdgesOfFace(faceA);
      const edgesB = getEdgesOfFace(faceB);

      function insetVertexFaces(
        vertexKey,
        newVertexAKey,
        newVertexBKey,
        faces
      ) {
        const verticesToInset = veNeighborhood[vertexKey]
          .filter(
            (e) => e != edge && !edgesA.includes(e) && !edgesB.includes(e)
          )
          .map(extractEdgeKey)
          .map((e) => e.find((e) => e != vertexKey));

        const verticesToInsetMap = {};
        for (const vertexToInset of verticesToInset) {
          [verticesToInsetMap[vertexToInset]] = mesh.addVertices(
            lerp3(
              mesh.vertices[vertexKey],
              mesh.vertices[vertexToInset],
              factor
            )
          );
        }
        const newFaceVertices = Object.values(verticesToInsetMap);
        newFaceVertices.unshift(newVertexAKey);
        newFaceVertices.push(newVertexBKey);

        // Inset Face
        const insetFace = new MeshFace(mesh, { vertices: newFaceVertices });
        mesh.addFaces(insetFace);
        replaceTriangulated(mesh, insetFace);

        for (const face of faces) {
          const edges = getEdgesOfFace(face);
          // TODO optimize by making use of face-face neighborhood
          const isNeighborWithA = edgesA.some((e) => edges.includes(e));
          const isNeighborWithB = edgesB.some((e) => edges.includes(e));

          const vertexKeys = face.getSortedVertices().slice();
          const replacementVertices = [];

          if (isNeighborWithA || isNeighborWithB) {
            replacementVertices.push(
              isNeighborWithA ? newVertexAKey : newVertexBKey
            );
          }

          for (let i = vertexKeys.length - 1; i >= 0; i--) {
            const vertexKey = vertexKeys[i];
            if (verticesToInsetMap[vertexKey]) {
              replacementVertices.push(verticesToInsetMap[vertexKey]);
            }
          }

          replaceVertexAndTriangulate(
            mesh,
            face,
            vertexKey,
            replacementVertices
          );
        }
      }
      function handleEdgeVertexFaces(
        vertexKey,
        newVertexAKey,
        newVertexBKey,
        faces
      ) {
        if (faces.length < 1) {
          return;
        }

        if (faces.length > 1) {
          insetVertexFaces(vertexKey, newVertexAKey, newVertexBKey, faces);
          return;
        }

        for (const face of faces)
          replaceVertexAndTriangulate(mesh, face, vertexKey, [
            newVertexBKey,
            newVertexAKey,
          ]);
      }

      if (sharedEdges0.length == 0) {
        handleEdgeVertexFaces(
          vertex0Key,
          newVertexA0Key,
          newVertexB0Key,
          faces0
        );
      }
      if (sharedEdges1.length == 0) {
        handleEdgeVertexFaces(
          vertex1Key,
          newVertexA1Key,
          newVertexB1Key,
          faces1
        );
      }

      faceA.vertices[vertexA0Index] = newVertexA0Key;
      faceA.vertices[vertexA1Index] = newVertexA1Key;
      faceB.vertices[vertexB0Index] = newVertexB0Key;
      faceB.vertices[vertexB1Index] = newVertexB1Key;

      faceA.uv[newVertexA0Key] = faceA.uv[vertex0Key].slice();
      faceA.uv[newVertexA1Key] = faceA.uv[vertex1Key].slice();
      faceB.uv[newVertexB0Key] = faceB.uv[vertex0Key].slice();
      faceB.uv[newVertexB1Key] = faceB.uv[vertex1Key].slice();
    }
  }

  Undo.finishEdit("MTools: Bevel Edges");
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
}
export default action("bevel", () => {
  runEdit(0.1, false);
  Undo.amendEdit(
    {
      factor: {
        label: "Width Percentage",
        type: "number",
        value: 10,
        min: 0,
        max: 100,
      },
    },
    ({ factor }) => runEdit(factor / 100, true)
  );
});
function getEdgesOfFace(face) {
  return groupElementsCollided(face.getSortedVertices(), 2).map((e) =>
    getEdgeKey(e[0], e[1])
  );
}
function fillInAbsentUVS(face) {
  for (const vertex of face.vertices) {
    face.uv[vertex] ??= [0, 0]; // TODO
  }
  if (
    face.vertices.map((e) => face.uv[e]).allAre((e) => e[0] == 0 && e[1] == 0)
  ) {
    UVEditor.setAutoSize(null, true, [face.getFaceKey()]);
  }
}
function replaceTriangulated(
  mesh,
  face,
  vertexKeys = face.getSortedVertices()
) {
  fillInAbsentUVS(face);
  if (vertexKeys.length == 4) return;

  const vertices = vertexKeys.map((e) => mesh.vertices[e]);
  const quadrilaterals = quadrilate(vertices);

  delete mesh.faces[face.getFaceKey()];

  for (const quadrilateral of quadrilaterals) {
    const newFace = new MeshFace(mesh, face).extend({
      vertices: quadrilateral.map((e) => vertexKeys[e]),
    });
    mesh.addFaces(newFace);
  }
}
