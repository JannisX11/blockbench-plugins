import { action } from "../actions.js";
import { normalOfTri, rotationFromDir } from "../utils/utils.js";

function runEdit(mesh, group, density, amend = false) {
  const meshes = [];
  Undo.initEdit({ elements: meshes, selection: true, group }, amend);

  const tmesh = mesh.mesh; // threejs mesh

  const faces = tmesh.geometry.getIndex();
  const vertices = tmesh.geometry.getAttribute("position");
  const l = faces.count;

  let selected = Mesh.selected;
  for (let d = 0; d < density; d++) {
    const i = Math.round((Math.random() * l) / 3) * 3; // random face index
    const t0 = new THREE.Vector3(
      vertices.getX(faces.getX(i)),
      vertices.getY(faces.getX(i)),
      vertices.getZ(faces.getX(i))
    );
    const t1 = new THREE.Vector3(
      vertices.getX(faces.getY(i)),
      vertices.getY(faces.getY(i)),
      vertices.getZ(faces.getY(i))
    );
    const t2 = new THREE.Vector3(
      vertices.getX(faces.getZ(i)),
      vertices.getY(faces.getZ(i)),
      vertices.getZ(faces.getZ(i))
    );

    tmesh.localToWorld(t0);
    tmesh.localToWorld(t1);
    tmesh.localToWorld(t2);

    // f*ed up midpoint theroem
    const pointA = new THREE.Vector3().lerpVectors(t0, t1, Math.random());
    const pointB = new THREE.Vector3().lerpVectors(t0, t2, Math.random());
    const pointF = new THREE.Vector3().lerpVectors(
      pointA,
      pointB,
      Math.random()
    );

    // scatter on points
    const otherMesh =
      selected[Math.floor(selected.length * Math.random())].duplicate();

    otherMesh.removeFromParent();
    otherMesh.parent = "root";
    Outliner.root.push(otherMesh);

    const normal = normalOfTri(t0, t1, t2);

    const rotation = rotationFromDir(normal);
    otherMesh.rotation[0] = Math.radToDeg(rotation.x);
    otherMesh.rotation[1] = Math.radToDeg(rotation.y);
    otherMesh.rotation[2] = Math.radToDeg(rotation.z);

    otherMesh.origin = pointF.toArray();

    otherMesh.addTo(group);
    meshes.push(otherMesh);
  }
  Undo.finishEdit("MTools: Scatter meshes");
  Canvas.updatePositions();
}
export default action("scatter", function () {
  if (Mesh.selected.length < 2) {
    Blockbench.showQuickMessage("At least two meshes must be selected");
    return;
  }

  const mesh = Mesh.selected.last();
  mesh.unselect();

  const group = new Group({ name: "instances_on_" + mesh.name });
  group.init();

  runEdit(mesh, group, 3);

  Undo.amendEdit(
    {
      density: {
        type: "number",
        value: 3,
        label: "Density",
        min: 0,
        max: 100,
      },
    },
    (form) => {
      runEdit(mesh, group, form.density, true);
    }
  );
});
