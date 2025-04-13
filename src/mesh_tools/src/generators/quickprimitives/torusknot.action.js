import { action } from "../../actions.js";
import * as ThreeJSInteroperability from "../../utils/threejs_interoperability.js";

function runEdit(s, amended = false) {
  let elements = [];
  Undo.initEdit({ elements, selection: true }, amended);
  const geometry = new THREE.TorusKnotBufferGeometry(
    s.r,
    s.t,
    s.ts,
    s.rs,
    s.p,
    s.q
  );
  let mesh = ThreeJSInteroperability.indexed(geometry, true);

  mesh.init();
  elements.push(mesh);
  mesh.select();
  UVEditor.setAutoSize(null, true, Object.keys(mesh.faces));
  Undo.finishEdit("MTools: Generate Mesh");
}
const dialog = new Dialog({
  title: "Quick Primitive [ Torus Knot ]",
  lines: [
    `<p class="small_text subtle" style="display: inline;">P and Q should be coprime integers meaning non should be divisible by the other.</p>`,
  ],
  form: {
    r: { label: "Torus Radius", type: "number", value: 8 },
    t: { label: "Tube Radius", type: "number", value: 3.4, step: 0.2 },
    ts: { label: "Tubular Segments", type: "number", value: 25 },
    rs: { label: "Radial Segments", type: "number", value: 5 },
    p: { label: "P", type: "number", value: 2 },
    q: { label: "Q", type: "number", value: 3 },
  },
  onConfirm(out) {
    runEdit(out);
    let s = out;

    Undo.amendEdit(
      {
        r: { label: "Torus Radius", type: "number", value: s.r },
        t: {
          label: "Tube Radius",
          type: "number",
          value: s.t,
          step: 0.2,
        },
        ts: { label: "Tubular Segments", type: "number", value: s.ts },
        rs: { label: "Radial Segments", type: "number", value: s.rs },
        p: { label: "P", type: "number", value: s.p },
        q: { label: "Q", type: "number", value: s.q },
      },
      (form) => {
        runEdit(form, true);
      }
    );
  },
});
export default action("torusknot", () => {
  dialog.show();
});
