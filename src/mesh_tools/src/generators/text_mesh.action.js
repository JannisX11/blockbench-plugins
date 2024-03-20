import RobotoRegular from "../../assets/roboto_regular.json";
import { action } from "../actions.js";
import { convertOpenTypeBufferToThreeJS } from "../utils/facetype.js";
import * as ThreeJSInteroperability from "../utils/threejs_interoperability.js";
import { throwQuickMessage } from "../utils/utils.js";

function runEdit(text, font, s, amended = false) {
  let elements = [];
  Undo.initEdit({ elements, selection: true }, amended);
  let geometry;
  try {
    geometry = new THREE.TextGeometry(text, {
      font: font,
      size: s.size,
      height: s.height,
      curveSegments: s.curveSegments,
      bevelEnabled: s.bevelThickness > 0,
      bevelThickness: s.bevelThickness / 16,
      bevelSize: s.bevelSize / 16,
      bevelOffset: s.bevelOffset / 16,
      bevelSegments: s.bevelSegments,
    });
  } catch (error) {
    Blockbench.showQuickMessage("Invalid OpenType font!");
    throw error;
  }
  let mesh = ThreeJSInteroperability.nonIndexed(geometry);

  mesh.init();
  elements.push(mesh);
  mesh.select();
  Undo.finishEdit("MTools: Generate Mesh");
}
const dialog = new Dialog({
  title: "Generate Text",
  form: {
    text: { label: "Text", type: "textarea", value: "Hello, World!" },
    file: {
      label: "OpenType Font (Optional)",
      type: "file",
      extensions: ["ttf", "otf", "woff", "woff2"],
      placeholder: "Roboto Regular",
      filetype: "Font",
      readtype: "buffer",
    },
    size: { label: "Size", type: "number", value: 8, min: 0 },
    height: { label: "Thickness", type: "number", value: 2, min: 0 },
    curveSegments: {
      label: "Resolution",
      type: "number",
      value: 1,
      min: 1,
    },
    _: "_",
    bevelThickness: {
      label: "Bevel Thickness",
      type: "number",
      value: 0,
      min: 0,
    },
    bevelSize: { label: "Bevel Size", type: "number", value: 8, min: 0 },
    bevelOffset: {
      label: "Bevel Offset",
      type: "number",
      value: 0,
      min: 0,
    },
    bevelSegments: {
      label: "Bevel Segments",
      type: "number",
      value: 1,
      min: 0,
    },
  },
  onConfirm(out) {
    let content;
    if (!out.file) {
      content = RobotoRegular;
    } else {
      try {
        content = convertOpenTypeBufferToThreeJS(this.form.file.content);
      } catch (err) {
        Blockbench.showQuickMessage("Invalid OpenType font!");
        throw err;
      }
    }
    for (const char of out.text) {
      if (!(char in content.glyphs)) {
        throwQuickMessage(
          `Character "${char}" doesn't exist on the provided font!`,
          2000
        );
      }
    }
    const font = new THREE.Font(content);
    runEdit(out.text, font, out);

    Undo.amendEdit(
      {
        size: {
          label: "Size",
          type: "number",
          value: out.size,
          min: 0,
        },
        height: {
          label: "Thickness",
          type: "number",
          value: out.height,
          min: 0,
        },
        curveSegments: {
          label: "Resolution",
          type: "number",
          value: out.curveSegments,
          min: 1,
        },
        bevelThickness: {
          label: "Bevel Thickness",
          type: "number",
          value: out.bevelThickness,
          min: 0,
        },
        bevelSize: {
          label: "Bevel Size",
          type: "number",
          value: out.bevelSize,
          min: 0,
        },
        bevelOffset: {
          label: "Bevel Offset",
          type: "number",
          value: out.bevelOffset,
          min: 0,
        },
        bevelSegments: {
          label: "Bevel Segments",
          type: "number",
          value: out.bevelSegments,
          min: 0,
        },
      },
      (form) => {
        runEdit(out.text, font, form, true);
      }
    );
  },
});
export default action("textmesh", () => {
  dialog.show();
});
