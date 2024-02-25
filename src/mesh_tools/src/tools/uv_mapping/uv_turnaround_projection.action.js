import { action } from "../../actions.js";
import { getEqualRes } from "../../utils/utils.js";

function runEdit(margin, split, amend) {
  /* selected meshes */
  Undo.initEdit(
    {
      elements: Mesh.selected,
      selection: true,
      uv_only: true,
      uv_mode: true,
    },
    amend
  );
  Mesh.selected.forEach((mesh) => {
    if (mesh.getSelectedFaces().length) {
      let positions = [];
      let selectionBound = { min: [0, 0, 0], max: [0, 0, 0] };
      let gatheredDirs = {
        "1,0,0": [],
        "-1,0,0": [],
        "0,1,0": [],
        "0,-1,0": [],
        "0,0,1": [],
        "0,0,-1": [],
      };
      /* selected faces */
      mesh.getSelectedFaces().forEach((key) => {
        let face = mesh.faces[key];
        let normal = face.getNormal(true);
        face.vertices.forEach((Vkey) => {
          positions.push(mesh.vertices[Vkey]);
        });
        // choose its direction
        let d0 = normal[0];
        let d1 = normal[1];
        let d2 = normal[2];
        let finalDir = [0, 0, 0];
        /* chooses the furthest from 0 ( there should be one )*/
        let furthest = Math.max(
          Math.abs(normal[0]),
          Math.abs(normal[1]),
          Math.abs(normal[2])
        );
        if (furthest == d0 * Math.sign(normal[0])) {
          finalDir = [Math.sign(d0), 0, 0];
        } else if (furthest == d1 * Math.sign(normal[1])) {
          finalDir = [0, Math.sign(d1), 0];
        } else if (furthest == d2 * Math.sign(normal[2])) {
          finalDir = [0, 0, Math.sign(d2)];
        }

        if (face.vertices.length >= 3) {
          gatheredDirs[finalDir.toString()].push(key);
        }
      });
      for (let i = 0; i < 3; i++) {
        positions.sort((a, b) => b[i] - a[i]);
        selectionBound.max[i] = positions[0][i] + 0.0001;
        selectionBound.min[i] = positions.last()[i] - positions[0][i] + 0.0001;
      }
      let x = 0;
      let S_res = getEqualRes();
      let _margin = 1 - margin / 100;
      for (const key in gatheredDirs) {
        x++;
        gatheredDirs[key].forEach((Fkey) => {
          let face = mesh.faces[Fkey];
          let I = key.replace("-", "").replaceAll(",", "");
          I = I == "100" ? [2, 1] : I == "010" ? [0, 2] : [0, 1];
          face.vertices.forEach((Vkey) => {
            let uv = [
              ((selectionBound.max[I[0]] - mesh.vertices[Vkey][I[0]] + 0.0001) *
                _margin) /
                -selectionBound.min[I[0]],
              ((selectionBound.max[I[1]] - mesh.vertices[Vkey][I[1]] + 0.0001) *
                _margin) /
                -selectionBound.min[I[1]],
            ];
            if (split) {
              // work with normalised values
              uv[0] *= 0.33;
              uv[1] *= 0.33;
              // remove the safety number
              uv[0] -= 0.0001;
              uv[1] -= 0.0001;

              uv[0] += (x % 3) * 0.33;
              uv[1] += x > 3 ? 0.33 : 0;
            }

            // scale to project res
            uv[0] *= S_res;
            uv[1] *= S_res;

            mesh.faces[Fkey].uv[Vkey] = uv;
          });
        });
      }
    }
  });
  Undo.finishEdit("MTools: Unwrap mesh face selection (cubic projection)", {
    uv_only: true,
    uv_mode: true,
  });
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
  updateSelection();
}
export default action("uv_turnaround_projection", () => {
  runEdit(0.1, true, false);
  Undo.amendEdit(
    {
      margin: {
        type: "number",
        value: 0,
        label: "margin",
        min: 0,
        max: 100,
      },
      split: { type: "number", label: "Split", value: 1, min: 0, max: 1 },
    },
    (form) => {
      runEdit(form.margin, form.split, true);
    }
  );
});
