// https://en.wikipedia.org/wiki/Catmull–Clark_subdivision_surface
// custom data, just for manging other data easily
export class CMFace {
  /**
   * @type Array<CMFace>
   */
  static all = [];
  constructor(bbFace, key) {
    this.key = key;
    this.bbFace = bbFace;
    this.facePoint = bbFace.getCenter();
    this.uuid = guid();
    this.facePointKey = bbFace.mesh.addVertices(this.facePoint)[0];
    this.edgePoints = []; // should be called edges
    this.vertices = []; // store sorted vertices before editing vertices positions and causing BB sorting problems
    CMFace.all.push(this);
  }
  for(vertex) {
    return this.bbFace.vertices.includes(vertex);
  }
}
export class CMEdge {
  /**
   * @type Array<CMEdge>
   */
  static all = [];
  constructor(a, b, edgePoint, center) {
    this.vertexA = a;
    this.vertexB = b;
    this.uuid = guid();
    this.center = center;
    this.edgePoint = edgePoint;
    CMEdge.all.push(this);
  }
  equals(other) {
    return (
      (other.vertexA == this.vertexA && other.vertexB == this.vertexB) ||
      (other.vertexA == this.vertexB && other.vertexB == this.vertexA)
    );
  }
  equalsV(a, b) {
    return (
      (a == this.vertexA && b == this.vertexB) ||
      (a == this.vertexB && b == this.vertexA)
    );
  }
  equalsU(other) {
    return this.uuid == other.uuid;
  }
  for(vertex) {
    return this.vertexA == vertex || this.vertexB == vertex;
  }
}

export class MTEdge {
  /**
   * @type Array<MTEdge>
   */
  static all = [];
  static reset() {
    MTEdge.all = [];
  }
  constructor(a, b, data) {
    this.vertexA = a;
    this.vertexB = b;
    this.faces = [];
    this.indices = data.indices;
    this.center = data ? data.center : null;
    MTEdge.all.push(this);
  }
  equals(other) {
    return (
      (other.vertexA == this.vertexA && other.vertexB == this.vertexB) ||
      (other.vertexA == this.vertexB && other.vertexB == this.vertexA)
    );
  }
  equalsV(a, b) {
    return (
      (a == this.vertexA && b == this.vertexB) ||
      (a == this.vertexB && b == this.vertexA)
    );
  }
}
