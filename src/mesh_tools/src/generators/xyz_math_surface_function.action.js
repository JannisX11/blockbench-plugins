import xyzpresets from "../../assets/xyz_presets.jsonc";
import { action } from "../actions.js";
import { Parser } from "expr-eval";
import { freezeProperty } from "../utils/utils.js";
const mathParser = new Parser({
  allowMemberAccess: true,
});
mathParser.consts = {
  E: Math.E,
  e: Math.E,
  PI: Math.PI,
  pi: Math.PI,
};

export default action("xyzmathsurfacefunction", () => {
  let options = {};
  for (const key in xyzpresets) {
    options[key] = key;
  }
  let msettings = localStorage.getItem("mt_xyzSettings");
  let presetBeforeUpdate;
  if (msettings != null) {
    msettings = JSON.parse(msettings);
    presetBeforeUpdate = msettings.preset;
  } else {
    msettings = xyzpresets.TwistedTorus;
    presetBeforeUpdate = "TwistedTorus";
  }
  let justOpened = true;
  let dial = new Dialog({
    title: "XYZ Math Surface Function",
    part_order: ["form", "lines"],
    buttons: ["Save Settings To Memory", "Confirm", "Cancel"],
    cancelIndex: 2,
    confirmIndex: 1,
    width: 650,
    onFormChange(data) {
      if (justOpened) {
        // this just for skipping loading saved settings
        justOpened = false;
        return;
      }
      if (data.preset == presetBeforeUpdate) return; // stop call stack
      presetBeforeUpdate = data.preset;

      this.setFormValues(xyzpresets[data.preset]);
    },
    form: {
      preset: { label: "Preset", type: "select", options: () => options },
      x: {
        label: "X",
        type: "text",
        value: xyzpresets["TwistedTorus"].x,
      },
      y: {
        label: "Y",
        type: "text",
        value: xyzpresets["TwistedTorus"].y,
      },
      z: {
        label: "Z",
        type: "text",
        value: xyzpresets["TwistedTorus"].z,
      },
      scale: { label: "Scale", type: "number", value: 1 },
      _: "_",
      uRange: {
        label: "U Range",
        type: "vector",
        dimensions: 2,
        value: [0, 6.2831854820251465],
      },
      uDivs: { label: "U Divisions", type: "number", min: 2, value: 32 },
      uWrap: { label: "U Wrap", type: "checkbox", value: true },
      vRange: {
        label: "V Range",
        type: "vector",
        dimensions: 2,
        value: [0, 6.2831854820251465],
      },
      vDivs: { label: "V Divisions", type: "number", min: 2, value: 16 },
      vWrap: { label: "V Wrap", type: "checkbox", value: true },
      vClose: { label: "V Close", type: "checkbox", value: true },
      __: "_",
      variables: {
        label: "Variables",
        type: "textarea",
        placeholder: "List the variables you want to use via name = value",
      },
    },
    onConfirm(out) {
      const declarations = out.variables.split(`\n`);
      const declarationsMap = {};
      for (const declaration of declarations) {
        let [key, val] = declaration.split(/=(.+)/);
        key = key.replace(/[\s;]/g, "");

        if (val !== undefined) {
          val = val.trim();
          declarationsMap[key] = val;
        }
      }

      function runEdit(s, amended = false) {
        let elements = [];
        Undo.initEdit({ elements, selection: true }, amended);
        let mesh = new Mesh({ vertices: {} });

        let [umin, umax] = out.uRange;
        let usteps = s.uDivs;
        let uinc = (umax - umin) / usteps;

        let [vmin, vmax] = out.vRange;
        let vsteps = s.vDivs;
        let vinc = (vmax - vmin) / vsteps;

        let uRange = usteps + 1;
        let vRange = vsteps + 1;
        if (out.uWrap) uRange -= 1;
        if (out.vWrap) vRange -= 1;

        let vertices = [];
        let uvPositions = [];
        for (let j = 0; j < vRange; j++) {
          let v = vmin + j * vinc;
          for (let i = 0; i < uRange; i++) {
            let u = umin + i * uinc;

            const context = {
              u,
              v,
              /**
               * Backwards compatibility for p.u and p.v
               */
              p: { u, v },
            };
            // Disable overwriting
            freezeProperty(context, "u");
            freezeProperty(context, "v");
            freezeProperty(context, "p");
            freezeProperty(context.p, "u");
            freezeProperty(context.p, "v");

            for (const key in declarationsMap) {
              const rawValue = declarationsMap[key];
              context[key] = mathParser.evaluate(rawValue, context);
            }

            let x = +mathParser.evaluate(out.x, context) * out.scale;
            let y = +mathParser.evaluate(out.y, context) * out.scale;
            let z = +mathParser.evaluate(out.z, context) * out.scale;
            if (isNaN(x) || Math.abs(x) === Infinity) {
              x = 0;
            }
            if (isNaN(y) || Math.abs(y) === Infinity) {
              y = 0;
            }
            if (isNaN(z) || Math.abs(z) === Infinity) {
              z = 0;
            }

            vertices.push(mesh.addVertices([x, y, z])[0]);
            uvPositions.push([i, j]);
          }
        }
        for (let y = 0; y < vsteps; y++) {
          for (let x = 0; x < usteps; x++) {
            let yNext = y + 1;
            let xNext = x + 1;

            if (out.vWrap && yNext >= vRange) yNext = 0;
            if (out.uWrap && xNext >= uRange) xNext = 0;

            let vertexIndices = [
              yNext * uRange + xNext,
              yNext * uRange + x,
              y * uRange + x,
              y * uRange + xNext,
            ];
            let face = new MeshFace(mesh, {
              vertices: [
                vertices[vertexIndices[0]],
                vertices[vertexIndices[1]],
                vertices[vertexIndices[2]],
                vertices[vertexIndices[3]],
              ],
            });
            let uv = [
              uvPositions[vertexIndices[0]]
                .slice()
                .V3_divide(uRange - 1, vRange - 1)
                .V3_multiply(Project._texture_width, Project._texture_height),
              uvPositions[vertexIndices[1]]
                .slice()
                .V3_divide(uRange - 1, vRange - 1)
                .V3_multiply(Project._texture_width, Project._texture_height),
              uvPositions[vertexIndices[2]]
                .slice()
                .V3_divide(uRange - 1, vRange - 1)
                .V3_multiply(Project._texture_width, Project._texture_height),
              uvPositions[vertexIndices[3]]
                .slice()
                .V3_divide(uRange - 1, vRange - 1)
                .V3_multiply(Project._texture_width, Project._texture_height),
            ];
            face.uv[face.vertices[0]] = [uv[0][0], uv[0][1]];
            face.uv[face.vertices[1]] = [uv[1][0], uv[1][1]];
            face.uv[face.vertices[2]] = [uv[2][0], uv[2][1]];
            face.uv[face.vertices[3]] = [uv[3][0], uv[3][1]];
            mesh.addFaces(face);
          }
        }
        // fills end caps
        if (out.vClose && out.uWrap && !out.vWrap) {
          for (let x = 1; x < usteps - 1; x++) {
            let face1 = new MeshFace(mesh, {
              vertices: [
                vertices[usteps - 1],
                vertices[usteps - 1 - x],
                vertices[usteps - 2 - x],
              ],
            });
            let face2 = new MeshFace(mesh, {
              vertices: [
                vertices[vsteps * uRange],
                vertices[vsteps * uRange + x],
                vertices[vsteps * uRange + x + 1],
              ],
            });
            mesh.addFaces(face1, face2);
          }
        }
        mesh.init();
        elements.push(mesh);
        mesh.select();
        Undo.finishEdit("MTools: Generate Mesh");
      }
      runEdit(out);
      Undo.amendEdit(
        {
          uDivs: { label: "U divisions", value: out.uDivs, min: 2 },
          vDivs: { label: "V divisions", value: out.vDivs, min: 2 },
        },
        (form) => {
          runEdit(form, true);
        }
      );
    },
  });
  dial.show();
  if (msettings != null) {
    dial.setFormValues(msettings);
  }

  let saveBtn = $(`button:contains("Save Settings To Memory")`);
  saveBtn.off("click");
  saveBtn.on("click", function () {
    let mmsettings = dial.getFormResult();
    localStorage.setItem("mt_xyzSettings", JSON.stringify(mmsettings));
  });
});
