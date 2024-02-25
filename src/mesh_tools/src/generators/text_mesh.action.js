import _RobotoRegular from "../../assets/roboto_regular.json";
import { action } from "../actions.js";
import * as ThreeJSInteroperability from "../utils/threejs_interoperability.js";
import { utoa } from "../utils/utils.js";

// TODO FIXME
var RobotoRegular = JSON.stringify(_RobotoRegular);

function runEdit(text, font, s, amended = false) {
  let elements = [];
  Undo.initEdit({ elements, selection: true }, amended);
  const geometry = new THREE.TextGeometry(text, {
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
  let mesh = ThreeJSInteroperability.nonIndexed(geometry);

  mesh.init();
  elements.push(mesh);
  mesh.select();
  Undo.finishEdit("MTools: Generate Mesh");
}
const dialog = new Dialog({
  title: "Generate Text",
  lines: [
    `<style>
            #mt_typeface {
              display: flex;
              left: 20px;
              right: 0;
              gap: 5px;
              cursor: pointer;
            }
            #mt_typeface:hover {
              color: var(--color-light);
            }
            </style>`,
    //<i class="material-icons">spellcheck</i>
    `<a id="mt_typeface" class=""><span style="text-decoration: underline;">Go to TypeFace converter</span></a>`,
    `<p class="small_text subtle" style="display: inline;">when converting a font into a typeface font using the link above, make sure to disable "Reverse font direction".</p>`,
  ],
  form: {
    text: { label: "Text", type: "textarea", value: "Hello, World!" },
    file: {
      label: "OpenType Font (Optional)",
      type: "file",
      extensions: ["json"],
      filetype: "JSON",
      readtype: "text",
    },
    size: { label: "Size", type: "number", value: 8, min: 0 },
    height: { label: "Thickness", type: "number", value: 2, min: 0 },
    curveSegments: {
      label: "Resoultion",
      type: "number",
      value: 1,
      min: 0,
    },
    _: "_",
    bevelThickness: {
      label: "bevelThickness",
      type: "number",
      value: 0,
      min: 0,
    },
    bevelSize: { label: "bevelSize", type: "number", value: 8, min: 0 },
    bevelOffset: {
      label: "bevelOffset",
      type: "number",
      value: 0,
      min: 0,
    },
    bevelSegments: {
      label: "bevelSegments",
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
      content = this.form.file.content;
      if (!content.includes(`"glyphs"`)) {
        Blockbench.showQuickMessage("Not a valid OpenType font");
        throw new Error("Not a valid OpenType font");
      }
    }

    let base64 = "data:text/plain;base64," + utoa(content);
    const loader = new THREE.FontLoader();

    loader.load(base64, function (font) {
      runEdit(out.text, font, out);

      let s = out; // lazyness moment
      Undo.amendEdit(
        {
          size: {
            label: "Size",
            type: "number",
            value: s.size,
            min: 0,
          },
          height: {
            label: "Thickness",
            type: "number",
            value: s.height,
            min: 0,
          },
          curveSegments: {
            label: "Resoultion",
            type: "number",
            value: s.curveSegments,
            min: 0,
          },
          bevelThickness: {
            label: "bevelThickness",
            type: "number",
            value: s.bevelThickness,
            min: 0,
          },
          bevelSize: {
            label: "bevelSize",
            type: "number",
            value: s.bevelSize,
            min: 0,
          },
          bevelOffset: {
            label: "bevelOffset",
            type: "number",
            value: s.bevelOffset,
            min: 0,
          },
          bevelSegments: {
            label: "bevelSegments",
            type: "number",
            value: s.bevelSegments,
            min: 0,
          },
        },
        (form) => {
          runEdit(out.text, font, form, true);
        }
      );
    });
  },
});
export default action("textmesh", () => {
  dialog.show();
  $("#mt_typeface")[0].onclick = function () {
    Blockbench.openLink("http://gero3.github.io/facetype.js/");
  };
});
