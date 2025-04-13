import { action } from "../actions.js";

function runEdit(amend, influence = 100) {
  influence /= 100;
  Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);
  /* selected meshes */
  Mesh.selected.forEach((mesh) => {
    const center = [0, 0, 0];
    const selectedVertices = mesh.getSelectedVertices();
    const positions = [];
    const size = [0, 0, 0];
    selectedVertices.forEach((key) => {
      positions.push(mesh.vertices[key]);
      center.V3_add(mesh.vertices[key]);
    });
    center.V3_divide(selectedVertices.length);

    for (let i = 0; i < 3; i++) {
      positions.sort((a, b) => a[i] - b[i]);
      size[i] = positions.last()[i] - positions[0][i];
    }
    size.V3_divide(2);

    selectedVertices.forEach((key) => {
      const vertex = mesh.vertices[key];
      const spherePosition = vertex
        .V3_subtract(center)
        .V3_toThree()
        .normalize()
        .toArray()
        .V3_multiply(size)
        .V3_add(center)
        .V3_toThree();

      const finalPoint = vertex
        .V3_add(center)
        .V3_toThree()
        .lerp(spherePosition, influence)
        .toArray();
      mesh.vertices[key] = finalPoint;
    });
  });
  Undo.finishEdit("MTools: Spherize mesh selection");
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
}

export default action("to_sphere", () => {
  runEdit(false, 100);
  Undo.amendEdit(
    {
      influence: {
        type: "range",
        value: 100,
        label: "Influence",
        min: 0,
        max: 100,
      },
    },
    (form) => {
      runEdit(true, form.influence);
    }
  );
});
