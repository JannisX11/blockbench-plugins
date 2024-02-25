import xyzpresets from '../../assets/xyz_presets.jsonc';
import { action } from "../actions.js";
let mtMolangParser;
let currentMTVariablesTextContent = "";
let molangScript = $('script[src="lib/molang.umd.js"]')[0];
//https://stackoverflow.com/questions/148441/how-can-i-get-the-content-of-the-file-specified-as-the-src-of-a-script-tag
function printScriptTextContent(script, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", script.src);
  xhr.onreadystatechange = (_) => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
      cb(xhr.responseText);
  };
  xhr.send();
}
// this is so stupid
// just an add-in of more functions
printScriptTextContent(molangScript, function (f) {
  eval(
    f
      .replace("Molang", "_Molang_")
      .replace(
        `case"random_integer":return new u(125,s[0],s[1],s[2])`,
        `case"random_integer":return new u(125,s[0],s[1],s[2]);case 'acosh':return new u(126, s[0]);case 'asinh':return new u(127, s[0]);case 'atanh':return new u(128, s[0]);case 'cosh':return new u(129, s[0]);case 'sinh':return new u(130, s[0]);case 'tan':return new u(131, s[0]);case'tanh':return new u(132, s[0])`
      )
      .replace(
        "case 125:return r.randomInt(v(n.a),v(n.b))",
        "case 125:return r.randomInt(v(n.a),v(n.b));case 126:return Math.acosh(v(n.a));case 127:return Math.asinh(v(n.a));case 128:return Math.atanh(v(n.a));case 129:return Math.cosh(v(n.a));case 130:return Math.sinh(v(n.a));case 131:return Math.tan(v(n.a));case 132:return Math.tanh(v(n.a))"
      )
  );
  mtMolangParser = new _Molang_();
  mtMolangParser.use_radians = true;

  // stolen from Animator.MolangParser.variableHandler;
  mtMolangParser.variableHandler = function (variable) {
    var inputs = currentMTVariablesTextContent.split(`\n`);
    var i = 0;
    while (i < inputs.length) {
      let key, val;
      [key, val] = inputs[i].split(/=(.+)/);
      key = key.replace(/[\s;]/g, "");
      if (key === variable && val !== undefined) {
        val = val.trim();
        return val[0] == `'` ? val : mtMolangParser.parse(val);
      }
      i++;
    }
  };
});
const mathFuncs = [
  "abs",
  "acos",
  "asin",
  "atan",
  "atan2",
  "ceil",
  "clamp",
  "cos",
  "die_roll",
  "die_roll_integer",
  "exp",
  "floor",
  "hermite_blend",
  "lerp",
  "lerprotate",
  "ln",
  "max",
  "min",
  "min_angle",
  "mod",
  "pi",
  "pow",
  "random",
  "random_integer",
  "round",
  "sin",
  "sqrt",
  "trunc",
  "acosh",
  "asinh",
  "atanh",
  "cosh",
  "sinh",
  "tan",
  "tanh",
];
function mtParse(string) {
  mathFuncs.forEach((f) => {
    if (f == "pi") string = string.replaceAll(f, "math." + f);
    else string = string.replaceAll(f + "(", "math." + f + "(");
  });
  return string.replaceAll("amath.", "a");
}

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
      out.x = mtParse(out.x);
      out.y = mtParse(out.y);
      out.z = mtParse(out.z);
      currentMTVariablesTextContent = mtParse(out.variables);
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

            mtMolangParser.global_variables = { "p.u": u, "p.v": v };

            let x = mtMolangParser.parse(out.x) * out.scale;
            let y = mtMolangParser.parse(out.y) * out.scale;
            let z = mtMolangParser.parse(out.z) * out.scale;
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
