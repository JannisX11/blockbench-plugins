export function nonIndexed(geometry) {
  const mesh = new Mesh({ vertices: {} });

  const vertices = geometry.getAttribute("position");
  const vertexLength = vertices.count;

  const newVertices = [];
  const positions = {}; // remove duplicate vertices on the go
  for (let i = 0; i < vertexLength; i++) {
    let v = [vertices.getX(i), vertices.getY(i), vertices.getZ(i)];
    if (positions[v]) {
      newVertices.push(positions[v].key);
    } else {
      newVertices.push(mesh.addVertices(v)[0]);
      positions[v] = { v, key: newVertices.last() };
    }
  }
  for (let i = 0; i < vertexLength; i += 3) {
    let face = new MeshFace(mesh, {
      vertices: [newVertices[i + 0], newVertices[i + 1], newVertices[i + 2]],
    });
    mesh.addFaces(face);
  }
  return mesh;
}
export function indexed(geometry, quadCompatible) {
  const mesh = new Mesh({ vertices: {} });

  const vertices = geometry.getAttribute("position");
  let indices = geometry.getIndex();
  const vertexLength = vertices.count;
  const faceLength = indices.count;
  indices = indices.array;

  const newVertices = [];
  for (let i = 0; i < vertexLength; i++) {
    const v = [vertices.getX(i), vertices.getY(i), vertices.getZ(i)];
    newVertices.push(mesh.addVertices(v)[0]);
  }
  if (quadCompatible) {
    for (let i = 0; i < faceLength; i += 6) {
      const face = new MeshFace(mesh, {
        vertices: [
          newVertices[indices[i + 0]],
          newVertices[indices[i + 1]],
          newVertices[indices[i + 4]],
          newVertices[indices[i + 2]],
        ],
      });
      mesh.addFaces(face);
    }
  } else {
    for (let i = 0; i < faceLength; i += 3) {
      const face = new MeshFace(mesh, {
        vertices: [
          newVertices[indices[i + 0]],
          newVertices[indices[i + 1]],
          newVertices[indices[i + 2]],
        ],
      });
      mesh.addFaces(face);
    }
  }
  return mesh;
}
