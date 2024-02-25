import { action } from "../actions.js";

/**
 *
 * @param {THREE.Vector3} offset _
 */
function runEdit(selected, offset = [1, 0, 0], count = 1, amend = false) {
  offset = offset.V3_toThree();

  const elements = [];
  Undo.initEdit({ elements, selection: true }, amend);
  selected.forEach((mesh) => {
    const bounding = new THREE.Vector3();
    mesh.mesh.geometry.boundingBox.getSize(bounding);

    for (let i = 0; i < count; i++) {
      const newMesh = mesh.duplicate();
      newMesh.moveVector(
        offset
          .clone()
          .multiplyScalar(i + 1)
          .multiply(bounding)
      );
      elements.push(newMesh);
    }
  });
  Undo.finishEdit("MTools: Array selected meshes");
}

export default action("array_elements", () => {
  const selected = Mesh.selected;
  selected.forEach((mesh) => {
    mesh.mesh.geometry.computeBoundingBox();
  });
  runEdit(selected);
  Undo.amendEdit(
    {
      // shameful vector input
      x: { type: "number", value: 1, label: "OffsetX", step: 0.1 },
      y: { type: "number", value: 0, label: "OffsetY", step: 0.1 },
      z: { type: "number", value: 0, label: "OffsetZ", step: 0.1 },
      count: {
        type: "number",
        value: 1,
        label: "Count",
        min: 0,
        max: 50,
      },
    },
    (form) => {
      runEdit(selected, [form.x, form.y, form.z], form.count, true);
    }
  );
});
