import { action } from "../../actions.js";
import * as ThreeJSInteroperability from "../../utils/threejs_interoperability.js";

function runEdit(selected, s, amended = false) {
  let elements = [];
  Undo.initEdit({ elements, selection: true }, amended);
  const geometry = new THREE[selected + "BufferGeometry"](
    s.radius,
    s.detail - 1
  );
  let mesh = ThreeJSInteroperability.nonIndexed(geometry);

  mesh.init();
  elements.push(mesh);
  mesh.select();
  UVEditor.setAutoSize(null, true, Object.keys(mesh.faces));
  UVEditor.selected_faces.empty();
  Undo.finishEdit("MTools: Generate Mesh");
}
const dialog = new Dialog({
  title: "Quick Primitive [ Polyhedron ]",
  form: {
    select: {
      label: "Hedron",
      type: "select",
      options: {
        Icosahedron: "Icosahedron",
        Dodecahedron: "Dodecahedron",
        Octahedron: "Octahedron",
        Tetrahedron: "Tetrahedron",
      },
    },
    radius: { label: "Radius", value: 8, type: "number" },
    detail: {
      label: "Detail",
      value: 2,
      min: 1,
      max: 6,
      type: "number",
    },
  },
  onConfirm(out) {
    runEdit(out.select, out);
    Undo.amendEdit(
      {
        radius: { label: "Radius", value: out.radius },
        detail: { label: "Detail", value: out.detail, min: 1, max: 6 },
      },
      (form) => {
        runEdit(out.select, form, true);
      }
    );
  },
});
export default action("polyhedron", () => {
  dialog.show();
});
